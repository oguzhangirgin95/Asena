import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// IMPORTANT:
// When the Angular app makes HttpClient calls to relative `/api/...` URLs during SSR,
// those requests hit THIS same Express server.
// If we don't intercept them, Angular SSR will try to render `/api/...` as an Angular route,
// causing recursive SSR rendering and an infinite loop (page request never completes).
//
// Mirror the dev-server proxy (apps/crm/proxy.conf.json): default backend is localhost:8080.
const apiProxyTarget = process.env['ASENA_API_PROXY_TARGET'] ?? 'http://localhost:8080';
app.use('/api', async (req, res) => {
  try {
    const url = new URL(req.originalUrl, apiProxyTarget);

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (!value) continue;
      if (key.toLowerCase() === 'host') continue;
      headers[key] = Array.isArray(value) ? value.join(',') : String(value);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const proxied = await fetch(url, {
      method: req.method,
      headers,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    res.status(proxied.status);
    proxied.headers.forEach((v, k) => {
      // Avoid transfer-encoding issues when sending a buffered body.
      if (k.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(k, v);
    });

    const body = Buffer.from(await proxied.arrayBuffer());
    res.send(body);
  } catch {
    res.status(502).json({ error: 'API proxy failed', target: apiProxyTarget });
  }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

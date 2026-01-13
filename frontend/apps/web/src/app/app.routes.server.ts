import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // SSR mode: render per-request on the server.
    renderMode: RenderMode.Server,
  },
];

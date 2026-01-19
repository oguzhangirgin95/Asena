import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '@frontend/shared';

@Component({
  imports: [RouterLink],
  selector: 'app-crm-home',
  templateUrl: './crm-home.component.html',
  styleUrl: './crm-home.component.scss',
})
export class CrmHomeComponent extends BaseComponent {
  override ngOnInit(): void {
    // CRM app is intentionally lightweight and does not bootstrap the shared flow/auth stack.
    // We only use BaseComponent's SharedState + cross-app messaging helpers here.
  }

  private createSessionId(): string {
    try {
      if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return (crypto as Crypto).randomUUID();
      }
    } catch {
      // ignore
    }

    const rand = () => Math.random().toString(16).slice(2);
    return `${Date.now().toString(16)}-${rand()}-${rand()}`;
  }

  openWebLogin(): void {
    if (!this.isBrowser) return;

    // Unique per CRM tab. Stored in in-memory SharedState (per-tab Angular runtime).
    const existingSessionId = this.SharedState.crossAppSessionId;
    const sessionId = existingSessionId ? String(existingSessionId) : this.createSessionId();
    this.SharedState.crossAppSessionId = sessionId;
    this.SharedState.crmOrigin = window.location.origin;

    const message = `CRM state Ogizan Kenobi @ ${new Date().toISOString()}`;
    this.SharedState.crmMessage = message;

    // Simple dev default: web app serve-static runs on :4200
    const targetOrigin = `${window.location.protocol}//${window.location.hostname}:4200`;
    const loginUrl = `${targetOrigin}/authentication/login/start`;

    // Do not bind postMessage to a single origin in dev.
    // This avoids localhost vs 127.0.0.1 mismatches and keeps the existing URL-based navigation intact.
    const postMessageTargetOrigin = '*';

    const popup = window.open(loginUrl, '_blank');

    // Send a few times to cover load timing.
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      this.sendCrossAppState(popup, 'crossAppSessionId', this.SharedState.crossAppSessionId, postMessageTargetOrigin);
      this.sendCrossAppState(popup, 'crmOrigin', this.SharedState.crmOrigin, postMessageTargetOrigin);
      this.sendCrossAppState(popup, 'crmMessage', this.SharedState.crmMessage, postMessageTargetOrigin);

      // Give WEB more time to boot/hydrate.
      if (attempts >= 60 || popup?.closed) {
        window.clearInterval(timer);
      }
    }, 200);
  }
}

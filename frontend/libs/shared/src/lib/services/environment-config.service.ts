import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseAppService } from '../base/base.service';

export type AsenaEnvironmentName = 'local' | 'dev' | 'test' | 'prod' | string;

export interface AsenaEnvironmentConfig {
  environment: AsenaEnvironmentName;
  frontend?: {
    baseUrl?: string;
  };
  backend?: {
    baseUrl?: string;
  };
  api?: {
    /**
     * Base path used by the generated OpenAPI client.
     * - local dev (with Angular proxy): ""
     * - direct backend calls: "http://localhost:8080"
     */
    basePath?: string;
  };
  cors?: {
    allowedOrigins?: string[];
  };
  security?: {
    jwt?: {
      expirationMs?: number;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class EnvironmentConfigService extends BaseAppService {
  private config: AsenaEnvironmentConfig | null = null;

  constructor(private readonly http: HttpClient) {
    super();
  }

  async load(): Promise<void> {
    if (this.config) return;

    // Cache-bust for dev reloads; harmless in prod.
    const url = `/environment.json?v=${Date.now()}`;
    this.config = await firstValueFrom(this.http.get<AsenaEnvironmentConfig>(url));
  }

  get(): AsenaEnvironmentConfig {
    if (!this.config) {
      throw new Error('EnvironmentConfigService not loaded. Make sure APP_INITIALIZER calls load().');
    }
    return this.config;
  }

  getApiBasePath(): string {
    return this.get().api?.basePath ?? '';
  }
}

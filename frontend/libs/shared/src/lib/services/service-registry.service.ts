/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Type, APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { APIS } from '../api/index';

@Injectable({
  providedIn: 'root'
})
export class ServiceRegistry {
  private services = new Map<string, Type<any>>();

  register(name: string, service: Type<any>) {
    this.services.set(name, service);
  }

  get(name: string): Type<any> | undefined {
    const service = this.services.get(name);
    if (!service) {
      console.warn(`ServiceRegistry: Service '${name}' not found.`);
      console.warn(`Available services: ${Array.from(this.services.keys()).join(', ')}`);
    }
    return service;
  }
}

export function initializeServiceRegistry(registry: ServiceRegistry) {
  return () => {
    console.log('Initializing Service Registry');
    APIS.forEach(api => {
      console.log(`Registering service: ${api.name}`);
      registry.register(api.name, api);
    });
  };
}

export function provideServiceRegistry(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: initializeServiceRegistry,
      deps: [ServiceRegistry],
      multi: true
    }
  ]);
}

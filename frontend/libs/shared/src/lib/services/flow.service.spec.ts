import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FlowService } from './flow.service';
import { ValidationService } from './validation.service';
import { ServiceRegistry } from './service-registry.service';
import { ResourceService } from './resource.service';
import { TRANSACTION_PATH_MAP } from '../tokens/transaction-paths.token';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('FlowService', () => {
  let service: FlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FlowService,
        {
          provide: Router,
          useValue: {
            url: '/',
            routerState: { snapshot: { root: { firstChild: undefined } } },
            parseUrl: () => ({ root: { children: { primary: { segments: [] } } } }),
            navigateByUrl: () => Promise.resolve(true),
          },
        },
        { provide: Location, useValue: {} },
        {
          provide: ValidationService,
          useValue: {
            setRules: () => undefined,
            Validate: () => true,
            registerValidation: () => undefined,
          },
        },
        { provide: ServiceRegistry, useValue: { get: () => undefined } },
        {
          provide: ResourceService,
          useValue: {
            currentTransactionName: { set: () => undefined },
            ensureTransactionLoaded: () => Promise.resolve({}),
          },
        },
        { provide: TRANSACTION_PATH_MAP, useValue: {} },
      ],
    });
    service = TestBed.inject(FlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get value', () => {
    service.set('testKey', 'testValue');
    expect(service.get<string>('testKey')).toBe('testValue');
  });

  it('should clear state', () => {
    service.set('key', 'value');
    service.clear();
    expect(service.get('key')).toBeUndefined();
  });
});

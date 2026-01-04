import { TestBed } from '@angular/core/testing';
import { FlowService } from './flow.service';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('FlowService', () => {
  let service: FlowService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get value', () => {
    service.set('testKey', 'testValue');
    expect(service.get<string>('testKey')).toBe('testValue');
  });

  it('should persist state to sessionStorage', () => {
    service.set('persistKey', 'persistValue');
    const stored = sessionStorage.getItem('flow_state');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)['persistKey']).toBe('persistValue');
  });

  it('should load state from sessionStorage on init', () => {
    sessionStorage.setItem('flow_state', JSON.stringify({ loadedKey: 'loadedValue' }));
    const newService = new FlowService();
    expect(newService.get<string>('loadedKey')).toBe('loadedValue');
  });

  it('should clear state', () => {
    service.set('key', 'value');
    service.clear();
    expect(service.get('key')).toBeUndefined();
    expect(sessionStorage.getItem('flow_state')).toBeNull();
  });
});

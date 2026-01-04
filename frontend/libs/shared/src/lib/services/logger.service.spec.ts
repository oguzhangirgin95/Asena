import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { vi } from 'vitest';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log messages', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    service.log('test message');
    expect(consoleSpy).toHaveBeenCalledWith('[LOG]: test message');
  });

  it('should warn messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    service.warn('test warning');
    expect(consoleSpy).toHaveBeenCalledWith('[WARN]: test warning');
  });

  it('should error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    service.error('test error');
    expect(consoleSpy).toHaveBeenCalledWith('[ERROR]: test error');
  });
});

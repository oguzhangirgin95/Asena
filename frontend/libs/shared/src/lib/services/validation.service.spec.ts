// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { ValidationService } from './validation.service';

class MockResourceService {
  private dict: Record<string, string> = {
    VALIDATION_REQUIRED: 'This field is required.',
    VALIDATION_INVALID_FORMAT: 'Invalid format.'
  };

  getMessage(keyOrKeyWithFallback: string): string {
    const raw = (keyOrKeyWithFallback ?? '').toString();
    const idx = raw.indexOf('|');
    if (idx !== -1) {
      const fallback = raw.slice(idx + 1).trim();
      return fallback || raw;
    }
    return this.dict[raw] ?? raw;
  }

  get(keyOrKeyWithFallback: string): string {
    return this.getMessage(keyOrKeyWithFallback);
  }
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService(new MockResourceService() as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate required field', () => {
    expect(service.validate('', 'sampleField')).toBe('This field is required.');
    expect(service.validate(null, 'sampleField')).toBe('This field is required.');
    expect(service.validate(undefined, 'sampleField')).toBe('This field is required.');
    expect(service.validate('valid', 'sampleField')).toBeNull();
  });

  it('should validate regex field', () => {
    expect(service.validate('123', 'sampleField')).toBe('Invalid format.');
    expect(service.validate('abc', 'sampleField')).toBeNull();
  });

  it('should validate email regex', () => {
    expect(service.validate('invalid-email', 'email')).toBe('Invalid format.');
    expect(service.validate('test@example.com', 'email')).toBeNull();
  });

  it('should handle unknown rule', () => {
    expect(service.validate('any value', 'unknownRule')).toBeNull();
  });

  it('should run customValidation per rule and show configured message', () => {
    document.body.innerHTML = `<div><input id="username" value="admin" /></div>`;

    service.setRules([
      {
        id: 'username',
        validatorType: '',
        customValidation: (value) => {
          if (value === null || value === undefined || value === '') return true;
          return !(typeof value === 'string' && value.toLowerCase() === 'admin');
        },
        validationMessage: 'VALIDATION_CUSTOM | Username cannot be "admin"'
      }
    ]);

    const ok = service.Validate();
    expect(ok).toBe(false);

    const input = document.getElementById('username') as HTMLInputElement;
    expect(input.classList.contains('error')).toBe(true);
    const msg = input.nextElementSibling as HTMLElement;
    expect(msg).toBeTruthy();
    expect(msg.classList.contains('validation-message')).toBe(true);
    expect(msg.textContent).toContain('Username cannot be "admin"');
  });

  it('should not clear a required error when a subsequent customValidation passes for the same element', () => {
    document.body.innerHTML = `<div><input id="username" value="" /></div>`;

    service.setRules([
      {
        id: 'username',
        validatorType: 'ValidatorEnum.Required',
        validationMessage: 'VALIDATION_REQUIRED | Username is required'
      },
      {
        id: 'username',
        validatorType: '',
        customValidation: () => true,
        validationMessage: 'VALIDATION_CUSTOM | Username cannot be "admin"'
      }
    ]);

    const ok = service.Validate();
    expect(ok).toBe(false);

    const input = document.getElementById('username') as HTMLInputElement;
    const msg = input.nextElementSibling as HTMLElement;
    expect(msg.textContent).toContain('Username is required');
  });
});

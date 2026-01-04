import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
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
});

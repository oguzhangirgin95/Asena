import { BaseAppService } from './base.service';

// Import-time SSR protection: ensures browser globals are shimmed before any other
// shared exports or 3rd-party code paths run during module evaluation.
BaseAppService.ensureSsrCompat();

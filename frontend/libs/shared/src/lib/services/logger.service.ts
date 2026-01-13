import { Injectable } from '@angular/core';
import { BaseAppService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService extends BaseAppService {

  log(message: string, ...args: any[]): void {
    console.log(`[LOG]: ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN]: ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[ERROR]: ${message}`, ...args);
  }
}

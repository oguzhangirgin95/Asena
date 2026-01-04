import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

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

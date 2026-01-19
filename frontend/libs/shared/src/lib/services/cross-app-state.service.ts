import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CrossAppStateValue = unknown;

@Injectable({
  providedIn: 'root'
})
export class CrossAppStateService {
  private readonly state = new Map<string, CrossAppStateValue>();
  private readonly state$ = new BehaviorSubject<Record<string, CrossAppStateValue>>({});

  /** Snapshot getter (non-reactive). */
  get<T = CrossAppStateValue>(key: string): T | undefined {
    return this.state.get(key) as T | undefined;
  }

  /** Snapshot setter. */
  set(key: string, value: CrossAppStateValue): void {
    this.state.set(key, value);
    this.emit();
  }

  /** Subscribe to whole-map updates (simple + app-agnostic). */
  changes() {
    return this.state$.asObservable();
  }

  private emit(): void {
    this.state$.next(Object.fromEntries(this.state.entries()));
  }
}

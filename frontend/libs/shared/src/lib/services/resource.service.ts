import { Injectable, signal } from '@angular/core';
import { ResourceControllerService } from '../api';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ResourceItemDto } from '../api/model/resource-item-dto';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private generalResources = signal<Record<string, string>>({});
  private transactionResources = signal<Record<string, string>>({});
  public currentLanguage = signal<string>('tr');
  public currentTransactionName = signal<string>('general');
  private generalLoadedForLang?: string;
  private txLoadedFor?: { lang: string; tx: string };

  private inFlight?: Promise<Record<string, string>>;
  private inFlightLang?: string;
  private txInFlight?: Promise<Record<string, string>>;
  private txInFlightKey?: string;

  constructor(private resourceApi: ResourceControllerService) {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.currentLanguage.set(savedLang);
    }
  }

  /** Loads application-wide resources (transactionName = 'general'). */
  loadGeneralResources(languageCode?: string): Observable<Record<string, string>> {
    const lang = languageCode || this.currentLanguage();
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);

    return this.resourceApi.getResourcesByTransaction(lang, 'general').pipe(
      map((items) => {
        const mapped = this.toMap(items);
        this.generalResources.set(mapped);
        this.generalLoadedForLang = lang;
        return mapped;
      }),
      catchError((err) => {
        console.error('ResourceService.loadGeneralResources failed', { lang, err });
        return of(this.generalResources());
      })
    );
  }

  /** Loads resources for a specific transaction. */
  loadTransactionResources(transactionName: string, languageCode?: string): Observable<Record<string, string>> {
    const lang = languageCode || this.currentLanguage();
    const tx = (transactionName ?? '').toString().trim() || 'general';

    this.currentTransactionName.set(tx);
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);

    return this.resourceApi.getResourcesByTransaction(lang, tx).pipe(
      map((items) => {
        const mapped = this.toMap(items);
        this.transactionResources.set(mapped);
        this.txLoadedFor = { lang, tx };
        return mapped;
      }),
      catchError((err) => {
        console.error('ResourceService.loadTransactionResources failed', { lang, tx, err });
        return of(this.transactionResources());
      })
    );
  }

  /** Back-compat: previously loaded all resources; now loads general resources. */
  loadResources(languageCode?: string): Observable<Record<string, string>> {
    return this.loadGeneralResources(languageCode);
  }

  /**
   * Ensures resources are loaded at least once (or for the requested language).
   * Useful for APP_INITIALIZER and screens that should not flash fallback text.
   */
  /** Ensures general resources are loaded at least once. */
  ensureGeneralLoaded(languageCode?: string): Promise<Record<string, string>> {
    const lang = languageCode || this.currentLanguage();

    if (this.generalLoadedForLang === lang && Object.keys(this.generalResources()).length > 0) {
      return Promise.resolve(this.generalResources());
    }

    if (this.inFlight && this.inFlightLang === lang) {
      return this.inFlight;
    }

    if (!this.inFlight) {
      this.inFlightLang = lang;
      this.inFlight = firstValueFrom(this.loadGeneralResources(lang)).finally(() => {
        this.inFlight = undefined;
        this.inFlightLang = undefined;
      });
    }

    return this.inFlight;
  }

  /** Ensures transaction resources are loaded for the given transaction name. */
  ensureTransactionLoaded(transactionName: string, languageCode?: string): Promise<Record<string, string>> {
    const lang = languageCode || this.currentLanguage();
    const tx = (transactionName ?? '').toString().trim() || 'general';
    const key = `${lang}::${tx}`;

    if (
      this.txLoadedFor?.lang === lang &&
      this.txLoadedFor?.tx === tx &&
      Object.keys(this.transactionResources()).length > 0
    ) {
      return Promise.resolve(this.transactionResources());
    }

    if (this.txInFlight && this.txInFlightKey === key) {
      return this.txInFlight;
    }

    if (!this.txInFlight) {
      this.txInFlightKey = key;
      this.txInFlight = firstValueFrom(this.loadTransactionResources(tx, lang)).finally(() => {
        this.txInFlight = undefined;
        this.txInFlightKey = undefined;
      });
    }

    return this.txInFlight;
  }

  /** Back-compat alias used in app init and older screens. */
  ensureLoaded(languageCode?: string): Promise<Record<string, string>> {
    return this.ensureGeneralLoaded(languageCode);
  }

  /** Update language and reload already-selected scopes (general + current transaction). */
  async setLanguage(languageCode: string): Promise<void> {
    const lang = (languageCode ?? '').toString().trim() || 'tr';
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);

    // Force reload if language changed, even if maps are already populated.
    await firstValueFrom(this.loadGeneralResources(lang));
    const tx = this.currentTransactionName();
    if (tx && tx !== 'general') {
      await firstValueFrom(this.loadTransactionResources(tx, lang));
    }
  }

  private toMap(items: Array<ResourceItemDto> | null | undefined): Record<string, string> {
    const normalized: Record<string, string> = {};
    for (const item of items ?? []) {
      const key = (item?.resourceCode ?? '').toString().trim();
      if (!key) continue;
      normalized[key] = (item?.resourceValue ?? '').toString();
    }
    return normalized;
  }

  private parseKeyAndFallback(text: string): { key: string; fallback?: string } {
    const raw = (text ?? '').toString();
    const idx = raw.indexOf('|');
    if (idx === -1) {
      return { key: raw.trim() };
    }

    const key = raw.slice(0, idx).trim();
    const fallback = raw.slice(idx + 1).trim();
    return { key, fallback: fallback || undefined };
  }

  /**
   * Returns the translated message for the given key.
   * Supports "KEY | Default" format; if the key does not exist, returns Default.
   */
  getMessage(keyOrKeyWithFallback: string): string {
    const { key, fallback } = this.parseKeyAndFallback(keyOrKeyWithFallback);
    const txRes = this.transactionResources();
    const genRes = this.generalResources();

    const translated = key ? (txRes[key] ?? genRes[key]) : undefined;
    if (translated !== undefined && translated !== null && translated !== '') {
      return translated;
    }

    if (fallback) {
      return fallback;
    }

    return key;
  }

  /** Back-compat alias; now also supports "KEY | Default" format. */
  get(keyOrKeyWithFallback: string): string {
    return this.getMessage(keyOrKeyWithFallback);
  }
}

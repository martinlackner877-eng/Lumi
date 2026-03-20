import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

type AuthProvider = 'google' | 'apple';

type StoredSession = {
  isAuthenticated: boolean;
  provider: AuthProvider | null;
};

type LumiUser = {
  avatarUrl: string;
  provider: AuthProvider | null;
};

const STORAGE_KEY = 'lumi.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);
  private readonly storage = this.resolveStorage();
  private readonly session = signal<StoredSession>({
    isAuthenticated: false,
    provider: null,
  });

  readonly isAuthenticated = computed(() => this.session().isAuthenticated);
  readonly user = computed<LumiUser | null>(() => {
    const current = this.session();

    if (!current.isAuthenticated) {
      return null;
    }

    return {
      avatarUrl: '/avatar-lumi.svg',
      provider: current.provider,
    };
  });

  constructor() {
    if (!this.storage) {
      return;
    }

    const storedSession = this.storage.getItem(STORAGE_KEY);

    if (!storedSession) {
      return;
    }

    try {
      const parsed = JSON.parse(storedSession) as StoredSession;

      if (parsed.isAuthenticated) {
        this.session.set({
          isAuthenticated: true,
          provider: parsed.provider ?? null,
        });
      }
    } catch {
      this.storage.removeItem(STORAGE_KEY);
    }
  }

  continueWith(provider: AuthProvider): void {
    const nextSession: StoredSession = {
      isAuthenticated: true,
      provider,
    };

    this.session.set(nextSession);
    this.persist(nextSession);
  }

  logout(): void {
    const nextSession: StoredSession = {
      isAuthenticated: false,
      provider: null,
    };

    this.session.set(nextSession);
    this.persist(nextSession);
  }

  private persist(session: StoredSession): void {
    if (!this.storage) {
      return;
    }

    this.storage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private resolveStorage(): Storage | null {
    if (!this.browser) {
      return null;
    }

    const storage = window.localStorage;

    if (
      typeof storage?.getItem !== 'function' ||
      typeof storage.setItem !== 'function' ||
      typeof storage.removeItem !== 'function'
    ) {
      return null;
    }

    return storage;
  }
}

import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'dam2-theme';

/**
 * Gestiona el modo oscuro de toda la app. Usa la clase "ion-palette-dark"
 * (paleta oficial de Ionic, importada en global.scss como "dark.class.css")
 * sobre <html>, y recuerda la preferencia del usuario en localStorage.
 * Si el usuario no ha elegido nunca, se respeta la preferencia del sistema
 * operativo (prefers-color-scheme) solo como valor inicial.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly isDark = signal(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.isDark());
  }

  toggle(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    this.applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', dark);
  }
}

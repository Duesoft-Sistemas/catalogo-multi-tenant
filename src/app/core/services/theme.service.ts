import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private clearThemeClasses() {
    Array.from(document.body.classList)
      .filter((c) => c.startsWith('theme-'))
      .forEach((c) => document.body.classList.remove(c));
  }

  setThemeClass(schema: string) {
    this.clearThemeClasses();
    if (schema) {
      document.body.classList.add(`theme-${schema}`);

      // Verificar se as variáveis CSS estão sendo aplicadas
      setTimeout(() => {
        const primaryColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--color-primary');
        const bodyClasses = document.body.classList.toString();
      }, 100);
    }
  }

  setThemeVariables(colors: Record<string, string>) {
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  }

  getCurrentTheme(): string | null {
    const bodyClasses = document.body.classList.toString();
    const themeMatch = bodyClasses.match(/theme-(\w+)/);
    return themeMatch ? themeMatch[1] : null;
  }

  isThemeApplied(schema: string): boolean {
    const bodyClasses = document.body.classList.toString();
    return bodyClasses.includes(`theme-${schema}`);
  }

  applyTheme(schema: string, colors?: Record<string, string>) {
    // Verificar se o schema é válido
    if (!schema) {
      return;
    }

    if (colors && Object.keys(colors).length) {
      this.clearThemeClasses();
      this.setThemeVariables(colors);
    } else {
      this.setThemeClass(schema);
    }

    // Verificar se o tema foi aplicado corretamente
    setTimeout(() => {
      const bodyClasses = document.body.classList.toString();
      const hasTheme = bodyClasses.includes(`theme-${schema}`);

      if (!hasTheme) {
        // Falha ao aplicar tema
      }
    }, 150);
  }
}

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private clearThemeClasses() {
    Array.from(document.body.classList)
      .filter(c => c.startsWith('theme-'))
      .forEach(c => document.body.classList.remove(c));
  }

  setThemeClass(schema: string) {
    this.clearThemeClasses();
    if (schema) {
      document.body.classList.add(`theme-${schema}`);
      console.log(`🎨 Tema aplicado: theme-${schema}`);
      console.log('📋 Classes do body:', document.body.classList.toString());
      
      // Verificar se as variáveis CSS estão sendo aplicadas
      setTimeout(() => {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        const bodyClasses = document.body.classList.toString();
        console.log('🎨 Cor primária aplicada:', primaryColor);
        console.log('📋 Classes do body após aplicação:', bodyClasses);
        console.log('🔍 Verificando se a classe theme está presente:', bodyClasses.includes(`theme-${schema}`));
      }, 100);
    }
  }

  setThemeVariables(colors: Record<string,string>) {
    Object.entries(colors).forEach(([k, v]) => {
      const varName = k.startsWith('--') ? k : `--color-${k}`;
      document.documentElement.style.setProperty(varName, v);
    });
  }

  applyTheme(schema: string, colors?: Record<string,string>) {
    console.log(`🎨 Aplicando tema: ${schema}`, colors ? 'com cores customizadas' : 'com cores padrão');
    
    // Verificar se o schema é válido
    if (!schema) {
      console.error('❌ Schema não fornecido para aplicação do tema');
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
      console.log(`🎨 Verificação pós-aplicação: tema ${schema} aplicado = ${hasTheme}`);
      
      if (!hasTheme) {
        console.error(`❌ Falha ao aplicar tema: ${schema}`);
        console.log('📋 Classes atuais do body:', bodyClasses);
      }
    }, 150);
  }
}

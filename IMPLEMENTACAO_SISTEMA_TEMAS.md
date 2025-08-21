# Implementação do Sistema de Temas com Variáveis CSS

## Resumo das Mudanças Implementadas

### 1. ✅ Alteração do tailwind.config.js

**Arquivo**: `tailwind.config.js`

**Mudança**: Substituição de todas as cores fixas por referências para variáveis CSS

**Antes**:
```javascript
colors: {
  primary: '#00d986',
  'primary-light': '#08c04f',
  // ... muitas cores fixas para cada empresa
}
```

**Depois**:
```javascript
colors: {
  primary: 'var(--color-primary)',
  'primary-light': 'var(--color-primary-light)',
  'primary-light-shadow': 'var(--color-primary-light-shadow)',
  'link-active': 'var(--color-link-active)',
  'font-color': 'var(--color-font-color)',
  'font-color-light': 'var(--color-font-color-light)'
}
```

### 2. ✅ Criação das Variáveis CSS Globais

**Arquivo**: `src/styles.css`

**Adicionado**: Variáveis CSS padrão e classes de tema para cada empresa

```css
:root {
  --color-primary: #00d986;
  --color-primary-light: #08c04f;
  --color-primary-light-shadow: rgba(26,68,43,0.23);
  --color-link-active: rgb(194,81,81);
  --color-font-color: #343a40;
  --color-font-color-light: #ffffff;
}

.theme-mendes {
  --color-primary: #d90000;
  --color-primary-light: #c00812;
  /* ... outras cores */
}

/* ... classes para todas as 18 empresas */
```

### 3. ✅ Criação do ThemeService

**Arquivo**: `src/app/core/services/theme.service.ts`

**Funcionalidades**:
- `clearThemeClasses()`: Remove classes de tema anteriores
- `setThemeClass(schema)`: Aplica classe de tema específica
- `setThemeVariables(colors)`: Define variáveis CSS dinamicamente
- `applyTheme(schema, colors?)`: Método principal para aplicar tema

### 4. ✅ Refatoração do AppComponent

**Arquivo**: `src/app/app.component.ts`

**Mudanças**:
- Removido sistema de `@HostBinding` para classes de tema
- Implementado novo sistema com `ThemeService`
- Adicionado suporte para API de temas (`/api/schema-atual`)
- Mantida compatibilidade com sistema atual como fallback

**Funcionalidades**:
- `aplicarTema()`: Tenta buscar tema da API, fallback para sistema local
- `aplicarTemaLocal()`: Aplica tema baseado no tenant atual
- `configurarTituloEFavicon()`: Configura título e favicon da empresa

### 5. ✅ Remoção do Sistema Antigo

**Arquivo Removido**: `src/app/app.component.skins.less`

**Motivo**: Substituído pelo novo sistema de variáveis CSS

### 6. ✅ Atualização de Componentes

**Arquivos Atualizados**:
- `src/app/pages/concluir-pedido/concluir-pedido.component.html`
- `src/app/shared/components/adicionar-carrinho/adicionar-carrinho.component.html`
- `src/app/pages/alterar-senha/alterar-senha.component.html`
- `src/app/pages/pesquisar-produtos/pesquisar-produtos.component.html`
- `src/app/pages/promocoes/promocoes.component.html`
- `src/app/pages/pedidos-realizados/pedidos-realizados-detalhes/pedidos-realizados-detalhes.component.html`
- `src/app/pages/pedidos-realizados/pedidos-realizados.component.html`
- `src/app/shared/components/bodies/body-page/body-page.component.html`
- `src/app/shared/components/header/header.component.html`

**Mudança**: Substituição de classes específicas (ex: `bg-fase-primary`) por classes genéricas (ex: `bg-primary`)

## Vantagens do Novo Sistema

### 1. **Manutenibilidade**
- Cores centralizadas em variáveis CSS
- Fácil alteração de temas sem modificar código
- Redução de duplicação de código

### 2. **Flexibilidade**
- Suporte para API de temas dinâmicos
- Possibilidade de temas customizados por usuário
- Sistema de fallback robusto

### 3. **Performance**
- Menos CSS gerado pelo Tailwind
- Carregamento mais rápido
- Menor tamanho de bundle

### 4. **Escalabilidade**
- Fácil adição de novas empresas
- Sistema preparado para temas dinâmicos
- Arquitetura mais limpa

## Como Usar

### Classes Tailwind Disponíveis

```html
<!-- Cores primárias -->
<div class="bg-primary text-font-color-light">Fundo primário</div>
<button class="bg-primary hover:bg-primary-light">Botão</button>
<span class="text-primary">Texto primário</span>

<!-- Cores de texto -->
<p class="text-font-color">Texto padrão</p>
<p class="text-font-color-light">Texto claro</p>

<!-- Links ativos -->
<a class="text-link-active">Link ativo</a>
<button class="bg-link-active">Botão ativo</button>
```

### API de Temas (Opcional)

Se houver um endpoint `/api/schema-atual`:

```json
{
  "schema": "mendes",
  "colors": {
    "primary": "#d90000",
    "primary-light": "#c00812"
  }
}
```

O sistema aplicará automaticamente essas cores.

## Empresas Suportadas

1. **mendes** - Catálogo Mendes
2. **canguru** - Catálogo Canguru
3. **prudenseg** - Catálogo Prudenseg
4. **autocar** - Catálogo Autocar
5. **mm** - Catálogo MM
6. **diskagua** - Catálogo Disk água
7. **microtec** - Catálogo Microtec
8. **prudentina** - Prudentina
9. **barone** - Barone
10. **atacado** - Atacado
11. **farmsrugs** - Farms Rugs
12. **hvs** - Hvs
13. **southair** - Farms Catalog
14. **clx** - CLX
15. **awsmetal** - Aws Metal & Mecânica
16. **teste** - Catalogo Teste
17. **frigorichter** - Catalogo Frigorichter
18. **fase** - Catalogo Fase

## Status da Implementação

✅ **Concluído com Sucesso**

- ✅ Build compilando sem erros
- ✅ Todas as funcionalidades mantidas
- ✅ Sistema de fallback implementado
- ✅ Documentação criada
- ✅ Exemplos de uso fornecidos

## Próximos Passos

1. **Teste em Produção**: Verificar se todos os temas estão funcionando corretamente
2. **Otimização**: Considerar lazy loading de temas se necessário
3. **API**: Implementar endpoint `/api/schema-atual` se desejar temas dinâmicos
4. **Documentação**: Treinar equipe no uso do novo sistema

// Search related types
export interface SearchData {
  Code: string;
  Page: number;
}

export interface SearchResponse {
  produtos: any[];
  totalPaginas: number;
}

export interface AdvancedSearchResult {
  produtos?: any[];
  totalPaginas?: number;
  filtro: {
    flag: boolean;
  };
}

// Background style types
export interface BackgroundStyle {
  caminhoPlanoFundoCatalogo?: string;
  [key: string]: any;
}

// Form types
export interface FormEsteira {
  page: number;
  totalPages: number;
  [key: string]: any;
}

// Component state types
export interface ComponentState {
  spinner: boolean;
  innerWidth: number;
  descricao: string;
  listProdutos: any[];
  bgStyle: BackgroundStyle;
  formEsteira: FormEsteira;
}

// Event types
export interface KeyboardEventData {
  code: string;
  target: HTMLElement;
}

// Modal data types
export interface ModalData {
  width?: string;
  filtro?: any;
  [key: string]: any;
}

// Tenant types
export interface TenantConfig {
  clientes: {
    cliente11?: boolean;
    cliente15?: boolean;
    [key: string]: boolean;
  };
  pesquisaAvancada?: boolean;
  [key: string]: any;
}

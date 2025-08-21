export const APP_CONFIG = {
  // API Configuration
  API: {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    BASE_URL: 'api'
  },

  // Authentication
  AUTH: {
    TOKEN_KEY: 'authToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    USER_DATA_KEY: 'userData',
    TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000 // 5 minutes
  },

  // UI Configuration
  UI: {
    DEBOUNCE_TIME: 300,
    ANIMATION_DURATION: 300,
    LOADING_TIMEOUT: 10000,
    TOAST_DURATION: 3000
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
  },

  // Search Configuration
  SEARCH: {
    MIN_CHARACTERS: 2,
    DEBOUNCE_TIME: 500,
    MAX_RESULTS: 100
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    MAX_FILES: 10
  },

  // Error Messages
  ERRORS: {
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente.',
    UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
    FORBIDDEN: 'Acesso negado.',
    NOT_FOUND: 'Recurso não encontrado.',
    VALIDATION_ERROR: 'Dados inválidos. Verifique as informações.'
  },

  // Success Messages
  SUCCESS: {
    SAVE: 'Dados salvos com sucesso!',
    DELETE: 'Item removido com sucesso!',
    UPDATE: 'Dados atualizados com sucesso!',
    LOGIN: 'Login realizado com sucesso!',
    LOGOUT: 'Logout realizado com sucesso!'
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED: 'Campo obrigatório.',
    EMAIL: 'Email inválido.',
    MIN_LENGTH: 'Mínimo de caracteres não atingido.',
    MAX_LENGTH: 'Máximo de caracteres excedido.',
    PATTERN: 'Formato inválido.'
  }
};

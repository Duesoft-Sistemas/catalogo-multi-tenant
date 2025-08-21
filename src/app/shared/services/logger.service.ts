import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = LogLevel.INFO;

  constructor() {
    // Set log level based on environment
    if (typeof window !== 'undefined') {
      const isDevMode = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
      this.logLevel = isDevMode ? LogLevel.DEBUG : LogLevel.INFO;
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: any): void {
    if (this.logLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error);
    }
  }

  /**
   * Log API request
   */
  logApiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, data);
  }

  /**
   * Log API response
   */
  logApiResponse(method: string, url: string, response: any): void {
    this.debug(`API Response: ${method} ${url}`, response);
  }

  /**
   * Log API error
   */
  logApiError(method: string, url: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, error);
  }

  /**
   * Log component lifecycle
   */
  logComponentLifecycle(componentName: string, lifecycle: string): void {
    this.debug(`Component ${componentName}: ${lifecycle}`);
  }

  /**
   * Log user action
   */
  logUserAction(action: string, data?: any): void {
    this.info(`User Action: ${action}`, data);
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }
}

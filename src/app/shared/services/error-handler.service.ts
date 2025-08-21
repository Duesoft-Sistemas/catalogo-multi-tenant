import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { APP_CONFIG } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private logger: LoggerService) {}

  /**
   * Handle HTTP errors
   */
  handleHttpError(error: HttpErrorResponse, context?: string): string {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = APP_CONFIG.ERRORS.NETWORK_ERROR;
      this.logger.error(`Client Error: ${error.error.message}`, error);
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Dados inválidos.';
          break;
        case 401:
          errorMessage = APP_CONFIG.ERRORS.UNAUTHORIZED;
          break;
        case 403:
          errorMessage = APP_CONFIG.ERRORS.FORBIDDEN;
          break;
        case 404:
          errorMessage = APP_CONFIG.ERRORS.NOT_FOUND;
          break;
        case 500:
          errorMessage = APP_CONFIG.ERRORS.SERVER_ERROR;
          break;
        default:
          errorMessage = error.error?.message || 'Erro inesperado.';
      }

      this.logger.error(`Server Error: ${error.status} - ${errorMessage}`, error);
    }

    if (context) {
      this.logger.error(`Error in context: ${context}`, error);
    }

    return errorMessage;
  }

  /**
   * Handle validation errors
   */
  handleValidationError(errors: any): string[] {
    const errorMessages: string[] = [];

    if (errors) {
      Object.keys(errors).forEach(key => {
        const error = errors[key];
        if (error) {
          if (typeof error === 'string') {
            errorMessages.push(error);
          } else if (error.required) {
            errorMessages.push(APP_CONFIG.VALIDATION.REQUIRED);
          } else if (error.email) {
            errorMessages.push(APP_CONFIG.VALIDATION.EMAIL);
          } else if (error.minlength) {
            errorMessages.push(APP_CONFIG.VALIDATION.MIN_LENGTH);
          } else if (error.maxlength) {
            errorMessages.push(APP_CONFIG.VALIDATION.MAX_LENGTH);
          } else if (error.pattern) {
            errorMessages.push(APP_CONFIG.VALIDATION.PATTERN);
          }
        }
      });
    }

    this.logger.warn('Validation errors', errorMessages);
    return errorMessages;
  }

  /**
   * Handle general errors
   */
  handleError(error: any, context?: string): string {
    let errorMessage = 'Erro inesperado.';

    if (error instanceof HttpErrorResponse) {
      errorMessage = this.handleHttpError(error, context);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      this.logger.error(`General Error: ${error.message}`, error);
    } else if (typeof error === 'string') {
      errorMessage = error;
      this.logger.error(`String Error: ${error}`);
    } else {
      this.logger.error('Unknown Error', error);
    }

    if (context) {
      this.logger.error(`Error in context: ${context}`, error);
    }

    return errorMessage;
  }

  /**
   * Handle async errors
   */
  async handleAsyncError<T>(
    promise: Promise<T>,
    context?: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const data = await promise;
      return { success: true, data };
    } catch (error) {
      const errorMessage = this.handleError(error, context);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Log error for analytics
   */
  logErrorForAnalytics(error: any, context?: string): void {
    // Here you can integrate with error tracking services like Sentry
    this.logger.error(`Analytics Error - Context: ${context}`, error);
  }

  /**
   * Check if error is network related
   */
  isNetworkError(error: any): boolean {
    return error instanceof HttpErrorResponse && 
           (error.status === 0 || error.statusText === 'Unknown Error');
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(error: any): boolean {
    return error instanceof HttpErrorResponse && 
           (error.status === 401 || error.status === 403);
  }
}

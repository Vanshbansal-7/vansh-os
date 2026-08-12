export interface LogContext {
  requestId?: string;
  userId?: string;
  path?: string;
  method?: string;
  [key: string]: unknown;
}

class StructuredLogger {
  private formatLog(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      ...(context || {}),
    };
    return payload;
  }

  info(message: string, context?: LogContext) {
    const log = this.formatLog('INFO', message, context);
    console.log(`[VOS-LOG][INFO] ${message}`, JSON.stringify(log));
  }

  warn(message: string, context?: LogContext) {
    const log = this.formatLog('WARN', message, context);
    console.warn(`[VOS-LOG][WARN] ${message}`, JSON.stringify(log));
  }

  error(message: string, error?: unknown, context?: LogContext) {
    const errorDetails = error instanceof Error 
      ? { errorName: error.name, errorMessage: error.message, stack: error.stack }
      : { rawError: error };

    const log = this.formatLog('ERROR', message, { ...context, ...errorDetails });
    console.error(`[VOS-LOG][ERROR] ${message}`, JSON.stringify(log));
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== 'production') {
      const log = this.formatLog('DEBUG', message, context);
      console.debug(`[VOS-LOG][DEBUG] ${message}`, JSON.stringify(log));
    }
  }
}

export const logger = new StructuredLogger();

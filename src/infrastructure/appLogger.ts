import get from 'lodash/get';

const LOG_LEVELS = ['error', 'warn', 'info', 'log', 'debug', 'trace'];

type loggerKey = {
  // eslint-disable-next-line no-unused-vars
  [key: string]: (...args: any) => void;
};

const initLogger = () => {
  const currentEnvironment = get(process.env, 'REACT_APP_SERVER', 'local');
  const isLoggingEnabled =
    ['local', 'staging'].includes(currentEnvironment) || get(process.env, 'REACT_OVERRIDE_LOGGING') === 'Y';
  const logger: loggerKey = {
    error: (...args: any) => `${JSON.stringify(args)}`,
    warn: (...args: any) => `${JSON.stringify(args)}`,
    info: (...args: any) => `${JSON.stringify(args)}`,
    log: (...args: any) => `${JSON.stringify(args)}`,
    debug: (...args: any) => `${JSON.stringify(args)}`,
    trace: (...args: any) => `${JSON.stringify(args)}`,
  };
  if (isLoggingEnabled) {
    const logLevel = get(process.env, 'DEFAULT_LOG_LEVEL', 'log');
    const logLevelIndex = LOG_LEVELS.findIndex((level) => level === logLevel);
    const enabledLogLevels = LOG_LEVELS.slice(0, logLevelIndex + 1);
    Object.keys(console).forEach((m: any) => {
      const consoleType = get(console, m);
      if (typeof consoleType === 'function' && typeof window !== 'undefined') {
        if (enabledLogLevels.includes(m)) {
          logger[m] = consoleType.bind(window.console, 'APP-LOG: ');
        }
      }
    });
  }
  return logger;
};

const appLogger = initLogger();
export default appLogger;

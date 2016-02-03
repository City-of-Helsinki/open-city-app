export const LEVEL_LOG = 1;
export const LEVEL_INFO = 2;
export const LEVEL_WARN = 3;
export const LEVEL_ERROR = 4;
export const LEVEL_DEBUG = 5;

let config = {
  isLogging: true,
  logLevel: LEVEL_DEBUG
};

export function log() {
  if (!isMobileDevice() && config.isLogging && config.logLevel >= LEVEL_LOG) {
    console.log.apply(console, arguments);
  }
}

export function info() {
  if (!isMobileDevice() && config.isLogging && config.logLevel >= LEVEL_INFO) {
    console.info.apply(console, arguments);
  }
}

export function warn() {
  if (!isMobileDevice() && config.isLogging && config.logLevel >= LEVEL_WARN) {
    console.warn.apply(console, arguments);
  }
}

export function error() {
  if (!isMobileDevice() && config.isLogging && config.logLevel >= LEVEL_ERROR) {
    console.error.apply(console, arguments);
  }
}

export function debug() {
  if (!isMobileDevice() && config.isLogging && config.logLevel >= LEVEL_DEBUG) {
    console.debug.apply(console, arguments);
  }
}

export function isMobileDevice() {
  return typeof Function.apply !== 'function';
}

export function configureLog(value) {
  config = value;
}

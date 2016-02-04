export const LOG_LEVEL_LOG = 1;
export const LOG_LEVEL_INFO = 2;
export const LOG_LEVEL_WARN = 3;
export const LOG_LEVEL_ERROR = 4;
export const LOG_LEVEL_DEBUG = 5;

let config = {
  isLogging: true,
  logLevel: LOG_LEVEL_DEBUG
};

export function log() {
  if (config.isLogging && config.logLevel >= LOG_LEVEL_LOG) {
    console.log.apply(console, arguments);
  }
}

export function info() {
  if (config.isLogging && config.logLevel >= LOG_LEVEL_INFO) {
    console.info.apply(console, arguments);
  }
}

export function warn() {
  if (config.isLogging && config.logLevel >= LOG_LEVEL_WARN) {
    console.warn.apply(console, arguments);
  }
}

export function error() {
  if (config.isLogging && config.logLevel >= LOG_LEVEL_ERROR) {
    console.error.apply(console, arguments);
  }
}

export function debug() {
  if (config.isLogging && config.logLevel >= LOG_LEVEL_DEBUG) {
    console.debug.apply(console, arguments);
  }
}

export function configureLog(value) {
  config = value;
}

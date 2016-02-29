import {
  AsyncStorage
} from 'react-native';

/**
 * Setter for storage.
 * @param key {string}
 * @param value {*}
 * @returns {Promise}
 */
export function setInStorage(key, value) {
  return AsyncStorage.setItem(key, value);
}

/**
 * Getter for storage.
 * @param key {string}
 * @returns {Promise}
 */
export function getFromStorage(key) {
  return AsyncStorage.getItem(key);
}

/**
 * Clears the value of the given storage key.
 * @param key {string}
 * @returns {Promise}
 */
export function unsetFromStorage(key) {
  return AsyncStorage.removeItem(key);
}
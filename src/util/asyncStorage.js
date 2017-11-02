export default class AsyncStorageAdapter {
  constructor({ prefix = 'oidc.', asyncStorage = null } = {}) {
    if (asyncStorage === null) {
      throw new Error('Must provide AsyncStorage from react-native');
    }

    this._prefix = key => prefix + key;
    this._unprefix = prefixedKey => prefixedKey.substr(prefix.length);
    this._asyncStorage = asyncStorage;
  }

  set(key, value) {
    // console.log(`ReactNativePersistantStore set key: ${key}, value: ${value}`);
    const prefixedKey = this._prefix(key);

    return this._asyncStorage.setItem(prefixedKey, JSON.stringify(value));
  }

  get(key) {
    // console.log(`ReactNativePersistantStore set key: ${key}`);
    const prefixedKey = this._prefix(key);

    return this._asyncStorage.getItem(prefixedKey).then((res) => {
      if (res === null) {
        return Promise.resolve(undefined);
      }

      const value = JSON.parse(res);
      return value;
    });
  }

  remove(key) {
    // console.log(`ReactNativePersistantStore remove key: ${key}`);
    const prefixedKey = this._prefix(key);

    return this._asyncStorage.getItem(prefixedKey).then((res) => {
      if (res === null) {
        return Promise.resolve(undefined);
      }

      const removedValue = JSON.parse(res);
      return this._asyncStorage.removeItem(prefixedKey).then(() => removedValue);
    });
  }

  getAllKeys() {
    // console.log('ReactNativePersistantStore getAllKeys');

    return new Promise((resolve) => {
      this._asyncStorage.getAllKeys((error, keys) => {
        const unprefixedKeys = keys.map(prefixedKey => this._unprefix(prefixedKey));

        resolve(unprefixedKeys);
      });
    });
  }
}

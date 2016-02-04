import {debug} from './log';

let config = {
  endpoint: 'http://example.com'
};

const defaultOptions = {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

/**
 *
 * @param {string} url
 * @param {object} options
 * @returns {Promise}
 */
export function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    return fetch(`${config.endpoint}/${url}`, {
      ...options,
      ...defaultOptions
    })
      .then(response => {
        return response.json()
          .then(data => {
            const result = {response: response, data: data};
            //debug('result:', result);
            return resolve(result);
          })
      })
      .catch(err => reject(err));
  });
}

/**
 *
 * @param {object} query
 * @returns {string}
 */
export function buildQueryString(query) {
  let parts = [];
  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
    }
  }
  return parts.join('&');
}


/**
 *
 * @param {object} value
 */
export function configureApi(value) {
  config = value;
}

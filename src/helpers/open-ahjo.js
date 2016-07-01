import { openahjo_url as API_URL } from '../config';

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
    return fetch(`${API_URL}/${url}`, {
      ...options,
      ...defaultOptions
    })
      .then(response => {
        return response.json()
          .then(data => {
            const result = {response: response, data: data};
            console.log('result:', result);
            return resolve(result);
          })
      })
      .catch(err => reject(err));
  });
}

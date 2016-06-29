const API_URL = 'https://asiointi.hel.fi/palautews/rest/v1';
const API_URL_DEV = 'https://open311-demo.6aika.fi/api/georeport/v2';
// https://open311-demo.6aika.fi/api/georeport/v2/requests.json

const defaultOptions = {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
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
    return fetch(`${API_URL_DEV}/${url}`, {
      ...defaultOptions,
      ...options
    })
      .then(response => {
        console.log(response);
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

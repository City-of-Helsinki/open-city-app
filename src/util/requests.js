import Config from '../config';

module.exports = function(url, method, headers, body, data) {

  return new Promise(function(resolve, reject) {
    const timeoutId = setTimeout(() => {
      reject(new Error(Config.TIMEOUT_MESSAGE))
    }, Config.TIMEOUT_THRESHOLD);
    fetch(url, {
      method: method,
      headers: headers,
      body: body,
      data: data,
    }).then((response) => {
      clearTimeout(timeoutId);
      if (response.status === 200 || response.status === 201) {
        resolve(response.json());
      } else {
        reject(new Error);
      }
    }).catch((error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

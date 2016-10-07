import Config from '../config';

module.exports = function(url, method, headers, body, data) {

  return new Promise(function(resolve, reject) {
    const timeoutId = setTimeout(() => {
      reject(new Error(Config.TIMEOUT_LABEL))
    }, Config.TIMEOUT_THRESHOLD);
    fetch(url, {
      method: method,
      headers: headers,
      body: body,
      data: data,
    }).then((response) => {
      clearTimeout(timeoutId);
      resolve(response.json());
    }).catch((error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

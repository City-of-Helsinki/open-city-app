module.exports = function(url, method, headers, body) {

  return new Promise(function(resolve, reject) {
    fetch(url, {
      method: method,
      headers: headers,
      body: body
    }).then((response) => {
      resolve(response.json());
    }).catch((error) => {
      reject(error);
    });
  });
}
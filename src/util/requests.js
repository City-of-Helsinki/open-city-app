module.exports = function(url, method, headers, body, data) {

  return new Promise(function(resolve, reject) {
    fetch(url, {
      method: method,
      headers: headers,
      body: body,
      data: data,
    }).then((response) => {
      resolve(response.json());
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = function(url, method) {

  return new Promise(function(resolve, reject) {
    fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      resolve(response.json());
    }).catch((error) => {
      //alert
      console.log('error')
      console.log(error)
      reject(error);
    });
  });
}
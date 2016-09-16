module.exports = function(url, method) {

  return new Promise(function(resolve, reject) {
    fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log('response')
      console.log(response)
      resolve(response);
    }).catch((error) => {
      //alert
      console.log('error')
      console.log(error)
      reject(error);
    });
  });
}
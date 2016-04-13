
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

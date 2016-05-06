import {makeRequest} from './open311';
import {buildQueryString} from './api';
import {forEach} from 'lodash';

/**
 * @param {object} query
 * @param {object} options
 * @returns {Promise}
 */
export function findServices(query, options = {}) {
  let queryString = query ? '?' + buildQueryString(query) : '';
  console.log('queryString', queryString);
  return makeRequest(`services.json${queryString}`, options);
}
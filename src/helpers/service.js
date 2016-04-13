import {makeRequest} from './open311';
import {buildQueryString} from './api';
import {forEach} from 'lodash';

/**
 *
 * @param {number} id
 * @param {object} options
 * @returns {Promise}
 */
export function findServiceRequestById(id, options) {
  return makeRequest(`services.json/${id}.json`, options);
}

/**
 * @param {object} query
 * @param {object} options
 * @returns {Promise}
 */
export function findServiceRequests(query, options = {}) {
  let queryString = query ? '?' + buildQueryString(query) : '';
  return makeRequest(`services.json${queryString}`, options);
}
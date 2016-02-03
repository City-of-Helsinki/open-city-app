import {makeRequest} from './api';

/**
 *
 * @param {number} id
 * @param {object} options
 * @returns {Promise}
 */
export function findIssueById(id, options) {
  return makeRequest(`issue/${id}`, options);
}

/**
 * @param {string} bbox
 * @param {object} options
 * @returns {Promise}
 */
export function findIssuesByLocation(bbox, options) {
  return makeRequest(`issue/search?bbox=${bbox}`, options);
}


/**
 * @param {object} options
 * @returns {Promise}
 */
export function findAllIssues(options) {
  return makeRequest('issue/search', options);
}

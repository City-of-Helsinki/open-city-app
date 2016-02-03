import {makeRequest} from './api';

const categoryColorMap = [
  '#39A795',
  '#287467',
  '#75B6AB',
  '#9CF2E5',
  '#283C9F',
  '#1C2653',
  '#485FD3',
  '#8794D3',
  '#888283',
  '#555152',
  '#9D878A',
  '#D4CBCD',
  '#FF6070',
  '#7F3038',
  '#CC4D5A',
  '#FF495B'
];

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

/**
 *
 * @param {object} issue
 * @returns {string}
 */
export function getIssueAddressText(issue) {
  return issue.geometries[0].name;
}

/**
 *
 * @param {object} issue
 * @returns {number}
 */
export function getIssueCategoryColor(issue) {
  return categoryColorMap[Number(14 - issue.category_origin_id.split(' ')[0])];
}

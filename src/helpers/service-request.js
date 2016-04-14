import {makeRequest} from './open311';
import {buildQueryString} from './api';
import {forEach} from 'lodash';

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
 * @param {object} query
 * @param {object} options
 * @returns {Promise}
 */
export function findServiceRequests(query, options = {}) {
  let queryString = query ? '?' + buildQueryString(query) : '';
  console.log(queryString);
  return makeRequest(`requests.json${queryString}`, options);
}
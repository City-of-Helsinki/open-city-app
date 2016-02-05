import {makeRequest, buildQueryString} from './api';
import {forEach} from 'lodash';

/**
 *
 * @param query
 * @param options
 * @returns {Promise}
 */
export function findAgendaItemByIssueId(query, options) {
  let queryString = query ? '?' + buildQueryString(query) : '';
  return makeRequest(`agenda_item${queryString}`, options);
}
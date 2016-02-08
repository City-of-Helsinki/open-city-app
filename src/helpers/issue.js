import {makeRequest, buildQueryString} from './api';
import {forEach} from 'lodash';

import {
  GEOMETRY_TYPE_POINT,
  GEOMETRY_TYPE_POLYGON,
  getPolygonCenter
} from './map';

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
 * @param {object} query
 * @param {object} options
 * @returns {Promise}
 */
export function findIssues(query, options) {
  let queryString = query ? '?' + buildQueryString(query) : '';
  return makeRequest(`issue/search${queryString}`, options);
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

/**
 *
 * @param {object} issue
 * @returns {{latitude: *, longitude: *}||null}
 */
export function getIssuePosition(issue) {
  let geometry = null;
  forEach(issue.geometries, (geometryItem, index) => {
    if (geometryItem.type === GEOMETRY_TYPE_POINT) {
      geometry = geometryItem;
      return false;
    } else if (geometryItem.type === GEOMETRY_TYPE_POLYGON) {
      geometry = geometryItem;
    }
  });

  switch (geometry.type) {
    case GEOMETRY_TYPE_POINT:
      return {
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0]
      };
    case GEOMETRY_TYPE_POLYGON:
      let coordinates = [];
      forEach(geometry.coordinates[0], (item) => {
        coordinates.push({ latitude: item[1], longitude: item[0] });
      });

      let center = getPolygonCenter(coordinates);

      return {
        ...center
      };
    default:
      return null;
  }
}

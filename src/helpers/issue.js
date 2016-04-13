import {makeRequest} from './open-ahjo';
import {buildQueryString} from './api';
import {setInStorage, getFromStorage, unsetFromStorage} from './storage';
import {forEach} from 'lodash';

export const STORAGE_ISSUE_META_DATA = 'issue_meta_data';

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
 * @param issue
 * @returns {Promise.<T>}
 */
export function setIssueOpened(issue) {
  return getFromStorage(STORAGE_ISSUE_META_DATA).then((value) => {
    let metaData = JSON.parse(value),
      issueMetaData = null,
      now = new Date().getTime();

    if (!metaData) {
      metaData = {};
    }

    if (metaData && metaData[issue.id]) {
      issueMetaData = metaData[issue.id];
      issueMetaData.openedAt = now;
    } else {
      issueMetaData = {openedAt: now, notifiedAt: null};
    }

    metaData[issue.id] = issueMetaData;

    return setInStorage(STORAGE_ISSUE_META_DATA, JSON.stringify(metaData));
  });
}

/**
 *
 * @param issues
 * @returns {Promise.<T>}
 */
export function setIssuesNotified(issues) {
  return getFromStorage(STORAGE_ISSUE_META_DATA).then((value) => {
    let metaData = JSON.parse(value),
      now = new Date().getTime();

    if (!metaData) {
      metaData = {};
    }

    forEach(issues, (issue) => {
      let issueMetaData = null;
      if (metaData && metaData[issue.id]) {
        issueMetaData = metaData[issue.id];
        issueMetaData.notifiedAt = now;
      } else {
        issueMetaData = {openedAt: null, notifiedAt: now};
      }

      metaData[issue.id] = issueMetaData;
    });

    return setInStorage(STORAGE_ISSUE_META_DATA, JSON.stringify(metaData));
  });
}

export async function getIssueMetaData() {
  return getFromStorage(STORAGE_ISSUE_META_DATA).then((value) => {
    let metaData = JSON.parse(value);

    if (!metaData) {
      metaData = {};
    }

    return metaData;
  });
}

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
export function findIssues(query, options = {}) {
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
        coordinates.push({latitude: item[1], longitude: item[0]});
      });

      let center = getPolygonCenter(coordinates);

      return {
        ...center
      };
    default:
      return null;
  }
}

/**
 *
 * @param issue
 * @returns {*}
 */
export function getPolygon(issue) {
  let polygon = null;
  forEach(issue.geometries, (geometryItem, index) => {
    if (geometryItem.type === GEOMETRY_TYPE_POLYGON) {
      polygon = [];

      forEach(geometryItem.coordinates[0], (item) => {
        polygon.push({latitude: item[1], longitude: item[0]});
      });
      return false;
    }
  });

  return polygon;
}
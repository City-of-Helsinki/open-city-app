import {makeRequest} from './open311';
import {buildQueryString} from './api';
import _ from 'lodash';

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

const API_KEY = 'f1301b1ded935eabc5faa6a2ce975f6';

/**
 * @param {object} query
 * @param {object} options
 * @returns {Promise}
 */
export function findServiceRequests(query, options = {}) {
  let queryString = query ? '?' + buildQueryString(query) : '';
  return makeRequest(`requests.json${queryString}`, options);
}

export function createServiceRequest(serviceRequest, options = {}) {
  options.method = 'POST';
  options.headers = {
    'Content-Type': 'multipart/form-data',
  }

  var data = new FormData();

  data.append('api_key', API_KEY);
  console.log(serviceRequest);

  _.forEach(serviceRequest, function(value, key) {
    if (key === 'media') {
      data.append('media[]', atob(value), 'image.jpg');
    } else {
      data.append(key, value);
    }

  });

  options.body = data;

  return makeRequest(`requests.json`, options);
}

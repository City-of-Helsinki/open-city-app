import {Platform} from 'react-native';

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
  console.log(`requests.json${queryString}`);
  return makeRequest(`requests.json${queryString}`, options);
}

export function createServiceRequest(serviceRequest, options = {}) {
  options.method = 'POST';

  var data = new FormData();

  //data.append('api_key', API_KEY);
  console.log(serviceRequest);

  _.forEach(serviceRequest, function(value, key) {
    if (key === 'media') {
      const image = {
        uri: value.uri,
        width: value.width,
        height: value.height,
        isStored: true,
      };

      if(Platform.OS === 'ios') {
        data.append('media', {
          ...image, name: value.fileName
        });
      } else {
        data.append('media', {
          ...image, type:'image/jpg', name: value.fileName
        });
      }


    } else {
      if(value !== undefined || value !== null) {
        data.append(key, value);
      }
    }
  });

  options.body = data;

  return makeRequest(`requests.json?extensions=media,citysdk`, options);
}

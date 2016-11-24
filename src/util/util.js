import { AsyncStorage } from 'react-native';

import Geolib from 'geolib';
import Config from '../config';
import Global from './globals';

import yellowMarker from '../img/yellow_marker.png';
import greenMarker  from '../img/green_marker.png';
import blueMarker   from '../img/location_marker.png';

import transList from '../translations/list';

transList.setLanguage('fi');
const SERVICE_REQUEST_DESCRIPTION_MAX_LENGTH = 140;

module.exports = {

  // Return date as dd/mm/yyyy hh:mm
  parseDate: function(input) {
    var date = new Date(input);
    var hours   = date.getHours()   < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' +
           hours + ':' + minutes;
  },

  // Parse service requests for ServiceRequestDetailView
  parseServiceRequestDetails: function(input, userPosition) {

    // Fetching a single serviceRequest needs the following check because the serviceRequest is in an array
    var data = input.constructor === Array ? input[0] : input;
    var extendedData = [];

    if (data.extended_attributes.tasks.length > 0) {
      var tasks = data.extended_attributes.tasks;

      for (var i=tasks.length-1; i >= 0; i--) {
        extendedData.push({
          timestamp: tasks[i].task_created,
          date: module.exports.parseDate(tasks[i].task_created),
          agency: tasks[i].owner_name,
          state: module.exports.getTaskType(tasks[i].task_type),
        });
      }
    }

    // Descending order
    extendedData.sort(function (x, y) {
        return new Date(x.timestamp).getTime() > new Date(y.timestamp).getTime() ? -1 : 1;
    });

    var media = typeof data.media_url !== 'undefined' ? data.media_url : null;
    var title = data.extended_attributes.title.length > 0 ? data.extended_attributes.title : data.address;

    var output = {
      title: title,
      description: data.description,
      date: module.exports.parseDate(data.requested_datetime),
      agency: data.agency_responsible,
      status: data.extended_attributes.detailed_status,
      coordinates: typeof data.lat !== 'undefined' && typeof data.long !== 'undefined' ?
       {latitude: data.lat, longitude: data.long} : null ,
      distance: module.exports.getDistance(userPosition, {latitude: data.lat, longitude: data.long}),
      media_urls: data.extended_attributes.media_urls,
      status_notes: data.status_notes,
      extendedData: extendedData
    };

    return output;
  },

  // Return the distance of 2 points in meters
  // If either point, origin or destination, is not defined, 0 is returned.
  getDistance: function(origin = {latitude: 0.0, longitude: 0.0}, destination = {latitude: 0.0, longitude: 0.0}) {
    var distance = 0;

    if (module.exports.isNumeric(origin.latitude) && module.exports.isNumeric(origin.longitude) &&
        module.exports.isNumeric(destination.latitude) && module.exports.isNumeric(destination.latitude)) {

      distance = Geolib.getDistance(
        {latitude: origin.latitude, longitude: origin.longitude},
        {latitude: destination.latitude, longitude: destination.longitude}
      );
    }

    return distance;
  },

  // Parse data to be used in ServiceRequestListView
  parseServiceRequestList: function(data, userPosition) {

    var output = [];
    var arrayLength = data.length < Config.DETAILED_SERVICE_REQUEST_LIMIT ? data.length : Config.DETAILED_SERVICE_REQUEST_LIMIT;
    for (var i=0; i < arrayLength; i++) {
      output.push(module.exports.parseServiceRequestDetails(data[i], userPosition));
    }

    return output;
  },

  // Return an object with a timespan as ISO dates
  getTimeSpan: function() {
    var endDate = new Date();
    var endDateISO = endDate.toISOString();
    var month = (endDate.getMonth() + 1) - Config.TIME_SPAN_IN_MONTHS;
    var startMonth = month < 1 ? 12 + month : month;
    var startDateISO = new Date(endDate.getFullYear(), endDate.getMonth() - Config.TIME_SPAN_IN_MONTHS, endDate.getDate()).toISOString();

    return {startDate: startDateISO, endDate: endDateISO};
  },

  // Return true if input was a number
  isNumeric: function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  },

  // Get all service requests with coordinates and show them on the map
  parseServiceRequests: function(data, userSubmittedServiceRequests = []) {
    var serviceRequests = [];

    for (var i=0; i < data.length; i++) {
      if (data[i].lat !== 'undefined' && typeof data[i].long !== 'undefined') {
        serviceRequests.push({coordinates:
                      {latitude: data[i].lat,
                      longitude: data[i].long},
                    markerImage: module.exports.selectMarkerImage(data[i].status,
                      data[i].service_request_id, userSubmittedServiceRequests),
                    id: data[i].service_request_id,
                    description: module.exports.parseDescription(data[i].description, SERVICE_REQUEST_DESCRIPTION_MAX_LENGTH),
                    agency: data[i].agency_responsible});
      }
    }

    return serviceRequests;
  },

  // Parse status and return the appropriate marker
  selectMarkerImage: function(status, serviceRequestId, userSubmittedServiceRequests) {
    if (module.exports.isUserSubmittedServiceRequest(serviceRequestId, userSubmittedServiceRequests)) {
      return blueMarker;
    }

    return status === Config.STATUS_OPEN ? yellowMarker : greenMarker;
  },

  // Return true if the id was found in the database, false otherwise
  isUserSubmittedServiceRequest: function(serviceRequestId, userSubmittedServiceRequests) {
    userSubmittedServiceRequests = [];

    return userSubmittedServiceRequests.indexOf(serviceRequestId) > -1;
  },

  setItemToStorage(key, value) {
    try {
      AsyncStorage.setItem(key, value);
    } catch (error) {
    }
  },

  getTaskType(state) {
    return Global.taskTypes[state];
  },

  // Truncate description with given length and replace line breaks with spaces
  parseDescription(string, length) {
    return string.substring(0, length).replace(/\n/g, ' ');
  },

  getDate(string) {
    return string.split('.')[0];
  },

  getMonth(string) {
    return string.split('.')[1];
  },

  getLocalizedMonthName(month) {
    return transList.monthNames[month-1];
  }
}
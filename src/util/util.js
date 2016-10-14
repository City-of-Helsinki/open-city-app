import { AsyncStorage } from 'react-native';

import Geolib from 'geolib';
import Config from '../config';
import Global from './globals';

import redMarker    from '../img/red_marker.png';
import yellowMarker from '../img/yellow_marker.png';
import greenMarker  from '../img/green_marker.png';
import blueMarker   from '../img/blue_marker.png';

module.exports = {

  // Return date as dd/mm/yyyy hh:mm
  parseDate: function(input) {
    var date = new Date(input);
    var hours   = date.getHours()   < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' +
           hours + ':' + minutes;
  },

  // Parse issues for issue popup
  parseIssueDetails: function(input, userPosition) {

    // Fetching a single issue needs the following check because the issue is in an array
    var data = input.constructor === Array ? input[0] : input;
    var extendedData = [];

    if (data.extended_attributes.tasks.length > 0) {
      var tasks = data.extended_attributes.tasks;

      for (var i=tasks.length-1; i >= 0; i--) {
        extendedData.push({
          timestamp: tasks[i].task_created,
          date: module.exports.parseDate(tasks[i].task_created),
          agency: tasks[i].owner_name,
          state: module.exports.parseTaskType(tasks[i].task_type),
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
      distance: module.exports.getDistance(userPosition, {latitude: data.lat, longitude: data.long}),
      media_url: media,
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

  // Parse data to be used in IssueListView
  parseIssueList: function(data, userPosition) {

    var output = [];
    var arrayLength = data.length < Config.DETAILED_ISSUE_LIMIT ? data.length : Config.DETAILED_ISSUE_LIMIT;
    for (var i=0; i < arrayLength; i++) {
      output.push(module.exports.parseIssueDetails(data[i], userPosition));
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

  // Get all issues with coordinates and show them on the map
  parseIssues: function(data, userSubmittedIssues = []) {
    var issues = [];

    for (var i=0; i < data.length; i++) {
      if (data[i].lat !== 'undefined' && typeof data[i].long !== 'undefined') {
        issues.push({coordinates:
                      {latitude: data[i].lat,
                      longitude: data[i].long},
                    markerImage: module.exports.selectMarkerImage(data[i].status,
                      data[i].service_request_id, userSubmittedIssues),
                    id: data[i].service_request_id});
      }
    }

    return issues;
  },

  // Parse status and return the appropriate marker
  selectMarkerImage: function(status, issueId, userSubmittedIssues) {
    if (module.exports.isUserSubmittedIssue(issueId, userSubmittedIssues)) {
      return blueMarker;
    }

    return status === Config.STATUS_OPEN ? yellowMarker : greenMarker;
  },

  // Return true if the id was found in the database, false otherwise
  isUserSubmittedIssue: function(issueId, userSubmittedIssues) {
    userSubmittedIssues = [];

    // For testing purposes
    if (issueId == '113dmieqjindqii2kvne' || issueId == '3eohlgf51pu5n5l3bvi8' || issueId == '2usjcfstu6b7piuus1lo' || issueId == '1mevh6h1n750kdfbsqre' || issueId == '903bfl312ti8lmpvun2f') {
      return true;
    }
    return userSubmittedIssues.indexOf(issueId) > -1;
  },

  setItemToStorage(key, value) {
    try {
      AsyncStorage.setItem(key, value);
    } catch (error) {
    }
  },

  parseTaskType(state) {
    return Global.taskTypes[state];
  }
}
import Geolib from 'geolib';
import Config from '../config';

module.exports = {

  // Return date as dd/mm/yyyy hh:mm
  parseDate: function(input) {
    var date = new Date(input);
    var hours   = date.getHours()   < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' +
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
          date: module.exports.parseDate(tasks[i].task_created),
          agency: tasks[i].owner_name,
          state: tasks[i].task_state,
        });
      }
    }

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
  getDistance: function(origin, destination) {
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
    const timeSpanInMonths = 2;

    var endDate = new Date();
    var endDateISO = endDate.toISOString();
    var month = (endDate.getMonth() + 1) - timeSpanInMonths;
    var startMonth = month < 1 ? 12 + month : month;
    var startDateISO = new Date(endDate.getFullYear(), endDate.getMonth() - timeSpanInMonths, endDate.getDate()).toISOString();

    return {startDate: startDateISO, endDate: endDateISO};
  },

  // Return true if input was a number
  isNumeric: function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
  }
}
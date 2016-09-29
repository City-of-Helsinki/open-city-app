import Geolib from 'geolib';
import Config from '../config';

module.exports = {

  // Return date as dd/mm/yyyy hh:mm
  parseDate: function(input) {
    var date = new Date(input);
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' +
           date.getHours() + ':' + minutes;
  },

  // Parse issues for issue popup
  parseIssueDetails: function(input, userPosition) {

    // Fetching a single issue needs the following check because the issue is in an array
    var data = input.constructor === Array ? input[0] : input;
    var extendedData = [];

    if (data.extended_attributes.tasks.length > 0) {
      var tasks = data.extended_attributes.tasks;

      for (var i=tasks.length-1; i >= 0; i--) {
        extendedData.push({date: module.exports.parseDate(tasks[i].task_created), agency: tasks[i].owner_name})
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
      extendedData: extendedData
    };

    return output;
  },

  // Return the distance of 2 points in meters
  getDistance: function(origin, destination) {
    const distance = Geolib.getDistance(
      {latitude: origin.latitude, longitude: origin.longitude},
      {latitude: destination.latitude, longitude: destination.longitude}
    );

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
  }
}
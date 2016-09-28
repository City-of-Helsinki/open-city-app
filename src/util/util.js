import Geolib from 'geolib';

module.exports = {

  // Return date as dd/mm/yyyy hh:mm
  parseDate: function(input) {
    var date = new Date(input);
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear() + ' ' +
           date.getHours() + ':' + minutes;
  },

  // Parse issues for issue popup
  parseIssueDetails: function(data, userPosition) {
    var data = data[0];
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
    console.log(output)

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
  parseIssueList: function(data) {
    console.log('issue list parse')

    var output = [];
    var arrayLength = data.length < 20 ? data.length : 20;
    for (var i=0; i < arrayLength; i++) {
      output.push(module.exports.parseIssueDetails(data[i], {latitude: 0, longitude: 0}));
    }
    console.log(output)
    return output;
  }
}
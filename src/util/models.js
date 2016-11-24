import Realm from 'realm';

const SERVICE_REQUEST_MODEL    = 'ServiceRequest';
const SERVICE_REQUEST_ID_FIELD = 'serviceRequestId';

// Holds all Service request IDs submitted by the user.
const ServiceRequestSchema = {
  name: SERVICE_REQUEST_MODEL,
  properties: {
    serviceRequestId:  {type: 'string'},
  }
};

const realm = new Realm({schema: [ServiceRequestSchema]});

module.exports = {

  // Insert given serviceRequest to the database
  insert: function(serviceRequestId) {
    realm.write(()=> {
      savedServiceRequest = realm.create(SERVICE_REQUEST_MODEL, {serviceRequestId: serviceRequestId});
    });
  },

  // Return all data stored in the ServiceRequest model. Returns serviceRequests in an array
  fetchAllServiceRequests: function() {
    var serviceRequests = realm.objects(SERVICE_REQUEST_MODEL);
    return serviceRequests.length === 0 ? [] : Object.keys(serviceRequests).map(key => Object.values(serviceRequests[key])[0]);
  },
}

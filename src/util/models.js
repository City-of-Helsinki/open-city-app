import Realm from 'realm';

const ISSUE_MODEL    = 'Issue';
const ISSUE_ID_FIELD = 'issueId';

// Holds all Service request IDs submitted by the user.
const IssueSchema = {
  name: ISSUE_MODEL,
  properties: {
    issueId:  {type: 'string'},
  }
};

const realm = new Realm({schema: [IssueSchema]});

module.exports = {

  // Insert given issue to the database
  insert: function(issueId) {
    realm.write(()=> {
      savedIssue = realm.create(ISSUE_MODEL, {issueId: issueId});
    });
  },

  // Return all data stored in the Issue model. Returns issues in an array
  fetchAllIssues: function() {
    var issues = realm.objects(ISSUE_MODEL);
    return issues.length === 0 ? [] : Object.keys(issues).map(key => Object.values(issues[key])[0]);
  },
}

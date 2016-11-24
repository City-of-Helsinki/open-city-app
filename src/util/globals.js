import transTask from '../translations/task';
transTask.setLanguage('fi');

module.exports = {
  navigatorRef: null,         // Global navigator reference used for back button on Android
  menuRef: null,              // Global reference for drawer is needed in order to enable 'back to close' functionality
  menuOpen: false,            // True if menu is visible, false otherwise
  isMainView: false,          // True if MainView is displayed, false otherwise
  mainViewRef: null,          // Global reference for MainView is needed to enable marker popup closing with back button
  listItemMonth: null,        // Keep track of which month is being iterated through in ServiceReqestListView
  taskTypes: {                // Service request status types in the Open311 API
    moved_to_other_system: transTask.movedToOtherSystem,
    created_in_other_system: transTask.createdInOtherSystem,
    informed: transTask.informed,
    assigned: transTask.assigned,
    wait_for_answer: transTask.waitForAnswer,
    wait_for_comment: transTask.waitForComment,
    transferred_out: transTask.transferredOut
  },
  COLOR: {                   // Global colors used throughout the app
    WHITE: '#fff',
    LIGHT_GREY: '#fafafa',
    GREY: '#bfc0c3',
    WARM_GREY: '#9b9b9b',
    WARM_GREY_10: '#9b9b9b1a',
    STEEL_GREY: '#7e8286',
    DARK_GREY: '#242528',
    BLACK: '#000',
    BLUE: '#005eb8',
    LIGHT_BLUE: '#005eb81a',
    TRANSPARENT: 'rgba(0,0,0,0)',
  },
  OPEN_DRAWER_OFFSET: 0.25, // Percentage of the original view shown when drawer is opened
};

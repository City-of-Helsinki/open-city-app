import transTask from '../translations/task';
transTask.setLanguage('fi');

module.exports = {
  menuRef: null,              // Global reference for drawer is needed in order to enable 'back to close' functionality
  menuOpen: false,            // True if menu is visible, false otherwise
  isMainView: false,          // True if MainView is displayed, false otherwise
  mainViewRef: null,          // Global reference for MainView is needed to enable marker popup closing with back button
  taskTypes: {                // Service request status types in the Open311 API
    moved_to_other_system: transTask.movedToOtherSystem,
    created_in_other_system: transTask.createdInOtherSystem,
    informed: transTask.informed,
    assigned: transTask.assigned,
    wait_for_answer: transTask.waitForAnswer,
    wait_for_comment: transTask.waitForComment,
    transferred_out: transTask.transferredOut
  }
};
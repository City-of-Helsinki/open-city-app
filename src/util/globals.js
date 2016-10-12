module.exports = {
  menuRef: null,              // Global reference for drawer is needed in order to enable 'back to close' functionality
  menuOpen: false,            // True if menu is visible, false otherwise
  isMainView: false,          // True if MainView is displayed, false otherwise
  mainViewRef: null,          // Global reference for MainView is needed to enable marker popup closing with back button
};
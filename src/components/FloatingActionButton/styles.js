import { StyleSheet } from 'react-native';

const BUTTON_WIDTH         = 72;
const BUTTON_HEIGHT        = 72;
const BUTTON_BORDER_RADIUS = 36;

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_BORDER_RADIUS,
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_BORDER_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActionButtonText: {
    fontSize: 16,
  },
  plusIcon: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT
  }
});

export default styles

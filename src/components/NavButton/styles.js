import { StyleSheet } from 'react-native';
import Global from '../../util/globals';

const NAVBAR_HEIGHT = 55;
const ICON_WIDTH    = 22;
const ICON_HEIGHT   = 22;

const styles = StyleSheet.create({
  buttonView: {
    height: NAVBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    height: ICON_HEIGHT,
    width: ICON_WIDTH,
  }
});

export default styles

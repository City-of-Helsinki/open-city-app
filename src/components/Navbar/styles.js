import { StyleSheet, Platform } from 'react-native';
import Global from '../../util/globals';

const NAVBAR_HEIGHT = 55;
const ICON_WIDTH    = 22;
const ICON_HEIGHT   = 22;

const styles = StyleSheet.create({
  container: {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: Global.COLOR.LIGHT_GREY,
    borderBottomColor: Global.COLOR.GREY,
    // Shadow
    ...Platform.select({
      ios: {
        borderBottomWidth: 1.5,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  iosStatusBar: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 15,
    backgroundColor: Global.COLOR.LIGHT_GREY,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: ICON_HEIGHT,
  },
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
  },
  headerView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    color: Global.COLOR.BLUE,
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default styles

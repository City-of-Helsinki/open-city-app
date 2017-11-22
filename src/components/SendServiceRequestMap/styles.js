import { StyleSheet, Platform, Dimensions } from 'react-native';
import Global from '../../util/globals';

const MARKER_IMAGE_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mapView: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    position: 'absolute',
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
    left: (Dimensions.get('window').width / 2) - (MARKER_IMAGE_SIZE / 2)
  },
  doneButton: {
    marginTop: -64,
    marginLeft: Dimensions.get('window').width / 2 - 42,
    height: 46,
    width: 96,
    backgroundColor: Global.COLOR.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: Global.COLOR.BLACK,
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  doneButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default styles

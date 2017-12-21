import { StyleSheet }       from 'react-native';
import Global               from '../../util/globals';

const MARKER_IMAGE_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
  },
  mapContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  map: {
    flex: 1,
  },
  markerImage: {
    height: MARKER_IMAGE_SIZE,
    width: MARKER_IMAGE_SIZE,
  },
  headerLogo: {
    height: 26
  }
});

export default styles

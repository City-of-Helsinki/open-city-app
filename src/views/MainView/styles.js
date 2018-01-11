import { StyleSheet }       from 'react-native';
import Global               from '../../util/globals';
import { BRAND_DARK_ONE }   from '../../styles/common';
const MARKER_IMAGE_SIZE = 22;

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
    alignSelf: 'center',
    height: 26
  },
  icon: {
    height: 26,
    width: 26
  },
  clusterContainer: {
    borderWidth: 1,
    alignItems: 'center',
    borderColor: BRAND_DARK_ONE,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  counterText: {
    fontSize: 16,
    color: BRAND_DARK_ONE,
    fontWeight: '400'
  }
});

export default styles

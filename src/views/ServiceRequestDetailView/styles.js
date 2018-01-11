import { StyleSheet, Dimensions } from 'react-native';
import Global                     from '../../util/globals';

// Margin for the view containing status notes about the service request
const RESPONSE_VIEW_OFFSET = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Global.COLOR.LIGHT_GREY,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalScrollView: {
    marginTop: 16,
  },
  map: {
    height: 96,
    width: 192,
    marginLeft: 8
  },
  markerIcon: {
    height: 32,
    width: 32
  },
  image: {
    height: 96,
    width: 96,
    marginLeft: 8,
    marginRight: 8,
  },
  descriptionView: {
    width: Dimensions.get('window').width,
    padding: 16,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: Global.COLOR.BLACK
  },
  descriptionText: {
    fontSize: 14,
    color: Global.COLOR.BLACK
  },
  responseView: {
    width: Dimensions.get('window').width - RESPONSE_VIEW_OFFSET,
    alignSelf: 'flex-end',
    backgroundColor: Global.COLOR.LIGHT_BLUE,
    padding: 16,
    borderLeftWidth: 2,
    borderLeftColor: Global.COLOR.BLUE
  },
  responseText: {
    fontSize: 12,
    color: Global.COLOR.BLUE
  },
  statusView: {
    width: Dimensions.get('window').width,
    padding: 16,
  },
  statusText: {
    fontSize: 14,
    color: Global.COLOR.WARM_GREY,
    flexWrap: 'wrap',
    flex: 1
  },
  extendedDataItemContainer: {
    flexDirection: 'column',
  },
  extendedDataItemView: {
    flex: 1,
  },
  headerLogo: {
    alignSelf: 'center',
    height: 26
  }
});

export default styles

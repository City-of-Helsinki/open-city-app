import { StyleSheet, Platform, Dimensions } from 'react-native';
import Global from '../../util/globals';

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  enableLocationView: {
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxViewContainer: {
    height: 32,
    width: 32,
  },
  checkboxView: {
    height: 32,
    width: 32,
    borderRadius: 3,
    backgroundColor: Global.COLOR.BLUE,
  },
  checkboxLabel: {
    color: Global.COLOR.BLACK,
    flexWrap: 'wrap',
    flex: 1,
    fontSize: 16,
  },
  picker: {
    ...Platform.select({
      ios: {
        marginLeft: 0,
        marginBottom: 8,
      },
      android: {
        marginLeft: -8, // Align picker text with rest of the content
      },
    }),
  },
  categoryText: {
    ...Platform.select({
      ios: {
        marginBottom: 4,
      },
      android: {
        marginBottom: -8, // Align picker text with rest of the content
      },
    }),
  },
  helpText: {
    color: Global.COLOR.STEEL_GREY,
    fontSize: 12,
    fontWeight: 'bold'
  },
  titleView: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 32
  },
  titleText: {
    backgroundColor: Global.COLOR.WARM_GREY_10,
    height: 40,
    padding: 8,
  },
  descriptionView: {
    flexDirection: 'column',
    marginTop: 8,
  },
  descriptionText: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: Global.COLOR.WARM_GREY_10,
    textAlignVertical: 'top',
    padding: 8,
  },
});

export default styles

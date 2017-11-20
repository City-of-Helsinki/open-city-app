import { StyleSheet, Dimensions, Platform } from 'react-native';
import Global                               from '../../util/globals';

const SIDE_PADDING = 20;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Global.COLOR.WHITE,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  versionText: {
    color: Global.COLOR.WHITE,
    fontWeight: 'bold',
    fontSize: 22,
    backgroundColor: Global.COLOR.TRANSPARENT,
  },
  modalContainer: {
    width: Dimensions.get('window').width - SIDE_PADDING,
    backgroundColor: Global.COLOR.WHITE,
    flexDirection: 'column',
    padding: 20,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: Global.COLOR.BLACK,
        shadowOffset: {width: 2, height: 1},
        shadowOpacity: 0.9,
        shadowRadius: 4,
      },
      android: {
        elevation: 7,
      }
    }),
  },
  textContainer: {
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: 'center',
  },
  modalText: {
    color: Global.COLOR.BLUE,
    textAlign: 'center'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  modalDescription: {
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxViewContainer: {
    height: 32,
    width: 32,
  },
  checkboxView: {
    height: 32,
    width: 32,
    backgroundColor: Global.COLOR.BLUE,
    borderRadius: 3,
  },
  checkboxLabel: {
    color: Global.COLOR.BLACK,
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 20,
  },
  checkboxImage: {
    height: 32,
    width: 32,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    backgroundColor: Global.COLOR.BLUE,
    marginTop: 20,
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
  closeButtonView: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Global.COLOR.WHITE,
    fontSize: 18,
    fontWeight: 'bold'
  }

});

export default styles

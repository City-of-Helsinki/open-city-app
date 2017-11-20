import { StyleSheet, Dimensions, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'column',
  },
  photoViewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoView: {
    ...Platform.select({
      android: {
        height: Dimensions.get('window').height - 55 // Take Navbar into account,
      },
      ios: {
        height: Dimensions.get('window').height - 70 // Take Navbar and statusbar into account,
      }
    }),
    width: Dimensions.get('window').width,
  }
});

export default styles

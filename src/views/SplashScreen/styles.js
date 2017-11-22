import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  splashImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 24,
    left: Dimensions.get('window').width / 2 - 25,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles

import { StyleSheet } from 'react-native';
import Global         from '../../util/globals'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.COLOR.LIGHT_GREY
  },
  innerContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  checkboxImage: {
    height: 32,
    width: 32,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#00000040'
  }
});

export default styles

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: '#cccccc',
    alignContent: 'flex-start',
    flexDirection: 'column',
  },
  heroImage: {
    width: undefined,
    height: 250,
  },
  heroOverlay: {
    backgroundColor: '#ffc61e',
    padding: 20,
  },
  heroHeadline: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  heroPlace: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  heroDate: {
    fontSize: 18,
  }
});

export default styles

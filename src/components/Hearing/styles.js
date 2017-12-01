import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  hearingWrapper: {
    flex: 1
  },
  hearingImage: {
    width: undefined,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  hearingOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10
  },
  hearingHeadline: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default styles

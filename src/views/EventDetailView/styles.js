import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: undefined,
    height: 250
  },
  centeredContent: {
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  headline: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 10
  },
  description: {
    paddingVertical: 20
  },
  map: {
    height: 250,
    width: Dimensions.get("window").width
  }
})

export default styles

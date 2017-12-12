import { StyleSheet, Dimensions } from 'react-native';
import { TEXT_MEDIUM_HEADLINE, FONT_NORMAL, TEXT_LARGE_HEADLINE, FONT_BOLD } from './../../styles/text';
import { BRAND_LIGHT_ONE, WHITE } from './../../styles/common';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    backgroundColor: '#FFF'
  },
  image: {
    width: undefined,
    height: 250
  },
  headerImage: {
    marginBottom: 30
  },
  headerImageDecoration: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
  },
  centeredContent: {
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  headline: TEXT_MEDIUM_HEADLINE,
  date: FONT_BOLD,
  description: FONT_NORMAL,
  textBlockNarrow: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    paddingBottom: 10,
    textAlign: 'center'
  },
  textBlock: {
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    height: 250,
    width: Dimensions.get("window").width
  }
})

export default styles
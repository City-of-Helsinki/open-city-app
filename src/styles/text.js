import {Platform} from 'react-native';

// we define available font weight and styles for each font
const font = {
  HelsinkiGrotesk: {
    familyIOS: 'Helsinki Grotesk',
    weights: {
      Black: '800',
      Bold: '700',
      Medium: '600',
      Regular: '400'
    },
    styles: {
      Italic: 'italic'
    }
  }
}

// generate styles for a brand font with given weight and style
// iOS and Android define font styles differently, fontMaker returns the correct format depending on the platform
// https://hiddentao.com/archives/2017/03/10/get-custom-fonts-working-in-react-native/

export const getFontName = (options = {}) => {
  let { weight, style, family } = Object.assign({
    weight: null,
    style: null,
    family: 'HelsinkiGrotesk'
  }, options)

  const { familyIOS, weights, styles } = font[family]

  if (Platform.OS === 'android') {
    weight = weights[weight] ? weight : ''
    style = styles[style] ? style : ''

    const suffix = weight + style

    return {
      fontFamily: family + (suffix.length ? `-${suffix}` : '')
    }
  } else {
    weight = weights[weight] || weights.Normal
    style = styles[style] || 'normal'
    family = familyIOS

    return {
      fontFamily: family,
      fontWeight: weight,
      fontStyle: style
    }
  }
}

// Fonts, defined as style objects
export const FONT_NORMAL =
      Object.assign(
        getFontName(),
        {
          fontSize:16,
        }
      );
export const FONT_BOLD =
      Object.assign(
        getFontName({ weight: 'Bold' }),
        {
          fontSize:16,
        }
      );
export const TEXT_XSMALL_HEADLINE =
      Object.assign(
        getFontName({ weight: 'Bold' }),
        {
          fontSize:16,
        }
      );
export const TEXT_SMALL_HEADLINE =
      Object.assign(
        getFontName({ weight: 'Bold' }),
        {
          fontSize:20,
        }
      );
export const TEXT_MEDIUM_HEADLINE =
      Object.assign(
        getFontName({ weight: 'Bold' }),
        {
          fontSize:30,
        }
      );
export const TEXT_LARGE_HEADLINE =
      Object.assign(
        getFontName({ weight: 'Bold' }),
        {
          fontSize:40,
          lineHeight: 30,
          paddingTop: 10
        }
      );

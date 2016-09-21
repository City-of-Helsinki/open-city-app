import LocalizedStrings from 'react-native-localization';

export default new LocalizedStrings({
  en:{
    networkErrorTitle: 'Network error',
    networkErrorMessage: 'Something went wrong.',
    networkErrorButton: 'OK',
    gpsErrorTitle: 'GPS error',
    gpsErrorMessage: 'Something went wrong when trying to locate your position.',
    gpsErrorButton: 'OK',
  },
  fi: {
    networkErrorTitle: 'Yhteysvirhe',
    networkErrorMessage: 'Virhe tapahtui.',
    networkErrorButton: 'OK',
    gpsErrorTitle: 'GPS virhe',
    gpsErrorMessage: 'Jotain meni vikaan GPS-yhteydessä.',
    gpsErrorButton: 'OK',
  }
});
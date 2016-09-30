import LocalizedStrings from 'react-native-localization';

export default new LocalizedStrings({
  en:{
    networkErrorTitle: 'Network error',
    networkErrorMessage: 'Something went wrong.',
    networkErrorButton: 'OK',
    gpsErrorTitle: 'GPS error',
    gpsErrorMessage: 'Something went wrong when trying to locate your position.',
    gpsErrorButton: 'OK',
    attachmentErrorTitle: 'Attachment error',
    attachmentErrorMessage: 'Something went wrong while trying to attach an image.',
    attachmentErrorButton: 'OK',
  },
  fi: {
    networkErrorTitle: 'Yhteysvirhe',
    networkErrorMessage: 'Virhe tapahtui.',
    networkErrorButton: 'OK',
    gpsErrorTitle: 'GPS virhe',
    gpsErrorMessage: 'Jotain meni vikaan GPS-yhteydessä.',
    gpsErrorButton: 'OK',
    attachmentErrorTitle: 'Liite virhe',
    attachmentErrorMessage: 'Jotain meni vikaan kuvan liittämisen yhteydessä.',
    attachmentErrorButton: 'OK',
  },
});
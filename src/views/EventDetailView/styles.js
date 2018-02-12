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
  },
  headerLogo: {
    alignSelf: 'center',
    height: 26
  },
  markerIcon: {
    height: 30,
    width: 30
  }
})

const customMapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e9f2fe"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0071c6"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#feffff"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e7927"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#d0e3f8"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0071c6"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#d9eafe"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0071c6"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0071c6"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0072c6"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#feffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0071c6"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#0071c6"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#9fc9eb"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#feffff"
      }
    ]
  }
]


export {
  styles,
  customMapStyles
}

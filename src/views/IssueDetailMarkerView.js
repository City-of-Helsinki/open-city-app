import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  LayoutAnimation
} from 'react-native';

//import Spinner from 'react-native-loading-spinner-overlay';
import Drawer  from 'react-native-drawer'

import Navbar  from './../components/Navbar';
import Spinner from './../components/Spinner';
import Menu    from './../components/Menu';
import Util    from './../util/util';

import closeIcon    from '../img/close_image.png';
import distanceIcon from '../img/location_marker.png';
import downIcon     from '../img/collapse_down.png';
import upIcon       from '../img/collapse_up.png';

import transList    from '../translations/list';

const SIDE_PADDING           = 48;
const TOP_MARGIN             = Platform.OS === 'android' ? 60 : 75;
const BOTTOM_MARGIN          = 280;
const CLOSE_ICON_HEIGHT      = 24;
const CLOSE_ICON_WIDTH       = 24;
const CONTAINER_MAX_HEIGHT   = Dimensions.get('window').height - TOP_MARGIN - BOTTOM_MARGIN;
// If distance is over 500km, something is not right
const MAX_DISTANCE_THRESHOLD = 500000;

// Popup which will be shown when a map marker is clicked
class IssueDetailMarkerView extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      showStatusNotes: false,
    };

    transList.setLanguage('fi');
  }

  showStatusNotesClick() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      showStatusNotes: !this.state.showStatusNotes,
    });

    // Prevent empty space from appearing on the bottom on android
    if (this.state.showStatusNotes && Platform.OS === 'ios') {
      this.scrollView.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  render() {
    var image = this.props.data.media_url !== null ?
                <View style={styles.imageView}>
                  <Image source={{uri: this.props.data.media_url}} style={styles.image} />
                </View> : null;
    var distance = this.props.data.distance > 0 && this.props.data.distance < MAX_DISTANCE_THRESHOLD ?
            <View style={styles.distanceContainer}>
              <Image
                style={styles.distanceIcon}
                source={distanceIcon} />
              <Text>{this.props.data.distance}m</Text>
            </View> : null;

    var statusButtonText = this.state.showStatusNotes ? transList.hideStatusNotes : transList.showStatusNotes;
    var statusNotes      = this.state.showStatusNotes ?
                           <View>
                             <Text style={[styles.statusNotesText, styles.textFont]}>{this.props.data.status_notes}</Text>
                           </View> : null;
    var statusButtonIcon = this.state.showStatusNotes ? upIcon : downIcon;

    return (
      <View style={styles.container}>
        <View style={styles.spinnerContainer}>
          <Spinner color={'black'} visible={this.props.isLoading} />
        </View>
        <ScrollView ref={ref => this.scrollView = ref}>
          <View style={styles.issueContainer}>
            {image}
            <View style={styles.textContainer}>
              <View style={styles.subjectView}>
                <Text style={[styles.text, styles.textFont, styles.title]}>{this.props.data.title}</Text>
              </View>
              <View style={styles.summaryView}>
                <Text style={[styles.text, styles.textFont]}>{this.props.data.description}</Text>
              </View>
              <View style={[styles.detail, styles.rowContainer]}>
                {distance}
                <Text style={[styles.infoText, styles.textFont]}>{this.props.data.date}</Text>
              </View>
              <View style={styles.paddingContainer}>
                <View style={styles.statusNotesContainer}>
                  {statusNotes}
                  {typeof this.props.data.status_notes !== 'undefined' &&
                    <TouchableWithoutFeedback onPress={this.showStatusNotesClick.bind(this)}>
                      <View style={styles.statusButtonView}>
                        <Text style={[styles.statusButtonText, styles.textFont]}>{statusButtonText}</Text>
                        <Image style={styles.statusButtonImage} source={statusButtonIcon} />
                      </View>
                    </TouchableWithoutFeedback>
                  }
                </View>
                <View style={styles.extendedDataContainer}>
                  {this.props.data.extendedData.map((item) => (
                    <View style={styles.extendedDataItemContainer}>
                      <View>
                        <Text style={[styles.stateText, styles.textFont]}>{item.state}</Text>
                      </View>
                      <View style={[styles.detail, styles.extendedDataRowContainer]}>
                        <Text style={[styles.detailText, styles.textFont]}>{item.agency}</Text>
                        <Text style={[styles.detailText, styles.textFont, styles.detailDateText]}>{item.date}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableWithoutFeedback onPress={this.props.onExitClick}>
          <Image
            source={closeIcon}
            style={styles.closeIcon}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Dimensions.get('window').height / 4,
    left: SIDE_PADDING / 2,
    height: CONTAINER_MAX_HEIGHT,
    width: Dimensions.get('window').width - SIDE_PADDING,
    backgroundColor: '#fff',
    borderColor: '#EEEEEE',
    borderWidth: 3,
    borderRadius: 5,
  },
  spinnerContainer: {
    position: 'absolute',
    height: 50,
    width: 50,
    top: CONTAINER_MAX_HEIGHT / 2 - 25,
    left: Dimensions.get('window').width / 2 - SIDE_PADDING / 2 - 25,
  },
  issueContainer: {
    flexDirection: 'column',
  },
  textContainer: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  imageView: {
    marginBottom: 5,
  },
  image: {
    height: 270,
    width: Dimensions.get('window').width - SIDE_PADDING,
  },
  paddingContainer: {
    paddingLeft: 20,
  },
  statusButtonImage: {
    marginLeft: 5,
    height: 15,
    width: 15,
  },
  statusNotesText: {
    fontStyle: 'italic',
  },
  statusButtonView: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#546E7A',
    textAlign: 'left',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    height: 12,
    width: 12,
  },
  subjectView: {
    marginBottom: 20,
    paddingRight: CLOSE_ICON_WIDTH,
  },
  summaryView: {
    marginBottom: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    height: CLOSE_ICON_HEIGHT,
    width: CLOSE_ICON_WIDTH,
  },
  text: {
    color: '#212121',
  },
  title: {
    fontWeight: 'bold'
  },
  infoText: {
    color: '#757575',
  },
  stateText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#212121',
  },
  extendedDataContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  extendedDataRowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
    color: '#757575',
    flexWrap: 'wrap',
    flex: 1,
  },
  detailDateText: {
    textAlign: 'right',
  },
  textFont: {
    fontFamily: 'montserrat',
  }
});

module.exports = IssueDetailMarkerView

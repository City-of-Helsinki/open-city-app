import React, {
  Component,
  View,
  Text
} from 'react-native';

import NavBar from '../NavBar/NavBar';
import ActivityIndicator from '../ActivityIndicator';

import translationsGeneral from '../../translations/general';
import translationsServiceRequest from '../../translations/serviceRequest';

import { formStyles as styles } from './styles';

class ServiceRequestForm extends Component {
  /**
   * @constructor
   */
  constructor() {
    super();

    this.state = {

    };
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <View style={styles.container}>
        <NavBar title={{title: translationsServiceRequest.serviceRequestFormTitle}}
                leftButton={{
                  source: require('../../images/arrow-right.png'),
                  handler: () => {this.props.navigator.pop();}
                }}
        />
      </View>
    );
  }
}

export default ServiceRequestForm;
import React, {
  Component,
  ActivityIndicatorIOS
} from 'react-native';

class ActivityIndicator extends Component {
  render() {
    return (<ActivityIndicatorIOS style={this.props.style} />);
  }
}

export default ActivityIndicator;

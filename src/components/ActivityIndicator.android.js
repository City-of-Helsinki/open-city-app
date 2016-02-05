import React, {
  Component,
  ProgressBarAndroid
} from 'react-native';

class ActivityIndicator extends Component {
  render() {
    return (<ProgressBarAndroid style={this.props.style} />);
  }
}

export default ActivityIndicator;

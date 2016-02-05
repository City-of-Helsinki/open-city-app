import React, {
  Component,
  View,
  Text,
} from 'react-native';
import {forEach} from 'lodash';

import {findAgendaItemByIssueId} from '../../helpers/agendaItem';

import {agendaItemStyles as styles} from './styles';

class IssueAgendaItems extends Component {
  /**
   * @constructor
   */
  constructor() {
    super();

    this.state = {
      agendaItems: null,
      isLoading: false
    };
  }

  /**
   *
   */
  componentWillMount() {
    this.setState({
      isLoading: true
    });

    findAgendaItemByIssueId({ issue: this.props.issue.id })
      .then((result) => {
        console.log('findAgendaItemByIssueId result:', result);

        if (result.data.objects) {
          this.setState({
            isLoading: false,
            agendaItems: result.data.objects
          });
        }
      });
  }

  /**
   *
   * @returns {Array}
   */
  renderAgendaItems() {
    let output = [];

    forEach(this.state.agendaItems, (agendaItem, agendaItemKey) => {
      forEach(agendaItem.content, (content, contentKey) => {
        output.push((
          <View key={'agenda-item-'+agendaItemKey+'-content-'+contentKey} style={styles.agendaItem}>
            <Text>{content.text}</Text>
          </View>
        ));
      });
    });

    return output;
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <View style={styles.container}>
        {this.renderAgendaItems()}
      </View>
    );
  }
}

export default IssueAgendaItems;

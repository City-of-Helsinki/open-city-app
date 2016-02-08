import React, {
  Component,
  View,
  Text,
} from 'react-native';
import {forEach} from 'lodash';
import HTMLWebView from 'react-native-html-webview';

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

    findAgendaItemByIssueId({issue: this.props.issue.id})
      .then((result) => {
        console.log('findAgendaItemByIssueId result:', result);

        if (result.data.objects) {
          this.setState({
            isLoading: false,
            agendaItems: result.data.objects,
          });
        }
      });
  }

  /**
   *
   * @returns {Array}
   */
  renderAgendaItems() {
    let html = `
      <style>
          body, html {
          padding: 0;
          margin: 0;
          font-family: GothamRounded-Bold, sans-serif;
          font-size: 16px;
          font-weight: 300;
        }
      </style>
    `;

    forEach(this.state.agendaItems, (agendaItem) => {
      forEach(agendaItem.content, (content) => {
        html += content.text;
      });
    });

    return (
      <View style={styles.agendaItem}>
        <HTMLWebView
          scalesPageToFit={false}
          makeSafe={true}
          autoHeight={true}
          html={html}
        />
      </View>
    );
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

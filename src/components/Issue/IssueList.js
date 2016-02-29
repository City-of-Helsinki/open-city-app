import React, {
  Component,
  View,
  Text,
  ListView,
  StyleSheet,
  RefreshControl
} from 'react-native';

import {concat} from 'lodash';

import NavBar from '../NavBar/NavBar';
import IssueRow from '../Issue/IssueRow';
import IssueDetail from '../Issue/IssueDetail';

import translationsGeneral from '../../translations/general';
import translationsIssue from '../../translations/issue';

import {findIssues, setIssuesNotified} from '../../helpers/issue';
import {calculateBoundingBox, comparePositions} from '../../helpers/map';
import {COLOR_BLUE} from '../../constants/color';

const PAGE_SIZE = 20;

import {listStyles as styles} from './styles';

/**
 *
 */
class IssueList extends Component {
  /**
   *
   */
  constructor() {
    super();

    translationsGeneral.setLanguage('fi');
    translationsIssue.setLanguage('fi');

    this.watchID = null;

    this.state = {
      position: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => {
          return r1.id !== r2.id;
        }
      }),
      pageNumber: 0,
      lastPage: false,
      isRefreshing: false
    };
  }

  /**
   *
   */
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        if (position) {
          this.setState({position});
        }
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition(position => {
      if (position) {
        this.setState({position});
      }
    });
  }

  /**
   *
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate(nextProps, nextState) {
    if ((!this.state.position && nextState.position) || comparePositions(this.state.position, nextState.position)) {
      this.loadIssues(nextState.position);
    }
  }

  /**
   *
   */
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  /**
   *
   * @param position
   */
  loadIssues(position) {
    if (!this.state.lastPage && !this.state.isLoading && position) {
      this.setState({
        isLoading: true
      });

      findIssues({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        distance: 1000,
        order_by: '-latest_decision_date',
        page: this.state.pageNumber + 1,
        limit: PAGE_SIZE
      })
        .then(result => {
          console.log('findIssues result:', result);

          if (result.data.objects) {
            const rows = concat(this.state.rows, result.data.objects);

            this.setState({
              rows: rows,
              dataSource: this.state.dataSource.cloneWithRows(rows),
              pageNumber: this.state.pageNumber + 1,
              lastPage: result.data.objects.length < PAGE_SIZE,
              isLoading: false
            });

            setIssuesNotified(rows);
          }
        })
        .catch(err => alert(err));
    }
  }

  /**
   *
   * @param issue
   */
  handlePress(issue) {
    this.props.navigator.push({
      component: IssueDetail,
      passProps: {
        issue: issue,
        position: this.state.position
      }
    });
  }

  /**
   *
   * @param position
   */
  onRefresh(position) {
    this.setState({
      isRefreshing: true,
      isLoading: true
    });

    findIssues({
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      distance: 1000,
      order_by: '-latest_decision_date',
      page: 1,
      limit: PAGE_SIZE
    })
      .then(result => {
        if (result.data.objects) {
          const rows = result.data.objects;

          this.setState({
            rows: rows,
            dataSource: this.state.dataSource.cloneWithRows(rows),
            pageNumber: 1,
            lastPage: false,
            isRefreshing: false,
            isLoading: false
          });

          setIssuesNotified(rows);
        }
      })
      .catch(err => alert(err));
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    const position = this.state.position;

    return (
      <View style={styles.container}>
        <NavBar title={{title: translationsIssue.issueListTitle}}/>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={issue => <IssueRow issue={issue} position={position} onPress={this.handlePress.bind(this)} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          onEndReached={this.loadIssues.bind(this, position)}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this, position)}
              tintColor={COLOR_BLUE}
              title={translationsGeneral.loading}
            />
        }/>
      </View>
    );
  }
}

export default IssueList;

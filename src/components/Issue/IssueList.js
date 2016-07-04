import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  ListView,
  StyleSheet,
  RefreshControl,
  AppState,
  PushNotificationIOS,
} from 'react-native';

import { concat } from 'lodash';

import NavBar from '../NavBar/NavBar';
import IssueRow from '../Issue/IssueRow';
import IssueDetail from '../Issue/IssueDetail';

import translationsGeneral from '../../translations/general';
import translationsIssue from '../../translations/issue';

import { findIssues, setIssuesNotified } from '../../helpers/issue';
import { calculateBoundingBox, comparePositions } from '../../helpers/map';
import { COLOR_BLUE } from '../../constants/color';

const PAGE_SIZE = 20;

import { listStyles as styles } from './styles';

/**
 *
 */
export default class IssueList extends Component {
  /**
   *
   */
  constructor() {
    super();

    translationsGeneral.setLanguage('fi');
    translationsIssue.setLanguage('fi');

    this.watchID = null;
    this.position = null;

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
          this.setState({ position });
        }
      },
      error => {
        console.log(error);
        alert('Laitteen sijaintia ei pystytty selvittämään.');
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition(position => {
      if (position) {
        this.position = position;
      }
    });

    AppState.addEventListener('change', this.onAppStateChange.bind(this));
  }

  /**
   *
   * @param nextProps
   * @param nextState
   */
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.position && nextState.position) {
      this.loadIssues(nextState.position, true);
    }
  }

  /**
   *
   */
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);

    AppState.removeEventListener('change', this.onAppStateChange);
  }

  /**
   *
   * @param currentAppState
   */
  onAppStateChange(currentAppState) {
    // Update position in state and load issues with the new position, when app is brought back from background.
    if (currentAppState === 'active') {
      const position = this.position;
      this.setState({
        position: position
      });

      this.loadIssues(position, true);
    }
  }

  /**
   *
   * @param position
   * @param reset
   */
  loadIssues(position, reset = false) {
    if (!this.state.lastPage && !this.state.isLoading && position) {
      this.setState({
        isLoading: true
      });

      findIssues({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        distance: 1500,
        order_by: '-latest_decision_date',
        page: reset ? 1 : this.state.pageNumber + 1,
        limit: PAGE_SIZE
      })
        .then(result => {
          console.log('findIssues result:', result);

          if (result.data.objects) {
            let rows = result.data.objects;

            if (!reset) {
              rows = concat(this.state.rows, result.data.objects);
            }

            this.setState({
              rows: rows,
              dataSource: this.state.dataSource.cloneWithRows(rows),
              pageNumber: reset ? 1 : this.state.pageNumber + 1,
              lastPage: result.data.objects.length < PAGE_SIZE,
              isLoading: false
            });

            setIssuesNotified(rows);
          }
        })
        .catch(err => {
          console.log('findIssues error: ', err);
          alert(err.message);
        });
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
   */
  onRefresh() {
    const position = this.position;

    this.setState({
      isRefreshing: true,
      isLoading: true,
      position: position
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
        <NavBar title={{title: translationsIssue.issueListTitle}}
                leftButton={{
                  source: require('../../images/arrow-right.png'),
                  handler: () => {this.props.navigator.pop();}
                }}
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={issue => <IssueRow issue={issue} position={position} onPress={this.handlePress.bind(this)} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          onEndReached={this.loadIssues.bind(this, position)}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh.bind(this)}
              tintColor={COLOR_BLUE}
              title={translationsGeneral.loading}
            />
        }/>
      </View>
    );
  }
}

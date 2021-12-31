import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';

import * as shaefitApi from '../API/shaefitAPI';

const {height, width} = Dimensions.get('window');

class TrackScreen extends Component {
  constructor() {
    super();

    this.state = {
      isSurveysVisible: false,
      unit: 'standard',
    };

    this.gender = '';
    this.userDetails = null;
  }

  async componentDidMount() {
    const userData = await shaefitApi.getUserDetails();
    console.log('userData', userData);

    if (
      typeof userData !== 'undefined' &&
      userData.profile !== 'undefined' &&
      userData.profile.unit !== 'undefined'
    ) {
      this.setState({unit: userData.profile.unit});
      this.userDetails = userData;
    }

    this.gender = userData.profile.gender;

    if (
      typeof userData.hasPilotSurvey !== 'undefined' &&
      userData.hasPilotSurvey === true
    ) {
      // if (typeof userData.survey_data !== "undefined") {
      this.setState({isSurveysVisible: true});
    }
  }

  render() {
    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {this.state.isSurveysVisible && (
          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'pilotSurvey',
              })
            }>
            <View style={[styles.container, {marginTop: 24}]}>
              <View style={styles.innerContainer}>
                <Image source={require('../resources/icon/healthSnaps.png')} />
                <View style={{marginTop: 1, marginLeft: 15}}>
                  <Text style={styles.title}>Health Snaps</Text>
                  <Text style={styles.text}>
                    Snapshots along your health journey
                  </Text>
                </View>

                <Image
                  source={require('../resources/icon/arrowRight.png')}
                  style={{position: 'absolute', right: 0, top: 14}}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'foodDiary',
            })
          }>
          <View style={[styles.container, {marginTop: 16}]}>
            <View style={styles.innerContainer}>
              <Image source={require('../resources/icon/track_food.png')} />
              <View style={{marginTop: 1, marginLeft: 15}}>
                <Text style={styles.title}>Food Diary</Text>
                <Text style={styles.text}>Track your nutritional intake</Text>
              </View>

              <Image
                source={require('../resources/icon/arrowRight.png')}
                style={{position: 'absolute', right: 0, top: 14}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'bodyMeasurements',
              gender: this.gender,
              unit: this.state.unit,
            })
          }>
          <View style={[styles.container, {marginTop: 16}]}>
            <View style={styles.innerContainer}>
              <Image
                source={require('../resources/icon/track_measurements.png')}
              />
              <View style={{marginTop: 1, marginLeft: 15}}>
                <Text style={styles.title}>Body Metrics</Text>
                <Text style={styles.text}>Track your body measurements</Text>
              </View>

              <Image
                source={require('../resources/icon/arrowRight.png')}
                style={{position: 'absolute', right: 0, top: 14}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'wearables',
              userDetails: this.userDetails,
            })
          }>
          <View style={[styles.container, {marginTop: 16}]}>
            <View style={styles.innerContainer}>
              <Image
                source={require('../resources/icon/track_wearables.png')}
              />
              <View style={{marginTop: 1, marginLeft: 15}}>
                <Text style={styles.title}>Wearables</Text>
                <Text style={styles.text}>Track your progress</Text>
              </View>

              <Image
                source={require('../resources/icon/arrowRight.png')}
                style={{position: 'absolute', right: 0, top: 14}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 80,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
    alignSelf: 'center',
  },
  innerContainer: {
    width: width - 82,
    marginLeft: 20,
    marginRight: 22,
    marginTop: 20,
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(31,33,35)',
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
    marginTop: 4,
  },
});

export default TrackScreen;

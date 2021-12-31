import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isIphoneX} from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';
import Dialog, {ScaleAnimation, DialogContent} from 'react-native-popup-dialog';

import {getUserVariables} from '../data/db/Db';
import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';

const {height, width} = Dimensions.get('window');

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

class BodyMeasurements extends Component {
  constructor() {
    super();

    this.state = {
      isHintVisible: false,
    };
  }

  componentDidMount() {
    this.checkMeasurementsPopup();
  }

  checkMeasurementsPopup = async () => {
    let isMeasurementsPopupShown = await AsyncStorage.getItem(
      'isMeasurementsPopupShown',
    );
    isMeasurementsPopupShown = JSON.parse(isMeasurementsPopupShown);

    if (isMeasurementsPopupShown === null) {
      AsyncStorage.setItem('isMeasurementsPopupShown', String(true));
      this.setState({isHintVisible: true});
    }
  };

  render() {
    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <Image
          source={require('../resources/icon/grid.png')}
          style={{position: 'absolute', top: 76, alignSelf: 'center'}}
        />

        {this.props.gender === 'Male' ? (
          <Image
            source={require('../resources/icon/body_male.png')}
            style={{marginTop: 40, alignSelf: 'center'}}
          />
        ) : (
          <Image
            source={require('../resources/icon/body_female.png')}
            style={{marginTop: 40, alignSelf: 'center'}}
          />
        )}

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'bodyMetricsHead',
              gender: this.props.gender,
              unit: this.props.unit,
            })
          }>
          <View style={[styles.container, {width: 143, top: 70, left: 30}]}>
            <Text style={styles.containerText}>Head & Neck</Text>
            <Image
              source={require('../resources/icon/arrowRight_measurements.png')}
              style={{marginLeft: 10, alignSelf: 'center'}}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'bodyMetricsUpperBody',
              gender: this.props.gender,
              unit: this.props.unit,
            })
          }>
          <View style={[styles.container, {width: 136, top: 185, right: 30}]}>
            <Text style={styles.containerText}>Upper Body</Text>
            <Image
              source={require('../resources/icon/arrowRight_measurements.png')}
              style={{marginLeft: 10, alignSelf: 'center'}}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'bodyMetricsArms',
              gender: this.props.gender,
              unit: this.props.unit,
            })
          }>
          <View style={[styles.container, {width: 93, top: 263, left: 30}]}>
            <Text style={styles.containerText}>Arms</Text>
            <Image
              source={require('../resources/icon/arrowRight_measurements.png')}
              style={{marginLeft: 10, alignSelf: 'center'}}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'bodyMetricsLegs',
              gender: this.props.gender,
              unit: this.props.unit,
            })
          }>
          <View style={[styles.container, {width: 89, top: 370, right: 74}]}>
            <Text style={styles.containerText}>Legs</Text>
            <Image
              source={require('../resources/icon/arrowRight_measurements.png')}
              style={{marginLeft: 10, alignSelf: 'center'}}
            />
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() =>
            Actions.details({
              key: 'bodyMetricsFullBody',
              gender: this.props.gender,
              unit: this.props.unit,
            })
          }>
          <View
            style={[
              styles.container,
              {width: 119, top: 496, alignSelf: 'center'},
            ]}>
            <Text style={styles.containerText}>Full Body</Text>
            <Image
              source={require('../resources/icon/arrowRight_measurements.png')}
              style={{marginLeft: 10, alignSelf: 'center'}}
            />
          </View>
        </TouchableWithoutFeedback>

        <Dialog
          visible={this.state.isHintVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isHintVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DialogContent>
            <View
              style={{
                borderRadius: 4,
                backgroundColor: 'rgb(255,255,255)',
                width: width - 75,
                alignSelf: 'center',
              }}>
              <Image
                source={require('../resources/icon/body_avatar_icon.png')}
                style={{marginTop: 41, alignSelf: 'center'}}
              />

              <Text style={styles.hintTitle}>Body Avatar</Text>
              <Text style={styles.hintText}>
                This feature helps you visually track your body changes over
                time (the image shown is not an accurate representation of your
                body)
              </Text>

              <TouchableWithoutFeedback
                onPress={() => this.setState({isHintVisible: false})}>
                <View style={styles.hintButton}>
                  <Text style={styles.hintButtonText}>I Understand</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 18,
    letterSpacing: -0.3,
    color: 'rgb(84,84,84)',
    marginTop: 10,
  },
  container: {
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255)',
  },
  containerText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 14,
    color: 'rgb(31,33,35)',
    marginLeft: 20,
  },
  hintTitle: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    marginTop: 24,
    alignSelf: 'center',
  },
  hintText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.3,
    color: 'rgb(106,111,115)',
    marginTop: 10,
    textAlign: 'center',
    alignSelf: 'center',
    width: width - 135,
  },
  hintButton: {
    width: 140,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintButtonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
});

export default BodyMeasurements;

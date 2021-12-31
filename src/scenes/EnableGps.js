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
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {request, PERMISSIONS} from 'react-native-permissions';

const {height, width} = Dimensions.get('window');

class EnableGps extends Component {
  constructor() {
    super();

    this.state = {};
  }

  onButtonPress = (value) => {
    if (value) {
      request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ).then((result) => {
        Actions.customizing();
      });
    } else {
      Actions.customizing();
    }
  };

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View
        style={{
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <Image
          source={require('../resources/icon/gps_map.png')}
          style={{alignSelf: 'center'}}
        />

        <Text style={styles.title}>Enable GPS Tracking</Text>
        <Text style={styles.text}>
          Shae requires your location to match local food, weather and health
          requirements for your unique body.
        </Text>

        <TouchableWithoutFeedback onPress={() => this.onButtonPress(true)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Allow Here</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => this.onButtonPress(false)}>
          <View style={{marginTop: 16}}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </View>
        </TouchableWithoutFeedback>

        <Text style={styles.bottomText}>You can turn this off at any time</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    marginTop: 30,
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgb(106,111,115)',
    width: width - 95,
    textAlign: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  button: {
    width: 140,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
  dismissText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.3,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
  },
  bottomText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: 'rgb(138,138,143)',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 40,
  },
});

export default EnableGps;

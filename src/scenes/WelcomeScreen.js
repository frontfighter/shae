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
import {isIphoneX} from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';

import {getUserVariables} from '../data/db/Db';
import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';

const {height, width} = Dimensions.get('window');

class WelcomeScreen extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <Image
          source={require('../resources/icon/welcome_image.png')}
          style={{width}}
          resizeMode="cover"
        />

        <View
          style={{
            width,
            height: 292,
            backgroundColor: 'rgb(255,255,255)',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          <Image
            source={require('../resources/icon/logo.png')}
            style={{marginTop: 40}}
          />
          <Text style={styles.title}>Health Without Thinking</Text>

          <TouchableWithoutFeedback onPress={() => Actions.login()}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => Actions.signup()}>
            <View style={styles.signupButton}>
              <Text style={styles.signupButtonText}>
                First Time? Start Here!
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
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
  loginButton: {
    width: width - 80,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 15,
    // letterSpacing: -0.3,
    lineHeight: 22,
    color: 'rgb(255,255,255)',
  },
  signupButton: {
    width: width - 80,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgb(0,168,235)',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 47,
  },
  signupButtonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: 'rgb(0,168,235)',
  },
});

export default WelcomeScreen;

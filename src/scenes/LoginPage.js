/**
 * Created by developercomputer on 07.10.16.
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Alert,
  ImageBackground
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';

import { signIn } from '../redux/actions/auth';

import { screenWidth, screenHeight, statusBarColor } from '../globalStyles';

import LoginInput from '../components/LoginInput';


const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'transparent'
  },
  imgContainer: {
    width: screenWidth,
    height: screenHeight
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoTextContainer: {
    marginTop: 40
  },
  logo: {
    height: 82,
    width: 230
  },
  formContainer: {
    flex: 1,
    justifyContent: 'space-around'
  },
  createAccBtn: {
    justifyContent: 'center',
    backgroundColor: (Platform.OS === 'ios') ? 'transparent' : 'rgba(48,169,229,0.7)',
    height: 55
  },
  text: {
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center',
    // fontFamily: 'Roboto-Light',
    fontSize: 15
  },
  separator: {
    height: 0.5,
    backgroundColor: '#fff',
    marginHorizontal: 20
  },
  loginBtn: {
    backgroundColor: (Platform.OS === 'ios') ? statusBarColor : '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 35,
    marginHorizontal: 20
  },
  forgotPassBtn: {
    height: 35,
    marginHorizontal: 20
  }
});

class LoginPage extends Component {
  static propTypes = {
    signIn: PropTypes.func,
    loader: PropTypes.bool
  };
  state = {
    email: '',
    password: ''
  };
  signIn = () => {
    this.props.signIn({
      email: this.state.email,
      password: this.state.password
    });
  };

  handleCreateAccount = () => {
    if (Platform.OS === 'ios') {
      const urlToOpen = 'https://ph360.me/';
      Linking.canOpenURL(urlToOpen)
        .then((supported) => {
          if (supported) {
            Linking.openURL(urlToOpen);
          } else {
            Alert.alert('Sorry, link is not available for now, try later.');
          }
        });
    } else {
      Actions.registerOffer();
    }
  };

  render() {
    let createBtn = (
      <TouchableOpacity
        style={style.createAccBtn}
        onPress={this.handleCreateAccount}
      >
        <Text style={[style.text, { fontSize: 17 }]}>
          CREATE ACCOUNT
        </Text>
      </TouchableOpacity>
    );
    if (Platform.OS === 'ios') {
      createBtn = null;
    }
    return (
      <View style={style.container}>
        <ScrollView scrollEnabled={false}>
          <ImageBackground
            source={require('../resources/login-background-woman.png')}
            style={style.imgContainer}
          >
            <View style={style.logoContainer}>
              <Image
                source={require('../resources/pimgpsh_fullsize_distr.png')}
                style={style.logo}
              />
              <View style={style.logoTextContainer}>
                <Text style={style.text}>PLEASE LOGIN USING</Text>
                <Text style={style.text}>YOUR SHAE OR PH360 ACCOUNT</Text>
              </View>
            </View>
            <KeyboardAvoidingView
              style={[style.formContainer, { justifyContent: 'center' }]}
              behavior="padding"
            >
              <LoginInput
                source={require('../resources/icon/email_corrected.png')}
                onChangeText={text => this.setState({ email: text })}
                placeholder="Email"
              />
              <View style={style.separator} />
              <LoginInput
                source={require('../resources/icon/lock_corrected.png')}
                onChangeText={text => this.setState({ password: text })}
                placeholder="Password"
                secureTextEntry
              />
            </KeyboardAvoidingView>
            <View style={style.formContainer}>
              <TouchableOpacity style={style.loginBtn} onPress={this.signIn}>
                <Text style={[style.text, { fontSize: 17, color: (Platform.OS === 'ios') ? '#fff' : '#30a9e5' }]}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.forgotPassBtn}
                onPress={Actions.forgotPassword}
              >
                <Text style={[style.text, { fontWeight: (Platform.OS === 'ios') ? '600' : '200' }]}>
                  FORGOT PASSWORD?
                </Text>
              </TouchableOpacity>
            </View>
            {createBtn}
          </ImageBackground>
        </ScrollView>
        <Spinner visible={this.props.loader} />
      </View>
    );
  }
}

export default connect(
  state => ({ loader: state.loader }),
  dispatch => bindActionCreators({ signIn }, dispatch)
)(LoginPage);

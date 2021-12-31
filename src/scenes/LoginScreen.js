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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isIphoneX} from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';
import FloatingLabelInput2 from '../components/FloatingLabelInput2';
import {
  getDbToken,
  createOrUpdateRealm,
  getUserVariables,
  readRealmRows,
} from '../data/db/Db';
import {signIn} from '../redux/actions/auth';

const {height, width} = Dimensions.get('window');

class LoginScreen extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      value: '',
      emailError: '',
      passwordError: '',
      isApiError: false,
      isLoading: false,

      apiErrorPosition: new Animated.Value(-44),
    };
  }

  slide = () => {
    try {
      if (this.state.isApiError) {
        Animated.spring(this.state.apiErrorPosition, {
          toValue: 0,
        }).start();
      } else {
        Animated.spring(this.state.apiErrorPosition, {
          toValue: -44,
        }).start();
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handlePress = async () => {
    try {
      await this.validateFields();

      if (this.state.emailError === '' && this.state.passwordError === '') {
        this.setState({isLoading: true});

        const data = await api.getToken({
          email: this.state.email,
          password: this.state.password,
        });
        if (typeof data !== 'undefined') {
          // this.props.getToken(this.state.email, this.state.password);
          await this.signIn();
          await this.fetchGetToken();
          setTimeout(() => {
            this.setState({isLoading: false});
          }, 6000);
        } else {
          this.setState({isApiError: true, isLoading: false});
          this.slide();
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  fetchGetToken = async () => {
    const token = getDbToken();
    console.log('realm token', token);

    if (token === null) {
      let data = await AsyncStorage.getItem('apiToken');
      console.log('Token', JSON.parse(data));
      createOrUpdateRealm('Token', JSON.parse(data));

      let subscription = null;
      try {
        let userData = await api.getUserDetails();

        userData.measurementsUpdated =
          userData.measurementsUpdated === false
            ? null
            : userData.measurementsUpdated;
        console.log('userData', userData);

        subscription = userData.subscription;

        if (typeof userData !== 'undefined') {
          let userVariables = getUserVariables();

          if (typeof userVariables !== 'undefined' && userVariables !== null) {
            userVariables = JSON.parse(JSON.stringify(userVariables));
          }

          let hraSchemaUpdateTime;
          let hraSchemaData;

          const isNewUser =
            userData.allhraanswered === 1 &&
            userData.allmeasurementsupplied === 1
              ? false
              : true;

          if (!isNewUser) {
            try {
              const hraData = await api.getHraSchema(1);

              if (typeof hraData !== 'undefined') {
                hraSchemaUpdateTime = hraData.updated_at;
                hraSchemaData = hraData.data;
                console.log('hraSchemaUpdateTime', hraSchemaUpdateTime);
                console.log('hraSchemaData', hraSchemaData);
              }
            } catch (e) {
              console.log('getHraSchemaFailure saga failure', e);
            }
          }

          if (typeof userVariables !== 'undefined' && userVariables !== null) {
            userVariables.isGpsEnabled = 0;
            userVariables.isNewUser = isNewUser ? true : false;
            userVariables.isHraFilled =
              userData.allhraanswered === 1 ? true : false;
            userVariables.isMeasurementUnitSelected =
              userData.allmeasurementsupplied === 1 ? true : false;
            userVariables.isMembershipValid =
              userData.terms_agreed === 1 ? true : false;

            if (!isNewUser) {
              if (
                typeof hraSchemaUpdateTime !== 'undefined' &&
                typeof hraSchemaData !== 'undefined'
              ) {
                userVariables.hraSchemaUpdateTime = hraSchemaUpdateTime;
                userVariables.hraSchemaData = hraSchemaData;
              }
            }

            createOrUpdateRealm('UserVariables', userVariables);
            console.log('realm userVariables', userVariables);
          } else {
            createOrUpdateRealm('UserVariables', {
              isGpsEnabled: 0,
              isNewUser: isNewUser ? true : false,
              isHraFilled: userData.allhraanswered === 1 ? true : false,
              isMeasurementUnitSelected:
                userData.allmeasurementsupplied === 1 ? true : false,
              isMembershipValid: userData.terms_agreed === 1 ? true : false,
              hraSchemaUpdateTime:
                typeof hraSchemaUpdateTime !== 'undefined'
                  ? hraSchemaUpdateTime
                  : null,
              hraSchemaData:
                typeof hraSchemaData !== 'undefined' ? hraSchemaData : null,
            });
            console.log('realm userVariables', userVariables);
          }

          if (userData.profile.unit === '') {
            userData.profile.unit = 'metric';
          }

          createOrUpdateRealm('UserDetails', userData);
          readRealmRows('UserVariables');
          readRealmRows('UserDetails');
        }
      } catch (e) {
        console.log('getUserDetails saga failure', e);
      }
    }
  };

  signIn = async () => {
    await this.props.signIn({
      email: this.state.email,
      password: this.state.password,
      isNewFlow: true,
    });

    Actions.dashboard();
  };

  /**
   * Check one field on errors.
   */
  validateField = (name, value) => {
    try {
      this.setState({[name]: value});

      const error =
        name === 'email' ? 'Email address is required' : 'Password is required';

      if (value === '') {
        this.setState({[name + 'Error']: error});
      } else {
        this.setState({[name + 'Error']: ''});
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Check all fields on errors.
   */
  validateFields = () => {
    try {
      if (this.state.email === '') {
        this.setState({emailError: 'Email address is required'});
      }

      if (this.state.password === '') {
        this.setState({passwordError: 'Password is required'});
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handleTextChange = (newText) => this.setState({value: newText});

  onResetPasswordPress = () => {
    Actions.resetPassword();
  };

  render() {
    let {email, password} = this.state;

    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <Animated.View
          style={{
            backgroundColor: 'rgb(252,245,245)',
            width,
            height: isIphoneX() ? 44 + 34 : 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: this.state.apiErrorPosition,
          }}>
          <Text
            style={[
              styles.errorText,
              isIphoneX() && {position: 'absolute', bottom: 16},
            ]}>
            Invalid email or password.
          </Text>
        </Animated.View>

        <View>
          <Image
            source={require('../resources/icon/background_login.png')}
            style={{width}}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 64,
              alignSelf: 'center',
            }}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.text}>Please log into your account </Text>
          </View>

          <TouchableWithoutFeedback onPress={() => Actions.pop()}>
            <View
              style={{
                position: 'absolute',
                bottom: isIphoneX() ? 128 : 148,
                left: 16,
              }}>
              <Image
                source={require('../resources/icon/back_arrow.png')}
                style={{
                  width: 12,
                  height: 21,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <FloatingLabelInput2
          label={'Email Address'}
          value={this.state.email}
          onChangeText={(email) => this.validateField('email', email)}
          width={width - 40}
          marginTop={24}
          phoneInputType={false}
          type="emailAddress"
          keyboard="email-address"
          error={this.state.emailError}
          isApiError={this.state.isApiError}
        />

        <FloatingLabelInput2
          label="Password"
          value={this.state.password}
          onChangeText={(password) => this.validateField('password', password)}
          secureEntry={true}
          width={width - 40}
          marginTop={20}
          type="password"
          secureEntry={true}
          error={this.state.passwordError}
          isApiError={this.state.isApiError}
        />

        <TouchableWithoutFeedback onPress={this.onResetPasswordPress}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 24,
              alignSelf: 'center',
            }}>
            <Text style={styles.forgotPasswordText}>
              Forgot your password? Click here to reset
            </Text>
          </View>
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          style={{
            flex: 1,
            bottom: isIphoneX() ? 34 : 0,
            position: 'absolute',
          }}
          behavior="padding"
          enabled={true}
          keyboardVerticalOffset={
            isIphoneX() ? 30 + 20 : Platform.OS === 'ios' ? 15 + 20 : -200
          }>
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <View style={[styles.loginButton, {marginTop: marginBottom}]}>
              {this.state.isLoading ? (
                <LoadingIndicator isLoading={true} />
              ) : (
                <Text style={styles.loginText}>Login to My Account</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: -0.47,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: -0.21,
    lineHeight: 22,
    color: 'rgb(255,255,255)',
    marginTop: 10,
    alignSelf: 'center',
  },
  loginButton: {
    width: width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    justifyContent: 'center',
  },
  loginText: {
    alignSelf: 'center',
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
  forgotPasswordText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.3,
    color: 'rgb(106,111,115)',
  },
  errorText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 22,
    color: 'rgb(228,77,77)',
  },
});

export default connect(
  (state) => ({loader: state.loader}),
  (dispatch) => bindActionCreators({signIn}, dispatch),
)(LoginScreen);

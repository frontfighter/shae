import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';

import FloatingLabelInput from '../components/FloatingLabelInput';
import LoadingIndicator from '../components/LoadingIndicator';

import * as api from '../API/shaefitAPI';

const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  return (size / 812) * height;
  // return size;
};

const getWidth = (size) => {
  // return size / 375 * width;
  return size;
};

class ConfirmEmailScreen extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      username: '',
      isLoading: false,
      isConfirmed: false,
    };

    this._interval;
  }

  /**
    Every 1 sec check if email is confirmed
 */
  async componentDidMount() {
    if (
      typeof this.props.email !== 'undefined' ||
      typeof this.props.username !== 'undefined'
    ) {
      this.setState({
        email: this.props.email,
        username: this.props.username,
      });
    }

    this._interval = setInterval(async () => {
      if (this.state.email !== '' && this.state.username !== '')
        if (!this.state.isConfirmed) {
          const data = await api.checkEmailConfirmed(
            this.state.email,
            this.state.username,
          );

          if (data.confirmed === 1) {
            clearInterval(this._interval);
            this.setState({isConfirmed: true});
          }

          console.log('data', data);
        } else {
          clearInterval(this._interval);
        }
    }, 1000);
  }

  /**
    Check if email is confirmed via deep linking
 */
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (typeof nextProps.navigation.state.params !== 'undefined') {
  //     if (
  //       typeof nextProps.navigation.state.params.isConfirmed !== 'undefined'
  //     ) {
  //       this.setState({
  //         isConfirmed: nextProps.navigation.state.params.isConfirmed,
  //       });
  //     }
  //   }
  // }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  onContinuePress = async () => {
    try {
      // this.props.navigation.navigate('Purchase');
      Actions.tokenCode();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onResendPress = async () => {
    try {
      const data = await api.resendEmailConfirmation(
        this.state.email,
        this.state.username,
      );
      console.log('data', data);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    return (
      <View
        style={{backgroundColor: 'rgb(255,255,255)', height: height, flex: 1}}>
        <StatusBar barStyle="dark-content" hidden={false} />

        {this.state.isConfirmed ? (
          <View>
            <Image
              source={require('../resources/icon/confirmed_email.png')}
              style={styles.image}
            />
            <Text style={styles.title}>Yes! Your Email is Confirmed</Text>

            <Text style={styles.text}>
              Thank you, for confirming your email address, please click button
              below to continue.
            </Text>
          </View>
        ) : (
          <View>
            <Image
              source={require('../resources/icon/confirm_email.png')}
              style={styles.image}
            />
            <Text style={styles.title}>Confirm Your Email Address?</Text>

            <Text style={styles.text}>
              We’ve send a confirmation email to{' '}
              <Text
                style={[
                  styles.text,
                  {fontFamily: 'SFProDisplay-Semibold', fontWeight: '600'},
                ]}>
                {this.state.email}
              </Text>
              . Check your email and click on confirmation link to continue.
            </Text>
          </View>
        )}

        {this.state.isConfirmed ? (
          <TouchableWithoutFeedback onPress={this.onContinuePress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : this.state.isLoading ? (
          <View
            style={{
              alignSelf: 'center',
              position: 'absolute',
              bottom: isIphoneX() ? 53 : 19,
            }}>
            <LoadingIndicator
              isLoading={true}
              backgroundColor="rgb(0,164,228)"
            />
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={this.onResendPress}>
            <Text style={styles.linkText}>Resend Email</Text>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    marginTop: getHeight(134),
    width: 174,
    height: 152,
    alignSelf: 'center',
  },
  title: {
    marginTop: getHeight(42),
    alignSelf: 'center',
    fontFamily: 'SFProDisplay-Semibold',
    fontWeight: '600',
    fontSize: 19,
    letterSpacing: -0.46,
    color: 'rgb(31,33,35)',
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.39,
    color: 'rgb(54,58,61)',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: getHeight(16),
    width: width - 85,
  },
  linkText: {
    fontFamily: 'SFProDisplay-Semibold',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: -0.36,
    alignSelf: 'center',
    color: 'rgb(0,168,235)',
    position: 'absolute',
    bottom: isIphoneX() ? 49 : 15,
  },
  button: {
    width: width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isIphoneX() ? 34 : 0,
  },
  buttonText: {
    alignSelf: 'center',
    fontFamily: 'SFProDisplay-Semibold',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: -0.36,
    color: 'rgb(255,255,255)',
  },
});

export default ConfirmEmailScreen;

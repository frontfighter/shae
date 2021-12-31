/**
 * Created by developercomputer on 09.10.16.
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { FORGOT_PASSWORD } from '../redux/actions/names';

import LoginInput from '../components/LoginInput';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: 0.5,
    backgroundColor: '#666',
    marginHorizontal: 20
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 35,
    marginTop: 25,
    marginHorizontal: 20,
    backgroundColor: '#44c5fb'
  },
  btnText: {
    color: '#fff'
  },
  textContainer: {
    paddingHorizontal: 60,
    paddingVertical: 35
  }
});

class ForgotPassword extends Component {
  static propTypes = {
    queryPasswordRecover: PropTypes.func
  };
  static defaultProps = {
    queryPasswordRecover: () => {}
  };
  state = { email: '' };
  handleBtn = () => {
    const { email } = this.state;
    this.props.queryPasswordRecover(email);
  };
  render() {
    return (
      <View style={style.container}>
        <ScrollView>
          <View style={style.textContainer}>
            <Text style={style.text}>Please enter your email to reset your password</Text>
          </View>
          <LoginInput
            keyboardType="email-address"
            placeholderTextColor="#333"
            inputTextStyle={{ color: '#333' }}
            source={require('../resources/icon/email_dark_x3.png')}
            onChangeText={text => this.setState({ email: text })}
            placeholder="Email"
          />
          <View style={style.separator} />
          <TouchableOpacity
            onPress={this.handleBtn}
            style={style.button}
          >
            <Text style={[style.text, style.btnText]}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  queryPasswordRecover: email => dispatch({ type: FORGOT_PASSWORD, payload: { email } })
});

export default connect(null, mapDispatchToProps)(ForgotPassword);

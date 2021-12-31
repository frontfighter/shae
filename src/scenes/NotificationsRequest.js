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
import {requestNotifications, PERMISSIONS} from 'react-native-permissions';

import FloatingLabelInput2 from '../components/FloatingLabelInput2';

const {height, width} = Dimensions.get('window');

class NotificationsRequest extends Component {
  constructor() {
    super();

    this.state = {};
  }

  onButtonPress = (value) => {
    if (value) {
      requestNotifications(['alert', 'sound']).then(({status, settings}) => {
        Actions.createAvatar();
      });
    } else {
      Actions.createAvatar();
    }
  };

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View
        style={{
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <View style={{alignSelf: 'center'}}>
          <Image
            source={require('../resources/icon/notifications.png')}
            style={{alignSelf: 'center'}}
          />

          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.text}>
            Allow Shae to send you push notifications
          </Text>

          <TouchableWithoutFeedback onPress={() => this.onButtonPress(true)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Allow</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.onButtonPress(false)}>
            <View style={{marginTop: 16, alignSelf: 'center'}}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Text style={styles.bottomText}>
          Shae requires push notifications to interact with you
        </Text>
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
    marginTop: 30,
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    marginTop: 10,
    textAlign: 'center',
    width: width - 95,
  },
  button: {
    width: 140,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    width: width - 135,
    position: 'absolute',
    bottom: 40,
  },
});

export default NotificationsRequest;

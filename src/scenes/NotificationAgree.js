/**
 * Created by developercomputer on 10.10.16.
 * It's again. A lot of legacy layout-code.
 */
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { screenHeight, screenWidth } from '../globalStyles';
import { NOTIFICATION_AGREE } from '../redux/actions/names';
import RoundBtn from '../components/RoundBtn';


const styles = StyleSheet.create({
  backgroundImage: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute'
  },
  textTitle: {
    fontFamily: 'Roboto-Bold',
    color: '#fff',
    fontSize: 19,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0)'
  },
  text: {
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 7,
    backgroundColor: 'rgba(255,255,255,0)'
  },
  button: {
    justifyContent: 'center',
    height: 55,
    borderRadius: 35,
    backgroundColor: '#fff'
  },
  link: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center'
  },
  textLink: {
    fontFamily: 'Roboto-Bold',
    color: '#c1ced3',
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0)'
  },
  imageNotification: {
    alignSelf: 'center'
  },
  circle: {
    backgroundColor: 'rgba(125,141,181,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const NotificationAgree = ({ dispatchAboutAgreement, userId }) => {
  const notifyBG = Platform.OS === 'ios'
    ? require('../resources/notifications-background.png')
    : require('../resources/notifications-android-background.png');
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Image
        style={styles.backgroundImage}
        source={notifyBG}
      />
      <View style={{ flex: 1, padding: 40 }}>
        <View style={{ flex: 9, justifyContent: 'center', alignItems: 'center' }}>
          <View style={[styles.circle, { height: 260, width: 260, borderRadius: 130 }]}>
            <View
              style={[styles.circle, { backgroundColor: 'rgba(125,141,181,0.01)', height: 220, width: 220, borderRadius: 110 }]}
            >
              <View
                style={[styles.circle, { backgroundColor: 'rgba(125,141,181,0.2)', height: 200, width: 200, borderRadius: 105 }]}
              >
                <View
                  style={[styles.circle, { backgroundColor: 'rgba(125,141,181,0.01)', height: 160, width: 160, borderRadius: 80 }]}
                >
                  <View
                    style={[styles.circle, { backgroundColor: 'rgba(125,141,181,0.3)', height: 140, width: 140, borderRadius: 70 }]}
                  >
                    <Image
                      resizeMode="contain"
                      style={styles.imageNotification}
                      source={require('../resources/icon/notification.png')}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>


        <View style={{ flex: 3 }}>
          <View>
            <Text style={styles.textTitle}>Push Notifications</Text>
          </View>

          <Text style={styles.text}>
            Allow Shae to send you push notifications about your health.
          </Text>
        </View>

        <RoundBtn
          styleContainer={{ justifyContent: 'center', flex: 2 }}
          text="LET’S DO IT"
          colorTextButton="#44c5fb"
          styleButton={styles.button}
          onPress={() => dispatchAboutAgreement({ userId, isAgree: true })}
        />

        <View style={styles.link}>
          <Text
            style={[styles.textLink, { color: '#44c5fb' }]}
            onPress={() => dispatchAboutAgreement({ userId, isAgree: false })}
          >
            NO THANKS, ANOTHER TIME
          </Text>
        </View>
      </View>
    </View>
  );
};

NotificationAgree.propTypes = {
  dispatchAboutAgreement: PropTypes.func,
  userId: PropTypes.string
};

const mapStateToProps = state => ({
  userId: state.auth.userInfo.id
});

const mapDispatchToProps = dispatch => ({
  dispatchAboutAgreement: payload => dispatch({ type: NOTIFICATION_AGREE, payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationAgree);

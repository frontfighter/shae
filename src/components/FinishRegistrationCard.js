/**
 * Created by developercomputer on 10.10.16.
 * This component should not exist. It is legacy of old version. Anyway it's not so bad.
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';

import { screenHeight } from '../globalStyles';

import RoundBtn from './RoundBtn';


const heightButton = Platform.OS === 'ios' ? 46 : 70;

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: 'Roboto-Bold',
    color: '#2d3036',
    fontSize: 19,
    alignSelf: 'center'
  },
  text: {
    fontFamily: 'Roboto-Regular',
    color: '#2d3036',
    fontSize: 13,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 7
  },
  lining: {
    flex: 1,
    backgroundColor: '#fff',
    height: screenHeight - heightButton,
    marginTop: 29,
    margin: 20,
    borderRadius: 10,
    padding: 20
  },
  logo: {
    height: 190,
    width: 190,
    alignSelf: 'center'
  },
  link: {
    flex: 0.1,
    justifyContent: 'center'
  },
  textLink: {
    fontFamily: 'Roboto-Bold',
    color: '#c1ced3',
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center'
  },
  button: {
    justifyContent: 'center',
    height: 55,
    borderRadius: 35,
    backgroundColor: '#44c5fb'
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    alignSelf: 'center',
    fontFamily: 'Roboto-Regular'
  }
});


const FinishRegistrationCard = ({
  onRegisterPageMonthly,
  onRegisterPageAnnual,
  onLoginPress
  }) => (
    <View style={{ flex: 1 }}>
      <View style={styles.lining}>
        <View style={{ flex: 0.7, justifyContent: 'center' }}>
          <Image
            style={styles.logo}
            source={require('../resources/registr-circul-star.png')}
          />
        </View>
        <View style={{ flex: 0.3 }}>
          <View>
            <Text style={styles.textTitle}>Get started</Text>
          </View>

          <Text style={styles.text}>
            Let Shae help you take control of your health and life today!
          </Text>
        </View>
        <RoundBtn
          styleContainer={{ justifyContent: 'center', flex: 0.25 }}
          text="$19 MONTHLY"
          colorTextButton="#fff"
          onPress={onRegisterPageMonthly}
        />
        <View style={{ justifyContent: 'center', flex: 0.2 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={onRegisterPageAnnual}
          >
            <Text style={styles.buttonText}>
              $197 YEARLY
              <Text style={[styles.buttonText, { fontSize: 10 }]}>(SAVE $31)</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.link}>
          <Text
            style={styles.textLink}
            onPress={onLoginPress}
          >
            HAVE AN ACCOUNT?
            <Text
              style={[styles.textLink, { color: '#44c5fb' }]}
              onPress={onLoginPress}
            >
              {' '}LOGIN
            </Text>
          </Text>
        </View>
      </View>
    </View>
);

FinishRegistrationCard.propTypes = {
  onRegisterPageMonthly: PropTypes.func,
  onRegisterPageAnnual: PropTypes.func,
  onLoginPress: PropTypes.func
};


export default FinishRegistrationCard;

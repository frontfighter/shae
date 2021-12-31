/**
 * Created by developercomputer on 07.10.16.
 */
/**
 * Created by Konstantin Zhukov on 22.07.16.
 * NOTE: Almost all code of this file is taken from previous version of Shae
 * P.S. It's formatted and improved, but still...
 */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  ScrollView,
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
    textAlign: 'center'
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
    textAlign: 'center'
  }
});

function RegistrationCard({
  titleText,
  onLoginPress,
  onNextPress,
  children,
  source
  }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.lining}>
        <View style={{ flex: 5, justifyContent: 'center' }}>
          <Image style={styles.logo} source={source} />
        </View>
        <View style={{ flex: 3 }}>
          <View>
            <Text style={styles.textTitle}>{titleText}</Text>
          </View>
          <View style={{ flex: 1, paddingBottom: 20 }}>
            <ScrollView>
              <Text style={styles.text}>
                {children}
              </Text>
            </ScrollView>
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <RoundBtn
            styleConteiner={{ justifyContent: 'center' }}
            text="NEXT"
            colorTextButton="#fff"
            colorButton="#44c5fb"
            onPress={onNextPress}
          />
        </View>
        <View style={styles.link}>
          <Text style={styles.textLink} onPress={onLoginPress}>
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
}

RegistrationCard.propTypes = {
  titleText: PropTypes.string,
  onLoginPress: PropTypes.func,
  onNextPress: PropTypes.func,
  source: Image.propTypes.source,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default RegistrationCard;

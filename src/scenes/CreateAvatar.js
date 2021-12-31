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

import * as api from '../API/shaefitAPI';
import {
  readRealmRows,
  getDbToken,
  getUserDetails as getUser,
  getUserVariables,
  createOrUpdateRealm,
} from '../data/db/Db';

const {height, width} = Dimensions.get('window');

class CreateAvatar extends Component {
  constructor() {
    super();

    this.state = {
      isMetric: true,
    };
  }

  onStartNowPress = async () => {
    let userDetails = await api.getUserDetails();
    userDetails.profile.unit = this.state.metric ? 'standard' : 'metric';
    userDetails.measurementsUpdated = userDetails.measurementsUpdated.toString();

    createOrUpdateRealm('UserDetails', userDetails);
    readRealmRows('UserDetails');

    api.updateUserData();

    Actions.enableGps();
  };

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <ScrollView>
          <View>
            <Image
              source={require('../resources/icon/background_measurement.png')}
              style={{width}}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                bottom: 36,
                alignSelf: 'center',
              }}>
              <Text style={styles.title}>Create Your Avatar</Text>
              <Text style={styles.text}>
                Shae will now help you measure your body on the outside to
                understand your health on the inside.
              </Text>
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

          <View
            style={{
              width: width - 40,
              borderRadius: 4,
              alignSelf: 'center',
              backgroundColor: 'rgba(0,168,235,0.05)',
              marginTop: 24,
            }}>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                marginBottom: 24,
              }}>
              <Text style={styles.hintTitle}>What you need...</Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_tape.png')}
                  style={{marginRight: 15}}
                />
                <Text style={styles.hintText}>Soft Tape Measure</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_tight.png')}
                  style={{marginRight: 15}}
                />
                <Text style={styles.hintText}>
                  Tight-Fit or Fitted Clothing
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_height.png')}
                  style={{marginRight: 16, marginLeft: 3}}
                />
                <Text style={styles.hintText}>Current Accurate Height</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_weight.png')}
                  style={{marginRight: 15}}
                />
                <Text style={styles.hintText}>Current Weight (latest)</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: width - 40,
              borderRadius: 4,
              alignSelf: 'center',
              backgroundColor: 'rgba(237,98,64,0.05)',
              marginTop: 16,
            }}>
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 20,
                marginBottom: 24,
              }}>
              <Text style={styles.hintTitle}>What’s coming up next…</Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_time.png')}
                  style={{marginRight: 15, marginTop: 2}}
                />
                <Text style={styles.hintText}>
                  This will take less than 30mins to complete. Take your time,
                  answer honestly, and Shae will set up a unique profile just
                  for you!
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_save.png')}
                  style={{marginRight: 15, marginTop: 2}}
                />
                <Text style={styles.hintText}>
                  You can save your information at any time, and return to
                  complete later
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/avatar_privacy.png')}
                  style={{marginRight: 15, marginTop: 2}}
                />
                <Text style={styles.hintText}>
                  We take privacy seriously, and make sure your information is
                  completely secure. You can read our{' '}
                  <Text style={[styles.hintText, {color: 'rgb(0,168,235)'}]}>
                    Privacy Policy
                  </Text>{' '}
                  at any time
                </Text>
              </View>
            </View>
          </View>

          <TouchableWithoutFeedback
            onPress={() => this.setState({isMetric: true})}>
            <View
              style={{
                width: width - 40,
                height: 80,
                borderRadius: 4,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: this.state.isMetric
                  ? 'rgba(0,187,116,0.5)'
                  : 'rgb(221,224,228)',
                marginTop: 16,
                backgroundColor: this.state.isMetric
                  ? 'rgb(248,255,252)'
                  : 'rgb(255,255,255)',
              }}>
              <View
                style={{
                  marginTop: 19,
                  marginHorizontal: 16,
                  marginBottom: 20,
                  flexDirection: 'row',
                }}>
                {this.state.isMetric ? (
                  <View
                    style={{
                      marginTop: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: 'rgb(0,187,116)',
                    }}>
                    <Image
                      source={require('../resources/icon/checkmarkCopy.png')}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      marginTop: 1,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor: 'rgb(194,203,210)',
                    }}></View>
                )}

                <View style={{marginLeft: 14}}>
                  <Text style={styles.cardTitle}>Feets, Inches & Pound</Text>
                  <Text style={styles.cardText}>
                    Recorded as fractions (1/16s, lbs & oz)
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => this.setState({isMetric: false})}>
            <View
              style={{
                width: width - 40,
                height: 80,
                borderRadius: 4,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: !this.state.isMetric
                  ? 'rgba(0,187,116,0.5)'
                  : 'rgb(221,224,228)',
                marginTop: 16,
                marginBottom: 30,
                backgroundColor: !this.state.isMetric
                  ? 'rgb(248,255,252)'
                  : 'rgb(255,255,255)',
              }}>
              <View
                style={{
                  marginTop: 19,
                  marginHorizontal: 16,
                  marginBottom: 20,
                  flexDirection: 'row',
                }}>
                {!this.state.isMetric ? (
                  <View
                    style={{
                      marginTop: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: 'rgb(0,187,116)',
                    }}>
                    <Image
                      source={require('../resources/icon/checkmarkCopy.png')}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      marginTop: 1,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor: 'rgb(194,203,210)',
                    }}></View>
                )}

                <View style={{marginLeft: 14}}>
                  <Text style={styles.cardTitle}>
                    Meters, Centimeters & kilograms
                  </Text>
                  <Text style={styles.cardText}>
                    Recorded as decimals (0.5)
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        <KeyboardAvoidingView
          style={{
            justifyContent: 'flex-end',
          }}
          behavior={Platform.OS === 'ios' ? 'position' : null}
          enabled={true}
          keyboardVerticalOffset={
            Platform.OS === 'android' ? 0 : isIphoneX() ? -34 : 60
          }>
          <TouchableWithoutFeedback onPress={this.onStartNowPress}>
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Start Now</Text>
                )}
              </View>
              {isIphoneX() && (
                <View
                  style={{
                    height: 34,
                    width,
                    backgroundColor: 'rgb(255,255,255)',
                    // position: "absolute",
                    // bottom: 0,
                  }}
                />
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
    width: width - 95,
    textAlign: 'center',
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
  hintTitle: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: 'rgb(31,33,35)',
  },
  hintText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 20,
    color: 'rgb(16,16,16)',
    width: width - 115,
  },
  cardTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.1,
    color: 'rgb(16,16,16)',
  },
  cardText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: -0.1,
    lineHeight: 18,
    color: 'rgb(122,126,130)',
    marginTop: 5,
  },
});

export default CreateAvatar;

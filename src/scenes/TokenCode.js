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
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modalbox';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import {BoxShadow} from 'react-native-shadow';

import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';
import FloatingLabelInput2 from '../components/FloatingLabelInput2';

import {
  getDbToken,
  createOrUpdateRealm,
  getUserVariables,
  readRealmRows,
  getUserDetails,
} from '../data/db/Db';

const {height, width} = Dimensions.get('window');

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: 'bottom', // optional
  useNativeDriver: true, // optional
});

const shadowOpt = {
  width: width - 40,
  height: 48,
  color: '#273849',
  border: 18,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 6,
  style: {marginTop: 24, alignSelf: 'center'},
};

class TokenCode extends Component {
  constructor() {
    super();

    this.state = {
      code: '',
      codeError: '',

      isDialogVisible: false,
      isLoading: false,
    };
  }

  onSubmitPress = async () => {
    // this.props.navigation.navigate("CaptureAvatar");
    try {
      if (this.state.code === '') {
        this.setState({codeError: 'Code is required'});
      } else {
        this.setState({isLoading: true});
        let userDetails = await api.getUserDetails();
        console.log('userDetails', userDetails);

        const data = await api.subscribeClubToken(
          userDetails.profile.email,
          userDetails.id,
          this.state.code,
        );
        console.log('data', data);

        if (!data.status) {
          this.setState({
            codeError: 'Token not found or already used',
            isLoading: false,
          });
        } else {
          // userDetails.subscription = data.data.subscription;
          // createOrUpdateRealm('UserDetails', userDetails);
          // readRealmRows('UserDetails');

          // let userData = JSON.parse(JSON.stringify(getUserVariables()));
          // userData.isMembershipValid = true;
          // createOrUpdateRealm('UserVariables', userData);
          // readRealmRows('UserVariables');
          // console.log('userData', userData);

          // this.animatedDismissModal();
          this.setState({isLoading: false}, () => {
            Actions.signupWelcome();
          });

          // setTimeout(() => {
          //   if (!userData.isNewUser) {
          //     if (!userData.isMeasurementUnitSelected) {
          //       this.props.navigation.navigate('MeasurementUnit');
          //     } else if (userDetails.hra_last_updated === null) {
          //       // this.props.navigation.navigate("CaptureAvatar");
          //       this.props.navigation.navigate('Hra');
          //     } else {
          //       this.props.navigation.navigate('MainContent');
          //     }
          //   } else {
          //     this.props.getHraSchema(1);
          //     this.props.navigation.navigate('Guide');
          //   }
          // }, 300);
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  validateCode = (code) => {
    try {
      this.setState({code});

      const error = 'Code is required';

      if (code === '') {
        this.setState({codeError: error});
      } else {
        this.setState({codeError: ''});
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          scrollEnabled
          // ref={(ref) => {
          //   this.scrollView = ref;
          // }}
          innerRef={(ref) => {
            this.scrollView = ref;
          }}>
          <View style={{alignSelf: 'center'}}>
            <Image
              source={require('../resources/icon/background_token.png')}
              style={{width}}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                bottom: 132,
                alignSelf: 'center',
              }}>
              <Text style={styles.title}>It’s Shae Time!</Text>
              <Text style={styles.text}>Look Good. Feel Great. Love Life.</Text>
            </View>

            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
              <View
                style={{
                  position: 'absolute',
                  bottom: isIphoneX() ? 253 : 273,
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

          <BoxShadow
            setting={{
              ...shadowOpt,
              ...{
                width: width - 40,
                height: 316,
                y: 6,
                border: 16,
                radius: 4,
                opacity: 0.05,
                style: {margin: -50, alignSelf: 'center'},
              },
            }}>
            <View style={[styles.card, {height: 316, alignSelf: 'center'}]}>
              <View
                style={{
                  width: width - 88,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../resources/icon/checkmark.png')}
                  style={{
                    marginRight: 17,
                  }}
                />
                <Text style={styles.cardText}>
                  Personalized Profile Just for You
                </Text>
              </View>

              <View
                style={{
                  width: width - 88,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Image
                  source={require('../resources/icon/checkmark.png')}
                  style={{
                    marginRight: 17,
                  }}
                />
                <Text style={styles.cardText}>Full Access 24/7</Text>
              </View>

              <View
                style={{
                  width: width - 88,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Image
                  source={require('../resources/icon/checkmark.png')}
                  style={{
                    marginRight: 17,
                  }}
                />
                <Text style={styles.cardText}>Get Real Results</Text>
              </View>

              <View
                style={{
                  width: width - 88,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Image
                  source={require('../resources/icon/checkmark.png')}
                  style={{
                    marginRight: 17,
                  }}
                />
                <Text style={styles.cardText}>
                  Your Virtual Health Assistant
                </Text>
              </View>

              <FloatingLabelInput2
                label="Enter your token code…"
                value={this.state.token}
                onChangeText={(code) => this.validateCode(code)}
                width={width - 88}
                marginTop={0}
                phoneInputType={false}
                error={this.state.codeError}
                // error={this.state.zipCodeError}
              />

              <TouchableWithoutFeedback onPress={this.onSubmitPress}>
                <View style={styles.button}>
                  {this.state.isLoading ? (
                    <LoadingIndicator isLoading={true} />
                  ) : (
                    <Text style={styles.buttonText}>Get Started Now</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </BoxShadow>

          <TouchableWithoutFeedback
            onPress={() => this.setState({isDialogVisible: true})}>
            <View style={{marginTop: 24 + 50, alignSelf: 'center'}}>
              <Text style={styles.haveNoCode}>Don't have a Token Code?</Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>

        <Dialog
          visible={this.state.isDialogVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isDialogVisible: false});
          }}
          onDismiss={() => {
            this.setState({isDialogVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DialogContent>
            <View style={[styles.card, {width: width - 75}]}>
              <Image
                source={require('../resources/icon/token_code.png')}
                style={{marginTop: 41, alignSelf: 'center'}}
              />
              <Text style={styles.cardTitle}>No Token Code?</Text>
              <Text style={styles.cardText2}>
                Check in with your provider or contact the Shae.ai support team
              </Text>
              <TouchableWithoutFeedback>
                <View style={styles.supportButton}>
                  <Text style={styles.supportButtonText}>Contact Support</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
  },
  title: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: -0.36,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: 'rgb(255,255,255)',
    width: width - 130,
    textAlign: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  cardTitle: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    marginTop: 24,
  },
  cardText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.3,
    color: 'rgb(16,16,16)',
  },
  cardText2: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    width: width - 135,
  },
  supportButton: {
    width: 160,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  supportButtonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
  button: {
    width: width - 88,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
  haveNoCode: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
  },
});

export default TokenCode;

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
import Collapsible from 'react-native-collapsible';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';
import FloatingLabelInput2 from '../components/FloatingLabelInput2';

import {
  getDbToken,
  createOrUpdateRealm,
  getUserVariables,
  readRealmRows,
} from '../data/db/Db';

const {height, width} = Dimensions.get('window');

class Signup2 extends Component {
  constructor() {
    super();

    this.state = {
      gender: '',
      birthDate: '',
      username: '',
      password: '',
      passwordConfirm: '',

      genderError: '',
      birthDateError: '',
      usernameError: '',
      passwordError: '',
      passwordConfirmError: '',

      isModalOpened: false,
      isTermsChecked: false,
      isTermsExpanded: false,
      isDateTimePickerVisible: false,

      isApiError: false,
      isLoading: false,
      ApiErrorMessage: '',
      apiErrorPosition: new Animated.Value(-44),
    };
  }

  validateField = (name, value) => {
    try {
      this.setState({[name]: value});

      let error = '';
      if (name === 'gender') {
        error = 'Gender is required';
      } else if (name === 'birthDate') {
        error = 'Date of Birth is required';
      } else if (name === 'username') {
        error = 'Username is required';
      } else if (name === 'password') {
        error = 'Password is required';
      } else if (name === 'passwordConfirm') {
        error = 'Confirm Password is required';
      }

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

  checkErrors = () => {
    try {
      let errorsCount = 0;
      if (this.state.gender === '') {
        this.setState({genderError: 'Gender is required'});
        errorsCount += 1;
      } else {
        this.setState({genderError: ''});
      }

      if (this.state.birthDate === '') {
        this.setState({birthDateError: 'Date of Birth is required'});
        errorsCount += 1;
      } else {
        this.setState({birthDateError: ''});
      }

      // if (this.state.username === '') {
      //   this.setState({usernameError: 'Username is required'});
      //   errorsCount += 1;
      // } else {
      //   this.setState({usernameError: ''});
      // }

      if (this.state.username === '') {
        this.setState({usernameError: 'Username is required'});
        errorsCount += 1;
      } else if (this.state.username.length < 5) {
        this.setState({
          usernameError: 'The username must be at least 5 characters',
        });
        errorsCount += 1;
      } else {
        this.setState({usernameError: ''});
      }

      // if (this.state.password === '') {
      //   this.setState({passwordError: 'Password is required'});
      //   errorsCount += 1;
      // } else {
      //   this.setState({passwordError: ''});
      // }

      if (this.state.password === '') {
        this.setState({passwordError: 'Password is required'});
        errorsCount += 1;
      } else if (this.state.password.length < 8) {
        this.setState({
          passwordError: 'The password must be at least 8 characters',
        });
        errorsCount += 1;
      } else {
        this.setState({passwordError: ''});
      }

      if (this.state.passwordConfirm === '') {
        this.setState({passwordConfirmError: 'Password is required'});
        errorsCount += 1;
      } else {
        this.setState({passwordConfirmError: ''});
      }

      return errorsCount;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  validateFields = async () => {
    try {
      const errorsCount = this.checkErrors();

      if (errorsCount !== 0) {
        // this.setState({ errors });
      } else {
        console.log('no errors');
        if (this.state.isTermsChecked) {
          const date =
            this.state.birthDate.substring(6, 10) +
            '-' +
            this.state.birthDate.substring(3, 5) +
            '-' +
            this.state.birthDate.substring(0, 2);
          const mobile = this.props.phone.replace(/\D/g, '');

          this.setState({isLoading: true});
          const response = await api.registerUser(
            this.state.username,
            this.props.firstName,
            this.props.lastName,
            this.props.email,
            this.state.gender,
            date,
            mobile,
            this.props.country,
            this.state.password,
          );

          if (typeof response.message !== 'undefined') {
            console.log('response', response);
            this.setState({
              isApiError: true,
              isLoading: false,
              ApiErrorMessage: response.message,
            });
            this.slide();

            if (response.message === 'Login with your shae account') {
              // this.setState({isModalVisible: true}, () => {
              //   this.popupDialog.show();
              // });
            }
          } else {
            this.setState({isLoading: false});
            const token = await api.getToken({
              email: this.props.email,
              password: this.state.password,
            });
            createOrUpdateRealm('Token', token);

            // const userDetails = await api.getUserDetails();
            // createOrUpdateRealm('UserDetails', userDetails);

            AsyncStorage.setItem('apiToken', JSON.stringify(token));
            Actions.confirmEmail({
              email: this.props.email,
              username: this.state.username,
            });
            // AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

            // console.log('userDetails', userDetails);
            // Actions.tokenCode();
          }
          // Actions.signupWelcome();
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onPhoneInfoPress = () => {
    this.openModal();
  };

  openModal = () => {
    try {
      this.setState({isModalOpened: true}, () => this.refs.modal.open());
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
    console.log('isDateTimePickerVisible: true');
  };

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = (date) => {
    try {
      let day = '' + date.getDate();
      if (day.length === 1) {
        day = '0' + day + '/';
      } else {
        day = day + '/';
      }

      let month = '' + (date.getMonth() + 1);
      if (month.length === 1) {
        month = '0' + month + '/';
      } else {
        month = month + '/';
      }

      // let errors = this.state.errors;
      // if (errors.hasOwnProperty("birthDate")) {
      //   delete errors["birthDate"];
      // }

      this.setState({
        birthDate: `${day}${month}${date.getFullYear()}`,
        // errors,
      });

      this._hideDateTimePicker();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Slide down/up the API error.
   */
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

  render() {
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
            {this.state.ApiErrorMessage}
          </Text>
        </Animated.View>

        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          scrollEnabled
          // ref={(ref) => {
          //   this.scrollView = ref;
          // }}
          innerRef={(ref) => {
            this.scrollView = ref;
          }}>
          <View>
            <Image
              source={require('../resources/icon/background_signup.png')}
              style={{width}}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                bottom: 42,
                alignSelf: 'center',
              }}>
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.text}>
                Shae is here to support you every step of the way.
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

          <View style={{alignSelf: 'center'}}>
            <FloatingLabelInput2
              label={'Gender'}
              value={this.state.gender}
              onChangeText={(gender) => this.validateField('gender', gender)}
              width={width - 40}
              marginTop={24}
              phoneInputType={false}
              error={this.state.genderError}
              errorMarginHorizontal={0}
            />
            <TouchableWithoutFeedback onPress={this.onPhoneInfoPress}>
              <View style={{position: 'absolute', top: 50, right: 0}}>
                <Image source={require('../resources/icon/help.png')} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{alignSelf: 'center'}}>
            <FloatingLabelInput2
              label="Date of Birth"
              value={this.state.birthDate}
              onChangeText={(birthDate) =>
                this.validateField('birthDate', birthDate)
              }
              width={width - 40}
              marginTop={20}
              phoneInputType={true}
              editable={false}
              error={this.state.birthDateError}
            />
            <TouchableWithoutFeedback onPress={this.showDateTimePicker}>
              <View style={{position: 'absolute', height: 76, width}} />
            </TouchableWithoutFeedback>
          </View>

          <View style={{alignSelf: 'center'}}>
            <FloatingLabelInput2
              label={'Username'}
              value={this.state.username}
              onChangeText={(username) =>
                this.validateField('username', username)
              }
              width={width - 40}
              marginTop={20}
              phoneInputType={false}
              error={this.state.usernameError}
              errorMarginHorizontal={0}
            />
            <TouchableWithoutFeedback onPress={this.onPhoneInfoPress}>
              <View style={{position: 'absolute', top: 50, right: 0}}>
                <Image source={require('../resources/icon/help.png')} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={{alignSelf: 'center'}}>
            <FloatingLabelInput2
              label={'Password'}
              value={this.state.password}
              onChangeText={(password) =>
                this.validateField('password', password)
              }
              width={width - 40}
              marginTop={20}
              phoneInputType={false}
              error={this.state.passwordError}
              errorMarginHorizontal={0}
              secureEntry={true}
            />
            <TouchableWithoutFeedback onPress={this.onPhoneInfoPress}>
              <View style={{position: 'absolute', top: 50, right: 0}}>
                <Image source={require('../resources/icon/help.png')} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <FloatingLabelInput2
            label={'Confirm Password'}
            value={this.state.passwordConfirm}
            onChangeText={(passwordConfirm) =>
              this.validateField('passwordConfirm', passwordConfirm)
            }
            width={width - 40}
            marginTop={20}
            phoneInputType={false}
            error={this.state.passwordConfirmError}
            secureEntry={true}
          />

          <View
            style={{
              marginTop: 26,
              flexDirection: 'row',
              alignItems: 'center',
              width: width - 40,
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({isTermsChecked: !this.state.isTermsChecked})
              }>
              <View>
                {this.state.isTermsChecked ? (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      backgroundColor: 'rgb(0,187,116)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/checkmarkCopy.png')}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: 'rgb(221,224,228)',
                    }}></View>
                )}
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({isTermsExpanded: !this.state.isTermsExpanded})
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 12,
                }}>
                <Text style={styles.agreeText}>I agree to the</Text>
                <Text style={styles.termsText}> Terms and Conditions</Text>
                <Image
                  source={require('../resources/icon/arrowUp.png')}
                  style={{
                    tintColor: 'rgb(0,168,235)',
                    marginLeft: 9,
                    transform: [
                      {
                        rotate: this.state.isTermsExpanded ? '0deg' : '180deg',
                      },
                    ],
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Collapsible collapsed={!this.state.isTermsExpanded}>
            <View
              style={{width: width - 40, alignSelf: 'center', marginTop: 40}}>
              <Text style={styles.conditionsTitle}>Please read carefully.</Text>
              <Text style={[styles.conditionsText, {marginTop: 15}]}>
                I understand and agree that I am voluntarily utilizing the
                platform and further understand that: (a) the current terms and
                conditions of the platform may change at any time without notice
                to participants, (b) I understand that subsequent agreement with
                updated and current terms and conditions, as may change from
                time to time, may be requested.{'\n\n'}I understand that this
                program may offer insights or recommendations towards a healthy
                lifestyle for myself, however it is my choice how or if I decide
                to utilize this information. This information is not medical
                advice and is not intended to be used as a substitute to medical
                advice. {'\n\n'}I understand that the insights calculated are
                solely determined by the inputs I provide and as such I agree to
                input accurate information and strictly submit information about
                myself only, and understand that if I input incorrect
                information then the resulting insights, recommendations, and
                this entire program will not be accurate for me. {'\n\n'}By
                participating in the program I understand and agree that:
              </Text>

              <View style={{flexDirection: 'row', marginTop: 30}}>
                <Image
                  source={require('../resources/icon/arrowRight_blue.png')}
                  style={{
                    tintColor: 'rgb(0,168,235)',
                    marginRight: 12,
                    marginTop: 4,
                  }}
                />

                <Text style={styles.listText}>
                  I am required to take self-measurements of my body and answer
                  questions about my personal health accurately and to the best
                  of my knowledge.
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image
                  source={require('../resources/icon/arrowRight_blue.png')}
                  style={{
                    tintColor: 'rgb(0,168,235)',
                    marginRight: 12,
                    marginTop: 4,
                  }}
                />

                <Text style={styles.listText}>
                  I understand that this software platform is dedicated to
                  making my experience simple and effective, and if I experience
                  any problems or have any questions, I will immediately direct
                  them to customer care.
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image
                  source={require('../resources/icon/arrowRight_blue.png')}
                  style={{
                    tintColor: 'rgb(0,168,235)',
                    marginRight: 12,
                    marginTop: 4,
                  }}
                />

                <Text style={styles.listText}>
                  I agree to all of the terms and conditions stated on this
                  form, including the MEDICAL DISCLAIMER and WAIVER OF LIABILITY
                  CLAIM below.
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image
                  source={require('../resources/icon/arrowRight_blue.png')}
                  style={{
                    tintColor: 'rgb(0,168,235)',
                    marginRight: 12,
                    marginTop: 4,
                  }}
                />

                <Text style={styles.listText}>
                  I understand and agree that my de-identified health
                  information (no personal information) may be used for research
                  purposes, and for improving the accuracy of the insights
                  provided to me or others similar to me
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image
                  source={require('../resources/icon/arrowRight_blue.png')}
                  style={{
                    tintColor: 'rgb(0,168,235)',
                    marginRight: 12,
                    marginTop: 4,
                  }}
                />

                <Text style={styles.listText}>
                  I understand that if I do not wish to comply with any of these
                  terms and conditions I must immediately terminate my use of
                  the software platform.
                </Text>
              </View>

              <Text style={[styles.conditionsText, {marginTop: 30}]}>
                If any of these terms and conditions, or any part of any term or
                condition, shall be held by a court or tribunal as being invalid
                or unenforceable, the validity, legality and enforceability of
                the remaining terms and conditions shall remain in full force
                and effect. {'\n\n'}MEDICAL DISCLAIMER: Please consult your
                medical professional before commencing any new health or
                wellness regime. The information provided by this software
                includes suggestions and guidelines only and is based on the
                information you have provided. This program is not suitable for
                persons with diagnosed medical conditions, acute or chronic
                injuries or severe symptoms, nor is it intended to supersede or
                replace medical or professional information or advice from your
                doctor or health professional. If any pain, injury or illness
                exists or presents itself at any time seek medical advice
                immediately.
                {'\n\n'}WAIVER OF LIABILITY CLAIM: I understand that I am a
                voluntary participant utilizing the platform. It is expressly
                agreed that all activities and use of all information shall be
                undertaken by me at my sole risk. The program vendors shall not
                be liable for any claims, demands, injuries, damages, or actions
                whatsoever to me or my property arising out of or connected with
                the use of any of the services and facilities online. I hereby
                expressly forever release and discharge the program, its owners,
                employees, managers, directors, and its franchisors from all
                such claims, demands, injuries, damages, or actions and from all
                acts of active or passive negligence on the part of the program,
                its owners, their partners, agents, and employees. Further, if I
                am a resident of California, I acknowledge that I am expressly
                waiving claims which at the time I am executing this document, I
                do not know or suspect to exist and that may be in my favor,
                notwithstanding California Civil Code Section 1542.
              </Text>

              <Text style={[styles.boldTermsText, {marginTop: 30}]}>
                I agree to the terms and conditions and privacy policy as set
                forth above, and consent to my de-identified data being used for
                continued research in precision medicine.
              </Text>

              <Text style={[styles.conditionsText, {marginTop: 30}]}>
                Thank you for participating in the program. Your participation
                will assist us in gathering information to assist the general
                population with issues related to personal health and
                well-being.
              </Text>
            </View>

            <View style={{height: 30}} />
          </Collapsible>
        </KeyboardAwareScrollView>

        <KeyboardAvoidingView
          style={{
            justifyContent: 'flex-end',
          }}
          behavior={Platform.OS === 'ios' ? 'position' : null}
          enabled={true}
          keyboardVerticalOffset={
            Platform.OS === 'android' ? 0 : isIphoneX() ? -34 : 60
          }>
          <TouchableWithoutFeedback onPress={this.validateFields}>
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Continue</Text>
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

        <Modal
          style={styles.modal}
          backdrop={false}
          backdropPressToClose={false}
          animationDuration={450}
          position={'center'}
          ref={'modal'}
          swipeToClose={false}
          swipeArea={50}
          coverScreen={true}
          onClosed={() => this.setState({isModalOpened: false})}>
          <Animatable.View
            animation="fadeIn"
            delay={185}
            duration={10}
            style={{
              alignSelf: 'center',
              height: 142,
              backgroundColor: 'rgb(61,75,83)',
              borderRadius: 4,
              width: width - 40,
              position: 'absolute',
              bottom: isIphoneX() ? 102 : 102 - 34,
            }}>
            <Text style={styles.hintText}>
              In case there are issues with your email, this is the only way we
              are able to communicate with you about your health information.
            </Text>

            <TouchableWithoutFeedback
              onPress={() => {
                this.refs.modal.close();
                this.setState({isModalOpened: false});
              }}>
              <View
                style={{
                  width: width - 40,
                  height: 44,
                  position: 'absolute',
                  bottom: 0,
                }}>
                <View
                  style={{
                    width: width - 40,
                    height: 0.5,
                    backgroundColor: 'rgb(73,89,99)',
                    alignSelf: 'center',
                  }}
                />
                <Text style={styles.hintButtonText}>Okay</Text>
              </View>
            </TouchableWithoutFeedback>
          </Animatable.View>
        </Modal>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          date={new Date(new Date().getFullYear() - 18, 0, 1)}
        />
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
  modal: {
    width: width,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  hintText: {
    color: 'rgb(196,213,224)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    letterSpacing: -0.31,
    lineHeight: 18,
    margin: 20,
  },
  hintButtonText: {
    color: 'rgb(255,255,255)',
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 18,
    marginTop: 12,
    alignSelf: 'center',
  },
  agreeText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: -0.19,
    lineHeight: 20,
    color: 'rgb(16,16,16)',
  },
  termsText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: -0.19,
    lineHeight: 20,
    color: 'rgb(0,168,235)',
  },
  conditionsTitle: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: -0.3,
    color: 'rgb(16,16,16)',
  },
  conditionsText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 22,
    color: 'rgb(54,58,61)',
  },
  listText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: 'rgb(54,58,61)',
    width: width - 60,
  },
  boldTermsText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 22,
    color: 'rgb(16,16,16)',
  },
  errorTextApi: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: -0.3,
    color: 'rgb(228,77,77)',
  },
});

export default Signup2;

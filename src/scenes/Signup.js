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
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import {BoxShadow} from 'react-native-shadow';
import {getEmoji} from 'react-native-emoji';

import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';
import FloatingLabelInput2 from '../components/FloatingLabelInput2';

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
  height: 205,
  color: '#273849',
  border: 25,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 12,
  style: {marginTop: 0, alignSelf: 'center'},
};

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      zipCode: '',

      pickerValue: '',
      filteredCountries: [],

      firstNameError: '',
      lastNameError: '',
      emailError: '',
      phoneError: '',
      countryError: '',
      zipCodeError: '',
      isModalOpened: false,

      isRegisteredDialogVisible: false,
    };

    this.countries = [];

    this.checkCountries = [];
  }

  componentDidMount() {
    let countries = getAllCountries();

    console.log('this.countries', countries);

    countries.map((item, index) => {
      if (typeof item.name.common !== 'undefined') {
        if (
          item.cca2 === 'GBENG' ||
          item.cca2 === 'GBSCT' ||
          item.cca2 === 'GBWLS' ||
          item.cca2 === 'UNKNOWN'
        ) {
        } else {
          const flag = this.getFlagEmojiName(item.flag);

          this.countries.push({
            name: item.name.common,
            cca2: item.cca2,
            flag: item.flag,
          });

          this.checkCountries.push(item.name.common);
        }
      }
    });
  }

  getFlagEmojiName = (name) => {
    try {
      const emoji = getEmoji(`:${name}:`);
      return emoji;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Filter countries list by the entered string.
   */
  filterCountries = (text) => {
    try {
      if (text === '') {
        this.setState({filteredCountries: this.countries});
      } else {
        const countriesArray = [];
        this.countries.filter((object) => {
          if (object.name.toLowerCase().includes(text.toLowerCase())) {
            console.log('object.name', object.name, object.cca2);
            countriesArray.push(object);
          }
        });

        this.setState({
          filteredCountries: countriesArray,
          country: null,
          pickerValue: text,
        });

        console.log('object.name', this.state.filteredCountries);
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Choose the country from the list.
   */
  onItemPress = (item) => {
    try {
      console.log(item.name);

      // let errors = this.state.errors;
      // if (errors.hasOwnProperty("pickerValue")) {
      //   delete errors["pickerValue"];
      // }

      this.setState({
        pickerValue: item.name,
        filteredCountries: [],
        country: item.name,
        // errors,
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  validateField = (name, value) => {
    try {
      this.setState({[name]: value});

      let error = '';
      if (name === 'firstName') {
        error = 'First Name is required';
      } else if (name === 'lastName') {
        error = 'Last Name is required';
      } else if (name === 'email') {
        error = 'Email address is required';
      } else if (name === 'phone') {
        error = 'Phone is required';
      } else if (name === 'country') {
        error = 'Country is required';
      } else if (name === 'zipCode') {
        error = 'Zip Code is required';
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

  validateEmail = (email) => {
    try {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  checkErrors = () => {
    try {
      let errorsCount = 0;
      if (this.state.email === '') {
        this.setState({emailError: 'Email address is required'});
        errorsCount += 1;
      } else {
        if (!this.validateEmail(this.state.email)) {
          this.setState({emailError: 'Email address is invalid'});
        } else {
          if (this.state.email === '1@i.ua') {
            this.setState({isRegisteredDialogVisible: true});
            errorsCount += 1;
          } else {
            this.setState({emailError: ''});
          }
        }
      }

      if (this.state.firstName === '') {
        this.setState({firstNameError: 'First Name is required'});
        errorsCount += 1;
      } else {
        this.setState({firstNameError: ''});
      }

      if (this.state.lastName === '') {
        this.setState({lastNameError: 'Last Name is required'});
        errorsCount += 1;
      } else {
        this.setState({lastNameError: ''});
      }

      const mobile = this.state.phone.replace(/\D/g, '');
      console.log('mobile', mobile);
      if (mobile === '') {
        this.setState({phoneError: 'Phone is required'});
        errorsCount += 1;
      } else {
        this.setState({phoneError: ''});
      }

      if (this.state.country === '') {
        this.setState({countryError: 'Country is required'});
        errorsCount += 1;
      } else {
        this.setState({countryError: ''});
      }

      if (this.state.zipCode === '') {
        this.setState({zipCodeError: 'Zip Code is required'});
        errorsCount += 1;
      } else {
        this.setState({zipCodeError: ''});
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
        Actions.signup2({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          phone: this.state.phone,
          country: this.state.country,
          zipCode: this.state.zipCode,
        });
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

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <KeyboardAwareScrollView
          // contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled
          style={{flex: 1}}
          keyboardShouldPersistTaps={'handled'}
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

          <View
            style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center'}}>
            <FloatingLabelInput2
              label={'First Name'}
              value={this.state.firstName}
              onChangeText={(firstName) =>
                this.validateField('firstName', firstName)
              }
              width={(width - 55) / 2}
              marginTop={0}
              phoneInputType={false}
              error={this.state.firstNameError}
              errorMarginHorizontal={0}
            />

            <View style={{width: 15}} />

            <FloatingLabelInput2
              label={'Last Name'}
              value={this.state.lastName}
              onChangeText={(lastName) =>
                this.validateField('lastName', lastName)
              }
              width={(width - 55) / 2}
              marginTop={0}
              phoneInputType={false}
              error={this.state.lastNameError}
              errorMarginHorizontal={0}
            />
          </View>

          <FloatingLabelInput2
            label={'Email Address'}
            value={this.state.email}
            onChangeText={(email) => this.validateField('email', email)}
            width={width - 40}
            marginTop={20}
            phoneInputType={false}
            type="emailAddress"
            keyboard="email-address"
            error={this.state.emailError}
          />

          <View style={{alignSelf: 'center'}}>
            <FloatingLabelInput2
              label="Phone"
              value={this.state.phone}
              onChangeText={(phone) => this.validateField('phone', phone)}
              width={width - 40}
              marginTop={20}
              phoneInputType={true}
              error={this.state.phoneError}
              errorMarginHorizontal={0}
            />

            <TouchableWithoutFeedback onPress={this.onPhoneInfoPress}>
              <View style={{position: 'absolute', top: 50, right: 0}}>
                <Image source={require('../resources/icon/help.png')} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <FloatingLabelInput2
            label="Country"
            value={this.state.country}
            // onChangeText={(country) => this.validateField("country", country)}
            onChangeText={(value) => this.filterCountries(value)}
            width={width - 40}
            marginTop={20}
            phoneInputType={false}
            error={this.state.countryError}
          />

          {this.state.filteredCountries.length !== 0 && (
            <BoxShadow
              setting={{
                ...shadowOpt,
              }}
              styles={[styles.card2, {marginTop: 0, height: 205}]}>
              <View style={[styles.card2, {marginTop: 0, height: 205}]}>
                <ScrollView
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="always"
                  style={{height: 205, overflow: 'hidden', shadowOpacity: 0}}>
                  {this.state.filteredCountries.map((item, index) => (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() => this.onItemPress(item)}>
                      <View style={{overflow: 'hidden'}}>
                        <View
                          style={{
                            justifyContent: 'center',
                            overflow: 'hidden',
                            marginTop: index === 0 ? 20 : 14,
                            marginHorizontal: 16,
                          }}>
                          {Platform.OS === 'ios' ? (
                            <Text
                              style={[
                                {
                                  marginBottom:
                                    this.state.filteredCountries.length - 1 !==
                                    index
                                      ? 0
                                      : 19,
                                },
                              ]}>
                              {this.getFlagEmojiName(item.flag) +
                                '   ' +
                                item.name}
                            </Text>
                          ) : (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Image
                                style={[
                                  styles.flag,
                                  {
                                    marginBottom:
                                      this.state.filteredCountries.length -
                                        1 !==
                                      index
                                        ? 0
                                        : 19,
                                  },
                                ]}
                                source={{uri: 'ic_list_' + item.cca2}}
                              />
                              <Text
                                style={[
                                  {
                                    marginBottom:
                                      this.state.filteredCountries.length -
                                        1 !==
                                      index
                                        ? 0
                                        : 19,
                                  },
                                ]}>
                                {'   ' + item.name}
                              </Text>
                            </View>
                          )}

                          {this.state.filteredCountries.length - 1 !==
                            index && (
                            <View
                              style={{
                                marginTop: 15,
                                width: width - 72,
                                height: 0.5,
                                backgroundColor: 'rgb(216,215,222)',
                              }}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
              </View>
            </BoxShadow>
          )}

          <FloatingLabelInput2
            label="Zip Code"
            value={this.state.zipCode}
            onChangeText={(zipCode) => this.validateField('zipCode', zipCode)}
            width={width - 40}
            marginTop={20}
            phoneInputType={false}
            error={this.state.zipCodeError}
          />
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

        <Dialog
          visible={this.state.isRegisteredDialogVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isRegisteredDialogVisible: false});
          }}
          onDismiss={() => {
            this.setState({isRegisteredDialogVisible: false});
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
            <View style={styles.card}>
              <Image
                source={require('../resources/icon/warning_icon2.png')}
                style={{marginTop: 41, alignSelf: 'center'}}
              />
              <Text style={styles.registeredTitle}>
                Have You Already Registered?
              </Text>
              <Text style={styles.registeredText}>
                This email address or username has been registered previously.
                You don’t need to register again, please click the button below
                to login instead.
              </Text>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({isRegisteredDialogVisible: false}, () =>
                    Actions.login(),
                  )
                }>
                <View style={styles.registeredButton}>
                  <Text style={styles.registeredButtonText}>Login Here</Text>
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
    width: width - 75,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
  },
  card2: {
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
    shadowOpacity: 0.12,
    shadowRadius: 25,
    shadowColor: 'rgb(39,56,73)',
    shadowOffset: {height: 12, width: 0},
  },
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
  registeredTitle: {
    alignSelf: 'center',
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    width: width - 135,
    textAlign: 'center',
    marginTop: 24,
  },
  registeredText: {
    alignSelf: 'center',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    width: width - 135,
    textAlign: 'center',
    marginTop: 10,
  },
  registeredButton: {
    width: 140,
    height: 40,
    borderRadius: 22,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 40,
    backgroundColor: 'rgb(0,168,235)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registeredButtonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
});

export default Signup;

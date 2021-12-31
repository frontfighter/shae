import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import GoogleFit, {Scopes} from 'react-native-google-fit';

import {
  getUserVariables,
  createOrUpdateRealm,
  readRealmRows,
} from '../data/db/Db';

const {height, width} = Dimensions.get('window');

class GoogleFitLinkScreen extends Component {
  constructor() {
    super();

    this.state = {
      isLinked: null,
    };

    this.userVariables = null;
  }

  componentDidMount() {
    let userVariables = getUserVariables();
    if (typeof userVariables !== 'undefined' && userVariables !== null) {
      this.userVariables = JSON.parse(JSON.stringify(userVariables));

      // GoogleFit.isEnabled((error, isEnabled) => {
      //   if (isEnabled) {
      //     this.setState({isLinked: isEnabled});
      //   }
      // });
      this.setState({isLinked: this.userVariables.isGoogleFitLinked});
      console.log(
        'userVariables.isGoogleFitLinked',
        this.userVariables.isGoogleFitLinked,
      );
    }
  }

  onGoogleFitLinkButtonPress = () => {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_LOCATION_READ,
        Scopes.FITNESS_NUTRITION_READ,
        Scopes.FITNESS_BLOOD_PRESSURE_READ,
        Scopes.FITNESS_BLOOD_GLUCOSE_READ,
        Scopes.FITNESS_OXYGEN_SATURATION_READ,
        Scopes.FITNESS_BODY_TEMPERATURE_READ,
        Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ,
        Scopes.FITNESS_SLEEP_READ,
        Scopes.FITNESS_HEART_RATE_READ,
      ],
    };
    GoogleFit.authorize(options)
      .then((authResult) => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          GoogleFit.isEnabled((error, isEnabled) => {
            if (isEnabled) {
              this.setState({isLinked: true});
              this.userVariables.isGoogleFitLinked = isEnabled;
              console.log(
                'isEnabled',
                isEnabled,
                this.userVariables.isGoogleFitLinked,
              );
              createOrUpdateRealm('UserVariables', this.userVariables);
              readRealmRows('UserVariables');
            }
          });
        } else {
          console.log('AUTH_DENIED', authResult.message);
          this.userVariables.isGoogleFitLinked = false;
          this.setState({isLinked: false});

          createOrUpdateRealm('UserVariables', this.userVariables);
          readRealmRows('UserVariables');
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  };

  onDisconnectPress = () => {
    GoogleFit.disconnect();

    this.userVariables.isGoogleFitLinked = false;
    createOrUpdateRealm('UserVariables', this.userVariables);
    readRealmRows('UserVariables');

    this.setState({isLinked: false});
  };

  render() {
    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', height, width}}>
        {this.state.isLinked === null || !this.state.isLinked ? (
          <View>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(244,88,152,0.1)',
                alignSelf: 'center',
                marginTop: 162,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../resources/icon/link_google_fit_icon.png')}
                style={{width: 35, height: 40}}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.googleFitTitle}>Link Google Fit</Text>
            <Text style={styles.googleFitText}>
              Link your Google Fit account to Shae to get even more
              personalized, real-time recommendations!
            </Text>
            <View
              styles={[
                styles.googleFitButton,
                {
                  height: 48,
                  width: 140,
                },
              ]}>
              <TouchableWithoutFeedback
                onPress={this.onGoogleFitLinkButtonPress}>
                <View style={[styles.googleFitButton, {shadowOpacity: 0}]}>
                  <Text style={styles.googleFitButtonText}>Link Now</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        ) : (
          <View style={{width, height}}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(244,88,152,0.1)',
                alignSelf: 'center',
                marginTop: 162,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../resources/icon/link_google_fit_icon.png')}
                style={{width: 35, height: 40}}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.googleFitTitle}>Google Fit Linked</Text>
            <Text style={styles.googleFitText}>
              Your Google Fit account already linked to ShaeFit. Please click
              the link below to disconnect.
            </Text>
            <TouchableWithoutFeedback onPress={this.onDisconnectPress}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Text style={styles.disconnectText}>Disconnect Google Fit</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  googleFitTitle: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 19,
    letterSpacing: -0.3,
    fontWeight: '600',
    color: 'rgb(31,33,35)',
    alignSelf: 'center',
    marginTop: 30,
  },
  googleFitText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgb(54,58,61)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 44,
    width: width - 87,
  },
  googleFitButton: {
    // marginTop: 30,
    // marginBottom: 40,
    width: 140,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgb(0,164,228)',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowColor: 'rgb(0,164,228)',
    shadowOffset: {height: 10, width: 0},
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginTop: 30,
    marginBottom: 40,
  },
  googleFitButtonText: {
    fontFamily: 'SFProText-Bold',
    fontSize: 15,
    letterSpacing: -0.36,
    fontWeight: '700',
    color: 'rgb(255,255,255)',
  },
  disconnectText: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 15,
    letterSpacing: -0.36,
    fontWeight: '600',
    color: 'rgb(0,168,235)',
  },
});

GoogleFitLinkScreen.navigationOptions = {
  headerRight: <View style={{width: 53}} />,
};

export default GoogleFitLinkScreen;

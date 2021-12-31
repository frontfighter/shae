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
import {request, PERMISSIONS} from 'react-native-permissions';

const {height, width} = Dimensions.get('window');

class TakePhotos extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    Actions.refresh({
      rightTitle: 'Skip',
      onRight: this._handleSkip,
    });

    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    ).then((result) => {
      // …
    });
  }

  _handleSkip = () => {
    Actions.dashboard();
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
          // alignItems: 'center',
          // alignItems: 'center',
          // justifyContent: 'center',
          // alignSelf: 'center',
        }}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 60
              // minHeight: height - 134,
            }}>
            <Image
              source={require('../resources/icon/camera.png')}
              style={{marginTop: 0, alignSelf: 'center'}}
            />
            <Text style={styles.title}>Capture your Avatar</Text>
            <Text style={styles.instructionsText}>
              Instructions for taking the photo
            </Text>

            <View style={{alignSelf: 'center', alignItems: 'center'}}>
              <View
                style={{
                  marginTop: 30,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View style={styles.circle}>
                  <Text style={styles.number}>1</Text>
                </View>
                <Text style={styles.instructions}>
                  We’ll take a front, back and both sides photo now to create
                  your avatar.
                </Text>
              </View>

              <View
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <View style={styles.circle}>
                  <Text style={styles.number}>2</Text>
                </View>
                <Text style={styles.instructions}>
                  Wear close-fitting clothes like fitness gear so we can see the
                  shape of your body.
                </Text>
              </View>

              <View
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  // marginBottom: 48 + 20,
                }}>
                <View style={styles.circle}>
                  <Text style={styles.number}>3</Text>
                </View>
                <Text style={styles.instructions}>
                  Place your body in the frame and pinch the outline to fit
                  snugly around your body.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableWithoutFeedback
          onPress={() => Actions.captureAvatar({userId: this.props.userId})}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Take Photo’s</Text>
          </View>
        </TouchableWithoutFeedback>
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
    alignSelf: 'center',
  },
  instructionsText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    marginTop: 9,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgb(31,33,35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  number: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.3,
    color: 'rgb(31,33,35)',
  },
  instructions: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.3,
    color: 'rgb(54,58,61)',
    width: width - 135,
  },
  button: {
    width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isIphoneX() ? 34 : 0,
  },
  buttonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    color: 'rgb(255,255,255)',
  },
});

export default TakePhotos;

import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Alert,
  StatusBar,
  ActivityIndicator,
  InteractionManager,
  AppState,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
import {FaceDetector, RNCamera} from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {
  accelerometer,
  gyroscope,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import FastImage from 'react-native-fast-image';
import {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

import Slider from '../components/SliderPhoto';

const {height, width} = Dimensions.get('window');
const screenHeight = Dimensions.get('screen').height;
const navbarHeight = screenHeight - height - StatusBar.currentHeight;

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: 'bottom', // optional
  useNativeDriver: true, // optional
});

const cameraDelayTimes = [0, 3, 10];
const shadowOpt = {
  width: (width - 55) / 2,
  height: 225,
  color: '#273849',
  border: 18,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 6,
  style: {marginTop: 24},
};

const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {width: srcWidth * ratio, height: srcHeight * ratio};
};

class PhotoAvatarScreen extends Component {
  constructor() {
    super();

    this.state = {
      isModalVisible: false,
      cameraType:
        Platform.OS === 'android'
          ? RNCamera.Constants.Type.front
          : RNCamera.Constants.Type.back,
      mirrorMode: false,
      photoUri: '',
      photoFileName: '',
      x: 0,
      y: 0,
      z: 0,
      tilt: 0,
      date: '',
      showDelayTimes: false,
      delayTime: 10,
      delayTimeChosen: 10,
      startCountDown: false,
      androidCalibrationData: null,
      faces: {
        live: null,
        inImage: null,
      },
      gyroscopeValue: {},
      isAlreadyTakenPhoto: false,
      isLoading: false,
      interactionsComplete: false,
      appState: AppState.currentState,
    };

    this.modalTitle = '';
    this.modalText = '';
    this.subscriptionAccelerometer = null;
    this.subscriptionGyroscope = null;
    this.additionalData = null;
    this.intervalID = null;

    this.count = 0;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.setState({interactionsComplete: true});
      }, 500);

      // hideNavigationBar();

      AppState.addEventListener('change', this._handleAppStateChange);

      console.log('DeviceInfo.isEmulator()', DeviceInfo.isEmulator());
      this.setModalTexts(this.props.title);
      this.setState({date: this.props.date});

      if (!DeviceInfo.isEmulator()) {
        setUpdateIntervalForType(
          SensorTypes.accelerometer,
          Platform.OS === 'ios' ? 100 : 200,
        );
        setUpdateIntervalForType(SensorTypes.gyroscope, 200);

        this.subscriptionAccelerometer = accelerometer.subscribe((values) => {
          this.setState(
            {
              x: values.x,
              y: values.y,
              z: values.z,
            },
            () => {},
          );
          const roll = Math.atan2(values.y, values.z) * 57.3;
          const pitch =
            Math.atan2(
              -1 * values.x,
              Math.pow(values.y * values.y + values.z * values.z, 0.5),
            ) * 57.3;

          const tilt = roll; // portrait ? x : y;
          this.setState({tilt: Math.abs(tilt.toFixed(1))});
        });

        this.subscriptionGyroscope = gyroscope.subscribe((gyroscopeValue) => {
          this.setState({gyroscopeValue});
        });
      }

      if (this.props.image !== '') {
        this.setState({
          photoUri: this.props.image,
          isAlreadyTakenPhoto: true,
        });
      }
    });
  }

  componentWillUnmount() {
    if (!DeviceInfo.isEmulator()) {
      this.subscriptionAccelerometer.unsubscribe();
      this.subscriptionGyroscope.unsubscribe();
    }

    this.camera = null;

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    } else {
      console.log('App has come to the background!');
    }
    this.setState({appState: nextAppState});
  };

  setModalTexts = (title) => {
    if (title === 'Front') {
      this.modalTitle = `${title}: Instructions`;
      this.modalText =
        'Facing towards the camera. Please stand up tall with your chin slightly tucked and eyes looking towards the horizon. Place your arms down by your side with your palms facing forwards. Please ensure your whole body is in the shot including head, hands and feet';
    } else if (title === 'Side') {
      this.modalTitle = `${title}: Instructions`;
      this.modalText =
        'Please stand up tall with your chin slightly tucked and eyes looking towards the horizon Place your arms down by your side with your palms facing towards your legs. Please ensure your whole body is in the shot including head, hands and feet';
    } else if (title === 'Right Side') {
      this.modalTitle = `${title}: Instructions`;
      this.modalText =
        'Please stand up tall with your chin slightly tucked and eyes looking towards the horizon Place your arms down by your side with your palms facing towards your legs. Please ensure your whole body is in the shot including head, hands and feet';
    } else if (title === 'Back') {
      this.modalTitle = `${title}: Instructions`;
      this.modalText =
        'With your back to the camera. Please stand up tall with your chin slightly tucked and eyes looking towards the horizon. Place your arms down by your side with your palms facing forwards. Please ensure your whole body is in the shot including head, hands and feet';
    }
  };

  dismissModal = () => {
    try {
      if (this.popupDialog !== null) {
        this.popupDialog.dismiss();
        this.setState({isModalVisible: false});
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  animatedDismissModal = () => {
    try {
      if (this.popupDialog !== null) {
        this.popup.slideOutUp(350).then(() => this.dismissModal());
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  readyTakePicture = () => {
    if (this.state.startCountDown) {
      clearInterval(this.intervalID);
      this.setState({
        startCountDown: false,
        delayTime: this.state.delayTimeChosen,
        showDelayTimes: false,
      });
    } else if (
      (Platform.OS === 'android' &&
        this.state.tilt > 85 &&
        this.state.tilt < 95) ||
      (this.state.tilt > 89 && this.state.tilt < 91)
    ) {
      if (this.state.delayTimeChosen === 0) {
        this.takePicture();
      } else {
        if (this.state.cameraType === RNCamera.Constants.Type.front) {
          this.setState({delayTime: this.state.delayTimeChosen}, () => {
            if (this.state.startCountDown) {
              clearInterval(this.intervalID);
              this.setState({startCountDown: false});
              return;
            } else this.setState({startCountDown: true});
            this.intervalID = setInterval(() => {
              if (this.state.delayTime === 1) {
                clearInterval(this.intervalID);
                this.setState({delayTime: ''});
                this.takePicture();

                return;
              }
              this.setState((prev) => ({
                ...prev,
                delayTime: prev.delayTime - 1,
              }));
            }, 1000);
          });
        } else {
          this.setState({delayTime: this.state.delayTimeChosen}, () => {
            if (this.state.startCountDown) {
              clearInterval(this.intervalID);
              this.setState({startCountDown: false});
              return;
            } else this.setState({startCountDown: true});
            this.intervalID = setInterval(() => {
              if (this.state.delayTime === 1) {
                clearInterval(this.intervalID);
                this.setState({delayTime: ''});
                this.takePicture();

                return;
              }
              this.setState((prev) => ({
                ...prev,
                delayTime: prev.delayTime - 1,
              }));
            }, 1000);
          });
        }
      }
    }
  };

  getFocusObjectDistance = (
    exif_data = {},
    RealObjectHeight = 0,
    isNotFront = false,
    faceY,
  ) => {
    const middleRatio = faceY;
    const exif = Platform.OS === 'ios' ? exif_data['{Exif}'] : exif_data;
    console.log('getFocusObjectDistance exif', exif);
    const {FocalLength, FocalLenIn35mmFilm} = exif;

    const CropFactor = FocalLenIn35mmFilm / FocalLength;
    const PixelObjectHeight =
      calculateAspectRatioFit(284, 644, width - 96, height - 210).height -
      middleRatio;
    const SensorObjectHeight = !isNotFront
      ? PixelObjectHeight * CropFactor
      : (PixelObjectHeight * CropFactor) / 2;
    const distanceMeters = (
      (((RealObjectHeight / 100).toFixed(2) * FocalLength) /
        SensorObjectHeight) *
      1000
    ).toFixed(2);
    return {
      millimeters: (distanceMeters * 1000).toFixed(2),
      centimeters: (distanceMeters * 100).toFixed(2),
      meters: distanceMeters,
    };
  };

  handleFaceDetected = (faceArray) => {
    const {type, faces} = faceArray;
    if (faces.length > 0) {
      this.setState({
        ...this.state,
        faces: {...this.state.faces, live: faces},
      });
    }
  };

  handleFaceDetectedError = (error) => {
    console.log(error);
    FaceDetector;
  };

  takePicture = async () => {
    if (this.camera) {
      try {
        const options = {
          quality: 1,
          base64: false,
          fixOrientation: true,
          orientation: 'portrait',
          forceUpOrientation: true,
          exif: true,
          mirrorImage: this.state.mirrorMode,
          pauseAfterCapture: true,
        };
        const data = await this.camera.takePictureAsync(options); // { uri, width, height, exif }

        this.setState(
          {
            photoUri: data.uri,
            delayTime: this.state.delayTimeChosen,
            startCountDown: false,
          },
          async () => {
            if (Platform.OS === 'android') {
              this.setState({isLoading: true});
            }
            console.log('takePicture data', data);

            const checkIfPictureContainFace = await FaceDetector.detectFacesAsync(
              data.uri,
              {
                mode: FaceDetector.Constants.Mode.accurate,
                detectLandmarks: FaceDetector.Constants.Landmarks.all,
                runClassifications: FaceDetector.Constants.Classifications.all,
              },
            );

            const {x, y} =
              this.state.faces.live != null && this.state.faces.live.length > 0
                ? this.state.faces.live[0].bounds.origin
                : {x: 0, y: 0};

            const focusObjectDistance =
              data.exif != undefined
                ? this.getFocusObjectDistance(
                    data.exif,
                    this.props.height,
                    this.state.cameraType !== RNCamera.Constants.Type.back,
                    y,
                  )
                : 0;
            console.log(focusObjectDistance);

            const translationMatrix = [
              x,
              y,
              !isNaN(focusObjectDistance.meters)
                ? parseFloat(focusObjectDistance.meters)
                : 0,
            ];
            // Get gyroscope value
            const {x: xg, y: yg, z: zg} = this.state.gyroscopeValue
              ? this.state.gyroscopeValue
              : {x: 0, y: 0, z: 0};
            const rotationMatrix = [
              xg != undefined ? xg : 0,
              yg != undefined ? yg : 0,
              zg != undefined ? zg : 0,
            ];
            // Distortion coefficient
            const distortionCoefficients = [
              0.03745064619036303,
              -0.05696336726790861,
              0.0014705393416119647,
              0.003161343303012978,
            ];
            const {PixelYDimension, PixelXDimension} =
              data.exif && data.exif['{Exif}']
                ? data.exif['{Exif}']
                : {PixelYDimension: 0, PixelXDimension: 0};
            const {DPIWidth, DPIHeight} = data.exif
              ? data.exif
              : {DPIWidth: 0, DPIHeight: 0};
            const Ox = data.exif ? PixelXDimension - x : 0;
            const Oy = data.exif ? PixelYDimension - y : 0;
            const instrinsicMatrix = [
              [DPIWidth, 0, Ox],
              [0, DPIHeight, Oy],
              [0, 0, 1],
            ];

            this.setState(
              {
                ...this.state,
                faces: {
                  ...this.state.faces,
                  inImage: checkIfPictureContainFace.faces,
                },
                isLoading: false,
                // photoUri: data.uri,
              },
              () => {
                this.additionalData = {
                  ...data,
                  ...{
                    uri: data.uri,
                    rotationMatrix: rotationMatrix,
                    translationMatrix: translationMatrix,
                    intMatrix: instrinsicMatrix,
                    distorsionMatrix: distortionCoefficients,
                  },
                };

                console.log(
                  'takePicture data',
                  JSON.stringify({
                    uri: data.uri,
                    width: data.width,
                    height: data.height,
                    faces: this.state.faces,
                    focusObjectDistance,
                    translationMatrix,
                    rotationMatrix,
                    instrinsicMatrix,
                    distortionCoefficients,
                  }),
                );
              },
            );
          },
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  changeCameraType = () => {
    if (this.state.cameraType === RNCamera.Constants.Type.back) {
      this.setState(
        {
          cameraType: RNCamera.Constants.Type.front,
          mirrorMode: true,
        },
        () => {
          if (this.camera !== null) {
            // setTimeout(() => {
            //   console.log('resumePreview');
            //   this.camera.resumePreview();
            // }, 100);
          }
        },
      );
    } else {
      this.setState(
        {
          cameraType: RNCamera.Constants.Type.back,
          mirrorMode: false,
        },
        () => {
          if (this.camera !== null) {
            // setTimeout(() => {
            //   console.log('resumePreview');
            //   this.camera.resumePreview();
            // }, 100);
          }
        },
      );
    }
  };

  openGallery = () => {
    try {
      const options = {
        title: 'Select Photo',
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let source = {uri: response.uri};
          console.log('response.fileName', response.fileName);

          let fileName;
          if (typeof response.fileName === 'undefined') {
            const splittedUrl = response.uri.split('/');
            if (splittedUrl.length !== 0) {
              fileName = splittedUrl[splittedUrl.length - 1];
            }
          } else {
            fileName = response.fileName;
          }

          IP.openCropper({
            path: source.uri,
            // cropperCircleOverlay: true,
          }).then((image) => {
            console.log(image, source.uri);
            source = {uri: 'file://' + image.path};

            console.log('fileName', fileName);

            this.setState(
              {photoUri: source.uri, photoFileName: fileName},
              () => {
                this.props.updatePhoto(
                  this.props.title,
                  this.state.photoUri,
                  this.state.cameraType,
                  this.additionalData,
                );
              },
            );
            console.log('photoUri', source.uri);
            // }
          });
        }
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onContinuePress = () => {
    console.log('onContinuePress', this.additionalData);

    if (
      this.additionalData !== null &&
      typeof this.additionalData.intMatrix !== 'undefined' &&
      this.additionalData.intMatrix !== null
    ) {
      if (!DeviceInfo.isEmulator()) {
        this.subscriptionAccelerometer.unsubscribe();
        this.subscriptionGyroscope.unsubscribe();
      }

      this.camera = null;

      this.props.updatePhoto(
        this.props.title,
        this.state.photoUri,
        this.state.cameraType,
        this.additionalData,
      );

      Actions.refresh({
        key: 'captureAvatar',
      });
      Actions.pop();

      showNavigationBar();
    }
  };

  onClickTimesLists = () => {
    this.setState({showDelayTimes: !this.state.showDelayTimes});
  };

  onClickDelayTime = (delayTime) => {
    this.setState({
      delayTime,
      showDelayTimes: false,
      delayTimeChosen: delayTime,
    });
  };

  onDeletePress = () => {
    this.props.onDelete(this.props.title);

    Actions.refresh({
      key: 'captureAvatar',
    });
    Actions.pop();

    showNavigationBar();
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          {this.state.photoUri !== '' || this.state.isAlreadyTakenPhoto ? (
            <FastImage
              source={{
                uri: this.state.photoUri,
                priority: FastImage.priority.high,
              }}
              style={styles.preview}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : this.state.interactionsComplete &&
            this.state.appState === 'active' ? (
            <RNCamera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{flex: 1}}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              type={this.state.cameraType}
              pictureSize={Platform.OS === 'ios' ? 'High' : 'None'}
              onFacesDetected={this.handleFaceDetected}
              onFaceDetectionError={this.handleFaceDetectedError}
              flashMode={RNCamera.Constants.FlashMode.auto}
              faceDetectionLandmarks={FaceDetector.Constants.Landmarks.all}
              faceDetectionMode={FaceDetector.Constants.Mode.accurate}
              exposure={-1}
              onMountError={(error) => alert('error ' + error)}
            />
          ) : null}

          <LinearGradient
            colors={['rgb(0,0,0)', 'rgba(0,0,0,0)']}
            style={{
              width,
              height: 150,
              top: 0,
              alignSelf: 'center',
              position: 'absolute',
              opacity: 1,
            }}>
            <View
              style={{
                width: width - 40,
                alignSelf: 'center',
                marginTop: 55,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  Actions.pop();
                  showNavigationBar();
                }}>
                <View>
                  <Image source={require('../resources/icon/close.png')} />
                </View>
              </TouchableWithoutFeedback>

              {this.state.date !== '' ? (
                <View>
                  <Text style={[styles.mainTitle, {alignSelf: 'center'}]}>
                    {this.props.title}
                  </Text>
                  <Text style={styles.subtitle}>{this.state.date}</Text>
                </View>
              ) : (
                <Text style={styles.mainTitle}>{this.props.title}</Text>
              )}

              {this.state.photoUri !== '' ? (
                <View style={{width: 22, height: 22}} />
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.setState({isModalVisible: true});
                  }}>
                  <View>
                    <Image
                      source={require('../resources/icon/infoPhoto.png')}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgb(0,0,0)']}
            style={{
              width,
              height: 150,
              bottom: 0,
              alignSelf: 'center',
              position: 'absolute',
              opacity: 1,
            }}>
            {this.state.photoUri !== '' ? (
              <View
                style={{
                  width: width - 60,
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 30,
                }}>
                {this.state.date !== '' ? (
                  <View
                    style={{
                      width: width - 60,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState(
                          {photoUri: '', date: '', isAlreadyTakenPhoto: false},
                          () => {
                            // setTimeout(() => {
                            //   if (this.camera !== null) {
                            //     this.camera.resumePreview();
                            //   }
                            // }, 100);
                          },
                        );
                      }}>
                      <View style={styles.retakeButton}>
                        <Text style={styles.retakeText}>Retake</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={this.onDeletePress}>
                      <View style={styles.deleteButton}>
                        <Text style={styles.continueText}>Delete</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                ) : (
                  <View
                    style={{
                      width: width - 60,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({photoUri: '', date: ''}, () => {
                          //   setTimeout(() => {
                          //     if (this.camera !== null) {
                          //       this.camera.resumePreview();
                          //     }
                          //   }, 100);
                        });
                      }}>
                      <View style={styles.retakeButton}>
                        <Text style={styles.retakeText}>Retake</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={this.onContinuePress}>
                      <View style={styles.continueButton}>
                        <Text style={styles.continueText}>Continue</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )}
              </View>
            ) : (
              <View
                style={{
                  width: width,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: isIphoneX() ? 0 : 0, // 30
                }}>
                <View style={{flex: 1}}>
                  <TouchableWithoutFeedback onPress={this.changeCameraType}>
                    <View>
                      <Image
                        source={require('../resources/icon/cameraReverse.png')}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <TouchableWithoutFeedback onPress={this.readyTakePicture}>
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 34,
                        backgroundColor: 'grey',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: this.state.startCountDown ? 30 : 64,
                          height: this.state.startCountDown ? 30 : 64,
                          borderRadius: this.state.startCountDown ? 0 : 32,
                          backgroundColor: 'rgb(255,255,255)',
                        }}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                {this.state.startCountDown ? (
                  <View style={{flex: 1}} />
                ) : (
                  <View style={[styles.cameraTimerContainer, {flex: 1}]}>
                    <TouchableWithoutFeedback
                      onPress={this.onClickTimesLists}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      <View style={styles.timerButton}>
                        <Image
                          source={require('../resources/icon/camera_delay.png')}
                        />
                        {this.state.delayTime !== 0 && (
                          <Text style={styles.timerIconText}>
                            {this.state.delayTimeChosen}
                          </Text>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.cameraDelaySecs}>
                      {this.state.showDelayTimes &&
                        cameraDelayTimes.map((item, index) => (
                          <TouchableWithoutFeedback
                            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                            key={index}
                            onPress={() => this.onClickDelayTime(item)}>
                            <Text style={styles.timerDelaySec}>
                              {item === 0 ? 'Off' : `${item}s`}
                            </Text>
                          </TouchableWithoutFeedback>
                        ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </LinearGradient>

          {!DeviceInfo.isEmulator() &&
            this.state.photoUri === '' &&
            this.state.interactionsComplete &&
            this.state.appState === 'active' && (
              <View
                style={{
                  position: 'absolute',
                  top: height / 2,
                  left: -(width - 40) / 2 + 30,
                  overflow: 'visible',
                  zIndex: 9999,
                }}>
                <Slider
                  value={this.state.tilt}
                  // onValueChange={(value) => this.setState({ relax: value })}
                  minText="Not even a bit"
                  maxText="Absolutely"
                  marginTop={0}
                />
              </View>
            )}

          {(Platform.OS === 'android' &&
            this.state.tilt > 85 &&
            this.state.tilt < 95) ||
          (this.state.tilt > 89 && this.state.tilt < 91) ? (
            <View style={styles.path}>
              {this.state.photoUri === '' && (
                <Image
                  resizeMode="cover"
                  style={{...styles.pathImage}}
                  source={require('../resources/icon/path_active.png')}
                />
              )}

              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: calculateAspectRatioFit(
                    width - 95,
                    644,
                    width - 96,
                    Platform.OS === 'android'
                      ? screenHeight - 210
                      : height - 210,
                  ).height,
                }}>
                {!this.state.startCountDown && this.state.photoUri === '' && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      textBreakStrategy={'simple'}
                      style={[
                        styles.rectangleText,
                        {
                          width:
                            calculateAspectRatioFit(
                              width - 95,
                              644,
                              width - 96,
                              Platform.OS === 'android'
                                ? screenHeight - 210
                                : height - 210,
                            ).width - 20,
                        },
                      ]}>
                      {(Platform.OS === 'android' &&
                        this.state.tilt > 85 &&
                        this.state.tilt < 95) ||
                      (this.state.tilt > 89 && this.state.tilt < 91)
                        ? "You're in the perfect position. Take your photo now!"
                        : this.props.title === 'Front'
                        ? 'Ensure you are standing in the centre of the screen with palms forward. \n\nAngle the camera to 90º until it goes green'
                        : 'Stand side facing the camera with your elbows tucked into your waist. Stand tall and in the centre of the screen. \n\nAngle the camera to 90º until it goes green. '}
                    </Text>
                    {/* "Can you please wear tighter fitting clothes" */}
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.path}>
              {this.state.photoUri === '' && (
                <Image
                  resizeMode="cover"
                  style={styles.pathImage}
                  source={require('../resources/icon/path_inactive.png')}
                />
              )}

              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: calculateAspectRatioFit(
                    width - 95,
                    644,
                    width - 96,
                    Platform.OS === 'android'
                      ? screenHeight - 210
                      : height - 210,
                  ).height,
                }}>
                {!this.state.startCountDown && this.state.photoUri === '' && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      textBreakStrategy={'simple'}
                      style={[
                        styles.rectangleText,
                        {
                          width:
                            calculateAspectRatioFit(
                              width - 95,
                              644,
                              width - 96,
                              Platform.OS === 'android'
                                ? screenHeight - 210
                                : height - 210,
                            ).width - 20,
                        },
                      ]}>
                      {(Platform.OS === 'android' &&
                        this.state.tilt > 85 &&
                        this.state.tilt < 95) ||
                      (this.state.tilt > 89 && this.state.tilt < 91)
                        ? "You're in the perfect position. Take your photo now!"
                        : this.props.title === 'Front'
                        ? 'Ensure you are standing in the centre of the screen with palms forward. \n\nAngle the camera to 90º until it goes green'
                        : 'Stand side facing the camera with your elbows tucked into your waist. Stand tall and in the centre of the screen. \n\nAngle the camera to 90º until it goes green. '}
                    </Text>
                    {/*"Can you please wear tighter fitting clothes" */}
                  </View>
                )}
              </View>
            </View>
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isLoading}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'black',
                opacity: 0.75,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color="rgb(255,255,255)" />
            </View>
          </Modal>

          <Dialog
            visible={this.state.isModalVisible}
            containerStyle={{justifyContent: 'flex-end'}}
            onTouchOutside={() => {
              console.log('onTouchOutside');
              this.setState({
                isModalVisible: !this.state.isModalVisible,
              });
            }}
            onDismiss={() => {
              // this.setState({ isSaveFoodDiaryViewModalVisible: false });
            }}
            dialogAnimation={slideAnimation}
            dialogStyle={{
              overflow: 'visible',
              borderRadius: 0,
              backgroundColor: 'transparent',
            }}>
            <DialogContent style={{paddingBottom: 0}}>
              <View style={styles.modal}>
                <View style={styles.card}>
                  <View style={{overflow: 'hidden', borderRadius: 4}}>
                    <Image
                      source={require('../resources/icon/info.png')}
                      style={{alignSelf: 'center', marginTop: 41}}
                    />
                    <Text style={styles.title}>{this.modalTitle}</Text>
                    <Text style={styles.text}>{this.modalText}</Text>

                    <TouchableWithoutFeedback
                      onPress={() => this.setState({isModalVisible: false})}>
                      <View
                        style={{
                          marginTop: 24,
                          width: 100,
                          height: 40,
                          borderRadius: 22,
                          alignSelf: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgb(0,168,235)',
                          marginBottom: 41,
                        }}>
                        <Text style={styles.gotItButtonText}>Got It</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </DialogContent>
          </Dialog>
        </View>
        {this.state.delayTime !== 0 && this.state.startCountDown && (
          <View style={styles.timerScreen}>
            <Text style={styles.timerScreenText}>{this.state.delayTime}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.3,
    color: 'rgb(148,155,162)',
    marginTop: 10,
    alignSelf: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  card: {
    width: width - 75,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowRadius: 32,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {height: 16, width: 0},
  },
  cardRound: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 24,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {height: 6, width: 0},
  },
  modal: {
    width: width,
    height: height,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(228,77,77,0.1)',
    alignSelf: 'center',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgb(0,164,228)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  title: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    marginTop: 24,
    width: width - 135,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    width: width - 135,
  },
  mainTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    color: 'rgb(255,255,255)',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  retakeButton: {
    width: (width - 75) / 2,
    height: 48,
    borderRadius: 4,
    backgroundColor: 'rgb(255,255,255)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.3,
    color: 'rgb(31,33,35)',
  },
  continueButton: {
    width: (width - 75) / 2,
    height: 48,
    borderRadius: 4,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: (width - 75) / 2,
    height: 48,
    borderRadius: 4,
    backgroundColor: 'rgb(228,77,77)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.36,
    color: 'rgb(255,255,255)',
  },
  subtitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 13,
    letterSpacing: -0.1,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
    opacity: 0.8,
  },
  cameraTimerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cameraDelaySecs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  timerDelaySec: {
    fontFamily: 'SFProText-Medium',
    color: 'white',
    fontSize: 16,
    paddingLeft: 8,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timerIconText: {
    fontFamily: 'SFProText-Medium',
    color: 'white',
    fontSize: 13,
    paddingLeft: 3,
  },
  timerScreen: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: height / 2 - 40,
  },
  timerScreenText: {
    fontFamily: 'SFProText-Bold',
    color: 'white',
    fontSize: 80,
  },
  rectangleText: {
    fontFamily: 'SFProText-Bold',
    color: 'rgb(255,255,255)',
    fontSize: 24,
    width:
      calculateAspectRatioFit(
        568,
        1288,
        width - 95,
        Platform.OS === 'android' ? screenHeight - 210 : height - 210,
      ).width - 20,
    textAlign: 'center',
  },
  timerText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 48,
    color: 'rgb(255,255,255)',
  },
  path: {
    width,
    position: 'absolute',
    top:
      ((Platform.OS === 'android' ? screenHeight : height) -
        calculateAspectRatioFit(
          width,
          Platform.OS === 'android' ? screenHeight : height,
          width - 95,
          Platform.OS === 'android' ? screenHeight - 172 : height - 172,
        ).height) /
      2, // (height - 644) / 2,
    zIndex: 99,
    alignItems: 'center',
  },
  pathImage: {
    width: calculateAspectRatioFit(
      568,
      1288,
      width - 95,
      Platform.OS === 'android' ? screenHeight - 210 : height - 210,
    ).width, // 284,
    height: calculateAspectRatioFit(
      568,
      1288,
      width - 95,
      Platform.OS === 'android' ? screenHeight - 210 : height - 210,
    ).height, // 644
  },
  gotItButtonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
});

export default PhotoAvatarScreen;

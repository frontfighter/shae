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
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {v4 as uuidv4} from 'uuid';
import {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

import * as shaefitApi from '../API/shaefitAPI';
import {
  createOrUpdateRealm,
  getUserVariables,
  getUserDetails,
} from '../data/db/Db';

const {height, width} = Dimensions.get('window');

class CaptureAvatar extends Component {
  constructor() {
    super();

    this.state = {
      frontImage: '',
      frontDate: '',
      sideImage: '',
      sideDate: '',
      frontImage2: '',
      frontDate2: '',
      sideImage2: '',
      sideDate2: '',
      isFrontImage2Loading: false,
      isSideImage2Loading: false,
      isModalVisible: false,
      gender: 'Female',
      dateOfBirth: '',
      height: 175,
      weight: 75,
      mlData: [{}, {}, {}],
      isLoading: false,
      messageFromMl: '',
      isMlModalVisible: false,
      isPhotoViewing: false,
      photoUrl: '',
    };

    this.userDetails = null;
    this.userMeasurements = null;
    this.mlData = [{}, {}, {}];
  }

  async componentDidMount() {
    Actions.refresh({
      rightTitle: 'Skip',
      onRight: this._handleSkip,
    });

    let userVariables = getUserVariables();
    if (typeof userVariables !== 'undefined' && userVariables !== null) {
      userVariables = JSON.parse(JSON.stringify(userVariables));

      // shae___2___Front___2021-02-05T13-09-24___F68F7DAA-DB57-4333-99AF-7895A15CC774.jpg

      if (
        typeof userVariables.progressPhotoAvatarImageFront !== 'undefined' &&
        userVariables.progressPhotoAvatarImageFront !== null &&
        typeof userVariables.progressPhotoAvatarImageSide !== 'undefined' &&
        userVariables.progressPhotoAvatarImageSide !== null
      ) {
        if (
          typeof userVariables.progressPhotoAvatarImageFront !== 'undefined' &&
          userVariables.progressPhotoAvatarImageFront !== null
        ) {
          // const date = userVariables.progressPhotoAvatarImageFront.split(
          //   '___',
          // )[3];

          this.setState({
            frontImage2: userVariables.progressPhotoAvatarImageFront,
            frontDate2: this.getDateFromPhoto(
              userVariables.progressPhotoAvatarImageFrontDate,
            ),
          });
        }

        if (
          typeof userVariables.progressPhotoAvatarImageSide !== 'undefined' &&
          userVariables.progressPhotoAvatarImageSide !== null
        ) {
          this.setState({
            sideImage2: userVariables.progressPhotoAvatarImageSide,
            sideDate2: this.getDateFromPhoto(
              userVariables.progressPhotoAvatarImageSideDate,
            ),
          });
        }
        this.setState({isLoading: true});
        this.userDetails = await shaefitApi.getUserDetails();
        this.setState({isLoading: false});
      } else {
        setTimeout(async () => {
          this.setState({isLoading: true});
        }, 600);

        this.setImages();
        this.userDetails = await shaefitApi.getUserDetails();
      }
    }

    console.log('this.userDetails', this.userDetails);

    const weight =
      typeof this.userDetails.track.weight !== 'undefined'
        ? parseFloat(this.userDetails.track.weight)
        : 0;
    const height =
      typeof this.userDetails.track.height !== 'undefined'
        ? parseFloat(this.userDetails.track.height)
        : 0;
    const gender = this.userDetails.profile.gender;
    const dateOfBirth = this.userDetails.profile.birthdate;

    let mlData = this.state.mlData;

    mlData[2] = {
      userId: this.userDetails.id,
      title: 'measurements',
      measurementID: uuidv4(),
      updateMeasurements: this.userDetails.measurementsUpdated,
      ...this.userDetails.track,
    };

    this.setState({mlData, weight, height, gender, dateOfBirth});
  }

  _handleSkip = () => {
    Actions.dashboard();
  };

  setImages = async () => {
    let allImages = await shaefitApi.getAllOnboardUserImages();

    if (allImages !== 'image not found') {
      allImages = allImages.filter(
        (str) =>
          str.startsWith('shae___') &&
          str.includes('___') &&
          str.split('___')[1] === this.props.userId.toString(),
      );
      console.log('allImages', allImages);

      let frontImage = null;
      let sideImage = null;
      const convertedArray = this.convertStrArrayToObject(allImages);
      for (let i = 0; i < convertedArray.length; i++) {
        if (convertedArray[i].title === 'Front' && frontImage === null) {
          frontImage = convertedArray[i];
        }

        if (convertedArray[i].title === 'Side' && sideImage === null) {
          sideImage = convertedArray[i];
        }

        if (frontImage !== null && sideImage !== null) {
          break;
        }
      }

      const promise1 =
        frontImage !== null
          ? this.getOnboardImage(frontImage.imageLink)
          : () => null;
      const promise2 =
        sideImage !== null
          ? this.getOnboardImage(sideImage.imageLink)
          : () => null;

      Promise.all([promise1, promise2]).then((values) => {
        console.log('promises resolved', values);

        if (frontImage !== null && values[0] !== 'image not found') {
          this.setState({
            frontImage2: values[0],
            frontDate2: this.getDateFromPhoto(frontImage.date),
          });
        }

        if (sideImage !== null && values[1] !== 'image not found') {
          this.setState({
            sideImage2: values[1],
            sideDate2: this.getDateFromPhoto(sideImage.date),
          });
        }

        setTimeout(async () => {
          this.setState({isLoading: false});
        }, 10);
      });
    }
  };

  convertStrArrayToObject = (strArray) => {
    let newArray = [];
    for (let i = 0; i < strArray.length; i++) {
      const splittedArray = strArray[i].split('___');

      // 2021-02-10T13-06-58
      const date = new Date(
        splittedArray[3].substring(0, 4),
        splittedArray[3].substring(5, 7),
        splittedArray[3].substring(8, 10),
        splittedArray[3].substring(11, 13),
        splittedArray[3].substring(14, 16),
        splittedArray[3].substring(17, 19),
      );
      // console.log('date.getTime()', date.getTime());

      newArray.push({
        appName: splittedArray[0],
        userId: splittedArray[1],
        title: splittedArray[2],
        date: splittedArray[3],
        timestamp: date.getTime(),
        imageName: splittedArray[4],
        imageLink: strArray[i],
      });
    }

    newArray = newArray.sort((a, b) => a.timestamp < b.timestamp);
    console.log('convertedArray', newArray);

    return newArray;
  };

  getOnboardImage = async (imageName) => {
    const data = await shaefitApi.getOnboardUserImage(imageName);

    return data;
  };

  updatePhoto = async (title, uri, cameraType, additionalData) => {
    if (title === 'Front') {
      this.setState({frontImage: uri, frontDate: this.getDate()});
    } else if (title === 'Left Side') {
      this.setState({leftSideImage: uri, leftSideDate: this.getDate()});
    } else if (title === 'Right Side') {
      this.setState({rightSideImage: uri, rightSideDate: this.getDate()});
    } else if (title === 'Back') {
      this.setState({backImage: uri, backDate: this.getDate()});
    } else if (title === 'Side') {
      this.setState({sideImage: uri, sideDate: this.getDate()});
    }

    if (
      (title === 'Front' &&
        this.state.mlData[1].hasOwnProperty('intrinsicMatrix')) ||
      (title === 'Side' &&
        this.state.mlData[0].hasOwnProperty('intrinsicMatrix'))
    ) {
      // this.setState({isLoading: true});
    }

    // save to the db
    let userVariables = getUserVariables();
    if (typeof userVariables !== 'undefined' && userVariables !== null) {
      userVariables = JSON.parse(JSON.stringify(userVariables));

      if (title === 'Front') {
        userVariables.progressPhotoAvatarImageFront = uri;
        userVariables.progressPhotoAvatarImageFrontDate = new Date().toISOString();
      } else if (title === 'Side') {
        userVariables.progressPhotoAvatarImageSide = uri;
        userVariables.progressPhotoAvatarImageSideDate = new Date().toISOString();
      }

      createOrUpdateRealm('UserVariables', userVariables);
    }

    let objData = {};
    objData.title = title;
    objData.date = new Date().toISOString().substring(0, 10);
    objData.image = uri;
    objData.userId = this.userDetails.id;
    objData.gender = this.state.gender === 'Male' ? 'm' : 'f';
    objData.birthDate = this.state.dateOfBirth;
    objData.height = this.state.height;
    objData.weight = this.state.weight;

    console.log('cameraType', cameraType);

    if (additionalData !== null) {
      console.log('ProgressPhoto additionalData', additionalData);
      objData.intrinsicMatrix = JSON.stringify(additionalData.intMatrix);
      objData.distortionCoefficients = JSON.stringify(
        additionalData.distorsionMatrix,
      );
      objData.rotationMatrix = JSON.stringify(additionalData.rotationMatrix);
      objData.translationMatrix = JSON.stringify(
        additionalData.translationMatrix,
      );

      if (Platform.OS === 'android') {
        objData.intrinsicMatrix = objData.intrinsicMatrix.replace(/null/g, '0');
        objData.distortionCoefficients = objData.distortionCoefficients.replace(
          /null/g,
          '0',
        );
        objData.rotationMatrix = objData.rotationMatrix.replace(/null/g, '0');
        objData.translationMatrix = objData.translationMatrix.replace(
          /null/g,
          '0',
        );
      }
    } else {
      objData.intrinsicMatrix = [0.0, 0.0, 0.0, 0.0, 0.0];
      objData.distortionCoefficients = [0.0, 0.0, 0.0, 0.0, 0.0];
      objData.rotationMatrix = [0.0, 0.0, 0.0, 0.0];
      objData.translationMatrix = [0.0, 0.0, 0.0];
    }

    let mlData = this.state.mlData;
    if (title === 'Front') {
      console.log('objData Front');
      mlData[0] = objData;
    } else if (title === 'Side') {
      console.log('objData Side');
      mlData[1] = objData;
    }

    this.setState({mlData}, async () => {
      if (
        (title === 'Front' &&
          this.state.mlData[1].hasOwnProperty('intrinsicMatrix')) ||
        (title === 'Side' &&
          this.state.mlData[0].hasOwnProperty('intrinsicMatrix'))
      ) {
        // this.props.back();
        Actions.dashboard();

        let imageName = uri.split('/');
        let imageNameSplitted = imageName[imageName.length - 1].split('.');
        imageName = `shae___${
          this.userDetails.id
        }___${title}___${new Date().toISOString().substring(0, 19)}___${
          imageNameSplitted[0]
        }.${imageNameSplitted[1]}`.replace(/:/g, '-');
        // 99D4C102-EEC0-48B7-AB2D-65405C823ED4.jpg

        console.log('imageName', uri, imageName);
        const imageResponse = await shaefitApi.uploadOnboardUserImage(
          uri,
          imageName,
        );

        setTimeout(async () => {
          const imageUrl = await shaefitApi.getOnboardUserImage(imageResponse);
          console.log('imageUrl', imageUrl);

          objData.image = imageUrl;

          let mlData = this.state.mlData;
          if (title === 'Front') {
            console.log('objData Front');
            mlData[0] = objData;
          } else if (title === 'Side') {
            console.log('objData Side');
            mlData[1] = objData;
          }

          console.log('objData', objData);

          this.setState({mlData, isLoading: false});
          if (
            mlData[0].hasOwnProperty('intrinsicMatrix') &&
            mlData[1].hasOwnProperty('intrinsicMatrix')
          ) {
            this.sendMlData();
          }
        }, 300);
      } else {
        let imageName = uri.split('/');
        let imageNameSplitted = imageName[imageName.length - 1].split('.');
        imageName = `shae___${
          this.userDetails.id
        }___${title}___${new Date().toISOString().substring(0, 19)}___${
          imageNameSplitted[0]
        }.${imageNameSplitted[1]}`.replace(/:/g, '-');
        // 99D4C102-EEC0-48B7-AB2D-65405C823ED4.jpg

        console.log('imageName', uri, imageName);
        const imageResponse = await shaefitApi.uploadOnboardUserImage(
          uri,
          imageName,
        );

        setTimeout(async () => {
          const imageUrl = await shaefitApi.getOnboardUserImage(imageResponse);
          console.log('imageUrl', imageUrl);

          FastImage.preload([
            {
              uri: imageUrl,
            },
          ]);

          objData.image = imageUrl;

          let mlData = this.state.mlData;
          if (title === 'Front') {
            console.log('objData Front');
            mlData[0] = objData;
          } else if (title === 'Side') {
            console.log('objData Side');
            mlData[1] = objData;
          }

          this.setState({mlData}, () => {
            console.log('objData', objData);
          });
        }, 300);
      }
    });
  };

  sendMlData = async () => {
    let mlData = this.state.mlData;
    for (let i = 0; i < mlData.length; i++) {
      if (mlData[i].gender === 'Male') {
        mlData[i].gender = 'm';
      } else if (mlData[i].gender === 'Female') {
        mlData[i].gender = 'f';
      }

      if (Array.isArray(mlData[i].intrinsicMatrix)) {
        mlData[i].intrinsicMatrix = mlData[i].intrinsicMatrix.join(' ');
      }

      if (Array.isArray(mlData[i].distortionCoefficients)) {
        mlData[i].distortionCoefficients = mlData[
          i
        ].distortionCoefficients.join(' ');
      }

      if (Array.isArray(mlData[i].rotationMatrix)) {
        mlData[i].rotationMatrix = mlData[i].rotationMatrix.join(' ');
      }

      if (Array.isArray(mlData[i].translationMatrix)) {
        mlData[i].translationMatrix = mlData[i].translationMatrix.join(' ');
      }

      if (Array.isArray(mlData[i].eulerMatrix)) {
        mlData[i].eulerMatrix = mlData[i].eulerMatrix.join(' ');
      }

      if (Array.isArray(mlData[i].transformMatrix)) {
        mlData[i].transformMatrix = mlData[i].transformMatrix.join(' ');
      }
    }

    shaefitApi.testUploadImage(mlData);
  };

  getDate = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${day} ${this.getMonthName(month)} ${year}`;
  };

  getDateFromPhoto = (dateString) => {
    // 2021-02-05T13-09-24

    return `${dateString.substring(8, 10)} ${this.getMonthName(
      dateString.substring(5, 7),
    )} ${dateString.substring(0, 4)}`;
  };

  getMonthName = (month) => {
    let monthName = '';
    switch (month) {
      case '01':
        monthName = 'Jan';
        break;
      case '02':
        monthName = 'Feb';
        break;
      case '03':
        monthName = 'Mar';
        break;
      case '04':
        monthName = 'Apr';
        break;
      case '05':
        monthName = 'May';
        break;
      case '06':
        monthName = 'Jun';
        break;
      case '07':
        monthName = 'Jul';
        break;
      case '08':
        monthName = 'Aug';
        break;
      case '09':
        monthName = 'Sep';
        break;
      case '10':
        monthName = 'Oct';
        break;
      case '11':
        monthName = 'Nov';
        break;
      case '12':
        monthName = 'Dec';
        break;
      default:
        monthName = 'Jan';
    }

    return monthName;
  };

  onDelete = (title) => {
    if (title === 'Front') {
      this.setState({frontImage: '', frontDate: ''});
    } else if (title === 'Side') {
      this.setState({sideImage: '', sideDate: ''});
    }
  };

  clearDate = (title) => {
    if (title === 'Front') {
      this.setState({frontDate: ''});
    } else if (title === 'Side') {
      this.setState({sideDate: ''});
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', marginTop: 24}}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (Platform.OS === 'android') {
                hideNavigationBar();
              }

              Actions.photoAvatar({
                title: 'Front',
                updatePhoto: this.updatePhoto,
                image: this.state.frontImage,
                date: this.state.frontDate,
                onDelete: (title) => this.onDelete(title),
                clearDate: (title) => this.clearDate(title),
                height: this.state.height,
              });
            }}>
            {this.state.frontImage !== '' ? (
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 225,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  overflow: 'hidden',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  marginRight: 15,
                }}>
                <Image
                  source={{uri: this.state.frontImage}}
                  style={styles.cardImage}
                />
                <View style={{marginTop: 13, marginLeft: 15}}>
                  <Text style={styles.cardTitle}>Front</Text>
                  <Text style={styles.cardSubtitle}>
                    {this.state.frontDate}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 225,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  marginRight: 15,
                }}>
                <Image
                  source={require('../resources/icon/addAvatar.png')}
                  style={{marginTop: 76, alignSelf: 'center'}}
                />
                <Text style={styles.title}>Front</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              if (Platform.OS === 'android') {
                hideNavigationBar();
              }

              Actions.photoAvatar({
                title: 'Side',
                updatePhoto: this.updatePhoto,
                image: this.state.sideImage,
                date: this.state.sideDate,
                onDelete: (title) => this.onDelete(title),
                clearDate: (title) => this.clearDate(title),
                height: this.state.height,
              });
            }}>
            {this.state.sideImage !== '' ? (
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 225,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  overflow: 'hidden',
                  marginRight: 15,
                }}>
                <Image
                  source={{uri: this.state.sideImage}}
                  style={styles.cardImage}
                />
                <View style={{marginTop: 13, marginLeft: 15}}>
                  <Text style={styles.cardTitle}>Side</Text>
                  <Text style={styles.cardSubtitle}>{this.state.sideDate}</Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 225,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                }}>
                <Image
                  source={require('../resources/icon/addAvatar.png')}
                  style={{marginTop: 76, alignSelf: 'center'}}
                />
                <Text style={styles.title}>Side</Text>
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>

        <View style={{flexDirection: 'row', marginTop: 16}}>
          {this.state.frontImage2 !== '' && (
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  isPhotoViewing: true,
                  photoUrl: this.state.frontImage2,
                })
              }>
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 225,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  overflow: 'hidden',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  marginRight: 15,
                }}>
                <FastImage
                  source={{
                    uri: this.state.frontImage2,
                    priority: FastImage.priority.high,
                  }}
                  style={styles.cardImage}
                  resizeMode={FastImage.resizeMode.cover}
                  onLoadStart={() =>
                    this.setState({isFrontImage2Loading: true})
                  }
                  onLoadEnd={() => this.setState({isFrontImage2Loading: false})}
                />
                <View style={{marginTop: 13, marginLeft: 15}}>
                  <Text style={styles.cardTitle}>Front</Text>
                  <Text style={styles.cardSubtitle}>
                    {this.state.frontDate}
                  </Text>
                </View>
                {this.state.isFrontImage2Loading && (
                  <View
                    style={{
                      alignSelf: 'center',
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: 100,
                    }}>
                    <ActivityIndicator size="small" color="rgb(0,0,0)" />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
          {this.state.sideImage2 !== '' && (
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  isPhotoViewing: true,
                  photoUrl: this.state.sideImage2,
                })
              }>
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 225,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  overflow: 'hidden',
                }}>
                <FastImage
                  source={{
                    uri: this.state.sideImage2,
                    priority: FastImage.priority.high,
                  }}
                  style={styles.cardImage}
                  resizeMode={FastImage.resizeMode.cover}
                  onLoadStart={() => this.setState({isSideImage2Loading: true})}
                  onLoadEnd={() => this.setState({isSideImage2Loading: false})}
                />
                <View style={{marginTop: 13, marginLeft: 15}}>
                  <Text style={styles.cardTitle}>Side</Text>
                  <Text style={styles.cardSubtitle}>{this.state.sideDate}</Text>
                </View>

                {this.state.isSideImage2Loading && (
                  <View
                    style={{
                      alignSelf: 'center',
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: 100,
                    }}>
                    <ActivityIndicator size="small" color="rgb(0,0,0)" />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isPhotoViewing}>
          <TouchableWithoutFeedback
            onPress={() =>
              this.setState({isPhotoViewing: false, photoUrl: ''})
            }>
            <View
              style={{
                flex: 1,
                backgroundColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage
                source={{
                  uri: this.state.photoUrl,
                  priority: FastImage.priority.high,
                }}
                style={{width, height}}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>

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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.3,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    marginTop: 10,
  },
  cardImage: {
    width: (width - 55) / 2,
    height: 164,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cardTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    color: 'rgb(16,16,16)',
  },
  cardSubtitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgb(141,147,151)',
    marginTop: 4,
  },
  button: {
    width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    color: 'rgb(255,255,255)',
  },
});

export default CaptureAvatar;

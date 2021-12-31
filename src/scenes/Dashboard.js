/**
 * Created by developercomputer on 07.10.16.
 */
import React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

import PropTypes from 'prop-types';

import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import Dialog, {ScaleAnimation, DialogContent} from 'react-native-popup-dialog';
import Permissions from 'react-native-permissions';
import VersionCheck from 'react-native-version-check';

import RequestedPage from './RequestedPage';

import {URL_ADRESS} from '../constants';
import {ONESIGNAL_API_KEY} from '../../private_keys';

import OneSignal from 'react-native-onesignal';
import API from '../API/lib';
import {
  getDbToken,
  createOrUpdateRealm,
  getUserVariables,
  readRealmRows,
} from '../data/db/Db';
import * as shaefitApi from '../API/shaefitAPI';
import createStore from '../redux';
import {PLAYER_ID_READY, LOGOUT_REQUEST} from '../redux/actions/names';

function onBridgeMessage(strMsg) {
  const msg = JSON.parse(strMsg);
  console.log('URL_ADRESS', msg.url);
  Actions.category({
    title: msg.title,
    uri: `${URL_ADRESS}${msg.url}`,
  });
}

const {height, width} = Dimensions.get('window');

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,10,.7)',
  },
  modalLocation: {
    // width: width,
    // height: height,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 5,
  },
  titleLocation: {
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 19,
    letterSpacing: -0.3,
    fontWeight: '600',
    color: 'rgb(31,33,35)',
    alignSelf: 'center',
    marginTop: 25,
  },
  subtitleLocation: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    fontWeight: '500',
    color: 'rgb(0,187,116)',
    alignSelf: 'center',
    marginTop: 6,
  },
  textLocation: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgb(54,58,61)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    width: width - 125,
  },
  circleLocation: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,187,116,0.1)',
    alignSelf: 'center',
    marginTop: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLocation: {
    width: width - 195,
    height: 40,
    backgroundColor: '#00a8eb',
    marginTop: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 45,
    borderRadius: 20,
  },
  buttonLocationText: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    letterSpacing: -0.4,
    fontWeight: '500',
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
    textAlign: 'center',
  },
  titleUpdate: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 24,
  },
  textUpdate: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    width: width - 135,
  },
  buttonUpdate: {
    width: 140,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonUpdateText: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    letterSpacing: -0.4,
    fontWeight: '500',
    color: 'rgb(255,255,255)',
  },
  notificationTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 25,
  },
  notificationBody: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 9,
    width: width - 144,
  },
});

class Dashboard extends React.Component {
  static propTypes = {
    isOverlay: PropTypes.bool,
    uri: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    notificationData: PropTypes.object,
  };
  static defaultProps = {
    isOverlay: false,
    uri: `${URL_ADRESS}/mobile/dashboard`,
    lat: null,
    lng: null,
    notificationData: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      location: '',
      placeId: '',
      coordinates: '',
      isLocationDataLoading: false,
      isLocationModalVisible: false,
      isVirtualCoachModalVisible: false,
      isNeedUpdateVisible: false,
      userName: '',
      storeUrl: '',

      notificationData: null,
      isNotificationVisible: false,
    };

    this._interval;
    this._androidLocationInterval;
  }

  // state = {
  //   opacity: new Animated.Value(0)
  // };

  async UNSAFE_componentWillMount() {
    // OneSignal.init(ONESIGNAL_API_KEY, {
    //   kOSSettingsKeyAutoPrompt: false,
    //   kOSSSettingsKeyPromptBeforeOpeningPushURL: false,
    //   kOSSettingsKeyInFocusDisplayOption: 0,
    // });
    OneSignal.setAppId(ONESIGNAL_API_KEY);

    // OneSignal.inFocusDisplaying(0);
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notifReceivedEvent,
        );
        let notif = notifReceivedEvent.getNotification();
        setTimeout(() => notifReceivedEvent.complete(notif), 0);
      },
    );

    // OneSignal.addEventListener('ids', this.onIds);
    // OneSignal.addEventListener('received', this.onReceived.bind(this));
    // OneSignal.addEventListener('opened', this.onOpened.bind(this));

    const deviceState = await OneSignal.getDeviceState();
    this.onIds(deviceState);

    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notifReceivedEvent,
        );
        let notif = notifReceivedEvent.getNotification();
        this.onReceived(notif);
        setTimeout(() => notifReceivedEvent.complete(notif), 0);
      },
    );

    OneSignal.setNotificationOpenedHandler((openedEvent) => {
      console.log('OneSignal: notification opened:', openedEvent);
      const {action, notification} = openedEvent;

      this.onOpened(openedEvent);
    });

    // OneSignal.configure();

    // Alert.alert(JSON.stringify("123"));
  }

  componentWillUnmount() {
    // OneSignal.removeEventListener('ids', this.onIds);
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    clearInterval(this._interval);
    this.props.navigationStateHandler.unregisterFocusHook(this);
  }

  handleNavigationSceneFocus() {
    // this.setState({ date: "load new data" })
    console.log('focused');
  }

  async componentDidMount() {
    this.props.navigationStateHandler.registerFocusHook(this);
    console.log('Dash page CDM');
    console.log('this.props.openResult', this.props.openResult);

    // if (this.props.openResult !== null) {
    //   Alert.alert("onopened2");
    //   this.onOpened(this.props.openResult);
    //   // this.props.clearOpenResult();
    // }

    this.checkTokens();

    if (Platform.OS === 'android') {
      this.checkLocationAndroid();
      // setTimeout(() => {this.checkTimestamp()}, 20000);
    } else {
      this.checkTimestamp();
    }

    this._interval = setInterval(async () => {
      this.checkTokens();
      this.checkTimestamp();
    }, 86400000);

    // setTimeout(() => {AsyncStorage.removeItem('apiToken');}, 10000);

    setTimeout(() => {
      this.fetchGetToken();
    }, 100);

    this.checkUpdateNeeded();
  }

  fetchGetToken = async () => {
    const token = getDbToken();
    console.log('realm token', token);
    // console.log("Object.keys(token[0]).length === 0", token["0"]);

    if (token === null) {
      let data = await AsyncStorage.getItem('apiToken');
      console.log('Token', JSON.parse(data));
      createOrUpdateRealm('Token', JSON.parse(data));

      let subscription = null;
      try {
        let userData = await shaefitApi.getUserDetails();

        userData.measurementsUpdated =
          userData.measurementsUpdated === false
            ? null
            : userData.measurementsUpdated;
        console.log('userData', userData);

        subscription = userData.subscription;

        if (typeof userData !== 'undefined') {
          let userVariables = getUserVariables();

          if (typeof userVariables !== 'undefined' && userVariables !== null) {
            userVariables = JSON.parse(JSON.stringify(userVariables));
          }

          let hraSchemaUpdateTime;
          let hraSchemaData;

          const isNewUser =
            userData.allhraanswered === 1 &&
            userData.allmeasurementsupplied === 1
              ? false
              : true;

          if (!isNewUser) {
            try {
              const hraData = await shaefitApi.getHraSchema(1);

              if (typeof hraData !== 'undefined') {
                hraSchemaUpdateTime = hraData.updated_at;
                hraSchemaData = hraData.data;
                console.log('hraSchemaUpdateTime', hraSchemaUpdateTime);
                console.log('hraSchemaData', hraSchemaData);
              }
            } catch (e) {
              console.log('getHraSchemaFailure saga failure', e);
            }
          }

          if (typeof userVariables !== 'undefined' && userVariables !== null) {
            userVariables.isGpsEnabled = 0;
            userVariables.isNewUser = isNewUser ? true : false;
            userVariables.isHraFilled =
              userData.allhraanswered === 1 ? true : false;
            userVariables.isMeasurementUnitSelected =
              userData.allmeasurementsupplied === 1 ? true : false;
            userVariables.isMembershipValid =
              userData.terms_agreed === 1 ? true : false;

            if (!isNewUser) {
              console.log(
                'userVariables.hraSchemaData',
                userVariables.hraSchemaData,
              );
              if (
                typeof hraSchemaUpdateTime !== 'undefined' &&
                typeof hraSchemaData !== 'undefined'
              ) {
                userVariables.hraSchemaUpdateTime = hraSchemaUpdateTime;
                userVariables.hraSchemaData = hraSchemaData;
              }
            }

            createOrUpdateRealm('UserVariables', userVariables);
            console.log('realm userVariables', userVariables);
          } else {
            createOrUpdateRealm('UserVariables', {
              isGpsEnabled: 0,
              isNewUser: isNewUser ? true : false,
              isHraFilled: userData.allhraanswered === 1 ? true : false,
              isMeasurementUnitSelected:
                userData.allmeasurementsupplied === 1 ? true : false,
              isMembershipValid: userData.terms_agreed === 1 ? true : false,
              hraSchemaUpdateTime:
                typeof hraSchemaUpdateTime !== 'undefined'
                  ? hraSchemaUpdateTime
                  : null,
              hraSchemaData:
                typeof hraSchemaData !== 'undefined' ? hraSchemaData : null,
            });
            console.log('realm userVariables', userVariables);
          }

          if (userData.profile.unit === '') {
            userData.profile.unit = 'metric';
          }

          createOrUpdateRealm('UserDetails', userData);
          readRealmRows('UserVariables');
          readRealmRows('UserDetails');
        }
      } catch (e) {
        console.log('getUserDetails saga failure', e);
      }
    } else {
      let userVariables = getUserVariables();

      if (typeof userVariables !== 'undefined' && userVariables !== null) {
        userVariables = JSON.parse(JSON.stringify(userVariables));
      }

      console.log('userVariables 2', userVariables);
    }

    let isVirtualCoachShowed = await AsyncStorage.getItem(
      'isVirtualCoachShowed',
    );

    if (isVirtualCoachShowed === null) {
      AsyncStorage.setItem('isVirtualCoachShowed', 'true');

      this.setState({isVirtualCoachModalVisible: true});
    }
  };

  checkLocationAndroid = () => {
    let ticks = 0;

    this._androidLocationInterval = setInterval(async () => {
      Permissions.check('location').then((response) => {
        if (response === 'authorized') {
          this.checkTimestamp();
          clearInterval(this._androidLocationInterval);
        } else {
          ticks++;
        }

        if (ticks === 20) {
          clearInterval(this._androidLocationInterval);
        }
      });
    }, 1000);
  };

  checkTokens = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const apiToken = await AsyncStorage.getItem('apiToken');
    const userDetails = await AsyncStorage.getItem('userDetails');
    // const userDetails = null;

    if (userData === null || apiToken === null || userDetails === null) {
      this.props.logout();
    }
  };

  checkTimestamp = async () => {
    const dbTimestamp = await AsyncStorage.getItem('timestamp');
    const today = new Date();
    const timestamp = today.getTime();
    console.log('dbTimestamp', Number(dbTimestamp), timestamp);

    if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
      AsyncStorage.setItem('timestamp', String(timestamp));

      await Geolocation.getCurrentPosition(
        async (position) => {
          console.log('position data');
          const locationData = await shaefitApi.getExactLocation(
            position.coords.latitude,
            position.coords.longitude,
          );

          let placeId = '';
          let formattedAddress = '';

          if (typeof locationData.results !== 'undefined') {
            for (let i = 0; i < locationData.results.length; i++) {
              if (
                locationData.results[i].types[0] === 'locality' &&
                locationData.results[i].types[1] === 'political'
              ) {
                console.log(
                  'formattedAddress',
                  locationData.results[i].formatted_address,
                );

                placeId = locationData.results[i].place_id;
                formattedAddress = locationData.results[i].formatted_address;
              }
            }

            // const data = await shaefitApi.getNearestLocations(
            //   position.coords.latitude,
            //   position.coords.longitude
            // );
            // console.log("position data", data);

            let city = formattedAddress;
            // let city = "";

            this.setState({
              location: city,
              placeId: placeId,
              coordinates:
                '' +
                String(position.coords.latitude) +
                ',' +
                String(position.coords.longitude),
            });

            console.log(
              'position city',
              city,
              '' +
                String(position.coords.latitude) +
                ',' +
                String(position.coords.longitude),
            );

            // if (
            //   typeof data !== "undefined" &&
            //   typeof data.results !== "undefined" &&
            //   typeof data.results[0] !== "undefined" &&
            //   typeof data.results[0].plus_code !== "undefined" &&
            //   typeof data.results[0].plus_code.compound_code !== "undefined"
            // ) {
            //   city = data.results[0].plus_code.compound_code.substring(
            //     8,
            //     data.results[0].plus_code.compound_code.length
            //   );
            //   this.setState({
            //     location: city,
            //     placeId: data.results[0].place_id,
            //     coordinates:
            //       "" +
            //       String(position.coords.latitude) +
            //       "," +
            //       String(position.coords.longitude),
            //   });
            //   console.log(
            //     "position city",
            //     city,
            //     "" +
            //       String(position.coords.latitude) +
            //       "," +
            //       String(position.coords.longitude)
            //   );
            // } else {
            // }

            let userCityAndCountrySplittedSaved = '';
            const dbUserCityAndCountry = await AsyncStorage.getItem(
              'userCityAndCountry',
            );
            console.log('userCityAndCountry', dbUserCityAndCountry);
            if (dbUserCityAndCountry !== null) {
              userCityAndCountrySplittedSaved = dbUserCityAndCountry.split(
                ', ',
              );
            }
            // const userCityAndCountrySplittedNew = city.split(", ");
            if (
              dbUserCityAndCountry === null ||
              dbUserCityAndCountry !== city
              // userCityAndCountrySplittedSaved[
              //   userCityAndCountrySplittedSaved.length - 1
              // ] !==
              //   userCityAndCountrySplittedSaved[
              //     userCityAndCountrySplittedNew.length - 1
              //   ]
            ) {
              console.log('condition 1');
              this.updateLocationPopup();
            } else {
              console.log('condition 2');
              const dbUserCityAndCountryCoordinates = await AsyncStorage.getItem(
                'userCityAndCountryCoordinates',
              );
              console.log(
                'userCityAndCountryCoordinates',
                dbUserCityAndCountryCoordinates,
              );
              const coords = dbUserCityAndCountryCoordinates.split(',');
              const distance = this.getDistanceFromLatLonInKm(
                position.coords.latitude,
                position.coords.longitude,
                coords[0],
                coords[1],
              );
              console.log('condition 2 distance', distance);
              if (distance > 50) {
                this.updateLocationPopup();
              }
            }
          }
        },
        (error) => console.log(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    }
  };

  updateLocationPopup = () => {
    this.setState({isLocationModalVisible: true});
  };

  onUpdateButtonPress = async () => {
    const object = {
      measurements: [],
      questions: [
        {
          questionId: 162,
          category: 'Lifestyle',
          values: ['-488'],
          freetext: this.state.location,
          placeId: this.state.placeId,
        },
      ],
      specialQuestions: [],
    };

    this.setState({isLocationModalVisible: false});

    await shaefitApi.saveHraResponses(object);
    shaefitApi.getHraResults();

    AsyncStorage.setItem('userCityAndCountryLastPlaceId', this.state.placeId);
    AsyncStorage.setItem('userCityAndCountry', this.state.location);
    AsyncStorage.setItem(
      'userCityAndCountryCoordinates',
      this.state.coordinates,
    );
  };

  getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    try {
      const R = 6371;
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) *
          Math.cos(this.deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km

      return d;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  deg2rad = (deg) => {
    try {
      return deg * (Math.PI / 180);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  dismissModal = () => {
    try {
      this.popupDialogLocation.dismiss();
      this.setState({isLocationModalVisible: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  animatedDismissModal = () => {
    try {
      this.popupLocation.slideOutUp(350).then(() => this.dismissModal());
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onIds(device) {
    console.log('onIds Device info: ', device);

    AsyncStorage.getItem('userData')
      .then((data) => {
        let userData;

        try {
          userData = JSON.parse(data);
        } catch (e) {
          userData = null;
        }

        if (userData !== null && typeof userData !== 'undefined') {
          let persistentState = null;
          if (userData != null) {
            persistentState = {
              auth: {
                userInfo: {...userData.user},
                token: userData.token,
              },
            };
            API.AuhToken = userData.token;
          }
          this.store = createStore(persistentState);

          this.store.dispatch({
            type: PLAYER_ID_READY,
            payload: {
              playerId: device.userId,
            },
          });
        }
      })
      .catch((e) => console.log(e));
  }

  onReceived(notification) {
    console.log('onReceived');
    console.log('Notification received: ', notification);

    let title = notification.additionalData.title
      .replace(/\_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    // setTimeout(() => {
    this.setState({
      isNotificationReceived: true,
      notificationData: {
        ...notification.additionalData,
        ...{body: notification.body},
        ...{title: title},
      },
      isNotificationVisible: notification.isAppInFocus,
    });
    // }, 20000);
  }

  onOpened(openResult) {
    console.log('onOpened');
    console.log('Message: ', openResult.notification.body);
    console.log('Data: ', openResult.notification.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    // setTimeout(() => {
    //   Alert.alert(JSON.stringify(openResult.notification.payload));
    // }, 20000);

    // setTimeout(() => {
    // this.setState({
    //   isNotificationReceived: true,
    //   notificationData: {
    //     ...openResult.notification.payload.additionalData,
    //     ...{ body: openResult.notification.payload.body },
    //   },
    //   isNotificationVisible: true,
    // });

    const notificationData = {
      ...openResult.notification.additionalData,
      ...{body: openResult.notification.body},
    };

    if (
      typeof notificationData.url !== 'undefined' &&
      notificationData.url !== null &&
      notificationData.url !== ''
    ) {
      Actions.category({
        title: notificationData.title,
        uri: `${notificationData.url}`,
      });
    }
    // }, 20000);
  }

  checkUpdateNeeded = async () => {
    const latestVersion = await VersionCheck.getLatestVersion();
    const currentVersion = VersionCheck.getCurrentVersion();

    console.log('checkUpdateNeeded', latestVersion, currentVersion);

    let userData = await shaefitApi.getUserDetails();

    if (Platform.OS === 'android') {
      let current = this.addZeros(currentVersion.replace(/\./g, ''));
      let latest =
        typeof latestVersion === 'undefined'
          ? current
          : this.addZeros(latestVersion.replace(/\./g, ''));
      console.log('checkUpdateNeeded', current, latest);

      if (current < latest) {
        this.setState({
          isNeedUpdateVisible: true,
          userName: userData.username,
          storeUrl:
            'https://play.google.com/store/apps/details?id=com.ph360.shae&hl=en',
        });
      }
    } else {
      let updateNeeded = await VersionCheck.needUpdate();
      console.log('updateNeeded', updateNeeded);

      if (typeof updateNeeded !== 'undefined' && updateNeeded.isNeeded) {
        console.log('updateNeeded', updateNeeded);
        this.setState({
          isNeedUpdateVisible: true,
          userName: userData.username,
          storeUrl:
            Platform.OS === 'ios'
              ? updateNeeded.storeUrl.replace('itms-apps', 'https')
              : updateNeeded.storeUrl,
        });
      }
    }
  };

  addZeros = (str) => {
    let newStr = str;
    for (let i = str.length; i < 10; i++) {
      newStr += '0';
    }

    return parseInt(newStr);
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.isOverlay) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 300,
      }).start();
    } else if (!newProps.isOverlay) {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 300,
      }).start();
    }

    // if (newProps.openResult !== null) {
    //   // Alert.alert("onopened");
    //   this.onOpened(newProps.openResult);
    //   newProps.clearOpenResult();
    // }

    console.log('componentWillReceiveProps dashboard', newProps);

    if (
      typeof newProps.openDrawer !== 'undefined' &&
      newProps.openDrawer === true &&
      newProps.openDrawer !== this.props.openDrawer
    ) {
      this.props.onLeft();

      Actions.refresh({
        key: 'dashboard',
        openDrawer: undefined,
      });
    }
  }

  onVirtualCoachPress = () => {
    this.setState({isVirtualCoachModalVisible: false}, () => {
      Actions.virtualCoach1();
    });
  };

  render() {
    const scaleAnimation = new ScaleAnimation({
      toValue: 0,
      useNativeDriver: true,
    });

    return (
      <View style={style.container}>
        <RequestedPage
          onBridgeMessage={onBridgeMessage}
          uri={this.props.uri}
          lat={this.props.lat}
          lng={this.props.lng}
          notificationData={this.props.notificationData}
        />
        <Animated.View
          style={[style.overlay, {opacity: this.state.opacity}]}
          pointerEvents="none"
        />

        <Dialog
          visible={this.state.isLocationModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isLocationModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isLocationModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DialogContent>
            <View style={style.card}>
              <View style={{overflow: 'hidden', borderRadius: 10}}>
                <View style={style.circleLocation}>
                  <Image
                    source={require('../resources/icon/location_popup.png')}
                    style={{width: 30, height: 30}}
                  />
                </View>
                <View
                  style={{
                    width: width,
                    marginTop: 0,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                  }}>
                  <Text style={style.titleLocation}>New Location Detected</Text>
                  <Text style={style.subtitleLocation}>
                    {this.state.location}
                  </Text>
                  <Text style={style.textLocation}>
                    Would you like us to automatically update your location?
                  </Text>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => this.onUpdateButtonPress()}>
                  <View style={style.buttonLocation}>
                    <Text style={style.buttonLocationText}>Update</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isNeedUpdateVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isNeedUpdateVisible: false});
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
            <View style={[style.card, {borderRadius: 4}]}>
              <Image
                source={require('../resources/icon/icon_update.png')}
                style={{marginTop: 41, alignSelf: 'center'}}
              />

              <Text style={style.titleUpdate}>You're missing out!</Text>
              <Text
                style={
                  style.textUpdate
                }>{`Hey ${this.state.userName}! You're not getting the full Shae Experience! Please ensure your Shae app is up to date from the app store.`}</Text>

              <TouchableWithoutFeedback
                onPress={() => Linking.openURL(this.state.storeUrl)}>
                <View style={style.buttonUpdate}>
                  <Text style={style.buttonUpdateText}>Update Now</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isVirtualCoachModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isVirtualCoachModalVisible: false});
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
            <View style={[style.card, {borderRadius: 4, width: width - 75}]}>
              <Image
                source={require('../resources/icon/virtualCoachModal.png')}
                style={{marginTop: 41, alignSelf: 'center'}}
              />

              <Text style={style.titleUpdate}>REMEMBER!</Text>
              <Text style={style.textUpdate}>
                Your Virtual Coach is waiting to help you achieve your goals!
              </Text>

              <TouchableWithoutFeedback onPress={this.onVirtualCoachPress}>
                <View style={[style.buttonUpdate, {width: 160}]}>
                  <Text style={style.buttonUpdateText}>My Virtual Coach</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isNotificationVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isNotificationVisible: false,
              notificationData: null,
            });
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
            {this.state.notificationData !== null && (
              <View style={[style.card, {borderRadius: 4, width: width - 75}]}>
                <Image
                  source={require('../resources/icon/notification_message.png')}
                  style={{marginTop: 46, alignSelf: 'center'}}
                />

                <Text style={style.notificationTitle}>
                  {this.state.notificationData.title}
                </Text>
                <Text style={style.notificationBody}>
                  {this.state.notificationData.body}
                </Text>

                <TouchableWithoutFeedback
                  onPress={() => {
                    console.log('Notification msg');
                    this.setState({isNotificationVisible: false}, () => {
                      if (
                        typeof this.state.notificationData.url !==
                          'undefined' &&
                        this.state.notificationData.url !== null
                      ) {
                        Actions.category({
                          title: this.state.notificationData.title,
                          uri: `${this.state.notificationData.url}`,
                        });
                      }

                      this.setState({notificationData: null});
                    });
                  }}>
                  <View style={[style.buttonUpdate, {width: 120}]}>
                    <Text style={style.buttonUpdateText}>
                      {typeof this.state.notificationData.url !== 'undefined' &&
                      this.state.notificationData.url !== null &&
                      this.state.notificationData.url !== ''
                        ? 'SEE MORE'
                        : 'OK, GOT IT!'}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  isOverlay: state.drawer,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({type: LOGOUT_REQUEST}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

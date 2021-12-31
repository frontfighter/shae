/**
 * Created by developercomputer on 07.10.16.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import GPSState from 'react-native-gps-state';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Permissions from 'react-native-permissions';

import Dialog, {ScaleAnimation, DialogContent} from 'react-native-popup-dialog';
import {Actions} from 'react-native-router-flux';

import {connect} from 'react-redux';

import {
  SHOW_LOADER,
  HIDE_LOADER,
  BRIDGE_MESSAGE,
  GPS_AGREE,
} from '../redux/actions/names';
import SiriModal from '../components/SiriModal';

const {height, width} = Dimensions.get('window');

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: width - 55,
    height: 470,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
  },
});

class RequestedPage extends Component {
  static propTypes = {
    token: PropTypes.string,
    onLoadStart: PropTypes.func,
    onLoadEnd: PropTypes.func,
    onBridgeMessage: PropTypes.func,
    handleBridgeMessage: PropTypes.func,
    isLoading: PropTypes.bool,
    uri: PropTypes.string,
    dispatchAboutAgreement: PropTypes.func,
    userId: PropTypes.string,
    isNotification: PropTypes.bool,
    lat: PropTypes.number,
    lng: PropTypes.number,
    notificationData: PropTypes.object,
  };

  static defaultProps = {
    token: null,
    onLoadStart: () => {},
    onLoadEnd: () => {},
    onBridgeMessage: console.log.bind(console),
    handleBridgeMessage: () => {},
    isLoading: false,
    uri: '',
    dispatchAboutAgreement: () => {},
    userId: '',
    isNotification: false,
    lat: null,
    lng: null,
    notificationData: null,
  };

  state = {
    afterInteractions: false,
    position: null,
    notificationData: null,
    retries: 0,
    checkingSiri: false,
    isSiriModalVisible: false,
    siriType: null,
    isComponentUnmounted: false,
  };

  async componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({afterInteractions: true});
      this.props.onLoadStart();
      this.timerID = setTimeout(this.props.onLoadEnd, 10000);
    });

    await this.getPosition();
    console.log('Req page CDM');
  }

  checkIsLocation = async () => {
    let check = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: 'Use Location services?',
      ok: 'YES',
      cancel: 'NO',
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
    }).catch((error) => error);

    console.log(check);
    const userId = this.props.userId;

    if (check.enabled) {
      this.props.dispatchGpsAgreement({userId, isAgree: true});
    }
  };

  getGpsNow = async () => {
    await this.getPosition();

    let gpsNowObject = {};
    gpsNowObject.topic = 'gpsNow';

    if (this.state.position != null) {
      gpsNowObject.userId = this.props.userId;
      gpsNowObject.timezone = DeviceInfo.getTimezone();
      gpsNowObject.offset = new Date().getTimezoneOffset() * 60;

      gpsNowObject.long = this.state.position.coords.longitude;
      gpsNowObject.lat = this.state.position.coords.latitude;
    } else {
      gpsNowObject.error = true;
    }

    // console.log('gpsNowObject', JSON.stringify(gpsNowObject));
    // this.webview.postMessage(JSON.stringify(gpsNowObject));

    if (this.webview) {
      this.webview.injectJavaScript(`
        window.ReactNativeWebView.postMessage(${JSON.stringify(gpsNowObject)});
        true;
      `);
    }
  };

  onBridgeMessage = (event) => {
    console.log('onBridgeMessage');
    const {
      nativeEvent: {data},
    } = event;
    const {
      onBridgeMessage,
      handleBridgeMessage,
      dispatchGpsAgreement,
      userId,
    } = this.props;
    let msg;

    try {
      msg = JSON.parse(data);

      // if (msg.logout === true) return;
    } catch (e) {
      console.log(e);
    }

    console.log('onBridgeMessage event', msg);

    if (typeof msg !== 'undefined' && typeof msg.gpsEnable !== 'undefined') {
      if (msg.gpsEnable) {
        if (Platform.OS === 'android') {
          this.checkIsLocation();
        } else {
          Geolocation.requestAuthorization();

          setTimeout(() => {
            Permissions.check('location').then((response) => {
              if (response === 'authorized') {
                dispatchGpsAgreement({userId, isAgree: true});
              } else {
                dispatchGpsAgreement({userId, isAgree: false});
              }
            });
          }, 3000);
        }
      }
    } else if (typeof msg.gpsNow !== 'undefined') {
      if (msg.gpsNow) {
        this.getGpsNow();
      }
    } else if (typeof msg.openScreen !== 'undefined') {
      if (msg.openScreen === 'food-diary') {
        Actions.details({
          key: 'foodDiary',
        });
      } else if (msg.openScreen === 'track') {
        Actions.details({
          key: 'track',
        });
      } else if (msg.openScreen === 'update') {
        Actions.details({
          key: 'hra',
        });
      } else if (msg.openScreen === 'virtual-coach') {
        Actions.details({
          key: 'virtualCoach1',
        });
      } else if (msg.openScreen === 'dashboard') {
        setTimeout(() => {
          Actions.dashboard();
        }, 1000);
      }
    } else if (typeof msg.changeTitle !== 'undefined') {
      Actions.refresh({
        title: msg.changeTitle,
      });
    } else {
      this.getPosition();

      // console.log('new message', msg);

      if (msg?.external) {
        if (this.webview) this.webview?.stopLoading();
        Linking.openURL(msg.external);
      } else {
        if (msg?.url && msg?.url.includes('retreats.')) {
          let obj;
          if (msg?.title == 'Retreats') {
            let str = msg?.url.split('url=');
            obj = {
              title: msg?.title,
              url: `${str[0]}url=https://ph360.me/retreats/`,
            };
            console.log('new url', `${str[0]}url=https://ph360.me/retreats/`);
          } else {
            let str = msg?.url.split('retreats.');
            obj = {
              title: msg?.title,
              url: `${str[0]}${str[1]}`,
            };
            console.log('new url', `${str[0]}${str[1]}`);
          }

          onBridgeMessage(JSON.stringify(obj));
          handleBridgeMessage(obj);
        } else {
          // if (msg?.title && msg?.title.includes('Intergrate')) {
          //   let obj = {
          //     title: 'Integrate',
          //     url: msg?.url,
          //   };
          //   onBridgeMessage(JSON.stringify(obj));
          //   handleBridgeMessage(obj);
          // } else {
            onBridgeMessage(data);
            handleBridgeMessage(msg);
          // }
        }
      }
    }
  };

  async getPosition() {
    const gpsAgree = await AsyncStorage.getItem('gpsAgree');
    // console.log('isEnabled', isEnabled);
    const isEnabled = JSON.parse(gpsAgree);

    if (isEnabled != null) {
      if (isEnabled.gpsAgree) {
        const gpsStatus = await GPSState.getStatus();

        if (
          gpsStatus === 3 ||
          gpsStatus === 4 ||
          (Platform.OS === 'android' && Platform.Version > 22)
        ) {
          const getCurrentPosition = () =>
            new Promise((resolve, reject) => {
              Geolocation.getCurrentPosition(
                (position) => {
                  resolve(position);
                },
                (error) => {
                  reject(error);
                },
                {
                  enableHighAccuracy: false,
                  timeout: 15000,
                  maximumAge: 3600000,
                },
              );
            });

          const position = await getCurrentPosition();
          // console.log('position req page', position);
          this.setState({position: position});
        }
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (typeof nextProps !== 'undefined') {
      // console.log("componentWillReceiveProps", nextProps.uri);
      // if (
      //   typeof nextProps.uri !== "undefined" &&
      //   nextProps.uri !== this.props.uri
      // ) {
      //   this.props.onLoadStart();
      // }

      if (nextProps.notificationData != null) {
        let url = nextProps.notificationData.url;
        if (url.includes('https://dev-app.ph360.me')) {
          url = url.replace('https://dev-app.ph360.me', '');
        } else if (url.includes('https://app.ph360.me')) {
          url = url.replace('https://app.ph360.me', '');
        }

        if (typeof this.webview !== 'undefined' && this.webview != null) {
          this.webview.injectJavaScript(`
            window.ReactNativeWebView.postMessage(${JSON.stringify({
              topic: 'notification',
              url: url,
              title: nextProps.notificationData.title,
            })});
          `);
          // this.webview.postMessage(
          //   JSON.stringify({
          //     topic: 'notification',
          //     url: url,
          //     title: nextProps.notificationData.title,
          //   }),
          // );

          // this.webview.injectJavaScript(`
          // (function(){
          //   window.ReactNativeWebView.postMessage('${JSON.stringify({
          //     topic: 'notification',
          //     url: url,
          //     title: nextProps.notificationData.title,
          //   })}','*');
          // })();
          // true;
          // `);

          const clientResponseCode = `
            window.ReactNativeWebView.postMessage(${JSON.stringify({
              topic: 'notification',
              url: url,
              title: nextProps.notificationData.title,
            })});
            true;
          `;
          if (this.webview) {
            this.webview.injectJavaScript(clientResponseCode);
          }

          // this.webview.current.reload();
        } else {
          this.setState({notificationData: nextProps.notificationData});
          // console.log('nextProps.notificationData', nextProps.notificationData);
        }

        Actions.refresh({
          notificationData: null,
        });
      }
    }
  }

  onError = () => {
    console.log('onError');
    if (this.state.retries < 3) {
      this.setState({retries: this.state.retries + 1}, () =>
        this.webview.reload(),
      );
    } else {
    }
  };

  checkSiri = async (type) => {
    console.log('checkSiri', 'checkSiri');

    if (type === 'FoodList') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriFoodList');
      console.log('timestamp siri dbTimestamp', dbTimestamp);
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //     AsyncStorage.setItem('timestampSiriFoodList', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    } else if (type === 'FoodChrono') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriFoodChrono');
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //   AsyncStorage.setItem('timestampSiriFoodChrono', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    } else if (type === 'MealPlan') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriMealPlan');
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //   AsyncStorage.setItem('timestampSiriMealPlan', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    } else if (type === 'Recipes') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriRecipes');
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //   AsyncStorage.setItem('timestampSiriRecipes', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    } else if (type === 'Basket') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriBasket');
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //   AsyncStorage.setItem('timestampSiriBasket', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    } else if (type === 'FoodPrep') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriFoodPrep');
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //   AsyncStorage.setItem('timestampSiriFoodPrep', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    } else if (type === 'FoodGuide') {
      const dbTimestamp = await AsyncStorage.getItem('timestampSiriFoodGuide');
      const today = new Date();
      const timestamp = today.getTime();

      if (dbTimestamp === null || timestamp - Number(dbTimestamp) > 86400000) {
        //   AsyncStorage.setItem('timestampSiriFoodGuide', String(timestamp));

        setTimeout(() => {
          this.setState({siriType: type, isSiriModalVisible: true});
        }, 150);
      }
    }
  };

  setSiriModal = (value) => {
    this.setState({isSiriModalVisible: value});
  };

  setSiriModalTimestamp = async (value, isNotDisplay) => {
    this.setState({isSiriModalVisible: value}, async () => {
      console.log('setSiriModalTimestamp', this.state.siriType);
      if (this.state.siriType === 'FoodList') {
        const dbTimestamp = await AsyncStorage.getItem('timestampSiriFoodList');
        const today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        // const dbTimestamp = await AsyncStorage.getItem("timestampSiriFoodList");

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriFoodList', String(timestamp));
        }
      } else if (this.state.siriType === 'FoodChrono') {
        const dbTimestamp = await AsyncStorage.getItem(
          'timestampSiriFoodChrono',
        );
        let today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        // const dbTimestamp = await AsyncStorage.getItem(
        //   "timestampSiriFoodChrono"
        // );

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriFoodChrono', String(timestamp));
        }

        // AsyncStorage.setItem("timestampSiriFoodChrono", String(timestamp));
      } else if (this.state.siriType === 'MealPlan') {
        const dbTimestamp = await AsyncStorage.getItem('timestampSiriMealPlan');
        const today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        // const dbTimestamp = await AsyncStorage.getItem(
        //   "timestampSiriFoodChrono"
        // );

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriMealPlan', String(timestamp));
        }

        // AsyncStorage.setItem("timestampSiriMealPlan", String(timestamp));
      } else if (this.state.siriType === 'Recipes') {
        const dbTimestamp = await AsyncStorage.getItem('timestampSiriRecipes');
        const today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        // const dbTimestamp = await AsyncStorage.getItem("timestampSiriRecipes");

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriRecipes', String(timestamp));
        }

        // AsyncStorage.setItem("timestampSiriRecipes", String(timestamp));
      } else if (this.state.siriType === 'Basket') {
        const dbTimestamp = await AsyncStorage.getItem('timestampSiriBasket');
        const today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        // const dbTimestamp = await AsyncStorage.getItem("timestampSiriBasket");

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriBasket', String(timestamp));
        }

        // AsyncStorage.setItem("timestampSiriBasket", String(timestamp));
      } else if (this.state.siriType === 'FoodPrep') {
        const dbTimestamp = await AsyncStorage.getItem('timestampSiriFoodPrep');
        const today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        // const dbTimestamp = await AsyncStorage.getItem("timestampSiriFoodPrep");

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriFoodPrep', String(timestamp));
        }

        // AsyncStorage.setItem("timestampSiriFoodPrep", String(timestamp));
      } else if (this.state.siriType === 'FoodGuide') {
        const dbTimestamp = await AsyncStorage.getItem(
          'timestampSiriFoodGuide',
        );
        const today = new Date();

        if (typeof isNotDisplay !== 'undefined' && isNotDisplay === true) {
          today.setFullYear(today.getFullYear() + 1);
        }

        const timestamp = today.getTime();

        if (Number(dbTimestamp) < timestamp) {
          console.log('timestamp siri', timestamp);

          AsyncStorage.setItem('timestampSiriFoodGuide', String(timestamp));
        }

        // AsyncStorage.setItem("timestampSiriFoodGuide", String(timestamp));
      }
    });
  };

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.webview.reload();
    this.setState(
      {isSiriModalVisible: false, isComponentUnmounted: true},
      () => {
        this.webview = null;
      },
    );
  }

  render() {
    // console.log('this.props', this.props);
    // console.log('this.props.title', this.props.title);
    // console.log('this.props.notificationData', this.props.notificationData);

    // const scaleAnimation = new ScaleAnimation({
    //   toValue: 0,
    //   useNativeDriver: true,
    // })

    const {uri, token, onLoadEnd, isLoading} = this.props;
    console.log('uri render req page', uri);

    const patchPostMessageJsCode = `(${String(function () {
      var originalPostMessage = window.ReactNativeWebView.postMessage;
      console.log('onBridgeMessage originalPostMessage', originalPostMessage);
      var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };
      patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace(
          'hasOwnProperty',
          'postMessage',
        );
      };
      window.ReactNativeWebView.postMessage = patchedPostMessage;
    })})();`;
    const headers = {'SHAE-V': DeviceInfo.getVersion()};
    const offsetInHours = new Date().getTimezoneOffset() * 60;
    if (token != null) {
      headers['User-token'] = token;
      headers['Device-id'] = DeviceInfo.getUniqueID();
      headers['TzTime'] = offsetInHours.toString();
      headers['TzString'] = DeviceInfo.getTimezone();
    }
    if (this.state.position != null) {
      headers['LNG'] = this.state.position.coords.longitude.toString();
      headers['LAT'] = this.state.position.coords.latitude.toString();
    } else if (this.props.lat != null && this.props.lng != null) {
      headers['LNG'] = this.props.lng.toString();
      headers['LAT'] = this.props.lat.toString();
    }
    console.log('headers', headers);
    console.log('this.state.afterInteractions', this.state.afterInteractions);
    // if (!this.state.afterInteractions) return null;
    if (!this.state.afterInteractions) {
      this.props.onLoadStart();
    }

    return (
      <View style={style.container}>
        {!this.state.isComponentUnmounted && (
          <WebView
            ref={(ref) => {
              this.webview = ref;
            }}
            source={{uri, headers}}
            onMessage={this.onBridgeMessage}
            // onMessage={(event) => {
            //   console.log('onMessage', event.nativeEvent.data);
            //   // alert('MESSAGE >>>>' + event.nativeEvent.data);
            // }}
            // userAgent="demo"
            onLoadEnd={() => {
              console.log('onLoadEnd1', uri);
              // https://app.ph360.me//mobile/generateWorkout?workout%5Bintensity%5D=1&workout%5Bskill%5D=1&workout%5Bequipment%5D=3&workout%5Bregion%5D=4
              if (Platform.OS === 'ios') {
                if (uri.includes('/foodList')) {
                  this.checkSiri('FoodList');
                } else if (uri.includes('/foodChrono')) {
                  this.checkSiri('FoodChrono');
                } else if (uri.includes('/mealplan')) {
                  this.checkSiri('MealPlan');
                } else if (uri.includes('/recipes')) {
                  this.checkSiri('Recipes');
                } else if (uri.includes('/basket')) {
                  this.checkSiri('Basket');
                } else if (uri.includes('/foodPrep')) {
                  this.checkSiri('FoodPrep');
                } else if (uri.includes('/foodGuide')) {
                  this.checkSiri('FoodGuide');
                }
              }

              if (this.state.notificationData !== null) {
                let url = this.state.notificationData.url;

                if (url.includes('https://dev-app.ph360.me')) {
                  url = url.replace('https://dev-app.ph360.me', '');
                } else if (url.includes('https://app.ph360.me')) {
                  url = url.replace('https://app.ph360.me', '');
                }

                this.webview.injectJavaScript(`
                  window.ReactNativeWebView.postMessage(${JSON.stringify({
                    topic: 'notification',
                    url: url,
                    title: this.state.notificationData.title,
                  })});
                `);

                // this.webview.postMessage(
                //   JSON.stringify({
                //     topic: 'notification',
                //     url: url,
                //     title: this.state.notificationData.title,
                //   }),
                // );

                this.setState({notificationData: null});
              }

              if (!this.state.afterInteractions) {
                this.setState({afterInteractions: true}, () => {
                  onLoadEnd();
                });
              }

              this.setState({retries: 0});

              clearTimeout(this.timerID);
              onLoadEnd();
            }}
            bounces={false} // for dev only
            javaScriptEnabledAndroid={true}
            javaScriptEnabled={true}
            injectedJavaScript={patchPostMessageJsCode}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            onError={this.onError}
            useWebKit={true}
          />
        )}

        <Spinner visible={isLoading} />

        <SiriModal
          isSiriModalVisible={this.state.isSiriModalVisible}
          setSiriModal={this.setSiriModal}
          setSiriModalTimestamp={this.setSiriModalTimestamp}
          type={this.state.siriType}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  isLoading: state.loader,
  userId: state.auth.userInfo.id,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadEnd: () => dispatch({type: HIDE_LOADER}),
  onLoadStart: () => dispatch({type: SHOW_LOADER}),
  handleBridgeMessage: (payload) => dispatch({type: BRIDGE_MESSAGE, payload}),
  dispatchGpsAgreement: (payload) => dispatch({type: GPS_AGREE, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestedPage);

/**
 * Created by developercomputer on 07.10.16.
 */
import {takeLatest, delay} from 'redux-saga';
import {put, call, fork, select, all, wait} from 'redux-saga/effects';
import {Platform, Alert, Intl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Actions, ActionConst} from 'react-native-router-flux';
import OneSignal from 'react-native-onesignal';
import DeviceInfo from 'react-native-device-info';
import GPSState from 'react-native-gps-state';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

import {signIn, logout, forgotPass, getUserData} from '../../API';
import {getToken, getUserDetails} from '../../API/shaefitAPI';
import API from '../../API/lib';
import {setUser} from '../../utils/googleAnalytics';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  SHOW_LOADER,
  HIDE_LOADER,
  BRIDGE_MESSAGE,
  ERROR,
  FORGOT_PASSWORD,
  NOTIFICATION_AGREE,
  GPS_AGREE,
  GOT_NOTIFICATION,
  PLAYER_ID_READY,
  ALERT,
  NEED_TO_SEND_DEVICE_ID,
} from '../actions/names';

import {URL_ADRESS} from '../../constants';

function* sendDeviceInfo() {
  const playerId = yield select((state) => state.auth.playerId);

  try {
    if (playerId != null) {
      // const ipApiInfo = yield call(API.ipApiInfo);
      const date = new Date();
      const offsetInHours = date.getTimezoneOffset() * 60;
      // const tz_string = ipApiInfo.time_zone;
      console.log('DeviceInfo.getTimezone()', DeviceInfo.getTimezone());
      console.log('sendDeviceInfo', DeviceInfo.getUniqueID(), playerId);
      const res = yield call(API.POST, 'device', {
        device: Platform.OS,
        device_id: DeviceInfo.getUniqueID(),
        player_id: playerId,
        tz_time: offsetInHours,
        tz_string: DeviceInfo.getTimezone(),
      });
    }
  } catch (exception) {
    console.log(exception);
  }
}

function* loginFlow(action) {
  console.log('saga loginFlow', action.payload);
  yield put({type: SHOW_LOADER});
  try {
    const userData = yield call(signIn, action.payload);
    const token = yield call(getToken, action.payload);
    yield AsyncStorage.setItem('apiToken', JSON.stringify(token));

    const userDetails = yield call(getUserDetails);
    console.log('token', token);
    console.log('userDetails', userDetails);

    setUser(userDetails?.id);
    yield put({type: HIDE_LOADER});
    yield put({type: LOGIN_SUCCESS, payload: userData});
    console.log('userData', userData);
    API.AuthToken = userData.token;
    if (!userData.user.hra && userData.user.registered) {
      Actions.afterLoginPage({
        uri: `${URL_ADRESS}/mobile/hra`,
      });
    } else if (!userData.user.registered) {
      Actions.afterLoginPage({
        uri: `${URL_ADRESS}/mobile/register?id=${userData.user.id}`,
      });
    } else {
      AsyncStorage.setItem('userData', JSON.stringify(userData));
      AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

      // const today = new Date();
      // const timestamp = today.getTime();
      // AsyncStorage.setItem('timestamp', timestamp);

      const userId = userData.user.id;
      const asKeys = yield call(AsyncStorage.getAllKeys);
      const hadUserLoggedKey = asKeys.find((key) => key === userId);

      if (typeof action.payload.isNewFlow !== 'undefined') {
        yield put({type: NEED_TO_SEND_DEVICE_ID});
        yield put({type: HIDE_LOADER});
      } else {
        if (hadUserLoggedKey == null) {
          Actions.notifications();
        } else {
          const didAgree = yield call(AsyncStorage.getItem, hadUserLoggedKey);
          const parsedDidAgree = JSON.parse(didAgree);
          if (parsedDidAgree.agree) {
            Actions.dashboard();
            // Actions.tour();
            yield put({type: NEED_TO_SEND_DEVICE_ID});
          } else {
            Actions.notifications();
          }
        }
      }
    }
  } catch (error) {
    console.log(JSON.stringify(error));
    yield put({type: HIDE_LOADER});
    yield put({
      type: ERROR,
      payload: {
        msg: 'Incorrect login credentials',
      },
    });
  }
}

function* logoutFlow() {
  yield put({type: LOGOUT_SUCCESS});
  Actions.loginPage({type: ActionConst.REPLACE});
  AsyncStorage.removeItem('userData');
  AsyncStorage.removeItem('apiToken');
  try {
    const res = yield call(logout);
  } catch (e) {
    console.log(e);
  }
}

function* alertError(action) {
  yield setTimeout(() => {
    Alert.alert(action.payload.msg);
  }, 10);
}

function* handleMessagesToUser(action) {
  yield setTimeout(() => {
    Alert.alert(action.payload.msg);
  }, 10);
}

function* handleBridgeMessages(action) {
  try {
    const msg = action.payload;
    if (msg.closeWindow) {
      Actions.pop();
    } else if (msg.hraComplete) {
      const auth = yield select((state) => state.auth);
      if (auth.token != null) {
        AsyncStorage.setItem('userData', JSON.stringify(auth.userInfo));
        Actions.notifications();
      } else {
        API.AuthToken = msg.token;
        yield put({type: SHOW_LOADER});
        try {
          const userData = yield call(getUserData);
          yield put({type: HIDE_LOADER});
          userData.token = msg.token;
          AsyncStorage.setItem('userData', JSON.stringify(userData));
          yield put({type: LOGIN_SUCCESS, payload: userData});
          Actions.notifications();
        } catch (e) {
          console.log(e);
          yield put({type: HIDE_LOADER});
          yield put({type: LOGOUT_REQUEST});
          yield put({
            type: ERROR,
            payload: {
              msg: 'Oops! Invalid user. Try to use your credentials for login.',
            },
          });
        }
      }
    } else if (msg.logout) {
      yield put({type: LOGOUT_REQUEST});
    }
  } catch (e) {
    yield put({type: HIDE_LOADER});
    console.log(e.message);
  }
}

function* passwordRecover(action) {
  const {email} = action.payload;
  try {
    yield put({type: SHOW_LOADER});
    yield call(forgotPass, email);
    yield put({type: HIDE_LOADER});
    Actions.pop();
    yield put({
      type: ALERT,
      payload: {
        msg: 'Please check your email',
      },
    });
  } catch (e) {
    if (e.error.status === 400) {
      yield put({
        type: ERROR,
        payload: {
          msg: 'No user found',
        },
      });
    } else {
      yield put({
        type: ERROR,
        payload: {
          msg: e.body,
        },
      });
    }
  }
}

function* handleNotificationAgree(action) {
  const {isAgree, userId} = action.payload;
  // Actions.dashboard();
  Actions.gpsAgree();
  if (isAgree) {
    if (Platform.OS === 'ios') {
      const permissions = {
        alert: true,
        badge: true,
        sound: true,
      };
      // OneSignal.requestPermissions(permissions);
      // OneSignal.registerForPushNotifications();
      // OneSignal.setSubscription(true);
      OneSignal.promptForPushNotificationsWithUserResponse((response) => {
        console.log('Prompt response:', response);

        if (response) {
          OneSignal.disablePush(false);
        }
      });
    }
    yield AsyncStorage.setItem(userId, JSON.stringify({agree: true}));
    if (Platform.OS === 'ios') {
      // Delay for preparing playerId
      yield new Promise((resolve) => setTimeout(resolve, 10000));
      console.log('Delay for preparing playerId');
    }
    yield put({type: NEED_TO_SEND_DEVICE_ID});
  } else {
    // OneSignal.setSubscription(false);
    OneSignal.disablePush(true);
    yield AsyncStorage.setItem(userId, JSON.stringify({agree: false}));
  }
}

function* handleGpsAgree(action) {
  const {isAgree, userId} = action.payload;

  if (isAgree) {
    const gpsStatus = yield GPSState.getStatus();
    console.log('saga gpsStatus', gpsStatus);

    if (
      gpsStatus === 3 ||
      gpsStatus === 4 ||
      (Platform.OS === 'android' && Platform.Version > 22)
    ) {
      yield AsyncStorage.setItem('gpsAgree', JSON.stringify({gpsAgree: true}));

      const isTourShowed = yield call(AsyncStorage.getItem, 'isTourShowed');
      if (isTourShowed !== null) {
        Actions.dashboard();
      } else {
        yield AsyncStorage.setItem('isTourShowed', 'true');
        Actions.tour();
      }

      // Actions.dashboard();
      // Actions.tour();

      if (Platform.OS === 'android' && Platform.Version > 22) {
      } else {
        yield call(delay, 10000);
      }

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
              timeout: 20000,
              maximumAge: 3600000,
            },
          );
        });

      let pos;
      try {
        pos = yield call(getCurrentPosition);
        console.log('pos', pos);
      } catch (exception) {
        console.log('gps exception', exception);
      }
      console.log('DeviceInfo.getUniqueID()', DeviceInfo.getUniqueID());

      try {
        yield call(API.POST, 'gps', {
          // userId: userId,
          device_id: DeviceInfo.getUniqueID(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      } catch (exception) {
        console.log('exc', exception);
      }
    }
  } else {
    yield AsyncStorage.setItem('gpsAgree', JSON.stringify({gpsAgree: false}));
    Actions.dashboard();
    // Actions.tour();
  }
}

function* handleNotificationComing(action) {
  const {notificationData} = action.payload;
  const isLoggedIn = yield call(AsyncStorage.getItem, 'userData');
  if (isLoggedIn != null) {
    console.log('notificationData saga', notificationData);

    Actions.refresh({
      notificationData: notificationData,
    });
  } else {
    yield put({
      type: ERROR,
      payload: {
        msg: "Sorry, you're not logged in. Please login",
      },
    });
  }
}

function* handlePlayerIdAppear(action) {
  const id = action.payload.userId;
  const curUserId = yield select((state) => state.auth.userInfo.id);

  if (curUserId != null) {
    yield sendDeviceInfo();
  }
}

/* ---------------------- Watchers ---------------------- */

function* watchErrors() {
  yield* takeLatest(ERROR, alertError);
}

function* watchLogin() {
  yield* takeLatest(LOGIN_REQUEST, loginFlow);
}

function* watchLogout() {
  yield* takeLatest(LOGOUT_REQUEST, logoutFlow);
}

function* watchBridgeMessages() {
  yield* takeLatest(BRIDGE_MESSAGE, handleBridgeMessages);
}

function* watchPasswordRequest() {
  yield* takeLatest(FORGOT_PASSWORD, passwordRecover);
}

function* watchNotificationAgreement() {
  yield* takeLatest(NOTIFICATION_AGREE, handleNotificationAgree);
}

function* watchGpsAgreement() {
  yield* takeLatest(GPS_AGREE, handleGpsAgree);
}

function* watchNotificationComing() {
  yield* takeLatest(GOT_NOTIFICATION, handleNotificationComing);
}

function* watchPlayerId() {
  yield* takeLatest(PLAYER_ID_READY, handlePlayerIdAppear);
}

function* watchMessagesToUser() {
  yield* takeLatest(ALERT, handleMessagesToUser);
}

function* watchDeviceInfoSending() {
  yield* takeLatest(NEED_TO_SEND_DEVICE_ID, sendDeviceInfo);
}

// function* rootSaga() {
//   yield [
//     fork(watchLogin),
//     fork(watchLogout),
//     fork(watchErrors),
//     fork(watchBridgeMessages),
//     fork(watchPasswordRequest),
//     fork(watchNotificationAgreement),
//     fork(watchNotificationComing),
//     fork(watchPlayerId),
//     fork(watchMessagesToUser),
//     fork(watchDeviceInfoSending)
//   ];
// }

function* rootSaga() {
  yield all([
    watchLogin(),
    watchLogout(),
    watchErrors(),
    watchBridgeMessages(),
    watchPasswordRequest(),
    watchNotificationAgreement(),
    watchGpsAgreement(),
    watchNotificationComing(),
    watchPlayerId(),
    watchMessagesToUser(),
    watchDeviceInfoSending(),
  ]);
}

export default rootSaga;

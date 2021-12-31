import React, {Component} from 'react';
import {View, Platform, TextInput, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';

import MainComponent from './MainComponent';
import SplashScreen1 from './components/SplashScreen';
import {BUGSNAG_API_KEY} from '../private_keys';
import SplashScreen from 'react-native-splash-screen';
import VersionCheck from 'react-native-version-check';

import Bugsnag from '@bugsnag/react-native';

const currentVersion = VersionCheck.getCurrentVersion();

Bugsnag.start();

// bugsnag.notify(new Error('Test error'));

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      userData: null,
    };

    Text.defaultProps = {allowFontScaling: false};
    Text.defaultProps.allowFontScaling = false;
  }

  // state = {
  //   loaded: false,
  //   userData: null
  // };

  UNSAFE_componentWillMount() {
    SplashScreen.hide();

    AsyncStorage.getItem('userData')
      .then((data) => {
        let userData;
        try {
          userData = JSON.parse(data);
        } catch (e) {
          userData = null;
        }
        this.setState({
          loaded: true,
          userData,
        });
        if (userData != null || Platform.OS === 'android') {
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
          // OneSignal.enableInAppAlertNotification(true);
          // OneSignal.registerForPushNotifications();
        }
      })
      .catch((e) => console.log(e));
  }

  render() {
    const {loaded, userData} = this.state;

    let app = null;
    if (loaded) {
      app = <MainComponent userData={userData} />;
    }
    return (
      <View style={{flex: 1}}>
        {app}
        {/*<SplashScreen1 />*/}
      </View>
    );
  }
}

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   componentWillMount() {
//     // SplashScreen.hide();
//   }
//
//   render() {
//     return <View style={{flex: 1, backgroundColor: 'black'}}></View>;
//   }
// }

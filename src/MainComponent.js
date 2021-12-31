/**
 * Created by developercomputer on 07.10.16.
 */

import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Platform,
  Linking,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PropTypes from 'prop-types';

import {Provider} from 'react-redux';

import {
  Router,
  Scene,
  ActionConst,
  Actions,
  Reducer,
} from 'react-native-router-flux';
import NavigationStateHandler from 'react-native-router-flux-focus-hook';
import Drawer from 'react-native-drawer';
import OneSignal from 'react-native-onesignal';

import {SiriShortcutsEvent} from 'react-native-siri-shortcut';

import {initWearables} from './utils/wearablesChecking';
import API from './API/lib';
import globalStyles, {
  statusBarColor,
  NavBar,
  NavTitle,
  NavBarLight,
  NavTitleLight,
  navBarHeight,
} from './globalStyles';
import createStore from './redux';
import {
  DRAWER_OPEN,
  DRAWER_CLOSE,
  PLAYER_ID_READY,
  GOT_NOTIFICATION,
} from './redux/actions/names';

import LoginPage from './scenes/LoginPage';
import Dashboard from './scenes/Dashboard';
import RequestedPage from './scenes/RequestedPage';
import SideMenu from './scenes/SideMenu';
import ForgotPassword from './scenes/ForgotPassword';
import CreateAccount from './scenes/CreateAccount';
import NotificationAgree from './scenes/NotificationAgree';
import GpsAgree from './scenes/GpsAgree';
import SiriShortcuts from './scenes/SiriShortcuts';
import GoogleFitLinkScreen from './scenes/GoogleFitLinkScreen';

import FoodDiary from './scenes/FoodDiary';
import HRA from './scenes/HRA';
import HraCompleted from './scenes/HraCompletedScreen';
import SearchFoodScreen from './scenes/SearchFoodScreen';
import FoodDetails from './scenes/FoodDetails';
import RecipeDetails from './scenes/RecipeDetails';
import SaveMeal from './scenes/SaveMeal';
import SavedMeals from './scenes/SavedMeals';
import SavedMealsUneditable from './scenes/SavedMealsUneditable';
import NutrientsDetails from './scenes/NutrientsDetails';
import TrackScreen from './scenes/TrackScreen';
import WearablesScreen from './scenes/WearablesScreen';
import WearablesTrackingScreen from './scenes/WearablesTrackingScreen';
import PilotSurveyScreen from './scenes/PilotSurveyScreen';
import AboutShae from './scenes/AboutShae';
import Tour from './scenes/Tour';
import PilotSurveyDetailsScreen from './scenes/PilotSurveyDetailsScreen';

import WelcomeScreen from './scenes/WelcomeScreen';
import LoginScreen from './scenes/LoginScreen';
import ResetPassword from './scenes/ResetPassword';
import ResetPasswordCompleted from './scenes/ResetPasswordCompleted';
import Signup from './scenes/Signup';
import Signup2 from './scenes/Signup2';
import SignupWelcome from './scenes/SignupWelcome';
import SignupPreferences from './scenes/SignupPreferences';
import NotificationsSettings from './scenes/NotificationsSettings';
import NotificationsRequest from './scenes/NotificationsRequest';
import ConfirmEmail from './scenes/ConfirmEmail';

import BodyMeasurements from './scenes/BodyMeasurements';
import BodyMetricsHead from './scenes/BodyMetricsHead';
import BodyMetricsArms from './scenes/BodyMetricsArms';
import BodyMetricsUpperBody from './scenes/BodyMetricsUpperBody';
import BodyMetricsLegs from './scenes/BodyMetricsLegs';
import BodyMetricsFullBody from './scenes/BodyMetricsFullBody';
import CreateAvatar from './scenes/CreateAvatar';
import EnableGps from './scenes/EnableGps';
import Customizing from './scenes/Customizing';
import MeetShae from './scenes/MeetShae';
import TokenCode from './scenes/TokenCode';

import TakePhotos from './scenes/TakePhotos';
import CaptureAvatar from './scenes/CaptureAvatar';
import PhotoAvatar from './scenes/PhotoAvatar';

import VirtualCoach1 from './scenes/VirtualCoach1';
import VirtualCoach2 from './scenes/VirtualCoach2';

import PersonalizedDetox from './scenes/PersonalizedDetox';
import PersonalizedDetoxDetails from './scenes/PersonalizedDetoxDetails';
import PersonalizedDetoxTrackProgress from './scenes/PersonalizedDetoxTrackProgress';
import PersonalizedDetoxDailyRoutine from './scenes/PersonalizedDetoxDailyRoutine';
import PersonalizedDetoxAfterDetails from './scenes/PersonalizedDetoxAfterDetails';

import CloseModalBtn from './components/CloseModalBtn';
import {URL_ADRESS} from './constants';
import {ONESIGNAL_API_KEY} from '../private_keys';

import {onBridgeMessageCategory} from './bridgeHandlers';

import {trackScreenView} from './utils/googleAnalytics';

const animate = (props) => {
  const {position, scene} = props;
  const SCREEN_WIDTH = Dimensions.get('window').width;

  const index = scene.index;
  const inputRange = [index - 1, index + 1];
  const outputRange = [SCREEN_WIDTH, -SCREEN_WIDTH];

  const translateX = position.interpolate({inputRange, outputRange});
  return {transform: [{translateX}]};
};

const applyAnimation = (pos, navState) => {
  Animated.timing(pos, {
    toValue: navState.index,
    duration: 350,
    useNativeDriver: false,
  }).start();
  // Animated.spring(pos, { toValue: navState.index, friction: 5 }).start();
};

export default class MainComponent extends Component {
  static propTypes = {
    userData: PropTypes.object,
  };

  state = {
    notificationData: null,
    timestamp: null,
    isDrawerOpen: false,
    isWearablesFocused: false,
    // openResult: null,
  };

  UNSAFE_componentWillMount() {
    const {userData} = this.props;
    // console.log("componentWillMount userData", userData);
    let persistentState = null;
    this.loginInitial = true;
    this.dashboardInitial = false;
    if (userData != null) {
      this.dashboardInitial = true;

      // check wearables
      initWearables();

      this.loginInitial = false;
      persistentState = {
        auth: {
          userInfo: {...userData.user},
          token: userData.token,
        },
      };
      API.AuhToken = userData.token;
    }

    this.store = createStore(persistentState);

    // OneSignal.init(ONESIGNAL_API_KEY, {
    //   kOSSettingsKeyAutoPrompt: false,
    // });
    OneSignal.setAppId(ONESIGNAL_API_KEY);

    // OneSignal.addEventListener("received", this.onReceived.bind(this));
    // OneSignal.addEventListener("opened", this.onOpened.bind(this));
    // OneSignal.configure();

    // OneSignal.addEventListener('ids', this.onIds);
    // OneSignal.addEventListener('registered', this.onRegistered);
  }

  async componentDidMount() {
    // setTimeout(() => {
    // OneSignal.removeEventListener("received", this.onReceived);
    // OneSignal.removeEventListener("opened", this.onOpened);
    // }, 10000);

    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }

    // AsyncStorage.getItem('apiToken')
    //   .then((data) => {
    //     let userData;
    //     try {
    //       userData = JSON.parse(data);
    //     } catch (e) {
    //       userData = null;
    //     }
    //     console.log('apiToken', userData);
    //   })
    //   .catch(e => console.log(e));

    // AsyncStorage.getItem('timestamp')
    //   .then((data) => {
    //     let userData;
    //     try {
    //       userData = data;
    //       // this.setState({timestamp: data});
    //     } catch (e) {
    //       userData = null;
    //     }
    //     console.log('timestamp', userData);
    //   })
    //   .catch(e => console.log(e));

    if (this.props.userData !== null) {
      const gpsAgree = await AsyncStorage.getItem('gpsAgree');

      // console.log('gpsAgree', gpsAgree);
      if (gpsAgree === null) {
        Actions.gpsAgree();
      }
    }

    SiriShortcutsEvent.addListener(
      'SiriShortcutListener',
      ({userInfo, activityType}) => {
        const shortcutData = {
          activityType,
          userInfo,
        };

        this.navigateSiri(shortcutData);

        console.log('SiriShortcutListener', userInfo, activityType);
      },
    );
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);

    // OneSignal.removeEventListener('ids', this.onIds);
    // OneSignal.removeEventListener('registered', this.onRegistered);

    SiriShortcutsEvent.removeListener(
      'SiriShortcutListener',
      ({userInfo, activityType}) => {
        // Do something with userInfo and/or activityType
      },
    );
  }

  // componentDidMount() {
  //   OneSignal.removeEventListener("received", this.onReceived);
  //   OneSignal.removeEventListener("opened", this.onOpened);
  // }

  onReceived(notification) {
    // console.log("Notification received: ", notification);
  }

  onOpened = (openResult) => {
    // console.log('Message: ', openResult.notification.payload.body);
    // console.log('Data: ', openResult.notification.payload.additionalData);
    // console.log('isActive: ', openResult.notification.isAppInFocus);
    // console.log('openResult: ', openResult);

    // setTimeout(() => {
    //   // Alert.alert("onopened1", JSON.stringify(openResult));
    //   this.setState({ openResult: openResult });
    // }, 5000);

    if (typeof this.props === 'undefined') {
      AsyncStorage.getItem('userData')
        .then((data) => {
          let userData;

          try {
            userData = JSON.parse(data);
          } catch (e) {
            userData = null;
          }

          if (
            typeof userData !== 'undefined' &&
            openResult.notification.payload.additionalData !== 'undefined'
          ) {
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

            if (
              typeof openResult.notification.payload.additionalData.url !==
                'undefined' &&
              typeof openResult.notification.payload.additionalData.title !==
                'undefined'
            ) {
              // this.setState({ openResult: openResult });
              // setTimeout(() => {
              //   Alert.alert(JSON.stringify(openResult.notification.payload));
              // }, 20000);
              // console.log(
              //   "openResult.notification.payload",
              //   openResult.notification.payload
              // );
              this.store.dispatch({
                type: GOT_NOTIFICATION,
                payload: {
                  notificationData:
                    openResult.notification.payload.additionalData,
                },
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  };

  handleOpenURL = (event) => {
    this.navigate(event.url);
  };

  navigate = (url) => {
    if (url !== null) {
      const route = url.replace(/.*?:\/\//g, '');
      let category = 'dashboard';
      let title = ''; //'Dashboard';
      // const id = route.match(/\/([^\/]+)\/?$/)[1];
      // const routeName = route.split('/')[0];

      if (route.includes('/')) {
        category = route.substring(8);
        // title = route.split('/')[1];
        // title = title.charAt(0).toUpperCase() + title.slice(1);
      }
      console.log('navigate url', url);
      console.log('navigate route', route);
      console.log('navigate category', category);

      Actions.refresh({
        key: 'dashboard',
        uri: `${URL_ADRESS}/mobile/${category}`,
        title,
      });
    }

    // if (routeName === 'people') {
    //   navigate('People', { id, name: 'chris' })
    // };

    // https://app.ph360.me//mobile/generateWorkout?workout%5Bintensity%5D=1&workout%5Bskill%5D=1&workout%5Bequipment%5D=3&workout%5Bregion%5D=4
  };

  navigateSiri = (data) => {
    if (data.activityType === 'com.anthrophi.shae.workout') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/generateWorkout?workout%5Bintensity%5D=1&workout%5Bskill%5D=1&workout%5Bequipment%5D=3&workout%5Bregion%5D=4`,
        title: 'Generate Workout',
      });
    } else if (data.activityType === 'com.anthrophi.shae.mealplan') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/mealplan`,
        title: 'Meal Plan',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.natural-brain-function'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/mind#natural-brain-function`,
        title: 'Mind',
      });
    } else if (data.activityType === 'com.anthrophi.shae.ideal-vacation') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/place#my-ideal-vacation`,
        title: 'Place',
      });
    } else if (data.activityType === 'com.anthrophi.shae.people-to-look-for') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/social#people-to-look-for`,
        title: 'Social',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-nuts-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=NOCI+E+SEMI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-vegetables-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=VERDURA&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-fruits-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=FRUTTA&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-grains-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=CEREALI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-meats-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=PROTEINE&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-seafood-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=SEAFOOD&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-drinks-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=BEVANDE&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-herbs-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=CONDIMENTI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-dairy-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=DERIVATI+DAL+LATTE&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-sweets-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=DOLCI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-fats-to-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsEat&type%5B%5D=GRASSI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-nuts-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=NOCI+E+SEMI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-vegetables-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=VERDURA&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-fruits-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=FRUTTA&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-grains-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=CEREALI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-meats-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=PROTEINE&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-seafood-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=SEAFOOD&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-drinks-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=BEVANDE&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-herbs-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=CONDIMENTI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-dairy-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=DERIVATI+DAL+LATTE&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-sweets-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=DOLCI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodlist-fats-to-avoid'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodList?category=foodsAvoid&type%5B%5D=GRASSI&localOnly=0&s=1`,
        title: 'Food List',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-breakfast-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#breakfast`,
        title: 'Food Detailed Schedule',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-lunch-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#lunch`,
        title: 'Food Detailed Schedule',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-dinner-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#dinner`,
        title: 'Food Detailed Schedule',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-snack-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#morning-snack`,
        title: 'Food Detailed Schedule',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-drink-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#drink`,
        title: 'Food Detailed Schedule',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-avoid-eat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#avoid-eating`,
        title: 'Food Detailed Schedule',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.foodtiming-avoid-snack'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodChrono#avoid-snacking`,
        title: 'Food Detailed Schedule',
      });
    } else if (data.activityType === 'com.anthrophi.shae.mealplanner-today') {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      Actions.details({
        uri: `${URL_ADRESS}/mobile/mealplan?mldate=${today}`,
        title: 'Meal Plan',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.mealplanner-tomorrow'
    ) {
      let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = tomorrow.getFullYear();

      tomorrow = yyyy + '-' + mm + '-' + dd;

      Actions.details({
        uri: `${URL_ADRESS}/mobile/mealplan?mldate=${tomorrow}`,
        title: 'Meal Plan',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.mealplanner-this-week'
    ) {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      Actions.details({
        uri: `${URL_ADRESS}/mobile/mealplan?mlweek=${today}`,
        title: 'Meal Plan',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.mealplanner-next-week'
    ) {
      let today = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7);
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      Actions.details({
        uri: `${URL_ADRESS}/mobile/mealplan?mlweek=${today}`,
        title: 'Meal Plan',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-main-dishes') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=1`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-desserts') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=2`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-side-dishes') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=3`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-appetizers') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=4`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-salads') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=5`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-breads') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=7`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-soups') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=8`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-beverages') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=9`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-cocktails') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=11`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-snacks') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=12`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-lunch') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=13`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-dinner') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=1`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.recipes-breakfast') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/recipes?q=&pref=1&s=1&c%5B%5D=6`,
        title: 'Recipes',
      });
    } else if (data.activityType === 'com.anthrophi.shae.shopping-basket') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/basket`,
        title: 'Shopping Basket',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-preparation') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType ===
      'com.anthrophi.shae.food-preparation-fermented-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-that-has-been-fermented`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-steamed-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#steamed-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-raw-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#raw-whole-and-unprocessed-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-juiced-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#juiced-foods`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-baked-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#baked-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-boiled-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#poached-or-boiled-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType ===
      'com.anthrophi.shae.food-preparation-stir-fried-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#foods-that-are-stir-fried-or-sautéed`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-sprouted-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-that-has-been-sprouted`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-roasted-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#roasted-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-soaked-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-that-has-been-soaked`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-salt'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-preserved-in-salt`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-vinegar'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-preserved-in-vinegar`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-oil'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-preserved-in-oil`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-cold-drinks'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#cold-drinks`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-cold-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#cold-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-frozen-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#frozen-foods-like-ice-cream-popcicles`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType ===
      'com.anthrophi.shae.food-preparation-dehydrated-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#dehydrated-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-broiled-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#broiled-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-smoked-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#smoked-foods-commercial`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-canned-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#canned-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType ===
      'com.anthrophi.shae.food-preparation-processed-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#commercially-processed-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType ===
      'com.anthrophi.shae.food-preparation-deep-fried-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#deep-fried-foods`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-breaded-foods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#breaded-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-baked-goods'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#baked-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-smoothies'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#smoothies`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-broths'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#leavened-food`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-preservatives'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-with-chemical-preservatives`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-gluten'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#foods-that-contain-gluten`,
        title: 'Food Preparation',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-preparation-msg'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodPrep#food-with-msg-or-e621`,
        title: 'Food Preparation',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-food-combining'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#food-combining`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-calories') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#calories-and-portions`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-eating-habits'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#eating-habits`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-vegetables'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#vegetables-in-general`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType ===
      'com.anthrophi.shae.food-guide-green-leafy-vegetables'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#green-leafy-vegetables`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-root-vegetables'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#root-vegetables`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-beans') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#beans`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-fruit') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#fruit`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-dried-fruit'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#dried-fruit`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-animal-proteins'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#animal-proteins`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-eggs') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#eggs`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-white-meat'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#white-meat`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-red-meat') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#red-meat`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-white-fish'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#white-fish`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-oily-fish'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#oily-fish`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-shellfish'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#shellfish`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-seeds') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#seeds`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-nuts') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#nuts`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-nut-butters'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#nut-butters`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-salt') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#salt`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-oils') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#oils`,
        title: 'Food Guide',
      });
    } else if (
      data.activityType === 'com.anthrophi.shae.food-guide-sweeteners'
    ) {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#natural-sweeteners`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-teas') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#teas-and-infusions`,
        title: 'Food Guide',
      });
    } else if (data.activityType === 'com.anthrophi.shae.food-guide-juices') {
      Actions.details({
        uri: `${URL_ADRESS}/mobile/foodGuide#juices`,
        title: 'Food Guide',
      });
    }
  };

  // onIds(device) {
  //   // console.log('inIds Device info: ', device);
  //   // const data = await AsyncStorage.getItem('userData');
  //   // console.log('data', data);
  // }

  // onRegistered(notifData) {
  //   // console.log("Device had been registered for push notifications!", notifData);
  // }

  getUserData = async (screenName) => {
    try {
      let userInfo = await AsyncStorage.getItem('userData');
      let user = JSON.parse(userInfo);
      trackScreenView(screenName, user && user.user);
    } catch (e) {
      console.log('error', e);
    }
  };

  render() {
    const navigationStateHandler = new NavigationStateHandler();

    const extraPropsToRouter = {};
    if (Platform.OS === 'android') {
      extraPropsToRouter.panHandlers = null;
    }

    console.log('Actions currentScene', Actions.focus);

    const reducerCreate = (params) => {
      navigationStateHandler.getReducer.bind(navigationStateHandler);
      const defaultReducer = Reducer(params);
      return (state, action) => {
        // console.log('action.type //////////////////////////////////////////////////', action.type, action.key, action)
        if (action.type == 'REACT_NATIVE_ROUTER_FLUX_PUSH') {
          console.log('final ===', action.key);
          this.getUserData(action.key);
        }

        if (action.type == ActionConst.FOCUS) {
          console.log('ActionConst.FOCUS', action.scene.sceneKey);

          if (action.scene.sceneKey === 'wearables') {
            if (!this.state.isWearablesFocused) {
              this.setState({isWearablesFocused: true}, () => {
                Actions.refresh({key: 'wearables', refresh: true});
              });
            }

            // Actions.details({key: 'wearables', refresh: true});
          } else {
            this.setState({isWearablesFocused: false});
            // Actions.refresh({isEntered: false});
          }
        }
        return defaultReducer(state, action);
      };
    };

    return (
      <Provider store={this.store}>
        <View style={globalStyles.container}>
          <StatusBar
            backgroundColor={statusBarColor}
            barStyle="light-content"
          />
          <Drawer
            acceptPan={false}
            ref={(drawer) => (this.drawer = drawer)}
            content={
              <SideMenu
                isDrawerOpen={this.state.isDrawerOpen}
                close={() => this.drawer.close()}
                userName="123"
              />
            }
            onOpen={() => {
              this.setState({isDrawerOpen: true});
              this.store.dispatch({type: DRAWER_OPEN});
            }}
            onClose={() => {
              this.setState({isDrawerOpen: false});
              this.store.dispatch({type: DRAWER_CLOSE});
            }}
            openDrawerOffset={0.15}
            type="displace"
            tapToClose>
            <Router
              {...extraPropsToRouter}
              // createReducer={navigationStateHandler.getReducer.bind(
              //   navigationStateHandler,
              // )}
              createReducer={reducerCreate}
              navigationStateHandler={navigationStateHandler}
              sceneStyle={{paddingTop: navBarHeight}}
              backButtonImage={require('./resources/icon/back_arrow.png')}
              duration={250}>
              <Scene key="route">
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={LoginPage}
                  key="loginPage"
                  hideNavBar
                  initial={this.loginInitial}
                />
                <Scene
                  component={RequestedPage}
                  sceneStyle={{paddingTop: 0}}
                  key="afterLoginPage"
                  direction="vertical"
                  panHandlers={null}
                  renderBackButton={CloseModalBtn}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Shae"
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  // component={GpsAgree}
                  // hideNavBar
                  component={Dashboard}
                  type={ActionConst.RESET}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="dashboard"
                  title="Dashboard"
                  leftButtonImage={require('./resources/icon/menu.png')}
                  onLeft={() => this.drawer.toggle()}
                  initial={this.dashboardInitial}
                  // openResult={this.state.openResult}
                  // clearOpenResult={() => this.setState({ openResult: null })}
                />
                <Scene
                  component={RequestedPage}
                  navigationBarStyle={NavBar}
                  onBridgeMessage={onBridgeMessageCategory}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="category"
                  // onBack={() => console.log("custom back callback")}
                />
                <Scene
                  component={RequestedPage}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  onBridgeMessage={onBridgeMessageCategory}
                  key="details"
                  // onBack={() => console.log("custom back callback")}
                />
                <Scene
                  component={ForgotPassword}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="FORGOT PASSWORD"
                  key="forgotPassword"
                />
                <Scene
                  component={SiriShortcuts}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Siri Voice Shortcuts"
                  key="siriShortcuts"
                />
                <Scene
                  component={GoogleFitLinkScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="GoogleFit"
                  key="googleFitLink"
                />
                <Scene
                  component={FoodDiary}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Food Diary"
                  key="foodDiary"
                  onRight={() => {}}
                  rightButtonImage={() => null}
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={Tour}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Dashboard"
                  key="tour"
                  onRight={() => {
                    return this.state.isDrawerOpen;
                  }}
                  rightButtonImage={() => null}
                  applyAnimation={applyAnimation}
                  // leftButtonImage={require("./resources/icon/menu.png")}
                  backButtonImage={require('./resources/icon/menu.png')}
                  backButtonIconStyle={{width: 50}}
                  leftButtonIconStyle={{width: 24, height: 19}}
                  // barButtonIconStyle={{ width: 50 }}
                  onLeft={() => this.drawer.toggle()}
                  // isDrawerOpen={this.state.isDrawerOpen}
                  duration={300}
                  back={false}
                />
                <Scene
                  component={HRA}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Personal Health Assessment"
                  key="hra"
                  onRight={() => {}}
                  rightButtonImage={() => null}
                  applyAnimation={applyAnimation}
                  duration={300}
                  // barButtonTextStyle={{ color: "rgb(255,255,255)" }}
                  rightButtonTextStyle={{
                    color: 'rgb(255,255,255)',
                    fontFamily: 'SFProText-Regular',
                    fontWeight: '400',
                    fontSize: 17,
                    lineHeight: 22,
                    letterSpacing: -0.41,
                    marginTop: -1.5,
                  }}
                />
                <Scene
                  component={TrackScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Track"
                  key="track"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={PilotSurveyScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Health Snaps"
                  key="pilotSurvey"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={PilotSurveyDetailsScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Details"
                  key="pilotSurveyDetails"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={WelcomeScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="welcome"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={LoginScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="login"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={ResetPassword}
                  navigationBarStyle={NavBarLight}
                  titleStyle={NavTitleLight}
                  hideNavBar={false}
                  title="Reset password"
                  key="resetPassword"
                  applyAnimation={applyAnimation}
                  backButtonImage={require('./resources/icon/back.png')}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={ResetPasswordCompleted}
                  navigationBarStyle={NavBarLight}
                  titleStyle={NavTitleLight}
                  hideNavBar={true}
                  key="resetPasswordCompleted"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={Signup}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="signup"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={Signup2}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="signup2"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={SignupWelcome}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="signupWelcome"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={SignupPreferences}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="signupPreferences"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={NotificationsSettings}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="notificationsSettings"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={NotificationsRequest}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="notificationsRequest"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={ConfirmEmail}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={true}
                  // title="Details"
                  key="confirmEmail"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={BodyMeasurements}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  title="Body Measurements"
                  key="bodyMeasurements"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={BodyMetricsHead}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  title="Head & Neck"
                  key="bodyMetricsHead"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={BodyMetricsArms}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  title="Arms"
                  key="bodyMetricsArms"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={BodyMetricsUpperBody}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  title="Upper Body"
                  key="bodyMetricsUpperBody"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={BodyMetricsLegs}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  title="Legs"
                  key="bodyMetricsLegs"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  // sceneStyle={{ paddingTop: 0 }}
                  component={BodyMetricsFullBody}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  title="Full Body"
                  key="bodyMetricsFullBody"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={CreateAvatar}
                  navigationBarStyle={NavBar}
                  hideNavBar={true}
                  titleStyle={NavTitle}
                  // title="Full Body"
                  key="createAvatar"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={EnableGps}
                  navigationBarStyle={NavBar}
                  hideNavBar={true}
                  titleStyle={NavTitle}
                  // title="Full Body"
                  key="enableGps"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={Customizing}
                  navigationBarStyle={NavBar}
                  hideNavBar={true}
                  titleStyle={NavTitle}
                  // title="Full Body"
                  key="customizing"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={MeetShae}
                  navigationBarStyle={NavBar}
                  hideNavBar={true}
                  titleStyle={NavTitle}
                  // title="Full Body"
                  key="meetShae"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={TokenCode}
                  navigationBarStyle={NavBar}
                  hideNavBar={true}
                  titleStyle={NavTitle}
                  key="tokenCode"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={WearablesScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Wearables"
                  key="wearables"
                  applyAnimation={applyAnimation}
                  duration={300}
                  isWearablesFocused={this.state.isWearablesFocused}
                />
                <Scene
                  component={WearablesTrackingScreen}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Wearables tracking"
                  key="wearablesTracking"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={HraCompleted}
                  sceneStyle={{paddingTop: 0}}
                  hideNavBar
                  key="hraCompleted"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={SearchFoodScreen}
                  sceneStyle={{paddingTop: 0}}
                  hideNavBar
                  key="searchFoodScreen"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={FoodDetails}
                  // sceneStyle={{ paddingTop: 0 }}
                  navigationBarStyle={NavBarLight}
                  titleStyle={NavTitleLight}
                  hideNavBar={false}
                  title="Add Food"
                  key="foodDetails"
                  backButtonImage={require('./resources/icon/back.png')}
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={SaveMeal}
                  // sceneStyle={{ paddingTop: 10 }}
                  navigationBarStyle={NavBarLight}
                  titleStyle={NavTitleLight}
                  hideNavBar={false}
                  title="Save Meal"
                  key="saveMeal"
                  backButtonImage={require('./resources/icon/back.png')}
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={SavedMeals}
                  // sceneStyle={{ paddingTop: 0 }}
                  navigationBarStyle={NavBarLight}
                  titleStyle={NavTitleLight}
                  hideNavBar={false}
                  title="Edit Meal"
                  key="savedMeals"
                  backButtonImage={require('./resources/icon/back.png')}
                  applyAnimation={applyAnimation}
                  duration={300}
                  // onRight={()=>{}}
                  // rightTitle={'Edit'}
                  // rightButtonStyle={{
                  //   bottom: 20
                  // }}
                  rightButtonTextStyle={{
                    color: 'rgb(235,75,75)',
                    fontFamily: 'SFProText-Regular',
                    fontWeight: '400',
                    fontSize: 17,
                    lineHeight: 22,
                    letterSpacing: -0.41,
                    marginTop: -1.5,
                  }}
                />
                <Scene
                  component={SavedMealsUneditable}
                  hideNavBar
                  sceneStyle={{paddingTop: 0}}
                  key="savedMealsUneditable"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={RecipeDetails}
                  sceneStyle={{paddingTop: 0}}
                  hideNavBar
                  key="recipeDetails"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={AboutShae}
                  sceneStyle={{paddingTop: 0}}
                  hideNavBar
                  key="aboutShae"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={VirtualCoach1}
                  // sceneStyle={{ paddingTop: 0 }}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="virtualCoach1"
                  title="My Virtual Coach"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={VirtualCoach2}
                  // sceneStyle={{ paddingTop: 0 }}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="virtualCoach2"
                  title="My Virtual Coach"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={TakePhotos}
                  // sceneStyle={{paddingTop: 0}}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="takePhotos"
                  title="Take Photo’s"
                  applyAnimation={applyAnimation}
                  duration={300}
                  onRight={() => {}}
                  rightButtonImage={() => null}
                  rightButtonTextStyle={{
                    color: 'rgb(255,255,255)',
                    fontFamily: 'SFProText-Regular',
                    fontWeight: '400',
                    fontSize: 17,
                    lineHeight: 22,
                    letterSpacing: -0.41,
                    marginTop: -1.5,
                  }}
                />
                <Scene
                  component={CaptureAvatar}
                  // sceneStyle={{ paddingTop: 0 }}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="captureAvatar"
                  title="Capture your Avatar"
                  applyAnimation={applyAnimation}
                  duration={300}
                  onRight={() => {}}
                  rightButtonImage={() => null}
                  rightButtonTextStyle={{
                    color: 'rgb(255,255,255)',
                    fontFamily: 'SFProText-Regular',
                    fontWeight: '400',
                    fontSize: 17,
                    lineHeight: 22,
                    letterSpacing: -0.41,
                    marginTop: -1.5,
                  }}
                />
                <Scene
                  component={PhotoAvatar}
                  sceneStyle={{paddingTop: 0}}
                  hideNavBar
                  key="photoAvatar"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={NutrientsDetails}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Carbohydrates"
                  key="nutrientsDetails"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={CreateAccount}
                  hideNavBar
                  key="registerOffer"
                />
                <Scene
                  component={RequestedPage}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  title="Shae"
                  direction="vertical"
                  panHandlers={null}
                  renderBackButton={CloseModalBtn}
                  key="registerPage"
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={NotificationAgree}
                  hideNavBar
                  key="notifications"
                />
                <Scene
                  sceneStyle={{paddingTop: 0}}
                  component={GpsAgree}
                  hideNavBar
                  key="gpsAgree"
                />
                <Scene
                  component={RequestedPage}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  direction="vertical"
                  panHandlers={null}
                  renderBackButton={CloseModalBtn}
                  hideNavBar={false}
                  key="notificationPage"
                />
                <Scene
                  component={PersonalizedDetox}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="PersonalizedDetox"
                  title="Personalized Detox"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={PersonalizedDetoxDetails}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="PersonalizedDetoxDetails"
                  title="Personalized Detox"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={PersonalizedDetoxTrackProgress}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="PersonalizedDetoxTrackProgress"
                  title="Personalized Detox"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={PersonalizedDetoxDailyRoutine}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="PersonalizedDetoxDailyRoutine"
                  title="Personalized Detox"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
                <Scene
                  component={PersonalizedDetoxAfterDetails}
                  navigationBarStyle={NavBar}
                  titleStyle={NavTitle}
                  hideNavBar={false}
                  key="PersonalizedDetoxAfterDetails"
                  title="Personalized Detox"
                  applyAnimation={applyAnimation}
                  duration={300}
                />
              </Scene>
            </Router>
          </Drawer>
        </View>
      </Provider>
    );
  }
}

/**
 * Created by developercomputer on 09.10.16.
 */
import React, {Component} from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';

import {Actions} from 'react-native-router-flux';

import {connect} from 'react-redux';

import {screenWidth, screenHeight} from '../globalStyles';
import * as shaefitApi from '../API/shaefitAPI';

import {LOGOUT_REQUEST, HIDE_LOADER, SHOW_LOADER} from '../redux/actions/names';

import {URL_ADRESS} from '../constants';

import GPSState from 'react-native-gps-state';

import {deleteRealmObjects} from '../data/db/Db';

const menuItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  imageItem: {
    height: 30,
    width: 30,
    marginLeft: 25,
    marginRight: 20,
  },
  text: {
    color: '#2d3036',
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'center',
    textAlign: 'center',
  },
  textGrey: {
    color: '#68686F',
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    opacity: 0.75,
    marginLeft: 15,
  },
});

const MenuItem = ({source, text, onPress}) => (
  <TouchableOpacity style={menuItemStyle.container} onPress={onPress}>
    <Image
      resizeMode="contain"
      style={menuItemStyle.imageItem}
      source={source}
    />
    <Text style={menuItemStyle.text}>{text}</Text>
  </TouchableOpacity>
);

const MenuItemGrey = ({text, onPress}) => (
  <TouchableOpacity
    style={[menuItemStyle.container, {marginVertical: 15}]}
    onPress={onPress}>
    <Text style={menuItemStyle.textGrey}>{text}</Text>
  </TouchableOpacity>
);

MenuItem.propTypes = {
  source: Image.propTypes.source,
  text: PropTypes.string,
  onPress: PropTypes.func,
};
MenuItem.defaultProps = {
  text: '../resources/TonyStark.png',
  onPress: () => {},
};

// This styles are mostly legacy of Zhukov.
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    height: screenHeight * 0.2,
    width: screenWidth * 0.85,
    // justifyContent: 'center',
    backgroundColor: '#244C8A',
  },
  user: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '600',
    // fontFamily: 'Roboto-Regular'
  },
  textHealthType: {
    color: '#6F99DB',
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
    // fontFamily: 'Roboto-Bold'
  },
  accountButton: {
    backgroundColor: 'transparent',
    // paddingLeft: 50
    position: 'absolute',
    right: 24,
    top: Platform.OS === 'ios' ? 66 + 18 : 66 + 3,
  },
  accountImage: {
    height: 20,
    width: 20,
    tintColor: '#fff',
    opacity: 0.3,
  },
  avatar: {
    marginLeft: 24,
    marginRight: 16,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  menuItemsContainer: {
    // backgroundColor: 'white',
    // flex: 1,
    // justifyContent: 'space-between'
  },
});

const getPosition = async () => {
  const gpsAgree = await AsyncStorage.getItem('gpsAgree');

  const isEnabled = JSON.parse(gpsAgree);
  console.log('isEnabled', isEnabled);

  if (typeof isEnabled !== 'undefined' && isEnabled?.gpsAgree) {
    const gpsStatus = await GPSState.getStatus();
    console.log('GPSState', gpsStatus);

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
      console.log('position sidemenu page', position);

      return position;
    }
  }
};

function createMenuHandler({category, title, close, startLoad, endLoad}) {
  return async function menuHandler() {
    const position = await getPosition();

    close();
    // setTimeout(startLoad, 400);
    // setTimeout(endLoad, 10000);
    // console.log('state.auth.userInfo', store.getState()); //////
    // console.log('url', `${URL_ADRESS}/mobile/${category}`);
    // Actions.refresh({
    //   key: 'dashboard',
    //   uri: `${URL_ADRESS}/mobile/${category}`,
    //   title,
    // });

    let latlng = {};
    if (typeof position !== 'undefined') {
      latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
    }

    setTimeout(
      () => {
        if (category !== 'dashboard') {
          Actions.refresh({
            key: 'dashboard',
            uri: `${URL_ADRESS}/mobile/${category}`,
            title,
            ...latlng,
          });
        } else {
          Actions.refresh({
            key: 'dashboard',
            uri: `${URL_ADRESS}/mobile/${category}`,
            title,
            ...latlng,
          });
        }
      },

      30,
    );
  };
}

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: null,
      userName: '',
      avatar: '',
      healthType: '',
    };

    this.userDetails = null;
  }

  // async componentDidMount() {
  //   let userDetails = await AsyncStorage.getItem('userDetails');
  //
  //   if (userDetails !== null) {
  //     userDetails = JSON.parse(userDetails);
  //     console.log('userDetails sidemenu', userDetails);
  //     this.setState({userDetails});
  //
  //     if (typeof userDetails !== 'undefined' && userDetails !== null && typeof userDetails.profile !== 'undefined') {
  //       this.setState({userName: userDetails.profile.firstname + ' ' + userDetails.profile.lastname});
  //     }
  //
  //     if (userDetails !== null && typeof userDetails.avatar !== 'undefined' && userDetails.avatar !== null) {
  //       if (typeof userDetails.avatar.url !== 'undefined' && typeof userDetails.avatar.path !== 'undefined') {
  //         this.setState({avatar: userDetails.avatar.url + userDetails.avatar.path});
  //       }
  //     }
  //
  //     if (typeof userDetails.biotypeName !== 'undefined') {
  //       this.setState({healthType: userDetails.biotypeName});
  //     }
  //   }
  //
  // }

  componentDidMount() {
    this.checkUserData();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps side menu', nextProps);
    this.checkUserData();
    // if (this.state.userDetails === null) {
    //   let userDetails = await AsyncStorage.getItem("userDetails");
    //
    //   if (userDetails !== null) {
    //     userDetails = JSON.parse(userDetails);
    //     console.log("userDetails sidemenu", userDetails);
    //     this.setState({ userDetails });
    //
    //     if (
    //       typeof userDetails !== "undefined" &&
    //       userDetails !== null &&
    //       typeof userDetails.profile !== "undefined"
    //     ) {
    //       this.setState({
    //         userName:
    //           userDetails.profile.firstname +
    //           " " +
    //           userDetails.profile.lastname,
    //       });
    //     }
    //
    //     if (
    //       userDetails !== null &&
    //       typeof userDetails.avatar !== "undefined" &&
    //       userDetails.avatar !== null
    //     ) {
    //       if (
    //         typeof userDetails.avatar.url !== "undefined" &&
    //         typeof userDetails.avatar.path !== "undefined"
    //       ) {
    //         this.setState({
    //           avatar: userDetails.avatar.url + userDetails.avatar.path,
    //         });
    //       }
    //     }
    //
    //     if (typeof userDetails.biotypeName !== "undefined") {
    //       this.setState({ healthType: userDetails.biotypeName });
    //     }
    //   }
    //   // console.log('componentWillReceiveProps', nextProps.isDrawerOpen);
    // }
  }

  checkUserData = async () => {
    let userData = await shaefitApi.getUserDetails();
    this.userDetails = userData;

    this.setState({
      userName:
        typeof userData !== 'undefined' &&
        typeof userData.username !== 'undefined'
          ? userData.username
          : '',
      avatar:
        typeof userData !== 'undefined' &&
        typeof userData.avatar !== 'undefined' &&
        userData.avatar !== null
          ? userData.avatar.url + userData.avatar.path
          : '',
      healthType: userData.biotypeName,
    });
  };

  openHealthApp = async () => {
    if (Platform.OS === 'ios') {
      const healthAppUrl = 'x-apple-health://';
      const canOpenHealthApp = await Linking.canOpenURL(healthAppUrl);
      if (canOpenHealthApp) {
        Linking.openURL(healthAppUrl);
      }
    } else {
      Actions.details({
        key: 'googleFitLink',
      });
    }
  };

  render() {
    return (
      <View style={style.container}>
        <TouchableWithoutFeedback
          onPress={createMenuHandler({
            title: 'Account',
            category: 'account',
            close: this.props.close,
            startLoad: this.props.startLoad,
            endLoad: this.props.endLoad,
          })}>
          {/* <Image style={style.bgImage} source={require('../resources/header-menu.png')}> */}
          <View
            style={[
              style.bgImage,
              {flexDirection: 'row', alignItems: 'center', paddingTop: 35},
            ]}>
            {/* <Image style={style.avatar} source={ require('../resources/TonyStark.png') } /> */}
            {this.state.avatar !== '' ? (
              <Image style={style.avatar} source={{uri: this.state.avatar}} />
            ) : (
              <Image
                style={style.avatar}
                source={require('../resources/icon/avatar.png')}
              />
            )}

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <Text style={style.user}>{this.state.userName}</Text>
              {this.state.healthType !== '' && (
                <Text style={style.textHealthType}>
                  HealthType - {this.state.healthType}
                </Text>
              )}
            </View>
            <View style={style.accountButton}>
              <Image
                resizeMode="contain"
                style={style.accountImage}
                source={require('../resources/icon/assets_menu/Arrow-Right.png')}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View
          style={{
            backgroundColor: '#244C8A',
            height: 15,
            position: 'absolute',
            width: screenWidth * 0.85,
            top: screenHeight * 0.2,
          }}></View>
        <View
          style={{
            backgroundColor: 'white',
            height: 15,
            width: screenWidth * 0.85,
            borderStyle: 'solid',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}></View>
        <ScrollView contentContainerStyle={style.menuItemsContainer}>
          <MenuItem
            source={require('../resources/icon/assets_menu/dashboard.png')}
            text="Dashboard"
            onPress={createMenuHandler({
              title: 'Dashboard',
              category: 'dashboard',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          {/*<MenuItem
            source={require("../resources/icon/assets_menu/foodLog.png")}
            text="Food Diary"
            onPress={() => {
              this.props.close();
              Actions.details({
                key: "foodDiary",
              });
            }}
          /> */}
          <MenuItem
            source={require('../resources/icon/assets_menu/updateShae.png')}
            text="Update Shae"
            onPress={() => {
              this.props.close();
              Actions.takePhotos({userId: this.userDetails?.id});
              // Actions.details({
              //   key: 'hra',
              //   isMeasurements: true,
              //   // key: "tour",
              //   // key: "welcome",
              // });
            }}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/updateShae.png')}
            text="HRA"
            onPress={() => {
              this.props.close();
              Actions.details({
                key: 'hra',
                isMeasurements: true,
                // key: "tour",
                // key: "welcome",
              });
            }}
          />
          {/*<MenuItem
            source={require("../resources/icon/assets_menu/updateShae.png")}
            text="Virtual Coach"
            onPress={() => {
              this.props.close();
              Actions.details({
                key: "virtualCoach1",
              });
            }}
          /> */}
          {/*<MenuItem
            source={require('../resources/icon/assets_menu/updateShae.png')}
            text="Onboarding"
            onPress={() => {
              this.props.close();
              Actions.details({
                key: 'enableGps', // signupWelcome
                // key: "tokenCode",
                // key: "signupPreferences",
              });
            }}
          /> */}
          {/* <MenuItem
            source={require("../resources/icon/assets_menu/food-list.png")}
            text="Personalized Detox"
            onPress={() => {
              this.props.close();
              Actions.PersonalizedDetox();
            }}
          /> */}
          <MenuItem
            source={require('../resources/icon/assets_menu/food-list.png')}
            text="Food"
            onPress={createMenuHandler({
              title: 'Food',
              category: 'food',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/recipes.png')}
            text="Recipes"
            onPress={createMenuHandler({
              title: 'Recipes',
              category: 'recipes',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/meal-plan.png')}
            text="Meal Plan"
            onPress={createMenuHandler({
              title: 'Meal Plan',
              category: 'mealplan',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/fitness.png')}
            text="Fitness"
            onPress={createMenuHandler({
              title: 'Fitness',
              category: 'fitness',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/lifestyle.png')}
            text="Lifestyle"
            onPress={createMenuHandler({
              title: 'Lifestyle',
              category: 'lifestyle',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/coaching.png')}
            text="Coaching"
            onPress={createMenuHandler({
              title: 'Coaching',
              category: 'coaching',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/track.png')}
            text="Track"
            onPress={() => {
              this.props.close();
              Actions.details({
                key: 'track',
              });
            }}
          />
          <MenuItem
            source={require('../resources/icon/assets_menu/group-7.png')}
            text="Health Booster"
            onPress={createMenuHandler({
              title: 'Health Booster',
              category: 'checkboost',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <View
            style={{
              borderBottomColor: '#68686F',
              borderBottomWidth: 1,
              margin: 15,
              opacity: 0.5,
            }}
          />
          <MenuItemGrey
            text="About Shae"
            onPress={() => {
              this.props.close();
              Actions.details({
                key: 'aboutShae',
              });
            }}
          />

          <MenuItemGrey
            text="Enable Health Data"
            onPress={() => {
              this.props.close();
              this.openHealthApp();
              // Actions.details({
              //   key: "aboutShae",
              // });
            }}
          />

          {Platform.OS === 'ios' && (
            <MenuItemGrey
              text="Siri Voice Shortcuts"
              onPress={() => {
                this.props.close();
                Actions.details({
                  key: 'siriShortcuts',
                });
              }}
            />
          )}
          <MenuItemGrey
            text="Resources"
            onPress={createMenuHandler({
              title: 'Resources',
              category: 'resources',
              close: this.props.close,
              startLoad: this.props.startLoad,
              endLoad: this.props.endLoad,
            })}
          />
          <MenuItemGrey
            text="Log Out"
            onPress={() => {
              this.props.close();
              this.props.logout();
              deleteRealmObjects();
            }}
          />
          <View style={{height: 25}}></View>
        </ScrollView>

        {/* <Image style={style.avatar} source={{ uri: avatarUri }} /> */}
      </View>
    );
  }
}

// const SideMenu = ({ userName, avatarUri, healthType, close, logout, startLoad, endLoad }) => (
//   <View style={style.container}>
//     <TouchableWithoutFeedback onPress={createMenuHandler({title: 'Account', category: 'account', close, startLoad, endLoad})}>
//     {/* <Image style={style.bgImage} source={require('../resources/header-menu.png')}> */}
//       <View style={[style.bgImage, {flexDirection:'row', alignItems:'center', paddingTop: 35}]}>
//       {/* <Image style={style.avatar} source={ require('../resources/TonyStark.png') } /> */}
//         <Image style={style.avatar} source={{ uri: avatarUri }} />
//         <View style={{flexDirection:'column', justifyContent: 'space-between'}}>
//           <Text style={style.user}>{userName}</Text>
//           <Text style={style.textHealthType}>HealthType - {healthType}</Text>
//         </View>
//         <View
//           style={style.accountButton}
//         >
//           <Image
//             resizeMode="contain"
//             style={style.accountImage} source={require('../resources/icon/assets_menu/Arrow-Right.png')}
//           />
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//     <View style={{
//       backgroundColor: '#244C8A',
//       height: 15,
//       position: 'absolute',
//       width: screenWidth * 0.85,
//       top: screenHeight * 0.2}}
//     >
//     </View>
//     <View style={{
//       backgroundColor: 'white',
//       height: 15,
//       width: screenWidth * 0.85,
//       borderStyle: 'solid',
//       borderTopLeftRadius: 15,
//       borderTopRightRadius: 15}}
//     >
//     </View>
//     <ScrollView contentContainerStyle={style.menuItemsContainer}>
//       <MenuItem
//         source={require('../resources/icon/assets_menu/dashboard.png')}
//         text="Dashboard"
//         onPress={createMenuHandler({
//           title: 'Dashboard',
//           category: 'dashboard',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/food-list.png')}
//         text="Food"
//         onPress={createMenuHandler({
//           title: 'Food',
//           category: 'food',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/recipes.png')}
//         text="Recipes"
//         onPress={createMenuHandler({
//           title: 'Recipes',
//           category: 'recipes',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/meal-plan.png')}
//         text="Meal Plan"
//         onPress={createMenuHandler({
//           title: 'Meal Plan',
//           category: 'mealplan',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/fitness.png')}
//         text="Fitness"
//         onPress={createMenuHandler({
//           title: 'Fitness',
//           category: 'fitness',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/lifestyle.png')}
//         text="Lifestyle"
//         onPress={createMenuHandler({
//           title: 'Lifestyle',
//           category: 'lifestyle',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/coaching.png')}
//         text="Coaching"
//         onPress={createMenuHandler({
//           title: 'Coaching',
//           category: 'coaching',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItem
//         source={require('../resources/icon/assets_menu/group-7.png')}
//         text="Health Booster"
//         onPress={createMenuHandler({
//           title: 'Health Booster',
//           category: 'checkboost',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <View
//         style={{
//           borderBottomColor: '#68686F',
//           borderBottomWidth: 1,
//           margin: 15,
//           opacity: 0.5,
//         }}
//       />
//       <MenuItemGrey
//         text="Resources"
//         onPress={createMenuHandler({
//           title: 'Resources',
//           category: 'resources',
//           close,
//           startLoad,
//           endLoad
//         })}
//       />
//       <MenuItemGrey
//         text="Log Out"
//         onPress={() => {
//           close();
//           logout();
//         }}
//       />
//       <View style={{ height: 25 }}>
//       </View>
//     </ScrollView>
//
//     {/* <Image style={style.avatar} source={{ uri: avatarUri }} /> */}
//   </View>
// );

SideMenu.propTypes = {
  userName: PropTypes.string,
  avatarUri: PropTypes.string,
  healthType: PropTypes.string,
  close: PropTypes.func,
  logout: PropTypes.func,
  startLoad: PropTypes.func,
  endLoad: PropTypes.func,
};
SideMenu.defaultProps = {
  userName: '',
  avatarUri: '',
  healthType: '',
  close: () => {},
  logout: () => {},
  startLoad: () => {},
  endLoad: () => {},
};

const mapStateToProps = (state) => ({
  userName: state.auth.userInfo.username, //state.auth.userInfo.name,
  avatarUri: state.auth.userInfo.avatar,
  healthType: state.auth.userInfo.healthType,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({type: LOGOUT_REQUEST}),
  startLoad: () => dispatch({type: SHOW_LOADER}),
  endLoad: () => dispatch({type: HIDE_LOADER}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {screenHeight, screenWidth} from '../globalStyles';
import {GPS_AGREE} from '../redux/actions/names';
import RoundBtn from '../components/RoundBtn';

import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {request, PERMISSIONS} from 'react-native-permissions';

const styles = StyleSheet.create({
  backgroundImage: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute',
    opacity: 0.7,
  },
  textTitle: {
    fontFamily: 'System',
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    paddingTop: 116,
    letterSpacing: -0.4,
    textAlign: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0)',
  },
  text: {
    fontFamily: 'System',
    color: '#ffffff',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    paddingTop: 15,
    letterSpacing: -0.4,
    backgroundColor: 'rgba(255,255,255,0)',
  },
  button: {
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    width: 315,
    alignSelf: 'center',
    shadowColor: 'rgba(0,0,0, 0.3)',
    shadowOffset: {height: 24, width: 32},
    backgroundColor: '#00a8eb',
  },
  link: {
    paddingTop: 30,
    justifyContent: 'center',
  },
  textLink: {
    fontFamily: 'System',
    color: '#ffffff',
    fontSize: 15,
    opacity: 0.7,
    letterSpacing: -0.4,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0)',
  },
  imageGps: {
    alignSelf: 'center',
  },
});

const GpsAgree = ({dispatchGpsAgreement, userId}) => {
  const {height, width} = Dimensions.get('window');
  console.log('height', height);
  const gpsBG = require('../resources/gps-background.png');

  const handleAgreeClick = () => {
    // PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
    // PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    // PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        if (result === 'granted') {
          dispatchGpsAgreement({userId, isAgree: true});
        } else {
          dispatchGpsAgreement({userId, isAgree: false});
        }
      });
    } else {
      request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then((result) => {
        console.log('PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION', result);
        if (result === 'granted') {
          dispatchGpsAgreement({userId, isAgree: true});
        } else {
          dispatchGpsAgreement({userId, isAgree: false});
        }
      });
    }

    // if (Platform.OS === 'android') {
    //   checkIsLocation();
    // } else {
    //   // navigator.geolocation.requestAuthorization();
    //   // dispatchGpsAgreement({ userId, isAgree: true });
    //
    //   Permissions.request('location', {type: 'always'}).then((response) => {
    //     // console.log('location', response);
    //     if (response === 'authorized') {
    //       dispatchGpsAgreement({userId, isAgree: true});
    //     } else {
    //       dispatchGpsAgreement({userId, isAgree: false});
    //     }
    //   });
    // }
  };

  const checkIsLocation = async () => {
    let check = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: 'Use Location services?',
      ok: 'YES',
      cancel: 'NO',
      enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, //true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
    }).catch((error) => error);

    console.log('LocationServicesDialogBox check', check);

    if (check.enabled) {
      dispatchGpsAgreement({userId, isAgree: true});
    }
  };

  let paddingTop = Platform.OS === 'android' ? 132 : 147;

  // const { height, width } = Dimensions.get('window');
  const aspectRatio = height / width;

  let isTablet = false;
  if (aspectRatio > 1.6) {
  } else {
    isTablet = true;
    paddingTop = 90;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <Image style={styles.backgroundImage} source={gpsBG} />
      <View style={{flex: 1, paddingTop: paddingTop}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            resizeMode="contain"
            style={styles.imageGps}
            source={require('../resources/icon/location-icon.png')}
          />
        </View>

        <Text style={[styles.textTitle, isTablet ? {paddingTop: 66} : null]}>
          Enable Location
        </Text>

        <Text style={styles.text}>
          Allow Shae to give your more {'\n'} personalised results based on{' '}
          {'\n'} your location
        </Text>

        <RoundBtn
          text="Allow Access"
          colorTextButton="#ffffff"
          styleButton={styles.button}
          styleContainer={
            isTablet
              ? {paddingTop: 31}
              : height < 650
              ? {paddingTop: 31}
              : {paddingTop: 91}
          }
          onPress={() => handleAgreeClick()}
        />

        <View style={styles.link}>
          <Text
            style={[styles.textLink, {color: '#ffffff'}]}
            onPress={() => dispatchGpsAgreement({userId, isAgree: false})}>
            No, Thanks
          </Text>
        </View>
      </View>
    </View>
  );
};

GpsAgree.propTypes = {
  dispatchAboutAgreement: PropTypes.func,
  userId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  userId: state.auth.userInfo.id,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchGpsAgreement: (payload) => dispatch({type: GPS_AGREE, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(GpsAgree);

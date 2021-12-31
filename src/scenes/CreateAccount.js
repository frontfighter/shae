import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image
} from 'react-native';

import Swiper from 'react-native-swiper';
import { Actions } from 'react-native-router-flux';

import { screenHeight, screenWidth } from '../globalStyles';

import RegistrationCard from '../components/RegistrationCard';
import FinishRegistrationCard from '../components/FinishRegistrationCard';

import { URL_ADRESS } from '../constants';

const style = StyleSheet.create({
  backgroundImage: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute'
  }
});

class CreateAccount extends Component {
  scrollToNext = () => this.swiper.scrollBy(1);
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={style.backgroundImage}
          source={require('../resources/login-background-woman.png')}
        />
        <Swiper
          ref={swiper => this.swiper = swiper}
          style={{ paddingBottom: 20 }}
          showsPagination={false}
          loop={false}
          index={0}
          height={screenHeight - 15}
        >
          <RegistrationCard
            titleText="Introducing Shae"
            onNextPress={this.scrollToNext}
            onLoginPress={Actions.pop}
            source={require('../resources/registr-circul-logo.png')}
          >
            Hey! I’m Shae - your personal health assistant. I’m here to provide you with real-time health & nutrition advice to keep you healthy and always at your best.
          </RegistrationCard>
          <RegistrationCard
            titleText="ph360 engine"
            onNextPress={this.scrollToNext}
            onLoginPress={Actions.pop}
            source={require('../resources/registr-circul-360.png')}
          >
            I take info from your body, environment & lifestyle, and filter this through evidence-based science and medicine, to match the best foods and health advice for you to stay healthy and happy.
          </RegistrationCard>
          <FinishRegistrationCard
            onRegisterPageMonthly={() => {
              Actions.registerPage({
                uri: `${URL_ADRESS}/mobile/purchase?type=MONTHLY`
              });
            }}
            onRegisterPageAnnual={() => {
              Actions.registerPage({
                uri: `${URL_ADRESS}/mobile/purchase?type=ANNUAL`
              });
            }}
            onLoginPress={Actions.pop}
          />
        </Swiper>
      </View>
    );
  }
}

export default CreateAccount;

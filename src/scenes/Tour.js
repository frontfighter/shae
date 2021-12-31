import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  ImageBackground,
  InteractionManager,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import Dialog, {
  FadeAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import {BoxShadow} from 'react-native-shadow';
import Svg, {Path, G} from 'react-native-svg';

import {getUserVariables} from '../data/db/Db';
import * as api from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';

let deviceH = Dimensions.get('screen').height;
const {height, width} = Dimensions.get('window');

let bottomNavBarH = deviceH - height;

const fadeAnimation = new FadeAnimation({
  toValue: 1,
  animationDuration: 200,
  useNativeDriver: true,
});

const shadowOpt = {
  width: width - 40,
  height: 48,
  color: '#273849',
  border: 18,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 6,
  style: {marginTop: 0, alignSelf: 'center'},
};

class Tour extends Component {
  constructor() {
    super();

    this.state = {
      step: 1,
      shaeImage: require('../resources/icon/shae-icon.png'),
      isDialogVisible: false,
      isInitial: true,
    };

    this.height = 0;
  }

  componentDidMount() {
    // openOverlay();
    setTimeout(() => {
      this.setState({
        dialogText:
          'Tap to go to your Food profile to access your daily schedule, foods list and food guides.',
        isDialogVisible: true,
        isInitial: false,
      });
    }, 400);
  }

  onNextStep = () => {
    this.setState({isDialogVisible: false}, () => {
      if (this.state.step !== 7) {
        let text = '';
        let image = null;

        setTimeout(() => {
          switch (this.state.step + 1) {
            case 2:
              InteractionManager.runAfterInteractions(() =>
                this.scrollView.scrollTo({
                  x: 0,
                  y: 97 * 5, //91 * 5,
                  animated: true,
                }),
              );
              text =
                'Tap to go to your Fitness profile to access your daily schedule, routines for cardio, strength and flexibility, and handy fitness tips.';
              image = require('../resources/icon/shae_icon_fitness.png');
              break;
            case 3:
              InteractionManager.runAfterInteractions(() =>
                this.scrollView.scrollTo({
                  x: 0,
                  y: 97 * 6, //91 * 6,
                  animated: true,
                }),
              );
              text =
                'Tap to go to your Lifestyle profile to access your daily schedule, mind, place, social and genius sections full of support and tips for you.';
              image = require('../resources/icon/shae_icon_lifestyle.png');
              break;
            case 4:
              InteractionManager.runAfterInteractions(() =>
                this.scrollView.scrollTo({
                  x: 0,
                  y: this.height, //91 * 9,
                  animated: true,
                }),
              );
              text =
                'Tap to go to your complete virtual coaching platform and access heaps of resources to support, motivate and inspire you!';
              image = require('../resources/icon/shae_icon_coaching.png');
              break;
            case 5:
              // this.scrollView.scrollTo({
              //   x: 0,
              //   y: this.height, //91 * 10,
              //   animated: true,
              // });
              text =
                'Tap here to go to a huge range of resources that will help you know and understand everything you want to know about living your personalized health!';
              image = require('../resources/icon/shae_icon_resources.png');
              break;
            case 6:
              text =
                'Tap this icon to reveal your menu options so you can easiy navigate your way around the sections of your profile.';
              image = require('../resources/icon/shae_icon_menu.png');
              break;
            case 7:
              this.props.onLeft();
              text =
                'You can see your HealthType under your user name. Tap to go to your account settings.';
              image = require('../resources/icon/shae_icon_healthtype.png');
              break;
            default:
              text = '';
          }
          this.setState({
            step: this.state.step + 1,
            shaeImage: image,
          });
        }, 200);

        setTimeout(() => {
          this.setState({
            isDialogVisible: true,
            // step: this.state.step + 1,
            dialogText: text,
          });
        }, 500);
      } else {
        this.props.onLeft();
        this.setState({isDialogVisible: false}, () => {
          setTimeout(() => {
            Actions.dashboard();
          }, 200);
        });
      }
    });
  };

  onSkipPress = () => {
    this.setState({isDialogVisible: false}, () => {
      if (this.props.onRight() === true) {
        this.props.onLeft();
      }
      setTimeout(() => {
        Actions.dashboard();
      }, 200);
    });
  };

  renderBlurChilds() {
    return (
      <View style={[styles.container, {marginTop: 16}]}>
        <Image
          source={{
            uri: 'https://dev-app.ph360.me/images/dashboard/dash-tile-food.jpg',
          }}
          style={{
            borderRadius: 4,
            width: width - 40,
            height: 75,
            position: 'absolute',
          }}
          resizeMode="cover"
        />
        <View style={{alignSelf: 'center', width: width - 80}}>
          <Text style={styles.title}>Food</Text>
          <Text style={styles.text}>
            Choose, eat and enjoy the right foods for you
          </Text>
        </View>
      </View>
    );
  }

  render() {
    // https://dev-app.ph360.me/images/dashboard/dash-tile-food.jpg
    // https://dev-app.ph360.me/images/dashboard/dash-tile-fitness.jpg
    // https://dev-app.ph360.me/images/dashboard/dash-tile-place.jpg
    let title = '';
    let text = '';
    let marginTop: 0;
    let image = 'https://dev-app.ph360.me/images/dashboard/dash-tile-food.jpg';
    let marginTopDialog = 0;
    let top = 0;
    let left = null;

    switch (this.state.step) {
      case 1:
        title = 'Food';
        text = 'Choose, eat and enjoy the right foods for you';
        marginTop = 292 + 12;
        image = require('../resources/icon/tour_food.png');
        top = isIphoneX()
          ? 85 + 12
          : Platform.OS === 'ios'
          ? 80 + 12
          : 71 - 20 + 12;
        break;
      case 2:
        title = 'Fitness';
        text = 'Strengthen, tone and play your way to fitness';
        marginTop = 292 + 12 + 97 * 5; //292 + 91 * 5;
        image = require('../resources/icon/tour_fitness.png');
        top = isIphoneX()
          ? 85 + 12
          : Platform.OS === 'ios'
          ? 80 + 12
          : 71 - 20 + 12;
        break;
      case 3:
        title = 'Lifestyle';
        text = 'Make your lifestyle choices work for you';
        marginTop = 292 + 12 + 97 * 6; //292 + 91 * 6;
        image = require('../resources/icon/tour_lifestyle.png');
        top = isIphoneX()
          ? 85 + 12
          : Platform.OS === 'ios'
          ? 80 + 12
          : 71 - 20 + 12;
        break;
      case 4:
        title = 'Coaching';
        text = 'Get precisely the support you need';
        marginTop = 292 + 6 + 97 * 11 + 6; //292 + 91 * 11 + 6;
        image = require('../resources/icon/tour_coaching.png');
        top = isIphoneX()
          ? height - 91 - 75 - 40 - 303 - 12
          : Platform.OS === 'ios'
          ? height - 91 - 75 - 303 - 35 - 12
          : height - 91 - 83 - 75 - 303 + 17 - 12;
        break;
      case 5:
        title = 'Resources';
        text = 'Resources to help you understand your unique body';
        marginTop = 292 + 12 + 97 * 12; //292 + 91 * 12;
        image = require('../resources/icon/tour_resources.png');
        top = isIphoneX()
          ? height - 75 - 40 - 303 - 6
          : Platform.OS === 'ios'
          ? height - 75 - 40 - 303 + 44 - 20 - 6
          : height - 75 - 40 - 303 + 34 - 20 - 6;
        break;
      case 6:
        title = 'Food';
        text = 'Choose, eat and enjoy the right foods for you';
        marginTop = 292;
        image = require('../resources/icon/tour_food.png');
        top = isIphoneX() ? 100 : Platform.OS === 'ios' ? 80 : 70;
        left = 0;
        break;
      case 7:
        title = 'Food';
        text = 'Choose, eat and enjoy the right foods for you';
        marginTop = 292;
        image = require('../resources/icon/tour_food.png');
        top = isIphoneX() ? 150 : Platform.OS === 'ios' ? 120 : 130;
        left = 30;
        break;
      default:
        text = '';
    }

    if (!isIphoneX()) {
      if (Platform.OS === 'ios') {
        marginTop += 20;
      } else {
        // marginTop -= 20;
      }
    }

    if (this.state.step === 4) {
      marginTopDialog =
        Platform.OS === 'android' ? 190 - 70 : isIphoneX() ? 190 : 190 - 25;
    } else if (this.state.step === 5) {
      marginTopDialog =
        Platform.OS === 'android' ? 370 - 115 : isIphoneX() ? 370 : 370 - 145;
    } else if (this.state.step === 6) {
      marginTopDialog =
        Platform.OS === 'android'
          ? -415 + 150
          : isIphoneX()
          ? -415
          : -415 + 195;
    } else if (this.state.step === 7) {
      marginTopDialog =
        Platform.OS === 'android'
          ? -290 + 150
          : isIphoneX()
          ? -290
          : -290 + 180;
    } else {
      marginTopDialog =
        Platform.OS === 'android'
          ? -415 + 170
          : isIphoneX()
          ? -415
          : -415 + 215;
    }

    console.log('isIphoneX', isIphoneX());

    console.log('bottomNavBarH', bottomNavBarH);

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1, height}}>
        <ScrollView
          scrollEnabled={false}
          ref={(ref) => {
            this.scrollView = ref;
          }}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.height = contentHeight;
          }}>
          <Text style={styles.name}>Hello Rebecca,</Text>
          <Text style={{marginVertical: 16, marginHorizontal: 20}}>
            You last updated your measurements on 7th July 2020
          </Text>

          <View style={[styles.container, {marginTop: 16, marginBottom: 16}]}>
            <View style={{flexDirection: 'row', marginTop: 16, marginLeft: 17}}>
              <Image
                source={require('../resources/icon/checkingIn.png')}
                style={{marginRight: 16}}
              />

              <View>
                <Text style={styles.feelingTitle}>
                  How are you feeling today?
                </Text>
                <Text style={styles.feelingText}>Let us know here now</Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <Image
              source={require('../resources/icon/tour_diary.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Food Diary</Text>
              <Text style={styles.text}>Record your daily intake of foods</Text>
            </View>
          </View>

          {this.state.step === 1 ? (
            <View style={[styles.container, {marginTop: 16}]} />
          ) : (
            <View style={[styles.container, {marginTop: 16}]}>
              <Image
                source={require('../resources/icon/tour_food.png')}
                style={{
                  borderRadius: 4,
                  width: width - 40,
                  height: 81, //75,
                  position: 'absolute',
                }}
                resizeMode="cover"
              />
              <View style={{alignSelf: 'center', width: width - 80}}>
                <Text style={styles.title}>Food</Text>
                <Text style={styles.text}>
                  Choose, eat and enjoy the right foods for you
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_recipes.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Recipes</Text>
              <Text style={styles.text}>Find the right recipe for you</Text>
            </View>
          </View>

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_track.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Detox Recipes</Text>
              <Text style={styles.text}>
                Cleanse, Rebuild & Supercharge Your Unique Body & Mind
              </Text>
            </View>
          </View>

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_mealplan.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Meal Plan</Text>
              <Text style={styles.text}>
                Plan your week with the right meals
              </Text>
            </View>
          </View>

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_basket.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Shopping Basket</Text>
              <Text style={styles.text}>
                A simple way to assist you at the grocery store
              </Text>
            </View>
          </View>

          {this.state.step === 2 ? (
            <View style={[styles.container, {marginTop: 16}]} />
          ) : (
            <View style={[styles.container, {marginTop: 16}]}>
              <Image
                source={require('../resources/icon/tour_fitness.png')}
                style={{
                  borderRadius: 4,
                  width: width - 40,
                  height: 81, //75,
                  position: 'absolute',
                }}
                resizeMode="cover"
              />
              <View style={{alignSelf: 'center', width: width - 80}}>
                <Text style={styles.title}>Fitness</Text>
                <Text style={styles.text}>
                  Strengthen, tone and play your way to fitness
                </Text>
              </View>
            </View>
          )}

          {this.state.step === 3 ? (
            <View style={[styles.container, {marginTop: 16}]} />
          ) : (
            <View style={[styles.container, {marginTop: 16}]}>
              <Image
                source={require('../resources/icon/tour_lifestyle.png')}
                style={{
                  borderRadius: 4,
                  width: width - 40,
                  height: 81, //75,
                  position: 'absolute',
                }}
                resizeMode="cover"
              />
              <View style={{alignSelf: 'center', width: width - 80}}>
                <Text style={styles.title}>Lifestyle</Text>
                <Text style={styles.text}>
                  Make your lifestyle choices work for you
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_mind.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Mind</Text>
              <Text style={styles.text}>
                Know, plan and balance your brain and mind
              </Text>
            </View>
          </View>

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_place.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Place</Text>
              <Text style={styles.text}>
                Live, vacation and place yourself for happiness
              </Text>
            </View>
          </View>

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_social.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Social</Text>
              <Text style={styles.text}>
                Find, connect and love your relationships
              </Text>
            </View>
          </View>

          <View style={[styles.container, {marginTop: 16}]}>
            <Image
              source={require('../resources/icon/tour_genius.png')}
              style={{
                borderRadius: 4,
                width: width - 40,
                height: 81, //75,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', width: width - 80}}>
              <Text style={styles.title}>Genius</Text>
              <Text style={styles.text}>
                Discover and work with your natural talents
              </Text>
            </View>
          </View>

          {this.state.step === 4 ? (
            <View style={[styles.container, {marginTop: 16}]} />
          ) : (
            <View style={[styles.container, {marginTop: 16}]}>
              <Image
                source={require('../resources/icon/tour_coaching.png')}
                style={{
                  borderRadius: 4,
                  width: width - 40,
                  height: 81, //75,
                  position: 'absolute',
                }}
                resizeMode="cover"
              />
              <View style={{alignSelf: 'center', width: width - 80}}>
                <Text style={styles.title}>Coaching</Text>
                <Text style={styles.text}>
                  Get precisely the support you need
                </Text>
              </View>
            </View>
          )}

          {this.state.step === 5 ? (
            <View style={[styles.container, {marginTop: 16}]} />
          ) : (
            <View style={[styles.container, {marginTop: 16, marginBottom: 40}]}>
              <Image
                source={require('../resources/icon/tour_resources.png')}
                style={{
                  borderRadius: 4,
                  width: width - 40,
                  height: 81, //75,
                  position: 'absolute',
                }}
                resizeMode="cover"
              />
              <View style={{alignSelf: 'center', width: width - 80}}>
                <Text style={styles.title}>Resources</Text>
                <Text style={styles.text}>
                  Resources to help you understand your unique body
                </Text>
              </View>
            </View>
          )}

          {/*<BlurOverlay
            radius={0}
            downsampling={0}
            brightness={0}
            // blurStyle={"regular"}
            blurAmount={1}
            onPress={() => {
              closeOverlay();
            }}
            customStyles={{ alignItems: "center", justifyContent: "center" }}
            blurStyle="light"
            children={this.renderBlurChilds()}
          /> */}

          {!this.state.isInitial ? (
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
              }}
              blurType="light"
              blurAmount={5}
              reducedTransparencyFallbackColor="white"
            />
          ) : null}

          {this.state.step !== 6 && this.state.step !== 7 && (
            <View
              style={[
                styles.container,
                {position: 'absolute', top: marginTop},
              ]}>
              <Image
                source={image}
                style={{
                  borderRadius: 4,
                  width: width - 40,
                  height: 81, //75,
                  position: 'absolute',
                }}
                resizeMode="cover"
              />
              <View style={{alignSelf: 'center', width: width - 80}}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.text}>{text}</Text>
              </View>
            </View>
          )}

          <Dialog
            visible={this.state.isDialogVisible}
            containerStyle={
              {
                // marginTop: marginTopDialog,
              }
            }
            // onTouchOutside={() => {
            //   console.log("onTouchOutside");
            //   this.setState({ isDialogVisible: false });
            // }}
            // onDismiss={() => {
            //   this.setState({ isDialogVisible: false });
            // }}
            dialogAnimation={fadeAnimation}
            hasOverlay={false}
            dialogStyle={{
              width: width - 55,
              height: 308,
              overflow: 'visible',
              // alignSelf: "center",
              borderRadius: 4,
              backgroundColor: 'transparent',
              position: 'absolute',
              top: top,
              left: left === null ? 20 : left,
            }}>
            <DialogContent
              style={{position: 'absolute', top: 0, alignSelf: 'center'}}>
              <View>
                {(this.state.step === 6 || this.state.step === 7) && (
                  <Animatable.View
                    animation="fadeIn"
                    delay={10}
                    duration={200}
                    style={{
                      position: 'absolute',
                      left: this.state.step === 6 ? -25 : 20,
                      top: -23,
                      transform: [{rotate: '180deg'}],
                    }}>
                    <Svg height="30" width="75">
                      <Path
                        d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                        fill="white"
                        scale="0.05"
                      />
                    </Svg>
                  </Animatable.View>
                )}
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: width - 55,
                      height: 300,
                      y: 16,
                      border: 32,
                      radius: 4,
                      opacity: 0.06,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      width: width - 55,
                      height: 300,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Image
                      source={this.state.shaeImage}
                      style={{marginTop: 30, alignSelf: 'center'}}
                    />

                    <Text style={styles.dialogText}>
                      {this.state.dialogText}
                    </Text>

                    <TouchableWithoutFeedback onPress={this.onNextStep}>
                      <View style={styles.dialogButton}>
                        <Text style={styles.dialogButtonText}>Next Step</Text>
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
                      onPress={this.onSkipPress}>
                      <View style={{alignSelf: 'center', marginTop: 16}}>
                        <Text style={styles.skipText}>Skip</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </BoxShadow>

                {this.state.step !== 6 && this.state.step !== 7 && (
                  <Animatable.View
                    animation="fadeIn"
                    delay={10}
                    duration={200}
                    style={{marginTop: -8, marginLeft: 25}}>
                    <Svg height="30" width="75">
                      <Path
                        d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                        fill="white"
                        scale="0.05"
                      />
                    </Svg>
                  </Animatable.View>
                )}
              </View>
            </DialogContent>
          </Dialog>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 81, //75,
    alignSelf: 'center',
    borderRadius: 4,
    justifyContent: 'center',
  },
  title: {
    // fontFamily: "sans-serif",
    fontWeight: '400',
    fontSize: 24,
    color: 'rgb(255,255,255)',
  },
  text: {
    // fontFamily: "sans-serif",
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(255,255,255)',
    marginTop: 4,
  },
  name: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    marginTop: 24,
    marginHorizontal: 20,
  },
  feelingTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 15,
    fontWeight: '600',
    color: 'rgb(16,16,16)',
    marginTop: 1,
  },
  feelingText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgb(141,147,151)',
    marginTop: 2,
  },
  dialogText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    color: '#333333',
    marginTop: 20,
    width: width - 86,
    alignSelf: 'center',
    textAlign: 'center',
  },
  dialogButton: {
    width: 140,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00a8eb',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dialogButtonText: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  skipText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: '#00a8eb',
  },
});

export default Tour;

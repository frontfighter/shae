import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  InteractionManager,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import Slider from './hraSlider'; //'react-native-slider';
import * as Animatable from 'react-native-animatable';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import Video from 'react-native-video';
// import PopupDialog, { ScaleAnimation } from "react-native-popup-dialog";

import HraScale from './hraScale';
import AccountCard from './AccountCard';
import CardHOC from './CardHOC';

const CardWithShadow = CardHOC(AccountCard);

const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  // return size / 812 * height;
  return size;
};

const getWidth = (size) => {
  return (size / 375) * width;
  // return size;
};

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: 'bottom', // optional
  useNativeDriver: true, // optional
});

class FlatListItem extends React.PureComponent {
  render() {
    return <HraScale />;
  }
}

export default class MeasurementCardNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: this.props.value,
      value:
        this.props.title === 'BFI'
          ? this.props.value
          : Number(this.props.value).toFixed(1),
      newValue:
        this.props.title === 'BFI' &&
        (this.props.value === '' || isNaN(this.props.value))
          ? 1.0
          : Number(this.props.value).toFixed(1),
      data: [],
      unit: null,

      elementsArray: [],
      page: 1,
      totalPages: -1,
      refreshing: false,
      isLoading: true,
      isModalVisible: false,
      isHelpModalVisible: false,

      videoUrl: '',
      isPaused: true,
      isVideoLoaded: false,
    };

    this.elementsArray = null;

    this.units = [];
    this.value = null;

    this.helpImageUrl = '';
    this.helpVideoUrl = '';
    this.helpText = '';

    // this._interval;
  }

  UNSAFE_componentWillMount() {
    // const array = [];
    // for (let i = 0; i < this.props.maxValue + 4; i++) {
    //   array.push(i);
    // }
    //
    let unit;

    if (this.props.unit === '') {
      unit = '';
    } else {
      const splittedUnits = this.props.unit.split(',');

      unit =
        this.props.userUnit === 'metric' ? splittedUnits[1] : splittedUnits[0];
    }
    this.setState({unit});
  }

  componentDidMount() {
    // if (Platform.OS === 'android') {
    //   this._interval = setInterval(() => {
    //     if (this.flatList !== null) {
    //       clearInterval(this._interval);
    //       this.flatList.scrollToOffset({offset: (this.props.title !== 'BFI') ? (this.state.initialValue) * 120 + 72 : (this.state.initialValue <= 1 || this.state.initialValue === 'N/A' || isNaN(this.state.initialValue)) ? 72 : (this.state.initialValue) * 120 + 72, animated: false});
    //     }
    //   }, 100);
    //
    //   this.props.onChange(this.props.index, 1, this.props.id);
    // } else {
    //   setTimeout(() => {
    //     if (this.flatList !== null) {
    //       console.log('this.state.initialValue', this.state.initialValue, this.props.title)
    //       this.flatList.scrollToOffset({offset: (this.props.title !== 'BFI') ? (this.state.initialValue) * 120 + 72 : (this.state.initialValue <= 1 || this.state.initialValue === 'N/A' || isNaN(this.state.initialValue)) ? 72 : (this.state.initialValue) * 120 + 72, animated: false})
    //     }
    //
    //   }, 350);
    //   this.props.onChange(this.props.index, 1, this.props.id);
    // }
    // this.props.onChange(this.props.index, 1, this.props.id);
    console.log('this.props.title', this.props.title);

    switch (this.props.title) {
      case 'Weight':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/weightF.jpg?1.8.3.r10&';
        this.helpVideoUrl = '';
        this.helpText =
          'Measure your weight on an even surface, preferably in the morning, without clothing, before eating and after using the bathroom.';
        break;
      case 'Height':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/heightF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/HeightMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Measure your height without shoes from the bottom of your feet to the top of your head. Be sure to keep your back and neck straight. You can also mark the top of your head lightly with a pencil while you lean your back against a wall, and then measure the distance from the floor to the pencil mark.';
        break;

      case 'Forehead':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/frontalF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/ForeheadMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Keeping your head held high and looking forward, measure the circumference of your cranium along the line of your eyebrows, above your ears and around the largest part of your head. Try to keep your hair out of the way or keep the tape measure tight to minimize the inclusion of your hair in the measurement.';
        break;
      case 'Jaw ':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Mento_D.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/JawMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Open your mouth slightly to feel the indent created at the top of your jaw bone (near your ear canal). With your mouth closed, measure from this point to the tip of your chin by following the jaw bone. Only measure to the tip of the chin; not all the way around your jaw. Make sure your head and neck are held straight and high and that your jaw is neither clenched nor held open.';
        break;
      case 'Neck':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/neckF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/NeckMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Measure the circumference of your neck at the smallest point. This is usually right in the middle of your neck. For men, this will be under the Adam’s apple. Make sure your back and neck are straight. Keep the tape measure snug against your skin, but don’t pull so tightly that your throat is constricted.';
        break;

      case 'Chest':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/sternumF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/ChestMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In a standing position with your back straight and your head held high, wrap the tape measure around the upper part of your chest directly under your armpits. This will be above the pectoral muscles or breasts. Make sure the tape measure is horizontal and straight, adherent yet not pulled tight. Take the measurement at half exhalation.';
        break;

      case 'Ribcage':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/xifoidF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/RibsMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In a standing position with your back straight and your head held high, wrap the tape measure around your rib cage directly under your pectoral muscles or breasts. Make sure the tape measure is horizontal and straight, and adherent yet not pulled tight. Take the measurement at half exhalation.';
        break;

      case 'Waist':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/waistF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/WaistMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In a standing position, measure the circumference of your waist at its smallest point. This is usually right under where the last rib bone can be felt. Keep your back straight and take the measurement at half exhalation. Make sure the tape measure is horizontal and straight, and adherent yet not pulled tight.';
        break;

      case 'Gluteus':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/gluteusF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/GlutesMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In a standing position, looking forward with your back straight, measure the circumference of your gluteus at the widest point. Make sure the tape measure is horizontal and straight, and adherent yet not pulled tight.';
        break;

      case 'Elbow':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Gomito_D.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/ElbowMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Wrap the tape measure around your elbow at the fold line. Hold your arm out straight and measure the circumference of your elbow. Make sure the tape measure is adherent to the skin but not pulled so tight that it squeezes your arm.';
        break;
      case 'Wrist':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Polso_D.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/WristMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Measure the circumference of the wrist of your non-dominant hand. This is the hand that you don’t normally use for writing. Take the measurement directly below the wrist bone, where you would wear a wrist watch. Keep your hand relaxed, ensuring that the tape measure is adherent to the skin but not pulled so tight that it squeezes your wrist.';
        break;
      case 'Hand Length':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Lunghezzamano_D.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/HandLengthMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Measure the length of your non-dominant hand. This is the hand that you don’t normally use for writing. Take the measurement from the crease of your palm to the tip of your middle finger. Keep your palm facing up with your fingers held together but not tensed.';
        break;
      case 'Palm':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Lunghezza-palmo.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/PalmMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'Measure the length of the palm of your non-dominant hand. This is the hand that you don’t normally use for writing. Take the measurement from the crease of your palm to the bottom crease of your middle finger. Keep your palm facing up with your fingers held together but not tensed.';
        break;

      case 'Mid-Thigh ':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Coscia_D_2.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/MidThighMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'This measurement can be taken either standing or sitting. First, measure the length of your thigh to find the mid-way point half way down your thigh. Then, measure the circumference of your thigh placing the tape measure on the mid-way point. Make sure the tape measure is horizontal and straight, and adherent yet not pulled tight.';
        break;
      case 'Knee':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/kneeF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/KneeMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In a standing position with your feet flat on the floor and your weight evenly distributed on both feet, measure the circumference of your knee at the center of the patella on the front of the knee and along the crease in the back. Make sure the tape measure is horizontal and straight, and adherent yet not pulled tight.';
        break;
      case 'Calf':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/calfF.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/CalfMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'This measurement can be taken either standing or sitting. Measure the circumference of your calf at the center of your calf where the muscle is the largest. Make sure the tape measure is horizontal and straight, and adherent yet not pulled tight.';
        break;
      case 'Ankle':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Caviglia_D.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/AnkleMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In either a standing or a sitting position, with your feet flat on the ground and your weight evenly balanced on both feet, measure the circumference of your ankle directly above the ankle bone. Make sure that the tape measure is adherent to the skin but not pulled tight.';
        break;
      case 'Foot Length':
        this.helpImageUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/app/Piede_D.jpg?1.8.3.r10&';
        this.helpVideoUrl =
          'https://d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/FootLengthMeasurementVO2.mp4?1.8.3.r10&?f=v2';
        this.helpText =
          'In a seated position, with your feet flat on the ground and your weight evenly balanced on both feet, measure the length of your foot from your heel to the tip of your longest toe. It could be useful to press your heel against a wall or other hard, flat surface for accuracy.';
        break;
      default:
    }

    this.setState({videoUrl: this.helpVideoUrl});
  }

  onBuffer = (onBuffer) => {
    console.log('onBuffer,', onBuffer);
  };

  videoError = (error) => {
    console.log('onError,', error);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isModalOpened === nextProps.isModalOpened) {
      if (nextProps.value !== this.state.initialValue) {
        this.setState({
          initialValue: nextProps.value,
          value: nextProps.value,
        });
      }
      if (nextProps.value !== this.state.value) {
        this.setState({value: nextProps.value});
      }
    }
  }

  componentWillUnmount() {
    // clearInterval(this._interval);
  }

  // handleScroll = (event) => {
  //   try {
  //     if (this.props.title !== 'BFI') {
  //       if ((Platform.OS === 'android' || Platform.OS === 'ios') && Number(((event.nativeEvent.contentOffset.x - 72) / 120).toFixed(1)) < this.props.minValue) {
  //         this.flatList.scrollToOffset({offset: this.props.minValue * 120 + 72, animated: false})
  //       } else if ((Platform.OS === 'android' || Platform.OS === 'ios') && Number(((event.nativeEvent.contentOffset.x - 72) / 120).toFixed(1)) > this.props.maxValue) {
  //         this.flatList.scrollToOffset({offset: this.props.maxValue * 120 + 72, animated: false})
  //         this.setState({value: Number(this.props.maxValue + 72 / 120).toFixed(1)}, () => this.props.onChange(this.props.index, this.props.value, this.props.id));
  //       } else {
  //         this.setState({value: Number(((event.nativeEvent.contentOffset.x - 72) / 120).toFixed(1))}, () => this.props.onChange(this.props.index, this.state.value, this.props.id)); // + this.props.minValue
  //       }
  //     } else {
  //       console.log('BFI value', this.state.value, event.nativeEvent.contentOffset.x);
  //       if (this.state.value <= 1) {
  //         this.setState({value: 'N/A'});
  //         if ((Platform.OS === 'android' || Platform.OS === 'ios') && Number(((event.nativeEvent.contentOffset.x - 72) / 120).toFixed(1)) < this.props.minValue) {
  //           this.flatList.scrollToOffset({offset: 78 + 72 + 36, animated: false});
  //         }
  //         this.props.onChange(this.props.index, 1, this.props.id);
  //       } else {
  //         this.setState({value: Number(((event.nativeEvent.contentOffset.x - 72) / 120).toFixed(1))}, () => this.props.onChange(this.props.index, this.state.value, this.props.id));
  //       }
  //     }
  //   } catch (err) {
  //     this.setState(() => { throw err; })
  //   }
  // }

  _renderItem = ({index}) => {
    return <FlatListItem index={index} />;
  };

  animatedDismissModal = () => {
    try {
      this.setState({
        newValue:
          this.props.title === 'BFI' &&
          (this.state.value === '' || isNaN(this.state.value))
            ? 1.0
            : Number(this.state.value).toFixed(1),
      });
      this.popup.slideOutUp(350).then(() => this.dismissModal());
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  dismissModal = () => {
    try {
      this.popupDialog.dismiss();
      this.setState({isModalVisible: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onChangeValue = (value) => {
    console.log('onChangeValue', value);
    this.setState({newValue: value});
    // this.props.onChange(this.props.index, Number(value).toFixed(1), this.props.id);
  };

  onAddPress = () => {
    if (this.state.newValue < this.props.maxValue) {
      this.setState({
        newValue: (Number(this.state.newValue) + 0.1).toFixed(1),
      });
    } else {
      this.setState({newValue: Number(this.props.maxValue).toFixed(1)});
    }
  };

  onSubPress = () => {
    if (this.state.newValue > this.props.minValue) {
      this.setState({
        newValue: (Number(this.state.newValue) - 0.1).toFixed(1),
      });
    } else {
      this.setState({newValue: Number(this.props.minValue).toFixed(1)});
    }
  };

  onSubmitPress = () => {
    let value = this.state.newValue;

    if (this.state.newValue > this.props.maxValue) {
      value = this.props.maxValue;
    }

    if (this.state.newValue < this.props.minValue) {
      value = this.props.minValue;
    }

    this.setState({value: value}, () => {
      // this.animatedDismissModal();
      this.setState({isModalVisible: false});
      this.props.onChange(
        this.props.index,
        Number(value).toFixed(1),
        this.props.id,
      );
      this.props.setAnswers();
    });
  };

  onBlur = () => {
    let value = this.state.newValue;

    if (this.state.newValue > this.props.maxValue) {
      value = this.props.maxValue;
    }

    if (this.state.newValue < this.props.minValue) {
      value = this.props.minValue;
    }

    this.setState({newValue: Number(value).toFixed(1)});
  };

  onNeedHelpPress = () => {
    this.setState({isModalVisible: false}, () => {
      this.setState({isHelpModalVisible: true});
    });
  };

  onGotItPress = () => {
    this.setState({isHelpModalVisible: false}, () => {
      this.setState({isModalVisible: true});
    });
  };

  render() {
    console.log('value', this.state.value);

    const paddingValue =
      this.state.initialValue === 'N/A' || isNaN(this.state.initialValue)
        ? 0
        : this.state.initialValue;
    console.log('paddingValue', paddingValue);

    const modalTitle =
      this.props.title === 'BFI'
        ? this.props.title
        : `${this.props.title} (${this.state.unit})`;

    let ratio = width / 375;

    // forehead
    // d3ekbpzfcsh9dp.cloudfront.net/images/video/measurement/ForeheadMeasurementVO2.mp4?1.8.3.r10&?f=v2

    return (
      <View>
        <View
          style={[
            styles.container,
            {marginTop: this.props.index === 0 ? 24 : 16},
          ]}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState(
                {
                  isModalVisible: true,
                  newValue: Number(this.state.newValue).toFixed(1),
                },
                // () => this.popupDialog.show()
              );
            }}>
            <Animatable.View
              animation="fadeIn"
              delay={700}
              duration={500}
              style={[
                styles.container,
                {marginTop: 0, shadowOpacity: 0, borderWidth: 0},
              ]}>
              <View
                style={{
                  marginTop: getHeight(24),
                  marginLeft: getWidth(24),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.title}>{this.props.title}</Text>

                {this.props.title === 'BFI' && (
                  <TouchableWithoutFeedback
                    onPress={this.props.openModal}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Image
                      source={require('../resources/icon/informationIconCopy.png')}
                      style={{marginLeft: 15}}
                    />
                  </TouchableWithoutFeedback>
                )}

                <View
                  style={{
                    position: 'absolute',
                    right: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.text}>
                    {this.props.title === 'BFI' &&
                    (this.state.value <= 1 ||
                      this.state.value === 'N/A' ||
                      isNaN(this.state.value))
                      ? 'N/A'
                      : Number(this.state.value).toFixed(1) +
                        ' ' +
                        this.state.unit}
                  </Text>
                  <Image
                    source={require('../resources/icon/arrowRight.png')}
                    style={styles.arrow}
                  />
                </View>
              </View>
            </Animatable.View>
          </TouchableWithoutFeedback>
        </View>

        <Dialog
          visible={this.state.isModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onHardwareBackPress={() => {
            this.setState({isModalVisible: false});
            return true;
          }}>
          <DialogContent>
            <Animatable.View ref={(popup) => (this.popup = popup)}>
              <View style={styles.modal}>
                <View style={styles.card}>
                  <View style={{overflow: 'hidden', borderRadius: 4}}>
                    <View
                      style={{
                        width: width,
                        marginTop: 0,
                        alignSelf: 'center',
                        backgroundColor: 'rgb(255,255,255)',
                      }}>
                      <Text style={styles.modalTitle}>{modalTitle}</Text>
                      <View
                        style={{
                          alignSelf: 'center',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 28,
                          width: width - 125,
                          justifyContent: 'space-between',
                        }}>
                        <TouchableWithoutFeedback onPress={this.onSubPress}>
                          <Image
                            source={require('../resources/icon/measurement_sub_icon.png')}
                            style={{width: 33, height: 33}}
                          />
                        </TouchableWithoutFeedback>
                        <View style={styles.textInputContainer}>
                          <TextInput
                            ref={(textInput) => {
                              this.textInput = textInput;
                            }}
                            style={styles.titleTextStyle}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            keyboardType="numeric"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={true}
                            textAlign="center"
                            onChangeText={(value) => this.onChangeValue(value)}
                            value={this.state.newValue.toString()}
                            onBlur={this.onBlur}
                          />
                        </View>
                        <TouchableWithoutFeedback onPress={this.onAddPress}>
                          <Image
                            source={require('../resources/icon/measurement_add_icon.png')}
                            style={{width: 33, height: 33}}
                          />
                        </TouchableWithoutFeedback>
                      </View>

                      <View
                        style={{
                          marginTop: 28,
                          marginBottom: this.props.title !== 'BFI' ? 0 : 40,
                        }}>
                        <TouchableWithoutFeedback onPress={this.onSubmitPress}>
                          <View style={[styles.modalButton]}>
                            <Text style={styles.modalButtonText}>Done</Text>
                          </View>
                        </TouchableWithoutFeedback>

                        {this.props.title !== 'BFI' && (
                          <Text
                            onPress={this.onNeedHelpPress}
                            style={styles.needHelpText}>
                            Need Help?
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Animatable.View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isHelpModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isHelpModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isHelpModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onHardwareBackPress={() => {
            this.setState({isHelpModalVisible: false});
            return true;
          }}>
          <DialogContent>
            <Animatable.View ref={(popup) => (this.popup = popup)}>
              <View style={styles.modal}>
                <View style={styles.card}>
                  <View style={{overflow: 'hidden', borderRadius: 4}}>
                    <View
                      style={{
                        width: width,
                        marginTop: 0,
                        alignSelf: 'center',
                        backgroundColor: 'rgb(255,255,255)',
                      }}>
                      <Text style={styles.modalTitle}>{this.props.title}</Text>

                      <View
                        style={{
                          width: width - 115,
                          alignSelf: 'center',
                          marginTop: 20,
                          flexDirection: 'row',
                          justifyContent:
                            this.helpVideoUrl === ''
                              ? 'center'
                              : 'space-between',
                        }}>
                        <View
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: 4,
                            backgroundColor: 'black',
                          }}>
                          <Image
                            source={{uri: this.helpImageUrl}}
                            style={{width: 120, height: 120, borderRadius: 4}}
                            resizeMode="stretch"
                          />
                        </View>

                        {this.helpVideoUrl !== '' && (
                          <View
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: 4,
                              backgroundColor: 'black',
                            }}>
                            {this.state.videoUrl !== '' ? (
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  this.setState({
                                    isPaused: !this.state.isPaused,
                                  })
                                }>
                                <Video
                                  source={{
                                    uri: this.state.videoUrl,
                                    type: 'mp4',
                                  }} // Can be a URL or a local file.
                                  ref={(ref) => {
                                    this.player = ref;
                                  }}
                                  onBuffer={this.onBuffer}
                                  onError={this.videoError}
                                  resizeMode="cover"
                                  style={[styles.videoContainer, {height: 120}]}
                                  paused={this.state.isPaused}
                                  onLoad={() => {
                                    console.log('onLoad');
                                    this.setState({isVideoLoaded: true});
                                  }}
                                  onEnd={() =>
                                    this.setState(
                                      {isPaused: true},
                                      () => this.player && this.player.seek(0),
                                    )
                                  }
                                />
                              </TouchableWithoutFeedback>
                            ) : (
                              <View
                                style={[styles.videoContainer, {height: 120}]}
                              />
                            )}

                            {this.state.isPaused && (
                              <TouchableWithoutFeedback
                                onPress={() =>
                                  this.setState({
                                    isPaused: !this.state.isPaused,
                                  })
                                }>
                                <Image
                                  source={require('../resources/icon/play.png')}
                                  style={{
                                    position: 'absolute',
                                    top: 32,
                                    alignSelf: 'center',
                                    width: 56,
                                    height: 56,
                                  }}
                                />
                              </TouchableWithoutFeedback>
                            )}
                          </View>
                        )}
                      </View>

                      <Text style={styles.helpModalText}>{this.helpText}</Text>

                      <View
                        style={{
                          marginTop: 20,
                          marginBottom: 30,
                        }}>
                        <TouchableWithoutFeedback onPress={this.onGotItPress}>
                          <View
                            style={[
                              styles.modalButton,
                              {height: 40, width: width - 115},
                            ]}>
                            <Text style={styles.modalButtonText}>
                              Okay, Got it
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Animatable.View>
          </DialogContent>
        </Dialog>

        {/*<Modal transparent={true} visible={this.state.isModalVisible}>
          <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            dialogAnimation={scaleAnimation}
            width={width - 55}
            height={height}
            dismissOnTouchOutside={false}
            dialogStyle={{overflow: 'visible', borderRadius: 10, backgroundColor: 'transparent'}}
          >
            <Animatable.View ref={popup => this.popup = popup}>
              <View style={styles.modal}>

                <View style={styles.card}>
                  <View style={{overflow: 'hidden', borderRadius: 10}}>
                    <View style={{width: width, marginTop: 0, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)'}}>
                      <Text style={styles.modalTitle}>{modalTitle}</Text>
                      <View style={{alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 27, width: width - 125, justifyContent: 'space-between'}}>
                        <TouchableWithoutFeedback onPress={this.onSubPress}>
                          <Image
                            source={require('../../assets/images/measurement_sub_icon.png')}
                            style={{width: 33, height: 33}}
                          />
                        </TouchableWithoutFeedback>
                        <View style={styles.textInputContainer}>
                          <TextInput
                            ref={(textInput) => { this.textInput = textInput }}
                            style={styles.titleTextStyle}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            keyboardType='numeric'
                            autoCapitalize='none'
                            autoCorrect={false}
                            editable={true}
                            textAlign='center'
                            onChangeText={(value) => this.onChangeValue(value)}
                            value={this.state.newValue.toString()}
                            onBlur={this.onBlur}
                          />
                        </View>
                        <TouchableWithoutFeedback onPress={this.onAddPress}>
                          <Image
                            source={require('../../assets/images/measurement_add_icon.png')}
                            style={{width: 33, height: 33}}
                          />
                        </TouchableWithoutFeedback>
                      </View>

                      <CardWithShadow
                        shadowOpt={{
                          width: width - 125,
                          height: 48,
                          color: '#00A4E4',
                          border: 20,
                          radius: 10,
                          opacity: 0.1, //0.12,
                          x: 0,
                          y: 10,
                          style: {marginTop: 28, marginBottom: 40, height: 48, width: width - 125, alignSelf: 'center'}
                        }}
                        styles={[styles.button, {height: 48, width: width - 125, marginTop: (Platform.OS === 'ios') ? 28 : 0, marginBottom: (Platform.OS === 'ios') ? 40 : 0}]}
                      >
                        <TouchableWithoutFeedback onPress={this.onSubmitPress}>
                          <View style={[styles.modalButton]}>
                            <Text style={styles.modalButtonText}>Submit</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      </CardWithShadow>
                    </View>
                  </View>
                </View>

                <CardWithShadow
                  shadowOpt={{
                    width: 48,
                    height: 48,
                    color: '#000000',
                    border: 18,
                    radius: 24,
                    opacity: 0.1,
                    x: 0,
                    y: 6,
                    style: {marginTop: 30, width: 48, height: 48, borderRadius: 24, alignSelf: 'center'}
                  }}
                  styles={[styles.cardRound, {marginTop: (Platform.OS === 'ios') ? 30 : 0}]}
                >
                  <TouchableWithoutFeedback onPress={this.animatedDismissModal}>
                    <View style={{marginTop: 0, width: 48, height: 48, borderRadius: 24, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(255,255,255)', shadowOpacity: 0}}>
                      <Image
                        source={require('../../assets/images/close_icon.png')}
                        style={{width: 16, height: 16}}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </CardWithShadow>

              </View>
            </Animatable.View>
          </PopupDialog>
        </Modal> */}
      </View>
    );

    // return (
    //   <CardWithShadow
    //     shadowOpt={{
    //       width: width - 40,
    //       height: 115,
    //       color: '#273849',
    //       border: 25,
    //       radius: 10,
    //       opacity: 0.06, //0.12,
    //       x: 0,
    //       y: 12,
    //       style: {height: 115, width: width - 40, marginTop: (this.props.index === 0) ? 30 : 16, alignSelf: 'center'}
    //     }}
    //     styles={[styles.container, {height: 115, width: width - 40, marginTop: (Platform.OS === 'android') ? 0 : (this.props.index === 0) ? 30 : 16}]}
    //   >
    //   <Animatable.View animation='fadeIn' delay={700} duration={500} style={[styles.container, {marginTop: 0, shadowOpacity: 0}]}>
    //
    //   <View style={{marginTop: getHeight(24), marginLeft: getWidth(24), flexDirection: 'row'}}>
    //     <Text style={styles.title}>{this.props.title}</Text>
    //     <Text style={styles.text}>{(this.props.title === 'BFI' && (this.state.value <= 1 || this.state.value === 'N/A' || isNaN(this.state.value))) ? 'N/A' : Number(this.state.value).toFixed(1) + ' ' + this.state.unit}</Text>
    //   </View>
    //
    //     {this.state.elementsArray.length !== 0 &&
    //       <FlatList
    //         ref={ref => this.flatList = ref}
    //         data={this.state.elementsArray}
    //         keyExtractor={(index) => index.toString()}
    //         renderItem={this._renderItem}
    //         onScroll={this.handleScroll}
    //         scrollEventThrottle={16}
    //         horizontal={true}
    //         style={{position: 'absolute', top: 0, height: 115}}
    //         showsHorizontalScrollIndicator={false}
    //
    //         contentContainerStyle={(Platform.OS === 'android' || Platform.OS === 'ios') ? {paddingRight: (this.props.title !== 'BFI') ? paddingValue * 120 - 72 : paddingValue * 120 - 72} : 0}
    //         // contentOffset={(Platform.OS === 'ios') ? {x: (this.props.title !== 'BFI') ? (this.state.initialValue) * 120 + 72 : 72, y: 0} : null}
    //         // contentInset={(Platform.OS === 'ios') ? {top: 0, left: (this.props.title !== 'BFI') ? -72 -this.props.minValue * 120 : -72, bottom: 0, right: -72 } : null}
    //         bounces={false}
    //         removeClippedSubviews={true}
    //         initialNumToRender={5}
    //         maxToRenderPerBatch={1}
    //       />
    //     }
    //
    //     {(this.props.title === 'BFI') && (
    //       <TouchableWithoutFeedback onPress={this.props.openModal}>
    //         <View style={{position: 'absolute', right: 24, top: 24}}>
    //           <InfoIcon width={22} height={22} />
    //         </View>
    //       </TouchableWithoutFeedback>
    //     )}
    //
    //     <View style={{width: 3, height: 24, backgroundColor: 'rgb(0,187,116)', alignSelf: 'center', position: 'absolute', top: 73}}/>
    //   </Animatable.View>
    //   </CardWithShadow>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 72,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
    overflow: 'hidden',
  },
  textInputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(239,243,249)',
    width: 120,
    height: 48,
    borderRadius: 10,
    alignSelf: 'center',
  },
  titleTextStyle: {
    fontFamily: 'SFProText-Light',
    fontWeight: '300',
    fontSize: 28,
    letterSpacing: -0.3,
    color: 'rgb(16,16,16)',
    width: 100,
    height: 48,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 0,
  },
  title: {
    color: 'rgb(31,33,35)',
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 17,
    letterSpacing: -0.3,
  },
  text: {
    color: 'rgb(141,147,151)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: -0.3,
    // marginLeft: getWidth(16)
  },
  bmiText: {
    color: 'rgb(148,155,162)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    letterSpacing: -0.3,
    marginTop: getHeight(2),
    marginLeft: getWidth(24),
  },
  scaleUnit: {
    height: getHeight(12),
    width: getWidth(1),
    marginLeft: getWidth(11),
    backgroundColor: 'rgb(223,230,235)',
  },
  scaleNumber: {
    color: 'rgb(182,189,195)',
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: -0.3,
  },
  arrow: {
    width: 8,
    height: 13,
    tintColor: 'rgb(186,195,208)',
    marginLeft: 20,
  },
  modal: {
    width: width,
    height: height,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width - 55,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
    // shadowOpacity: 0.2,
    // shadowRadius: 32,
    // shadowColor: "rgb(0,0,0)",
    // shadowOffset: { height: 16, width: 0 },
  },
  cardRound: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 24,
    // shadowOpacity: 0.2,
    // shadowRadius: 18,
    // shadowColor: "rgb(0,0,0)",
    // shadowOffset: { height: 6, width: 0 },
  },
  modalTitle: {
    color: 'rgb(16,16,16)',
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.3,
    alignSelf: 'center',
    marginTop: 32,
  },
  modalButton: {
    width: width - 125,
    height: 36,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    // shadowOpacity: 0.2,
    // shadowRadius: 20,
    // shadowColor: "rgb(0,164,228)",
    // shadowOffset: { height: 10, width: 0 },
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 15,
    fontWeight: '600',
    color: 'rgb(255,255,255)',
  },
  needHelpText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(0,168,235)',
    letterSpacing: -0.1,
    lineHeight: 18,
    marginTop: 16,
    marginBottom: 30,
    alignSelf: 'center',
  },
  helpModalText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgb(54,58,61)',
    letterSpacing: -0.3,
    lineHeight: 24,
    marginTop: 20,
    alignSelf: 'center',
    width: width - 115,
  },
  videoContainer: {
    width: 120,
    height: 120,
    // alignSelf: "center",
    borderRadius: 4,
    // marginTop: 24,
    backgroundColor: 'black',
  },
});

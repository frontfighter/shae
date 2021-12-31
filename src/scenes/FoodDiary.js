import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  FlatList,
  Modal as AdditionalModal,
  Platform,
  StatusBar,
  Animated,
  Linking,
  AppState,
  RefreshControl,
  Alert
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import {BoxShadow} from 'react-native-shadow';
import Modal from 'react-native-modalbox';
import PropTypes from 'prop-types';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import * as Animatable from 'react-native-animatable';
// import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {TimePicker} from 'react-native-wheel-picker-android';
import {Picker} from 'react-native-wheel-pick';
import Pie from 'react-native-pie';
import {PieChart} from 'react-native-svg-charts';
import Svg, {Path, G} from 'react-native-svg';
import Swipeout from 'react-native-swipeout';
import LottieView from 'lottie-react-native';
import Expand from 'react-native-simple-expand';
import _isEmpty from "lodash/isEmpty";
import * as shaefitApi from '../API/shaefitAPI';
import SwitchComponent from '../components/Switch';
import Slider from '../components/Slider';
import FoodRatingsGraphic from '../components/FoodRatingsGraphic';
import MacronutrientsGraphic from '../components/MacronutrientsGraphic';
import CaloriesGraphic from '../components/CaloriesGraphic';
import ShineOverlay from '../components/ShineOverlay';
import moment from 'moment';
// let Fraction = require("fractional").Fraction;
let Fraction = require('fraction.js');

const {height, width} = Dimensions.get('window');

const shadowOpt = {
  width: width - 40,
  height: 48,
  color: '#273849',
  border: 18,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 6,
  style: {marginTop: 24, alignSelf: 'center'},
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

LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
  dayNamesShort: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

class PreferencesListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onAddRemovePress = () => {
    this.props.changePreferencesItem(this.props.item.id - 1);
  };

  render() {
    let image = '';
    switch (this.props.item.name) {
      case 'Breakfast':
        image = require('../resources/icon/breakfastCopy.png');
        break;
      case 'Lunch':
        image = require('../resources/icon/lunch.png');
        break;
      case 'Dinner':
        image = require('../resources/icon/dinner.png');
        break;
      case 'Morning Snack':
        image = require('../resources/icon/snack.png');
        break;
      case 'Evening Snack':
        image = require('../resources/icon/snack.png');
        break;
      default:
        image = require('../resources/icon/snack.png');
    }

    return (
      <View style={{marginTop: 16}}>
        <View
          style={{
            width: width - 40,
            height: 64,
            borderRadius: 4,
            alignSelf: 'center',
            backgroundColor: 'rgb(255,255,255)',
            borderWidth: 1,
            borderColor: 'rgb(221,224,228)',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              marginTop: 12,
            }}>
            <Image
              source={image}
              // style={{width: 30, height: 30}}
            />
            <Text style={styles.modalSubcategoryText}>
              {this.props.item.name}
            </Text>

            {this.props.item.include ? (
              <TouchableWithoutFeedback onPress={this.onAddRemovePress}>
                <View style={styles.modalRemoveButton}>
                  <Text style={styles.modalRemoveButtonText}>Remove</Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={this.onAddRemovePress}>
                <View style={styles.modalAddButton}>
                  <Text style={styles.modalAddButtonText}>Add</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    );
  }
}

class ChronoListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  formatAMPM = (hours) => {
    let sufHours = hours;
    const suffix = hours >= 12 ? 'pm' : 'am';
    sufHours = sufHours > 12 ? sufHours - 12 : sufHours;
    sufHours = sufHours == '00' ? 12 : sufHours;

    // console.log('sufHours', sufHours);

    return sufHours + suffix;
  };

  render() {
    let backgroundColor = '';
    switch (this.props.item.name) {
      case 'Breakfast':
        backgroundColor = 'rgb(244,88,152)';
        break;
      case 'Lunch':
        backgroundColor = 'rgb(245,121,75)';
        break;
      case 'Dinner':
        backgroundColor = 'rgb(0,187,116)';
        break;
      default:
        backgroundColor = 'rgb(0,168,235)';
    }

    return (
      <View
        style={{
          height: 64,
          width: width - 135,
          borderRadius: 4,
          alignSelf: 'center',
          backgroundColor: 'rgb(255,255,255)',
          overflow: 'hidden',
          marginTop: this.props.index === 0 ? 0 : 16,
          borderWidth: 1,
          borderColor: 'rgb(221,224,228)',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{width: 2, height: 64, backgroundColor: backgroundColor}}
          />

          <View style={{marginLeft: 20}}>
            <Text style={styles.cardTitleScheduleModal}>
              {this.props.item.name}
            </Text>
            <Text
              style={
                styles.cardTextScheduleModal
              }>{`Anytime between ${this.formatAMPM(
              this.props.item.from,
            )} - ${this.formatAMPM(this.props.item.til)}`}</Text>
          </View>
        </View>
      </View>
    );
  }
}

class FoodListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSwiped: false,
    };
  }

  onPress = async () => {
    const data = await shaefitApi.getFoodById(this.props.item.id);

    Actions.foodDetails({
      data: data,
      // isFromHistory: true,
      isFromDiary: true,
      amount: this.props.item.amount,
      unit: this.props.item.unit,
      id: this.props.id,
      onDelete: this.onDelete,
    });
  };

  onDelete = () => {
    this.props.onFoodDelete(this.props.index);
  };

  render() {
    // let amount = this.props.item.amount;
    // if (amount === "0.25" || amount === 0.25) {
    //   amount = "1/4";
    // } else if (amount === "0.33" || amount === 0.33) {
    //   amount = "1/3";
    // } else if (amount === "0.5" || amount === "0.50" || amount === 0.5) {
    //   amount = "1/2";
    // } else if (amount === "0.66" || amount === 0.66) {
    //   amount = "2/3";
    // } else if (amount === "0.75" || amount === 0.75) {
    //   amount = "3/4";
    // }
    //
    // let amount = this.props.item.amount;
    // if (amount === "0.25" || amount === 0.25) {
    //   amount = "1/4";
    // } else if (amount === "0.33" || amount === 0.33) {
    //   amount = "1/3";
    // } else if (amount === "0.5" || amount === "0.50" || amount === 0.5) {
    //   amount = "1/2";
    // } else if (amount === "0.66" || amount === 0.66) {
    //   amount = "2/3";
    // } else if (amount === "0.75" || amount === 0.75) {
    //   amount = "3/4";
    // }

    // const splittedNumber = this.props.item.amount.toString().split(".");
    // const intPart = splittedNumber[0] !== "0" ? splittedNumber[0] : "-";
    // let floatPart =
    //   typeof splittedNumber[1] !== "undefined" ? "0." + splittedNumber[1] : "-";
    //
    // if (floatPart !== "-") {
    //   if (floatPart === "0.25" || floatPart === 0.25) {
    //     floatPart = "1/4";
    //   } else if (floatPart === "0.33" || floatPart === 0.33) {
    //     floatPart = "1/3";
    //   } else if (
    //     floatPart === "0.50" ||
    //     floatPart === "0.5" ||
    //     floatPart === 0.5
    //   ) {
    //     floatPart = "1/2";
    //   } else if (floatPart === "0.66" || floatPart === 0.66) {
    //     floatPart = "2/3";
    //   } else if (floatPart === "0.75" || floatPart === 0.75) {
    //     floatPart = "3/4";
    //   } else if (floatPart === "0.125" || floatPart === 0.125) {
    //     floatPart = "1/8";
    //   } else if (floatPart === "0.0625" || floatPart === 0.0625) {
    //     floatPart = "1/16";
    //   }
    // }
    //
    // let amount = "";
    // if (intPart !== "-") {
    //   amount = intPart;
    // }
    // if (floatPart !== "-" && intPart !== "-") {
    //   amount += " " + floatPart;
    // } else if (floatPart !== "-" && intPart === "-") {
    //   amount = floatPart;
    // }

    // amount = new Fraction(this.props.item.amount);

    amount = new Fraction(
      this.props.item.amount === 'NaN' ? '0.5' : this.props.item.amount,
    )
      .simplify(0.015)
      .toFraction(true);

    if (amount.includes('1/7')) {
      amount = amount.replace('1/7', '1/8');
    } else if (amount.includes('13/25')) {
      amount = amount.replace('13/25', '1/2');
    } else if (amount.includes('7/11')) {
      amount = amount.replace('7/11', '2/3');
    } else if (amount.includes('13/20')) {
      amount = amount.replace('13/20', '2/3');
    } else if (amount.includes('3/10')) {
      amount = amount.replace('3/10', '1/3');
    } else if (amount.includes('7/9')) {
      amount = amount.replace('7/9', '2/3');
    } else if (amount.includes('24/25')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('10/11')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('5/8')) {
      amount = amount.replace('5/8', '2/3');
    } else if (amount.includes('2/7')) {
      amount = amount.replace('2/7', '1/3');
    } else if (amount.includes('15/16')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('3/5')) {
      amount = amount.replace('3/5', '2/3');
    } else if (amount.includes('49/50')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('5/16')) {
      amount = amount.replace('5/16', '1/3');
    } else if (amount.includes('3/8')) {
      amount = amount.replace('3/8', '1/3');
    } else if (amount.includes('7/8')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('3/7')) {
      amount = amount.replace('3/7', '1/2');
    } else if (amount.includes('4/13')) {
      amount = amount.replace('4/13', '1/3');
    } else if (amount.includes('4/7')) {
      amount = amount.replace('4/7', '2/3');
    } else if (amount.includes('32/33')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('2/9')) {
      amount = amount.replace('2/9', '1/4');
    } else if (amount.includes('1/25')) {
      amount = amount.replace('1/25', '1/24');
    } else if (amount.includes('1/33')) {
      amount = amount.replace('1/33', '1/32');
    } else if (amount.includes('1/50')) {
      amount = amount.replace('1/50', '1/48');
    } else if (amount === 'NaN') {
      amount = '1/2';
    }

    // if (amount.numerator === 17 && amount.denominator === 100) {
    //   amount = "1/6";
    // } else if (amount.numerator === 33 && amount.denominator === 100) {
    //   amount = "1/3";
    // } else if (amount.numerator === 67 && amount.denominator === 100) {
    //   amount = "2/3";
    // } else if (amount.numerator === 19 && amount.denominator === 50) {
    //   amount = "1/3";
    // } else if (amount.numerator === 13 && amount.denominator === 100) {
    //   amount = "1/8";
    // } else if (amount.numerator === 3 && amount.denominator === 50) {
    //   amount = "1/16";
    // }

    const swipeoutBtns = [
      {
        backgroundColor: 'rgb(235,75,75)',
        component: (
          <View
            style={{
              width: 19,
              height: 25,
              padding: 0,
              margin: 0,
              marginLeft: 34.5,
              marginRight: 34.5,
              marginTop: 23,
              opacity: 1,
            }}>
            <Image
              source={require('../resources/icon/trashIcon.png')}
              style={{width: 19, height: 25}}
            />
          </View>
        ),
        onPress: () => {
          this.onDelete();
        },
      },
    ];

    console.log('FoodListItem this.props.item', this.props.item);

    const unitName =
      typeof this.props.item.unit !== 'undefined'
        ? this.props.item.unit.name
        : '';

    return (
      <Swipeout
        right={swipeoutBtns}
        backgroundColor="rgb(255,255,255)"
        buttonWidth={88}
        style={{borderRadius: 0}}
        onOpen={() => this.setState({isSwiped: true})}
        onClose={() => this.setState({isSwiped: false})}>
        <View>
          <TouchableWithoutFeedback onPress={this.onPress}>
            <View>
              <View
                style={{
                  width: width - 80,
                  height: 70,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: this.props.item.image}}
                  style={{width: 40, height: 40, borderRadius: 4}}
                  resizeMode="cover"
                />
                <View style={{marginLeft: 15}}>
                  <Text numberOfLines={1} style={styles.foodItemTitle}>
                    {this.props.item.name}
                  </Text>
                  <Text style={styles.foodItemText}>
                    {/*this.props.item.amount + " " + unitName */}
                    {amount + ' ' + unitName}
                  </Text>
                </View>

                <Text style={styles.foodItemCals}>
                  {Math.round(this.props.item.kcal).toLocaleString('en-US') +
                    ' cal'}
                </Text>

                {/*                   {`${
                                    this.props.userUnit === "standard"
                                      ? this.props.item.kcal.toLocaleString("en-US")
                                      : parseInt(this.props.item.kcal * 4.184).toLocaleString(
                                          "en-US"
                                        )
                                  } ${this.props.userUnit === "standard" ? "cal" : "J"}`} */}

                <Image
                  source={require('../resources/icon/arrowRight.png')}
                  style={{position: 'absolute', right: 0, top: 30}}
                />
              </View>

              {this.props.index !== 0 && (
                <View
                  style={{
                    position: 'absolute',
                    width: this.state.isSwiped ? width : width - 80,
                    alignSelf: 'center',
                    height: 0.5,
                    backgroundColor: 'rgb(216,215,222)',
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Swipeout>
    );
  }
}

class FoodRatingItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const unitName =
      typeof this.props.item.unit !== 'undefined'
        ? this.props.item.unit.name
        : '';

    return (
      <View
        style={{
          width: width - 80,
          height: 70,
          alignSelf: 'center',
          borderTopWidth: 0.5,
          borderTopColor: 'rgb(216,215,222)',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: this.props.item.food.image}}
          style={{width: 30, height: 30}}
          resizeMode="cover"
        />
        <View style={{marginLeft: 20}}>
          <Text numberOfLines={1} style={styles.foodItemTitle}>
            {this.props.item.food.name}
          </Text>
          <Text style={styles.foodItemText}>
            {this.props.item.amount + ' ' + unitName}
          </Text>
        </View>

        <Text style={styles.foodItemCals}>{this.props.item.cals + ' cal'}</Text>

        <Image
          source={require('../resources/icon/arrowRight.png')}
          style={{position: 'absolute', right: 0, top: 30}}
        />
      </View>
    );
  }
}

class MicronutrientsItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          width: width - 40,
          height: 44,
          alignSelf: 'center',
          borderTopWidth: this.props.index !== 0 ? 0.5 : 0,
          borderTopColor: 'rgb(216,215,222)',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={
            styles.micronutrientsText
          }>{`${this.props.item.name} (${this.props.item.unit})`}</Text>
        <Text
          style={[styles.micronutrientsText, {position: 'absolute', right: 0}]}>
          {this.props.item.value !== null
            ? parseFloat(this.props.item.value).toFixed(2)
            : ''}
        </Text>
      </View>
    );
  }
}

class GlassesItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isAnimationActive: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("GlassesItem nextProps", nextProps);
    if (nextProps.animatedIndexes.includes(this.props.index)) {
      this.setState({isAnimationActive: true});
    }
  }

  onAnimationFinish = () => {
    if (
      this.props.animatedIndexes.length !== 0 &&
      this.props.animatedIndexes[this.props.animatedIndexes.length - 1]
    ) {
      this.props.onFillGlassesFinish(this.props.index);
    }
  };

  onAnimationFilledFinish = () => {};

  // <LottieView autoPlay={true} loop={false} onAnimationFinish={() => {this.props.onEmptyGlassPress(this.props.index); this.setState({isAnimationActive: false})}} source={require('../animations/glassFilling.json')} style={{marginRight: marginRight, width: 40, height: 56}} />
  // <TouchableWithoutFeedback onPress={() => this.setState({isAnimationActive: true}, () => setTimeout(() => {this.setState({isAnimationActive: false})}, 500))}>

  render() {
    const marginRight = (width - 39 * 6 - 80) / 5;

    return (
      <View>
        {this.props.item === 1 ? (
          <TouchableWithoutFeedback
            onPress={() => this.props.onFilledGlassPress(this.props.index)}>
            {Platform.OS === 'ios' ? (
              <View style={{marginTop: this.props.index < 6 ? 20 : 20}}>
                <LottieView
                  ref={(animation) => {
                    this.animation = animation;
                  }}
                  autoPlay={false}
                  speed={-1}
                  loop={false}
                  progress={1}
                  onAnimationFinish={this.onAnimationFilledFinish}
                  source={require('../animations/timeline2.min.json')}
                  style={{
                    marginRight:
                      this.props.index !== 5 &&
                      this.props.index !== 11 &&
                      this.props.index !== 17
                        ? marginRight
                        : 0,
                    width: 39,
                    height: 60,
                  }}
                />
              </View>
            ) : (
              <View style={{marginTop: this.props.index < 6 ? 20 : 20}}>
                <Image
                  source={require('../resources/icon/glassFilled.png')}
                  style={{
                    marginRight:
                      this.props.index !== 5 &&
                      this.props.index !== 11 &&
                      this.props.index !== 17
                        ? marginRight
                        : 0,
                    width: 39,
                    height: 60,
                  }}
                />
              </View>
            )}
          </TouchableWithoutFeedback>
        ) : (
          <View>
            {this.state.isAnimationActive && Platform.OS === 'ios' ? (
              <View style={{marginTop: this.props.index < 6 ? 20 : 20}}>
                <LottieView
                  autoPlay={true}
                  loop={false}
                  onAnimationFinish={this.onAnimationFinish}
                  source={require('../animations/timeline2.min.json')}
                  style={{
                    marginRight:
                      this.props.index !== 5 &&
                      this.props.index !== 11 &&
                      this.props.index !== 17
                        ? marginRight
                        : 0,
                    width: 39,
                    height: 60,
                  }}
                />
              </View>
            ) : (
              <TouchableWithoutFeedback
                onPress={() => this.props.onEmptyGlassPress(this.props.index)}>
                <View style={{marginTop: this.props.index < 6 ? 20 : 20}}>
                  <Image
                    source={require('../resources/icon/glassEmpty.png')}
                    style={{
                      marginRight:
                        this.props.index !== 5 &&
                        this.props.index !== 11 &&
                        this.props.index !== 17
                          ? marginRight
                          : 0,
                      width: 39,
                      height: 60,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        )}
      </View>
    );
  }
}

class DiaryListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
      isTimeModalVisible: false,
      date: null,
      date2: new Date(),
    };
  }

  componentDidMount() {
    if (
      typeof this.props.item.timeConsumed !== 'undefined' &&
      this.props.item.timeConsumed !== null
    ) {
      const date = new Date();
      date.setHours(this.props.item.timeConsumed.substring(0, 2));
      date.setMinutes(this.props.item.timeConsumed.substring(3, 5));

      //   // setTimeout(() => {
      //   //   this.setState({isUpdating: false});
      //   // }, 5000)
      this.setState({date: date, date2: date});

      console.log('nextProps.timeConsumed 2', this.props.item.timeConsumed);
    } else if (typeof this.props.item.food !== 'undefined') {
      console.log('mealtype time', this.props.item.id, this.props.chrono);
      const date = new Date();

      if (
        this.props.item.id === 1 &&
        typeof this.props.chrono !== 'undefined' &&
        typeof this.props.chrono?.Breakfast !== 'undefined'
      ) {
        date.setHours(this.props.chrono.Breakfast.from);
      } else if (
        this.props.item.id === 2 &&
        typeof this.props.chrono !== 'undefined' &&
        typeof this.props.chrono['Morning Snack'] !== 'undefined'
      ) {
        date.setHours(this.props.chrono['Morning Snack'].from);
      } else if (
        this.props.item.id === 3 &&
        typeof this.props.chrono !== 'undefined' &&
        typeof this.props.chrono.Lunch !== 'undefined'
      ) {
        date.setHours(this.props.chrono.Lunch.from);
      } else if (
        this.props.item.id === 4 &&
        typeof this.props.chrono !== 'undefined' &&
        typeof this.props.chrono['Afternoon Snack'] !== 'undefined'
      ) {
        date.setHours(this.props.chrono['Afternoon Snack'].from);
      } else if (
        this.props.item.id === 5 &&
        typeof this.props.chrono !== 'undefined' &&
        typeof this.props.chrono.Dinner !== 'undefined'
      ) {
        date.setHours(this.props.chrono.Dinner.from);
      } else {
        if (this.props.item.id === 2) {
          date.setHours(11);
        } else if (this.props.item.id === 4) {
          date.setHours(16);
        }
      }

      date.setMinutes(0);

      this.setState({date, date2: date});
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps DiaryListItem nextProps', nextProps)
    // console.log('componentWillReceiveProps DiaryListItem this.props', this.props)

    // if (!this.state.collapsed) {
    //   this.setState({collapsed: !this.state.collapsed}, () => {
    //     setTimeout(() => {
    //       this.setState({collapsed: !this.state.collapsed});
    //     }, 0);
    //   });
    // }

    // if (this.state.collapsed && this.props.currentMealTypeId === this.props.item.id && this.state.isUpdating) {
    //   this.setState({collapsed: false}, () => {
    //     this.setState({isUpdating: false});
    //   });
    //
    //   // setTimeout(() => {
    //   //   this.setState({isUpdating: false});
    //   // }, 5000)
    // }

    console.log('nextProps.timeConsumed', nextProps.item.timeConsumed);
    if (
      typeof nextProps.item.timeConsumed !== 'undefined' &&
      nextProps.item.timeConsumed !== null
    ) {
      const date = new Date();
      date.setHours(nextProps.item.timeConsumed.substring(0, 2));
      date.setMinutes(nextProps.item.timeConsumed.substring(3, 5));

      //   // setTimeout(() => {
      //   //   this.setState({isUpdating: false});
      //   // }, 5000)
      this.setState({date: date, date2: date});

      console.log('nextProps.timeConsumed 2', nextProps.item.timeConsumed);
    } else if (typeof nextProps.item.food !== 'undefined') {
      console.log('mealtype time', nextProps.item.id, nextProps.chrono);
      const date = new Date();

      if (
        nextProps.item.id === 1 &&
        typeof nextProps.chrono.Breakfast !== 'undefined'
      ) {
        date.setHours(nextProps.chrono.Breakfast.from);
      } else if (
        nextProps.item.id === 2 &&
        typeof nextProps.chrono['Morning Snack'] !== 'undefined'
      ) {
        date.setHours(nextProps.chrono['Morning Snack'].from);
      } else if (
        nextProps.item.id === 3 &&
        typeof nextProps.chrono.Lunch !== 'undefined'
      ) {
        date.setHours(nextProps.chrono.Lunch.from);
      } else if (
        nextProps.item.id === 4 &&
        typeof nextProps.chrono['Afternoon Snack'] !== 'undefined'
      ) {
        date.setHours(nextProps.chrono['Afternoon Snack'].from);
      } else if (
        nextProps.item.id === 5 &&
        typeof nextProps.chrono.Dinner !== 'undefined'
      ) {
        date.setHours(nextProps.chrono.Dinner.from);
      } else {
        if (nextProps.item.id === 2) {
          date.setHours(11);
        } else if (nextProps.item.id === 4) {
          date.setHours(16);
        }
      }

      date.setMinutes(0);

      this.setState({date, date2: date});
    }
  }

  onPress = () => {
    console.log('this.props.item', this.props.item);
    Actions.details({
      key: 'searchFoodScreen',
      id: this.props.item.id,
      foodDiaryId: this.props.item.foodDiaryId,
      mealTypeId: this.props.item.id,
      entryDate: this.props.entryDate,
      recipeCourses: this.props.item.recipe_courses,
    });

    // this.setState({collapsed: true, isUpdating: true});
    // Actions.searchFoodScreen();
  };

  _renderFoodListItem = ({item, index}) => {
    return (
      <FoodListItem
        index={index}
        item={item}
        id={this.props.item.id}
        userUnit={this.props.userUnit}
        onFoodDelete={(index) =>
          this.props.onFoodDelete(
            index,
            this.props.item.id,
            this.props.item.foodDiaryId,
          )
        }
      />
    );
  };

  showTimePicker = () => {
    this.setState({isTimeModalVisible: !this.state.isTimeModalVisible});
  };

  onTimeSelected = (date) => {
    console.log('onTimeSelected', date);
    this.setState({date2: date});
  };

  onDonePress = () => {
    this.setState({
      isTimeModalVisible: !this.state.isTimeModalVisible,
      date: this.state.date2,
    });

    const hours = this.state.date2.getHours().toString().padStart(2, '0');
    const minutes = this.state.date2.getMinutes().toString().padStart(2, '0');

    shaefitApi.updateTimeConsumed(this.props.item.foodDiaryId, hours, minutes);
  };

  onSaveMealPress = () => {
    Actions.details({
      key: 'saveMeal',
      id: this.props.item.id,
      food: this.props.item.food,
      foodDiaryId: this.props.item.foodDiaryId,
      stats: this.props.item.stats,
    });
  };

  formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
  };

  render() {
    let image = '';
    switch (this.props.item.name) {
      case 'Breakfast':
        image = require('../resources/icon/breakfastCopy.png');
        break;
      case 'Lunch':
        image = require('../resources/icon/lunch.png');
        break;
      case 'Dinner':
        image = require('../resources/icon/dinner.png');
        break;
      case 'Morning Snack':
        image = require('../resources/icon/snack.png');
        break;
      case 'Evening Snack':
        image = require('../resources/icon/snack.png');
        break;
      default:
        image = require('../resources/icon/snack.png');
    }

    if (this.props.item.name === 'Dinner') {
      console.log('this.props.item dinner', this.props.item);
    }

    // <View style={{marginTop: 0}}>
    //   <BoxShadow setting={{...shadowOpt, ...{height: 127, style: {marginTop: 16, alignSelf: 'center'}}}}>
    //     <View style={{width: width - 40, height: 127, borderRadius: 10, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)'}}>
    //       <TouchableWithoutFeedback onPress={this.props.toggleMealOptions}>
    //         <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginHorizontal: 20}}>
    //           <Image
    //             source={image}
    //             style={{marginRight: 15}}
    //           />
    //
    //           <Text style={styles.title}>{this.props.item.name}</Text>
    //
    //
    //             <Image
    //               source={require('../resources/icon/dot.png')}
    //               style={{position: 'absolute', right: 0, top: '50%'}}
    //             />
    //
    //         </View>
    //       </TouchableWithoutFeedback>
    //
    //       <View style={styles.divider} />
    //
    //       <TouchableWithoutFeedback onPress={this.onPress}>
    //         <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 16, marginHorizontal: 20}}>
    //           <Image
    //             source={require('../resources/icon/plus.png')}
    //             style={{marginRight: 10}}
    //           />
    //
    //           <Text style={styles.addText}>Add Food</Text>
    //         </View>
    //       </TouchableWithoutFeedback>
    //
    //     </View>
    //   </BoxShadow>
    // </View>

    // const list = this.props.item.food.map((data, index) => {
    //   return (
    //     <View><Text>{index}</Text></View>
    //   )
    // })

    let totalCals = 0;
    if (typeof this.props.item.food !== 'undefined') {
      for (let i = 0; i < this.props.item.food.length; i++) {
        totalCals += Math.round(this.props.item.food[i].kcal);
      }
    }

    // if (this.props.userUnit !== "standard") {
    //   totalCals = parseInt(totalCals * 4.184);
    // }

    return (
      <View
        style={{
          marginTop: 16,
          width: width - 40,
          minHeight: 79,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: 'rgb(221,224,228)',
          alignSelf: 'center',
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({collapsed: !this.state.collapsed})}>
          <View>
            <View
              style={{
                width: width - 40,
                minHeight: 79,
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <Image source={image} style={{marginLeft: 20, marginRight: 15}} />

              {typeof this.props.item.food !== 'undefined' ? (
                <View>
                  <Text style={styles.title}>{this.props.item.name}</Text>
                  <TouchableWithoutFeedback onPress={this.showTimePicker}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 4,
                      }}>
                      <Image
                        source={require('../resources/icon/timeCopy2.png')}
                        style={{marginRight: 6, tintColor: 'rgb(0,168,235)'}}
                      />
                      <Text style={styles.addTimeText}>
                        {this.state.date !== null
                          ? `${this.formatAMPM(this.state.date)}`
                          : 'Add Time'}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ) : (
                <Text style={styles.title}>{this.props.item.name}</Text>
              )}

              {!this.state.collapsed ? (
                <Image
                  source={require('../resources/icon/arrowDown.png')}
                  style={{position: 'absolute', right: 20, top: 34}}
                />
              ) : (
                <Image
                  source={require('../resources/icon/arrowUp.png')}
                  style={{position: 'absolute', right: 20, top: 34}}
                />
              )}

              {typeof this.props.item.food !== 'undefined' && (
                <View style={{position: 'absolute', right: 50, top: 30}}>
                  <Text
                    style={
                      styles.mealCaloriesTitle
                    }>{`${totalCals.toLocaleString('en-US')} ${
                    this.props.userUnit === 'standard' ? 'cal' : 'cal'
                  }`}</Text>
                </View>
              )}
            </View>
            <Expand value={this.state.collapsed}>
              {/*<Collapsible collapsed={this.state.collapsed} align="center">*/}
              <View style={{minHeight: 76, flex: 1}}>
                <View
                  style={{
                    width: width - 80,
                    height: 0.5,
                    backgroundColor: 'rgb(216,215,222)',
                    alignSelf: 'center',
                  }}
                />

                {typeof this.props.item.food !== 'undefined' && (
                  <FlatList
                    data={this.props.item.food}
                    extraData={this.props.item.food}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={this._renderFoodListItem}
                    contentContainerStyle={{overflow: 'hidden'}}
                    keyboardShouldPersistTaps="always"
                    // initialNumToRender={10}
                    bounces={false}
                  />
                )}

                {/*list */}

                {typeof this.props.item.food !== 'undefined' ? (
                  <View
                    style={{
                      width: width - 80,
                      height: 36,
                      marginVertical: 20,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableWithoutFeedback onPress={this.onPress}>
                      <View
                        style={{
                          width: (width - 96) / 2,
                          height: 36,
                          borderRadius: 22,
                          borderWidth: 1,
                          alignSelf: 'center',
                          borderColor: 'rgb(0,168,235)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginVertical: 20,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProText-Regular',
                            fontWeight: '400',
                            fontSize: 15,
                            color: 'rgb(0,168,235)',
                          }}>
                          Add Food
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={this.onSaveMealPress}>
                      <View
                        style={{
                          width: (width - 96) / 2,
                          height: 36,
                          borderRadius: 22,
                          borderWidth: 1,
                          alignSelf: 'center',
                          borderColor: 'rgb(221,224,228)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginVertical: 20,
                        }}>
                        <Text
                          style={{
                            fontFamily: 'SFProText-Regular',
                            fontWeight: '400',
                            fontSize: 15,
                            color: 'rgb(31,33,35)',
                          }}>
                          Save as Meal
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onPress}>
                    <View
                      style={{
                        width: width - 80,
                        height: 36,
                        borderRadius: 22,
                        borderWidth: 1,
                        alignSelf: 'center',
                        borderColor: 'rgb(0,168,235)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginVertical: 20,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'SFProText-Regular',
                          fontWeight: '400',
                          fontSize: 15,
                          color: 'rgb(0,168,235)',
                        }}>
                        Add Food
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            </Expand>
            {/*</Collapsible>*/}
          </View>
        </TouchableWithoutFeedback>

        <Dialog
          visible={this.state.isTimeModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isTimeModalVisible: !this.state.isTimeModalVisible,
            });
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 0,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback onPress={this.onDonePress}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{width: width - 40, height: 200, alignSelf: 'center'}}>
                <TimePicker
                  style={{width: (width - 40) / 3, height: 100}}
                  currentDate={this.state.date !== null ? this.state.date : ''}
                  initDate={this.state.date !== null ? this.state.date : ''}
                  onTimeSelected={(date) => this.onTimeSelected(date)}
                  // isCyclic={true}
                />
              </View>

              {isIphoneX() && <View style={{height: 37}} />}
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

class FoodDiary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabActive: 0,
      userName: '',
      userUnit: '',
      foodDiaryDatesMap: {},
      foodDiaryArray: new Array(),
      foodDiaryArrayPreferences: new Array(),
      isSettingsSaved: false,
      isScheduleModalVisible: false,
      isMealOptionsModalVisible: false,
      isWaterOptionsModalVisible: false,
      isWaterSettingsModalVisible: false,
      isSaveFoodDiaryViewModalVisible: false,
      isFoodRatingWheelModalVisible: false,
      chrono: null,
      chrono2: null,

      isCalendarVisible: false,
      selected: undefined,

      goals: null,
      waterCollapsed: true,
      water: 0,
      recommendedWater: 1000,
      waterMax: 3000,
      waterMax2: 3000,

      foodRatingPosition: 3,
      foodRatingWheelPosition: 3,
      foodRatingData: [],
      foodRatingPercentages: [0, 0, 0],
      foodRatingPieChartData: [],
      foodRatingFoodGreatArray: [],
      foodRatingFoodOkArray: [],
      foodRatingFoodAvoidArray: [],
      foodRatingsFoodGreatCollapsed: true,
      foodRatingsFoodOkCollapsed: true,
      foodRatingsFoodAvoidCollapsed: true,
      isRatingsCalendarVisible: false,
      ratingsSelectedDate: undefined,
      ratingsMonthDate: undefined,
      ratingsCalendarMarkedDates: {},
      ratingsCalendarMarkedData: [],
      isDayRatings: false,
      daysRatings: [],
      currentDayRatings: '',
      weeksRatings: [],
      currentWeekRatings: [],
      isLoadingRatings: false,
      foodRatingsTips: null,

      selectDayOption: '1 day',
      daySelectionPicker: false,
      isNutrientsCalendarVisible: false,
      nutrientsSelected: undefined,
      start: undefined,
      end: undefined,
      period: {},
      isMicronutrientsActive: false,
      isMicronutrientsEmpty: false,
      micronutrientsPosition: 0,
      micronutrientsWheelPosition: 0,
      isMicronutrientsWheelModalVisible: false,
      micronutrientsData: [],
      macronutrientsData: [],
      macronutrientsPieChartData: [],
      isAdjustMacrosVisible: false,
      carbsMax2: 25,
      fatMax2: 25,
      proteinMax2: 25,
      isDayNutrients: true,
      daysNutrients: [],
      currentDayNutrients: '',
      weeksNutrients: [],
      currentWeekNutrients: [],
      isLoadingNutrients: false,
      nutrientsTips: null,

      caloriesPosition: 0,
      caloriesWheelPosition: 0,
      isCaloriesWheelModalVisible: false,
      caloriesData: [],
      isCaloriesCalendarVisible: false,
      caloriesSelected: undefined,
      isCaloriesModalVisible: false,
      caloriesMax2: 0,
      caloriesSections: [],
      caloriesWeekArray: [],
      isDayCalories: true,
      daysCalories: [],
      currentDayCalories: '',
      weeksCalories: [],
      currentWeekCalories: [],
      isLoadingCalories: false,
      caloriesTips: null,

      isHintModalVisible: false,
      hintTouchPosition: {},
      hintColor: '',
      hintText: '',
      hintValue: 0,

      isHintCaloriesModalVisible: false,
      hintCaloriesTouchPosition: {},
      hintCaloriesText: '',
      hintCaloriesValue: 0,
      hintCaloriesPercentage: 0,
      hintCaloriesImage: '',

      isHintNutrientsModalVisible: false,
      hintNutrientsTouchPosition: {},
      hintNutrientsColor: '',
      hintNutrientsText: '',
      hintNutrientsValue: 0,

      isDiaryLoading: false,
      isNameLoading: false,

      opacity: new Animated.Value(1),
      indicatorPositionX: new Animated.Value(0),

      isGlassFillingActive: false,
      glasses: [],
      animatedIndexes: [],

      appState: AppState.currentState,
      lastTodayDate: '',
      isRefreshing: false,
    };

    this.shortcuts = [];
    (this.foodRatingPositionValues = [
      'Today',
      'Yesterday',
      'Last Week',
      'This Week',
      'Custom',
    ]),
      (this.micronutrientsPositionValues = [
        'Today',
        'Yesterday',
        'Last Week',
        'This Week',
        'Custom'
      ]),
      (this.caloriesPositionValues = [
        'Today',
        'Yesterday',
        'Last Week',
        'This Week',
        'Custom',
      ]),
      (this.foodRatingDates = []);
    this.micronutrientsDates = [];
    this.caloriesDates = [];
  }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.onLoad();
  }

  onLoad = () => {
    const todayDate = new Date();
    let yesterday = new Date();

    let todayOffsetHours = -todayDate.getTimezoneOffset() / 60;
    todayDate.setHours(todayDate.getHours() + todayOffsetHours);
    yesterday.setHours(yesterday.getHours() + todayOffsetHours);

    if (todayDate.toISOString().slice(0, 10) !== this.state.lastTodayDate) {
      console.log(
        'todayDate',
        todayDate,
        todayDate.toISOString(),
        todayDate.getTimezoneOffset(),
      );

      yesterday.setDate(yesterday.getDate() - 1);
      this.setState(
        {
          lastTodayDate: `${todayDate.toISOString().slice(0, 10)}`,
          selected: `${todayDate.toISOString().slice(0, 10)}`,
          foodDiaryDatesMap: {
            [todayDate.toISOString().slice(0, 10)]: 'Today',
            [yesterday.toISOString().slice(0, 10)]: 'Yesterday',
          },
        },
        () => {
          const promise1 = this.getFoodDiaryMealPreferences(
            this.state.selected,
          );
          const promise2 = this.getFoodDiaryMealChrono();
          const promise3 = this.getUserDetails();
          const promise4 = this.getDailyGoals();
          const promise5 = this.getWaterIntake();

          Promise.all([promise1, promise2, promise3, promise4, promise5]).then(
            (values) => {
              console.log('promises resolved', values);
              this.getWaterIntake(this.state.selected);
            },
          );
        },
      );

      this.setState({
        ratingsSelectedDate: `${todayDate.toISOString().slice(0, 10)}`,
        ratingsMonthDate: `${todayDate.toISOString().slice(0, 10)}`,
      });

      this.setFoodRatingsDates();
      this.setMicronutrientsDates();
      this.setCaloriesDates();
      this.getFoodRatingData();
      this.getMicronutrientsData();
      this.getCaloriesData();
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      this.onLoad();
    }
    this.setState({appState: nextAppState});
  };

  async UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    if (
      typeof nextProps.newFood !== 'undefined' &&
      nextProps.newFood !== this.props.newFood
    ) {
      console.log(
        'componentWillReceiveProps nextProps.newFood',
        nextProps.id,
        nextProps.newFood,
      );

      let foodDiaryArray = this.state.foodDiaryArray;
      for (let i = 0; i < foodDiaryArray.length; i++) {
        if (nextProps.id === foodDiaryArray[i].id) {
          if (typeof foodDiaryArray[i].food === 'undefined') {
            foodDiaryArray[i].food = [];
            foodDiaryArray[i].food.push(nextProps.newFood);
          } else {
            foodDiaryArray[i].food.push(nextProps.newFood);
          }

          if (foodDiaryArray[i].food.length === 1) {
            const data = await shaefitApi.saveFoodDiaryDay({
              mealtype_id: nextProps.id,
              entry_date: this.state.selected,
              foods: foodDiaryArray[i].food,
            });

            console.log('foodDiaryArray[i]', foodDiaryArray[i]);

            if (
              typeof data.message !== 'undefined' &&
              data.message === 'The given data was invalid.'
            ) {
              shaefitApi.addFoodDiaryEntry(
                foodDiaryArray[i].foodDiaryId,
                nextProps.newFood,
                foodDiaryArray.length,
              );
            } else {
              foodDiaryArray[i].foodDiaryId = data.id;
            }
          } else {
            shaefitApi.addFoodDiaryEntry(
              foodDiaryArray[i].foodDiaryId,
              nextProps.newFood,
              foodDiaryArray.length,
            );
          }

          break;
        }
      }

      this.setState({foodDiaryArray}, () => {
        console.log('foodDiaryArray', this.state.foodDiaryArray);
        this.onLoad();
      });
    }

    if (
      typeof nextProps.newFoods !== 'undefined' &&
      nextProps.newFoods !== this.props.newFoods
    ) {
      console.log(
        'componentWillReceiveProps nextProps.newFoods',
        nextProps.id,
        nextProps.newFoods,
      );

      let foodDiaryArray = this.state.foodDiaryArray;
      for (let i = 0; i < foodDiaryArray.length; i++) {
        if (nextProps.id === foodDiaryArray[i].id) {
          if (typeof foodDiaryArray[i].food === 'undefined') {
            foodDiaryArray[i].food = nextProps.newFoods;
          } else {
            foodDiaryArray[i].food = foodDiaryArray[i].food.concat(
              nextProps.newFoods,
            );
          }

          if (typeof nextProps.foodDiaryId === 'undefined') {
            const data = await shaefitApi.saveFoodDiaryDay2({
              mealtype_id: nextProps.id,
              entry_date: this.state.selected,
              foods: foodDiaryArray[i].food,
            });

            if (
              typeof data.message !== 'undefined' &&
              data.message === 'The given data was invalid.'
            ) {
              shaefitApi.addFoodDiaryEntries(
                nextProps.foodDiaryId,
                nextProps.newFoods,
              );
            } else {
              foodDiaryArray[i].foodDiaryId = data.id;
            }
          } else {
            shaefitApi.addFoodDiaryEntries(
              nextProps.foodDiaryId,
              nextProps.newFoods,
            );
          }

          break;
        }
      }

      this.setState({foodDiaryArray}, () =>
        console.log('foodDiaryArray', this.state.foodDiaryArray),
      );
    }

    this.setFoodRatingsDates();
    this.setMicronutrientsDates();
    this.setCaloriesDates();
    this.getFoodRatingData();
    this.getMicronutrientsData();
    this.getCaloriesData();
  }

  slideIndicator = (index) => {
    Animated.spring(this.state.indicatorPositionX, {
      toValue: index * 100,
    }).start();
  };

  getListFoodDiaries = async () => {
    let data = await shaefitApi.getListFoodDiaries(this.state.selected);
    console.log('getListFoodDiaries data', data);
    let foodDiaryArray = this.state.foodDiaryArray;
    data = data.sort((a, b) => a.mealtype.id - b.mealtype.id);

    for (let i = 0; i < data.length; i++) {
      if (typeof data[i].foods !== 'undefined') {
        for (let k = 0; k < data[i].foods.length; k++) {
          let foodObject = {};
          foodObject.id = data[i].foods[k].food.id;
          foodObject.name = data[i].foods[k].food.name;
          foodObject.image = data[i].foods[k].food.image;
          foodObject.user_importance_val = data[i].foods[k].food.rating;
          foodObject.kcal = data[i].foods[k].food.cals;
          foodObject.amount = data[i].foods[k].amount;
          foodObject.unit = data[i].foods[k].unit;
          foodObject.carbs = '13.3';
          foodObject.fat = '0.3';
          foodObject.protein = '0.8';
          foodObject.foodId = data[i].foods[k].id;

          // console.log('getListFoodDiaries foodObject', foodObject);

          if (typeof foodDiaryArray[i].food === 'undefined') {
            foodDiaryArray[i].food = [];
            foodDiaryArray[i].food.push(foodObject);
            // foodDiaryArray[i].foodDiaryId = data[i].id;
          } else {
            foodDiaryArray[i].food.push(foodObject);
            // foodDiaryArray[i].foodDiaryId = data[i].id;
          }

          if (typeof foodDiaryArray[i].timeConsumed === 'undefined')
            foodDiaryArray[i].timeConsumed = data[i].time_consumed;
        }
      }

      if (typeof data[i].stats !== 'undefined') {
        foodDiaryArray[i].stats = data[i].stats;
      }

      if (data[i].id !== null) {
        foodDiaryArray[i].foodDiaryId = data[i].id;
      }
    }

    console.log('getListFoodDiaries foodDiaryArray', foodDiaryArray);

    this.setState({foodDiaryArray}, () => {
      console.log('foodDiaryArray[2]', foodDiaryArray[2]);
    });
  };

  getFoodDiaryMealPreferences = async () => {
    this.setState({isDiaryLoading: true, waterCollapsed: true});
    let data = await shaefitApi.getFoodDiaryMealPreferences(
      this.state.selected,
    );
    let data2 = await shaefitApi.getFoodDiaryMealPreferences(
      this.state.selected,
    );

    console.log('data', data);
    data.sort((a, b) => a.sort_order > b.sort_order);
    data2.sort((a, b) => a.sort_order > b.sort_order);

    this.setState({foodDiaryArray: data, foodDiaryArrayPreferences: data2});

    await this.getListFoodDiaries();
    this.setState({isDiaryLoading: false});
  };

  getFoodDiaryMealChrono = async () => {
    const chrono = await shaefitApi.getFoodDiaryMealChrono();

    let array = [];

    let chronoSorted = {};
    if (chrono.hasOwnProperty('Breakfast')) {
      chronoSorted.Breakfast = chrono.Breakfast;
    }
    if (chrono.hasOwnProperty('Morning Snack')) {
      chronoSorted['Morning Snack'] = chrono['Morning Snack'];
    }
    if (chrono.hasOwnProperty('Lunch')) {
      chronoSorted.Lunch = chrono.Lunch;
    }
    if (chrono.hasOwnProperty('Afternoon Snack')) {
      chronoSorted['Afternoon Snack'] = chrono['Afternoon Snack'];
    }
    if (chrono.hasOwnProperty('Dinner')) {
      chronoSorted.Dinner = chrono.Dinner;
    }

    Object.keys(chronoSorted).map((key, index) => {
      let obj = {};

      obj.name = key;
      obj.from = chronoSorted[key].from;
      obj.til = chronoSorted[key].til;

      array.push(obj);
    });

    this.setState({chrono: array, chrono2: chrono});
    // {"Breakfast":{"from":8,"til":11},"Lunch":{"from":14,"til":16},"Dinner":{"from":18,"til":20}}'
    console.log('chrono', chrono);
    console.log('chrono', array);
  };

  getUserDetails = async () => {
    this.setState({isNameLoading: true});
    const userDetails = await shaefitApi.getUserDetails();
    console.log('userDetails', userDetails);
    this.setState({
      userName: userDetails.username,
      userUnit: userDetails.profile.unit,
      isNameLoading: false,
    });
  };

  getDailyGoals = async () => {
    const goals = await shaefitApi.getDailyGoals();
    this.setState({
      goals,
      waterMax:
        goals.WATER.value === false
          ? goals.WATER.recommended
          : goals.WATER.value,
      waterMax2:
        goals.WATER.value === false
          ? goals.WATER.recommended
          : goals.WATER.value,
      carbsMax2:
        goals.MACRO_CARB.value !== 0 && goals.MACRO_CARB.value !== false
          ? goals.MACRO_CARB.value
          : (500 / 100) * goals.MACRO_CARB.recommended,
      fatMax2:
        goals.MACRO_FAT.value !== 0 && goals.MACRO_FAT.value !== false
          ? goals.MACRO_FAT.value
          : (500 / 100) * goals.MACRO_FAT.recommended,
      proteinMax2:
        goals.MACRO_PROTIEN.value !== 0 && goals.MACRO_PROTIEN.value !== false
          ? goals.MACRO_PROTIEN.value
          : (500 / 100) * goals.MACRO_PROTIEN.recommended,
      recommendedWater: goals.WATER.recommended,
      caloriesMax2:
        goals.CALORIES.value === false
          ? Math.round(goals.CALORIES.recommended / 50) * 50
          : goals.CALORIES.value,
    });
    console.log('goals', goals);
  };

  getWaterIntake = async () => {
    console.log('getWaterIntake', this.state.selected);
    const water = await shaefitApi.getWaterIntake(this.state.selected);
    this.setState({water: water.mls}, () => {
      // setTimeout(() => {
      let glasses = [];
      glasses.length = water.mls / 250;
      glasses.fill(1);

      for (let i = 0; i < (this.state.waterMax - water.mls) / 250; i++) {
        glasses.push(0);
      }

      this.setState({glasses});
      // }, 300)
    });
  };

  onTabChange = (index) => {
    this.slideIndicator(index);

    if (index === 1) {
      // Actions.refresh({ rightButtonImage: require('../resources/icon/target.png'), onRight: this.handleNutrientsTargetPress});
      this.setState({isLoadingRatings: false});
    } else if (index === 2) {
      // Actions.refresh({ rightButtonImage: require('../resources/icon/target.png'), onRight: this.handleNutrientsTargetPress});
      this.setState({isLoadingNutrients: false});
    } else if (index === 3) {
      this.setState({isLoadingCalories: false});
      // Actions.refresh({ rightButtonImage: require('../resources/icon/target.png'), onRight: this.handleCaloriesTargetPress});
    } else {
      // Actions.refresh({ rightButtonImage: () => null, onRight: () => {}});
    }
    this.setState({ ratingsSelectedDate: undefined, nutrientsSelected: undefined, caloriesSelected: undefined, start: undefined, 
      end: undefined, period: {} })
    this.scrollViewTop.scrollTo({x: index * 100, y: 0, animated: true});
  };

  handleNutrientsTargetPress = () => {
    console.log('handleNutrientsTargetPress');
    this.setState({isAdjustMacrosVisible: true});
  };

  handleCaloriesTargetPress = () => {
    console.log('handleCaloriesTargetPress');
    this.setState({isCaloriesModalVisible: true});
  };

  onModalOpen = () => {
    try {
      this.refs.modal.open();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onClosingState = () => {
    // const newArray = this.state.foodDiaryArray.slice();
    // this.setState({foodDiaryArrayPreferences: newArray}, () => {console.log('onClosingState', this.state.foodDiaryArrayPreferences);});
  };

  _renderPreferencesItem = ({item, index}) => {
    return (
      <PreferencesListItem
        index={index}
        item={item}
        changePreferencesItem={this.changePreferencesItem}
      />
    );
  };

  _renderDiaryItem = ({item, index}) => {
    return (
      <DiaryListItem
        index={index}
        item={item}
        toggleMealOptions={this.toggleMealOptions}
        entryDate={this.state.selected}
        onFoodDelete={this.onFoodDelete}
        chrono={this.state.chrono2}
        userUnit={this.state.userUnit}
      />
    );
  };

  _renderFoodRatingItem = ({item, index}) => {
    return <FoodRatingItem index={index} item={item} />;
  };

  _renderMicronutrientsItem = ({item, index}) => {
    return <MicronutrientsItem index={index} item={item} />;
  };

  _renderGlassesItem = ({item, index}) => {
    return (
      <GlassesItem
        index={index}
        item={item}
        onEmptyGlassPress={this.onEmptyGlassPress}
        onFilledGlassPress={this.onFilledGlassPress}
        animatedIndexes={this.state.animatedIndexes}
        onFillGlassesFinish={this.onFillGlassesFinish}
      />
    );
  };

  onFoodDelete = (index, mealTypeId, foodDiaryId) => {
    console.log(
      'onFoodDelete',
      index,
      mealTypeId,
      foodDiaryId,
      this.state.foodDiaryArray,
    );

    let array = this.state.foodDiaryArray;
    let foodDiaryFoodId;

    for (let i = 0; i < array.length; i++) {
      if (array[i].id === mealTypeId) {
        console.log('onFoodDelete', array[i].food[index]);
        // foodDiaryFoodId = array[i].food[index].id;
        // if (typeof array[i].food[index].foodId !== 'undefined') {
        //   foodDiaryFoodId = array[i].food[index].foodId;
        // }

        if (
          array[i].food[index]?.foodId !== undefined &&
          array[i].food[index]?.foodId !== null &&
          array[i].food[index]?.foodId !== ''
        ) {
          foodDiaryFoodId = array[i].food[index]?.foodId;
        }

        array[i].food.splice(index, 1);

        break;
      }
    }

    this.setState({foodDiaryArray: array}, () => {
      shaefitApi.deleteFoodFromDiary(foodDiaryId, foodDiaryFoodId);
      setTimeout(() => {
        this.setFoodRatingsDates();
        this.setMicronutrientsDates();
        this.setCaloriesDates();
        this.getFoodRatingData();
        this.getMicronutrientsData();
        this.getCaloriesData();
      }, 500);
    });
  };

  changePreferencesItem = (index) => {
    let array = this.state.foodDiaryArrayPreferences;
    const array2 = new Array();

    for (let i = 0; i < this.state.foodDiaryArray.length; i++) {
      array2.push(this.state.foodDiaryArray[i]);
    }

    array[index].include = !array[index].include;

    console.log('changePreferencesItem', index, array, array2);

    this.setState({foodDiaryArrayPreferences: array});
  };

  dismissModal = () => {
    try {
      if (this.popupDialog !== null) this.popupDialog.dismiss();
      this.setState({isModalVisible: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  animatedDismissModal = () => {
    try {
      this.popup.slideOutUp(350).then(() => this.dismissModal());
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onDailySchedulePress = () => {
    this.refs.modal.close();
    this.setState({isScheduleModalVisible: true});
  };

  toggleMealOptions = () => {
    this.setState({
      isMealOptionsModalVisible: !this.state.isMealOptionsModalVisible,
    });
  };

  updatePreferences = () => {
    shaefitApi.saveFoodDiaryMealPreferences(
      this.state.foodDiaryArrayPreferences,
      this.state.selected,
    );

    let newArray = this.state.foodDiaryArray;

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].include = this.state.foodDiaryArrayPreferences[i].include;
    }

    this.setState({foodDiaryArray: newArray});

    if (this.state.isSettingsSaved) {
      console.log('updatePreferences', this.state.foodDiaryArray);

      shaefitApi.saveFoodDiaryMealPreferences(newArray);

      this.refs.modal.close();
    } else {
      this.refs.modal.close();

      setTimeout(() => {
        this.setState({isSaveFoodDiaryViewModalVisible: true});
      }, 400);
    }
  };

  onSavePress = async () => {
    this.setState({
      isSaveFoodDiaryViewModalVisible: false,
      isSettingsSaved: true,
    });
    // const newArray = this.state.foodDiaryArrayPreferences.slice(0);
    let newArray = this.state.foodDiaryArray;

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].include = this.state.foodDiaryArrayPreferences[i].include;
    }

    this.setState({foodDiaryArray: newArray}, () => {
      console.log('updatePreferences', this.state.foodDiaryArray);

      shaefitApi.saveFoodDiaryMealPreferences(
        this.state.foodDiaryArrayPreferences,
      );
    });
  };

  onThanksPress = () => {
    this.setState({
      isSaveFoodDiaryViewModalVisible: false,
      isSettingsSaved: false,
    });

    // const newArray = this.state.foodDiaryArray.slice(0);
    let newArray = this.state.foodDiaryArrayPreferences;

    for (let i = 0; i < newArray.length; i++) {
      newArray[i].include = this.state.foodDiaryArray[i].include;
    }

    this.setState({foodDiaryArrayPreferences: newArray}, () => {
      console.log('updatePreferences', this.state.foodDiaryArray);
    });
  };

  formatAMPM = (hours) => {
    let sufHours = hours;
    const suffix = hours >= 12 ? 'pm' : 'am';
    sufHours = sufHours > 12 ? sufHours - 12 : sufHours;
    sufHours = sufHours == '00' ? 12 : sufHours;

    // console.log('sufHours', sufHours);

    return sufHours + suffix;
  };

  onSettingsPress = (value) => {
    this.setState({isSettingsSaved: value});
  };

  onDayPress = (day) => {
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    const newDate = new Date(day.dateString);
    newDate.setHours(0);
    newDate.setMinutes(0);
    // newDate.setTime(newDate.getTime() + today.getTimezoneOffset() * 60 * 1000);
    console.log('day', day);
    if (today.getTime() >= newDate.getTime()) {
      this.setState({selected: day.dateString});
    }
  };

  onRatingDayPress = (day) => {
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    const newDate = new Date(day.dateString);
    newDate.setHours(0);
    newDate.setMinutes(0);
    // newDate.setTime(newDate.getTime() + today.getTimezoneOffset() * 60 * 1000);
    console.log('day', day);
    if (today.getTime() >= newDate.getTime()) {
      this.setState({ratingsSelectedDate: day.dateString});
    }
  };

  onDayorWeekPress = (dayObj) => {
    if(this.state.selectDayOption == '1 day') {
      const today = new Date();
      today.setHours(23);
      today.setMinutes(59);
      const newDate = new Date(dayObj.dateString);
      newDate.setHours(0);
      newDate.setMinutes(0);
      if (today.getTime() >= newDate.getTime()) {
        if(this.state.tabActive == 1) {
          this.setState({ ratingsSelectedDate: dayObj.dateString});
        } else if(this.state.tabActive == 2) {
          this.setState({ nutrientsSelected: dayObj.dateString});
        } else if(this.state.tabActive == 3) {
          this.setState({ caloriesSelected: dayObj.dateString});
        }
      }
    } else {
      try {
        const { start, end } = this.state;
        const { dateString } = dayObj;
        const startIsEmpty = _isEmpty(start);
        if (startIsEmpty || (!startIsEmpty && !_isEmpty(end))) {
          const period = {
            [dateString]: {
              color: "rgb(0,164,228)",
              textColor: "rgb(255,255,255)",
              endingDay: true,
              startingDay: true,
            },
          };
          this.setState({ start: dateString, period, end: undefined });
        } else {
          // if end date is older than start date switch
          let endDate;
          let startDate;
          if(moment(start, "YYYY-MM-DD").isBefore(dateString,"YYYY-MM-DD")) {           
            endDate = moment(start, "YYYY-MM-DD").add(6, 'days').format('YYYY-MM-DD');
            startDate = start;
          } else if(moment(start, "YYYY-MM-DD").isAfter(dateString,"YYYY-MM-DD")) {
            startDate = moment(start, "YYYY-MM-DD").subtract(6, 'days').format('YYYY-MM-DD');
            endDate = start;
          }
          console.log('new_date======>>>........', startDate, endDate)
          this.getPeriod(startDate, endDate);
        }
      } catch (err) {
        this.setState(() => {
          throw err;
        });
      }
    }
  }

  getPeriod = (startDate, endDate) => {
    let period = {}
    for (var m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
      period[m.format('YYYY-MM-DD')] = {
        color:
        startDate === m.format('YYYY-MM-DD') || endDate === m.format('YYYY-MM-DD')
          ? "rgb(0,168,235)"
          : "rgb(205,239,250)",
        startingDay: startDate === m.format('YYYY-MM-DD') ? true : false,
        endingDay: endDate === m.format('YYYY-MM-DD') ? true : false,
        textColor:
          startDate === m.format('YYYY-MM-DD') || endDate === m.format('YYYY-MM-DD')
            ? "rgb(255,255,255)"
            : "rgb(38,42,47)",
        selected: true,
        selectedColor: "red",
        marked: true,              
      };
    }
    this.setState({ start: startDate, end: endDate, period });
  }

  dayPickerSelection = (day) => {
    this.setState({ selectDayOption: day });
  }

  dayPickerSelectionDone = () => {
    if(this.state.tabActive == 1) {
      this.setState({ daySelectionPicker: false, isRatingsCalendarVisible: true });
    } else if(this.state.tabActive == 2) {
      this.setState({ daySelectionPicker: false, isNutrientsCalendarVisible: true });
    } else if(this.state.tabActive == 3) {
      this.setState({ daySelectionPicker: false, isCaloriesCalendarVisible: true });
    }
  }

  onCalendarDoneNutrientsPress = async () => {
    if(this.state.selectDayOption == '1 day' && this.state.nutrientsSelected == undefined) {
      Alert.alert('Please select date')
    } else if(this.state.selectDayOption == '7 day' && (this.state.start == undefined || this.state.end == undefined)) {
      Alert.alert('Please select start date and end date')
    } else {
      this.setState({isNutrientsCalendarVisible: false});
      if(this.state.selectDayOption == '1 day') {
        this.micronutrientsDates[this.state.micronutrientsPosition] = this.state.nutrientsSelected;
        this.setState({
          isDayNutrients: true,
          currentDayNutrients: this.micronutrientsDates[this.state.micronutrientsPosition]
        })  
      } else if(this.state.selectDayOption == '7 day') {    
        this.micronutrientsDates[this.state.micronutrientsPosition] = [this.state.start, this.state.end];      
        this.setState({
          isDayNutrients: false,
          currentWeekNutrients: this.micronutrientsDates[this.state.micronutrientsPosition]
        })  
      }
      this.getMicronutrientsData();
    }
  };

  onCalendarDoneCaloriesPress = () => {
    if(this.state.selectDayOption == '1 day' && this.state.caloriesSelected == undefined) {
      Alert.alert('Please select date')
    } else if(this.state.selectDayOption == '7 day' && (this.state.start == undefined || this.state.end == undefined)) {
      Alert.alert('Please select start date and end date')
    } else {
      this.setState({ isCaloriesCalendarVisible: false});
      if(this.state.selectDayOption == '1 day') {
        this.caloriesDates[this.state.caloriesPosition] = this.state.caloriesSelected;
        this.setState({
          isDayCalories: true,
          currentDayCalories: this.caloriesDates[this.state.caloriesPosition]
        })  
      } else if(this.state.selectDayOption == '7 day') {    
        this.caloriesDates[this.state.caloriesPosition] = [this.state.start, this.state.end];      
        this.setState({
          isDayCalories: false,
          currentWeekCalories: this.caloriesDates[this.state.caloriesPosition]
        })  
      }
      this.getCaloriesData();
    }
  }

  onCalendarDonePress = async () => {
    this.setState({isCalendarVisible: false});
    console.log('selected', this.state.selected);

    this.getFoodDiaryMealPreferences(this.state.selected);

    // const water = await shaefitApi.getWaterIntake(this.state.selected);
    // this.setState({water: water.mls});
    this.getWaterIntake();

    // console.log('onCalendarDonePress water', water);
  };

  onRatingsCalendarDonePress = async () => {
    // this.setState({
    //   isRatingsCalendarVisible: false,
    //   isDayRatings: true,
    //   currentDayRatings: this.state.ratingsSelectedDate,
    // });
    // console.log('ratingsSelectedDate', this.state.ratingsSelectedDate);

    // this.foodRatingDates[4] = this.state.ratingsSelectedDate;
    // this.getFoodRatingData(this.state.ratingsSelectedDate);
    if(this.state.selectDayOption == '1 day' && this.state.ratingsSelectedDate == undefined) {
      Alert.alert('Please select date')
    } else if(this.state.selectDayOption == '7 day' && (this.state.start == undefined || this.state.end == undefined)) {
      Alert.alert('Please select start date and end date')
    } else {
      this.setState({isRatingsCalendarVisible: false});
      if(this.state.selectDayOption == '1 day') {
        this.foodRatingDates[this.state.foodRatingPosition] = this.state.ratingsSelectedDate;
        this.setState({
          isDayRatings: true,
          currentDayRatings: this.foodRatingDates[this.state.foodRatingPosition]
        })  
      } else if(this.state.selectDayOption == '7 day') {    
        this.foodRatingDates[this.state.foodRatingPosition] = [this.state.start, this.state.end];      
        this.setState({
          isDayRatings: false,
          currentWeekRatings: this.foodRatingDates[this.state.foodRatingPosition]
        })  
      }
      this.getFoodRatingData();
    }
  };

  onRatingsMonthChange = (month) => {
    this.setState({ratingsMonthDate: month.dateString}, async () => {
      const lastDayOfMonth = new Date(
        month.dateString.substring(0, 4),
        month.dateString.substring(5, 7),
        0,
      )
        .getDate()
        .toString()
        .padStart(2, '0');

      const data = await shaefitApi.getFoodRatingsStats([
        month.dateString.substring(0, 8) + '01',
        month.dateString.substring(0, 8) + lastDayOfMonth,
      ]);
      console.log('onRatingsMonthChange data', data);

      let datesObject = {};
      for (let i = 0; i < data.length; i++) {
        datesObject[data[i].date] = {
          customStyles: {
            container: {
              borderBottomWidth: 2,
              borderRadius: 0,
              borderBottomColor: 'rgb(0,187,117)',
            },
          },
        };
      }
      this.setState({
        ratingsCalendarMarkedDates: datesObject,
        ratingsCalendarMarkedData: data,
      });
    });
  };

  convertWater = (value) => {
    if (value / 1000 > 1) {
      const pair = Array.from(value.toString());
      pair.splice(1, 0, ',');

      return pair.join('');
    } else {
      return value;
    }
  };

  getFormattedSelectedDate = () => {
    let date = new Date(this.state.selected);
    let time = `${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    date = date.toISOString().substring(0, 11).replace('T', ' ') + time;
    console.log('date', date);

    return date;
  };

  onEmptyGlassPress = (index) => {
    // if (this.state.water < this.state.waterMax) {
    //   this.setState({water: this.state.water + 250}, () => {
    //
    //     // this.setState({waterCollapsed: !this.state.waterCollapsed}, () => {
    //     //   this.setState({waterCollapsed: !this.state.waterCollapsed});
    //     // })
    //
    //     const date = this.getFormattedSelectedDate();
    //
    //     // Need to use PUT
    //     shaefitApi.saveWaterIntake({
    //       date: date,
    //       mls: 250//this.state.water
    //     });
    //   });
    // }

    // this.setState({isGlassFillingActive: true}, () => {
    //   if (typeof this['glassFillingAnimation' + index] !== 'undefined')
    //   this['glassFillingAnimation' + index].play();
    //
    //   setTimeout(() => {
    //     this.setState({isGlassFillingActive: false})
    //   }, 300)
    //
    // });

    // for (let i = 0; i < index; i++) {

    // setTimeout(() => {

    // }, 30)

    // }
    // this.glassFillingAnimation.play();

    const initialWater = this.state.water;

    const date = this.getFormattedSelectedDate();
    const mls = (index + 1) * 250 - initialWater;
    console.log('mls', mls, index);

    shaefitApi.saveWaterIntake({
      date: date,
      mls: mls,
    });

    let animatedIndexes = [];

    for (let i = 0; i < index + 1; i++) {
      // glasses[i] = 1;
      animatedIndexes.push(i);
    }

    this.setState({animatedIndexes});

    if (Platform.OS === 'android') {
      let glasses = this.state.glasses;
      for (let i = 0; i < index + 1; i++) {
        glasses[i] = 1;
      }

      for (let i = index + 1; i < this.state.glasses.length; i++) {
        glasses[i] = 0;
      }

      this.setState({glasses});
    }

    // glasses[index] = (glasses[index] === 0) ? 1 : 0;
    // this.setState({glasses});

    this.setState({water: (index + 1) * 250}, () => {
      // this.setState({waterCollapsed: !this.state.waterCollapsed}, () => {
      //   this.setState({waterCollapsed: !this.state.waterCollapsed});
      // })
    });
  };

  onFillGlassesFinish = (index) => {
    let glasses = this.state.glasses;

    for (let i = 0; i < index + 1; i++) {
      glasses[i] = 1;
    }

    this.setState({glasses, animatedIndexes: []});
  };

  onFilledGlassPress = (index) => {
    const initialWater = this.state.water;

    const date = this.getFormattedSelectedDate();
    const mls = (index + 1) * 250 - initialWater;
    console.log('mls', mls, index);

    let glasses = this.state.glasses;
    for (let i = 0; i < glasses.length; i++) {
      if (i < index + 1) {
        glasses[i] = 1;
      } else {
        glasses[i] = 0;
      }
    }
    // glasses[index] = (glasses[index] === 0) ? 1 : 0;
    this.setState({glasses, animatedIndexes: []});

    shaefitApi.saveWaterIntake({
      date: date,
      mls: mls,
    });

    this.setState({water: (index + 1) * 250}, () => {
      // this.setState({waterCollapsed: !this.state.waterCollapsed}, () => {
      //   this.setState({waterCollapsed: !this.state.waterCollapsed});
      // })
    });
  };

  onWaterSettingsDonePress = () => {
    let goals = this.state.goals;
    goals.WATER.value = this.state.waterMax2;

    let glasses = [];
    glasses.length = this.state.water / 250;
    glasses.fill(1);

    for (let i = 0; i < (goals.WATER.value - this.state.water) / 250; i++) {
      glasses.push(0);
    }

    this.setState({
      glasses,
      waterMax: this.state.waterMax2,
      isWaterSettingsModalVisible: false,
      goals,
    });

    // this.state.selected
    shaefitApi.saveDiaryGoal(goals.WATER);
  };

  onCaloriesSettingsDonePress = () => {
    let goals = this.state.goals;
    goals.CALORIES.value = this.state.caloriesMax2;

    this.setState({isCaloriesModalVisible: false, goals});

    // this.state.selected
    shaefitApi.saveDiaryGoal(goals.CALORIES);
  };

  onAdjustMacrosDonePress = () => {
    if (
      this.state.carbsMax2 + this.state.fatMax2 + this.state.proteinMax2 <=
      500
    ) {
      let goals = this.state.goals;
      // goals.MACRO_CARB.recommended = 100 / (500 / this.state.carbsMax2);
      // goals.MACRO_FAT.recommended = 100 / (500 / this.state.fatMax2);
      // goals.MACRO_PROTIEN.recommended = 100 / (500 / this.state.proteinMax2);
      goals.MACRO_CARB.value = this.state.carbsMax2;
      goals.MACRO_FAT.value = this.state.fatMax2;
      goals.MACRO_PROTIEN.value = this.state.proteinMax2;

      this.setState({isAdjustMacrosVisible: false, goals});

      shaefitApi.saveDiaryGoal(goals.MACRO_CARB);
      shaefitApi.saveDiaryGoal(goals.MACRO_FAT);
      shaefitApi.saveDiaryGoal(goals.MACRO_PROTIEN);
    }
  };

  setPreviousDay = async () => {
    let date = new Date(this.state.selected);
    date.setDate(date.getDate() - 1);
    this.setState({selected: date.toISOString().slice(0, 10)}, async () => {
      this.getFoodDiaryMealPreferences(this.state.selected);
      // const water = await shaefitApi.getWaterIntake(this.state.selected);
      // this.setState({water: water.mls});
      this.getWaterIntake();
    });
  };

  setNextDay = async () => {
    let date = new Date(this.state.selected);
    let today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    console.log('today', today);
    if (today.getTime() - date.getTime() > 1000 * 60 * 60 * 24) {
      date.setDate(date.getDate() + 1);
      this.setState({selected: date.toISOString().slice(0, 10)}, async () => {
        this.getFoodDiaryMealPreferences(this.state.selected);
        // const water = await shaefitApi.getWaterIntake(this.state.selected);
        // this.setState({water: water.mls});
        this.getWaterIntake();
      });
    }
  };

  getFoodRatingPositionValue = () => {
    return this.foodRatingPositionValues[this.state.foodRatingPosition];
  };

  getCaloriesPositionValue = () => {
    return this.caloriesPositionValues[this.state.caloriesPosition];
  };

  getMicronutrientsPositionValue = () => {
    return this.micronutrientsPositionValues[this.state.micronutrientsPosition];
  };

  setPreviousFoodRating = () => {
    // if (this.state.foodRatingPosition < this.foodRatingPositionValues.length - 1) {
    //   this.setState({foodRatingPosition: this.state.foodRatingPosition + 1});
    //   this.getFoodRatingData();
    // }
    if (this.state.isDayRatings) {
      let data = this.state.currentDayRatings;

      console.log('setPreviousRatings data', data);
      let date = new Date(
        data.substring(0, 4),
        parseInt(data.substring(5, 7)) - 1,
        data.substring(8, 10),
        12,
      );
      date.setDate(date.getDate() - 1);
      console.log('setPreviousRatings', date);
      console.log('setPreviousRatings', this.foodRatingDates);
      date = date.toISOString().slice(0, 10);

      let array = this.state.daysRatings;
      array.push(date);
      this.setState({daysRatings: array, currentDayRatings: date});
      console.log('setPreviousRatings', date);
      if(this.state.foodRatingPosition == 4) {
        this.foodRatingDates[this.state.foodRatingPosition] = date;
        this.setState({ ratingsSelectedDate: date });
      }
      this.getFoodRatingData(date);
    } else {
      let data = this.state.currentWeekRatings;

      let previousWeek = this.getPreviousWeekRatings();
      console.log('previousWeek', previousWeek, this.state.currentWeekRatings);
      let array = this.state.weeksRatings;
      array.push(previousWeek);
      this.setState({weeksRatings: array, currentWeekRatings: previousWeek});
      if(this.state.foodRatingPosition == 4) {
        this.foodRatingDates[this.state.foodRatingPosition] = previousWeek;
        this.setState({ start: previousWeek[0], end: previousWeek[1] });
        this.getPeriod(previousWeek[0], previousWeek[1]);
      }
      this.getFoodRatingData(previousWeek);
    }
  };

  setNextFoodRating = () => {
    // if (this.state.foodRatingPosition !== 0) {
    //   this.setState({foodRatingPosition: this.state.foodRatingPosition - 1});
    //   this.getFoodRatingData();
    // }

    if (this.state.isDayRatings) {
      if (this.state.currentDayRatings !== this.state.daysRatings[0]) {
        let date = new Date(
          this.state.currentDayRatings.substring(0, 4),
          parseInt(this.state.currentDayRatings.substring(5, 7)) - 1,
          this.state.currentDayRatings.substring(8, 10),
          12,
        );
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);

        this.setState({currentDayRatings: date});        
        if(this.state.foodRatingPosition == 4) {
          this.foodRatingDates[this.state.foodRatingPosition] = date;
          this.setState({ ratingsSelectedDate: date });
        }
        this.getFoodRatingData(date);
      }
    } else {
      if (this.state.currentWeekRatings[0] !== this.state.weeksRatings[0][0]) {
        let data = this.state.currentWeekRatings[1];

        let date = new Date(
          data.substring(0, 4),
          parseInt(data.substring(5, 7)) - 1,
          data.substring(8, 10),
          12,
        );
        let day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? +7 : 0);
        date.setDate(diff);
        const lastDate = new Date(date).toISOString().slice(0, 10);
        let firstDate = new Date(date);
        firstDate.setDate(firstDate.getDate() - 6);

        // let date = new Date(this.state.currentDay.substring(0, 4), parseInt(this.state.currentDay.substring(5, 7)) - 1, this.state.currentDay.substring(8, 10), 12);
        // date.setDate(date.getDate() + 1);
        // date = date.toISOString().slice(0,10);

        let week = [firstDate.toISOString().slice(0, 10), lastDate];
        if (week[0] === this.state.weeksRatings[0][0]) {
          week = this.state.weeksRatings[0];
        } else if (week[0] === this.state.weeksRatings[1][0]) {
          week = this.state.weeksRatings[1];
        }

        this.setState({currentWeekRatings: week});
        if(this.state.foodRatingPosition == 4) {
          this.foodRatingDates[this.state.foodRatingPosition] = week;
          this.setState({ start: week[0], end: week[1] });
          this.getPeriod(week[0], week[1]);
        }
        this.getFoodRatingData(week);
      }
    }
  };

  setPreviousMicronutrients = () => {
    // if (this.state.micronutrientsPosition < this.micronutrientsPositionValues.length - 1) {
    //   this.setState({micronutrientsPosition: this.state.micronutrientsPosition + 1});
    //   this.getMicronutrientsData();
    // }
    if (this.state.isDayNutrients) {
      let data = this.state.currentDayNutrients;

      console.log('setPreviousMicronutrients data', data);
      let date = new Date(
        data.substring(0, 4),
        parseInt(data.substring(5, 7)) - 1,
        data.substring(8, 10),
        12,
      );
      date.setDate(date.getDate() - 1);
      console.log('setPreviousMicronutrients', date);
      console.log('setPreviousMicronutrients', this.micronutrientsDates);
      date = date.toISOString().slice(0, 10);

      let array = this.state.daysNutrients;
      array.push(date);
      this.setState({daysNutrients: array, currentDayNutrients: date});
      console.log('setPreviousMicronutrients', date);
      if(this.state.micronutrientsPosition == 4) {
        this.micronutrientsDates[this.state.micronutrientsPosition] = date;
        this.setState({ nutrientsSelected: date });
      }
      this.getMicronutrientsData(date);
    } else {
      let data = this.state.currentWeekNutrients;

      let previousWeek = this.getPreviousWeekNutrients();
      console.log(
        'previousWeek',
        previousWeek,
        this.state.currentWeekNutrients,
      );
      let array = this.state.weeksNutrients;
      array.push(previousWeek);
      this.setState({
        weeksNutrients: array,
        currentWeekNutrients: previousWeek,
      });
      if(this.state.micronutrientsPosition == 4) {
        this.micronutrientsDates[this.state.micronutrientsPosition] = previousWeek;
        this.setState({ start: previousWeek[0], end: previousWeek[1] });
        this.getPeriod(previousWeek[0], previousWeek[1]);
      }
      this.getMicronutrientsData(previousWeek);
    }
  };

  setNextMicronutrients = () => {
    // if (this.state.micronutrientsPosition !== 0) {
    //   this.setState({micronutrientsPosition: this.state.micronutrientsPosition - 1});
    //   this.getMicronutrientsData();
    // }

    if (this.state.isDayNutrients) {
      if (this.state.currentDayNutrients !== this.state.daysNutrients[0]) {
        let date = new Date(
          this.state.currentDayNutrients.substring(0, 4),
          parseInt(this.state.currentDayNutrients.substring(5, 7)) - 1,
          this.state.currentDayNutrients.substring(8, 10),
          12,
        );
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);

        this.setState({currentDayNutrients: date});
        if(this.state.micronutrientsPosition == 4) {
          this.micronutrientsDates[this.state.micronutrientsPosition] = date;
          this.setState({ nutrientsSelected: date });
        }
        this.getMicronutrientsData(date);
      }
    } else {
      if (
        this.state.currentWeekNutrients[0] !== this.state.weeksNutrients[0][0]
      ) {
        let data = this.state.currentWeekNutrients[1];

        let date = new Date(
          data.substring(0, 4),
          parseInt(data.substring(5, 7)) - 1,
          data.substring(8, 10),
          12,
        );
        let day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? +7 : 0);
        date.setDate(diff);
        const lastDate = new Date(date).toISOString().slice(0, 10);
        let firstDate = new Date(date);
        firstDate.setDate(firstDate.getDate() - 6);

        // let date = new Date(this.state.currentDay.substring(0, 4), parseInt(this.state.currentDay.substring(5, 7)) - 1, this.state.currentDay.substring(8, 10), 12);
        // date.setDate(date.getDate() + 1);
        // date = date.toISOString().slice(0,10);

        let week = [firstDate.toISOString().slice(0, 10), lastDate];
        if (week[0] === this.state.weeksNutrients[0][0]) {
          week = this.state.weeksNutrients[0];
        } else if (week[0] === this.state.weeksNutrients[1][0]) {
          week = this.state.weeksNutrients[1];
        }

        this.setState({currentWeekNutrients: week});
        if(this.state.micronutrientsPosition == 4) {
          this.micronutrientsDates[this.state.micronutrientsPosition] = week;
          this.setState({ start: week[0], end: week[1] });
          this.getPeriod(week[0], week[1]);
        }
        this.getMicronutrientsData(week);
      }
    }
  };

  getPreviousWeekNutrients = () => {
    let data = this.state.currentWeekNutrients[1];

    let date = new Date(
      data.substring(0, 4),
      parseInt(data.substring(5, 7)) - 1,
      data.substring(8, 10),
      12,
    );
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -7 : 0);
    date = date.setDate(diff);
    const lastDate = new Date(date).toISOString().slice(0, 10);
    let firstDate = new Date(date);
    firstDate.setDate(firstDate.getDate() - 6);

    return [firstDate.toISOString().slice(0, 10), lastDate];
  };

  getPreviousWeekRatings = () => {
    let data = this.state.currentWeekRatings[1];

    let date = new Date(
      data.substring(0, 4),
      parseInt(data.substring(5, 7)) - 1,
      data.substring(8, 10),
      12,
    );
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -7 : 0);
    date = date.setDate(diff);
    const lastDate = new Date(date).toISOString().slice(0, 10);
    let firstDate = new Date(date);
    firstDate.setDate(firstDate.getDate() - 6);

    return [firstDate.toISOString().slice(0, 10), lastDate];
  };

  getPreviousWeekCalories = () => {
    let data = this.state.currentWeekCalories[1];

    let date = new Date(
      data.substring(0, 4),
      parseInt(data.substring(5, 7)) - 1,
      data.substring(8, 10),
      12,
    );
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -7 : 0);
    date = date.setDate(diff);
    const lastDate = new Date(date).toISOString().slice(0, 10);
    let firstDate = new Date(date);
    firstDate.setDate(firstDate.getDate() - 6);

    return [firstDate.toISOString().slice(0, 10), lastDate];
  };

  setPreviousCalories = () => {
    // if (this.state.caloriesPosition < this.caloriesPositionValues.length - 1) {
    //   this.setState({caloriesPosition: this.state.caloriesPosition + 1});
    //   this.getCaloriesData();
    // }
    if (this.state.isDayCalories) {
      let data = this.state.currentDayCalories;

      console.log('setPreviousCalories data', data);
      let date = new Date(
        data.substring(0, 4),
        parseInt(data.substring(5, 7)) - 1,
        data.substring(8, 10),
        12,
      );
      date.setDate(date.getDate() - 1);
      console.log('setPreviousCalories', date);
      console.log('setPreviousCalories', this.caloriesDates);
      date = date.toISOString().slice(0, 10);

      let array = this.state.daysCalories;
      array.push(date);
      this.setState({daysCalories: array, currentDayCalories: date});
      console.log('setPreviousCalories', date);
      if(this.state.caloriesPosition == 4) {
        this.caloriesDates[this.state.caloriesPosition] = date;
        this.setState({ caloriesSelected: date });
      }
      this.getCaloriesData(date);
    } else {
      let data = this.state.currentWeekCalories;

      let previousWeek = this.getPreviousWeekCalories();
      console.log('previousWeek', previousWeek, this.state.currentWeekCalories);
      let array = this.state.weeksCalories;
      array.push(previousWeek);
      this.setState({
        weeksCalories: array,
        currentWeekCalories: previousWeek,
      });
      if(this.state.caloriesPosition == 4) {
        this.caloriesDates[this.state.caloriesPosition] = previousWeek;
        this.setState({ start: previousWeek[0], end: previousWeek[1] });
        this.getPeriod(previousWeek[0], previousWeek[1]);
      }
      this.getCaloriesData(previousWeek);
    }
  };

  setNextCalories = () => {
    // if (this.state.caloriesPosition !== 0) {
    //   this.setState({caloriesPosition: this.state.caloriesPosition - 1});
    //   this.getCaloriesData();
    // }

    if (this.state.isDayCalories) {
      if (this.state.currentDayCalories !== this.state.daysCalories[0]) {
        let date = new Date(
          this.state.currentDayCalories.substring(0, 4),
          parseInt(this.state.currentDayCalories.substring(5, 7)) - 1,
          this.state.currentDayCalories.substring(8, 10),
          12,
        );
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);

        this.setState({currentDayCalories: date});
        if(this.state.caloriesPosition == 4) {
          this.caloriesDates[this.state.caloriesPosition] = date;
          this.setState({ caloriesSelected: date });
        }
        this.getCaloriesData(date);
      }
    } else {
      if (
        this.state.currentWeekCalories[0] !== this.state.weeksCalories[0][0]
      ) {
        console.log(
          'setNextCalories',
          this.state.currentWeekCalories[0],
          this.state.weeksCalories,
        );
        let data = this.state.currentWeekCalories[1];

        let date = new Date(
          data.substring(0, 4),
          parseInt(data.substring(5, 7)) - 1,
          data.substring(8, 10),
          12,
        );
        let day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? +7 : 0);
        date.setDate(diff);
        const lastDate = new Date(date).toISOString().slice(0, 10);
        let firstDate = new Date(date);
        firstDate.setDate(firstDate.getDate() - 6);

        // let date = new Date(this.state.currentDay.substring(0, 4), parseInt(this.state.currentDay.substring(5, 7)) - 1, this.state.currentDay.substring(8, 10), 12);
        // date.setDate(date.getDate() + 1);
        // date = date.toISOString().slice(0,10);

        let week = [firstDate.toISOString().slice(0, 10), lastDate];
        if (week[0] === this.state.weeksCalories[0][0]) {
          week = this.state.weeksCalories[0];
        } else if (week[0] === this.state.weeksCalories[1][0]) {
          week = this.state.weeksCalories[1];
        }

        this.setState({currentWeekCalories: week});
        if(this.state.caloriesPosition == 4) {
          this.caloriesDates[this.state.caloriesPosition] = week;
          this.setState({ start: week[0], end: week[1] });
          this.getPeriod(week[0], week[1]);
        }
        this.getCaloriesData(week);
      }
    }
  };

  getCaloriesData = (date) => {
    setTimeout(async () => {
      this.setState({isLoadingCalories: true});
      let data;
      if (typeof date !== 'undefined') {
        data = await shaefitApi.getCaloriesStats(date);
      } else {
        data = await shaefitApi.getCaloriesStats(
          this.caloriesDates[this.state.caloriesPosition],
        );
      }

      console.log('getCaloriesData data', data);
      this.setState({caloriesData: data});

      // if (!Array.isArray(this.caloriesDates[this.state.caloriesPosition])) {
      if (this.state.isDayCalories) {
        let caloriesSections = [];
        let index =
          typeof date !== 'undefined'
            ? date
            : this.caloriesDates[this.state.caloriesPosition];

        if (
          data.data.length !== 0 &&
          data.data[index].hasOwnProperty('Breakfast')
        ) {
          // caloriesSections.push({
          //   percentage: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]].Breakfast.precent),
          //   color: 'rgb(244,88,152)',
          // });

          caloriesSections.push({
            value: parseFloat(data.data[index].Breakfast.precent),
            svg: {
              fill: 'rgb(244,88,152)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintCaloriesModalVisible: true,
                  hintCaloriesValue: data.data[index].Breakfast.value,
                  hintCaloriesText: 'Breakfast',
                  hintCaloriesPercentage: data.data[index].Breakfast.precent,
                  hintCaloriesImage: require('../resources/icon/breakfast_small.png'),
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
            },
            key: 0,
          });
        }

        if (
          data.data.length !== 0 &&
          data.data[index].hasOwnProperty('Lunch')
        ) {
          // caloriesSections.push({
          //   percentage: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]].Lunch.precent),
          //   color: 'rgb(245,121,75)',
          // });

          caloriesSections.push({
            value: parseFloat(data.data[index].Lunch.precent),
            svg: {
              fill: 'rgb(245,121,75)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintCaloriesModalVisible: true,
                  hintCaloriesValue: data.data[index].Lunch.value,
                  hintCaloriesText: 'Lunch',
                  hintCaloriesPercentage: data.data[index].Lunch.precent,
                  hintCaloriesImage: require('../resources/icon/lunch_small.png'),
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
              // onPress: () => this.setState({isHintModalVisible: true, hintValue: greatTotal, hintColor: 'rgb(0,187,116)', hintText: 'Excellent & Great'}),
            },
            key: 1,
          });
        }

        if (
          data.data.length !== 0 &&
          data.data[index].hasOwnProperty('Dinner')
        ) {
          // caloriesSections.push({
          //   percentage: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]].Dinner.precent),
          //   color: 'rgb(0,187,116)',
          // });

          caloriesSections.push({
            value: parseFloat(data.data[index].Dinner.precent),
            svg: {
              fill: 'rgb(0,187,116)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintCaloriesModalVisible: true,
                  hintCaloriesValue: data.data[index].Dinner.value,
                  hintCaloriesText: 'Dinner',
                  hintCaloriesPercentage: data.data[index].Dinner.precent,
                  hintCaloriesImage: require('../resources/icon/dinner_small.png'),
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
              // onPress: () => this.setState({isHintModalVisible: true, hintValue: greatTotal, hintColor: 'rgb(0,187,116)', hintText: 'Excellent & Great'}),
            },
            key: 2,
          });
        }

        let snacksValue = 0;
        let snacksPercentage = 0;
        if (
          data.data.length !== 0 &&
          data.data[index].hasOwnProperty('Morning Snack')
        ) {
          // caloriesSections.push({
          //   percentage: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]]['Morning Snack'].precent),
          //   color: 'rgb(0,164,228)',
          // });
          snacksValue += parseFloat(data.data[index]['Morning Snack'].precent);
          snacksPercentage += parseFloat(
            data.data[index]['Morning Snack'].value,
          );

          // caloriesSections.push({
          //   value: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]]['Morning Snack'].precent),
          //   svg: {
          //     fill: 'rgb(0,164,228)',
          //     // onPress: () => this.setState({isHintModalVisible: true, hintValue: greatTotal, hintColor: 'rgb(0,187,116)', hintText: 'Excellent & Great'}),
          //   },
          //   key: 3
          // })
        }

        if (
          data.data.length !== 0 &&
          data.data[index].hasOwnProperty('Afternoon Snack')
        ) {
          // caloriesSections.push({
          //   percentage: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]]['Afternoon Snack'].precent),
          //   color: 'rgb(0,164,228)',
          // });
          snacksValue += parseFloat(
            data.data[index]['Afternoon Snack'].precent,
          );
          snacksPercentage += parseFloat(
            data.data[index]['Afternoon Snack'].value,
          );

          // caloriesSections.push({
          //   value: parseFloat(data.data[this.caloriesDates[this.state.caloriesPosition]]['Afternoon Snack'].precent),
          //   svg: {
          //     fill: 'rgb(0,164,228)',
          //     // onPress: () => this.setState({isHintModalVisible: true, hintValue: greatTotal, hintColor: 'rgb(0,187,116)', hintText: 'Excellent & Great'}),
          //   },
          //   key: 4
          // })
        }

        if (snacksValue !== 0) {
          caloriesSections.push({
            value: snacksValue,
            svg: {
              fill: 'rgb(0,164,228)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintCaloriesModalVisible: true,
                  hintCaloriesValue: snacksPercentage,
                  hintCaloriesText: 'Snacks',
                  hintCaloriesPercentage: snacksValue,
                  hintCaloriesImage: require('../resources/icon/snacks_small.png'),
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
              // onPress: () => this.setState({isHintModalVisible: true, hintValue: greatTotal, hintColor: 'rgb(0,187,116)', hintText: 'Excellent & Great'}),
            },
            key: 3,
          });
        }

        this.setState({isLoadingCalories: false}, () => {
          this.setState({caloriesSections});
        });
      } else {
        let weekArray = [];

        Object.entries(data.data).forEach(([key, value]) => {
          const date = key;

          let object = {};
          if (value.hasOwnProperty('Breakfast')) {
            object.Breakfast = Math.round(value.Breakfast.value);
          }
          if (value.hasOwnProperty('Lunch')) {
            object.Lunch = Math.round(value.Lunch.value);
          }
          if (value.hasOwnProperty('Dinner')) {
            object.Dinner = Math.round(value.Dinner.value);
          }
          if (value.hasOwnProperty('Snacks')) {
            object.Snacks = Math.round(value.Snacks.value);
          }

          if (value.hasOwnProperty('Morning Snack')) {
            object.Snacks = Math.round(value['Morning Snack'].value);
          }

          if (value.hasOwnProperty('Afternoon Snack')) {
            object.Snacks = Math.round(value['Afternoon Snack'].value);
          }

          weekArray.push({
            date: date,
            ...object,
          });
        });

        this.setState({isLoadingCalories: false}, () => {
          this.setState({caloriesWeekArray: weekArray});
          setTimeout(() => {
            this.setState({caloriesWeekArray: weekArray});
          }, 300);
        });

        console.log('weekArray', weekArray);
      }
    }, 20);
  };

  getMicronutrientsData = (date) => {
    setTimeout(async () => {
      this.setState({isLoadingNutrients: true});

      if (this.state.isMicronutrientsActive) {
        let data;
        if (typeof date !== 'undefined') {
          data = await shaefitApi.getMicronutrientsStats(date);
        } else {
          data = await shaefitApi.getMicronutrientsStats(
            this.micronutrientsDates[this.state.micronutrientsPosition],
          );
        }
        // const data = await shaefitApi.getMicronutrientsStats(this.micronutrientsDates[this.state.micronutrientsPosition]);
        console.log('getMicronutrientsStats data', data);
        let isEmpty = true;
        for (let i = 0; i < data.length; i++) {
          if (data[i].value !== null) {
            isEmpty = false;
            break;
          }
        }
        this.setState({isLoadingNutrients: false}, () => {
          this.setState({
            micronutrientsData: data,
            isMicronutrientsEmpty: isEmpty,
          });
        });

        // setTimeout(() => {
        //
        // }, 20)
      } else {
        let data;
        if (typeof date !== 'undefined') {
          data = await shaefitApi.getMacronutrientsStats(date);
        } else {
          data = await shaefitApi.getMacronutrientsStats(
            this.micronutrientsDates[this.state.micronutrientsPosition],
          );
        }
        // const data = await shaefitApi.getMacronutrientsStats(this.micronutrientsDates[this.state.micronutrientsPosition]);
        console.log('getMacronutrientsStats data', data);
        this.setState({macronutrientsData: data});

        let macronutrientsPieChartData = [];
        if (data.length === 1) {
          macronutrientsPieChartData.push({
            value:
              typeof data[0].carbs === 'undefined' ||
              typeof data[0].carbs.precent === 'undefined'
                ? 0
                : data[0].carbs.precent,
            svg: {
              fill: 'rgb(105,88,232)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue:
                    typeof data[0].carbs === 'undefined' ||
                    typeof data[0].carbs.precent === 'undefined'
                      ? 0
                      : data[0].carbs.precent,
                  hintNutrientsColor: 'rgb(105,88,232)',
                  hintNutrientsText: 'Carbohydrates',
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
            },
            key: 0,
          });

          macronutrientsPieChartData.push({
            value:
              typeof data[0].fat_total === 'undefined' ||
              typeof data[0].fat_total.precent === 'undefined'
                ? 0
                : data[0].fat_total.precent,
            svg: {
              fill: 'rgb(42,204,197)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue:
                    typeof data[0].fat_total === 'undefined' ||
                    typeof data[0].fat_total.precent === 'undefined'
                      ? 0
                      : data[0].fat_total.precent,
                  hintNutrientsColor: 'rgb(42,204,197)',
                  hintNutrientsText: 'Fat',
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
            },
            key: 1,
          });

          macronutrientsPieChartData.push({
            value:
              typeof data[0].protein === 'undefined' ||
              typeof data[0].protein.precent === 'undefined'
                ? 0
                : data[0].protein.precent,
            svg: {
              fill: 'rgb(234,196,50)',
              onPress: () => {
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue:
                    typeof data[0].protein === 'undefined' ||
                    typeof data[0].protein.precent === 'undefined'
                      ? 0
                      : data[0].protein.precent,
                  hintNutrientsColor: 'rgb(234,196,50)',
                  hintNutrientsText: 'Protein',
                });
                this.scrollviewVertical.scrollTo({
                  x: 0,
                  y: 0,
                  animated: true,
                });
              },
            },
            key: 2,
          });
        }

        this.setState({isLoadingNutrients: false}, () => {
          this.setState({macronutrientsPieChartData});
        });

        // setTimeout(() => {
        //
        // }, 20)
      }

      // this.setState({isLoadingNutrients: false});
    }, 20);
  };

  setCaloriesPositionValue = (value) => {
    for (let i = 0; i < this.caloriesPositionValues.length; i++) {
      if (this.caloriesPositionValues[i] === value) {
        this.setState({caloriesWheelPosition: i});
        break;
      }
    }

    // this.getCaloriesData();
  };

  setMicronutrientsPositionValue = (value) => {
    for (let i = 0; i < this.micronutrientsPositionValues.length; i++) {
      if (this.micronutrientsPositionValues[i] === value) {
        this.setState({micronutrientsWheelPosition: i});
        break;
      }
    }

    // this.getMicronutrientsData();
  };

  getMappedDateNutrients = () => {
    if (this.state.isDayNutrients) {
      let day = '';
      for (let i = 0; i < this.micronutrientsDates.length; i++) {
        console.log(
          'getMappedDate',
          this.micronutrientsDates[i],
          this.state.currentDayNutrients,
        );
        if (this.micronutrientsDates[i] === this.state.currentDayNutrients) {
          if (i === 0) {
            day = 'Today';
          } else if (i === 1) {
            day = 'Yesterday';
          }

          break;
        }
      }

      if (day !== '') {
        return day;
      } else {
        console.log('this.state.currentDay', this.state.currentDayNutrients);
        return `${this.getMonthName(
          this.state.currentDayNutrients?.substring(5, 7),
        )} ${this.state.currentDayNutrients?.substring(8, 10)}`;
      }
    } else {
      if(this.state.micronutrientsPosition == 4) {
        return `${this.state.currentWeekNutrients[0]?.substring(
          8,
          10,
        )} - ${this.state.currentWeekNutrients[1]?.substring(
          8,
          10,
        )} ${this.getMonthName(
          this.state.currentWeekNutrients[1]?.substring(5, 7),
        )}`;
      } else {
      let week = '';
      for (let i = 0; i < this.micronutrientsDates.length; i++) {
        console.log(
          'getMappedDate',
          this.micronutrientsDates[i],
          this.state.currentWeekNutrients,
        );
        console.log(
          'getMappedDate this.props.dates[i][0]',
          this.micronutrientsDates[i][0],
          this.state.currentWeekNutrients[0],
          i,
        );
        console.log(
          'getMappedDate this.props.dates[i][1]',
          this.micronutrientsDates[i][1],
          this.state.currentWeekNutrients[1],
          i,
        );
        if (
          Array.isArray(this.micronutrientsDates[i]) &&
          this.micronutrientsDates[i][0] === this.state.currentWeekNutrients[0]
        ) {
          console.log('condition');
          if (i === 3) {
            week = 'This Week';
          } else if (i === 2) {
            week = 'Last Week';
          }

          break;
        }
      }

      if (week !== '') {
        return week;
      } else {
        console.log('this.state.currentWeek', this.state.currentWeekNutrients);
        return `${this.state.currentWeekNutrients[0].substring(
          8,
          10,
        )} - ${this.state.currentWeekNutrients[1].substring(
          8,
          10,
        )} ${this.getMonthName(
          this.state.currentWeekNutrients[1].substring(5, 7),
        )}`;
      }
    }
    }
  };

  getMappedDateCalories = () => {
    if (this.state.isDayCalories) {
      let day = '';
      for (let i = 0; i < this.caloriesDates.length; i++) {
        console.log(
          'getMappedDate',
          this.caloriesDates[i],
          this.state.currentDayCalories,
        );
        if (this.caloriesDates[i] === this.state.currentDayCalories) {
          if (i === 0) {
            day = 'Today';
          } else if (i === 1) {
            day = 'Yesterday';
          }

          break;
        }
      }

      if (day !== '') {
        return day;
      } else {
        console.log('this.state.currentDay', this.state.currentDayCalories);
        return `${this.getMonthName(
          this.state.currentDayCalories.substring(5, 7),
        )} ${this.state.currentDayCalories.substring(8, 10)}`;
      }
    } else {
      if(this.state.caloriesPosition == 4) {
        return `${this.state.currentWeekCalories[0]?.substring(
          8,
          10,
        )} - ${this.state.currentWeekCalories[1]?.substring(
          8,
          10,
        )} ${this.getMonthName(
          this.state.currentWeekCalories[1]?.substring(5, 7),
        )}`;
      } else {
      let week = '';
      for (let i = 0; i < this.caloriesDates.length; i++) {
        console.log(
          'getMappedDate',
          this.caloriesDates[i],
          this.state.currentWeekCalories,
        );
        console.log(
          'getMappedDate this.props.dates[i][0]',
          this.caloriesDates[i][0],
          this.state.currentWeekCalories[0],
          i,
        );
        console.log(
          'getMappedDate this.props.dates[i][1]',
          this.caloriesDates[i][1],
          this.state.currentWeekCalories[1],
          i,
        );
        if (
          Array.isArray(this.caloriesDates[i]) &&
          this.caloriesDates[i][0] === this.state.currentWeekCalories[0]
        ) {
          console.log('condition');
          if (i === 3) {
            week = 'This Week';
          } else if (i === 2) {
            week = 'Last Week';
          }

          break;
        }
      }

      if (week !== '') {
        return week;
      } else {
        console.log('this.state.currentWeek', this.state.currentWeekCalories);
        return `${this.state.currentWeekCalories[0].substring(
          8,
          10,
        )} - ${this.state.currentWeekCalories[1].substring(
          8,
          10,
        )} ${this.getMonthName(
          this.state.currentWeekCalories[1].substring(5, 7),
        )}`;
      }
      }
    }
  };

  getMappedDateRatings = () => {
    if (this.state.isDayRatings) {
      let day = '';
      for (let i = 0; i < this.foodRatingDates.length; i++) {
        // this.foodRatingDates[4] = this.state.ratingsSelectedDate
        console.log(
          'getMappedDate',
          this.foodRatingDates[i],
          this.state.currentDayRatings,
        );
        if (this.foodRatingDates[i] === this.state.currentDayRatings) {
          if (i === 0) {
            day = 'Today';
          } else if (i === 1) {
            day = 'Yesterday';
          }

          break;
        }
      }

      if (day !== '') {
        return day;
      } else {
        console.log('this.state.currentDay', this.state.currentDayRatings);
        return `${this.getMonthName(
          this.state.currentDayRatings.substring(5, 7),
        )} ${this.state.currentDayRatings.substring(8, 10)}`;
      }
    } else {
      if(this.state.foodRatingPosition == 4) {
        return `${this.state.currentWeekRatings[0]?.substring(
          8,
          10,
        )} - ${this.state.currentWeekRatings[1]?.substring(
          8,
          10,
        )} ${this.getMonthName(
          this.state.currentWeekRatings[1]?.substring(5, 7),
        )}`;
      } else {
      let week = '';
      for (let i = 0; i < this.foodRatingDates.length; i++) {
        console.log(
          'getMappedDate',
          this.foodRatingDates[i],
          this.state.currentWeekRatings,
        );
        console.log(
          'getMappedDate this.props.dates[i][0]',
          this.foodRatingDates[i][0],
          this.state.currentWeekRatings[0],
          i,
        );
        console.log(
          'getMappedDate this.props.dates[i][1]',
          this.foodRatingDates[i][1],
          this.state.currentWeekRatings[1],
          i,
        );
        if (
          Array.isArray(this.foodRatingDates[i]) &&
          this.foodRatingDates[i][0] === this.state.currentWeekRatings[0]
        ) {
          console.log('condition');
          if (i === 3) {
            week = 'This Week';
          } else if (i === 2) {
            week = 'Last Week';
          }

          break;
        }
      }

      if (week !== '') {
        return week;
      } else {
        console.log('this.state.currentWeek', this.state.currentWeekRatings);
        return `${this.state.currentWeekRatings[0].substring(
          8,
          10,
        )} - ${this.state.currentWeekRatings[1].substring(
          8,
          10,
        )} ${this.getMonthName(
          this.state.currentWeekRatings[1].substring(5, 7),
        )}`;
      }
      }
    }
  };

  setFoodRatingPositionValue = (value) => {
    for (let i = 0; i < this.foodRatingPositionValues.length; i++) {
      if (this.foodRatingPositionValues[i] === value) {
        this.setState({foodRatingWheelPosition: i});
        break;
      }
    }

    // this.getFoodRatingData();
  };

  onFoodRatingDonePress = () => {
    console.log('this.state.foodRatingPosition',this.state.foodRatingPosition,this.state.foodRatingWheelPosition)
    this.setState(
      {
        isFoodRatingWheelModalVisible: false,
        foodRatingPosition: this.state.foodRatingWheelPosition,
      },
      () => {
        if (this.state.foodRatingWheelPosition === 4) {
          this.setState({ isRatingsCalendarVisible: false, daySelectionPicker: true });
        } else {
          if (
            Array.isArray(this.foodRatingDates[this.state.foodRatingPosition])
          ) {
            this.setState({
              isDayRatings: false,
              currentWeekRatings: this.foodRatingDates[
                this.state.foodRatingPosition
              ],
            });
          } else {
            this.setState({
              isDayRatings: true,
              currentDayRatings: this.foodRatingDates[
                this.state.foodRatingPosition
              ],
            });
          }

          this.getFoodRatingData();
        }
      },
    );
    // if (this.state.foodRatingWheelPosition === 4) {
    //   this.setState({isRatingsCalendarVisible: true});
    // } else {
    //   this.getFoodRatingData();
    // }
  };

  onMicronutrientsDonePress = () => {
    this.setState(
      {
        isMicronutrientsWheelModalVisible: false,
        micronutrientsPosition: this.state.micronutrientsWheelPosition,
      },
      () => {
        if (this.state.micronutrientsWheelPosition === 4) {
            this.setState({ isNutrientsCalendarVisible: false, daySelectionPicker: true });
        } else {
          if (
          Array.isArray(
              this.micronutrientsDates[this.state.micronutrientsPosition],
            )
          ) {
            this.setState({
              isDayNutrients: false,
              currentWeekNutrients: this.micronutrientsDates[
                this.state.micronutrientsPosition
              ],
            });
          } else {
            this.setState({
              isDayNutrients: true,
              currentDayNutrients: this.micronutrientsDates[
                this.state.micronutrientsPosition
              ],
            });
          }
          this.getMicronutrientsData();
        }
      },
    );   
  };

  onCaloriesDonePress = () => {
    this.setState(
      {
        isCaloriesWheelModalVisible: false,
        caloriesPosition: this.state.caloriesWheelPosition,
      },
      () => {
        if (this.state.caloriesWheelPosition === 4) {
          this.setState({ isCaloriesCalendarVisible: false, daySelectionPicker: true });
        } else {
          if (Array.isArray(this.caloriesDates[this.state.caloriesPosition])) {
            this.setState({
              isDayCalories: false,
              currentWeekCalories: this.caloriesDates[
                this.state.caloriesPosition
              ],
            });
          } else {
            this.setState({
              isDayCalories: true,
              currentDayCalories: this.caloriesDates[this.state.caloriesPosition],
            });
          }
          this.getCaloriesData();
        }
      },
    );    
  };

  getFoodRatingData = (date) => {
    setTimeout(async () => {
      this.setState({isLoadingRatings: true});
      let data;
      if (typeof date !== 'undefined') {
        data = await shaefitApi.getFoodRatingsStats(date);
      } else {
        data = await shaefitApi.getFoodRatingsStats(
          this.foodRatingDates[this.state.foodRatingPosition],
        );
      }

      // const data = await shaefitApi.getFoodRatingsStats(this.foodRatingDates[this.state.foodRatingPosition]);
      this.setState({foodRatingData: data}, async () => {
        this.getFoodRatingPercentage();
      });

      if (data.length !== 0) {
        const foods = await shaefitApi.getFoodRatingsStatsFoods(
          typeof date !== 'undefined'
            ? date
            : this.foodRatingDates[this.state.foodRatingPosition],
        );
        console.log('getFoodRatingData foods', foods);

        let foodRatingFoodGreatArray = [];
        let foodRatingFoodOkArray = [];
        let foodRatingFoodAvoidArray = [];

        if (foods.hasOwnProperty('frgrp_54')) {
          foodRatingFoodGreatArray = foods.frgrp_54;
        }

        if (foods.hasOwnProperty('frgrp_21')) {
          foodRatingFoodOkArray = foods.frgrp_21;
        }

        if (foods.hasOwnProperty('frgrp_avoid')) {
          foodRatingFoodAvoidArray = foods.frgrp_avoid;
        }

        this.setState({isLoadingRatings: false}, () => {
          this.setState({
            foodRatingFoodGreatArray,
            foodRatingFoodOkArray,
            foodRatingFoodAvoidArray,
          });
        });
      } else {
        this.setState({isLoadingRatings: false}, () => {
          this.setState({
            foodRatingFoodGreatArray: [],
            foodRatingFoodOkArray: [],
            foodRatingFoodAvoidArray: [],
          });
        });
      }

      console.log('getFoodRatingData', data);
    }, 20);
  };

  getFoodRatingPercentage = () => {
    if (this.state.foodRatingData.length !== 0) {
      let countGreat = 0;
      let countOk = 0;
      let countAvoid = 0;

      let greatTotal = 0;
      let okTotal = 0;
      let avoidTotal = 0;
      let totalValue = 0;

      let foodRatingPieChartData = [];

      for (let i = 0; i < this.state.foodRatingData.length; i++) {
        if (typeof this.state.foodRatingData[i].frgrp_54 !== 'undefined') {
          countGreat += 1;
          greatTotal += this.state.foodRatingData[i].frgrp_54;
          totalValue += this.state.foodRatingData[i].frgrp_54;
        }

        if (typeof this.state.foodRatingData[i].frgrp_21 !== 'undefined') {
          countOk += 1;
          okTotal += this.state.foodRatingData[i].frgrp_21;
          totalValue += this.state.foodRatingData[i].frgrp_21;
        }

        if (typeof this.state.foodRatingData[i].frgrp_avoid !== 'undefined') {
          countAvoid += 1;
          avoidTotal += this.state.foodRatingData[i].frgrp_avoid;
          totalValue += this.state.foodRatingData[i].frgrp_avoid;
        }
      }

      let array = [
        countGreat !== 0 ? parseInt((greatTotal / totalValue) * 100) : 0,
        countOk !== 0 ? parseInt((okTotal / totalValue) * 100) : 0,
        countAvoid !== 0 ? parseInt((avoidTotal / totalValue) * 100) : 0,
      ];

      console.log('counts', greatTotal, okTotal, avoidTotal);

      if (greatTotal !== 0) {
        foodRatingPieChartData.push({
          value: greatTotal,
          svg: {
            fill: 'rgb(0,187,116)',
            onPress: () => {
              this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true});
              this.setState({
                isHintModalVisible: true,
                hintValue: greatTotal,
                hintColor: 'rgb(0,187,116)',
                hintText: 'Excellent & Great',
              });
              this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true});
            },
          },
          key: 0,
        });
      }

      if (okTotal !== 0) {
        foodRatingPieChartData.push({
          value: okTotal,
          svg: {
            fill: 'rgb(234,196,50)',
            onPress: () => {
              this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true});
              this.setState({
                isHintModalVisible: true,
                hintValue: okTotal,
                hintColor: 'rgb(234,196,50)',
                hintText: 'Good, OK, Sometimes',
              });
              this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true});
            },
          },
          key: 1,
        });
      }

      if (avoidTotal !== 0) {
        foodRatingPieChartData.push({
          value: avoidTotal,
          svg: {
            fill: 'rgb(228,77,77)',
            onPress: () => {
              this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true});
              this.setState({
                isHintModalVisible: true,
                hintValue: avoidTotal,
                hintColor: 'rgb(228,77,77)',
                hintText: 'Avoid',
              });
              this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true});
            },
          },
          key: 2,
        });
      }

      this.setState({foodRatingPercentages: array});

      this.setState({foodRatingPieChartData});

      console.log('getFoodRatingPercentage', array, foodRatingPieChartData);
    }
  };

  setFoodRatingsDates = async () => {
    let datesArray = [];
    let today = new Date();
    let yesterday = new Date();

    let todayOffsetHours = -today.getTimezoneOffset() / 60;
    today.setHours(today.getHours() + todayOffsetHours);
    yesterday.setHours(yesterday.getHours() + todayOffsetHours);

    console.log(
      'todayDate',
      today,
      today.toISOString(),
      today.getTimezoneOffset(),
    );

    yesterday.setDate(yesterday.getDate() - 1);

    today = today.toISOString().slice(0, 10);
    yesterday = yesterday.toISOString().slice(0, 10);

    let lastWeek = this.getPreviousWeek();
    let thisWeek = [this.getMonday(), today];

    datesArray.push(today);
    datesArray.push(yesterday);
    datesArray.push(lastWeek);
    datesArray.push(thisWeek);
    datesArray.push("")
    // datesArray.push(
    //   new Date().toISOString().slice(0, 10),
    //   new Date().toISOString().slice(0, 10),
    // );

    console.log('setFoodRatingsDates', datesArray);

    this.foodRatingDates = datesArray;

    this.setState({
      daysRatings: [this.foodRatingDates[0], this.foodRatingDates[1]],
      currentDayRatings: this.foodRatingDates[0],
      weeksRatings: [this.foodRatingDates[3], this.foodRatingDates[2]],
      currentWeekRatings: this.foodRatingDates[3],
    });

    if (this.state.foodRatingsTips === null) {
      const tips = await shaefitApi.getTips('FoodRatings', today);
      // const tips = await shaefitApi.getTips("Calories", "2020-06-28");
      this.setState({foodRatingsTips: tips});
    }
  };

  setMicronutrientsDates = async () => {
    let datesArray = [];
    let today = new Date();
    let yesterday = new Date();

    let todayOffsetHours = -today.getTimezoneOffset() / 60;
    today.setHours(today.getHours() + todayOffsetHours);
    yesterday.setHours(yesterday.getHours() + todayOffsetHours);

    console.log(
      'todayDate',
      today,
      today.toISOString(),
      today.getTimezoneOffset(),
    );

    yesterday.setDate(yesterday.getDate() - 1);

    today = today.toISOString().slice(0, 10);
    yesterday = yesterday.toISOString().slice(0, 10);

    let lastWeek = this.getPreviousWeek();
    let thisWeek = [this.getMonday(), today];

    datesArray.push(today);
    datesArray.push(yesterday);
    datesArray.push(lastWeek);
    datesArray.push(thisWeek);
    datesArray.push("");
    // datesArray.push(new Date().toISOString().slice(0,10), new Date().toISOString().slice(0,10));

    console.log('setMicronutrientsDates', datesArray);

    this.micronutrientsDates = datesArray;

    this.setState({
      daysNutrients: [this.micronutrientsDates[0], this.micronutrientsDates[1]],
      currentDayNutrients: this.micronutrientsDates[0],
      weeksNutrients: [
        this.micronutrientsDates[3],
        this.micronutrientsDates[2],
      ],
      currentWeekNutrients: this.micronutrientsDates[3],
    });

    if (this.state.nutrientsTips === null) {
      const tips = await shaefitApi.getTips('Nutrients', today);
      // const tips = await shaefitApi.getTips("Calories", "2020-06-28");
      this.setState({nutrientsTips: tips});
    }
  };

  setCaloriesDates = async () => {
    let datesArray = [];
    let today = new Date();
    let yesterday = new Date();

    let todayOffsetHours = -today.getTimezoneOffset() / 60;
    today.setHours(today.getHours() + todayOffsetHours);
    yesterday.setHours(yesterday.getHours() + todayOffsetHours);

    console.log(
      'todayDate',
      today,
      today.toISOString(),
      today.getTimezoneOffset(),
    );

    yesterday.setDate(yesterday.getDate() - 1);

    today = today.toISOString().slice(0, 10);
    yesterday = yesterday.toISOString().slice(0, 10);

    let lastWeek = this.getPreviousWeek();
    let thisWeek = [this.getMonday(), today];

    datesArray.push(today);
    datesArray.push(yesterday);
    datesArray.push(lastWeek);
    datesArray.push(thisWeek);
    datesArray.push("");
    // datesArray.push(new Date().toISOString().slice(0,10), new Date().toISOString().slice(0,10));

    console.log('setCaloriesDates', datesArray);

    this.caloriesDates = datesArray;

    this.setState({
      daysCalories: [this.caloriesDates[0], this.caloriesDates[1]],
      currentDayCalories: this.caloriesDates[0],
      weeksCalories: [this.caloriesDates[3], this.caloriesDates[2]],
      currentWeekCalories: this.caloriesDates[3],
    });

    if (this.state.caloriesTips === null) {
      const tips = await shaefitApi.getTips('Calories', today);
      // const tips = await shaefitApi.getTips("Calories", "2020-06-28");
      this.setState({caloriesTips: tips});

      // this.setState({
      //   caloriesTips: {
      //     id: 1329,
      //     tip_id: 46,
      //     date_at: "2020-07-31",
      //     topic: "Calories",
      //     text:
      //       "Did you know that a gram of fat has about 9 calories? It doesn't really matter what kind of fat. Nonetheless, Shae recommends limiting saturated and trans fat and grabbing monounsaturated (MUF) and polyunsaturated (PUFA) instead. Don't know what that is? No worries! Just follow your food list.",
      //     actions: {
      //       actionType: "RECIPE-LIST",
      //       actionData: {
      //         course: [9],
      //         search: "sparkling",
      //         link: "Check some top rated recipes!",
      //       },
      //     },
      //     version: 1,
      //   },
      // });
    }
  };

  getMonday = () => {
    let date = new Date();
    // let todayOffsetHours = -date.getTimezoneOffset() / 60;
    // date.setHours(date.getHours() + todayOffsetHours);

    let todayOffsetHours = -date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + todayOffsetHours);

    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toISOString().slice(0, 10);
  };

  getPreviousWeek = () => {
    let date = new Date();
    // let todayOffsetHours = -date.getTimezoneOffset() / 60;
    // date.setHours(date.getHours() + todayOffsetHours);

    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -7 : 0);
    date.setDate(diff);
    const lastDate = new Date(date).toISOString().slice(0, 10);
    let firstDate = new Date(date);
    firstDate.setDate(firstDate.getDate() - 6);

    return [firstDate.toISOString().slice(0, 10), lastDate];
  };

  getMonthName = (month) => {
    let monthName = '';
    switch (month) {
      case '01':
        monthName = 'Jan';
        break;
      case '02':
        monthName = 'Feb';
        break;
      case '03':
        monthName = 'Mar';
        break;
      case '04':
        monthName = 'Apr';
        break;
      case '05':
        monthName = 'May';
        break;
      case '06':
        monthName = 'Jun';
        break;
      case '07':
        monthName = 'Jul';
        break;
      case '08':
        monthName = 'Aug';
        break;
      case '09':
        monthName = 'Sep';
        break;
      case '10':
        monthName = 'Oct';
        break;
      case '11':
        monthName = 'Nov';
        break;
      case '12':
        monthName = 'Dec';
        break;
      default:
        monthName = 'Jan';
    }

    return monthName;
  };

  onChartPress = (event) => {
    console.log(`x coord = ${evt.nativeEvent.locationX}`);
  };

  getFoodDiaryMappedDate = () => {
    if (this.state.foodDiaryDatesMap.hasOwnProperty(this.state.selected)) {
      return this.state.foodDiaryDatesMap[this.state.selected];
    } else {
      return `${this.getMonthName(
        this.state.selected.substring(5, 7),
      )} ${this.state.selected.substring(8, 10)}`;
    }
  };

  onCaloriesTipPress = () => {
    if (this.state.caloriesTips.actions.actionType === 'RECIPE-LIST') {
      Actions.details({
        key: 'searchFoodScreen',
        // id: this.props.item.id,
        // foodDiaryId: this.props.item.foodDiaryId,
        // mealTypeId: this.props.item.id,
        // entryDate: this.props.entryDate,
        tabIndex: 1,
        recipeCourses: this.state.caloriesTips.actions.actionData.course,
        recipeSearch: this.state.caloriesTips.actions.actionData.search,
      });
    } else if (this.state.caloriesTips.actions.actionType === 'FOOD-LIST') {
      Actions.details({
        key: 'searchFoodScreen',
        tabIndex: 0,
        foodParams: {
          dietType: this.state.caloriesTips.actions.actionData.dietType,
          pointsMore: this.state.caloriesTips.actions.actionData.pointsMore,
          anyFoodCategory: this.state.caloriesTips.actions.actionData
            .anyFoodCategory,
        },
      });
    } else if (this.state.caloriesTips.actions.actionType === 'EXT-URL') {
      Linking.openURL(this.state.caloriesTips.actions.actionData.url);
    }
  };

  onFoodRatingsTipPress = () => {
    if (typeof this.state.foodRatingsTips.actions.actionType === 'undefined') {
      Actions.details({
        key: 'searchFoodScreen',
        // id: this.props.item.id,
        // foodDiaryId: this.props.item.foodDiaryId,
        // mealTypeId: this.props.item.id,
        // entryDate: this.props.entryDate,
        tabIndex: 1,
        recipeCourses: this.state.foodRatingsTips.actions.course,
        recipeSearch: this.state.foodRatingsTips.actions.search,
      });
    } else if (this.state.foodRatingsTips.actions.actionType === 'FOOD-LIST') {
      Actions.details({
        key: 'searchFoodScreen',
        tabIndex: 0,
        foodParams: {
          dietType: this.state.foodRatingsTips.actions.actionData.dietType,
          pointsMore: this.state.foodRatingsTips.actions.actionData.pointsMore,
          anyFoodCategory: this.state.foodRatingsTips.actions.actionData
            .anyFoodCategory,
        },
      });
    } else if (this.state.foodRatingsTips.actions.actionType === 'EXT-URL') {
      Linking.openURL(this.state.foodRatingsTips.actions.actionData.url);
    }
  };

  onNutrientsTipPress = () => {
    console.log('this.state.nutrientTips', this.state.nutrientsTips);
    if (typeof this.state.nutrientsTips.actions.actionType === 'undefined') {
      Actions.details({
        key: 'searchFoodScreen',
        // id: this.props.item.id,
        // foodDiaryId: this.props.item.foodDiaryId,
        // mealTypeId: this.props.item.id,
        // entryDate: this.props.entryDate,
        tabIndex: 1,
        recipeCourses: this.state.nutrientsTips.actions.course,
        recipeSearch: this.state.nutrientsTips.actions.search,
      });
    } else if (this.state.nutrientsTips.actions.actionType === 'FOOD-LIST') {
      Actions.details({
        key: 'searchFoodScreen',
        tabIndex: 0,
        foodParams: {
          dietType: this.state.nutrientsTips.actions.actionData.dietType,
          pointsMore: this.state.nutrientsTips.actions.actionData.pointsMore,
          anyFoodCategory: this.state.nutrientsTips.actions.actionData
            .anyFoodCategory,
        },
      });
    } else if (this.state.nutrientsTips.actions.actionType === 'EXT-URL') {
      Linking.openURL(this.state.nutrientsTips.actions.actionData.url);
    }
  };

  _renderChronoItem = ({item, index}) => {
    return <ChronoListItem index={index} item={item} />;
  };

  wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  onRefresh = () => {
    this.setState({isRefreshing: true});

    this.setFoodRatingsDates();
    this.setMicronutrientsDates();
    this.setCaloriesDates();
    this.getFoodRatingData();
    this.getMicronutrientsData();
    this.getCaloriesData();

    this.wait(2000).then(() => {
      this.setState({isRefreshing: false});
    });
  };

  render() {
    let foodCalories = 0;
    for (let i = 0; i < this.state.foodDiaryArray.length; i++) {
      if (typeof this.state.foodDiaryArray[i].food !== 'undefined') {
        for (let k = 0; k < this.state.foodDiaryArray[i].food.length; k++) {
          foodCalories += Math.round(this.state.foodDiaryArray[i].food[k].kcal);
        }
      }
    }

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)'}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <View style={styles.container}>
          <ScrollView
            horizontal={true}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ref={(ref) => {
              this.scrollViewTop = ref;
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({tabActive: 0}, () => {
                  this.onTabChange(0);
                  this.scrollviewVertical.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                })
              }>
              <View
                style={{
                  height: 48,
                  width: 100,
                  alignItems: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={
                    this.state.tabActive === 0
                      ? styles.tabActiveText
                      : styles.tabInactiveText
                  }>
                  Diary
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({tabActive: 1}, () => {
                  this.onTabChange(1);
                  this.scrollviewVertical.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                })
              }>
              <View
                style={{
                  height: 48,
                  width: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={
                    this.state.tabActive === 1
                      ? styles.tabActiveText
                      : styles.tabInactiveText
                  }>
                  Food Ratings
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({tabActive: 2}, () => {
                  this.onTabChange(2);
                  this.scrollviewVertical.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                })
              }>
              <View
                style={{
                  height: 48,
                  width: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={
                    this.state.tabActive === 2
                      ? styles.tabActiveText
                      : styles.tabInactiveText
                  }>
                  Nutrients
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({tabActive: 3}, () => {
                  this.onTabChange(3);
                  this.scrollviewVertical.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                })
              }>
              <View
                style={{
                  height: 48,
                  width: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={
                    this.state.tabActive === 3
                      ? styles.tabActiveText
                      : styles.tabInactiveText
                  }>
                  Calories
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  width: 100,
                  transform: [{translateX: this.state.indicatorPositionX}],
                },
              ]}
            />
          </ScrollView>
        </View>

        {/*<LottieView source={require('../animations/glassFilling.json')} autoPlay loop />*/}
        {/*<LottieView source={require('../animations/LottieWalkthrough.json')} autoPlay loop />*/}

        <ScrollView
          ref={(ref) => (this.scrollviewVertical = ref)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefresh}
            />
          }>
          {this.state.tabActive === 0 && (
            <View>
              <View
                style={{
                  width: width - 40,
                  height: 44,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  marginTop: 23,
                }}>
                <TouchableWithoutFeedback onPress={this.setPreviousDay}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderRightWidth: 0.5,
                      borderRightColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      left: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/previous.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() => this.setState({isCalendarVisible: true})}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 44,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.dateText}>
                      {typeof this.state.selected !== 'undefined'
                        ? this.getFoodDiaryMappedDate()
                        : 'Today'}
                    </Text>

                    <Image
                      source={require('../resources/icon/arrowDown.png')}
                      style={{marginLeft: 10}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.setNextDay}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderLeftWidth: 0.5,
                      borderLeftColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      right: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/next.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {this.state.isNameLoading ? (
                <ShineOverlay>
                  <View
                    style={{
                      width: width - 195,
                      height: 18,
                      marginTop: 17,
                      borderRadius: 9,
                      backgroundColor: 'rgb(242,243,246)',
                      marginHorizontal: 20,
                    }}
                  />
                </ShineOverlay>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => this.setState({isScheduleModalVisible: true})}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width - 40,
                      alignSelf: 'center',
                      alignItems: 'center',
                      marginTop: 19,
                    }}>
                    <Text style={styles.recommendedText}>
                      {`${this.state.userName}'s Recommended Food Diary`.toUpperCase()}
                    </Text>
                    <Image
                      source={require('../resources/icon/informationIcon.png')}
                      style={{marginLeft: 10}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}

              {this.state.isDiaryLoading ? (
                <ShineOverlay>
                  <View
                    style={{
                      width: width - 40,
                      alignSelf: 'center',
                      marginTop: 16,
                    }}>
                    <View
                      style={{
                        width: width - 40,
                        height: 79,
                        alignSelf: 'center',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: 'rgb(221,224,228)',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 14,
                          marginLeft: 20,
                        }}
                      />
                      <View
                        style={{
                          width: 79,
                          height: 16,
                          borderRadius: 8.5,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 79,
                        alignSelf: 'center',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: 'rgb(221,224,228)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 16,
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 14,
                          marginLeft: 20,
                        }}
                      />
                      <View
                        style={{
                          width: 79,
                          height: 16,
                          borderRadius: 8.5,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 79,
                        alignSelf: 'center',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: 'rgb(221,224,228)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 16,
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 14,
                          marginLeft: 20,
                        }}
                      />
                      <View
                        style={{
                          width: 79,
                          height: 16,
                          borderRadius: 8.5,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 79,
                        alignSelf: 'center',
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: 'rgb(221,224,228)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 16,
                      }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 14,
                          marginLeft: 20,
                        }}
                      />
                      <View
                        style={{
                          width: 79,
                          height: 16,
                          borderRadius: 8.5,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>
                  </View>
                </ShineOverlay>
              ) : (
                <View>
                  {/*<View
                    style={{
                      width: width - 40,
                      height: 79,
                      borderRadius: 4,
                      alignSelf: "center",
                      marginTop: 16,
                      borderWidth: 1,
                      borderColor: "rgb(221,224,228)",
                    }}
                  >
                    <View
                      style={{
                        marginTop: 24,
                        marginBottom: 21,
                        marginHorizontal: 20,
                        flexDirection: "row",
                        alignItems: "space-between",
                        flex: 1,
                      }}
                    >
                      <View style={{ flex: 1, width: 60 }}>
                        <Text style={styles.totalCaloriesNumber}>
                          {this.state.goals !== null
                            ? this.state.goals.CALORIES.value
                            : 0}
                        </Text>
                        <Text style={styles.totalCaloriesName}>Goal</Text>
                      </View>

                      <View
                        style={{
                          // flex: 1,
                          width: 10,
                          height: 34,
                          marginLeft: -15,
                          marginRight: 15,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../resources/icon/minus.png")}
                          // style={{ flex: 1 }}
                        />
                      </View>

                      <View style={{ flex: 1, width: 60 }}>
                        <Text style={styles.totalCaloriesNumber}>
                          {foodCalories}
                        </Text>
                        <Text
                          style={[
                            styles.totalCaloriesName,
                            { color: "rgb(245,121,75)" },
                          ]}
                        >
                          Food
                        </Text>
                      </View>

                      <View
                        style={{
                          // flex: 1,
                          width: 10,
                          height: 34,
                          marginLeft: -15,
                          marginRight: 15,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../resources/icon/plus_calories.png")}
                          // style={{ flex: 1 }}
                        />
                      </View>

                      <View style={{ flex: 1, width: 60 }}>
                        <Text style={styles.totalCaloriesNumber}>0</Text>
                        <Text
                          style={[
                            styles.totalCaloriesName,
                            { color: "rgb(0,187,116)" },
                          ]}
                        >
                          Exercise
                        </Text>
                      </View>

                      <View
                        style={{
                          // flex: 1,
                          marginLeft: -5,
                          marginRight: 15,
                          width: 10,
                          height: 34,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={require("../resources/icon/total.png")}
                          // style={{ flex: 1 }}
                        />
                      </View>

                      <View style={{ flex: 1, width: 60 }}>
                        <Text style={styles.totalCaloriesNumber}>
                          <Text style={styles.totalCaloriesNumber}>
                            {this.state.goals !== null
                              ? this.state.goals.CALORIES.value - foodCalories
                              : 0}
                          </Text>
                        </Text>
                        <Text
                          style={[
                            styles.totalCaloriesName,
                            { color: "rgb(244,88,152)", width: 60 },
                          ]}
                        >
                          Remaining
                        </Text>
                      </View>
                    </View>
                  </View> */}

                  <FlatList
                    data={this.state.foodDiaryArray.filter((item) => {
                      return item.include === true;
                    })}
                    extraData={this.state.foodDiaryArray}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={this._renderDiaryItem}
                    contentContainerStyle={{
                      paddingBottom: 16,
                      overflow: 'hidden',
                    }}
                    keyboardShouldPersistTaps="always"
                    // initialNumToRender={10}
                    bounces={false}
                  />
                </View>
              )}

              {!this.state.isDiaryLoading && (
                <View>
                  <View
                    style={{
                      width: width - 40,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: 'rgb(221,224,228)',
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.setState({
                          waterCollapsed: !this.state.waterCollapsed,
                        })
                      }>
                      <View>
                        <View
                          style={{
                            width: width - 40,
                            minHeight: 79,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={require('../resources/icon/water.png')}
                            style={{marginLeft: 20, marginRight: 15}}
                          />

                          <View>
                            <Text style={styles.title}>Water</Text>
                            <Text style={styles.subtitle}>{`${this.convertWater(
                              this.state.water,
                            )} ml of ${this.convertWater(
                              this.state.waterMax === false
                                ? 2000
                                : this.state.waterMax,
                            )} ml`}</Text>
                          </View>

                          {this.state.waterCollapsed ? (
                            <Image
                              source={require('../resources/icon/arrowDown.png')}
                              style={{
                                position: 'absolute',
                                right: 20,
                                top: 34,
                              }}
                            />
                          ) : (
                            <Image
                              source={require('../resources/icon/arrowUp.png')}
                              style={{
                                position: 'absolute',
                                right: 20,
                                top: 34,
                              }}
                            />
                          )}
                        </View>
                        <Expand value={!this.state.waterCollapsed}>
                          {/*<Collapsible collapsed={this.state.waterCollapsed} align="center">*/}
                          <View>
                            <View
                              style={{
                                width: width - 80,
                                height: 0.5,
                                backgroundColor: 'rgb(216,215,222)',
                                alignSelf: 'center',
                              }}
                            />

                            <View
                              style={{
                                flexDirection: 'row',
                                minHeight: 56,
                                width: width - 80,
                                marginVertical: 16,
                                alignSelf: 'center',
                                flexWrap: 'wrap',
                              }}>
                              <FlatList
                                data={this.state.glasses}
                                extraData={this.state.glasses}
                                keyExtractor={(item, index) =>
                                  item.toString() + index.toString()
                                }
                                renderItem={this._renderGlassesItem}
                                contentContainerStyle={{
                                  overflow: 'visible',
                                  // flexDirection: "row",
                                  // flexWrap: "wrap",
                                }}
                                numColumns={6}
                                keyboardShouldPersistTaps="always"
                                initialNumToRender={10}
                                bounces={false}
                              />

                              {/* glassesComponent */}
                              {/*(this.state.water !== this.state.waterMax) && (
                                <TouchableWithoutFeedback onPress={this.onEmptyGlassPress}>
                                  <Image
                                    source={require('../resources/icon/glass1Copy8.png')}
                                    style={{marginTop: 16}}
                                  />
                                </TouchableWithoutFeedback>
                              ) */}
                            </View>

                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.setState({
                                  isWaterSettingsModalVisible: true,
                                })
                              }>
                              <View
                                style={{
                                  width: width - 80,
                                  height: 36,
                                  borderRadius: 22,
                                  borderWidth: 1,
                                  alignSelf: 'center',
                                  borderColor: 'rgb(221,224,228)',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginVertical: 20,
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'SFProText-Regular',
                                    fontWeight: '400',
                                    fontSize: 15,
                                    color: 'rgb(31,33,35)',
                                  }}>
                                  Water Settings
                                </Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                          {/*</Collapsible>*/}
                        </Expand>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  <TouchableWithoutFeedback onPress={() => this.onModalOpen()}>
                    <View style={styles.preferencesButton}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={require('../resources/icon/settings.png')}
                          style={{marginRight: 10}}
                        />

                        <Text style={styles.preferencesText}>
                          Food Diary Preferences
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
          )}

          {this.state.tabActive === 1 && (
            <View>
              <View
                style={{
                  width: width - 40,
                  height: 44,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  marginTop: 23,
                }}>
                <TouchableWithoutFeedback onPress={this.setPreviousFoodRating}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderRightWidth: 0.5,
                      borderRightColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      left: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/previous.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      foodRatingWheelPosition: this.state.foodRatingPosition,
                      isFoodRatingWheelModalVisible: true,
                    })
                  }>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 44,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {/*<Text style={styles.dateText}>{this.getFoodRatingPositionValue()}</Text> */}
                    <Text style={styles.dateText}>
                      {typeof this.state.currentDayRatings !== 'undefined' ||
                      typeof this.state.currentWeekRatings !== 'undefined'
                        ? this.getMappedDateRatings()
                        : 'Today'}
                    </Text>

                    <Image
                      source={require('../resources/icon/arrowDown.png')}
                      style={{marginLeft: 10}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.setNextFoodRating}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderLeftWidth: 0.5,
                      borderLeftColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      right: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/next.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View>
                {!this.state.isDayRatings ? (
                  <View>
                    {this.state.isLoadingRatings ? (
                      <ShineOverlay>
                        <View>
                          <View
                            style={{
                              width: width - 176,
                              height: 28,
                              borderRadius: 14.5,
                              backgroundColor: 'rgb(242,243,246)',
                              marginHorizontal: 20,
                              marginTop: 38,
                            }}
                          />
                          <View
                            style={{
                              width: width - 225,
                              height: 12,
                              borderRadius: 9,
                              backgroundColor: 'rgb(242,243,246)',
                              marginHorizontal: 20,
                              marginTop: 10,
                            }}
                          />

                          <View
                            style={{
                              height: 250,
                              width: width - 40,
                              alignSelf: 'center',
                              marginTop: 34,
                              borderBottomWidth: 0.5,
                              borderBottomColor: 'rgb(216,215,222)',
                            }}>
                            <View
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                minWidth: 19,
                                alignItems: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 37,
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 34,
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 34,
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 38,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                position: 'absolute',
                                bottom: 32,
                                left: 34,
                                width: width - 85,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: 15,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                            </View>

                            <View
                              style={{
                                marginTop: 7.5,
                                width: width - 63,
                                height: 190,
                                marginLeft: 25,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 116,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 150,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 138,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 108,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 97,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 164,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  height: 184,
                                  width: 38 * (width / 375),
                                  alignItems: 'center',
                                  alignSelf: 'flex-end',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 18,
                                    height: 124,
                                    backgroundColor: 'rgb(242,243,246)',
                                    borderRadius: 9,
                                  }}
                                />
                              </View>
                            </View>
                          </View>

                          <View
                            style={{
                              width: width - 40,
                              alignSelf: 'center',
                              flexDirection: 'row',
                              marginTop: 25,
                            }}>
                            <View
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: 'rgb(242,243,246)',
                                marginRight: 20,
                              }}
                            />
                            <View style={{marginTop: 4}}>
                              <View
                                style={{
                                  width: width - 153,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: width - 129,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 6,
                                }}
                              />
                              <View
                                style={{
                                  width: width - 181,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 6,
                                }}
                              />
                              <View
                                style={{
                                  width: width - 225,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 6,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      </ShineOverlay>
                    ) : this.state.foodRatingData.length === 0 &&
                      !this.state.isLoadingRatings ? (
                      <View>
                        <View>
                          <Image
                            source={require('../resources/icon/food_ratings_empty.png')}
                            style={{alignSelf: 'center', marginTop: 120}}
                          />
                          <Text style={styles.placeholderTitle}>
                            No Food Ratings
                          </Text>
                          <Text style={styles.placeholderText}>
                            Looks like you don’t have any data related to food
                            rating as of yet.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.foodRatingPercentageTitle}>
                          {this.state.foodRatingPercentages[0] >
                            this.state.foodRatingPercentages[1] &&
                          this.state.foodRatingPercentages[0] >
                            this.state.foodRatingPercentages[2]
                            ? this.state.foodRatingPercentages[0] + '%'
                            : this.state.foodRatingPercentages[1] >
                                this.state.foodRatingPercentages[0] &&
                              this.state.foodRatingPercentages[1] >
                                this.state.foodRatingPercentages[2]
                            ? this.state.foodRatingPercentages[1] + '%'
                            : this.state.foodRatingPercentages[2] + '%'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 23,
                            marginTop: 4,
                          }}>
                          <Text style={styles.foodRatingPercentageText}>
                            {this.state.foodRatingPercentages[0] >
                              this.state.foodRatingPercentages[1] &&
                            this.state.foodRatingPercentages[0] >
                              this.state.foodRatingPercentages[2]
                              ? 'Excellent & Great Food Choices'
                              : this.state.foodRatingPercentages[1] >
                                  this.state.foodRatingPercentages[0] &&
                                this.state.foodRatingPercentages[1] >
                                  this.state.foodRatingPercentages[2]
                              ? 'Good, Ok, Sometimes Food Choices'
                              : 'Avoid Food Choices'}
                          </Text>
                          <View
                            style={{
                              width: 3,
                              height: 3,
                              borderRadius: 1.5,
                              backgroundColor: 'rgb(173,179,183)',
                              marginHorizontal: 8,
                            }}
                          />

                          {Array.isArray(
                            this.foodRatingDates[this.state.foodRatingPosition],
                          ) ? (
                            <Text
                              style={
                                styles.foodRatingPercentageText
                              }>{`${this.state.currentWeekRatings[0].substring(
                              8,
                              10,
                            )} ${this.getMonthName(
                              this.state.currentWeekRatings[0].substring(5, 7),
                            )} - ${this.state.currentWeekRatings[1].substring(
                              8,
                              10,
                            )} ${this.getMonthName(
                              this.state.currentWeekRatings[1].substring(5, 7),
                            )}`}</Text>
                          ) : (
                            <Text
                              style={
                                styles.foodRatingPercentageText
                              }>{`${this.foodRatingDates[
                              this.state.foodRatingPosition
                            ].substring(8, 10)} ${this.getMonthName(
                              this.foodRatingDates[
                                this.state.foodRatingPosition
                              ].substring(5, 7),
                            )}`}</Text>
                          )}
                        </View>

                        <FoodRatingsGraphic
                          foodRatingData={this.state.foodRatingData}
                          dates={this.state.currentWeekRatings}
                          onHint={() =>
                            this.scrollviewVertical.scrollTo({
                              x: 0,
                              y: 0,
                              animated: true,
                            })
                          }
                        />

                        <View
                          style={{
                            width: width - 40,
                            alignSelf: 'center',
                            marginTop: 25,
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={require('../resources/icon/banana_icon.png')}
                            style={{marginRight: 20}}
                          />

                          <View style={{width: width - 105}}>
                            <Text style={styles.foodRatingWeekText}>
                              {this.state.foodRatingsTips.text}
                            </Text>

                            {this.state.foodRatingsTips !== null &&
                              this.state.foodRatingsTips.actions !== null && (
                                <TouchableWithoutFeedback
                                  onPress={this.onFoodRatingsTipPress}>
                                  <View
                                    style={{
                                      marginTop: 16,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.foodRatingWeekLink}>
                                      {typeof this.state.foodRatingsTips.actions
                                        .actionData !== 'undefined' &&
                                      typeof this.state.foodRatingsTips.actions
                                        .actionData.link !== 'undefined'
                                        ? this.state.foodRatingsTips.actions
                                            .actionData.link
                                        : 'Check top rated foods'}
                                    </Text>
                                    <Image
                                      source={require('../resources/icon/arrowRight_blue.png')}
                                      style={{marginLeft: 10, marginTop: 2}}
                                    />
                                  </View>
                                </TouchableWithoutFeedback>
                              )}
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={{marginTop: 0}}>
                    {this.state.isLoadingRatings ? (
                      <ShineOverlay>
                        <View>
                          <View
                            style={{
                              width: width - 176,
                              height: 28,
                              borderRadius: 14.5,
                              backgroundColor: 'rgb(242,243,246)',
                              marginHorizontal: 20,
                              marginTop: 38,
                            }}
                          />
                          <View
                            style={{
                              width: width - 225,
                              height: 12,
                              borderRadius: 9,
                              backgroundColor: 'rgb(242,243,246)',
                              marginHorizontal: 20,
                              marginTop: 10,
                            }}
                          />

                          <View
                            style={{
                              width: 200,
                              alignSelf: 'center',
                              marginTop: 47,
                            }}>
                            <PieChart
                              style={{height: 200}}
                              data={[
                                {
                                  value: 33,
                                  svg: {
                                    fill: 'rgb(242,243,246)',
                                  },
                                  key: 1,
                                },
                                {
                                  value: 20,
                                  svg: {
                                    fill: 'rgb(242,243,246)',
                                  },
                                  key: 2,
                                },
                                {
                                  value: 29,
                                  svg: {
                                    fill: 'rgb(242,243,246)',
                                  },
                                  key: 3,
                                },
                                {
                                  value: 15,
                                  svg: {
                                    fill: 'rgb(242,243,246)',
                                  },
                                  key: 4,
                                },
                              ]}
                              outerRadius="100%"
                              innerRadius="60%"
                              sort={() => null}
                            />
                          </View>

                          <View
                            style={{
                              width: width - 40,
                              height: 0.5,
                              alignSelf: 'center',
                              backgroundColor: 'rgb(216,215,222)',
                              marginTop: 43,
                            }}
                          />

                          <View
                            style={{
                              width: width - 40,
                              alignSelf: 'center',
                              flexDirection: 'row',
                              marginTop: 25,
                            }}>
                            <View
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: 'rgb(242,243,246)',
                                marginRight: 20,
                              }}
                            />
                            <View style={{marginTop: 4}}>
                              <View
                                style={{
                                  width: width - 153,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                              <View
                                style={{
                                  width: width - 129,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 6,
                                }}
                              />
                              <View
                                style={{
                                  width: width - 181,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 6,
                                }}
                              />
                              <View
                                style={{
                                  width: width - 225,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 6,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      </ShineOverlay>
                    ) : this.state.foodRatingFoodGreatArray.length === 0 &&
                      this.state.foodRatingFoodOkArray.length === 0 &&
                      this.state.foodRatingFoodAvoidArray.length === 0 &&
                      !this.state.isLoadingRatings ? (
                      <View>
                        <Image
                          source={require('../resources/icon/food_ratings_empty.png')}
                          style={{alignSelf: 'center', marginTop: 120}}
                        />
                        <Text style={styles.placeholderTitle}>
                          No Food Ratings
                        </Text>
                        <Text style={styles.placeholderText}>
                          Looks like you don’t have any data related to food
                          rating as of yet.
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.foodRatingPercentageTitle}>
                          {this.state.foodRatingPercentages[0] >
                            this.state.foodRatingPercentages[1] &&
                          this.state.foodRatingPercentages[0] >
                            this.state.foodRatingPercentages[2]
                            ? this.state.foodRatingPercentages[0] + '%'
                            : this.state.foodRatingPercentages[1] >
                                this.state.foodRatingPercentages[0] &&
                              this.state.foodRatingPercentages[1] >
                                this.state.foodRatingPercentages[2]
                            ? this.state.foodRatingPercentages[1] + '%'
                            : this.state.foodRatingPercentages[2] + '%'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 23,
                            marginTop: 4,
                          }}>
                          <Text style={styles.foodRatingPercentageText}>
                            {this.state.foodRatingPercentages[0] >
                              this.state.foodRatingPercentages[1] &&
                            this.state.foodRatingPercentages[0] >
                              this.state.foodRatingPercentages[2]
                              ? 'Excellent & Great Food Choices'
                              : this.state.foodRatingPercentages[1] >
                                  this.state.foodRatingPercentages[0] &&
                                this.state.foodRatingPercentages[1] >
                                  this.state.foodRatingPercentages[2]
                              ? 'Good, Ok, Sometimes Food Choices'
                              : 'Avoid Food Choices'}
                          </Text>
                          <View
                            style={{
                              width: 3,
                              height: 3,
                              borderRadius: 1.5,
                              backgroundColor: 'rgb(173,179,183)',
                              marginHorizontal: 8,
                            }}
                          />

                          {Array.isArray(
                            this.foodRatingDates[this.state.foodRatingPosition],
                          ) ? (
                            <Text
                              style={
                                styles.foodRatingPercentageText
                              }>{`${this.foodRatingDates[
                              this.state.foodRatingPosition
                            ][0].substring(8, 10)} ${this.getMonthName(
                              this.foodRatingDates[
                                this.state.foodRatingPosition
                              ][0].substring(5, 7),
                            )} - ${this.foodRatingDates[
                              this.state.foodRatingPosition
                            ][1].substring(8, 10)} ${this.getMonthName(
                              this.foodRatingDates[
                                this.state.foodRatingPosition
                              ][1].substring(5, 7),
                            )}`}</Text>
                          ) : (
                            <Text
                              style={
                                styles.foodRatingPercentageText
                              }>{`${this.state.currentDayRatings.substring(
                              8,
                              10,
                            )} ${this.getMonthName(
                              this.state.currentDayRatings.substring(5, 7),
                            )}`}</Text>
                          )}
                        </View>
                        {/* <View style={{width: 200, height: 200, alignSelf: 'center'}}>
                        <Pie
                          radius={100}
                          sections={[
                            {
                              percentage: parseFloat(this.state.foodRatingPercentages[0]),
                              color: 'rgb(0,187,116)',
                            },
                            {
                              percentage: parseFloat(this.state.foodRatingPercentages[1]),
                              color: 'rgb(234,196,50)',
                            },
                            {
                              percentage: parseFloat(this.state.foodRatingPercentages[2]),
                              color: 'rgb(228,77,77)',
                            },
                          ]}
                          dividerSize={2}
                          innerRadius={60}
                          strokeCap={'butt'}
                          onPress={() => console.log('onsection press')}
                        />
                      </View> */}

                        <View
                          style={{
                            width: 200,
                            height: 200,
                            alignSelf: 'center',
                            marginTop: 41,
                          }}
                          onTouchStart={(e) =>
                            this.setState({hintTouchPosition: e.nativeEvent})
                          }>
                          <PieChart
                            style={{height: 200}}
                            data={this.state.foodRatingPieChartData}
                            outerRadius="100%"
                            innerRadius="60%"
                            sort={() => null}
                          />
                        </View>

                        <View
                          style={{
                            width: width - 40,
                            height: 0.5,
                            alignSelf: 'center',
                            backgroundColor: 'rgb(216,215,222)',
                            marginTop: 40,
                            marginBottom: 24,
                          }}
                        />

                        {this.state.foodRatingFoodGreatArray.length !== 0 && (
                          <View
                            style={{
                              marginTop: 0,
                              width: width - 40,
                              minHeight: 80,
                              borderRadius: 4,
                              borderWidth: 1,
                              borderColor: 'rgb(221,224,228)',
                              alignSelf: 'center',
                              backgroundColor: 'rgb(255,255,255)',
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.setState({
                                  foodRatingsFoodGreatCollapsed: !this.state
                                    .foodRatingsFoodGreatCollapsed,
                                })
                              }>
                              <View>
                                <View
                                  style={{
                                    width: width - 40,
                                    minHeight: 79,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      position: 'absolute',
                                      left: 20,
                                      top: 26,
                                      width: 10,
                                      height: 10,
                                      borderRadius: 5,
                                      backgroundColor: 'rgb(0,187,116)',
                                    }}
                                  />

                                  <View style={{marginLeft: 40}}>
                                    <Text style={styles.title}>
                                      Excellent & Great
                                    </Text>
                                    <Text
                                      style={styles.subtitle}>{`${parseFloat(
                                      this.state.foodRatingPercentages[0],
                                    )}%`}</Text>
                                  </View>

                                  {this.state.foodRatingsFoodGreatCollapsed ? (
                                    <Image
                                      source={require('../resources/icon/arrowDown.png')}
                                      style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 34,
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require('../resources/icon/arrowUp.png')}
                                      style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 34,
                                      }}
                                    />
                                  )}
                                </View>
                                <Collapsible
                                  collapsed={
                                    this.state.foodRatingsFoodGreatCollapsed
                                  }
                                  align="center">
                                  <View style={{minHeight: 76}}>
                                    <View
                                      style={{
                                        width: width - 80,
                                        height: 0.5,
                                        backgroundColor: 'rgb(216,215,222)',
                                        alignSelf: 'center',
                                      }}
                                    />

                                    <FlatList
                                      data={this.state.foodRatingFoodGreatArray}
                                      // extraData={this.state.foodDiaryArray}
                                      keyExtractor={(item, index) =>
                                        item.food.name + index
                                      }
                                      renderItem={this._renderFoodRatingItem}
                                      contentContainerStyle={{
                                        overflow: 'visible',
                                      }}
                                      keyboardShouldPersistTaps="always"
                                      initialNumToRender={10}
                                      bounces={false}
                                    />
                                  </View>
                                </Collapsible>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        )}

                        {this.state.foodRatingFoodOkArray.length !== 0 && (
                          <View
                            style={{
                              marginTop: 16,
                              width: width - 40,
                              minHeight: 80,
                              borderRadius: 4,
                              borderWidth: 1,
                              borderColor: 'rgb(221,224,228)',
                              alignSelf: 'center',
                              backgroundColor: 'rgb(255,255,255)',
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.setState({
                                  foodRatingsFoodOkCollapsed: !this.state
                                    .foodRatingsFoodOkCollapsed,
                                })
                              }>
                              <View>
                                <View
                                  style={{
                                    width: width - 40,
                                    minHeight: 79,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      position: 'absolute',
                                      left: 20,
                                      top: 26,
                                      width: 10,
                                      height: 10,
                                      borderRadius: 5,
                                      backgroundColor: 'rgb(234,196,50)',
                                    }}
                                  />

                                  <View style={{marginLeft: 40}}>
                                    <Text style={styles.title}>
                                      Good, OK, Sometimes
                                    </Text>
                                    <Text
                                      style={styles.subtitle}>{`${parseFloat(
                                      this.state.foodRatingPercentages[1],
                                    )}%`}</Text>
                                  </View>

                                  {this.state.foodRatingsFoodOkCollapsed ? (
                                    <Image
                                      source={require('../resources/icon/arrowDown.png')}
                                      style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 34,
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require('../resources/icon/arrowUp.png')}
                                      style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 34,
                                      }}
                                    />
                                  )}
                                </View>
                                <Collapsible
                                  collapsed={
                                    this.state.foodRatingsFoodOkCollapsed
                                  }
                                  align="center">
                                  <View style={{minHeight: 76}}>
                                    <View
                                      style={{
                                        width: width - 80,
                                        height: 0.5,
                                        backgroundColor: 'rgb(216,215,222)',
                                        alignSelf: 'center',
                                      }}
                                    />

                                    <FlatList
                                      data={this.state.foodRatingFoodOkArray}
                                      // extraData={this.state.foodDiaryArray}
                                      keyExtractor={(item, index) =>
                                        item.food.name + index
                                      }
                                      renderItem={this._renderFoodRatingItem}
                                      contentContainerStyle={{
                                        overflow: 'visible',
                                      }}
                                      keyboardShouldPersistTaps="always"
                                      initialNumToRender={10}
                                      bounces={false}
                                    />
                                  </View>
                                </Collapsible>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        )}

                        {this.state.foodRatingFoodAvoidArray.length !== 0 && (
                          <View
                            style={{
                              marginTop: 16,
                              width: width - 40,
                              minHeight: 80,
                              borderRadius: 4,
                              borderWidth: 1,
                              borderColor: 'rgb(221,224,228)',
                              alignSelf: 'center',
                              backgroundColor: 'rgb(255,255,255)',
                            }}>
                            <TouchableWithoutFeedback
                              onPress={() =>
                                this.setState({
                                  foodRatingsFoodAvoidCollapsed: !this.state
                                    .foodRatingsFoodAvoidCollapsed,
                                })
                              }>
                              <View>
                                <View
                                  style={{
                                    width: width - 40,
                                    minHeight: 79,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      position: 'absolute',
                                      left: 20,
                                      top: 26,
                                      width: 10,
                                      height: 10,
                                      borderRadius: 5,
                                      backgroundColor: 'rgb(228,77,77)',
                                    }}
                                  />

                                  <View style={{marginLeft: 40}}>
                                    <Text style={styles.title}>Avoid</Text>
                                    <Text
                                      style={styles.subtitle}>{`${parseFloat(
                                      this.state.foodRatingPercentages[2],
                                    )}%`}</Text>
                                  </View>

                                  {this.state.foodRatingsFoodAvoidCollapsed ? (
                                    <Image
                                      source={require('../resources/icon/arrowDown.png')}
                                      style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 34,
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require('../resources/icon/arrowUp.png')}
                                      style={{
                                        position: 'absolute',
                                        right: 20,
                                        top: 34,
                                      }}
                                    />
                                  )}
                                </View>
                                <Collapsible
                                  collapsed={
                                    this.state.foodRatingsFoodAvoidCollapsed
                                  }
                                  align="center">
                                  <View style={{minHeight: 76}}>
                                    <View
                                      style={{
                                        width: width - 80,
                                        height: 0.5,
                                        backgroundColor: 'rgb(216,215,222)',
                                        alignSelf: 'center',
                                      }}
                                    />

                                    <FlatList
                                      data={this.state.foodRatingFoodAvoidArray}
                                      // extraData={this.state.foodDiaryArray}
                                      keyExtractor={(item, index) =>
                                        item.food.name + index
                                      }
                                      renderItem={this._renderFoodRatingItem}
                                      contentContainerStyle={{
                                        overflow: 'visible',
                                      }}
                                      keyboardShouldPersistTaps="always"
                                      initialNumToRender={10}
                                      bounces={false}
                                    />
                                  </View>
                                </Collapsible>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          {this.state.tabActive === 2 && (
            <View>
              <View
                style={{
                  marginTop: 20,
                  width: width - 40,
                  height: 40,
                  alignSelf: 'center',
                  borderRadius: 6,
                  backgroundColor: 'rgb(246,248,253)',
                  overflow: 'hidden',
                }}>
                {this.state.isMicronutrientsActive ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width - 40,
                      height: 40,
                      borderRadius: 6,
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({
                          isMicronutrientsActive: !this.state
                            .isMicronutrientsActive,
                        },() => {
                          if(this.state.micronutrientsPosition == 4) {
                            this.micronutrientsDates[this.state.micronutrientsPosition] = 
                            Array.isArray(this.micronutrientsDates[this.state.micronutrientsPosition])
                              ? [this.state.start, this.state.end]
                              : this.state.currentDayNutrients
                          }                          
                        });                      
                        this.getMicronutrientsData();
                      }}>
                      <View
                        style={{
                          width: (width - 40) / 2,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.micronutrientsTitleOff}>
                          Macronutrients
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({
                          isMicronutrientsActive: !this.state
                            .isMicronutrientsActive,
                        });
                        this.getMicronutrientsData();
                      }}>
                      <BoxShadow
                        setting={{
                          ...shadowOpt,
                          ...{
                            width: (width - 40) / 2,
                            height: 34,
                            y: 1,
                            border: 2,
                            radius: 4,
                            opacity: 0.075,
                            style: {margin: 3},
                          },
                        }}>
                        <View
                          style={{
                            width: (width - 40) / 2 - 5,
                            height: 34,
                            borderRadius: 4,
                            backgroundColor: 'rgb(255,255,255)',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.micronutrientsTitleOn}>
                            Micronutrients
                          </Text>
                        </View>
                      </BoxShadow>
                    </TouchableWithoutFeedback>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      width: width - 40,
                      height: 40,
                      borderRadius: 6,
                    }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({
                          isMicronutrientsActive: !this.state
                            .isMicronutrientsActive,
                        });
                        this.getMicronutrientsData();
                      }}>
                      <BoxShadow
                        setting={{
                          ...shadowOpt,
                          ...{
                            width: (width - 40) / 2,
                            height: 34,
                            y: 1,
                            border: 2,
                            radius: 4,
                            opacity: 0.075,
                            style: {margin: 3},
                          },
                        }}>
                        <View
                          style={{
                            width: (width - 40) / 2,
                            height: 34,
                            borderRadius: 4,
                            backgroundColor: 'rgb(255,255,255)',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={styles.micronutrientsTitleOn}>
                            Macronutrients
                          </Text>
                        </View>
                      </BoxShadow>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({
                          isMicronutrientsActive: !this.state
                            .isMicronutrientsActive,
                        }, () => {
                          if(this.state.micronutrientsPosition == 4) {
                            this.micronutrientsDates[this.state.micronutrientsPosition] =
                            Array.isArray(this.micronutrientsDates[this.state.micronutrientsPosition])
                            ? [this.state.start, this.state.end]
                            : this.state.currentDayNutrients
                          }                          
                        });
                        this.getMicronutrientsData();
                      }}>
                      <View
                        style={{
                          width: (width - 40) / 2 - 3,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.micronutrientsTitleOff}>
                          Micronutrients
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )}
              </View>

              <View
                style={{
                  width: width - 40,
                  height: 44,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  marginTop: 23,
                }}>
                <TouchableWithoutFeedback
                  onPress={this.setPreviousMicronutrients}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderRightWidth: 0.5,
                      borderRightColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      left: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/previous.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      micronutrientsWheelPosition: this.state
                        .micronutrientsPosition,
                      isMicronutrientsWheelModalVisible: true,
                    })
                  }>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 44,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.dateText}>
                      {typeof this.state.currentDayNutrients !== 'undefined' ||
                      typeof this.state.currentWeekNutrients !== 'undefined'
                        ? this.getMappedDateNutrients()
                        : 'Today'}
                    </Text>

                    <Image
                      source={require('../resources/icon/arrowDown.png')}
                      style={{marginLeft: 10}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.setNextMicronutrients}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderLeftWidth: 0.5,
                      borderLeftColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      right: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/next.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {this.state.isMicronutrientsActive ? (
                <View>
                  {this.state.isMicronutrientsEmpty &&
                  !this.state.isLoadingNutrients ? (
                    <View>
                      <View>
                        <Image
                          source={require('../resources/icon/nutrients_empty.png')}
                          style={{alignSelf: 'center', marginTop: 64}}
                        />
                        <Text style={styles.placeholderTitle}>
                          No Micronutrients
                        </Text>
                        <Text style={styles.placeholderText}>
                          Looks like you don’t have any data related to
                          micronutrients as of yet.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View style={{marginTop: 20}}>
                      {this.state.isLoadingNutrients ? (
                        <ShineOverlay>
                          <View>
                            <View
                              style={{
                                width: width - 40,
                                height: 44,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  width: 83,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 11,
                                }}
                              />
                              <View
                                style={{
                                  width: 30,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  position: 'absolute',
                                  right: 0,
                                  top: 11,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: width - 40,
                                height: 44,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  width: 153,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 11,
                                }}
                              />
                              <View
                                style={{
                                  width: 30,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  position: 'absolute',
                                  right: 0,
                                  top: 11,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: width - 40,
                                height: 44,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  width: 184,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 11,
                                }}
                              />
                              <View
                                style={{
                                  width: 30,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  position: 'absolute',
                                  right: 0,
                                  top: 11,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: width - 40,
                                height: 44,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  width: 128,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 11,
                                }}
                              />
                              <View
                                style={{
                                  width: 30,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  position: 'absolute',
                                  right: 0,
                                  top: 11,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: width - 40,
                                height: 44,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  width: 158,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 11,
                                }}
                              />
                              <View
                                style={{
                                  width: 30,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  position: 'absolute',
                                  right: 0,
                                  top: 11,
                                }}
                              />
                            </View>
                            <View
                              style={{
                                width: width - 40,
                                height: 44,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  width: 96,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginTop: 11,
                                }}
                              />
                              <View
                                style={{
                                  width: 30,
                                  height: 18,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  position: 'absolute',
                                  right: 0,
                                  top: 11,
                                }}
                              />
                            </View>
                          </View>
                        </ShineOverlay>
                      ) : (
                        <FlatList
                          data={this.state.micronutrientsData}
                          // extraData={this.state.foodDiaryArray}
                          keyExtractor={(item, index) => item.name + index}
                          renderItem={this._renderMicronutrientsItem}
                          contentContainerStyle={{overflow: 'visible'}}
                          keyboardShouldPersistTaps="always"
                          initialNumToRender={10}
                          bounces={false}
                        />
                      )}
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  {!this.state.isDayNutrients ? (
                    <View>
                      {this.state.isLoadingNutrients ? (
                        <ShineOverlay>
                          <View>
                            <View
                              style={{
                                height: 250,
                                width: width - 40,
                                alignSelf: 'center',
                                marginTop: 32,
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                              }}>
                              <View
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  minWidth: 19,
                                  alignItems: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 37,
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 34,
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 34,
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 38,
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  position: 'absolute',
                                  bottom: 32,
                                  left: 34,
                                  width: width - 85,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: 15,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                              </View>

                              <View
                                style={{
                                  marginTop: 7.5,
                                  width: width - 63,
                                  height: 190,
                                  marginLeft: 25,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}>
                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 116,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>

                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 150,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>

                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 138,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>

                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 108,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>

                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 97,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>

                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 164,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>

                                <View
                                  style={{
                                    height: 184,
                                    width: 38 * (width / 375),
                                    alignItems: 'center',
                                    alignSelf: 'flex-end',
                                    justifyContent: 'flex-end',
                                  }}>
                                  <View
                                    style={{
                                      width: 18,
                                      height: 124,
                                      backgroundColor: 'rgb(242,243,246)',
                                      borderRadius: 9,
                                    }}
                                  />
                                </View>
                              </View>
                            </View>

                            <View
                              style={{
                                width: width - 40,
                                alignSelf: 'center',
                                flexDirection: 'row',
                                marginTop: 25,
                              }}>
                              <View
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 22,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight: 20,
                                }}
                              />
                              <View style={{marginTop: 4}}>
                                <View
                                  style={{
                                    width: width - 153,
                                    height: 12,
                                    borderRadius: 9,
                                    backgroundColor: 'rgb(242,243,246)',
                                  }}
                                />
                                <View
                                  style={{
                                    width: width - 129,
                                    height: 12,
                                    borderRadius: 9,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 6,
                                  }}
                                />
                                <View
                                  style={{
                                    width: width - 181,
                                    height: 12,
                                    borderRadius: 9,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 6,
                                  }}
                                />
                                <View
                                  style={{
                                    width: width - 225,
                                    height: 12,
                                    borderRadius: 9,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginTop: 6,
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                        </ShineOverlay>
                      ) : this.state.macronutrientsData.length === 0 &&
                        !this.state.isLoadingNutrients ? (
                        <View>
                          <View>
                            <Image
                              source={require('../resources/icon/nutrients_empty.png')}
                              style={{alignSelf: 'center', marginTop: 64}}
                            />
                            <Text style={styles.placeholderTitle}>
                              No Macronutrients
                            </Text>
                            <Text style={styles.placeholderText}>
                              Looks like you don’t have any data related to
                              macronutrients as of yet.
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <MacronutrientsGraphic
                            macronutrientsData={this.state.macronutrientsData}
                            dates={this.state.currentWeekNutrients}
                            onHint={() =>
                              this.scrollviewVertical.scrollTo({
                                x: 0,
                                y: 0,
                                animated: true,
                              })
                            }
                          />

                          <View
                            style={{
                              width: width - 40,
                              marginTop: 25,
                              alignSelf: 'center',
                              flexDirection: 'row',
                            }}>
                            <Image
                              source={require('../resources/icon/fat_food_icon.png')}
                              style={{marginRight: 20}}
                            />

                            <View style={{width: width - 105}}>
                              <Text style={styles.foodRatingWeekText}>
                                {this.state.nutrientsTips.text}
                              </Text>

                              {this.state.nutrientsTips !== null &&
                                this.state.nutrientsTips.actions !== null && (
                                  <TouchableWithoutFeedback
                                    onPress={this.onNutrientsTipPress}>
                                    <View
                                      style={{
                                        marginTop: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                      }}>
                                      <Text style={styles.foodRatingWeekLink}>
                                        {typeof this.state.nutrientsTips.actions
                                          .actionData !== 'undefined' &&
                                        typeof this.state.nutrientsTips.actions
                                          .actionData.link !== 'undefined'
                                          ? this.state.nutrientsTips.actions
                                              .actionData.link
                                          : 'Check low fat foods'}
                                      </Text>
                                      <Image
                                        source={require('../resources/icon/arrowRight_blue.png')}
                                        style={{marginLeft: 10, marginTop: 2}}
                                      />
                                    </View>
                                  </TouchableWithoutFeedback>
                                )}
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      {this.state.isLoadingNutrients ? (
                        <ShineOverlay>
                          <View>
                            <View
                              style={{
                                width: 200,
                                alignSelf: 'center',
                                marginTop: 39,
                              }}>
                              <PieChart
                                style={{height: 200}}
                                data={[
                                  {
                                    value: 33,
                                    svg: {
                                      fill: 'rgb(242,243,246)',
                                    },
                                    key: 1,
                                  },
                                  {
                                    value: 20,
                                    svg: {
                                      fill: 'rgb(242,243,246)',
                                    },
                                    key: 2,
                                  },
                                  {
                                    value: 29,
                                    svg: {
                                      fill: 'rgb(242,243,246)',
                                    },
                                    key: 3,
                                  },
                                  {
                                    value: 15,
                                    svg: {
                                      fill: 'rgb(242,243,246)',
                                    },
                                    key: 4,
                                  },
                                ]}
                                outerRadius="100%"
                                innerRadius="60%"
                                sort={() => null}
                              />
                            </View>

                            <View
                              style={{
                                width: width - 40,
                                height: 0.5,
                                alignSelf: 'center',
                                backgroundColor: 'rgb(216,215,222)',
                                marginTop: 41,
                              }}
                            />

                            <View style={{width, height: 25, marginTop: 33}}>
                              <View
                                style={{
                                  position: 'absolute',
                                  right: 10,
                                  bottom: 10,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    width: 36,
                                    height: 12,
                                    borderRadius: 9,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginRight: 34,
                                  }}
                                />
                                <View
                                  style={{
                                    width: 36,
                                    height: 12,
                                    borderRadius: 9,
                                    backgroundColor: 'rgb(242,243,246)',
                                    marginRight: 62,
                                  }}
                                />
                              </View>
                            </View>

                            <View
                              style={{
                                width: width - 40,
                                height: 0.5,
                                alignSelf: 'center',
                                backgroundColor: 'rgb(216,215,222)',
                                marginTop: 0,
                              }}
                            />

                            <View
                              style={{
                                width: width - 40,
                                height: 48,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                                marginTop: 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: (width / 375) * 125,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight:
                                    (width / 375) * 45 +
                                    Math.abs(width - 360) / 2,
                                }}
                              />
                              <View
                                style={{
                                  width: (width / 375) * 36,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight: (width / 375) * 37,
                                }}
                              />
                              <View
                                style={{
                                  width: (width / 375) * 60,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                            </View>

                            <View
                              style={{
                                width: width - 40,
                                height: 48,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                                marginTop: 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: (width / 375) * 125,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight:
                                    (width / 375) * 45 +
                                    Math.abs(width - 360) / 2,
                                }}
                              />
                              <View
                                style={{
                                  width: (width / 375) * 36,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight: (width / 375) * 37,
                                }}
                              />
                              <View
                                style={{
                                  width: (width / 375) * 60,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                            </View>

                            <View
                              style={{
                                width: width - 40,
                                height: 48,
                                alignSelf: 'center',
                                borderBottomWidth: 0.5,
                                borderBottomColor: 'rgb(216,215,222)',
                                marginTop: 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: (width / 375) * 125,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight:
                                    (width / 375) * 45 +
                                    Math.abs(width - 360) / 2,
                                }}
                              />
                              <View
                                style={{
                                  width: (width / 375) * 36,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                  marginRight: (width / 375) * 37,
                                }}
                              />
                              <View
                                style={{
                                  width: (width / 375) * 60,
                                  height: 12,
                                  borderRadius: 9,
                                  backgroundColor: 'rgb(242,243,246)',
                                }}
                              />
                            </View>
                          </View>
                        </ShineOverlay>
                      ) : this.state.macronutrientsData.length === 0 &&
                        !this.state.isLoadingNutrients ? (
                        <View>
                          <View>
                            <Image
                              source={require('../resources/icon/nutrients_empty.png')}
                              style={{alignSelf: 'center', marginTop: 64}}
                            />
                            <Text style={styles.placeholderTitle}>
                              No Macronutrients
                            </Text>
                            <Text style={styles.placeholderText}>
                              Looks like you don’t have any data related to
                              macronutrients as of yet.
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View>
                          {this.state.macronutrientsData.length !== 0 && (
                            <View
                              style={{
                                width: 200,
                                height: 200,
                                alignSelf: 'center',
                                marginTop: 39,
                              }}
                              onTouchStart={(e) =>
                                this.setState({
                                  hintNutrientsTouchPosition: e.nativeEvent,
                                })
                              }>
                              <PieChart
                                style={{height: 200}}
                                data={this.state.macronutrientsPieChartData}
                                outerRadius="100%"
                                innerRadius="60%"
                                sort={() => null}
                              />
                            </View>
                          )}

                          <View
                            style={{
                              width: width - 40,
                              height: 0.5,
                              alignSelf: 'center',
                              backgroundColor: 'rgb(216,215,222)',
                              marginTop: 41,
                              marginBottom: 32,
                            }}
                          />

                          <View style={{width, height: 25}}>
                            <View
                              style={{
                                position: 'absolute',
                                right: 20,
                                bottom: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.macronutrientsResultTitle,
                                  {marginRight: 34},
                                ]}>
                                Total
                              </Text>
                              <Text
                                style={[
                                  styles.macronutrientsResultTitle,
                                  {marginRight: 62},
                                ]}>
                                Goal
                              </Text>
                            </View>
                          </View>

                          {this.state.macronutrientsData.length !== 0 && (
                            <TouchableWithoutFeedback
                              onPress={() =>
                                Actions.details({
                                  key: 'nutrientsDetails',
                                  title: 'Carbohydrates',
                                  dates: this.micronutrientsDates,
                                  micronutrientsPositionValues: this
                                    .micronutrientsPositionValues,
                                  initialPosition: this.state
                                    .micronutrientsPosition,
                                })
                              }>
                              <View
                                style={{
                                  width: width - 40,
                                  height: 48,
                                  alignSelf: 'center',
                                  borderTopWidth: 0.5,
                                  borderTopColor: 'rgb(216,215,222)',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(105,88,232)',
                                    marginRight: 10,
                                  }}
                                />
                                <Text style={styles.macronutrientsResultText}>
                                  Carbohydrates
                                </Text>

                                <View
                                  style={{
                                    position: 'absolute',
                                    right: 0,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  {typeof this.state.macronutrientsData[0] !==
                                    'undefined' &&
                                    typeof this.state.macronutrientsData[0]
                                      .carbs !== 'undefined' && (
                                      <Text
                                        style={[
                                          styles.macronutrientsResultText,
                                          {width: 31 + 29},
                                        ]}>{`${this.state.macronutrientsData[0].carbs.precent}%`}</Text>
                                    )}

                                  <Text
                                    style={[
                                      styles.macronutrientsResultText,
                                      {width: 57 + 25},
                                    ]}>{`${parseInt(
                                    (this.state.carbsMax2 / 500) * 100 - 5,
                                  )}-${parseInt(
                                    (this.state.carbsMax2 / 500) * 100,
                                  )}%`}</Text>
                                  <Image
                                    source={require('../resources/icon/arrowRight.png')}
                                    style={{}}
                                  />
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                          )}

                          {this.state.macronutrientsData.length !== 0 && (
                            <TouchableWithoutFeedback
                              onPress={() =>
                                Actions.details({
                                  key: 'nutrientsDetails',
                                  title: 'Fat',
                                  dates: this.micronutrientsDates,
                                  micronutrientsPositionValues: this
                                    .micronutrientsPositionValues,
                                  initialPosition: this.state
                                    .micronutrientsPosition,
                                })
                              }>
                              <View
                                style={{
                                  width: width - 40,
                                  height: 48,
                                  alignSelf: 'center',
                                  borderTopWidth: 0.5,
                                  borderTopColor: 'rgb(216,215,222)',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(42,204,197)',
                                    marginRight: 10,
                                  }}
                                />
                                <Text style={styles.macronutrientsResultText}>
                                  Fat
                                </Text>

                                <View
                                  style={{
                                    position: 'absolute',
                                    right: 0,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  {typeof this.state.macronutrientsData[0] !==
                                    'undefined' &&
                                    typeof this.state.macronutrientsData[0]
                                      .fat_total !== 'undefined' && (
                                      <Text
                                        style={[
                                          styles.macronutrientsResultText,
                                          {width: 31 + 29},
                                        ]}>{`${this.state.macronutrientsData[0].fat_total.precent}%`}</Text>
                                    )}

                                  <Text
                                    style={[
                                      styles.macronutrientsResultText,
                                      {width: 57 + 25},
                                    ]}>{`${parseInt(
                                    (this.state.fatMax2 / 500) * 100 - 5,
                                  )}-${parseInt(
                                    (this.state.fatMax2 / 500) * 100,
                                  )}%`}</Text>
                                  <Image
                                    source={require('../resources/icon/arrowRight.png')}
                                    style={{}}
                                  />
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                          )}

                          {this.state.macronutrientsData.length !== 0 && (
                            <TouchableWithoutFeedback
                              onPress={() =>
                                Actions.details({
                                  key: 'nutrientsDetails',
                                  title: 'Protein',
                                  dates: this.micronutrientsDates,
                                  micronutrientsPositionValues: this
                                    .micronutrientsPositionValues,
                                  initialPosition: this.state
                                    .micronutrientsPosition,
                                })
                              }>
                              <View
                                style={{
                                  width: width - 40,
                                  height: 48,
                                  alignSelf: 'center',
                                  borderTopWidth: 0.5,
                                  borderTopColor: 'rgb(216,215,222)',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'rgb(234,196,50)',
                                    marginRight: 10,
                                  }}
                                />
                                <Text style={styles.macronutrientsResultText}>
                                  Protein
                                </Text>

                                <View
                                  style={{
                                    position: 'absolute',
                                    right: 0,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  {typeof this.state.macronutrientsData[0] !==
                                    'undefined' &&
                                    typeof this.state.macronutrientsData[0]
                                      .protein !== 'undefined' && (
                                      <Text
                                        style={[
                                          styles.macronutrientsResultText,
                                          {width: 31 + 29},
                                        ]}>{`${this.state.macronutrientsData[0].protein.precent}%`}</Text>
                                    )}

                                  <Text
                                    style={[
                                      styles.macronutrientsResultText,
                                      {width: 57 + 25},
                                    ]}>{`${parseInt(
                                    (this.state.proteinMax2 / 500) * 100 - 5,
                                  )}-${parseInt(
                                    (this.state.proteinMax2 / 500) * 100,
                                  )}%`}</Text>
                                  <Image
                                    source={require('../resources/icon/arrowRight.png')}
                                    style={{}}
                                  />
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}

              {!this.state.isLoadingNutrients && (
                <View
                  style={{
                    width: width - 40,
                    height: 0.5,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(216,215,222)',
                    marginTop: 24,
                  }}
                />
              )}

              {!this.state.isMicronutrientsActive &&
                !this.state.isLoadingNutrients && (
                  <TouchableWithoutFeedback
                    onPress={this.handleNutrientsTargetPress}>
                    <View style={styles.preferencesButton}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={require('../resources/icon/target.png')}
                          style={{
                            marginRight: 10,
                            tintColor: 'rgb(0,168,235)',
                          }}
                        />

                        <Text style={styles.preferencesText}>
                          Adjust Macros
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )}
            </View>
          )}

          {this.state.tabActive === 3 && (
            <View>
              <View
                style={{
                  width: width - 40,
                  height: 44,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                  marginTop: 23,
                }}>
                <TouchableWithoutFeedback onPress={this.setPreviousCalories}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderRightWidth: 0.5,
                      borderRightColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      left: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/previous.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      caloriesWheelPosition: this.state.caloriesPosition,
                      isCaloriesWheelModalVisible: true,
                    })
                  }>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 44,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.dateText}>
                      {typeof this.state.currentDayCalories !== 'undefined' ||
                      typeof this.state.currentWeekCalories !== 'undefined'
                        ? this.getMappedDateCalories()
                        : 'Today'}
                    </Text>
                    {/*<Text style={styles.dateText}>{this.getCaloriesPositionValue()}</Text>*/}

                    <Image
                      source={require('../resources/icon/arrowDown.png')}
                      style={{marginLeft: 10}}
                    />
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.setNextCalories}>
                  <View
                    style={{
                      width: 40,
                      height: 44,
                      borderLeftWidth: 0.5,
                      borderLeftColor: 'rgb(221,224,228)',
                      position: 'absolute',
                      right: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../resources/icon/next.png')}
                      // style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {!this.state.isDayCalories ? (
                <View>
                  {this.state.isLoadingCalories ? (
                    <ShineOverlay>
                      <View>
                        <View
                          style={{
                            width: width - 176,
                            height: 28,
                            borderRadius: 14.5,
                            backgroundColor: 'rgb(242,243,246)',
                            marginHorizontal: 20,
                            marginTop: 38,
                          }}
                        />
                        <View
                          style={{
                            width: width - 225,
                            height: 12,
                            borderRadius: 9,
                            backgroundColor: 'rgb(242,243,246)',
                            marginHorizontal: 20,
                            marginTop: 10,
                          }}
                        />

                        <View
                          style={{
                            height: 250,
                            width: width - 40,
                            alignSelf: 'center',
                            marginTop: 34,
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'rgb(216,215,222)',
                          }}>
                          <View
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              minWidth: 19,
                              alignItems: 'flex-end',
                            }}>
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 37,
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 34,
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 34,
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 38,
                              }}
                            />
                          </View>

                          <View
                            style={{
                              position: 'absolute',
                              bottom: 32,
                              left: 34,
                              width: width - 85,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: 15,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                          </View>

                          <View
                            style={{
                              marginTop: 7.5,
                              width: width - 63,
                              height: 190,
                              marginLeft: 25,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 116,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 150,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 138,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 108,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 97,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 164,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>

                            <View
                              style={{
                                height: 184,
                                width: 38 * (width / 375),
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                                justifyContent: 'flex-end',
                              }}>
                              <View
                                style={{
                                  width: 18,
                                  height: 124,
                                  backgroundColor: 'rgb(242,243,246)',
                                  borderRadius: 9,
                                }}
                              />
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            width: width - 40,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            marginTop: 25,
                          }}>
                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: 'rgb(242,243,246)',
                              marginRight: 20,
                            }}
                          />
                          <View style={{marginTop: 4}}>
                            <View
                              style={{
                                width: width - 153,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: width - 129,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 6,
                              }}
                            />
                            <View
                              style={{
                                width: width - 181,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 6,
                              }}
                            />
                            <View
                              style={{
                                width: width - 225,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 6,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </ShineOverlay>
                  ) : this.state.caloriesWeekArray.length === 0 &&
                    !this.state.isLoadingCalories ? (
                    <View>
                      <View>
                        <Image
                          source={require('../resources/icon/calories_empty.png')}
                          style={{alignSelf: 'center', marginTop: 120}}
                        />
                        <Text style={styles.placeholderTitle}>No Calories</Text>
                        <Text style={styles.placeholderText}>
                          Looks like you don’t have any data related to calories
                          as of yet.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text
                        style={[
                          styles.foodRatingPercentageTitle,
                          {marginHorizontal: 20},
                        ]}>{`${Math.round(
                        this.state.caloriesData.daily_avg_cals,
                      ).toLocaleString('en-US')}`}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginHorizontal: 20,
                          marginTop: 4,
                        }}>
                        <Text style={styles.foodRatingPercentageText}>
                          {!this.state.isDayCalories
                            ? 'Daily Avg Kcal'
                            : 'Kcal'}
                        </Text>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: 'rgb(173,179,183)',
                            marginHorizontal: 8,
                          }}
                        />

                        {!this.state.isDayCalories ? (
                          <Text
                            style={
                              styles.foodRatingPercentageText
                            }>{`${this.state.currentWeekCalories[0].substring(
                            8,
                            10,
                          )} - ${this.state.currentWeekCalories[1].substring(
                            8,
                            10,
                          )} ${this.getMonthName(
                            this.state.currentWeekCalories[1].substring(5, 7),
                          )}`}</Text>
                        ) : (
                          <Text
                            style={
                              styles.foodRatingPercentageText
                            }>{`${this.state.currentDayCalories.substring(
                            8,
                            10,
                          )} ${this.getMonthName(
                            this.state.currentDayCalories.substring(5, 7),
                          )}`}</Text>
                        )}

                        <Text
                          style={[
                            styles.caloriesGoalText,
                            {position: 'absolute', right: 0},
                          ]}>{`Goal: ${
                          this.state.goals.CALORIES.value === false
                            ? (
                                Math.round(
                                  this.state.goals.CALORIES.recommended / 50,
                                ) * 50
                              ).toLocaleString('en-US')
                            : this.state.goals.CALORIES.value.toLocaleString(
                                'en-US',
                              )
                        }`}</Text>
                      </View>
                      <CaloriesGraphic
                        data={this.state.caloriesWeekArray}
                        dates={this.state.currentWeekCalories}
                        goal={this.state.goals.CALORIES.value}
                        onHint={() =>
                          this.scrollviewVertical.scrollTo({
                            x: 0,
                            y: 0,
                            animated: true,
                          })
                        }
                      />

                      <View
                        style={{
                          width: width - 40,
                          marginTop: 25,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={require('../resources/icon/icon_fire.png')}
                          style={{marginRight: 20}}
                        />

                        <View style={{width: width - 105}}>
                          <Text style={styles.foodRatingWeekText}>
                            {this.state.caloriesTips.text}
                          </Text>

                          {typeof this.state.caloriesTips !== 'undefined' &&
                            this.state.caloriesTips !== null &&
                            typeof this.state.caloriesTips.actions !==
                              'undefined' &&
                            this.state.caloriesTips.actions !== null && (
                              <TouchableWithoutFeedback
                                onPress={this.onCaloriesTipPress}>
                                <View
                                  style={{
                                    marginTop: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text style={styles.foodRatingWeekLink}>
                                    {typeof this.state.caloriesTips.actions
                                      .actionData !== 'undefined' &&
                                    typeof this.state.caloriesTips.actions
                                      .actionData.link !== 'undefined'
                                      ? this.state.caloriesTips.actions
                                          .actionData.link
                                      : 'Check your food choices'}
                                  </Text>
                                  <Image
                                    source={require('../resources/icon/arrowRight_blue.png')}
                                    style={{marginLeft: 10, marginTop: 2}}
                                  />
                                </View>
                              </TouchableWithoutFeedback>
                            )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View style={{marginTop: 0}}>
                  {this.state.isLoadingCalories ? (
                    <ShineOverlay>
                      <View>
                        <View
                          style={{
                            width: width - 176,
                            height: 28,
                            borderRadius: 14.5,
                            backgroundColor: 'rgb(242,243,246)',
                            marginHorizontal: 20,
                            marginTop: 38,
                          }}
                        />
                        <View
                          style={{
                            width: width - 225,
                            height: 12,
                            borderRadius: 9,
                            backgroundColor: 'rgb(242,243,246)',
                            marginHorizontal: 20,
                            marginTop: 10,
                          }}
                        />

                        <View
                          style={{
                            width: 200,
                            alignSelf: 'center',
                            marginTop: 47,
                          }}>
                          <PieChart
                            style={{height: 200}}
                            data={[
                              {
                                value: 33,
                                svg: {
                                  fill: 'rgb(242,243,246)',
                                },
                                key: 1,
                              },
                              {
                                value: 20,
                                svg: {
                                  fill: 'rgb(242,243,246)',
                                },
                                key: 2,
                              },
                              {
                                value: 29,
                                svg: {
                                  fill: 'rgb(242,243,246)',
                                },
                                key: 3,
                              },
                              {
                                value: 15,
                                svg: {
                                  fill: 'rgb(242,243,246)',
                                },
                                key: 4,
                              },
                            ]}
                            outerRadius="100%"
                            innerRadius="60%"
                            sort={() => null}
                          />
                        </View>

                        <View
                          style={{
                            width: width - 40,
                            height: 0.5,
                            alignSelf: 'center',
                            backgroundColor: 'rgb(216,215,222)',
                            marginTop: 43,
                          }}
                        />

                        <View
                          style={{
                            width: width - 40,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            marginTop: 25,
                          }}>
                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: 'rgb(242,243,246)',
                              marginRight: 20,
                            }}
                          />
                          <View style={{marginTop: 4}}>
                            <View
                              style={{
                                width: width - 153,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                              }}
                            />
                            <View
                              style={{
                                width: width - 129,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 6,
                              }}
                            />
                            <View
                              style={{
                                width: width - 181,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 6,
                              }}
                            />
                            <View
                              style={{
                                width: width - 225,
                                height: 12,
                                borderRadius: 9,
                                backgroundColor: 'rgb(242,243,246)',
                                marginTop: 6,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </ShineOverlay>
                  ) : this.state.caloriesSections.length === 0 &&
                    !this.state.isLoadingCalories ? (
                    <View>
                      <View>
                        <Image
                          source={require('../resources/icon/calories_empty.png')}
                          style={{alignSelf: 'center', marginTop: 120}}
                        />
                        <Text style={styles.placeholderTitle}>No Calories</Text>
                        <Text style={styles.placeholderText}>
                          Looks like you don’t have any data related to calories
                          as of yet.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View>
                        <Text
                          style={[
                            styles.foodRatingPercentageTitle,
                            {marginHorizontal: 20},
                          ]}>{`${Math.round(
                          this.state.caloriesData.daily_avg_cals,
                        ).toLocaleString('en-US')}`}</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 20,
                            marginTop: 4,
                          }}>
                          <Text style={styles.foodRatingPercentageText}>
                            {!this.state.isDayCalories
                              ? 'Daily Avg Kcal'
                              : 'Kcal'}
                          </Text>
                          <View
                            style={{
                              width: 3,
                              height: 3,
                              borderRadius: 1.5,
                              backgroundColor: 'rgb(173,179,183)',
                              marginHorizontal: 8,
                            }}
                          />

                          {!this.state.isDayCalories ? (
                            <Text
                              style={
                                styles.foodRatingPercentageText
                              }>{`${this.caloriesDates[
                              this.state.caloriesPosition
                            ][0].substring(8, 10)} ${this.getMonthName(
                              this.caloriesDates[
                                this.state.caloriesPosition
                              ][0].substring(5, 7),
                            )} - ${this.caloriesDates[
                              this.state.caloriesPosition
                            ][1].substring(8, 10)} ${this.getMonthName(
                              this.caloriesDates[
                                this.state.caloriesPosition
                              ][1].substring(5, 7),
                            )}`}</Text>
                          ) : (
                            <Text
                              style={
                                styles.foodRatingPercentageText
                              }>{`${this.state.currentDayCalories.substring(
                              8,
                              10,
                            )} ${this.getMonthName(
                              this.state.currentDayCalories.substring(5, 7),
                            )}`}</Text>
                          )}

                          <Text
                            style={[
                              styles.caloriesGoalText,
                              {position: 'absolute', right: 0},
                            ]}>{`Goal: ${
                            this.state.goals.CALORIES.value === false
                              ? (
                                  Math.round(
                                    this.state.goals.CALORIES.recommended / 50,
                                  ) * 50
                                ).toLocaleString('en-US')
                              : this.state.goals.CALORIES.value.toLocaleString(
                                  'en-US',
                                )
                          }`}</Text>
                        </View>

                        <View
                          style={{
                            width: 200,
                            height: 200,
                            alignSelf: 'center',
                            marginTop: 41,
                          }}
                          onTouchStart={(e) =>
                            this.setState({
                              hintCaloriesTouchPosition: e.nativeEvent,
                            })
                          }>
                          {/*<Pie
                            radius={100}
                            sections={this.state.caloriesSections}
                            dividerSize={2}
                            innerRadius={60}
                            strokeCap={'butt'}
                            onPress={() => console.log('onsection press')}
                          /> */}
                          <PieChart
                            style={{height: 200}}
                            data={this.state.caloriesSections}
                            outerRadius="100%"
                            innerRadius="60%"
                            sort={() => null}
                          />
                        </View>

                        <View
                          style={{
                            width: width - 40,
                            height: 0.5,
                            alignSelf: 'center',
                            backgroundColor: 'rgb(216,215,222)',
                            marginTop: 40,
                            marginBottom: 25,
                          }}
                        />

                        <View
                          style={{
                            width: width - 40,
                            marginTop: 0,
                            alignSelf: 'center',
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={require('../resources/icon/icon_fire.png')}
                            style={{marginRight: 20}}
                          />

                          <View style={{width: width - 105}}>
                            <Text style={styles.foodRatingWeekText}>
                              {this.state.caloriesTips.text}
                            </Text>

                            {typeof this.state.caloriesTips !== 'undefined' &&
                              this.state.caloriesTips !== null &&
                              typeof this.state.caloriesTips.actions !==
                                'undefined' &&
                              this.state.caloriesTips.actions !== null && (
                                <TouchableWithoutFeedback
                                  onPress={this.onCaloriesTipPress}>
                                  <View
                                    style={{
                                      marginTop: 16,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text style={styles.foodRatingWeekLink}>
                                      {typeof this.state.caloriesTips.actions
                                        .actionData !== 'undefined' &&
                                      typeof this.state.caloriesTips.actions
                                        .actionData.link !== 'undefined'
                                        ? this.state.caloriesTips.actions
                                            .actionData.link
                                        : 'Check your food choices'}
                                    </Text>
                                    <Image
                                      source={require('../resources/icon/arrowRight_blue.png')}
                                      style={{marginLeft: 10, marginTop: 2}}
                                    />
                                  </View>
                                </TouchableWithoutFeedback>
                              )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {!this.state.isLoadingCalories && (
                <View>
                  <View
                    style={{
                      width: width - 40,
                      height: 0.5,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(216,215,222)',
                      marginTop: 24,
                    }}
                  />

                  <TouchableWithoutFeedback
                    onPress={this.handleCaloriesTargetPress}>
                    <View style={styles.preferencesButton}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={require('../resources/icon/target.png')}
                          style={{
                            marginRight: 10,
                            tintColor: 'rgb(0,168,235)',
                          }}
                        />

                        <Text style={styles.preferencesText}>
                          Set Daily Calories
                        </Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            </View>
          )}

          <View style={{height: 102}} />
        </ScrollView>

        <Modal
          style={styles.modal}
          position={'bottom'}
          ref={'modal'}
          swipeToClose={false}
          swipeArea={50}
          coverScreen={true}>
          <ScrollView>
            <View style={{marginTop: 30}}>
              <Text style={styles.modalTitle}>Food Diary Preferences</Text>
              <Text style={styles.modalSubtitle}>
                Add/Remove meals from your meal plan.
              </Text>

              <View
                style={{
                  marginTop: 32,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.modalCategoryText}>FOOD DIARY VIEW</Text>
              </View>

              <FlatList
                data={this.state.foodDiaryArrayPreferences.filter((item) => {
                  return item.include === true;
                })}
                extraData={this.state.foodDiaryArrayPreferences}
                keyExtractor={(item, index) => item.name + index}
                renderItem={this._renderPreferencesItem}
                contentContainerStyle={{paddingTop: 10, paddingBottom: 32}}
                keyboardShouldPersistTaps="always"
                initialNumToRender={10}
                bounces={false}
              />

              <Text style={styles.modalCategoryText}>ADDITIONAL OPTIONS</Text>
              <FlatList
                data={this.state.foodDiaryArrayPreferences.filter((item) => {
                  return item.include === false;
                })}
                extraData={this.state.foodDiaryArrayPreferences}
                keyExtractor={(item, index) => item.name + index}
                renderItem={this._renderPreferencesItem}
                contentContainerStyle={{paddingTop: 10, paddingBottom: 24}}
                keyboardShouldPersistTaps="always"
                initialNumToRender={10}
                bounces={false}
              />

              <View
                style={{
                  width: width - 40,
                  height: 0.5,
                  alignSelf: 'center',
                  backgroundColor: 'rgb(216,215,222)',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 23,
                }}>
                <Text style={styles.modalSaveSettingsText}>
                  Save above settings as your preferred daily Food Diary view.
                </Text>

                <SwitchComponent
                  value={this.state.isSettingsSaved}
                  handler={(value) => this.onSettingsPress(value)}
                  disabled={false}
                />
              </View>
            </View>

            <View style={{height: 79 + 81}} />
          </ScrollView>

          <TouchableWithoutFeedback onPress={this.updatePreferences}>
            <View style={styles.updateButton}>
              <Text style={styles.updateText}>Update</Text>
            </View>
          </TouchableWithoutFeedback>
          {isIphoneX() ? (
            <View
              style={{
                height: 34,
                width,
                position: 'absolute',
                bottom: 79,
                backgroundColor: 'rgb(255,255,255)',
              }}
            />
          ) : null}
        </Modal>

        <Dialog
          visible={this.state.isScheduleModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isScheduleModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isScheduleModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onHardwareBackPress={() => {
            this.setState({isScheduleModalVisible: false});
            return true;
          }}>
          <DialogContent>
            <View style={[styles.card, {maxHeight: height}]}>
              <ScrollView>
                <View style={{overflow: 'hidden', borderRadius: 10}}>
                  <View style={styles.circleScheduleModal}>
                    <Image
                      source={require('../resources/icon/schedule.png')}
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
                    <Text style={styles.titleScheduleModal}>
                      Your Best Food Timings
                    </Text>
                    <Text style={styles.textScheduleModal}>
                      {`Timing is key to good health, ${
                        this.state.userName
                      }. ${'\n'}When and how to fuel your body is important! These are the best times for you to eat, based on your body's daily digestive rhythms:`}
                    </Text>
                  </View>

                  {this.state.chrono !== null &&
                    Array.isArray(this.state.chrono) &&
                    this.state.chrono.length !== 0 && (
                      <FlatList
                        data={this.state.chrono}
                        extraData={this.state.chrono}
                        keyExtractor={(item, index) => item.name + index}
                        renderItem={this._renderChronoItem}
                        contentContainerStyle={{
                          paddingTop: 24,
                          paddingBottom: 0,
                        }}
                        keyboardShouldPersistTaps="always"
                        initialNumToRender={10}
                        bounces={false}
                      />
                    )}

                  {/*<View style={{height: 64, width: width - 135, borderRadius: 4, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)', overflow: 'hidden', marginTop: 24, borderWidth: 1, borderColor: 'rgb(221,224,228)'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 2, height: 64, backgroundColor: 'rgb(244,88,152)'}} />

                    <View style={{marginLeft: 20}}>
                      <Text style={styles.cardTitleScheduleModal}>Breakfast</Text>
                      {(this.state.chrono !== null) && (
                        <Text style={styles.cardTextScheduleModal}>{`Anytime between ${this.formatAMPM(this.state.chrono.Breakfast.from)} - ${this.formatAMPM(this.state.chrono.Breakfast.til)}`}</Text>
                      )}
                    </View>
                  </View>

                </View> */}

                  {/*<View style={{height: 64, width: width - 135, borderRadius: 4, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)', overflow: 'hidden', marginTop: 16, borderWidth: 1, borderColor: 'rgb(221,224,228)'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 2, height: 64, backgroundColor: 'rgb(245,121,75)'}} />

                    <View style={{marginLeft: 20}}>
                      <Text style={styles.cardTitleScheduleModal}>Lunch</Text>
                      {(this.state.chrono !== null) && (
                        <Text style={styles.cardTextScheduleModal}>{`Anytime between ${this.formatAMPM(this.state.chrono.Lunch.from)} - ${this.formatAMPM(this.state.chrono.Lunch.til)}`}</Text>
                      )}
                    </View>
                  </View>

                </View> */}

                  {/*<View style={{height: 64, width: width - 135, borderRadius: 4, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)', overflow: 'hidden', marginTop: 16, borderWidth: 1, borderColor: 'rgb(221,224,228)'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: 2, height: 64, backgroundColor: 'rgb(0,187,116)'}} />

                    <View style={{marginLeft: 20}}>
                      <Text style={styles.cardTitleScheduleModal}>Dinner</Text>
                      {(this.state.chrono !== null) && (
                        <Text style={styles.cardTextScheduleModal}>{`Anytime between ${this.formatAMPM(this.state.chrono.Dinner.from)} - ${this.formatAMPM(this.state.chrono.Dinner.til)}`}</Text>
                      )}
                    </View>
                  </View>

                </View> */}
                </View>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({isScheduleModalVisible: false})
                  }>
                  <View
                    style={[
                      styles.modalSaveDiaryButton,
                      {
                        width: 180,
                        height: 40,
                        marginTop: 24,
                        marginBottom: 39,
                      },
                    ]}>
                    <Text style={styles.modalSaveDiaryButtonText}>
                      Continue to Diary
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isMealOptionsModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isMealOptionsModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isMealOptionsModalVisible: false});
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                alignSelf: 'center',
                marginBottom: isIphoneX() ? 34 : 0,
              }}>
              <View
                style={{
                  height: 104,
                  width: width - 20,
                  alignSelf: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    height: 52,
                    width: width - 20,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={styles.modalOptionsText}>Save Meal</Text>
                </View>
                <View
                  style={{
                    height: 52,
                    width: width - 20,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.modalOptionsText}>Share</Text>
                </View>
              </View>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({isMealOptionsModalVisible: false})
                }>
                <View
                  style={{
                    height: 52,
                    width: width - 20,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.modalOptionsButtonText}>Cancel</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isWaterOptionsModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isWaterOptionsModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isWaterOptionsModalVisible: false});
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                alignSelf: 'center',
                marginBottom: isIphoneX() ? 34 : 0,
              }}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({isWaterOptionsModalVisible: false}, () =>
                    setTimeout(() => {
                      this.setState({isWaterSettingsModalVisible: true});
                    }, 500),
                  )
                }>
                <View
                  style={{
                    height: 52,
                    width: width - 20,
                    alignSelf: 'center',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      height: 52,
                      width: width - 20,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.modalOptionsText}>Water Settings</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({isWaterOptionsModalVisible: false})
                }>
                <View
                  style={{
                    height: 52,
                    width: width - 20,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={styles.modalOptionsButtonText}>Cancel</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isWaterSettingsModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isWaterSettingsModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isWaterSettingsModalVisible: false});
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                alignSelf: 'center',
                height: isIphoneX() ? 254 : 220,
                width,
                backgroundColor: 'rgb(255,255,255)',
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
              }}>
              <View
                style={{
                  marginTop: 30,
                  marginHorizontal: 20,
                  marginBottom: 28,
                }}>
                <Text style={styles.waterSettingsTitle}>Water Settings</Text>
                <View
                  style={{
                    marginTop: 23,
                    height: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {this.state.waterMax2 === this.state.recommendedWater ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={require('../resources/icon/shaeFace.png')}
                        style={{marginRight: 10}}
                      />
                      <Text style={styles.waterSettingsText}>
                        Recommended Daily Goal
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.waterSettingsText}>Daily Goal</Text>
                  )}

                  {this.state.goals !== null && (
                    <Text
                      style={[
                        styles.waterSettingsText,
                        {
                          fontFamily: 'SFProText-Medium',
                          fontWeight: '500',
                          position: 'absolute',
                          right: 0,
                        },
                      ]}>{`${this.convertWater(this.state.waterMax2)} ${
                      this.state.goals.WATER.unit
                    }`}</Text>
                  )}
                </View>

                <Slider
                  value={this.state.waterMax2}
                  onValueChange={(value) => this.setState({waterMax2: value})}
                  minimumValue={0}
                  maximumValue={6000}
                  step={250}
                  marginTop={13}
                />
              </View>

              <TouchableWithoutFeedback onPress={this.onWaterSettingsDonePress}>
                <View style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isCaloriesModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isCaloriesModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isCaloriesModalVisible: false});
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                alignSelf: 'center',
                height: isIphoneX() ? 254 : 220,
                width,
                backgroundColor: 'rgb(255,255,255)',
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
              }}>
              <View
                style={{
                  marginTop: 30,
                  marginHorizontal: 20,
                  marginBottom: 28,
                }}>
                <Text style={styles.waterSettingsTitle}>Calories Settings</Text>
                <View
                  style={{
                    marginTop: 23,
                    height: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {this.state.goals !== null &&
                  this.state.caloriesMax2 ===
                    Math.round(this.state.goals.CALORIES.recommended / 50) *
                      50 ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={require('../resources/icon/shaeFace.png')}
                        style={{marginRight: 10}}
                      />
                      <Text style={styles.waterSettingsText}>
                        Recommended Daily Goal
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.waterSettingsText}>Daily Goal</Text>
                  )}

                  {this.state.goals !== null && (
                    <Text
                      style={[
                        styles.waterSettingsText,
                        {
                          fontFamily: 'SFProText-Medium',
                          fontWeight: '500',
                          position: 'absolute',
                          right: 0,
                        },
                      ]}>{`${this.convertWater(this.state.caloriesMax2)} ${
                      this.state.goals.CALORIES.unit
                    }`}</Text>
                  )}
                </View>

                <Slider
                  value={this.state.caloriesMax2}
                  onValueChange={(value) =>
                    this.setState({caloriesMax2: value})
                  }
                  minimumValue={0}
                  maximumValue={6000}
                  step={50}
                  marginTop={13}
                />
              </View>

              <TouchableWithoutFeedback
                onPress={this.onCaloriesSettingsDonePress}>
                <View style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isAdjustMacrosVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isAdjustMacrosVisible: false});
          }}
          onDismiss={() => {
            this.setState({isAdjustMacrosVisible: false});
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                alignSelf: 'center',
                height: isIphoneX() ? 398 + 34 : 398,
                width,
                backgroundColor: 'rgb(255,255,255)',
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
              }}>
              <View
                style={{
                  marginTop: 30,
                  marginHorizontal: 20,
                  marginBottom: 28,
                  flexDirection: 'row',
                }}>
                <Text style={styles.waterSettingsTitle}>Adjust Macros</Text>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      carbsMax2:
                        (500 / 100) * this.state.goals.MACRO_CARB.recommended,
                      fatMax2:
                        (500 / 100) * this.state.goals.MACRO_FAT.recommended,
                      proteinMax2:
                        (500 / 100) *
                        this.state.goals.MACRO_PROTIEN.recommended,
                    })
                  }>
                  <View
                    style={{
                      width: 64,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: 'rgb(0,168,235)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Text style={styles.foodRatingWeekLink}>Reset</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              {this.state.carbsMax2 +
                this.state.fatMax2 +
                this.state.proteinMax2 >
                500 && (
                <Text
                  style={[
                    styles.macrosErrorText,
                    {position: 'absolute', top: 60, left: 20},
                  ]}>
                  Macros goals must add up to 100%
                </Text>
              )}

              <View
                style={{
                  width: width - 40,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.macrosTitle}>
                  Carbohydrates
                  {/*<Text style={styles.macrosSubtitle}>{`  ${parseInt(
                    this.state.carbsMax2 * 0.95
                  )}-${this.state.carbsMax2}g`}</Text> */}
                </Text>
                <Text
                  style={[
                    styles.macrosTitle,
                    {
                      position: 'absolute',
                      right: 0,
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                    },
                  ]}>{`${parseInt(
                  (this.state.carbsMax2 / 500) * 100 - 5,
                )}-${parseInt((this.state.carbsMax2 / 500) * 100)}%`}</Text>
              </View>

              <Slider
                value={this.state.carbsMax2}
                onValueChange={(value) => this.setState({carbsMax2: value})}
                minimumValue={25}
                maximumValue={500}
                step={25}
                marginTop={14}
                color1="rgb(105,88,232)"
                color2="rgb(131,115,248)"
              />

              <View
                style={{
                  width: width - 40,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 24,
                }}>
                <Text style={styles.macrosTitle}>
                  Fat
                  {/*<Text style={styles.macrosSubtitle}>{`  ${parseInt(
                    this.state.fatMax2 * 0.95
                  )}-${this.state.fatMax2}g`}</Text> */}
                </Text>
                <Text
                  style={[
                    styles.macrosTitle,
                    {
                      position: 'absolute',
                      right: 0,
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                    },
                  ]}>{`${parseInt(
                  (this.state.fatMax2 / 500) * 100 - 5,
                )}-${parseInt((this.state.fatMax2 / 500) * 100)}%`}</Text>
              </View>

              <Slider
                value={this.state.fatMax2}
                onValueChange={(value) => this.setState({fatMax2: value})}
                minimumValue={25}
                maximumValue={500}
                step={25}
                marginTop={14}
                color1="rgb(42,204,197)"
                color2="rgb(42,189,204)"
              />

              <View
                style={{
                  width: width - 40,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 24,
                }}>
                <Text style={styles.macrosTitle}>
                  Protein
                  {/*<Text style={styles.macrosSubtitle}>{`  ${parseInt(
                    this.state.proteinMax2 * 0.95
                  )}-${this.state.proteinMax2}g`}</Text> */}
                </Text>
                <Text
                  style={[
                    styles.macrosTitle,
                    {
                      position: 'absolute',
                      right: 0,
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                    },
                  ]}>{`${parseInt(
                  (this.state.proteinMax2 / 500) * 100 - 5,
                )}-${parseInt((this.state.proteinMax2 / 500) * 100)}%`}</Text>
              </View>

              <Slider
                value={this.state.proteinMax2}
                onValueChange={(value) => this.setState({proteinMax2: value})}
                minimumValue={25}
                maximumValue={500}
                step={25}
                marginTop={14}
                color1="rgb(234,196,50)"
                color2="rgb(255,224,103)"
              />

              <TouchableWithoutFeedback onPress={this.onAdjustMacrosDonePress}>
                <View style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isSaveFoodDiaryViewModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
            this.onThanksPress();
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
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
            <View
              style={{
                width: width - 75,
                height: 350,
                borderRadius: 4,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <Image
                source={require('../resources/icon/saveFoodDiaryView.png')}
                style={{marginTop: 41, alignSelf: 'center'}}
              />

              <Text style={styles.modalSaveDiaryTitle}>
                Save Food Diary View
              </Text>
              <Text
                style={
                  styles.modalSaveDiaryText
                }>{`Would you like to save this as your preferred daily Food Diary view, ${this.state.userName}?`}</Text>

              <TouchableWithoutFeedback onPress={this.onSavePress}>
                <View style={styles.modalSaveDiaryButton}>
                  <Text style={styles.modalSaveDiaryButtonText}>Save Now</Text>
                </View>
              </TouchableWithoutFeedback>

              <Text
                onPress={this.onThanksPress}
                style={styles.modalSaveDiaryThanksText}>
                No, thank you!
              </Text>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isFoodRatingWheelModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isFoodRatingWheelModalVisible: false,
              foodRatingWheelPosition: this.state.foodRatingPosition,
            });
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 0,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback onPress={this.onFoodRatingDonePress}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  width,
                  height: 180,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <Picker
                  style={{
                    backgroundColor: 'white',
                    width,
                    height: 180,
                    alignSelf: 'center',
                  }}
                  selectedValue={
                    this.foodRatingPositionValues[
                      this.state.foodRatingWheelPosition
                    ]
                  }
                  pickerData={this.foodRatingPositionValues}
                  onValueChange={(value) =>
                    this.setFoodRatingPositionValue(value)
                  }
                  itemSpace={30} // this only support in android
                />
              </View>

              {isIphoneX() && <View style={{height: 37}} />}
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isCaloriesWheelModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isCaloriesWheelModalVisible: false,
              caloriesWheelPosition: this.state.caloriesPosition,
            });
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 0,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback onPress={this.onCaloriesDonePress}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  width,
                  height: 180,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <Picker
                  style={{
                    backgroundColor: 'white',
                    width,
                    height: 180,
                    alignSelf: 'center',
                  }}
                  selectedValue={
                    this.caloriesPositionValues[
                      this.state.caloriesWheelPosition
                    ]
                  }
                  pickerData={this.caloriesPositionValues}
                  onValueChange={(value) =>
                    this.setCaloriesPositionValue(value)
                  }
                  itemSpace={30} // this only support in android
                />
              </View>

              {isIphoneX() && <View style={{height: 37}} />}
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isMicronutrientsWheelModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isMicronutrientsWheelModalVisible: false,
              micronutrientsWheelPosition: this.state.micronutrientsPosition,
            });
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 0,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback
                onPress={this.onMicronutrientsDonePress}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  width,
                  height: 180,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <Picker
                  style={{
                    backgroundColor: 'white',
                    width,
                    height: 180,
                    alignSelf: 'center',
                  }}
                  selectedValue={
                    this.micronutrientsPositionValues[
                      this.state.micronutrientsWheelPosition
                    ]
                  }
                  pickerData={this.micronutrientsPositionValues}
                  onValueChange={(value) =>
                    this.setMicronutrientsPositionValue(value)
                  }
                  itemSpace={30} // this only support in android
                />
              </View>

              {isIphoneX() && <View style={{height: 37}} />}
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isHintModalVisible}
          containerStyle={{marginTop: 20}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isHintModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isHintModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              position: 'absolute',
              top: isIphoneX()
                ? this.state.hintTouchPosition.locationY - 253
                : Platform.OS === 'ios'
                ? this.state.hintTouchPosition.locationY - 103 - 100 + 20
                : this.state.hintTouchPosition.locationY - 103 - 100,
              left: isIphoneX()
                ? this.state.hintTouchPosition.locationX - 20
                : this.state.hintTouchPosition.locationX - 50,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({isHintModalVisible: false})}>
              <View>
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: 200,
                      height: 103,
                      y: 6,
                      border: 16,
                      radius: 4,
                      opacity: 0.08,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 103,
                      width: 200,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: this.state.hintColor,
                        marginHorizontal: 20,
                        marginTop: 19,
                      }}
                    />
                    <Text style={styles.hintTitle}>{this.state.hintText}</Text>
                    <Text
                      style={
                        styles.hintText
                      }>{`${this.state.hintValue}%`}</Text>
                  </View>
                </BoxShadow>

                <Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{marginTop: -8, marginLeft: 85}}>
                  <Svg height="30" width="75">
                    <Path
                      d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                      fill="white"
                      scale="0.05"
                    />
                  </Svg>
                </Animatable.View>
              </View>
            </TouchableWithoutFeedback>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isHintCaloriesModalVisible}
          containerStyle={{marginTop: 20}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isHintCaloriesModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isHintCaloriesModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              position: 'absolute',
              top: isIphoneX()
                ? this.state.hintCaloriesTouchPosition.locationY - 253
                : Platform.OS === 'ios'
                ? this.state.hintCaloriesTouchPosition.locationY -
                  103 -
                  100 +
                  20
                : this.state.hintCaloriesTouchPosition.locationY - 103 - 100,
              left: isIphoneX()
                ? this.state.hintCaloriesTouchPosition.locationX - 20 + 30
                : this.state.hintCaloriesTouchPosition.locationX - 50 + 30,
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({isHintCaloriesModalVisible: false})
              }>
              <View>
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: 140, // 200
                      height: 103,
                      y: 6,
                      border: 16,
                      radius: 4,
                      opacity: 0.08,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 103,
                      width: 140, // 200
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Image
                      source={this.state.hintCaloriesImage}
                      style={{
                        width: 15,
                        height: 15,
                        marginTop: 19,
                        marginLeft: 25,
                      }}
                      resizeMode="contain"
                    />

                    <Text style={[styles.hintTitle, {marginTop: 16}]}>
                      {this.state.hintCaloriesText}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 3,
                        marginLeft: 20,
                      }}>
                      <Text
                        style={[
                          styles.hintText,
                          {marginTop: 0, marginLeft: 0},
                        ]}>{`${this.state.hintCaloriesPercentage}%`}</Text>
                      <Text
                        style={[
                          styles.hintAddText,
                          {
                            marginTop: 0,
                            marginBottom: 2,
                            alignSelf: 'flex-end',
                          },
                        ]}>{`${this.state.hintCaloriesValue.toLocaleString(
                        'en-US',
                      )} kcal`}</Text>
                    </View>
                  </View>
                </BoxShadow>

                <Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{marginTop: -8, marginLeft: 85 - 30}}>
                  <Svg height="30" width="75">
                    <Path
                      d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                      fill="white"
                      scale="0.05"
                    />
                  </Svg>
                </Animatable.View>
              </View>
            </TouchableWithoutFeedback>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isHintNutrientsModalVisible}
          containerStyle={{marginTop: 20}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isHintNutrientsModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isHintNutrientsModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              position: 'absolute',
              top: isIphoneX()
                ? this.state.hintNutrientsTouchPosition.locationY - 293
                : Platform.OS === 'ios'
                ? this.state.hintNutrientsTouchPosition.locationY -
                  103 -
                  100 +
                  20
                : this.state.hintNutrientsTouchPosition.locationY - 103 - 100,
              left: isIphoneX()
                ? this.state.hintNutrientsTouchPosition.locationX - 20
                : this.state.hintNutrientsTouchPosition.locationX - 50,
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({isHintNutrientsModalVisible: false})
              }>
              <View>
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: 200,
                      height: 103,
                      y: 6,
                      border: 16,
                      radius: 4,
                      opacity: 0.08,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 103,
                      width: 200,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: this.state.hintNutrientsColor,
                        marginHorizontal: 20,
                        marginTop: 19,
                      }}
                    />
                    <Text style={styles.hintTitle}>
                      {this.state.hintNutrientsText}
                    </Text>
                    <Text
                      style={
                        styles.hintText
                      }>{`${this.state.hintNutrientsValue}%`}</Text>
                  </View>
                </BoxShadow>

                <Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{marginTop: -8, marginLeft: 85}}>
                  <Svg height="30" width="75">
                    <Path
                      d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                      fill="white"
                      scale="0.05"
                    />
                  </Svg>
                </Animatable.View>
              </View>
            </TouchableWithoutFeedback>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isCalendarVisible}
          containerStyle={{
            marginTop: isIphoneX() ? -130 : Platform.OS === 'ios' ? 50 : 0,
          }}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isCalendarVisible: false});
          }}
          onDismiss={() => {
            this.setState({isCalendarVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              width,
              borderRadius: 14,
              overflow: 'visible',
              backgroundColor: 'rgb(255,255,255)',
              elevation: 3,
              shadowColor: 'rgb(39,56,73)',
              shadowOffset: {width: 0, height: 6},
              shadowRadius: 16,
              shadowOpacity: 0.16,
            }}>
            <View
              style={{
                width,
                borderRadius: 14,
                backgroundColor: 'rgb(255,255,255)',
                alignSelf: 'center',
              }}>
              <Calendar
                ref={(header) => (this.calendar = header)}
                onDayPress={(day) => this.onDayPress(day)}
                // maxDate={new Date().toISOString().slice(0,10)}
                // onDayPress={() => null}
                firstDay={1}
                markingType={'custom'}
                markedDates={{
                  [this.state.selected]: {
                    selected: true,
                    disableTouchEvent: true,
                  },
                }}
                style={{
                  borderRadius: 14,
                }}
                theme={{
                  'stylesheet.calendar.header': {
                    header: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 8,
                      alignItems: 'center',
                      marginBottom: 19,
                    },
                    monthText: {
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                      fontSize: 14,
                      letterSpacing: -0.08,
                      color: 'rgb(54,58,61)',
                    },
                  },
                  // 'stylesheet.day.basic': {
                  'stylesheet.day.single': {
                    selected: {
                      backgroundColor: 'rgb(0,168,235)',
                      // borderRadius: 20,
                      borderWidth: 0,
                    },
                    today: {
                      // backgroundColor: appStyle.todayBackgroundColor,
                      // borderRadius: 16,
                      borderWidth: 0,
                    },
                    disabledText: {
                      borderWidth: 0,
                      color: 'rgb(205,209,215)',
                    },
                    text: {
                      marginTop: 0, //Platform.OS === 'android' ? 4 : 6,
                      fontSize: 15,
                      fontFamily: 'SFProText-Regular',
                      fontWeight: '400',
                      color: 'rgb(38,42,47)',
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      backgroundColor: 'rgba(255,255,255,0)',
                    },
                    base: {
                      // width: 40,
                      // height: 40,
                      // alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      alignItems: 'center',
                      borderWidth: 0, //2,
                      borderRadius: 18,
                      borderColor: 'rgb(0,168,235)',
                    },
                  },
                  selectedDayBackgroundColor: 'rgb(0,168,235)',
                  selectedDayTextColor: 'rgb(255,255,255)',
                  selectedDayFontFamily: 'SFProText-Regular',
                  selectedDayFontSize: 15,
                  indicatorColor: 'white',

                  dayTextColor: 'rgb(38,42,47)',
                  todayTextColor: 'rgb(0,168,235)',
                  monthTextColor: 'rgb(141,147,151)',

                  textDisabledColor: 'rgb(205,209,215)',
                  textDayFontFamily: 'SFProText-Regular',
                  textMonthFontFamily: 'SFProText-Medium',
                  textDayHeaderFontFamily: 'SFProText-Medium',
                  textDayFontWeight: '400',
                  textMonthFontWeight: '500',
                  textDayHeaderFontWeight: '500',
                  textDayFontSize: 15,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
                renderArrow={(direction) => (
                  <Image
                    source={require('../resources/icon/previous.png')}
                    style={{
                      transform: [
                        {rotate: direction === 'left' ? '0deg' : '180deg'},
                      ],
                      marginLeft: direction === 'left' ? -5 : 0,
                      marginRight: direction === 'left' ? 0 : -5,
                    }}
                  />
                )}
              />

              <View
                style={{
                  flexDirection: 'row',
                  width: width - 40,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 0,
                  marginTop: 26,
                }}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      isCalendarVisible: false,
                      selected: undefined,
                    })
                  }>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(255,255,255)',
                      borderWidth: 1,
                      borderColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}>
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.onCalendarDonePress}>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isNutrientsCalendarVisible}
          containerStyle={{
            marginTop: isIphoneX() ? -130 : Platform.OS === 'ios' ? 50 : 0,
          }}
          onTouchOutside={() => {
            this.setState({isNutrientsCalendarVisible: false});
          }}
          onDismiss={() => {
            this.setState({isNutrientsCalendarVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              width,
              borderRadius: 14,
              overflow: 'visible',
              backgroundColor: 'rgb(255,255,255)',
              elevation: 3,
              shadowColor: 'rgb(39,56,73)',
              shadowOffset: {width: 0, height: 6},
              shadowRadius: 16,
              shadowOpacity: 0.16,
            }}>
            <View
              style={{
                width,
                borderRadius: 14,
                backgroundColor: 'rgb(255,255,255)',
                alignSelf: 'center',
              }}>
              <Calendar
                ref={(header) => (this.calendar2 = header)}
                onDayPress={(day) => this.onDayorWeekPress(day)}
                firstDay={1}
                markingType={(this.state.selectDayOption == '1 day') ? 'custom' : 'period'}
                markedDates={
                  this.state.selectDayOption == '1 day' ?
                  {[this.state.nutrientsSelected]: {
                    selected: true,
                    disableTouchEvent: true,
                  }}
                  :
                  this.state.period
                }
                style={{
                  borderRadius: 14,
                }}
                theme={{
                  'stylesheet.calendar.header': {
                    header: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 8,
                      alignItems: 'center',
                      marginBottom: 19,
                    },
                    monthText: {
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                      fontSize: 14,
                      letterSpacing: -0.08,
                      color: 'rgb(54,58,61)',
                    },
                  },
                  // 'stylesheet.day.basic': {
                  'stylesheet.day.single': {
                    selected: {
                      backgroundColor: 'rgb(0,168,235)',
                      // borderRadius: 20,
                      borderWidth: 0,
                    },
                    today: {
                      // backgroundColor: appStyle.todayBackgroundColor,
                      // borderRadius: 16,
                      borderWidth: 0,
                    },
                    disabledText: {
                      borderWidth: 0,
                      color: 'rgb(205,209,215)',
                    },
                    text: {
                      marginTop: 0, //Platform.OS === 'android' ? 4 : 6,
                      fontSize: 15,
                      fontFamily: 'SFProText-Regular',
                      fontWeight: '400',
                      color: 'rgb(38,42,47)',
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      backgroundColor: 'rgba(255,255,255,0)',
                    },
                    base: {
                      // width: 40,
                      // height: 40,
                      // alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      alignItems: 'center',
                      borderWidth: 0, //2,
                      borderRadius: 18,
                      borderColor: 'rgb(0,168,235)',
                    },
                  },
                  selectedDayBackgroundColor: 'rgb(0,168,235)',
                  selectedDayTextColor: 'rgb(255,255,255)',
                  selectedDayFontFamily: 'SFProText-Regular',
                  selectedDayFontSize: 15,
                  indicatorColor: 'white',

                  dayTextColor: 'rgb(38,42,47)',
                  todayTextColor: 'rgb(0,168,235)',
                  monthTextColor: 'rgb(141,147,151)',

                  textDisabledColor: 'rgb(205,209,215)',
                  textDayFontFamily: 'SFProText-Regular',
                  textMonthFontFamily: 'SFProText-Medium',
                  textDayHeaderFontFamily: 'SFProText-Medium',
                  textDayFontWeight: '400',
                  textMonthFontWeight: '500',
                  textDayHeaderFontWeight: '500',
                  textDayFontSize: 15,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
                renderArrow={(direction) => (
                  <Image
                    source={require('../resources/icon/previous.png')}
                    style={{
                      transform: [
                        {rotate: direction === 'left' ? '0deg' : '180deg'},
                      ],
                      marginLeft: direction === 'left' ? -5 : 0,
                      marginRight: direction === 'left' ? 0 : -5,
                    }}
                  />
                )}
              />

              <View
                style={{
                  flexDirection: 'row',
                  width: width - 40,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 0,
                  marginTop: 26,
                }}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      isNutrientsCalendarVisible: false,
                      nutrientsSelected: undefined,
                    })
                  }>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(255,255,255)',
                      borderWidth: 1,
                      borderColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}>
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.onCalendarDoneNutrientsPress}>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isCaloriesCalendarVisible}
          containerStyle={{
            marginTop: isIphoneX() ? -130 : Platform.OS === 'ios' ? 50 : 0,
          }}
          onTouchOutside={() => {
            this.setState({isCaloriesCalendarVisible: false});
          }}
          onDismiss={() => {
            this.setState({isCaloriesCalendarVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              width,
              borderRadius: 14,
              overflow: 'visible',
              backgroundColor: 'rgb(255,255,255)',
              elevation: 3,
              shadowColor: 'rgb(39,56,73)',
              shadowOffset: {width: 0, height: 6},
              shadowRadius: 16,
              shadowOpacity: 0.16,
            }}>
            <View
              style={{
                width,
                borderRadius: 14,
                backgroundColor: 'rgb(255,255,255)',
                alignSelf: 'center',
              }}>
              <Calendar
                ref={(header) => (this.calendar3 = header)}
                onDayPress={(day) => this.onDayorWeekPress(day)}
                firstDay={1}
                markingType={(this.state.selectDayOption == '1 day') ? 'custom' : 'period'}
                markedDates={
                  this.state.selectDayOption == '1 day' ?
                  {[this.state.caloriesSelected]: {
                    selected: true,
                    disableTouchEvent: true,
                  }}
                  :
                  this.state.period
                }
                style={{
                  borderRadius: 14,
                }}
                theme={{
                  'stylesheet.calendar.header': {
                    header: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 8,
                      alignItems: 'center',
                      marginBottom: 19,
                    },
                    monthText: {
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                      fontSize: 14,
                      letterSpacing: -0.08,
                      color: 'rgb(54,58,61)',
                    },
                  },
                  // 'stylesheet.day.basic': {
                  'stylesheet.day.single': {
                    selected: {
                      backgroundColor: 'rgb(0,168,235)',
                      // borderRadius: 20,
                      borderWidth: 0,
                    },
                    today: {
                      // backgroundColor: appStyle.todayBackgroundColor,
                      // borderRadius: 16,
                      borderWidth: 0,
                    },
                    disabledText: {
                      borderWidth: 0,
                      color: 'rgb(205,209,215)',
                    },
                    text: {
                      marginTop: 0, //Platform.OS === 'android' ? 4 : 6,
                      fontSize: 15,
                      fontFamily: 'SFProText-Regular',
                      fontWeight: '400',
                      color: 'rgb(38,42,47)',
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      backgroundColor: 'rgba(255,255,255,0)',
                    },
                    base: {
                      // width: 40,
                      // height: 40,
                      // alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      alignItems: 'center',
                      borderWidth: 0, //2,
                      borderRadius: 18,
                      borderColor: 'rgb(0,168,235)',
                    },
                  },
                  selectedDayBackgroundColor: 'rgb(0,168,235)',
                  selectedDayTextColor: 'rgb(255,255,255)',
                  selectedDayFontFamily: 'SFProText-Regular',
                  selectedDayFontSize: 15,
                  indicatorColor: 'white',

                  dayTextColor: 'rgb(38,42,47)',
                  todayTextColor: 'rgb(0,168,235)',
                  monthTextColor: 'rgb(141,147,151)',

                  textDisabledColor: 'rgb(205,209,215)',
                  textDayFontFamily: 'SFProText-Regular',
                  textMonthFontFamily: 'SFProText-Medium',
                  textDayHeaderFontFamily: 'SFProText-Medium',
                  textDayFontWeight: '400',
                  textMonthFontWeight: '500',
                  textDayHeaderFontWeight: '500',
                  textDayFontSize: 15,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
                renderArrow={(direction) => (
                  <Image
                    source={require('../resources/icon/previous.png')}
                    style={{
                      transform: [
                        {rotate: direction === 'left' ? '0deg' : '180deg'},
                      ],
                      marginLeft: direction === 'left' ? -5 : 0,
                      marginRight: direction === 'left' ? 0 : -5,
                    }}
                  />
                )}
              />

              <View
                style={{
                  flexDirection: 'row',
                  width: width - 40,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 0,
                  marginTop: 26,
                }}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      isCaloriesCalendarVisible: false,
                      caloriesSelected: undefined,
                    })
                  }>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(255,255,255)',
                      borderWidth: 1,
                      borderColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}>
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.onCalendarDoneCaloriesPress}>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.daySelectionPicker}
          onTouchOutside={() => {
            this.setState({
              daySelectionPicker: !this.state.daySelectionPicker,
            });
          }}
          containerStyle={{
           justifyContent: 'flex-end'
          }}
          // onDismiss={() => {
          //   this.setState({ daySelectionPicker: false });
          // }}
          // dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback onPress={() => this.dayPickerSelectionDone()}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{width: width - 40, height: 120, alignSelf: 'center'}}>
                  <TouchableWithoutFeedback onPress={() => this.dayPickerSelection('1 day')}>
                    <View
                    style={{
                      width: width - 40,
                      height: 44,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      backgroundColor: this.state.selectDayOption === '1 day' ? '#00a8eb' : '#fff',
                      color: this.state.selectDayOption === '1 day' ? '#fff' : '#000',
                    }}>
                    <Text style={{textAlign: 'center', fontSize: 16}}>1 day</Text>
                   </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this.dayPickerSelection('7 day')}>
                    <View
                      style={{
                        width: width - 40,
                        height: 44,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        color: this.state.selectDayOption === '7 day' ? '#fff' : '#000',
                        backgroundColor: this.state.selectDayOption === '7 day' ? '#00a8eb' : '#fff'
                      }}>
                    <Text style={{textAlign: 'center', fontSize: 16}}>7 day</Text>
                    </View>
                  </TouchableWithoutFeedback>
              </View>

              {isIphoneX() && <View style={{height: 37}} />}
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isRatingsCalendarVisible}
          containerStyle={{
            marginTop: isIphoneX() ? -130 : Platform.OS === 'ios' ? 50 : 0,
          }}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isRatingsCalendarVisible: false});
          }}
          onDismiss={() => {
            this.setState({isRatingsCalendarVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
            alignSelf: 'center',
          }}>
          <DialogContent
            style={{
              width,
              borderRadius: 14,
              overflow: 'visible',
              backgroundColor: 'rgb(255,255,255)',
              elevation: 3,
              shadowColor: 'rgb(39,56,73)',
              shadowOffset: {width: 0, height: 6},
              shadowRadius: 16,
              shadowOpacity: 0.16,
            }}>
            <View
              style={{
                width,
                borderRadius: 14,
                backgroundColor: 'rgb(255,255,255)',
                alignSelf: 'center',
              }}>
              <Calendar
                ref={(header) => (this.ratingsCalendar = header)}
                firstDay={1}
                // onDayPress={(day) => this.onRatingDayPress(day)}
                // onMonthChange={(month) => this.onRatingsMonthChange(month)}                
                // // maxDate={new Date().toISOString().slice(0,10)}
                // // onDayPress={() => null}
                // markingType={'custom'}
                // // markingType={"period"}
                // markedDates={{
                //   ...this.state.ratingsCalendarMarkedDates,
                //   [this.state.ratingsSelectedDate]: {
                //     selected: true,
                //     disableTouchEvent: true,
                //   },
                // }}
                onDayPress={(day) => this.onDayorWeekPress(day)}
                markingType={(this.state.selectDayOption == '1 day') ? 'custom' : 'period'}
                markedDates={
                  this.state.selectDayOption == '1 day' ?
                  {[this.state.ratingsSelectedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                  }}
                  :
                  this.state.period
                }
                style={{
                  borderRadius: 14,
                }}
                theme={{
                  'stylesheet.calendar.header': {
                    header: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 8,
                      alignItems: 'center',
                      marginBottom: 19,
                    },
                    monthText: {
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                      fontSize: 14,
                      letterSpacing: -0.08,
                      color: 'rgb(54,58,61)',
                    },
                  },
                  // 'stylesheet.day.basic': {
                  'stylesheet.day.single': {
                    selected: {
                      backgroundColor: 'rgb(0,168,235)',
                      // borderRadius: 20,
                      borderWidth: 0,
                    },
                    today: {
                      // backgroundColor: appStyle.todayBackgroundColor,
                      // borderRadius: 16,
                      borderWidth: 0,
                    },
                    disabledText: {
                      borderWidth: 0,
                      color: 'rgb(205,209,215)',
                    },
                    text: {
                      marginTop: 0, //Platform.OS === 'android' ? 4 : 6,
                      fontSize: 15,
                      fontFamily: 'SFProText-Regular',
                      fontWeight: '400',
                      color: 'rgb(38,42,47)',
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      backgroundColor: 'rgba(255,255,255,0)',
                    },
                    base: {
                      // width: 40,
                      // height: 40,
                      // alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      alignItems: 'center',
                      borderWidth: 0, //2,
                      borderRadius: 18,
                      borderColor: 'rgb(0,168,235)',
                    },
                  },
                  selectedDayBackgroundColor: 'rgb(0,168,235)',
                  selectedDayTextColor: 'rgb(255,255,255)',
                  selectedDayFontFamily: 'SFProText-Regular',
                  selectedDayFontSize: 15,
                  indicatorColor: 'white',

                  dayTextColor: 'rgb(38,42,47)',
                  todayTextColor: 'rgb(0,168,235)',
                  monthTextColor: 'rgb(141,147,151)',

                  textDisabledColor: 'rgb(205,209,215)',
                  textDayFontFamily: 'SFProText-Regular',
                  textMonthFontFamily: 'SFProText-Medium',
                  textDayHeaderFontFamily: 'SFProText-Medium',
                  textDayFontWeight: '400',
                  textMonthFontWeight: '500',
                  textDayHeaderFontWeight: '500',
                  textDayFontSize: 15,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
                renderArrow={(direction) => (
                  <Image
                    source={require('../resources/icon/previous.png')}
                    style={{
                      transform: [
                        {rotate: direction === 'left' ? '0deg' : '180deg'},
                      ],
                      marginLeft: direction === 'left' ? -5 : 0,
                      marginRight: direction === 'left' ? 0 : -5,
                    }}
                  />
                )}
              />

              <View
                style={{
                  flexDirection: 'row',
                  width: width - 40,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 0,
                  marginTop: 26,
                }}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      isRatingsCalendarVisible: false,
                      ratingsSelectedDate: undefined,
                    })
                  }>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(255,255,255)',
                      borderWidth: 1,
                      borderColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}>
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={this.onRatingsCalendarDonePress}>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: 'rgb(0,168,235)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 48,
    overflow: 'visible',
    backgroundColor: 'rgb(250,252,255)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgb(211,213,216)',
    // marginHorizontal: 20
  },
  tabActiveText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    letterSpacing: -0.08,
    color: 'rgb(0,168,235)',
    // marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  tabInactiveText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    letterSpacing: -0.08,
    color: 'rgb(138,138,143)',
    // marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: '#00a8eb',
    position: 'absolute',
    bottom: 0,
  },
  dateText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: -0.08,
    color: 'rgb(54,58,61)',
  },
  title: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(31,33,35)',
    // letterSpacing: -0.3
  },
  subtitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
    marginTop: 4,
  },
  divider: {
    width: width - 80,
    height: 0.5,
    alignSelf: 'center',
    backgroundColor: 'rgb(216,215,222)',
    marginTop: 16,
  },
  addText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    color: 'rgb(0,164,228)',
    letterSpacing: -0.3,
  },
  preferencesButton: {
    width: width - 40,
    height: 44,
    alignSelf: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  preferencesText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    color: 'rgb(0,168,235)',
    letterSpacing: -0.36,
    lineHeight: 22,
  },
  modal: {
    width: width,
    marginTop: 79,
    borderRadius: 14,
    backgroundColor: 'rgb(255,255,255)',
  },
  modalTitle: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: -0.48,
    color: 'rgb(38,42,47)',
    marginHorizontal: 20,
  },
  modalSubtitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(106,111,115)',
    lineHeight: 18,
    marginTop: 6,
    marginHorizontal: 20,
  },
  modalCategoryText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.21,
    color: 'rgb(36,76,138)',
    // marginTop: 32,
    marginHorizontal: 20,
  },
  modalSubcategoryText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(31,33,35)',
    // marginTop: 32,
    marginLeft: 15,
  },
  modalRemoveButton: {
    width: 90,
    height: 28,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgb(235,75,75)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    // top: '50%'
  },
  modalRemoveButtonText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgb(235,75,75)',
  },
  modalAddButton: {
    width: 60,
    height: 28,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    // top: '50%'
  },
  modalAddButtonText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgb(0,168,235)',
  },
  modalSaveSettingsText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgb(31,33,35)',
    lineHeight: 20,
    marginLeft: 20,
    width: width - 135,
  },
  modalScheduleContainer: {
    width: 130,
    height: 21,
    borderRadius: 10,
    backgroundColor: 'rgba(105,88,232,0.1)',
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalScheduleText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 12,
    color: 'rgb(105,88,232)',
    // marginTop: 32,
    letterSpacing: -0.2,
    marginLeft: 6,
  },
  updateButton: {
    width: width,
    height: 48,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0,168,235)',
    position: 'absolute',
    bottom: isIphoneX() ? 79 + 34 : 79,
  },
  updateText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: 'rgb(255,255,255)',
    letterSpacing: -0.4,
  },
  card: {
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
  },
  titleScheduleModal: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    marginTop: 24,
    lineHeight: 22,
  },
  textScheduleModal: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    width: width - 125,
  },
  cardTitleScheduleModal: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(38,42,47)',
  },
  cardTextScheduleModal: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(106,111,115)',
    marginTop: 2,
  },
  circleScheduleModal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(105,88,232,0.11)',
    alignSelf: 'center',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRound: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 24,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {height: 6, width: 0},
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionsText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 17,
    color: 'rgb(31,33,35)',
    // marginTop: 32,
    letterSpacing: -0.3,
  },
  modalOptionsButtonText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.3,
    color: 'rgb(0,164,228)',
  },
  waterSettingsTitle: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: -0.48,
    color: 'rgb(38,42,47)',
  },
  waterSettingsText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgb(38,42,47)',
  },
  doneButton: {
    width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isIphoneX() ? 34 : 0,
  },
  doneButtonText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    // letterSpacing: -0.36,
    color: 'rgb(255,255,255)',
  },
  recommendedText: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 13,
    fontWeight: '600',
    color: 'rgb(36,76,138)',
    letterSpacing: -0.21,
  },
  modalSaveDiaryTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    marginTop: 24,
  },
  modalSaveDiaryText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    marginTop: 10,
    width: width - 135,
    textAlign: 'center',
  },
  modalSaveDiaryButton: {
    width: width - 195,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  modalSaveDiaryButtonText: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
  modalSaveDiaryThanksText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(141,147,151)',
    alignSelf: 'center',
    marginTop: 16,
  },
  calendarCancelText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: 'rgb(0,168,235)',
  },
  calendarDoneText: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 15,
    fontWeight: '600',
    color: 'rgb(255,255,255)',
  },
  foodItemTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: 'rgb(38,42,47)',
    width: width - 220,
  },
  foodItemText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(141,147,151)',
    marginTop: 2,
  },
  foodItemCals: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(38,42,47)',
    position: 'absolute',
    top: 28,
    right: 18,
  },
  addTimeText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(0,168,235)',
  },
  doneText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(0,168,235)',
    lineHeight: 22,
    letterSpacing: -0.41,
    position: 'absolute',
    right: 0,
  },
  foodRatingPercentageTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 32,
    fontWeight: '400',
    color: 'rgb(54,58,61)',
    marginHorizontal: 23,
    marginTop: 32,
  },
  foodRatingPercentageText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(141,147,151)',
  },
  foodRatingWeekText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
  },
  foodRatingWeekLink: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(0,168,235)',
  },
  micronutrientsTitleOff: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(138,138,143)',
  },
  micronutrientsTitleOn: {
    fontFamily: 'SFProText-Medium',
    fontSize: 14,
    fontWeight: '500',
    color: 'rgb(38,42,47)',
  },
  micronutrientsText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: -0.41,
    color: 'rgb(54,58,61)',
  },
  macronutrientsResultTitle: {
    fontFamily: 'SFProText-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(54,58,61)',
  },
  macronutrientsResultText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: 'rgb(54,58,61)',
  },
  macrosTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgb(38,42,47)',
  },
  macrosSubtitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgb(141,147,151)',
  },
  macrosErrorText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: 'rgb(228,77,77)',
  },
  caloriesGoalText: {
    fontFamily: 'SFProText-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgb(54,58,61)',
  },
  hintTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(141,147,151)',
    marginTop: 16,
    marginLeft: 20,
  },
  hintText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 20,
    color: 'rgb(54,58,61)',
    marginTop: 3,
    marginLeft: 20,
  },
  hintAddText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgb(54,58,61)',
    marginLeft: 6,
  },
  placeholderTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    marginTop: 24,
    alignSelf: 'center',
  },
  placeholderText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
    width: width - 135,
  },
  mealCaloriesTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    color: 'rgb(38,42,47)',
    textAlign: 'right',
  },
  mealCaloriesText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
    textAlign: 'right',
    marginTop: 2,
  },
  totalCaloriesNumber: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    color: 'rgb(38,42,47)',
  },
  totalCaloriesName: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgb(0,168,235)',
    marginTop: 2,
  },
});

export default FoodDiary;

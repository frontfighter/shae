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
  Alert,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import {Picker} from 'react-native-wheel-pick';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import StepsChart from '../components/StepsChart';
import WalkRunChart from '../components/WalkRunChart';
import FlightsChart from '../components/FlightsChart';
import TrackCaloriesChart from '../components/TrackCaloriesChart';
import HeartRateChart from '../components/HeartRateChart';
import SleepChart from '../components/SleepChart';

const {height, width} = Dimensions.get('window');

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

class WearablesTrackingScreen extends Component {
  static onEnter() {
    console.log('onEnter');
  }

  constructor() {
    super();

    this.state = {
      position: 3,
      wheelPosition: 3,
      data: [],
      selectedDate: undefined,
      isDay: false,
      days: [],
      currentDay: '',
      weeks: [],
      currentWeek: [],
      unit: null,

      isLoading: false,
      isWheelModalVisible: false,
      isCalendarVisible: false,
      selected: undefined,
    };

    this.positionValues = [
      'Today',
      'Yesterday',
      'Last Week',
      'This Week',
      'Custom',
    ];
    this.dates = [];
  }

  componentDidMount() {
    this.setState({unit: this.props.unit});
    Actions.refresh({title: this.props.title});

    this.setDates();
  }

  setDates = () => {
    let datesArray = [];
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let todayOffsetHours = -today.getTimezoneOffset() / 60;
    today.setHours(today.getHours() + todayOffsetHours);
    yesterday.setHours(yesterday.getHours() + todayOffsetHours);

    today = today.toISOString().slice(0, 10);
    yesterday = yesterday.toISOString().slice(0, 10);

    let lastWeek = this.getPreviousWeek();

    const curr = new Date();
    const firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    const lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));
    lastday.setHours(lastday.getHours() + todayOffsetHours);
    let thisWeek = [this.getMonday(), lastday.toISOString().slice(0, 10)];

    datesArray.push(today);
    datesArray.push(yesterday);
    datesArray.push(lastWeek);
    datesArray.push(thisWeek);

    console.log('setDates', datesArray);

    this.dates = datesArray;

    console.log('this.state.currentWeek', this.state.currentWeek);

    this.setState({
      days: [this.dates[0], this.dates[1]],
      currentDay: this.dates[0],
      weeks: [this.dates[3], this.dates[2]],
      currentWeek: this.dates[3],
    });
  };

  getPositionValue = () => {
    return this.positionValues[this.state.position];
  };

  setPreviousDate = () => {
    if (this.state.isDay) {
      let data = this.state.currentDay;

      console.log('setPreviousDate data', data);
      let date = new Date(
        data.substring(0, 4),
        parseInt(data.substring(5, 7)) - 1,
        data.substring(8, 10),
        12,
      );
      date.setDate(date.getDate() - 1);
      console.log('setPreviousDate', date);
      console.log('setPreviousDate', this.dates);
      date = date.toISOString().slice(0, 10);

      let array = this.state.days;
      array.push(date);
      this.setState({days: array, currentDay: date});
      console.log('setPreviousDate', date);

      this.getData(date);
    } else {
      let data = this.state.currentWeek;

      let previousWeek = this.getPreviousWeekTrack();
      console.log('previousWeek', previousWeek, this.state.currentWeek);
      let array = this.state.weeks;
      array.push(previousWeek);
      this.setState({weeks: array, currentWeek: previousWeek});

      this.getData(previousWeek);
    }
  };

  setNextDate = () => {
    if (this.state.isDay) {
      if (this.state.currentDay !== this.state.days[0]) {
        let date = new Date(
          this.state.currentDay.substring(0, 4),
          parseInt(this.state.currentDay.substring(5, 7)) - 1,
          this.state.currentDay.substring(8, 10),
          12,
        );
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);

        this.setState({currentDay: date});

        this.getData(date);
      }
    } else {
      if (this.state.currentWeek[0] !== this.state.weeks[0][0]) {
        let data = this.state.currentWeek[1];

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

        let week = [firstDate.toISOString().slice(0, 10), lastDate];
        if (week[0] === this.state.weeks[0][0]) {
          week = this.state.weeks[0];
        } else if (week[0] === this.state.weeks[1][0]) {
          week = this.state.weeks[1];
        }

        this.setState({currentWeek: week});

        this.getData(week);
      }
    }
  };

  getPreviousWeekTrack = () => {
    let data = this.state.currentWeek[1];

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

    console.log('getPreviousWeekTrack', firstDate, lastDate);

    return [firstDate.toISOString().slice(0, 10), lastDate];
  };

  getMappedDate = () => {
    if (this.state.isDay) {
      let day = '';
      for (let i = 0; i < this.dates.length; i++) {
        console.log('getMappedDate', this.dates[i], this.state.currentDay);
        if (this.dates[i] === this.state.currentDay) {
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
        console.log('this.state.currentDay', this.state.currentDay);
        return `${this.getMonthName(
          this.state.currentDay.substring(5, 7),
        )} ${this.state.currentDay.substring(8, 10)}`;
      }
    } else {
      let week = '';
      for (let i = 0; i < this.dates.length; i++) {
        console.log('getMappedDate', this.dates[i], this.state.currentWeek);
        console.log(
          'getMappedDate this.props.dates[i][0]',
          this.dates[i][0],
          this.state.currentWeek[0],
          i,
        );
        console.log(
          'getMappedDate this.props.dates[i][1]',
          this.dates[i][1],
          this.state.currentWeek[1],
          i,
        );
        if (
          Array.isArray(this.dates[i]) &&
          this.dates[i][0] === this.state.currentWeek[0]
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
        console.log('this.state.currentWeek', this.state.currentWeek);
        return `${this.state.currentWeek[0].substring(
          8,
          10,
        )} - ${this.state.currentWeek[1].substring(8, 10)} ${this.getMonthName(
          this.state.currentWeek[1].substring(5, 7),
        )}`;
      }
    }
  };

  setPositionValue = (value) => {
    for (let i = 0; i < this.positionValues.length; i++) {
      if (this.positionValues[i] === value) {
        this.setState({wheelPosition: i});
        break;
      }
    }
  };

  onDonePress = () => {
    this.setState(
      {
        isWheelModalVisible: false,
        position: this.state.wheelPosition,
      },
      () => {
        if (this.state.wheelPosition !== 4) {
          if (Array.isArray(this.dates[this.state.position])) {
            this.setState({
              isDay: false,
              currentWeek: this.dates[this.state.position],
            });
          } else {
            this.setState({
              isDay: true,
              currentDay: this.dates[this.state.position],
            });
          }

          this.getData();
        }

        if (this.state.wheelPosition === 4) {
          this.setState({isCalendarVisible: true});
        }
      },
    );
  };

  getData = (date) => {};

  getMonday = () => {
    let date = new Date();
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1);

    let newDate = new Date(date.setDate(diff));
    let todayOffsetHours = -newDate.getTimezoneOffset() / 60;
    newDate.setHours(newDate.getHours() + todayOffsetHours);

    return newDate.toISOString().slice(0, 10); //new Date(date.setDate(diff)).toISOString().slice(0, 10);
  };

  getPreviousWeek = () => {
    let date = new Date();
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -7 : 0);
    let newDate = new Date(date.setDate(diff));
    // let todayOffsetHours = -newDate.getTimezoneOffset() / 60;
    // newDate.setHours(newDate.getHours() + todayOffsetHours);

    const lastDate = new Date(newDate).toISOString().slice(0, 10);
    let firstDate = new Date(newDate);
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

  onCalendarDonePress = async () => {
    if (this.state.selected != undefined) {
      this.setState({
        isCalendarVisible: false,
        isDay: true,
        currentDay: this.state.selected,
      });
    } else {
      Alert.alert('Please select date');
    }
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

  onSwipeLeft(gestureState) {
    this.setNextDate();
  }

  onSwipeRight(gestureState) {
    this.setPreviousDate();
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        this.setNextDate();
        break;
      case SWIPE_RIGHT:
        this.setPreviousDate();
        break;
    }
  }

  render() {
    console.log('device width', width);
    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        <ScrollView ref={(ref) => (this.scrollviewVertical = ref)}>
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
            <TouchableWithoutFeedback onPress={this.setPreviousDate}>
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
                <Image source={require('../resources/icon/previous.png')} />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  wheelPosition: this.state.position,
                  isWheelModalVisible: true,
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
                  {this.state.currentDay !== '' &&
                  this.state.currentWeek.length !== 0
                    ? this.getMappedDate()
                    : 'Today'}
                </Text>

                <Image
                  source={require('../resources/icon/arrowDown.png')}
                  style={{marginLeft: 10}}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={this.setNextDate}>
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
                <Image source={require('../resources/icon/next.png')} />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View>
            {this.props.title === 'Steps' &&
              this.state.currentDay !== '' &&
              this.state.currentWeek.length !== 0 && (
                <GestureRecognizer
                  onSwipe={(direction, state) => this.onSwipe(direction, state)}
                  onSwipeLeft={(state) => this.onSwipeLeft(state)}
                  onSwipeRight={(state) => this.onSwipeRight(state)}>
                  <StepsChart
                    // data={[
                    //   { value: 5144, date: "2020-06-29", hours: "12" },
                    //   { value: 7400, date: "2020-06-30", hours: "12" },
                    //   { value: 6073, date: "2020-07-01", hours: "12" },
                    //   { value: 4568, date: "2020-07-02", hours: "12" },
                    //   { value: 5109, date: "2020-07-03", hours: "12" },
                    //   { value: 6123, date: "2020-07-04", hours: "12" },
                    //   { value: 3242, date: "2020-07-05", hours: "12" },
                    //   { value: 8901, date: "2020-07-06", hours: "12" },
                    //   { value: 12500, date: "2020-07-07", hours: "12" },
                    // ]}
                    getMappedDate={this.getMappedDate}
                    unit={this.state.unit}
                    isDay={this.state.isDay}
                    dates={
                      this.state.isDay
                        ? this.state.currentDay
                        : this.state.currentWeek
                    }
                    onHint={() =>
                      this.scrollviewVertical.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      })
                    }
                  />
                </GestureRecognizer>
              )}

            {this.props.title === 'Walk + Run' &&
              this.state.currentDay !== '' &&
              this.state.currentWeek.length !== 0 && (
                <GestureRecognizer
                  onSwipe={(direction, state) => this.onSwipe(direction, state)}
                  onSwipeLeft={(state) => this.onSwipeLeft(state)}
                  onSwipeRight={(state) => this.onSwipeRight(state)}>
                  <WalkRunChart
                    isDay={this.state.isDay}
                    unit={this.state.unit}
                    // unit="metric"
                    getMappedDate={this.getMappedDate}
                    dates={
                      this.state.isDay
                        ? this.state.currentDay
                        : this.state.currentWeek
                    }
                    onHint={() =>
                      this.scrollviewVertical.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      })
                    }
                  />
                </GestureRecognizer>
              )}

            {this.props.title === 'Flights Climbed' &&
              this.state.currentDay !== '' &&
              this.state.currentWeek.length !== 0 && (
                <GestureRecognizer
                  onSwipe={(direction, state) => this.onSwipe(direction, state)}
                  onSwipeLeft={(state) => this.onSwipeLeft(state)}
                  onSwipeRight={(state) => this.onSwipeRight(state)}>
                  <FlightsChart
                    isDay={this.state.isDay}
                    unit={this.state.unit}
                    getMappedDate={this.getMappedDate}
                    dates={
                      this.state.isDay
                        ? this.state.currentDay
                        : this.state.currentWeek
                    }
                    onHint={() =>
                      this.scrollviewVertical.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      })
                    }
                  />
                </GestureRecognizer>
              )}

            {this.props.title === 'Calories Burned' &&
              this.state.currentDay !== '' &&
              this.state.currentWeek.length !== 0 && (
                <GestureRecognizer
                  onSwipe={(direction, state) => this.onSwipe(direction, state)}
                  onSwipeLeft={(state) => this.onSwipeLeft(state)}
                  onSwipeRight={(state) => this.onSwipeRight(state)}>
                  <TrackCaloriesChart
                    isDay={this.state.isDay}
                    unit={this.state.unit}
                    getMappedDate={this.getMappedDate}
                    dates={
                      this.state.isDay
                        ? this.state.currentDay
                        : this.state.currentWeek
                    }
                    onHint={() =>
                      this.scrollviewVertical.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      })
                    }
                  />
                </GestureRecognizer>
              )}

            {this.props.title === 'Heart Rate' &&
              this.state.currentDay !== '' &&
              this.state.currentWeek.length !== 0 && (
                <GestureRecognizer
                  onSwipe={(direction, state) => this.onSwipe(direction, state)}
                  onSwipeLeft={(state) => this.onSwipeLeft(state)}
                  onSwipeRight={(state) => this.onSwipeRight(state)}>
                  <HeartRateChart
                    isDay={this.state.isDay}
                    unit={this.state.unit}
                    getMappedDate={this.getMappedDate}
                    dates={
                      this.state.isDay
                        ? this.state.currentDay
                        : this.state.currentWeek
                    }
                    onHint={() =>
                      this.scrollviewVertical.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      })
                    }
                  />
                </GestureRecognizer>
              )}

            {this.props.title === 'Sleep' &&
              this.state.currentDay !== '' &&
              this.state.currentWeek.length !== 0 && (
                <GestureRecognizer
                  onSwipe={(direction, state) => this.onSwipe(direction, state)}
                  onSwipeLeft={(state) => this.onSwipeLeft(state)}
                  onSwipeRight={(state) => this.onSwipeRight(state)}>
                  <SleepChart
                    isDay={this.state.isDay}
                    unit={this.state.unit}
                    getMappedDate={this.getMappedDate}
                    dates={
                      this.state.isDay
                        ? this.state.currentDay
                        : this.state.currentWeek
                    }
                    onHint={() =>
                      this.scrollviewVertical.scrollTo({
                        x: 0,
                        y: 0,
                        animated: true,
                      })
                    }
                  />
                </GestureRecognizer>
              )}
          </View>
        </ScrollView>

        <Dialog
          visible={this.state.isWheelModalVisible}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isWheelModalVisible: false,
              wheelPosition: this.state.position,
            });
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
                  selectedValue={this.positionValues[this.state.wheelPosition]}
                  pickerData={this.positionValues}
                  onValueChange={(value) => this.setPositionValue(value)}
                  itemSpace={30} // this only support in android
                />
              </View>

              {isIphoneX() && <View style={{height: 34}} />}
            </View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: -0.08,
    color: 'rgb(54,58,61)',
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
});

export default WearablesTrackingScreen;

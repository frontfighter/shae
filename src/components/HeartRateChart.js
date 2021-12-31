import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import Dialog, {
  FadeAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import {BoxShadow} from 'react-native-shadow';
import * as Animatable from 'react-native-animatable';
import Svg, {Path, G} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import AppleHealthKit from 'rn-apple-healthkit';
import GoogleFit, {Scopes} from 'react-native-google-fit';

const {height, width} = Dimensions.get('window');

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

class HeartRateChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDatesArray: [],
      isHintModalVisible: false,
      hintPositionX: 0,
      hintPositionY: 0,
      hintDate: '',
      hintHours: '',
      hintValue: '',
      hintIndex: 0,
      hintItem: {},
      barHeights: {},
      averageValue: 0,
      minValue: 0,
      maxValue: 0,
      hintDayOfWeek: '',
      hintMinValue: 0,
      hintMaxValue: 0,
      hintWorkoutMinValue: 0,
      hintWorkoutMaxValue: 0,
      minDayValue: 400,
      maxDayValue: 0,
      minWeekValue: 400,
      maxWeekValue: 0,
      workoutMinValue: 400,
      workoutMaxValue: 0,
      isLoading: false,
    };

    this.allDates = [];
    this.dayHours = [];
    this.coordinates = [];
  }

  componentDidMount() {
    console.log('FoodRatingsGraphic dates', this.props.dates);

    this.setState({isLoading: true});
    this.getAlldates(this.props.dates, this.props.isDay);

    setTimeout(() => {
      this.getData(this.props.dates, this.props.isDay);
    }, 150);
  }

  getAlldates = (dates, isDay) => {
    if (isDay) {
      this.dayHours = [];

      for (let i = 0; i < 24; i++) {
        // let date = new Date(dates);
        //
        // this.dayHours.push(date.toISOString().slice(0, 10));
        this.dayHours.push(String(i).padStart(2, '0'));
      }

      console.log('getAlldates hours', this.dayHours);
    } else {
      this.allDates = [];
      this.allDates.push(dates[0]);

      for (let i = 1; i < 6; i++) {
        let date = new Date(dates[0]);
        date.setDate(date.getDate() + i);

        this.allDates.push(date.toISOString().slice(0, 10));
      }

      let date = new Date(dates[0]);
      date.setDate(date.getDate() + 6);

      this.allDates.push(date.toISOString().slice(0, 10));
    }

    console.log('this.allDates', this.allDates);
  };

  getData = (dates, isDay) => {
    this.setState({
      minDayValue: 0,
      maxDayValue: 0,
      minWeekValue: 0,
      maxWeekValue: 0,
    });
    if (Platform.OS === 'ios') {
      const PERMS = AppleHealthKit.Constants.Permissions;
      const options = {
        permissions: {
          read: [PERMS.HeartRate, PERMS.Workout],
          write: [],
        },
      };

      AppleHealthKit.initHealthKit(options, (err, results) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }
        console.log('this.props.dates', dates, new Date().toISOString());

        let date = new Date();
        let offset = date.getTimezoneOffset() / 60;
        if (offset < 0) {
          offset = '+' + Math.abs(offset).toString().padStart(2, '0') + '00';
        } else {
          offset = '-' + Math.abs(offset).toString().padStart(2, '0') + '00';
        }

        console.log('offset', offset);
        if (isDay) {
          AppleHealthKit.getHeartRateSamples(
            {
              startDate: dates + `T00:00:00.000${offset}`,
              endDate: dates + `T23:59:00.000${offset}`,
            },
            (err, results) => {
              console.log(
                'heaalthkit options',
                dates + `T00:00:00.000${offset}`,
                dates + `T23:59:00.000${offset}`,
              );
              if (err) {
                console.log('getHeartRateSamples error ', err);
                console.log('AppleHealthKit error', err);

                return;
              }

              console.log('getHeartRateSamples results ', results);
              if (results.length === 0) {
                this.setState({
                  allDatesArray: [],
                  averageValue: 0,
                  isLoading: false,
                });
              } else {
                AppleHealthKit.getSamples(
                  {
                    startDate: dates + `T00:00:00.000${offset}`,
                    endDate: dates + `T23:59:00.000${offset}`,
                    type: 'Workout',
                  },
                  (err, workoutResults) => {
                    if (err) {
                      console.log('getSamples', err);

                      return;
                    } else {
                      console.log('workoutData results', workoutResults);

                      let workoutData = {};
                      if (workoutResults.length !== 0) {
                        for (let i = 0; i < workoutResults.length; i++) {
                          if (
                            workoutResults.hasOwnProperty(
                              workoutResults[i].start.substring(11, 13) +
                                '-' +
                                workoutResults[i].end.substring(11, 13),
                            )
                          ) {
                            workoutData[
                              workoutResults[i].start.substring(11, 13) +
                                '-' +
                                workoutResults[i].end.substring(11, 13)
                            ].workouts.push({
                              start: workoutResults[i].start,
                              end: workoutResults[i].end,
                            });
                          } else {
                            workoutData[
                              workoutResults[i].start.substring(11, 13) +
                                '-' +
                                workoutResults[i].end.substring(11, 13)
                            ] = {};
                            workoutData[
                              workoutResults[i].start.substring(11, 13) +
                                '-' +
                                workoutResults[i].end.substring(11, 13)
                            ].workouts = [];

                            workoutData[
                              workoutResults[i].start.substring(11, 13) +
                                '-' +
                                workoutResults[i].end.substring(11, 13)
                            ].workouts.push({
                              start: workoutResults[i].start,
                              end: workoutResults[i].end,
                            });
                          }
                        }

                        console.log('workoutData', workoutData);
                      }

                      let value = 0;
                      let minValue = 300;
                      let maxValue = 0;
                      let array = [];
                      let minWorkoutValue = 400;
                      let maxWorkoutValue = 0;

                      // let currentDate = results[0].startDate.substring(0, 10);
                      let currentDate = results[0].startDate.substring(11, 13);

                      let obj = {
                        [currentDate]: {
                          value: results[0].value,
                          date: results[0].startDate.substring(0, 10),
                          hours: results[0].startDate.substring(11, 13),
                          position: this.allDates.indexOf(currentDate),
                          countOfItems: 1,
                          minValue: 200,
                          maxValue: 0,
                          minWorkout: 400,
                          maxWorkout: 0,
                        },
                      };

                      for (let i = 0; i < results.length; i++) {
                        // property = results[i].startDate.substring(0, 10);
                        property = results[i].startDate.substring(11, 13);
                        if (obj.hasOwnProperty(property)) {
                          obj[property].value += results[i].value;
                          obj[property].countOfItems += 1;

                          if (results[i].value < obj[property].minValue) {
                            obj[property].minValue = results[i].value;
                          }

                          if (results[i].value > obj[property].maxValue) {
                            obj[property].maxValue = results[i].value;
                          }

                          if (
                            obj[property].minWorkout !== 400 &&
                            obj[property].minWorkout < minWorkoutValue
                          ) {
                            minWorkoutValue = obj[property].minWorkout;
                          }

                          if (
                            obj[property].maxWorkout !== 0 &&
                            obj[property].maxWorkout > maxWorkoutValue
                          ) {
                            maxWorkoutValue = obj[property].maxWorkout;
                          }

                          let propertyName = '';
                          let isExists = false;
                          isExists = Object.keys(workoutData).some((key) => {
                            propertyName = key;
                            return ~key.indexOf(property);
                          });

                          if (propertyName !== '') {
                            isExists = true;
                          }

                          console.log('isExists', isExists, propertyName);

                          if (isExists) {
                            console.log(
                              'comparison success initial',
                              workoutData[propertyName],
                              propertyName,
                            );
                            for (
                              let k = 0;
                              k < workoutData[propertyName].workouts.length;
                              k++
                            ) {
                              let workoutStartTime = new Date(
                                workoutData[propertyName].workouts[k].start,
                              ).getTime();
                              let workoutEndTime = new Date(
                                workoutData[propertyName].workouts[k].end,
                              ).getTime();
                              let heartRateTime = new Date(
                                results[i].startDate,
                              ).getTime();
                              console.log('workoutStartTime', workoutStartTime);
                              console.log('workoutEndTime', workoutEndTime);
                              console.log(
                                'heartRateTime',
                                heartRateTime,
                                results[i].value,
                              );
                              if (
                                heartRateTime > workoutStartTime &&
                                heartRateTime < workoutEndTime
                              ) {
                                console.log(
                                  'heart rate in range',
                                  results[i],
                                  obj[property],
                                );
                                if (
                                  typeof obj[property].minWorkout ===
                                    'undefined' ||
                                  results[i].value < obj[property].minWorkout
                                ) {
                                  obj[property].minWorkout = results[i].value;
                                }

                                if (
                                  typeof obj[property].maxWorkout ===
                                    'undefined' ||
                                  results[i].value > obj[property].maxWorkout
                                ) {
                                  obj[property].maxWorkout = results[i].value;
                                }

                                if (
                                  obj[property].minWorkout !== 400 &&
                                  obj[property].minWorkout < minWorkoutValue
                                ) {
                                  minWorkoutValue = obj[property].minWorkout;
                                }

                                if (
                                  obj[property].maxWorkout !== 0 &&
                                  obj[property].maxWorkout > maxWorkoutValue
                                ) {
                                  maxWorkoutValue = obj[property].maxWorkout;
                                }
                              }
                            }
                          }
                        } else {
                          obj[property] = {};
                          obj[property].date = results[i].startDate.substring(
                            0,
                            10,
                          );
                          obj[property].value = results[i].value;
                          obj[property].hours = results[i].startDate.substring(
                            11,
                            13,
                          );
                          obj[property].position = this.allDates.indexOf(
                            property,
                          );
                          obj[property].countOfItems = 1;

                          obj[property].minValue = results[i].value;
                          obj[property].maxValue = results[i].value;

                          obj[property].minWorkout = 400;
                          obj[property].maxWorkout = 0;

                          let propertyName = '';
                          let isExists = false;
                          isExists = Object.keys(workoutData).some((key) => {
                            propertyName = key;
                            return ~key.indexOf(property);
                          });

                          if (propertyName !== '') {
                            isExists = true;
                          }

                          console.log('isExists', isExists, propertyName);

                          if (isExists) {
                            console.log(
                              'comparison success',
                              workoutData[propertyName],
                              propertyName,
                            );
                            for (
                              let k = 0;
                              k < workoutData[propertyName].workouts.length;
                              k++
                            ) {
                              let workoutStartTime = new Date(
                                workoutData[propertyName].workouts[k].start,
                              ).getTime();
                              let workoutEndTime = new Date(
                                workoutData[propertyName].workouts[k].end,
                              ).getTime();
                              let heartRateTime = new Date(
                                results[i].startDate,
                              ).getTime();
                              console.log('workoutStartTime', workoutStartTime);
                              console.log('workoutEndTime', workoutEndTime);
                              console.log(
                                'heartRateTime',
                                results[i].startDate,
                                heartRateTime,
                              );
                              if (
                                heartRateTime > workoutStartTime &&
                                heartRateTime < workoutEndTime
                              ) {
                                if (
                                  results[i].value < obj[property].minWorkout
                                ) {
                                  obj[property].minWorkout = results[i].value;
                                }

                                if (
                                  results[i].value > obj[property].maxWorkout
                                ) {
                                  obj[property].maxWorkout = results[i].value;
                                }

                                if (
                                  obj[property].minWorkout !== 400 &&
                                  obj[property].minWorkout < minWorkoutValue
                                ) {
                                  minWorkoutValue = obj[property].minWorkout;
                                }

                                if (
                                  obj[property].maxWorkout !== 0 &&
                                  obj[property].maxWorkout > maxWorkoutValue
                                ) {
                                  maxWorkoutValue = obj[property].maxWorkout;
                                }
                              }
                            }
                          }
                        }

                        if (minValue > results[i].value) {
                          minValue = results[i].value;
                        }

                        if (maxValue < results[i].value) {
                          maxValue = results[i].value;
                        }
                      }

                      this.setState({minValue, maxValue, isLoading: false});

                      Object.keys(obj).map((key, index) => {
                        obj[key].value = parseInt(
                          obj[key].value / obj[key].countOfItems,
                        );
                        array.push(obj[key]);
                      });

                      array.reverse();

                      console.log('getHeartRateSamples obj', obj);

                      console.log('array', array);

                      allDatesArray = [];

                      let minDayValue = 400;
                      let maxDayValue = 0;

                      let datesCount = 0;
                      for (let i = 0; i < this.dayHours.length; i++) {
                        let isItemFound = false;
                        for (let k = 0; k < array.length; k++) {
                          if (
                            parseInt(array[k].hours) ===
                            parseInt(this.dayHours[i])
                          ) {
                            // if (minDayValue > array[k].value) {
                            //   minDayValue = array[k].value;
                            // }
                            // if (maxDayValue < array[k].value) {
                            //   maxDayValue = array[k].value;
                            // }

                            if (
                              array[k].minValue !== 300 &&
                              array[k].minValue < minDayValue
                            ) {
                              minDayValue = array[k].minValue;
                            }

                            if (
                              array[k].maxValue !== 0 &&
                              array[k].maxValue > maxDayValue
                            ) {
                              maxDayValue = array[k].maxValue;
                            }

                            isItemFound = true;
                            value += array[k].value;
                            datesCount += 1;
                            allDatesArray.push({
                              ...array[k],
                              ...{background: 'rgb(255,255,255)'},
                            });
                            break;
                          }
                        }

                        if (!isItemFound) {
                          allDatesArray.push({
                            date: dates,
                            background: 'transparent',
                            countOfItems: 0,
                            value: 0,
                            hours: i,
                          });
                        }
                      }

                      // for (let i = 0; i < this.allDates.length; i++) {
                      //   datesCount += 1;
                      //
                      //   if (this.allDates[i] === dates[1]) {
                      //     break;
                      //   }
                      // }

                      this.setState({
                        allDatesArray,
                        averageValue: parseInt(value / datesCount),
                        minDayValue,
                        maxDayValue,
                        hintWorkoutMaxValue: maxWorkoutValue,
                        hintWorkoutMinValue: minWorkoutValue,
                        workoutMinValue: minWorkoutValue,
                        workoutMaxValue: maxWorkoutValue,
                        isLoading: false,
                      });
                      console.log('allDatesArray', allDatesArray);
                    }
                  },
                );
              }
            },
          );

          // AppleHealthKit.getHourlyStepCount(
          //   { date: dates + "T00:00:00.000Z", interval: 60 },
          //   (err, results) => {
          //     if (err) {
          //       console.log("getHourlyStepCount error", err);
          //       console.log("AppleHealthKit error", err);
          //
          //       return;
          //     }
          //     console.log("getHourlyStepCount", results);
          //
          //     let value = 0;
          //     let array = [];
          //
          //     let reversedResults;
          //     if (results.length !== 0) {
          //       reversedResults = results.reverse();
          //     } else {
          //       reversedResults = results;
          //     }
          //
          //     for (let i = 0; i < reversedResults.length; i++) {
          //       if (
          //         reversedResults[i].startDate.substring(8, 10) ===
          //         dates.substring(8, 10)
          //       ) {
          //         let countOfItems = 1;
          //         let item = {};
          //         item.value = reversedResults[i].value;
          //         value += reversedResults[i].value;
          //
          //         item.countOfItems = countOfItems;
          //         item.date = results[i].startDate.substring(0, 10);
          //         item.hours = reversedResults[i].startDate.substring(11, 13);
          //         item.position = this.dayHours.indexOf(item.hours);
          //
          //         array.push(item);
          //       }
          //     }
          //
          //     allDatesArray = [];
          //     for (let i = 0; i < this.dayHours.length; i++) {
          //       let isItemFound = false;
          //       for (let k = 0; k < array.length; k++) {
          //         if (array[k].hours === this.dayHours[i]) {
          //           isItemFound = true;
          //           allDatesArray.push({
          //             ...array[k],
          //             ...{ background: "rgb(255,255,255)" },
          //           });
          //           break;
          //         }
          //       }
          //
          //       if (!isItemFound) {
          //         allDatesArray.push({
          //           background: "transparent",
          //           countOfItems: 0,
          //           value: 0,
          //         });
          //       }
          //     }
          //
          //     this.setState({
          //       allDatesArray,
          //       averageValue: value,
          //     });
          //     console.log("allDatesArray", allDatesArray, array, this.dayHours);
          //   }
          // );
        } else {
          let stepOptions = {
            // startDate: dates[0] + "T00:00:00.000Z", // required
            // endDate: dates[1] + "T23:59:00.000Z",
            startDate: dates[0] + `T00:00:00.000${offset}`,
            endDate: dates[1] + `T23:59:00.000${offset}`,
          };

          console.log('stepOptions', stepOptions);

          AppleHealthKit.getHeartRateSamples(
            stepOptions,
            async (err, results) => {
              if (err) {
                console.log('getHeartRateSamples error ', err);
                console.log('AppleHealthKit error', err);

                return;
              }

              console.log('getHeartRateSamples results ', results);
              if (results.length === 0) {
                this.setState({
                  allDatesArray: [],
                  averageValue: 0,
                  isLoading: false,
                });
              } else {
                AppleHealthKit.getSamples(
                  {
                    ...stepOptions,
                    ...{type: 'Workout'},
                  },
                  (err, workoutResults) => {
                    if (err) {
                      console.log('getSamples', err);

                      return;
                    } else {
                      console.log('workoutData results', workoutResults);

                      let workoutData = {};
                      if (workoutResults.length !== 0) {
                        for (let i = 0; i < workoutResults.length; i++) {
                          if (
                            workoutResults.hasOwnProperty(
                              workoutResults[i].end.substring(0, 10),
                            )
                          ) {
                            workoutData[
                              workoutResults[i].end.substring(0, 10)
                            ].workouts.push({
                              start: workoutResults[i].start,
                              end: workoutResults[i].end,
                            });
                          } else {
                            workoutData[
                              workoutResults[i].end.substring(0, 10)
                            ] = {};
                            workoutData[
                              workoutResults[i].end.substring(0, 10)
                            ].workouts = [];

                            workoutData[
                              workoutResults[i].end.substring(0, 10)
                            ].workouts.push({
                              start: workoutResults[i].start,
                              end: workoutResults[i].end,
                            });
                          }
                        }

                        console.log('workoutData', workoutData);
                      }

                      let value = 0;
                      let minValue = 300;
                      let maxValue = 0;
                      let array = [];
                      let minWorkoutValue = 400;
                      let maxWorkoutValue = 0;

                      let currentDate = results[0].startDate.substring(0, 10);
                      let obj = {
                        [currentDate]: {
                          value: results[0].value,
                          date: currentDate,
                          position: this.allDates.indexOf(currentDate),
                          countOfItems: 1,
                          minValue: 300,
                          maxValue: 0,
                          minWorkout: 400,
                          maxWorkout: 0,
                        },
                      };

                      let values = [];

                      console.log('results', results);

                      for (let i = 0; i < results.length; i++) {
                        property = results[i].startDate.substring(0, 10);
                        if (obj.hasOwnProperty(property)) {
                          if (results[i].value < obj[property].minValue) {
                            obj[property].minValue = results[i].value;
                          }

                          if (results[i].value > obj[property].maxValue) {
                            obj[property].maxValue = results[i].value;
                          }

                          if (workoutData.hasOwnProperty(property)) {
                            console.log(
                              'comparison success initial',
                              workoutData[property],
                              property,
                            );
                            for (
                              let k = 0;
                              k < workoutData[property].workouts.length;
                              k++
                            ) {
                              let workoutStartTime = new Date(
                                workoutData[property].workouts[k].start,
                              ).getTime();
                              let workoutEndTime = new Date(
                                workoutData[property].workouts[k].end,
                              ).getTime();
                              let heartRateTime = new Date(
                                results[i].startDate,
                              ).getTime();
                              console.log('workoutStartTime', workoutStartTime);
                              console.log('workoutEndTime', workoutEndTime);
                              console.log(
                                'heartRateTime',
                                heartRateTime,
                                results[i].value,
                              );
                              if (
                                heartRateTime > workoutStartTime &&
                                heartRateTime < workoutEndTime
                              ) {
                                console.log(
                                  'heart rate in range',
                                  results[i],
                                  obj[property],
                                );
                                if (
                                  typeof obj[property].minWorkout ===
                                    'undefined' ||
                                  results[i].value < obj[property].minWorkout
                                ) {
                                  obj[property].minWorkout = results[i].value;
                                }

                                if (
                                  typeof obj[property].maxWorkout ===
                                    'undefined' ||
                                  results[i].value > obj[property].maxWorkout
                                ) {
                                  obj[property].maxWorkout = results[i].value;
                                }

                                if (
                                  obj[property].minWorkout !== 400 &&
                                  obj[property].minWorkout < minWorkoutValue
                                ) {
                                  minWorkoutValue = obj[property].minWorkout;
                                }

                                if (
                                  obj[property].maxWorkout !== 0 &&
                                  obj[property].maxWorkout > maxWorkoutValue
                                ) {
                                  maxWorkoutValue = obj[property].maxWorkout;
                                }
                              }
                            }
                          }

                          obj[property].value += results[i].value;
                          obj[property].countOfItems += 1;
                        } else {
                          obj[property] = {};
                          obj[property].date = property;
                          obj[property].value = results[i].value;
                          obj[property].position = this.allDates.indexOf(
                            property,
                          );
                          obj[property].countOfItems = 1;

                          obj[property].minValue = results[i].value;
                          obj[property].maxValue = results[i].value;

                          obj[property].minWorkout = 400;
                          obj[property].maxWorkout = 0;

                          console.log('property', property, workoutData);

                          if (workoutData.hasOwnProperty(property)) {
                            console.log(
                              'comparison success',
                              workoutData[property],
                              property,
                            );
                            for (
                              let k = 0;
                              k < workoutData[property].workouts.length;
                              k++
                            ) {
                              let workoutStartTime = new Date(
                                workoutData[property].workouts[k].start,
                              ).getTime();
                              let workoutEndTime = new Date(
                                workoutData[property].workouts[k].end,
                              ).getTime();
                              let heartRateTime = new Date(
                                results[i].startDate,
                              ).getTime();
                              console.log('workoutStartTime', workoutStartTime);
                              console.log('workoutEndTime', workoutEndTime);
                              console.log(
                                'heartRateTime',
                                results[i].startDate,
                                heartRateTime,
                              );
                              if (
                                heartRateTime > workoutStartTime &&
                                heartRateTime < workoutEndTime
                              ) {
                                if (
                                  results[i].value < obj[property].minWorkout
                                ) {
                                  obj[property].minWorkout = results[i].value;
                                }

                                if (
                                  results[i].value > obj[property].maxWorkout
                                ) {
                                  obj[property].maxWorkout = results[i].value;
                                }

                                if (
                                  obj[property].minWorkout !== 400 &&
                                  obj[property].minWorkout < minWorkoutValue
                                ) {
                                  minWorkoutValue = obj[property].minWorkout;
                                }

                                if (
                                  obj[property].maxWorkout !== 0 &&
                                  obj[property].maxWorkout > maxWorkoutValue
                                ) {
                                  maxWorkoutValue = obj[property].maxWorkout;
                                }
                              }
                            }
                          }
                        }

                        if (minValue > results[i].value) {
                          minValue = results[i].value;
                        }

                        if (maxValue < results[i].value) {
                          maxValue = results[i].value;
                        }
                      }

                      this.setState({minValue, maxValue, isLoading: false});

                      Object.keys(obj).map((key, index) => {
                        obj[key].value = parseInt(
                          obj[key].value / obj[key].countOfItems,
                        );
                        array.push(obj[key]);
                      });

                      array.reverse();

                      console.log('getHeartRateSamples obj', obj);

                      // for (let i = 0; i < results.length; i++) {
                      //   let countOfItems = 1;
                      //   let item = {};
                      //
                      //   // if () {
                      //   //
                      //   // }
                      //   item.value = results[i].value;
                      //   value += results[i].value;
                      //
                      //   item.countOfItems = countOfItems;
                      //   item.date = results[i].startDate.substring(0, 10);
                      //   item.position = this.allDates.indexOf(item.date);
                      //
                      //   array.push(item);
                      // }

                      console.log('array', array);

                      allDatesArray = [];

                      let minWeekValue = 400;
                      let maxWeekValue = 0;
                      for (let i = 0; i < this.allDates.length; i++) {
                        let isItemFound = false;
                        for (let k = 0; k < array.length; k++) {
                          if (array[k].date === this.allDates[i]) {
                            if (minWeekValue > array[k].value) {
                              minWeekValue = array[k].value;
                            }
                            if (maxWeekValue < array[k].value) {
                              maxWeekValue = array[k].value;
                            }

                            isItemFound = true;
                            value += array[k].value;
                            allDatesArray.push({
                              ...array[k],
                              ...{background: 'rgb(255,255,255)'},
                            });
                            break;
                          }
                        }

                        if (!isItemFound) {
                          allDatesArray.push({
                            date: this.allDates[i],
                            background: 'transparent',
                            countOfItems: 0,
                            value: 0,
                          });
                        }
                      }

                      let datesCount = 0;
                      for (let i = 0; i < this.allDates.length; i++) {
                        if (allDatesArray[i].value !== 0) {
                          datesCount += 1;
                        }

                        if (
                          allDatesArray[i].minValue !== 300 &&
                          allDatesArray[i].minValue < minWeekValue
                        ) {
                          minWeekValue = allDatesArray[i].minValue;
                        }

                        if (
                          allDatesArray[i].maxValue !== 0 &&
                          allDatesArray[i].maxValue > maxWeekValue
                        ) {
                          maxWeekValue = allDatesArray[i].maxValue;
                        }

                        if (this.allDates[i] === dates[1]) {
                          break;
                        }
                      }

                      this.setState({
                        allDatesArray,
                        averageValue: parseInt(value / datesCount),
                        minWeekValue,
                        maxWeekValue,
                        hintWorkoutMaxValue: maxWorkoutValue,
                        hintWorkoutMinValue: minWorkoutValue,
                        workoutMinValue: minWorkoutValue,
                        workoutMaxValue: maxWorkoutValue,
                        isLoading: false,
                      });
                      console.log('allDatesArray', allDatesArray);
                    }
                  },
                );
              }
            },
          );
        }
      });
    } else {
      const options = {
        scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_HEART_RATE_READ],
      };

      GoogleFit.authorize(options)
        .then((res) => {
          console.log('authorized >>>', res);

          if (res.success) {
            let date = new Date();
            let offset = 0;
            let offsetHours = date.getTimezoneOffset() / 60;
            if (offset < 0) {
              offset =
                '+' + Math.abs(offsetHours).toString().padStart(2, '0') + '00';
            } else {
              offset =
                '-' + Math.abs(offsetHours).toString().padStart(2, '0') + '00';
            }

            if (this.props.isDay) {
              let startDate = new Date(dates);
              startDate.setHours(0, 0, 0, 0);
              startDate.setHours(startDate.getHours() - offsetHours);

              let endDate = new Date(dates);
              endDate.setHours(23, 59, 59, 0);
              endDate.setHours(endDate.getHours() - offsetHours);

              const heartSamplesOptions = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                bucketUnit: 'HOUR',
                bucketInterval: 1,
              };

              console.log(
                'options dates',
                startDate.toISOString(),
                endDate.toISOString(),
              );

              GoogleFit.getHeartRateSamples(heartSamplesOptions).then(
                async (res) => {
                  console.log('getHeartRateSamples', res);

                  if (res.length === 0) {
                    res = [
                      {
                        value: 80,
                        startDate: '2021-03-22T00:19:21.348Z',
                        endDate: '2021-03-22T01:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 65,
                        startDate: '2021-03-22T01:19:21.348Z',
                        endDate: '2021-03-22T02:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 92,
                        startDate: '2021-03-22T02:19:21.348Z',
                        endDate: '2021-03-22T03:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 110,
                        startDate: '2021-03-22T03:19:21.348Z',
                        endDate: '2021-03-22T04:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 180,
                        startDate: '2021-03-22T04:19:21.348Z',
                        endDate: '2021-03-22T05:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 123,
                        startDate: '2021-03-22T05:19:21.348Z',
                        endDate: '2021-03-22T06:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 85,
                        startDate: '2021-03-22T06:19:21.348Z',
                        endDate: '2021-03-22T07:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 71,
                        startDate: '2021-03-22T07:19:21.348Z',
                        endDate: '2021-03-22T08:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 65,
                        startDate: '2021-03-22T08:19:21.348Z',
                        endDate: '2021-03-22T09:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 55,
                        startDate: '2021-03-22T09:19:21.348Z',
                        endDate: '2021-03-22T10:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 50,
                        startDate: '2021-03-22T10:19:21.348Z',
                        endDate: '2021-03-22T11:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 142,
                        startDate: '2021-03-22T11:19:21.348Z',
                        endDate: '2021-03-22T12:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 156,
                        startDate: '2021-03-22T12:19:21.348Z',
                        endDate: '2021-03-22T13:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 161,
                        startDate: '2021-03-22T13:19:21.348Z',
                        endDate: '2021-03-22T14:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 173,
                        startDate: '2021-03-22T14:19:21.348Z',
                        endDate: '2021-03-22T15:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 190,
                        startDate: '2021-03-22T15:19:21.348Z',
                        endDate: '2021-03-22T16:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 181,
                        startDate: '2021-03-22T16:19:21.348Z',
                        endDate: '2021-03-22T17:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 70,
                        startDate: '2021-03-22T17:19:21.348Z',
                        endDate: '2021-03-22T18:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 73,
                        startDate: '2021-03-22T18:19:21.348Z',
                        endDate: '2021-03-22T19:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 75,
                        startDate: '2021-03-22T19:19:21.348Z',
                        endDate: '2021-03-22T20:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 94,
                        startDate: '2021-03-22T20:19:21.348Z',
                        endDate: '2021-03-22T21:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 86,
                        startDate: '2021-03-22T21:19:21.348Z',
                        endDate: '2021-03-22T22:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 113,
                        startDate: '2021-03-22T22:19:21.348Z',
                        endDate: '2021-03-22T23:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 60,
                        startDate: '2021-03-22T23:19:21.348Z',
                        endDate: '2021-03-23T00:19:21.348Z',
                        day: 'Mon',
                      },
                    ];

                    res.reverse();

                    // iOS [ { value: 65,
                    // startDate: '2021-03-12T19:19:00.000+1000',
                    // endDate: '2021-03-12T19:19:00.000+1000' } ]

                    // iOS modified [ { value: 65,
                    // date: '2021-03-12',
                    // position: 4,
                    // countOfItems: 2,
                    // minValue: 65,
                    // maxValue: 65,
                    // minWorkout: 400,
                    // maxWorkout: 0 } ]
                  }

                  console.log('getHeartRateSamples1', res);

                  let value = 0;
                  let minValue = 300;
                  let maxValue = 0;
                  let array = [];

                  // let currentDate = results[0].startDate.substring(0, 10);
                  let currentDate = res[0].startDate.substring(11, 13);

                  let obj = {
                    [currentDate]: {
                      value: res[0].value,
                      date: res[0].startDate.substring(0, 10),
                      hours: res[0].startDate.substring(11, 13),
                      position: this.allDates.indexOf(currentDate),
                      countOfItems: 1,
                      minValue: 200,
                      maxValue: 0,
                      minWorkout: 400,
                      maxWorkout: 0,
                    },
                  };

                  for (let i = 0; i < res.length; i++) {
                    // property = results[i].startDate.substring(0, 10);
                    let property = res[i].startDate.substring(11, 13);

                    if (obj.hasOwnProperty(property)) {
                      obj[property].value += res[i].value;
                      obj[property].countOfItems += 1;

                      if (res[i].value < obj[property].minValue) {
                        obj[property].minValue = res[i].value;
                      }

                      if (res[i].value > obj[property].maxValue) {
                        obj[property].maxValue = res[i].value;
                      }
                    } else {
                      obj[property] = {};
                      obj[property].date = res[i].startDate.substring(0, 10);
                      obj[property].value = res[i].value;
                      obj[property].hours = res[i].startDate.substring(11, 13);
                      obj[property].position = this.allDates.indexOf(property);
                      obj[property].countOfItems = 1;

                      obj[property].minValue = res[i].value;
                      obj[property].maxValue = res[i].value;

                      obj[property].minWorkout = 400;
                      obj[property].maxWorkout = 0;

                      if (minValue > res[i].value) {
                        minValue = res[i].value;
                      }

                      if (maxValue < res[i].value) {
                        maxValue = res[i].value;
                      }
                    }
                  }

                  this.setState({minValue, maxValue});

                  Object.keys(obj).map((key, index) => {
                    obj[key].value = parseInt(
                      obj[key].value / obj[key].countOfItems,
                    );
                    array.push(obj[key]);
                  });

                  array.reverse();

                  console.log('getHeartRateSamples obj', obj);

                  console.log('array', array);

                  let allDatesArray = [];

                  let minDayValue = 400;
                  let maxDayValue = 0;

                  let datesCount = 0;
                  for (let i = 0; i < this.dayHours.length; i++) {
                    let isItemFound = false;
                    for (let k = 0; k < array.length; k++) {
                      if (
                        parseInt(array[k].hours) === parseInt(this.dayHours[i])
                      ) {
                        if (minDayValue > array[k].value) {
                          minDayValue = array[k].value;
                        }
                        if (maxDayValue < array[k].value) {
                          maxDayValue = array[k].value;
                        }

                        isItemFound = true;
                        value += array[k].value;
                        datesCount += 1;
                        allDatesArray.push({
                          ...array[k],
                          ...{background: 'rgb(255,255,255)'},
                        });
                        break;
                      }
                    }

                    if (!isItemFound) {
                      allDatesArray.push({
                        date: dates,
                        background: 'transparent',
                        countOfItems: 0,
                        value: 0,
                        hours: i,
                      });
                    }
                  }

                  if (datesCount === 0) {
                    datesCount = 1;
                  }

                  this.setState({
                    allDatesArray,
                    averageValue: parseInt(value / datesCount),
                    minDayValue,
                    maxDayValue,
                    isLoading: false,
                  });
                  console.log('allDatesArray', allDatesArray);
                },
              );
            } else {
              let startDate = new Date(dates[0]);
              startDate.setHours(0, 0, 0, 0);
              startDate.setHours(startDate.getHours() - offsetHours);

              let endDate = new Date(dates[1]);
              endDate.setHours(23, 59, 59, 0);
              endDate.setHours(endDate.getHours() - offsetHours);

              const heartSamplesOptions = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                bucketUnit: 'DAY',
                bucketInterval: 1,
              };

              console.log(
                'options dates',
                startDate.toISOString(),
                endDate.toISOString(),
              );

              GoogleFit.getHeartRateSamples(heartSamplesOptions)
                .then(async (res) => {
                  console.log('getHeartRateSamples', res);

                  if (res.length === 0) {
                    res = [
                      {
                        value: 80,
                        startDate: '2021-03-15T10:19:21.348Z',
                        endDate: '2021-03-16T10:19:21.348Z',
                        day: 'Mon',
                      },
                      {
                        value: 65,
                        startDate: '2021-03-16T10:19:21.348Z',
                        endDate: '2021-03-17T10:19:21.348Z',
                        day: 'Tue',
                      },
                      {
                        value: 92,
                        startDate: '2021-03-17T10:19:21.348Z',
                        endDate: '2021-03-18T10:19:21.348Z',
                        day: 'Wed',
                      },
                      {
                        value: 110,
                        startDate: '2021-03-18T10:19:21.348Z',
                        endDate: '2021-03-19T10:19:21.348Z',
                        day: 'Thu',
                      },
                      {
                        value: 180,
                        startDate: '2021-03-19T10:19:21.348Z',
                        endDate: '2021-03-20T10:19:21.348Z',
                        day: 'Fri',
                      },
                      {
                        value: 123,
                        startDate: '2021-03-20T10:19:21.348Z',
                        endDate: '2021-03-21T10:19:21.348Z',
                        day: 'Sat',
                      },
                      {
                        value: 85,
                        startDate: '2021-03-21T10:19:21.348Z',
                        endDate: '2021-03-22T10:19:21.348Z',
                        day: 'Sun',
                      },
                    ];

                    res.reverse();

                    // iOS [ { value: 65,
                    // startDate: '2021-03-12T19:19:00.000+1000',
                    // endDate: '2021-03-12T19:19:00.000+1000' } ]

                    // iOS modified [ { value: 65,
                    // date: '2021-03-12',
                    // position: 4,
                    // countOfItems: 2,
                    // minValue: 65,
                    // maxValue: 65,
                    // minWorkout: 400,
                    // maxWorkout: 0 } ]
                  }

                  console.log('getHeartRateSamples1', res);

                  let value = 0;
                  let minValue = 300;
                  let maxValue = 0;
                  let array = [];

                  let currentDate = res[0].startDate.substring(0, 10);
                  let obj = {
                    [currentDate]: {
                      value: res[0].value,
                      date: currentDate,
                      position: this.allDates.indexOf(currentDate),
                      countOfItems: 1,
                      minValue: 200,
                      maxValue: 0,
                      minWorkout: 400,
                      maxWorkout: 0,
                    },
                  };

                  let values = [];

                  // console.log('results', results);

                  for (let i = 0; i < res.length; i++) {
                    let property = res[i].startDate.substring(0, 10);
                    if (obj.hasOwnProperty(property)) {
                      if (res[i].value < obj[property].minValue) {
                        obj[property].minValue = res[i].value;
                      }

                      if (res[i].value > obj[property].maxValue) {
                        obj[property].maxValue = res[i].value;
                      }

                      obj[property].value += res[i].value;
                      obj[property].countOfItems += 1;
                    } else {
                      obj[property] = {};
                      obj[property].date = property;
                      obj[property].value = res[i].value;
                      obj[property].position = this.allDates.indexOf(property);
                      obj[property].countOfItems = 1;

                      obj[property].minValue = res[i].value;
                      obj[property].maxValue = res[i].value;

                      obj[property].minWorkout = 400;
                      obj[property].maxWorkout = 0;

                      console.log('property', property);
                    }

                    if (minValue > res[i].value) {
                      minValue = res[i].value;
                    }

                    if (maxValue < res[i].value) {
                      maxValue = res[i].value;
                    }
                  }

                  this.setState({minValue, maxValue});

                  Object.keys(obj).map((key, index) => {
                    obj[key].value = parseInt(
                      obj[key].value / obj[key].countOfItems,
                    );
                    array.push(obj[key]);
                  });

                  array.reverse();

                  console.log('getHeartRateSamples obj', obj);

                  console.log('array', array);

                  let allDatesArray = [];

                  let minWeekValue = 400;
                  let maxWeekValue = 0;
                  for (let i = 0; i < this.allDates.length; i++) {
                    let isItemFound = false;
                    for (let k = 0; k < array.length; k++) {
                      if (array[k].date === this.allDates[i]) {
                        if (minWeekValue > array[k].value) {
                          minWeekValue = array[k].value;
                        }
                        if (maxWeekValue < array[k].value) {
                          maxWeekValue = array[k].value;
                        }

                        isItemFound = true;
                        value += array[k].value;
                        allDatesArray.push({
                          ...array[k],
                          ...{background: 'rgb(255,255,255)'},
                        });
                        break;
                      }
                    }

                    if (!isItemFound) {
                      allDatesArray.push({
                        date: this.allDates[i],
                        background: 'transparent',
                        countOfItems: 0,
                        value: 0,
                      });
                    }
                  }

                  let datesCount = 0;
                  for (let i = 0; i < this.allDates.length; i++) {
                    if (allDatesArray[i].value !== 0) {
                      datesCount += 1;
                    }

                    if (this.allDates[i] === dates[1]) {
                      break;
                    }
                  }

                  if (datesCount === 0) {
                    datesCount = 1;
                  }

                  this.setState({
                    allDatesArray,
                    averageValue: parseInt(value / datesCount),
                    minWeekValue,
                    maxWeekValue,
                    isLoading: false,
                  });
                  console.log('allDatesArray', allDatesArray);
                })
                .catch((err) => {
                  console.warn(err);
                });
            }
          }
        })
        .catch((err) => {
          console.log('err >>> ', err);
        });
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    // setTimeout(() => {
    if (nextProps.dates.toString() !== this.props.dates.toString()) {
      console.log('HeartRateChart data', nextProps.dates);
      this.allDates = [];
      this.dayHours = [];
      this.coordinates = [];
      this.setState(
        {
          allDatesArray: [],
          isHintModalVisible: false,
          hintPositionX: 0,
          hintPositionY: 0,
          hintDate: '',
          hintHours: '',
          hintValue: '',
          hintIndex: 0,
          hintItem: {},
          barHeights: {},
          averageValue: 0,
          minValue: 0,
          maxValue: 0,
          hintDayOfWeek: '',
          hintMinValue: 0,
          hintMaxValue: 0,
          hintWorkoutMinValue: 0,
          hintWorkoutMaxValue: 0,
          minDayValue: 400,
          maxDayValue: 0,
          minWeekValue: 400,
          maxWeekValue: 0,
          workoutMinValue: 400,
          workoutMaxValue: 0,
          isLoading: true,
        },
        () => {
          this.getAlldates(nextProps.dates, nextProps.isDay);
          this.getData(nextProps.dates, nextProps.isDay);
        },
      );
    }

    // }, 500);
  }

  getColoredSections = (item) => {
    if (item.countOfItems !== 0) {
      return [
        {
          height: (item.value / 185) * 185 - 3 / 4,
          backgroundColor: 'rgb(42,204,197)',
          borderRadius: 9,
          width: 18,
        },
      ];
    } else return [];
  };

  getColoredSectionsDay = (item) => {
    if (item.countOfItems !== 0) {
      return [
        {
          height: (item.value / 185) * 185 - 3 / 4,
          backgroundColor: 'rgb(42,204,197)',
          borderRadius: 3.5,
          width: 7,
        },
      ];
    } else return [];
  };

  onBarPress = (index, value, date, item) => {
    console.log('onBarPress item', item);
    if (item.countOfItems !== 0) {
      this.props.onHint();
      console.log('onBarPress', item, this.state.barPositions);
      this.setState({
        hintPositionX: this.props.isDay ? index * 7 : index * (26 + 10 + 9),
        // hintPositionX: this.state.barPositions[index],
        hintHours: typeof item.hours !== 'undefined' ? item.hours : '',
        hintDate: date,
        hintValue: value,
        isHintModalVisible: true,
        hintIndex: index,
      });
    }
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

  findDimesions = (layout, index) => {
    const {x, y, width, height} = layout;
    console.log('findDimesions', index, layout);
    console.log(x);
    console.log(y);
    console.log(width);
    console.log(height);

    let obj = this.state.barHeights;
    let objX = this.state.barPositions;
    obj[index] = height;
    objX[index] = x;

    this.setState({barHeights: obj, barPositions: objX});
  };

  getDayOfWeek = (day) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return days[day];
  };

  render() {
    let path = null;
    let shadowPath = null;
    this.coordinates = [];
    let minY = 0;

    if (this.state.allDatesArray.length !== 0) {
      if (!this.props.isDay) {
        const coef = 0.2985; //0.1475; // 0.32

        console.log('this.props.data', this.state.allDatesArray);
        // const array = this.arrayReverseObj(this.props.data.results);
        const array = this.state.allDatesArray; //this.arrayReverseObjMonth(this.props.data.results);
        console.log('reverse array', array);

        let diffDays = 0;

        // if (this.props.isDay) {
        //   diffDays = 23;
        // } else {
        const startDate = new Date(
          array[0].date.substring(0, 4),
          array[0].date.substring(5, 7) - 1,
          array[0].date.substring(8, 10),
        );
        const endDate = new Date(
          array[array.length - 1].date.substring(0, 4),
          array[array.length - 1].date.substring(5, 7) - 1,
          array[array.length - 1].date.substring(8, 10),
        );

        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        diffDays = this.props.isDay
          ? 23
          : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // }

        if (diffDays === 0) {
          diffDays = 1;
        }
        console.log('diffDays', diffDays);

        path = 'M' + 0 + ',' + (200 - Number(array[0].value) * 4 * coef + 40);
        shadowPath =
          'M' +
          0 +
          ',' +
          195 +
          ' L' +
          0 +
          ',' +
          Number(array[0].value) * 4 * coef +
          40;
        const coords =
          ' L' +
          0 +
          ',' +
          (200 - Number(array[0].value) * 4 * coef + 40) +
          ' ' +
          0 +
          ',' +
          (200 - Number(array[0].value) * 4 * coef + 40);
        path += coords;
        shadowPath += coords;

        const firstDate = new Date(
          array[0].date.substring(0, 4),
          array[0].date.substring(5, 7) - 1,
          array[0].date.substring(8, 10),
        );
        let firstDateMonth = firstDate.toLocaleString('en-us', {
          month: 'short',
        });

        const dayOfWeek = this.getDayOfWeek(firstDate.getDay());

        if (array[0].value !== 0) {
          this.coordinates.push({
            x: 0,
            y: 200 - array[0].value * 4 * coef + 40,
            date: firstDate.getDate() + ' ' + firstDateMonth,
            value: array[0].value,
            dayOfWeek: dayOfWeek,
            minValue: array[0].minValue,
            maxValue: array[0].maxValue,
            minWorkout: array[0].minWorkout,
            maxWorkout: array[0].maxWorkout,
            index: 0,
          });
        }

        minY = 200 - array[0].value * 4 * coef + 40;

        let lastValue = array[0].value;
        for (let i = 1; i < array.length; i++) {
          let value = 0;
          if (array[i].value !== 0) {
            value = array[i].value;
            lastValue = array[i].value;
          } else {
            value = lastValue;
          }

          const arrayDate = new Date(
            array[i].date.substring(0, 4),
            array[i].date.substring(5, 7) - 1,
            array[i].date.substring(8, 10),
          );
          const diffTimeArray = Math.abs(
            arrayDate.getTime() - startDate.getTime(),
          );
          let diffDaysArray = Math.ceil(diffTimeArray / (1000 * 60 * 60 * 24));
          if (diffDaysArray === 0) {
            diffDaysArray = 1;
          }

          const dayOfWeek = this.getDayOfWeek(arrayDate.getDay());
          console.log('diffDaysArray', diffDaysArray, arrayDate);

          const marginTop = 200 - value * 4 * coef + 40;
          const coords =
            ' L' +
            ((((width - 63 - 40) / 6) * (array.length - 1)) / diffDays) *
              diffDaysArray +
            ',' +
            marginTop +
            ' ' +
            ((((width - 63 - 40) / 6) * (array.length - 1)) / diffDays) *
              diffDaysArray +
            ',' +
            marginTop;
          console.log('coords', coords);
          if (array[i].value !== 0) {
            path += coords;
          }
          shadowPath += coords;

          let month = arrayDate.toLocaleString('en-us', {month: 'short'});
          month = Platform.OS === 'android' ? month.substr(4, 3) : month;
          if (array[i].value !== 0) {
            this.coordinates.push({
              x:
                ((((width - 63 - 40) / 6) * (array.length - 1)) / diffDays) *
                diffDaysArray,
              y: marginTop,
              date: arrayDate.getDate() + ' ' + month,
              value: array[i].value,
              dayOfWeek: dayOfWeek,
              minValue: array[i].minValue,
              maxValue: array[i].maxValue,
              minWorkout: array[i].minWorkout,
              maxWorkout: array[i].maxWorkout,
              index: i,
            });
          }

          if (minY < marginTop) {
            minY = marginTop;
          }

          if (i === array.length - 1) {
            // if (array[i].value === 0) {
            //   shadowPath += ' L' + lastValue + ',' + 200 + ' Z';
            // } else {
            shadowPath +=
              ' L' +
              ((((width - 63 - 40) / 6) * (array.length - 1)) / diffDays) *
                diffDaysArray +
              ',' +
              200 +
              ' Z';
            // }
          }
        }

        console.log('this.coordinates', this.coordinates);
        console.log('minY', minY);
      } else {
        const coef = 0.2985; //0.1475; // 0.32

        console.log('this.props.data', this.state.allDatesArray);
        // const array = this.arrayReverseObj(this.props.data.results);
        const array = this.state.allDatesArray; //this.arrayReverseObjMonth(this.props.data.results);
        console.log('reverse array', array);

        // let diffDays = 0;

        // if (this.props.isDay) {
        //   diffDays = 23;
        // } else {
        // const startDate = new Date(
        //   array[0].date.substring(0, 4),
        //   array[0].date.substring(5, 7) - 1,
        //   array[0].date.substring(8, 10)
        // );
        // const endDate = new Date(
        //   array[array.length - 1].date.substring(0, 4),
        //   array[array.length - 1].date.substring(5, 7) - 1,
        //   array[array.length - 1].date.substring(8, 10)
        // );
        //
        // const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        let diffDays = 23;
        // }

        // if (diffDays === 0) {
        //   diffDays = 1;
        // }
        console.log('diffDays', diffDays);

        path = 'M' + 0 + ',' + (200 - Number(array[0].value) * 4 * coef + 40);
        shadowPath =
          'M' +
          0 +
          ',' +
          195 +
          ' L' +
          0 +
          ',' +
          Number(array[0].value) * 4 * coef +
          40;
        const coords =
          ' L' +
          0 +
          ',' +
          (200 - Number(array[0].value) * 4 * coef + 40) +
          ' ' +
          0 +
          ',' +
          (200 - Number(array[0].value) * 4 * coef + 40);
        path += coords;
        shadowPath += coords;

        const firstDate = new Date(
          array[0].date.substring(0, 4),
          array[0].date.substring(5, 7) - 1,
          array[0].date.substring(8, 10),
        );
        let firstDateMonth = firstDate.toLocaleString('en-us', {
          month: 'short',
        });

        const dayOfWeek = this.getDayOfWeek(firstDate.getDay());

        if (array[0].value !== 0) {
          this.coordinates.push({
            x: 0,
            y: 200 - array[0].value * 4 * coef + 40,
            date: firstDate.getDate() + ' ' + firstDateMonth,
            value: array[0].value,
            dayOfWeek,
            hours: firstDate.toISOString().substring(11, 13),
            minValue: array[0].minValue,
            maxValue: array[0].maxValue,
            minWorkout: array[0].minWorkout,
            maxWorkout: array[0].maxWorkout,
            index: 0,
          });
        }

        minY = 200 - array[0].value * 4 * coef + 40;

        let lastValue = array[0].value;
        for (let i = 1; i < array.length; i++) {
          console.log('array item', array[i]);
          let value = 0;
          if (array[i].value !== 0) {
            value = array[i].value;
            lastValue = array[i].value;
          } else {
            value = lastValue;
          }

          const arrayDate = new Date(
            array[i].date.substring(0, 4),
            array[i].date.substring(5, 7) - 1,
            array[i].date.substring(8, 10),
          );
          // const diffTimeArray = Math.abs(
          //   arrayDate.getTime() - startDate.getTime()
          // );
          // let diffDaysArray = Math.ceil(diffTimeArray / (1000 * 60 * 60 * 24));
          // if (diffDaysArray === 0) {
          //   diffDaysArray = 1;
          // }

          const dayOfWeek = this.getDayOfWeek(arrayDate.getDay());

          let diffDaysArray = parseInt(array[i].hours);

          console.log('diffDaysArray', diffDaysArray, array[i].hours);

          const marginTop = 200 - value * 4 * coef + 40;
          const coords =
            ' L' +
            ((((width - 63 - 40 - 20) / 23) * (array.length - 1)) / diffDays) *
              diffDaysArray +
            ',' +
            marginTop +
            ' ' +
            ((((width - 63 - 40 - 20) / 23) * (array.length - 1)) / diffDays) *
              diffDaysArray +
            ',' +
            marginTop;
          console.log('coords', coords);

          let month = arrayDate.toLocaleString('en-us', {month: 'short'});
          month = Platform.OS === 'android' ? month.substr(4, 3) : month;
          if (array[i].value !== 0) {
            this.coordinates.push({
              x:
                ((((width - 63 - 40 - 20) / 23) * (array.length - 1)) /
                  diffDays) *
                diffDaysArray,
              y: marginTop,
              date: this.props.isDay
                ? array[i].hour + i
                : arrayDate.getDate() + ' ' + month,
              value: array[i].value,
              dayOfWeek,
              hours: arrayDate.toISOString().substring(11, 13),
              minValue: array[i].minValue,
              maxValue: array[i].maxValue,
              minWorkout: array[i].minWorkout,
              maxWorkout: array[i].maxWorkout,
              index: i,
            });

            path += coords;
            shadowPath += coords;
          } else if (i === array.length - 1) {
            if (array[i].value !== 0) {
              path += coords;
            }
            // path += coords;
            shadowPath += coords;
          }

          if (minY < marginTop) {
            minY = marginTop;
          }

          if (i === array.length - 1) {
            shadowPath +=
              ' L' +
              ((((width - 63 - 40 - 20) / 23) * (array.length - 1)) /
                diffDays) *
                diffDaysArray +
              ',' +
              200 +
              ' Z';
          }
        }

        console.log('this.coordinates', this.coordinates);
        console.log('minY', minY);
      }
    }

    let touchableItems = null;
    if (this.coordinates.length !== 0) {
      touchableItems = this.coordinates.map((data, index) => {
        console.log('data.x', data);
        return (
          <TouchableWithoutFeedback
            key={index.toString()}
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
            onPress={() =>
              // this.handlePress(data.x, data.y, data.date, data.value)
              {
                console.log('onPress', data, index);
                this.setState({
                  hintPositionX: data.x,
                  hintPositionY: data.y,
                  hintHours:
                    typeof data.hours !== 'undefined' ? data.hours : '',
                  hintDate: data.date,
                  hintValue: data.value,
                  isHintModalVisible: true,
                  // hintIndex: index,
                  hintDayOfWeek: data.dayOfWeek,
                  hintMinValue: data.minValue,
                  hintMaxValue: data.maxValue,
                  hintWorkoutMinValue: data.minWorkout,
                  hintWorkoutMaxValue: data.maxWorkout,
                  hintIndex: data.index,
                });
              }
            }>
            <View
              style={{
                position: 'absolute',
                // width: 6,
                // height: 6,
                // borderRadius: 3,
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: 'rgb(244,88,152)',
                borderWidth: 1.5,
                borderColor: 'rgb(255,255,255)',
                left: 23 + data.x,
                top: data.y - 3,
                zIndex: 999,
              }}
            />
          </TouchableWithoutFeedback>
        );
      });
    }

    let popupOffset = this.state.hintPositionX;
    let lollipopMod = 0;
    if (this.props.isDay) {
      if (this.state.hintIndex === 18) {
        popupOffset -= 45;
        lollipopMod += 45;
      } else if (this.state.hintIndex === 19) {
        popupOffset -= 60;
        lollipopMod += 60;
      } else if (this.state.hintIndex === 20) {
        popupOffset -= 73;
        lollipopMod += 73;
      } else if (this.state.hintIndex === 21) {
        popupOffset -= 85;
        lollipopMod += 85;
      } else if (this.state.hintIndex === 22) {
        popupOffset -= 98;
        lollipopMod += 98;
      } else if (this.state.hintIndex === 23) {
        popupOffset -= 110;
        lollipopMod += 110;
      }
    } else {
      if (this.state.hintIndex === 5) {
        popupOffset -= 60;
        lollipopMod += 60;
      }

      if (this.state.hintIndex === 6) {
        popupOffset -= 110;
        lollipopMod += 110;
      }
    }

    let hintTop = isIphoneX() ? -563 : -568;

    if (Platform.OS === 'ios' && !isIphoneX()) {
      hintTop += 6;
    }

    if (
      this.state.workoutCalories !== 0 &&
      this.state.hintValue !== this.state.workoutCalories
    ) {
      hintTop -= 95;
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({isHintModalVisible: false})}>
        <View style={{marginTop: 32}}>
          <View style={{width: width - 40, alignSelf: 'center'}}>
            <Text style={styles.title}>
              {this.state.averageValue.toLocaleString('en-US')}
              <Text style={[styles.title, {fontSize: 18}]}> BPM</Text>
            </Text>
            {this.props.isDay ? (
              <View
                style={{
                  marginTop: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.subtitle}>Avg Heart Rate</Text>
                <View
                  style={{
                    width: 3,
                    height: 3,
                    backgroundColor: 'rgb(173,179,183)',
                    marginHorizontal: 10,
                  }}
                />
                <Text style={styles.subtitle}>{`${this.props.dates.substring(
                  8,
                  10,
                )} ${this.getMonthName(
                  this.props.dates.substring(5, 7),
                )}`}</Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.subtitle}>Avg Heart Rate</Text>
                <View
                  style={{
                    width: 3,
                    height: 3,
                    backgroundColor: 'rgb(173,179,183)',
                    marginHorizontal: 10,
                  }}
                />
                <Text style={styles.subtitle}>{`${this.props.dates[0].substring(
                  8,
                  10,
                )} ${this.getMonthName(
                  this.props.dates[0].substring(5, 7),
                )} - ${this.props.dates[1].substring(
                  8,
                  10,
                )} ${this.getMonthName(
                  this.props.dates[1].substring(5, 7),
                )}`}</Text>
              </View>
            )}
          </View>

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
                left: 10,
                width: 19,
                alignItems: 'flex-end',
              }}>
              <Text style={[styles.axisText, {marginTop: 0}]}>200</Text>
              <Text style={[styles.axisText, {marginTop: 33}]}>160</Text>
              <Text style={[styles.axisText, {marginTop: 33}]}>120</Text>
              <Text style={[styles.axisText, {marginTop: 31}]}>80</Text>
              <Text style={[styles.axisText, {marginTop: 34}]}>40</Text>
            </View>

            {this.props.isDay ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 32,
                  left: 34,
                  width: width - 139,
                  // width: width - 85,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.axisText}>12a</Text>
                <Text style={styles.axisText}>4a</Text>
                <Text style={styles.axisText}>8a</Text>
                <Text style={styles.axisText}>12p</Text>
                <Text style={styles.axisText}>4p</Text>
                <Text style={styles.axisText}>8p</Text>
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  bottom: 32,
                  left: 34,
                  width: width - 78,
                  // width: width - 85,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.axisText}>Mon</Text>
                <Text style={styles.axisText}>Tue</Text>
                <Text style={styles.axisText}>Wed</Text>
                <Text style={styles.axisText}>Thu</Text>
                <Text style={styles.axisText}>Fri</Text>
                <Text style={styles.axisText}>Sat</Text>
                <Text style={styles.axisText}>Sun</Text>
              </View>
            )}

            <View
              style={{
                position: 'absolute',
                top: 7.5,
                width: width - 63,
                left: 23,
              }}>
              <View
                style={{
                  width: width - 63,
                  height: 0.5,
                  backgroundColor: 'rgb(238,240,244)',
                }}
              />
              <View
                style={{
                  width: width - 63,
                  height: 0.5,
                  backgroundColor: 'rgb(238,240,244)',
                  marginTop: 47,
                }}
              />
              <View
                style={{
                  width: width - 63,
                  height: 0.5,
                  backgroundColor: 'rgb(238,240,244)',
                  marginTop: 47,
                }}
              />
              <View
                style={{
                  width: width - 63,
                  height: 0.5,
                  backgroundColor: 'rgb(238,240,244)',
                  marginTop: 47,
                }}
              />
              <View
                style={{
                  width: width - 63,
                  height: 0.5,
                  backgroundColor: 'rgb(238,240,244)',
                  marginTop: 47,
                }}
              />
            </View>

            <View
              style={{
                marginTop: 7.5,
                width: width - 63 - 35,
                height: 185,
                zIndex: 999,
                marginLeft: this.props.isDay
                  ? 25 - 10
                  : Platform.OS === 'ios'
                  ? 25 - 10
                  : 25 - 6,
                // flexDirection: "row",
                // justifyContent: "space-between",
              }}>
              {/* bars */}

              {path !== null && (
                <View style={{position: 'absolute', left: 26}}>
                  <Svg height={192} width={width - 63 - 35}>
                    <Path
                      d={shadowPath}
                      fill={'rgb(244,88,152)'}
                      fillOpacity={0.05}
                      stroke="transparent"
                      strokeWidth={1}
                    />
                  </Svg>
                </View>
              )}

              {path !== null && (
                <View style={{position: 'absolute', left: 26}}>
                  <Svg height={192} width={width - 63 - 35}>
                    <Path
                      d={path}
                      fill="none"
                      stroke={'rgb(244,88,152)'}
                      strokeWidth={1.5}
                    />
                  </Svg>
                </View>
              )}

              {this.state.averageValue === 0 && (
                <Text
                  style={[
                    styles.subtitle,
                    {alignSelf: 'center', position: 'absolute', top: 95},
                  ]}>
                  {this.state.isLoading ? 'Loading...' : 'No data'}
                </Text>
              )}

              {touchableItems}
            </View>
          </View>

          {this.state.isHintModalVisible && (
            <View>
              <View
                style={{
                  width: width - 40,
                  height: 79,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 24,
                }}>
                <Image
                  source={require('../resources/icon/heartRate.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Heart Rate Range
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {`${this.state.hintMinValue} - ${this.state.hintMaxValue} `}
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      {' '}
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: width - 40,
                  height: 79,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Image
                  source={require('../resources/icon/resting.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Resting Heart Rate Average
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {`${this.state.hintMinValue} `}
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: width - 40,
                  height: 79,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Image
                  source={require('../resources/icon/workout_green.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Workout Heart Rate
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {`${
                      this.state.hintWorkoutMinValue === 400
                        ? 0
                        : this.state.hintWorkoutMinValue
                    } - ${
                      this.state.hintWorkoutMaxValue === 0
                        ? 0
                        : this.state.hintWorkoutMaxValue
                    } `}
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {!this.state.isHintModalVisible && (
            <View>
              <View
                style={{
                  width: width - 40,
                  height: 79,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 24,
                }}>
                <Image
                  source={require('../resources/icon/heartRate.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Heart Rate Range
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {`${
                      this.props.isDay
                        ? this.state.minDayValue === 400
                          ? 0
                          : this.state.minDayValue
                        : this.state.minWeekValue === 400
                        ? 0
                        : this.state.minWeekValue
                    } - ${
                      this.props.isDay
                        ? this.state.maxDayValue
                        : this.state.maxWeekValue
                    } `}
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      {' '}
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: width - 40,
                  height: 79,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Image
                  source={require('../resources/icon/resting.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Resting Heart Rate Average
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {`${
                      this.props.isDay
                        ? this.state.minDayValue === 400
                          ? 0
                          : this.state.minDayValue
                        : this.state.minWeekValue === 400
                        ? 0
                        : this.state.minWeekValue
                    } `}
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: width - 40,
                  height: 79,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Image
                  source={require('../resources/icon/workout_green.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Workout Heart Rate
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {`${
                      this.state.workoutMinValue === 400
                        ? 0
                        : this.state.workoutMinValue
                    } - ${
                      this.state.workoutMaxValue === 0
                        ? 0
                        : this.state.workoutMaxValue
                    } `}
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {this.state.isHintModalVisible && (
            <View
              style={{
                // marginTop: Platform.OS === 'ios' ? -530 : -675,
                width,
                overflow: 'visible',
                borderRadius: 4,
                backgroundColor: 'black',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: hintTop - 3,
                  left:
                    17 +
                    (!this.props.isDay &&
                    (this.state.hintDayOfWeek === 'Sun' ||
                      this.state.hintDayOfWeek === 'Sat')
                      ? this.state.hintPositionX - 5 - 100
                      : popupOffset),
                  // backgroundColor: 'blue',
                  // width,
                  overflow: 'visible',
                  borderRadius: 4,
                  zIndex: 1,
                  // width: 1,
                  // overflow: 'hidden',
                }}>
                <View>
                  <View
                    style={{
                      position: 'absolute',
                      height: 95,
                      width: width + 19 - 24 + this.state.hintPositionX + 100,
                      left: -(19 - 24 + this.state.hintPositionX) - 50,
                      backgroundColor: 'rgb(255,255,255)',
                    }}
                  />
                  <BoxShadow
                    setting={{
                      ...shadowOpt,
                      ...{
                        width: this.props.isDay ? 190 : 190,
                        height: 95,
                        y: 6,
                        border: 16,
                        radius: 4,
                        opacity: 0.08,
                      },
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        height: 95,
                        width: this.props.isDay ? 190 : 190,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                      }}>
                      <Text style={styles.hintTitle}>
                        {this.state.hintValue}
                        <Text style={[styles.hintTitle, {fontSize: 18}]}>
                          {' '}
                          BPM
                        </Text>
                      </Text>
                      <View
                        style={{
                          marginLeft: 20,
                          marginTop: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.hintSubtitle}>Avg Heart Rate</Text>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: 'rgb(173,179,183)',
                            marginHorizontal: 10,
                          }}
                        />
                        <Text style={styles.hintSubtitle}>
                          {' '}
                          {!this.props.isDay
                            ? this.state.hintDate
                            : this.state.hintIndex.toString().padStart(2, '0') +
                              ':00'}
                        </Text>
                      </View>
                    </View>
                  </BoxShadow>

                  <View
                    style={{
                      marginTop: 0,
                      marginLeft: this.props.isDay
                        ? 62 - 20 + lollipopMod
                        : 45 -
                          1.5 +
                          (Platform.OS === 'ios'
                            ? !this.props.isDay &&
                              (this.state.hintDayOfWeek === 'Sun' ||
                                this.state.hintDayOfWeek === 'Sat')
                              ? 102.5 + 2
                              : 2.5 - 2.5
                            : !this.props.isDay &&
                              (this.state.hintDayOfWeek === 'Sun' ||
                                this.state.hintDayOfWeek === 'Sat')
                            ? 102.5 + 6
                            : 2.75),
                      width: 2,
                      height:
                        Platform.OS === 'ios'
                          ? this.state.hintPositionY + 28
                          : this.state.hintPositionY + 33,
                      borderRadius: 1,
                      backgroundColor: 'rgb(221,224,228)',
                      zIndex: 1,
                    }}
                  />
                </View>
              </View>
            </View>
          )}

          {/*<Dialog
            visible={this.state.isHintModalVisible}
            containerStyle={{marginTop: Platform.OS === 'ios' ? -230 : -275}}
            onTouchOutside={() => {
              console.log('onTouchOutside');
              this.setState({isHintModalVisible: false});
            }}
            onDismiss={() => {
              this.setState({isHintModalVisible: false});
            }}
            dialogAnimation={fadeAnimation}
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
                top: isIphoneX() ? -160 : -70,
                left:
                  !this.props.isDay &&
                  (this.state.hintDayOfWeek === 'Sun' ||
                    this.state.hintDayOfWeek === 'Sat')
                    ? this.state.hintPositionX - 5 - 100
                    : popupOffset,
              }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({isHintModalVisible: false})}
                hitSlop={{top: 500, bottom: 500, right: 500, left: 500}}>
                <View>
                  <View
                    style={{
                      position: 'absolute',
                      height: 95,
                      width: width + 19 - 24 + this.state.hintPositionX + 100,
                      left: -(19 - 24 + this.state.hintPositionX) - 50,
                      backgroundColor: 'rgb(255,255,255)',
                    }}
                  />
                  <BoxShadow
                    setting={{
                      ...shadowOpt,
                      ...{
                        width: this.props.isDay ? 190 : 190,
                        height: 95,
                        y: 6,
                        border: 16,
                        radius: 4,
                        opacity: 0.08,
                      },
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        height: 95,
                        width: this.props.isDay ? 190 : 190,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                      }}>
                      <Text style={styles.hintTitle}>
                        {this.state.hintValue}
                        <Text style={[styles.hintTitle, {fontSize: 18}]}>
                          {' '}
                          BPM
                        </Text>
                      </Text>
                      <View
                        style={{
                          marginLeft: 20,
                          marginTop: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.hintSubtitle}>Avg Heart Rate</Text>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: 'rgb(173,179,183)',
                            marginHorizontal: 10,
                          }}
                        />
                        <Text style={styles.hintSubtitle}>
                          {' '}
                          {!this.props.isDay
                            ? this.state.hintDate
                            : this.state.hintIndex.toString().padStart(2, '0') +
                              ':00'}
                        </Text>
                      </View>
                    </View>
                  </BoxShadow>

                  <View
                    style={{
                      marginTop: 0,
                      marginLeft: this.props.isDay
                        ? 62 - 20 + lollipopMod
                        : 45 -
                          1.5 +
                          (Platform.OS === 'ios'
                            ? !this.props.isDay &&
                              (this.state.hintDayOfWeek === 'Sun' ||
                                this.state.hintDayOfWeek === 'Sat')
                              ? 102.5 + 2
                              : 2.5 - 2.5
                            : !this.props.isDay &&
                              (this.state.hintDayOfWeek === 'Sun' ||
                                this.state.hintDayOfWeek === 'Sat')
                            ? 102.5 + 6
                            : 2.75),
                      width: 2,
                      height:
                        Platform.OS === 'ios'
                          ? this.state.hintPositionY + 28
                          : this.state.hintPositionY + 33,
                      borderRadius: 1,
                      backgroundColor: 'rgb(221,224,228)',
                      zIndex: 1,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </DialogContent>
          </Dialog> */}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  axisText: {
    color: 'rgb(141,147,151)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 11,
    width: 24,
  },
  monthName: {
    color: 'rgb(54,58,61)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
  },
  dayText: {
    color: 'rgb(54,58,61)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: -0.3,
    marginTop: 4,
  },
  hintTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 32,
    color: 'rgb(54,58,61)',
    marginTop: 20,
    marginLeft: 20,
  },
  hintSubtitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
  },
  title: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 32,
    color: 'rgb(54,58,61)',
  },
  subtitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
  },
  additionalCardTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(106,111,115)',
  },
  additionalCardText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 18,
    color: 'rgb(31,33,35)',
    marginTop: 4,
  },
  heartHint: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
    width: width - 105,
  },
});

HeartRateChart.defaultProps = {};

export default HeartRateChart;

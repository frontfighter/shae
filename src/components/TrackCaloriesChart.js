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
  ScaleAnimation,
} from 'react-native-popup-dialog';
import {BoxShadow} from 'react-native-shadow';
import * as Animatable from 'react-native-animatable';
import Svg, {Path, G} from 'react-native-svg';
import AppleHealthKit from 'rn-apple-healthkit';
import {PieChart} from 'react-native-svg-charts';
import GoogleFit, {Scopes} from 'react-native-google-fit';

const {height, width} = Dimensions.get('window');

const fadeAnimation = new FadeAnimation({
  toValue: 1,
  animationDuration: 200,
  useNativeDriver: true,
});

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
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

class TrackCaloriesChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDatesArray: [],
      isHintModalVisible: false,
      hintPositionX: 0,
      hintDate: '',
      hintHours: '',
      hintValue: '',
      hintIndex: 0,
      hintItem: {},
      barHeights: {},
      averageValue: 0,
      barPositions: {},
      pieChartData: [],
      hintTouchPosition: {},
      isHintPieModalVisible: false,
      hintPieValue: 0,
      hintPieDate: '',
      workoutCalories: 0,
      maxValue: 0,
      totalCalories: 0,
      isLoading: false,
    };

    this.allDates = [];
    this.dayHours = [];
  }

  componentDidMount() {
    console.log('FoodRatingsGraphic dates', this.props.dates);

    this.setState({isLoading: true});
    this.getAlldates(this.props.dates);

    setTimeout(() => {
      this.getData(this.props.dates);
    }, 150);
  }

  getAlldates = (dates) => {
    if (this.props.isDay) {
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

  getData = (dates) => {
    if (Platform.OS === 'ios') {
      const PERMS = AppleHealthKit.Constants.Permissions;
      const options = {
        permissions: {
          read: [PERMS.ActiveEnergyBurned, PERMS.Workout],
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

        if (this.props.isDay) {
          let options = {
            // date: dates + "T00:00:00.000Z",
            date: dates + `T00:00:00.000${offset}`,
            interval: 60 * 24,
          };

          console.log(
            'getHourlyActiveEnergyBurned opts',
            dates,
            `T00:00:00.000${offset}`,
          );

          let pieChartData = [];
          let value = 0;
          let totalCalories = 0;

          AppleHealthKit.getHourlyActiveEnergyBurned(
            options,
            (err, results) => {
              if (err) {
                console.log('getHourlyActiveEnergyBurned error', err);
                console.log('AppleHealthKit error', err);

                return;
              }
              console.log('getHourlyActiveEnergyBurned', results);

              let array = [];

              let reversedResults;
              let totalCalories = 0;

              for (let i = 0; i < results.length; i++) {
                if (
                  results[i].startDate.substring(0, 10) !== dates &&
                  results[i].endDate.substring(0, 10) !== dates
                ) {
                  results.splice(i, 1);
                  continue;
                }
              }

              if (results.length !== 0) {
                reversedResults = results.reverse();

                for (let i = 0; i < reversedResults.length; i++) {
                  // if (
                  //   reversedResults[i].startDate.substring(0, 10) !== dates &&
                  //   reversedResults[i].endDate.substring(0, 10) !== dates
                  // ) {
                  //   reversedResults.splice(i, 1);
                  //   continue;
                  // }

                  if (
                    reversedResults[i].startDate.substring(8, 10) ===
                    dates.substring(8, 10)
                  ) {
                    let countOfItems = 1;
                    let item = {};
                    item.value = reversedResults[i].value;
                    value += reversedResults[i].value;

                    totalCalories += item.value;

                    item.countOfItems = countOfItems;
                    item.date = results[i].startDate.substring(0, 10);
                    item.hours = reversedResults[i].startDate.substring(11, 13);
                    item.position = this.dayHours.indexOf(item.hours);

                    array.push(item);
                  }
                }

                console.log('reversedResults', reversedResults);

                // let allDatesArray = [];
                // for (let i = 0; i < this.dayHours.length; i++) {
                //   let isItemFound = false;
                //   for (let k = 0; k < array.length; k++) {
                //     if (array[k].hours === this.dayHours[i]) {
                //       isItemFound = true;
                //       allDatesArray.push({
                //         ...array[k],
                //         ...{ background: "rgb(255,255,255)" },
                //       });
                //       break;
                //     }
                //   }
                //
                //   if (!isItemFound) {
                //     allDatesArray.push({
                //       background: "transparent",
                //       countOfItems: 0,
                //       value: 0,
                //     });
                //   }
                // }

                pieChartData.push({
                  value: value,
                  svg: {
                    fill: 'rgb(245,121,75)',
                    onPress: () => {
                      this.setState({
                        isHintPieModalVisible: true,
                        hintPieValue: value,
                        hintPieDate: dates,
                        hintValue: value,
                      });
                    },
                  },
                  key: 0,
                });

                this.setState({
                  // allDatesArray,
                  averageValue: value,
                  pieChartData,
                  totalCalories: parseInt(totalCalories),
                  isLoading: false,
                });
                console.log(array, this.dayHours);

                let workoutCalories = 0;
                console.log(
                  'getSamples day',
                  dates + `T00:00:00.000${offset}`,
                  dates + `T23:59:59.000${offset}`,
                );
                AppleHealthKit.getSamples(
                  {
                    // startDate: dates + "T00:00:00.000Z", // required
                    // endDate: dates + "T23:59:59.000Z",
                    startDate: dates + `T00:00:00.000${offset}`,
                    endDate: dates + `T23:59:59.000${offset}`,
                    type: 'Workout',
                  },
                  (err, workoutResults) => {
                    console.log(
                      'getSamples opts',
                      dates,
                      `T00:00:00.000${offset}`,
                    );
                    if (err) {
                      console.log('getSamples', err);

                      return;
                    }

                    if (workoutResults.length !== 0) {
                      for (let i = 0; i < workoutResults.length; i++) {
                        workoutCalories += workoutResults[i].calories;
                        totalCalories += workoutResults[i].calories;
                      }

                      if (workoutCalories !== 0) {
                        console.log(
                          'pieChartData',
                          pieChartData[0],
                          value,
                          workoutCalories,
                        );
                        pieChartData[0].value = value - workoutCalories;
                        pieChartData[0].svg.onPress = () => {
                          this.setState({
                            isHintPieModalVisible: true,
                            hintPieValue: value - workoutCalories,
                            hintPieDate: dates,
                          });
                        };
                        pieChartData.push({
                          value: workoutCalories,
                          svg: {
                            fill: 'rgb(0,168,235)',
                            onPress: () => {
                              this.setState({
                                isHintPieModalVisible: true,
                                hintPieValue: workoutCalories,
                                hintPieDate: dates,
                                workoutCalories: workoutCalories,
                              });
                            },
                          },
                          key: 1,
                        });

                        this.setState({
                          averageValue: value,
                          pieChartData,
                          workoutCalories,
                          totalCalories,
                          isLoading: false,
                        });
                      }
                    }
                    console.log('getSamples', results);
                  },
                );
              } else {
                reversedResults = results;

                if (pieChartData.length === 0) {
                  pieChartData.push({
                    value: 66,
                    svg: {
                      fill: 'rgb(242,243,246)',
                    },
                    key: 0,
                  });

                  pieChartData.push({
                    value: 34,
                    svg: {
                      fill: 'rgb(242,243,246)',
                    },
                    key: 1,
                  });
                }

                this.setState({
                  averageValue: 0,
                  pieChartData: pieChartData,
                  workoutCalories: 0,
                  totalCalories,
                  isLoading: false,
                });
              }
            },
          );
        } else {
          this.setState({
            allDatesArray: [],
            averageValue: 0,
          });
          const diffTime = Math.ceil(
            Math.abs(new Date(dates[1]) - new Date(dates[0])) /
              (1000 * 60 * 60 * 24),
          );

          console.log('diffTime', diffTime);

          let maxValue = 0;
          let resultsArray = []; //new Set();
          for (let i = 0; i < diffTime + 1; i++) {
            let date = new Date(dates[0]);

            date.setDate(date.getDate() + i);
            let offsetHours = -date.getTimezoneOffset() / 60;
            date.setHours(date.getHours() + offsetHours);

            let options = {
              // startDate: dates[0] + "T00:00:00.000Z", // required
              // endDate: dates[1] + "T00:00:00.000Z",
              date: date.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, //"T00:00:00.000Z",
              interval: 60 * 24,
            };

            console.log(
              'firstDate',
              date.toISOString().slice(0, 10) + `T00:00:00.000${offset}`,
            );

            AppleHealthKit.getHourlyActiveEnergyBurned(
              options,
              (err, results) => {
                if (err) {
                  console.log('getActiveEnergyBurned error ', err);
                  console.log('AppleHealthKit error', err);

                  return;
                }

                console.log('getActiveEnergyBurned results ', results);

                if (results.length !== 0) {
                  if (i === 0 && results.length > 1) {
                    resultsArray.push(results[1]);
                  }

                  if (results.length > 1 || results.length === 1) {
                    let isExists = false;
                    for (let j = 0; j < resultsArray.length; j++) {
                      if (
                        resultsArray[j].value === results[0].value &&
                        resultsArray[j].startDate === results[0].startDate &&
                        resultsArray[j].endDate === results[0].endDate
                      ) {
                        isExists = true;
                        break;
                      }
                    }
                    if (!isExists) {
                      resultsArray.push(results[0]);
                    }
                  }
                  // for (let k = 0; k < results.length; k++) {
                  //   // resultsArray = [
                  //   //   ...new Map(
                  //   //     results.map((item) => [item["startDate"], item])
                  //   //   ).values(),
                  //   // ];
                  //   // resultsArray.add(results[k]);
                  //
                  //
                  // }
                }

                AppleHealthKit.getSamples(
                  {
                    // startDate:
                    //   date.toISOString().slice(0, 10) + "T00:00:00.000Z",
                    // endDate: date.toISOString().slice(0, 10) + "T23:59:00.000Z",
                    startDate:
                      date.toISOString().slice(0, 10) +
                      `T00:00:00.000${offset}`,
                    endDate:
                      date.toISOString().slice(0, 10) +
                      `T23:59:00.000${offset}`,
                    type: 'Workout',
                  },
                  (err, results2) => {
                    if (err) {
                      console.log('getSamples', err);

                      return;
                    }

                    if (results2.length !== 0) {
                      // resultsArray = [...resultsArray];
                      for (let k = 0; k < results2.length; k++) {
                        if (
                          options.date.substring(0, 10) ===
                          results2[k].start.substring(0, 10)
                        ) {
                          console.log('comparing', resultsArray, results2);
                          for (let h = 0; h < resultsArray.length; h++) {
                            if (
                              resultsArray[h].startDate.substring(0, 10) ===
                              results2[k].start.substring(0, 10)
                            ) {
                              if (
                                resultsArray[h].hasOwnProperty(
                                  'workoutCalories',
                                )
                              ) {
                                resultsArray[h].workoutCalories +=
                                  results2[k].calories;
                              } else {
                                resultsArray[h].workoutCalories =
                                  results2[k].calories;
                              }
                            }
                          }
                        }
                      }

                      // resultsArray = new Set(resultsArray);
                    }

                    console.log('getSamples week', options.date, results2);
                  },
                );
              },
            );
          }

          setTimeout(() => {
            resultsArray = [...resultsArray];
            console.log('resultsArray', resultsArray);
            let value = 0;
            let array = [];
            for (let i = 0; i < resultsArray.length; i++) {
              let countOfItems = 1;
              let item = {};
              item.value =
                typeof resultsArray[i].workoutCalories !== 'undefined'
                  ? resultsArray[i].value - resultsArray[i].workoutCalories
                  : resultsArray[i].value;
              item.hintValue = resultsArray[i].value;

              value += resultsArray[i].value;

              if (maxValue < item.value) {
                maxValue = item.value;
              }

              if (typeof resultsArray[i].workoutCalories !== 'undefined') {
                item.workoutCalories = resultsArray[i].workoutCalories;

                maxValue += item.workoutCalories;

                console.log('resultsArray[i].value', resultsArray[i].value);
                countOfItems =
                  resultsArray[i].value - resultsArray[i].workoutCalories === 0
                    ? 1
                    : 2;
              }

              item.countOfItems = countOfItems;
              item.date = resultsArray[i].startDate.substring(0, 10);
              item.position = this.allDates.indexOf(item.date);

              array.push(item);
            }

            console.log('array', array);

            allDatesArray = [];
            for (let i = 0; i < this.allDates.length; i++) {
              let isItemFound = false;
              for (let k = 0; k < array.length; k++) {
                if (array[k].date === this.allDates[i]) {
                  isItemFound = true;
                  allDatesArray.push({
                    ...array[k],
                    ...{background: 'rgb(255,255,255)'},
                  });
                  break;
                }
              }

              if (!isItemFound) {
                allDatesArray.push({
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
              maxValue: maxValue + 100,
              isLoading: false,
            });
            console.log('allDatesArray', allDatesArray);
            console.log('getActiveEnergyBurned results ', resultsArray);
          }, 200);
        }
      });
    } else {
      let date = new Date();
      let offset = date.getTimezoneOffset() / 60;
      if (offset < 0) {
        offset = '+' + Math.abs(offset).toString().padStart(2, '0') + '00';
      } else {
        offset = '-' + Math.abs(offset).toString().padStart(2, '0') + '00';
      }

      const options = {
        scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_BODY_READ],
      };
      GoogleFit.authorize(options)
        .then((res) => {
          console.log('authorized >>>', res);

          if (res.success) {
            if (this.props.isDay) {
              let pieChartData = [];
              let value = 0;

              let todayDate = new Date();
              let startDate = new Date(dates);
              const offsetTZ = startDate.getTimezoneOffset() / 60;
              startDate.setHours(0, 0, 0, 0);
              // startDate.setHours(startDate.getHours() + offsetTZ);
              let endDate = new Date(dates);
              // endDate.setDate(endDate.getDate() + 1);
              if (dates === todayDate.toISOString().substring(0, 10)) {
                endDate.setHours(
                  todayDate.getHours(),
                  todayDate.getMinutes(),
                  todayDate.getSeconds(),
                  0,
                );
              } else {
                endDate.setHours(23, 59, 59, 0);
              }

              // endDate.setHours(endDate.getHours() + offsetTZ);

              console.log(
                'startDate.toISOString()',
                startDate.toISOString(), //.replace("Z", offset),
                endDate.toISOString(), //.replace("Z", offset)
              );

              GoogleFit.getDailyCalorieSamples({
                startDate: startDate.toISOString(), // dates + `T00:00:00.000`,
                endDate: endDate.toISOString(), //dates + `T23:59:00.000`,
                basalCalculation: false,
                bucketUnit: 'DAY',
                bucketInterval: 1,
              }).then(async (res) => {
                console.log('getDailyCalorieSamples', res);
                let array = [];
                if (res !== false) {
                  let reversedResults = this.reverseArray(res);

                  for (let i = 0; i < reversedResults.length; i++) {
                    let countOfItems = 1;
                    let item = {};
                    item.value = reversedResults[i].calorie;
                    value += reversedResults[i].calorie;

                    item.countOfItems = countOfItems;
                    item.date = reversedResults[i].startDate.substring(0, 10);
                    item.hours = reversedResults[i].startDate.substring(11, 13);
                    item.position = this.dayHours.indexOf(item.hours);

                    array.push(item);
                  }

                  let workoutValue = 0;
                  const workoutResults = await GoogleFit.getActivitySamples({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    basalCalculation: false,
                    bucketUnit: 'HOUR',
                    bucketInterval: 1,
                  });

                  for (let i = 0; i < workoutResults.length; i++) {
                    if (
                      workoutResults[i].activityName !== 'still' &&
                      workoutResults[i].activityName !== 'unknown'
                    ) {
                      workoutValue += workoutResults[i].calories;
                    }
                  }

                  console.log('workoutResults', workoutResults);

                  console.log('array234', array);

                  // endDate.toISOString()

                  pieChartData.push({
                    value: value,
                    svg: {
                      fill: 'rgb(245,121,75)',
                      onPress: () => {
                        this.setState({
                          isHintPieModalVisible: true,
                          hintPieValue: value,
                          hintPieDate: dates,
                        });
                      },
                    },
                    key: 0,
                  });

                  if (workoutValue !== 0) {
                    pieChartData.push({
                      value: workoutValue,
                      svg: {
                        fill: 'rgb(0,168,235)',
                        onPress: () => {
                          this.setState({
                            isHintPieModalVisible: true,
                            hintPieValue: workoutValue,
                            hintPieDate: dates,
                            workoutCalories: workoutValue,
                          });
                        },
                      },
                      key: 1,
                    });
                  }

                  console.log('value, pieChartData', value, pieChartData);

                  this.setState({
                    // allDatesArray,
                    averageValue: value + workoutValue,
                    pieChartData,
                    totalCalories: parseInt(value + workoutValue),
                    isLoading: false,
                  });
                }
              });
            } else {
              this.setState({
                allDatesArray: [],
                averageValue: 0,
              });
              const diffTime = Math.ceil(
                Math.abs(new Date(dates[1]) - new Date(dates[0])) /
                  (1000 * 60 * 60 * 24),
              );

              console.log('diffTime', diffTime);

              let resultsArray = []; //new Set();

              console.log('dates', dates);

              let startDate = new Date(dates[0]);
              const offsetTZ = startDate.getTimezoneOffset() / 60;
              startDate.setHours(0, 0, 0, 0);
              // startDate.setHours(startDate.getHours() + offsetTZ);
              let endDate = new Date(dates[1]);
              // endDate.setDate(endDate.getDate() + 1);

              let todayDate = new Date();
              if (dates[1] === todayDate.toISOString().substring(0, 10)) {
                endDate.setHours(
                  todayDate.getHours(),
                  todayDate.getMinutes(),
                  todayDate.getSeconds(),
                  0,
                );
              } else {
                endDate.setHours(23, 59, 59, 0);
              }
              // endDate.setHours(23, 59, 59, 0);

              GoogleFit.getDailyCalorieSamples({
                startDate: startDate.toISOString(), // dates + `T00:00:00.000`,
                endDate: endDate.toISOString(),
                basalCalculation: false,
                bucketUnit: 'DAY',
                bucketInterval: 1,
              }).then(async (res) => {
                console.log('getDailyCalorieSamples results ', res);

                let results = [];
                let maxValue = 0;
                for (let i = 0; i < res.length; i++) {
                  results.push({
                    workoutCalories: 0,
                    value: res[i].calorie,
                    startDate: res[i].startDate.substring(0, 10),
                    endDate: res[i].endDate.substring(0, 10),
                  });

                  if (maxValue < res[i].calorie) {
                    maxValue = res[i].calorie;
                  }
                }

                this.setState({maxValue});

                let results2 = [];
                results2.push({
                  workoutCalories: 0,
                  value: 0,
                  startDate: results[0].startDate,
                  endDate: results[0].endDate,
                });
                if (results.length !== 0) {
                  for (let i = 1; i < results.length; i++) {
                    if (results[i].startDate !== results[i - 1].startDate) {
                      results2.push({
                        workoutCalories: 0,
                        value: 0,
                        startDate: results[i].startDate,
                        endDate: results[i].endDate,
                      });
                    }
                  }

                  for (let i = 0; i < results2.length; i++) {
                    for (let j = 0; j < results.length; j++) {
                      if (results[j].endDate === results2[i].endDate) {
                        results2[i].value += results[j].value;
                      }
                    }
                  }

                  console.log('results2', results2);

                  resultsArray = [...results2];

                  // if (results.length > 1 || results.length === 1) {
                  //   let isExists = false;
                  //   for (let j = 0; j < resultsArray.length; j++) {
                  //     if (
                  //       resultsArray[j].value === results[0].value &&
                  //       resultsArray[j].startDate === results[0].startDate &&
                  //       resultsArray[j].endDate === results[0].endDate
                  //     ) {
                  //       isExists = true;
                  //
                  //       // resultsArray[j].value =
                  //
                  //       break;
                  //     }
                  //   }
                  //   if (!isExists) {
                  //     resultsArray.push(results[0]);
                  //   }
                  // }
                }

                // still unknown

                setTimeout(async () => {
                  resultsArray = [...resultsArray];

                  const workoutResults = await GoogleFit.getActivitySamples({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    basalCalculation: false,
                    bucketUnit: 'HOUR',
                    bucketInterval: 1,
                  });

                  console.log('workoutResults', workoutResults);

                  console.log('resultsArray', resultsArray);
                  let maxValue = 0;
                  let value = 0;
                  let array = [];
                  for (let i = 0; i < resultsArray.length; i++) {
                    let countOfItems = 1;
                    let item = {};
                    item.value = resultsArray[i].value;
                    item.hintValue = resultsArray[i].value;

                    value += resultsArray[i].value;

                    for (let k = 0; k < workoutResults.length; k++) {
                      let dateStart = new Date(workoutResults[k].end);
                      dateStart.setHours(
                        dateStart.getHours() -
                          dateStart.getTimezoneOffset() / 60,
                      );

                      console.log(
                        'date comparisson',
                        dateStart.toISOString().substring(0, 10),
                        resultsArray[i].endDate.substring(0, 10),
                      );

                      if (
                        workoutResults[k].activityName !== 'still' &&
                        workoutResults[k].activityName !== 'unknown' &&
                        dateStart.toISOString().substring(0, 10) ===
                          resultsArray[i].endDate.substring(0, 10)
                      ) {
                        console.log(
                          'workout calories',
                          workoutResults[k].calories,
                        );
                        resultsArray[i].workoutCalories +=
                          workoutResults[k].calories;

                        item.hintValue += workoutResults[k].calories;
                      }
                    }

                    if (
                      typeof resultsArray[i].workoutCalories !== 'undefined' &&
                      resultsArray[i].workoutCalories !== 0
                    ) {
                      item.workoutCalories = resultsArray[i].workoutCalories;

                      console.log(
                        'resultsArray[i].value',
                        resultsArray[i].value,
                      );
                      countOfItems = resultsArray[i].value !== 0 ? 2 : 1;
                    }

                    item.countOfItems = countOfItems;
                    item.date = resultsArray[i].endDate.substring(0, 10);
                    item.position = this.allDates.indexOf(item.date);

                    array.push(item);
                  }

                  console.log('array123', array);

                  let allDatesArray = [];
                  for (let i = 0; i < this.allDates.length; i++) {
                    let isItemFound = false;
                    for (let k = 0; k < array.length; k++) {
                      if (array[k].date === this.allDates[i]) {
                        isItemFound = true;

                        if (
                          maxValue <
                          array[k].value + array[k].workoutCalories
                        ) {
                          maxValue = array[k].value + array[k].workoutCalories;
                        }

                        allDatesArray.push({
                          ...array[k],
                          ...{background: 'rgb(255,255,255)'},
                        });
                        break;
                      }
                    }

                    if (!isItemFound) {
                      allDatesArray.push({
                        background: 'transparent',
                        countOfItems: 0,
                        value: 0,
                      });
                    }
                  }

                  let datesCount = 0;
                  for (let i = 0; i < this.allDates.length; i++) {
                    datesCount += 1;

                    if (this.allDates[i] === dates[1]) {
                      break;
                    }
                  }

                  this.setState({
                    allDatesArray,
                    averageValue: parseInt(value / datesCount),
                    maxValue: maxValue !== 0 ? maxValue : this.state.maxValue,
                    isLoading: false,
                  });
                  console.log('allDatesArray', allDatesArray);
                  console.log('getActiveEnergyBurned results ', resultsArray);
                }, 200);
              });
            }
          }
        })
        .catch((err) => {
          console.log('err >>> ', err);
        });
    }
  };

  reverseArray = (array) => {
    return array.reverse();
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('FoodRatingsGraphic foodRatingData', nextProps.data);

    if (nextProps.dates !== this.props.dates) {
      // setTimeout(() => {
      this.setState(
        {
          workoutCalories: 0,
          allDatesArray: [],
          pieChartData: [],
          hintPieValue: 0,
          hintPieDate: '',
          maxValue: 0,
          totalCalories: 0,
          isLoading: true,
        },
        () => {
          this.allDates = [];
          this.dayHours = [];
          this.getAlldates(nextProps.dates);
          this.getData(nextProps.dates);
        },
      );
      // }, 150);
    }
  }

  getColoredSections = (item) => {
    const maxValue = this.state.maxValue === 0 ? 1 : this.state.maxValue;
    if (item.countOfItems === 1) {
      if (typeof item.workoutCalories !== 'undefined') {
        return [
          {
            height: (item.workoutCalories / maxValue) * 190 - 3 / 4,
            backgroundColor: 'rgb(0,168,235)',
            borderRadius: 9,
            width: 18,
          },
        ];
      } else {
        return [
          {
            height: (item.value / maxValue) * 190 - 3 / 4,
            backgroundColor: 'rgb(245,121,75)',
            borderRadius: 9,
            width: 18,
          },
        ];
      }
    } else if (item.countOfItems === 2) {
      return [
        {
          height: (item.workoutCalories / maxValue) * 190 - 3 / 4,
          backgroundColor: 'rgb(0,168,235)',
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (item.value / maxValue) * 190 - 3 / 4,
          backgroundColor: 'rgb(245,121,75)',
          borderRadius: 2,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
          marginTop: 2,
          width: 18,
        },
      ];
    } else return [];
  };

  getColoredSectionsDay = (item) => {
    if (item.countOfItems === 1) {
      return [
        {
          height: (item.value / this.state.maxValue) * 190 - 3 / 4,
          backgroundColor: 'rgb(245,121,75)',
          borderRadius: 3.5,
          width: 7,
        },
      ];
    } else return [];
  };

  onBarPress = (index, value, date, item) => {
    if (item.countOfItems !== 0) {
      this.props.onHint();
      console.log('onBarPress', item, this.state.barPositions);
      this.setState({
        hintPositionX: this.props.isDay
          ? index * 7
          : Platform.OS === 'android'
          ? index * 32 * (width / 360)
          : index * (26 + 8),
        // hintPositionX: this.state.barPositions[index],
        hintHours: typeof item.hours !== 'undefined' ? item.hours : '',
        hintDate: date,
        hintValue: parseInt(item.hintValue), // value,
        isHintModalVisible: true,
        hintIndex: index,
        workoutCalories:
          typeof item.workoutCalories !== 'undefined'
            ? item.workoutCalories
            : 0,
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
    console.log('findDimensions', index, layout);
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

  getYaxis = (value) => {
    let array = [0];
    const divider = parseFloat(value / 4); // 4000 / 4 = 1000

    array.push(parseInt(divider));
    array.push(parseInt(divider * 2));
    array.push(parseInt(divider * 3));
    array.push(parseInt(divider * 4));

    return array;
  };

  render() {
    let bars;

    let yAxis = [];
    if (this.state.maxValue !== 100) {
      yAxis = this.getYaxis(this.state.maxValue);
      console.log('yAxis', yAxis);
    } else {
      yAxis = ['0', '1k', '2k', '3k', '4k'];
    }

    if (!this.props.isDay) {
      if (this.state.allDatesArray.length !== 0) {
        bars = this.state.allDatesArray.map((item, index) => {
          console.log('item', item);
          const sectionsStyles = this.getColoredSections(item);

          const sections = sectionsStyles.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: 18,
                  backgroundColor: item.background,
                  borderRadius: 9,
                }}>
                <View style={item} />
              </View>
            );
          });

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() =>
                this.onBarPress(index, item.value, item.date, item)
              }
              hitSlop={{left: 10, right: 10, top: 50, bottom: 20}}>
              <View
                style={{
                  maxHeight: 190,
                  width: 38 * (width / 375),
                  alignItems: 'center',
                  opacity: item.background === 'transparent' ? 0 : 1,
                  alignSelf: 'flex-end',
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    width: 18,
                    backgroundColor: item.background,
                    borderRadius: 9,
                    justifyContent: 'flex-end',
                  }}
                  onLayout={(event) => {
                    this.findDimesions(event.nativeEvent.layout, index);
                  }}>
                  {sections}
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        });
      }
    } else {
      if (this.state.allDatesArray.length !== 0) {
        bars = this.state.allDatesArray.map((item, index) => {
          console.log('item', item);
          const sectionsStyles = this.getColoredSectionsDay(item);

          const sections = sectionsStyles.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  width: 7,
                  backgroundColor: item.background,
                  borderRadius: 3.5,
                }}>
                <View style={item} />
              </View>
            );
          });

          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() =>
                this.onBarPress(index, item.value, item.date, item)
              }
              hitSlop={{top: 50, bottom: 20}}>
              <View
                style={{
                  maxHeight: 190,
                  width: 7 * (width / 375),
                  alignItems: 'center',
                  opacity: item.background === 'transparent' ? 0 : 1,
                  alignSelf: 'flex-end',
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    width: 7,
                    backgroundColor: item.background,
                    borderRadius: 3.5,
                    justifyContent: 'flex-end',
                  }}
                  onLayout={(event) => {
                    this.findDimesions(event.nativeEvent.layout, index);
                  }}>
                  {sections}
                </View>
              </View>
            </TouchableWithoutFeedback>
          );
        });
      }
    }

    let hintTop = isIphoneX() ? -463 : -468;

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
              {parseInt(this.state.averageValue).toLocaleString('en-US')}
            </Text>
            {this.props.isDay ? (
              <View
                style={{
                  marginTop: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.subtitle}>Kcal Burned</Text>
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
                <Text style={styles.subtitle}>Avg Kcal Burned</Text>
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

          {!this.props.isDay ? (
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
                    left: 10,
                    width: 19,
                    alignItems: 'flex-end',
                  }}>
                  <Text style={[styles.axisText, {marginTop: 0, width: 30}]}>
                    {yAxis[4]}
                  </Text>
                  <Text style={[styles.axisText, {marginTop: 33, width: 30}]}>
                    {yAxis[3]}
                  </Text>
                  <Text style={[styles.axisText, {marginTop: 33, width: 30}]}>
                    {yAxis[2]}
                  </Text>
                  <Text style={[styles.axisText, {marginTop: 31, width: 30}]}>
                    {yAxis[1]}
                  </Text>
                  <Text style={[styles.axisText, {marginTop: 34, width: 30}]}>
                    {yAxis[0]}
                  </Text>
                </View>

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
                    width: this.props.isDay ? width - 120 : width - 63,
                    height: 190,
                    marginLeft: this.props.isDay ? 40 : 25,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {bars}
                </View>

                {this.state.averageValue === 0 && (
                  <Text
                    style={[
                      styles.subtitle,
                      {alignSelf: 'center', position: 'absolute', top: 95},
                    ]}>
                    {this.state.isLoading ? 'Loading...' : 'No data'}
                  </Text>
                )}
              </View>

              {!this.state.isHintModalVisible && (
                <View
                  style={{
                    width: width - 40,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginTop: 24,
                    // marginBottom: 24,
                    marginBottom: 40,
                  }}>
                  <Image
                    source={require('../resources/icon/energyHint.png')}
                    style={{marginRight: 20}}
                  />
                  <Text style={styles.energyHint}>
                    Keeping check of your “Calories Burned” will help you
                    achieve your health goals. Also remember to track your
                    “Calories In" via your Food Diary. This will enable Shae to
                    keep your health in good shape.
                    {'\n\n'}A calorie is a unit of energy. The amount of energy
                    in an item of food or drink is measured in calories. When
                    you eat and drink more calories than you use up, your body
                    can store the excess as body fat. Tracking your calories in,
                    and calories burned, can help you stay on top of your
                    health.
                  </Text>
                </View>
              )}

              {!this.props.isDay &&
                this.state.averageValue !== 0 &&
                this.state.isHintModalVisible && (
                  <View>
                    {parseInt(
                      this.state.hintValue - this.state.workoutCalories,
                    ) !== 0 && (
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
                          source={require('../resources/icon/icon_fire.png')}
                          style={{marginRight: 15, marginLeft: 20}}
                        />
                        <View>
                          <Text style={styles.additionalCardTitle}>
                            In-Active Calories Burned
                          </Text>
                          <Text style={styles.additionalCardText}>
                            {parseInt(
                              this.state.hintValue - this.state.workoutCalories,
                            )}
                            <Text
                              style={[
                                styles.additionalCardText,
                                {fontSize: 14},
                              ]}>
                              {' '}
                              Kcal
                            </Text>
                          </Text>
                        </View>
                      </View>
                    )}

                    {this.state.workoutCalories !== 0 && (
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
                          marginTop:
                            parseInt(
                              this.state.hintValue - this.state.workoutCalories,
                            ) === 0
                              ? 24
                              : 16,
                        }}>
                        <Image
                          source={require('../resources/icon/workout.png')}
                          style={{marginRight: 15, marginLeft: 20}}
                        />
                        <View>
                          <Text style={styles.additionalCardTitle}>
                            Workout Calories Burned
                          </Text>
                          <Text style={styles.additionalCardText}>
                            {parseInt(this.state.workoutCalories)}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
            </View>
          ) : (
            <View>
              <View
                style={{
                  width: 200,
                  height: 200,
                  alignSelf: 'center',
                  marginTop: 40,
                }}
                onTouchStart={(e) =>
                  this.setState({hintTouchPosition: e.nativeEvent})
                }>
                <PieChart
                  style={{height: 200}}
                  data={this.state.pieChartData}
                  outerRadius="100%"
                  innerRadius="60%"
                  sort={() => null}></PieChart>
                {this.state.pieChartData.length !== 0 &&
                  this.state.pieChartData[0].svg.fill ===
                    'rgb(242,243,246)' && (
                    <Text
                      style={[
                        styles.subtitle,
                        {alignSelf: 'center', position: 'absolute', top: 95},
                      ]}>
                      No data
                    </Text>
                  )}
              </View>

              <View
                style={{
                  height: 0.5,
                  width: width - 40,
                  alignSelf: 'center',
                  marginTop: 42,
                  backgroundColor: 'rgb(216,215,222)',
                  marginBottom: 24,
                }}
              />

              {this.props.isDay ? (
                /*<View>
                {parseInt(
                  this.state.averageValue - this.state.workoutCalories,
                ) !== 0 && (
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
                    }}>
                    <Image
                      source={require('../resources/icon/icon_fire.png')}
                      style={{marginRight: 15, marginLeft: 20}}
                    />
                    <View>
                      <Text style={styles.additionalCardTitle}>
                        In-Active Calories Burned
                      </Text>
                      <Text style={styles.additionalCardText}>
                        {parseInt(
                          this.state.averageValue - this.state.workoutCalories,
                        )}
                        <Text
                          style={[styles.additionalCardText, {fontSize: 14}]}>
                          {' '}
                          Kcal
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}

                {this.state.workoutCalories !== 0 && (
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
                      marginTop:
                        parseInt(
                          this.state.averageValue - this.state.workoutCalories,
                        ) !== 0
                          ? 16
                          : 0,
                    }}>
                    <Image
                      source={require('../resources/icon/workout.png')}
                      style={{marginRight: 15, marginLeft: 20}}
                    />
                    <View>
                      <Text style={styles.additionalCardTitle}>
                        Workout Calories Burned
                      </Text>
                      <Text style={styles.additionalCardText}>
                        {parseInt(this.state.workoutCalories)}
                      </Text>
                    </View>
                  </View>
                )}
              </View> */

                <View
                  style={{
                    width: width - 40,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginTop: 24,
                    // marginBottom: 24,
                    marginBottom: 40,
                  }}>
                  <Image
                    source={require('../resources/icon/energyHint.png')}
                    style={{marginRight: 20}}
                  />
                  <Text style={styles.energyHint}>
                    {`You have burned a total of ${parseInt(
                      this.state.totalCalories,
                    )} calories today! \n\nA calorie is a unit of energy. The amount of energy in an item of food or drink is measured in calories. When you eat and drink more calories than you use up, your body can store the excess as body fat. Tracking your calories in, and calories burned, can help you stay on top of your health.`}
                  </Text>
                </View>
              ) : null}
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
                  top: hintTop,
                  left: 13 + this.state.hintPositionX,
                  // backgroundColor: 'blue',
                  // width,
                  overflow: 'visible',
                  borderRadius: 4,
                  // zIndex: 1,
                  // width: 1,
                  // overflow: 'hidden',
                }}>
                <View>
                  <View
                    style={{
                      position: 'absolute',
                      height: 95,
                      width: width + 19 - 24 + this.state.hintPositionX,
                      left: -(19 - 24 + this.state.hintPositionX),
                      backgroundColor: 'rgb(255,255,255)',
                    }}
                  />
                  <BoxShadow
                    setting={{
                      ...shadowOpt,
                      ...{
                        width: this.props.isDay ? 180 : 180,
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
                        width: this.props.isDay ? 180 : 180,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                      }}>
                      <Text style={styles.hintTitle}>
                        {this.state.hintValue
                          .toString()
                          .toLocaleString('en-US', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}
                      </Text>
                      <View
                        style={{
                          marginLeft: 20,
                          marginTop: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.hintSubtitle}>Kcal Burned</Text>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: 'rgb(173,179,183)',
                            marginHorizontal: 10,
                          }}
                        />
                        <Text
                          style={
                            styles.hintSubtitle
                          }>{`${this.state.hintDate.substring(
                          8,
                          10,
                        )} ${this.getMonthName(
                          this.state.hintDate.substring(5, 7),
                        )}`}</Text>
                      </View>
                    </View>
                  </BoxShadow>

                  <View
                    style={{
                      marginTop: 0,
                      marginLeft: this.props.isDay
                        ? isIphoneX()
                          ? 49 + this.state.hintIndex * 5.5 * (width / 412)
                          : Platform.OS === 'android'
                          ? 49 + this.state.hintIndex * 3.15 * (width / 360)
                          : 49 + this.state.hintIndex * 3.8 * (width / 375)
                        : isIphoneX()
                        ? 49 + this.state.hintIndex * 17.5 * (width / 412) + 2.5
                        : Platform.OS === 'android'
                        ? 49 + this.state.hintIndex * 11.35 * (width / 360)
                        : 49 + this.state.hintIndex * 11.8 * (width / 375),
                      width: 2,
                      height:
                        Platform.OS === 'ios'
                          ? 212 - this.state.barHeights[this.state.hintIndex]
                          : 218 - this.state.barHeights[this.state.hintIndex],
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
            this.setState({isHintModalVisible: false, workoutCalories: 0});
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
              left: 19 - 24 + this.state.hintPositionX,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({isHintModalVisible: false})}
              hitSlop={{top: 500, bottom: 500, right: 500, left: 500}}>
              <View>
                <View
                  style={{
                    position: 'absolute',
                    height: 95,
                    width: width + 19 - 24 + this.state.hintPositionX,
                    left: -(19 - 24 + this.state.hintPositionX),
                    backgroundColor: 'rgb(255,255,255)',
                  }}
                />
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: this.props.isDay ? 180 : 180,
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
                      width: this.props.isDay ? 180 : 180,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Text style={styles.hintTitle}>
                      {this.state.hintValue.toString().toLocaleString('en-US', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </Text>
                    <View
                      style={{
                        marginLeft: 20,
                        marginTop: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.hintSubtitle}>Kcal Burned</Text>
                      <View
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: 1.5,
                          backgroundColor: 'rgb(173,179,183)',
                          marginHorizontal: 10,
                        }}
                      />
                      <Text
                        style={
                          styles.hintSubtitle
                        }>{`${this.state.hintDate.substring(
                        8,
                        10,
                      )} ${this.getMonthName(
                        this.state.hintDate.substring(5, 7),
                      )}`}</Text>
                    </View>
                  </View>
                </BoxShadow>

                <View
                  style={{
                    marginTop: 0,
                    marginLeft: this.props.isDay
                      ? isIphoneX()
                        ? 49 + this.state.hintIndex * 5.5 * (width / 412)
                        : Platform.OS === 'android'
                        ? 49 + this.state.hintIndex * 3.15 * (width / 360)
                        : 49 + this.state.hintIndex * 3.8 * (width / 375)
                      : isIphoneX()
                      ? 49 + this.state.hintIndex * 17.5 * (width / 412) + 2.5
                      : Platform.OS === 'android'
                      ? 49 + this.state.hintIndex * 11.35 * (width / 360)
                      : 49 + this.state.hintIndex * 11.8 * (width / 375),
                    width: 2,
                    height:
                      Platform.OS === 'ios'
                        ? 212 - this.state.barHeights[this.state.hintIndex]
                        : 218 - this.state.barHeights[this.state.hintIndex],
                    borderRadius: 1,
                    backgroundColor: 'rgb(221,224,228)',
                    zIndex: 1,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </DialogContent>
        </Dialog> */}

          <Dialog
            visible={this.state.isHintPieModalVisible}
            containerStyle={{marginTop: 20}}
            onTouchOutside={() => {
              console.log('onTouchOutside');
              this.setState({isHintPieModalVisible: false});
            }}
            onDismiss={() => {
              this.setState({isHintPieModalVisible: false});
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
                  ? this.state.hintTouchPosition.locationY - 283
                  : Platform.OS === 'ios'
                  ? this.state.hintTouchPosition.locationY - 133 - 100 + 20
                  : this.state.hintTouchPosition.locationY - 133 - 100,
                left: isIphoneX()
                  ? this.state.hintTouchPosition.locationX - 20
                  : this.state.hintTouchPosition.locationX - 50,
              }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({isHintPieModalVisible: false})}>
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
                      <Text style={styles.hintTitle}>
                        {parseInt(this.state.hintPieValue)}
                      </Text>
                      <View
                        style={{
                          marginLeft: 20,
                          marginTop: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.hintSubtitle}>Kcal Burned</Text>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            borderRadius: 1.5,
                            backgroundColor: 'rgb(173,179,183)',
                            marginHorizontal: 10,
                          }}
                        />
                        <Text
                          style={
                            styles.hintSubtitle
                          }>{`${this.state.hintPieDate.substring(
                          8,
                          10,
                        )} ${this.getMonthName(
                          this.state.hintPieDate.substring(5, 7),
                        )}`}</Text>
                      </View>
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
  energyHint: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
    width: width - 105,
  },
});

TrackCaloriesChart.defaultProps = {};

export default TrackCaloriesChart;

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

class WalkRunChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDatesArray: [],
      isHintModalVisible: false,
      hintPositionX: 0,
      hintDate: '',
      hintHours: '',
      hintValue: 0,
      hintIndex: 0,
      hintItem: {},
      barHeights: {},
      averageValue: 0,
      barPositions: {},
      runningKm: 0,
      maxValue: 0,
      totalKm: 0,
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

  /**
    Get the array of dates if it's a week view:
    [ '2021-03-15', '2021-03-16', '2021-03-17', '2021-03-18', '2021-03-19', '2021-03-20', '2021-03-21' ]
    Or get the array of hours if it's a day view:
    [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ]
  */
  getAlldates = (dates) => {
    if (this.props.isDay) {
      this.dayHours = [];

      for (let i = 0; i < 24; i++) {
        this.dayHours.push(String(i).padStart(2, '0'));
      }

      console.log('getAlldates hours', this.dayHours);
    } else {
      this.allDates = [];
      this.allDates.push(dates[0]);

      /**
        Get the next 6 dates starting from initial date - dates[0]
      */
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

  /**
    Get data for the chosen week / day from the HealthKit / GoogleFit
  */
  getData = (dates) => {
    if (Platform.OS === 'ios') {
      const PERMS = AppleHealthKit.Constants.Permissions;
      // Permissions to read walking/running distance and workout data
      const options = {
        permissions: {
          read: [PERMS.DistanceWalkingRunning, PERMS.Workout],
          write: [],
        },
      };

      // Query to initialize HealthKit with the defined permissions
      AppleHealthKit.initHealthKit(options, (err, results) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }
        console.log('this.props.dates', dates, new Date().toISOString());

        // Current offset in the string format like "+1000" / "-1000"
        let date = new Date();
        let offset = date.getTimezoneOffset() / 60;
        if (offset < 0) {
          offset = '+' + Math.abs(offset).toString().padStart(2, '0') + '00';
        } else {
          offset = '-' + Math.abs(offset).toString().padStart(2, '0') + '00';
        }

        if (this.props.isDay) {
          // If the day view is active then get data for the selected day with an 1-hour aggregation
          AppleHealthKit.getHourlyDistanceWalkingRunning(
            // { date: dates + "T00:00:00.000Z", interval: 60 },
            {date: dates + `T00:00:00.000${offset}`, interval: 60},
            (err, results) => {
              if (err) {
                console.log('getHourlyDistanceWalkingRunning error', err);
                console.log('getHourlyDistanceWalkingRunning error', err);

                return;
              }
              console.log('getHourlyDistanceWalkingRunning', results);

              let totalKm = 0;
              let value = 0;
              let runningValue = 0;
              let array = [];
              let maxValue = 0;

              // sort HealthKit results to an ascending order (initially - descending)
              let reversedResults;
              if (results.length !== 0) {
                reversedResults = results.reverse();
              } else {
                reversedResults = results;
              }

              for (let i = 0; i < reversedResults.length; i++) {
                // Check if the date from HealthKit results is equal to selected date
                if (
                  reversedResults[i].startDate.substring(8, 10) ===
                  dates.substring(8, 10)
                ) {
                  // Static value, in some charts it could be 2
                  // The item object itself contains all the needed information to draw a bar on a chart
                  let countOfItems = 1;
                  let item = {};

                  item.value = parseFloat(
                    parseFloat(reversedResults[i].value / 1000).toFixed(1),
                  );
                  value += reversedResults[i].value / 1000;

                  totalKm += item.value;

                  item.countOfItems = countOfItems;
                  item.date = results[i].startDate.substring(0, 10);
                  item.hours = reversedResults[i].startDate.substring(11, 13);
                  item.position = this.dayHours.indexOf(item.hours);

                  array.push(item);
                }
              }

              // Get workout running samples
              AppleHealthKit.getSamples(
                {
                  // startDate: dates + "T00:00:00.000Z",
                  // endDate: dates + "23:59:00.000Z",
                  startDate: dates + `T00:00:00.000${offset}`,
                  endDate: dates + `T23:59:00.000${offset}`,
                  type: 'Workout',
                },
                (err, results2) => {
                  if (err) {
                    console.log('getSamples', err);

                    return;
                  }

                  if (results2.length !== 0) {
                    let isExists = false;
                    // Check if there is already existing walking/running data on a specific date. If yes - add
                    // a workout running value to it. Otherwise - running value is a total distance for that day
                    for (let i = 0; i < array.length; i++) {
                      for (let k = 0; k < results2.length; k++) {
                        if (
                          array[i].hours ===
                            results2[k].start.substring(11, 13) &&
                          results2[k].activityName === 'Running'
                        ) {
                          array[i].countOfItems = 2;
                          array[i].value = Math.abs(
                            parseFloat(
                              parseFloat(
                                parseFloat(array[i].value) -
                                  parseFloat(results2[k].distance),
                              ).toFixed(1),
                            ),
                          );

                          totalKm += array[i].value;

                          isExists = true;
                          if (array[i].hasOwnProperty('runningKm')) {
                            array[i].runningKm += results2[k].distance;
                            runningValue += results2[k].distance;
                          } else {
                            array[i].runningKm = results2[k].distance;
                            runningValue = results2[k].distance;
                          }
                        }
                      }
                    }
                  }

                  console.log('array', array);

                  // The final array that will contain the info about every bar, if there is no data for a some hour - then its value will be 0
                  let allDatesArray = [];
                  for (let i = 0; i < this.dayHours.length; i++) {
                    let isItemFound = false;
                    for (let k = 0; k < array.length; k++) {
                      if (array[k].hours === this.dayHours[i]) {
                        isItemFound = true;

                        if (array[k].value !== 0 && array[k].value > maxValue) {
                          maxValue = array[k].value;
                          if (array[k]?.runningKm) {
                            maxValue += array[k].runningKm;
                          }
                        }

                        allDatesArray.push({
                          ...array[k],
                          ...{background: 'rgb(255,255,255)'},
                        });
                        break;
                      }
                    }

                    // If there is no data for defined hour - then the bar value is 0
                    if (!isItemFound) {
                      allDatesArray.push({
                        background: 'transparent',
                        countOfItems: 0,
                        value: 0,
                      });
                    }
                  }

                  // Count of the days in the week with defined walking/running distance. Needed to count the average value
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
                    averageValue: parseFloat(value),
                    tipsValue:
                      this.props.unit === 'standard' ? value * 0.621371 : value,
                    tipsRunningkm:
                      runningValue !== 0
                        ? this.props.unit === 'standard'
                          ? runningValue
                          : runningValue / 0.621371
                        : 0,
                    hintValue:
                      this.props.unit === 'standard' ? value * 0.621371 : value,
                    runningKm:
                      runningValue !== 0
                        ? this.props.unit === 'standard'
                          ? runningValue
                          : runningValue / 0.621371
                        : 0,
                    totalKm,
                    isLoading: false,
                    maxValue,
                  });
                  console.log(
                    'allDatesArray',
                    allDatesArray,
                    dates,
                    runningValue,
                  );

                  console.log(
                    'getDailyDistanceWalkingRunningSamples results ',
                    results,
                  );

                  console.log('getSamples week', dates, results2, runningValue);
                },
              );

              // allDatesArray = [];
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
              //
              // this.setState({
              //   allDatesArray,
              //   averageValue: value,
              // });
              // console.log("allDatesArray", allDatesArray, array, this.dayHours);
            },
          );
        } else {
          // That's a week view, so options contains start date and end date, like '2021-03-08' (dates[0]) and '2021-03-14' (dates[1])
          let stepOptions = {
            // startDate: dates[0] + "T00:00:00.000Z", // required
            // endDate: dates[1] + "T23:59:00.000Z",
            startDate: dates[0] + `T00:00:00.000${offset}`,
            endDate: dates[1] + `T23:59:00.000${offset}`,
          };

          console.log('stepOptions', stepOptions);

          // If the week view is active then get data for the selected week with an 1-day aggregation
          AppleHealthKit.getDailyDistanceWalkingRunningSamples(
            stepOptions,
            (err, results) => {
              if (err) {
                console.log(
                  'getDailyDistanceWalkingRunningSamples error ',
                  err,
                );
                console.log('AppleHealthKit error', err);

                return;
              }

              let maxValue = 0;
              let value = 0;
              let array = [];
              for (let i = 0; i < results.length; i++) {
                // Static value, in some charts it could be 2
                // The item object itself contains all the needed information to draw a bar on a chart
                let countOfItems = 1;
                let item = {};
                item.value = results[i].value / 1000;
                value += results[i].value / 1000;

                if (maxValue < item.value) {
                  maxValue = item.value;
                }

                item.countOfItems = countOfItems;
                item.date = results[i].startDate.substring(0, 10);
                item.position = this.allDates.indexOf(item.date);

                array.push(item);
              }

              // Get workout running samples
              AppleHealthKit.getSamples(
                {
                  startDate: stepOptions.startDate,
                  endDate: stepOptions.endDate,
                  type: 'Workout',
                },
                (err, results2) => {
                  if (err) {
                    console.log('getSamples', err);

                    return;
                  }

                  // Check if there is already existing walking/running data on a specific date. If yes - add
                  // a workout running value to it. Otherwise - running value is a total distance for that day
                  if (results2.length !== 0) {
                    let isExists = false;
                    for (let i = 0; i < array.length; i++) {
                      for (let k = 0; k < results2.length; k++) {
                        if (
                          array[i].date ===
                            results2[k].start.substring(0, 10) &&
                          results2[k].activityName === 'Running'
                        ) {
                          array[i].countOfItems = 2;
                          array[i].value = Math.abs(
                            array[i].value - results2[k].distance,
                          );
                          isExists = true;
                          if (array[i].hasOwnProperty('runningKm')) {
                            array[i].runningKm += results2[k].distance;
                          } else {
                            array[i].runningKm = results2[k].distance;
                          }
                        }
                      }
                    }
                  }

                  console.log('array', array);

                  // The final array that will contain the info about every bar, if there is no data for a some date - then its value will be 0
                  let allDatesArray = [];
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

                    // If there is no data for defined hour - then the bar value is 0
                    if (!isItemFound) {
                      allDatesArray.push({
                        background: 'transparent',
                        countOfItems: 0,
                        value: 0,
                      });
                    }
                  }

                  // Count of the days in the week with defined walking/running distance. Needed to count the average value
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
                    averageValue: parseFloat(value / datesCount),
                    isLoading: false,
                  });
                  console.log('allDatesArray', allDatesArray, dates);

                  console.log(
                    'getDailyDistanceWalkingRunningSamples results ',
                    results,
                  );

                  console.log('getSamples week', stepOptions.date, results2);
                },
              );

              console.log('maxValue', maxValue);
              this.setState({maxValue: maxValue + 1});
            },
          );
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

      // GoogleFit Permissions to read walking/running distance
      const options = {
        scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_LOCATION_READ],
      };

      // Query to initialize GoogleFit with the defined permissions
      GoogleFit.authorize(options)
        .then((res) => {
          console.log('authorized >>>', res);

          if (res.success) {
            if (this.props.isDay && typeof dates === 'string') {
              console.log('dates', dates);
              let startDate = new Date(dates);
              // startDate.setDate(startDate.getDate() - 1);
              startDate.setHours(0, 0, 0, 0);
              // startDate.setHours(
              //   startDate.getHours() + startDate.getTimezoneOffset() / 60
              // );
              let endDate = new Date(dates);
              // endDate.setDate(endDate.getDate());
              endDate.setHours(23, 59, 59, 0);
              // endDate.setHours(
              //   endDate.getHours() + endDate.getTimezoneOffset() / 60
              // );

              console.log('startDate', startDate, startDate.valueOf());
              console.log('endDate', endDate, endDate.valueOf());

              // Get all activities samples
              GoogleFit.getActivitySamples({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                bucketUnit: 'HOUR',
                bucketInterval: 1,
              }).then(async (res) => {
                console.log('getActivitySamples', res);
                if (res !== false) {
                  console.log('getActivitySamples', res);

                  let maxValue = 0;
                  let value = 0;
                  let runningValue = 0;
                  let array = [];

                  let reverseArray = this.reverseArray(res);
                  console.log('getActivitySamples reversed', reverseArray);

                  let walkingArray = [];
                  let runningArray = [];
                  let distance = 0;

                  // Get walking activities only
                  for (let i = 0; i < reverseArray.length; i++) {
                    if (
                      reverseArray[i].activityName === 'walking' &&
                      typeof reverseArray[i].distance !== 'undefined'
                    ) {
                      walkingArray.push({
                        ...reverseArray[i],
                        ...{distance: reverseArray[i].distance / 1000},
                      });
                      value += reverseArray[i].distance / 1000;
                    }

                    // Get running activities only
                    if (
                      reverseArray[i].activityName === 'running' &&
                      typeof reverseArray[i].distance !== 'undefined'
                    ) {
                      runningArray.push({
                        ...reverseArray[i],
                        ...{distance: reverseArray[i].distance / 1000},
                      });
                      value += reverseArray[i].distance / 1000;
                      runningValue += reverseArray[i].distance / 1000;
                    }
                  }

                  console.log('initial walking array', walkingArray);
                  console.log('initial running array', runningArray);

                  // let obj = {};
                  // for (let i = 0; i < walkingArray.length; i++) {
                  //   let dateStart = new Date(walkingArray[i].start);
                  //   let prop = dateStart.toISOString().substring(0, 10);
                  //
                  //   console.log("prop", prop);
                  //
                  //   if (!obj.hasOwnProperty(prop)) {
                  //     obj[prop] = walkingArray[i];
                  //   } else {
                  //     obj[prop].distance += walkingArray[i].distance;
                  //   }
                  // }
                  //
                  // walkingArray = [];
                  // Object.entries(obj).forEach(([key, value]) => {
                  //   console.log(key, value);
                  //
                  //   walkingArray.push(value);
                  // });
                  //
                  // obj = {};
                  // for (let i = 0; i < runningArray.length; i++) {
                  //   let dateStart = new Date(runningArray[i].start);
                  //   let prop = dateStart.toISOString().substring(0, 10);
                  //
                  //   console.log("prop", prop);
                  //
                  //   if (!obj.hasOwnProperty(prop)) {
                  //     obj[prop] = runningArray[i];
                  //   } else {
                  //     obj[prop].distance += runningArray[i].distance;
                  //   }
                  // }
                  //
                  // runningArray = [];
                  // Object.entries(obj).forEach(([key, value]) => {
                  //   console.log(key, value);
                  //
                  //   runningArray.push(value);
                  // });

                  console.log('walkingArray', walkingArray);
                  console.log('runningArray', runningArray);

                  for (let i = 0; i < walkingArray.length; i++) {
                    let dateStart = new Date(walkingArray[i].start);
                    dateStart.setHours(
                      dateStart.getHours() - dateStart.getTimezoneOffset() / 60,
                    );
                    let dateEnd = new Date(walkingArray[i].end);

                    // Dynamic value, in this charts it could be 2 (walking and running separately)
                    // The item object itself contains all the needed information to draw a bar on a chart
                    let countOfItems = 1;
                    let item = {};
                    item.value = walkingArray[i].distance;

                    // value += walkingArray[i].distance;

                    item.countOfItems = countOfItems;
                    item.date = dateStart.toISOString().substring(0, 10);
                    // item.position = this.allDates.indexOf(item.date);

                    item.hours = dateStart.toISOString().substring(11, 13);
                    item.position = this.dayHours.indexOf(item.hours);
                    item.runningKm = 0;

                    array.push(item);
                  }

                  if (runningArray.length !== 0) {
                    let arr = [];
                    // for (let k = 0; k < runningArray.length; k++) {
                    //   let dateStart = new Date(runningArray[k].start);
                    //   let isExists = false;
                    //   for (let i = 0; i < array.length; i++) {
                    //     if (
                    //       array[i].hours ===
                    //       dateStart.toISOString().substring(11, 13)
                    //     ) {
                    //       array[i].countOfItems = 2;
                    //       // array[i].value = Math.abs(
                    //       //   parseFloat(
                    //       //     parseFloat(array[i].value) -
                    //       //       parseFloat(runningArray[k].distance)
                    //       //   ).toFixed(1)
                    //       // );
                    //       isExists = true;
                    //       if (array[i].hasOwnProperty('runningKm')) {
                    //         array[i].runningKm += runningArray[k].distance;
                    //       } else {
                    //         array[i].runningKm = runningArray[k].distance;
                    //       }
                    //     }
                    //   }
                    //
                    //   if (!isExists) {
                    //     arr.push({
                    //       hours: dateStart.toISOString().substring(11, 13),
                    //       value: 0,
                    //       runningKm: runningArray[k].distance,
                    //       countOfItems: 1,
                    //       date: dateStart.toISOString().substring(0, 10),
                    //       position: parseInt(
                    //         dateStart.toISOString().substring(11, 13),
                    //       ),
                    //     });
                    //   }
                    // }

                    if (array.length !== 0) {
                      let isExists = false;
                      for (let i = 0; i < array.length; i++) {
                        for (let k = 0; k < runningArray.length; k++) {
                          let dateStart = new Date(runningArray[k].start);
                          // dateStart = dateStart.toISOString().substring(0, 10);
                          if (
                            array[i].hours ===
                            dateStart.toISOString().substring(11, 13)
                          ) {
                            // Dynamic value, in this charts it could be 2 (walking and running separately)
                            // The item object itself contains all the needed information to draw a bar on a chart
                            // If there is already walking item exists then we need to add also the runnint item
                            array[i].countOfItems = 2;
                            array[i].value = Math.abs(array[i].value);
                            isExists = true;
                            if (array[i].hasOwnProperty('runningKm')) {
                              array[i].runningKm += runningArray[k].distance;
                            } else {
                              array[i].runningKm = runningArray[k].distance;
                            }
                          }
                        }

                        if (!isExists) {
                          array[i].runningKm = 0;
                        }
                      }

                      isExists = false;
                      // Check how many bars should be 0, 1 or 2
                      for (let k = 0; k < runningArray.length; k++) {
                        for (let i = 0; i < array.length; i++) {
                          let dateStart = new Date(runningArray[k].start);
                          // dateStart = dateStart.toISOString().substring(0, 10);
                          if (
                            array[i].hours ===
                            dateStart.toISOString().substring(11, 13)
                          ) {
                            array[i].countOfItems = 2;

                            isExists = true;
                          }
                        }

                        if (!isExists) {
                          let dateStart = new Date(runningArray[k].start);
                          dateStart.setHours(
                            dateStart.getHours() -
                              dateStart.getTimezoneOffset() / 60,
                          );

                          arr.push({
                            hours: dateStart.toISOString().substring(11, 13),
                            value: 0,
                            countOfItems: 1,
                            date: dateStart.toISOString().substring(0, 10),
                            position: parseInt(
                              dateStart.toISOString().substring(11, 13),
                            ),
                            runningKm: runningArray[k].distance,
                          });
                        }
                      }
                    } else {
                      // If walking array is empty then just push the running values
                      for (let k = 0; k < runningArray.length; k++) {
                        let dateStart = new Date(runningArray[k].start);
                        dateStart.setHours(
                          dateStart.getHours() -
                            dateStart.getTimezoneOffset() / 60,
                        );

                        arr.push({
                          hours: dateStart.toISOString().substring(11, 13),
                          value: 0,
                          countOfItems: 1,
                          date: dateStart.toISOString().substring(0, 10),
                          position: parseInt(
                            dateStart.toISOString().substring(11, 13),
                          ),
                          runningKm: runningArray[k].distance,
                        });
                      }
                    }

                    console.log('arr-', arr);

                    if (arr.length !== 0) {
                      array.push(...arr);
                    }

                    // let simplifiedArray = [];
                    // let avgValue = 0;
                    // for (let i = 1; i < array.length; i++) {
                    //   if (array[i - 1].hours === array[i].hours) {
                    //     avgValue += array[i - 1].value;
                    //   } else {
                    //     avgValue += array[i - 1].value;
                    //     simplifiedArray.push({
                    //       ...array[i - 1],
                    //       ...{value: avgValue},
                    //     });
                    //
                    //     avgValue = 0;
                    //   }
                    //
                    //   if (i === array.length - 1) {
                    //     avgValue += array[i].value;
                    //     if (array[i - 1].hours !== array[i].hours) {
                    //       simplifiedArray.push({
                    //         ...array[i],
                    //         ...{value: avgValue},
                    //       });
                    //     } else {
                    //       simplifiedArray.push({
                    //         ...array[i],
                    //         ...{value: avgValue},
                    //       });
                    //     }
                    //   }
                    // }
                    //
                    // array = simplifiedArray.reverse();

                    let totalValue = 0;
                    for (let i = 0; i < array.length; i++) {
                      if (maxValue < array[i].value + array[i].runningKm) {
                        maxValue = array[i].value + array[i].runningKm;
                        totalValue += array[i].value + array[i].runningKm;
                      }
                    }

                    console.log('array234', array);

                    // The final array that will contain the info about every bar, if there is no data for a some hour - then its value will be 0
                    let allDatesArray = [];
                    for (let i = 0; i < this.dayHours.length; i++) {
                      let isItemFound = false;
                      for (let k = 0; k < array.length; k++) {
                        if (array[k].hours === this.dayHours[i]) {
                          isItemFound = true;
                          allDatesArray.push({
                            ...array[k],
                            ...{background: 'rgb(255,255,255)'},
                          });
                          break;
                        }
                      }

                      // If there is no data for defined hour - then the bar value is 0
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
                      maxValue: maxValue + 1,
                      allDatesArray,
                      averageValue: parseFloat(totalValue),
                      tipsValue:
                        this.props.unit === 'standard'
                          ? value * 0.621371
                          : value,
                      tipsRunningkm:
                        runningValue !== 0
                          ? this.props.unit === 'standard'
                            ? runningValue
                            : runningValue / 0.621371
                          : 0,
                      hintValue:
                        this.props.unit === 'standard'
                          ? value * 0.621371
                          : value,
                      runningKm:
                        runningValue !== 0
                          ? this.props.unit === 'standard'
                            ? runningValue
                            : runningValue / 0.621371
                          : 0,
                      isLoading: false,
                    });
                    console.log(
                      'allDatesArray',
                      allDatesArray,
                      dates,
                      maxValue,
                    );

                    // console.log(
                    //   "getDailyDistanceWalkingRunningSamples results ",
                    //   results
                    // );
                  } else {
                    console.log('array7', array);

                    // let simplifiedArray = [];
                    // let avgValue = 0;
                    // for (let i = 1; i < array.length; i++) {
                    //   if (array[i - 1].hours === array[i].hours) {
                    //     avgValue += array[i - 1].value;
                    //   } else {
                    //     avgValue += array[i - 1].value;
                    //     simplifiedArray.push({
                    //       ...array[i - 1],
                    //       ...{value: avgValue},
                    //     });
                    //
                    //     avgValue = 0;
                    //   }
                    //
                    //   if (i === array.length - 1) {
                    //     avgValue += array[i].value;
                    //     if (array[i - 1].hours !== array[i].hours) {
                    //       simplifiedArray.push({
                    //         ...array[i],
                    //         ...{value: avgValue},
                    //       });
                    //     } else {
                    //       simplifiedArray.push({
                    //         ...array[i],
                    //         ...{value: avgValue},
                    //       });
                    //     }
                    //   }
                    // }
                    //
                    // array = simplifiedArray.reverse();

                    console.log('array78', array);

                    let maxValue = 0;
                    let totalValue = 0;
                    for (let i = 0; i < array.length; i++) {
                      if (maxValue < array[i].value) {
                        maxValue = array[i].value;
                        totalValue += array[i].value;
                      }
                    }

                    // The final array that will contain the info about every bar, if there is no data for a some hour - then its value will be 0
                    let allDatesArray = [];
                    for (let i = 0; i < this.dayHours.length; i++) {
                      let isItemFound = false;
                      for (let k = 0; k < array.length; k++) {
                        if (array[k].hours === this.dayHours[i]) {
                          isItemFound = true;
                          allDatesArray.push({
                            ...array[k],
                            ...{background: 'rgb(255,255,255)'},
                          });
                          break;
                        }
                      }

                      // If there is no data for defined hour - then the bar value is 0
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
                      maxValue: maxValue + 1,
                      allDatesArray,
                      averageValue: parseFloat(totalValue),
                      tipsValue:
                        this.props.unit === 'standard'
                          ? value * 0.621371
                          : value,
                      tipsRunningkm:
                        runningValue !== 0
                          ? this.props.unit === 'standard'
                            ? runningValue
                            : runningValue / 0.621371
                          : 0,
                      hintValue:
                        this.props.unit === 'standard'
                          ? value * 0.621371
                          : value,
                      runningKm:
                        runningValue !== 0
                          ? this.props.unit === 'standard'
                            ? runningValue
                            : runningValue / 0.621371
                          : 0,
                      isLoading: false,
                    });
                    console.log('allDatesArray', allDatesArray);

                    console.log('walkingArray', walkingArray);
                  }

                  /////////////////////
                  if (runningArray.length !== 0) {
                    console.log('array3456', array);
                    let allDatesArray = [];
                    for (let i = 0; i < this.dayHours.length; i++) {
                      let isItemFound = false;
                      for (let k = 0; k < array.length; k++) {
                        if (array[k].hours === this.dayHours[i]) {
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
                          runningKm: 0,
                        });
                      }
                    }

                    let datesCount = 0;
                    let averageValue = 0;
                    for (let i = 0; i < this.dayHours.length; i++) {
                      if (
                        allDatesArray[i].value !== 0 ||
                        allDatesArray[i].runningKm !== 0
                      ) {
                        datesCount += 1;
                        averageValue +=
                          allDatesArray[i].value + allDatesArray[i].runningKm;
                      }

                      if (this.allDates[i] === dates[1]) {
                        break;
                      }
                    }

                    if (datesCount === 0) {
                      datesCount = 1;
                    }

                    this.setState({
                      maxValue: maxValue + 1,
                      allDatesArray,
                      averageValue: parseFloat(averageValue),
                      isLoading: false,
                    });
                    console.log(
                      'allDatesArray',
                      allDatesArray,
                      datesCount,
                      averageValue,
                    );

                    // console.log(
                    //   "getDailyDistanceWalkingRunningSamples results ",
                    //   results
                    // );
                  } else {
                    console.log('array345', array);

                    let maxValue = 0;
                    let totalValue = 0;
                    for (let i = 0; i < array.length; i++) {
                      if (maxValue < array[i].value) {
                        maxValue = array[i].value;
                        totalValue += array[i].value;
                      }
                    }

                    let allDatesArray = [];
                    for (let i = 0; i < this.dayHours.length; i++) {
                      let isItemFound = false;
                      for (let k = 0; k < array.length; k++) {
                        if (array[k].hours === this.dayHours[i]) {
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
                          runningKm: 0,
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
                      maxValue: maxValue + 1,
                      allDatesArray,
                      averageValue: totalValue,
                      isLoading: false,
                    });
                    console.log('allDatesArray', allDatesArray);

                    console.log('walkingArray', walkingArray);
                  }
                }
              });
            } else {
              // That's a week view, so options contains start date and end date, like '2021-03-08' (dates[0]) and '2021-03-14' (dates[1])
              console.log('dates', dates);
              let startDate = new Date(dates[0]);
              // startDate.setDate(startDate.getDate() - 1);
              startDate.setHours(0, 0, 0, 0);
              // startDate.setHours(
              //   startDate.getHours() + startDate.getTimezoneOffset() / 60
              // );
              let endDate = new Date(dates[1]);
              // endDate.setDate(endDate.getDate());
              endDate.setHours(23, 59, 59, 0);
              // endDate.setHours(
              //   endDate.getHours() + endDate.getTimezoneOffset() / 60
              // );

              console.log('startDate', startDate, startDate.valueOf());
              console.log('endDate', endDate, endDate.valueOf());

              // Get all activities samples
              GoogleFit.getActivitySamples({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                bucketUnit: 'HOUR',
                bucketInterval: 1,
              }).then(async (res) => {
                console.log('getActivitySamples', res);
                if (res !== false) {
                  console.log('getActivitySamples', res);

                  let value = 0;
                  let array = [];

                  let reverseArray = this.reverseArray(res);
                  console.log('getActivitySamples reversed', reverseArray);

                  let walkingArray = [];
                  let runningArray = [];
                  let distance = 0;

                  for (let i = 0; i < reverseArray.length; i++) {
                    // Get walking activities only
                    if (
                      reverseArray[i].activityName === 'walking' &&
                      typeof reverseArray[i].distance !== 'undefined'
                    ) {
                      walkingArray.push({
                        ...reverseArray[i],
                        ...{distance: reverseArray[i].distance / 1000},
                      });
                      value += reverseArray[i].distance / 1000;
                    }

                    // Get running activities only
                    if (
                      reverseArray[i].activityName === 'running' &&
                      typeof reverseArray[i].distance !== 'undefined'
                    ) {
                      runningArray.push({
                        ...reverseArray[i],
                        ...{distance: reverseArray[i].distance / 1000},
                      });
                      value += reverseArray[i].distance / 1000;
                    }
                  }

                  console.log('initial walking array', walkingArray);
                  console.log('initial running array', runningArray);

                  let obj = {};
                  for (let i = 0; i < walkingArray.length; i++) {
                    let dateStart = new Date(walkingArray[i].start);
                    let prop = dateStart.toISOString().substring(0, 10);

                    console.log('prop', prop);

                    // Check if the date is already exists. If exists - then add value, otherwise - assign value
                    if (!obj.hasOwnProperty(prop)) {
                      obj[prop] = walkingArray[i];
                    } else {
                      obj[prop].distance += walkingArray[i].distance;
                    }
                  }

                  walkingArray = [];
                  Object.entries(obj).forEach(([key, value]) => {
                    console.log(key, value);

                    walkingArray.push(value);
                  });

                  obj = {};
                  for (let i = 0; i < runningArray.length; i++) {
                    let dateStart = new Date(runningArray[i].start);
                    let prop = dateStart.toISOString().substring(0, 10);

                    console.log('prop', prop);

                    // Check if the date is already exists. If exists - then add value, otherwise - assign value
                    if (!obj.hasOwnProperty(prop)) {
                      obj[prop] = runningArray[i];
                    } else {
                      obj[prop].distance += runningArray[i].distance;
                    }
                  }

                  runningArray = [];
                  Object.entries(obj).forEach(([key, value]) => {
                    console.log(key, value);

                    runningArray.push(value);
                  });

                  console.log('walkingArray', walkingArray);
                  console.log('runningArray', runningArray);

                  let maxValue = 0;
                  for (let i = 0; i < walkingArray.length; i++) {
                    let dateStart = new Date(walkingArray[i].start);
                    dateStart.setHours(
                      dateStart.getHours() - dateStart.getTimezoneOffset() / 60,
                    );
                    let dateEnd = new Date(walkingArray[i].end);

                    // Dynamic value, in this charts it could be 2 (walking and running separately)
                    // The item object itself contains all the needed information to draw a bar on a chart
                    // If there is already walking item exists then we need to add also the running item
                    let countOfItems = 1;
                    let item = {};
                    item.value = walkingArray[i].distance;
                    value += walkingArray[i].distance;

                    item.countOfItems = countOfItems;
                    item.date = dateStart.toISOString().substring(0, 10);
                    item.position = this.allDates.indexOf(item.date);
                    item.runningKm = 0;

                    array.push(item);
                  }

                  if (runningArray.length !== 0) {
                    if (array.length !== 0) {
                      let isExists = false;
                      for (let i = 0; i < array.length; i++) {
                        for (let k = 0; k < runningArray.length; k++) {
                          let dateStart = new Date(runningArray[k].start);
                          dateStart = dateStart.toISOString().substring(0, 10);
                          if (array[i].date === dateStart) {
                            array[i].countOfItems = 2;
                            array[i].value = Math.abs(array[i].value);
                            isExists = true;
                            if (array[i].hasOwnProperty('runningKm')) {
                              array[i].runningKm += runningArray[k].distance;
                            } else {
                              array[i].runningKm = runningArray[k].distance;
                            }
                          }
                        }

                        if (!isExists) {
                          array[i].runningKm = 0;
                        }
                      }

                      isExists = false;
                      for (let k = 0; k < runningArray.length; k++) {
                        for (let i = 0; i < array.length; i++) {
                          let dateStart = new Date(runningArray[k].start);
                          dateStart = dateStart.toISOString().substring(0, 10);
                          if (array[i].date === dateStart) {
                            array[i].countOfItems = 2;

                            isExists = true;
                          }
                        }

                        if (!isExists) {
                          let dateStart = new Date(runningArray[k].start);
                          dateStart.setHours(
                            dateStart.getHours() -
                              dateStart.getTimezoneOffset() / 60,
                          );

                          array.push({
                            value: 0,
                            countOfItems: 1,
                            date: dateStart.toISOString().substring(0, 10),
                            position: this.allDates.indexOf(
                              runningArray[k].date,
                            ),
                            runningKm: runningArray[k].distance,
                          });
                        }
                      }
                    } else {
                      for (let k = 0; k < runningArray.length; k++) {
                        // let dateStart = new Date(runningArray[k].start);
                        // dateStart = dateStart.toISOString().substring(0, 10);
                        // if (array[i].date === dateStart) {
                        //   array[i].countOfItems = 2;
                        //   array[i].value = Math.abs(
                        //     array[i].value + runningArray[k].distance,
                        //   );
                        //   isExists = true;
                        //   if (array[i].hasOwnProperty('runningKm')) {
                        //     array[i].runningKm += runningArray[k].distance;
                        //   } else {
                        //     array[i].runningKm = runningArray[k].distance;
                        //   }
                        // }

                        let dateStart = new Date(runningArray[k].start);
                        dateStart.setHours(
                          dateStart.getHours() -
                            dateStart.getTimezoneOffset() / 60,
                        );

                        array.push({
                          value: 0,
                          countOfItems: 1,
                          date: dateStart.toISOString().substring(0, 10),
                          position: this.allDates.indexOf(
                            dateStart.toISOString().substring(0, 10),
                          ),
                          runningKm: runningArray[k].distance,
                        });
                      }
                    }

                    for (let i = 0; i < array.length; i++) {
                      if (maxValue < array[i].value + array[i].runningKm) {
                        maxValue = array[i].value + array[i].runningKm;
                      }

                      // if (
                      //   array[i].value === 0 &&
                      //   array[i]?.runningKm &&
                      //   maxValue < array[i].runningKm
                      // ) {
                      //   maxValue = array[i].runningKm;
                      // }
                    }

                    console.log('array123', array, maxValue);

                    let allDatesArray = [];
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
                          runningKm: 0,
                        });
                      }
                    }

                    let datesCount = 0;
                    let averageValue = 0;
                    for (let i = 0; i < this.allDates.length; i++) {
                      if (
                        allDatesArray[i].value !== 0 ||
                        allDatesArray[i].runningKm !== 0
                      ) {
                        datesCount += 1;
                        averageValue +=
                          allDatesArray[i].value + allDatesArray[i].runningKm;
                      }

                      if (this.allDates[i] === dates[1]) {
                        break;
                      }
                    }

                    if (datesCount === 0) {
                      datesCount = 1;
                    }

                    this.setState({
                      maxValue: maxValue + 1,
                      allDatesArray,
                      averageValue: parseFloat(averageValue / datesCount),
                      isLoading: false,
                    });
                    console.log(
                      'allDatesArray',
                      allDatesArray,
                      datesCount,
                      averageValue,
                    );

                    // console.log(
                    //   "getDailyDistanceWalkingRunningSamples results ",
                    //   results
                    // );
                  } else {
                    console.log('array', array);

                    let maxValue = 0;
                    for (let i = 0; i < array.length; i++) {
                      if (maxValue < array[i].value) {
                        maxValue = array[i].value;
                      }
                    }

                    let allDatesArray = [];
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
                      maxValue: maxValue + 1,
                      allDatesArray,
                      averageValue: parseInt(value / datesCount),
                      isLoading: false,
                    });
                    console.log('allDatesArray', allDatesArray);

                    console.log('walkingArray', walkingArray);
                  }
                }
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

  componentWillReceiveProps(nextProps) {
    console.log('FoodRatingsGraphic foodRatingData', nextProps.dates);

    // Clear all data when switching to another date
    if (
      nextProps.dates !== this.props.dates ||
      nextProps.isDay !== this.props.isDay
    ) {
      setTimeout(() => {
        this.setState({
          allDatesArray: [],
          isHintModalVisible: false,
          hintPositionX: 0,
          hintDate: '',
          hintHours: '',
          hintValue: 0,
          hintIndex: 0,
          hintItem: {},
          barHeights: {},
          averageValue: 0,
          barPositions: {},
          runningKm: 0,
          maxValue: 0,
          totalKm: 0,
          isLoading: true,
        });
        this.getAlldates(nextProps.dates);
        this.getData(nextProps.dates);
      }, 50);
    }
  }

  // Get visual bar by adding styles for a week view
  getColoredSections = (item) => {
    console.log('getColoredSections', item, this.state.maxValue);
    const mod = this.props.unit === 'standard' ? 0.621371 : 1;
    if (item.countOfItems === 1) {
      if (typeof item.runningKm !== 'undefined' && item.runningKm !== 0) {
        return [
          {
            height: (item.runningKm / this.state.maxValue) * 190 * mod - 3 / 4,
            backgroundColor: 'rgb(0,187,116)',
            borderRadius: 9,
            width: 18,
          },
        ];
      } else {
        return [
          {
            height: (item.value / this.state.maxValue) * 190 * mod - 3 / 4,
            backgroundColor: 'rgb(0,168,235)',
            borderRadius: 9,
            width: 18,
          },
        ];
      }
    } else if (item.countOfItems === 2) {
      return [
        {
          height: (item.runningKm / this.state.maxValue) * 190 * mod - 3 / 4,
          backgroundColor: 'rgb(0,187,116)',
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (item.value / this.state.maxValue) * 190 * mod - 3 / 4,
          backgroundColor: 'rgb(0,168,235)',
          borderRadius: 2,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
          marginTop: 2,
          width: 18,
        },
      ];
    } else return [];
  };

  // Get visual bar by adding styles for a day view
  getColoredSectionsDay = (item) => {
    console.log('getColoredSectionsDay', item, this.state.maxValue);
    const mod = this.props.unit === 'standard' ? 0.621371 : 1;
    const maxValue = this.state.maxValue === 0 ? 1 : this.state.maxValue;
    if (item.countOfItems === 1) {
      if (typeof item.runningKm !== 'undefined' && item.runningKm !== 0) {
        return [
          {
            height: (item.runningKm / maxValue) * 190 * mod - 3 / 4,
            backgroundColor: 'rgb(0,187,116)',
            borderRadius: 3.5,
            width: 7,
          },
        ];
      } else {
        return [
          {
            height: (item.value / maxValue) * 190 * mod - 3 / 4,
            backgroundColor: 'rgb(0,168,235)',
            borderRadius: 3.5,
            width: 7,
          },
        ];
      }
    } else if (item.countOfItems === 2) {
      return [
        {
          height: (item.runningKm / maxValue) * 190 * mod - 3 / 4,
          backgroundColor: 'rgb(0,187,116)',
          borderRadius: 0,
          borderTopLeftRadius: 3.5,
          borderTopRightRadius: 3.5,
          width: 7,
        },
        {
          height: (item.value / maxValue) * 190 * mod - 3 / 4,
          backgroundColor: 'rgb(0,168,235)',
          borderRadius: 0,
          borderBottomLeftRadius: 3.5,
          borderBottomRightRadius: 3.5,
          marginTop: 2,
          width: 7,
        },
      ];
    } else return [];

    // if (item.countOfItems === 1) {
    //   return [
    //     {
    //       height: (item.value / 12) * 190 - 3 / 4,
    //       backgroundColor: "rgb(0,168,235)",
    //       borderRadius: 3.5,
    //       width: 7,
    //     },
    //   ];
    // } else return [];
  };

  // Make a hint visible on a bar press
  onBarPress = (index, value, date, item) => {
    if (item.countOfItems !== 0) {
      this.props.onHint();
      console.log('onBarPress', item, this.state.barPositions);

      let hintValue = parseFloat(item.value);
      if (typeof item.runningKm !== 'undefined') {
        hintValue += item.runningKm;
      }

      console.log('onBarPress', item.runningKm + item.value, hintValue);

      this.setState(
        {
          hintPositionX: this.props.isDay
            ? index * 7
            : Platform.OS === 'android'
            ? index * 32 * (width / 360)
            : index * (26 + 8),
          // hintPositionX: this.state.barPositions[index],
          hintHours: typeof item.hours !== 'undefined' ? item.hours : '',
          hintDate: date,
          hintValue:
            this.props.unit === 'standard' ? hintValue * 0.621371 : hintValue,
          isHintModalVisible: true,
          hintIndex: index,
          runningKm:
            typeof item.runningKm !== 'undefined'
              ? this.props.unit === 'standard'
                ? item.runningKm * 0.621371
                : item.runningKm
              : 0,
        },
        () => {
          console.log(
            'onBarPress2',
            this.state.hintValue,
            this.state.runningKm,
          );
        },
      );
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

  // Used to dinamically find bar's horizontal position and height
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

  // Used to dinamically find intermediate values between 0 and maxValue on Y-axis
  getYaxis = (value) => {
    let array = [0];
    const divider = parseFloat(value / 4); // 4000 / 4 = 1000

    array.push(parseFloat(divider).toFixed(1));
    array.push(parseFloat(divider * 2).toFixed(1));
    array.push(parseFloat(divider * 3).toFixed(1));
    array.push(parseFloat(divider * 4).toFixed(1));

    return array;
  };

  render() {
    let bars;
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

    let yAxis = [];
    if (this.state.maxValue !== 0) {
      yAxis = this.getYaxis(this.state.maxValue);
      console.log('yAxis', yAxis);
    } else {
      yAxis = ['0', '3', '6', '9', '12'];
    }

    let hintTop = isIphoneX() ? -463 : -468;

    if (Platform.OS === 'ios' && !isIphoneX()) {
      hintTop += 6;
    }

    if (
      this.state.runningKm !== 0 &&
      this.state.hintValue !== this.state.runningKm
    ) {
      hintTop -= 95;
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({isHintModalVisible: false})}>
        <View style={{marginTop: 32}}>
          <View style={{width: width - 40, alignSelf: 'center'}}>
            <Text style={styles.title}>
              {`${
                this.props.unit === 'standard'
                  ? parseFloat(
                      parseFloat(this.state.averageValue * 0.621371).toFixed(1),
                    )
                  : parseFloat(parseFloat(this.state.averageValue).toFixed(1))
              } ${this.props.unit === 'standard' ? 'mi' : 'km'}`}
            </Text>
            {this.props.isDay ? (
              <View
                style={{
                  marginTop: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.subtitle}>
                  {this.props.unit === 'standard' ? 'mi' : 'km'}
                </Text>
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
                <Text style={styles.subtitle}>{`Average ${
                  this.props.unit === 'standard' ? 'miles' : 'kilometers'
                } per day`}</Text>
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
              <Text style={[styles.axisText, {marginTop: 0}]}>{yAxis[4]}</Text>
              <Text style={[styles.axisText, {marginTop: 33}]}>{yAxis[3]}</Text>
              <Text style={[styles.axisText, {marginTop: 33}]}>{yAxis[2]}</Text>
              <Text style={[styles.axisText, {marginTop: 31}]}>{yAxis[1]}</Text>
              <Text style={[styles.axisText, {marginTop: 34}]}>{yAxis[0]}</Text>
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

          {this.props.isDay &&
            this.state.averageValue !== 0 &&
            this.state.isHintModalVisible && (
              <View>
                {this.state.hintValue !== this.state.runningKm && (
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
                      source={require('../resources/icon/walk.png')}
                      style={{marginRight: 15, marginLeft: 20}}
                    />
                    <View>
                      <Text style={styles.additionalCardTitle}>
                        Walk Distance
                      </Text>
                      <Text style={styles.additionalCardText}>
                        {parseFloat(
                          parseFloat(
                            this.state.hintValue - this.state.runningKm,
                          ).toFixed(1),
                        )}
                        <Text
                          style={[styles.additionalCardText, {fontSize: 14}]}>
                          {this.props.unit === 'standard' ? ' mi' : ' km'}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}

                {this.state.runningKm !== 0 && (
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
                          this.state.hintValue - this.state.runningKm,
                        ) === 0
                          ? 24
                          : 16,
                    }}>
                    <Image
                      source={require('../resources/icon/run.png')}
                      style={{marginRight: 15, marginLeft: 20}}
                    />
                    <View>
                      <Text style={styles.additionalCardTitle}>
                        Run Distance
                      </Text>
                      <Text style={styles.additionalCardText}>
                        {parseFloat(
                          parseFloat(this.state.runningKm).toFixed(1),
                        )}
                        <Text
                          style={[styles.additionalCardText, {fontSize: 14}]}>
                          {this.props.unit === 'standard' ? ' mi' : ' km'}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

          {!this.props.isDay &&
            this.state.averageValue !== 0 &&
            this.state.isHintModalVisible && (
              <View>
                {this.state.hintValue !== this.state.runningKm && (
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
                      source={require('../resources/icon/walk.png')}
                      style={{marginRight: 15, marginLeft: 20}}
                    />
                    <View>
                      <Text style={styles.additionalCardTitle}>
                        Walk Distance
                      </Text>
                      <Text style={styles.additionalCardText}>
                        {parseFloat(
                          parseFloat(
                            this.state.hintValue - this.state.runningKm,
                          ).toFixed(1),
                        )}
                        <Text
                          style={[styles.additionalCardText, {fontSize: 14}]}>
                          {this.props.unit === 'standard' ? ' mi' : ' km'}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}

                {this.state.runningKm !== 0 && (
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
                          this.state.hintValue - this.state.runningKm,
                        ) === 0
                          ? 24
                          : 16,
                    }}>
                    <Image
                      source={require('../resources/icon/run.png')}
                      style={{marginRight: 15, marginLeft: 20}}
                    />
                    <View>
                      <Text style={styles.additionalCardTitle}>
                        Run Distance
                      </Text>
                      <Text style={styles.additionalCardText}>
                        {parseFloat(
                          parseFloat(this.state.runningKm).toFixed(1),
                        )}
                        <Text
                          style={[styles.additionalCardText, {fontSize: 14}]}>
                          {this.props.unit === 'standard' ? ' mi' : ' km'}
                        </Text>
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

          {!this.state.isHintModalVisible && (
            <View
              style={{
                width: width - 40,
                alignSelf: 'center',
                flexDirection: 'row',
                marginTop: 25,
                marginBottom: 40,
              }}>
              <Image
                source={require('../resources/icon/runningHint.png')}
                style={{marginRight: 20}}
              />
              <Text style={styles.runningHint}>
                {this.props.isDay
                  ? `You have covered a distance of ${
                      this.props.unit === 'standard'
                        ? parseFloat(
                            parseFloat(
                              this.state.averageValue * 0.621371,
                            ).toFixed(1),
                          )
                        : parseFloat(
                            parseFloat(this.state.averageValue).toFixed(1),
                          )
                    } ${
                      this.props.unit === 'standard' ? 'miles' : 'kilometers'
                    } today! \n\nYour combined Walk + Run activity is the best indication of how active you are. Compare how fluctuations in your activity levels can correlate with your health status and needs. Optimal mental wellbeing and physical health rely on you moving regularly!
`
                  : `Activity has been identified as one of your most important factors for your health. Aim to be covering a moderate distance each week for a healthy body and mind. \n\nYour combined Walk + Run activity is the best indication of how active you are. Compare how fluctuations in your activity levels can correlate with your health status and needs. Optimal mental wellbeing and physical health rely on you moving regularly!`}
              </Text>
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
                        width: this.props.isDay ? 180 : 160,
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
                        width: this.props.isDay ? 180 : 160,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                      }}>
                      <Text style={styles.hintTitle}>
                        {`${parseFloat(
                          parseFloat(this.state.hintValue).toFixed(1),
                        )} ${this.props.unit === 'standard' ? 'mi' : 'km'}`}
                      </Text>
                      <View
                        style={{
                          marginLeft: 20,
                          marginTop: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.hintSubtitle}>
                          {this.props.unit === 'standard' ? 'mi' : 'km'}
                        </Text>
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
                        )} ${
                          this.props.isDay ? this.state.hintHours + ':00' : ''
                        }`}</Text>
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
                      width: this.props.isDay ? 180 : 160,
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
                      width: this.props.isDay ? 180 : 160,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Text style={styles.hintTitle}>
                      {`${parseFloat(
                        parseFloat(this.state.hintValue).toFixed(2),
                      )} ${this.props.unit === 'standard' ? 'mi' : 'km'}`}
                    </Text>
                    <View
                      style={{
                        marginLeft: 20,
                        marginTop: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.hintSubtitle}>
                        {this.props.unit === 'standard' ? 'mi' : 'km'}
                      </Text>
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
                      )} ${
                        this.props.isDay ? this.state.hintHours + ':00' : ''
                      }`}</Text>
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
  runningHint: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
    width: width - 105,
  },
});

WalkRunChart.defaultProps = {};

export default WalkRunChart;

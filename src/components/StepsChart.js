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

class StepsChart extends Component {
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
      maxValue: 0,
      totalSteps: 0,
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
    let allDatesArray = [];
    if (Platform.OS === 'ios') {
      const PERMS = AppleHealthKit.Constants.Permissions;

      // Permissions to read steps count
      const options = {
        permissions: {
          read: ['Steps', 'StepCount'],
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
          AppleHealthKit.getHourlyStepCount(
            {date: dates + `T00:00:00.000${offset}`, interval: 60},
            (err, results) => {
              if (err) {
                console.log('getHourlyStepCount error', err);
                console.log('AppleHealthKit error', err);

                return;
              }
              console.log('getHourlyStepCount', results);

              let totalSteps = 0;
              let maxValue = 0;
              let value = 0;
              let array = [];

              // sort HealthKit results to an ascending order (initially - descending)
              let reversedResults;
              if (results.length !== 0) {
                reversedResults = results.reverse();
              } else {
                reversedResults = results;
              }

              console.log('reversed results 1', reversedResults);

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
                  item.value = reversedResults[i].value;
                  value += reversedResults[i].value;

                  if (maxValue < item.value) {
                    maxValue = item.value;
                  }

                  totalSteps += item.value;

                  item.countOfItems = countOfItems;
                  item.date = results[i].startDate.substring(0, 10);
                  item.hours = reversedResults[i].startDate.substring(11, 13);
                  item.position = this.dayHours.indexOf(item.hours);

                  array.push(item);
                }
              }

              // The final array that will contain the info about every bar, if there is no data for a some hour - then its value will be 0
              let allDatesArray = [];
              for (let i = 0; i < this.dayHours.length; i++) {
                // Assigning the data with the defined hour
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

              this.setState({
                allDatesArray,
                averageValue: value,
                maxValue,
                totalSteps,
                isLoading: false,
              });
              console.log('allDatesArray', allDatesArray, array, this.dayHours);
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
          AppleHealthKit.getDailyStepCountSamples(
            stepOptions,
            (err, results) => {
              if (err) {
                console.log('getStepCount error ', err);
                console.log('AppleHealthKit error', err);

                return;
              }

              let totalSteps = 0;
              let maxValue = 0;
              let value = 0;
              let array = [];
              for (let i = 0; i < results.length; i++) {
                // Static value, in some charts it could be 2
                // The item object itself contains all the needed information to draw a bar on a chart
                let countOfItems = 1;
                let item = {};
                item.value = results[i].value;
                value += results[i].value;

                if (maxValue < item.value) {
                  maxValue = item.value;
                }

                totalSteps += item.value;

                item.countOfItems = countOfItems;
                item.date = results[i].startDate.substring(0, 10);
                item.position = this.allDates.indexOf(item.date);

                array.push(item);
              }

              console.log('array', array);

              // The final array that will contain the info about every bar, if there is no data for a some day of the week - then its value will be 0
              let allDatesArray = [];
              for (let i = 0; i < this.allDates.length; i++) {
                // Assigning the data with the defined day of the week
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

                // If there is no data for defined day of the week - then the bar value is 0
                if (!isItemFound) {
                  allDatesArray.push({
                    background: 'transparent',
                    countOfItems: 0,
                    value: 0,
                  });
                }
              }

              // Count of the days in the week with defined steps count. Needed to count the average value
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
                maxValue,
                totalSteps,
                isLoading: false,
              });
              console.log('allDatesArray', allDatesArray);

              // this.setState({
              //   // steps: results.length === 0 ? 0 : results[0].value,
              // });
              console.log('getStepCount results ', results);
            },
          );
        }
      });
    } else {
      // GoogleFit Permissions to read steps count
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_LOCATION_READ,
          Scopes.FITNESS_BODY_READ,
        ],
      };

      // Query to initialize GoogleFit with the defined permissions
      GoogleFit.authorize(options)
        .then((res) => {
          console.log('authorized >>>', res);

          if (res.success) {
            // console.log(
            //   "GoogleFit.authorize dates",
            //   startDate.toISOString(),
            //   endDate.toISOString()
            // );
            //
            // console.log(
            //   "authorized >>>",
            //   startDate,
            //   endDate,
            //   startDate.toISOString(),
            //   endDate.toISOString()
            // );

            // Current offset in the string format like "+1000" / "-1000"
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

              // Options for steps query, bucketUnit, bucketInterval - for the aggregation
              const dailyStepCountSamplesOptions = {
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

              // If the day view is active then get data for the selected day with an 1-hour aggregation
              GoogleFit.getDailyStepCountSamples(dailyStepCountSamplesOptions)
                .then(async (res) => {
                  console.log('getDailyStepCountSamples', res);
                  for (let i = 0; i < res.length; i++) {
                    // There could be many sources such a 'com.google.android.gms:estimated_steps', 'com.google.android.gms:merge_step_deltas', 'com.xiaomi.hm.health'
                    // GoogleFit is using 'com.google.android.gms:estimated_steps' source
                    if (
                      res[i].source ===
                        'com.google.android.gms:estimated_steps' &&
                      res[i].steps.length !== 0
                    ) {
                      // { source: 'com.google.android.gms:merge_step_deltas',
                      //   steps: [ { date: '2019-09-30', value: 844 } ] },

                      // [
                      //   {
                      //     value: 976,
                      //     startDate: "2020-08-12T20:00:00.000+1000",
                      //     endDate: "2020-08-12T21:00:00.000+1000",
                      //   },
                      //   {
                      //     value: 435,
                      //     startDate: "2020-08-12T09:00:00.000+1000",
                      //     endDate: "2020-08-12T10:00:00.000+1000",
                      //   },
                      // ];

                      // Keep the results from 1 source only
                      let mergedResults = [];
                      for (let k = 0; k < res[i].steps.length; k++) {
                        mergedResults.push({
                          ...res[i].steps[k],
                          ...{
                            startDate: new Date(
                              res[i].rawSteps[k].startDate,
                            ).toISOString(),
                            // isoDate: new Date(
                            //   res[i].rawSteps[k].startDate,
                            // ).toISOString(),
                          },
                        });
                      }

                      let results = mergedResults;
                      // let results = {
                      //   ...res[i].steps,
                      //   ...{
                      //     startDate: new Date(res[i].rawSteps.startDate * 1000),
                      //   },
                      // };

                      console.log('day results', results);

                      let totalSteps = 0;
                      let maxValue = 0;
                      let value = 0;
                      let array = [];

                      // sort GoogleFit results to an ascending order (initially - descending)
                      let reversedResults;
                      if (results.length !== 0) {
                        reversedResults = results.reverse();
                      } else {
                        reversedResults = results;
                      }

                      for (let i = 0; i < reversedResults.length; i++) {
                        // Check if the date from GoogleFit results is equal to selected date
                        if (
                          reversedResults[i].startDate.substring(8, 10) ===
                          dates.substring(8, 10)
                        ) {
                          // Static value, in some charts it could be 2
                          // The item object itself contains all the needed information to draw a bar on a chart
                          let countOfItems = 1;
                          let item = {};
                          item.value = reversedResults[i].value;
                          value += reversedResults[i].value;

                          if (maxValue < item.value) {
                            maxValue = item.value;
                          }

                          totalSteps += item.value;

                          item.countOfItems = countOfItems;
                          item.date = results[i].startDate.substring(0, 10);
                          const tzoffset =
                            new Date().getTimezoneOffset() * 60000; //offset in milliseconds
                          const stDate = new Date(
                            reversedResults[i].startDate.slice(0, -1),
                          );
                          const localISOTime = new Date(
                            stDate.getTime() - tzoffset,
                          )
                            .toISOString()
                            .slice(0, -1);

                          // item.hours = reversedResults[i].startDate.substring(
                          //   11,
                          //   13
                          // );
                          console.log('localISOTime', localISOTime);
                          item.hours = localISOTime.substring(11, 13);
                          item.position = this.dayHours.indexOf(item.hours);

                          array.push(item);
                        }
                      }

                      // The final array that will contain the info about every bar, if there is no data for a some hour - then its value will be 0
                      let allDatesArray = [];
                      for (let i = 0; i < this.dayHours.length; i++) {
                        let isItemFound = false;
                        // Assigning the data with the defined hour
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

                      this.setState({
                        allDatesArray,
                        averageValue: value,
                        maxValue,
                        totalSteps,
                        isLoading: false,
                      });
                      console.log(
                        'allDatesArray',
                        allDatesArray,
                        array,
                        this.dayHours,
                      );

                      // for (let k = 0; k < results.length; k++) {
                      //   results[k].startDate =
                      //     results[k].date + `T00:00:00.000${offset}`;
                      //   let date = new Date(results[k].date);
                      //   date.setDate(date.getDate() + 1);
                      //   results[k].endDate =
                      //     date.toISOString().slice(0, 10) +
                      //     `T00:00:00.000${offset}`;
                      // }

                      console.log('getDailyStepCountSamples array', results);
                    }
                  }
                })
                .catch((err) => {
                  console.warn(err);
                });
            } else {
              // That's a week view, so options contains start date and end date, like '2021-03-08' (dates[0]) and '2021-03-14' (dates[1])
              let startDate = new Date(dates[0]);
              // startDate.setMonth(startDate.getMonth() - 1);
              // const offset = startDate.getTimezoneOffset() / 60;
              startDate.setHours(0, 0, 0, 0);
              // startDate.setHours(startDate.getHours() - offset);
              let endDate = new Date(dates[1]);
              // endDate.setDate(endDate.getDate());
              endDate.setHours(23, 59, 59, 0);
              // endDate.setHours(endDate.getHours() - offset);

              // Options for steps query, bucketUnit, bucketInterval - for the aggregation
              const dailyStepCountSamplesOptions = {
                startDate: startDate.toISOString(), // required ISO8601Timestamp
                endDate: endDate.toISOString(), // required ISO8601Timestamp
                bucketUnit: 'DAY',
                bucketInterval: 1,
              };

              console.log(
                'dailyStepCountSamplesOptions',
                dailyStepCountSamplesOptions,
              );

              //   [ { value: 1411,
              // startDate: '2020-08-12T00:00:00.000+1000',
              // endDate: '2020-08-13T00:00:00.000+1000' } ]

              // If the week view is active then get data for the selected day with an 1-day aggregation
              GoogleFit.getDailyStepCountSamples(dailyStepCountSamplesOptions)
                .then(async (res) => {
                  console.log('getDailyStepCountSamples', res);
                  for (let i = 0; i < res.length; i++) {
                    // There could be many sources such a 'com.google.android.gms:estimated_steps', 'com.google.android.gms:merge_step_deltas', 'com.xiaomi.hm.health'
                    // GoogleFit is using 'com.google.android.gms:estimated_steps' source
                    if (
                      res[i].source ===
                        'com.google.android.gms:estimated_steps' &&
                      res[i].steps.length !== 0
                    ) {
                      // { source: 'com.google.android.gms:merge_step_deltas',
                      //   steps: [ { date: '2019-09-30', value: 844 } ] },

                      // sort GoogleFit results to an ascending order (initially - descending)
                      let results = this.reverseArray(res[i].steps);

                      // Check if the date from GoogleFit results is equal to selected date
                      for (let k = 0; k < results.length; k++) {
                        results[k].startDate =
                          results[k].date + `T00:00:00.000${offset}`;
                        let date = new Date(results[k].date);
                        date.setDate(date.getDate() + 1);
                        results[k].endDate =
                          date.toISOString().slice(0, 10) +
                          `T00:00:00.000${offset}`;
                      }

                      console.log('getDailyStepCountSamples array', results);

                      let totalSteps = 0;
                      let maxValue = 0;
                      let value = 0;
                      let array = [];
                      for (let i = 0; i < results.length; i++) {
                        // Static value, in some charts it could be 2
                        // The item object itself contains all the needed information to draw a bar on a chart
                        let countOfItems = 1;
                        let item = {};
                        item.value = results[i].value;
                        value += results[i].value;

                        if (maxValue < item.value) {
                          maxValue = item.value;
                        }

                        totalSteps += item.value;

                        item.countOfItems = countOfItems;
                        item.date = results[i].startDate.substring(0, 10);
                        item.position = this.allDates.indexOf(item.date);

                        array.push(item);
                      }

                      console.log('array', array);

                      // The final array that will contain the info about every bar, if there is no data for a some date - then its value will be 0
                      let allDatesArray = [];
                      for (let i = 0; i < this.allDates.length; i++) {
                        let isItemFound = false;
                        // Assigning the data with the defined week day
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

                        // If there is no data for defined week day - then the bar value is 0
                        if (!isItemFound) {
                          allDatesArray.push({
                            background: 'transparent',
                            countOfItems: 0,
                            value: 0,
                            totalSteps,
                          });
                        }
                      }

                      // Count of the days in the week with defined steps count. Needed to count the average value
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
                        maxValue,
                        totalSteps,
                        isLoading: false,
                      });
                      console.log('allDatesArray', allDatesArray);
                      console.log('getStepCount results ', results);
                    }
                  }
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

  reverseArray = (array) => {
    return array.reverse();
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('FoodRatingsGraphic foodRatingData', nextProps.data);

    // Clear all data when switching to another date
    if (nextProps.dates !== this.props.dates)
      this.setState(
        {
          isHintModalVisible: false,
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
          maxValue: 0,
          totalSteps: 0,
          isLoading: true,
        },
        () => {
          this.getAlldates(nextProps.dates);
          this.getData(nextProps.dates);
        },
      );

    // if (this.props.isDay) {
    //   if (nextProps.data.length !== 0) {
    //     let value = 0;
    //     let array = [];
    //     for (let i = 0; i < nextProps.data.length; i++) {
    //       let countOfItems = 1;
    //       let item = {};
    //       item.value = nextProps.data[i].value;
    //       value += nextProps.data[i].value;
    //
    //       item.countOfItems = countOfItems;
    //       item.date = nextProps.data[i].date;
    //       item.position = this.dayHours.indexOf(item.hours);
    //
    //       array.push(item);
    //     }
    //
    //     allDatesArray = [];
    //     for (let i = 0; i < this.allDates.length; i++) {
    //       let isItemFound = false;
    //       for (let k = 0; k < array.length; k++) {
    //         if (array[k].date === this.allDates[i]) {
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
    //       averageValue: this.props.isDay
    //         ? value
    //         : parseInt(value / nextProps.dates.length),
    //     });
    //     console.log("allDatesArray", allDatesArray);
    //   }
    // } else {
    //   if (nextProps.data.length !== 0) {
    //     let value = 0;
    //     let array = [];
    //     for (let i = 0; i < nextProps.data.length; i++) {
    //       let countOfItems = 1;
    //       let item = {};
    //       item.value = nextProps.data[i].value;
    //       value += nextProps.data[i].value;
    //
    //       item.countOfItems = countOfItems;
    //       item.date = nextProps.data[i].date;
    //       item.position = this.allDates.indexOf(item.date);
    //
    //       array.push(item);
    //     }
    //
    //     allDatesArray = [];
    //     for (let i = 0; i < this.allDates.length; i++) {
    //       let isItemFound = false;
    //       for (let k = 0; k < array.length; k++) {
    //         if (array[k].date === this.allDates[i]) {
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
    //       averageValue: this.props.isDay
    //         ? value
    //         : parseInt(value / nextProps.dates.length),
    //     });
    //     console.log("allDatesArray", allDatesArray);
    //   }
    // }
  }

  // Get visual bar by adding styles for a week view
  getColoredSections = (item) => {
    if (item.countOfItems === 1) {
      return [
        {
          height: (item.value / this.state.maxValue) * 190 - 3 / 4,
          backgroundColor: 'rgb(42,204,197)',
          borderRadius: 9,
          width: 18,
        },
      ];
    } else return [];
  };

  // Get visual bar by adding styles for a day view
  getColoredSectionsDay = (item) => {
    if (item.countOfItems === 1) {
      return [
        {
          height: (item.value / this.state.maxValue) * 190 - 3 / 4,
          backgroundColor: 'rgb(42,204,197)',
          borderRadius: 3.5,
          width: 7,
        },
      ];
    } else return [];
  };

  // Make a hint visible on a bar press
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

    array.push(parseInt(divider));
    array.push(parseInt(divider * 2));
    array.push(parseInt(divider * 3));
    array.push(parseInt(divider * 4));

    return array;
  };

  render() {
    let bars;

    let yAxis = [];
    if (this.state.maxValue !== 0) {
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
                  zIndex: 999,
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
                  zIndex: 999,
                }}>
                <View
                  style={{
                    width: 18,
                    backgroundColor: item.background,
                    borderRadius: 9,
                    justifyContent: 'flex-end',
                    zIndex: 999,
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
                  zIndex: 999,
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
                  zIndex: 999,
                }}>
                <View
                  style={{
                    width: 7,
                    backgroundColor: item.background,
                    borderRadius: 3.5,
                    justifyContent: 'flex-end',
                    zIndex: 999,
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

    let hintTop = isIphoneX() ? -755 : -805;

    if (this.props.isDay) {
      hintTop += 132;
    }

    if (Platform.OS === 'ios' && !isIphoneX()) {
      hintTop += 6;
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
                <Text style={styles.subtitle}>Steps</Text>
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
                <Text style={styles.subtitle}>Average Steps</Text>
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
              <Text style={[styles.axisText, {marginTop: 0, width: 36}]}>
                {yAxis[4]}
              </Text>
              <Text style={[styles.axisText, {marginTop: 33, width: 36}]}>
                {yAxis[3]}
              </Text>
              <Text style={[styles.axisText, {marginTop: 33, width: 36}]}>
                {yAxis[2]}
              </Text>
              <Text style={[styles.axisText, {marginTop: 31, width: 36}]}>
                {yAxis[1]}
              </Text>
              <Text style={[styles.axisText, {marginTop: 34, width: 36}]}>
                {yAxis[0]}
              </Text>
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
                zIndex: 999,
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

          <View
            style={{
              width: width - 40,
              alignSelf: 'center',
              flexDirection: 'row',
              marginTop: 25,
              marginBottom: 40,
            }}>
            <Image
              source={require('../resources/icon/stepsHint.png')}
              style={{marginRight: 20}}
            />
            <Text style={styles.stepsHint}>
              {this.props.isDay
                ? `You have taken a total of ${parseInt(
                    this.state.totalSteps,
                  ).toLocaleString(
                    'en-US',
                  )} steps today! \n\nStep count is the number of steps you take throughout the day. Your phone or activity tracker counts steps for any activity that involves step-like movement, including walking, running, stair-climbing, cross-country skiing, and even movement as you go about your daily chores.`
                : `Each week your steps graph gives a basic indication of how active you are. Compare how fluctuations in your activity levels can correlate with your health status and needs. Regular movement is great for both your body and your mind! \n\n\Step count is the number of steps you take throughout the day. Your phone or activity tracker counts steps for any activity that involves step-like movement, including walking, running, stair-climbing, cross-country skiing, and even movement as you go about your daily chores.
              `}
            </Text>
          </View>

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
                        width: this.props.isDay ? 180 : 150,
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
                        width: this.props.isDay ? 180 : 150,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                      }}>
                      <Text style={styles.hintTitle}>
                        {parseInt(this.state.hintValue).toLocaleString('en-US')}
                      </Text>
                      <View
                        style={{
                          marginLeft: 20,
                          marginTop: 4,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text style={styles.hintSubtitle}>Steps</Text>
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
                      width: this.props.isDay ? 180 : 150,
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
                      width: this.props.isDay ? 180 : 150,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Text style={styles.hintTitle}>
                      {parseInt(this.state.hintValue).toLocaleString('en-US')}
                    </Text>
                    <View
                      style={{
                        marginLeft: 20,
                        marginTop: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.hintSubtitle}>Steps</Text>
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
        </Dialog>*/}
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
  stepsHint: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
    width: width - 105,
  },
});

StepsChart.defaultProps = {};

export default StepsChart;

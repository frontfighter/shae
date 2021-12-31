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

class SleepChart extends Component {
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
      barPositions: {},
      formattedResults: [],
      datesCount: 1,
      hintTouchPosition: {},
      isLoading: false,
    };

    this.allDates = [];
    this.dayHours = [];
    this.barHeights = {};
  }

  componentDidMount() {
    console.log('SleepChart dates', this.props.dates);

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
      const options = {
        permissions: {
          read: ['SleepAnalysis'],
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

        if (this.props.isDay && typeof dates === 'string') {
          let startDate = new Date(dates);
          console.log('startDate new', startDate);
          startDate.setDate(startDate.getDate() - 1);
          // startDate.setHours(
          //   startDate.getHours() - startDate.getTimezoneOffset() / 60
          // );
          // startDate.setHours(23);
          // startDate.setMinutes(0);

          console.log('startDate', startDate.toISOString().substring(0, 10));

          AppleHealthKit.getSleepSamples(
            // { startDate: startDate.toISOString() }, // + "T00:00:00.000Z" },
            {
              startDate:
                startDate.toISOString().substring(0, 10) +
                `T00:00:00.000${offset}`,
              endDate: dates + `T23:59:00.000${offset}`,
            },
            (err, results) => {
              if (err) {
                console.log('getSleepSamples error', err);
                console.log('AppleHealthKit error', err);

                return;
              }
              console.log(
                'getSleepSamples dates',
                startDate.toISOString().substring(0, 10) +
                  `T23:00:00.000${offset}`,
                dates + `T23:59:00.000${offset}`,
              );
              console.log('getSleepSamples', results);

              // let value = 0;
              // let array = [];

              // let reversedResults;
              // if (results.length !== 0) {
              //   reversedResults = results.reverse();
              // } else {
              //   reversedResults = results;
              // }
              //
              // for (let i = 0; i < reversedResults.length; i++) {
              //   if (
              //     reversedResults[i].startDate.substring(8, 10) ===
              //     dates.substring(8, 10)
              //   ) {
              //     let countOfItems = 1;
              //     let item = {};
              //     item.value = reversedResults[i].value;
              //     value += reversedResults[i].value;
              //
              //     item.countOfItems = countOfItems;
              //     item.date = results[i].startDate.substring(0, 10);
              //     item.hours = reversedResults[i].startDate.substring(11, 13);
              //     item.position = this.dayHours.indexOf(item.hours);
              //
              //     array.push(item);
              //   }
              // }

              let formattedResults = [];
              if (results.length !== 0) {
                // for (let i = results.length; i > 0; i--) {
                //   if (results[i].startDate === results[i].endDate) {
                //     results.splice(i, 1);
                //   }
                // }

                results = results.filter(
                  (item) => item.startDate !== item.endDate,
                );
                // results = results.reverse(); - popup
                console.log('reversed results', results);

                let minutes = 0;
                const firstDate = dates.substring(0, 10);
                for (let i = 0; i < results.length; i++) {
                  if (
                    results[i].value === 'ASLEEP' &&
                    results[i].endDate.substring(0, 10) === firstDate
                  ) {
                    let obj = {
                      value: results[i].value,
                      startDate: this.getDate(results[i].startDate),
                      endDate: this.getDate(results[i].endDate),
                      position: i,
                    };

                    // if (
                    //   i === results.length - 1 ||
                    //   obj.startDate.substring(0, 10) !==
                    //     obj.endDate.substring(0, 10)
                    // ) {
                    //   minutes +=
                    //     parseInt(obj.endDate.substring(11, 13)) * 60 +
                    //     parseInt(obj.endDate.substring(14, 16));
                    // } else {
                    //   minutes +=
                    //     parseInt(obj.endDate.substring(11, 13)) * 60 +
                    //     parseInt(obj.endDate.substring(14, 16)) -
                    //     (parseInt(obj.startDate.substring(11, 13)) * 60 +
                    //       parseInt(obj.startDate.substring(14, 16)));
                    //
                    //   if (parseInt(obj.startDate.substring(11, 13)) === 23) {
                    //     minutes += parseInt(obj.startDate.substring(14, 16));
                    //   }
                    // }

                    obj.date = obj.endDate.substring(0, 10);
                    if (
                      obj.startDate.substring(0, 10) !==
                      obj.endDate.substring(0, 10)
                    ) {
                      obj.minutesStart = 0;

                      obj.minutesEnd =
                        parseInt(obj.endDate.substring(11, 13)) * 60 +
                        parseInt(obj.endDate.substring(14, 16)) +
                        60;

                      minutes += obj.minutesEnd;

                      if (parseInt(obj.startDate.substring(11, 13)) === 23) {
                        // minutes -= parseInt(obj.startDate.substring(14, 16));

                        obj.minutesStart = parseInt(
                          obj.startDate.substring(14, 16),
                        );
                        minutes +=
                          60 - parseInt(obj.startDate.substring(14, 16));

                        obj.minutesEnd +=
                          60 -
                          parseInt(obj.startDate.substring(14, 16)) +
                          obj.minutesStart;
                      }

                      // if (parseInt(obj.startDate.substring(11, 13)) <= 23) {
                      //   minutes +=
                      //     23 * 60 -
                      //     parseInt(obj.startDate.substring(11, 13)) * 60 -
                      //     parseInt(obj.startDate.substring(14, 16));
                      // }
                    } else {
                      obj.minutesStart =
                        parseInt(obj.startDate.substring(11, 13)) * 60 +
                        parseInt(obj.startDate.substring(14, 16)) +
                        60;

                      obj.minutesEnd =
                        parseInt(obj.endDate.substring(11, 13)) * 60 +
                        parseInt(obj.endDate.substring(14, 16)) +
                        60;

                      // minutes += Math.abs(obj.minutesEnd - obj.minutesStart);
                      minutes += Math.abs(
                        new Date(obj.endDate).getTime() / 1000 / 60 -
                          new Date(obj.startDate).getTime() / 1000 / 60,
                      );
                    }

                    console.log(
                      'minutes value',
                      new Date(obj.endDate).getTime() / 1000 / 60 -
                        new Date(obj.startDate).getTime() / 1000 / 60,
                    );

                    // obj.minutesEnd =
                    //   new Date(obj.endDate).getTime() / 1000 / 60 -
                    //   new Date(obj.startDate).getTime() / 1000 / 60;

                    obj.value = Math.abs(
                      new Date(obj.endDate).getTime() / 1000 / 60 -
                        new Date(obj.startDate).getTime() / 1000 / 60,
                    );

                    obj.marginTop = (obj.minutesStart / 480) * 184;

                    formattedResults.push(obj);
                  }
                }

                // formattedResults = formattedResults.reverse();

                console.log('formattedResults', formattedResults, firstDate);

                this.setState({
                  // averageValue: minutes, //results.length === 0 ? 0 : results[0].value,
                  formattedResults,
                });

                console.log('getSleepSamples results ', results);
              }

              let innerArray = [];
              let newArray = [];
              innerArray.push(formattedResults[0]);
              if (formattedResults.length === 1) {
                newArray.push(innerArray);
              } else {
                for (let i = 1; i < formattedResults.length; i++) {
                  console.log(
                    'comparison ',
                    formattedResults[i].date,
                    formattedResults[i - 1].date,
                  );

                  if (
                    formattedResults[i].date === formattedResults[i - 1].date
                  ) {
                    innerArray.push(formattedResults[i]);

                    if (i === formattedResults.length - 1) {
                      newArray.push(innerArray);
                    }
                  } else {
                    console.log('innerArray', innerArray);
                    newArray.push(innerArray);
                    innerArray = [];

                    innerArray.push(formattedResults[i]);

                    if (i === formattedResults.length - 1) {
                      newArray.push(innerArray);
                    }
                  }
                }
              }

              // newArray[0] = newArray[0].reverse();

              console.log('newArray ', newArray);

              let value = 0;
              let array = [];
              for (let i = 0; i < newArray.length; i++) {
                let item = {};
                item = {...{item: newArray[i]}};

                item.value = newArray[i][0].value;

                for (let k = 0; k < newArray[i].length; k++) {
                  value += newArray[i][k].value;
                }

                item.countOfItems = newArray[i].length;
                item.date = newArray[i][0].date.substring(0, 10);
                item.position = this.allDates.indexOf(item.date);

                array.push(item);

                break;
              }

              // array[0].item = array[0].item.reverse();

              console.log('array ', array);

              allDatesArray = [];
              // for (let i = 0; i < this.allDates.length; i++) {
              // let isItemFound = false;
              for (let k = 0; k < array.length; k++) {
                // if (array[k].item[0].date === this.allDates[i]) {
                // isItemFound = true;
                allDatesArray.push({
                  ...array[k],
                  ...{background: 'rgb(255,255,255)'},
                });

                break;
                // }
              }

              allDatesArray.length = 1;

              // if (!isItemFound) {
              //   allDatesArray.push({
              //     background: "transparent",
              //     countOfItems: 0,
              //     value: 0,
              //   });
              // }
              // }

              // let datesCount = 0;
              // for (let i = 0; i < this.allDates.length; i++) {
              //   datesCount += 1;
              //
              //   if (this.allDates[i] === dates[1]) {
              //     break;
              //   }
              // }

              // allDatesArray.item = allDatesArray.item.reverse();

              this.setState(
                {
                  allDatesArray: allDatesArray,
                  datesCount: 1,
                  averageValue: value,
                  isLoading: false,
                },
                () => {
                  console.log('allDatesArray', this.state.allDatesArray);
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
            },
          );
        } else {
          let startDate = new Date(dates[0]);

          startDate.setHours(
            startDate.getHours() - -startDate.getTimezoneOffset() / 60,
          );
          startDate.setDate(startDate.getDate() - 1);

          startDate.setHours(0);
          startDate.setMinutes(0);

          let endDate = new Date(dates[1]);
          endDate.setHours(
            endDate.getHours() - -endDate.getTimezoneOffset() / 60,
          );
          endDate.setHours(23);
          endDate.setMinutes(59);
          let stepOptions = {
            // startDate: dates[0].replace("10", "09") + "T00:00:00.000Z", // required
            // startDate: startDate.toISOString(), // dates[0] + "T00:00:00.000Z", // required
            // endDate: endDate.toISOString(), // dates[1] + "T23:59:00.000Z",

            startDate:
              startDate.toISOString().substring(0, 10) +
              `T00:00:00.000${offset}`,
            endDate: dates[1] + `T23:59:00.000${offset}`,
          };

          console.log('sleepOptions', stepOptions);

          AppleHealthKit.getSleepSamples(stepOptions, (err, results) => {
            if (err) {
              console.log('getSleepSamples error ', err);
              console.log('AppleHealthKit error', err);

              return;
            }

            let formattedResults = [];
            if (results.length !== 0) {
              results = results.reverse();
              console.log('reversed results', results);

              let minutes = 0;
              const firstDate = dates[0].substring(0, 10);
              for (let i = 0; i < results.length; i++) {
                if (results[i].value === 'ASLEEP') {
                  let obj = {
                    value: results[i].value,
                    startDate: this.getDate(results[i].startDate),
                    endDate: this.getDate(results[i].endDate),
                  };

                  // if (
                  //   i === results.length - 1 ||
                  //   obj.startDate.substring(0, 10) !==
                  //     obj.endDate.substring(0, 10)
                  // ) {
                  //   minutes +=
                  //     parseInt(obj.endDate.substring(11, 13)) * 60 +
                  //     parseInt(obj.endDate.substring(14, 16));
                  // } else {
                  //   minutes +=
                  //     parseInt(obj.endDate.substring(11, 13)) * 60 +
                  //     parseInt(obj.endDate.substring(14, 16)) -
                  //     (parseInt(obj.startDate.substring(11, 13)) * 60 +
                  //       parseInt(obj.startDate.substring(14, 16)));
                  //
                  //   if (parseInt(obj.startDate.substring(11, 13)) === 23) {
                  //     minutes += parseInt(obj.startDate.substring(14, 16));
                  //   }
                  // }

                  obj.date = obj.endDate.substring(0, 10);
                  if (
                    obj.startDate.substring(0, 10) !==
                    obj.endDate.substring(0, 10)
                  ) {
                    obj.minutesStart = 0;

                    obj.minutesEnd =
                      obj.minutesStart +
                        parseInt(obj.endDate.substring(11, 13)) ===
                      '00'
                        ? parseInt(obj.endDate.substring(14, 16))
                        : parseInt(obj.endDate.substring(11, 13)) * 60 +
                          parseInt(obj.endDate.substring(14, 16));

                    console.log(
                      'obj.minutesEnd',
                      obj.minutesEnd,
                      parseInt(obj.startDate.substring(11, 13)) === 23,
                      parseInt(obj.startDate.substring(14, 16)),
                    );

                    minutes += obj.minutesEnd;

                    if (parseInt(obj.startDate.substring(11, 13)) === 23) {
                      obj.minutesStart = parseInt(
                        obj.startDate.substring(14, 16),
                      );

                      minutes += 60 - parseInt(obj.startDate.substring(14, 16));

                      obj.minutesEnd +=
                        60 -
                        parseInt(obj.startDate.substring(14, 16)) +
                        obj.minutesStart;
                    }
                  } else {
                    obj.minutesStart =
                      parseInt(obj.startDate.substring(11, 13)) * 60 +
                      parseInt(obj.startDate.substring(14, 16)) +
                      60;

                    obj.minutesEnd =
                      parseInt(obj.endDate.substring(11, 13)) * 60 +
                      parseInt(obj.endDate.substring(14, 16)) +
                      60;

                    minutes += Math.abs(
                      new Date(obj.endDate).getTime() / 1000 / 60 -
                        new Date(obj.startDate).getTime() / 1000 / 60,
                    );
                  }

                  console.log(
                    'minutes value',
                    new Date(obj.endDate).getTime() / 1000 / 60 -
                      new Date(obj.startDate).getTime() / 1000 / 60,
                  );

                  // obj.minutesEnd =
                  //   new Date(obj.endDate).getTime() / 1000 / 60 -
                  //   new Date(obj.startDate).getTime() / 1000 / 60;

                  obj.value = Math.abs(obj.minutesEnd - obj.minutesStart);

                  obj.marginTop = (obj.minutesStart / 480) * 184;

                  formattedResults.push(obj);
                }
              }

              console.log('formattedResults', formattedResults, minutes);

              this.setState({
                averageValue: minutes, //results.length === 0 ? 0 : results[0].value,
                formattedResults,
              });

              console.log('getSleepSamples results ', results);
            }

            let innerArray = [];
            let newArray = [];
            innerArray.push(formattedResults[0]);
            if (formattedResults.length === 1) {
              newArray.push(innerArray);
            } else {
              for (let i = 1; i < formattedResults.length; i++) {
                console.log(
                  'comparison ',
                  formattedResults[i].date,
                  formattedResults[i - 1].date,
                );

                if (formattedResults[i].date === formattedResults[i - 1].date) {
                  innerArray.push(formattedResults[i]);

                  if (i === formattedResults.length - 1) {
                    newArray.push(innerArray);
                  }
                } else {
                  console.log('innerArray', innerArray);
                  newArray.push(innerArray);
                  innerArray = [];

                  innerArray.push(formattedResults[i]);

                  if (i === formattedResults.length - 1) {
                    newArray.push(innerArray);
                  }
                }
              }
            }

            console.log('newArray ', newArray);

            let value = 0;
            let array = [];
            for (let i = 0; i < newArray.length; i++) {
              let item = {};
              item = {...{item: newArray[i]}};

              item.value = newArray[i][0].value;

              for (let k = 0; k < newArray[i].length; k++) {
                value += Math.abs(newArray[i][k].value);
              }

              item.countOfItems = newArray[i].length;
              item.date = newArray[i][0].date.substring(0, 10);
              item.position = this.allDates.indexOf(item.date);

              array.push(item);
            }

            // for (let i = 0; i < formattedResults.length; i++) {
            //   let countOfItems = 1;
            //   let item = {};
            //   item = { ...formattedResults[i] };
            //
            //   item.value = formattedResults[i].value;
            //   value += formattedResults[i].value;
            //
            //   item.countOfItems = countOfItems;
            //   item.date = formattedResults[i].startDate.substring(0, 10);
            //   item.position = this.allDates.indexOf(item.date);
            //
            //   array.push(item);
            // }

            console.log('array', array);

            allDatesArray = [];
            for (let i = 0; i < this.allDates.length; i++) {
              let isItemFound = false;
              for (let k = 0; k < array.length; k++) {
                if (array[k].item[0].date === this.allDates[i]) {
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
              datesCount: newArray.length === 0 ? 1 : newArray.length,
              averageValue: parseInt(value) / datesCount,
              isLoading: false,
            });
            console.log('allDatesArray', allDatesArray);
            console.log('getSleepSamples results ', results, value, datesCount);
          });
        }
      });
    } else {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_LOCATION_READ,
        ],
      };

      GoogleFit.authorize(options)
        .then((res) => {
          console.log('authorized >>>', res);

          if (res.success) {
            if (this.props.isDay && typeof dates === 'string') {
              let startDate = new Date(dates);
              // startDate.setMonth(startDate.getMonth() - 1);
              const offset = startDate.getTimezoneOffset() / 60;
              startDate.setDate(startDate.getDate() - 2);
              startDate.setHours(23, 50, 0, 0);
              // startDate.setHours(startDate.getHours() - offset);
              let endDate = new Date(dates);
              // endDate.setDate(endDate.getDate());
              endDate.setHours(23, 59, 59, 0);

              GoogleFit.getSleepSamples({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              }).then((res) => {
                console.log('getActivitySamples', res);
                if (res !== false) {
                  console.log('getActivitySamples', res);
                  // let reverseArray = this.reverseArray(res);
                  let reverseArray = res.sort(function (a, b) {
                    return new Date(a.endDate) - new Date(b.endDate);
                  });
                  console.log('getActivitySamples reversed', reverseArray);

                  let sleepArray = [];
                  let sleepMinutes = 0;
                  let value = 0;
                  let array = [];

                  for (let i = 0; i < reverseArray.length; i++) {
                    const startDate = new Date(reverseArray[i].startDate);
                    const endDate = new Date(reverseArray[i].endDate);
                    const offset = startDate.getTimezoneOffset() / 60;
                    startDate.setHours(startDate.getHours() - offset);
                    endDate.setHours(endDate.getHours() - offset);

                    sleepArray.push({
                      ...reverseArray[i],
                      ...{
                        startDate:
                          startDate.toISOString().substring(0, 23) + '+0000',
                        endDate:
                          endDate.toISOString().substring(0, 23) + '+0000',
                        value:
                          (endDate.getTime() - startDate.getTime()) / 1000 / 60,
                      },
                    });
                    sleepMinutes += 1;

                    // sleepArray.push(array[i]);
                  }

                  console.log('initial sleepArray', sleepArray);

                  if (sleepArray.length !== 0) {
                    // sleepArray = this.getSimplifiedArray(sleepArray);

                    let formattedResults = [];
                    let results = sleepArray;

                    if (results.length !== 0) {
                      // results = results.reverse();
                      console.log('reversed results', results);

                      let minutes = 0;
                      const firstDate = dates.substring(0, 10);
                      for (let i = 0; i < results.length; i++) {
                        if (results[i].endDate.substring(0, 10) === firstDate) {
                          let obj = {
                            value: results[i].value,
                            startDate: this.getDate(results[i].startDate),
                            endDate: this.getDate(results[i].endDate),
                            position: i,
                          };

                          obj.date = obj.endDate.substring(0, 10);
                          if (
                            obj.startDate.substring(0, 10) !==
                            obj.endDate.substring(0, 10)
                          ) {
                            obj.minutesStart = 0;

                            obj.minutesEnd =
                              parseInt(obj.endDate.substring(11, 13)) * 60 +
                              parseInt(obj.endDate.substring(14, 16)) +
                              60;

                            minutes += obj.minutesEnd;

                            if (
                              parseInt(obj.startDate.substring(11, 13)) === 23
                            ) {
                              minutes -= parseInt(
                                obj.startDate.substring(14, 16),
                              );
                            }

                            // if (parseInt(obj.startDate.substring(11, 13)) <= 23) {
                            //   minutes +=
                            //     23 * 60 -
                            //     parseInt(obj.startDate.substring(11, 13)) * 60 -
                            //     parseInt(obj.startDate.substring(14, 16));
                            // }
                          } else {
                            obj.minutesStart =
                              parseInt(obj.startDate.substring(11, 13)) * 60 +
                              parseInt(obj.startDate.substring(14, 16)) +
                              60;

                            obj.minutesEnd =
                              parseInt(obj.endDate.substring(11, 13)) * 60 +
                              parseInt(obj.endDate.substring(14, 16)) +
                              60;

                            minutes += Math.abs(
                              obj.minutesEnd - obj.minutesStart,
                            );
                          }

                          console.log(
                            'minutes value',
                            new Date(obj.endDate).getTime() / 1000 / 60 -
                              new Date(obj.startDate).getTime() / 1000 / 60,
                          );

                          obj.minutesEnd =
                            new Date(obj.endDate).getTime() / 1000 / 60 -
                            new Date(obj.startDate).getTime() / 1000 / 60;

                          obj.value = Math.abs(
                            obj.minutesEnd - obj.minutesStart,
                          );

                          obj.marginTop = (obj.minutesStart / 480) * 184;

                          formattedResults.push(obj);
                        }
                      }

                      // formattedResults = formattedResults.reverse();

                      console.log(
                        'formattedResults',
                        formattedResults,
                        firstDate,
                      );

                      formattedResults = this.reverseArray(formattedResults);

                      this.setState({
                        // averageValue: minutes, //results.length === 0 ? 0 : results[0].value,
                        formattedResults,
                      });

                      // console.log('getSleepSamples results ', results);
                    }

                    let innerArray = [];
                    let newArray = [];
                    innerArray.push(formattedResults[0]);
                    if (formattedResults.length === 1) {
                      newArray.push(innerArray);
                    } else {
                      for (let i = 1; i < formattedResults.length; i++) {
                        console.log('formattedResults[i]', formattedResults[i]);
                        console.log(
                          'comparison ',
                          formattedResults[i].date,
                          formattedResults[i - 1].date,
                        );

                        if (
                          formattedResults[i].date ===
                          formattedResults[i - 1].date
                        ) {
                          innerArray.push(formattedResults[i]);

                          if (i === formattedResults.length - 1) {
                            newArray.push(innerArray);
                          }
                        } else {
                          console.log('innerArray', innerArray);
                          newArray.push(innerArray);
                          innerArray = [];

                          innerArray.push(formattedResults[i]);

                          if (i === formattedResults.length - 1) {
                            newArray.push(innerArray);
                          }
                        }
                      }
                    }

                    // newArray[0] = newArray[0].reverse();

                    console.log('newArray ', newArray);

                    for (let i = 0; i < newArray.length; i++) {
                      let item = {};
                      item = {...{item: newArray[i]}};

                      item.value = newArray[i][0].value;

                      for (let k = 0; k < newArray[i].length; k++) {
                        value += newArray[i][k].value;
                      }

                      item.countOfItems = newArray[i][0].length;
                      item.date = newArray[i][0].date.substring(0, 10);
                      item.position = this.allDates.indexOf(item.date);

                      array.push(item);

                      break;
                    }
                  }

                  // console.log('initial sleepArray', sleepArray);
                  //
                  // for (let i = 0; i < sleepArray.length; i++) {
                  //   let dateStart = new Date(sleepArray[i].start);
                  //   dateStart.setHours(
                  //     dateStart.getHours() - dateStart.getTimezoneOffset() / 60,
                  //   );
                  //   let dateEnd = new Date(sleepArray[i].end);
                  //
                  //   let countOfItems = 1;
                  //   let item = {};
                  //   // item = { ...{ item: sleepArray[i] } };
                  //   item.item = [];
                  //   item.item.push(sleepArray[i]);
                  //
                  //   item.value = sleepArray[i].amountOfMinutes;
                  //   value += sleepArray[i].amountOfMinutes;
                  //
                  //   item.countOfItems = countOfItems;
                  //   item.date = dateStart.toISOString().substring(0, 10);
                  //   item.position = this.allDates.indexOf(item.date);
                  //   item.marginTop = sleepArray[i].marginTop;
                  //
                  //   item.startDate = sleepArray[i].startDate.substring(0, 19);
                  //   item.endDate = sleepArray[i].endDate.substring(0, 19);
                  //
                  //   array.push(item);
                  // }

                  console.log('array', array);

                  let allDatesArray = [];
                  // for (let i = 0; i < this.allDates.length; i++) {
                  // let isItemFound = false;
                  for (let k = 0; k < array.length; k++) {
                    // if (array[k].item[0].date === this.allDates[i]) {
                    // isItemFound = true;
                    allDatesArray.push({
                      ...array[k],
                      ...{background: 'rgb(255,255,255)'},
                    });

                    break;
                    // }
                  }

                  console.log('allDatesArray', allDatesArray);

                  allDatesArray.length = 1;

                  // allDatesArray = [];
                  // for (let i = 0; i < this.allDates.length; i++) {
                  //   let isItemFound = false;
                  //   for (let k = 0; k < array.length; k++) {
                  //     if (array[k].item[0].date === this.allDates[i]) {
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
                  // let datesCount = 0;
                  // for (let i = 0; i < this.allDates.length; i++) {
                  //   datesCount += 1;
                  //
                  //   if (this.allDates[i] === dates[1]) {
                  //     break;
                  //   }
                  // }

                  this.setState({
                    allDatesArray,
                    averageValue: value,
                    // averageValue: parseInt(value / datesCount),
                    datesCount: 1,
                    isLoading: false,
                    // formattedResults: array,
                  });

                  // this.setState({
                  //   sleep: sleepMinutes,
                  // });
                  //
                  // console.log("sleepArray", sleepArray);
                  // console.log("sleepMinutes", sleepMinutes);
                }
              });
            } else {
              console.log('dates', dates);
              let startDate = new Date(dates[0]);
              // startDate.setMonth(startDate.getMonth() - 1);
              const offset = startDate.getTimezoneOffset() / 60;
              startDate.setDate(startDate.getDate() - 1);
              startDate.setHours(23, 0, 0, 0);
              // startDate.setHours(startDate.getHours() - offset);
              let endDate = new Date(dates[1]);
              // endDate.setDate(endDate.getDate());
              endDate.setHours(23, 59, 59, 0);

              GoogleFit.getSleepSamples({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
              }).then((res) => {
                console.log('getSleepSamples', res);
                if (res !== false) {
                  console.log('getSleepSamples', res);

                  let value = 0;
                  let array = [];

                  // let reverseArray = this.reverseArray(res);
                  let reverseArray = res.sort(function (a, b) {
                    return new Date(a.endDate) - new Date(b.endDate);
                  });
                  console.log('getSleepSamples reversed', reverseArray);

                  let sleepArray = [];
                  let minutes = 0;

                  let date = new Date();
                  let offsetGeneral = date.getTimezoneOffset() / 60;
                  if (offsetGeneral < 0) {
                    offsetGeneral =
                      '+' +
                      Math.abs(offsetGeneral).toString().padStart(2, '0') +
                      '00';
                  } else {
                    offsetGeneral =
                      '-' +
                      Math.abs(offsetGeneral).toString().padStart(2, '0') +
                      '00';
                  }

                  for (let i = 0; i < reverseArray.length; i++) {
                    const startDate = new Date(reverseArray[i].startDate);
                    const endDate = new Date(reverseArray[i].endDate);
                    const offset = startDate.getTimezoneOffset() / 60;
                    startDate.setHours(startDate.getHours() - offset);
                    endDate.setHours(endDate.getHours() - offset);

                    sleepArray.push({
                      ...reverseArray[i],
                      ...{
                        startDate:
                          startDate.toISOString().substring(0, 23) + '+0000',
                        endDate:
                          endDate.toISOString().substring(0, 23) + '+0000',
                      },
                    });
                    // value += reverseArray[i].distance / 1000;
                  }

                  console.log('initial sleep array', sleepArray);

                  if (sleepArray.length !== 0) {
                    // sleepArray = this.getSimplifiedArray(sleepArray).reverse();

                    let formattedResults = [];
                    let results = sleepArray;
                    console.log('reversed results', results);

                    let minutes = 0;
                    const firstDate = dates[0].substring(0, 10);
                    for (let i = 0; i < results.length; i++) {
                      let obj = {
                        value: results[i].value,
                        startDate: this.getDate(results[i].startDate),
                        endDate: this.getDate(results[i].endDate),
                      };

                      obj.date = obj.endDate.substring(0, 10);
                      if (
                        obj.startDate.substring(0, 10) !==
                        obj.endDate.substring(0, 10)
                      ) {
                        obj.minutesStart = 0;

                        obj.minutesEnd =
                          parseInt(obj.endDate.substring(11, 13)) * 60 +
                          parseInt(obj.endDate.substring(14, 16)) +
                          60;

                        minutes += obj.minutesEnd;

                        if (parseInt(obj.startDate.substring(11, 13)) === 23) {
                          minutes -= parseInt(obj.startDate.substring(14, 16));
                        }
                      } else {
                        obj.minutesStart =
                          parseInt(obj.startDate.substring(11, 13)) * 60 +
                          parseInt(obj.startDate.substring(14, 16)) +
                          60;

                        obj.minutesEnd =
                          parseInt(obj.endDate.substring(11, 13)) * 60 +
                          parseInt(obj.endDate.substring(14, 16)) +
                          60;

                        minutes += Math.abs(obj.minutesEnd - obj.minutesStart);
                      }

                      console.log(
                        'minutes value',
                        new Date(obj.endDate).getTime() / 1000 / 60 -
                          new Date(obj.startDate).getTime() / 1000 / 60,
                      );

                      obj.minutesEnd =
                        new Date(obj.endDate).getTime() / 1000 / 60 -
                        new Date(obj.startDate).getTime() / 1000 / 60;

                      obj.value = Math.abs(obj.minutesEnd - obj.minutesStart);

                      obj.marginTop = (obj.minutesStart / 480) * 184;

                      formattedResults.push(obj);
                    }

                    formattedResults = this.reverseArray(formattedResults);

                    console.log('formattedResults', formattedResults, minutes);

                    this.setState({
                      averageValue: minutes, //results.length === 0 ? 0 : results[0].value,
                      formattedResults,
                    });

                    console.log('getSleepSamples results ', results);

                    let innerArray = [];
                    let newArray = [];
                    innerArray.push(formattedResults[0]);
                    if (formattedResults.length === 1) {
                      newArray.push(innerArray);
                    } else {
                      for (let i = 1; i < formattedResults.length; i++) {
                        console.log(
                          'comparison ',
                          formattedResults[i].date,
                          formattedResults[i - 1].date,
                        );

                        if (
                          formattedResults[i].date ===
                          formattedResults[i - 1].date
                        ) {
                          innerArray.push(formattedResults[i]);

                          if (i === formattedResults.length - 1) {
                            newArray.push(innerArray);
                          }
                        } else {
                          console.log('innerArray', innerArray);
                          newArray.push(innerArray);
                          innerArray = [];

                          innerArray.push(formattedResults[i]);

                          if (i === formattedResults.length - 1) {
                            newArray.push(innerArray);
                          }
                        }
                      }
                    }

                    for (let i = 0; i < newArray.length; i++) {
                      let item = {};
                      item = {...{item: newArray[i]}};

                      item.value = newArray[i][0].value;
                      value += newArray[i][0].value;

                      item.countOfItems = newArray[i].length;
                      item.date = newArray[i][0].date.substring(0, 10);
                      item.position = this.allDates.indexOf(item.date);

                      array.push(item);
                    }
                  }

                  console.log('testArray', sleepArray);

                  // for (let i = 0; i < sleepArray.length; i++) {
                  //   let dateStart = new Date(sleepArray[i].startDate);
                  //   dateStart.setHours(
                  //     dateStart.getHours() - dateStart.getTimezoneOffset() / 60,
                  //   );
                  //   let dateEnd = new Date(sleepArray[i].endDate);
                  //
                  //   sleepArray[i].value = sleepArray[i].amountOfMinutes;
                  //
                  //   let countOfItems = 1;
                  //   let item = {};
                  //   // item = { ...{ item: sleepArray[i] } };
                  //   item.item = [];
                  //   item.item.push(sleepArray[i]);
                  //
                  //   item.value = sleepArray[i].amountOfMinutes;
                  //   value += sleepArray[i].amountOfMinutes;
                  //
                  //   item.countOfItems = countOfItems;
                  //   item.date = dateStart.toISOString().substring(0, 10);
                  //   item.position = this.allDates.indexOf(item.date);
                  //   item.marginTop = sleepArray[i].marginTop;
                  //
                  //   item.startDate = sleepArray[i].startDate.substring(0, 19);
                  //   item.endDate = sleepArray[i].endDate.substring(0, 19);
                  //
                  //   array.push(item);
                  // }

                  console.log('array123', array);

                  let allDatesArray = [];
                  for (let i = 0; i < this.allDates.length; i++) {
                    let isItemFound = false;
                    for (let k = 0; k < array.length; k++) {
                      if (array[k].item[0].date === this.allDates[i]) {
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
                    isLoading: false,
                  });
                  console.log('allDatesArray', allDatesArray);

                  // console.log("walkingArray", walkingArray);
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

  getSimplifiedArray = (array) => {
    // [
    //   {
    //     addedBy: 'com.google.android.apps.fitness',
    //     startDate: '2021-03-12T06:00:00.000Z',
    //     endDate: '2021-03-12T08:35:00.000Z',
    //   },
    //   {
    //     addedBy: 'com.google.android.apps.fitness',
    //     startDate: '2021-03-12T02:49:00.000Z',
    //     endDate: '2021-03-12T05:10:00.000Z',
    //   },
    //   {
    //     addedBy: 'com.google.android.apps.fitness',
    //     startDate: '2021-03-11T21:48:00.000Z',
    //     endDate: '2021-03-12T01:05:00.000Z',
    //   },
    //   {
    //     addedBy: 'com.google.android.apps.fitness',
    //     startDate: '2021-03-10T22:16:00.000Z',
    //     endDate: '2021-03-11T07:16:00.000Z',
    //   },
    //   {
    //     addedBy: 'com.google.android.apps.fitness',
    //     startDate: '2021-03-08T23:55:00.000Z',
    //     endDate: '2021-03-09T08:19:00.000Z',
    //   },
    // ];

    console.log('getSimplifiedArray', array);
    let newArray = [];
    let amountOfMinutes = 1;
    let startDate = array[0].startDate;
    let endDate = array[0].endDate;

    // startDate: '2020-10-19T01:02:00',
    // endDate: '2020-10-19T03:50:00',
    // date: '2020-10-19',
    // minutesStart: 122,
    // minutesEnd: 290,

    for (let i = 1; i < array.length; i++) {
      if (array[i - 1].startDate === array[i].endDate) {
        amountOfMinutes +=
          (new Date(array[i].endDate).getTime() -
            new Date(array[i].startDate).getTime()) /
          1000 /
          60;
      } else {
        // newArray.push({ ...array[i - 1], ...{ amountOfMinutes } });

        let marginTop = 0;
        if (array[i - 1].startDate.substring(11, 13) === '23') {
          marginTop =
            (24 * parseInt(array[i - 1].startDate.substring(14, 16))) / 60;
        } else {
          if (array[i - 1].startDate.substring(11, 13) === '00') {
            marginTop = 24;
          } else {
            marginTop =
              24 +
              24 * parseInt(array[i - 1].startDate.substring(11, 13)) +
              (24 * parseInt(array[i - 1].startDate.substring(14, 16))) / 60;
          }
        }

        let minutesStart = 0;
        if (array[i].startDate.substring(11, 13) === '23') {
          minutesStart +=
            60 - parseInt(array[i - 1].startDate.substring(14, 16));
        } else {
          minutesStart +=
            parseInt(startDate.substring(11, 13)) * 60 +
            parseInt(startDate.substring(14, 16));
        }

        let minutesEnd =
          parseInt(array[i - 1].endDate.substring(11, 13)) * 60 +
          parseInt(array[i - 1].endDate.substring(14, 16));

        newArray.push({
          ...array[i - 1],
          ...{
            amountOfMinutes,
            endDate: startDate,
            startDate: array[i - 1].endDate,
            marginTop,
            date: startDate.substring(0, 10),
            minutesStart,
            minutesEnd,
          },
        });

        startDate = array[i].startDate;

        amountOfMinutes =
          (new Date(array[i].endDate).getTime() -
            new Date(array[i].startDate).getTime()) /
          1000 /
          60;
      }

      if (amountOfMinutes !== 1 && i === array.length - 1) {
        let marginTop = 0;
        if (array[i].startDate.substring(11, 13) === '23') {
          marginTop =
            (24 * parseInt(array[i].startDate.substring(14, 16))) / 60;
        } else {
          if (array[i].startDate.substring(11, 13) === '00') {
            marginTop = 24;
          } else {
            marginTop =
              24 +
              24 * parseInt(array[i].startDate.substring(11, 13)) +
              (24 * parseInt(array[i].startDate.substring(14, 16))) / 60;
          }
        }

        let minutesStart = 0;
        if (array[i].startDate.substring(11, 13) === '23') {
          minutesStart += 60 - parseInt(array[i].startDate.substring(14, 16));
        } else {
          minutesStart +=
            parseInt(array[i].startDate.substring(11, 13)) * 60 +
            parseInt(array[i].startDate.substring(14, 16));
        }

        let minutesEnd =
          parseInt(array[i].endDate.substring(11, 13)) * 60 +
          parseInt(array[i].endDate.substring(14, 16));

        newArray.push({
          ...array[i - 1],
          ...{
            amountOfMinutes,
            endDate: startDate,
            startDate: array[i].endDate,
            marginTop,
            date: array[i].startDate.substring(0, 10),
            minutesStart,
            minutesEnd,
          },
        });
      }
    }

    console.log('newArray', newArray);

    for (let i = 0; i < newArray.length; i++) {
      const dateStart = new Date(newArray[i].startDate.substring(0, 19));
      const dateEnd = new Date(newArray[i].endDate.substring(0, 19));

      newArray[i].value = (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60;

      let minutesStart = 0;
      if (newArray[i].startDate.substring(11, 13) === '23') {
        minutesStart += 60 - parseInt(newArray[i].startDate.substring(14, 16));
      } else {
        minutesStart +=
          parseInt(newArray[i].startDate.substring(11, 13)) * 60 +
          parseInt(newArray[i].startDate.substring(14, 16));
      }

      let minutesEnd =
        parseInt(newArray[i].endDate.substring(11, 13)) * 60 +
        parseInt(newArray[i].endDate.substring(14, 16));

      newArray[i].minutesStart = minutesStart;
      newArray[i].minutesEnd = minutesEnd;

      newArray[i].position = i;
    }

    return newArray;
  };

  reverseArray = (array) => {
    return array.reverse();
  };

  getDate = (dateString) => {
    console.log('getDate dateString', dateString);
    const date = new Date(dateString.substring(0, 19));

    console.log('date', date);

    // let offsetHours = -date.getTimezoneOffset() / 60;
    // date.setHours(date.getHours() - offsetHours);

    console.log('date 2', date);

    if (dateString.substring(23, 24) === '+') {
      date.setHours(date.getHours() + parseInt(dateString.substring(24, 26)));
    } else {
      date.setHours(date.getHours() - parseInt(dateString.substring(24, 26)));
    }

    // date.setHours(date.getHours() + offsetHours);

    console.log('date 3', date.toISOString());

    return date.toISOString().substring(0, 19);
  };

  componentWillReceiveProps(nextProps) {
    // setTimeout(() => {
    if (nextProps.dates !== this.props.dates) {
      console.log('SleepChart nextProps data', nextProps);
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
          barPositions: {},
          formattedResults: [],
          datesCount: 1,
          hintTouchPosition: {},
          isLoading: true,
        },
        () => {
          this.getAlldates(nextProps.dates);
          this.getData(nextProps.dates);
        },
      );
    }

    // }, 50);
  }

  getColoredSections = (item) => {
    let array = [];

    console.log('getColoredSections', item);

    if (typeof item.item !== 'undefined') {
      let height = 0;
      for (let i = 0; i < item.item.length; i++) {
        array.push({
          height: (item.item[i].value / 480) * 190 - 3 / 4,
          backgroundColor: 'rgb(105,88,232)',
          borderRadius: 12,
          width: 18,
          top1: item.item[i].marginTop,
        });

        height +=
          (item.item[i].value / 480) * 190 - 3 / 4 + item.item[i].marginTop;
      }

      this.barHeights[item.position] = height + 5;

      return array;
    } else {
      return [];
    }

    // return [];
    //
    // if (item.countOfItems === 1) {
    //   return [
    //     {
    //       height: (item.value / 480) * 190 - 3 / 4,
    //       backgroundColor: "rgb(105,88,232)",
    //       borderRadius: 9,
    //       width: 18,
    //     },
    //   ];
    // } else return [];
  };

  getColoredSectionsDay = (item) => {
    console.log('getColoredSectionsDay item', item);
    let array = [];

    if (typeof item.item !== 'undefined') {
      let height = 0;
      for (let i = 0; i < item.item.length; i++) {
        array.push({
          height: (item.item[i].value / 480) * 190 - 3 / 4,
          backgroundColor: 'rgb(105,88,232)',
          borderRadius: 14,
          width: width - 76,
          top1: item.item[i].marginTop,
        });

        height +=
          (item.item[i].value / 480) * 190 - 3 / 4 + item.item[i].marginTop;
      }

      this.barHeights[item.position] = height + 5;

      console.log('getColoredSectionsDay array', array);

      return array;
    } else {
      return [];
    }

    // if (item.countOfItems === 1) {
    //   return [
    //     {
    //       height: (item.value / 16) * 190 - 3 / 4,
    //       backgroundColor: "rgb(105,88,232)",
    //       borderRadius: 3.5,
    //       width: 7,
    //     },
    //   ];
    // } else return [];
  };

  onBarPress = (index, value, date, item, index2) => {
    if (item.countOfItems !== 0) {
      this.props.onHint();
      console.log(
        'onBarPress',
        item,
        this.state.barPositions,
        index,
        this.barHeights,
      );

      let currentItem = item.item[index2];
      // let hintValue = `${Math.floor(currentItem.value / 60)}h ${Math.round(
      //   currentItem.value % 60
      // )}m`;

      const minutes =
        (new Date(currentItem.endDate).getTime() -
          new Date(currentItem.startDate).getTime()) /
        1000 /
        60;

      let hintValue = `${Math.floor(minutes / 60)}h ${Math.round(
        minutes % 60,
      )}m`;

      console.log(
        'onBarPress startDate',
        (new Date(currentItem.endDate).getTime() -
          new Date(currentItem.startDate).getTime()) /
          1000 /
          60,
      );

      let hintDate = `${currentItem.startDate.substring(
        11,
        16,
      )} ${this.formatAMPM(
        currentItem.startDate.substring(11, 13),
      )} - ${currentItem.endDate.substring(11, 16)} ${this.formatAMPM(
        currentItem.endDate.substring(11, 13),
      )}`;

      this.setState({
        // hintPositionX: this.props.isDay ? index * 7 : index * (26 + 10 + 9),
        hintPositionX: 60 + index * 39.5 + 19,
        hintHours: this.props.isDay
          ? item.item[index].startDate.substring(11, 13)
          : typeof item.hours !== 'undefined'
          ? item.hours
          : '',
        hintDate: hintDate,
        hintValue: hintValue,
        isHintModalVisible: true,
        hintIndex: index,
      });
    }
  };

  onBarPressDay = (index, value, date, item, index2) => {
    if (item.countOfItems !== 0) {
      this.props.onHint();
      console.log('onBarPress item', item);

      console.log('onBarPress index', index);

      let currentItem = item.item[index];
      // let hintValue = `${Math.floor(currentItem.value / 60)}h ${Math.round(
      //   currentItem.value % 60
      // )}m`;

      const minutes =
        (new Date(currentItem.endDate).getTime() -
          new Date(currentItem.startDate).getTime()) /
        1000 /
        60;

      let hintValue = `${Math.floor(minutes / 60)}h ${Math.round(
        minutes % 60,
      )}m`;

      console.log(
        'onBarPress startDate',
        (new Date(currentItem.endDate).getTime() -
          new Date(currentItem.startDate).getTime()) /
          1000 /
          60,
      );

      let hintDate = `${currentItem.startDate.substring(
        11,
        16,
      )} ${this.formatAMPM(
        currentItem.startDate.substring(11, 13),
      )} - ${currentItem.endDate.substring(11, 16)} ${this.formatAMPM(
        currentItem.endDate.substring(11, 13),
      )}`;

      this.setState({
        hintPositionX: this.props.isDay ? index * 7 : index * (26 + 10 + 9),
        hintHours: this.props.isDay
          ? item.item[index].startDate.substring(11, 13)
          : typeof item.hours !== 'undefined'
          ? item.hours
          : '',
        hintDate: hintDate,
        hintValue: hintValue,
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
    this.barHeights = obj;
  };

  formatAMPM = (hours) => {
    let sufHours = hours;
    const suffix = hours >= 12 ? 'PM' : 'AM';
    sufHours = sufHours > 12 ? sufHours - 12 : sufHours;
    sufHours = sufHours == '00' ? 12 : sufHours;

    return suffix;
  };

  render() {
    let bars;
    if (!this.props.isDay) {
      if (this.state.allDatesArray.length !== 0) {
        bars = this.state.allDatesArray.map((item, index) => {
          console.log('item', item);
          const sectionsStyles = this.getColoredSections(item);

          const sections = sectionsStyles.map((item2, index2) => {
            return (
              <TouchableWithoutFeedback
                key={index2}
                onPress={() =>
                  this.onBarPress(index, item.value, item.date, item, index2)
                }
                hitSlop={{left: 10, right: 10, top: 50, bottom: 20}}>
                <View
                  // key={index}
                  style={{
                    width: 18,
                    backgroundColor: item2.background,
                    borderRadius: 9,
                    position: 'absolute',
                    top: item2.top1,
                    height: '100%',
                  }}
                  onTouchStart={(e) => {
                    this.setState({hintTouchPosition: e.nativeEvent});
                    console.log('onTouchStart', e.nativeEvent);
                  }}>
                  <View style={item2} />
                </View>
              </TouchableWithoutFeedback>
            );
          });

          return (
            <View
              key={index}
              style={{
                maxHeight: 190,
                width: 38 * (width / 375),
                alignItems: 'center',
                opacity: item.background === 'transparent' ? 0 : 1,
                // alignSelf: "flex-end",
                overflow: 'hidden',
              }}>
              <View
                style={{
                  width: 18,
                  backgroundColor: item.background,
                  borderRadius: 9,
                  // marginTop: item.marginTop,
                  // justifyContent: "flex-end",
                  height: '100%',
                }}
                onLayout={(event) => {
                  this.findDimesions(event.nativeEvent.layout, index);
                }}>
                {sections}
              </View>
            </View>
          );
        });
      }
    } else {
      if (this.state.allDatesArray.length !== 0) {
        bars = this.state.allDatesArray.map((item, index) => {
          console.log('item', item);
          const sectionsStyles = this.getColoredSectionsDay(item);

          const sections = sectionsStyles.map((item2, index2) => {
            return (
              <TouchableWithoutFeedback
                key={index2}
                onPress={() =>
                  this.onBarPressDay(index2, item.value, item.date, item)
                }
                hitSlop={{top: 50, bottom: 20}}>
                <View
                  // key={index2}
                  style={{
                    width: width - 63,
                    backgroundColor: item2.background,
                    borderRadius: 14,
                    position: 'absolute',
                    top: item2.top1,
                    // overflow: "hidden",
                    height: '100%',
                  }}
                  onTouchStart={(e) => {
                    this.setState({hintTouchPosition: e.nativeEvent});
                    console.log('onTouchStart', e.nativeEvent);
                  }}>
                  <View style={item2} />
                </View>
              </TouchableWithoutFeedback>
            );
          });

          return (
            <View
              key={index}
              style={{
                maxHeight: 190,
                width: width - 63,
                alignItems: 'center',
                opacity: item.background === 'transparent' ? 0 : 1,
                // alignSelf: "flex-end",
                overflow: 'hidden',
              }}>
              <View
                style={{
                  width: width - 63,
                  backgroundColor: item.background,
                  borderRadius: 3.5,
                  // justifyContent: "flex-end",
                  // marginTop: item.marginTop,
                  height: '100%',
                }}
                onLayout={(event) => {
                  this.findDimesions(event.nativeEvent.layout, index);
                }}>
                {sections}
              </View>
            </View>
          );
        });
      }
    }

    console.log('this.state.barHeights', this.state.barHeights);

    return (
      <View style={{marginTop: 32}}>
        <View style={{width: width - 40, alignSelf: 'center'}}>
          <Text style={styles.title}>
            {`${Math.floor(
              this.state.averageValue / this.state.datesCount / 60,
            )}h ${Math.round(
              (this.state.averageValue / this.state.datesCount) % 60,
            )}m`}
          </Text>
          {this.props.isDay ? (
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.subtitle}>In Bed</Text>
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
              )} ${this.getMonthName(this.props.dates.substring(5, 7))}`}</Text>
            </View>
          ) : (
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.subtitle}>Avg In Bed</Text>
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
              )} - ${this.props.dates[1].substring(8, 10)} ${this.getMonthName(
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
            <Text style={[styles.axisText, {marginTop: 0}]}>11p</Text>
            <Text style={[styles.axisText, {marginTop: 33}]}>1a</Text>
            <Text style={[styles.axisText, {marginTop: 33}]}>3a</Text>
            <Text style={[styles.axisText, {marginTop: 31}]}>5a</Text>
            <Text style={[styles.axisText, {marginTop: 34}]}>7a</Text>
          </View>

          {this.props.isDay ? (
            /*<View
              style={{
                position: "absolute",
                bottom: 32,
                left: 34,
                width: width - 139,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.axisText}>12a</Text>
              <Text style={styles.axisText}>4a</Text>
              <Text style={styles.axisText}>8a</Text>
              <Text style={styles.axisText}>12p</Text>
              <Text style={styles.axisText}>4p</Text>
              <Text style={styles.axisText}>8p</Text>
            </View> */
            <View
              style={{
                position: 'absolute',
                bottom: 32,
                left: 34,
                width: width - 139,
              }}>
              {this.state.formattedResults.length !== 0 && (
                <View
                  style={{
                    position: 'absolute',
                    // bottom: 32,
                    // left: 34,
                    width: width - 139,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.axisText, {width: (width - 83) / 2}]}>
                    {`Sleep ${this.state.formattedResults[
                      this.state.formattedResults.length - 1
                    ].startDate.substring(11, 16)} ${this.formatAMPM(
                      parseInt(
                        this.state.formattedResults[
                          this.state.formattedResults.length - 1
                        ].startDate.substring(11, 13),
                      ),
                    )}`}
                  </Text>
                  <Text
                    style={[
                      styles.axisText,
                      {width: (width - 83) / 2, textAlign: 'right'},
                    ]}>
                    {`Awake ${this.state.formattedResults[0].endDate.substring(
                      11,
                      16,
                    )} ${this.formatAMPM(
                      parseInt(
                        this.state.formattedResults[0].endDate.substring(
                          11,
                          13,
                        ),
                      ),
                    )}`}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                position: 'absolute',
                bottom: 32,
                left: 34,
                width: width - 78,
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
              width: this.props.isDay ? width - 63 : width - 63,
              height: 190,
              marginLeft: this.props.isDay ? 25 : 25,
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

        <View
          style={{
            width: width - 40,
            alignSelf: 'center',
            marginTop: 25,
            flexDirection: 'row',
            marginBottom: 40,
          }}>
          <Image
            source={require('../resources/icon/sleepHint.png')}
            style={{marginRight: 20}}
          />
          <Text style={styles.sleepHint}>
            {this.props.isDay
              ? `You slept a total of ${Math.floor(
                  this.state.averageValue / this.state.datesCount / 60,
                )}h ${Math.round(
                  (this.state.averageValue / this.state.datesCount) % 60,
                )}min! \n\nSleep analysis provides insight into your sleep habits. Sleep trackers and monitors can help you determine the amount of time you are in bed and asleep. This helps Shae understand how alert or tired you might be, and how other important factors such as foods or activity can be helpful or detrimental towards your health status`
              : `Sleep has been identified as one of your most important factors for your health. Aim to be in bed during your best sleep window every night for maximum energy and focus. \n\nSleep analysis provides insight into your sleep habits. Sleep trackers and monitors can help you determine the amount of time you are in bed and asleep. This helps Shae understand how alert or tired you might be, and how other important factors such as foods or activity can be helpful or detrimental towards your health status.`}
          </Text>
        </View>

        <Dialog
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
              top: isIphoneX()
                ? this.state.hintTouchPosition.pageY - height + 440
                : Platform.OS === 'ios'
                ? this.state.hintTouchPosition.pageY - height + 340
                : this.state.hintTouchPosition.pageY - height + 360,
              // left: 19 - 24 + this.state.hintPositionX,
              left: this.props.isDay
                ? width / 2 - 100
                : this.state.hintPositionX - 105 + 30,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({isHintModalVisible: false})}
              hitSlop={{top: 500, bottom: 500, right: 500, left: 500}}>
              <View>
                <View
                  style={{
                    position: 'absolute',
                    height: 95,
                    width: this.state.hintPositionX - 105 + 30,
                    left: -(this.state.hintPositionX - 105 + 30),
                    backgroundColor: 'transparent',
                  }}
                />
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: this.props.isDay ? 170 : 170,
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
                      width: this.props.isDay ? 170 : 170,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Text style={styles.hintTitle}>{this.state.hintValue}</Text>
                    <View
                      style={{
                        marginLeft: 20,
                        marginTop: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.hintSubtitle}>
                        {this.state.hintDate}
                      </Text>
                    </View>
                  </View>
                </BoxShadow>

                {/*<Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{
                    marginTop: -8,
                    marginLeft: this.props.isDay ? 85 - 12.5 : 85 - 12.5,
                  }}
                >
                  <Svg height="30" width="75">
                    <Path
                      d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                      fill="white"
                      scale="0.05"
                    />
                  </Svg>
                </Animatable.View> */}
              </View>
            </TouchableWithoutFeedback>
          </DialogContent>
        </Dialog>
      </View>
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
  sleepHint: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
    width: width - 105,
  },
});

SleepChart.defaultProps = {};

export default SleepChart;

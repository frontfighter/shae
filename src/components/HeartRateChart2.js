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
    };

    this.allDates = [];
    this.dayHours = [];
    this.coordinates = [];
  }

  componentDidMount() {
    console.log('FoodRatingsGraphic dates', this.props.dates);

    this.getAlldates(this.props.dates, this.props.isDay);

    this.getData(this.props.dates, this.props.isDay);
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
                });
              } else {
                let value = 0;
                let minValue = 300;
                let maxValue = 0;
                let array = [];

                // let currentDate = results[0].startDate.substring(0, 10);
                let currentDate = results[0].startDate.substring(11, 13);

                let obj = {
                  [currentDate]: {
                    value: results[0].value,
                    date: results[0].startDate.substring(0, 10),
                    hours: results[0].startDate.substring(11, 13),
                    position: this.allDates.indexOf(currentDate),
                    countOfItems: 1,
                  },
                };

                for (let i = 0; i < results.length; i++) {
                  // property = results[i].startDate.substring(0, 10);
                  property = results[i].startDate.substring(11, 13);
                  if (obj.hasOwnProperty(property)) {
                    obj[property].value += results[i].value;
                    obj[property].countOfItems += 1;
                  } else {
                    obj[property] = {};
                    obj[property].date = results[i].startDate.substring(0, 10);
                    obj[property].value = results[i].value;
                    obj[property].hours = results[i].startDate.substring(
                      11,
                      13,
                    );
                    obj[property].position = this.allDates.indexOf(property);
                    obj[property].countOfItems = 1;
                  }

                  if (minValue > results[i].value) {
                    minValue = results[i].value;
                  }

                  if (maxValue < results[i].value) {
                    maxValue = results[i].value;
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

                allDatesArray = [];

                let datesCount = 0;
                for (let i = 0; i < this.dayHours.length; i++) {
                  let isItemFound = false;
                  for (let k = 0; k < array.length; k++) {
                    if (
                      parseInt(array[k].hours) === parseInt(this.dayHours[i])
                    ) {
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
                });
                console.log('allDatesArray', allDatesArray);
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

          AppleHealthKit.getHeartRateSamples(stepOptions, (err, results) => {
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
              });
            } else {
              let value = 0;
              let minValue = 300;
              let maxValue = 0;
              let array = [];

              let currentDate = results[0].startDate.substring(0, 10);
              let obj = {
                [currentDate]: {
                  value: results[0].value,
                  date: currentDate,
                  position: this.allDates.indexOf(currentDate),
                  countOfItems: 1,
                },
              };

              for (let i = 0; i < results.length; i++) {
                property = results[i].startDate.substring(0, 10);
                if (obj.hasOwnProperty(property)) {
                  obj[property].value += results[i].value;
                  obj[property].countOfItems += 1;
                } else {
                  obj[property] = {};
                  obj[property].date = property;
                  obj[property].value = results[i].value;
                  obj[property].position = this.allDates.indexOf(property);
                  obj[property].countOfItems = 1;
                }

                if (minValue > results[i].value) {
                  minValue = results[i].value;
                }

                if (maxValue < results[i].value) {
                  maxValue = results[i].value;
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

              for (let i = 0; i < this.allDates.length; i++) {
                let isItemFound = false;
                for (let k = 0; k < array.length; k++) {
                  if (array[k].date === this.allDates[i]) {
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
                datesCount += 1;

                if (this.allDates[i] === dates[1]) {
                  break;
                }
              }

              this.setState({
                allDatesArray,
                averageValue: parseInt(value / datesCount),
              });
              console.log('allDatesArray', allDatesArray);
            }
          });
        }
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
      this.setState({allDatesArray: []}, () => {
        this.getAlldates(nextProps.dates, nextProps.isDay);
        this.getData(nextProps.dates, nextProps.isDay);
      });
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
        const coef = 0.32; //0.1475;

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

        path = 'M' + 0 + ',' + (190 - Number(array[0].value) * 4 * coef + 50);
        shadowPath =
          'M' +
          0 +
          ',' +
          190 +
          ' L' +
          0 +
          ',' +
          Number(array[0].value) * 4 * coef +
          50;
        const coords =
          ' L' +
          0 +
          ',' +
          (190 - Number(array[0].value) * 4 * coef + 50) +
          ' ' +
          0 +
          ',' +
          (190 - Number(array[0].value) * 4 * coef + 50);
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
            y: 190 - array[0].value * 4 * coef + 50,
            date: firstDate.getDate() + ' ' + firstDateMonth,
            value: array[0].value,
            dayOfWeek: dayOfWeek,
          });
        }

        minY = 190 - array[0].value * 4 * coef + 50;

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

          const marginTop = 190 - value * 4 * coef + 50;
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
          path += coords;
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
            });
          }

          if (minY < marginTop) {
            minY = marginTop;
          }

          if (i === array.length - 1) {
            shadowPath +=
              ' L' +
              ((((width - 63 - 40) / 6) * (array.length - 1)) / diffDays) *
                diffDaysArray +
              ',' +
              190 +
              ' Z';
          }
        }

        console.log('this.coordinates', this.coordinates);
        console.log('minY', minY);
      } else {
        const coef = 0.32; //0.1475;

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

        path = 'M' + 0 + ',' + (190 - Number(array[0].value) * 4 * coef + 50);
        shadowPath =
          'M' +
          0 +
          ',' +
          185 +
          ' L' +
          0 +
          ',' +
          Number(array[0].value) * 4 * coef +
          50;
        const coords =
          ' L' +
          0 +
          ',' +
          (190 - Number(array[0].value) * 4 * coef + 50) +
          ' ' +
          0 +
          ',' +
          (190 - Number(array[0].value) * 4 * coef + 50);
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
            y: 190 - array[0].value * 4 * coef + 50,
            date: firstDate.getDate() + ' ' + firstDateMonth,
            value: array[0].value,
            dayOfWeek,
          });
        }

        minY = 190 - array[0].value * 4 * coef + 50;

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

          const marginTop = 190 - value * 4 * coef + 50;
          const coords =
            ' L' +
            ((((width - 63 - 40) / 23) * (array.length - 1)) / diffDays) *
              diffDaysArray +
            ',' +
            marginTop +
            ' ' +
            ((((width - 63 - 40) / 23) * (array.length - 1)) / diffDays) *
              diffDaysArray +
            ',' +
            marginTop;
          console.log('coords', coords);
          path += coords;
          shadowPath += coords;

          let month = arrayDate.toLocaleString('en-us', {month: 'short'});
          month = Platform.OS === 'android' ? month.substr(4, 3) : month;
          if (array[i].value !== 0) {
            this.coordinates.push({
              x:
                ((((width - 63 - 40) / 23) * (array.length - 1)) / diffDays) *
                diffDaysArray,
              y: marginTop,
              date: this.props.isDay
                ? array[i].hour + i
                : arrayDate.getDate() + ' ' + month,
              value: array[i].value,
              dayOfWeek,
            });
          }

          if (minY < marginTop) {
            minY = marginTop;
          }

          if (i === array.length - 1) {
            shadowPath +=
              ' L' +
              ((((width - 63 - 40) / 23) * (array.length - 1)) / diffDays) *
                diffDaysArray +
              ',' +
              190 +
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
            key={this.props.isDay ? data.hours : data.date}
            hitSlop={{top: 25, bottom: 25, left: 10, right: 25}}
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
                  hintIndex: index,
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
              }}
            />
          </TouchableWithoutFeedback>
        );
      });
    }

    return (
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
              )} ${this.getMonthName(this.props.dates.substring(5, 7))}`}</Text>
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
            <Text style={[styles.axisText, {marginTop: 0}]}>190</Text>
            <Text style={[styles.axisText, {marginTop: 33}]}>155</Text>
            <Text style={[styles.axisText, {marginTop: 33}]}>120</Text>
            <Text style={[styles.axisText, {marginTop: 31}]}>85</Text>
            <Text style={[styles.axisText, {marginTop: 34}]}>50</Text>
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
              marginTop: 7.5 + 7.5,
              width: width - 63 - 35,
              height: 185,
              marginLeft: this.props.isDay ? 40 - 10 : 25 - 10,
              // flexDirection: "row",
              // justifyContent: "space-between",
            }}>
            {/* bars */}

            {path !== null && (
              <View style={{position: 'absolute', left: 26}}>
                <Svg height={185} width={width - 63 - 35}>
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
                <Svg height={185} width={width - 63 - 35}>
                  <Path
                    d={path}
                    fill="none"
                    stroke={'rgb(244,88,152)'}
                    strokeWidth={1.5}
                  />
                </Svg>
              </View>
            )}

            {touchableItems}
          </View>
        </View>

        {!this.props.isDay &&
          this.state.averageValue !== 0 &&
          this.state.isHintModalVisible && (
            <View>
              {parseFloat(this.state.hintValue - this.state.runningKm).toFixed(
                1,
              ) !== 0.0 && (
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
                    <Text style={styles.additionalCardTitle}>Heart Rate</Text>
                    <Text style={styles.additionalCardText}>
                      {`${parseInt(this.state.minValue)} - ${parseInt(
                        this.state.maxValue,
                      )}`}
                      <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                        {' '}
                        BPM
                      </Text>
                    </Text>
                  </View>
                </View>
              )}

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
                    Resting Heart Rate
                  </Text>
                  <Text style={styles.additionalCardText}>
                    {72}
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
                  source={require('../resources/icon/workout_green.png')}
                  style={{marginRight: 15, marginLeft: 20}}
                />
                <View>
                  <Text style={styles.additionalCardTitle}>
                    Workout Heart Rate
                  </Text>
                  <Text style={styles.additionalCardText}>
                    109 - 136
                    <Text style={[styles.additionalCardText, {fontSize: 14}]}>
                      {' '}
                      BPM
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

        <View
          style={{
            width: width - 40,
            alignSelf: 'center',
            flexDirection: 'row',
            marginTop: 25,
          }}>
          <Image
            source={require('../resources/icon/heartHint.png')}
            style={{marginRight: 20}}
          />
          <Text style={styles.heartHint}>
            Last week your average steps increase by 5,968 than your weekly
            average.
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
              top: isIphoneX() ? -160 : -70,
              left: this.state.hintPositionX - 5,
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({isHintModalVisible: false})}>
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
                      width: this.props.isDay ? 180 : 190,
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
                      width: this.props.isDay ? 180 : 190,
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
                      <Text style={styles.hintSubtitle}>{`${
                        this.state.hintDate
                      } ${
                        this.props.isDay ? this.state.hintHours + ':00' : ''
                      }`}</Text>
                    </View>
                  </View>
                </BoxShadow>

                <View
                  style={{
                    marginTop: 0,
                    marginLeft: this.props.isDay
                      ? 49 + this.state.hintIndex * 5.5
                      : 45 -
                        this.state.hintIndex * 1.5 +
                        (Platform.OS === 'ios'
                          ? 6.5 - this.state.hintIndex - 4
                          : 3) +
                        (this.state.hintIndex * (width - 360)) / 6,
                    width: 2,
                    height:
                      Platform.OS === 'ios'
                        ? this.state.hintPositionY + 28
                        : this.state.hintPositionY + 28,
                    borderRadius: 1,
                    backgroundColor: 'rgb(221,224,228)',
                    zIndex: 1,
                  }}
                />
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

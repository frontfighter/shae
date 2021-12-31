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
import Dash from 'react-native-dash';
import {isIphoneX} from 'react-native-iphone-x-helper';
import Dialog, {
  FadeAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import {BoxShadow} from 'react-native-shadow';
import * as Animatable from 'react-native-animatable';
import Svg, {Path, G} from 'react-native-svg';

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

class CaloriesGraphic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDatesArray: [],
      isHintModalVisible: false,
      hintPositionX: 0,
      hintDate: '',
      hintValue: '',
      hintIndex: 0,
      barHeights: {},
      maxChartValue: 1,
      yAxis: [],
    };

    this.allDates = [];
  }

  componentDidMount() {
    console.log('CaloriesGraphic dates', this.props.dates);
    this.setState({maxChartValue: this.props.goal + 500}, () => {
      this.getYaxis(this.state.maxChartValue);
    });
    console.log('maxChartValue', this.props.goal + 500);

    this.getAlldates(this.props.dates);
  }

  getYaxis = (value) => {
    let array = [0];
    const divider = parseInt(value / 4); // 4000 / 4 = 1000

    array.push(parseFloat(divider / 1000).toFixed(2) + 'k');
    array.push(parseFloat((divider * 2) / 1000).toFixed(2) + 'k');
    array.push(parseFloat((divider * 3) / 1000).toFixed(2) + 'k');
    array.push(parseFloat((divider * 4) / 1000).toFixed(2) + 'k');

    this.setState({yAxis: array});

    console.log('getYaxis', array);
  };

  getAlldates = (dates) => {
    this.allDates = [];
    this.allDates.push(dates[0]);

    for (let i = 1; i < 6; i++) {
      let date = new Date(dates[0]);
      date.setDate(date.getDate() + i);

      let todayOffsetHours = -date.getTimezoneOffset() / 60;
      date.setHours(date.getHours() + todayOffsetHours);

      this.allDates.push(date.toISOString().slice(0, 10));
    }

    // if (dates[0] === dates[1]) {
    let date = new Date(dates[0]);
    date.setDate(date.getDate() + 6);

    let todayOffsetHours = -date.getTimezoneOffset() / 60;
    date.setHours(date.getHours() + todayOffsetHours);

    this.allDates.push(date.toISOString().slice(0, 10));
    // } else {
    //   this.allDates.push(dates[1]);
    // }

    console.log('this.allDates', this.allDates);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('CaloriesGraphic data', nextProps.data);
    this.getAlldates(nextProps.dates);

    // [ { frgrp_54: 100, date: '2020-05-04' },
    //  { frgrp_54: 100, date: '2020-05-05' },
    //   { frgrp_21: 100, date: '2020-05-06' },
    //  { frgrp_21: 28.57, date: '2020-05-07', frgrp_54: 71.43 },
    //   { frgrp_54: 125, date: '2020-05-09', frgrp_avoid: -25 } ]

    if (nextProps.goal !== this.props.goal) {
      this.setState({maxChartValue: nextProps.goal + 500}, () => {
        this.getYaxis(this.state.maxChartValue);
      });
    }

    if (nextProps.data.length !== 0) {
      let array = [];
      for (let i = 0; i < nextProps.data.length; i++) {
        let countOfItems = 0;
        let item = {value: 0};
        if (nextProps.data[i].hasOwnProperty('Breakfast')) {
          countOfItems += 1;
          item.Breakfast = nextProps.data[i].Breakfast;
          item.value += nextProps.data[i].Breakfast;
        }

        if (nextProps.data[i].hasOwnProperty('Lunch')) {
          countOfItems += 1;
          item.Lunch = nextProps.data[i].Lunch;
          item.value += nextProps.data[i].Lunch;
        }

        if (nextProps.data[i].hasOwnProperty('Dinner')) {
          countOfItems += 1;
          item.Dinner = nextProps.data[i].Dinner;
          item.value += nextProps.data[i].Dinner;
        }

        if (nextProps.data[i].hasOwnProperty('Snacks')) {
          countOfItems += 1;
          item.Snacks = nextProps.data[i].Snacks;
          item.value += nextProps.data[i].Snacks;
        }

        // if (nextProps.data[i].hasOwnProperty("Morning Snack")) {
        //   countOfItems += 1;
        //   item.Snacks += nextProps.data[i]["Morning Snack"];
        //   item.value += nextProps.data[i]["Morning Snack"];
        // }
        //
        // if (nextProps.data[i].hasOwnProperty("Evening Snack")) {
        //   countOfItems += 1;
        //   item.Snacks += nextProps.data[i]["Evening Snack"];
        //   item.value += nextProps.data[i]["Evening Snack"];
        // }

        item.countOfItems = countOfItems;
        item.date = nextProps.data[i].date;
        item.position = this.allDates.indexOf(item.date);

        console.log('componentWillReceiveProps', this.allDates, item.date);

        array.push(item);
      }

      console.log('CaloriesGraphic array', array);

      // height 184 width 18

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
          allDatesArray.push({background: 'transparent', countOfItems: 0});
        }
      }

      this.setState({allDatesArray});
    }
  }

  getColoredSections = (item) => {
    if (item.countOfItems === 4) {
      return [
        {
          height:
            item.Snacks + item.Dinner + item.Lunch + item.Breakfast >
            this.state.maxChartValue
              ? ((this.state.maxChartValue -
                  item.Dinner -
                  item.Lunch -
                  item.Breakfast) /
                  this.state.maxChartValue) *
                  190 -
                4 / 5 -
                6
              : (item.Snacks / this.state.maxChartValue) * 190 - 4 / 5,
          backgroundColor: 'rgb(0,164,228)',
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (item.Dinner / this.state.maxChartValue) * 190 - 4 / 5,
          backgroundColor: 'rgb(0,187,116)',
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (item.Lunch / this.state.maxChartValue) * 190 - 4 / 5,
          backgroundColor: 'rgb(245,121,75)',
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (item.Breakfast / this.state.maxChartValue) * 190 - 4 / 5,
          backgroundColor: 'rgb(244,88,152)',
          borderRadius: 2,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
          marginTop: 2,
          width: 18,
        },
      ];
    } else if (item.countOfItems === 3) {
      let propName = '';
      let propName2 = '';
      let propName3 = '';
      let propColor = '';
      let propColor2 = '';
      let propColor3 = '';

      if (item.hasOwnProperty('Snacks')) {
        propName = item.Snacks;
        propColor = 'rgb(0,164,228)';
      } else if (item.hasOwnProperty('Dinner')) {
        propName = item.Dinner;
        propColor = 'rgb(0,187,116)';
      }

      if (item.hasOwnProperty('Dinner') && propName !== item.Dinner) {
        propName2 = item.Dinner;
        propColor2 = 'rgb(0,187,116)';
      } else if (item.hasOwnProperty('Lunch')) {
        propName2 = item.Lunch;
        propColor2 = 'rgb(245,121,75)';
      }

      if (item.hasOwnProperty('Lunch') && propName2 !== item.Lunch) {
        propName3 = item.Lunch;
        propColor3 = 'rgb(245,121,75)';
      } else if (item.hasOwnProperty('Breakfast')) {
        propName3 = item.Breakfast;
        propColor3 = 'rgb(244,88,152)';
      }

      return [
        {
          height:
            propName + propName2 + propName3 > this.state.maxChartValue
              ? ((this.state.maxChartValue - propName2 - propName3) /
                  this.state.maxChartValue) *
                  190 -
                4 / 5 -
                4
              : (propName / this.state.maxChartValue) * 190 - 3 / 4,
          backgroundColor: propColor,
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (propName2 / this.state.maxChartValue) * 190 - 3 / 4,
          backgroundColor: propColor2,
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (propName3 / this.state.maxChartValue) * 190 - 3 / 4,
          backgroundColor: propColor3,
          borderRadius: 2,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
          marginTop: 2,
          width: 18,
        },
      ];
    } else if (item.countOfItems === 2) {
      let propName = '';
      let propName2 = '';
      let propColor = '';
      let propColor2 = '';

      if (item.hasOwnProperty('Snacks')) {
        propName = item.Snacks;
        propColor = 'rgb(0,164,228)';
      } else if (item.hasOwnProperty('Dinner')) {
        propName = item.Dinner;
        propColor = 'rgb(0,187,116)';
      } else if (item.hasOwnProperty('Lunch')) {
        propName = item.Lunch;
        propColor = 'rgb(245,121,75)';
      }

      if (item.hasOwnProperty('Dinner') && propName !== item.Dinner) {
        propName2 = item.Dinner;
        propColor2 = 'rgb(0,187,116)';
      } else if (item.hasOwnProperty('Lunch') && propName !== item.Lunch) {
        propName2 = item.Lunch;
        propColor2 = 'rgb(245,121,75)';
      } else {
        propName2 = item.Breakfast;
        propColor2 = 'rgb(244,88,152)';
      }

      return [
        {
          height:
            propName + propName2 > this.state.maxChartValue
              ? ((this.state.maxChartValue - propName2) /
                  this.state.maxChartValue) *
                  190 -
                4 / 5 -
                2
              : (propName / this.state.maxChartValue) * 190 - 1,
          backgroundColor: propColor,
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (propName2 / this.state.maxChartValue) * 190 - 1,
          backgroundColor: propColor2,
          borderRadius: 2,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
          marginTop: 2,
          width: 18,
        },
      ];
    } else if (item.countOfItems === 1) {
      let propName;
      let color;
      if (item.hasOwnProperty('Snacks')) {
        propName = item.Snacks;
        color = 'rgb(0,164,228)';
      } else if (item.hasOwnProperty('Dinner')) {
        propName = item.Dinner;
        color = 'rgb(0,187,116)';
      } else if (item.hasOwnProperty('Lunch')) {
        propName = item.Lunch;
        color = 'rgb(245,121,75)';
      } else {
        propName = item.Breakfast;
        color = 'rgb(244,88,152)';
      }

      return [
        {
          height: (propName / this.state.maxChartValue) * 190,
          backgroundColor: color,
          borderRadius: 9,
          width: 18,
        },
      ];
    } else return [];
  };

  onBarPress = (index, value, date, item) => {
    if (item.countOfItems !== 0) {
      this.props.onHint();
      console.log('onBarPress', item);
      this.setState({
        hintPositionX: index * (26 + 10 + 9),
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
    console.log('findDimesions', index);
    console.log(x);
    console.log(y);
    console.log(width);
    console.log(height);

    let obj = this.state.barHeights;
    obj[index] = height;

    this.setState({barHeights: obj});
  };

  // nearestThousand = (n) => {
  //   return Math.ceil(n / 1000) * 1000;
  // };

  render() {
    let bars;
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
            onPress={() => this.onBarPress(index, item.value, item.date, item)}
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

      console.log('bars.length', bars.length);
    }

    return (
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
            width: 19,
            alignItems: 'flex-end',
          }}>
          <Text style={[styles.axisText, {marginTop: 0, width: 30}]}>
            {this.state.yAxis[4]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 33, width: 30}]}>
            {this.state.yAxis[3]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 33, width: 30}]}>
            {this.state.yAxis[2]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 31, width: 30}]}>
            {this.state.yAxis[1]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 34, width: 30}]}>
            {this.state.yAxis[0]}
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 32,
            left: 34,
            // width: width - 85,
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

        <Dash
          dashColor="rgb(148,155,162)"
          style={{
            position: 'absolute',
            width: width - 63,
            height: 1.5,
            left: 23,
            top: 198 - (this.props.goal / this.state.maxChartValue) * 190,
          }}
        />

        <View
          style={{
            marginTop: 7.5,
            width: width - 63,
            height: 190,
            marginLeft: 25,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {bars}
        </View>

        <Dialog
          visible={this.state.isHintModalVisible}
          containerStyle={{marginTop: Platform.OS === 'ios' ? -150 : -200}}
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
              onPress={() => this.setState({isHintModalVisible: false})}>
              <View>
                <View
                  style={{
                    position: 'absolute',
                    height: 105,
                    width: width + 19 - 24 + this.state.hintPositionX,
                    left: -(19 - 24 + this.state.hintPositionX),
                    backgroundColor: 'rgb(255,255,255)',
                  }}
                />
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: 120, //150
                      height: 105,
                      y: 6,
                      border: 16,
                      radius: 4,
                      opacity: 0.08,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 105,
                      width: 120, //150
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <Text style={styles.cardTitle}>
                      {this.state.hintValue.toLocaleString('en-US')}
                    </Text>
                    <View
                      style={{
                        marginLeft: 20,
                        marginTop: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.cardText}>Kcal</Text>
                      <View
                        style={{
                          width: 3,
                          height: 3,
                          borderRadius: 1.5,
                          backgroundColor: 'rgb(173,179,183)',
                          marginHorizontal: 8,
                        }}
                      />
                      <Text
                        style={
                          styles.cardText
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
                    marginLeft:
                      47 +
                      2 -
                      this.state.hintIndex * 1.5 +
                      (this.state.hintIndex * (width - 360)) / 6,
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

                {/*<Animatable.View animation='fadeIn' delay={10} duration={200} style={{marginTop: -8, marginLeft: 25}}>
              <Svg
                height="30"
                width="75"
              >
                <Path
                  d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                  fill="white"
                  scale="0.05"
                />
              </Svg>
            </Animatable.View>*/}
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
  cardTitle: {
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
    fontSize: 32,
    color: 'rgb(31,33,35)',
    marginTop: 20,
    marginLeft: 20,
  },
  cardText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    letterSpacing: -0.31,
    color: 'rgb(148,155,162)',
  },
});

CaloriesGraphic.defaultProps = {};

export default CaloriesGraphic;

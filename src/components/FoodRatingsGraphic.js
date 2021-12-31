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

class FoodRatingsGraphic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDatesArray: [],
      isHintModalVisible: false,
      hintPositionX: 0,
      hintDate: '',
      hintValue: '',
      hintIndex: 0,
      hintItem: {},
      hintCountOfItems: 0,
    };

    this.allDates = [];
  }

  componentDidMount() {
    console.log('FoodRatingsGraphic dates', this.props.dates);

    this.getAlldates(this.props.dates);
  }

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
    console.log('FoodRatingsGraphic foodRatingData', nextProps.foodRatingData);
    this.getAlldates(nextProps.dates);

    // [ { frgrp_54: 100, date: '2020-05-04' },
    //  { frgrp_54: 100, date: '2020-05-05' },
    //   { frgrp_21: 100, date: '2020-05-06' },
    //  { frgrp_21: 28.57, date: '2020-05-07', frgrp_54: 71.43 },
    //   { frgrp_54: 125, date: '2020-05-09', frgrp_avoid: -25 } ]

    if (nextProps.foodRatingData.length !== 0) {
      let array = [];
      for (let i = 0; i < nextProps.foodRatingData.length; i++) {
        let countOfItems = 0;
        let item = {};
        if (nextProps.foodRatingData[i].hasOwnProperty('frgrp_54')) {
          countOfItems += 1;
          item.frgrp_54 = nextProps.foodRatingData[i].frgrp_54;
        }

        if (nextProps.foodRatingData[i].hasOwnProperty('frgrp_21')) {
          countOfItems += 1;
          item.frgrp_21 = nextProps.foodRatingData[i].frgrp_21;
        }

        if (nextProps.foodRatingData[i].hasOwnProperty('frgrp_avoid')) {
          countOfItems += 1;
          item.frgrp_avoid = nextProps.foodRatingData[i].frgrp_avoid;
        }

        item.countOfItems = countOfItems;
        item.date = nextProps.foodRatingData[i].date;
        item.position = this.allDates.indexOf(item.date);

        array.push(item);
      }

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
    if (item.countOfItems === 3) {
      return [
        {
          height: (item.frgrp_avoid / 100) * 190 - 3 / 4,
          backgroundColor: 'rgb(228,77,77)',
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (item.frgrp_21 / 100) * 190 - 3 / 4,
          backgroundColor: 'rgb(234,196,50)',
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (item.frgrp_54 / 100) * 190 - 3 / 4,
          backgroundColor: 'rgb(0,187,116)',
          borderRadius: 2,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
          marginTop: 2,
          width: 18,
        },
      ];
    } else if (item.countOfItems === 2) {
      let propName = item.hasOwnProperty('frgrp_avoid')
        ? item.frgrp_avoid
        : item.frgrp_21;
      let propName2 = item.hasOwnProperty('frgrp_54')
        ? item.frgrp_54
        : item.frgrp_21;
      return [
        {
          height: (propName / 100) * 190 - 1,
          backgroundColor: item.hasOwnProperty('frgrp_avoid')
            ? 'rgb(228,77,77)'
            : 'rgb(234,196,50)',
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (propName2 / 100) * 190 - 1,
          backgroundColor: item.hasOwnProperty('frgrp_54')
            ? 'rgb(0,187,116)'
            : 'rgb(234,196,50)',
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
      if (item.hasOwnProperty('frgrp_avoid')) {
        propName = item.frgrp_avoid;
        color = 'rgb(228,77,77)';
      } else if (item.hasOwnProperty('frgrp_21')) {
        propName = item.frgrp_21;
        color = 'rgb(234,196,50)';
      } else {
        propName = item.frgrp_54;
        color = 'rgb(0,187,116)';
      }

      return [
        {
          height: (propName / 100) * 190,
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

      let count = 0;
      if (item.hasOwnProperty('frgrp_54')) {
        count += 1;
      }

      if (item.hasOwnProperty('frgrp_21')) {
        count += 1;
      }

      if (item.hasOwnProperty('frgrp_avoid')) {
        count += 1;
      }

      this.setState({
        hintPositionX: isIphoneX()
          ? index * 45
          : Platform.OS === 'ios'
          ? index * 39
          : index * 36.75,
        hintDate: date,
        hintValue: value,
        isHintModalVisible: true,
        hintIndex: index,
        hintItem: item,
        hintCountOfItems: count,
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
            onPress={() => this.onBarPress(index, item.value, item.date, item)}>
            <View
              style={{
                height: 190,
                width: 38 * (width / 375),
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: 190,
                  width: 18,
                  backgroundColor: item.background,
                  borderRadius: 9,
                }}>
                {sections}
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      });
    }

    let marginTopMod = 0;
    if (this.state.hintCountOfItems === 2) {
      marginTopMod = 54;
    } else if (this.state.hintCountOfItems === 1) {
      marginTopMod = 98;
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
          <Text style={[styles.axisText, {marginTop: 0}]}>100</Text>
          <Text style={[styles.axisText, {marginTop: 33}]}>75</Text>
          <Text style={[styles.axisText, {marginTop: 33}]}>50</Text>
          <Text style={[styles.axisText, {marginTop: 31}]}>25</Text>
          <Text style={[styles.axisText, {marginTop: 34}]}>0</Text>
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
              top: isIphoneX() ? -240 + marginTopMod : -150 + marginTopMod,
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({isHintModalVisible: false})}>
              <View>
                <View
                  style={{
                    position: 'absolute',
                    height:
                      this.state.hintCountOfItems === 3
                        ? 195
                        : this.state.hintCountOfItems === 2
                        ? 141
                        : 97,
                    width: width - 40,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                  }}
                />
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: width - 40,
                      height:
                        this.state.hintCountOfItems === 3
                          ? 195
                          : this.state.hintCountOfItems === 2
                          ? 141
                          : 97,
                      y: 6,
                      border: 16,
                      radius: 4,
                      opacity: 0.08,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      width: width - 40,
                      height:
                        this.state.hintCountOfItems === 3
                          ? 195
                          : this.state.hintCountOfItems === 2
                          ? 141
                          : 97,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                      flexDirection: 'row',
                    }}>
                    <View style={{marginTop: 20, marginLeft: 20}}>
                      <Text style={styles.monthName}>{`${this.getMonthName(
                        this.state.hintDate.substring(5, 7),
                      )}`}</Text>
                      <Text style={styles.dayText}>
                        {this.state.hintDate.substring(8, 10)}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 0.5,
                        height:
                          this.state.hintCountOfItems === 3
                            ? 195 - 44
                            : this.state.hintCountOfItems === 2
                            ? 141 - 44
                            : 97 - 44,
                        backgroundColor: 'rgb(238,240,244)',
                        position: 'absolute',
                        top: 22,
                        left: 65,
                      }}
                    />

                    <View style={{marginTop: 20, marginLeft: 47}}>
                      {this.state.hintItem.hasOwnProperty('frgrp_54') && (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(0,187,116)',
                                marginRight: 8,
                              }}
                            />

                            <Text style={styles.hintTitle}>
                              Excellent & Great Food
                            </Text>
                          </View>

                          <Text
                            style={
                              styles.hintPercentage
                            }>{`${this.state.hintItem.frgrp_54}%`}</Text>
                        </View>
                      )}

                      {this.state.hintItem.hasOwnProperty('frgrp_21') && (
                        <View
                          style={{
                            marginTop: this.state.hintItem.hasOwnProperty(
                              'frgrp_54',
                            )
                              ? 16
                              : 0,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(234,196,50)',
                                marginRight: 8,
                              }}
                            />

                            <Text style={styles.hintTitle}>
                              Good, OK, Sometimes Food
                            </Text>
                          </View>

                          <Text
                            style={
                              styles.hintPercentage
                            }>{`${this.state.hintItem.frgrp_21}%`}</Text>
                        </View>
                      )}

                      {this.state.hintItem.hasOwnProperty('frgrp_avoid') && (
                        <View
                          style={{
                            marginTop:
                              this.state.hintItem.hasOwnProperty('frgrp_54') ||
                              this.state.hintItem.hasOwnProperty('frgrp_21')
                                ? 16
                                : 0,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: 'rgb(228,77,77)',
                                marginRight: 8,
                              }}
                            />

                            <Text style={styles.hintTitle}>Avoid Food</Text>
                          </View>

                          <Text
                            style={
                              styles.hintPercentage
                            }>{`${this.state.hintItem.frgrp_avoid}%`}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </BoxShadow>

                {/*<View
                  style={{
                    marginTop: 0,
                    marginLeft:
                      45 +
                      this.state.hintPositionX +
                      this.state.hintIndex * 6.5,
                    width: 2,
                    height: Platform.OS === "ios" ? 16 : 22,
                    borderRadius: 1,
                    backgroundColor: "rgb(221,224,228)",
                    zIndex: 1,
                  }}
                /> */}

                {/*<Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{
                    marginTop: -8,
                    marginLeft: isIphoneX()
                      ? 45 + this.state.hintPositionX
                      : 43 + this.state.hintPositionX,
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
    color: 'rgb(141,147,151)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
  },
  hintPercentage: {
    color: 'rgb(54,58,61)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: -0.3,
  },
});

FoodRatingsGraphic.defaultProps = {};

export default FoodRatingsGraphic;

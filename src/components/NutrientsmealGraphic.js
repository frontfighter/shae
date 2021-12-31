import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window');

class NutrientsMealGraphic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDatesArray: [],
    };

    this.allDates = [];
  }

  componentDidMount() {
    console.log('NutrientsMealGraphic dates', this.props.dates);
    console.log('NutrientsMealGraphic data', this.props.data);

    this.getAlldates(this.props.dates);

    if (this.props.data.length !== 0) {
      let array = [];
      for (let i = 0; i < this.props.data.length; i++) {
        let countOfItems = 0;
        let item = {};
        if (
          this.props.data[i].hasOwnProperty('Breakfast') &&
          this.props.data[i].Breakfast !== 0
        ) {
          countOfItems += 1;
          item.Breakfast = this.props.data[i].Breakfast;
          item.BreakfastValue = this.props.data[i].BreakfastValue;
        }

        if (
          this.props.data[i].hasOwnProperty('Lunch') &&
          this.props.data[i].Lunch !== 0
        ) {
          countOfItems += 1;
          item.Lunch = this.props.data[i].Lunch;
          item.LunchValue = this.props.data[i].LunchValue;
        }

        if (
          this.props.data[i].hasOwnProperty('Dinner') &&
          this.props.data[i].Dinner !== 0
        ) {
          countOfItems += 1;
          item.Dinner = this.props.data[i].Dinner;
          item.DinnerValue = this.props.data[i].DinnerValue;
        }

        if (
          this.props.data[i].hasOwnProperty('Snacks') &&
          this.props.data[i].Snacks !== 0
        ) {
          countOfItems += 1;
          item.Snacks = this.props.data[i].Snacks;
          item.SnacksValue = this.props.data[i].SnacksValue;
        }

        item.countOfItems = countOfItems;
        item.date = this.props.data[i].date;
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
    console.log('NutrientsMealGraphic data', nextProps.data);
    this.getAlldates(nextProps.dates);

    // [ { frgrp_54: 100, date: '2020-05-04' },
    //  { frgrp_54: 100, date: '2020-05-05' },
    //   { frgrp_21: 100, date: '2020-05-06' },
    //  { frgrp_21: 28.57, date: '2020-05-07', frgrp_54: 71.43 },
    //   { frgrp_54: 125, date: '2020-05-09', frgrp_avoid: -25 } ]

    if (nextProps.data.length !== 0) {
      let array = [];
      for (let i = 0; i < nextProps.data.length; i++) {
        let countOfItems = 0;
        let item = {};
        if (
          nextProps.data[i].hasOwnProperty('Breakfast') &&
          nextProps.data[i].Breakfast !== 0
        ) {
          countOfItems += 1;
          item.Breakfast = nextProps.data[i].Breakfast;
          item.BreakfastValue = nextProps.data[i].Breakfast;
        }

        if (
          nextProps.data[i].hasOwnProperty('Lunch') &&
          nextProps.data[i].Lunch !== 0
        ) {
          countOfItems += 1;
          item.Lunch = nextProps.data[i].Lunch;
          item.LunchValue = nextProps.data[i].Lunch;
        }

        if (
          nextProps.data[i].hasOwnProperty('Dinner') &&
          nextProps.data[i].Dinner !== 0
        ) {
          countOfItems += 1;
          item.Dinner = nextProps.data[i].Dinner;
          item.DinnerValue = nextProps.data[i].Dinner;
        }

        if (
          nextProps.data[i].hasOwnProperty('Snacks') &&
          nextProps.data[i].Snacks !== 0
        ) {
          countOfItems += 1;
          item.Snacks = nextProps.data[i].Snacks;
          item.SnacksValue = nextProps.data[i].Snacks;
        }

        item.countOfItems = countOfItems;
        item.date = nextProps.data[i].date;
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
    console.log('getColoredSections item', item);
    if (item.countOfItems === 4) {
      return [
        {
          height: (item.Snacks / this.props.maxValue) * 190 - 4 / 5 - 4,
          backgroundColor: 'rgb(0,164,228)',
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (item.Dinner / this.props.maxValue) * 190 - 4 / 5,
          backgroundColor: 'rgb(0,187,116)',
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (item.Lunch / this.props.maxValue) * 190 - 4 / 5,
          backgroundColor: 'rgb(245,121,75)',
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (item.Breakfast / this.props.maxValue) * 190 - 4 / 5,
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
      let propValue = 0;
      let propName2 = '';
      let propValue2 = 0;
      let propName3 = '';
      let propValue3 = 0;
      let propColor = '';
      let propColor2 = '';
      let propColor3 = '';
      let prop1Name = '';
      let prop2Name = '';

      if (item.hasOwnProperty('Snacks')) {
        propName = item.Snacks;
        propColor = 'rgb(0,164,228)';
        propValue = item.Snacks;
        prop1Name = 'Snacks';
      } else if (item.hasOwnProperty('Dinner')) {
        propName = item.Dinner;
        prop1Name = 'Dinner';
        propColor = 'rgb(0,187,116)';
        propValue = item.Dinner;
      }

      if (item.hasOwnProperty('Dinner') && prop1Name !== 'Dinner') {
        propName2 = item.Dinner;
        propColor2 = 'rgb(0,187,116)';
        propValue2 = item.Dinner;
        prop2Name = 'Dinner';
      } else if (item.hasOwnProperty('Lunch')) {
        propName2 = item.Lunch;
        propColor2 = 'rgb(245,121,75)';
        propValue2 = item.Lunch;
        prop2Name = 'Lunch';
      }

      if (item.hasOwnProperty('Lunch') && prop2Name !== 'Lunch') {
        propName3 = item.Lunch;
        propColor3 = 'rgb(245,121,75)';
        propValue3 = item.Lunch;
      } else if (item.hasOwnProperty('Breakfast')) {
        propName3 = item.Breakfast;
        propColor3 = 'rgb(244,88,152)';
        propValue3 = item.Breakfast;
      }

      return [
        {
          height: (propValue / this.props.maxValue) * 190 - 3 / 4 - 2,
          backgroundColor: propColor,
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (propValue2 / this.props.maxValue) * 190 - 3 / 4,
          backgroundColor: propColor2,
          borderRadius: 2,
          marginTop: 2,
          width: 18,
        },
        {
          height: (propValue3 / this.props.maxValue) * 190 - 3 / 4,
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
      let propValue = 0;
      let propName2 = '';
      let propValue2 = 0;
      let propColor = '';
      let propColor2 = '';
      let prop1Name = '';

      if (item.hasOwnProperty('Snacks')) {
        propName = item.Snacks;
        propColor = 'rgb(0,164,228)';
        prop1Name = 'Snacks';
        propValue = item.Snacks;
      } else if (item.hasOwnProperty('Dinner')) {
        propName = item.Dinner;
        propColor = 'rgb(0,187,116)';
        prop1Name = 'Dinner';
        propValue = item.Dinner;
      } else if (item.hasOwnProperty('Lunch')) {
        propName = item.Lunch;
        propColor = 'rgb(245,121,75)';
        prop1Name = 'Lunch';
        propValue = item.Lunch;
      }

      if (item.hasOwnProperty('Dinner') && prop1Name !== 'Dinner') {
        propName2 = item.Dinner;
        propColor2 = 'rgb(0,187,116)';
        propValue2 = item.Dinner;
      } else if (item.hasOwnProperty('Lunch') && prop1Name !== 'Lunch') {
        propName2 = item.Lunch;
        propColor2 = 'rgb(245,121,75)';
        propValue2 = item.Lunch;
      } else {
        propName2 = item.Breakfast;
        propColor2 = 'rgb(244,88,152)';
        propValue2 = item.Breakfast;
      }

      return [
        {
          height: (propValue / this.props.maxValue) * 190 - 1 - 1,
          backgroundColor: propColor,
          borderRadius: 2,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
          width: 18,
        },
        {
          height: (propValue2 / this.props.maxValue) * 190 - 1,
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
      let propValue = 0;
      let color;
      if (item.hasOwnProperty('Snacks')) {
        propName = item.Snacks;
        propValue = item.Snacks;
        color = 'rgb(0,164,228)';
      } else if (item.hasOwnProperty('Dinner')) {
        propName = item.Dinner;
        propValue = item.Dinner;
        color = 'rgb(0,187,116)';
      } else if (item.hasOwnProperty('Lunch')) {
        propName = item.Lunch;
        propValue = item.Lunch;
        color = 'rgb(245,121,75)';
      } else {
        propName = item.Breakfast;
        propValue = item.Breakfast;
        color = 'rgb(244,88,152)';
      }

      console.log('countOfItems 1', propValue, this.props.maxValue);

      return [
        {
          height: (propValue / this.props.maxValue) * 190,
          backgroundColor: color,
          borderRadius: 9,
          width: 18,
        },
      ];
    } else return [];
  };

  render() {
    let bars;
    if (this.state.allDatesArray.length !== 0) {
      bars = this.state.allDatesArray.map((item, index) => {
        console.log('allDatesArray item', item);
        const sectionsStyles = this.getColoredSections(item);
        console.log('sectionsStyles', sectionsStyles);

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
          <View
            key={index}
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
              }}>
              {sections}
            </View>
          </View>
        );
      });
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
            minWidth: 19,
            alignItems: 'flex-end',
          }}>
          <Text style={[styles.axisText, {marginTop: 1, width: 38}]}>
            {this.props.yAxis[4]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 34, width: 38}]}>
            {this.props.yAxis[3]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 34, width: 38}]}>
            {this.props.yAxis[2]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 34, width: 38}]}>
            {this.props.yAxis[1]}
          </Text>
          <Text style={[styles.axisText, {marginTop: 34, width: 38}]}>
            {this.props.yAxis[0]}
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
  button: {},
  buttonImage: {
    right: 2.5,
    bottom: -20,
    position: 'absolute',
  },
  body: {},
});

NutrientsMealGraphic.defaultProps = {};

export default NutrientsMealGraphic;

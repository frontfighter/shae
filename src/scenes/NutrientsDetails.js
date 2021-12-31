/**
 * Created by developercomputer on 09.10.16.
 */
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from "react-native-popup-dialog";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Picker } from "react-native-wheel-pick";
import Pie from "react-native-pie";
import { PieChart } from "react-native-svg-charts";
import { BoxShadow } from "react-native-shadow";
import Svg, { Path, G } from "react-native-svg";
import * as Animatable from "react-native-animatable";
import _isEmpty from "lodash/isEmpty";
import moment from 'moment';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import * as shaefitApi from "../API/shaefitAPI";
import NutrientsMealGraphic from "../components/NutrientsmealGraphic";
import ShineOverlay from "../components/ShineOverlay";

const { height, width } = Dimensions.get("window");

const shadowOpt = {
  width: width - 40,
  height: 48,
  color: "#273849",
  border: 18,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 6,
  style: { marginTop: 24, alignSelf: "center" },
};

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: "bottom", // optional
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

class MealsListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let value = 0;
    let valueName = "";
    if (this.props.mainTitle === "Carbohydrates") {
      value = this.props.item.carbs;
      valueName = "carbs";
    } else if (this.props.mainTitle === "Fat") {
      value = this.props.item.fat;
      valueName = "fats";
    } else {
      value = this.props.item.protein;
      valueName = "proteins";
    }

    let image = "";
    switch (this.props.item.title) {
      case "Breakfast":
        image = require("../resources/icon/breakfast_small.png");
        break;
      case "Lunch":
        image = require("../resources/icon/lunch_small.png");
        break;
      case "Dinner":
        image = require("../resources/icon/dinner_small.png");
        break;
      case "Snacks":
        image = require("../resources/icon/snacks_small.png");
        break;
      default:
        image = require("../resources/icon/snacks_small.png");
    }

    return (
      <View
        style={{
          width: (width - 40 - 16) / 2,
          height: 120,
          borderRadius: 10,
          marginTop: this.props.index === 0 || this.props.index === 1 ? 8 : 16,
          marginRight: this.props.index % 2 === 0 ? 16 : 0,
          borderWidth: 1,
          borderColor: "rgb(221,224,228)",
        }}
      >
        <View style={{ marginTop: 15, marginLeft: 20 }}>
          <View style={{ height: 24 }}>
            <Image
              source={image}
              // style={{width: 30, height: 30}}
            />
          </View>

          <Text style={styles.cardTitle}>{this.props.item.title}</Text>
          <View style={{ marginTop: 3, flexDirection: "row" }}>
            <Text
              style={styles.cardPercentage}
            >{`${this.props.item.precent}%`}</Text>
            <Text style={styles.cardValue}>{`${parseInt(
              this.props.item.value
            )}g ${valueName}`}</Text>
          </View>
        </View>
      </View>
    );
  }
}

class NutrientsDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      micronutrientsPosition: this.props.initialPosition,
      micronutrientsWheelPosition: this.props.initialPosition,
      isMicronutrientsWheelModalVisible: false,
      micronutrientsData: [],
      breakfastData: [],
      lunchData: [],
      dinnerData: [],
      snacksData: [],
      sections: [],
      weekArray: [],

      isHintNutrientsModalVisible: false,
      hintNutrientsTouchPosition: {},
      hintNutrientsColor: "",
      hintNutrientsText: "",
      hintNutrientsValue: 0,
      hintNutrientsImage: "",

      isDay: true,
      days: [this.props.dates[0], this.props.dates[1]],
      currentDay: this.props.dates[this.props.initialPosition],
      daysPosition: this.props.initialPosition,

      weeks: [this.props.dates[3], this.props.dates[2]],
      currentWeek: this.props.dates[3],
      weeksPosition: 0,
      yAxis: [],
      maxChartValue: 1,

      isLoading: false,
      isNutrientsCalendarVisible: false,
      daySelectionPicker: false,
      selectDayOption: '1 day',
      nutrientsSelected: undefined,
      start: undefined,
      end: undefined,
      period: {},
    };
  }

  componentDidMount() {
    Actions.refresh({ title: this.props.title });

    console.log("dates", this.props.dates, this.props.initialPosition);
    this.getMicronutrientsData();
  }

  setPreviousMicronutrients = () => {
    if (this.state.isDay) {
      let data = this.state.currentDay;

      console.log("setPreviousMicronutrients data", data);
      let date = new Date(
        data.substring(0, 4),
        parseInt(data.substring(5, 7)) - 1,
        data.substring(8, 10),
        12
      );
      date.setDate(date.getDate() - 1);
      console.log("setPreviousMicronutrients", date);
      console.log("setPreviousMicronutrients", this.props.dates);
      date = date.toISOString().slice(0, 10);

      let array = this.state.days;
      array.push(date);
      this.setState({ days: array, currentDay: date });
      console.log("setPreviousMicronutrients", date);
      if(this.state.micronutrientsPosition == 4) {
        this.props.dates[this.state.micronutrientsPosition] = date;
        this.setState({ nutrientsSelected: date });
      }
      this.getMicronutrientsData(date);
    } else {
      let data = this.state.currentWeek;

      let previousWeek = this.getPreviousWeek();
      console.log("previousWeek", previousWeek, this.state.currentWeek);
      let array = this.state.weeks;
      array.push(previousWeek);
      this.setState({ weeks: array, currentWeek: previousWeek });      
      if(this.state.micronutrientsPosition == 4) {
        this.props.dates[this.state.micronutrientsPosition] = previousWeek;
        this.setState({ start: previousWeek[0], end: previousWeek[1] });
        this.getPeriod(previousWeek[0], previousWeek[1]);
      }
      this.getMicronutrientsData(previousWeek);
    }
  };

  getPreviousWeek = () => {
    let data = this.state.currentWeek[1];

    let date = new Date(
      data.substring(0, 4),
      parseInt(data.substring(5, 7)) - 1,
      data.substring(8, 10),
      12
    );
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -7 : 0);
    date.setDate(diff);
    const lastDate = new Date(date).toISOString().slice(0, 10);
    let firstDate = new Date(date);
    firstDate.setDate(firstDate.getDate() - 6);

    return [firstDate.toISOString().slice(0, 10), lastDate];
  };

  setNextMicronutrients = () => {
    if (this.state.isDay) {
      if (this.state.currentDay !== this.state.days[0]) {
        let date = new Date(
          this.state.currentDay.substring(0, 4),
          parseInt(this.state.currentDay.substring(5, 7)) - 1,
          this.state.currentDay.substring(8, 10),
          12
        );
        date.setDate(date.getDate() + 1);
        date = date.toISOString().slice(0, 10);

        this.setState({ currentDay: date });
        if(this.state.micronutrientsPosition == 4) {
          this.props.dates[this.state.micronutrientsPosition] = date;
          this.setState({ nutrientsSelected: date });
        }
        this.getMicronutrientsData(date);
      }
    } else {
      if (this.state.currentWeek[0] !== this.state.weeks[0][0]) {
        let data = this.state.currentWeek[1];

        let date = new Date(
          data.substring(0, 4),
          parseInt(data.substring(5, 7)) - 1,
          data.substring(8, 10),
          12
        );
        let day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? +7 : 0);
        date.setDate(diff);
        const lastDate = new Date(date).toISOString().slice(0, 10);
        let firstDate = new Date(date);
        firstDate.setDate(firstDate.getDate() - 6);

        // let date = new Date(this.state.currentDay.substring(0, 4), parseInt(this.state.currentDay.substring(5, 7)) - 1, this.state.currentDay.substring(8, 10), 12);
        // date.setDate(date.getDate() + 1);
        // date = date.toISOString().slice(0,10);

        let week = [firstDate.toISOString().slice(0, 10), lastDate];
        if (week[0] === this.state.weeks[0][0]) {
          week = this.state.weeks[0];
        } else if (week[0] === this.state.weeks[1][0]) {
          week = this.state.weeks[1];
        }

        this.setState({ currentWeek: week });
        if(this.state.micronutrientsPosition == 4) {
          this.props.dates[this.state.micronutrientsPosition] = week;
          this.setState({ start: week[0], end: week[1] });
          this.getPeriod(week[0], week[1]);
        }
        this.getMicronutrientsData(week);
      }
    }
  };

  getMicronutrientsPositionValue = () => {
    return this.props.micronutrientsPositionValues[
      this.state.micronutrientsPosition
    ];
  };

  setMicronutrientsPositionValue = (value) => {
    for (let i = 0; i < this.props.micronutrientsPositionValues.length; i++) {
      if (this.props.micronutrientsPositionValues[i] === value) {
        this.setState({ micronutrientsWheelPosition: i });
        break;
      }
    }

    // this.getMicronutrientsData();
  };

  onMicronutrientsDonePress = () => {
    this.setState(
      {
        isMicronutrientsWheelModalVisible: false,
        micronutrientsPosition: this.state.micronutrientsWheelPosition,
      },
      () => {
        if (this.state.micronutrientsWheelPosition === 4) {
          this.setState({ isNutrientsCalendarVisible: false, daySelectionPicker: true });
      } else {
        if (
          Array.isArray(this.props.dates[this.state.micronutrientsPosition])
        ) {
          this.setState({
            isDay: false,
            currentWeek: this.props.dates[this.state.micronutrientsPosition],
          });
        } else {
          this.setState({
            isDay: true,
            currentDay: this.props.dates[this.state.micronutrientsPosition],
          });
        }
        this.getMicronutrientsData();
        }
      }
    );
  };

  getMicronutrientsData = (date) => {
    setTimeout(async () => {
      this.setState({ isLoading: true });
      let data;
      if (typeof date !== "undefined") {
        data = await shaefitApi.getMacronutrientsMealsStats(date);
      } else {
        data = await shaefitApi.getMacronutrientsMealsStats(
          this.props.dates[this.state.micronutrientsPosition]
        );
      }

      console.log("getMicronutrientsStats data", data);

      let value;
      if (this.props.title === "Carbohydrates") {
        value = data.carbs;
      } else if (this.props.mainTitle === "Fat") {
        value = data.fat_total;
      } else {
        value = data.protein;
      }

      let array = [];
      let sectionsArray = [];
      let weekArray = [];

      let breakfastObject = { value: 0, precent: 0 };
      let lunchObject = { value: 0, precent: 0 };
      let dinnerObject = { value: 0, precent: 0 };
      let snacksObject = { value: 0, precent: 0 };
      let totalValue = 0;
      let maxValue = -100;

      if (typeof value !== "undefined")
        for (let i = 0; i < value.length; i++) {
          console.log("value[i]", value[i]);
          const date = value[i].date;

          if (
            (typeof date !== "undefined" && Array.isArray(date)) ||
            Array.isArray(this.props.dates[this.state.micronutrientsPosition])
          ) {
            let object = {};
            if (value[i].hasOwnProperty("Breakfast")) {
              object.Breakfast = value[i].Breakfast.precent;
              object.BreakfastValue = value[i].Breakfast.value;
              totalValue += value[i].Breakfast.value;

              if (maxValue < value[i].Breakfast.value) {
                maxValue = value[i].Breakfast.value;
              }
            }
            if (value[i].hasOwnProperty("Lunch")) {
              object.Lunch = value[i].Lunch.precent;
              object.LunchValue = value[i].Lunch.value;
              totalValue += value[i].Lunch.value;

              if (maxValue < value[i].Lunch.value) {
                maxValue = value[i].Lunch.value;
              }
            }
            if (value[i].hasOwnProperty("Dinner")) {
              object.Dinner = value[i].Dinner.precent;
              object.DinnerValue = value[i].Dinner.value;
              totalValue += value[i].Dinner.value;

              if (maxValue < value[i].Dinner.value) {
                maxValue = value[i].Dinner.value;
              }
            }
            if (value[i].hasOwnProperty("Snacks")) {
              object.Snacks = value[i].Snacks.precent;
              object.SnacksValue = value[i].Snacks.value;
              totalValue += value[i].Snacks.value;

              if (maxValue < value[i].Snacks.value) {
                maxValue = value[i].Snacks.value;
              }
            }

            weekArray.push({
              date: date,
              ...object,
            });
          }

          if (value[i].hasOwnProperty("Breakfast")) {
            let valueNew = breakfastObject.value + value[i].Breakfast.value;
            let precent;

            if (
              (typeof date !== "undefined" && !Array.isArray(date)) ||
              !Array.isArray(
                this.props.dates[this.state.micronutrientsPosition]
              )
            ) {
              precent = value[i].Breakfast.precent;
            } else {
              precent = breakfastObject.precent + value[i].Breakfast.precent;
            }

            breakfastObject = {
              ...value[i].Breakfast,
              ...{ date, title: "Breakfast", value: valueNew, precent },
            };
            //
            // array.push({...value[i].Breakfast, ...{date, title: 'Breakfast'}});
          }

          if (value[i].hasOwnProperty("Lunch")) {
            let valueNew = lunchObject.value + value[i].Lunch.value;
            let precent;

            if (
              (typeof date !== "undefined" && !Array.isArray(date)) ||
              !Array.isArray(
                this.props.dates[this.state.micronutrientsPosition]
              )
            ) {
              precent = value[i].Lunch.precent;
            } else {
              precent = lunchObject.precent + value[i].Lunch.precent;
            }

            // let precent = valueNew / totalValue * 100;
            console.log("valueNew / totalValue", valueNew, totalValue);
            lunchObject = {
              ...value[i].Lunch,
              ...{ date, title: "Lunch", value: valueNew, precent },
            };
            //
            // array.push({...value[i].Lunch, ...{date, title: 'Lunch'}});
          }

          if (value[i].hasOwnProperty("Dinner")) {
            let valueNew = dinnerObject.value + value[i].Dinner.value;
            let precent;

            if (
              (typeof date !== "undefined" && !Array.isArray(date)) ||
              !Array.isArray(
                this.props.dates[this.state.micronutrientsPosition]
              )
            ) {
              precent = value[i].Dinner.precent;
            } else {
              precent = dinnerObject.precent + value[i].Dinner.precent;
            }

            // let precent = valueNew / totalValue * 100;
            console.log("valueNew / totalValue", valueNew, totalValue);
            dinnerObject = {
              ...value[i].Dinner,
              ...{ date, title: "Dinner", value: valueNew, precent },
            };
            //
            // array.push({...value[i].Dinner, ...{date, title: 'Dinner'}});
          }

          if (value[i].hasOwnProperty("Snacks")) {
            let valueNew = snacksObject.value + value[i].Snacks.value;
            let precent;

            if (
              (typeof date !== "undefined" && !Array.isArray(date)) ||
              !Array.isArray(
                this.props.dates[this.state.micronutrientsPosition]
              )
            ) {
              precent = value[i].Snacks.precent;
            } else {
              precent = snacksObject.precent + value[i].Snacks.precent;
            }

            // let precent = valueNew / totalValue * 100;
            console.log("valueNew / totalValue", valueNew, totalValue);
            snacksObject = {
              ...value[i].Snacks,
              ...{ date, title: "Snacks", value: valueNew, precent },
            };
            // array.push({...value[i].Snacks, ...{date, title: 'Snacks'}});
          }
        }

      if (
        (typeof date !== "undefined" && Array.isArray(date)) ||
        Array.isArray(this.props.dates[this.state.micronutrientsPosition])
      ) {
        if (breakfastObject.hasOwnProperty("title")) {
          breakfastObject.precent = parseInt(
            (breakfastObject.value / totalValue) * 100
          );
          // breakfastObject.precent = breakfastObject.precent;
        }

        if (lunchObject.hasOwnProperty("title")) {
          lunchObject.precent = parseInt(
            (lunchObject.value / totalValue) * 100
          );
          // lunchObject.precent = lunchObject.precent;
        }

        if (dinnerObject.hasOwnProperty("title")) {
          dinnerObject.precent = parseInt(
            (dinnerObject.value / totalValue) * 100
          );
          // dinnerObject.precent = dinnerObject.precent;
        }

        if (snacksObject.hasOwnProperty("title")) {
          snacksObject.precent = parseInt(
            (snacksObject.value / totalValue) * 100
          );
          // snacksObject.precent = snacksObject.precent;
        }
      }

      console.log(
        "objects",
        breakfastObject,
        lunchObject,
        dinnerObject,
        snacksObject,
        totalValue
      );

      if (breakfastObject.hasOwnProperty("title")) {
        array.push(breakfastObject);

        if (
          (typeof date !== "undefined" && !Array.isArray(date)) ||
          !Array.isArray(this.props.dates[this.state.micronutrientsPosition])
        ) {
          // sectionsArray.push({
          //   percentage: parseFloat(breakfastObject.precent),
          //   color: 'rgb(244,88,152)',
          // });

          sectionsArray.push({
            value: breakfastObject.precent,
            svg: {
              fill: "rgb(244,88,152)",
              onPress: () => {
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue: breakfastObject.precent,
                  hintNutrientsColor: "rgb(244,88,152)",
                  hintNutrientsText: "Breakfast",
                  hintNutrientsImage: require("../resources/icon/breakfast_small.png"),
                });
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
              },
            },
            key: 0,
          });
        }
      }

      if (lunchObject.hasOwnProperty("title")) {
        array.push(lunchObject);

        if (
          (typeof date !== "undefined" && !Array.isArray(date)) ||
          !Array.isArray(this.props.dates[this.state.micronutrientsPosition])
        ) {
          // sectionsArray.push({
          //   percentage: parseFloat(lunchObject.precent),
          //   color: 'rgb(245,121,75)',
          // });
          sectionsArray.push({
            value: parseFloat(lunchObject.precent),
            svg: {
              fill: "rgb(245,121,75)",
              onPress: () => {
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue: lunchObject.precent,
                  hintNutrientsColor: "rgb(245,121,75)",
                  hintNutrientsText: "Lunch",
                  hintNutrientsImage: require("../resources/icon/lunch_small.png"),
                });
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
              },
            },
            key: 1,
          });
        }
      }

      if (dinnerObject.hasOwnProperty("title")) {
        array.push(dinnerObject);

        if (
          (typeof date !== "undefined" && !Array.isArray(date)) ||
          !Array.isArray(this.props.dates[this.state.micronutrientsPosition])
        ) {
          // sectionsArray.push({
          //   percentage: parseFloat(dinnerObject.precent),
          //   color: 'rgb(0,187,116)',
          // });

          sectionsArray.push({
            value: parseFloat(dinnerObject.precent),
            svg: {
              fill: "rgb(0,187,116)",
              onPress: () => {
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue: dinnerObject.precent,
                  hintNutrientsColor: "rgb(0,187,116)",
                  hintNutrientsText: "Dinner",
                  hintNutrientsImage: require("../resources/icon/dinner_small.png"),
                });
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
              },
            },
            key: 2,
          });
        }
      }

      if (snacksObject.hasOwnProperty("title")) {
        array.push(snacksObject);

        if (
          (typeof date !== "undefined" && !Array.isArray(date)) ||
          !Array.isArray(this.props.dates[this.state.micronutrientsPosition])
        ) {
          // sectionsArray.push({
          //   percentage: parseFloat(snacksObject.precent),
          //   color: 'rgb(0,164,228)',
          // });
          sectionsArray.push({
            value: parseFloat(snacksObject.precent),
            svg: {
              fill: "rgb(0,164,228)",
              onPress: () => {
                this.setState({
                  isHintNutrientsModalVisible: true,
                  hintNutrientsValue: snacksObject.precent,
                  hintNutrientsColor: "rgb(0,164,228)",
                  hintNutrientsText: "Snacks",
                  hintNutrientsImage: require("../resources/icon/snacks_small.png"),
                });
                this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
              },
            },
            key: 3,
          });
        }
      }

      this.getYaxis(maxValue);

      this.setState({
        micronutrientsData: array,
        sections: sectionsArray,
        weekArray: weekArray,
        isLoading: false,
      });
      console.log("getMicronutrientsData array", array);
      console.log("getMicronutrientsData weekArray", weekArray);
    }, 20);
  };

  getYaxis = (value) => {
    const roundedValue = Math.ceil(value / 100) * 100;

    let array = [0];
    const divider = parseInt(roundedValue / 4); // 400 / 4 = 100

    // array.push(parseFloat(divider).toFixed(2));
    // array.push(parseFloat(divider * 2).toFixed(2));
    // array.push(parseFloat(divider * 3).toFixed(2));
    // array.push(parseFloat(divider * 4).toFixed(2));

    array.push(parseInt(divider));
    array.push(parseInt(divider * 2));
    array.push(parseInt(divider * 3));
    array.push(parseInt(divider * 4));

    console.log("getYaxis", value, roundedValue, array);
    this.setState({ yAxis: array, maxChartValue: roundedValue });
  };

  _renderMealsListItem = ({ item, index }) => {
    return (
      <MealsListItem index={index} item={item} mainTitle={this.props.title} />
    );
  };

  getMappedDate = () => {
    if (this.state.isDay) {
      let day = "";
      for (let i = 0; i < this.props.dates.length; i++) {
        console.log(
          "getMappedDate",
          this.props.dates[i],
          this.state.currentDay
        );
        if (this.props.dates[i] === this.state.currentDay) {
          if (i === 0) {
            day = "Today";
          } else if (i === 1) {
            day = "Yesterday";
          }

          break;
        }
      }

      if (day !== "") {
        return day;
      } else {
        console.log("this.state.currentDay", this.state.currentDay);
        return `${this.getMonthName(
          this.state.currentDay.substring(5, 7)
        )} ${this.state.currentDay.substring(8, 10)}`;
      }
    } else {
      if(this.state.micronutrientsPosition == 4) {
        return `${this.state.currentWeek[0]?.substring(
          8,
          10
        )} - ${this.state.currentWeek[1]?.substring(8, 10)} ${this.getMonthName(
          this.state.currentWeek[1]?.substring(5, 7)
        )}`;
      } else {
      let week = "";
      for (let i = 0; i < this.props.dates.length; i++) {
        console.log(
          "getMappedDate",
          this.props.dates[i],
          this.state.currentWeek
        );
        console.log(
          "getMappedDate this.props.dates[i][0]",
          this.props.dates[i][0],
          this.state.currentWeek[0],
          i
        );
        console.log(
          "getMappedDate this.props.dates[i][1]",
          this.props.dates[i][1],
          this.state.currentWeek[1],
          i
        );
        if (
          Array.isArray(this.props.dates[i]) &&
          this.props.dates[i][0] === this.state.currentWeek[0]
        ) {
          console.log("condition");
          if (i === 3) {
            week = "This Week";
          } else if (i === 2) {
            week = "Last Week";
          }

          break;
        }
      }

      if (week !== "") {
        return week;
      } else {
        console.log("this.state.currentWeek", this.state.currentWeek);
        return `${this.state.currentWeek[0].substring(
          8,
          10
        )} - ${this.state.currentWeek[1].substring(8, 10)} ${this.getMonthName(
          this.state.currentWeek[1].substring(5, 7)
        )}`;
      }
    }
    }
  };

  getMonthName = (month) => {
    let monthName = "";
    switch (month) {
      case "01":
        monthName = "Jan";
        break;
      case "02":
        monthName = "Feb";
        break;
      case "03":
        monthName = "Mar";
        break;
      case "04":
        monthName = "Apr";
        break;
      case "05":
        monthName = "May";
        break;
      case "06":
        monthName = "Jun";
        break;
      case "07":
        monthName = "Jul";
        break;
      case "08":
        monthName = "Aug";
        break;
      case "09":
        monthName = "Sep";
        break;
      case "10":
        monthName = "Oct";
        break;
      case "11":
        monthName = "Nov";
        break;
      case "12":
        monthName = "Dec";
        break;
      default:
        monthName = "Jan";
    }

    return monthName;
  };

  onDayorWeekPress = (dayObj) => {
    if(this.state.selectDayOption == '1 day') {
      const today = new Date();
      today.setHours(23);
      today.setMinutes(59);
      const newDate = new Date(dayObj.dateString);
      newDate.setHours(0);
      newDate.setMinutes(0);
      if (today.getTime() >= newDate.getTime()) {
          this.setState({ nutrientsSelected: dayObj.dateString});
      }
    } else {
      try {
        const { start, end } = this.state;
        const { dateString } = dayObj;
        const startIsEmpty = _isEmpty(start);
        if (startIsEmpty || (!startIsEmpty && !_isEmpty(end))) {
          const period = {
            [dateString]: {
              color: "rgb(0,164,228)",
              textColor: "rgb(255,255,255)",
              endingDay: true,
              startingDay: true,
            },
          };
          this.setState({ start: dateString, period, end: undefined });
        } else {
          // if end date is older than start date switch
          let endDate;
          let startDate;
          if(moment(start, "YYYY-MM-DD").isBefore(dateString,"YYYY-MM-DD")) {           
            endDate = moment(start, "YYYY-MM-DD").add(6, 'days').format('YYYY-MM-DD');
            startDate = start;
          } else if(moment(start, "YYYY-MM-DD").isAfter(dateString,"YYYY-MM-DD")) {
            startDate = moment(start, "YYYY-MM-DD").subtract(6, 'days').format('YYYY-MM-DD');
            endDate = start;
          }
          this.getPeriod(startDate, endDate);
        }
      } catch (err) {
        this.setState(() => {
          throw err;
        });
      }
    }
  }

  getPeriod = (startDate, endDate) => {
    let period = {}
    for (var m = moment(startDate); m.diff(endDate, 'days') <= 0; m.add(1, 'days')) {
      period[m.format('YYYY-MM-DD')] = {
        color:
        startDate === m.format('YYYY-MM-DD') || endDate === m.format('YYYY-MM-DD')
          ? "rgb(0,168,235)"
          : "rgb(205,239,250)",
        startingDay: startDate === m.format('YYYY-MM-DD') ? true : false,
        endingDay: endDate === m.format('YYYY-MM-DD') ? true : false,
        textColor:
          startDate === m.format('YYYY-MM-DD') || endDate === m.format('YYYY-MM-DD')
            ? "rgb(255,255,255)"
            : "rgb(38,42,47)",
        selected: true,
        selectedColor: "red",
        marked: true,              
      };
    }
    this.setState({ start: startDate, end: endDate, period });
  }

  dayPickerSelection = (day) => {
    this.setState({ selectDayOption: day });
  }

  dayPickerSelectionDone = () => {
      this.setState({ daySelectionPicker: false, isNutrientsCalendarVisible: true });
  }

  onCalendarDoneNutrientsPress = async () => {
    if(this.state.selectDayOption == '1 day' && this.state.nutrientsSelected == undefined) {
      Alert.alert('Please select date')
    } else if(this.state.selectDayOption == '7 day' && (this.state.start == undefined || this.state.end == undefined)) {
      Alert.alert('Please select start date and end date')
    } else {
      this.setState({isNutrientsCalendarVisible: false});
      if(this.state.selectDayOption == '1 day') {
        this.props.dates[this.state.micronutrientsPosition] = this.state.nutrientsSelected;
        this.setState({
          isDay: true,
          currentDay: this.props.dates[this.state.micronutrientsPosition]
        })  
      } else if(this.state.selectDayOption == '7 day') {    
        this.props.dates[this.state.micronutrientsPosition] = [this.state.start, this.state.end];      
        this.setState({
          isDay: false,
          currentWeek: this.props.dates[this.state.micronutrientsPosition]
        })  
      }
      this.getMicronutrientsData();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
        >
          <View
            style={{
              width: width - 40,
              height: 44,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "rgb(221,224,228)",
              alignSelf: "center",
              backgroundColor: "rgb(255,255,255)",
              marginTop: 23,
            }}
          >
            <TouchableWithoutFeedback onPress={this.setPreviousMicronutrients}>
              <View
                style={{
                  width: 40,
                  height: 44,
                  borderRightWidth: 0.5,
                  borderRightColor: "rgb(221,224,228)",
                  position: "absolute",
                  left: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../resources/icon/previous.png")}
                  // style={{width: 30, height: 30}}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({
                  micronutrientsWheelPosition: this.state
                    .micronutrientsPosition,
                  isMicronutrientsWheelModalVisible: true,
                })
              }
            >
              <View
                style={{
                  alignSelf: "center",
                  height: 44,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={styles.dateText}>
                  {typeof this.state.currentDay !== "undefined" ||
                  typeof this.state.currentWeek !== "undefined"
                    ? this.getMappedDate()
                    : "Today"}
                </Text>

                <Image
                  source={require("../resources/icon/arrowDown.png")}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={this.setNextMicronutrients}>
              <View
                style={{
                  width: 40,
                  height: 44,
                  borderLeftWidth: 0.5,
                  borderLeftColor: "rgb(221,224,228)",
                  position: "absolute",
                  right: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../resources/icon/next.png")}
                  // style={{width: 30, height: 30}}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          {!this.state.isDay ? (
            <View>
              {this.state.weekArray.length !== 0 && !this.state.isLoading ? (
                <NutrientsMealGraphic
                  data={this.state.weekArray}
                  dates={this.state.currentWeek}
                  // maxValue={this.state.maxChartValue}
                  maxValue={100}
                  yAxis={["0", "25", "50", "75", "100"]} //{this.state.yAxis}
                />
              ) : this.state.isLoading ? (
                <ShineOverlay>
                  <View
                    style={{
                      height: 250,
                      width: width - 40,
                      alignSelf: "center",
                      marginTop: 32,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "rgb(216,215,222)",
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        minWidth: 19,
                        alignItems: "flex-end",
                      }}
                    >
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                          marginTop: 37,
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                          marginTop: 34,
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                          marginTop: 34,
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                          marginTop: 38,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        position: "absolute",
                        bottom: 32,
                        left: 34,
                        width: width - 85,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                      <View
                        style={{
                          width: 15,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "rgb(242,243,246)",
                        }}
                      />
                    </View>

                    <View
                      style={{
                        marginTop: 7.5,
                        width: width - 63,
                        height: 190,
                        marginLeft: 25,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 116,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 150,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 138,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 108,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 97,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 164,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          height: 184,
                          width: 38 * (width / 375),
                          alignItems: "center",
                          alignSelf: "flex-end",
                          justifyContent: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            width: 18,
                            height: 124,
                            backgroundColor: "rgb(242,243,246)",
                            borderRadius: 9,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </ShineOverlay>
              ) : (
                <View>
                  <Image
                    source={require("../resources/icon/nutrients_empty.png")}
                    style={{ alignSelf: "center", marginTop: 120 }}
                  />
                  <Text style={styles.placeholderTitle}>No Nutrients</Text>
                  <Text style={styles.placeholderText}>
                    Looks like you don’t have any data related to nutrients as
                    of yet.
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              {this.state.isLoading ? (
                <ShineOverlay>
                  <View>
                    <View
                      style={{
                        width: 200,
                        height: 200,
                        alignSelf: "center",
                        marginTop: 40,
                      }}
                      onTouchStart={(e) =>
                        this.setState({
                          hintNutrientsTouchPosition: e.nativeEvent,
                        })
                      }
                    >
                      <PieChart
                        style={{ height: 200 }}
                        data={[
                          {
                            value: 33,
                            svg: {
                              fill: "rgb(242,243,246)",
                            },
                            key: 1,
                          },
                          {
                            value: 20,
                            svg: {
                              fill: "rgb(242,243,246)",
                            },
                            key: 2,
                          },
                          {
                            value: 29,
                            svg: {
                              fill: "rgb(242,243,246)",
                            },
                            key: 3,
                          },
                          {
                            value: 15,
                            svg: {
                              fill: "rgb(242,243,246)",
                            },
                            key: 4,
                          },
                        ]}
                        outerRadius="100%"
                        innerRadius="60%"
                        sort={() => null}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        alignSelf: "center",
                        backgroundColor: "rgb(216,215,222)",
                        marginTop: 42,
                      }}
                    />
                  </View>
                </ShineOverlay>
              ) : this.state.sections.length !== 0 && !this.state.isLoading ? (
                <View>
                  <View
                    style={{
                      width: 200,
                      height: 200,
                      alignSelf: "center",
                      marginTop: 40,
                    }}
                    onTouchStart={(e) =>
                      this.setState({
                        hintNutrientsTouchPosition: e.nativeEvent,
                      })
                    }
                  >
                    {/*<Pie
                      radius={100}
                      sections={this.state.sections}
                      dividerSize={2}
                      innerRadius={60}
                      strokeCap={'butt'}
                      onPress={() => console.log('onsection press')}
                    />*/}

                    <PieChart
                      style={{ height: 200 }}
                      data={this.state.sections}
                      outerRadius="100%"
                      innerRadius="60%"
                      sort={() => null}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 0.5,
                      alignSelf: "center",
                      backgroundColor: "rgb(216,215,222)",
                      marginTop: 42,
                    }}
                  />
                </View>
              ) : (
                <View>
                  <View>
                    <Image
                      source={require("../resources/icon/nutrients_empty.png")}
                      style={{ alignSelf: "center", marginTop: 120 }}
                    />
                    <Text style={styles.placeholderTitle}>No Nutrients</Text>
                    <Text style={styles.placeholderText}>
                      Looks like you don’t have any data related to nutrients as
                      of yet.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {!this.state.isLoading ? (
            <FlatList
              ref={(ref) => (this.mealsFlatList = ref)}
              data={this.state.micronutrientsData}
              extraData={this.state.micronutrientsData}
              keyExtractor={(item, index) => item.title + index}
              renderItem={this._renderMealsListItem}
              contentContainerStyle={{
                width: width - 40,
                paddingBottom: isIphoneX() ? 34 + 25 : 25,
                paddingTop: 16,
                overflow: "visible",
                alignSelf: "center",
              }}
              keyboardShouldPersistTaps="always"
              initialNumToRender={4}
              bounces={false}
              numColumns={2}
            />
          ) : (
            <ShineOverlay>
              <View
                style={{
                  width: width - 40,
                  alignSelf: "center",
                  marginTop: 24,
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: (width - 56) / 2,
                      height: 120,
                      borderRadius: 10,
                      marginRight: 16,
                      borderWidth: 1,
                      borderColor: "rgb(221,224,228)",
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 15,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 50,
                        height: 10,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 24,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 10,
                        marginLeft: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: (width - 56) / 2,
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "rgb(221,224,228)",
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 15,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 50,
                        height: 10,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 24,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 10,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                </View>

                <View
                  style={{
                    width: width - 40,
                    alignSelf: "center",
                    flexDirection: "row",
                    marginTop: 16,
                  }}
                >
                  <View
                    style={{
                      width: (width - 56) / 2,
                      height: 120,
                      borderRadius: 10,
                      marginRight: 16,
                      borderWidth: 1,
                      borderColor: "rgb(221,224,228)",
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 15,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 50,
                        height: 10,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 24,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 10,
                        marginLeft: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: (width - 56) / 2,
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "rgb(221,224,228)",
                    }}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 15,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 50,
                        height: 10,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 24,
                        marginLeft: 20,
                      }}
                    />
                    <View
                      style={{
                        width: 80,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: "rgb(242,243,246)",
                        marginTop: 10,
                        marginLeft: 20,
                      }}
                    />
                  </View>
                </View>
              </View>
            </ShineOverlay>
          )}
        </ScrollView>

        <Dialog
          visible={this.state.isMicronutrientsWheelModalVisible}
          containerStyle={{ justifyContent: "flex-end" }}
          onTouchOutside={() => {
            console.log("onTouchOutside");
            this.setState({
              isMicronutrientsWheelModalVisible: false,
              micronutrientsWheelPosition: this.state.micronutrientsPosition,
            });
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: "visible",
            borderRadius: 0,
            backgroundColor: "transparent",
          }}
        >
          <DialogContent style={{ paddingBottom: 0 }}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: "rgb(255,255,255)",
              }}
            >
              <TouchableWithoutFeedback
                onPress={this.onMicronutrientsDonePress}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  width,
                  height: 180,
                  alignSelf: "center",
                  flexDirection: "row",
                }}
              >
                <Picker
                  style={{
                    backgroundColor: "white",
                    width,
                    height: 180,
                    alignSelf: "center",
                  }}
                  selectedValue={
                    this.props.micronutrientsPositionValues[
                      this.state.micronutrientsWheelPosition
                    ]
                  }
                  pickerData={this.props.micronutrientsPositionValues}
                  onValueChange={(value) =>
                    this.setMicronutrientsPositionValue(value)
                  }
                  itemSpace={30} // this only support in android
                />
              </View>

              {isIphoneX() && <View style={{ height: 37 }} />}
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isNutrientsCalendarVisible}
          containerStyle={{
            marginTop: isIphoneX() ? -130 : Platform.OS === 'ios' ? 50 : 0,
          }}
          onTouchOutside={() => {
            this.setState({isNutrientsCalendarVisible: false});
          }}
          onDismiss={() => {
            this.setState({isNutrientsCalendarVisible: false});
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
                ref={(header) => (this.calendar2 = header)}
                onDayPress={(day) => this.onDayorWeekPress(day)}
                firstDay={1}
                markingType={(this.state.selectDayOption == '1 day') ? 'custom' : 'period'}
                markedDates={
                  this.state.selectDayOption == '1 day' ?
                  {[this.state.nutrientsSelected]: {
                    selected: true,
                    disableTouchEvent: true,
                  }}
                  :
                  this.state.period
                }
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
                      isNutrientsCalendarVisible: false,
                      nutrientsSelected: undefined,
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

                <TouchableWithoutFeedback onPress={this.onCalendarDoneNutrientsPress}>
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

        <Dialog
          visible={this.state.daySelectionPicker}
          onTouchOutside={() => {
            this.setState({
              daySelectionPicker: !this.state.daySelectionPicker,
            });
          }}
          containerStyle={{
           justifyContent: 'flex-end'
          }}
          // onDismiss={() => {
          //   this.setState({ daySelectionPicker: false });
          // }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 10,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback onPress={() => this.dayPickerSelectionDone()}>
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
                style={{width: width - 40, height: 120, alignSelf: 'center'}}>
                  <TouchableWithoutFeedback onPress={() => this.dayPickerSelection('1 day')}>
                    <View
                    style={{
                      width: width - 40,
                      height: 44,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      backgroundColor: this.state.selectDayOption === '1 day' ? '#00a8eb' : '#fff',
                      color: this.state.selectDayOption === '1 day' ? '#fff' : '#000',
                    }}>
                    <Text style={{textAlign: 'center', fontSize: 16}}>1 day</Text>
                   </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this.dayPickerSelection('7 day')}>
                    <View
                      style={{
                        width: width - 40,
                        height: 44,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        color: this.state.selectDayOption === '7 day' ? '#fff' : '#000',
                        backgroundColor: this.state.selectDayOption === '7 day' ? '#00a8eb' : '#fff'
                      }}>
                    <Text style={{textAlign: 'center', fontSize: 16}}>7 day</Text>
                    </View>
                  </TouchableWithoutFeedback>
              </View>

              {isIphoneX() && <View style={{height: 37}} />}
            </View>
          </DialogContent>
        </Dialog>
        
        <Dialog
          visible={this.state.isHintNutrientsModalVisible}
          containerStyle={{ marginTop: 20 }}
          onTouchOutside={() => {
            console.log("onTouchOutside");
            this.setState({ isHintNutrientsModalVisible: false });
          }}
          onDismiss={() => {
            this.setState({ isHintNutrientsModalVisible: false });
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: "visible",
            borderRadius: 4,
            backgroundColor: "transparent",
          }}
        >
          <DialogContent
            style={{
              position: "absolute",
              top: isIphoneX()
                ? this.state.hintNutrientsTouchPosition.locationY - 163 - 230
                : Platform.OS === "ios"
                ? this.state.hintNutrientsTouchPosition.locationY -
                  103 -
                  230 +
                  20
                : this.state.hintNutrientsTouchPosition.locationY - 103 - 230,
              left: isIphoneX()
                ? this.state.hintNutrientsTouchPosition.locationX - 20
                : this.state.hintNutrientsTouchPosition.locationX - 50,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({ isHintNutrientsModalVisible: false })
              }
            >
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
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      height: 103,
                      width: 200,
                      backgroundColor: "rgb(255,255,255)",
                      borderRadius: 4,
                    }}
                  >
                    <Image
                      source={this.state.hintNutrientsImage}
                      style={{
                        width: 15,
                        height: 15,
                        marginTop: 19,
                        marginLeft: 25,
                      }}
                      resizeMode="contain"
                    />
                    <Text style={styles.hintTitle}>
                      {this.state.hintNutrientsText}
                    </Text>
                    <Text
                      style={styles.hintText}
                    >{`${this.state.hintNutrientsValue}%`}</Text>
                  </View>
                </BoxShadow>

                <Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{ marginTop: -8, marginLeft: 85 }}
                >
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 14,
    letterSpacing: -0.08,
    color: "rgb(54,58,61)",
  },
  doneText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 17,
    color: "rgb(0,168,235)",
    lineHeight: 22,
    letterSpacing: -0.41,
    position: "absolute",
    right: 0,
  },
  cardTitle: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 14,
    color: "rgb(141,147,151)",
    marginTop: 21,
  },
  cardPercentage: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 20,
    color: "rgb(54,58,61)",
  },
  cardValue: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 12,
    color: "rgb(54,58,61)",
    marginLeft: 6,
    alignSelf: "flex-end",
    marginBottom: 2,
  },
  placeholderTitle: {
    fontFamily: "SFProText-Semibold",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    color: "rgb(16,16,16)",
    marginTop: 24,
    alignSelf: "center",
  },
  placeholderText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 18,
    color: "rgb(106,111,115)",
    marginTop: 10,
    alignSelf: "center",
    textAlign: "center",
    width: width - 135,
  },
  hintTitle: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 14,
    color: "rgb(141,147,151)",
    marginTop: 16,
    marginLeft: 20,
  },
  hintText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 20,
    color: "rgb(54,58,61)",
    marginTop: 3,
    marginLeft: 20,
  },
});

export default NutrientsDetails;

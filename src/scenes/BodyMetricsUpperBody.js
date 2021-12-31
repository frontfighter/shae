import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";
import { Picker } from "react-native-wheel-pick";
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from "react-native-popup-dialog";
import { Calendar, LocaleConfig } from "react-native-calendars";
import _isEmpty from "lodash/isEmpty";
import Expand from "react-native-simple-expand";

import { getUserVariables } from "../data/db/Db";
import * as api from "../API/shaefitAPI";
import LoadingIndicator from "../components/LoadingIndicator";
import MeasurementsChart from "../components/MeasurementsChart";

const { height, width } = Dimensions.get("window");

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: "bottom", // optional
  useNativeDriver: true, // optional
});

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
  dayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
  today: "Today",
};
LocaleConfig.defaultLocale = "en";

class BodyMetricsUpperBody extends Component {
  constructor() {
    super();

    this.state = {
      isWheelModalVisible: false,
      isCalendarVisible: false,
      pickerTitle: "Last 3 Month",
      days: [],
      position: 0,
      wheelPosition: 0,
      calendarSelected: [],
      selected: undefined,
      start: {},
      end: {},
      period: {},

      chestData: null,
      chestComparison: 0,
      chestCurrent: 0,
      ribcageData: null,
      ribcageComparison: 0,
      ribcageCurrent: 0,
      waistData: null,
      waistComparison: 0,
      waistCurrent: 0,
      gluteusData: null,
      gluteusComparison: 0,
      gluteusCurrent: 0,

      isChestCollapsed: false,
      isRibcageCollapsed: false,
      isWaistCollapsed: false,
      isGluteusCollapsed: false,
      isInitial: true,
    };

    this.dates = [];
    this.wheelItems = [
      "Custom",
      "Last 1 Month",
      "Last 3 Months",
      "Last 6 Months",
      "Last 12 Months",
    ];
  }

  componentDidMount() {
    const todayDate = new Date();

    let todayOffsetHours = -todayDate.getTimezoneOffset() / 60;
    todayDate.setHours(todayDate.getHours() + todayOffsetHours);

    let monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setHours(monthAgo.getHours() + todayOffsetHours);

    let threeMonthAgo = new Date();
    threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
    threeMonthAgo.setHours(threeMonthAgo.getHours() + todayOffsetHours);

    let sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
    sixMonthAgo.setHours(sixMonthAgo.getHours() + todayOffsetHours);

    let twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
    twelveMonthAgo.setHours(twelveMonthAgo.getHours() + todayOffsetHours);

    let threeYearsAgo = new Date();
    threeYearsAgo.setMonth(threeYearsAgo.getMonth() - 36);
    threeYearsAgo.setHours(threeYearsAgo.getHours() + todayOffsetHours);

    this.setState({
      calendarSelected: [
        todayDate.toISOString().slice(0, 10),
        todayDate.toISOString().slice(0, 10),
      ],
      maxDate: todayDate.toISOString().slice(0, 10),
    });

    this.dates = [
      [
        todayDate.toISOString().slice(0, 10),
        threeYearsAgo.toISOString().slice(0, 10),
      ],
      [
        todayDate.toISOString().slice(0, 10),
        monthAgo.toISOString().slice(0, 10),
      ],
      [
        todayDate.toISOString().slice(0, 10),
        threeMonthAgo.toISOString().slice(0, 10),
      ],
      [
        todayDate.toISOString().slice(0, 10),
        sixMonthAgo.toISOString().slice(0, 10),
      ],
      [
        todayDate.toISOString().slice(0, 10),
        twelveMonthAgo.toISOString().slice(0, 10),
      ],
    ];

    this.getData("chest");
    this.getData("ribcage");
    this.getData("waist");
    this.getData("gluteus");
  }

  getData = async (type) => {
    // const comparisonData = await api.getLastMeasurementsComparison();
    // console.log("comparisonData", comparisonData);

    const data = await api.getTrackingHistoryByType(
      this.dates[this.state.position][1],
      this.dates[this.state.position][0],
      type
    );

    let array = [];
    data?.result && Object.keys(data?.result).map((key, index) => {
      array.push({
        date: key,
        value:
          this.props.unit === "standard"
            ? parseFloat(data.result[key] / 2.54).toFixed(1)
            : data.result[key],
      });
    });

    array = array.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("array", array);

    let newArray = [];
    if (array.length > 1) {
      for (let i = 1; i < array.length; i++) {
        if (
          array[i].date.substring(0, 7) !== array[i - 1].date.substring(0, 7)
        ) {
          newArray.push(array[i - 1]);
          if (i === array.length - 1) {
            newArray.push(array[i]);
          }
        } else {
          if (
            newArray.length === 0 ||
            (i === array.length - 1 &&
              array[i].date.substring(0, 7) !==
                newArray[newArray.length - 1].date.substring(0, 7))
          ) {
            newArray.push(array[i]);
          }
        }
      }
    } else {
      newArray = array;
    }

    if (this.state.isInitial) {
      let arr = [];

      if (newArray.length > 1) {
        arr.push(newArray[newArray.length - 2]);
        arr.push(newArray[newArray.length - 1]);
      } else if (newArray.length === 1) {
        arr.push(newArray[newArray.length - 1]);
      }

      newArray = arr;

      console.log("this.state.isInitial", arr);

      const todayDate = new Date();

      let todayOffsetHours = -todayDate.getTimezoneOffset() / 60;
      todayDate.setHours(todayDate.getHours() + todayOffsetHours);

      // this.setState({
      //   pickerTitle: `${newArray[0].date.substring(
      //     8,
      //     10
      //   )}-${newArray[0].date.substring(5, 7)}-${newArray[0].date.substring(
      //     0,
      //     4
      //   )} - ${todayDate
      //     .toISOString()
      //     .substring(8, 10)}-${todayDate
      //     .toISOString()
      //     .substring(5, 7)}-${todayDate.toISOString().substring(0, 4)}`,
      // });
      this.setState({
        pickerTitle: `${this.getMonthName(
          newArray[0].date.substring(5, 7)
        )} - ${this.getMonthName(todayDate.toISOString().substring(5, 7))}`,
      });
    }

    console.log("newArray", newArray);

    let comparison = 0;
    if (this.state.isInitial) {
      if (newArray.length > 1) {
        comparison = parseFloat(
          (newArray[1].value - newArray[0].value).toFixed(3)
        );
      } else if (newArray.length === 1) {
        comparison = 0;
      }
    } else {
      comparison = parseFloat(data.comparison.toFixed(3));
    }

    this.setState(
      {
        [type + "Data"]: newArray,
        [type + "Comparison"]: comparison,
        [type + "Current"]:
          array.length !== 0 ? array[array.length - 1].value : data.currentUnit, //data.currentUnit,
      },
      () => {
        console.log(`${[type + "Data"]}`, this.state[type + "Data"]);
        console.log(
          `${[type + "Comparison"]}`,
          this.state[type + "Comparison"]
        );
        console.log(`${[type + "Current"]}`, this.state[type + "Current"]);
      }
    );

    if (this.state.isInitial) {
      setTimeout(() => {
        this.setState({ isInitial: false });
      }, 1000);
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

  getPositionValue = () => {
    return this.wheelItems[this.state.position];
  };

  setPositionValue = (value) => {
    for (let i = 0; i < this.wheelItems.length; i++) {
      if (this.wheelItems[i] === value) {
        this.setState({ wheelPosition: i });
        break;
      }
    }
  };

  onWheelDonePress = () => {
    this.setState(
      {
        isWheelModalVisible: false,
        position: this.state.wheelPosition,
      },
      () => {
        if (this.state.wheelPosition !== 0) {
          let pickerTitle = "";

          if (this.state.wheelPosition === 1) {
            pickerTitle = "Last 1 Month";
          } else if (this.state.wheelPosition === 2) {
            pickerTitle = "Last 3 Months";
          } else if (this.state.wheelPosition === 3) {
            pickerTitle = "Last 6 Months";
          } else if (this.state.wheelPosition === 4) {
            pickerTitle = "Last 12 Months";
          }

          this.setState({
            days: this.dates[this.state.position],
            pickerTitle,
          });

          this.getData("chest");
          this.getData("ribcage");
          this.getData("waist");
          this.getData("gluteus");
        }

        if (this.state.wheelPosition === 0) {
          this.setState({ isCalendarVisible: true });
        }
      }
    );
  };

  /**
Transform timestamp to the date string
*/
  getDateString(timestamp) {
    try {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      let dateString = `${year}-`;
      if (month < 10) {
        dateString += `0${month}-`;
      } else {
        dateString += `${month}-`;
      }
      if (day < 10) {
        dateString += `0${day}`;
      } else {
        dateString += day;
      }

      return dateString;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  }

  /**
Get marked period when choosing dates
*/
  getPeriod(startTimestamp, endTimestamp) {
    try {
      const period = {};
      let currentTimestamp = startTimestamp;
      while (currentTimestamp < endTimestamp) {
        const dateString = this.getDateString(currentTimestamp);
        period[dateString] = {
          color:
            Object.keys(period).length === 0
              ? "rgb(0,168,235)"
              : "rgb(205,239,250)",
          startingDay: currentTimestamp === startTimestamp,
          textColor:
            currentTimestamp === startTimestamp
              ? "rgb(255,255,255)"
              : "rgb(38,42,47)",
          selected: true,
          selectedColor: "red",
          marked: true,
        };
        currentTimestamp += 24 * 60 * 60 * 1000;
      }
      const dateString = this.getDateString(endTimestamp);
      period[dateString] = {
        color: "rgb(0,168,235)",
        endingDay: startTimestamp === endTimestamp ? false : true,
        textColor: "rgb(255,255,255)",
        selected: true,
        selectedColor: "red",
        marked: startTimestamp === endTimestamp ? false : true,
        leftFillerColor: "rgb(205,239,250)",
      };

      console.log("period", period);

      return period;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  }

  /**
Set day on user press
*/
  setDay(dayObj) {
    try {
      const { start, end } = this.state;
      const { dateString, day, month, year } = dayObj;
      // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
      const timestamp = new Date(year, month - 1, day).getTime();
      const newDayObj = { ...dayObj, timestamp };
      // if there is no start day, add start. or if there is already a end and start date, restart
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
        this.setState({ start: newDayObj, period, end: {} });
      } else {
        // if end date is older than start date switch
        const { timestamp: savedTimestamp } = start;
        if (savedTimestamp > timestamp) {
          const period = this.getPeriod(timestamp, savedTimestamp);
          this.setState(
            { start: newDayObj, end: start, period }
            // () => this.props.setPeriod(newDayObj, start, period)
          );
        } else {
          const period = this.getPeriod(savedTimestamp, timestamp);
          this.setState(
            { end: newDayObj, start, period }
            // () => this.props.setPeriod(start, newDayObj, period)
          );
        }
      }

      // setTimeout(() => {console.log(this.state)}, 1000)
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  }

  onCalendarDonePress = async () => {
    this.dates[0] = [this.state.end.dateString, this.state.start.dateString];
    const endDate =
      Object.keys(this.state.end).length === 0
        ? this.state.start
        : this.state.end;

    if (typeof this.state.start.dateString !== "undefined") {
      this.setState(
        {
          isCalendarVisible: false,
          // pickerTitle: `${this.state.start.dateString} - ${this.state.end.dateString}`,
          pickerTitle: `${this.state.start.dateString.substring(
            8,
            10
          )}-${this.state.start.dateString.substring(
            5,
            7
          )}-${this.state.start.dateString.substring(
            0,
            4
          )} - ${endDate.dateString.substring(
            8,
            10
          )}-${endDate.dateString.substring(
            5,
            7
          )}-${endDate.dateString.substring(0, 4)}`,
        },
        () => {
          this.getData("chest");
          this.getData("ribcage");
          this.getData("waist");
          this.getData("gluteus");
        }
      );
    }

    console.log(
      "selected",
      this.state.start,
      this.state.end,
      this.state.period
    );
  };

  getMinValue = (array) => {
    return parseInt(
      array.reduce((min, p) => (p.value < min ? p.value : min), array[0].value)
    );
  };

  getMaxValue = (array) => {
    console.log("getMaxValue", array);
    return Math.ceil(
      array.reduce((max, p) => (p.value > max ? p.value : max), array[0].value)
    );
  };

  render() {
    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <ScrollView>
          <View style={{ minHeight: height }}>
            <Image
              source={require("../resources/icon/grid.png")}
              style={{ position: "absolute", top: 76, alignSelf: "center" }}
            />

            {this.props.gender === "Male" ? (
              <View
                style={{ top: -64, alignSelf: "center", position: "absolute" }}
              >
                <Image
                  source={require("../resources/icon/maleUpperBody.png")}
                  style={{ alignSelf: "center" }}
                />
                <Image
                  source={require("../resources/icon/chest_male.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 148,
                    left: 116,
                  }}
                />
                <Image
                  source={require("../resources/icon/ribcage_male.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 177,
                    left: 118,
                  }}
                />
                <Image
                  source={require("../resources/icon/waist_male.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 269,
                    left: 127,
                  }}
                />
                <Image
                  source={require("../resources/icon/gluteus_male.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 331,
                    left: 117,
                  }}
                />
              </View>
            ) : (
              <View
                style={{ top: -64, alignSelf: "center", position: "absolute" }}
              >
                <Image
                  source={require("../resources/icon/femaleUpperBody.png")}
                  style={{ alignSelf: "center" }}
                />
                <Image
                  source={require("../resources/icon/chest_female.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 165,
                    left: 131,
                  }}
                />
                <Image
                  source={require("../resources/icon/ribcage_female.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 207,
                    left: 131,
                  }}
                />
                <Image
                  source={require("../resources/icon/waist_female.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 257,
                    left: 137,
                  }}
                />
                <Image
                  source={require("../resources/icon/gluteus_female.png")}
                  // 121, 119, 135
                  style={{
                    position: "absolute",
                    top: 346,
                    left: 114,
                  }}
                />
              </View>
            )}

            <View
              style={{
                width: width - 40,
                height: 44,
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.wheelPosition !== 0) {
                    this.setState(
                      { wheelPosition: this.state.wheelPosition - 1 },
                      () => {
                        this.onWheelDonePress();
                      }
                    );
                  }
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "rgb(221,224,228)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={require("../resources/icon/previous.png")} />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => this.setState({ isWheelModalVisible: true })}
              >
                <View
                  style={{
                    width: width - 148,
                    height: 44,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "rgb(221,224,228)",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.dateText}>{this.state.pickerTitle}</Text>
                  <Image
                    source={require("../resources/icon/arrowDown.png")}
                    style={{ marginLeft: 13 }}
                  />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  if (this.state.wheelPosition !== 4) {
                    this.setState(
                      { wheelPosition: this.state.wheelPosition + 1 },
                      () => {
                        this.onWheelDonePress();
                      }
                    );
                  }
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "rgb(221,224,228)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image source={require("../resources/icon/next.png")} />
                </View>
              </TouchableWithoutFeedback>
            </View>

            <View style={{ height: 343 }} />

            {this.state.chestData !== null &&
            this.state.chestData.length === 0 &&
            this.state.ribcageData !== null &&
            this.state.ribcageData.length === 0 &&
            this.state.waistData !== null &&
            this.state.waistData.length === 0 &&
            this.state.gluteusData !== null &&
            this.state.gluteusData.length === 0 ? (
              <View>
                <Image
                  source={require("../resources/icon/no_measurements.png")}
                  style={{ alignSelf: "center", marginTop: 24 }}
                />
                <Text style={styles.noDataTitle}>No Data!</Text>
                <Text style={styles.noDataText}>
                  You don't have data to show for these dates. Try changing this
                  date range or update new measurements to view this section
                </Text>
              </View>
            ) : (
              <View>
                {this.state.chestData !== null &&
                  this.state.chestData.length !== 0 && (
                    <View
                      style={{
                        marginTop: 16,
                        width: width - 40,
                        minHeight: 72,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "rgb(221,224,228)",
                        alignSelf: "center",
                        backgroundColor: "rgb(255,255,255)",
                        // flex: 1,
                      }}
                    >
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.setState({
                              isChestCollapsed: !this.state.isChestCollapsed,
                            })
                          }
                        >
                          <View
                            style={{
                              width: width - 80,
                              alignSelf: "center",
                              marginVertical: 16,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Text style={styles.cardTitle}>Chest</Text>
                              <Text style={styles.cardText}>
                                {this.props.unit === "standard"
                                  ? parseFloat(
                                      this.state.chestCurrent / 2.54
                                    ).toFixed(1)
                                  : this.state.chestCurrent}{" "}
                                <Text
                                  style={[styles.cardText, { fontSize: 14 }]}
                                >
                                  {this.props.unit === "standard" ? "in" : "cm"}
                                </Text>
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                right: 0,
                              }}
                            >
                              {this.state.chestComparison !== 0 && (
                                <View>
                                  {this.state.chestComparison >= 0 ? (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements2.png")}
                                      style={{
                                        marginRight: 5,
                                        tintColor: "#00a8eb",
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements.png")}
                                      style={{
                                        marginLeft: 30,
                                        marginRight: 5,
                                        tintColor: "rgb(186,195,208)",
                                      }}
                                    />
                                  )}
                                </View>
                              )}

                              {this.state.chestComparison !== 0 && (
                                <Text style={styles.cardComparison}>
                                  {parseFloat(
                                    this.props.unit === "standard"
                                      ? Math.abs(this.state.chestComparison) /
                                          2.54
                                      : Math.abs(this.state.chestComparison)
                                  ).toFixed(1)}
                                </Text>
                              )}

                              {!this.state.isChestCollapsed ? (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{
                                    marginLeft: 30,
                                    transform: [{ rotate: "180deg" }],
                                  }}
                                />
                              ) : (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{ marginLeft: 30 }}
                                />
                              )}
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                        <Expand value={this.state.isChestCollapsed}>
                          <View style={{ height: 209, flex: 1 }}>
                            <MeasurementsChart
                              unit={
                                this.props.unit === "standard" ? "in" : "cm"
                              }
                              data={this.state.chestData}
                              minValue={
                                this.getMinValue(this.state.chestData) ===
                                this.getMaxValue(this.state.chestData)
                                  ? 0
                                  : this.getMinValue(this.state.chestData)
                              }
                              maxValue={this.getMaxValue(this.state.chestData)}
                              // data={[
                              //   { date: "2019-08-30", value: 200 },
                              //   { date: "2019-09-20", value: 65.1 },
                              //   { date: "2019-10-25", value: 38.1 },
                              //   { date: "2019-11-28", value: 30 },
                              //   { date: "2019-03-13", value: 67.1 },
                              //   { date: "2019-05-21", value: 153.1032 },
                              //   { date: "2019-07-23", value: 95.1032 },
                              // ]}
                              // minValue={30}
                              // maxValue={200}
                            />
                          </View>
                        </Expand>
                      </View>
                    </View>
                  )}

                {this.state.ribcageData !== null &&
                  this.state.ribcageData.length !== 0 && (
                    <View
                      style={{
                        marginTop: 16,
                        width: width - 40,
                        minHeight: 72,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "rgb(221,224,228)",
                        alignSelf: "center",
                        backgroundColor: "rgb(255,255,255)",
                        // flex: 1,
                      }}
                    >
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.setState({
                              isRibcageCollapsed: !this.state
                                .isRibcageCollapsed,
                            })
                          }
                        >
                          <View
                            style={{
                              width: width - 80,
                              alignSelf: "center",
                              marginVertical: 16,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Text style={styles.cardTitle}>Ribcage</Text>
                              <Text style={styles.cardText}>
                                {this.props.unit === "standard"
                                  ? parseFloat(
                                      this.state.ribcageCurrent / 2.54
                                    ).toFixed(1)
                                  : this.state.ribcageCurrent}{" "}
                                <Text
                                  style={[styles.cardText, { fontSize: 14 }]}
                                >
                                  {this.props.unit === "standard" ? "in" : "cm"}
                                </Text>
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                right: 0,
                              }}
                            >
                              {this.state.ribcageComparison !== 0 && (
                                <View>
                                  {this.state.ribcageComparison >= 0 ? (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements2.png")}
                                      style={{
                                        marginRight: 5,
                                        tintColor: "#00a8eb",
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements.png")}
                                      style={{
                                        marginLeft: 30,
                                        marginRight: 5,
                                        tintColor: "rgb(186,195,208)",
                                      }}
                                    />
                                  )}
                                </View>
                              )}

                              {this.state.ribcageComparison !== 0 && (
                                <Text style={styles.cardComparison}>
                                  {parseFloat(
                                    this.props.unit === "standard"
                                      ? Math.abs(this.state.ribcageComparison) /
                                          2.54
                                      : Math.abs(this.state.ribcageComparison)
                                  ).toFixed(1)}
                                </Text>
                              )}

                              {!this.state.isRibcageCollapsed ? (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{
                                    marginLeft: 30,
                                    transform: [{ rotate: "180deg" }],
                                  }}
                                />
                              ) : (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{ marginLeft: 30 }}
                                />
                              )}
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                        <Expand value={this.state.isRibcageCollapsed}>
                          <View style={{ height: 209, flex: 1 }}>
                            <MeasurementsChart
                              unit={
                                this.props.unit === "standard" ? "in" : "cm"
                              }
                              data={this.state.ribcageData}
                              minValue={
                                this.getMinValue(this.state.ribcageData) ===
                                this.getMaxValue(this.state.ribcageData)
                                  ? 0
                                  : this.getMinValue(this.state.ribcageData)
                              }
                              maxValue={this.getMaxValue(
                                this.state.ribcageData
                              )}
                            />
                          </View>
                        </Expand>
                      </View>
                    </View>
                  )}

                {this.state.waistData !== null &&
                  this.state.waistData.length !== 0 && (
                    <View
                      style={{
                        marginTop: 16,
                        width: width - 40,
                        minHeight: 72,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "rgb(221,224,228)",
                        alignSelf: "center",
                        backgroundColor: "rgb(255,255,255)",
                        // flex: 1,
                      }}
                    >
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.setState({
                              isWaistCollapsed: !this.state.isWaistCollapsed,
                            })
                          }
                        >
                          <View
                            style={{
                              width: width - 80,
                              alignSelf: "center",
                              marginVertical: 16,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Text style={styles.cardTitle}>Waist</Text>
                              <Text style={styles.cardText}>
                                {this.props.unit === "standard"
                                  ? parseFloat(
                                      this.state.waistCurrent / 2.54
                                    ).toFixed(1)
                                  : this.state.waistCurrent}{" "}
                                <Text
                                  style={[styles.cardText, { fontSize: 14 }]}
                                >
                                  {this.props.unit === "standard" ? "in" : "cm"}
                                </Text>
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                right: 0,
                              }}
                            >
                              {this.state.waistComparison !== 0 && (
                                <View>
                                  {this.state.waistComparison >= 0 ? (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements2.png")}
                                      style={{
                                        marginRight: 5,
                                        tintColor: "#00a8eb",
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements.png")}
                                      style={{
                                        marginLeft: 30,
                                        marginRight: 5,
                                        tintColor: "rgb(186,195,208)",
                                      }}
                                    />
                                  )}
                                </View>
                              )}

                              {this.state.waistComparison !== 0 && (
                                <Text style={styles.cardComparison}>
                                  {parseFloat(
                                    this.props.unit === "standard"
                                      ? Math.abs(this.state.waistComparison) /
                                          2.54
                                      : Math.abs(this.state.waistComparison)
                                  ).toFixed(1)}
                                </Text>
                              )}

                              {!this.state.isWaistCollapsed ? (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{
                                    marginLeft: 30,
                                    transform: [{ rotate: "180deg" }],
                                  }}
                                />
                              ) : (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{ marginLeft: 30 }}
                                />
                              )}
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                        <Expand value={this.state.isWaistCollapsed}>
                          <View style={{ height: 209, flex: 1 }}>
                            <MeasurementsChart
                              unit={
                                this.props.unit === "standard" ? "in" : "cm"
                              }
                              data={this.state.waistData}
                              minValue={
                                this.getMinValue(this.state.waistData) ===
                                this.getMaxValue(this.state.waistData)
                                  ? 0
                                  : this.getMinValue(this.state.waistData)
                              }
                              maxValue={this.getMaxValue(this.state.waistData)}
                            />
                          </View>
                        </Expand>
                      </View>
                    </View>
                  )}

                {this.state.gluteusData !== null &&
                  this.state.gluteusData.length !== 0 && (
                    <View
                      style={{
                        marginTop: 16,
                        width: width - 40,
                        minHeight: 72,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: "rgb(221,224,228)",
                        alignSelf: "center",
                        backgroundColor: "rgb(255,255,255)",
                        // flex: 1,
                      }}
                    >
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.setState({
                              isGluteusCollapsed: !this.state
                                .isGluteusCollapsed,
                            })
                          }
                        >
                          <View
                            style={{
                              width: width - 80,
                              alignSelf: "center",
                              marginVertical: 16,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View>
                              <Text style={styles.cardTitle}>Gluteus</Text>
                              <Text style={styles.cardText}>
                                {this.props.unit === "standard"
                                  ? parseFloat(
                                      this.state.gluteusCurrent / 2.54
                                    ).toFixed(1)
                                  : this.state.gluteusCurrent}{" "}
                                <Text
                                  style={[styles.cardText, { fontSize: 14 }]}
                                >
                                  {this.props.unit === "standard" ? "in" : "cm"}
                                </Text>
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                right: 0,
                              }}
                            >
                              {this.state.gluteusComparison !== 0 && (
                                <View>
                                  {this.state.gluteusComparison >= 0 ? (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements2.png")}
                                      style={{
                                        marginRight: 5,
                                        tintColor: "#00a8eb",
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={require("../resources/icon/arrowUp_measurements.png")}
                                      style={{
                                        marginLeft: 30,
                                        marginRight: 5,
                                        tintColor: "rgb(186,195,208)",
                                      }}
                                    />
                                  )}
                                </View>
                              )}

                              {this.state.gluteusComparison !== 0 && (
                                <Text style={styles.cardComparison}>
                                  {parseFloat(
                                    this.props.unit === "standard"
                                      ? Math.abs(this.state.gluteusComparison) /
                                          2.54
                                      : Math.abs(this.state.gluteusComparison)
                                  ).toFixed(1)}
                                </Text>
                              )}

                              {!this.state.isGluteusCollapsed ? (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{
                                    marginLeft: 30,
                                    transform: [{ rotate: "180deg" }],
                                  }}
                                />
                              ) : (
                                <Image
                                  source={require("../resources/icon/arrowUp.png")}
                                  style={{ marginLeft: 30 }}
                                />
                              )}
                            </View>
                          </View>
                        </TouchableWithoutFeedback>

                        <Expand value={this.state.isGluteusCollapsed}>
                          <View style={{ height: 209, flex: 1 }}>
                            <MeasurementsChart
                              unit={
                                this.props.unit === "standard" ? "in" : "cm"
                              }
                              data={this.state.gluteusData}
                              minValue={
                                this.getMinValue(this.state.gluteusData) ===
                                this.getMaxValue(this.state.gluteusData)
                                  ? 0
                                  : this.getMinValue(this.state.gluteusData)
                              }
                              maxValue={this.getMaxValue(
                                this.state.gluteusData
                              )}
                            />
                          </View>
                        </Expand>
                      </View>
                    </View>
                  )}
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <Dialog
          visible={this.state.isWheelModalVisible}
          containerStyle={{ justifyContent: "flex-end" }}
          onTouchOutside={() => {
            console.log("onTouchOutside");
            this.setState({
              isWheelModalVisible: false,
              wheelPosition: this.state.position,
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
                height: 224,
                backgroundColor: "rgb(255,255,255)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width,
                  height: 224,
                  alignSelf: "center",
                  marginTop: 0,
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={{
                    backgroundColor: "rgb(255,255,255)",
                    width,
                    // height: 120,
                    alignSelf: "center",
                  }}
                  selectedValue={this.wheelItems[this.state.wheelPosition]}
                  pickerData={this.wheelItems}
                  onValueChange={(value) => this.setPositionValue(value)}
                  itemSpace={30} // this only support in android
                />
              </View>

              <TouchableWithoutFeedback onPress={this.onWheelDonePress}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: "center",
                    alignSelf: "center",
                    position: "absolute",
                    top: 0,
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          visible={this.state.isCalendarVisible}
          containerStyle={{
            marginTop: isIphoneX() ? -240 : Platform.OS === "ios" ? 50 : 0,
          }}
          onTouchOutside={() => {
            console.log("onTouchOutside");
            this.setState({ isCalendarVisible: false });
          }}
          onDismiss={() => {
            this.setState({ isCalendarVisible: false });
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
              width,
              borderRadius: 14,
              overflow: "visible",
              backgroundColor: "rgb(255,255,255)",
              elevation: 3,
              shadowColor: "rgb(39,56,73)",
              shadowOffset: { width: 0, height: 6 },
              shadowRadius: 16,
              shadowOpacity: 0.16,
            }}
          >
            <View
              style={{
                width,
                borderRadius: 14,
                backgroundColor: "rgb(255,255,255)",
                alignSelf: "center",
              }}
            >
              <Calendar
                ref={(header) => (this.calendar = header)}
                onDayPress={(day) => this.setDay(day)}
                // maxDate={new Date().toISOString().slice(0,10)}
                // onDayPress={() => null}
                firstDay={1}
                markingType={"period"}
                markedDates={this.state.period}
                maxDate={this.state.maxDate}
                // markedDates={{
                //   ...this.state.selected,
                // }}
                style={{
                  borderRadius: 14,
                }}
                theme={{
                  "stylesheet.calendar.header": {
                    header: {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 8,
                      alignItems: "center",
                      marginBottom: 19,
                    },
                    monthText: {
                      fontFamily: "SFProText-Medium",
                      fontWeight: "500",
                      fontSize: 14,
                      letterSpacing: -0.08,
                      color: "rgb(54,58,61)",
                    },
                  },
                  // 'stylesheet.day.basic': {
                  "stylesheet.day.single": {
                    selected: {
                      backgroundColor: "rgb(0,168,235)",
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
                      color: "rgb(205,209,215)",
                    },
                    text: {
                      marginTop: 0, //Platform.OS === 'android' ? 4 : 6,
                      fontSize: 15,
                      fontFamily: "SFProText-Regular",
                      fontWeight: "400",
                      color: "rgb(38,42,47)",
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      backgroundColor: "rgba(255,255,255,0)",
                    },
                    base: {
                      // width: 40,
                      // height: 40,
                      // alignItems: 'center',
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      alignItems: "center",
                      borderWidth: 0, //2,
                      borderRadius: 18,
                      borderColor: "rgb(0,168,235)",
                    },
                  },
                  "stylesheet.day.period": {
                    selected: {
                      backgroundColor: "rgb(0,168,235)",
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
                      color: "rgb(205,209,215)",
                    },
                    text: {
                      marginTop: 0, //Platform.OS === 'android' ? 4 : 6,
                      fontSize: 15,
                      fontFamily: "SFProText-Regular",
                      fontWeight: "400",
                      color: "rgb(38,42,47)",
                      lineHeight: 20,
                      letterSpacing: -0.5,
                      backgroundColor: "rgba(255,255,255,0)",
                    },
                    base: {
                      // width: 40,
                      // height: 40,
                      // alignItems: 'center',
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      alignItems: "center",
                      borderWidth: 0, //2,
                      borderRadius: 18,
                      borderColor: "rgb(0,168,235)",
                    },
                  },
                  selectedDayBackgroundColor: "rgb(0,168,235)",
                  selectedDayTextColor: "rgb(255,255,255)",
                  selectedDayFontFamily: "SFProText-Regular",
                  selectedDayFontSize: 15,
                  indicatorColor: "white",

                  dayTextColor: "rgb(38,42,47)",
                  todayTextColor: "rgb(0,168,235)",
                  monthTextColor: "rgb(141,147,151)",

                  textDisabledColor: "rgb(205,209,215)",
                  textDayFontFamily: "SFProText-Regular",
                  textMonthFontFamily: "SFProText-Medium",
                  textDayHeaderFontFamily: "SFProText-Medium",
                  textDayFontWeight: "400",
                  textMonthFontWeight: "500",
                  textDayHeaderFontWeight: "500",
                  textDayFontSize: 15,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
                renderArrow={(direction) => (
                  <Image
                    source={require("../resources/icon/previous.png")}
                    style={{
                      transform: [
                        { rotate: direction === "left" ? "0deg" : "180deg" },
                      ],
                      marginLeft: direction === "left" ? -5 : 0,
                      marginRight: direction === "left" ? 0 : -5,
                    }}
                  />
                )}
              />

              <View
                style={{
                  flexDirection: "row",
                  width: width - 40,
                  alignItems: "center",
                  alignSelf: "center",
                  marginBottom: 0,
                  marginTop: 26,
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({
                      isCalendarVisible: false,
                      selected: undefined,
                    })
                  }
                >
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: "rgb(255,255,255)",
                      borderWidth: 1,
                      borderColor: "rgb(0,168,235)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 15,
                    }}
                  >
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.onCalendarDonePress}>
                  <View
                    style={{
                      width: (width - 55) / 2,
                      height: 36,
                      borderRadius: 22,
                      backgroundColor: "rgb(0,168,235)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  calendarCancelText: {
    fontFamily: "SFProText-Regular",
    fontSize: 15,
    fontWeight: "400",
    color: "rgb(0,168,235)",
  },
  calendarDoneText: {
    fontFamily: "SFProText-Semibold",
    fontSize: 15,
    fontWeight: "600",
    color: "rgb(255,255,255)",
  },
  cardTitle: {
    fontFamily: "SFProText-Regular",
    fontSize: 14,
    fontWeight: "400",
    color: "rgb(106,111,115)",
  },
  cardText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 18,
    color: "rgb(31,33,35)",
    marginTop: 4,
  },
  cardComparison: {
    fontFamily: "SFProText-Semibold",
    fontSize: 14,
    fontWeight: "600",
    color: "rgb(31,33,35)",
  },
  noDataTitle: {
    fontFamily: "SFProText-Semibold",
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    color: "rgb(16,16,16)",
    marginTop: 24,
    alignSelf: "center",
  },
  noDataText: {
    fontFamily: "SFProText-Regular",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    color: "rgb(106,111,115)",
    marginTop: 10,
    width: width - 135,
    textAlign: "center",
    alignSelf: "center",
  },
});

export default BodyMetricsUpperBody;

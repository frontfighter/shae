import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  FlatList,
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

import { getUserVariables } from "../data/db/Db";
import * as shaefitApi from "../API/shaefitAPI";
import LoadingIndicator from "../components/LoadingIndicator";
import PilotSurveyChart from "../components/PilotSurveyChart";
import ShineOverlay from "../components/ShineOverlay";
import { URL_ADRESS } from "../constants";

const { height, width } = Dimensions.get("window");

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: "top", // optional
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

class QuestionsListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  transformArray = (array, transformation) => {
    console.log("transformArray array", array);
    let newArray = [];
    if (transformation === "awake") {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];

        // if (item.hours < 6 && item.hours >= 0) {
        //   item.hours = 6;
        //   item.minutes = 0;
        // } else if (item.hours > 9 && item.hours < 18) {
        //   item.hours = 9;
        //   item.minutes = 0;
        // }
        //
        // const fraction = item.minutes / 60;

        // item.value = (100 / 3) * (item.hours + fraction - 6);

        item.value =
          item.value === 1 ? 0 : item.value === -1 ? -1 : item.value * 25 - 20;

        newArray.push(item);
      }
    } else if (transformation === "sleepAmount") {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];

        // if (item.value < 5 && item.value >= 0) {
        //   item.value = 5;
        // } else if (item.value > 8) {
        //   item.value = 8;
        // }
        //
        // item.value = (100 / 3) * (item.value - 5);

        item.value =
          item.value === 1 ? 0 : item.value === -1 ? -1 : item.value * 25 - 20;

        newArray.push(item);
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];

        item.value =
          item.value === 1 ? 0 : item.value === -1 ? -1 : item.value * 25 - 20;

        newArray.push(item);
      }
    }

    // if (transformation === "common") {
    //   for (let i = 0; i < array.length; i++) {
    //     let item = array[i];
    //
    //     item.value = item.value * 20;
    //
    //     newArray.push(item);
    //   }
    // }

    console.log("newArray", transformation, newArray);
    console.log("oldArray", array, this.props.item.questionId);

    return newArray;
  };

  render() {
    let yAxis = "";
    if (this.props.item.questionId === 23) {
      yAxis = "awake";
    } else if (this.props.item.questionId === 24) {
      yAxis = "sleepAmount";
    } else if (
      this.props.item.questionId === 35 ||
      this.props.item.questionId === 33
    ) {
      yAxis = "levelOfPain";
    }
    // else if (this.props.item.questionId === 33) {
    //   yAxis = "stressAmount";
    // }
    else if (this.props.item.questionId === 32) {
      yAxis = "tired";
    } else if (this.props.item.questionId === 30) {
      yAxis = "foodAmount";
    } else if (this.props.item.questionId === 29) {
      yAxis = "foodFollowing";
    } else if (this.props.item.questionId === 26) {
      yAxis = "wakeupFeeling";
    } else {
      yAxis = "common";
    }

    return (
      <View>
        <PilotSurveyChart
          title="Sleep"
          diff={this.props.diff}
          color={this.props.color}
          isQuestions={this.props.index === 0 ? true : undefined}
          question={this.props.item.questionText}
          yAxis={yAxis}
          data={this.transformArray(this.props.item.data, yAxis)}
          isDetailed={true}
          // data={
          //   this.state.position === 0
          //     ? this.transformArray(
          //         [
          //           {
          //             date: "2020-07-03",
          //             value: 64,
          //             hours: 5,
          //             minutes: 30,
          //           },
          //           {
          //             date: "2020-07-04",
          //             value: 75,
          //             hours: 12,
          //             minutes: 30,
          //           },
          //           {
          //             date: "2020-07-05",
          //             value: 82,
          //             hours: 6,
          //             minutes: 20,
          //           },
          //           {
          //             date: "2020-07-06",
          //             value: 82,
          //             hours: 7,
          //             minutes: 40,
          //           },
          //           { date: "2020-07-07", value: 76, hours: 8, minutes: 0 },
          //           {
          //             date: "2020-07-08",
          //             value: 77,
          //             hours: 8,
          //             minutes: 20,
          //           },
          //           { date: "2020-07-09", value: 83, hours: 9, minutes: 0 },
          //         ],
          //         "awake"
          //       )
          //     : this.state.position === 1
          //     ? this.transformArray(
          //         [
          //           {
          //             date: "2020-06-26",
          //             value: 48,
          //             hours: 12,
          //             minutes: 0,
          //           },
          //           {
          //             date: "2020-06-27",
          //             value: 42,
          //             hours: 8,
          //             minutes: 20,
          //           },
          //           {
          //             date: "2020-06-28",
          //             value: 46,
          //             hours: 6,
          //             minutes: 12,
          //           },
          //           { date: "2020-06-29", value: 60, hours: 5, minutes: 0 },
          //           {
          //             date: "2020-06-30",
          //             value: 69,
          //             hours: 8,
          //             minutes: 15,
          //           },
          //           {
          //             date: "2020-07-01",
          //             value: 62,
          //             hours: 8,
          //             minutes: 50,
          //           },
          //           { date: "2020-07-02", value: 65, hours: 3, minutes: 0 },
          //           {
          //             date: "2020-07-03",
          //             value: 64,
          //             hours: 11,
          //             minutes: 0,
          //           },
          //           {
          //             date: "2020-07-04",
          //             value: 75,
          //             hours: 6,
          //             minutes: 50,
          //           },
          //           { date: "2020-07-05", value: 82, hours: 7, minutes: 9 },
          //           {
          //             date: "2020-07-06",
          //             value: 82,
          //             hours: 7,
          //             minutes: 47,
          //           },
          //           {
          //             date: "2020-07-07",
          //             value: 76,
          //             hours: 8,
          //             minutes: 29,
          //           },
          //           {
          //             date: "2020-07-08",
          //             value: 77,
          //             hours: 6,
          //             minutes: 59,
          //           },
          //           {
          //             date: "2020-07-09",
          //             value: 83,
          //             hours: 7,
          //             minutes: 41,
          //           },
          //         ],
          //         "awake"
          //       )
          //     : this.transformArray(
          //         [
          //           {
          //             date: "2020-07-07",
          //             value: 76,
          //             hours: 5,
          //             minutes: 30,
          //           },
          //           {
          //             date: "2020-07-08",
          //             value: 77,
          //             hours: 7,
          //             minutes: 30,
          //           },
          //           {
          //             date: "2020-07-09",
          //             value: 83,
          //             hours: 8,
          //             minutes: 30,
          //           },
          //         ],
          //         "awake"
          //       )
          // }
        />
      </View>
    );
  }
}

class PilotSurveyDetailsScreen extends Component {
  constructor() {
    super();

    this.state = {
      isWheelModalVisible: false,
      isCalendarVisible: false,
      pickerTitle: "Last 14 Days",
      days: [],
      position: 1,
      wheelPosition: 1,
      calendarSelected: [],
      selected: undefined,
      start: {},
      end: {},
      period: {},
      maxDate: "",

      data: [],
      type: "",
      pilotStartDate: "",
      isLoading: true,
    };

    this.dates = [];
    this.wheelItems = ["Last 7 Days", "Last 14 Days", "Select Date"];
    this.url = "";
  }

  async componentDidMount() {
    Actions.refresh({ title: this.props.title });
    // Sleep, Mood, Food, Stress, Overall Health
    // sleep, mood, food, stress, overall_health

    const userData = await shaefitApi.getUserDetails();
    if (
      userData.survey_data !== null &&
      typeof userData.survey_data.pilotStartDate !== "undefined"
    ) {
      this.setState({
        pilotStartDate: userData.survey_data.pilotStartDate.slice(0, 10),
      });
    }

    if (
      typeof userData.hasPilotSurvey !== "undefined" &&
      userData.hasPilotSurvey === true
    ) {
      this.url = `${URL_ADRESS}/mobile/checkin`;
    } else {
      this.url = `${URL_ADRESS}/mobile/checkin`;
    }

    let type = "";
    switch (this.props.title) {
      case "Sleep":
        type = "sleep";
        break;
      case "Mood":
        type = "mood";
        break;
      case "Food":
        type = "food";
        break;
      case "Stress":
        type = "stress";
        break;
      case "Overall Health":
        type = "overall_health";
        break;
      default:
        type = "";
    }

    console.log("title", this.props.title, type);

    // const todayDate = new Date();
    // let weekAgo = new Date();
    // weekAgo.setDate(weekAgo.getDate() - 6);
    // let twoWeeksAgo = new Date();
    // twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

    const todayDate = new Date(
      userData.survey_data.pilotStartDate.slice(0, 10)
    );

    let todayOffsetHours = -todayDate.getTimezoneOffset() / 60;
    todayDate.setHours(todayDate.getHours() + todayOffsetHours);

    let weekAgo = new Date(userData.survey_data.pilotStartDate.slice(0, 10));
    weekAgo.setDate(weekAgo.getDate() + 6);

    weekAgo.setHours(weekAgo.getHours() + todayOffsetHours);
    let twoWeeksAgo = new Date(
      userData.survey_data.pilotStartDate.slice(0, 10)
    );
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() + 13);

    twoWeeksAgo.setHours(twoWeeksAgo.getHours() + todayOffsetHours);

    this.getData(
      // twoWeeksAgo.toISOString().slice(0, 10),
      // todayDate.toISOString().slice(0, 10)
      todayDate.toISOString().slice(0, 10),
      twoWeeksAgo.toISOString().slice(0, 10),
      type
    );

    const today = new Date();
    today.setHours(today.getHours() + todayOffsetHours);

    this.setState({
      calendarSelected: [
        today.toISOString().slice(0, 10),
        today.toISOString().slice(0, 10),
      ],
      maxDate: today.toISOString().slice(0, 10),
      type,
    });

    // this.setState({
    //   calendarSelected: [
    //     todayDate.toISOString().slice(0, 10),
    //     todayDate.toISOString().slice(0, 10),
    //   ],
    //   type,
    // });

    this.dates = [
      [
        // weekAgo.toISOString().slice(0, 10),
        // todayDate.toISOString().slice(0, 10),
        todayDate.toISOString().slice(0, 10),
        weekAgo.toISOString().slice(0, 10),
      ],
      [
        // twoWeeksAgo.toISOString().slice(0, 10),
        // todayDate.toISOString().slice(0, 10),
        todayDate.toISOString().slice(0, 10),
        twoWeeksAgo.toISOString().slice(0, 10),
      ],
      [
        todayDate.toISOString().slice(0, 10),
        todayDate.toISOString().slice(0, 10),
      ],
    ];
  }

  getData = async (dateFrom, dateTo, type) => {
    this.setState({ isLoading: true, data: [] });
    const data = await shaefitApi.getPilotSurveyHistoryByType(
      dateFrom,
      dateTo,
      type
    );

    let questionsArray = [];
    Object.keys(data[this.state.type]).map((key, index) => {
      let dataArray = [];
      Object.keys(data[this.state.type][key].data).map((key2, index2) => {
        let obj = {
          date: key2,
          value: data[this.state.type][key].data[key2],
        };
        console.log("data[this.state.type][key]", data[this.state.type][key]);
        if (data[this.state.type][key].questionId === 23) {
          obj["hours"] = data[this.state.type][key].data[key2];
          obj["minutes"] = 0;

          console.log("obj", obj);

          if (obj.value === 3) {
            obj.value = 2;
          } else if (obj.value === 5) {
            obj.value = 3;
          } else if (obj.value === 2) {
            obj.value = 5;
          }
        }

        if (data[this.state.type][key].questionId === 24) {
          if (obj.value === 5) {
            obj.value = 4;
          } else if (obj.value === 4) {
            obj.value = 5;
          }
        }

        if (data[this.state.type][key].questionId === 30) {
          if (obj.value === 2) {
            obj.value = 1;
          } else if (obj.value === 4) {
            obj.value = 2;
          } else if (obj.value === 5) {
            obj.value = 3;
          } else if (obj.value === 3) {
            obj.value = 4;
          } else if (obj.value === 1) {
            obj.value = 5;
          }
        }

        dataArray.push(obj);
      });

      dataArray = this.sortArrayByDate(dataArray);

      console.log("dataArray", dataArray);

      let questionText = "";
      if (data[this.state.type][key].questionId === 23) {
        questionText = "Wakeup Time";
      } else if (data[this.state.type][key].questionId === 26) {
        questionText = "Wakeup State";
      } else if (data[this.state.type][key].questionId === 24) {
        questionText = "Total Sleep";
      } else if (data[this.state.type][key].questionId === 25) {
        questionText = "Sleep Quality";
      } else if (data[this.state.type][key].questionId === 27) {
        questionText = "Wakeup Mood";
      } else if (data[this.state.type][key].questionId === 28) {
        questionText = "Wakeup Energy";
      } else if (data[this.state.type][key].questionId === 29) {
        questionText = "Food Adherence";
      } else if (data[this.state.type][key].questionId === 30) {
        questionText = "Food Consumption";
      } else if (data[this.state.type][key].questionId === 31) {
        questionText = "Food Response";
      } else if (data[this.state.type][key].questionId === 32) {
        questionText = "Stress State";
      } else if (data[this.state.type][key].questionId === 33) {
        questionText = "Stress Level";
      } else if (data[this.state.type][key].questionId === 34) {
        questionText = "Resilience";
      } else if (data[this.state.type][key].questionId === 35) {
        questionText = "Pain Level";
      } else if (data[this.state.type][key].questionId === 36) {
        questionText = "Happiness Level";
      } else if (data[this.state.type][key].questionId === 37) {
        questionText = "Energy Level";
      } else if (data[this.state.type][key].questionId === 38) {
        questionText = "Mental Health";
      } else if (data[this.state.type][key].questionId === 39) {
        questionText = "Quality of Life";
      } else if (data[this.state.type][key].questionId === 40) {
        questionText = "Emotional State";
      } else if (data[this.state.type][key].questionId === 41) {
        questionText = "General Health";
      }

      questionsArray.push({
        questionId: data[this.state.type][key].questionId,
        questionText: questionText, //data[this.state.type][key].questionText,
        subject: data[this.state.type][key].subject,
        data: dataArray,
      });
    });

    for (let i = 0; i < questionsArray.length; i++) {
      let fullArray = this.getAllDatesArray(
        dateFrom,
        dateTo,
        questionsArray[i].questionId === 23 ? true : false
      );

      // let isBreaked = false;
      for (let k = 0; k < questionsArray[i].data.length; k++) {
        let item = questionsArray[i].data[k];

        console.log("questionsArray[i].data[k]", questionsArray[i].data[k]);
        for (let j = 0; j < fullArray.length; j++) {
          console.log("comparison", item.date, fullArray[j].date);
          if (item.date === fullArray[j].date) {
            console.log("comparison2", item, fullArray[j]);
            fullArray[j].value = item.value;
            fullArray[j].isLast =
              k === questionsArray[i].data.length - 1 ? true : false;

            if (questionsArray[i].questionId === 23) {
              fullArray[j].hours = item.value;
              fullArray[j].minutes = 0;
            }

            // isBreaked = true;
            //
            // break;
          }
        }

        // if (isBreaked === true) {
        //   break;
        // }
      }

      questionsArray[i].data = fullArray;
    }

    console.log("getData", data);
    console.log("getData", questionsArray);

    this.setState({ data: questionsArray, isLoading: false });
  };

  getAllDatesArray = (dateFrom, dateTo, isHours) => {
    let firstDate = { date: dateFrom, value: -1 };
    if (isHours) {
      firstDate.hours = 0;
      firstDate.minutes = 0;
    }

    let allDatesArray = [firstDate];

    const dateStart = new Date(dateFrom);
    const dateEnd = new Date(dateTo);

    const diffTime = Math.abs(dateEnd - dateStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays !== 0) {
      for (let i = 1; i < diffDays; i++) {
        let date = new Date(dateFrom);
        date.setDate(date.getDate() + i);

        let obj = { date: date.toISOString().slice(0, 10), value: -1 };

        if (isHours) {
          obj.hours = 0;
          obj.minutes = 0;
        }

        allDatesArray.push(obj);
      }
    }

    if (dateFrom !== dateTo) {
      let lastDate = { date: dateTo, value: -1 };
      if (isHours) {
        lastDate.hours = 0;
        lastDate.minutes = 0;
      }

      allDatesArray.push(lastDate);
    }

    console.log("allDatesArray", allDatesArray);

    return allDatesArray;
  };

  sortArrayByDate = (array) => {
    const newArray = array.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    return newArray;
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
        if (this.state.wheelPosition !== 2) {
          this.getData(
            this.dates[this.state.position][0],
            this.dates[this.state.position][1],
            this.state.type
          );

          this.setState({
            days: this.dates[this.state.position],
            pickerTitle:
              this.state.wheelPosition === 0
                ? "Last 7 Days"
                : this.state.wheelPosition === 1
                ? "Last 14 Days"
                : this.state.pickerTitle,
          });
        }

        if (this.state.wheelPosition === 2) {
          this.setState({ isCalendarVisible: true });
        }
      }
    );

    // this.getData();
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
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    const newDate = new Date(dayObj.dateString);
    if (today.getTime() >= newDate.getTime()) {
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
              color: "rgb(0,168,235)",
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
            let period = this.getPeriod(timestamp, savedTimestamp);

            let lastDate = new Date(newDayObj);
            lastDate.setDate(lastDate.getDate() + 13);

            let lastDay = start; //Object.keys(period);
            // lastDay = lastDay.pop();

            // let lastDay =
            //   period[Object.keys(period)[Object.keys(period).length - 1]];

            console.log("lastDay", lastDay);

            if (Object.keys(period).length !== 0) {
              const length = Object.keys(period).length;

              if (length > 14) {
                Object.keys(period).forEach((key, index) => {
                  if (index === 13) {
                    // period[key].endingDay = true;
                    period[key].color = "rgb(0,168,235)";
                    period[key].textColor = "rgb(255,255,255)";
                    period[key].isLastPossibleDay = true;
                    period[key].endingDay = true;
                    // lastDay = key;

                    let date = new Date(key);

                    lastDay = {
                      year: key.substring(0, 4),
                      month: parseInt(key.substring(5, 7)),
                      day: parseInt(key.substring(8, 10)),
                      dateString: key,
                      timestamp: date.getTime(),
                    };
                  }

                  if (index >= 14) {
                    // delete period[key];

                    // period[key].fillerStyle = "rgba(199,202,204,0.3)";
                    period[key].fillerStyle = "rgb(238,239,239)";
                  }

                  if (index === length - 1) {
                    period[key].color = "rgb(238,239,239)";
                    // period[key].color = "rgb(201,201,201)";
                    period[key].textColor = "rgb(38,42,47)";
                  }
                });
                // for (let i = 14; i < length; i++) {
                //   period = Object.entries(period).slice(-1);
                // }
              }
            }

            console.log("period", period, lastDay);

            this.setState(
              { start: newDayObj, end: lastDay, period }
              // () => this.props.setPeriod(newDayObj, start, period)
            );
          } else {
            let period = this.getPeriod(savedTimestamp, timestamp);

            let lastDay = newDayObj; //Object.keys(period);
            // lastDay = lastDay.pop();

            // let lastDay =
            //   period[Object.keys(period)[Object.keys(period).length - 1]];

            console.log("lastDay", lastDay);

            if (Object.keys(period).length !== 0) {
              const length = Object.keys(period).length;

              if (length > 14) {
                Object.keys(period).forEach((key, index) => {
                  if (index === 13) {
                    // period[key].endingDay = true;
                    period[key].color = "rgb(0,168,235)";
                    period[key].textColor = "rgb(255,255,255)";
                    period[key].endingDay = true;
                    period[key].isLastPossibleDay = true;
                    // lastDay = key;

                    let date = new Date(key);

                    lastDay = {
                      year: key.substring(0, 4),
                      month: parseInt(key.substring(5, 7)),
                      day: parseInt(key.substring(8, 10)),
                      dateString: key,
                      timestamp: date.getTime(),
                    };
                  }

                  if (index >= 14) {
                    // delete period[key];

                    // period[key].fillerStyle = "rgba(199,202,204,0.3)";
                    period[key].fillerStyle = "rgb(238,239,239)";
                  }

                  if (index === length - 1) {
                    // period[key].color = "rgba(199,202,204,0.3)";
                    period[key].color = "rgb(238,239,239)";
                    period[key].textColor = "rgb(38,42,47)";
                  }
                });
                // for (let i = 14; i < length; i++) {
                //   period = Object.entries(period).slice(-1);
                // }
              }
            }

            console.log("period", period, lastDay);

            this.setState(
              { end: lastDay, start, period }
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
  }

  /**
   * Set the calendar dates period.
   */
  setPeriod = async (start, end, period) => {
    try {
      const data = await api.getTrackingHistoryPeriod(
        this.props.type,
        start.dateString,
        end.dateString
      );
      console.log("TrackDetails state", data);
      console.log("TrackDetails state", start);

      if (typeof data.results !== "undefined") {
        const title = `${start.day} ${this.getMonth(start.month - 1)}, ${
          start.year
        } - ${end.day} ${this.getMonth(end.month - 1)}, ${end.year}`;

        let averageValue = 0;
        Object.keys(data.results).forEach((key) => {
          averageValue += Number(data.results[key]);
        });

        averageValue /= Object.keys(data.results).length;

        const daysBetween = this.daysBetweenDates(
          end.timestamp,
          start.timestamp
        );

        let datesArray = [];
        const resultDatesArray = [];

        Object.keys(data.results).map((key) => {
          const dateNumber = key.replace(/-/g, "");
          resultDatesArray.push(dateNumber);
        });

        console.log("midpoint", resultDatesArray);

        if (daysBetween >= 6) {
          datesArray.push(new Date(start.timestamp));
          datesArray.push(
            new Date(start.timestamp + (end.timestamp - start.timestamp) / 5)
          );
          datesArray.push(
            new Date(
              start.timestamp + ((end.timestamp - start.timestamp) / 5) * 2
            )
          );
          datesArray.push(
            new Date(
              start.timestamp + ((end.timestamp - start.timestamp) / 5) * 3
            )
          );
          datesArray.push(
            new Date(
              start.timestamp + ((end.timestamp - start.timestamp) / 5) * 4
            )
          );
          datesArray.push(new Date(end.timestamp));
        } else if (daysBetween <= 5 && daysBetween >= 1) {
          datesArray.push(new Date(start.timestamp));

          for (let i = 1; i < daysBetween; i++) {
            datesArray.push(new Date(start.timestamp + i * 86400000));
          }
          datesArray.push(new Date(end.timestamp));
        } else {
          datesArray.push(new Date(start.timestamp));
          datesArray.push(new Date(end.timestamp));
        }

        const calendarDates = this.findClosest(
          datesArray,
          resultDatesArray,
          data.results
        );

        console.log(
          "midpoint1",
          datesArray,
          daysBetween,
          this.findClosest(datesArray, resultDatesArray, data.results)
        );

        const maxValue = Math.max.apply(null, Object.values(data.results));
        console.log("cwm2", maxValue);

        this.setState(
          {
            data,
            maxValue,
            dropdownTitle: title,
            averageValue,
            start,
            end,
            period,
            calendarDates,
          },
          () => console.log("TrackDetails state", this.state)
        );
      }

      this.refs.modal.close();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Find closest dates to the API dates.
   */
  findClosest = (date, arr, resultsArray) => {
    try {
      const array = [];

      for (let i = 0; i < date.length; i++) {
        if (resultsArray.length === 0) {
          array.push({ date: date[i], result: "0" });
        } else if (resultsArray.length === 1) {
          array.push({ date: date[i], result: resultsArray[0] });
        } else {
          const value =
            date[i].getFullYear() +
            ("0" + (date[i].getMonth() + 1)).slice(-2) +
            ("0" + date[i].getDate()).slice(-2);

          const indexArr = arr.map((k) => Math.abs(k - value));
          const min = Math.min.apply(Math, indexArr);

          let result =
            arr[indexArr.indexOf(min)].slice(0, 4) +
            "-" +
            arr[indexArr.indexOf(min)].slice(4, 6) +
            "-" +
            arr[indexArr.indexOf(min)].slice(6, 8);
          array.push({ date: date[i], result: resultsArray[result] });
        }
      }

      console.log("findClosest", array);

      return array;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  daysBetweenDates = (date1, date2) => {
    try {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      const differenceMs = Math.abs(date1 - date2);

      return Math.round(differenceMs / ONE_DAY);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onCalendarDonePress = async () => {
    this.dates[2] = [this.state.start.dateString, this.state.end.dateString];
    const endDate =
      Object.keys(this.state.end).length === 0
        ? this.state.start
        : this.state.end;

    this.setState({
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
      )}-${endDate.dateString.substring(5, 7)}-${endDate.dateString.substring(
        0,
        4
      )}`,
    });
    console.log(
      "selected",
      this.state.start,
      this.state.end,
      this.state.period
    );

    this.getData(
      this.state.start.dateString,
      endDate.dateString,
      this.state.type
    );
  };

  transformArray = (array, transformation) => {
    let newArray = [];
    if (transformation === "awake") {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];

        if (item.hours < 6 && item.hours > 0) {
          item.hours = 6;
          item.minutes = 0;
        } else if (item.hours > 9 && item.hours < 18) {
          item.hours = 9;
          item.minutes = 0;
        }

        const fraction = item.minutes / 60;

        item.value = (100 / 3) * (item.hours + fraction - 6);

        newArray.push(item);
      }
    }

    if (transformation === "sleepAmount") {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];

        if (item.value < 5 && item.value > 0) {
          item.value = 5;
        } else if (item.value > 8) {
          item.value = 8;
        }

        item.value = (100 / 3) * (item.value - 5);

        newArray.push(item);
      }
    }

    console.log("newArray", transformation, newArray);

    return newArray;
  };

  _renderQuestionsItem = ({ item, index }) => {
    return (
      <QuestionsListItem
        index={index}
        item={item}
        diff={this.props.diff}
        color={this.props.color}
      />
    );
  };

  onCheckPress = () => {
    console.log("onCheckPress", this.url);
    Actions.details({
      key: "dashboard",
      uri: this.url,
      title: "Survey",
    });
  };

  render() {
    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        <ScrollView>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ isWheelModalVisible: true })}
          >
            <View
              style={{
                width: width - 40,
                height: 44,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "rgb(221,224,228)",
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 24,
                marginBottom: 1,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.dateText}>{this.state.pickerTitle}</Text>
                <Image
                  source={require("../resources/icon/arrowDown.png")}
                  style={{ marginLeft: 13 }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View>
            {this.state.data.length !== 0 && (
              <FlatList
                data={this.state.data}
                extraData={this.state.data}
                keyExtractor={(item, index) => item.questionText + index}
                renderItem={this._renderQuestionsItem}
                contentContainerStyle={{ overflow: "hidden" }}
                keyboardShouldPersistTaps="always"
                // initialNumToRender={10}
                bounces={false}
              />
            )}

            {/*<PilotSurveyChart
              title="Sleep"
              diff={this.props.diff}
              color="rgb(0,168,235)"
              isQuestions={true}
              question={"What time did you wake up this morning?"}
              yAxis="awake"
              data={
                this.state.position === 0
                  ? this.transformArray(
                      [
                        {
                          date: "2020-07-03",
                          value: 64,
                          hours: 5,
                          minutes: 30,
                        },
                        {
                          date: "2020-07-04",
                          value: 75,
                          hours: 12,
                          minutes: 30,
                        },
                        {
                          date: "2020-07-05",
                          value: 82,
                          hours: 6,
                          minutes: 20,
                        },
                        {
                          date: "2020-07-06",
                          value: 82,
                          hours: 7,
                          minutes: 40,
                        },
                        { date: "2020-07-07", value: 76, hours: 8, minutes: 0 },
                        {
                          date: "2020-07-08",
                          value: 77,
                          hours: 8,
                          minutes: 20,
                        },
                        { date: "2020-07-09", value: 83, hours: 9, minutes: 0 },
                      ],
                      "awake"
                    )
                  : this.state.position === 1
                  ? this.transformArray(
                      [
                        {
                          date: "2020-06-26",
                          value: 48,
                          hours: 12,
                          minutes: 0,
                        },
                        {
                          date: "2020-06-27",
                          value: 42,
                          hours: 8,
                          minutes: 20,
                        },
                        {
                          date: "2020-06-28",
                          value: 46,
                          hours: 6,
                          minutes: 12,
                        },
                        { date: "2020-06-29", value: 60, hours: 5, minutes: 0 },
                        {
                          date: "2020-06-30",
                          value: 69,
                          hours: 8,
                          minutes: 15,
                        },
                        {
                          date: "2020-07-01",
                          value: 62,
                          hours: 8,
                          minutes: 50,
                        },
                        { date: "2020-07-02", value: 65, hours: 3, minutes: 0 },
                        {
                          date: "2020-07-03",
                          value: 64,
                          hours: 11,
                          minutes: 0,
                        },
                        {
                          date: "2020-07-04",
                          value: 75,
                          hours: 6,
                          minutes: 50,
                        },
                        { date: "2020-07-05", value: 82, hours: 7, minutes: 9 },
                        {
                          date: "2020-07-06",
                          value: 82,
                          hours: 7,
                          minutes: 47,
                        },
                        {
                          date: "2020-07-07",
                          value: 76,
                          hours: 8,
                          minutes: 29,
                        },
                        {
                          date: "2020-07-08",
                          value: 77,
                          hours: 6,
                          minutes: 59,
                        },
                        {
                          date: "2020-07-09",
                          value: 83,
                          hours: 7,
                          minutes: 41,
                        },
                      ],
                      "awake"
                    )
                  : this.transformArray(
                      [
                        {
                          date: "2020-07-07",
                          value: 76,
                          hours: 5,
                          minutes: 30,
                        },
                        {
                          date: "2020-07-08",
                          value: 77,
                          hours: 7,
                          minutes: 30,
                        },
                        {
                          date: "2020-07-09",
                          value: 83,
                          hours: 8,
                          minutes: 30,
                        },
                      ],
                      "awake"
                    )
              }
            />

            <PilotSurveyChart
              title="Sleep"
              diff={27}
              color="rgb(0,168,235)"
              question={"The amount of sleep I had last night was:"}
              yAxis="sleepAmount"
              data={
                this.state.position === 0
                  ? this.transformArray(
                      [
                        {
                          date: "2020-07-03",
                          value: 7.2,
                        },
                        {
                          date: "2020-07-04",
                          value: 9,
                        },
                        {
                          date: "2020-07-05",
                          value: 3,
                        },
                        {
                          date: "2020-07-06",
                          value: 5.4,
                        },
                        { date: "2020-07-07", value: 6.1 },
                        {
                          date: "2020-07-08",
                          value: 6.9,
                        },
                        { date: "2020-07-09", value: 7.6 },
                      ],
                      "sleepAmount"
                    )
                  : this.state.position === 1
                  ? this.transformArray(
                      [
                        {
                          date: "2020-06-26",
                          value: 5,
                        },
                        {
                          date: "2020-06-27",
                          value: 4.3,
                        },
                        {
                          date: "2020-06-28",
                          value: 6.7,
                        },
                        { date: "2020-06-29", value: 9 },
                        {
                          date: "2020-06-30",
                          value: 8,
                        },
                        {
                          date: "2020-07-01",
                          value: 7.9,
                        },
                        { date: "2020-07-02", value: 4.6 },
                        {
                          date: "2020-07-03",
                          value: 6.2,
                        },
                        {
                          date: "2020-07-04",
                          value: 5.5,
                        },
                        { date: "2020-07-05", value: 5.8 },
                        {
                          date: "2020-07-06",
                          value: 6.1,
                        },
                        {
                          date: "2020-07-07",
                          value: 9.1,
                        },
                        {
                          date: "2020-07-08",
                          value: 5.6,
                        },
                        {
                          date: "2020-07-09",
                          value: 5.7,
                        },
                      ],
                      "sleepAmount"
                    )
                  : this.transformArray(
                      [
                        {
                          date: "2020-07-07",
                          value: 5.2,
                        },
                        {
                          date: "2020-07-08",
                          value: 7.9,
                        },
                        {
                          date: "2020-07-09",
                          value: 9,
                        },
                      ],
                      "sleepAmount"
                    )
              }
            /> */}

            <View style={{ height: 40 }} />
          </View>

          {this.state.isLoading && (
            <ShineOverlay>
              <View
                style={{
                  width: width - 295,
                  height: 28,
                  marginTop: 28,
                  borderRadius: 14.5,
                  backgroundColor: "rgb(242,243,246)",
                  marginHorizontal: 20,
                }}
              />

              <View
                style={{
                  width: width - 75,
                  height: 18,
                  marginTop: 30,
                  borderRadius: 9,
                  backgroundColor: "rgb(242,243,246)",
                  marginHorizontal: 20,
                }}
              />

              <View
                style={{
                  width: width - 175,
                  height: 18,
                  marginTop: 9,
                  borderRadius: 9,
                  backgroundColor: "rgb(242,243,246)",
                  marginHorizontal: 20,
                }}
              />

              <View
                style={{
                  height: 250,
                  width: width - 40,
                  alignSelf: "center",
                  marginTop: 34,
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
              </View>
            </ShineOverlay>
          )}

          {!this.state.isLoading && this.state.data.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 68,
              }}
            >
              <Image
                source={require("../resources/icon/health_snaps_no_data.png")}
                style={{ alignSelf: "center" }}
              />
              <Text style={styles.noDataTitle}>No Data</Text>
              <View style={{ alignSelf: "center" }}>
                <Text style={styles.noDataText}>
                  {`Looks like you haven't logged how you are feeling yet, ${this.state.userName}. When you check in regularly, Shae learns about you, will interact with you, and can help you reach your optimal health more efficiently.`}
                </Text>
              </View>
              <TouchableWithoutFeedback onPress={this.onCheckPress}>
                <View style={styles.noDataButton}>
                  <Text style={styles.noDataButtonText}>Check in Now</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </ScrollView>

        <Dialog
          visible={this.state.isWheelModalVisible}
          containerStyle={{ justifyContent: "flex-start" }}
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
            overflow: "hidden",
            borderRadius: 14,
            backgroundColor: "transparent",
          }}
        >
          <DialogContent style={{ paddingBottom: 0, paddingTop: 120 }}>
            <View
              style={{
                width,
                height: 200,
                borderRadius: 14,
                backgroundColor: "rgb(255,255,255)",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width,
                  height: 200,
                  alignSelf: "center",
                  marginTop: 0,
                  overflow: "hidden",
                }}
              >
                <Picker
                  style={{
                    backgroundColor: "white",
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
    lineHeight: 20,
    color: "rgb(106,111,115)",
    alignSelf: "center",
    textAlign: "center",
    width: width - 135,
    marginTop: 9,
  },
  noDataButton: {
    width: 140,
    height: 40,
    borderRadius: 22,
    backgroundColor: "rgb(0,168,235)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  noDataButtonText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: -0.4,
    color: "rgb(255,255,255)",
  },
});

export default PilotSurveyDetailsScreen;

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
import {Actions} from 'react-native-router-flux';

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

class PilotSurveyChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barHeights: {},
      hintPositionX: 0,
      hintPositionY: 0,
      barPositionY: 0,
      hintDate: '',
      hintValue: '',
      hintDiff: 0,
      hintIndex: 0,
      isHintModalVisible: false,
    };

    this.coordinates = [];
  }

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {}

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

  handlePress = (x, y, date, value, index, diff, isRepeated) => {
    console.log('handlePress', x, y, date, value);
    console.log('handlePress index', index);
    console.log('handlePress y', y);

    this.setState(
      {
        hintPositionX: x,
        barPositionY: y,
        hintDate: date,
        hintValue:
          typeof this.props.isDetailed !== 'undefined'
            ? this.findDetailedValue(value)
            : value,
        hintDiff: diff,
        hintIndex: index,
        hintPositionY:
          typeof isRepeated !== 'undefined' && isRepeated
            ? this.state.hintPositionY - 40
            : this.state.hintPositionY,
      },
      () => {
        this.setState({isHintModalVisible: true});
      },
    );

    console.log('barHeights', this.state.barHeights);
  };

  findDetailedValue = (value) => {
    let yAxis = [];

    if (this.props.yAxis === 'awake') {
      yAxis = ['<6am', '6-7am', '7-8am', '8-9am', '>9am'];
    } else if (this.props.yAxis === 'sleepAmount') {
      yAxis = ['<5 hrs', '5-6 hrs', '6-7 hrs', '7-8 hrs', '>8 hrs'];
    } else if (
      this.props.yAxis === 'levelOfPain' ||
      this.props.yAxis === 'stressAmount'
    ) {
      yAxis = ['Debilitating', 'Excessive', 'Manageable', 'Minimal', 'None'];
    } else if (this.props.yAxis === 'tired') {
      yAxis = ['Exhausted', 'Tired', 'Fine', 'Fresh', 'Energetic'];
    } else if (this.props.yAxis === 'foodAmount') {
      yAxis = [
        'Excessive',
        'Insufficient',
        'Too Much',
        'Too Little',
        'Perfect',
      ];
    } else if (this.props.yAxis === 'foodFollowing') {
      yAxis = ['Never', 'Rarely', 'Sometimes', 'Mostly', 'Perfectly'];
    } else if (this.props.yAxis === 'wakeupFeeling') {
      yAxis = ['Exhausted', 'Tired', 'Good', 'Fresh', 'Energized'];
    } else if (this.props.yAxis === 'common') {
      yAxis = ['Bad', 'Poor', 'Good', 'Great', 'Excellent'];
    }

    let newValue = '';
    if (value >= 100) {
      newValue = yAxis[4];
    } else if (value >= 75) {
      newValue = yAxis[3];
    } else if (value >= 50) {
      newValue = yAxis[2];
    } else if (value >= 25) {
      newValue = yAxis[1];
    } else {
      newValue = yAxis[0];
    }

    return newValue;
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
    let path = null;
    let shadowPath = null;
    this.coordinates = [];
    let minY = 0;
    let xAxis = null;
    let yAxis = [];
    let gradientWidth = 0;

    /**
   Draw the elements dependent on type
 */
    if (typeof this.props.data !== 'undefined' && this.props.data !== null) {
      const maxValue = 100;
      const coef = 0.45;

      console.log('this.props.data', this.props.data);
      // const array = this.arrayReverseObj(this.props.data.results);
      const array = this.props.data; //this.arrayReverseObjMonth(this.props.data.results);
      console.log('reverse array', array, maxValue);

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
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        diffDays = 1;
      }
      console.log('diffDays', diffDays);

      path =
        'M' +
        0 +
        ',' +
        (190 - Number(array[0].value === -1 ? 0 : array[0].value) * 4 * coef);
      shadowPath =
        'M' +
        0 +
        ',' +
        190 +
        ' L' +
        0 +
        ',' +
        Number(array[0].value === -1 ? 0 : array[0].value) * 4 * coef;
      const coords =
        ' L' +
        0 +
        ',' +
        (190 - Number(array[0].value === -1 ? 0 : array[0].value) * 4 * coef) +
        ' ' +
        0 +
        ',' +
        (190 - Number(array[0].value === -1 ? 0 : array[0].value) * 4 * coef);
      path += coords;
      shadowPath += coords;

      if (array[0].value !== -1) {
        const arrayFirstDate = new Date(
          array[0].date.substring(0, 4),
          array[0].date.substring(5, 7) - 1,
          array[0].date.substring(8, 10),
        );

        let month = arrayFirstDate.toLocaleString('en-us', {month: 'short'});
        month = Platform.OS === 'android' ? month.substr(4, 3) : month;

        this.coordinates.push({
          x: 0,
          y:
            array[0].value === 0
              ? 185 - array[0].value * 4 * coef
              : 190 - array[0].value * 4 * coef,
          date: arrayFirstDate.getDate() + ' ' + month,
          value: array[0].value,
          index: 0,
          diff: 0,
        });
      }

      minY = 190 - (array[0].value === -1 ? 0 : array[0].value) * 4 * coef;

      let lastValue = 0;
      let isLast = false;
      let allPreviousNull = array[0].value !== -1 ? false : true;
      let previousDiffDays = 1;
      let previousDiffDaysArray = 1;
      for (let i = 1; i < array.length; i++) {
        if (array[i].value !== -1 && allPreviousNull === true) {
          allPreviousNull = false;
        }

        if (isLast === false) {
          if (array[i - 1].value !== -1) {
            lastValue = array[i - 1].value;

            if (
              typeof array[i - 1].isLast !== 'undefined' &&
              array[i - 1].isLast === true
            ) {
              isLast = true;
              lastValue = 0;
            }
          }
        } else {
          lastValue = 0;
        }

        console.log(`isLast ${this.props.title}`, isLast);
        // if (
        //   array[i - 1].value !== -1 &&
        //   typeof array[i - 1].isLast === "undefined"
        // ) {
        //   lastValue = array[i - 1].value;
        // } else if (
        //   typeof array[i - 1].isLast !== "undefined" &&
        //   array[i - 1].isLast === true
        // ) {
        //   lastValue = 0;
        // }

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
        console.log('diffDaysArray', diffDaysArray, arrayDate);

        if (!isLast) {
          const marginTop =
            190 -
            (array[i].value === -1 ? lastValue : array[i].value) * 4 * coef;
          const coords =
            ' L' +
            ((typeof this.props.isDetailed === 'undefined'
              ? width - 70
              : width - 115) /
              diffDays) *
              diffDaysArray +
            ',' +
            marginTop +
            ' ' +
            ((typeof this.props.isDetailed === 'undefined'
              ? width - 70
              : width - 115) /
              diffDays) *
              diffDaysArray +
            ',' +
            marginTop;
          console.log('coords', coords);
          path += coords;
          shadowPath += coords;

          let month = arrayDate.toLocaleString('en-us', {month: 'short'});
          month = Platform.OS === 'android' ? month.substr(4, 3) : month;

          if (lastValue !== 0 && !allPreviousNull) {
            this.coordinates.push({
              x:
                ((typeof this.props.isDetailed === 'undefined'
                  ? width - 70
                  : width - 115) /
                  diffDays) *
                diffDaysArray,
              // y: marginTop,
              y: array[i].value === 0 ? marginTop - 5 : marginTop,
              date: arrayDate.getDate() + ' ' + month,
              value: array[i].value,
              index: i,
              diff:
                this.coordinates.length === 0
                  ? 0
                  : array[i].value -
                    this.coordinates[this.coordinates.length - 1].value,
            });
          }

          gradientWidth =
            ((typeof this.props.isDetailed === 'undefined'
              ? width - 70
              : width - 115) /
              diffDays) *
            diffDaysArray;

          if (minY < marginTop) {
            minY = marginTop;
          }

          previousDiffDays = diffDays;
          previousDiffDaysArray = diffDaysArray;
        }

        // if (i === array.length - 1) {
        if (isLast) {
          console.log(
            'previousDiffDays',
            previousDiffDays,
            previousDiffDaysArray,
          );
          shadowPath +=
            ' L' +
            ((typeof this.props.isDetailed === 'undefined'
              ? width - 70
              : width - 115) /
              previousDiffDays) *
              previousDiffDaysArray +
            ',' +
            190 +
            ' Z';
        }
      }

      console.log('this.coordinates', this.coordinates);
      console.log('minY', minY);

      xAxis = this.props.data.map((item, index) => {
        return (
          <Text
            key={index}
            style={
              index === this.props.data.length - 1
                ? [styles.axisText, {width: 'auto'}]
                : styles.axisText
            }>
            {index + 1}
          </Text>
        );
      });

      console.log('svg path', path);
      console.log('svg shadowPath', shadowPath);
    }

    if (typeof this.props.yAxis !== 'undefined') {
      console.log('this.props.yAxis', this.props.yAxis);
      if (this.props.yAxis === 'awake') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = '<6am';
          } else if (i === 25) {
            text = '6-7am';
          } else if (i === 50) {
            text = '7-8am';
          } else if (i === 75) {
            text = '8-9am';
          } else if (i === 100) {
            text = '>9am';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (this.props.yAxis === 'sleepAmount') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = '<5 hrs';
          } else if (i === 25) {
            text = '5-6 hrs';
          } else if (i === 50) {
            text = '6-7 hrs';
          } else if (i === 75) {
            text = '7-8 hrs';
          } else if (i === 100) {
            text = '>8 hrs';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (
        this.props.yAxis === 'levelOfPain' ||
        this.props.yAxis === 'stressAmount'
      ) {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = 'Debilitating';
          } else if (i === 25) {
            text = 'Excessive';
          } else if (i === 50) {
            text = 'Manageable';
          } else if (i === 75) {
            text = 'Minimal';
          } else if (i === 100) {
            text = 'None';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (this.props.yAxis === 'tired') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = 'Exhausted';
          } else if (i === 25) {
            text = 'Tired';
          } else if (i === 50) {
            text = 'Fine';
          } else if (i === 75) {
            text = 'Fresh';
          } else if (i === 100) {
            text = 'Energetic';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (this.props.yAxis === 'foodAmount') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = 'Excessive';
          } else if (i === 25) {
            text = 'Insufficient';
          } else if (i === 50) {
            text = 'Too Much';
          } else if (i === 75) {
            text = 'Too Little';
          } else if (i === 100) {
            text = 'Perfect';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (this.props.yAxis === 'foodFollowing') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = 'Never';
          } else if (i === 25) {
            text = 'Rarely';
          } else if (i === 50) {
            text = 'Sometimes';
          } else if (i === 75) {
            text = 'Mostly';
          } else if (i === 100) {
            text = 'Perfectly';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (this.props.yAxis === 'wakeupFeeling') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = 'Exhausted';
          } else if (i === 25) {
            text = 'Tired';
          } else if (i === 50) {
            text = 'Good';
          } else if (i === 75) {
            text = 'Fresh';
          } else if (i === 100) {
            text = 'Energized';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      } else if (this.props.yAxis === 'common') {
        for (let i = 0; i < 101; i = i + 25) {
          let text = '';
          if (i === 0) {
            text = 'Bad';
          } else if (i === 25) {
            text = 'Poor';
          } else if (i === 50) {
            text = 'Good';
          } else if (i === 75) {
            text = 'Great';
          } else if (i === 100) {
            text = 'Excellent';
          }

          yAxis.push(
            <Text
              key={i}
              style={[
                styles.axisText,
                {width: 64, marginTop: i === 100 ? -7 : 33},
              ]}>
              {text}
            </Text>,
          );
        }
      }
    } else {
      for (let i = 0; i < 101; i = i + 25) {
        yAxis.push(
          <Text
            key={i}
            style={[styles.axisText, {marginTop: i === 100 ? -5 : 32}]}>
            {i}
          </Text>,
        );
      }
    }

    yAxis.reverse();

    let touchableItems = null;
    if (this.coordinates.length !== 0) {
      touchableItems = this.coordinates.map((data, index) => {
        console.log('data.x', data);
        return (
          <TouchableWithoutFeedback
            key={data.date}
            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
            onPress={() =>
              this.handlePress(
                data.x,
                data.y,
                data.date,
                data.value,
                index,
                data.diff,
              )
            }>
            <View
              style={{
                position: 'absolute',
                // width: 6,
                // height: 6,
                // borderRadius: 3,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgb(255,255,255)',
                borderWidth: 2,
                borderColor: this.props.color,
                left:
                  (typeof this.props.isDetailed === 'undefined'
                    ? 23
                    : 80 - 12) + data.x,
                top: data.y - 3,
              }}
              onTouchStart={(e) => {
                console.log('e.nativeEvent', e.nativeEvent);
                this.setState({hintPositionY: e.nativeEvent.pageY});
              }}
              onLayout={(event) => {
                this.findDimesions(event.nativeEvent.layout, index);
              }}
            />
          </TouchableWithoutFeedback>
        );
      });
    }

    return (
      <View
        style={{
          marginTop: typeof this.props.question !== 'undefined' ? 0 : 30,
        }}>
        <View style={{width: width - 40, alignSelf: 'center'}}>
          {((typeof this.props.isQuestions !== 'undefined' &&
            typeof this.props.question !== 'undefined') ||
            typeof this.props.question === 'undefined') && (
            <TouchableWithoutFeedback
              onPress={() =>
                Actions.details({
                  key: 'pilotSurveyDetails',
                  title: this.props.title,
                  diff: this.props.diff,
                  color: this.props.color,
                })
              }>
              <View>
                {typeof this.props.isQuestions === 'undefined' && (
                  <Text style={styles.title}>{this.props.title}</Text>
                )}

                {(typeof this.props.isQuestions !== 'undefined' ||
                  (typeof this.props.isQuestions === 'undefined' &&
                    typeof this.props.question === 'undefined')) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop:
                        typeof this.props.isQuestions !== 'undefined' ? 24 : 10,
                      alignItems: 'center',
                    }}>
                    {this.props.diff >= 0 ? (
                      <Image
                        source={require('../resources/icon/arrow_increase.png')}
                        style={{marginRight: 10, marginTop: 1}}
                      />
                    ) : (
                      <Image
                        source={require('../resources/icon/arrow_decrease.png')}
                        style={{marginRight: 10, marginTop: 1}}
                      />
                    )}

                    <Text style={styles.improveText}>
                      {`${Math.abs(this.props.diff)}% `}
                    </Text>

                    {typeof this.props.isQuestions === 'undefined' && (
                      <View
                        style={{
                          position: 'absolute',
                          right: 0,
                          alignItems: 'center',
                          top: 13,
                          flexDirection: 'row',
                        }}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <Image
                          source={require('../resources/icon/arrowRight.png')}
                          style={{}}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}

          {/*typeof this.props.isQuestions !== "undefined" &&
            this.props.isQuestions === true && (
              <View>
                <Text style={styles.questionsTitle}>Questions</Text>
                <View
                  style={{
                    width: width - 40,
                    height: 1,
                    alignSelf: "center",
                    backgroundColor: "rgb(216,215,222)",
                    marginTop: 20,
                  }}
                />
              </View>
            ) */}

          {typeof this.props.question !== 'undefined' && (
            <Text style={styles.questionText}>{this.props.question}</Text>
          )}

          <View
            style={{
              marginTop: 30,
              height: 185 + 60,
              borderBottomWidth: 1,
              borderBottomColor: 'rgb(216,215,222)',
            }}>
            <View
              style={[
                styles.separator,
                {
                  left: this.props.isDetailed ? 70 : 25,
                  width: this.props.isDetailed ? width - 115 : width - 75,
                },
              ]}
            />
            <View
              style={[
                styles.separator,
                {
                  top: 46,
                  left: this.props.isDetailed ? 70 : 25,
                  width: this.props.isDetailed ? width - 115 : width - 75,
                },
              ]}
            />
            <View
              style={[
                styles.separator,
                {
                  top: 92,
                  left: this.props.isDetailed ? 70 : 25,
                  width: this.props.isDetailed ? width - 115 : width - 75,
                },
              ]}
            />
            <View
              style={[
                styles.separator,
                {
                  top: 138,
                  left: this.props.isDetailed ? 70 : 25,
                  width: this.props.isDetailed ? width - 115 : width - 75,
                },
              ]}
            />
            <View
              style={[
                styles.separator,
                {
                  top: 184,
                  left: this.props.isDetailed ? 70 : 25,
                  width: this.props.isDetailed ? width - 115 : width - 75,
                },
              ]}
            />

            <View style={{position: 'absolute', top: 0, left: 0}}>{yAxis}</View>

            <View
              style={{
                position: 'absolute',
                top: 200,
                left:
                  typeof this.props.isDetailed === 'undefined' ? 26 : 83 - 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width:
                  typeof this.props.isDetailed === 'undefined'
                    ? width - 65
                    : width - 115 + 12 - 7,
              }}>
              {/* 58 -> 65  */}
              {xAxis}
              {/*<Text style={styles.axisText}>1</Text>
              <Text style={styles.axisText}>2</Text>
              <Text style={styles.axisText}>3</Text>
              <Text style={styles.axisText}>4</Text>
              <Text style={styles.axisText}>5</Text>
              <Text style={styles.axisText}>6</Text>
              <Text style={styles.axisText}>7</Text>
              <Text style={styles.axisText}>8</Text>
              <Text style={styles.axisText}>9</Text>
              <Text style={styles.axisText}>10</Text>
              <Text style={styles.axisText}>11</Text>
              <Text style={styles.axisText}>12</Text>
              <Text style={styles.axisText}>13</Text>
              <Text style={[styles.axisText, { width: "auto" }]}>14</Text>*/}
            </View>

            {path !== null && (
              <View
                style={{
                  position: 'absolute',
                  left:
                    typeof this.props.isDetailed === 'undefined' ? 26 : 83 - 12,
                  // top: -5,
                }}>
                <Svg
                  height={185}
                  width={
                    typeof this.props.isDetailed === 'undefined'
                      ? width - 63
                      : width - 108
                  }>
                  <Path
                    d={shadowPath}
                    fill={this.props.color}
                    fillOpacity={0.05}
                    stroke="transparent"
                    strokeWidth={1}
                  />
                </Svg>
              </View>
            )}

            {path !== null && (
              <View
                style={{
                  position: 'absolute',
                  left:
                    typeof this.props.isDetailed === 'undefined' ? 26 : 83 - 12,
                  // top: -5,
                }}>
                <Svg
                  height={185}
                  width={
                    typeof this.props.isDetailed === 'undefined'
                      ? width - 63
                      : width - 108
                  }>
                  <Path
                    d={path}
                    fill="none"
                    stroke={this.props.color}
                    strokeWidth={2}
                  />
                </Svg>
              </View>
            )}

            {touchableItems}

            {/*<LinearGradient
              colors={[this.props.color, "rgba(255,255,255,0)"]}
              // locations={[0.7, 1]}
              style={{
                width: gradientWidth,
                left:
                  typeof this.props.isDetailed === "undefined" ? 26 : 83 - 12,
                height: 185 - minY,
                opacity: 0.05,
                overflow: "hidden",
                position: "absolute",
                top: minY,
              }}
            /> */}
          </View>
        </View>

        {this.coordinates.length !== 0 && (
          <Dialog
            visible={this.state.isHintModalVisible}
            // containerStyle={{ marginTop: Platform.OS === "ios" ? -150 : -200 }}
            // containerStyle={{
            //   marginTop: isIphoneX()
            //     ? -this.state.hintPositionY
            //     : -70 - this.state.hintPositionY,
            // }}
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
              position: 'absolute',
              top:
                Platform.OS === 'ios'
                  ? this.state.hintPositionY - 60 - this.state.barPositionY
                  : this.state.hintPositionY - 60 - this.state.barPositionY, //,
            }}>
            <DialogContent
              style={{
                position: 'absolute',
                // top: isIphoneX()
                //   ? this.state.hintPositionY - 110
                //   : this.state.hintPositionY - 200, //,
                // top: isIphoneX()
                //   ? this.state.hintPositionY
                //   : -70 - this.state.hintPositionY, //,
                left:
                  typeof this.props.isDetailed !== 'undefined'
                    ? this.state.hintIndex > 8
                      ? this.state.hintPositionX + 40 - 100
                      : this.state.hintPositionX + 40
                    : this.state.hintIndex > 9
                    ? this.state.hintPositionX - 100
                    : this.state.hintPositionX - 5,
              }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({isHintModalVisible: false})}>
                <View
                  style={{overflow: 'visible'}}
                  // onTouchStart={
                  //   (e) => {
                  //     console.log("hintTouchPosition", e.nativeEvent);
                  //     const y = e.nativeEvent.pageY;
                  //
                  //     setTimeout(() => {
                  //       this.setState({
                  //         hintPositionY:
                  //           typeof this.props.isDetailed !== "undefined"
                  //             ? y + 40
                  //             : y,
                  //       });
                  //     }, 300);
                  //
                  //     for (let i = 0; i < this.coordinates.length; i++) {
                  //       if (typeof this.props.isDetailed !== "undefined") {
                  //         if (
                  //           Math.abs(
                  //             e.nativeEvent.pageX - 48 - this.coordinates[i].x
                  //           ) < 10
                  //         ) {
                  //           console.log("hintTouchPosition2", true);
                  //           setTimeout(() => {
                  //             this.handlePress(
                  //               this.coordinates[i].x - 45,
                  //               this.coordinates[i].y,
                  //               this.coordinates[i].date,
                  //               this.coordinates[i].value,
                  //               this.coordinates[i].index,
                  //               this.coordinates[i].diff,
                  //               this.state.hintValue ===
                  //                 this.coordinates[i].value
                  //                 ? false
                  //                 : true
                  //             );
                  //           }, 400);
                  //
                  //           break;
                  //         }
                  //       } else {
                  //         if (
                  //           Math.abs(
                  //             e.nativeEvent.pageX - 48 - this.coordinates[i].x
                  //           ) < 10
                  //         ) {
                  //           console.log("hintTouchPosition2", true);
                  //           console.log(
                  //             "hintTouchPosition y",
                  //             this.coordinates[i].y
                  //           );
                  //           setTimeout(() => {
                  //             this.handlePress(
                  //               this.coordinates[i].x,
                  //               this.coordinates[i].y,
                  //               this.coordinates[i].date,
                  //               this.coordinates[i].value,
                  //               this.coordinates[i].index,
                  //               this.coordinates[i].diff
                  //               // this.state.hintValue ===
                  //               //   this.coordinates[i].value
                  //               //   ? false
                  //               //   : true
                  //             );
                  //           }, 400);
                  //
                  //           break;
                  //         }
                  //       }
                  //     }
                  //   }
                  //   // this.setState({ hintTouchPosition: e.nativeEvent })
                  // }
                >
                  <View
                    style={{
                      position: 'absolute',
                      height: 105,
                      // width: width + 19 - 24 + this.state.hintPositionX,
                      left: -(19 - 24 + this.state.hintPositionX),
                      backgroundColor: 'rgb(255,255,255)',
                      overflow: 'visible',
                    }}
                  />
                  <View style={styles.hintShadow}>
                    <View
                      style={{
                        alignSelf: 'center',
                        height: 64,
                        // width: width - 183,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={
                          this.state.hintDiff < 0
                            ? require('../resources/icon/arrow_decrease.png')
                            : require('../resources/icon/arrow_increase.png')
                        }
                        style={{
                          marginLeft: 20,
                          marginRight: 8,
                          width: 16,
                          height: 18,
                        }}
                      />
                      <Text
                        style={
                          styles.hintPercent
                        }>{`${this.state.hintDiff}%`}</Text>
                      <View style={{marginRight: 20}}>
                        <Text style={styles.hintTitle}>
                          {this.state.hintValue}
                        </Text>
                        <Text style={styles.hintText}>
                          {this.state.hintDate}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: 0,
                      marginLeft:
                        typeof this.props.isDetailed !== 'undefined' &&
                        this.state.hintIndex === 9
                          ? 133
                          : this.state.hintIndex > 9
                          ? 128
                          : 33,
                      // left: -(19 - 24 + this.state.hintPositionX),
                      width: 2,
                      height: this.state.barPositionY,
                      // Platform.OS === "ios"
                      //   ? 212 - this.state.barHeights[this.state.hintIndex]
                      //   : 218 - this.state.barHeights[this.state.hintIndex],
                      borderRadius: 1,
                      backgroundColor: 'rgb(221,224,228)',
                      zIndex: 1,
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </DialogContent>
          </Dialog>
        )}
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
  title: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(31,33,35)',
  },
  improveText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 32,
    letterSpacing: -0.3,
    color: 'rgb(54,58,61)',
  },
  viewDetailsText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
    marginRight: 10,
  },
  separator: {
    width: width - 75,
    height: 1,
    backgroundColor: 'rgb(225,231,236)',
    position: 'absolute',
    top: 0,
    // left: 25,
  },
  axisText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 11,
    color: 'rgb(141,147,151)',
    width: 20,
  },
  questionsTitle: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 13,
    color: 'rgb(36,76,138)',
    letterSpacing: -0.21,
    marginTop: 24,
  },
  questionText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(31,33,35)',
    lineHeight: 22,
    marginTop: 30,
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
  hintPercent: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 24,
    letterSpacing: -0.23,
    color: 'rgb(54,58,61)',
    marginRight: 20,
  },
  hintTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(31,33,35)',
  },
  hintText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    letterSpacing: -0.31,
    color: 'rgb(148,155,162)',
    marginTop: 2,
  },
  hintShadow: {
    height: 64,
    borderRadius: 10,
    shadowColor: '#273849',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
    alignSelf: 'center',
    overflow: 'visible',
  },
});

PilotSurveyChart.defaultProps = {};

export default PilotSurveyChart;

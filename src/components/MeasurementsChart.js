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

class MeasurementsChart extends Component {
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

  handlePress = (x, y, date, value, index, diff, month) => {
    console.log('handlePress', x, y, date, value);

    const splittedDate = date.split(' ');

    this.setState({
      hintPositionX: x,
      barPositionY: y,
      hintDate: month + ' ' + splittedDate[0], //date,
      hintValue:
        typeof this.props.isDetailed !== 'undefined'
          ? this.findDetailedValue(value)
          : value,
      hintDiff: diff,
      isHintModalVisible: true,
      hintIndex: index,
    });

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

  isFloat = (n) => {
    return n === +n && n !== (n | 0);
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
      console.log('min max', this.props.minValue, this.props.maxValue);

      const maxValue = this.props.maxValue;
      const coef = 0.35 * (100 / (maxValue - this.props.minValue));

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
        (140 - Number(array[0].value - this.props.minValue) * 4 * coef);
      shadowPath =
        'M' +
        0 +
        ',' +
        140 +
        ' L' +
        0 +
        ',' +
        Number(array[0].value - this.props.minValue) * 4 * coef;
      const coords =
        ' L' +
        0 +
        ',' +
        (140 - Number(array[0].value - this.props.minValue) * 4 * coef) +
        ' ' +
        0 +
        ',' +
        (140 - Number(array[0].value - this.props.minValue) * 4 * coef);
      path += coords;
      shadowPath += coords;

      const arrayFirstDate = new Date(
        array[0].date.substring(0, 4),
        array[0].date.substring(5, 7) - 1,
        array[0].date.substring(8, 10),
      );

      let month = arrayFirstDate.toLocaleString('en-us', {month: 'short'});
      month = Platform.OS === 'android' ? month.substr(4, 3) : month;

      this.coordinates.push({
        x: -5,
        y: 140 - (array[0].value - this.props.minValue) * 4 * coef,
        date: arrayFirstDate.getDate() + ' ' + month,
        month: month,
        value: array[0].value,
        index: 0,
        diff: 0,
      });

      minY = 140 - (array[0].value - this.props.minValue) * 4 * coef;

      let previousDiffDays = 1;
      let previousDiffDaysArray = 1;
      for (let i = 1; i < array.length; i++) {
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

        const marginTop =
          140 - (array[i].value - this.props.minValue) * 4 * coef;
        const coords =
          ' L' +
          ((width - 105) / (array.length - 1)) * i +
          ',' +
          marginTop +
          ' ' +
          ((width - 105) / (array.length - 1)) * i +
          ',' +
          marginTop;
        console.log('coords', coords);
        path += coords;
        shadowPath += coords;

        let month = arrayDate.toLocaleString('en-us', {month: 'short'});
        month = Platform.OS === 'android' ? month.substr(4, 3) : month;

        this.coordinates.push({
          x:
            i === array.length - 1
              ? ((width - 105) / (array.length - 1)) * i - 5
              : ((width - 105) / (array.length - 1)) * i - 5,
          // y: marginTop,
          y: marginTop,
          date: arrayDate.getDate() + ' ' + month,
          month: month,
          value: array[i].value,
          index: i,
          diff:
            this.coordinates.length === 0
              ? 0
              : array[i].value +
                this.props.minValue -
                this.coordinates[this.coordinates.length - 1].value,
        });

        gradientWidth = ((width - 105) / diffDays) * diffDaysArray;

        if (minY < marginTop) {
          minY = marginTop;
        }

        previousDiffDays = diffDays;
        previousDiffDaysArray = diffDaysArray;

        // if (i === array.length - 1) {
        // if (isLast) {
        console.log(
          'previousDiffDays',
          previousDiffDays,
          previousDiffDaysArray,
        );
        if (i === array.length - 1) {
          shadowPath +=
            ' L' + ((width - 105) / (array.length - 1)) * i + ',' + 140 + ' Z';
        }
        // }
      }

      console.log('this.coordinates', this.coordinates);
      console.log('minY', minY);

      if (this.coordinates.length !== 0) {
        xAxis = this.coordinates.map((item, index) => {
          console.log('xAxis item', item);
          return (
            <Text
              key={index}
              style={[
                styles.axisText,
                {
                  width: 24,
                  position: 'absolute',
                  left: item.x - 12,
                },
              ]}>
              {item.month}
            </Text>
          );
        });
      }

      console.log('svg path', path);
      console.log('svg shadowPath', shadowPath);
    }

    for (let i = 0; i < 4; i++) {
      const value =
        i === 0
          ? this.props.minValue
          : i === 3
          ? this.props.maxValue
          : this.isFloat((this.props.maxValue - this.props.minValue) / 3) * i +
            this.props.minValue
          ? parseFloat(
              ((this.props.maxValue - this.props.minValue) / 3) * i +
                this.props.minValue,
            ).toFixed(1)
          : ((this.props.maxValue - this.props.minValue) / 3) * i +
            this.props.minValue;
      yAxis.push(
        <Text
          key={i}
          style={[styles.axisText, {marginTop: i === 3 ? 4 : 33, width: 27}]}>
          {value}
        </Text>,
      );
    }

    yAxis.reverse();

    let touchableItems = null;
    if (this.coordinates.length !== 0) {
      touchableItems = this.coordinates.map((data, index) => {
        console.log('data.x', data);
        return (
          <TouchableWithoutFeedback
            key={data.date + data.x}
            hitSlop={{top: 3, bottom: 3, left: 15, right: 15}}
            onPress={() =>
              this.handlePress(
                data.x,
                data.y,
                data.date,
                data.value,
                index,
                data.diff,
                data.month,
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
                backgroundColor: 'rgb(0,168,235)',
                borderWidth: 2,
                borderColor: 'rgb(255,255,255)',
                left: data.x,
                top: data.y - 4,
              }}
              onTouchStart={(e) => {
                console.log('e.nativeEvent', e.nativeEvent);
                this.setState({hintPositionY: e.nativeEvent.pageY});
              }}
              // onLayout={(event) => {
              //   console.log("event.nativeEvent.layout", event.nativeEvent);
              //   // this.setState({ hintPositionY: event.nativeEvent.layout.y });
              //   // this.setState({ hintPositionY: event.nativeEvent.pageY });
              //   // this.findDimesions(event.nativeEvent.layout, index);
              // }}
            />
          </TouchableWithoutFeedback>
        );
      });
    }

    if (this.coordinates.length === 1) {
      touchableItems = this.coordinates.map((data, index) => {
        console.log('data.x', data);
        return (
          <TouchableWithoutFeedback
            key={data.date + data.x}
            hitSlop={{top: 3, bottom: 3, left: 15, right: 15}}
            onPress={() =>
              this.handlePress(
                data.x,
                data.y,
                data.date,
                data.value,
                index,
                data.diff,
                data.month,
              )
            }>
            <View
              style={{
                position: 'absolute',
                // width: 6,
                // height: 6,
                // borderRadius: 3,
                width: 18,
                height: data.y,
                borderRadius: 9,
                backgroundColor: 'rgb(0,168,235)',
                left: data.x + 5,
                // top: data.y - 4,
                bottom: 0,
                height: (data.value / this.props.maxValue) * 140,
              }}
              onTouchStart={(e) => {
                console.log('e.nativeEvent', e.nativeEvent);
                this.setState({hintPositionY: e.nativeEvent.pageY});
              }}
              // onLayout={(event) => {
              //   console.log("event.nativeEvent.layout", event.nativeEvent);
              //   // this.setState({ hintPositionY: event.nativeEvent.layout.y });
              //   // this.setState({ hintPositionY: event.nativeEvent.pageY });
              //   // this.findDimesions(event.nativeEvent.layout, index);
              // }}
            />
          </TouchableWithoutFeedback>
        );
      });
    }

    return (
      <View
        style={{
          marginTop: 20,
        }}>
        <View style={{position: 'absolute', top: -11, left: 15}}>{yAxis}</View>

        <View style={{width: width - 105, marginLeft: 45}}>
          <View
            style={{
              // marginTop: 30,
              height: 140,
              // borderBottomWidth: 1,
              // borderBottomColor: "rgb(216,215,222)",
            }}>
            <View style={styles.separator} />
            <View style={[styles.separator, {top: 46}]} />
            <View style={[styles.separator, {top: 92}]} />
            <View style={[styles.separator, {top: 138}]} />

            <View
              style={{
                position: 'absolute',
                top: 156,
                left: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: width - 105,
              }}>
              {xAxis}
            </View>

            {path !== null && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  // top: -5,
                }}>
                <Svg height={140} width={width - 105}>
                  <Path
                    d={shadowPath}
                    fill="rgb(0,168,235)"
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
                  left: 0,
                  // top: -5,
                }}>
                <Svg height={140} width={width - 105}>
                  <Path
                    d={path}
                    fill="none"
                    stroke="rgb(0,168,235)"
                    strokeWidth={2}
                  />
                </Svg>
              </View>
            )}

            {touchableItems}

            {/*<LinearGradient
              colors={["rgb(0,168,235)", "rgba(255,255,255,0)"]}
              // locations={[0.7, 1]}
              style={{
                width: gradientWidth,
                left: 0,
                height: 181 - minY,
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
                    ? this.state.hintPositionX + 40
                    : this.state.hintPositionX - 5,
              }}>
              <TouchableWithoutFeedback
                onPress={() => this.setState({isHintModalVisible: false})}>
                <View
                // onTouchStart={
                //   (e) => {
                //     console.log("hintTouchPosition", e.nativeEvent);
                //     console.log("hintTouchPosition", this.coordinates);
                //     const y = e.nativeEvent.pageY;
                //
                //     setTimeout(() => {
                //       this.setState({
                //         hintPositionY: y,
                //       });
                //     }, 300);
                //
                //     for (let i = 0; i < this.coordinates.length; i++) {
                //       if (
                //         Math.abs(
                //           e.nativeEvent.pageX - 69 - this.coordinates[i].x
                //         ) < 10
                //       ) {
                //         console.log("hintTouchPosition2", true);
                //         console.log(
                //           "hintTouchPosition y",
                //           this.coordinates[i].y
                //         );
                //         setTimeout(() => {
                //           this.handlePress(
                //             this.coordinates[i].x,
                //             this.coordinates[i].y,
                //             this.coordinates[i].date,
                //             this.coordinates[i].value,
                //             this.coordinates[i].index,
                //             this.coordinates[i].diff,
                //             this.coordinates[i].month
                //             // this.state.hintValue ===
                //             //   this.coordinates[i].value
                //             //   ? false
                //             //   : true
                //           );
                //         }, 400);
                //
                //         break;
                //       }
                //     }
                //   }
                //   // this.setState({ hintTouchPosition: e.nativeEvent })
                // }
                >
                  <BoxShadow
                    setting={{
                      ...shadowOpt,
                      ...{
                        width: 95,
                        height: 64,
                        y: 6,
                        border: 16,
                        radius: 4,
                        opacity: 0.08,
                      },
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        height: 64,
                        width: 95,
                        backgroundColor: 'rgb(255,255,255)',
                        borderRadius: 4,
                        // alignItems: "center",
                      }}>
                      <View style={{marginTop: 12, marginLeft: 20}}>
                        <Text style={styles.hintTitle}>
                          {this.state.hintDate}
                        </Text>
                        <Text style={styles.hintText}>
                          {this.state.hintValue}
                          <Text style={[styles.hintText, {fontSize: 14}]}>
                            {` ${this.props.unit}`}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </BoxShadow>

                  <View
                    style={{
                      marginTop: 0,
                      marginLeft: 56,
                      // alignSelf: "center",
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
    width: width - 105,
    height: 1,
    backgroundColor: 'rgb(225,231,236)',
    position: 'absolute',
    top: 0,
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
    color: 'rgb(106,111,115)',
  },
  hintText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 18,
    color: 'rgb(31,33,35)',
    marginTop: 4,
  },
});

MeasurementsChart.defaultProps = {};

export default MeasurementsChart;

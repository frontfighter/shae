import React, {Component, PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modalbox';
import Svg, {
  Polygon,
  Stop,
  G,
  Path,
  LinearGradient,
  Polyline,
} from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import MeasurementCardNew from '../components/MeasurementCardNew';
import LoadingIndicator from '../components/LoadingIndicator';
import {getUserDetails} from '../data/db/Db';

const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  return (size / 812) * height;
  // return size;
};

const getWidth = (size) => {
  return (size / 375) * width;
  // return size;
};

export default class MeasurementScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {},
      data: [],
      scrollOffset: 0,
      isModalOpened: false,
      buttonMarginTop: 50,
      elements: [],
    };

    this.scrollOffset = 0;
    this.buttonMarginTop = Platform.OS === 'android' ? 50 : 50;
    this.elementsCount = 0;
    this.values = {};
    this.measurementUnit = null;
  }

  /**
   * On measurement value change.
   */
  onChange = (index, value, id) => {
    try {
      let values = this.values;

      if (values.hasOwnProperty(id)) {
        values[id] =
          id === 50 &&
          (value <= 1 || value === 'N/A' || typeof value === 'undefined')
            ? ''
            : value; // 1 -> ''
      } else {
        values[id] =
          id === 50 &&
          (value <= 1 || value === 'N/A' || typeof value === 'undefined')
            ? ''
            : value;
      }

      if (id === 50) {
        console.log('onChange 50', index, value, id);
      }
      this.values = values;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Save values on Next press.
   */
  setAnswers = () => {
    try {
      console.log('setAnswers this.values', this.values);
      console.log('setAnswers this.props.data', this.props.data);

      Object.keys(this.values).map((key, index) => {
        console.log('setAnswers meas', key, this.values[key], this.props.data);

        let value, unit;
        if (this.measurementUnit !== 'metric' && key !== '50') {
          for (let i = 0; i < this.props.data.length; i++) {
            if (key === this.props.data[i].id.toString()) {
              unit = this.props.data[i].unit;

              break;
            }
          }

          if (unit === 'lbs,kg') {
            value = Math.round(this.values[key] * 0.453592 * 10) / 10;
          } else if (unit === 'feet,cm') {
            value = Math.round(this.values[key] * 30.48 * 10) / 10;
          } else if (unit === 'inches,cm') {
            value = Math.round(this.values[key] * 2.54 * 10) / 10;
          }
        } else {
          console.log('this.values', this.values);
          value = this.values[key];
        }

        console.log('setAnswers meas', unit, value);

        this.props.setAnswers(key, value);
      });

      this.values = {};
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  UNSAFE_componentWillMount() {
    const userDetails = getUserDetails();
    this.measurementUnit = userDetails.profile.unit;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({scrollOffset: 0});
    }, 1000);

    const elementsHeight =
      30 + this.elementsCount * 115 + 16 * (this.elementsCount - 1) + 44 + 24;
    console.log(
      'height scroll getStatusBarHeight(),',
      elementsHeight + 48 + 64 + 48 + getStatusBarHeight(),
      height,
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    setTimeout(() => {
      this.setState({scrollOffset: 0});
    }, 1000);

    console.log(
      'maesurements isResultsLoading',
      this.props.isResultsLoading,
      nextProps.isResultsLoading,
      this.props.isLast,
      nextProps.isLast,
    );

    if (
      typeof this.scroll !== 'undefined' &&
      typeof this.scroll.props !== 'undefined' &&
      !nextProps.isResultsLoading
    ) {
      // && (!this.props.isLast && !nextProps.isLast)
      this.scroll.scrollTo({x: 0, y: 0, animated: false});
    }
  }

  /**
   * Observation on scroll offset.
   */
  handleScroll = (event) => {
    try {
      this.scrollOffset = event.nativeEvent.contentOffset.y;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Opens BFI hint.
   */
  openModal = () => {
    try {
      this.setState({isModalOpened: true});
      this.setState({scrollOffset: this.scrollOffset}, () =>
        this.refs.modal.open(),
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onLayout = (w, h) => {};

  render() {
    console.log('this.elementsCount', this.elementsCount);
    const elements = [];

    console.log('props answers', this.props.answers);
    console.log('props data', this.props.data);

    this.elementsCount = 0;
    Object.keys(this.props.data).map((key, index) => {
      this.elementsCount += 1;

      const id = this.props.data[key].id;
      console.log('id', id);

      let value;
      let minValue;
      let maxValue;

      if (this.measurementUnit !== 'metric' && id !== 50) {
        if (this.props.data[key].unit === 'lbs,kg') {
          minValue =
            Math.round(
              (this.props.data[key].constraints.min.value / 0.453592) * 10,
            ) / 10;
          maxValue =
            Math.round(
              (this.props.data[key].constraints.max.value / 0.453592) * 10,
            ) / 10;
        } else if (this.props.data[key].unit === 'feet,cm') {
          minValue =
            Math.round(
              (this.props.data[key].constraints.min.value / 30.48) * 10,
            ) / 10;
          maxValue =
            Math.round(
              (this.props.data[key].constraints.max.value / 30.48) * 10,
            ) / 10;
        } else if (this.props.data[key].unit === 'inches,cm') {
          minValue =
            Math.round(
              (this.props.data[key].constraints.min.value / 2.54) * 10,
            ) / 10;
          maxValue =
            Math.round(
              (this.props.data[key].constraints.max.value / 2.54) * 10,
            ) / 10;
        }
      } else {
        minValue = this.props.data[key].constraints.min.value;
        maxValue = this.props.data[key].constraints.max.value;
      }

      if (this.props.answers === null) {
        if (id === 50) {
          value = 1;
        } else if (id === 1) {
          if (this.measurementUnit !== 'metric') {
            value = parseFloat(Math.round((80 / 0.453592) * 10) / 10);
          } else {
            value = 80;
          }
        } else {
          value = (maxValue + minValue) / 2;
        }
      } else if (typeof this.props.answers[id] !== 'undefined') {
        if (this.measurementUnit !== 'metric' && id !== 50) {
          if (this.props.data[key].unit === 'lbs,kg') {
            value = parseFloat(
              Math.round((this.props.answers[id].value / 0.453592) * 10) / 10,
            );
          } else if (this.props.data[key].unit === 'feet,cm') {
            value = parseFloat(
              Math.round((this.props.answers[id].value / 30.48) * 10) / 10,
            );
          } else if (this.props.data[key].unit === 'inches,cm') {
            value = parseFloat(
              Math.round((this.props.answers[id].value / 2.54) * 10) / 10,
            );
          }
        } else {
          value = parseFloat(this.props.answers[id].value);
        }
      } else {
        value = (maxValue + minValue) / 2;
      }

      elements.push(
        <MeasurementCardNew
          title={this.props.data[key].name}
          userUnit={this.measurementUnit}
          unit={this.props.data[key].unit}
          index={index}
          key={this.props.data[key].id}
          id={id}
          value={value}
          minValue={minValue}
          maxValue={maxValue}
          onChange={(index, value, id) => this.onChange(index, value, id)}
          openModal={this.openModal}
          isModalOpened={this.state.isModalOpened}
          setAnswers={this.setAnswers}
        />,
      );
    });

    const elementsHeight =
      30 + this.elementsCount * 72 + 16 * (this.elementsCount - 1) + 44 + 24;
    // const elementsHeight = 30 + this.elementsCount * 115 + 16 * (this.elementsCount - 1) + 44 + 24;
    console.log(
      'height scroll getStatusBarHeight(),',
      elementsHeight + 48 + 64 + 48 + getStatusBarHeight(),
      height,
    );

    if (height > elementsHeight + 48 + 64 + 48 + getStatusBarHeight()) {
      this.buttonMarginTop =
        height - (elementsHeight + 48 + 64 + 48 + getStatusBarHeight());
      if (Platform.OS === 'android') {
        this.buttonMarginTop += 50 - 8;
        // this.buttonMarginTop += 5;
      }
      if (isIphoneX()) {
        this.buttonMarginTop -= 10;
      }
    } else {
      this.buttonMarginTop = 50;
    }

    const statusBarHeight =
      Platform.OS === 'android' ? StatusBar.currentHeight : 0;

    return (
      <KeyboardAwareScrollView
        onContentSizeChange={(w, h) => this.onLayout(w, h)}
        innerRef={(ref) => {
          this.scroll = ref;
        }}
        onScrollEndDrag={(event) => this.handleScroll(event)}
        scrollEventThrottle={1}
        bounces={false}>
        {elements}

        <TouchableWithoutFeedback onPress={() => this.props.goNext()}>
          <View style={[styles.button, {marginTop: this.buttonMarginTop}]}>
            {this.props.isResultsLoading ? (
              <LoadingIndicator isLoading={true} />
            ) : (
              /*<LoadingIndicator isLoading={true} /> */
              <Text style={styles.buttonText}>
                {this.props.isLast ? 'Get My Results' : 'Next'}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>

        <Modal
          style={styles.modal}
          backdrop={false}
          backdropPressToClose={false}
          animationDuration={450}
          position={'center'}
          ref={'modal'}
          swipeToClose={false}
          swipeArea={50}
          coverScreen={true}
          onClosed={() => this.setState({isModalOpened: false})}>
          <Animatable.View
            animation="fadeIn"
            delay={185}
            duration={10}
            style={{
              alignSelf: 'center',
              height: 153,
              backgroundColor: 'rgb(61,75,83)',
              borderRadius: 10,
              width: width - 40,
              position: 'absolute',
              bottom: isIphoneX() ? 102 : 102 - 34,
            }}>
            <Text style={styles.hintText}>
              If you have an accurate reading for your BFI in the last 30 days
              please enter it here, if not, please leave this measurement blank
              and ph360 will calculate one for you.
            </Text>
            <View
              style={{
                width: width - 40,
                height: 0.5,
                backgroundColor: 'rgb(73,89,99)',
                alignSelf: 'center',
              }}
            />
            <TouchableWithoutFeedback
              onPress={() => {
                this.refs.modal.close();
                this.setState({isModalOpened: false});
              }}>
              <View style={{width: width - 40, height: 44}}>
                <Text style={styles.hintButtonText}>Okay</Text>
              </View>
            </TouchableWithoutFeedback>
          </Animatable.View>
        </Modal>

        {isIphoneX() ? <View style={{height: 34}} /> : null}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(244,248,252)',
    height,
    width,
  },
  modal: {
    width: width,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'absolute',
    right: 0,
  },
  button: {
    marginTop: 50,
    width: width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    justifyContent: 'center',
  },
  hintText: {
    color: 'rgb(196,213,224)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    letterSpacing: -0.31,
    lineHeight: 18,
    margin: 20,
  },
  hintButtonText: {
    color: 'rgb(255,255,255)',
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 18,
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
});

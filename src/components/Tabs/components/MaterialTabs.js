// @flow

import React from 'react';
import PropTypes from 'prop-types';
import {Animated, ScrollView, View, Text, Dimensions} from 'react-native';
import type {StyleObj} from '../lib/definitions';
import {Bar, TabTrack} from '../lib/styles';
import values from '../lib/values';
import Tab from './Tab';
import Indicator from './Indicator';

const {height, width} = Dimensions.get('window');

type Props = {
  allowFontScaling: boolean,
  selectedIndex: number,
  barColor: string,
  barHeight: number,
  activeTextColor: string,
  indicatorColor: string,
  inactiveTextColor: string,
  scrollable: boolean,
  textStyle: StyleObj,
  activeTextStyle: StyleObj,
  items: string[],
  itemsWidth: number[],
  uppercase: boolean,
  onChange: (index: number) => void,
};

type State = {
  tabWidth: number,
  barWidth: number,
  indicatorPosition: Animated.Value,
};

export default class MaterialTabs extends React.Component<Props, State> {
  static propTypes = {
    allowFontScaling: PropTypes.bool,
    selectedIndex: PropTypes.number,
    barColor: PropTypes.string,
    barHeight: PropTypes.number,
    activeTextColor: PropTypes.string,
    indicatorColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    scrollable: PropTypes.bool,
    textStyle: Text.propTypes.style,
    activeTextStyle: Text.propTypes.style,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    itemsWidth: PropTypes.arrayOf(PropTypes.number).isRequired,
    uppercase: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allowFontScaling: true,
    selectedIndex: 0,
    barColor: '#13897b',
    barHeight: values.barHeight,
    activeTextColor: '#fff',
    indicatorColor: '#fff',
    inactiveTextColor: 'rgba(255, 255, 255, 0.7)',
    scrollable: false,
    textStyle: null,
    uppercase: true,
    activeTextStyle: {},
  };

  state = {
    tabWidth: 0,
    barWidth: 0,
    indicatorPosition: new Animated.Value(0),
    barWidthNew: 0,
  };

  shouldComponentUpdate(nextProps: Props) {
    // Prevent scrolling out of bounds
    return (
      nextProps.selectedIndex < nextProps.items.length &&
      nextProps.selectedIndex >= 0
    );
  }

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.itemsWidth.length !== 0) {
      let barWidth = 0;
      for (let i = 0; i < nextProps.itemsWidth.length; i++) {
        barWidth += nextProps.itemsWidth[i] + 60;
      }

      this.setState({barWidthNew: barWidth});
      console.log('this.props.items2', barWidth);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      typeof this.bar !== 'undefined' &&
      this.props.items.length !== prevProps.items.length
    ) {
      this.bar.measure((_, b, width) => {
        this.getTabWidth(width);
      });
    }

    this.selectTab();
  }

  scrollView: ScrollView;
  bar: View;

  getScrollOffset(id) {
    let offset = 0;
    for (let i = 0; i < id; i++) {
      offset += this.props.itemsWidth[i] + 60;
    }

    return this.state.barWidthNew - width < offset
      ? this.state.barWidthNew - width
      : offset;
  }

  getAnimateValues() {
    const idx = this.props.selectedIndex;
    const scrollValue = !this.props.scrollable
      ? this.state.tabWidth
      : this.state.barWidth * 0.4;

    // All props for fixed tabs are the same
    if (!this.props.scrollable) {
      return {
        indicatorPosition: idx === 0 ? 0 : idx * scrollValue,
        scrollPosition: 0,
      };
    }

    switch (idx) {
      case 0: // First tab
        return {
          indicatorPosition: 0,
          scrollPosition: 0,
        };
      // case 1: // Second tab
      //   return {
      //     indicatorPosition: this.state.barWidth * 0.5 - scrollValue / 4,
      //     scrollPosition: scrollValue * 0.25,
      //   };
      // case this.props.items.length - 1: // Last tab
      //   return {
      //     indicatorPosition:
      //       scrollValue * (idx - 1) +
      //       (this.state.barWidth * 0.5 - scrollValue / 4),
      //     scrollPosition: scrollValue * (idx - 2) + scrollValue * 0.5,
      //   };
      default:
        // Any tabs between second and last
        return {
          indicatorPosition:
            scrollValue * (idx - 1) +
            (this.state.barWidth * 0.5 - scrollValue / 4),
          scrollPosition: this.getScrollOffset(idx), //(this.props.itemsWidth[idx] + 60) * idx //scrollValue * 0.25 + scrollValue * (idx - 1),
        };
    }
  }

  getTabWidth(width: number) {
    if (!this.props.scrollable) {
      this.setState({tabWidth: width / this.props.items.length});
    }
    this.setState({
      barWidth: width,
    });
  }

  selectTab() {
    // Animated.spring(this.state.indicatorPosition, {
    //   toValue: this.getAnimateValues().indicatorPosition,
    //   tension: 300,
    //   friction: 20,
    //   useNativeDriver: true,
    // }).start();

    if (this.props.selectedIndex === 0) {
      this.scrollView.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }

    if (this.props.selectedIndex !== 0 && this.props.items.length !== 2) {
      this.scrollView.scrollTo({
        x: this.getScrollOffset(this.props.selectedIndex), //this.getAnimateValues().scrollPosition,
      });
    }

    console.log('scrollPosition', this.getAnimateValues().scrollPosition);
  }

  measureView(event) {
    console.log('event peroperties: ', event);
  }

  renderContent() {
    return (
      <Bar
        innerRef={(ref) => (this.bar = ref)}
        barColor={this.props.barColor}
        barHeight={this.props.barHeight}
        onLayout={(event) => this.getTabWidth(event.nativeEvent.layout.width)}>
        <ScrollView
          horizontal
          ref={(ref) => (this.scrollView = ref)}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={this.props.scrollable}>
          <TabTrack barHeight={this.props.barHeight}>
            {this.props.items.map((item, idx) => (
              <Tab
                onLayout={(event) => this.measureView(event)}
                allowFontScaling={this.props.allowFontScaling}
                text={item}
                key={item}
                stretch={!this.props.scrollable}
                onPress={() => this.props.onChange(idx)}
                active={idx === this.props.selectedIndex}
                activeTextColor={this.props.activeTextColor}
                textStyle={this.props.textStyle}
                activeTextStyle={
                  this.props.selectedIndex === idx
                    ? this.props.activeTextStyle
                    : {}
                }
                tabHeight={this.props.barHeight}
                tabWidth={this.props.items.length === 2 ? width / 2 : 0}
                uppercase={this.props.uppercase}
                inActiveTextColor={this.props.inactiveTextColor}
              />
            ))}
          </TabTrack>

          {/* <Indicator
            color={this.props.indicatorColor}
            value={this.state.indicatorPosition}
            tabWidth={
              !this.props.scrollable
                ? this.state.tabWidth
                : this.state.barWidth * 0.4
            }
          /> */}
        </ScrollView>
      </Bar>
    );
  }

  render() {
    return this.props.items ? this.renderContent() : null;
  }
}

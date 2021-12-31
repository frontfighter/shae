import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Dimensions, TextInput, Image, Animated, FlatList, Platform } from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow'

import Panel from './Panel';
import PanelUnit from './PanelUnit';
import * as shaefitApi from '../API/shaefitAPI';
import getRateColor from '../utils/getRateColor';
import PanelRecipesFilter from './PanelRecipesFilter';


const {height, width} = Dimensions.get('window');


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


class SavedMealFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // itemActive: 0
    }
  }

  onPress = (index) => {
    // this.setState({itemActive: index});

    this.props.changeSavedMealFilter(index);
    console.log('meals filter', index);
  }

  render() {
    return (
      <View style={{width}}>
        <View style={{marginTop: 30, width: width - 40, alignSelf: 'center'}}>
          <Text style={styles.mainTitle}>Filters</Text>

          <TouchableWithoutFeedback onPress={() => this.onPress(0)}>
            <View style={{marginTop: 16, width: width - 40, height: 44, borderBottomWidth: 0.5, borderBottomColor: 'rgb(216,215,222)', alignSelf: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.text}>Recently Added</Text>

              {(this.props.itemActive === 0) ? (
                <View style={styles.cirlceFilled}>
                  <View style={styles.circleBlue} />
                </View>
              ) : (
                <View style={styles.cirlce} />
              )}

            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.onPress(1)}>
            <View style={{marginTop: 0, width: width - 40, height: 44, borderBottomWidth: 0.5, borderBottomColor: 'rgb(216,215,222)', alignSelf: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.text}>A to Z</Text>

              {(this.props.itemActive === 1) ? (
                <View style={styles.cirlceFilled}>
                  <View style={styles.circleBlue} />
                </View>
              ) : (
                <View style={styles.cirlce} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.onPress(2)}>
            <View style={{marginTop: 0, width: width - 40, height: 44, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.text}>Z to A</Text>

              {(this.props.itemActive === 2) ? (
                <View style={styles.cirlceFilled}>
                  <View style={styles.circleBlue} />
                </View>
              ) : (
                <View style={styles.cirlce} />
              )}
            </View>
          </TouchableWithoutFeedback>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainTitle: {
    fontFamily: 'SFProDisplay-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: 'rgb(31,33,35)'
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(31,33,35)',
    letterSpacing: -0.41,
    lineHeight: 22,
  },
  cirlce: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgb(223,230,235)',
    position: 'absolute',
    right: 0,
    top: 13
  },
  cirlceFilled: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 13
  },
  circleBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(0,168,235)'
  }
});

const shadowOpt = {
  width: width - 40,
  height: 205,
  color: '#273849',
  border: 25,
  radius: 10,
  opacity: 0.06, //0.12,
  x: 0,
  y: 12,
  style: styles.searchPopup
}

export default SavedMealFilter;

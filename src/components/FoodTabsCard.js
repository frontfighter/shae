import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';

import getRateColor from '../utils/getRateColor';

const {height, width} = Dimensions.get('window');

const shadowOpt = {
  width: width - 40,
  height: 48,
  color: '#273849',
  border: 25,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 12,
  style: {marginTop: 250, alignSelf: 'center'},
};

class FoodTabsCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLiked: false,
      height: 150,
    };

    this.rateColor = null;
    this.rateWidth = null;
  }

  /**
    Set rate color, width and fill the heart icon if food is favorite
  */
  UNSAFE_componentWillMount() {
    const rate = getRateColor(this.props.importanceValue, width - 80);
    this.rateColor = rate.color;
    this.rateWidth = rate.width;

    console.log('cwm isLiked', this.props.userFav);
    this.setState({
      isLiked:
        typeof this.props.userFav === 'undefined' ||
        this.props.userFav === null ||
        !this.props.userFav
          ? false
          : true,
    });
  }

  /**
    Dynamic determinition of component's height on render
  */
  getComponentDimensions(event) {
    try {
      const layout = event.nativeEvent.layout;
      console.log('food card height', layout.height);
      this.setState({height: layout.height});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  }

  render() {
    return (
      <View>
        <View style={styles.image}>
          <View style={styles.oval}>
            <Image
              source={{uri: this.props.url}}
              style={{
                marginTop: 50,
                marginLeft: width < 375 ? -25 : -25 + (375 - width) / 2,
                width: width + 3,
                height: 395,
                transform: [
                  {scaleX: 1 / 2.1},
                  {scaleY: (1 / 2.55) * 1.095238095238095},
                ],
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgb(0,0,0)', 'rgba(0,0,0,0)']}
              style={{
                width: 1000,
                height: 300,
                top: 50,
                transform: [{scaleX: 1 / 2.3}, {scaleY: 1 / 2.55}],
                alignSelf: 'center',
                position: 'absolute',
                opacity: 0.4,
              }}>
              <Text style={styles.foodText}>EXCELLENT</Text>
            </LinearGradient>
          </View>
        </View>
        <View style={{width, marginTop: 56 - 20, alignItems: 'center'}}>
          <TouchableWithoutFeedback onPress={() => this.props.back()}>
            <View style={{position: 'absolute', left: 0}}>
              <Image
                source={require('../resources/icon/back.png')}
                style={{
                  tintColor: 'rgb(255,255,255)',
                  width: 12.3,
                  height: 20.7,
                  margin: 20,
                }}
              />
            </View>
          </TouchableWithoutFeedback>

          <Text style={styles.title}>Recipe</Text>
        </View>

        <BoxShadow setting={{...shadowOpt, ...{height: this.state.height}}}>
          <View
            onLayout={(event) => this.getComponentDimensions(event)}
            style={[styles.card, {marginTop: 0, shadowOpacity: 0}]}>
            <Text style={styles.cardTitle}>{this.props.title}</Text>
            <View
              style={[
                styles.foodTextContainer,
                {backgroundColor: 'rgb(235,241,243)'},
              ]}>
              <LinearGradient
                colors={this.rateColor}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                locations={[0.5, 1]}
                style={[
                  styles.foodTextContainer,
                  {width: this.rateWidth, marginTop: 0, marginLeft: 0},
                ]}>
                <Text style={styles.foodText}>{this.props.importanceText}</Text>
              </LinearGradient>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 18,
                marginLeft: 20,
                marginBottom: 20,
              }}>
              <View>
                <Text style={styles.cardText}>{this.props.textOne}</Text>
                <Text style={styles.cardAdditionalText}>
                  {this.props.additionalTextOne}
                </Text>
              </View>

              <View style={[styles.stroke, {left: 78}]}></View>

              <View style={{position: 'absolute', left: 110}}>
                <Text style={styles.cardText}>{this.props.textTwo}</Text>
                <Text style={styles.cardAdditionalText}>
                  {this.props.additionalTextTwo}
                </Text>
              </View>

              <View style={[styles.stroke, {left: 188}]}></View>

              <View style={{position: 'absolute', left: 218}}>
                <Text style={styles.cardText}>{this.props.textThree}</Text>
                <Text style={styles.cardAdditionalText}>
                  {this.props.additionalTextThree}
                </Text>
              </View>
            </View>
          </View>
        </BoxShadow>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
    shadowOpacity: 0.12,
    shadowRadius: 25,
    shadowColor: 'rgb(39,56,73)',
    shadowOffset: {height: 12, width: 0},
    marginTop: 250,
  },
  stroke: {
    width: 0.5,
    height: 32,
    backgroundColor: 'rgb(216,215,222)',
    position: 'absolute',
    top: 3,
  },
  image: {
    width: width,
    height: 410,
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: 'rgb(255,255,255)',
  },
  oval: {
    position: 'absolute',
    right: -10,
    bottom: 250,
    width: 336,
    height: 336,
    borderRadius: width / 2,
    transform: [{scaleX: 2.3}, {scaleY: 2.55}],
    backgroundColor: 'white',
    marginLeft: 201,
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: 'SFProDisplay-Semibold',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: -0.5,
    color: 'rgb(31,33,35)',
    marginHorizontal: 20,
    marginTop: 19,
  },
  cardText: {
    fontFamily: 'SFProDisplay-Medium',
    fontWeight: '500',
    fontSize: 17,
    letterSpacing: -0.4,
    color: 'rgb(31,33,35)',
  },
  cardAdditionalText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    letterSpacing: -0.3,
    color: 'rgb(148,155,162)',
    marginTop: 2,
  },
  foodText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: -0.1,
    color: 'rgb(255,255,255)',
    marginLeft: 11.4,
  },
  foodTextContainer: {
    width: width - 80,
    height: 21,
    borderRadius: 10.5,
    justifyContent: 'center',
    marginTop: 12,
    marginLeft: 20,
  },
  title: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.41,
    lineHeight: 22,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default FoodTabsCard;

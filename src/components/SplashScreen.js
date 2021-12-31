import React, { Component } from 'react';
import {
  Animated,
  Image,
  StyleSheet
} from 'react-native';
import { screenHeight, screenWidth } from '../globalStyles';

const splashStyle = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  img: {
    width: screenWidth,
    height: screenHeight
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#44c5fb'
  }
});

export default class SplashScreen extends Component {

  state = {
    opacity: new Animated.Value(1),
    hidden: false
  };

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 500,
      delay: 2000
    }).start(() => this.setState({ hidden: true }));
  }

  render() {
    const bg = require('../resources/default-splash-screen.jpg');
    return (
      <Animated.View
        style={[
          splashStyle.absoluteContainer,
          splashStyle.centeredContent,
          { opacity: this.state.opacity }
        ]}
        pointerEvents={this.state.hidden ? 'none' : 'auto'}
      >
        <Image
          style={splashStyle.img}
          source={bg}
          resizeMode="cover"
        />
      </Animated.View>
    );
  }
}

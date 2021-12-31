import React, {Component, Fragment} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, Platform} from 'react-native';
import Slider from './hraSlider'; //'react-native-slider';
import * as Animatable from 'react-native-animatable';


const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  // return size / 812 * height;
  return size;
}

const getWidth = (size) => {
  return size / 375 * width;
  // return size;
}

export default HraScale = (props) => {
  return (
    <View>
      <View style={{height: 26, marginTop: 47}} />
      <View style={styles.container}>
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={styles.scaleUnit} />
        <View style={[styles.scaleUnit, {height: 20}]} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    height: 20,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgb(223,230,235)',
  },
  scaleUnit: {
    height: getHeight(12),
    width: 1,
    marginLeft: 11,
    backgroundColor: 'rgb(223,230,235)'
  },
});

import React, {Component} from 'react';
import {View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, Animated, StatusBar, ScrollView, Platform} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import {BoxShadow} from 'react-native-shadow';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const {height, width} = Dimensions.get('window');


const getHeight = (size) => {
  return size;
}

const getWidth = (size) => {
  // return size / 375 * width;
  return size;
}

const AccountCard = (props) => {
  return (
    <View style={[styles.card, props.styles]}>
      {props.children}
    </View>
  );
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
    shadowOffset: { height: 12, width: 0 },
  },
});

export default AccountCard;

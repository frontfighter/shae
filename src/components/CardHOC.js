import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform} from 'react-native';
import {BoxShadow} from 'react-native-shadow';

const {height, width} = Dimensions.get('window');


const CardHOC = (Child) => {

  return ({ shadowOpt, ...props }) => {
    if (Platform.OS === 'android') {
      return (
        <BoxShadow setting={shadowOpt}>
          <Child {...props}/>
        </BoxShadow>
      );
    }
    return <Child {...props}/>;

  };
};

const styles = StyleSheet.create({
});


export default CardHOC;

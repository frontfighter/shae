import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';


const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  // return size / 812 * height;
  return size;
}

const getWidth = (size) => {
  // return size / 375 * width;
  return size;
}

const PanelFoodUnit = (props) => {
  // console.log('PanelFoodUnit text', props.text)
  return (
    <View style={[styles.foodUnit, {height: (props.text2 !== '') ? 60 : 20}]}>

        <Text style={[styles.unitText, {left: props.left}]}>{props.text.replace('_', ' ')}</Text>

      <Text style={[styles.unitText, {position: 'absolute', right: 0}]}>{props.additionalText}</Text>
      {(props.text2 !== '') && (
        <Text style={[styles.unitText, {left: props.left, position: 'absolute', bottom: 0}]}>{props.text2}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  foodUnit: {
    marginLeft: 32,
    marginTop: 10,
    height: 20,
    alignItems: 'center',
    flexDirection: 'row'
  },
  unitText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    color: 'rgb(38,42,47)',
    lineHeight: 20
  },
});

PanelFoodUnit.defaultProps = {
  left: 0,
  text2: ''
};

export default PanelFoodUnit;

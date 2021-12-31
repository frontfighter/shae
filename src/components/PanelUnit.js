import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback} from 'react-native';


const {height, width} = Dimensions.get('window');


const PanelUnit = (props) => {
  return (
    <View style={{overflow: 'hidden'}}>
      <TouchableWithoutFeedback onPress={(name) => props.handleState(name)}>
        <View style={styles.popupUnit}>
          <Text style={styles.unitText}>{props.text}</Text>
          {(props.condition) ? (
            <View style={{position: 'absolute', right: 0, width: 18, height: 18, borderRadius: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(0,168,235)'}}>
              <Image
                source={require('../resources/icon/checkmark.png')}
                style={{width: 10, height: 8, tintColor: 'rgb(255,255,255)'}}
              />
            </View>
          ) : (
            <View style={styles.checkbox} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  checkIcon: {
    position: 'absolute',
    tintColor: 'rgb(0,168,235)',
    right: 2 //getWidth(12)
  },
  popupUnit: {
    width: width - 40,
    height: 42.5,
    borderTopWidth: 0.5,
    borderTopColor: 'rgb(216,215,222)',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  unitText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(31,33,35)',
    letterSpacing: -0.4,
    lineHeight: 22
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'rgb(199,205,209)',
    position: 'absolute',
    right: 0
  }
});

export default PanelUnit;

import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Switch from 'react-native-switch-pro';


const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  // return size / 812 * height;
  return size;
}

const getWidth = (size) => {
  // return size / 375 * width;
  return size;
}

const SwitchComponent = (props) => {
  return (
    <View style={styles.switch}>
      <Switch
       onSyncPress={(value) => props.handler(value)}
       value={props.value}
       width={48}
       height={28}

       circleStyle={{width: 24, height: 24}}
       onTintColor={'rgb(0,168,235)'}
       tintColor={'rgb(223,228,238)'}
       backgroundActive={'rgb(0,168,235)'}
       backgroundInactive={'rgb(223,228,238)'}
       disabled={props.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    position: 'absolute',
    alignSelf: 'center',
    right: 20,
    backgroundColor: 'rgb(223,228,238)',
    borderRadius: 14,
    width: 48,
    transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }]
  },
});

export default SwitchComponent;

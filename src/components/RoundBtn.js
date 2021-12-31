/**
 * Created by developercomputer on 10.10.16.
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';

import PropTypes from 'prop-types';

const btnStyle = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: '500',
    alignSelf: 'center',
    fontFamily: 'System',
  },
  button: {
    justifyContent: 'center',
    height: 55,
    borderRadius: 35,
    backgroundColor: '#44c5fb',
  },
});

const RoundBtn = ({
  styleContainer,
  styleButton,
  colorTextButton,
  text,
  onPress,
}) => (
  <View style={styleContainer}>
    <TouchableOpacity onPress={onPress} style={[btnStyle.button, styleButton]}>
      <Text style={[{color: colorTextButton}, btnStyle.text]}>{text}</Text>
    </TouchableOpacity>
  </View>
);

RoundBtn.propTypes = {
  styleContainer: ViewPropTypes.style,
  styleButton: ViewPropTypes.style,
  colorTextButton: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func,
};

export default RoundBtn;

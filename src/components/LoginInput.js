/**
 * Created by developercomputer on 07.10.16.
 */
import React from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet
} from 'react-native';

const style = StyleSheet.create({
  container: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40
  },
  icon: {
    width: 14,
    height: 14
  },
  input: {
    justifyContent: 'center',
    color: '#fff',
    flex: 1
  }
});

const LoginInput = ({ source, ...rest }) => (
  <View style={style.container}>
    <View style={style.iconContainer}>
      <Image source={source} style={style.icon} resizeMode="contain" />
    </View>
    <TextInput {...rest} style={[style.input, rest.inputTextStyle]} />
  </View>
);

LoginInput.propTypes = {
  ...TextInput.propTypes,
  source: Image.propTypes.source,
  inputTextStyle: TextInput.propTypes.style
};

LoginInput.defaultProps = {
  underlineColorAndroid: 'rgba(255,255,255,0)',
  autoCapitalize: 'none',
  autoCorrect: false,
  placeholderTextColor: '#fff',
  inputTextStyle: {}
};

export default LoginInput;

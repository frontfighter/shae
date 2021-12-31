import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native';

const {height, width} = Dimensions.get('window');

export default class FloatingLabelInput2 extends Component {
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(
      this.props.value === '' ? 0 : 1,
    );
  }

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});

  /**
    Animation on focus/blur
  */
  componentDidUpdate() {
    setTimeout(() => {
      Animated.timing(this._animatedIsFocused, {
        toValue: this.state.isFocused || this.props.value !== '' ? 1 : 0,
        duration: 150,
      }).start();
    }, 10);
  }

  focus = () => {
    try {
      this.textInput.focus();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    const {label, ...props} = this.props;
    const labelStyle = {
      position: 'absolute',
      left: 5,
      fontFamily:
        this.state.isFocused || this.props.value !== ''
          ? 'SFProText-Regular'
          : 'SFProText-Regular',
      color:
        this.state.isFocused && this.props.value !== ''
          ? 'rgb(0,168,235)'
          : 'rgb(138,138,143)',
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [
          30 * (this.props.height / 72),
          23 * (this.props.height / 72),
        ],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.fontSize, 12],
      }),
      letterSpacing: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [-0.3, -0.07],
      }),
    };

    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() =>
            typeof this.textInput.focus !== 'undefined'
              ? this.textInput.focus()
              : this.textInput.getElement().focus()
          }>
          <View
            style={[
              styles.floatingFieldContainer,
              {
                width: this.props.width,
                height: this.props.height,
                marginTop: this.props.marginTop,
                marginRight: this.props.marginRight,
                marginLeft: 0,
                justifyContent: 'center',
                borderBottomWidth: this.state.isFocused ? 2 : 1,
                borderColor: this.state.isFocused
                  ? 'rgb(0,168,235)'
                  : 'rgb(221,224,228)',
              },
              this.props.error !== '' || this.props.isApiError
                ? styles.errorField
                : null,
            ]}>
            <Animated.Text style={labelStyle}>{label}</Animated.Text>

            <TextInput
              {...props}
              ref={(textInput) => {
                this.textInput = textInput;
              }}
              style={[
                styles.titleTextStyle,
                {marginTop: 25 * (72 / this.props.height)},
              ]}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              underlineColorAndroid="rgba(0,0,0,0)"
              textContentType={this.props.type}
              keyboardType={this.props.keyboard}
              secureTextEntry={this.props.secureEntry}
              autoCapitalize={this.props.autoCapitalize}
              autoCorrect={false}
              editable={this.props.editable}
            />
          </View>
        </TouchableWithoutFeedback>
        {this.props.error !== '' && (
          <Text
            style={[
              styles.errorText,
              {marginLeft: this.props.errorMarginHorizontal},
            ]}>
            {this.props.error}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleTextStyle: {
    marginTop: 12,
    // fontFamily: "SFProText-Regular",
    // fontWeight: "400",
    // fontSize: 17,
    // letterSpacing: -0.4,
    // color: "rgb(38,42,47)",
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: -0.3,
    color: 'rgb(38,42,47)',
    marginLeft: Platform.OS === 'ios' ? 5 : 5,
  },
  floatingFieldContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgb(255,255,255)',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    height: 56,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgb(221,224,228)',
  },
  errorText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: -0.3,
    color: 'rgb(228,77,77)',
    // marginHorizontal: 20,
    marginTop: 9,
    marginLeft: 20,
  },
  errorField: {
    borderBottomWidth: 1,
    borderColor: 'rgb(228,77,77)',
    // backgroundColor: "rgb(252,245,245)",
  },
});

FloatingLabelInput2.defaultProps = {
  fontSize: 17,
  type: 'none',
  keyboard: 'default',
  secureEntry: false,
  error: '',
  isApiError: false,
  editable: true,
  autoCapitalize: 'none',
  errorMarginHorizontal: 20,
  phoneInputType: false,
  height: 72,
};

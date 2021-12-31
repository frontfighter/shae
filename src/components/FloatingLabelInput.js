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

export default class FloatingLabelInput extends Component {
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
    }, 150);
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
      left: 14,
      fontFamily:
        this.state.isFocused || this.props.value !== ''
          ? 'SFProText-Medium'
          : 'SFProText-Regular',
      color: 'rgb(182,189,195)',
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [
          22 * (this.props.height / 72),
          15 * (this.props.height / 72),
        ],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [this.props.fontSize, 12],
      }),
      letterSpacing: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [-0.4, -0.07],
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
              this.props.error !== '' || this.props.isApiError
                ? styles.errorField
                : null,
              {
                width: this.props.width,
                height: this.props.height,
                marginTop: this.props.marginTop,
                marginRight: this.props.marginRight,
                marginLeft: this.props.marginLeft,
                justifyContent: 'center',
                borderColor: this.state.isFocused
                  ? 'rgb(0,168,235)'
                  : 'rgb(221,224,228)',
              },
            ]}>
            <Animated.Text style={labelStyle}>{label}</Animated.Text>

            <TextInput
              {...props}
              ref={(textInput) => {
                this.textInput = textInput;
              }}
              style={[
                styles.titleTextStyle,
                {marginTop: 12 * (72 / this.props.height)},
              ]}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              underlineColorAndroid="rgba(0,0,0,0)"
              textContentType={this.props.type}
              keyboardType={this.props.keyboard}
              secureTextEntry={this.props.secureEntry}
              autoCapitalize="sentences"
              autoCorrect={false}
              editable={this.props.editable}
            />
          </View>
        </TouchableWithoutFeedback>
        {this.props.error !== '' && (
          <Text
            style={[
              styles.errorText,
              {marginHorizontal: this.props.errorMarginHorizontal},
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
    fontSize: 15,
    letterSpacing: -0.1,
    color: 'rgb(16,16,16)',
    marginLeft: Platform.OS === 'ios' ? 14 : 10,
  },
  floatingFieldContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgb(255,255,255)',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 4,
    height: 72,
    alignSelf: 'center',
    borderWidth: 1,
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
  },
  errorField: {
    borderWidth: 1,
    borderColor: 'rgb(228,77,77)',
    backgroundColor: 'rgb(252,245,245)',
  },
});

FloatingLabelInput.defaultProps = {
  secureEntry: false,
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

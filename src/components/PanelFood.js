import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');

const getHeight = (size) => {
  // return size / 812 * height;
  return size;
}

const getWidth = (size) => {
  // return size / 375 * width;
  return size;
}

class PanelFood extends Component {
  constructor(props) {
    super(props);

    this.icons = {
      'plus': require('../resources/icon/plus_icon_food.png'),
      'minus': require('../resources/icon/minus_icon.png')
    };

    this.state = {
      title: props.title,
      expanded: props.isExpanded,
      animation: new Animated.Value(38),
      isInitial: true
    };
  }

  /**
    Collapse/expand panel
  */
  toggle() {
    try {
      let initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight;
      let finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

      this.setState({
        expanded: !this.state.expanded
      });

      this.state.animation.setValue(initialValue);
      Animated.spring(
        this.state.animation,
        {toValue: finalValue}
      ).start();

      this.props.handler();
    } catch (err) {
      this.setState(() => { throw err; })
    }
  }

  _setMaxHeight(event) {
    try {
      this.setState({
        maxHeight: event.nativeEvent.layout.height
      });
    } catch (err) {
      this.setState(() => { throw err; })
    }
  }

  _setMinHeight(event) {
    try {
      this.setState({
        minHeight: event.nativeEvent.layout.height + this.props.marginBottom
      });
    } catch (err) {
      this.setState(() => { throw err; })
    }
  }

  render() {
    let icon = this.icons['plus'];

    if (this.state.expanded) {
      icon = this.icons['minus'];
    }

    return (
      <Animated.View style={[styles.container, {height: this.state.animation, marginTop: this.props.marginTop, paddingBottom: this.props.marginBottom}]}>
        <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
          <TouchableWithoutFeedback
            onPress={this.toggle.bind(this)}
            disabled={this.props.isDisabled}
          >
            <View style={styles.buttonImage}>
              <Image source={icon} style={{tintColor: 'rgb(200,199,204)', opacity: this.props.isDisabled ? 0 : 1}} />
              <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
              <Text style={styles.text}>{this.props.text}</Text>
            </View>
          </TouchableWithoutFeedback>

        </View>

        <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgb(216,215,222)'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'rgb(38,42,47)',
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 16,
  },
  text: {
    color: 'rgb(38,42,47)',
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    right: 0,
    position: 'absolute',
  },
  button: {

  },
  buttonImage: {
    width: width - 48,
    alignItems: 'center',
    flexDirection: 'row'
  },
  body: {
  }
});

PanelFood.defaultProps = {
  marginBottom: 15,
  handler: () => null,
  isDisabled: false
};

export default PanelFood;

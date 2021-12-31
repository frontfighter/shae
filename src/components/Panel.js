import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');


class Panel extends Component {
  constructor(props) {
    super(props);

    this.icons = {
      'up': require('../resources/icon/arrowUp.png'),
      'down': require('../resources/icon/arrowDown.png')
    };

    this.state = {
      title: props.title,
      expanded: props.isExpanded,
      animation: new Animated.Value(0)
    };
  }

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
        minHeight: event.nativeEvent.layout.height + this.props.marginTop + this.props.marginBottom
      });
    } catch (err) {
      this.setState(() => { throw err; })
    }
  }

  render() {
    let icon = this.icons['down'];

    if (this.state.expanded) {
      icon = this.icons['up'];
    }

    return (
      <Animated.View style={[styles.container, {height: (this.state.animation._value === 0) ? null : this.state.animation}]}>
        <View style={[styles.titleContainer, {marginTop: this.props.marginTop, marginBottom: this.props.marginBottom}]} onLayout={this._setMinHeight.bind(this)}>
          <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
          <TouchableWithoutFeedback onPress={this.toggle.bind(this)}>
            <View style={[styles.buttonImage, {marginTop: 4.5}]}>
              <Image source={icon} style={{margin: 20}} />
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
    height: null,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  title: {
    color: 'rgb(31,33,35)',
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.4
  },
  button: {

  },
  buttonImage: {
    right: 2.5,
    bottom: -20,
    position: 'absolute',
  },
  body: {

  }
});

Panel.defaultProps = {
  marginBottom: 16,
  handler: () => null
};

export default Panel;

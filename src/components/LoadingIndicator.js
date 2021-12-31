import React from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

export default class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacityOne: new Animated.Value(0),
      opacityTwo: new Animated.Value(0),
      opacityThree: new Animated.Value(0),
      opacityFour: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.setOpacity();
  }

  setOpacity = () => {
    try {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.opacityOne, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacityOne, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(this.state.opacityTwo, {
            toValue: 1,
            duration: 500,
            delay: 150,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacityTwo, {
            toValue: 0,
            duration: 500,
            delay: 150,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(this.state.opacityThree, {
            toValue: 1,
            duration: 500,
            delay: 250,
            useNativeDriver: true,
          }),
          Animated.timing(this.state.opacityThree, {
            toValue: 0,
            duration: 500,
            delay: 250,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (this.props.isLoading) {
          this.setOpacity();
        }
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    return (
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <Animated.View
          style={[
            styles.dot,
            {
              marginLeft: 0,
              opacity: this.state.opacityOne,
              backgroundColor: this.props.backgroundColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: this.state.opacityTwo,
              backgroundColor: this.props.backgroundColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            {
              opacity: this.state.opacityThree,
              backgroundColor: this.props.backgroundColor,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgb(255,255,255)",
    marginLeft: 8,
  },
});

LoadingIndicator.defaultProps = {
  backgroundColor: "rgb(255,255,255)",
};

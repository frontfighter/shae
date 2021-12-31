import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  InteractionManager,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { height, width } = Dimensions.get("window");

export default class HraRadio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
    };
  }

  toggle = () => {
    try {
      if (this.props.value === this.props.newValue)
        this.setState({ isChecked: this.state.isChecked });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    console.log("hra radio", this.props.activeItem, this.props.value);

    return (
      <View>
        {this.props.activeItem !== null &&
        this.props.value !== null &&
        this.props.activeItem.startsWith(this.props.value) ? (
          <View
            style={[
              styles.circle,
              { backgroundColor: "rgb(0,187,116)", borderWidth: 0 },
            ]}
          >
            <Image
              source={require("../resources/icon/checkmarkCopy.png")}
              style={{ tintColor: "rgb(255,255,255)" }}
            />
          </View>
        ) : (
          <View>
            <View style={styles.circle} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "rgb(194,203,210)",
    backgroundColor: "rgb(255,255,255)",
    alignItems: "center",
    justifyContent: "center",
  },
});

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

export default class HraCheckbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {this.props.value !== null ? (
          <View
            style={[
              styles.square,
              { backgroundColor: "rgb(0,187,116)", borderWidth: 0 },
            ]}
          >
            <Image
              source={require("../resources/icon/checkmarkCopy.png")}
              style={{ tintColor: "rgb(255,255,255)" }}
            />
          </View>
        ) : (
          <View style={styles.square} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  square: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgb(194,203,210)",
    backgroundColor: "rgb(255,255,255)",
    alignItems: "center",
    justifyContent: "center",
  },
});

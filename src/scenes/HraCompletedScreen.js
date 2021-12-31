import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";

import { getUserVariables } from "../data/db/Db";
import * as api from "../API/shaefitAPI";
import LoadingIndicator from "../components/LoadingIndicator";

const { height, width } = Dimensions.get("window");

class HraCompletedScreen extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      data: null,
    };
  }

  async componentDidMount() {
    const data = await api.getLastMeasurementsComparison();
    if (data.data !== null && data.data.length !== 0) {
      const array = [];
      Object.keys(data.data).map((key) => {
        array.push(data.data[key]);
      });
      console.log("array", array);
      this.setState({ data: array, isLoading: false });
    } else {
      this.setState({ data: null, isLoading: false });
    }
  }

  /**
   * Navigation to another screen by the condition.
   */
  onPress = () => {
    // try {
    //   if (!this.state.isLoading) {
    //     console.log("onPress isLoading false");
    //     const userVariables = getUserVariables();
    //     if (userVariables.isNewUser) {
    //       console.log("onPress isLoading isNewUser");
    //       if (Platform.OS === "android") {
    //         this.props.navigation.navigate("EnableGps", {
    //           sinceLastUpdateData: this.state.data,
    //         });
    //       } else {
    //         const majorVersionIOS = parseInt(Platform.Version, 10);
    //         if (majorVersionIOS < 12) {
    //           this.props.navigation.navigate("SoftwareUpdate", {
    //             sinceLastUpdateData: this.state.data,
    //           });
    //         } else {
    //           this.props.navigation.navigate("AddSiriShortcuts", {
    //             sinceLastUpdateData: this.state.data,
    //           });
    //         }
    //       }
    //     } else {
    //       if (this.state.data !== null) {
    //         console.log("onPress isLoading data !== null", this.state.data);
    //         this.props.navigation.navigate("SinceLastUpdate", {
    //           sinceLastUpdateData: this.state.data,
    //         });
    //       } else {
    //         console.log("onPress isLoading data === null", this.state.data);
    //         this.props.mainContent();
    //       }
    //     }
    //   }
    // } catch (err) {
    //   this.setState(() => {
    //     throw err;
    //   });
    // }

    this.animatableView.stopAnimation();
    this.animatableView1.stopAnimation();
    this.animatableView2.stopAnimation();

    Actions.popTo("dashboard");
    // Actions.reset("dashboard");
    // Actions.dashboard();
  };

  render() {
    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1, height }}>
        <Animatable.Image
          ref={(ref) => (this.animatableView = ref)}
          source={require("../resources/icon/triangles.png")}
          style={styles.backgroundImage}
          animation={{
            from: { translateY: -height, translateX: -width / 2 },
            to: { translateY: height, translateX: width },
          }}
          duration={2500}
          easing={(t) => Math.pow(t, 1.7)}
          iterationCount="infinite"
          useNativeDriver
        />
        <Animatable.Image
          ref={(ref) => (this.animatableView1 = ref)}
          source={require("../resources/icon/triangles.png")}
          style={styles.backgroundImage}
          animation={{
            from: { translateY: -height, translateX: -width / 3 },
            to: { translateY: height, translateX: width - 100 },
          }}
          duration={2500}
          delay={1000}
          easing={(t) => Math.pow(t, 1.7)}
          iterationCount="infinite"
          useNativeDriver
        />
        <Animatable.Image
          ref={(ref) => (this.animatableView2 = ref)}
          source={require("../resources/icon/triangles.png")}
          style={styles.backgroundImage}
          animation={{
            from: { translateY: -height, translateX: -width / 4 },
            to: { translateY: height, translateX: width - 200 },
          }}
          duration={2500}
          delay={2000}
          easing={(t) => Math.pow(t, 1.7)}
          iterationCount="infinite"
          useNativeDriver
        />
        <View style={styles.content}>
          <Image source={require("../resources/icon/thumbsUp.png")} />
          <Text style={styles.title}>
            Congratulations on completing {"\n"}your Personal Health Assessment!
          </Text>
          <Text style={styles.text}>
            The complex scientific calculations have finished, offering you
            wellness information based on the expression of your genes, the
            measurements of your body, and the details of your lifestyle.
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={this.onPress}>
          <View style={styles.button}>
            {this.state.isLoading ? (
              <LoadingIndicator isLoading={true} />
            ) : (
              <Text style={styles.buttonText}>
                Explore Your Unique Profile Now
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
  },
  content: {
    marginTop: (height - 286) / 2 + 30,
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 17,
    color: "rgb(16,16,16)",
  },
  text: {
    marginTop: 10,
    textAlign: "center",
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    color: "rgb(106,111,115)",
    width: width - 95,
  },
  button: {
    position: "absolute",
    bottom: isIphoneX() ? 34 : 0,
    width: width,
    height: 49,
    backgroundColor: "rgb(0,168,235)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "SFProText-Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "rgb(255,255,255)",
  },
});

export default HraCompletedScreen;

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";

import { getUserVariables } from "../data/db/Db";
import * as api from "../API/shaefitAPI";
import LoadingIndicator from "../components/LoadingIndicator";

const { height, width } = Dimensions.get("window");

class ResetPasswordCompleted extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "rgb(255,255,255)",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Platform.OS === "ios" && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <View style={{ flex: 1, justifyContent: "center" }}>
          <Image
            source={require("../resources/icon/email_recovery.png")}
            style={{ alignSelf: "center" }}
          />

          <Text style={styles.title}>Email Sent!</Text>
          <Text style={styles.text}>
            The details to reset your password are now in your inbox! Please
            login again with your new details.
          </Text>

          <TouchableWithoutFeedback onPress={() => Actions.popTo("login")}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 17,
    color: "rgb(16,16,16)",
    marginTop: 20,
    alignSelf: "center",
  },
  text: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    color: "rgb(106,111,115)",
    marginTop: 10,
    width: width - 95,
    textAlign: "center",
    alignSelf: "center",
  },
  button: {
    width: 140,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgb(0,168,235)",
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: -0.4,
    color: "rgb(255,255,255)",
  },
});

export default ResetPasswordCompleted;

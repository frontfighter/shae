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
  Animated,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const { height, width } = Dimensions.get("window");

class SignupWelcome extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <ScrollView>
          <View>
            <Image
              source={require("../resources/icon/background_signup_welcome.png")}
              style={{ width }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: 42,
                alignSelf: "center",
              }}
            >
              <Text style={styles.title}>Welcome to Shae!</Text>
              <Text style={styles.text}>
                You are about to experience precision health, calculated for
                your unique body, right now.
              </Text>
            </View>

            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
              <View
                style={{
                  position: "absolute",
                  bottom: isIphoneX() ? 128 : 148,
                  left: 16,
                }}
              >
                <Image
                  source={require("../resources/icon/back_arrow.png")}
                  style={{
                    width: 12,
                    height: 21,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Image
            source={require("../resources/icon/illustration_signup_welcome.png")}
            style={{ marginTop: 50, alignSelf: "center" }}
          />
        </ScrollView>

        <KeyboardAvoidingView
          style={{
            justifyContent: "flex-end",
          }}
          behavior={Platform.OS === "ios" ? "position" : null}
          enabled={true}
          keyboardVerticalOffset={
            Platform.OS === "android" ? 0 : isIphoneX() ? -34 : 60
          }
        >
          <TouchableWithoutFeedback onPress={() => Actions.signupPreferences()}>
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Continue</Text>
                )}
              </View>
              {isIphoneX() && (
                <View
                  style={{
                    height: 34,
                    width,
                    backgroundColor: "rgb(255,255,255)",
                    // position: "absolute",
                    // bottom: 0,
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "SFProText-Bold",
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: -0.47,
    color: "rgb(255,255,255)",
    alignSelf: "center",
  },
  text: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 16,
    letterSpacing: -0.21,
    lineHeight: 22,
    color: "rgb(255,255,255)",
    width: width - 95,
    textAlign: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  loginButton: {
    width: width,
    height: 48,
    backgroundColor: "rgb(0,168,235)",
    justifyContent: "center",
  },
  loginText: {
    alignSelf: "center",
    fontFamily: "SFProText-Bold",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: -0.4,
    color: "rgb(255,255,255)",
  },
  forgotPasswordText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.3,
    color: "rgb(106,111,115)",
  },
  errorText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 22,
    color: "rgb(228,77,77)",
  },
  modal: {
    width: width,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  hintText: {
    color: "rgb(196,213,224)",
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 13,
    letterSpacing: -0.31,
    lineHeight: 18,
    margin: 20,
  },
  hintButtonText: {
    color: "rgb(255,255,255)",
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 18,
    marginTop: 12,
    alignSelf: "center",
  },
  agreeText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 14,
    letterSpacing: -0.19,
    lineHeight: 20,
    color: "rgb(16,16,16)",
  },
  termsText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 14,
    letterSpacing: -0.19,
    lineHeight: 20,
    color: "rgb(0,168,235)",
  },
  conditionsTitle: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: -0.3,
    color: "rgb(16,16,16)",
  },
  conditionsText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 22,
    color: "rgb(54,58,61)",
  },
  listText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: "rgb(54,58,61)",
    width: width - 60,
  },
  boldTermsText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 22,
    color: "rgb(16,16,16)",
  },
});

export default SignupWelcome;

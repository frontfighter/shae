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

class MeetShae extends Component {
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
              source={require("../resources/icon/background_meet.png")}
              style={{ width }}
              resizeMode="cover"
            />
            <View
              style={{
                position: "absolute",
                bottom: 36,
                alignSelf: "center",
              }}
            >
              <Text style={styles.title}>Ready to meet Shae?</Text>
              <Text style={styles.text}>
                The more often you check in, the more Shae will learn about you
                and help you meet your needs and goals.
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
            source={require("../resources/icon/iPhone.png")}
            style={{ alignSelf: "center", marginTop: 60 }}
          />

          <Text style={styles.additionalText}>
            You can learn all about what Shae does, in the videos and resources
            inside your app!
          </Text>
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
          <TouchableWithoutFeedback onPress={() => Actions.tour()}>
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Take Me on a Tour Now</Text>
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
  additionalText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    color: "rgb(106,111,115)",
    width: width - 95,
    textAlign: "center",
    marginTop: 0,
    alignSelf: "center",
  },
});

export default MeetShae;

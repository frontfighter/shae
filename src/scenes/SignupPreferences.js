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

class SignupPreferences extends Component {
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
              source={require("../resources/icon/background_preferences.png")}
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
              <Text style={styles.title}>Set Your Preferences</Text>
              <Text style={styles.text}>
                Shae needs to interact with you to guide and support you on your
                health journey.
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

          <Text style={styles.mainText}>
            Shae will send up to 6 daily Notifications to support your:
          </Text>

          <View style={[styles.card, { marginTop: 20 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(245,121,75,0.1)",
                marginRight: 15,
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../resources/icon/preferences_food.png")}
              />
            </View>

            <Text style={[styles.cardTitle, { marginRight: 20 }]}>
              Food -
              <Text style={styles.cardText}>
                {" "}
                A quick citrus fruit now can power up your body, Sean!
              </Text>
            </Text>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,187,116,0.1)",
                marginRight: 15,
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../resources/icon/preferences_physical.png")}
              />
            </View>

            <Text style={[styles.cardTitle, { marginRight: 20 }]}>
              Fitness -
              <Text style={styles.cardText}> What, when and how to move</Text>
            </Text>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(105,88,232,0.1)",
                marginRight: 15,
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../resources/icon/preferences_goals.png")}
              />
            </View>

            <Text style={[styles.cardTitle, { marginRight: 20 }]}>
              Goals -
              <Text style={styles.cardText}>
                {" "}
                How you’re tracking and what you can do to get there
              </Text>
            </Text>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(0,168,235,0.1)",
                marginRight: 15,
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../resources/icon/preferences_lifestyle.png")}
              />
            </View>

            <Text style={[styles.cardTitle, { marginRight: 20 }]}>
              Lifestyle -
              <Text style={styles.cardText}>
                {" "}
                Hacks to de-stress and optimize epigenetic life
              </Text>
            </Text>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(224,186,74,0.1)",
                marginRight: 15,
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../resources/icon/preferences_social.png")}
              />
            </View>

            <Text style={[styles.cardTitle, { marginRight: 20 }]}>
              Coaching -
              <Text style={styles.cardText}>
                {" "}
                Your coaching program updates
              </Text>
            </Text>
          </View>

          <View style={[styles.card, { marginTop: 10 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(246,84,152,0.1)",
                marginRight: 15,
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../resources/icon/preferences_checkUps.png")}
              />
            </View>

            <Text style={[styles.cardTitle, { marginRight: 20 }]}>
              Annual Check Up -
              <Text style={styles.cardText}>
                {" "}
                when to Detox, vacation and go your hardest
              </Text>
            </Text>
          </View>

          <TouchableWithoutFeedback
            onPress={() => Actions.notificationsSettings()}
          >
            <View style={styles.button}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../resources/icon/settings.png")}
                  style={{ marginRight: 10 }}
                />

                <Text style={styles.buttonText}>Change Notifications</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
          <TouchableWithoutFeedback
            onPress={() => Actions.notificationsRequest()}
          >
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Next</Text>
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
  mainText: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.3,
    color: "rgb(31,33,35)",
    marginTop: 22,
    width: width - 95,
    marginHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: 80,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgb(221,224,228)",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: -0.28,
    color: "rgb(31,33,35)",
    width: width - 135,
  },
  cardText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.28,
    color: "rgb(106,111,115)",
  },
  button: {
    width: width - 40,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgb(0,168,235)",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.36,
    color: "rgb(0,168,235)",
  },
});

export default SignupPreferences;

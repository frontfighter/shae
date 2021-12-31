import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";
import VersionCheck from "react-native-version-check";

import { getUserVariables } from "../data/db/Db";
import * as api from "../API/shaefitAPI";
import LoadingIndicator from "../components/LoadingIndicator";

const { height, width } = Dimensions.get("window");

class AboutShae extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      data: null,
      version: "",
    };
  }

  componentDidMount() {
    const currentVersion = VersionCheck.getCurrentVersion();
    this.setState({ version: currentVersion });
  }

  render() {
    let date = new Date();

    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        <ScrollView>
          <View style={{ marginTop: 0 }}>
            <View style={{ width, height: 250 }}>
              <Image
                source={require("../resources/icon/about_shae.png")}
                style={{ width, height: 250 }}
                resizeMode="cover"
              />

              <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                <Image
                  source={require("../resources/icon/close_icon.png")}
                  style={{
                    width: 18,
                    height: 18,
                    tintColor: "rgb(255,255,255)",
                    position: "absolute",
                    top: isIphoneX() ? 44 : Platform.OS === "ios" ? 32 : 12,
                    left: 16,
                  }}
                />
              </TouchableWithoutFeedback>

              <Text style={styles.mainTitle}>About Shae</Text>
            </View>

            <Text style={styles.title}>Shae™ - Health Without Thinking</Text>
            <Text style={styles.text}>
              Shae™ gives you simple, easy and practical advice to stay in top
              shape, personalized to your body, so you can make your life easy,
              happy and healthy – the way it was meant to be. {"\n\n"}Shae™ uses
              AI and deep learning technology to provide you with timely,
              relevant and personalized information, inspiration and motivation
              to accomplish all that you want and more.
            </Text>

            <TouchableWithoutFeedback
              onPress={() =>
                Linking.openURL("https://www.facebook.com/groups/ph360/")
              }
            >
              <View style={[styles.item, { marginTop: 24 }]}>
                <Text style={styles.itemText}>Join the Shae Community</Text>
                <Image
                  source={require("../resources/icon/arrowRight.png")}
                  style={{ position: "absolute", right: 0, top: 15 }}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => Linking.openURL("https://shae.ai/tech/")}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>Learn More About Shae</Text>
                <Image
                  source={require("../resources/icon/arrowRight.png")}
                  style={{ position: "absolute", right: 0, top: 15 }}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.item}>
              <Text style={styles.itemText}>App Version</Text>
              <Text style={styles.versionText}>{this.state.version}</Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => Linking.openURL("https://shae.ai/privacy-policy/")}
            >
              <View style={styles.item}>
                <Text style={styles.itemText}>Privacy Policy</Text>
                <Image
                  source={require("../resources/icon/arrowRight.png")}
                  style={{ position: "absolute", right: 0, top: 15 }}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                Linking.openURL("https://shae.ai/terms-of-service/")
              }
            >
              <View style={[styles.item, { borderBottomWidth: 1 }]}>
                <Text style={styles.itemText}>Terms of Service</Text>
                <Image
                  source={require("../resources/icon/arrowRight.png")}
                  style={{ position: "absolute", right: 0, top: 15 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <Text
              style={styles.tradeMark}
            >{`© ${date.getFullYear()} Shae™`}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainTitle: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 17,
    color: "rgb(255,255,255)",
    lineHeight: 22,
    letterSpacing: -0.41,
    position: "absolute",
    bottom: Platform.OS === "android" ? 212 : isIphoneX() ? 187 : 192,
    alignSelf: "center",
    width: width - 95,
    textAlign: "center",
  },
  title: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 20,
    color: "rgb(16,16,16)",
    lineHeight: 28,
    letterSpacing: -0.3,
    width: width - 40,
    alignSelf: "center",
    marginTop: 24,
  },
  text: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    color: "rgb(54,58,61)",
    lineHeight: 22,
    letterSpacing: -0.3,
    width: width - 40,
    alignSelf: "center",
    marginTop: 16,
  },
  item: {
    width: width - 40,
    height: 48,
    alignSelf: "center",
    borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: "rgb(216,215,222)",
  },
  itemText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    color: "rgb(54,58,61)",
    lineHeight: 20,
    letterSpacing: -0.3,
    marginTop: 12,
  },
  versionText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    color: "rgb(54,58,61)",
    lineHeight: 20,
    letterSpacing: -0.3,
    position: "absolute",
    right: 0,
    top: 12,
  },
  tradeMark: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    color: "rgb(141,147,151)",
    letterSpacing: -0.3,
    alignSelf: "center",
    marginTop: 24,
    marginBottom: 37,
  },
});

export default AboutShae;

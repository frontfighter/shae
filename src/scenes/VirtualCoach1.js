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
import Video from "react-native-video";

import * as shaefitApi from "../API/shaefitAPI";

const { height, width } = Dimensions.get("window");

class VirtualCoach1 extends Component {
  constructor() {
    super();

    this.state = {
      videoUrl: "",
      isPaused: false,
      isVideoLoaded: false,
    };
  }

  async componentDidMount() {
    const video = await shaefitApi.getVimeoUrls("448749598");
    console.log("video", video);
    this.setState({ videoUrl: video["720p"].url });
  }

  onBuffer = (onBuffer) => {
    console.log("onBuffer,", onBuffer);
  };

  videoError = (error) => {
    console.log("onError,", error);
  };

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    let ratio = width / 375;

    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <ScrollView>
          <Text style={styles.title}>Welcome to My Virtual Coach</Text>

          <TouchableWithoutFeedback
            onPress={() => this.setState({ isPaused: !this.state.isPaused })}
          >
            <View>
              {this.state.videoUrl !== "" ? (
                <Video
                  source={{ uri: this.state.videoUrl, type: "mp4" }} // Can be a URL or a local file.
                  ref={(ref) => {
                    this.player = ref;
                  }}
                  onBuffer={this.onBuffer}
                  onError={this.videoError}
                  resizeMode="cover"
                  style={[styles.videoContainer, { height: 188 * ratio }]}
                  paused={this.state.isPaused}
                  onLoad={() => {
                    console.log("onLoad");
                    this.setState({ isVideoLoaded: true });
                  }}
                  onEnd={() =>
                    this.setState(
                      { isPaused: true },
                      () => this.player && this.player.seek(0)
                    )
                  }
                />
              ) : (
                <View
                  style={[styles.videoContainer, { height: 188 * ratio }]}
                />
              )}

              {!this.state.isVideoLoaded && (
                <Image
                  source={require("../resources/icon/virtualCoachVideo1.png")}
                  style={{
                    position: "absolute",
                    top: 24,
                    alignSelf: "center",
                    width: width - 40,
                    height: 188 * ratio,
                    borderRadius: 4,
                  }}
                />
              )}

              {this.state.isPaused && (
                <Image
                  source={require("../resources/icon/play.png")}
                  style={{
                    position: "absolute",
                    top: (188 * ratio - 64) / 2 + 24,
                    alignSelf: "center",
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>

          <Text style={styles.text}>
            Enhance your personalized health with your very own Virtual Coach!
            {"\n\n"}This 8-week, self-paced coaching program guides you step by
            step to using Epigenetics to increase your energy, improve your
            sleep, reveal your natural body shape and help you achieve the
            quality of life you deserve to enjoy! {"\n\n"}Each week holds a new
            topic, complete with coaching videos, audios, downloadable pdfs,
            activities, and worksheets so that you can put it all into practice
            and see the tangible results. {"\n\n"}You now have immediate access
            to the whole program. You can begin right away or take some time to
            prepare yourself and then journey through the program at your
            leisure. {"\n\n"}Join the support group to chat about your
            experiences and share your results for even more support through
            your program.
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              width: width - 40,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../resources/icon/tick.png")}
              style={{
                marginTop: 4,
                marginRight: 15,
              }}
            />

            <Text style={[styles.text, { width: width - 75, marginTop: 0 }]}>
              Feel the difference in your body, your mind, and your
              relationships as you complete the activities
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              width: width - 40,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../resources/icon/tick.png")}
              style={{
                marginTop: 4,
                marginRight: 15,
              }}
            />

            <Text style={[styles.text, { width: width - 75, marginTop: 0 }]}>
              Improve your digestion, get rid of brain fog, and make ‘getting
              things done’ much easier.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              width: width - 40,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../resources/icon/tick.png")}
              style={{
                marginTop: 4,
                marginRight: 15,
              }}
            />

            <Text style={[styles.text, { width: width - 75, marginTop: 0 }]}>
              Build a ‘set-and-forget’ environment for no-maintenance health
              support.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              width: width - 40,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../resources/icon/tick.png")}
              style={{
                marginTop: 4,
                marginRight: 15,
              }}
            />

            <Text style={[styles.text, { width: width - 75, marginTop: 0 }]}>
              Connect with the ‘real’ you as you explore the inner workings of
              your mind and body.
            </Text>
          </View>

          <View style={{ height: 40 }} />
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
            onPress={() => {
              Actions.virtualCoach2();
              this.setState({ isPaused: true });
            }}
          >
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Open Now</Text>
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
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 17,
    letterSpacing: -0.3,
    color: "rgb(16,16,16)",
    marginHorizontal: 20,
    marginTop: 24,
  },
  text: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 22,
    color: "rgb(54,58,61)",
    width: width - 40,
    marginTop: 24,
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
  videoContainer: {
    width: width - 40,
    height: 188,
    alignSelf: "center",
    borderRadius: 4,
    marginTop: 24,
    backgroundColor: "black",
  },
});

export default VirtualCoach1;

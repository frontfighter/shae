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
  Linking,
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Video from "react-native-video";
import Expand from "react-native-simple-expand";

import { URL_ADRESS } from "../constants";
import * as shaefitApi from "../API/shaefitAPI";

const { height, width } = Dimensions.get("window");

class VirtualCoach2 extends Component {
  constructor() {
    super();

    this.state = {
      videoUrl: "",
      isPaused: false,
      isCollapsed: true,
      isVideoLoaded: false,
    };
  }

  async componentDidMount() {
    const video = await shaefitApi.getVimeoUrls("322051343");
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
                  // style={[styles.videoContainer, { height: 80 * ratio }]}
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

          <View
            style={{
              marginTop: 24,
              flexDirection: "row",
              width: width - 40,
              alignSelf: "center",
            }}
          >
            <Text style={styles.title}>Weekly Schedule</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                right: 0,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ isPaused: true });
                  Linking.openURL(
                    "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingFULLSchedule.pdf"
                  );
                }}
              >
                <Image source={require("../resources/icon/downloadCopy.png")} />
              </TouchableWithoutFeedback>
              <Text
                onPress={() => {
                  this.setState({ isPaused: true });
                  Linking.openURL(
                    "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingFULLSchedule.pdf"
                  );
                }}
                style={styles.downloadText}
              >
                Download
              </Text>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({ isCollapsed: !this.state.isCollapsed })
                }
              >
                {this.state.isCollapsed ? (
                  <Image
                    source={require("../resources/icon/arrowLeft.png")}
                    style={{ transform: [{ rotate: "-90deg" }] }}
                  />
                ) : (
                  <Image
                    source={require("../resources/icon/arrowLeft.png")}
                    style={{ transform: [{ rotate: "90deg" }] }}
                  />
                )}
              </TouchableWithoutFeedback>
            </View>
          </View>

          <Expand value={!this.state.isCollapsed}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingFOODSchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                  marginTop: 15,
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachFood2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 1 - Food</Text>
                    <Text style={styles.listText}>
                      Simple, tailored eating for you
                    </Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingFITNESSSchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachFitness2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 2 - Fitness</Text>
                    <Text style={styles.listText}>
                      Make workout time play time!
                    </Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingLIFESTYLESchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachLifestyle2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 3 - Lifestyle</Text>
                    <Text style={styles.listText}>Fitting everything in</Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingMINDSchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachMind2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 4 - Mind</Text>
                    <Text style={styles.listText}>
                      Get to really know yourself
                    </Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingPLACESchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachPlace2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 5 - Place</Text>
                    <Text style={styles.listText}>Supportive surroundings</Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingSOCIALSchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachSocial2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 6 - Social</Text>
                    <Text style={styles.listText}>Super support networks</Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingHEALTHSchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachHealth2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 7 - Health</Text>
                    <Text style={styles.listText}>Optimizing each day</Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                Linking.openURL(
                  "https://d36wepwnq8c2ga.cloudfront.net/my-virtual-coach/pdf/ph360VirtualCoachingGENIUSSchedule.pdf"
                );
              }}
            >
              <View
                style={{
                  minHeight: 73,
                  flex: 1,
                  borderTopWidth: 0.5,
                  borderColor: "rgb(216,215,222)",
                }}
              >
                <View
                  style={{
                    width: width - 40,
                    height: 73,
                    alignSelf: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../resources/icon/coachGenius2.png")}
                    style={{
                      marginLeft: 2,
                      marginTop: 24,
                    }}
                  />

                  <View style={{ marginTop: 16, marginLeft: 23 }}>
                    <Text style={styles.listTitle}>Week 8 - Genius</Text>
                    <Text style={styles.listText}>Unleash your genius</Text>
                  </View>

                  <Image
                    source={require("../resources/icon/downloadA.png")}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 19,
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Expand>

          <View
            style={{
              width: width - 40,
              height: 0.5,
              alignSelf: "center",
              backgroundColor: "rgb(216,215,222)",
              marginTop: 15,
            }}
          />

          <View
            style={{
              width: width - 40,
              alignSelf: "center",
              marginTop: 24,
              flexDirection: "row",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=food`,
                      title: "Week 1 - Food",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                }}
              >
                <Image
                  source={require("../resources/icon/coachFood.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 1</Text>
                <Text style={styles.cardText}>FOOD</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=fitness`,
                      title: "Week 2 - Fitness",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                  marginLeft: 15,
                }}
              >
                <Image
                  source={require("../resources/icon/coachFitness.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 2</Text>
                <Text style={styles.cardText}>FITNESS</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              width: width - 40,
              alignSelf: "center",
              marginTop: 15,
              flexDirection: "row",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=lifestyle`,
                      title: "Week 3 - Lifestyle",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                }}
              >
                <Image
                  source={require("../resources/icon/coachLifestyle.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 3</Text>
                <Text style={styles.cardText}>LIFESTYLE</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=mind`,
                      title: "Week 4 - Mind",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                  marginLeft: 15,
                }}
              >
                <Image
                  source={require("../resources/icon/coachMind.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 4</Text>
                <Text style={styles.cardText}>Mind</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              width: width - 40,
              alignSelf: "center",
              marginTop: 15,
              flexDirection: "row",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=place`,
                      title: "Week 5 - Place",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                }}
              >
                <Image
                  source={require("../resources/icon/coachPlace.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 5</Text>
                <Text style={styles.cardText}>PLACE</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=social`,
                      title: "Week 6 - Social",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                  marginLeft: 15,
                }}
              >
                <Image
                  source={require("../resources/icon/coachSocial.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 6</Text>
                <Text style={styles.cardText}>SOCIAL</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              width: width - 40,
              alignSelf: "center",
              marginTop: 15,
              flexDirection: "row",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=health`,
                      title: "Week 7 - Health",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                }}
              >
                <Image
                  source={require("../resources/icon/coachHealth.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 7</Text>
                <Text style={styles.cardText}>HEALTH</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({ isPaused: true });
                setTimeout(
                  () =>
                    Actions.details({
                      key: "dashboard",
                      uri: `${URL_ADRESS}/mobile/virtualCoach?page=genius`,
                      title: "Week 8 - Genius",
                    }),
                  300
                );
              }}
            >
              <View
                style={{
                  width: (width - 55) / 2,
                  height: 120,
                  borderRadius: 4,
                  backgroundColor: "black",
                  marginLeft: 15,
                }}
              >
                <Image
                  source={require("../resources/icon/coachGenius.png")}
                  style={{
                    position: "absolute",
                    width: (width - 55) / 2,
                    height: 120,
                    borderRadius: 4,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.cardTitle}>WEEK 8</Text>
                <Text style={styles.cardText}>GENIUS</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              width: width - 40,
              height: 0.5,
              alignSelf: "center",
              backgroundColor: "rgb(216,215,222)",
              marginTop: this.state.isCollapsed ? 30 : 0,
            }}
          />

          <Text style={[styles.title, { marginHorizontal: 20, marginTop: 30 }]}>
            How to use This Coaching
          </Text>

          <Text style={styles.text}>
            This Virtual coaching is designed to be completed over a period of 8
            weeks. Each week has a new topic - a part of your ph360 app. You
            choose when you want to start your coaching - simply pick a date!{" "}
            {"\n\n"}As each week begins, Click on the corresponding week image
            above. This will take you to the resources for that weeks coaching
            where you can:
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
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
              Watch the coaching video
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
              Download the Activity sheet
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
              Follow along with the activity videos
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
              Complete the activities
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/*<KeyboardAvoidingView
          style={{
            justifyContent: "flex-end",
          }}
          behavior={Platform.OS === "ios" ? "position" : null}
          enabled={true}
          keyboardVerticalOffset={
            Platform.OS === "android" ? 0 : isIphoneX() ? -34 : 60
          }
        >
          <TouchableWithoutFeedback onPress={() => Actions.meetShae()}>
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
        </KeyboardAvoidingView> */}
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
  },
  downloadText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 14,
    color: "rgb(0,168,235)",
    marginLeft: 5,
    marginRight: 23,
  },
  text: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.36,
    lineHeight: 22,
    color: "rgb(54,58,61)",
    width: width - 40,
    marginTop: 15,
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
    height: 80,
    alignSelf: "center",
    borderRadius: 4,
    marginTop: 24,
    backgroundColor: "black",
  },
  cardTitle: {
    fontFamily: "Roboto-Bold",
    fontWeight: "700",
    fontSize: 14,
    color: "rgb(255,255,255)",
    marginTop: 34,
    alignSelf: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  cardText: {
    fontFamily: "Roboto-Bold",
    fontWeight: "700",
    fontSize: 30,
    color: "rgb(255,255,255)",
    alignSelf: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  listTitle: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 16,
    color: "rgb(38,42,47)",
  },
  listText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 13,
    color: "rgb(106,111,115)",
    marginTop: 2,
  },
});

export default VirtualCoach2;

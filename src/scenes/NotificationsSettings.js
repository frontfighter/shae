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

import FloatingLabelInput2 from "../components/FloatingLabelInput2";

const { height, width } = Dimensions.get("window");

class NotificationsSettings extends Component {
  constructor() {
    super();

    this.state = {
      notificationsNumber: "",
      notificationsNumberError: "",
      notificationsFrequency: "",
      notificationsFrequencyError: "",

      foodSuggestions: false,
      foodMeals: false,
      foodProduce: false,
      foodRewards: false,
      fitnessSuggestions: false,
      fitnessWorkout: false,
      mindDayTimes: false,
      mindRelaxation: false,
      updates: false,
    };
  }

  validateField = (name, value) => {
    try {
      this.setState({ [name]: value });

      let error = "";
      if (name === "notificationsNumber") {
        error = "Number of Notification is required";
      } else if (name === "notificationsFrequency") {
        error = "Frequency of Notification is required";
      }

      if (value === "") {
        this.setState({ [name + "Error"]: error });
      } else {
        this.setState({ [name + "Error"]: "" });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <ScrollView>
          <View>
            <TouchableWithoutFeedback
              onPress={() => Actions.pop()}
              hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            >
              <View
                style={{ marginLeft: 20, marginTop: isIphoneX() ? 55 : 35 }}
              >
                <Image
                  source={require("../resources/icon/close_icon.png")}
                  style={{ tintColor: "rgb(16,16,16)" }}
                />
              </View>
            </TouchableWithoutFeedback>

            <View style={{ width: width - 40, alignSelf: "center" }}>
              <Text style={styles.mainTitle}>Set My Notifications</Text>
              <Text style={styles.mainText}>
                Set up your preferred notifications now:
              </Text>

              <FloatingLabelInput2
                label="Number of Notification"
                value={this.state.notificationsNumber}
                onChangeText={(notificationsNumber) =>
                  this.validateField("notificationsNumber", notificationsNumber)
                }
                width={width - 40}
                marginTop={30}
                phoneInputType={false}
                error={this.state.notificationsNumberError}
                errorMarginHorizontal={0}
              />

              <FloatingLabelInput2
                label="Frequency of Notification"
                value={this.state.notificationsFrequency}
                onChangeText={(notificationsFrequency) =>
                  this.validateField(
                    "notificationsFrequency",
                    notificationsFrequency
                  )
                }
                width={width - 40}
                marginTop={20}
                phoneInputType={false}
                error={this.state.notificationsFrequencyError}
                errorMarginHorizontal={0}
              />

              <Text style={styles.topicsTitle}>Topics to be notified on:</Text>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    foodSuggestions: !this.state.foodSuggestions,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 20,
                      backgroundColor: this.state.foodSuggestions
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.foodSuggestions
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.foodSuggestions ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Food
                    <Text style={styles.cardText}>
                      {" "}
                      - Healthy options/suggestions
                    </Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    foodMeals: !this.state.foodMeals,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.foodMeals
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.foodMeals
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.foodMeals ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Food
                    <Text style={styles.cardText}> - Time of meals</Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    foodProduce: !this.state.foodProduce,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.foodProduce
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.foodProduce
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.foodProduce ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Food
                    <Text style={styles.cardText}> - Seasonal produce</Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    foodRewards: !this.state.foodRewards,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.foodRewards
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.foodRewards
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.foodRewards ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Food
                    <Text style={styles.cardText}> - Rewards</Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    fitnessSuggestions: !this.state.fitnessSuggestions,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.fitnessSuggestions
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.fitnessSuggestions
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.fitnessSuggestions ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Fitness
                    <Text style={styles.cardText}>
                      {" "}
                      - Healthy options/suggestions
                    </Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    fitnessWorkout: !this.state.fitnessWorkout,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.fitnessWorkout
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.fitnessWorkout
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.fitnessWorkout ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Fitness
                    <Text style={styles.cardText}> - Times to workout</Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    mindDayTimes: !this.state.mindDayTimes,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.mindDayTimes
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.mindDayTimes
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.mindDayTimes ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Mind
                    <Text style={styles.cardText}>
                      {" "}
                      - Times of day for best functions
                    </Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    mindRelaxation: !this.state.mindRelaxation,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      backgroundColor: this.state.mindRelaxation
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.mindRelaxation
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.mindRelaxation ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Mind
                    <Text style={styles.cardText}>
                      {" "}
                      - Relaxation and rejuvenation
                    </Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({
                    updates: !this.state.updates,
                  })
                }
              >
                <View
                  style={[
                    styles.card,
                    {
                      marginTop: 10,
                      marginBottom: 30,
                      backgroundColor: this.state.updates
                        ? "rgb(248,255,252)"
                        : "rgb(255,255,255)",
                      borderColor: this.state.updates
                        ? "rgba(0,187,116,0.5)"
                        : "rgb(221,224,228)",
                    },
                  ]}
                >
                  {this.state.updates ? (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: "rgb(0,187,116)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    >
                      <Image
                        source={require("../resources/icon/checkmarkCopy.png")}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: "rgb(194,203,210)",
                        marginLeft: 16,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <Text style={styles.cardTitle}>
                    Updates
                    <Text style={styles.cardText}> - time for next update</Text>
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
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
          <TouchableWithoutFeedback onPress={() => Actions.pop()}>
            <View>
              <View style={styles.loginButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.loginText}>Update</Text>
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
  mainTitle: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 20,
    letterSpacing: -0.47,
    color: "rgb(16,16,16)",
    marginTop: 33,
  },
  mainText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.2,
    lineHeight: 20,
    color: "rgb(54,58,61)",
    marginTop: 9,
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
  topicsTitle: {
    fontFamily: "SFProText-Semibold",
    fontWeight: "600",
    fontSize: 17,
    letterSpacing: -0.3,
    lineHeight: 22,
    color: "rgb(16,16,16)",
    marginTop: 30,
  },
  card: {
    width: width - 40,
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgb(221,224,228)",
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: -0.1,
    color: "rgb(16,16,16)",
  },
  cardText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    letterSpacing: -0.1,
    color: "rgb(16,16,16)",
  },
});

export default NotificationsSettings;

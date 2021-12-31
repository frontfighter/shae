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
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import * as Animatable from "react-native-animatable";
import { Actions } from "react-native-router-flux";

import { getUserVariables } from "../data/db/Db";
import * as api from "../API/shaefitAPI";
import LoadingIndicator from "../components/LoadingIndicator";
import FloatingLabelInput2 from "../components/FloatingLabelInput2";

const { height, width } = Dimensions.get("window");

class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      isLoading: false,
      emailError: "",
      isApiError: false,

      apiErrorPosition: new Animated.Value(-44),
    };
  }

  slide = () => {
    try {
      if (this.state.isApiError) {
        Animated.spring(this.state.apiErrorPosition, {
          toValue: 0,
        }).start();
      } else {
        Animated.spring(this.state.apiErrorPosition, {
          toValue: -44,
        }).start();
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  validateField = (name, value) => {
    try {
      this.setState({ [name]: value });

      const error =
        name === "email" ? "Email address is required" : "Password is required";

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

  validateFields = () => {
    try {
      if (this.state.email === "") {
        this.setState({ emailError: "Email address is required" });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handlePress = async () => {
    try {
      await this.validateFields();

      if (this.state.emailError === "") {
        this.setState({ isLoading: true });
        const data = await api.requestPasswordRecovery(this.state.email);
        console.log("data", data);

        if (data.success) {
          console.log("data", data);
          Actions.resetPasswordCompleted();
        } else {
          this.setState({ isApiError: true });
          this.slide();
        }

        this.setState({ isLoading: false });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    let { email, password } = this.state;

    const marginBottom = isIphoneX() ? 34 : 0;

    return (
      <View style={{ backgroundColor: "rgb(255,255,255)", flex: 1 }}>
        {Platform.OS === "ios" && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <Animated.View
          style={{
            backgroundColor: "rgb(252,245,245)",
            width,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            marginTop: this.state.apiErrorPosition,
          }}
        >
          <Text style={styles.errorText}>Invalid email</Text>
        </Animated.View>

        <Text style={styles.title}>
          Enter the email you used when creating your account
        </Text>

        <FloatingLabelInput2
          label={"Email Address"}
          value={this.state.email}
          onChangeText={(email) => this.validateField("email", email)}
          width={width - 40}
          marginTop={20}
          phoneInputType={false}
          type="emailAddress"
          keyboard="email-address"
          error={this.state.emailError}
          isApiError={this.state.isApiError}
        />

        <KeyboardAvoidingView
          style={{
            flex: 1,
            bottom: isIphoneX() ? 34 : 0,
            position: "absolute",
          }}
          behavior="padding"
          enabled={true}
          keyboardVerticalOffset={
            isIphoneX() ? 30 + 20 : Platform.OS === "ios" ? 15 + 20 : -200
          }
        >
          <TouchableWithoutFeedback onPress={this.handlePress}>
            <View style={[styles.loginButton, { marginTop: marginBottom }]}>
              {this.state.isLoading ? (
                <LoadingIndicator isLoading={true} />
              ) : (
                <Text style={styles.loginText}>Reset Password</Text>
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
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 15,
    lineHeight: 22,
    color: "rgb(106,111,115)",
    marginTop: 22,
    alignSelf: "center",
    width: width - 75,
    textAlign: "center",
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
  errorText: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 16,
    letterSpacing: -0.4,
    lineHeight: 22,
    color: "rgb(228,77,77)",
  },
});

export default ResetPassword;

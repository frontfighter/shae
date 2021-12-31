import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Slider from "react-native-slider-custom";

const { height, width } = Dimensions.get("window");

const SliderComponent = (props) => {
  return (
    <View style={{ marginTop: props.marginTop, marginBottom: 3 }}>
      <Slider
        minimumValue={props.minimumValue}
        maximumValue={props.maximumValue}
        step={props.step}
        trackStyle={{ width: width - 40, height: 16, borderRadius: 8 }}
        thumbStyle={{ bottom: 3, width: 28, height: 28, left: 0, elevation: 1 }}
        style={{ alignSelf: "center", height: 28 }}
        value={props.value}
        onValueChange={(value) => props.onValueChange(value)}
        customMinimumTrack={
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[props.color1, props.color2]}
            style={{
              width: "100%",
              height: 16,
              borderRadius: 8,
            }}
          />
        }
        customMaximumTrack={
          <View
            style={{
              width: "100%",
              height: 16,
              borderRadius: 8,
              backgroundColor: "rgb(223,228,238)",
            }}
          />
        }
        customThumb={
          <Image
            source={require("../resources/icon/select.png")}
            style={{ alignSelf: "center" }}
          />
        }
        animateTransitions={false}
        animationType="spring"
        animationConfig={{
          // duration: 150,
          // easing: Easing.inOut(Easing.ease),
          // delay: 0,
          friction: 7,
          tension: 100,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "SFProText-Regular",
    fontWeight: "400",
    fontSize: 12,
    color: "rgb(141,147,151)",
    position: "absolute",
  },
});

SliderComponent.defaultProps = {
  color1: "rgb(0,179,229)",
  color2: "rgb(0,178,136)",
};

export default SliderComponent;

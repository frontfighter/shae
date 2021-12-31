import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Triangle from "react-native-triangle";

const { height, width } = Dimensions.get("window");

const HraScrollItem = (props) => {
  return (
    <View style={{ opacity: props.itemActive === props.text ? 1 : 0.5 }}>
      <TouchableWithoutFeedback onPress={() => props.onPress(props.text)}>
        <View style={[styles.scrollItem, props.style]}>
          <Image source={props.image} style={styles.scrollIcon} />
          <Text numberOfLines={1} style={styles.scrollText}>
            {props.text}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {props.itemActive === props.text && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            // left:
            //   props.text === "Head"
            //     ? 37
            //     : props.text === "Measurement"
            //     ? -40
            //     : 0,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              marginLeft:
                props.text === "Head"
                  ? 37
                  : props.text === "Measurement"
                  ? -30
                  : 0,
            }}
          >
            <Triangle
              width={16}
              height={8}
              color={"rgb(255,255,255)"}
              direction={"up"}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollItem: {
    width: 88,
    height: 44,
  },
  scrollText: {
    fontFamily: "SFProText-Medium",
    fontWeight: "500",
    fontSize: 12,
    color: "rgb(255,255,255)",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
  },
  scrollIcon: {
    tintColor: "rgb(255,255,255)",
    alignSelf: "center",
    position: "absolute",
    top: 0,
  },
});

export default HraScrollItem;

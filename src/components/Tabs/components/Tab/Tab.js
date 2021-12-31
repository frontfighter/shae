// @flow

import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { TabText, TabBody, TabButton, Divider } from "./styles";
import type { StyleObj } from "../../lib/definitions";

type TabProps = {
  allowFontScaling: boolean,
  text: string,
  tabWidth?: number,
  tabHeight: number,
  stretch: boolean,
  activeTextColor: string,
  inActiveTextColor: string,
  active?: boolean,
  textStyle: StyleObj,
  uppercase: boolean,
  activeTextStyle?: StyleObj,
  onPress?: () => void,
};

const Tab = ({
  allowFontScaling,
  activeTextColor,
  active,
  onPress,
  text,
  inActiveTextColor,
  tabWidth,
  tabHeight,
  stretch,
  textStyle,
  uppercase,
  activeTextStyle,
}: TabProps) => {
  const color = active ? activeTextColor : inActiveTextColor;

  return (
    <View>
      <TabButton onPress={onPress} tabWidth={tabWidth} stretch={stretch}>
        <View style={{ flexDirection: "row" }}>
          <TabBody tabHeight={tabHeight}>
            <TabText
              color={color}
              style={StyleSheet.flatten([textStyle, activeTextStyle])}
              allowFontScaling={allowFontScaling}
              tabWidth={tabWidth}
            >
              {uppercase ? text.toUpperCase() : text}
            </TabText>
          </TabBody>
          {/* <Divider /> */}
        </View>
      </TabButton>
      {active && (
        <View
          style={{
            position: "absolute",
            bottom: -2,
            width: "100%",
            height: 2,
            backgroundColor: "rgb(0,168,235)",
          }}
        />
      )}
    </View>
  );
};

export default Tab;

/**
 * Created by developercomputer on 07.10.16.
 */
import { StyleSheet, Dimensions, Platform } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";

export const statusBarColor = "#44c5fb";
export const screenWidth = Dimensions.get("window").width;
export const screenHeight =
  Dimensions.get("window").height - (Platform.OS === "ios" ? 0 : 20);
export const navBarHeight =
  Platform.OS === "android" ? 60 : isIphoneX() ? 60 + 34 : 70;
// export const navBarHeight = Platform.OS === 'ios' ? 0 : 0;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export const NavBar = {
  backgroundColor: "#00a8eb", // '#44c5fb',
  borderBottomColor: "#00a8eb", // '#44c5fb',
  height: Platform.OS === "android" ? 60 : isIphoneX() ? 60 + 34 : 70,
  paddingTop: isIphoneX() ? 34 : 10,
};

export const NavBarLight = {
  backgroundColor: "rgb(250,252,255)", // '#44c5fb',
  borderBottomColor: "rgb(211,213,216)", // '#44c5fb',
  height: Platform.OS === "android" ? 54 : isIphoneX() ? 60 + 34 + 10 - 6 : 64,
  paddingTop: isIphoneX() ? 34 - 6 + 10 : -6,
};

export const NavTitle = {
  color: "#fff",
  fontSize: 17,
  fontFamily: "Roboto-Regular",
  width: 250,
};

export const NavTitleLight = {
  color: "rgb(38,42,47)",
  fontSize: 17,
  fontFamily: "SFProText-Semibold",
  fontWeight: "600",
  lineHeight: 22,
  letterSpacing: -0.41,
};

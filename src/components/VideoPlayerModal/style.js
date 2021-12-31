import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styleSheet = StyleSheet.create({
    modalOptions: {
        flex: 1,
        backgroundColor: "transparent",
    },
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    videoImg: {
        width: '100%',
        height: 400,
    },
    loadingStyle: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
});

export default styleSheet;
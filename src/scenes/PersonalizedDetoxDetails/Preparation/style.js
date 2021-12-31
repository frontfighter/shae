import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const { height, width } = Constants.ScreenSize;

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        marginLeft: 20,
        marginRight: 20
    },
    prepareTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    prepareDecTxt: {
        fontSize: 15,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
        marginTop: 20,
        marginBottom: 20
    },
    nameTxt: {
        fontSize: 15,
        marginBottom: 5,
        marginTop: 20,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    descTxt: {
        fontSize: 15,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    videoContainer: {
        width: width - 40,
        height: 180,
        borderRadius: 4,
        backgroundColor: "black",
    },
    videoImg: {
        width: width - 40,
        height: 180,
        borderRadius: 4,
    },
    playImg: {
        position: "absolute",
        top: (188 - 64) / 2 + 24,
        alignSelf: "center",
        height: 40,
        width: 40,
        tintColor: Colors.White
    },
    loadingStyle: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center' 
    },
    moreLoadingView: {
        marginTop: 20,
        marginBottom: 20,
    },
    loadMoreTxtView: {
        padding: 20,
        marginTop: 20,
        borderTopColor: Colors.Quartz,
        borderTopWidth: 1
    },
    loadMoreTxt: {
        textAlign: 'center'
    },
})

export default styleSheet;
import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        marginLeft: 20,
        marginRight: 20
    },
    dayScheduleTxt: {
        fontSize: 17,
        marginTop: 27,
        marginBottom: 10,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    dayScheduleDecTxt: {
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
    roundCircle: {
        zIndex: 1,
        position: "absolute",
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        left: 0
    },
    columnLineStyle: {
        borderRightWidth: 0,
        marginLeft: 24,
        borderColor: Colors.Quartz,
        flexDirection: "column",
        flex: 1,
    },
    daySubContainer: {
        marginLeft: 39
    },
    timeTxt: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 4,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    nameTxt: {
        fontSize: 15,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        color: Colors.Black,
    },
    descTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginRight: 12,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    videoContainer: {
        width: 180,
        height: 100,
        borderRadius: 4,
        marginTop: 20,
        backgroundColor: Colors.Black,
    },
    videoImg: {
        position: "absolute",
        top: 20,
        width: 180,
        height: 100,
        borderRadius: 4,
    },
    playImg: {
        position: "absolute",
        top: 50,
        left: 70,
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
        marginTop: 15,
        marginBottom: 15,
        marginBottom: 10 
    },
    loadMoreTxtView: {
        padding: 20,
        paddingBottom: 0,
        borderTopColor: Colors.Quartz,
        borderTopWidth: 1
    },
    loadMoreTxt: {
        textAlign: 'center'
    },
})

export default styleSheet;
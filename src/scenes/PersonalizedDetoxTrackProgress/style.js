import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const { width } = Constants.ScreenSize;

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        marginLeft: 20,
        marginRight: 20
    },
    trackProgressTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    trackProgressRenderView: {
        flexDirection: 'row',
    },
    trackProgressDesTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    renderImg: {
        height: 48,
        width: 48,
        marginRight: 15,
    },
    rightArrowStyle: {
        height: 14,
        width: 14, 
        marginTop: 19,
        marginLeft: 5
    },
    trackTitle: {
        fontSize: 15,
        color: Colors.Black,
        marginBottom: 6,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
        marginTop: 30,
        marginBottom: 30
    },
    checkboxStyle: {
        width: 20,
        height: 20,
    },
    uploadView: {
        borderRadius: 22,
        borderWidth: 1,
        borderColor: Colors.Primary,
        height: 40,
        width: 150,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row"
    },
    uploadImg: {
        width: 20,
        height: 20,
        tintColor: Colors.Primary
    },
    uploadTxt: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    measurementsView: {
        flexDirection: 'row',
        borderColor: Colors.LavenderGray,
        borderWidth: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 15,
        paddingRight: 15
    },
    measurementsTitleTxt: {
        fontSize: 15,
        color: Colors.Black,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    measurementsDesView: {
        flex: 1,
        marginLeft: 15
    },
    measurementsDesTxt: {
        fontSize: 15,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextRegular,
        letterSpacing: -0.36
    },
    tipsView: {
        backgroundColor: Colors.YellowOpacity(0.3),
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        marginTop: 5,
        paddingLeft: 9,
        paddingRight: 11
    },
    tipsTxt: {
        fontSize: 10,
        color: Colors.Galliano
    },
    photoModalView: {
        width: width,
        backgroundColor: "transparent",
        bottom: 60,
        position: 'absolute'
    },
    modalSubView: {
        backgroundColor: Colors.Fiord,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
    },
    photoMsg: {
        margin: 20,
        fontSize: 13,
        color: Colors.LinkWater,
        lineHeight: 18,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    modalSeparatorLine: {
        backgroundColor: Colors.Atomic,
        height:1
    },
    okTxt: {
        marginTop: 12,
        marginBottom: 14,
        fontSize: 15,
        color: Colors.White,
        textAlign: 'center'
    }
})

export default styleSheet;
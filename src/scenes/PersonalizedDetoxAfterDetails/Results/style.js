import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const { width } = Constants.ScreenSize;

const styleSheet = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollViewStyle: {
        marginLeft: 20,
        marginRight: 20
    },
    titleTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    descriptionTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    questionTitle: {
        fontSize: 15,
        color: Colors.Black,
        marginBottom: 20,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
        marginTop: 30,
        marginBottom: 30
    },
    marginBottom20: {
        marginBottom: 20
    },
    beforeAfterImg: {
        width: Math.floor((width - 45) / 2),
        height: 180,
        marginRight: 5
    },
    brforeView: {
        width: 72,
        height: 26,
        backgroundColor: Colors.Primary,
        borderTopRightRadius: 4,
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    beforeAfterTxt: {
        fontSize: 12,
        fontFamily: Constants.FontFamily.SFProTextBold,
        color: Colors.White
    },
    afterView: {
        width: 72,
        height: 26,
        backgroundColor: Colors.Jade,
        borderTopLeftRadius: 4,
        position: 'absolute',
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnCommonStyle: {
        borderWidth: 1,
        borderRadius: 22,
        backgroundColor: Colors.White,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 12,
        paddingBottom: 12
    },
    facebookBtnStyle: {
        borderColor: Colors.Mariner,
        marginBottom: 20
    },
    twitterBtnStyle: {
        borderColor: Colors.DodgerBlue,
        marginBottom: 20
    },
    instagramBtnStyle: {
        borderColor: Colors.Cerise,
    },
    TxtCommonStyle: {
        fontFamily: Constants.FontFamily.SFProTextMedium,
        fontSize: 14
    },
    facebookTxt: {
        color: Colors.Mariner
    },
    twitterTxt: {
        color: Colors.DodgerBlue
    },
    instagramTxt: {
        color: Colors.Cerise,
    },
    imgCommonStyle: {
        marginRight: 10,
        height: 14,
        width: 14
    },
    facebookIcon: {
        tintColor: Colors.Mariner
    },
    twitterIcon: {
        tintColor: Colors.DodgerBlue
    },
    instagramIcon: {
        tintColor: Colors.Cerise,
    },
})

export default styleSheet;
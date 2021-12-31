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
    congratulationsTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    congratulationsDesTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    nameTxt: {
        fontSize: 15,
        lineHeight: 20,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
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
    titleTxt: {
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
    descriptionTxt: {
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
})

export default styleSheet;
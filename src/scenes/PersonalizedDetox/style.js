import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const styleSheet = StyleSheet.create({
    container: {
        flex: 1
    },
    welcomeTxt: {
        fontSize: 20,
        textAlign: 'center',
        color: Colors.Black,
        marginLeft: 78,
        marginRight: 77,
        marginTop: 31,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    threeStepsTxt: {
        fontSize: 15,
        textAlign: 'center',
        color: Colors.Black,
        marginLeft: 63,
        marginRight: 62,
        marginTop: 10,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    fbGroupTxt: {
        fontSize: 15,
        color: Colors.Primary,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    ovalView: {
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 15,
        backgroundColor: Colors.PrimaryColorOpacity(0.15)
    },
    ovalText: {
        textAlign: 'center',
        fontSize: 20,
        color: Colors.Primary,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    mainStepsView: {
        flexDirection: 'row',
        margin: 20
    },
    detoxStepsTitle: {
        fontSize: 15,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    detoxDescriptionTxt: {
        fontSize: 15,
        lineHeight: 20,
        color: Colors.Montana,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
        marginLeft: 20,
        marginRight: 20
    }
})

export default styleSheet;
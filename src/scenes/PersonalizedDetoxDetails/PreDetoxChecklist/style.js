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
    checklistTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    checklistDecTxt: {
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
    checkboxStyle: {
        width: 20,
        height: 20,
    },
    nameTxt: {
        fontSize: 15,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        marginTop: -5,
    },
    descTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginTop: 10,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    preDetoxView: {
        marginLeft: 20,
        flex: 1 ,
    },
    wellTxt: {
        color: Colors.AppleGreen,
        fontSize: 15,
        lineHeight: 20,
        marginTop: 10,
        fontFamily: Constants.FontFamily.SFProTextRegular
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
        padding: 15,
        paddingBottom: 0,
        marginTop: 15,
        borderTopColor: Colors.Quartz,
        borderTopWidth: 1,
    },
    loadMoreTxt: {
        textAlign: 'center'
    },
})

export default styleSheet;
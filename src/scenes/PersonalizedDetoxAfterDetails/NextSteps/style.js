import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

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
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    descriptionTxt: {
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
    checkboxStyle: {
        width: 20,
        height: 20,
    },
    renderTitleTxt: {
        flex: 1,
        fontSize: 15,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        marginTop: -5,
        marginLeft: 15
    },
})

export default styleSheet;
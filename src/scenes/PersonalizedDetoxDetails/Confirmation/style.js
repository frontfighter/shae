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
    confirmationTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    confirmationDesTxt: {
        fontSize: 15,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    }
})

export default styleSheet;
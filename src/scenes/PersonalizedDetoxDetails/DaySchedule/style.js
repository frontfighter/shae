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
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 20,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    imageView: {
        height: 18,
        width: 20,
        marginRight: 10
    },
    subSectionView: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    normalTitleTxt: {
        fontSize: 15,
        flex: 1,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    normalTxt: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    detoxDayView: {
        backgroundColor: Colors.GreenOpacity(0.08),
        padding: 20,
        borderRadius: 4,
        marginBottom: 20
    },
    optimizeDayView: {
        backgroundColor: Colors.OrangeOpacity(0.08),
        padding: 20,
        borderRadius: 4,
        marginBottom: 20
    },
    dayRenderView: {
        borderRadius: 4,
        padding: 2,
        marginBottom: 15
    },
    dayTitleTxt: {
        fontSize: 13,
        textAlign: 'center',
        color: Colors.White,
        marginTop: 5,
        marginBottom: 4,
        fontFamily: Constants.FontFamily.SFProTextBold,
    },
    dayNameView: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: Colors.White,
        borderRadius: 2
    },
    dayNameTxt: {
        textAlign: 'center',
        fontSize: 17,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    loadingStyle: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center' 
    }
})

export default styleSheet;
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
    topTipsTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    imgContainer: {
        backgroundColor: Colors.GrayOpacity(0.2),
        padding: 20,
        marginBottom: 30
    },
    imgStyle: {
        height: 160,
        width: width - 80
    },
    doContainer: {
        backgroundColor: Colors.GreenOpacity(0.08),
        padding: 20,
        marginBottom: 30
    },
    dontContainer: {
        backgroundColor: Colors.RedOpacity(0.08),
        padding: 20,
        marginBottom: 30
    },
    topTipsRenderView: {
        backgroundColor: Colors.White,
        paddingTop: 14,
        paddingBottom: 14,
        paddingRight: 21,
        paddingLeft: 16,
        flexDirection: 'row',
        marginTop: 10,
        borderRadius: 4
    },
    checkboxStyle: {
        width: 18,
        height: 18,
        tintColor: Colors.AppleGreen
    },
    closeStyle: {
        width: 18,
        height: 18,
    },
    nameTxt: {
        color: Colors.Black,
        fontSize: 15,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    topTipsNameView: {
        marginLeft: 10,
        flex: 1
    },
    topTipsNameTxt: {
        fontSize: 15,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    loadingStyle: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center' 
    },
    moreLoadingView: {
        marginTop: 20,
        marginBottom: 5,
    },
    loadMoreTxtView: {
        paddingTop: 20,
        paddingBottom: 5,
        borderTopColor: Colors.Quartz,
        borderTopWidth: 1
    },
    loadMoreTxt: {
        textAlign: 'center'
    },
})

export default styleSheet;
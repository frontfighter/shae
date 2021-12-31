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
    detoxTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 20,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
        marginTop: 20,
        marginBottom: 20
    },
    imageView: {
        height: 40,
        width: 38,
        marginTop: 5
    },
    subSectionView: {
        marginLeft: 15,
        flex: 1
    },
    normalTitleTxt: {
        fontSize: 15,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    firstDetoxing: {
        flexDirection: 'row',
        marginTop: 8,
        // alignItems: 'center'
    },
    greenOval: {
        height: 12,
        width: 12,
        backgroundColor: Colors.AppleGreen,
        borderRadius: 6,
        marginRight: 10,
        marginTop: 5
    },
    orangeOval: {
        height: 12,
        width: 12,
        backgroundColor: Colors.Coral,
        borderRadius: 6,
        marginRight: 10,
        marginTop: 5
    },
    secondDetoxing: {
        flexDirection: 'row',
        marginTop: 3,
        // alignItems: 'center'
    },
    normalTxt: {
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
        marginBottom: 20,
    },
    loadMoreTxtView: {
        padding: 15,
        marginTop: 20,
        marginBottom: 5,
        borderTopColor: Colors.Quartz,
        borderTopWidth: 1
    },
    loadMoreTxt: {
        textAlign: 'center'
    },
})

export default styleSheet;
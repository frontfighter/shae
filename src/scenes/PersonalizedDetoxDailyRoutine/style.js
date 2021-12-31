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
    tabContainer: {
        backgroundColor: Colors.AliceBlue,
        height: 48,
        borderBottomColor: Colors.Quartz,
        borderBottomWidth: 1 
    },
    tabRenderView: {
        height: 48,
        marginRight: 20,        
    },
    tabSelectionView: {
        flexDirection: 'row',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.Primary,
    },
    tabName: {
        fontSize: 14,
        color: Colors.Black,
    },
    dailyRoutineContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 27,
        alignItems: 'center'
    },
    selectDayType: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 6,
        paddingBottom: 2,
        paddingLeft: 5,
        paddingTop: 3,
        borderRadius: 3
    },
    dayTypeTxt: {
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        fontSize: 11,
        color: Colors.White
    },
    dailyRoutineTxt: {
        fontSize: 17,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    dailyRoutineDesTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    roundCircle: {
        zIndex: 1,
        position: "absolute",
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        left: 0
    },
    columnLineStyle: {
        borderRightWidth: 0,
        marginLeft: 24,
        borderColor: Colors.Quartz,
        flexDirection: "column",
        flex: 1,
    },
    daySubContainer: {
        marginLeft: 39
    },
    timeTxt: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 4,
        fontFamily: Constants.FontFamily.SFProTextSemibold,
    },
    nameTxt: {
        fontSize: 15,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        color: Colors.Black,
    },
    descTxt: {
        fontSize: 15,
        lineHeight: 20,
        marginRight: 12,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    videoContainer: {
        width: 180,
        height: 110,
        borderRadius: 4,
        marginTop: 20,
        backgroundColor: Colors.Black,
    },
    playImg: {
        position: "absolute",
        top: 55,
        left: 70,
        height: 50,
        width: 50,
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
        marginTop: 30,
        marginBottom: 30
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
        borderTopColor: Colors.Quartz,
        borderTopWidth: 1
    },
    loadMoreTxt: {
        textAlign: 'center'
    },
})

export default styleSheet;
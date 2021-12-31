import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        marginLeft: 20,
        marginRight: 20,
    },
    mealPlannerTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 10,
        marginBottom: 5,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    mealPlannerDesTxt: {
        fontSize: 15,
        marginBottom: 5,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    separatorLineStyle: {
        backgroundColor: Colors.Quartz,
        height: 1,
    },
    selectDayType: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 6,
        paddingLeft: 5,
        borderRadius: 3,
        height: 18
    },
    dayTypeTxt: {
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        fontSize: 11,
        color: Colors.White
    },
    addSnackTxt: {
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 12,
        color: Colors.Primary,  
    },
    accordionView : {
        paddingBottom: 20,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    accordionTitle: {
        marginRight: 10,
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 17
    },
    accordionEndView: {
        flex: 1,
        flexDirection: 'row'
    },
    sanckView: {
        borderWidth: 1,
        borderColor: Colors.Primary,
        marginRight: 18,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        paddingLeft: 10,
        paddingRight: 10
    },
    upDownIcon: {
        height: 14,
        width: 14
    },
    mealSubRenderImg: {
        height: 80,
        width: 80,
        marginRight: 16
    },
    dinnerTypeTxt: {
        fontFamily: Constants.FontFamily.SFProTextMedium,
        fontSize: 13
    },
    mealTitleTxt: {
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextMedium,
        fontSize: 16,
        marginBottom: 4
    },
    cookView: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center'
    },
    timerIcon: {
        height: 11,
        width: 11,
        backgroundColor: 'red'
    },
    cookTitle: {
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 13,
        color: '#6a6f73',
        marginLeft: 9 
    },
    reviewView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    startIcon: {
        height: 10,
        width: 11,
        backgroundColor: 'red' 
    },
    reviewTxt: {
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 13,
        color: Colors.Apple,
        marginLeft: 9
    },
    marginBottom20: {
        marginBottom: 20
    }
})

export default styleSheet;
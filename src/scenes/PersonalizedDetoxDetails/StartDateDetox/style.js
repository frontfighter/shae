import { StyleSheet } from 'react-native';
import { Colors, Constants } from '@common';

const { width } = Constants.ScreenSize;

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewStyle: {
        marginLeft: 20,
        marginRight: 20
    },
    startDateTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    startDateDesTxt: {
        marginBottom: 30,
        fontSize: 15,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    renderDateView: {
        flexDirection: 'row',
        borderColor: Colors.LavenderGray,
        borderWidth: 1,
        padding: 20,
        borderRadius: 4
    },
    renderImgStyle: {
        height: 48,
        width: 48,
    },
    renderNameTxt: {
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 15,
        marginLeft: 15,
        flex: 1,
        lineHeight: 20
    },
    chooseDateTxt: {
        marginBottom: 20,
        marginTop: 30,
        fontSize: 17,
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    infoView: {
        backgroundColor: Colors.GreenOpacity(0.08),
        paddingLeft: 20,
        paddingTop: 17,
        paddingRight: 20,
        paddingBottom: 18,
        marginTop: 20,
        marginBottom: 32,
        flexDirection: 'row'
    },
    infoIcon: {
        height: 18,
        width: 18,
        marginRight: 12 
    },
    infoDesTxt: {
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 14,
        lineHeight: 20,
        flex: 1
    },
    noteTxt: {
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        color: Colors.Black,
        fontSize: 14
    },
    calendarView: {
        borderWidth: 1,
        borderColor: Colors.GrayOpacity(1),
        borderRadius: 4,
        paddingBottom: 20
    },
    calendarHeaderView: {
        backgroundColor: Colors.PrimaryColorOpacity(0.05),
        height: 110,
        marginBottom: -80
    },
    calendarRightIcon: {
        height: 14,
        width: 14,
        tintColor: Colors.Ghost,
        marginRight: 20
    },
    calendarLeftIcon: {
        height: 14,
        width: 14,
        tintColor: Colors.Ghost,
        marginLeft: 20
    },
    selectDateRangeView: {
        backgroundColor: Colors.PrimaryColorOpacity(0.2),
        color: Colors.Black
    },
    selectStartDate: {
        backgroundColor: Colors.PrimaryColorOpacity(0.6),
        color: Colors.Black,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100
    },
    selectEndDate: {
        backgroundColor: Colors.PrimaryColorOpacity(0.6),
        color: Colors.Black,
        borderTopRightRadius: 150,
        borderBottomRightRadius: 150,
    },
    dayLabelView:{
        borderTopWidth: 0,
        borderBottomWidth: 0,
        width: width - 42,
        fontSize: 13,
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        color: Colors.LightGray
    },
    monthLabelView: {
        fontSize: 16,
        fontFamily: Constants.FontFamily.SFProTextMedium,
        color: Colors.Black
    },
    calendarTextView: {
        color: Colors.Black,
        fontFamily: Constants.FontFamily.SFProTextRegular,
        fontSize: 15
    }
})

export default styleSheet;
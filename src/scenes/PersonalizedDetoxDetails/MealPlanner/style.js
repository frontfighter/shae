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
    mealPlannerTxt: {
        fontSize: 17,
        color: Colors.Black,
        marginTop: 27,
        marginBottom: 10,
        fontFamily: Constants.FontFamily.SFProTextSemibold
    },
    mealPlannerDesTxt: {
        fontSize: 15,
        marginBottom: 30,
        fontFamily: Constants.FontFamily.SFProTextRegular
    },
    mealRecipesView: {
        backgroundColor: Colors.PrimaryColorOpacity(0.08),
        paddingLeft: 20,
        paddingTop: 30,
        paddingRight: 20,
        paddingBottom: 30,
        marginBottom: 20
    },
    mealRecipes1View: {
        backgroundColor: Colors.PinkOpacity(0.08),
        paddingLeft: 20,
        paddingTop: 30,
        paddingRight: 20,
        paddingBottom: 30,
        marginBottom: 30
    },
    mealDishesIcon: {
        height: 80,
        width: 272,
        marginBottom: 20
    },
    mealTitle: {
        fontFamily: Constants.FontFamily.SFProTextSemibold,
        fontSize: 15,
        color: Colors.Black,
        marginBottom: 10
    },
    mealDesc: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Constants.FontFamily.SFProTextRegular,
        marginBottom: 20
    },
    mealContinueView: {
        width: 180,
        borderRadius: 22
    },
    mealContinue2View: {
        width: 180,
        borderRadius: 22,
        backgroundColor: Colors.Pink
    }
})

export default styleSheet;
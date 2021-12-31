import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { CommonStyles, Colors, Strings, Constants, Icons } from '@common';
import styles from './style';
import CustomButton from '../../../components/Button';
import MealPlanner1 from '../MealPlanner1';
/*
* MealPlanner screen design
*/

class MealPlanner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkDetox: false
        }
    }

    render() {
        const { onContinue } = this.props;
        const { checkDetox } = this.state;
        return (
            checkDetox 
            ? <MealPlanner1 onContinue={onContinue}/> 
            :
                <View style={styles.container}>
                    <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                        <Text style={styles.mealPlannerTxt}>Plan Your Detox</Text>
                        <Text style={styles.mealPlannerDesTxt}>Would you like to plan your Detox by choosing your recipes or would you like me to plan it for you?</Text>
                        <View style={styles.mealRecipesView}>
                            <Image source={Icons.MealDishesIcon} style={styles.mealDishesIcon} />
                            <Text style={styles.mealTitle}>Choose Your Recipes</Text>
                            <Text style={styles.mealDesc}>Placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</Text>
                            <CustomButton title="Continue" containerStyle={styles.mealContinueView} onPress={() => this.setState({ checkDetox: true })} />
                        </View>
                        <View style={styles.mealRecipes1View}>
                            <Image source={Icons.MealDishes1Icon} style={styles.mealDishesIcon} />
                            <Text style={styles.mealTitle}>Or Allow us to Plan for You </Text>
                            <Text style={styles.mealDesc}>From its medieval origins to the digital era, learn everything there is to know about the ubiquitous lorem ipsum passage.</Text>
                            <CustomButton title="Continue" containerStyle={styles.mealContinue2View} onPress={() => this.setState({ checkDetox: true })} />
                        </View>
                    </ScrollView>
                    <CustomButton title="Continue" onPress={() => onContinue()} />
                </View>
                
        )
    }
}

export default MealPlanner;
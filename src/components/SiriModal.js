import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  InteractionManager,
  Linking,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog, {ScaleAnimation, DialogContent} from 'react-native-popup-dialog';
import {
  getShortcuts,
  presentShortcut,
  suggestShortcuts,
} from 'react-native-siri-shortcut';
import WebView from 'react-native-webview';

const {height, width} = Dimensions.get('window');

const avoidNutsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-nuts-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the nuts to avoid action',
  keywords: ['nuts', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-nuts-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What nuts should I avoid?',
  needsSave: true,
};

const avoidVegetablesOpts = {
  activityType: 'com.anthrophi.shae.foodlist-vegetables-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the vegetables to avoid action',
  keywords: ['vegetables', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-vegetables-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What vegetables should I avoid?',
  needsSave: true,
};

const avoidFruitsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-fruits-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the fruits to avoid action',
  keywords: ['fruits', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-fruits-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What fruits should I avoid?',
  needsSave: true,
};

const avoidGrainsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-grains-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the grains to avoid action',
  keywords: ['grains', 'eavoidat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-grains-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What grains should I avoid?',
  needsSave: true,
};

const avoidMeatsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-meats-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the meats to avoid action',
  keywords: ['meats', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-meats-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What meats should I avoid?',
  needsSave: true,
};

const avoidSeafoodOpts = {
  activityType: 'com.anthrophi.shae.foodlist-seafood-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the seafood to avoid action',
  keywords: ['seafood', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-seafood-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What seafood should I avoid?',
  needsSave: true,
};

const avoidDrinksOpts = {
  activityType: 'com.anthrophi.shae.foodlist-drinks-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the drinks to avoid action',
  keywords: ['drinks', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-drinks-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What drinks should I avoid?',
  needsSave: true,
};

const avoidHerbsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-herbs-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the herbs to avoid action',
  keywords: ['herbs', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-herbs-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What herbs should I avoid?',
  needsSave: true,
};

const avoidDairyOpts = {
  activityType: 'com.anthrophi.shae.foodlist-dairy-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the dairy to avoid action',
  keywords: ['dairy', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-dairy-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What dairy should I avoid?',
  needsSave: true,
};

const avoidSweetsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-sweets-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the sweets to avoid action',
  keywords: ['sweets', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-sweets-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What sweets should I avoid?',
  needsSave: true,
};

const avoidFatsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-fats-to-avoid', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the fats to avoid action',
  keywords: ['fats', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-fats-to-avoid',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What fats should I avoid?',
  needsSave: true,
};

const eatNutsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-nuts-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the nuts to eat action',
  keywords: ['nuts', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-nuts-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What nuts can I eat?',
  needsSave: true,
};

const eatVegetablesOpts = {
  activityType: 'com.anthrophi.shae.foodlist-vegetables-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the vegetables to eat action',
  keywords: ['vegetables', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-vegetables-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What vegetables can I eat?',
  needsSave: true,
};

const eatFruitsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-fruits-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the fruits to eat action',
  keywords: ['fruits', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-fruits-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What fruits can I eat?',
  needsSave: true,
};

const eatGrainsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-grains-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the grains to eat action',
  keywords: ['grains', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-grains-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What grains can I eat?',
  needsSave: true,
};

const eatMeatsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-meats-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the meats to eat action',
  keywords: ['meats', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-meats-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What meats can I eat?',
  needsSave: true,
};

const eatSeafoodOpts = {
  activityType: 'com.anthrophi.shae.foodlist-seafood-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the seafood to eat action',
  keywords: ['seafood', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-seafood-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What seafood can I eat?',
  needsSave: true,
};

const eatDrinksOpts = {
  activityType: 'com.anthrophi.shae.foodlist-drinks-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the drinks to eat action',
  keywords: ['drinks', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-drinks-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What drinks can I drink?',
  needsSave: true,
};

const eatHerbsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-herbs-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the herbs to eat action',
  keywords: ['herbs', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-herbs-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What herbs can I eat?',
  needsSave: true,
};

const eatDairyOpts = {
  activityType: 'com.anthrophi.shae.foodlist-dairy-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the dairy to eat action',
  keywords: ['dairy', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-dairy-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What dairy can I eat?',
  needsSave: true,
};

const eatSweetsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-sweets-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the sweets to eat action',
  keywords: ['sweets', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-sweets-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What sweets can I eat?',
  needsSave: true,
};

const eatFatsOpts = {
  activityType: 'com.anthrophi.shae.foodlist-fats-to-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the fats to eat action',
  keywords: ['fats', 'eat'],
  persistentIdentifier: 'com.anthrophi.shae.foodlist-fats-to-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What fats can I eat?',
  needsSave: true,
};

// Food Timing
const breakfastEatOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-breakfast-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the eat breakfast action',
  keywords: ['eat', 'breakfast'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-breakfast-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I eat breakfast?',
  needsSave: true,
};

const lunchEatOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-lunch-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the eat lunch action',
  keywords: ['eat', 'lunch'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-lunch-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I eat lunch?',
  needsSave: true,
};

const dinnerEatOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-dinner-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the eat dinner action',
  keywords: ['eat', 'dinner'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-dinner-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I eat dinner?',
  needsSave: true,
};

const snackEatOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-snack-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the snack action',
  keywords: ['eat', 'snack'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-snack-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I snack?',
  needsSave: true,
};

const drinkEatOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-drink-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the have a drink action',
  keywords: ['eat', 'drink'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-drink-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I have a drink?',
  needsSave: true,
};

const avoidEatOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-avoid-eat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the avoid eating action',
  keywords: ['eat', 'avoid'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-avoid-eat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I avoid eating?',
  needsSave: true,
};

const avoidSnackOpts = {
  activityType: 'com.anthrophi.shae.foodtiming-avoid-snack', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the avoid snacking action',
  keywords: ['avoid', 'snack'],
  persistentIdentifier: 'com.anthrophi.shae.foodtiming-avoid-snack',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What time should I avoid snacking?',
  needsSave: true,
};

// Meal Plan
const mealPlannerTodayOpts = {
  activityType: 'com.anthrophi.shae.mealplanner-today', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the today meal plan action',
  keywords: ['meal', 'plan', 'today'],
  persistentIdentifier: 'com.anthrophi.shae.mealplanner-today',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What should I eat today?',
  needsSave: true,
};

const mealPlannerTomorrowOpts = {
  activityType: 'com.anthrophi.shae.mealplanner-tomorrow', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the tomorrow meal plan action',
  keywords: ['meal', 'plan', 'tomorrow'],
  persistentIdentifier: 'com.anthrophi.shae.mealplanner-tomorrow',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What should I eat tomorrow?',
  needsSave: true,
};

const mealPlannerThisWeekOpts = {
  activityType: 'com.anthrophi.shae.mealplanner-this-week', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for this week meal plan action',
  keywords: ['meal', 'plan', 'this', 'week'],
  persistentIdentifier: 'com.anthrophi.shae.mealplanner-this-week',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What should I eat this week?',
  needsSave: true,
};

const mealPlannerNextWeekOpts = {
  activityType: 'com.anthrophi.shae.mealplanner-next-week', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for the next week meal plan action',
  keywords: ['meal', 'plan', 'next', 'week'],
  persistentIdentifier: 'com.anthrophi.shae.mealplanner-next-week',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What should I eat next week?',
  needsSave: true,
};

// Recipes
const recipesMainDishesOpts = {
  activityType: 'com.anthrophi.shae.recipes-main-dishes', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for main dishes action',
  keywords: ['recipes', 'main', 'dishes'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-main-dishes',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for main dishes',
  needsSave: true,
};

const recipesDessertsOpts = {
  activityType: 'com.anthrophi.shae.recipes-desserts', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for desserts action',
  keywords: ['recipes', 'desserts'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-desserts',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for desserts',
  needsSave: true,
};

const recipesSideDishesOpts = {
  activityType: 'com.anthrophi.shae.recipes-side-dishes', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for side dishes action',
  keywords: ['recipes', 'side', 'dishes'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-side-dishes',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for side dishes',
  needsSave: true,
};

const recipesAppetizersOpts = {
  activityType: 'com.anthrophi.shae.recipes-appetizers', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for appetizers action',
  keywords: ['recipes', 'appetizers'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-appetizers',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for appetizers',
  needsSave: true,
};

const recipesSaladsOpts = {
  activityType: 'com.anthrophi.shae.recipes-salads', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for salads action',
  keywords: ['recipes', 'salads'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-salads',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for salads',
  needsSave: true,
};

const recipesBreadsOpts = {
  activityType: 'com.anthrophi.shae.recipes-breads', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for breads action',
  keywords: ['recipes', 'breads'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-breads',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for breads',
  needsSave: true,
};

const recipesSoupsOpts = {
  activityType: 'com.anthrophi.shae.recipes-soups', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for soups action',
  keywords: ['recipes', 'soups'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-soups',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for soups',
  needsSave: true,
};

const recipesBeveragesOpts = {
  activityType: 'com.anthrophi.shae.recipes-beverages', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for beverages action',
  keywords: ['recipes', 'beverages'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-beverages',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for beverages',
  needsSave: true,
};

const recipesCocktailsOpts = {
  activityType: 'com.anthrophi.shae.recipes-cocktails', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for cocktails action',
  keywords: ['recipes', 'cocktails'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-cocktails',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for cocktails',
  needsSave: true,
};

const recipesSnacksOpts = {
  activityType: 'com.anthrophi.shae.recipes-snacks', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for snacks action',
  keywords: ['recipes', 'snacks'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-snacks',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for snacks',
  needsSave: true,
};

const recipesBreakfastOpts = {
  activityType: 'com.anthrophi.shae.recipes-breakfast', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for breakfast action',
  keywords: ['recipes', 'breakfast'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-breakfast',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for breakfast',
  needsSave: true,
};

const recipesLunchOpts = {
  activityType: 'com.anthrophi.shae.recipes-lunch', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for lunch action',
  keywords: ['recipes', 'lunch'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-lunch',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for lunch',
  needsSave: true,
};

const recipesDinnerOpts = {
  activityType: 'com.anthrophi.shae.recipes-dinner', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for dinner action',
  keywords: ['recipes', 'dinner'],
  persistentIdentifier: 'com.anthrophi.shae.recipes-dinner',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Show me some recipe ideas for dinner',
  needsSave: true,
};

// Shopping basket
const shoppingBasketOpts = {
  activityType: 'com.anthrophi.shae.shopping-basket', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for shopping basket action',
  keywords: ['shopping', 'basket', 'buy'],
  persistentIdentifier: 'com.anthrophi.shae.shopping-basket',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What groceries should I buy?',
  needsSave: true,
};

// Food Preparation
const foodPrepOpts = {
  activityType: 'com.anthrophi.shae.food-preparation', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for food preparation action',
  keywords: ['food', 'preparation'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How should I prepare my food?',
  needsSave: true,
};

const foodPrepFermentedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-fermented-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of fermented foods action',
  keywords: ['food', 'preparation', 'fermented', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-fermented-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are fermented foods good for me?',
  needsSave: true,
};

const foodPrepSteamedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-steamed-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of steamed foods action',
  keywords: ['food', 'preparation', 'steamed', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-steamed-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are steamed foods good for me?',
  needsSave: true,
};

const foodPrepRawFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-raw-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of raw foods action',
  keywords: ['food', 'preparation', 'raw', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-raw-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are raw foods good for me?',
  needsSave: true,
};

const foodPrepJuicedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-juiced-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of juiced foods action',
  keywords: ['food', 'preparation', 'juiced', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-juiced-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are juiced foods good for me?',
  needsSave: true,
};

const foodPrepBakedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-baked-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of baked foods action',
  keywords: ['food', 'preparation', 'baked', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-baked-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are baked foods good for me?',
  needsSave: true,
};

const foodPrepBoiledFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-boiled-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of boiled foods action',
  keywords: ['food', 'preparation', 'boiled', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-boiled-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are boiled foods good for me?',
  needsSave: true,
};

const foodPrepStirFriedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-stir-fried-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of stir fried foods action',
  keywords: ['food', 'preparation', 'stir', 'fried', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-stir-fried-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are stir fried foods good for me?',
  needsSave: true,
};

const foodPrepSproutedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-sprouted-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of sprouted foods action',
  keywords: ['food', 'preparation', 'sprouted', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-sprouted-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are sprouted foods good for me?',
  needsSave: true,
};

const foodPrepRoastedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-roasted-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of roasted foods action',
  keywords: ['food', 'preparation', 'roasted', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-roasted-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are roasted foods good for me?',
  needsSave: true,
};

const foodPrepSoakedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-soaked-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of soaked foods action',
  keywords: ['food', 'preparation', 'soaked', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-soaked-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are soaked foods good for me?',
  needsSave: true,
};

const foodPrepSaltOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-salt', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of preserved foods (salt) action',
  keywords: ['food', 'preparation', 'preserved', 'foods', 'salt'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-salt',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are preserved foods (salt) good for me?',
  needsSave: true,
};

const foodPrepVinegarOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-vinegar', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title:
    'Create a shortcut for preparation of preserved foods (vinegar) action',
  keywords: ['food', 'preparation', 'preserved', 'foods', 'vinegar'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-vinegar',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are preserved foods (vinegar) good for me?',
  needsSave: true,
};

const foodPrepOilOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-oil', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of preserved foods (oil) action',
  keywords: ['food', 'preparation', 'preserved', 'foods', 'oil'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-oil',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are preserved foods (oil) good for me?',
  needsSave: true,
};

const foodPrepColdDrinksOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-cold-drinks', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of cold drinks action',
  keywords: ['food', 'preparation', 'cold', 'drinks'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-cold-drinks',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are cold drinks good for me?',
  needsSave: true,
};

const foodPrepColdFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-cold-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of cold foods action',
  keywords: ['food', 'preparation', 'cold', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-cold-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are cold foods good for me?',
  needsSave: true,
};

const foodPrepFrozenFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-frozen-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of frozen foods action',
  keywords: ['food', 'preparation', 'frozen', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-frozen-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are frozen foods good for me?',
  needsSave: true,
};

const foodPrepDehydratedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-dehydrated-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of dehydrated foods action',
  keywords: ['food', 'preparation', 'dehydrated', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-dehydrated-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are dehydrated foods good for me?',
  needsSave: true,
};

const foodPrepBroiledFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-broiled-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of broiled foods action',
  keywords: ['food', 'preparation', 'broiled', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-broiled-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are broiled foods good for me?',
  needsSave: true,
};

const foodPrepSmokedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-smoked-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of smoked foods action',
  keywords: ['food', 'preparation', 'smoked', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-smoked-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are smoked foods good for me?',
  needsSave: true,
};

const foodPrepCannedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-canned-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of canned foods action',
  keywords: ['food', 'preparation', 'canned', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-canned-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are canned foods good for me?',
  needsSave: true,
};

const foodPrepProcessedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-processed-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of processed foods action',
  keywords: ['food', 'preparation', 'processed', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-processed-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are processed foods good for me?',
  needsSave: true,
};

const foodPrepDeepFriedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-deep-fried-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of deep fried foods action',
  keywords: ['food', 'preparation', 'deep', 'fried', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-deep-fried-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are deep fried foods good for me?',
  needsSave: true,
};

const foodPrepBreadedFoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-breaded-foods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of breaded foods action',
  keywords: ['food', 'preparation', 'breaded', 'foods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-breaded-foods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are breaded foods good for me?',
  needsSave: true,
};

const foodPrepBakedGoodsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-baked-goods', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of baked goods action',
  keywords: ['food', 'preparation', 'baked', 'goods'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-baked-goods',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are baked goods good for me?',
  needsSave: true,
};

const foodPrepSmoothiesOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-smoothies', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of smoothies action',
  keywords: ['food', 'preparation', 'smoothies'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-smoothies',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are smoothies good for me?',
  needsSave: true,
};

const foodPrepBrothsOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-broths', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of broths action',
  keywords: ['food', 'preparation', 'broths'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-broths',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are broths good for me?',
  needsSave: true,
};

const foodPrepPreservativesOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-preservatives', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of preservatives action',
  keywords: ['food', 'preparation', 'preservatives'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-preservatives',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Are preservatives good for me?',
  needsSave: true,
};

const foodPrepGlutenOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-gluten', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of gluten action',
  keywords: ['food', 'preparation', 'gluten'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-gluten',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Is gluten good for me?',
  needsSave: true,
};

const foodPrepMsgOpts = {
  activityType: 'com.anthrophi.shae.food-preparation-msg', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for preparation of MSG action',
  keywords: ['food', 'preparation', 'msg'],
  persistentIdentifier: 'com.anthrophi.shae.food-preparation-msg',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'Is MSG good for me?',
  needsSave: true,
};

// Food Guide

const foodGuideOpts = {
  activityType: 'com.anthrophi.shae.food-guide', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for food guide action',
  keywords: ['food', 'guide'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What types of food are good for me?',
  needsSave: true,
};

const foodGuideCombiningOpts = {
  activityType: 'com.anthrophi.shae.food-guide-food-combining', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for food combining action',
  keywords: ['food', 'guide', 'combining'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-food-combining',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What types of food can I combine?',
  needsSave: true,
};

const foodGuideCaloriesOpts = {
  activityType: 'com.anthrophi.shae.food-guide-calories', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for Calories & Portions action',
  keywords: ['food', 'guide', 'calories'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-calories',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How many Calories should I be eating?',
  needsSave: true,
};

const foodGuideEatingHabitsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-eating-habits', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for eating habits action',
  keywords: ['food', 'guide', 'habits'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-eating-habits',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'What are some good eating habits for me?',
  needsSave: true,
};

const foodGuideVegetablesOpts = {
  activityType: 'com.anthrophi.shae.food-guide-vegetables', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for vegetables action',
  keywords: ['food', 'guide', 'vegetables'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-vegetables',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat vegetables?',
  needsSave: true,
};

const foodGuideGreenLeafyVegetablesOpts = {
  activityType: 'com.anthrophi.shae.food-guide-green-leafy-vegetables', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for green leafy vegetables action',
  keywords: ['food', 'guide', 'vegetables', 'green', 'leafy'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-green-leafy-vegetables',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat green leafy vegetables?',
  needsSave: true,
};

const foodGuideRootVegetablesOpts = {
  activityType: 'com.anthrophi.shae.food-guide-root-vegetables', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for root vegetables action',
  keywords: ['food', 'guide', 'vegetables', 'root'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-root-vegetables',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat root vegetables?',
  needsSave: true,
};

const foodGuideBeansOpts = {
  activityType: 'com.anthrophi.shae.food-guide-beans', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for beans action',
  keywords: ['food', 'guide', 'beans'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-beans',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat beans?',
  needsSave: true,
};

const foodGuideFruitsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-fruit', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for fruits action',
  keywords: ['food', 'guide', 'fruit'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-fruit',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat fruits?',
  needsSave: true,
};

const foodGuideDriedFruitsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-dried-fruit', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for dried fruits action',
  keywords: ['food', 'guide', 'fruit', 'dried'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-dried-fruit',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat dried fruits?',
  needsSave: true,
};

const foodGuideAnimalProteinsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-animal-proteins', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for animal proteins action',
  keywords: ['food', 'guide', 'animal', 'proteins'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-animal-proteins',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat animal proteins?',
  needsSave: true,
};

const foodGuideEggsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-eggs', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for eggs action',
  keywords: ['food', 'guide', 'eggs'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-eggs',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat eggs?',
  needsSave: true,
};

const foodGuideWhiteMeatOpts = {
  activityType: 'com.anthrophi.shae.food-guide-white-meat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for white meat action',
  keywords: ['food', 'guide', 'white', 'meat'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-white-meat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat white meat?',
  needsSave: true,
};

const foodGuideRedMeatOpts = {
  activityType: 'com.anthrophi.shae.food-guide-red-meat', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for red meat action',
  keywords: ['food', 'guide', 'red', 'meat'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-red-meat',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat red meat?',
  needsSave: true,
};

const foodGuideWhiteFishOpts = {
  activityType: 'com.anthrophi.shae.food-guide-white-fish', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for white fish action',
  keywords: ['food', 'guide', 'white', 'fish'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-white-fish',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat white fish?',
  needsSave: true,
};

const foodGuideOilyFishOpts = {
  activityType: 'com.anthrophi.shae.food-guide-oily-fish', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for oily fish action',
  keywords: ['food', 'guide', 'oily', 'fish'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-oily-fish',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat oily fish?',
  needsSave: true,
};

const foodGuideShellfishOpts = {
  activityType: 'com.anthrophi.shae.food-guide-shellfish', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for shellfish action',
  keywords: ['food', 'guide', 'shellfish'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-shellfish',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat shellfish?',
  needsSave: true,
};

const foodGuideSeedsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-seeds', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for seeds action',
  keywords: ['food', 'guide', 'seeds'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-seeds',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat seeds?',
  needsSave: true,
};

const foodGuideNutsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-nuts', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for nuts action',
  keywords: ['food', 'guide', 'nuts'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-nuts',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat nuts?',
  needsSave: true,
};

const foodGuideNutButtersOpts = {
  activityType: 'com.anthrophi.shae.food-guide-nut-butters', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for nut butters action',
  keywords: ['food', 'guide', 'nut', 'butters'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-nut-butters',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat nut butters?',
  needsSave: true,
};

const foodGuideSaltOpts = {
  activityType: 'com.anthrophi.shae.food-guide-salt', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for salt action',
  keywords: ['food', 'guide', 'salt'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-salt',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat salt?',
  needsSave: true,
};

const foodGuideOilsOpts = {
  activityType: 'com.anthrophi.shae.food-guide-oils', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for oils action',
  keywords: ['food', 'guide', 'oils'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-oils',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat oils?',
  needsSave: true,
};

const foodGuideSweetenersOpts = {
  activityType: 'com.anthrophi.shae.food-guide-sweeteners', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for sweeteners action',
  keywords: ['food', 'guide', 'sweeteners'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-sweeteners',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat sweeteners?',
  needsSave: true,
};

const foodGuideTeasOpts = {
  activityType: 'com.anthrophi.shae.food-guide-teas', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for teas action',
  keywords: ['food', 'guide', 'teas'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-teas',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat teas?',
  needsSave: true,
};

const foodGuideJuicesOpts = {
  activityType: 'com.anthrophi.shae.food-guide-juices', // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: 'Create a shortcut for juices action',
  keywords: ['food', 'guide', 'juices'],
  persistentIdentifier: 'com.anthrophi.shae.food-guide-juices',
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: 'How often should I eat juices?',
  needsSave: true,
};

export default class SiriModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isViewAllPressed: false,
      shortcuts: [],
      foodListShortcutsCount: 0,
      foodChronoCount: 0,
      recipesCount: 0,
      mealPlannerCount: 0,
      shoppingCount: 0,
      foodPreparationCount: 0,
      foodGuideCount: 0,
    };

    this.shortcuts = [];
  }

  async componentDidMount() {
    await this.getShortcuts();
  }

  getShortcuts = async () => {
    const shortcuts = await getShortcuts();

    let foodListShortcutsCount = 0;
    let foodChronoCount = 0;
    let recipesCount = 0;
    let mealPlannerCount = 0;
    let shoppingCount = 0;
    let foodPreparationCount = 0;
    let foodGuideCount = 0;

    this.shortcuts = [];
    for (let i = 0; i < shortcuts.length; i++) {
      this.shortcuts.push(shortcuts[i].options.activityType);

      if (
        shortcuts[i].options.activityType.includes(
          'com.anthrophi.shae.foodlist',
        )
      ) {
        foodListShortcutsCount += 1;
      }

      if (
        shortcuts[i].options.activityType.includes(
          'com.anthrophi.shae.foodtiming',
        )
      ) {
        foodChronoCount += 1;
      }

      if (
        shortcuts[i].options.activityType.includes('com.anthrophi.shae.recipes')
      ) {
        recipesCount += 1;
      }

      if (
        shortcuts[i].options.activityType.includes(
          'com.anthrophi.shae.mealplanner',
        )
      ) {
        mealPlannerCount += 1;
      }

      if (
        shortcuts[i].options.activityType.includes(
          'com.anthrophi.shae.shopping',
        )
      ) {
        shoppingCount += 1;
      }

      if (
        shortcuts[i].options.activityType.includes(
          'com.anthrophi.shae.food-preparation',
        )
      ) {
        foodPreparationCount += 1;
      }

      if (
        shortcuts[i].options.activityType.includes(
          'com.anthrophi.shae.food-guide',
        )
      ) {
        foodGuideCount += 1;
      }
    }

    this.setState(
      {
        shortcuts: this.shortcuts,
        foodListShortcutsCount,
        foodChronoCount,
        recipesCount,
        mealPlannerCount,
        shoppingCount,
        foodPreparationCount,
        foodGuideCount,
      },
      () => {
        console.log('this.state.shortcuts.length', this.state.shortcuts.length);
      },
    );
    console.log('shortcuts', shortcuts);
  };

  onSiriButtonPress = async (activityType) => {
    try {
      let opts;
      if (activityType === 'com.anthrophi.shae.foodlist-nuts-to-eat') {
        opts = eatNutsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-vegetables-to-eat'
      ) {
        opts = eatVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fruits-to-eat') {
        opts = eatFruitsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-grains-to-eat') {
        opts = eatGrainsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-meats-to-eat') {
        opts = eatMeatsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-seafood-to-eat'
      ) {
        opts = eatSeafoodOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-herbs-to-eat') {
        opts = eatHerbsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-dairy-to-eat') {
        opts = eatDairyOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-sweets-to-eat') {
        opts = eatSweetsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fats-to-eat') {
        opts = eatFatsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-drinks-to-eat') {
        opts = eatDrinksOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-nuts-to-avoid') {
        opts = avoidNutsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-vegetables-to-avoid'
      ) {
        opts = avoidVegetablesOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-fruits-to-avoid'
      ) {
        opts = avoidFruitsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-grains-to-avoid'
      ) {
        opts = avoidGrainsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-meats-to-avoid'
      ) {
        opts = avoidMeatsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-seafood-to-avoid'
      ) {
        opts = avoidSeafoodOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-herbs-to-avoid'
      ) {
        opts = avoidHerbsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-dairy-to-avoid'
      ) {
        opts = avoidDairyOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-sweets-to-avoid'
      ) {
        opts = avoidSweetsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fats-to-avoid') {
        opts = avoidFatsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodlist-drinks-to-avoid'
      ) {
        opts = avoidDrinksOpts;
      } else if (
        activityType === 'com.anthrophi.shae.foodtiming-breakfast-eat'
      ) {
        opts = breakfastEatOpts;
      } else if (activityType === 'com.anthrophi.shae.foodtiming-lunch-eat') {
        opts = lunchEatOpts;
      } else if (activityType === 'com.anthrophi.shae.foodtiming-dinner-eat') {
        opts = dinnerEatOpts;
      } else if (activityType === 'com.anthrophi.shae.foodtiming-snack-eat') {
        opts = snackEatOpts;
      } else if (activityType === 'com.anthrophi.shae.foodtiming-drink-eat') {
        opts = drinkEatOpts;
      } else if (activityType === 'com.anthrophi.shae.foodtiming-avoid-eat') {
        opts = avoidEatOpts;
      } else if (activityType === 'com.anthrophi.shae.foodtiming-avoid-snack') {
        opts = avoidSnackOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-today') {
        opts = mealPlannerTodayOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-tomorrow') {
        opts = mealPlannerTomorrowOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-this-week') {
        opts = mealPlannerThisWeekOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-next-week') {
        opts = mealPlannerNextWeekOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-main-dishes') {
        opts = recipesMainDishesOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-desserts') {
        opts = recipesDessertsOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-side-dishes') {
        opts = recipesSideDishesOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-appetizers') {
        opts = recipesAppetizersOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-salads') {
        opts = recipesSaladsOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-breads') {
        opts = recipesBreadsOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-soups') {
        opts = recipesSoupsOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-beverages') {
        opts = recipesBeveragesOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-cocktails') {
        opts = recipesCocktailsOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-snacks') {
        opts = recipesSnacksOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-lunch') {
        opts = recipesLunchOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-dinner') {
        opts = recipesDinnerOpts;
      } else if (activityType === 'com.anthrophi.shae.recipes-breakfast') {
        opts = recipesBreakfastOpts;
      } else if (activityType === 'com.anthrophi.shae.shopping-basket') {
        opts = shoppingBasketOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation') {
        opts = foodPrepOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-fermented-foods'
      ) {
        opts = foodPrepFermentedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-steamed-foods'
      ) {
        opts = foodPrepSteamedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-raw-foods'
      ) {
        opts = foodPrepRawFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-juiced-foods'
      ) {
        opts = foodPrepJuicedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-baked-foods'
      ) {
        opts = foodPrepBakedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-boiled-foods'
      ) {
        opts = foodPrepBoiledFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-stir-fried-foods'
      ) {
        opts = foodPrepStirFriedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-sprouted-foods'
      ) {
        opts = foodPrepSproutedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-roasted-foods'
      ) {
        opts = foodPrepRoastedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-soaked-foods'
      ) {
        opts = foodPrepSoakedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-salt') {
        opts = foodPrepSaltOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-vinegar'
      ) {
        opts = foodPrepVinegarOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-oil') {
        opts = foodPrepOilOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-cold-drinks'
      ) {
        opts = foodPrepColdDrinksOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-cold-foods'
      ) {
        opts = foodPrepColdFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-frozen-foods'
      ) {
        opts = foodPrepFrozenFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-dehydrated-foods'
      ) {
        opts = foodPrepDehydratedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-broiled-foods'
      ) {
        opts = foodPrepBroiledFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-smoked-foods'
      ) {
        opts = foodPrepSmokedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-canned-foods'
      ) {
        opts = foodPrepCannedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-processed-foods'
      ) {
        opts = foodPrepProcessedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-deep-fried-foods'
      ) {
        opts = foodPrepDeepFriedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-breaded-foods'
      ) {
        opts = foodPrepBreadedFoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-baked-goods'
      ) {
        opts = foodPrepBakedGoodsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-smoothies'
      ) {
        opts = foodPrepSmoothiesOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-broths'
      ) {
        opts = foodPrepBrothsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-preservatives'
      ) {
        opts = foodPrepPreservativesOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-preparation-gluten'
      ) {
        opts = foodPrepGlutenOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-msg') {
        opts = foodPrepMsgOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide') {
        opts = foodGuideOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-guide-food-combining'
      ) {
        opts = foodGuideCombiningOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-calories') {
        opts = foodGuideCaloriesOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-guide-eating-habits'
      ) {
        opts = foodGuideEatingHabitsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-vegetables') {
        opts = foodGuideVegetablesOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-guide-green-leafy-vegetables'
      ) {
        opts = foodGuideGreenLeafyVegetablesOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-guide-root-vegetables'
      ) {
        opts = foodGuideRootVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-beans') {
        opts = foodGuideBeansOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-fruit') {
        opts = foodGuideFruitsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-dried-fruit') {
        opts = foodGuideDriedFruitsOpts;
      } else if (
        activityType === 'com.anthrophi.shae.food-guide-animal-proteins'
      ) {
        opts = foodGuideAnimalProteinsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-eggs') {
        opts = foodGuideEggsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-white-meat') {
        opts = foodGuideWhiteMeatOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-red-meat') {
        opts = foodGuideRedMeatOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-white-fish') {
        opts = foodGuideWhiteFishOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-oily-fish') {
        opts = foodGuideOilyFishOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-shellfish') {
        opts = foodGuideShellfishOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-seeds') {
        opts = foodGuideSeedsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-nuts') {
        opts = foodGuideNutsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-nut-butters') {
        opts = foodGuideNutButtersOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-salt') {
        opts = foodGuideSaltOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-oils') {
        opts = foodGuideOilsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-sweeteners') {
        opts = foodGuideSweetenersOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-teas') {
        opts = foodGuideTeasOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-juices') {
        opts = foodGuideJuicesOpts;
      }

      console.log('opts', opts.activityType, activityType);

      // const opts = (activityType === 'com.anthrophi.shae.workout') ? workoutOpts
      //   : mealPlanOpts;

      presentShortcut(opts, ({status}) => {
        console.log(`I was ${status}`);
        this.getShortcuts();
      });
    } catch (e) {
      // Can't get list on <iOS 12
      console.log('getShortcuts', e);
    }
  };

  onViewAllPress = () => {
    this.setState({isViewAllPressed: true});
  };

  onClosePress = () => {
    this.setState({isViewAllPressed: false});
    this.props.setSiriModal(false);
    this.props.setSiriModalTimestamp(false);
  };

  onRemindMeLaterPress = () => {
    this.setState({isViewAllPressed: false});
    this.props.setSiriModalTimestamp(false);
  };

  onDonePress = () => {
    this.props.setSiriModal(false);
    this.props.setSiriModalTimestamp(false, true);
  };

  render() {
    const scaleAnimation = new ScaleAnimation({
      toValue: 0,
      useNativeDriver: true,
    });

    return (
      <Dialog
        visible={this.props.isSiriModalVisible}
        onTouchOutside={() => {
          // console.log('onTouchOutside');
          // this.onClosePress();
          // this.setState({ isSiriModalVisible: false });
        }}
        onDismiss={() => {
          this.onClosePress();
          // this.setState({ isSiriModalVisible: false });
        }}
        dialogAnimation={scaleAnimation}
        dialogStyle={{
          overflow: 'visible',
          borderRadius: 10,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <DialogContent>
          <View style={style.card}>
            <TouchableWithoutFeedback onPress={this.onClosePress}>
              {/*<TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}> */}
              <View style={style.closeButton}>
                <Image
                  style={{width: 24, height: 24}}
                  source={require('../resources/icon/siri_close.png')}
                />
              </View>
            </TouchableWithoutFeedback>
            <Image
              style={{
                width: 64,
                height: 64,
                alignSelf: 'center',
                marginTop: 40,
              }}
              source={require('../resources/icon/siri_icon.png')}
            />

            <Text style={style.mainTitle}>Add Siri Shortcut</Text>
            <Text style={style.mainText}>
              Please tap to add a siri shortcut for Food below.
            </Text>

            {this.props.type === 'FoodList' && (
              <View style={{marginTop: 30}}>
                <View
                  style={{height: !this.state.isViewAllPressed ? 131 : 182}}>
                  <ScrollView>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.foodlist-nuts-to-eat',
                        )
                      }>
                      <View style={{width: width - 100, alignSelf: 'center'}}>
                        <Text style={style.title}>Nuts</Text>
                        <Text style={style.text}>What nuts can I eat?</Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.foodlist-nuts-to-eat',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.foodlist-vegetables-to-eat',
                        )
                      }>
                      <View
                        style={{
                          width: width - 100,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={style.title}>Vegetables</Text>
                        <Text style={style.text}>
                          What vegetables can I eat?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.foodlist-vegetables-to-eat',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.state.isViewAllPressed && (
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-fruits-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Fruits</Text>
                            <Text style={style.text}>
                              What fruits can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-fruits-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-grains-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Grains</Text>
                            <Text style={style.text}>
                              What grains can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-grains-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-meats-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Meats</Text>
                            <Text style={style.text}>
                              What meats can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-meats-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-seafood-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Seafood</Text>
                            <Text style={style.text}>
                              What seafood can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-seafood-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-drinks-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Drinks</Text>
                            <Text style={style.text}>
                              What drinks can I drink?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-drinks-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-herbs-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Herbs</Text>
                            <Text style={style.text}>
                              What herbs can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-herbs-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-dairy-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Dairy</Text>
                            <Text style={style.text}>
                              What dairy can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-dairy-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-sweets-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Sweets</Text>
                            <Text style={style.text}>
                              What sweets can I eat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-sweets-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-fats-to-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Fats</Text>
                            <Text style={style.text}>What fats can I eat?</Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-fats-to-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-nuts-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Nuts</Text>
                            <Text style={style.text}>
                              What nuts should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-nuts-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-vegetables-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Vegetables</Text>
                            <Text style={style.text}>
                              What vegetables should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-vegetables-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-fruits-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Fruits</Text>
                            <Text style={style.text}>
                              What fruits should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-fruits-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-grains-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Grains</Text>
                            <Text style={style.text}>
                              What grains should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-grains-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-meats-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Meats</Text>
                            <Text style={style.text}>
                              What meats should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-meats-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-seafood-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Seafood</Text>
                            <Text style={style.text}>
                              What seafood should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-seafood-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-drinks-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Drinks</Text>
                            <Text style={style.text}>
                              What drinks should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-drinks-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-herbs-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Herbs</Text>
                            <Text style={style.text}>
                              What herbs should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-herbs-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-dairy-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Dairy</Text>
                            <Text style={style.text}>
                              What dairy should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-dairy-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-sweets-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Sweets</Text>
                            <Text style={style.text}>
                              What sweets should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-sweets-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodlist-fats-to-avoid',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Fats</Text>
                            <Text style={style.text}>
                              What fats should I avoid?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodlist-fats-to-avoid',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {!this.state.isViewAllPressed && (
                  <TouchableWithoutFeedback onPress={this.onViewAllPress}>
                    <View style={style.button}>
                      <Text style={style.buttonText}>View All</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.foodListShortcutsCount === 22 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={style.remindLaterText}>Remind me later</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}

            {this.props.type === 'FoodChrono' && (
              <View style={{marginTop: 30}}>
                <View
                  style={{height: !this.state.isViewAllPressed ? 131 : 182}}>
                  <ScrollView>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.foodtiming-breakfast-eat',
                        )
                      }>
                      <View style={{width: width - 100, alignSelf: 'center'}}>
                        <Text style={style.title}>Breakfast</Text>
                        <Text style={style.text}>
                          What time should I eat breakfast?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.foodtiming-breakfast-eat',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.foodtiming-lunch-eat',
                        )
                      }>
                      <View
                        style={{
                          width: width - 100,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={style.title}>Lunch</Text>
                        <Text style={style.text}>
                          What time should I eat lunch?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.foodtiming-lunch-eat',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.state.isViewAllPressed && (
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodtiming-dinner-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Dinner</Text>
                            <Text style={style.text}>
                              What time should I eat dinner?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodtiming-dinner-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodtiming-snack-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Snack</Text>
                            <Text style={style.text}>
                              What time should I snack?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodtiming-snack-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodtiming-drink-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Have a drink</Text>
                            <Text style={style.text}>
                              What time should I have a drink?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodtiming-drink-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodtiming-avoid-eat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Avoid eating</Text>
                            <Text style={style.text}>
                              What time should I avoid eating?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodtiming-avoid-eat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.foodtiming-avoid-snack',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Avoid snacking</Text>
                            <Text style={style.text}>
                              What time should I avoid snacking?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.foodtiming-avoid-snack',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {!this.state.isViewAllPressed && (
                  <TouchableWithoutFeedback onPress={this.onViewAllPress}>
                    <View style={style.button}>
                      <Text style={style.buttonText}>View All</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.foodChronoCount === 7 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={style.remindLaterText}>Remind me later</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}

            {this.props.type === 'MealPlan' && (
              <View style={{marginTop: 30}}>
                <View
                  style={{height: !this.state.isViewAllPressed ? 131 : 182}}>
                  <ScrollView>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.mealplanner-today',
                        )
                      }>
                      <View style={{width: width - 100, alignSelf: 'center'}}>
                        <Text style={style.title}>Today</Text>
                        <Text style={style.text}>What should I eat today?</Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.mealplanner-today',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.mealplanner-tomorrow',
                        )
                      }>
                      <View
                        style={{
                          width: width - 100,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={style.title}>Tomorrow</Text>
                        <Text style={style.text}>
                          What should I eat tomorrow?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.mealplanner-tomorrow',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.state.isViewAllPressed && (
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.mealplanner-this-week',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>This week</Text>
                            <Text style={style.text}>
                              What should I eat this week?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.mealplanner-this-week',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.mealplanner-next-week',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Next week</Text>
                            <Text style={style.text}>
                              What should I eat next week?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.mealplanner-next-week',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {!this.state.isViewAllPressed && (
                  <TouchableWithoutFeedback onPress={this.onViewAllPress}>
                    <View style={style.button}>
                      <Text style={style.buttonText}>View All</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.mealPlannerCount === 4 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={style.remindLaterText}>Remind me later</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}

            {this.props.type === 'Recipes' && (
              <View style={{marginTop: 30}}>
                <View
                  style={{height: !this.state.isViewAllPressed ? 131 : 182}}>
                  <ScrollView>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.recipes-main-dishes',
                        )
                      }>
                      <View style={{width: width - 100, alignSelf: 'center'}}>
                        <Text style={style.title}>Main dishes</Text>
                        <Text style={style.text}>
                          Show me some recipe ideas for main dishes
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.recipes-main-dishes',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.recipes-desserts',
                        )
                      }>
                      <View
                        style={{
                          width: width - 100,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={style.title}>Desserts</Text>
                        <Text style={style.text}>
                          Show me some recipe ideas for desserts
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.recipes-desserts',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.state.isViewAllPressed && (
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-side-dishes',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Side dishes</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for side dishes
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-side-dishes',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-appetizers',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Appetizers</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for appetizers
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-appetizers',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-salads',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Salads</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for salads
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-salads',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-breads',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Breads</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for breads
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-breads',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-soups',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Soups</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for soups
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-soups',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-beverages',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Beverages</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for beverages
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-beverages',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-cocktails',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Cocktails</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for cocktails
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-cocktails',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-snacks',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Snacks</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for snacks
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-snacks',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-breakfast',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Breakfast</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for breakfast
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-breakfast',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-lunch',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Lunch</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for lunch
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-lunch',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.recipes-dinner',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Dinner</Text>
                            <Text style={style.text}>
                              Show me some recipe ideas for dinner
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.recipes-dinner',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {!this.state.isViewAllPressed && (
                  <TouchableWithoutFeedback onPress={this.onViewAllPress}>
                    <View style={style.button}>
                      <Text style={style.buttonText}>View All</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.recipesCount === 13 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={style.remindLaterText}>Remind me later</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}

            {this.props.type === 'Basket' && (
              <View style={{marginTop: 30}}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.onSiriButtonPress('com.anthrophi.shae.shopping-basket')
                  }>
                  <View style={{width: width - 100, alignSelf: 'center'}}>
                    <Text style={style.title}>Shopping Basket</Text>
                    <Text style={style.text}>What groceries should I buy?</Text>
                    {!this.state.shortcuts.includes(
                      'com.anthrophi.shae.shopping-basket',
                    ) ? (
                      <Image
                        style={{
                          width: 19,
                          height: 19,
                          position: 'absolute',
                          right: 0,
                          top: 4,
                        }}
                        source={require('../resources/icon/siri_plus.png')}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 13,
                          height: 10,
                          position: 'absolute',
                          right: 0,
                          top: 12,
                        }}
                        source={require('../resources/icon/siri_checkmark.png')}
                      />
                    )}
                    <View style={style.divider} />
                  </View>
                </TouchableWithoutFeedback>

                {this.state.shoppingCount === 1 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={[style.remindLaterText, {marginTop: 145}]}>
                      Remind me later
                    </Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}

            {this.props.type === 'FoodPrep' && (
              <View style={{marginTop: 30}}>
                <View
                  style={{height: !this.state.isViewAllPressed ? 131 : 182}}>
                  <ScrollView>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.food-preparation',
                        )
                      }>
                      <View style={{width: width - 100, alignSelf: 'center'}}>
                        <Text style={style.title}>Food Preparation</Text>
                        <Text style={style.text}>
                          How should I prepare my food?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.food-preparation',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.food-preparation-fermented-foods',
                        )
                      }>
                      <View
                        style={{
                          width: width - 100,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={style.title}>Fermented foods</Text>
                        <Text style={style.text}>
                          Are fermented foods good for me?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.food-preparation-fermented-foods',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.state.isViewAllPressed && (
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-steamed-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Steamed foods</Text>
                            <Text style={style.text}>
                              Are steamed foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-steamed-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-raw-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Raw foods</Text>
                            <Text style={style.text}>
                              Are raw foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-raw-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-juiced-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Juiced foods</Text>
                            <Text style={style.text}>
                              Are juiced foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-juiced-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-baked-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Baked foods</Text>
                            <Text style={style.text}>
                              Are baked foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-baked-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-boiled-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Boiled foods</Text>
                            <Text style={style.text}>
                              Are boiled foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-boiled-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-stir-fried-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Stir fried foods</Text>
                            <Text style={style.text}>
                              Are stir fried foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-stir-fried-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-sprouted-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Sprouted foods</Text>
                            <Text style={style.text}>
                              Are sprouted foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-sprouted-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-roasted-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Roasted foods</Text>
                            <Text style={style.text}>
                              Are roasted foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-roasted-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-soaked-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Soaked foods</Text>
                            <Text style={style.text}>
                              Are soaked foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-soaked-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-salt',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>
                              Preserved foods (salt)
                            </Text>
                            <Text style={style.text}>
                              Are preserved foods (salt) good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-salt',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-vinegar',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>
                              Preserved foods (vinegar)
                            </Text>
                            <Text style={style.text}>
                              Are preserved foods (vinegar) good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-vinegar',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-oil',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>
                              Preserved foods (oil)
                            </Text>
                            <Text style={style.text}>
                              Are preserved foods (oil) good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-oil',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-cold-drinks',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Cold drinks</Text>
                            <Text style={style.text}>
                              Are cold drinks good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-cold-drinks',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-cold-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Cold foods</Text>
                            <Text style={style.text}>
                              Are cold foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-cold-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-frozen-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Frozen foods</Text>
                            <Text style={style.text}>
                              Are frozen foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-frozen-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-dehydrated-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Dehydrated foods</Text>
                            <Text style={style.text}>
                              Are dehydrated foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-dehydrated-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-broiled-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Broiled foods</Text>
                            <Text style={style.text}>
                              Are broiled foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-broiled-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-smoked-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Smoked foods</Text>
                            <Text style={style.text}>
                              Are smoked foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-smoked-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-canned-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Canned foods</Text>
                            <Text style={style.text}>
                              Are canned foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-canned-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-processed-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Processed foods</Text>
                            <Text style={style.text}>
                              Are processed foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-processed-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-deep-fried-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Deep fried foods</Text>
                            <Text style={style.text}>
                              Are deep fried foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-deep-fried-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-breaded-foods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Breaded foods</Text>
                            <Text style={style.text}>
                              Are breaded foods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-breaded-foods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-baked-goods',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Baked goods</Text>
                            <Text style={style.text}>
                              Are baked goods good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-baked-goods',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-smoothies',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Smoothies</Text>
                            <Text style={style.text}>
                              Are smoothies good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-smoothies',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-broths',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Broths</Text>
                            <Text style={style.text}>
                              Are broths good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-broths',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-preservatives',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Preservatives</Text>
                            <Text style={style.text}>
                              Are preservatives good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-preservatives',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-gluten',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Gluten</Text>
                            <Text style={style.text}>
                              Is gluten good for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-gluten',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-preparation-msg',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>MSG</Text>
                            <Text style={style.text}>Is MSG good for me?</Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-preparation-msg',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {!this.state.isViewAllPressed && (
                  <TouchableWithoutFeedback onPress={this.onViewAllPress}>
                    <View style={style.button}>
                      <Text style={style.buttonText}>View All</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.foodPreparationCount === 30 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={style.remindLaterText}>Remind me later</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}

            {this.props.type === 'FoodGuide' && (
              <View style={{marginTop: 30}}>
                <View
                  style={{height: !this.state.isViewAllPressed ? 131 : 182}}>
                  <ScrollView>
                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress('com.anthrophi.shae.food-guide')
                      }>
                      <View style={{width: width - 100, alignSelf: 'center'}}>
                        <Text style={style.title}>Food Guide</Text>
                        <Text style={style.text}>
                          What types of food are good for me?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.food-guide',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() =>
                        this.onSiriButtonPress(
                          'com.anthrophi.shae.food-guide-food-combining',
                        )
                      }>
                      <View
                        style={{
                          width: width - 100,
                          alignSelf: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={style.title}>Food Combining</Text>
                        <Text style={style.text}>
                          What types of food can I combine?
                        </Text>
                        {!this.state.shortcuts.includes(
                          'com.anthrophi.shae.food-guide-food-combining',
                        ) ? (
                          <Image
                            style={{
                              width: 19,
                              height: 19,
                              position: 'absolute',
                              right: 0,
                              top: 4,
                            }}
                            source={require('../resources/icon/siri_plus.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 13,
                              height: 10,
                              position: 'absolute',
                              right: 0,
                              top: 12,
                            }}
                            source={require('../resources/icon/siri_checkmark.png')}
                          />
                        )}
                        <View style={style.divider} />
                      </View>
                    </TouchableWithoutFeedback>

                    {this.state.isViewAllPressed && (
                      <View>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-calories',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Calories & Portions</Text>
                            <Text style={style.text}>
                              How many Calories should I be eating?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-calories',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-eating-habits',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Eating Habits</Text>
                            <Text style={style.text}>
                              What are some good eating habits for me?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-eating-habits',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-vegetables',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Vegetables</Text>
                            <Text style={style.text}>
                              How often should I eat vegetables?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-vegetables',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-green-leafy-vegetables',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>
                              Green leafy vegetables
                            </Text>
                            <Text style={style.text}>
                              How often should I eat green leafy vegetables?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-green-leafy-vegetables',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-root-vegetables',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Root vegetables</Text>
                            <Text style={style.text}>
                              How often should I eat root vegetables?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-root-vegetables',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-beans',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Beans</Text>
                            <Text style={style.text}>
                              How often should I eat beans?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-beans',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-fruit',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Fruits</Text>
                            <Text style={style.text}>
                              How often should I eat fruits?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-fruit',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-dried-fruit',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Dried fruits</Text>
                            <Text style={style.text}>
                              How often should I eat dried fruits?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-dried-fruit',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-animal-proteins',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Animal proteins</Text>
                            <Text style={style.text}>
                              How often should I eat animal proteins?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-animal-proteins',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-eggs',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Eggs</Text>
                            <Text style={style.text}>
                              How often should I eat eggs?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-eggs',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-white-meat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>White meat</Text>
                            <Text style={style.text}>
                              How often should I eat white meat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-white-meat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-red-meat',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Red meat</Text>
                            <Text style={style.text}>
                              How often should I eat red meat?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-red-meat',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-white-fish',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>White fish</Text>
                            <Text style={style.text}>
                              How often should I eat white fish?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-white-fish',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-oily-fish',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Oily fish</Text>
                            <Text style={style.text}>
                              How often should I eat oily fish?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-oily-fish',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-shellfish',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Shellfish</Text>
                            <Text style={style.text}>
                              How often should I eat shellfish?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-shellfish',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-seeds',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Seeds</Text>
                            <Text style={style.text}>
                              How often should I eat seeds?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-seeds',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-nuts',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Nuts</Text>
                            <Text style={style.text}>
                              How often should I eat nuts?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-nuts',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-nut-butters',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Nut butters</Text>
                            <Text style={style.text}>
                              How often should I eat nut butters?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-nut-butters',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-salt',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Salt</Text>
                            <Text style={style.text}>
                              How often should I eat salt?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-salt',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-oils',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Oils</Text>
                            <Text style={style.text}>
                              How often should I eat oils?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-oils',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-sweeteners',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Sweeteners</Text>
                            <Text style={style.text}>
                              How often should I eat sweeteners?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-sweeteners',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-teas',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Teas</Text>
                            <Text style={style.text}>
                              How often should I eat teas?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-teas',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.onSiriButtonPress(
                              'com.anthrophi.shae.food-guide-juices',
                            )
                          }>
                          <View
                            style={{
                              width: width - 100,
                              alignSelf: 'center',
                              marginTop: 20,
                            }}>
                            <Text style={style.title}>Juices</Text>
                            <Text style={style.text}>
                              How often should I eat juices?
                            </Text>
                            {!this.state.shortcuts.includes(
                              'com.anthrophi.shae.food-guide-juices',
                            ) ? (
                              <Image
                                style={{
                                  width: 19,
                                  height: 19,
                                  position: 'absolute',
                                  right: 0,
                                  top: 4,
                                }}
                                source={require('../resources/icon/siri_plus.png')}
                              />
                            ) : (
                              <Image
                                style={{
                                  width: 13,
                                  height: 10,
                                  position: 'absolute',
                                  right: 0,
                                  top: 12,
                                }}
                                source={require('../resources/icon/siri_checkmark.png')}
                              />
                            )}
                            <View style={style.divider} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {!this.state.isViewAllPressed && (
                  <TouchableWithoutFeedback onPress={this.onViewAllPress}>
                    <View style={style.button}>
                      <Text style={style.buttonText}>View All</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                {this.state.foodGuideCount === 25 ? (
                  <TouchableWithoutFeedback onPress={this.onDonePress}>
                    <View style={style.doneButton}>
                      <Text style={style.doneButtonText}>Done</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback onPress={this.onRemindMeLaterPress}>
                    <Text style={style.remindLaterText}>Remind me later</Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}
          </View>
        </DialogContent>
      </Dialog>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: width - 55,
    height: 470,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 4,
  },
  closeButton: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'SFProText-Semibold',
    marginTop: 20,
    alignSelf: 'center',
    color: '#101010',
  },
  mainText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    marginTop: 9,
    alignSelf: 'center',
    color: '#6a6f73',
    lineHeight: 18,
    maxWidth: 220,
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    color: '#363a3d',
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    marginTop: 3,
    color: '#8d9397',
  },
  divider: {
    width: width - 100,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: '#d8d7de',
    marginTop: 20,
  },
  button: {
    width: 180,
    height: 40,
    borderRadius: 22,
    backgroundColor: '#00a8eb',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 11,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    color: '#ffffff',
  },
  remindLaterText: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    color: '#6a6f73',
    alignSelf: 'center',
    marginTop: 24,
  },
  doneButton: {
    width: 180,
    height: 40,
    borderRadius: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(0,168,235)',
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
});

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import {
  getShortcuts,
  presentShortcut,
  suggestShortcuts
} from "react-native-siri-shortcut";

const width = Dimensions.get('window').width;


const workoutOpts = {
  activityType: "com.anthrophi.shae.workout", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the workout action",
  keywords: ["start", "training", "workout"],
  persistentIdentifier: "com.anthrophi.shae.workout",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Generate workout",
  needsSave: true
};

const mealPlanOpts = {
  activityType: "com.anthrophi.shae.mealplan", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the meal plan action",
  keywords: ["show", "meal plan"],
  persistentIdentifier: "com.anthrophi.shae.mealplan",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show Today's Meal Plan",
  needsSave: true
};

const naturalBrainFunctionOpts = {
  activityType: "com.anthrophi.shae.natural-brain-function", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the natural brain function action",
  keywords: ["natural brain function"],
  persistentIdentifier: "com.anthrophi.shae.natural-brain-function",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Tell me about my Natural Brain Function",
  needsSave: true
};

const idealVacationOpts = {
  activityType: "com.anthrophi.shae.ideal-vacation", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for my ideal vacation action",
  keywords: ["my ideal vacation"],
  persistentIdentifier: "com.anthrophi.shae.ideal-vacation",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Where should I go for my Vacation?",
  needsSave: true
};

const peopleToLookForOpts = {
  activityType: "com.anthrophi.shae.people-to-look-for", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the people to look for action",
  keywords: ["people to look for"],
  persistentIdentifier: "com.anthrophi.shae.people-to-look-for",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Who should I hang out with?",
  needsSave: true
};

const avoidNutsOpts = {
  activityType: "com.anthrophi.shae.foodlist-nuts-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the nuts to avoid action",
  keywords: ["nuts", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-nuts-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What nuts should I avoid?",
  needsSave: true
};

const avoidVegetablesOpts = {
  activityType: "com.anthrophi.shae.foodlist-vegetables-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the vegetables to avoid action",
  keywords: ["vegetables", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-vegetables-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What vegetables should I avoid?",
  needsSave: true
};

const avoidFruitsOpts = {
  activityType: "com.anthrophi.shae.foodlist-fruits-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the fruits to avoid action",
  keywords: ["fruits", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-fruits-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What fruits should I avoid?",
  needsSave: true
};

const avoidGrainsOpts = {
  activityType: "com.anthrophi.shae.foodlist-grains-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the grains to avoid action",
  keywords: ["grains", "eavoidat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-grains-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What grains should I avoid?",
  needsSave: true
};

const avoidMeatsOpts = {
  activityType: "com.anthrophi.shae.foodlist-meats-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the meats to avoid action",
  keywords: ["meats", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-meats-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What meats should I avoid?",
  needsSave: true
};

const avoidSeafoodOpts = {
  activityType: "com.anthrophi.shae.foodlist-seafood-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the seafood to avoid action",
  keywords: ["seafood", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-seafood-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What seafood should I avoid?",
  needsSave: true
};

const avoidDrinksOpts = {
  activityType: "com.anthrophi.shae.foodlist-drinks-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the drinks to avoid action",
  keywords: ["drinks", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-drinks-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What drinks should I avoid?",
  needsSave: true
};

const avoidHerbsOpts = {
  activityType: "com.anthrophi.shae.foodlist-herbs-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the herbs to avoid action",
  keywords: ["herbs", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-herbs-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What herbs should I avoid?",
  needsSave: true
};

const avoidDairyOpts = {
  activityType: "com.anthrophi.shae.foodlist-dairy-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the dairy to avoid action",
  keywords: ["dairy", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-dairy-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What dairy should I avoid?",
  needsSave: true
};

const avoidSweetsOpts = {
  activityType: "com.anthrophi.shae.foodlist-sweets-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the sweets to avoid action",
  keywords: ["sweets", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-sweets-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What sweets should I avoid?",
  needsSave: true
};

const avoidFatsOpts = {
  activityType: "com.anthrophi.shae.foodlist-fats-to-avoid", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the fats to avoid action",
  keywords: ["fats", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-fats-to-avoid",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What fats should I avoid?",
  needsSave: true
};



const eatNutsOpts = {
  activityType: "com.anthrophi.shae.foodlist-nuts-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the nuts to eat action",
  keywords: ["nuts", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-nuts-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What nuts can I eat?",
  needsSave: true
};

const eatVegetablesOpts = {
  activityType: "com.anthrophi.shae.foodlist-vegetables-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the vegetables to eat action",
  keywords: ["vegetables", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-vegetables-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What vegetables can I eat?",
  needsSave: true
};

const eatFruitsOpts = {
  activityType: "com.anthrophi.shae.foodlist-fruits-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the fruits to eat action",
  keywords: ["fruits", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-fruits-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What fruits can I eat?",
  needsSave: true
};

const eatGrainsOpts = {
  activityType: "com.anthrophi.shae.foodlist-grains-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the grains to eat action",
  keywords: ["grains", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-grains-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What grains can I eat?",
  needsSave: true
};

const eatMeatsOpts = {
  activityType: "com.anthrophi.shae.foodlist-meats-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the meats to eat action",
  keywords: ["meats", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-meats-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What meats can I eat?",
  needsSave: true
};

const eatSeafoodOpts = {
  activityType: "com.anthrophi.shae.foodlist-seafood-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the seafood to eat action",
  keywords: ["seafood", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-seafood-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What seafood can I eat?",
  needsSave: true
};

const eatDrinksOpts = {
  activityType: "com.anthrophi.shae.foodlist-drinks-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the drinks to eat action",
  keywords: ["drinks", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-drinks-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What drinks can I eat?",
  needsSave: true
};

const eatHerbsOpts = {
  activityType: "com.anthrophi.shae.foodlist-herbs-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the herbs to eat action",
  keywords: ["herbs", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-herbs-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What herbs can I eat?",
  needsSave: true
};

const eatDairyOpts = {
  activityType: "com.anthrophi.shae.foodlist-dairy-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the dairy to eat action",
  keywords: ["dairy", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-dairy-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What dairy can I eat?",
  needsSave: true
};

const eatSweetsOpts = {
  activityType: "com.anthrophi.shae.foodlist-sweets-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the sweets to eat action",
  keywords: ["sweets", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-sweets-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What sweets can I eat?",
  needsSave: true
};

const eatFatsOpts = {
  activityType: "com.anthrophi.shae.foodlist-fats-to-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the fats to eat action",
  keywords: ["fats", "eat"],
  persistentIdentifier: "com.anthrophi.shae.foodlist-fats-to-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What fats can I eat?",
  needsSave: true
};

// Food Timing
const breakfastEatOpts = {
  activityType: "com.anthrophi.shae.foodtiming-breakfast-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the eat breakfast action",
  keywords: ["eat", "breakfast"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-breakfast-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I eat breakfast?",
  needsSave: true
};

const lunchEatOpts = {
  activityType: "com.anthrophi.shae.foodtiming-lunch-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the eat lunch action",
  keywords: ["eat", "lunch"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-lunch-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I eat lunch?",
  needsSave: true
};

const dinnerEatOpts = {
  activityType: "com.anthrophi.shae.foodtiming-dinner-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the eat dinner action",
  keywords: ["eat", "dinner"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-dinner-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I eat dinner?",
  needsSave: true
};

const snackEatOpts = {
  activityType: "com.anthrophi.shae.foodtiming-snack-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the snack action",
  keywords: ["eat", "snack"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-snack-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I snack?",
  needsSave: true
};

const drinkEatOpts = {
  activityType: "com.anthrophi.shae.foodtiming-drink-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the have a drink action",
  keywords: ["eat", "drink"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-drink-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I have a drink?",
  needsSave: true
};

const avoidEatOpts = {
  activityType: "com.anthrophi.shae.foodtiming-avoid-eat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the avoid eating action",
  keywords: ["eat", "avoid"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-avoid-eat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I avoid eating?",
  needsSave: true
};

const avoidSnackOpts = {
  activityType: "com.anthrophi.shae.foodtiming-avoid-snack", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the avoid snacking action",
  keywords: ["avoid", "snack"],
  persistentIdentifier: "com.anthrophi.shae.foodtiming-avoid-snack",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What time should I avoid snacking?",
  needsSave: true
};

// Meal Plan
const mealPlannerTodayOpts = {
  activityType: "com.anthrophi.shae.mealplanner-today", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the today meal plan action",
  keywords: ["meal", "plan", "today"],
  persistentIdentifier: "com.anthrophi.shae.mealplanner-today",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What should I eat today?",
  needsSave: true
};

const mealPlannerTomorrowOpts = {
  activityType: "com.anthrophi.shae.mealplanner-tomorrow", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the tomorrow meal plan action",
  keywords: ["meal", "plan", "tomorrow"],
  persistentIdentifier: "com.anthrophi.shae.mealplanner-tomorrow",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What should I eat tomorrow?",
  needsSave: true
};

const mealPlannerThisWeekOpts = {
  activityType: "com.anthrophi.shae.mealplanner-this-week", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for this week meal plan action",
  keywords: ["meal", "plan", "this", "week"],
  persistentIdentifier: "com.anthrophi.shae.mealplanner-this-week",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What should I eat this week?",
  needsSave: true
};

const mealPlannerNextWeekOpts = {
  activityType: "com.anthrophi.shae.mealplanner-next-week", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for the next week meal plan action",
  keywords: ["meal", "plan", "next", "week"],
  persistentIdentifier: "com.anthrophi.shae.mealplanner-next-week",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What should I eat next week?",
  needsSave: true
};

// Recipes
const recipesMainDishesOpts = {
  activityType: "com.anthrophi.shae.recipes-main-dishes", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for main dishes action",
  keywords: ["recipes", "main", "dishes"],
  persistentIdentifier: "com.anthrophi.shae.recipes-main-dishes",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for main dishes",
  needsSave: true
};

const recipesDessertsOpts = {
  activityType: "com.anthrophi.shae.recipes-desserts", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for desserts action",
  keywords: ["recipes", "desserts"],
  persistentIdentifier: "com.anthrophi.shae.recipes-desserts",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for desserts",
  needsSave: true
};

const recipesSideDishesOpts = {
  activityType: "com.anthrophi.shae.recipes-side-dishes", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for side dishes action",
  keywords: ["recipes", "side", "dishes"],
  persistentIdentifier: "com.anthrophi.shae.recipes-side-dishes",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for side dishes",
  needsSave: true
};

const recipesAppetizersOpts = {
  activityType: "com.anthrophi.shae.recipes-appetizers", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for appetizers action",
  keywords: ["recipes", "appetizers"],
  persistentIdentifier: "com.anthrophi.shae.recipes-appetizers",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for appetizers",
  needsSave: true
};

const recipesSaladsOpts = {
  activityType: "com.anthrophi.shae.recipes-salads", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for salads action",
  keywords: ["recipes", "salads"],
  persistentIdentifier: "com.anthrophi.shae.recipes-salads",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for salads",
  needsSave: true
};

const recipesBreadsOpts = {
  activityType: "com.anthrophi.shae.recipes-breads", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for breads action",
  keywords: ["recipes", "breads"],
  persistentIdentifier: "com.anthrophi.shae.recipes-breads",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for breads",
  needsSave: true
};

const recipesSoupsOpts = {
  activityType: "com.anthrophi.shae.recipes-soups", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for soups action",
  keywords: ["recipes", "soups"],
  persistentIdentifier: "com.anthrophi.shae.recipes-soups",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for soups",
  needsSave: true
};

const recipesBeveragesOpts = {
  activityType: "com.anthrophi.shae.recipes-beverages", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for beverages action",
  keywords: ["recipes", "beverages"],
  persistentIdentifier: "com.anthrophi.shae.recipes-beverages",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for beverages",
  needsSave: true
};

const recipesCocktailsOpts = {
  activityType: "com.anthrophi.shae.recipes-cocktails", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for cocktails action",
  keywords: ["recipes", "cocktails"],
  persistentIdentifier: "com.anthrophi.shae.recipes-cocktails",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for cocktails",
  needsSave: true
};

const recipesSnacksOpts = {
  activityType: "com.anthrophi.shae.recipes-snacks", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for snacks action",
  keywords: ["recipes", "snacks"],
  persistentIdentifier: "com.anthrophi.shae.recipes-snacks",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for snacks",
  needsSave: true
};

const recipesBreakfastOpts = {
  activityType: "com.anthrophi.shae.recipes-breakfast", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for breakfast action",
  keywords: ["recipes", "breakfast"],
  persistentIdentifier: "com.anthrophi.shae.recipes-breakfast",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for breakfast",
  needsSave: true
};

const recipesLunchOpts = {
  activityType: "com.anthrophi.shae.recipes-lunch", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for lunch action",
  keywords: ["recipes", "lunch"],
  persistentIdentifier: "com.anthrophi.shae.recipes-lunch",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for lunch",
  needsSave: true
};

const recipesDinnerOpts = {
  activityType: "com.anthrophi.shae.recipes-dinner", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for dinner action",
  keywords: ["recipes", "dinner"],
  persistentIdentifier: "com.anthrophi.shae.recipes-dinner",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Show me some recipe ideas for dinner",
  needsSave: true
};


// Shopping basket
const shoppingBasketOpts = {
  activityType: "com.anthrophi.shae.shopping-basket", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for shopping basket action",
  keywords: ["shopping", "basket", "buy"],
  persistentIdentifier: "com.anthrophi.shae.shopping-basket",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What groceries should I buy?",
  needsSave: true
};

// Food Preparation
const foodPrepOpts = {
  activityType: "com.anthrophi.shae.food-preparation", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for food preparation action",
  keywords: ["food", "preparation"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How should I prepare my food?",
  needsSave: true
};

const foodPrepFermentedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-fermented-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of fermented foods action",
  keywords: ["food", "preparation", "fermented", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-fermented-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are fermented foods good for me?",
  needsSave: true
};

const foodPrepSteamedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-steamed-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of steamed foods action",
  keywords: ["food", "preparation", "steamed", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-steamed-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are steamed foods good for me?",
  needsSave: true
};

const foodPrepRawFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-raw-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of raw foods action",
  keywords: ["food", "preparation", "raw", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-raw-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are raw foods good for me?",
  needsSave: true
};

const foodPrepJuicedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-juiced-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of juiced foods action",
  keywords: ["food", "preparation", "juiced", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-juiced-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are juiced foods good for me?",
  needsSave: true
};

const foodPrepBakedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-baked-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of baked foods action",
  keywords: ["food", "preparation", "baked", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-baked-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are baked foods good for me?",
  needsSave: true
};

const foodPrepBoiledFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-boiled-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of boiled foods action",
  keywords: ["food", "preparation", "boiled", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-boiled-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are boiled foods good for me?",
  needsSave: true
};

const foodPrepStirFriedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-stir-fried-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of stir fried foods action",
  keywords: ["food", "preparation", "stir", "fried", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-stir-fried-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are stir fried foods good for me?",
  needsSave: true
};

const foodPrepSproutedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-sprouted-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of sprouted foods action",
  keywords: ["food", "preparation", "sprouted", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-sprouted-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are sprouted foods good for me?",
  needsSave: true
};

const foodPrepRoastedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-roasted-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of roasted foods action",
  keywords: ["food", "preparation", "roasted", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-roasted-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are roasted foods good for me?",
  needsSave: true
};

const foodPrepSoakedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-soaked-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of soaked foods action",
  keywords: ["food", "preparation", "soaked", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-soaked-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are soaked foods good for me?",
  needsSave: true
};

const foodPrepSaltOpts = {
  activityType: "com.anthrophi.shae.food-preparation-salt", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of preserved foods (salt) action",
  keywords: ["food", "preparation", "preserved", "foods", "salt"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-salt",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are preserved foods (salt) good for me?",
  needsSave: true
};

const foodPrepVinegarOpts = {
  activityType: "com.anthrophi.shae.food-preparation-vinegar", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of preserved foods (vinegar) action",
  keywords: ["food", "preparation", "preserved", "foods", "vinegar"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-vinegar",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are preserved foods (vinegar) good for me?",
  needsSave: true
};

const foodPrepOilOpts = {
  activityType: "com.anthrophi.shae.food-preparation-oil", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of preserved foods (oil) action",
  keywords: ["food", "preparation", "preserved", "foods", "oil"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-oil",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are preserved foods (oil) good for me?",
  needsSave: true
};

const foodPrepColdDrinksOpts = {
  activityType: "com.anthrophi.shae.food-preparation-cold-drinks", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of cold drinks action",
  keywords: ["food", "preparation", "cold", "drinks"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-cold-drinks",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are cold drinks good for me?",
  needsSave: true
};

const foodPrepColdFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-cold-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of cold foods action",
  keywords: ["food", "preparation", "cold", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-cold-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are cold foods good for me?",
  needsSave: true
};

const foodPrepFrozenFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-frozen-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of frozen foods action",
  keywords: ["food", "preparation", "frozen", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-frozen-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are frozen foods good for me?",
  needsSave: true
};

const foodPrepDehydratedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-dehydrated-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of dehydrated foods action",
  keywords: ["food", "preparation", "dehydrated", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-dehydrated-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are dehydrated foods good for me?",
  needsSave: true
};

const foodPrepBroiledFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-broiled-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of broiled foods action",
  keywords: ["food", "preparation", "broiled", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-broiled-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are broiled foods good for me?",
  needsSave: true
};

const foodPrepSmokedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-smoked-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of smoked foods action",
  keywords: ["food", "preparation", "smoked", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-smoked-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are smoked foods good for me?",
  needsSave: true
};

const foodPrepCannedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-canned-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of canned foods action",
  keywords: ["food", "preparation", "canned", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-canned-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are canned foods good for me?",
  needsSave: true
};

const foodPrepProcessedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-processed-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of processed foods action",
  keywords: ["food", "preparation", "processed", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-processed-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are processed foods good for me?",
  needsSave: true
};

const foodPrepDeepFriedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-deep-fried-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of deep fried foods action",
  keywords: ["food", "preparation", "deep", "fried", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-deep-fried-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are deep fried foods good for me?",
  needsSave: true
};

const foodPrepBreadedFoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-breaded-foods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of breaded foods action",
  keywords: ["food", "preparation", "breaded", "foods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-breaded-foods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are breaded foods good for me?",
  needsSave: true
};

const foodPrepBakedGoodsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-baked-goods", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of baked goods action",
  keywords: ["food", "preparation", "baked", "goods"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-baked-goods",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are baked goods good for me?",
  needsSave: true
};

const foodPrepSmoothiesOpts = {
  activityType: "com.anthrophi.shae.food-preparation-smoothies", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of smoothies action",
  keywords: ["food", "preparation", "smoothies"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-smoothies",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are smoothies good for me?",
  needsSave: true
};

const foodPrepBrothsOpts = {
  activityType: "com.anthrophi.shae.food-preparation-broths", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of broths action",
  keywords: ["food", "preparation", "broths"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-broths",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are broths good for me?",
  needsSave: true
};

const foodPrepPreservativesOpts = {
  activityType: "com.anthrophi.shae.food-preparation-preservatives", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of preservatives action",
  keywords: ["food", "preparation", "preservatives"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-preservatives",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Are preservatives good for me?",
  needsSave: true
};

const foodPrepGlutenOpts = {
  activityType: "com.anthrophi.shae.food-preparation-gluten", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of gluten action",
  keywords: ["food", "preparation", "gluten"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-gluten",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Is gluten good for me?",
  needsSave: true
};

const foodPrepMsgOpts = {
  activityType: "com.anthrophi.shae.food-preparation-msg", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for preparation of MSG action",
  keywords: ["food", "preparation", "msg"],
  persistentIdentifier: "com.anthrophi.shae.food-preparation-msg",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "Is MSG good for me?",
  needsSave: true
};

// Food Guide

const foodGuideOpts = {
  activityType: "com.anthrophi.shae.food-guide", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for food guide action",
  keywords: ["food", "guide"],
  persistentIdentifier: "com.anthrophi.shae.food-guide",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What types of food are good for me?",
  needsSave: true
};

const foodGuideCombiningOpts = {
  activityType: "com.anthrophi.shae.food-guide-food-combining", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for food combining action",
  keywords: ["food", "guide", "combining"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-food-combining",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What types of food can I combine?",
  needsSave: true
};

const foodGuideCaloriesOpts = {
  activityType: "com.anthrophi.shae.food-guide-calories", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for Calories & Portions action",
  keywords: ["food", "guide", "calories"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-calories",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How many Calories should I be eating?",
  needsSave: true
};

const foodGuideEatingHabitsOpts = {
  activityType: "com.anthrophi.shae.food-guide-eating-habits", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for eating habits action",
  keywords: ["food", "guide", "habits"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-eating-habits",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "What are some good eating habits for me?",
  needsSave: true
};

const foodGuideVegetablesOpts = {
  activityType: "com.anthrophi.shae.food-guide-vegetables", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for vegetables action",
  keywords: ["food", "guide", "vegetables"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-vegetables",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat vegetables?",
  needsSave: true
};

const foodGuideGreenLeafyVegetablesOpts = {
  activityType: "com.anthrophi.shae.food-guide-green-leafy-vegetables", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for green leafy vegetables action",
  keywords: ["food", "guide", "vegetables", "green", "leafy"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-green-leafy-vegetables",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat green leafy vegetables?",
  needsSave: true
};

const foodGuideRootVegetablesOpts = {
  activityType: "com.anthrophi.shae.food-guide-root-vegetables", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for root vegetables action",
  keywords: ["food", "guide", "vegetables", "root"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-root-vegetables",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat root vegetables?",
  needsSave: true
};

const foodGuideBeansOpts = {
  activityType: "com.anthrophi.shae.food-guide-beans", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for beans action",
  keywords: ["food", "guide", "beans"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-beans",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat beans?",
  needsSave: true
};

const foodGuideFruitsOpts = {
  activityType: "com.anthrophi.shae.food-guide-fruit", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for fruits action",
  keywords: ["food", "guide", "fruit"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-fruit",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat fruits?",
  needsSave: true
};

const foodGuideDriedFruitsOpts = {
  activityType: "com.anthrophi.shae.food-guide-dried-fruit", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for dried fruits action",
  keywords: ["food", "guide", "fruit", "dried"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-dried-fruit",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat dried fruits?",
  needsSave: true
};

const foodGuideAnimalProteinsOpts = {
  activityType: "com.anthrophi.shae.food-guide-animal-proteins", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for animal proteins action",
  keywords: ["food", "guide", "animal", "proteins"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-animal-proteins",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat animal proteins?",
  needsSave: true
};

const foodGuideEggsOpts = {
  activityType: "com.anthrophi.shae.food-guide-eggs", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for eggs action",
  keywords: ["food", "guide", "eggs"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-eggs",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat eggs?",
  needsSave: true
};

const foodGuideWhiteMeatOpts = {
  activityType: "com.anthrophi.shae.food-guide-white-meat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for white meat action",
  keywords: ["food", "guide", "white", "meat"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-white-meat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat white meat?",
  needsSave: true
};

const foodGuideRedMeatOpts = {
  activityType: "com.anthrophi.shae.food-guide-red-meat", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for red meat action",
  keywords: ["food", "guide", "red", "meat"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-red-meat",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat red meat?",
  needsSave: true
};

const foodGuideWhiteFishOpts = {
  activityType: "com.anthrophi.shae.food-guide-white-fish", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for white fish action",
  keywords: ["food", "guide", "white", "fish"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-white-fish",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat white fish?",
  needsSave: true
};

const foodGuideOilyFishOpts = {
  activityType: "com.anthrophi.shae.food-guide-oily-fish", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for oily fish action",
  keywords: ["food", "guide", "oily", "fish"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-oily-fish",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat oily fish?",
  needsSave: true
};

const foodGuideShellfishOpts = {
  activityType: "com.anthrophi.shae.food-guide-shellfish", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for shellfish action",
  keywords: ["food", "guide", "shellfish"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-shellfish",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat shellfish?",
  needsSave: true
};

const foodGuideSeedsOpts = {
  activityType: "com.anthrophi.shae.food-guide-seeds", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for seeds action",
  keywords: ["food", "guide", "seeds"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-seeds",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat seeds?",
  needsSave: true
};

const foodGuideNutsOpts = {
  activityType: "com.anthrophi.shae.food-guide-nuts", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for nuts action",
  keywords: ["food", "guide", "nuts"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-nuts",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat nuts?",
  needsSave: true
};

const foodGuideNutButtersOpts = {
  activityType: "com.anthrophi.shae.food-guide-nut-butters", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for nut butters action",
  keywords: ["food", "guide", "nut", "butters"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-nut-butters",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat nut butters?",
  needsSave: true
};

const foodGuideSaltOpts = {
  activityType: "com.anthrophi.shae.food-guide-salt", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for salt action",
  keywords: ["food", "guide", "salt"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-salt",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat salt?",
  needsSave: true
};

const foodGuideOilsOpts = {
  activityType: "com.anthrophi.shae.food-guide-oils", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for oils action",
  keywords: ["food", "guide", "oils"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-oils",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat oils?",
  needsSave: true
};

const foodGuideSweetenersOpts = {
  activityType: "com.anthrophi.shae.food-guide-sweeteners", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for sweeteners action",
  keywords: ["food", "guide", "sweeteners"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-sweeteners",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat sweeteners?",
  needsSave: true
};

const foodGuideTeasOpts = {
  activityType: "com.anthrophi.shae.food-guide-teas", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for teas action",
  keywords: ["food", "guide", "teas"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-teas",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat teas?",
  needsSave: true
};

const foodGuideJuicesOpts = {
  activityType: "com.anthrophi.shae.food-guide-juices", // This activity type needs to be set in `NSUserActivityTypes` on the Info.plist
  title: "Create a shortcut for juices action",
  keywords: ["food", "guide", "juices"],
  persistentIdentifier: "com.anthrophi.shae.food-guide-juices",
  isEligibleForSearch: true,
  isEligibleForPrediction: true,
  suggestedInvocationPhrase: "How often should I eat juices?",
  needsSave: true
};


class SiriShortcuts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shortcuts: [],
      tabActive: 0
    };

    this.shortcuts = [];
  }

  async componentDidMount() {
    suggestShortcuts([workoutOpts, mealPlanOpts, naturalBrainFunctionOpts, idealVacationOpts, peopleToLookForOpts]);

    // const shortcuts = await getShortcuts();
    await this.getShortcuts();
    // console.log('shortcuts', shortcuts);
  }

  // onSiriButtonPress = async (activityType) => {
  //   try {
  //     let opts;
  //     if (activityType === 'com.anthrophi.shae.workout') {
  //       opts = workoutOpts;
  //     } else if (activityType === 'com.anthrophi.shae.mealplan') {
  //       opts = mealPlanOpts;
  //     } else if (activityType === 'com.anthrophi.shae.natural-brain-function') {
  //       opts = naturalBrainFunctionOpts;
  //     } else if (activityType === 'com.anthrophi.shae.ideal-vacation') {
  //       opts = idealVacationOpts;
  //     } else if (activityType === 'com.anthrophi.shae.people-to-look-for') {
  //       opts = peopleToLookForOpts;
  //     }
  //
  //     console.log('opts', opts.activityType, activityType);
  //
  //     // const opts = (activityType === 'com.anthrophi.shae.workout') ? workoutOpts
  //     //   : mealPlanOpts;
  //
  //     presentShortcut(opts, ({ status }) => {
  //       console.log(`I was ${status}`);
  //     });
  //   } catch (e) {
  //     // Can't get list on <iOS 12
  //     console.log('getShortcuts', e);
  //   }
  // }

  getItem = (title, text, activityType) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onSiriButtonPress(activityType)}>
        <View style={{width: width - 40, alignSelf: 'center'}}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemText}>{text}</Text>
          {(!this.state.shortcuts.includes(activityType)) ? (
            <Image style={{width: 19, height: 19, position: 'absolute', right: 0, top: 24}} source={require('../resources/icon/siri_plus.png')} />
          ) : (
            <Image style={{width: 13, height: 10, position: 'absolute', right: 0, top: 32}} source={require('../resources/icon/siri_checkmark.png')} />
          )}
          <View style={styles.divider} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  getShortcuts = async () => {
    const shortcuts = await getShortcuts();

    for (let i = 0; i < shortcuts.length; i++) {
      this.shortcuts.push(shortcuts[i].options.activityType);
    }

    this.setState({shortcuts: this.shortcuts});
    console.log('shortcuts', shortcuts);
  }

  onSiriButtonPress = async (activityType) => {
    try {
      let opts;
      if (activityType === 'com.anthrophi.shae.foodlist-nuts-to-eat') {
        opts = eatNutsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-vegetables-to-eat') {
        opts = eatVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fruits-to-eat') {
        opts = eatFruitsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-grains-to-eat') {
        opts = eatGrainsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-meats-to-eat') {
        opts = eatMeatsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-seafood-to-eat') {
        opts = eatSeafoodOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-herbs-to-eat') {
        opts = eatHerbsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-dairy-to-eat') {
        opts = eatDairyOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-sweets-to-eat') {
        opts = eatSweetsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fats-to-eat') {
        opts = eatFatsOpts;
      }

      else if (activityType === 'com.anthrophi.shae.foodlist-nuts-to-avoid') {
        opts = avoidNutsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-vegetables-to-avoid') {
        opts = avoidVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fruits-to-avoid') {
        opts = avoidFruitsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-grains-to-avoid') {
        opts = avoidGrainsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-meats-to-avoid') {
        opts = avoidMeatsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-seafood-to-avoid') {
        opts = avoidSeafoodOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-herbs-to-avoid') {
        opts = avoidHerbsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-dairy-to-avoid') {
        opts = avoidDairyOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-sweets-to-avoid') {
        opts = avoidSweetsOpts;
      } else if (activityType === 'com.anthrophi.shae.foodlist-fats-to-avoid') {
        opts = avoidFatsOpts;
      }

      else if (activityType === 'com.anthrophi.shae.foodtiming-breakfast-eat') {
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
      }

      else if (activityType === 'com.anthrophi.shae.mealplanner-today') {
        opts = mealPlannerTodayOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-tomorrow') {
        opts = mealPlannerTomorrowOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-this-week') {
        opts = mealPlannerThisWeekOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplanner-next-week') {
        opts = mealPlannerNextWeekOpts;
      }

      else if (activityType === 'com.anthrophi.shae.recipes-main-dishes') {
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
      }

      else if (activityType === 'com.anthrophi.shae.shopping-basket') {
        opts = shoppingBasketOpts;
      }

      else if (activityType === 'com.anthrophi.shae.food-preparation') {
        opts = foodPrepOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-fermented-foods') {
        opts = foodPrepFermentedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-steamed-foods') {
        opts = foodPrepSteamedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-raw-foods') {
        opts = foodPrepRawFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-juiced-foods') {
        opts = foodPrepJuicedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-baked-foods') {
        opts = foodPrepBakedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-boiled-foods') {
        opts = foodPrepBoiledFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-stir-fried-foods') {
        opts = foodPrepStirFriedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-sprouted-foods') {
        opts = foodPrepSproutedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-roasted-foods') {
        opts = foodPrepRoastedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-soaked-foods') {
        opts = foodPrepSoakedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-salt') {
        opts = foodPrepSaltOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-vinegar') {
        opts = foodPrepVinegarOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-oil') {
        opts = foodPrepOilOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-cold-drinks') {
        opts = foodPrepColdDrinksOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-cold-foods') {
        opts = foodPrepColdFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-frozen-foods') {
        opts = foodPrepFrozenFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-dehydrated-foods') {
        opts = foodPrepDehydratedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-broiled-foods') {
        opts = foodPrepBroiledFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-smoked-foods') {
        opts = foodPrepSmokedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-canned-foods') {
        opts = foodPrepCannedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-processed-foods') {
        opts = foodPrepProcessedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-deep-fried-foods') {
        opts = foodPrepDeepFriedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-breaded-foods') {
        opts = foodPrepBreadedFoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-baked-goods') {
        opts = foodPrepBakedGoodsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-smoothies') {
        opts = foodPrepSmoothiesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-broths') {
        opts = foodPrepBrothsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-preservatives') {
        opts = foodPrepPreservativesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-gluten') {
        opts = foodPrepGlutenOpts;
      } else if (activityType === 'com.anthrophi.shae.food-preparation-msg') {
        opts = foodPrepMsgOpts;
      }

      else if (activityType === 'com.anthrophi.shae.food-guide') {
        opts = foodGuideOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-food-combining') {
        opts = foodGuideCombiningOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-calories') {
        opts = foodGuideCaloriesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-eating-habits') {
        opts = foodGuideEatingHabitsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-vegetables') {
        opts = foodGuideVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-green-leafy-vegetables') {
        opts = foodGuideGreenLeafyVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-root-vegetables') {
        opts = foodGuideRootVegetablesOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-beans') {
        opts = foodGuideBeansOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-fruit') {
        opts = foodGuideFruitsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-dried-fruit') {
        opts = foodGuideDriedFruitsOpts;
      } else if (activityType === 'com.anthrophi.shae.food-guide-animal-proteins') {
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

      else if (activityType === 'com.anthrophi.shae.workout') {
        opts = workoutOpts;
      } else if (activityType === 'com.anthrophi.shae.mealplan') {
        opts = mealPlanOpts;
      } else if (activityType === 'com.anthrophi.shae.natural-brain-function') {
        opts = naturalBrainFunctionOpts;
      } else if (activityType === 'com.anthrophi.shae.ideal-vacation') {
        opts = idealVacationOpts;
      } else if (activityType === 'com.anthrophi.shae.people-to-look-for') {
        opts = peopleToLookForOpts;
      }

      console.log('opts', opts.activityType, activityType);

      // const opts = (activityType === 'com.anthrophi.shae.workout') ? workoutOpts
      //   : mealPlanOpts;

      presentShortcut(opts, ({ status }) => {
        console.log(`I was ${status}`);
        this.getShortcuts();
      });
    } catch (e) {
      // Can't get list on <iOS 12
      console.log('getShortcuts', e);
    }
  }

  render() {
    return (
      <View>
        {/*<TouchableWithoutFeedback onPress={() => this.onSiriButtonPress('com.anthrophi.shae.workout')}>
          <View style={{flexDirection: 'row', marginTop: 22, marginBottom: 21}}>
            <View>
              <Text style={styles.title}>Start Workout</Text>
              <Text style={styles.text}>Access your workout plan with Siri</Text>
            </View>
            <Image style={styles.icon} source={require('../resources/icon/plus_icon.png')} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.separator} />

        <TouchableWithoutFeedback onPress={() => this.onSiriButtonPress('com.anthrophi.shae.mealplan')}>
          <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 21}}>
            <View>
              <Text style={styles.title}>Show Today’s Meal</Text>
              <Text style={styles.text}>Access your meal plan with Siri</Text>
            </View>
            <Image style={styles.icon} source={require('../resources/icon/plus_icon.png')} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.separator} />

        <TouchableWithoutFeedback onPress={() => this.onSiriButtonPress('com.anthrophi.shae.natural-brain-function')}>
          <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 21}}>
            <View>
              <Text style={styles.title}>Natural Brain Function</Text>
              <Text style={styles.text}>Access natural brain function with Siri</Text>
            </View>
            <Image style={styles.icon} source={require('../resources/icon/plus_icon.png')} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.separator} />

        <TouchableWithoutFeedback onPress={() => this.onSiriButtonPress('com.anthrophi.shae.ideal-vacation')}>
          <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 21}}>
            <View>
              <Text style={styles.title}>My Ideal Vacation</Text>
              <Text style={styles.text}>Access your ideal vacation with Siri</Text>
            </View>
            <Image style={styles.icon} source={require('../resources/icon/plus_icon.png')} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.separator} />

        <TouchableWithoutFeedback onPress={() => this.onSiriButtonPress('com.anthrophi.shae.people-to-look-for')}>
          <View style={{flexDirection: 'row', marginTop: 16, marginBottom: 21}}>
            <View>
              <Text style={styles.title}>People to Look For</Text>
              <Text style={styles.text}>Access people to look for with Siri</Text>
            </View>
            <Image style={styles.icon} source={require('../resources/icon/plus_icon.png')} />
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.separator} /> */}

        <View style={styles.container}>
        <ScrollView horizontal={true} bounces={false} contentContainerStyle={{shadowColor: '#d3d5d8', shadowOffset: { width: 0, height: 0.5 }, shadowOpacity: 1}}>
          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 0}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff', }}>
              <Text style={(this.state.tabActive === 0) ? styles.tabActiveText : styles.tabInactiveText}>
                Food
              </Text>

              {(this.state.tabActive === 0) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 1}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 1) ? styles.tabActiveText : styles.tabInactiveText}>
                Food Time
              </Text>

              {(this.state.tabActive === 1) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 2}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 2) ? styles.tabActiveText : styles.tabInactiveText}>
                Meal Planner
              </Text>

              {(this.state.tabActive === 2) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 3}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 3) ? styles.tabActiveText : styles.tabInactiveText}>
                Recipes
              </Text>

              {(this.state.tabActive === 3) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 4}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 4) ? styles.tabActiveText : styles.tabInactiveText}>
                Shopping Basket
              </Text>

              {(this.state.tabActive === 4) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 5}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 5) ? styles.tabActiveText : styles.tabInactiveText}>
                Food Preparation
              </Text>

              {(this.state.tabActive === 5) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 6}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 6) ? styles.tabActiveText : styles.tabInactiveText}>
                Food Guide
              </Text>

              {(this.state.tabActive === 6) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({tabActive: 7}, () => {this.scrollviewVertical.scrollTo({x: 0, y: 0, animated: true})})}>
            <View style={{height: 48, backgroundColor: '#fafcff'}}>
              <Text style={(this.state.tabActive === 7) ? styles.tabActiveText : styles.tabInactiveText}>
                Other
              </Text>

              {(this.state.tabActive === 7) && (
                <View style={styles.tabIndicator} />
              )}
            </View>
          </TouchableWithoutFeedback>

        </ScrollView>
        </View>

        <ScrollView ref={ref => this.scrollviewVertical = ref}>
          {(this.state.tabActive === 0) && (
            <View>
              <View style={{width, height: 36, backgroundColor: 'rgba(36,76,138,0.06)'}}>
                <Text style={styles.categoryText}>
                  EAT
                </Text>
              </View>
              {this.getItem('Nuts', 'What nuts can I eat?', 'com.anthrophi.shae.foodlist-nuts-to-eat')}
              {this.getItem('Vegetables', 'What vegetables can I eat?', 'com.anthrophi.shae.foodlist-vegetables-to-eat')}
              {this.getItem('Fruits', 'What fruits can I eat?', 'com.anthrophi.shae.foodlist-fruits-to-eat')}
              {this.getItem('Grains', 'What grains can I eat?', 'com.anthrophi.shae.foodlist-grains-to-eat')}
              {this.getItem('Meats', 'What meats can I eat?', 'com.anthrophi.shae.foodlist-meats-to-eat')}
              {this.getItem('Seafood', 'What seafood can I eat?', 'com.anthrophi.shae.foodlist-seafood-to-eat')}
              {this.getItem('Drinks', 'What drinks can I eat?', 'com.anthrophi.shae.foodlist-drinks-to-eat')}
              {this.getItem('Herbs', 'What herbs can I eat?', 'com.anthrophi.shae.foodlist-herbs-to-eat')}
              {this.getItem('Dairy', 'What dairy can I eat?', 'com.anthrophi.shae.foodlist-dairy-to-eat')}
              {this.getItem('Sweets', 'What sweets can I eat?', 'com.anthrophi.shae.foodlist-sweets-to-eat')}
              {this.getItem('Fats', 'What fats can I eat?', 'com.anthrophi.shae.foodlist-fats-to-eat')}

              <View style={{width, height: 36, backgroundColor: 'rgba(36,76,138,0.06)'}}>
                <Text style={styles.categoryText}>
                  AVOID
                </Text>
              </View>
              {this.getItem('Nuts', 'What nuts should I avoid?', 'com.anthrophi.shae.foodlist-nuts-to-avoid')}
              {this.getItem('Vegetables', 'What vegetables should I avoid?', 'com.anthrophi.shae.foodlist-vegetables-to-avoid')}
              {this.getItem('Fruits', 'What fruits should I avoid?', 'com.anthrophi.shae.foodlist-fruits-to-avoid')}
              {this.getItem('Grains', 'What grains should I avoid?', 'com.anthrophi.shae.foodlist-grains-to-avoid')}
              {this.getItem('Meats', 'What meats should I avoid?', 'com.anthrophi.shae.foodlist-meats-to-avoid')}
              {this.getItem('Seafood', 'What seafood should I avoid?', 'com.anthrophi.shae.foodlist-seafood-to-avoid')}
              {this.getItem('Drinks', 'What drinks should I avoid?', 'com.anthrophi.shae.foodlist-drinks-to-avoid')}
              {this.getItem('Herbs', 'What herbs should I avoid?', 'com.anthrophi.shae.foodlist-herbs-to-avoid')}
              {this.getItem('Dairy', 'What dairy should I avoid?', 'com.anthrophi.shae.foodlist-dairy-to-avoid')}
              {this.getItem('Sweets', 'What sweets should I avoid?', 'com.anthrophi.shae.foodlist-sweets-to-avoid')}
              {this.getItem('Fats', 'What fats can should I avoid?', 'com.anthrophi.shae.foodlist-fats-to-avoid')}
            </View>
          )}

          {(this.state.tabActive === 1) && (
            <View>
              {this.getItem('Breakfast', 'What time should I eat breakfast?', 'com.anthrophi.shae.foodtiming-breakfast-eat')}
              {this.getItem('Lunch', 'What time should I eat lunch?', 'com.anthrophi.shae.foodtiming-lunch-eat')}
              {this.getItem('Dinner', 'What time should I eat dinner?', 'com.anthrophi.shae.foodtiming-dinner-eat')}
              {this.getItem('Snack', 'What time should I eat snack?', 'com.anthrophi.shae.foodtiming-snack-eat')}
              {this.getItem('Have a drink', 'What time should I have a drink?', 'com.anthrophi.shae.foodtiming-drink-eat')}
              {this.getItem('Avoid eating', 'What time should I avoid eating?', 'com.anthrophi.shae.foodtiming-avoid-eat')}
              {this.getItem('Avoid snacking', 'What time should I avoid snacking?', 'com.anthrophi.shae.foodtiming-avoid-snack')}
            </View>
          )}

          {(this.state.tabActive === 2) && (
            <View>
              {this.getItem('Today', 'What should I eat today?', 'com.anthrophi.shae.mealplanner-today')}
              {this.getItem('Tomorrow', 'What should I eat tomorrow?', 'com.anthrophi.shae.mealplanner-tomorrow')}
              {this.getItem('This week', 'What should I eat this week?', 'com.anthrophi.shae.mealplanner-this-week')}
              {this.getItem('Next week', 'What should I eat next week?', 'com.anthrophi.shae.mealplanner-next-week')}
            </View>
          )}

          {(this.state.tabActive === 3) && (
            <View>
              {this.getItem('Main dishes', 'Show me some recipe ideas for main dishes', 'com.anthrophi.shae.recipes-main-dishes')}
              {this.getItem('Desserts', 'Show me some recipe ideas for desserts', 'com.anthrophi.shae.recipes-desserts')}
              {this.getItem('Side dishes', 'Show me some recipe ideas for side dishes', 'com.anthrophi.shae.recipes-side-dishes')}
              {this.getItem('Appetizers', 'Show me some recipe ideas for appetizers', 'com.anthrophi.shae.recipes-appetizers')}
              {this.getItem('Salads', 'Show me some recipe ideas for salads', 'com.anthrophi.shae.recipes-salads')}
              {this.getItem('Breads', 'Show me some recipe ideas for breads', 'com.anthrophi.shae.recipes-breads')}
              {this.getItem('Soups', 'Show me some recipe ideas for main soups', 'com.anthrophi.shae.recipes-soups')}
              {this.getItem('Beverages', 'Show me some recipe ideas for beverages', 'com.anthrophi.shae.recipes-beverages')}
              {this.getItem('Cocktails', 'Show me some recipe ideas for cocktails', 'com.anthrophi.shae.recipes-cocktails')}
              {this.getItem('Snacks', 'Show me some recipe ideas for snacks', 'com.anthrophi.shae.recipes-snacks')}
              {this.getItem('Breakfast', 'Show me some recipe ideas for breakfast', 'com.anthrophi.shae.recipes-breakfast')}
              {this.getItem('Lunch', 'Show me some recipe ideas for lunch', 'com.anthrophi.shae.recipes-lunch')}
              {this.getItem('Dinner', 'Show me some recipe ideas for dinner', 'com.anthrophi.shae.recipes-dinner')}
            </View>
          )}

          {(this.state.tabActive === 4) && (
            <View>
              {this.getItem('Shopping Basket', 'What groceries should I buy?', 'com.anthrophi.shae.shopping-basket')}
            </View>
          )}

          {(this.state.tabActive === 5) && (
            <View>
              {this.getItem('Food Preparation', 'How should I prepare my food?', 'com.anthrophi.shae.food-preparation')}
              {this.getItem('Fermented foods', 'Are fermented foods good for me?', 'com.anthrophi.shae.food-preparation-fermented-foods')}
              {this.getItem('Steamed foods', 'Are steamed foods good for me?', 'com.anthrophi.shae.food-preparation-steamed-foods')}
              {this.getItem('Raw foods', 'Are raw foods good for me?', 'com.anthrophi.shae.food-preparation-raw-foods')}
              {this.getItem('Juiced foods', 'Are juiced foods good for me?', 'com.anthrophi.shae.food-preparation-juiced-foods')}
              {this.getItem('Baked foods', 'Are baked foods good for me?', 'com.anthrophi.shae.food-preparation-baked-foods')}
              {this.getItem('Boiled foods', 'Are boiled foods good for me?', 'com.anthrophi.shae.food-preparation-boiled-foods')}
              {this.getItem('Stir fried foods', 'Are stir fried foods good for me?', 'com.anthrophi.shae.food-preparation-stir-fried-foods')}
              {this.getItem('Sprouted foods', 'Are sprouted foods good for me?', 'com.anthrophi.shae.food-preparation-sprouted-foods')}
              {this.getItem('Roasted foods', 'Are roasted foods good for me?', 'com.anthrophi.shae.food-preparation-roasted-foods')}
              {this.getItem('Soaked foods', 'Are soaked foods good for me?', 'com.anthrophi.shae.food-preparation-soaked-foods')}
              {this.getItem('Preserved foods (salt)', 'Are preserved foods (salt) good for me?', 'com.anthrophi.shae.food-preparation-salt')}
              {this.getItem('Preserved foods (vinegar)', 'Are preserved foods (vinegar) good for me?', 'com.anthrophi.shae.food-preparation-vinegar')}
              {this.getItem('Preserved foods (oil)', 'Are preserved foods (oil) good for me?', 'com.anthrophi.shae.food-preparation-oil')}
              {this.getItem('Cold drinks', 'Are cold drinks good for me?', 'com.anthrophi.shae.food-preparation-cold-drinks')}
              {this.getItem('Cold foods', 'Are cold foods good for me?', 'com.anthrophi.shae.food-preparation-cold-foods')}
              {this.getItem('Frozen foods', 'Are frozen foods good for me?', 'com.anthrophi.shae.food-preparation-frozen-foods')}
              {this.getItem('Dehydrated foods', 'Are dehydrated foods good for me?', 'com.anthrophi.shae.food-preparation-dehydrated-foods')}
              {this.getItem('Broiled foods', 'Are broiled foods good for me?', 'com.anthrophi.shae.food-preparation-broiled-foods')}
              {this.getItem('Smoked foods', 'Are smoked foods good for me?', 'com.anthrophi.shae.food-preparation-smoked-foods')}
              {this.getItem('Canned foods', 'Are canned foods good for me?', 'com.anthrophi.shae.food-preparation-canned-foods')}
              {this.getItem('Processed foods', 'Are processed foods good for me?', 'com.anthrophi.shae.food-preparation-processed-foods')}
              {this.getItem('Deep fried foods', 'Are deep fried foods good for me?', 'com.anthrophi.shae.food-preparation-deep-fried-foods')}
              {this.getItem('Breaded foods', 'Are breaded foods good for me?', 'com.anthrophi.shae.food-preparation-breaded-foods')}
              {this.getItem('Baked goods', 'Are baked goods good for me?', 'com.anthrophi.shae.food-preparation-baked-goods')}
              {this.getItem('Smoothies', 'Are smoothies good for me?', 'com.anthrophi.shae.food-preparation-smoothies')}
              {this.getItem('Broths', 'Are broths good for me?', 'com.anthrophi.shae.food-preparation-broths')}
              {this.getItem('Preservatives', 'Are preservatives good for me?', 'com.anthrophi.shae.food-preparation-preservatives')}
              {this.getItem('Gluten', 'Is gluten good for me?', 'com.anthrophi.shae.food-preparation-gluten')}
              {this.getItem('MSG', 'Is MSG good for me?', 'com.anthrophi.shae.food-preparation-msg')}
            </View>
          )}

          {(this.state.tabActive === 6) && (
            <View>
              {this.getItem('Food Guide', 'What types of food are good for me?', 'com.anthrophi.shae.food-guide')}
              {this.getItem('Food Combining', 'What types of food can I combine?', 'com.anthrophi.shae.food-guide-food-combining')}
              {this.getItem('Calories & Portions', 'How many Calories should I be eating?', 'com.anthrophi.shae.food-guide-calories')}
              {this.getItem('Eating Habits', 'What are some good eating habits for me?', 'com.anthrophi.shae.food-guide-eating-habits')}
              {this.getItem('Vegetables', 'How often should I eat vegetables?', 'com.anthrophi.shae.food-guide-vegetables')}
              {this.getItem('Green leafy vegetables', 'How often should I eat green leafy vegetables?', 'com.anthrophi.shae.food-guide-green-leafy-vegetables')}
              {this.getItem('Root vegetables', 'How often should I eat root vegetables?', 'com.anthrophi.shae.food-guide-root-vegetables')}
              {this.getItem('Beans', 'How often should I eat beans?', 'com.anthrophi.shae.food-guide-beans')}
              {this.getItem('Fruits', 'How often should I eat fruits?', 'com.anthrophi.shae.food-guide-fruit')}
              {this.getItem('Dried fruits', 'How often should I eat dried fruits?', 'com.anthrophi.shae.food-guide-dried-fruit')}
              {this.getItem('Animal proteins', 'How often should I eat animal proteins?', 'com.anthrophi.shae.food-guide-animal-proteins')}
              {this.getItem('Eggs', 'How often should I eat eggs?', 'com.anthrophi.shae.food-guide-eggs')}
              {this.getItem('White meat', 'How often should I eat white meat?', 'com.anthrophi.shae.food-guide-white-meat')}
              {this.getItem('Red meat', 'How often should I eat red meat?', 'com.anthrophi.shae.food-guide-red-meat')}
              {this.getItem('White fish', 'How often should I eat white fish?', 'com.anthrophi.shae.food-guide-white-fish')}
              {this.getItem('Oily fish', 'How often should I eat oily fish?', 'com.anthrophi.shae.food-guide-oily-fish')}
              {this.getItem('Shellfish', 'How often should I eat shellfish?', 'com.anthrophi.shae.food-guide-shellfish')}
              {this.getItem('Seeds', 'How often should I eat seeds?', 'com.anthrophi.shae.food-guide-seeds')}
              {this.getItem('Nuts', 'How often should I eat nuts?', 'com.anthrophi.shae.food-guide-nuts')}
              {this.getItem('Nut butters', 'How often should I eat nut butters?', 'com.anthrophi.shae.food-guide-nut-butters')}
              {this.getItem('Salt', 'How often should I eat salt?', 'com.anthrophi.shae.food-guide-salt')}
              {this.getItem('Oils', 'How often should I eat oils?', 'com.anthrophi.shae.food-guide-oils')}
              {this.getItem('Sweeteners', 'How often should I eat sweeteners?', 'com.anthrophi.shae.food-guide-sweeteners')}
              {this.getItem('Teas', 'How often should I eat teas?', 'com.anthrophi.shae.food-guide-teas')}
              {this.getItem('Juices', 'How often should I eat juices?', 'com.anthrophi.shae.food-guide-juices')}
            </View>
          )}

          {(this.state.tabActive === 7) && (
            <View>
              {this.getItem('Start Workout', 'Access your workout plan with Siri', 'com.anthrophi.shae.workout')}
              {this.getItem('Show Today’s Meal', 'Access your meal plan with Siri', 'com.anthrophi.shae.mealplan')}
              {this.getItem('Natural Brain Function', 'Access natural brain function with Siri', 'com.anthrophi.shae.natural-brain-function')}
              {this.getItem('My Ideal Vacation', 'Access your ideal vacation with Siri', 'com.anthrophi.shae.ideal-vacation')}
              {this.getItem('People to Look For', 'Access people to look for with Siri', 'com.anthrophi.shae.people-to-look-for')}
            </View>
          )}

          <View style={{height: 49}} />
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 49,
    overflow: 'visible'
    // marginHorizontal: 20
  },
  separator: {
    height: 1,
    backgroundColor: '#d8d7de'
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    color: '#262a2f',
  },
  text: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    marginTop: 2,
    color: '#6a6f73'
  },
  icon: {
    width: 19,
    height: 19,
    position: 'absolute',
    top: 10,
    right: 0
  },
  tabActiveText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    letterSpacing: -0.08,
    color: '#00a8eb',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 17
  },
  tabInactiveText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    letterSpacing: -0.08,
    color: '#8a8a8f',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 17
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: '#00a8eb',
    position: 'absolute',
    bottom: 0
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'SFProText-Semibold',
    letterSpacing: -0.21,
    color: '#244c8a',
    marginLeft: 20,
    marginTop: 11
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    color: '#363a3d',
    marginTop: 20
  },
  itemText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    marginTop: 3,
    color: '#8d9397'
  },
  divider: {
    width: width - 40,
    alignSelf: 'center',
    height: 0.5,
    backgroundColor: '#d8d7de',
    marginTop: 20
  },
});


export default SiriShortcuts;

import React, {Component} from 'react';
import {
  Animated,
  FlatList,
  StatusBar,
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import {BoxShadow} from 'react-native-shadow';
import {Picker} from 'react-native-wheel-pick';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import Swipeout from 'react-native-swipeout';

import FoodTabsCard from '../components/FoodTabsCard';
import getRateColor, {getTasteColor} from '../utils/getRateColor';
import * as shaefitApi from '../API/shaefitAPI';
import LoadingIndicator from '../components/LoadingIndicator';
// import {getUserDetails} from '../../data/db/Db';

const {height, width} = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// let Fraction = require("fractional").Fraction;
let Fraction = require('fraction.js');

const shadowOpt = {
  width: width - 40,
  height: 48,
  color: '#273849',
  border: 18,
  radius: 10,
  opacity: 0.06,
  x: 0,
  y: 6,
  style: {marginTop: 24, alignSelf: 'center'},
};

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: 'bottom', // optional
  useNativeDriver: true, // optional
});

class IngredientsListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSwiped: false,
    };
  }

  onIngredientPress = (id, isShoppingTipsExists) => {
    this.setState({isSwiped: !this.state.isSwiped});
  };

  onDelete = () => {
    this.props.onIngredientDelete(this.props.index);
  };

  isFloat = (n) => {
    return n === +n && n !== (n | 0);
  };

  render() {
    const prep =
      this.props.item.prep !== null
        ? ' ' +
          (this.props.item.prep.charAt(0).toLowerCase() +
            this.props.item.prep.slice(1))
        : '';
    const unit =
      this.props.item.unit !== null
        ? this.props.item.unit.charAt(0).toLowerCase() +
          this.props.item.unit.slice(1) +
          prep
        : '' + prep;

    const rate = getRateColor(this.props.item.user_importance_val, width - 80);
    const rateColor = rate.color;

    const swipeoutBtns = [
      {
        backgroundColor: 'rgb(235,75,75)',
        component: (
          <View
            style={{
              width: 19,
              height: 25,
              padding: 0,
              margin: 0,
              marginLeft: 34.5,
              marginRight: 34.5,
              marginTop: 13,
              opacity: 1,
            }}>
            <Image
              source={require('../resources/icon/trashIcon.png')}
              style={{width: 19, height: 25}}
            />
          </View>
        ),
        onPress: () => {
          this.onDelete();
        },
      },
    ];

    let servings = this.props.servings;
    if (servings === '1/4') {
      servings = 0.25;
    } else if (servings === '1/8') {
      servings = 0.125;
    } else if (servings === '1/3') {
      servings = 0.33;
    } else if (servings === '1/2') {
      servings = 0.5;
    } else if (servings === '2/3') {
      servings = 0.66;
    } else if (servings === '3/4') {
      servings = 0.75;
    } else {
      servings = parseFloat(servings);
    }

    let amount = this.props.item.amount;
    if (amount === '1/4') {
      amount = 0.25;
    } else if (amount === '1/8') {
      amount = 0.125;
    } else if (amount === '1/3') {
      amount = 0.33;
    } else if (amount === '1/2') {
      amount = 0.5;
    } else if (amount === '2/3') {
      amount = 0.66;
    } else if (amount === '3/4') {
      amount = 0.75;
    } else {
      amount = parseFloat(amount);
    }

    let quantity = 0;
    if (Number.isInteger((servings * amount) / this.props.serves)) {
      quantity = parseInt((servings * amount) / this.props.serves);
    } else if (
      this.props.item.unit === 'grams' ||
      this.props.item.unit === 'millilitres'
    ) {
      quantity = Math.round((servings * amount) / this.props.serves);
    } else {
      // quantity = parseFloat(
      //   (servings * parseFloat(this.props.item.amount_decimal)) /
      //     this.props.serves
      // );

      quantity = parseFloat((servings * amount) / this.props.serves);

      quantity = new Fraction(quantity).simplify(0.015).toFraction(true);

      if (quantity.includes('1/7')) {
        quantity = quantity.replace('1/7', '1/8');
      } else if (quantity.includes('13/25')) {
        quantity = quantity.replace('13/25', '1/2');
      } else if (quantity.includes('7/11')) {
        quantity = quantity.replace('7/11', '2/3');
      } else if (quantity.includes('13/20')) {
        quantity = quantity.replace('13/20', '2/3');
      } else if (quantity.includes('3/10')) {
        quantity = quantity.replace('3/10', '1/3');
      } else if (quantity.includes('7/9')) {
        quantity = quantity.replace('7/9', '2/3');
      } else if (quantity.includes('24/25')) {
        quantity = quantity.split(' ');
        quantity = parseInt(quantity[0]) + 1;
      } else if (quantity.includes('10/11')) {
        quantity = quantity.split(' ');
        quantity = parseInt(quantity[0]) + 1;
      } else if (quantity.includes('5/8')) {
        quantity = quantity.replace('5/8', '2/3');
      } else if (quantity.includes('2/7')) {
        quantity = quantity.replace('2/7', '1/3');
      } else if (quantity.includes('15/16')) {
        quantity = quantity.split(' ');
        quantity = parseInt(quantity[0]) + 1;
      } else if (quantity.includes('3/5')) {
        quantity = quantity.replace('3/5', '2/3');
      } else if (quantity.includes('49/50')) {
        quantity = quantity.split(' ');
        quantity = parseInt(quantity[0]) + 1;
      } else if (quantity.includes('5/16')) {
        quantity = quantity.replace('5/16', '1/3');
      } else if (quantity.includes('3/8')) {
        quantity = quantity.replace('3/8', '1/3');
      } else if (quantity.includes('7/8')) {
        quantity = quantity.split(' ');
        quantity = parseInt(quantity[0]) + 1;
      } else if (quantity.includes('3/7')) {
        quantity = quantity.replace('3/7', '1/2');
      } else if (quantity.includes('4/13')) {
        quantity = quantity.replace('4/13', '1/3');
      } else if (quantity.includes('4/7')) {
        quantity = quantity.replace('4/7', '2/3');
      } else if (quantity.includes('32/33')) {
        quantity = quantity.split(' ');
        quantity = parseInt(quantity[0]) + 1;
      } else if (quantity.includes('2/9')) {
        quantity = quantity.replace('2/9', '1/4');
      } else if (quantity.includes('1/25')) {
        quantity = quantity.replace('1/25', '1/24');
      } else if (quantity.includes('1/33')) {
        quantity = quantity.replace('1/33', '1/32');
      }

      console.log(
        'IngredientsListItem',
        this.props.item,
        this.props.servings,
        servings,
        amount,
        quantity,
      );

      // if (quantity.n > quantity.d) {
      //   quantity =
      //     quantity.n -
      //     quantity.d +
      //     " " +
      //     (quantity.n - quantity.d) +
      //     "/" +
      //     quantity.d;
      // } else {
      //   quantity = quantity.n + "/" + quantity.d;
      // }
    }

    //
    // if (quantity.denominator.toString().length >= 3) {
    //   quantity = new Fraction(
    //     parseFloat((servings * parseFloat(amount)) / this.props.serves)
    //   );
    // }

    // if (quantity.numerator === 17 && quantity.denominator === 100) {
    //   quantity = "1/6";
    // } else if (quantity.numerator === 33 && quantity.denominator === 100) {
    //   quantity = "1/3";
    // } else if (quantity.numerator === 67 && quantity.denominator === 100) {
    //   quantity = "2/3";
    // } else if (quantity.numerator === 33 && quantity.denominator === 50) {
    //   quantity = "2/3";
    // } else if (quantity.numerator === 19 && quantity.denominator === 100) {
    //   quantity = "1/5";
    // } else if (quantity.numerator === 99 && quantity.denominator === 100) {
    //   quantity = "1";
    // } else if (quantity.numerator === 8 && quantity.denominator === 25) {
    //   quantity = "1/3";
    // } else if (quantity.numerator === 19 && quantity.denominator === 50) {
    //   quantity = "1/3";
    // } else if (quantity.numerator === 13 && quantity.denominator === 100) {
    //   quantity = "1/8";
    // } else if (quantity.numerator === 3 && quantity.denominator === 50) {
    //   quantity = "1/16";
    // }

    return (
      <Swipeout
        right={swipeoutBtns}
        backgroundColor="rgb(255,255,255)"
        buttonWidth={88}
        style={{borderRadius: 0}}
        onOpen={() => this.setState({isSwiped: true})}
        onClose={() => this.setState({isSwiped: false})}
        openRight={this.state.isSwiped}>
        <View>
          <TouchableWithoutFeedback onPress={this.onIngredientPress}>
            <View style={styles.ingredientsContainer}>
              <View style={[styles.circle, {backgroundColor: rateColor}]} />

              <Text style={[styles.ingredientsText, {marginRight: 24}]}>
                {quantity + ' ' + unit.trim()}
                <Text
                  style={[
                    styles.ingredientsText,
                    {fontFamily: 'SFProText-Medium', fontWeight: '500'},
                  ]}>
                  {' '}
                  {this.props.item.food_name}
                </Text>
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Swipeout>
    );
  }
}

class RecipeDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      isMetric: true,
      scrollY: false,
      isLiked: false,
      data: null,

      isServingsExpanded: false,
      servings: '1',
      servings2: '1',
      portionsSize: 'medium',
      foodUnits: [],
      portionSizes: [
        'Millilitre',
        'Gram',
        'Kilogram',
        'Ounce',
        'Cup',
        'Pound',
        'Teaspoon',
        'Tablespoon',
        'Pint',
        'Quart',
        'Liter',
        'Gallon',
        'Whole',
        'Clove',
        'Head',
        'Stick',
        'Dice',
        'Pat',
        'Slice',
        'Piece',
        'Dollop',
        'Handful',
        'Fistful',
        'Bowlful',
        'Can',
        'Jar',
        'Pinch',
        'Large',
        'Medium',
        'Small',
        'Premade',
        'Sprig',
        'Stem',
        'Leaf',
        'Wedge',
        'Rack',
        'Stalk',
        'Drop',
        'Scoop',
        'Sheet',
        'Packet',
        'Serving',
      ],
      foodArray: [],
      isLoading: false,
    };

    this.scroll = new Animated.Value(0);
    this.headerY = Animated.multiply(
      Animated.diffClamp(this.scroll, 0, 80),
      -1,
    );

    this.rateColor = null;
    this.rateWidth = null;
    this.id = this.props.id;
  }

  async UNSAFE_componentWillMount() {
    const rate = getRateColor(this.props.data.importance_val, width - 40);

    this.rateColor = rate.color;
    this.rateWidth = rate.width;

    console.log('rate', rate);

    const promise1 = this.getUserDetails();
    const promise2 = this.getIngredients(this.props.data.id);
    const promise3 = this.getFoodUnits();

    Promise.all([promise1, promise2, promise3]).then((values) => {
      console.log('promises resolved', values);
      this.setState({
        servings: '1', //this.props.data.serves.toString(),
        servings2: '1', //this.props.data.serves.toString(),
      });
    });
  }

  getUserDetails = async () => {
    let unit = await shaefitApi.getUserDetails();
    unit = unit.profile.unit;

    this.setState({isMetric: unit === 'standard' ? false : true});
  };

  isFloat = (n) => {
    return n === +n && n !== (n | 0);
  };

  getIngredients = async (id) => {
    let data = await shaefitApi.getIngredients(this.props.data.id);
    console.log('getIngredients data', data);

    for (let i = 0; i < data.length; i++) {
      // if (data[i].amount === "1/2") {
      //   data[i].amount = "1";
      // }

      let amount = 0;
      if (this.isFloat(data[i].amount)) {
        amount = data[i].amount;
      } else {
        amount = data[i].amount.split(' ');
        if (amount.length === 1) {
          if (amount[0] === '1/4') {
            amount = 0.25;
          } else if (amount[0] === '1/8') {
            amount = 0.125;
          } else if (amount[0] === '1/3') {
            amount = 0.33;
          } else if (amount[0] === '1/2') {
            amount = 0.5;
          } else if (amount[0] === '2/3') {
            amount = 0.66;
          } else if (amount[0] === '3/4') {
            amount = 0.75;
          }
        } else {
          let fraction = 0;
          if (amount[1] === '1/4') {
            fraction = 0.25;
          } else if (amount[1] === '1/8') {
            fraction = 0.125;
          } else if (amount[1] === '1/3') {
            fraction = 0.33;
          } else if (amount[1] === '1/2') {
            fraction = 0.5;
          } else if (amount[1] === '2/3') {
            fraction = 0.66;
          } else if (amount[1] === '3/4') {
            fraction = 0.75;
          }

          amount = parseInt(amount[0]) + fraction;
        }

        data[i].amount = amount;
      }
    }

    console.log('getIngredients data', data);

    this.setState({ingredients: data});
  };

  getFoodUnits = async () => {
    const foodUnits = await shaefitApi.getFoodUnits();
    let portionSizes = [];
    for (let i = 0; i < foodUnits.length; i++) {
      portionSizes.push(foodUnits[i].name);
    }
    this.setState({portionSizes, foodUnits});
    console.log('foodUnits', foodUnits);
    console.log('portionSizes', portionSizes);
  };

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    if (
      typeof nextProps.newFood !== 'undefined' &&
      nextProps.newFood !== this.props.newFood
    ) {
      console.log(
        'componentWillReceiveProps nextProps.newFood',
        nextProps.newFood,
      );

      let amount = nextProps.newFood.amount;
      if (amount === 0.25) {
        amount = '1/4';
      } else if (amount === 0.125) {
        amount = '1/8';
      } else if (amount === 0.33) {
        amount = '1/3';
      } else if (amount === 0.5) {
        amount = '1/2';
      } else if (amount === 0.66) {
        amount = '2/3';
      } else if (amount === 0.75) {
        amount = '3/4';
      }

      let array = this.state.ingredients;
      array.push({
        id: nextProps.newFood.id,
        food_id: nextProps.newFood.id,
        // amount: nextProps.newFood.amount,
        amount: amount,
        amount_decimal: nextProps.newFood.amount + '.0000',
        sort_order: array.length + 1,
        food_name: nextProps.newFood.name,
        is_shopping_tips_exists: nextProps.newFood.is_shopping_tips_exists,
        food_imp_value: nextProps.newFood.food_category,
        prep: null,
        unit: nextProps.newFood.unit.name,
        user_importance_val: nextProps.newFood.user_importance_val,
        user_importance_text: nextProps.newFood.user_important_text,
        unitObject: nextProps.newFood.unit,
      });

      this.setState({ingredients: array});
    }
  }

  onIngredientPress = (id, isShoppingTipsExists) => {
    // try {
    //   this.props.navigation.navigate('FoodContent', {id, isShoppingTipsExists});
    // } catch (err) {
    //   this.setState(() => { throw err; })
    // }
  };

  onIngredientDelete = (index) => {
    let array = this.state.ingredients;
    array.splice(index, 1);

    this.setState({ingredients: array});
  };

  onServingsPress = () => {
    this.setState({isServingsExpanded: !this.state.isServingsExpanded});
  };

  onDonePress = () => {
    this.setState({isServingsExpanded: !this.state.isServingsExpanded});

    this.setState({
      servings: this.state.servings2,
      portionsSize: this.state.portionsSize2,
    });

    console.log('this.state.servings', this.state.servings2);
  };

  _renderIngredientsItem = ({item, index}) => {
    return (
      <IngredientsListItem
        index={index}
        item={item}
        onIngredientDelete={this.onIngredientDelete}
        servings={this.state.servings}
        serves={this.props.data.serves}
      />
    );
  };

  onAddIngredientPress = () => {
    Actions.details({
      key: 'searchFoodScreen',
      isFromRecipes: true,
    });
  };

  getFoodById = async (id, ingredient) => {
    const data = await shaefitApi.getFoodById(id);
    let array = this.state.foodArray;

    let amount = Array.isArray(ingredient.amount)
      ? ingredient.amount[0]
      : ingredient.amount;
    if (amount === '1/4') {
      amount = 0.25;
    } else if (amount === '1/8') {
      amount = 0.125;
    } else if (amount === '1/3') {
      amount = 0.33;
    } else if (amount === '1/2') {
      amount = 0.5;
    } else if (amount === '2/3') {
      amount = 0.66;
    } else if (amount === '3/4') {
      amount = 0.75;
    }

    let unit = {};

    if (typeof ingredient.unitObject !== 'undefined') {
      unit.id = ingredient.unitObject.id;
      unit.name = ingredient.unitObject.name;
    } else {
      for (let i = 0; i < this.state.foodUnits.length; i++) {
        if (this.state.foodUnits[i].name.toLowerCase() === ingredient.unit) {
          unit.id = this.state.foodUnits[i].id;
          unit.name = this.state.foodUnits[i].name;

          break;
        }
      }
    }

    if (Object.keys(unit).length === 0) {
      let unitName = ingredient.unit;

      if (unitName.endsWith('es')) {
        unitName = unitName.slice(0, unitName.length - 2);
      } else if (unitName.endsWith('s')) {
        unitName = unitName.slice(0, unitName.length - 1);
      }

      console.log('getFoodById data', data);
      for (let i = 0; i < data.weights.length; i++) {
        if (data.weights[i].name.toLowerCase().startsWith(unitName)) {
          if (data.weights[i].grams !== null) {
            unit.id = data.weights[i].unit_id;
            unit.name = data.weights[i].name;
          } else if (data.weights[i].ml !== null) {
            unit.id = data.weights[i].unit_id;
            unit.name = data.weights[i].name;
          }

          break;
        }
      }

      // const result = data.weights.find(item => item.startsWith("m"));
      // unit.id = 29;
      // unit.name = 'Medium';

      console.log('no unit ingredient', ingredient);
      console.log('no unit data', data);
    }

    let weight = 1;
    for (let i = 0; i < data.weights.length; i++) {
      if (data.weights[i].name.toLowerCase() === unit.name.toLowerCase()) {
        if (data.weights[i].grams !== null) {
          weight = (data.weights[i].grams / 100) * amount;
        } else if (data.weights[i].ml !== null) {
          weight = (data.weights[i].ml / 100) * amount;
        }

        console.log('weight name', data.weights[i].grams, unit.name);

        break;
      }
    }

    let servings = 1;

    if (this.state.servings === '1/8') {
      servings = 0.125;
    } else if (this.state.servings === '1/4') {
      servings = 0.25;
    } else if (this.state.servings === '1/2') {
      servings = 0.5;
    } else {
      servings = parseInt(this.state.servings);
    }

    servings = parseFloat(servings / this.props.data.serves);

    amount = parseFloat(amount * servings).toFixed(2);
    if (amount.toString().includes('.00')) {
      amount = parseInt(amount);
    }

    if (unit.name === 'Gram' || unit.name === 'Millilitre') {
      amount = Math.round(amount);
    }

    array.push({
      id: data.id,
      name: data.name,
      description: data.description,
      glycemic_index: data.glycemic_index,
      portion: data.portion,
      portion__unit: data.portion__unit,
      portion_unit: data.portion_unit,
      image: data.image,
      grading_5: data.grading_5,
      grading_4: data.grading_4,
      grading_3: data.grading_3,
      grading_2: data.grading_2,
      grading_1: data.grading_1,
      grading_avoid: data.grading_avoid,
      user_fav: data.user_fav,
      user_importance_val: data.user_importance_val,
      user_important_text: data.user_important_text,
      is_shopping_tips_exists: data.is_shopping_tips_exists,
      food_category: data.food_category,
      kcal:
        typeof data.props === 'undefined'
          ? 0
          : data.props.common.kcal * servings * weight,
      carbs:
        typeof data.props === 'undefined'
          ? 0
          : data.props.carbs.carbs * servings * weight,
      fat:
        typeof data.props === 'undefined'
          ? 0
          : data.props.fat_total.fat_total * servings * weight,
      protein:
        typeof data.props === 'undefined'
          ? 0
          : data.props.protein.protein * servings * weight,
      // amount: (amount === '1/2') ? 1 * parseInt(this.state.servings) : amount * parseInt(this.state.servings),
      amount: amount, //parseFloat(amount * servings).toFixed(2),
      unit: unit,
      // foodId: foodId
    });

    console.log(
      'getFoodById item',
      data.name,
      amount,
      this.state.servings,
      this.props.data.serves,
      servings,
      parseFloat(servings / this.props.data.serves).toFixed(2),
      parseFloat(amount) * servings,
    );

    this.setState({foodArray: array});
  };

  // onAddMealPress = () => {
  // 	const promises = []; //getFoodById
  // 	for (let i = 0; i < this.state.ingredients.length; i++) {
  // 		const func = this.getFoodById(this.state.ingredients[i].food_id, this.state.ingredients[i]);
  // 		promises.push(func);
  // 	}
  //
  // 	Promise.all(promises).then((values) => {
  // 		console.log('promises resolved', values);
  // 		console.log('foodArray', this.state.foodArray);
  //
  // 		let carbs = 0;
  // 		let fat = 0;
  // 		let protein = 0;
  // 		let cals = 0;
  //
  // 		for (let i = 0; i < this.state.foodArray.length; i++) {
  // 			carbs = carbs + parseFloat(this.state.foodArray[i].carbs);
  // 			fat = fat + parseFloat(this.state.foodArray[i].fat);
  // 			protein = protein + parseFloat(this.state.foodArray[i].protein);
  // 			cals = cals + parseFloat(this.state.foodArray[i].kcal);
  // 		}
  //
  // 		shaefitApi.saveSavedMeals({
  // 			name: this.props.data.title,
  // 			cals: cals,
  // 			carbs: carbs,
  // 			fat: fat,
  // 			protein: protein,
  // 			foods: this.state.foodArray,
  // 			// photo: {
  // 			//   uri: this.state.photoUri,
  // 			//   name: this.state.photoFileName,
  // 			//   type: `image/jpeg`
  // 			// }
  // 			photo: this.props.data.images[0],
  // 		});
  //
  // 		Actions.pop();
  // 	});
  //
  //
  // }

  onAddMealPress = () => {
    if (this.state.isLoading === false) {
      this.setState({isLoading: true});

      const promises = []; //getFoodById
      for (let i = 0; i < this.state.ingredients.length; i++) {
        if (this.state.ingredients[i].food_id !== null) {
          const func = this.getFoodById(
            this.state.ingredients[i].food_id,
            this.state.ingredients[i],
          );
          promises.push(func);
        }
      }

      Promise.all(promises).then((values) => {
        console.log('promises resolved', values);
        console.log('foodArray', this.state.foodArray);

        this.setState({isLoading: false});

        setTimeout(() => {
          Actions.popTo('foodDiary');
        }, 300);

        Actions.refresh({
          key: 'foodDiary',
          newFoods: this.state.foodArray,
          id: this.id,
          foodDiaryId: this.props.foodDiaryId,
        });

        // let carbs = 0;
        // let fat = 0;
        // let protein = 0;
        // let cals = 0;
        //
        // for (let i = 0; i < this.state.foodArray.length; i++) {
        // 	carbs = carbs + parseFloat(this.state.foodArray[i].carbs);
        // 	fat = fat + parseFloat(this.state.foodArray[i].fat);
        // 	protein = protein + parseFloat(this.state.foodArray[i].protein);
        // 	cals = cals + parseFloat(this.state.foodArray[i].kcal);
        // }
        //
        // shaefitApi.saveSavedMeals({
        // 	name: this.props.data.title,
        // 	cals: cals,
        // 	carbs: carbs,
        // 	fat: fat,
        // 	protein: protein,
        // 	foods: this.state.foodArray,
        // 	// photo: {
        // 	//   uri: this.state.photoUri,
        // 	//   name: this.state.photoFileName,
        // 	//   type: `image/jpeg`
        // 	// }
        // 	photo: this.props.data.images[0],
        // });
        //
        // Actions.pop();
      });
    }
  };

  render() {
    const data = this.props.data;

    let bottomHeight = isIphoneX() ? 65 + 10 : 65 + 34;

    const instructionsList = [];

    data.instructions.m.map((innerData, index) => {
      console.log('innerData', innerData);
      instructionsList.push(
        <View
          key={innerData.description + index.toString()}
          style={[
            styles.instructionContainer,
            {
              backgroundColor:
                index % 2 === 0 ? 'rgba(36,76,138,0.05)' : 'rgb(255,255,255)',
              marginTop: index === 0 ? 20 : 0,
            },
          ]}>
          <Text style={styles.instructionNumber}>{index + 1}</Text>
          <Text style={styles.instructionText}>
            {!this.state.isMetric && data.instructions.i[index] !== ''
              ? data.instructions.i[index]
              : innerData}
          </Text>
        </View>,
      );
    });

    console.log('data', data);

    const salty = getTasteColor(data.salty, width - 80, 'SALTY');
    const savory = getTasteColor(data.savory, width - 80, 'SAVORY');
    const bitter = getTasteColor(data.bitter, width - 80, 'BITTER');
    const sour = getTasteColor(data.sour, width - 80, 'SOUR');
    const spicy = getTasteColor(data.spicy, width - 80, 'SPICY');
    const sweet = getTasteColor(data.sweet, width - 80, 'SWEET');

    const userFav = this.state.isLiked;

    return (
      <View style={{flex: 1, backgroundColor: 'rgb(255,255,255)'}}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="light-content" hidden={false} />
        )}

        <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1, height}}>
          {/*(Platform.OS === 'android') ? (
            <StatusBar
             backgroundColor='rgb(245,108,75)'
             barStyle='light-content'
           />
         ) : (
           <SafeAreaView style={{backgroundColor: 'rgb(0,164,228)', height: 20, overflow: 'hidden'}}>
             <View style={{width, height: (isIphoneX()) ? 380 + 25 : 380, position: 'absolute', bottom: -305, left: 0, backgroundColor: 'grey', overflow: 'hidden', backgroundColor: 'rgb(244,248,252)'}}>
               <LinearGradient colors={['rgb(245,108,75)', 'rgb(248,138,97)']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0.5,1]} style={{height: (Platform.OS === 'ios') ? 88 + 15 : 88 + 15, elevation: 0}}>
               </LinearGradient>
             </View>
           </SafeAreaView>
         ) */}

          <ScrollView>
            <View style={{marginTop: 0}}>
              <View style={{width, height: 320}}>
                <Image
                  source={{uri: data.images[0]}}
                  style={{width, height: 320}}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.35)', 'rgb(0,0,0)']}
                  style={{
                    width,
                    height: 320,
                    opacity: 0.7,
                    overflow: 'hidden',
                    position: 'absolute',
                    top: 0,
                  }}
                />

                <TouchableWithoutFeedback onPress={() => Actions.pop()}>
                  <Image
                    source={require('../resources/icon/close_icon.png')}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: 'rgb(255,255,255)',
                      position: 'absolute',
                      top: isIphoneX() ? 44 : Platform.OS === 'ios' ? 32 : 12,
                      left: 16,
                    }}
                  />
                </TouchableWithoutFeedback>

                <Text style={styles.mainTitle}>{data.title}</Text>
              </View>

              <View
                style={{
                  width,
                  height: 72,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgb(36,76,138)',
                }}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Image
                    source={require('../resources/icon/ingredientsCopy.png')}
                    style={{alignSelf: 'center'}}
                  />

                  <Text
                    style={
                      styles.barText
                    }>{`${this.state.ingredients.length} Ingredients`}</Text>
                </View>

                <View
                  style={{
                    width: 1,
                    height: 40,
                    backgroundColor: 'rgb(65,102,158)',
                    position: 'absolute',
                    top: 16,
                    left: (width - 1) / 2,
                  }}
                />

                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Image
                    source={require('../resources/icon/mins.png')}
                    style={{alignSelf: 'center', marginTop: 1}}
                  />

                  <Text
                    style={[
                      styles.barText,
                      {marginTop: 6},
                    ]}>{`${data.cook_time} Minutes`}</Text>
                </View>
              </View>

              {typeof this.props.id !== 'undefined' && (
                <TouchableWithoutFeedback onPress={this.onServingsPress}>
                  <View
                    style={{
                      width: width - 40,
                      height: 64,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: 'rgb(221,224,228)',
                      alignSelf: 'center',
                      marginTop: 20,
                      flexDirection: 'row',
                    }}>
                    <View style={{marginTop: 11, marginLeft: 20, width: 56}}>
                      <Text style={styles.servingsTitle}>Servings</Text>
                      <Text style={styles.servingsText}>
                        {this.state.servings}
                      </Text>
                    </View>

                    {this.state.isServingsExpanded ? (
                      <Image
                        source={require('../resources/icon/arrowUp.png')}
                        style={{position: 'absolute', right: 20, top: 26}}
                      />
                    ) : (
                      <Image
                        source={require('../resources/icon/arrowDown.png')}
                        style={{position: 'absolute', right: 20, top: 26}}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              )}

              <Text
                style={[styles.title, {marginTop: 32, marginHorizontal: 20}]}>
                Importance
              </Text>

              <View
                style={[
                  styles.foodTextContainer,
                  {
                    marginTop: 12,
                    width: width - 40,
                    backgroundColor: 'rgb(235,241,243)',
                  },
                ]}>
                <LinearGradient
                  colors={this.rateColor}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  locations={[0.5, 1]}
                  style={[
                    styles.foodTextContainer,
                    {
                      alignSelf: 'flex-start',
                      width: this.rateWidth,
                      marginTop: 0,
                    },
                  ]}>
                  <Text style={styles.foodText}>
                    {this.props.data.importance_text.toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>

              <View style={{marginHorizontal: 20}}>
                <Text style={[styles.title, {marginTop: 32, marginBottom: 16}]}>
                  Ingredients
                </Text>

                {/* ingredients */}

                <FlatList
                  data={this.state.ingredients}
                  // extraData={this.state.ingredients}
                  keyExtractor={(item, index) =>
                    item.id.toString() + index.toString()
                  }
                  renderItem={this._renderIngredientsItem}
                  contentContainerStyle={{overflow: 'visible'}}
                  keyboardShouldPersistTaps="always"
                  initialNumToRender={10}
                  bounces={false}
                />

                <View
                  style={{
                    width: width - 40,
                    alignSelf: 'center',
                    height: 0.5,
                    backgroundColor: 'rgb(216,215,222)',
                  }}
                />

                {typeof this.props.id !== 'undefined' && (
                  <TouchableWithoutFeedback onPress={this.onAddIngredientPress}>
                    <View
                      style={{
                        marginTop: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../resources/icon/plus.png')}
                        style={{width: 12, height: 12, marginRight: 12}}
                      />
                      <Text style={styles.addIngredientText}>
                        Add Ingredient
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 32,
                    alignItems: 'center',
                  }}>
                  <Text style={styles.title}>Instructions</Text>
                  <TouchableWithoutFeedback
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => this.setState({isMetric: false})}>
                    <View>
                      <Text
                        style={[
                          styles.ingredientsText,
                          {
                            marginLeft: 106 - (375 - width),
                            marginTop: 2,
                            color: this.state.isMetric
                              ? 'rgb(141,147,151)'
                              : 'rgb(0,168,235)',
                          },
                        ]}>
                        Standard
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <View
                    style={{
                      width: 0.5,
                      height: 11,
                      backgroundColor: 'rgb(216,216,216)',
                      marginTop: 5,
                      marginHorizontal: 15,
                    }}
                  />
                  <TouchableWithoutFeedback
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    onPress={() => this.setState({isMetric: true})}>
                    <View>
                      <Text
                        style={[
                          styles.ingredientsText,
                          {
                            marginTop: 2,
                            color: this.state.isMetric
                              ? 'rgb(0,168,235)'
                              : 'rgb(141,147,151)',
                          },
                        ]}>
                        Metric
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>

              {instructionsList}

              {/*  <View style={{marginHorizontal: 24}}>
                <Text style={[styles.title, {marginTop: 40, marginBottom: 16.5}]}>Taste</Text>
                <View style={{width: width - 48, alignSelf: 'center', height: 0.5, backgroundColor: 'rgb(216,215,222)', marginBottom: 2.5}} />

                <View style={styles.tasteContainer}>
                  <View style={[styles.fillingContainer, {width: salty.width, backgroundColor: salty.color[0]}]}>
                    <Text style={styles.tasteText}>SALTY</Text>
                  </View>
                </View>
                <View style={styles.tasteContainer}>
                  <View style={[styles.fillingContainer, {width: savory.width, backgroundColor: savory.color[0]}]}>
                    <Text style={styles.tasteText}>SAVORY</Text>
                  </View>
                </View>
                <View style={styles.tasteContainer}>
                  <View style={[styles.fillingContainer, {width: bitter.width, backgroundColor: bitter.color[0]}]}>
                    <Text style={styles.tasteText}>BITTER</Text>
                  </View>
                </View>

                <View style={styles.tasteContainer}>
                  <View style={[styles.fillingContainer, {width: sour.width, backgroundColor: sour.color[0]}]}>
                    <Text style={styles.tasteText}>SOUR</Text>
                  </View>
                </View>
                <View style={styles.tasteContainer}>
                  <View style={[styles.fillingContainer, {width: spicy.width, backgroundColor: spicy.color[0]}]}>
                    <Text style={styles.tasteText}>SPICY</Text>
                  </View>
                </View>
                <View style={styles.tasteContainer}>
                  <View style={[styles.fillingContainer, {width: sweet.width, backgroundColor: sweet.color[0]}]}>
                    <Text style={styles.tasteText}>SWEET</Text>
                  </View>
                </View>
              </View> */}
            </View>

            <View style={{height: bottomHeight}} />
          </ScrollView>
        </View>

        {typeof this.props.id !== 'undefined' && (
          <TouchableWithoutFeedback onPress={this.onAddMealPress}>
            <View style={styles.doneButton}>
              {this.state.isLoading ? (
                <LoadingIndicator isLoading={true} />
              ) : (
                <Text style={styles.doneButtonText}>
                  Add recipe ingredients into diary
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}

        {isIphoneX() && (
          <View
            style={{height: 34, width, backgroundColor: 'rgb(255,255,255)'}}
          />
        )}

        <Dialog
          visible={this.state.isServingsExpanded}
          containerStyle={{justifyContent: 'flex-end'}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({
              isServingsExpanded: false,
              servings2: this.state.servings,
              portionsSize2: this.state.portionsSize,
            });
          }}
          onDismiss={() => {
            // this.setState({ isSaveFoodDiaryViewModalVisible: false });
          }}
          dialogAnimation={slideAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 0,
            backgroundColor: 'transparent',
          }}>
          <DialogContent style={{paddingBottom: 0}}>
            <View
              style={{
                width,
                borderRadius: 0,
                backgroundColor: 'rgb(255,255,255)',
              }}>
              <TouchableWithoutFeedback onPress={this.onDonePress}>
                <View
                  style={{
                    width: width - 40,
                    height: 44,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.doneText}>Done</Text>
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  width: width - 40,
                  height: 200,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <Picker
                  style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: 200,
                    alignSelf: 'center',
                  }}
                  selectedValue={this.state.servings2}
                  pickerData={[
                    '1/8',
                    '1/4',
                    // "1/3",
                    '1/2',
                    // "2/3",
                    // "3/4",
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                  ]}
                  onValueChange={(value) => {
                    this.setState({servings2: value});
                  }}
                  itemSpace={30} // this only support in android
                />
              </View>

              {isIphoneX() && (
                <View
                  style={{height: 34, backgroundColor: 'rgb(255,255,255)'}}
                />
              )}
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.41,
    color: 'rgb(28,28,28)',
  },
  ingredientsContainer: {
    width: width - 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgb(216,215,222)',
    paddingVertical: 14,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgb(0,187,116)',
    marginRight: 14,
  },
  ingredientsText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.36,
    color: 'rgb(54,58,61)',
  },
  instructionContainer: {
    width: width,
    backgroundColor: 'rgb(255,255,255)',
  },
  instructionText: {
    marginVertical: 24,
    marginLeft: 64,
    marginRight: 24,
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.4,
    color: 'rgb(54,58,61)',
    opacity: 1,
  },
  instructionNumber: {
    position: 'absolute',
    left: 24,
    top: 23,
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: -0.7,
    color: 'rgba(28,50,83,0.2)',
  },
  buttonContainer: {
    width: width - 47,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgb(255,255,255)',
    flexDirection: 'row',
  },
  gradient: {
    marginTop: 20,
    width: width - 45,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    marginLeft: 20,
    marginTop: 12,
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(0,168,235)',
  },
  tasteContainer: {
    width: width - 48,
    height: 24,
    backgroundColor: 'rgb(215,220,230)',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 20,
  },
  tasteText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.3,
    color: 'rgb(255,255,255)',
    marginLeft: 12,
  },
  fillingContainer: {
    position: 'absolute',
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  headerTitleStyleWhite: {
    width: width - 53 - 53, //241,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(255,255,255)',
    lineHeight: 22,
    letterSpacing: -0.4,
    marginLeft: 0,
    marginRight: 53,
  },
  servingsTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
  },
  servingsText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '500',
    fontSize: 17,
    color: 'rgb(38,42,47)',
    // marginTop: 4
  },
  doneButton: {
    width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isIphoneX() ? 34 : 0,
  },
  doneButtonText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.36,
    color: 'rgb(255,255,255)',
  },
  barText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(176,198,232)',
    alignSelf: 'center',
    marginTop: 7,
  },
  mainTitle: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 24,
    color: 'rgb(255,255,255)',
    position: 'absolute',
    bottom: 29,
    alignSelf: 'center',
    width: width - 95,
    textAlign: 'center',
  },
  doneText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(0,168,235)',
    lineHeight: 22,
    letterSpacing: -0.41,
    position: 'absolute',
    right: 0,
  },
  foodText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: -0.07,
    color: 'rgb(255,255,255)',
    marginLeft: 11,
  },
  foodTextContainer: {
    width: 15,
    height: 21,
    borderRadius: 10.5,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  addIngredientText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(0,168,235)',
  },
});

export default RecipeDetails;

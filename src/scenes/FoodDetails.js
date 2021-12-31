import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
  FlatList,
  Modal as AdditionalModal,
  Platform,
  TextInput,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import {BoxShadow} from 'react-native-shadow';
import PropTypes from 'prop-types';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';
import {Picker} from 'react-native-wheel-pick';
import ShineOverlay from '../components/ShineOverlay';

import SwitchComponent from '../components/Switch';
import * as shaefitApi from '../API/shaefitAPI';
import getRateColor from '../utils/getRateColor';
import FoodFilterPopup from '../components/FoodFilterPopup';
import PanelFood from '../components/PanelFood';
import PanelFoodUnit from '../components/PanelFoodUnit';

let Fraction = require('fraction.js');

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: 'bottom', // optional
  useNativeDriver: true, // optional
});

const {height, width} = Dimensions.get('window');

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

class FoodDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      isServingsExpanded: false,
      servings: '1',
      servings2: '1',
      fractions: '-',
      fractions2: '-',
      portionsSize: '',
      portionsSize2: '',
      portionSizes: [],
      foodUnits: [],
      weights: [],
      mod: 1,
      isPickerMoving: false,
      isLoading: false,
    };

    this.rateColor = null;
    this.rateWidth = null;

    this.commonServings = [
      '-',
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
    ];
    this.gmMlServings = [];

    this.initialAmount = 0;
    this.initialFraction = 0;
    this.initialUnit = '';
  }

  UNSAFE_componentWillMount() {
    const rate = getRateColor(this.props.data.user_importance_val, width - 175);

    this.rateColor = rate.color;
    this.rateWidth = rate.width;
  }

  async componentDidMount() {
    console.log('FoodDetails this.props', this.props);

    setTimeout(() => {
      if (
        (typeof this.props.isFromHistory !== 'undefined' &&
          this.props.isFromHistory === true) ||
        (typeof this.props.isFromDiary !== 'undefined' &&
          this.props.isFromDiary === true)
      ) {
        let amount = this.props.amount;
        if (amount === '0.25' || amount === 0.25) {
          amount = '1/4';
        } else if (amount === '0.33' || amount === 0.33) {
          amount = '1/3';
        } else if (amount === '0.5' || amount === 0.5 || amount === '0.5000') {
          amount = '1/2';
        } else if (amount === '0.66' || amount === 0.66) {
          amount = '2/3';
        } else if (amount === '0.75' || amount === 0.75) {
          amount = '3/4';
        }

        const splittedNumber = this.props.amount.toString().split('.');
        const intPart = splittedNumber[0] !== '0' ? splittedNumber[0] : '-';
        let floatPart =
          typeof splittedNumber[1] !== 'undefined'
            ? '0.' + splittedNumber[1]
            : '-';

        if (floatPart !== '-') {
          if (floatPart === '0.25' || floatPart === 0.25) {
            floatPart = '1/4';
          } else if (floatPart === '0.33' || floatPart === 0.33) {
            floatPart = '1/3';
          } else if (
            floatPart === '0.50' ||
            floatPart === '0.5000' ||
            floatPart === '0.5' ||
            floatPart === 0.5
          ) {
            floatPart = '1/2';
          } else if (floatPart === '0.66' || floatPart === 0.66) {
            floatPart = '2/3';
          } else if (floatPart === '0.75' || floatPart === 0.75) {
            floatPart = '3/4';
          }
        }
        console.log('splitted', splittedNumber);

        this.initialAmount = intPart;
        this.initialFraction = floatPart;
        this.initialUnit = this.props.unit.name;

        console.log('this.initialUnit', this.initialUnit);

        this.setState({
          // servings: this.props.amount,
          // servings2: this.props.amount,
          servings: intPart,
          servings2: intPart,
          fractions: floatPart,
          fractions2: floatPart,
          portionsSize: this.props.unit.name,
          portionsSize2: this.props.unit.name,
        });
      }

      this.getFoodById();
      // const promise2 = this.getFoodUnits();
      //
      // Promise.all([promise1, promise2]).then((values) => {
      //   console.log("promises resolved", values);
      // });
    }, 400);

    this.getGmMlServings();
  }

  getGmMlServings = () => {
    const array = [];

    for (let i = 1; i < 1000; i++) {
      array.push(i.toString());
    }

    this.gmMlServings = array;
  };

  getFoodById = async () => {
    this.setState({isLoading: true});
    const data = await shaefitApi.getFoodById(this.props.data.id);
    console.log('getFoodById data', data);
    this.setState({data, weights: data.weights}, () => {
      this.getFoodUnits();
    });
  };

  getFoodUnits = async () => {
    const foodUnits = await shaefitApi.getFoodUnits();
    let portionSizes = [];
    for (let i = 0; i < foodUnits.length; i++) {
      portionSizes.push(foodUnits[i].name);
    }
    this.setState({portionSizes, foodUnits});
    console.log('foodUnits', foodUnits, portionSizes, this.state.weights);

    // setTimeout(() => {
    // const newArray = portionSizes.filter( x => this.state.weights.filter( y => y.name === x.name));
    const newArray = [];
    for (let i = 0; i < this.state.weights.length; i++) {
      for (let k = 0; k < portionSizes.length; k++) {
        if (this.state.weights[i].name === portionSizes[k]) {
          newArray.push(
            `${portionSizes[k]} (${
              this.state.weights[i].grams !== null
                ? parseFloat(this.state.weights[i].grams) + 'g'
                : parseFloat(this.state.weights[i].ml) + 'ml'
            })`,
          );
          break;
        }
      }
    }

    this.setState({
      portionSizes: newArray,
      isLoading: false,
    });

    if (
      (typeof this.props.isFromHistory !== 'undefined' &&
        this.props.isFromHistory === true) ||
      (typeof this.props.isFromDiary !== 'undefined' &&
        this.props.isFromDiary === true)
    ) {
      this.setState({
        portionsSize: this.props.unit.name,
        portionsSize2: this.props.unit.name,
      });
    } else {
      if (this.props.data.category.unit_amount !== null) {
        this.setState({
          servings: this.props.data.category.unit_amount,
          servings2: this.props.data.category.unit_amount,
        });
      } else {
        this.setState({servings: '1', servings2: '1'});
      }

      if (this.props.data.category.recipe_unit !== null) {
        this.setState({
          portionsSize: this.props.data.category.recipe_unit.name,
          portionsSize2: this.props.data.category.recipe_unit.name,
        });
      } else {
        this.setState({
          portionsSize: newArray[0],
          portionsSize2: newArray[0],
        });
      }
    }

    console.log('newArray', newArray);
    console.log('this.state.weights', this.state.weights);
    // }, 400);
  };

  capitalizeFirstLetter = (str) => {
    try {
      return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
          return word[0].toUpperCase() + word.substr(1);
        })
        .join(' ');
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onServingsPress = () => {
    if (!this.state.isLoading) {
      this.setState({isServingsExpanded: !this.state.isServingsExpanded});
    }
  };

  onDonePress = () => {
    this.setState({isServingsExpanded: !this.state.isServingsExpanded});

    console.log('weights', this.state.weights);

    this.setState(
      {
        servings:
          (this.state.portionsSize === 'Gram' ||
            this.state.portionsSize === 'Millilitre') &&
          this.state.portionsSize2 !== 'Gram' &&
          this.state.portionsSize2 !== 'Millilitre'
            ? '1'
            : this.state.servings2,
        portionsSize: this.state.portionsSize2,
        fractions: this.state.fractions2,
      },
      () => {
        for (let i = 0; i < this.state.weights.length; i++) {
          if (
            this.state.weights[i].name.toLowerCase() ===
            this.state.portionsSize.toLowerCase()
          ) {
            console.log('this.state.weights[i]', this.state.weights[i]);
            this.setState({
              mod:
                this.state.weights[i].grams !== null
                  ? this.state.weights[i].grams / this.state.data.portion
                  : this.state.weights[i].ml / this.state.data.portion,
            });
            break;
          }
        }
      },
    );
  };

  onAddPress = () => {
    if (
      !this.state.isLoading &&
      (this.state.servings !== '-' || this.state.fractions !== '-')
    ) {
      console.log('onAddPress', this.state.portionsSize);
      let portion = null;
      for (let i = 0; i < this.state.foodUnits.length; i++) {
        if (this.state.foodUnits[i].name === this.state.portionsSize) {
          portion = this.state.foodUnits[i];

          break;
        }
      }
      console.log('this.state.data.props.common', this.state.data.props.common);

      let amount = this.state.servings;
      if (amount === '1/4') {
        amount = 0.25;
      } else if (amount === '1/3') {
        amount = 0.33;
      } else if (amount === '1/2') {
        amount = 0.5;
      } else if (amount === '2/3') {
        amount = 0.66;
      } else if (amount === '3/4') {
        amount = 0.75;
      }

      const mod = this.getMod();
      const food = {
        ...this.props.data,
        ...{
          kcal: Math.round(this.state.data.props.common.kcal * mod),
          carbs: parseFloat(this.state.data.props.carbs.carbs * mod).toFixed(2),
          fat: parseFloat(
            this.state.data.props.fat_total.fat_total * mod,
          ).toFixed(2),
          protein: parseFloat(
            this.state.data.props.protein.protein * mod,
          ).toFixed(2),
          // amount: this.state.servings,
          amount: this.getDisplayingServings(true),
          unit: {id: portion.id, name: portion.name},
        },
      };

      // Actions.pop({refresh: {key: "foodDiary"}});
      // Actions.replace('foodDiary', {newFood: food});
      // Actions.refresh({ key: 'foodDiary', newFood: food });
      // Actions.pop(2);
      // Actions.callback({key:'foodDiary',type:'jump'});
      // Actions.foodDiary({newFood: food});

      if (
        typeof this.props.isFromRecipes !== 'undefined' &&
        this.props.isFromRecipes !== null
      ) {
        // Actions.refresh({ key: 'foodDiary', newFood: food, id: this.props.id });
        setTimeout(() => {
          Actions.popTo('recipeDetails', {newFood: food});
        }, 300);

        Actions.refresh({
          key: 'recipeDetails',
          newFood: food,
        });
      } else if (
        typeof this.props.isFromSaveMeal !== 'undefined' &&
        this.props.isFromSaveMeal !== null
      ) {
        setTimeout(() => {
          Actions.popTo('saveMeal', {newFood: food, id: this.props.id});
        }, 300);

        Actions.refresh({key: 'saveMeal', newFood: food, id: this.props.id});
        // Actions.refresh({ key: 'foodDiary', newFood: food, id: this.props.id });
      } else if (
        typeof this.props.isFromSavedMeals !== 'undefined' &&
        this.props.isFromSavedMeals !== null
      ) {
        setTimeout(() => {
          Actions.popTo('savedMeals', {newFood: food, id: this.props.id});
        }, 300);

        Actions.refresh({
          key: 'savedMeals',
          newFood: food,
          id: this.props.id,
        });
        // Actions.refresh({ key: 'foodDiary', newFood: food, id: this.props.id });
      } else {
        setTimeout(() => {
          Actions.popTo('foodDiary');
        }, 300);

        Actions.refresh({key: 'foodDiary', newFood: food, id: this.props.id});
      }

      //   "foods": [
      //   {
      //     "id": 57,
      //     "food": {
      //       "id": 135,
      //       "name": "Oat groats - whole & raw",
      //       "image": "http://api.shaefit.local//images/food/foods/oats.jpg",
      //       "rating": 5,
      //       "cals": 100
      //     },
      //     "amount": "1",
      //     "cals": 100,
      //     "unit": {
      //       "id": 5,
      //       "name": "Cup"
      //     }
      //   },
      //   {
      //     "id": 58,
      //     "food": {
      //       "id": 77,
      //       "name": "Honey, raw unfiltered",
      //       "image": "http://api.shaefit.local//images/food/foods/honey.jpg",
      //       "rating": 5,
      //       "cals": 120
      //     },
      //     "amount": "1",
      //     "cals": 120,
      //     "unit": {
      //       "id": 7,
      //       "name": "Teaspoon"
      //     }
      //   }
      // ],
    }
  };

  onPickerTouch = (locationY, value1, value2) => {
    if (this.state.isPickerMoving) {
      this.setState({isPickerMoving: false});
    } else {
      console.log('value1, value2', value1, value2);
      if (locationY >= 87.5 && locationY <= 129) {
        // && value1 === value2

        this.onDonePress();
        // this.setState({ isServingsExpanded: !this.state.isServingsExpanded });
      }
    }
  };

  getDisplayingServings = (value) => {
    let mod = 0;
    if (this.state.servings !== '-') {
      mod += parseInt(this.state.servings);
    }

    if (this.state.fractions === '1/4') {
      mod += 0.25;
    } else if (this.state.fractions === '1/3') {
      mod += 0.33;
    } else if (this.state.fractions === '1/2') {
      mod += 0.5;
    } else if (this.state.fractions === '2/3') {
      mod += 0.66;
    } else if (this.state.fractions === '3/4') {
      mod += 0.75;
    }

    if (mod !== 0) {
      if (typeof mod === 'number' && mod % 1 === 0) {
        return parseInt(mod);
      } else {
        if (typeof value !== 'undefined' && value === true) {
          return Number(parseFloat(mod).toFixed(4));
        } else {
          return new Fraction(mod).simplify(0.015).toFraction(true);
        }

        //
      }
    } else {
      return '-';
    }
  };

  getMod = () => {
    // (this.state.data.props.common.kcal / 100) * // 100g
    //   this.props.data.portion;

    let mod = 0;
    if (this.state.servings !== '-') {
      mod += parseInt(this.state.servings);
    }

    if (this.state.fractions === '1/4') {
      mod += 0.25;
    } else if (this.state.fractions === '1/3') {
      mod += 0.33;
    } else if (this.state.fractions === '1/2') {
      mod += 0.5;
    } else if (this.state.fractions === '2/3') {
      mod += 0.66;
    } else if (this.state.fractions === '3/4') {
      mod += 0.75;
    }

    console.log('getMod', this.state.fractions, mod);

    const quantity = this.getQuantity();
    if (mod !== 0) {
      return parseFloat(mod * quantity).toFixed(4);
    } else {
      return parseFloat(quantity).toFixed(4);
    }
  };

  getQuantity = () => {
    // console.log("getQuantity", this.state.portionsSize);

    let weight = 0;
    for (let i = 0; i < this.state.weights.length; i++) {
      if (
        this.state.weights[i].name.toLowerCase() ===
        this.state.portionsSize.toLowerCase()
      ) {
        console.log(
          'getQuantity',
          this.state.weights[i].name,
          this.state.portionsSize,
        );
        weight =
          this.state.weights[i].grams !== null
            ? parseFloat(this.state.weights[i].grams)
            : parseFloat(this.state.weights[i].ml);

        break;
      }
    }

    if (weight !== 0) {
      return weight / 100;
    } else {
      return 1;
    }
  };

  removeFromDiary = () => {
    this.props.onDelete();

    setTimeout(() => {
      Actions.popTo('foodDiary');
    }, 300);

    // Actions.refresh({ key: "foodDiary", newFood: food, id: this.props.id });
  };

  updateDiary = () => {
    this.props.onDelete();

    setTimeout(() => {
      this.onAddPress();
    }, 200);
  };

  getSelectedValue = (value) => {
    for (let i = 0; i < this.state.portionSizes.length; i++) {
      if (this.state.portionSizes[i].includes(value)) {
        return this.state.portionSizes[i];
        break;
      }
    }
  };

  render() {
    let mod = 1;

    let amount = this.state.servings;
    if (amount === '1/4') {
      amount = 0.25;
    } else if (amount === '1/3') {
      amount = 0.33;
    } else if (amount === '1/2') {
      amount = 0.5;
    } else if (amount === '2/3') {
      amount = 0.66;
    } else if (amount === '3/4') {
      amount = 0.75;
    }

    let carbsOptions,
      fatOptions,
      proteinOptions,
      vitaminsOptions,
      mineralOptions;

    if (
      this.state.data !== null &&
      typeof this.state.data.props !== 'undefined'
    ) {
      mod = this.getMod();
      console.log('this.state.data', this.state.data.props);
      carbsOptions = Object.keys(this.state.data.props.carbs).map((key) => {
        let text = key.replace('_', ' ');
        text = this.capitalizeFirstLetter(text);

        let additionalText = (this.state.data.props.carbs[key] * mod).toFixed(
          2,
        );

        if (isNaN(additionalText)) {
          additionalText = this.state.data.props.carbs[key];
        }

        if (additionalText.toString() === '0.00') {
          additionalText = '~';
        }

        return (
          <PanelFoodUnit
            key={key}
            text={text}
            additionalText={additionalText + ' g'}
          />
        );
      });

      fatOptions = Object.keys(this.state.data.props.fat_total).map((key) => {
        let text = key.replace('_', ' ');
        text = this.capitalizeFirstLetter(text);

        let additionalText = (
          this.state.data.props.fat_total[key] * mod
        ).toFixed(2);

        if (isNaN(additionalText)) {
          additionalText = this.state.data.props.fat_total[key];
        }

        if (additionalText.toString() === '0.00') {
          additionalText = '~';
        }

        return (
          <PanelFoodUnit
            key={key}
            text={text}
            additionalText={additionalText + ' g'}
          />
        );
      });

      proteinOptions = Object.keys(this.state.data.props.protein).map((key) => {
        let text = key.replace('_', ' ');
        text = this.capitalizeFirstLetter(text);

        let additionalText = (this.state.data.props.protein[key] * mod).toFixed(
          2,
        );

        if (isNaN(additionalText)) {
          additionalText = this.state.data.props.protein[key];
        }

        if (additionalText.toString() === '0.00') {
          additionalText = '~';
        }

        return (
          <PanelFoodUnit
            key={key}
            text={text}
            additionalText={additionalText + ' g'}
          />
        );
      });

      vitaminsOptions = Object.keys(this.state.data.props.vitamins).map(
        (key) => {
          let text = key.replace('_', ' ');
          text = this.capitalizeFirstLetter(text);

          let additionalText = (
            this.state.data.props.vitamins[key] * mod
          ).toFixed(2);

          if (isNaN(additionalText)) {
            additionalText = this.state.data.props.vitamins[key];
          }

          if (additionalText.toString() === '0.00') {
            additionalText = '~';
          }

          return (
            <PanelFoodUnit
              key={key}
              text={text}
              additionalText={additionalText}
            />
          );
        },
      );

      mineralOptions = Object.keys(this.state.data.props.mineral).map((key) => {
        let text = key.replace('_', ' ');
        text = this.capitalizeFirstLetter(text);

        let additionalText = (this.state.data.props.mineral[key] * mod).toFixed(
          2,
        );

        if (isNaN(additionalText)) {
          additionalText = this.state.data.props.mineral[key];
        }

        if (additionalText.toString() === '0.00') {
          additionalText = '~';
        }

        return (
          <PanelFoodUnit
            key={key}
            text={text}
            additionalText={additionalText}
          />
        );
      });
    }

    let bottomHeight = isIphoneX() ? 65 + 34 : 65 + 34;
    // if (this.state.isServingsExpanded) {
    //   bottomHeight += 173;
    // }

    console.log(
      'comparing',
      this.initialAmount,
      this.state.servings,
      this.initialFraction,
      this.state.fractions,
      this.initialUnit,
      this.state.portionsSize,
    );

    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        <ScrollView>
          {/*Platform.OS === 'android') ? (
            <StatusBar
             backgroundColor='rgb(245,108,75)'
             barStyle='light-content'
           />
          ) : (
           <SafeAreaView style={{backgroundColor: 'rgb(0,164,228)', height: 20, overflow: 'hidden'}}>
             <View style={{width, height: isIphoneX() ? 300 + 25 : 300, position: 'absolute', top: 0, left: 0, overflow: 'visible', backgroundColor: 'rgb(255,255,255)'}}>
               <LinearGradient colors={['rgb(245,108,75)', 'rgb(248,138,97)']} start={{x: 0, y: 0}} end={{x: 0.8, y: 0}} locations={[0.4,0.8]} style={[styles.ovalOne, {overflow: 'hidden'}]}>
                 <LinearGradient colors={['rgb(241,115,76)', 'rgb(247,137,97)']} start={{x: 0, y: 0}} end={{x: 0.5, y: 0}} locations={[0.4,0.6]} style={styles.ovalTwo}></LinearGradient>
               </LinearGradient>
             </View>
           </SafeAreaView>
          )}

          <View style={{width, height: (Platform.OS === 'ios') ? 233 : 213 - 42, position: 'absolute', top: 0, left: 0, overflow: 'visible', backgroundColor: 'rgb(255,255,255)'}}>
            <LinearGradient colors={['rgb(245,108,75)', 'rgb(248,138,97)']} start={{x: 0, y: 0}} end={{x: 0.8, y: 0}} locations={[0.4,0.8]} style={[styles.ovalOne, {overflow: 'hidden'}]}>
              <LinearGradient colors={['rgb(241,115,76)', 'rgb(247,137,97)']} start={{x: 0, y: 0}} end={{x: 0.5, y: 0}} locations={[0.4,0.6]} style={styles.ovalTwo}></LinearGradient>
            </LinearGradient>
          </View>

          <Text style={styles.mainTitle}>Food</Text> */}

          <View
            style={{
              width: width - 40,
              height: 159,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: 'rgb(221,224,228)',
              alignSelf: 'center',
              backgroundColor: 'rgb(255,255,255)',
              marginTop: isIphoneX() ? 24 + 32 : 24,
            }}>
            <View
              style={{
                marginTop: 15,
                marginLeft: 15,
                marginRight: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: this.props.data.image}}
                style={{width: 64, height: 64}}
                resizeMode="contain"
              />

              <View style={{marginLeft: 16, marginTop: 7}}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {this.props.data.name}
                </Text>
                <View
                  style={[
                    styles.foodTextContainer,
                    {
                      marginTop: 10,
                      width: width - 175,
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
                      {width: this.rateWidth, marginTop: 0},
                    ]}>
                    <Text style={styles.foodText}>
                      {this.props.data.user_important_text}
                    </Text>
                  </LinearGradient>
                </View>
                <Text style={styles.foodSubText}>
                  {this.props.data.user_important_tip}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 20}}>
              <View>
                <Text style={styles.cardText}>
                  {this.state.data !== null &&
                  typeof this.state.data.props !== 'undefined' &&
                  typeof this.state.data.props.common !== 'undefined'
                    ? this.state.data.props.common.kcal
                    : ''}
                </Text>
                <Text style={styles.cardAdditionalText}>Kcal / 100g</Text>
              </View>

              <View style={[styles.stroke, {left: 78}]} />

              <View style={{position: 'absolute', left: 110}}>
                <Text style={styles.cardText}>
                  {this.props.data.glycemic_index}
                </Text>
                <Text style={styles.cardAdditionalText}>Gylcemic</Text>
              </View>

              <View style={[styles.stroke, {left: 188}]}></View>

              {this.props.data.portion !== 'n/a' &&
                this.props.data.portion__unit !== 'n/a' && (
                  <View style={{position: 'absolute', left: 218}}>
                    <Text style={styles.cardText}>
                      {this.props.data.portion + this.props.data.portion__unit}
                    </Text>
                    <Text style={styles.cardAdditionalText}>Avg Portion</Text>
                  </View>
                )}
            </View>
          </View>

          {((typeof this.props.isFromRecipes !== 'undefined' &&
            this.props.isFromRecipes !== null) ||
            (typeof this.props.isFromSaveMeal !== 'undefined' &&
              this.props.isFromSaveMeal !== null) ||
            typeof this.props.id !== 'undefined') && (
            <TouchableWithoutFeedback onPress={this.onServingsPress}>
              <View
                style={{
                  width: width - 40,
                  height: 72,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: 'rgb(212,219,229)',
                  alignSelf: 'center',
                  marginTop: 20,
                  flexDirection: 'row',
                }}>
                <View style={{marginTop: 16, marginLeft: 20, width: 56}}>
                  <Text style={styles.servingsTitle}>Servings</Text>
                  <Text style={styles.servingsText}>
                    {this.getDisplayingServings()}
                  </Text>
                </View>

                <View
                  style={{
                    width: 0.5,
                    height: 40,
                    backgroundColor: 'rgb(216,215,222)',
                    marginTop: 16,
                    marginLeft: 22,
                    marginRight: 20,
                  }}
                />

                <View style={{marginTop: 16}}>
                  {this.state.isLoading ? (
                    <ShineOverlay>
                      <View
                        style={{
                          width: 119,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                          marginTop: 10,
                        }}
                      />
                    </ShineOverlay>
                  ) : (
                    <View>
                      <Text style={styles.servingsTitle}>Portion Size</Text>
                      <Text style={styles.servingsText}>
                        {this.state.portionsSize}
                      </Text>
                    </View>
                  )}
                </View>

                {this.state.isServingsExpanded ? (
                  <Image
                    source={require('../resources/icon/arrowUp.png')}
                    style={{position: 'absolute', right: 20, top: 30}}
                  />
                ) : (
                  <Image
                    source={require('../resources/icon/arrowDown.png')}
                    style={{position: 'absolute', right: 20, top: 30}}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          )}

          <View>
            {this.state.data !== null &&
            typeof this.state.data.props !== 'undefined' ? (
              <View>
                <Text style={styles.nutritionalPropertiesText}>
                  Nutritional Properties
                </Text>

                <PanelFood
                  marginTop={34}
                  title="Calories"
                  text={
                    this.state.data !== null &&
                    typeof this.state.data.props !== 'undefined' &&
                    typeof this.state.data.props.common !== 'undefined'
                      ? Math.round(this.state.data.props.common.kcal * mod) +
                        ' Kcal'
                      : '0' + '.00 Kcal'
                  }
                  isDisabled={true}>
                  <View style={{marginTop: 4}}></View>
                </PanelFood>

                {this.state.data !== null &&
                  typeof this.state.data.props !== 'undefined' && (
                    <View>
                      {this.state.data !== null &&
                        this.state.data.props.carbs.carbs !== '0' && (
                          <PanelFood
                            marginTop={12.5}
                            title="Carbohydrates"
                            text={
                              (this.state.data.props.carbs.carbs * mod).toFixed(
                                2,
                              ) + ' g'
                            }
                            isExpanded={false}>
                            <View style={{marginTop: 4}}>{carbsOptions}</View>
                          </PanelFood>
                        )}

                      {this.state.data !== null &&
                        this.state.data.props.fat_total.fat_total !== '0' && (
                          <PanelFood
                            marginTop={12.5}
                            title="Fat"
                            text={
                              (
                                this.state.data.props.fat_total.fat_total * mod
                              ).toFixed(2) + ' g'
                            }
                            isExpanded={false}>
                            <View style={{marginTop: 4}}>{fatOptions}</View>
                          </PanelFood>
                        )}

                      {this.state.data !== null &&
                        this.state.data.props.protein.protein !== '0' && (
                          <PanelFood
                            marginTop={12.5}
                            title="Protein"
                            text={
                              (
                                this.state.data.props.protein.protein * mod
                              ).toFixed(2) + ' g'
                            }
                            isExpanded={false}>
                            <View style={{marginTop: 4}}>{proteinOptions}</View>
                          </PanelFood>
                        )}

                      {this.state.data !== null &&
                        this.state.data.props.vitamins.vitamins !== '0' && (
                          <PanelFood
                            marginTop={12.5}
                            title="Vitamins"
                            text={this.state.data.props.vitamins.vitamins}
                            isExpanded={false}>
                            <View style={{marginTop: 4}}>
                              {vitaminsOptions}
                            </View>
                          </PanelFood>
                        )}

                      {this.state.data !== null &&
                        this.state.data.props.mineral.mineral !== '0' && (
                          <PanelFood
                            marginTop={12.5}
                            title="Mineral"
                            text={this.state.data.props.mineral.mineral}
                            isExpanded={false}>
                            <View style={{marginTop: 4}}>{mineralOptions}</View>
                          </PanelFood>
                        )}
                    </View>
                  )}
              </View>
            ) : (
              <ShineOverlay>
                <View
                  style={{
                    width: width - 40,
                    alignSelf: 'center',
                    backgroundColor: 'rgb(255,255,255)',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: width - 176,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'rgb(242,243,246)',
                      marginTop: 32,
                    }}
                  />

                  <View
                    style={{
                      width: width - 40,
                      height: 48,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                      marginTop: 20,
                    }}>
                    <View
                      style={{
                        width: width - 225,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 48,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <View
                      style={{
                        width: width - 225,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 48,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <View
                      style={{
                        width: width - 225,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 48,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <View
                      style={{
                        width: width - 225,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 48,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <View
                      style={{
                        width: width - 225,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 16,
                        borderRadius: 9,
                        backgroundColor: 'rgb(242,243,246)',
                      }}
                    />
                  </View>
                </View>
              </ShineOverlay>
            )}
          </View>

          <View style={{height: bottomHeight}} />
        </ScrollView>

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
                  justifyContent: 'space-around',
                }}>
                <View
                  onTouchEnd={(e) => {
                    this.onPickerTouch(
                      e.nativeEvent.locationY,
                      this.state.servings2,
                      this.state.servings,
                    );
                    console.log('onTouchEnd', e.nativeEvent);
                  }}
                  onTouchMove={(e) => {
                    this.setState({isPickerMoving: true});
                    console.log('onTouchStart');
                  }}>
                  <Picker
                    style={{
                      backgroundColor: 'white',
                      width: 60, //(width - 40) / 2 - 20,
                      height: 200,
                    }}
                    selectedValue={this.state.servings2}
                    pickerData={
                      this.state.portionsSize2 === 'Gram' ||
                      this.state.portionsSize2 === 'Millilitre'
                        ? this.gmMlServings
                        : this.commonServings
                    }
                    onValueChange={(value) => {
                      this.setState({servings2: value});
                    }}
                    itemSpace={30} // this only support in android
                  />
                </View>

                {this.state.portionsSize2 !== 'Gram' &&
                  this.state.portionsSize2 !== 'Millilitre' && (
                    <View
                      onTouchEnd={(e) => {
                        this.onPickerTouch(
                          e.nativeEvent.locationY,
                          this.state.fractions2,
                          this.state.fractions,
                        );
                        console.log('onTouchStart', e.nativeEvent);
                      }}
                      onTouchMove={(e) => {
                        this.setState({isPickerMoving: true});
                        console.log('onTouchStart');
                      }}>
                      <Picker
                        style={{
                          backgroundColor: 'white',
                          width: 40,
                          height: 200,
                        }}
                        selectedValue={this.state.fractions2}
                        pickerData={['-', '1/4', '1/3', '1/2', '2/3', '3/4']}
                        onValueChange={(value) => {
                          this.setState({fractions2: value});
                        }}
                        itemSpace={30} // this only support in android
                      />
                    </View>
                  )}

                {!this.state.isLoading && (
                  <View
                    onTouchEnd={(e) => {
                      this.onPickerTouch(
                        e.nativeEvent.locationY,
                        this.state.portionsSize2,
                        this.state.portionsSize,
                      );
                      console.log('onTouchStart', e.nativeEvent);
                    }}
                    onTouchMove={(e) => {
                      this.setState({isPickerMoving: true});
                      console.log('onTouchStart');
                    }}>
                    <Picker
                      style={{
                        backgroundColor: 'white',
                        width: 200, //(width - 40) / 2 - 20,
                        height: 200,
                      }}
                      selectedValue={this.getSelectedValue(
                        this.state.portionsSize2,
                      )}
                      pickerData={this.state.portionSizes}
                      onValueChange={(value) => {
                        this.setState({
                          portionsSize2: value.split(' ')[0],
                        });
                      }}
                      itemSpace={30} // this only support in android
                    />
                  </View>
                )}
              </View>

              {isIphoneX() && <View style={{height: 34}} />}
            </View>
          </DialogContent>
        </Dialog>

        {(typeof this.props.id !== 'undefined' ||
          typeof this.props.isFromRecipes !== 'undefined' ||
          this.props.isFromRecipes !== null) &&
          (typeof this.props.isFromDiary !== 'undefined' &&
          this.props.isFromDiary === true ? (
            <TouchableWithoutFeedback
              onPress={
                this.props.isFromDiary &&
                this.initialAmount === this.state.servings &&
                this.initialFraction === this.state.fractions &&
                this.initialUnit === this.state.portionsSize
                  ? this.removeFromDiary
                  : this.updateDiary
              }>
              <View
                style={[
                  styles.doneButton,
                  this.props.isFromDiary &&
                    this.initialAmount === this.state.servings &&
                    this.initialFraction === this.state.fractions &&
                    this.initialUnit === this.state.portionsSize && {
                      backgroundColor: 'rgb(235,75,75)',
                    },
                ]}>
                <Text style={styles.doneButtonText}>
                  {this.props.isFromDiary &&
                  this.initialAmount === this.state.servings &&
                  this.initialFraction === this.state.fractions &&
                  this.initialUnit === this.state.portionsSize
                    ? 'Remove from Diary'
                    : 'Update Your Diary'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback onPress={this.onAddPress}>
              <View style={styles.doneButton}>
                <Text style={styles.doneButtonText}>
                  {typeof this.props.isFromRecipes !== 'undefined' &&
                  this.props.isFromRecipes !== null
                    ? 'Add to Recipes'
                    : 'Add to Diary'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}

        {isIphoneX() && (
          <View
            style={{
              height: 34,
              width,
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'rgb(255,255,255)',
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainTitle: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.41,
    lineHeight: 22,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
    position: 'absolute',
    top: 11,
  },
  cardTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: 'rgb(31,33,35)',
    // marginTop: 32,
    letterSpacing: -0.1,
    width: width - 175,
  },
  foodText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: -0.1,
    color: 'rgb(255,255,255)',
    marginLeft: 8,
  },
  nutritionalPropertiesText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(38,42,47)',
    marginTop: 32,
    marginHorizontal: 20,
  },
  foodTextContainer: {
    width: 15,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    marginTop: 10,
  },
  stroke: {
    width: 0.5,
    height: 32,
    backgroundColor: 'rgb(216,215,222)',
    position: 'absolute',
    top: 3,
  },
  cardText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 17,
    // letterSpacing: -0.4,
    color: 'rgb(38,42,47)',
  },
  cardAdditionalText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgb(141,147,151)',
    marginTop: 2,
  },
  foodSubText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: -0.38,
    color: 'rgb(138,138,143)',
    marginTop: 6,
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
  ovalOne: {
    position: 'absolute',
    right: 0,
    bottom: 250,
    width: 336,
    height: 336,
    borderRadius: width / 2,
    transform: [{scaleX: 2}, {scaleY: 2.55}],
    marginLeft: 201,
  },
  ovalTwo: {
    position: 'absolute',
    top: 265,
    left: 160,
    width: 250,
    height: 250,
    borderRadius: 250 / 2,
    transform: [{scaleX: 1.2}, {scaleY: 1.8}],
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
});

export default FoodDetails;

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
  KeyboardAvoidingView,
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
import Pie from 'react-native-pie';
import Swipeout from 'react-native-swipeout';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {PieChart} from 'react-native-svg-charts';
import Svg, {Path, G} from 'react-native-svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import SwitchComponent from '../components/Switch';
import * as shaefitApi from '../API/shaefitAPI';
import getRateColor from '../utils/getRateColor';
import FoodFilterPopup from '../components/FoodFilterPopup';
import PanelFood from '../components/PanelFood';
import PanelFoodUnit from '../components/PanelFoodUnit';
import FloatingLabelInput from '../components/FloatingLabelInput';
import LoadingIndicator from '../components/LoadingIndicator';

let Fraction = require('fraction.js');

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

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

class FoodListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isSwiped: false,
    };
  }

  onDelete = () => {
    this.props.onDeleteFoodItem(this.props.index);
  };

  render() {
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
              marginTop: 23,
              opacity: 1,
            }}>
            <Image
              source={require('../resources/icon/trashIcon.png')}
              style={{width: 19, height: 25}}
            />
          </View>
        ),
        onPress: () => {
          if (this.props.isEditable) {
            this.onDelete();
          }
        },
      },
    ];

    const unitName =
      typeof this.props.item.unit !== 'undefined'
        ? this.props.item.unit.name
        : '';

    // let amount = this.props.item.amount;
    // if (amount === 0.25 || amount === "0.25") {
    //   amount = "1/4";
    // } else if (amount === 0.33 || amount === "0.33") {
    //   amount = "1/3";
    // } else if (amount === 0.5 || amount === "0.5" || amount === "0.50") {
    //   amount = "1/2";
    // } else if (amount === 0.66 || amount === "0.66") {
    //   amount = "2/3";
    // } else if (amount === 0.75 || amount === "0.75") {
    //   amount = "3/4";
    // }

    let amount = new Fraction(this.props.item.amount)
      .simplify(0.015)
      .toFraction(true);

    if (amount.includes('1/7')) {
      amount = amount.replace('1/7', '1/8');
    } else if (amount.includes('13/25')) {
      amount = amount.replace('13/25', '1/2');
    } else if (amount.includes('7/11')) {
      amount = amount.replace('7/11', '2/3');
    } else if (amount.includes('13/20')) {
      amount = amount.replace('13/20', '2/3');
    } else if (amount.includes('3/10')) {
      amount = amount.replace('3/10', '1/3');
    } else if (amount.includes('7/9')) {
      amount = amount.replace('7/9', '2/3');
    } else if (amount.includes('24/25')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('10/11')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('5/8')) {
      amount = amount.replace('5/8', '2/3');
    } else if (amount.includes('2/7')) {
      amount = amount.replace('2/7', '1/3');
    } else if (amount.includes('15/16')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('3/5')) {
      amount = amount.replace('3/5', '2/3');
    } else if (amount.includes('49/50')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('5/16')) {
      amount = amount.replace('5/16', '1/3');
    } else if (amount.includes('3/8')) {
      amount = amount.replace('3/8', '1/3');
    } else if (amount.includes('7/8')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('3/7')) {
      amount = amount.replace('3/7', '1/2');
    } else if (amount.includes('4/13')) {
      amount = amount.replace('4/13', '1/3');
    } else if (amount.includes('4/7')) {
      amount = amount.replace('4/7', '2/3');
    } else if (amount.includes('32/33')) {
      amount = amount.split(' ');
      amount = parseInt(amount[0]) + 1;
    } else if (amount.includes('2/9')) {
      amount = amount.replace('2/9', '1/4');
    } else if (amount.includes('1/25')) {
      amount = amount.replace('1/25', '1/24');
    } else if (amount.includes('1/33')) {
      amount = amount.replace('1/33', '1/32');
    }

    return (
      <Swipeout
        right={swipeoutBtns}
        backgroundColor="rgb(255,255,255)"
        buttonWidth={88}
        style={{borderRadius: 0}}
        onOpen={() => this.setState({isSwiped: true})}
        onClose={() => this.setState({isSwiped: false})}>
        <View
          style={{
            width: width - 40,
            height: 70,
            alignSelf: 'center',
            borderBottomWidth:
              this.props.index + 1 !== this.props.length ? 0.5 : 0,
            borderBottomColor: 'rgb(216,215,222)',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={{uri: this.props.item.image}}
            style={{width: 30, height: 30}}
            resizeMode="cover"
          />
          <View style={{marginLeft: 20}}>
            <Text numberOfLines={1} style={styles.foodItemTitle}>
              {this.props.item.name}
            </Text>
            <Text style={styles.foodItemText}>{amount + ' ' + unitName}</Text>
          </View>

          <Text style={styles.foodItemCals}>
            {this.props.item.kcal + ' cal'}
          </Text>
        </View>
      </Swipeout>
    );
  }
}

class SavedMeals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mealName: 'Green Juices',
      food: [],
      photo: '',
      photoUri: '',
      photoFileName: '',
      isEditable: true,
      foodArray: [],

      isHintNutrientsModalVisible: false,
      hintNutrientsTouchPosition: {},
      hintNutrientsColor: '',
      hintNutrientsText: '',
      hintNutrientsValue: 0,
      isLoading: false,
    };

    this.carbs = 0;
    this.fat = 0;
    this.protein = 0;
    this.cals = 0;
    this.newItemsArray = [];
    this.itemsToDelete = [];
  }

  // componentWillMount() {
  //   this.props.navigation.setParams({
  //     'onRight': this.handleEditPress
  //   })
  // }

  UNSAFE_componentWillMount() {
    Actions.refresh({rightTitle: 'Delete', onRight: this._delete});
  }

  _delete = () => {
    console.log('delete');
    this.props.onDelete();
    setTimeout(() => {
      Actions.popTo('searchFoodScreen');
    }, 300);
  };

  // _renderRightButton = () => {
  //    return(
  //      <TouchableWithoutFeedback onPress={() => console.log('edit') } >
  //        <Text>Edit1</Text>
  //      </TouchableWithoutFeedback>
  //    );
  //  };

  async componentDidMount() {
    if (typeof this.props.data.photo_path !== 'undefined') {
      this.setState({
        photoUri:
          this.props.data.photo_path.url + this.props.data.photo_path.path,
      });
    }
    this.setState(
      {food: this.props.data.foods, mealName: this.props.data.name},
      () => {
        console.log('this.state.food', this.state.food);
      },
    );

    console.log('this.props.data', this.props.data);

    console.log('this.props.foodDiaryId', this.props.foodDiaryId);
    console.log('this.props.mealTypeId', this.props.mealTypeId);
    console.log('this.props.entryDate', this.props.entryDate);

    const promises = []; //getFoodById
    for (let i = 0; i < this.props.data.foods.length; i++) {
      const func = this.getFoodById(this.props.data.foods[i].food.id);
      promises.push(func);
    }

    Promise.all(promises).then((values) => {
      console.log('promises resolved', values);
      console.log('foodArray', this.state.foodArray);
      this.setState({food: this.state.foodArray});
    });
  }

  getFoodById = async (id) => {
    const data = await shaefitApi.getFoodById(id);
    let array = this.state.foodArray;

    let amount = 0;
    let unit = {};
    let foodId = 0;
    let kcal = 0;
    for (let i = 0; i < this.state.food.length; i++) {
      if (this.state.food[i].food.id === id) {
        foodId = this.state.food[i].id;
        amount = this.state.food[i].amount;
        kcal = this.state.food[i].cals;
        unit.id = this.state.food[i].unit.id;
        unit.name = this.state.food[i].unit.name;

        break;
      }
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
      kcal: kcal, //data.props.common.kcal,
      // carbs: data.props.carbs.carbs,
      // fat: data.props.fat_total.fat_total,
      // protein: data.props.protein.protein,
      carbs: data.props.carbs.carbs === null ? '0' : data.props.carbs.carbs,
      fat:
        data.props.fat_total.fat_total === null
          ? '0'
          : data.props.fat_total.fat_total,
      protein:
        data.props.protein.protein === null ? '0' : data.props.protein.protein,
      amount: amount,
      unit: unit,
      foodId: foodId,
    });

    this.setState({foodArray: array});
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps SavedMeals');
    if (
      typeof nextProps.newFood !== 'undefined' &&
      nextProps.newFood !== this.props.newFood
    ) {
      console.log(
        'componentWillReceiveProps nextProps.newFood',
        nextProps.id,
        nextProps.newFood,
      );

      let food = this.state.food;
      food.push(nextProps.newFood);
      this.setState({food});

      this.newItemsArray.push(nextProps.newFood);

      // this.getFoodById(nextProps.newFood.id);

      // Actions.refresh({ key: 'foodDiary', newFood: nextProps.newFood, id: nextProps.id });
    }
  }

  handleEditPress = () => {
    console.log('edit');
  };

  getPhoto = () => {
    try {
      const options = {
        mediaType: 'photo',
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorCode);
        } else if (response.errorMessage) {
          console.log('User tapped custom button: ', response.errorMessage);
        } else {
          let source = {
            uri:
              Platform.OS === 'android'
                ? response.uri
                : response.uri.replace('file://', ''),
          };

          let fileName;
          if (typeof response.fileName === 'undefined') {
            const splittedUrl = response.uri.split('/');
            if (splittedUrl.length !== 0) {
              fileName = splittedUrl[splittedUrl.length - 1];
            }
          } else {
            fileName = response.fileName;
          }

          console.log(source.uri);
          // source = { uri: 'file://' + image.path };
          // source = { uri: image.path };

          console.log('fileName', fileName);

          console.log('image picker', response.width, response.height);

          if (response.width > 1200) {
            const aspectRatio = response.width / response.height;

            ImageResizer.createResizedImage(
              source.uri,
              1200,
              parseInt(response.height * aspectRatio),
              'JPEG',
              90,
            )
              .then((resizerResponse) => {
                console.log('resizer');
                this.setState({
                  photoUri: resizerResponse.uri,
                  photoFileName: fileName,
                });
              })
              .catch((err) => {
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
          } else {
            this.setState({photoUri: source.uri, photoFileName: fileName});
          }
        }
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  getPercentages = () => {
    let totalAmount = 0;
    let carbs = 0;
    let fat = 0;
    let protein = 0;
    let cals = 0;

    console.log('getPercentages', totalAmount, carbs, fat, protein);

    for (let i = 0; i < this.state.foodArray.length; i++) {
      totalAmount =
        totalAmount +
        parseFloat(this.state.foodArray[i].carbs) +
        parseFloat(this.state.foodArray[i].fat) +
        parseFloat(this.state.foodArray[i].protein);
      carbs = carbs + parseFloat(this.state.foodArray[i].carbs);
      fat = fat + parseFloat(this.state.foodArray[i].fat);
      protein = protein + parseFloat(this.state.foodArray[i].protein);
      cals = cals + parseFloat(this.state.foodArray[i].kcal);
    }

    // totalAmount = totalAmount + parseFloat(this.props.data.carbs) + parseFloat(this.props.data.fat) + parseFloat(this.props.data.protein);
    // carbs = carbs + parseFloat(this.props.data.carbs);
    // fat = fat + parseFloat(this.props.data.fat);
    // protein = protein + parseFloat(this.props.data.protein);
    // cals = cals + parseFloat(this.props.data.cals);

    this.carbs = carbs;
    this.fat = fat;
    this.protein = protein;
    this.cals = cals;

    console.log('getPercentages', totalAmount, carbs, fat, protein);

    return [
      parseFloat((carbs / totalAmount) * 100).toFixed(2),
      parseFloat((fat / totalAmount) * 100).toFixed(2),
      parseFloat((protein / totalAmount) * 100).toFixed(2),
    ];
  };

  onDeleteFoodItem = (index) => {
    // let array = this.state.food;
    // shaefitApi.deleteFoodFromSavedMeal(this.props.data.id, array[index].foodId);
    //
    // array.splice(index, 1);
    //
    // this.setState({food: array});
    //
    // for (let i = 0; i < this.newItemsArray.length; i++) {
    //   if (this.newItemsArray[i].id === array[index].id) {
    //     this.newItemsArray.splice(i, 1);
    //
    //     break;
    //   }
    // }

    let array = this.state.food;
    this.itemsToDelete.push(array[index]);

    array.splice(index, 1);

    this.setState({food: array});
  };

  _renderFoodListItem = ({item, index}) => {
    return (
      <FoodListItem
        index={index}
        item={item}
        length={this.state.food.length}
        onDeleteFoodItem={this.onDeleteFoodItem}
        isEditable={this.state.isEditable}
      />
    );
  };

  onAddFoodPress = () => {
    Actions.details({
      key: 'searchFoodScreen',
      isFromSavedMeals: true,
    });
  };

  onSaveMealPress = async () => {
    this.setState({isLoading: true});
    await shaefitApi.updateSavedMeals(this.props.data.id, {
      name: this.state.mealName,
      carbs: this.carbs,
      fat: this.fat,
      protein: this.protein,
      foods: this.newItemsArray,
      cals: this.cals,
      photo: {
        uri: this.state.photoUri,
        name: this.state.photoFileName,
        type: `image/jpeg`,
      },
      // photo: this.state.photoUri,
    });

    this.props.refresh();

    console.log('this.itemsToDelete', this.itemsToDelete);
    for (let i = 0; i < this.itemsToDelete.length; i++) {
      console.log('onDelete', this.itemsToDelete[i]);
      if (typeof this.itemsToDelete[i] !== 'undefined') {
        shaefitApi.deleteFoodFromSavedMeal(
          this.props.data.id,
          this.itemsToDelete[i].id,
        );
      }
    }

    this.setState({isLoading: false});

    // const food = {...this.props.data, ...{kcal: this.props.data.cals, carbs: this.props.data.carbs, fat: this.props.data.fat, protein: this.props.data.protein, amount: this.state.servings, unit: {id: portion.id, name: portion.name}}};

    // if (typeof this.props.foodDiaryId !== 'undefined') {
    //   // shaefitApi.addFoodDiaryEntries(this.props.data.id, this.state.food);
    // } else {
    //
    // }

    setTimeout(() => {
      Actions.popTo('savedMealsUneditable');
      // Actions.pop();
    }, 100);

    Actions.refresh({
      key: 'savedMealsUneditable',
      editedFood: this.state.food,
      foodDiaryId: this.props.foodDiaryId,
      mealTypeId: this.props.mealTypeId,
      entryDate: this.props.entryDate,
      isFromEditMeal: true,
      photoUri: this.state.photoUri,
      name: this.state.mealName,
    });
  };

  render() {
    const percentages = this.getPercentages();

    const pieChartData = [];

    pieChartData.push({
      value: percentages[0],
      svg: {
        fill: 'rgb(105,88,232)',
        onPress: () => {
          this.scrollView?.scrollTo({ x: 0, y: 0, animated: true });
          // this.scrollView.props.scrollToPosition(0, 0);
          this.setState({
            isHintNutrientsModalVisible: true,
            hintNutrientsValue: `${percentages[0]}`,
            hintNutrientsColor: 'rgb(105,88,232)',
            hintNutrientsText: 'Carbs',
          });
        },
      },
      key: 0,
    });

    pieChartData.push({
      value: percentages[1],
      svg: {
        fill: 'rgb(42,204,197)',
        onPress: () => {
          this.scrollView?.scrollTo({ x: 0, y: 0, animated: true });
          // this.scrollView.props.scrollToPosition(0, 0);
          this.setState({
            isHintNutrientsModalVisible: true,
            hintNutrientsValue: `${percentages[1]}`,
            hintNutrientsColor: 'rgb(42,204,197)',
            hintNutrientsText: 'Fat',
          });
        },
      },
      key: 1,
    });

    pieChartData.push({
      value: percentages[2],
      svg: {
        fill: 'rgb(234,196,50)',
        onPress: () => {
          this.scrollView?.scrollTo({ x: 0, y: 0, animated: true });
          // this.scrollView.props.scrollToPosition(0, 0);
          this.setState({
            isHintNutrientsModalVisible: true,
            hintNutrientsValue: `${percentages[2]}`,
            hintNutrientsColor: 'rgb(234,196,50)',
            hintNutrientsText: 'Protein',
          });
        },
      },
      key: 2,
    });

    return (
      <View
        style={{
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
          marginTop: isIphoneX() ? -6 : -10,
        }}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          scrollEnabled
          // ref={(ref) => {
          //   this.scrollView = ref;
          // }}
          innerRef={(ref) => {
            this.scrollView = ref;
          }}>
          {this.state.photoUri === '' ? (
            <View
              style={{
                width,
                height: 200,
                backgroundColor: 'rgb(233,237,243)',
              }}></View>
          ) : (
            <View
              style={{
                width,
                height: 200,
                backgroundColor: 'rgb(233,237,243)',
              }}>
              <Image
                source={{uri: this.state.photoUri}}
                style={{width, height: 200}}
                resizeMode="cover"
              />
            </View>
          )}

          <FloatingLabelInput
            label={'Meal Name'}
            value={this.state.mealName}
            onChangeText={(value) => this.setState({mealName: value})}
            width={width - 40}
            marginTop={24}
            phoneInputType={false}
            keyboard={'default'}
            editable={this.state.isEditable ? true : false}
          />

          <View
            style={{
              width: width - 40,
              height: 180,
              marginTop: 20,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: 'rgb(221,224,228)',
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: width - 80,
                alignSelf: 'center',
                height: 130,
                marginTop: 25,
              }}>
              {/*<Pie
                radius={65}
                sections={[
                  {
                    percentage: this.getPercentages()[0],
                    color: 'rgb(105,88,232)',
                  },
                  {
                    percentage: this.getPercentages()[1],
                    color: 'rgb(42,204,197)',
                  },
                  {
                    percentage: this.getPercentages()[2],
                    color: 'rgb(234,196,50)',
                  },
                ]}
                dividerSize={2}
                innerRadius={37.5}
                strokeCap={'butt'}
              />*/}

              <View
                style={{width: 130, height: 130, alignSelf: 'center'}}
                onTouchStart={(e) =>
                  this.setState({hintNutrientsTouchPosition: e.nativeEvent})
                }>
                <PieChart
                  style={{height: 130, width: 130}}
                  data={pieChartData}
                  outerRadius="100%"
                  innerRadius="65%"
                  sort={() => null}
                />
              </View>

              <View style={{marginLeft: 20, width: width - 230}}>
                <View
                  style={{
                    width: width - 230,
                    height: 48,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgb(105,88,232)',
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={styles.chartText}>{`${percentages[0]}% Carbs`}</Text>
                </View>

                <View
                  style={{
                    width: width - 230,
                    height: 48,
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderTopWidth: 0.5,
                    borderBottomWidth: 0.5,
                    borderColor: 'rgb(216,215,222)',
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgb(42,204,197)',
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={styles.chartText}>{`${percentages[1]}% Fat`}</Text>
                </View>

                <View
                  style={{
                    width: width - 230,
                    height: 48,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgb(234,196,50)',
                      marginRight: 10,
                    }}
                  />
                  <Text
                    style={
                      styles.chartText
                    }>{`${percentages[2]}% Protein`}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.title}>Foods in this Meal</Text>

          <FlatList
            data={this.state.food}
            extraData={this.state.food}
            keyExtractor={(item, index) => item.name + index.toString()}
            renderItem={this._renderFoodListItem}
            contentContainerStyle={{overflow: 'visible', paddingTop: 5}}
            keyboardShouldPersistTaps="always"
            initialNumToRender={10}
            bounces={false}
          />

          <TouchableWithoutFeedback
            onPress={() =>
              this.state.isEditable ? this.onAddFoodPress() : null
            }>
            <View
              style={{
                marginTop: 16,
                alignSelf: 'center',
                width: width - 40,
                height: 36,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: 'rgb(0,168,235)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.addFoodText}>Add Food</Text>
            </View>
          </TouchableWithoutFeedback>

          <View style={{height: isIphoneX() ? 34 + 48 + 32 : 48 + 32}} />

          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgb(0,0,0)']}
            style={{
              width,
              height: 200,
              opacity: 0.7,
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
            }}
          />

          <TouchableWithoutFeedback
            onPress={() => (this.state.isEditable ? this.getPhoto() : null)}>
            <View style={{position: 'absolute', alignSelf: 'center'}}>
              <Image
                source={require('../resources/icon/addPhoto.png')}
                style={{alignSelf: 'center', marginTop: 62}}
              />

              <Text style={styles.addPhotoText}>Change Photo</Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>

        <KeyboardAvoidingView
          style={{justifyContent: 'flex-end'}}
          behavior={Platform.OS === 'ios' ? 'position' : null}
          keyboardVerticalOffset={
            Platform.OS === 'android' ? 0 : isIphoneX() ? 54 : 60
          }>
          <View>
            <TouchableWithoutFeedback onPress={this.onSaveMealPress}>
              <View style={styles.doneButton}>
                {this.state.isLoading ? (
                  <LoadingIndicator isLoading={true} />
                ) : (
                  <Text style={styles.doneButtonText}>Save Meal</Text>
                )}
              </View>
            </TouchableWithoutFeedback>

            {isIphoneX() && (
              <View
                style={{
                  height: 34,
                  width,
                  backgroundColor: 'rgb(255,255,255)',
                  // position: "absolute",
                  // bottom: 0,
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>

        {isIphoneX() && (
          <View
            style={{
              height: 34,
              width,
              backgroundColor: 'rgb(255,255,255)',
              position: 'absolute',
              bottom: 0,
            }}
          />
        )}

        <Dialog
          visible={this.state.isHintNutrientsModalVisible}
          containerStyle={{marginTop: 20}}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isHintNutrientsModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isHintNutrientsModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          hasOverlay={false}
          dialogStyle={{
            width,
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
          }}>
          <DialogContent
            style={{
              position: 'absolute',
              top: isIphoneX()
                ? this.state.hintNutrientsTouchPosition.locationY - 163
                : Platform.OS === 'ios'
                ? this.state.hintNutrientsTouchPosition.locationY - 123 + 20
                : this.state.hintNutrientsTouchPosition.locationY - 123,
              left: this.state.hintNutrientsTouchPosition.locationX - 90,
            }}>
            <TouchableWithoutFeedback
              onPress={() =>
                this.setState({isHintNutrientsModalVisible: false})
              }>
              <View>
                <BoxShadow
                  setting={{
                    ...shadowOpt,
                    ...{
                      width: 200,
                      height: 103,
                      y: 6,
                      border: 16,
                      radius: 4,
                      opacity: 0.08,
                    },
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      height: 103,
                      width: 200,
                      backgroundColor: 'rgb(255,255,255)',
                      borderRadius: 4,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: this.state.hintNutrientsColor,
                        marginHorizontal: 20,
                        marginTop: 19,
                      }}
                    />
                    <Text style={styles.hintTitle}>
                      {this.state.hintNutrientsText}
                    </Text>
                    <Text
                      style={
                        styles.hintText
                      }>{`${this.state.hintNutrientsValue}%`}</Text>
                  </View>
                </BoxShadow>

                <Animatable.View
                  animation="fadeIn"
                  delay={10}
                  duration={200}
                  style={{marginTop: -8, marginLeft: 85}}>
                  <Svg height="30" width="75">
                    <Path
                      d="M 800 50 L 0 50 C 50 50 50 50 100 100 C 350 350 350 400 400 400 C 450 400 450 350 700 100 C 750 50 750 50 800 50"
                      fill="white"
                      scale="0.05"
                    />
                  </Svg>
                </Animatable.View>
              </View>
            </TouchableWithoutFeedback>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addPhotoText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 17,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
    marginTop: 16,
  },
  chartText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 15,
    color: 'rgb(54,58,61)',
  },
  title: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(38,42,47)',
    marginTop: 32,
    marginHorizontal: 20,
  },
  foodItemTitle: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: 'rgb(38,42,47)',
    width: width - 150,
  },
  foodItemText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(141,147,151)',
    marginTop: 2,
  },
  foodItemCals: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    fontWeight: '400',
    color: 'rgb(38,42,47)',
    position: 'absolute',
    top: 28,
    right: 0,
  },
  addFoodText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: 'rgb(0,168,235)',
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
  hintTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(141,147,151)',
    marginTop: 16,
    marginLeft: 20,
  },
  hintText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 20,
    color: 'rgb(54,58,61)',
    marginTop: 3,
    marginLeft: 20,
  },
});

export default SavedMeals;

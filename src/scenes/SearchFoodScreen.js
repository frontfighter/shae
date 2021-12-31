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
import Swipeout from 'react-native-swipeout';
import FastImage from 'react-native-fast-image';

import SwitchComponent from '../components/Switch';
import * as shaefitApi from '../API/shaefitAPI';
import getRateColor from '../utils/getRateColor';
import FoodFilterPopup from '../components/FoodFilterPopup';
import RecipesPopup from '../components/RecipesPopup';
import SavedmealFilter from '../components/SavedmealFilter';
import ShineOverlay from '../components/ShineOverlay';

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

const scaleAnimation = new ScaleAnimation({
  toValue: 0,
  useNativeDriver: true,
});

const slideAnimation = new SlideAnimation({
  initialValue: 0, // optional
  slideFrom: 'bottom', // optional
  useNativeDriver: true, // optional
});

class FoodListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.rateColor = null;
    this.rateWidth = null;
  }

  UNSAFE_componentWillMount() {
    const rate = getRateColor(this.props.item.user_importance_val, width - 175);

    this.rateColor = rate.color;
    this.rateWidth = rate.width;
  }

  onPress = () => {
    // if (this.props.isFromRecipes !== null) {
    //   Actions.popTo('recipe', {newFood: food});
    //   Actions.refresh({ key: 'foodDiary', newFood: food });
    // } else {
    //   Actions.foodDetails({data: this.props.item});
    // }

    Actions.foodDetails({
      data: this.props.item,
      isFromRecipes: this.props.isFromRecipes,
      isFromSaveMeal: this.props.isFromSaveMeal,
      isFromSavedMeals: this.props.isFromSavedMeals,
      id: this.props.id,
    });
  };

  // <View style={{marginTop: (this.props.index === 0) ? 24 : 16}}>
  //   <BoxShadow setting={{...shadowOpt, ...{height: 88, style: {alignSelf: 'center'}}}}>
  //     <TouchableWithoutFeedback onPress={this.onPress}>
  //       <View style={{width: width - 40, height: 88, borderRadius: 10, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)'}}>
  //         <View style={{marginTop: 14, marginLeft: 17, marginRight: 20, flexDirection: 'row', alignItems: 'center'}}>
  //           <Image
  //             source={{uri: this.props.item.image}}
  //             style={{width: 61, height: 61}}
  //             resizeMode="contain"
  //           />
  //
  //           <View style={{marginLeft: 17}}>
  //             <Text numberOfLines={1} style={styles.foodCardTitle}>{this.props.item.name}</Text>
  //
  //             <View style={[styles.foodTextContainer, {marginTop: 10, width: width - 225, backgroundColor: 'rgb(235,241,243)'}]}>
  //               <LinearGradient colors={this.rateColor} start={{x: 0, y: 0}} end={{x: 1, y: 0}} locations={[0.5,1]} style={[styles.foodTextContainer, {width: this.rateWidth, marginTop: 0}]}>
  //                 <Text style={styles.foodText}>{this.props.item.user_importance_text}</Text>
  //               </LinearGradient>
  //             </View>
  //           </View>
  //
  //           <Image
  //             source={require('../resources/icon/arrowRight.png')}
  //             style={{position: 'absolute', right: 0, top: 24}}
  //           />
  //
  //         </View>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   </BoxShadow>
  // </View>

  render() {
    return (
      <View>
        {this.props.isLoading ? (
          <ShineOverlay>
            <View
              style={{
                width,
                height: 108,
                alignSelf: 'center',
                backgroundColor: 'rgb(255,255,255)',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  marginHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 5,
                    backgroundColor: 'rgb(242,243,246)',
                    marginRight: 30,
                  }}
                />
                <View>
                  <View
                    style={{
                      marginTop: 6,
                      width: width - 176,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'rgb(242,243,246)',
                    }}
                  />
                  <View
                    style={{
                      marginTop: 10,
                      width: width - 225,
                      height: 16,
                      borderRadius: 10,
                      backgroundColor: 'rgb(242,243,246)',
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  width: width - 135,
                  height: 0.5,
                  backgroundColor: 'rgb(242,243,246)',
                  position: 'absolute',
                  bottom: 0,
                  right: 20,
                }}
              />
            </View>
          </ShineOverlay>
        ) : (
          <TouchableWithoutFeedback onPress={this.onPress}>
            <View
              style={{
                marginTop: 0,
                width,
                height: 108,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 88,
                  height: 88,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 12,
                }}>
                <Image
                  source={{uri: this.props.item.image}}
                  style={{width: 88, height: 88}}
                  resizeMode="contain"
                />
              </View>

              <View style={{marginLeft: 16}}>
                <Text numberOfLines={1} style={styles.foodCardTitle}>
                  {this.props.item.name}
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
                      {this.props.item.user_important_text}
                    </Text>
                  </LinearGradient>
                </View>

                <Text style={styles.foodSubText}>
                  {this.props.item.user_important_tip}
                </Text>
              </View>

              <Image
                source={require('../resources/icon/arrowRight.png')}
                style={{position: 'absolute', right: 20, top: 48}}
              />

              <View
                style={{
                  position: 'absolute',
                  right: 20,
                  bottom: 0,
                  width: width - 135,
                  height: 1,
                  backgroundColor: 'rgb(221,224,228)',
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

class RecipesListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    this.rateColor = null;
    this.rateWidth = null;
  }

  UNSAFE_componentWillMount() {
    const rate = getRateColor(this.props.item.importance_val, 82, 'Recipes');

    this.rateColor = rate.color;
    this.rateWidth = rate.width;
  }

  onPress = () => {
    Actions.recipeDetails({
      data: this.props.item,
      id: this.props.id,
      foodDiaryId: this.props.foodDiaryId,
    });
  };

  render() {
    return (
      <View
        style={{
          marginTop: this.props.index === 0 || this.props.index === 1 ? 20 : 16,
          marginRight: this.props.index % 2 === 0 ? 15 : 16,
          marginLeft: this.props.index % 2 === 0 ? 16 : 0,
          borderRadius: 5,
        }}>
        {this.props.isLoading ? (
          <BoxShadow
            setting={{
              ...shadowOpt,
              ...{
                width: (width - 47) / 2,
                height: 225,
                y: 1,
                border: 5,
                opacity: 0.075,
                style: {
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                },
              },
            }}>
            <View
              style={{
                width: (width - 47) / 2,
                height: 225,
                borderRadius: 5,
                alignSelf: 'center',
                backgroundColor: 'rgb(255,255,255)',
                shadowOpacity: 0,
              }}>
              <View
                style={{
                  width: (width - 47) / 2,
                  height: 164,
                  backgroundColor: 'rgb(242,243,246)',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                }}
              />
              <View style={{marginLeft: 13, marginTop: 12}}>
                <ShineOverlay>
                  <View
                    style={{
                      width: width - 252,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: 'rgb(242,243,246)',
                    }}
                  />
                  <View
                    style={{
                      width: width - 293,
                      height: 10,
                      borderRadius: 7,
                      backgroundColor: 'rgb(242,243,246)',
                      marginTop: 6,
                    }}
                  />
                </ShineOverlay>
              </View>
            </View>
          </BoxShadow>
        ) : (
          <BoxShadow
            setting={{
              ...shadowOpt,
              ...{
                width: (width - 47) / 2,
                height: 225,
                y: 1,
                border: 5,
                opacity: 0.075,
                style: {alignSelf: 'center'},
              },
            }}>
            <TouchableWithoutFeedback onPress={() => this.onPress()}>
              <View
                style={{
                  width: (width - 47) / 2,
                  height: 225,
                  borderRadius: 5,
                  alignSelf: 'center',
                  backgroundColor: 'rgb(255,255,255)',
                }}>
                <View style={styles.image}>
                  <View style={{position: 'absolute'}}>
                    <FastImage
                      source={{
                        uri: this.props.item.images[0],
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                        // cache: FastImage.cacheControl.web,
                      }}
                      style={{
                        width: (width - 47) / 2,
                        height: 164,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                      // resizeMode={FastImage.resizeMode.contain}
                    />
                    {/*<Image
                      source={{ uri: this.props.item.images[0] }}
                      style={{
                        width: (width - 47) / 2,
                        height: 164,
                        borderTopRightRadius: 5,
                        borderTopLeftRadius: 5,
                      }}
                    /> */}
                  </View>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgb(0,0,0)']}
                    style={{
                      width: (width - 47) / 2,
                      height: 164,
                      opacity: 0.4,
                      borderTopLeftRadius: 6,
                      borderTopRightRadius: 6,
                      overflow: 'hidden',
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      width: (width - 47) / 2,
                      bottom: 8,
                      left: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={[
                        styles.rateContainer,
                        {
                          backgroundColor: 'rgb(235,241,243)',
                          width: 82,
                          maxWidth: 82,
                        },
                      ]}>
                      <LinearGradient
                        colors={this.rateColor}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        locations={[0.5, 1]}
                        style={[
                          styles.rateContainer,
                          {
                            width: this.rateWidth + 8,
                            maxWidth: 82,
                            bottom: 0,
                            left: 0,
                          },
                        ]}>
                        <Text style={styles.rateText}>
                          {this.props.item.importance_text.toUpperCase()}
                        </Text>
                      </LinearGradient>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 8,
                      }}>
                      <Image
                        source={require('../resources/icon/time.png')}
                        style={styles.icon}
                      />
                      <Text style={styles.timeText}>
                        {this.props.item.cook_time + 'm'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text numberOfLines={1} style={styles.recipeTitle}>
                  {this.props.item.title}
                </Text>
                <Text style={styles.additionalRecipeText}>
                  {this.props.item.ingredient_count + ' Ingredients'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </BoxShadow>
        )}
      </View>
    );
  }
}

class SavedMealsListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {isSwiped: false};
  }

  onPress = () => {
    Actions.savedMealsUneditable({
      data: this.props.item,
      foodDiaryId: this.props.foodDiaryId,
      mealTypeId: this.props.mealTypeId,
      entryDate: this.props.entryDate,
      onDelete: this.onDelete,
      refresh: this.props.refresh,
    });
    // Actions.savedMeals({data: this.props.item, foodDiaryId: this.props.foodDiaryId, mealTypeId: this.props.mealTypeId, entryDate: this.props.entryDate});
  };

  // <View style={{borderBottomWidth: 0.5, borderBottomColor: 'rgb(216,215,222)'}}>
  //   <TouchableWithoutFeedback onPress={this.onPress}>
  //     <View style={{width: width - 40, height: 88, alignSelf: 'center', backgroundColor: 'rgb(255,255,255)', flexDirection: 'row', alignItems: 'center'}}>
  //       <Image
  //         source={{uri: this.props.item.image}}
  //         style={{width: 48, height: 48}}
  //         resizeMode="contain"
  //       />
  //
  //       <View style={{marginLeft: 20}}>
  //         <Text style={styles.savedMealTitle}>{this.props.item.name}</Text>
  //         <Text style={styles.savedMealText}>{this.props.item.kcal + ' kcal'}</Text>
  //       </View>
  //
  //       <Image
  //         source={require('../resources/icon/arrowRight.png')}
  //         style={{position: 'absolute', right: 0, top: 38}}
  //       />
  //     </View>
  //   </TouchableWithoutFeedback>
  // </View>

  onDelete = () => {
    this.props.onMealDelete(this.props.index, this.props.item.id);
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
              marginTop: 30,
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

    return (
      <Swipeout
        right={swipeoutBtns}
        backgroundColor="rgb(255,255,255)"
        buttonWidth={88}
        style={{borderRadius: 0}}
        onOpen={() => this.setState({isSwiped: true})}
        onClose={() => this.setState({isSwiped: false})}>
        <View>
          <TouchableWithoutFeedback onPress={this.onPress}>
            <View
              style={{
                width: width - 40,
                height: 88,
                alignSelf: 'center',
                backgroundColor: 'rgb(255,255,255)',
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgb(216,215,222)',
              }}>
              {typeof this.props.item.photo_path !== 'undefined' ? (
                <Image
                  source={{
                    uri:
                      this.props.item.photo_path.url +
                      this.props.item.photo_path.path,
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    marginLeft: 0,
                    borderRadius: 5,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    marginLeft: 0,
                    borderRadius: 5,
                    backgroundColor: 'rgb(233,237,243)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image source={require('../resources/icon/meal.png')} />
                </View>
              )}

              <View style={{marginLeft: 20}}>
                <Text style={styles.savedMealTitle}>
                  {this.props.item.name}
                </Text>
                <Text style={styles.savedMealText}>
                  {this.props.item.cals + ' kcal'}
                </Text>
              </View>

              <Image
                source={require('../resources/icon/arrowRight.png')}
                style={{position: 'absolute', right: 20, top: 38}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Swipeout>
    );
  }
}

class HistoryListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onPress = async () => {
    const data = await shaefitApi.getFoodById(this.props.item.food.id);

    Actions.foodDetails({
      data: data,
      isFromHistory: true,
      amount: this.props.item.amount,
      unit: this.props.item.unit,
      id: this.props.id,
    });
  };

  render() {
    const unitName =
      typeof this.props.item.unit !== 'undefined'
        ? this.props.item.unit.name
        : '';

    // let amount = this.props.item.amount;
    // if (amount === 0.25 || amount === "0.25") {
    //   amount = "1/4";
    // } else if (amount === 0.33 || amount === "0.33") {
    //   amount = "1/3";
    // } else if (amount === 0.5 || amount === "0.5") {
    //   amount = "1/2";
    // } else if (amount === 0.66 || amount === "0.66") {
    //   amount = "2/3";
    // } else if (amount === 0.75 || amount === "0.75") {
    //   amount = "3/4";
    // }

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View
          style={{
            width: width - 40,
            height: 71,
            backgroundColor: 'rgb(255,255,255)',
            justifyContent: 'center',
            alignSelf: 'center',
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgb(216,215,222)',
          }}>
          <View>
            <Text style={styles.historyTitle}>{this.props.item.food.name}</Text>
          </View>

          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
            <Text style={styles.historyUnit}>
              {this.props.item.amount + ' ' + unitName}
            </Text>
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                marginHorizontal: 8,
                backgroundColor: 'rgb(173,179,183)',
              }}
            />
            <Text style={styles.historyCal}>
              {this.props.item.cals + ' kcal'}
            </Text>
          </View>

          <Image
            source={require('../resources/icon/arrowRight.png')}
            style={{position: 'absolute', right: 0, top: 30}}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class SearchFoodScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabActive:
        typeof this.props.tabIndex !== 'undefined' ? this.props.tabIndex : 0,
      searchPlaceholderText: 'Search food…',
      searchText: '',
      isLoading: false,

      foodListArray: null,
      pageFood: 1,
      totalPagesFood: -1,
      foodType: false,
      foodCategory: false,
      refreshingFood: false,

      recipesArray: null,
      pageRecipes: 1,
      totalPagesRecipes: -1,
      refreshingRecipes: false,

      filterFavorite: undefined,
      filterIncludeFood: undefined,
      filterExcludeFood: undefined,
      filterIncludeIds: undefined,
      filterExcludeIds: undefined,
      filterCourses: {
        mainDishes: null,
        desserts: null,
        sideDishes: null,
        appetizers: null,
        salads: null,
        breakfast: null,
        breads: null,
        soups: null,
        beverages: null,
        condiments: null,
        cocktails: null,
        snacks: null,
        lunch: null,
      },
      filterCuisines: {
        american: null,
        kidFriendly: null,
        italian: null,
        asian: null,
        mexican: null,
        southern: null,
        french: null,
        southwestern: null,
        barbeque: null,
        indian: null,
        chinese: null,
        cajunCreole: null,
        mediterranean: null,
        greek: null,
        english: null,
        spanish: null,
        thai: null,
        german: null,
        moroccan: null,
        irish: null,
        japanese: null,
        cuban: null,
        hawaiian: null,
        swedish: null,
        hungarian: null,
        portuguese: null,
        middleEastern: null,
        eastEuropean: null,
        african: null,
        australian: null,
        caribbean: null,
        cajun: null,
        turkish: null,
        native: null,
      },

      savedMealsArray: null,
      pageMeals: 1,
      totalPagesMeals: -1,
      refreshingMeals: false,
      savedMealFilter: 0,
      savedMealSearch: '',

      historyArray: null,
      pageHistory: 1,
      totalPagesHistory: -1,
      refreshingHistory: false,

      indicatorPositionX: new Animated.Value(0),
    };

    this.filterHandler = null;
    this.filterCourses = undefined;
    this.filterCuisines = undefined;

    this.course = undefined;
    this.search = undefined;
    this.anyFoodCategory = undefined;
  }

  async componentDidMount() {
    this.setState({isLoading: true});

    this.course = this.props.recipeCourses;

    if (typeof this.props.recipeSearch !== 'undefined') {
      // this.onTabChange(this.props.tabIndex);
      this.slideIndicator(this.props.tabIndex);

      this.setState(
        {
          searchText: this.props.recipeSearch,
        },
        async () => {
          const data = await shaefitApi.getRecipes(
            undefined,
            this.props.recipeCourses,
            undefined,
            this.props.recipeSearch,
          );
          console.log('recipes data', data);
          console.log('this.props.recipeSearch', this.props.recipeSearch);
          if (typeof data.data !== 'undefined') {
            this.setState({
              recipesArray: data.data,
              totalPagesRecipes: data.last_page,
              searchPlaceholderText: 'Search recipes…',
              isLoading: false,
            });
          } else {
            this.setState({
              searchPlaceholderText: 'Search recipes…',
              isLoading: false,
            });
          }
        },
      );
    }

    if (typeof this.props.foodParams !== 'undefined') {
      const data = await shaefitApi.getFood(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        this.props.foodParams.dietType,
        this.props.foodParams.pointsMore,
        this.props.foodParams.anyFoodCategory,
      );

      this.setState({
        foodListArray: data.data,
        totalPagesFood: data.last_page,
        isLoading: false,
      });
    } else {
      const data = await shaefitApi.getFood();
      console.log('data', data);

      if (typeof data.data !== 'undefined') {
        this.setState({
          foodListArray: data.data,
          totalPagesFood: data.last_page,
          isLoading: false,
        });
      }

      console.log('componentDidMount isFromRecipes', this.props.isFromRecipes);
      console.log(
        'componentDidMount isFromSaveMeal',
        this.props.isFromSaveMeal,
      );
      console.log(
        'componentDidMount isFromSavedMeals',
        this.props.isFromSavedMeals,
      );

      console.log('componentDidMount this.props.id', this.props.id);

      console.log(
        'componentDidMount this.props.mealTypeId',
        this.props.mealTypeId,
      );
      console.log(
        'componentDidMount this.props.entryDate',
        this.props.entryDate,
      );
    }
  }

  slideIndicator = (index) => {
    Animated.spring(this.state.indicatorPositionX, {
      toValue: index * 100,
    }).start();
  };

  onTabChange = async (index) => {
    let placeholder = '';

    this.slideIndicator(index);

    this.scrollViewTop.scrollTo({x: index * 100 - 100, y: 0, animated: true});

    setTimeout(async () => {
      switch (index) {
        case 0:
          placeholder = 'Search food…';

          break;
        case 1:
          placeholder = 'Search recipes…';
          this.setState({isLoading: true});
          const data = await shaefitApi.getRecipes(
            undefined,
            this.course,
            undefined,
          );
          if (this.state.recipesArray === null) {
            this.course = undefined;
          }
          console.log('recipes data', data);
          if (typeof data.data !== 'undefined') {
            this.setState({
              recipesArray: data.data,
              totalPagesRecipes: data.last_page,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }

          break;
        case 2:
          placeholder = 'Search meals…';
          this.setState({isLoading: true});
          const mealsData = await shaefitApi.getSavedMeals(
            1,
            this.state.savedMealFilter === 0 ? 'created' : 'alpha',
            this.state.savedMealFilter === 1
              ? 'asc'
              : this.state.savedMealFilter === 2
              ? 'desc'
              : undefined,
          );
          console.log('meals data', mealsData);
          this.setState({
            savedMealsArray: mealsData.data,
            totalPagesMeals: mealsData.last_page,
            isLoading: false,
          });
          break;
        case 3:
          placeholder = 'Search food…';
          this.setState({isLoading: true});
          const historyData = await shaefitApi.getFoodDiaryHistory(1);
          this.setState({
            historyArray: historyData.data,
            totalPagesHistory: historyData.last_page,
            isLoading: false,
          });
          console.log('historyData', historyData);
          break;
        case 4:
          placeholder = 'Search food…';
          break;
        default:
          placeholder = 'Search food…';
      }

      this.setState({searchPlaceholderText: placeholder, searchText: ''});
    }, 300);
  };

  onModalOpen = () => {
    try {
      this.refs.modal.open();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onClosingState = () => {
    const newArray = this.state.foodDiaryArray.slice();
    this.setState({foodDiaryArrayPreferences: newArray}, () => {
      console.log('onClosingState', this.state.foodDiaryArrayPreferences);
    });
  };

  updatePreferences = () => {
    const newArray = this.state.foodDiaryArrayPreferences.slice();
    this.setState({foodDiaryArray: newArray}, () => {
      this.refs.modal.close();
      console.log('updatePreferences', this.state.foodDiaryArray);
    });
  };

  _renderFoodListItem = ({item, index}) => {
    return (
      <FoodListItem
        index={index}
        item={item}
        id={this.props.id}
        isFromRecipes={
          typeof this.props.isFromRecipes !== 'undefined'
            ? this.props.isFromRecipes
            : null
        }
        isFromSaveMeal={
          typeof this.props.isFromSaveMeal !== 'undefined'
            ? this.props.isFromSaveMeal
            : null
        }
        isFromSavedMeals={
          typeof this.props.isFromSavedMeals !== 'undefined'
            ? this.props.isFromSavedMeals
            : null
        }
        isLoading={this.state.isLoading}
      />
    );
  };

  _renderRecipesListItem = ({item, index}) => {
    return (
      <RecipesListItem
        index={index}
        item={item}
        isLoading={this.state.isLoading}
        id={this.props.id}
        foodDiaryId={this.props.foodDiaryId}
      />
    );
  };

  onMealDelete = (index, id) => {
    console.log('onMealDelete', index, id, this.state.savedMealsArray);

    let array = this.state.savedMealsArray;

    // for (let i = 0; i < array.length; i++) {
    //   if (array[i].id === id) {
    array.splice(index, 1);

    //     break;
    //   }
    // }

    this.setState({savedMealsArray: array}, () => {
      shaefitApi.deleteSavedMeal(id);
    });
  };

  refreshMealslist = async () => {
    this.setState({savedMealsArray: []});
    let array = [];

    for (let i = 0; i < this.state.pageMeals; i++) {
      const mealsData = await shaefitApi.getSavedMeals(
        i + 1,
        this.state.savedMealFilter === 0 ? 'created' : 'alpha',
        this.state.savedMealFilter === 1
          ? 'asc'
          : this.state.savedMealFilter === 2
          ? 'desc'
          : undefined,
      );
      console.log('meals data', mealsData);

      if (
        typeof mealsData !== 'undefined' &&
        typeof mealsData.data !== 'undefined'
      ) {
        array.push(...mealsData.data);
      }
    }

    console.log('refreshMealslist', array);

    this.setState({
      savedMealsArray: array,
    });
  };

  _renderSavedMealsListItem = ({item, index}) => {
    return (
      <SavedMealsListItem
        index={index}
        item={item}
        isLoading={this.state.isLoading}
        foodDiaryId={this.props.foodDiaryId}
        mealTypeId={this.props.mealTypeId}
        entryDate={this.props.entryDate}
        onMealDelete={this.onMealDelete}
        refresh={this.refreshMealslist}
      />
    );
  };

  _renderHistoryListItem = ({item, index}) => {
    return (
      <HistoryListItem
        index={index}
        item={item}
        id={this.props.id}
        isLoading={this.state.isLoading}
      />
    );
  };

  changePreferencesItem = (index) => {
    let array = this.state.foodDiaryArrayPreferences.slice();

    array[index].isAdded = !array[index].isAdded;
    this.setState({foodDiaryArrayPreferences: array});
  };

  dismissModal = () => {
    try {
      if (this.popupDialog !== null) this.popupDialog.dismiss();
      this.setState({isModalVisible: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  animatedDismissModal = () => {
    try {
      this.popup.slideOutUp(350).then(() => this.dismissModal());
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onDailySchedulePress = () => {
    this.refs.modal.close();
    this.setState({isScheduleModalVisible: true});
  };

  toggleMealOptions = () => {
    this.setState({
      isMealOptionsModalVisible: !this.state.isMealOptionsModalVisible,
    });
  };

  handleLoadMoreFoodList = async () => {
    try {
      // console.log('handleLoadMoreFoodList', this.props.screenProps.category, this.props.screenProps.type, this.state.foodCategory, this.state.foodType);
      if (this.state.pageFood !== this.state.totalPagesFood) {
        // const newData = await shaefitApi.getFood(this.state.page + 1);
        const newData = await shaefitApi.getFood(
          this.state.pageFood + 1,
          this.state.category,
          this.state.type,
          this.state.searchText,
        );
        if (typeof newData !== 'undefined') {
          let array = [...this.state.foodListArray, ...newData.data];
          this.setState({
            foodListArray: array,
            pageFood: this.state.pageFood + 1,
          });
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handleLoadMoreRecipes = async () => {
    try {
      // console.log('handleLoadMoreFoodList', this.props.screenProps.category, this.props.screenProps.type, this.state.foodCategory, this.state.foodType);
      if (this.state.pageFood !== this.state.totalPagesFood) {
        // const newData = await shaefitApi.getFood(this.state.page + 1);
        const newData = await shaefitApi.getRecipes(
          this.state.pageRecipes + 1,
          typeof this.course !== undefined ? this.course : this.filterCourses,
          this.filterCuisines,
          this.state.searchText,
          undefined,
          undefined,
          undefined,
          this.state.filterIncludeIds,
          this.state.filterExcludeIds,
          undefined,
        );
        if (typeof newData !== 'undefined') {
          let array = [...this.state.recipesArray, ...newData.data];
          this.setState({
            recipesArray: array,
            pageRecipes: this.state.pageRecipes + 1,
          });
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handleLoadMoreMeals = async () => {
    try {
      // console.log('handleLoadMoreFoodList', this.props.screenProps.category, this.props.screenProps.type, this.state.foodCategory, this.state.foodType);
      if (this.state.pageMeals !== this.state.totalPagesMeals) {
        // const newData = await shaefitApi.getFood(this.state.page + 1);
        const newData = await shaefitApi.getSavedMeals(
          this.state.pageMeals + 1,
          this.state.savedMealFilter === 0 ? 'created' : 'alpha',
          this.state.savedMealFilter === 1
            ? 'asc'
            : this.state.savedMealFilter === 2
            ? 'desc'
            : undefined,
          this.state.searchText,
        );
        if (typeof newData !== 'undefined') {
          let array = [...this.state.savedMealsArray, ...newData.data];
          this.setState({
            savedMealsArray: array,
            pageMeals: this.state.pageMeals + 1,
          });
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handleLoadMoreHistory = async () => {
    try {
      // console.log('handleLoadMoreFoodList', this.props.screenProps.category, this.props.screenProps.type, this.state.foodCategory, this.state.foodType);
      if (this.state.pageHistory !== this.state.totalPagesHistory) {
        // const newData = await shaefitApi.getFood(this.state.page + 1);
        const newData = await shaefitApi.getFoodDiaryHistory(
          this.state.pageHistory + 1,
        );
        if (typeof newData !== 'undefined') {
          let array = [...this.state.historyArray, ...newData.data];
          this.setState({
            historyArray: array,
            pageHistory: this.state.pageHistory + 1,
          });
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  _handleSettings = () => {
    try {
      switch (this.state.tabActive) {
        case 0:
          this.refs.modal.open();
          break;
        case 1:
          this.refs.modalRecipes.open();
          break;
        case 2:
          this.refs.modalMeals.open();
          break;
        case 3:
          // this.refs.modal.open();
          break;
        case 4:
          // this.refs.modal.open();
          break;
        default:
        // this.refs.modal.open();
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  filterType = (type) => {
    try {
      console.log('filterType type', type);
      this.setState({foodType: type});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  filterCategory = (category) => {
    try {
      this.setState({foodCategory: category});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  resetFilters = () => {
    try {
      this.setState({foodType: false, foodCategory: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  switchFoodType = () => {
    try {
      let type = undefined;

      switch (this.state.foodType) {
        case 'Vegetables':
          type = 'VERDURA';
          break;
        case 'Fruits':
          type = 'FRUTTA';
          break;
        case 'Grains':
          type = 'CEREALI';
          break;
        case 'Meats':
          type = 'PROTEINE';
          break;
        case 'Nuts':
          type = 'NOCI E SEMI';
          break;
        case 'Drinks':
          type = 'BEVANDE';
          break;
        case 'Sauces':
          type = 'CONDIMENTI';
          break;
        case 'Dairy':
          type = 'DERIVATI DAL LATTE';
          break;
        case 'Sweats':
          type = 'DOLCI';
          break;
        case 'Fats':
          type = 'GRASSI';
          break;
        default:
          type = undefined;
      }

      return type;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  switchFoodTypeReverse = (type) => {
    try {
      let switchedType;

      switch (type) {
        case 'VERDURA':
          switchedType = 'Vegetables';
          break;
        case 'FRUTTA':
          switchedType = 'Fruits';
          break;
        case 'CEREALI':
          switchedType = 'Grains';
          break;
        case 'PROTEINE':
          switchedType = 'Meats';
          break;
        case 'NOCI E SEMI':
          switchedType = 'Nuts';
          break;
        case 'BEVANDE':
          switchedType = 'Drinks';
          break;
        case 'CONDIMENTI':
          switchedType = 'Sauces';
          break;
        case 'DERIVATI DAL LATTE':
          switchedType = 'Dairy';
          break;
        case 'DOLCI':
          switchedType = 'Sweats';
          break;
        case 'GRASSI':
          switchedType = 'Fats';
          break;
        default:
          switchedType = undefined;
      }

      this.setState({foodType: switchedType});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  switchFoodCategory = (category) => {
    try {
      let switchedCategory = undefined;

      switch (category) {
        case 'eat':
          switchedCategory = 'Eat';
          break;
        case 'avoid':
          switchedCategory = 'Avoid';
          break;
        case 'fav':
          switchedCategory = 'Favorite';
          break;
        default:
          switchedCategory = 'All';
      }

      this.setState({foodCategory: switchedCategory});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  filterButtonPress = async () => {
    try {
      // this.setState({isLoading: true});
      // this.setOpacity();
      this.refs.modal.close();
      // if (typeof this.animatedFlatList !== 'undefined' && this.animatedFlatList !== null)
      // this.animatedFlatList.getNode().scrollToOffset({ offset: 0, animated: false });

      if (
        typeof this.foodListFlatList !== 'undefined' &&
        this.foodListFlatList !== null &&
        this.state.foodListArray !== null &&
        this.state.foodListArray.length === 0
      )
        this.foodListFlatList?.scrollToOffset({animated: true, offset: 0});

      let type = undefined;
      let category = undefined;

      if (this.state.foodCategory !== '') {
        if (this.state.foodCategory === 'Favorite') {
          category = 'fav';
        } else {
          category =
            typeof this.state.foodCategory === 'string'
              ? this.state.foodCategory.toLowerCase()
              : undefined;
        }
      }

      type = this.switchFoodType();

      // this.setState({
      //   foodType: type,
      //   foodCategory: category,
      // });

      this.setState({isLoading: true});
      const data = await shaefitApi.getFood(
        1,
        category,
        type,
        this.state.searchText,
      );
      this.setState({
        foodListArray: data.data,
        totalPagesFood: data.last_page,
        isLoading: false,
      });

      // await this.props.screenProps.setCategoryType(category, type);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onChangeSearchText = async (text) => {
    this.setState({searchText: text});
    let data;

    switch (this.state.tabActive) {
      case 0:
        if (
          typeof this.foodListFlatList !== 'undefined' &&
          this.foodListFlatList !== null &&
          this.state.foodListArray !== null &&
          this.state.foodListArray.length === 0
        )
          this.foodListFlatList?.scrollToOffset({animated: true, offset: 0});
        this.setState({isLoading: true});
        data = await shaefitApi.getFood(
          1,
          this.state.category,
          this.state.type,
          text,
        );
        this.setState({
          foodListArray:
            typeof data !== 'undefined' ? data.data : this.state.foodListArray,
          totalPagesFood:
            typeof data !== 'undefined'
              ? data.last_page
              : this.state.totalPagesFood,
          isLoading: false,
        });
        break;
      case 1:
        if (
          typeof this.recipesListFlatList !== 'undefined' &&
          this.recipesListFlatList !== null &&
          this.state.recipesArray === null
        )
          this.recipesListFlatList?.scrollToOffset({
            animated: true,
            offset: 0,
          });
        this.setState({isLoading: true});
        data = await shaefitApi.getRecipes(
          1,
          typeof this.course !== undefined ? this.course : this.filterCourses,
          this.filterCuisines,
          text,
          undefined,
          undefined,
          undefined,
          this.state.filterIncludeIds,
          this.state.filterExcludeIds,
          this.state.filterFavorite,
        );
        this.setState({
          recipesArray:
            typeof data !== 'undefined' ? data.data : this.state.recipesArray,
          totalPagesRecipes:
            typeof data !== 'undefined'
              ? data.last_page
              : this.state.totalPagesRecipes,
          isLoading: false,
        });
        break;
      case 2:
        if (
          typeof this.mealsListFlatList !== 'undefined' &&
          this.mealsListFlatList !== null &&
          this.state.savedMealsArray.length === 0
        )
          this.mealsListFlatList?.scrollToOffset({animated: true, offset: 0});
        this.setState({isLoading: true});

        const mealsData = await shaefitApi.getSavedMeals(
          1,
          this.state.savedMealFilter === 0 ? 'created' : 'alpha',
          this.state.savedMealFilter === 1
            ? 'asc'
            : this.state.savedMealFilter === 2
            ? 'desc'
            : undefined,
          text,
        );
        console.log('meals data', mealsData);
        this.setState({
          savedMealsArray:
            typeof mealsData !== 'undefined'
              ? mealsData.data
              : this.state.savedMealsArray,
          pageMeals: 1,
          totalPagesMeals:
            typeof mealsData !== 'undefined'
              ? mealsData.last_page
              : this.state.totalPagesMeals,
          isLoading: false,
        });
        // this.refs.modal.open();
        break;
      case 3:
        // this.refs.modal.open();
        break;
      case 4:
        // this.refs.modal.open();
        break;
      default:
      // this.refs.modal.open();
    }
  };

  onFilterItemChangeRecipes = (filter, value) => {
    try {
      this.setState({[filter]: value});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  resetFiltersRecipes = () => {
    try {
      let coursesObject = {...this.state.filterCourses};
      Object.keys(coursesObject).map((key) => {
        coursesObject[key] = null;
      });

      let cuisinesObject = {...this.state.filterCuisines};
      Object.keys(cuisinesObject).map((key) => {
        cuisinesObject[key] = null;
      });

      this.setState({
        filterFavorite: undefined,
        filterIncludeFood: undefined,
        filterExcludeFood: undefined,
        filterIncludeIds: undefined,
        filterExcludeIds: undefined,
        filterCourses: coursesObject,
        filterCuisines: cuisinesObject,
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setIncludeFood = (array) => {
    try {
      this.setState({filterIncludeFood: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setExcludeFood = (array) => {
    try {
      this.setState({filterExcludeFood: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setIncludeIds = (array) => {
    try {
      this.setState({filterIncludeIds: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setExcludeIds = (array) => {
    try {
      this.setState({filterExcludeIds: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  applyFilterRecipes = async () => {
    try {
      this.refs.modalRecipes.close();

      this.recipesListFlatList?.scrollToOffset({animated: true, offset: 0});

      this.filterCourses = [];
      this.filterCuisines = [];
      Object.keys(this.state.filterCourses).map((key) => {
        if (this.state.filterCourses[key] !== null) {
          this.filterCourses.push(this.state.filterCourses[key]);
        }
      });

      Object.keys(this.state.filterCuisines).map((key) => {
        if (this.state.filterCuisines[key] !== null) {
          this.filterCuisines.push(this.state.filterCuisines[key]);
        }
      });

      if (this.filterCourses.length === 0) {
        this.filterCourses = undefined;
      }

      if (this.filterCuisines.length === 0) {
        this.filterCuisines = undefined;
      }

      console.log('applyFilter filterFavorite', this.state.filterFavorite);
      console.log('applyFilter filterIncludeIds', this.state.filterIncludeIds);
      console.log('applyFilter filterExcludeIds', this.state.filterExcludeIds);
      console.log('applyFilter filterCourses', this.filterCourses);
      console.log('applyFilter filterCuisines', this.filterCuisines);

      this.setState({isLoading: true});
      const data = await shaefitApi.getRecipes(
        1,
        this.filterCourses,
        this.filterCuisines,
        undefined,
        undefined,
        undefined,
        undefined,
        this.state.filterIncludeIds,
        this.state.filterExcludeIds,
        this.state.filterFavorite,
      );
      if (typeof data.data !== 'undefined') {
        this.setState({
          recipesArray: data.data,
          page: 1,
          totalPagesRecipes: data.last_page,
          isLoading: false,
        });
      } else {
        this.setState({
          page: 1,
          isLoading: false,
        });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  filterMealsButtonPress = async () => {
    this.refs.modalMeals.close();

    this.mealsListFlatList?.scrollToOffset({animated: true, offset: 0});

    console.log('savedMealFilter', this.state.savedMealFilter);

    const mealsData = await shaefitApi.getSavedMeals(
      1,
      this.state.savedMealFilter === 0 ? 'created' : 'alpha',
      this.state.savedMealFilter === 1
        ? 'asc'
        : this.state.savedMealFilter === 2
        ? 'desc'
        : undefined,
      this.state.searchText,
    );
    console.log('meals data', mealsData);
    this.setState({
      savedMealsArray: mealsData.data,
      pageMeals: 1,
      totalPagesMeals: mealsData.last_page,
      isLoading: false,
    });
  };

  changeSavedMealFilter = (value) => {
    this.setState({savedMealFilter: value});
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: 'rgb(255,255,255)',
          flex: 1,
          marginTop: isIphoneX() ? 34 + 10 : Platform.OS === 'ios' ? 20 : 0,
        }}>
        {Platform.OS === 'ios' && (
          <StatusBar barStyle="dark-content" hidden={false} />
        )}

        <View style={styles.container}>
          <View
            style={{
              width: width - 40,
              height: 36,
              marginTop: 3,
              marginBottom: 5,
              alignSelf: 'center',
              flexDirection: 'row',
              backgroundColor: 'rgb(250,252,255)',
            }}>
            <View
              style={{
                width: width - 116,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgb(239,243,249)',
                marginLeft: 32,
                justifyContent: 'center',
              }}>
              <TextInput
                style={styles.searchText}
                underlineColorAndroid="transparent"
                placeholder={this.state.searchPlaceholderText}
                placeholderTextColor="rgb(163,163,169)"
                // ref={input => input && input.focus()}
                value={this.state.searchText}
                onChangeText={(value) => this.onChangeSearchText(value)}
              />

              <Image
                source={require('../resources/icon/search.png')}
                style={{position: 'absolute', left: 10, top: 11}}
              />
            </View>

            <TouchableWithoutFeedback onPress={() => Actions.pop()}>
              <Image
                source={require('../resources/icon/back.png')}
                style={{position: 'absolute', left: 0, top: 8}}
              />
            </TouchableWithoutFeedback>

            {this.state.tabActive !== 3 && this.state.tabActive !== 4 && (
              <TouchableWithoutFeedback onPress={this._handleSettings}>
                <View style={{position: 'absolute', right: 0, top: 8}}>
                  <Image source={require('../resources/icon/filter.png')} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>

          {typeof this.props.mealTypeId !== 'undefined' &&
            typeof this.props.isFromRecipes === 'undefined' &&
            typeof this.props.isFromSaveMeal === 'undefined' &&
            typeof this.props.isFromSavedMeals === 'undefined' && (
              <ScrollView
                horizontal={true}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                ref={(ref) => {
                  this.scrollViewTop = ref;
                }}>
                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({tabActive: 0}, () => {
                      this.onTabChange(0);
                    })
                  }>
                  <View
                    style={{
                      height: 48,
                      backgroundColor: 'rgb(250,252,255)',
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={
                        this.state.tabActive === 0
                          ? styles.tabActiveText
                          : styles.tabInactiveText
                      }>
                      All Food
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({tabActive: 1}, () => {
                      this.onTabChange(1);
                    })
                  }>
                  <View
                    style={{
                      height: 48,
                      backgroundColor: 'rgb(250,252,255)',
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={
                        this.state.tabActive === 1
                          ? styles.tabActiveText
                          : styles.tabInactiveText
                      }>
                      Recipes
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({tabActive: 2}, () => {
                      this.onTabChange(2);
                    })
                  }>
                  <View
                    style={{
                      height: 48,
                      backgroundColor: 'rgb(250,252,255)',
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={
                        this.state.tabActive === 2
                          ? styles.tabActiveText
                          : styles.tabInactiveText
                      }>
                      Saved Meals
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.setState({tabActive: 3}, () => {
                      this.onTabChange(3);
                    })
                  }>
                  <View
                    style={{
                      height: 48,
                      backgroundColor: 'rgb(250,252,255)',
                      width: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={
                        this.state.tabActive === 3
                          ? styles.tabActiveText
                          : styles.tabInactiveText
                      }>
                      History
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                {/*<TouchableWithoutFeedback onPress={() => this.setState({tabActive: 4}, () => {this.onTabChange(4); })}>
                <View style={{height: 48, backgroundColor: 'rgb(250,252,255)', width: 100, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={(this.state.tabActive === 4) ? styles.tabActiveText : styles.tabInactiveText}>
                    Barcode
                  </Text>

                </View>
              </TouchableWithoutFeedback> */}

                <Animated.View
                  style={[
                    styles.tabIndicator,
                    {
                      width: 100,
                      transform: [{translateX: this.state.indicatorPositionX}],
                    },
                  ]}
                />
              </ScrollView>
            )}
        </View>

        {this.state.tabActive === 0 && (
          <View>
            {(this.state.foodListArray === null ||
              this.state.foodListArray.length === 0) &&
            this.state.isLoading ? (
              <ShineOverlay>
                <View>
                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 108,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 30,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 6,
                            width: width - 176,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 10,
                            width: width - 225,
                            height: 16,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 135,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        position: 'absolute',
                        bottom: 0,
                        right: 20,
                      }}
                    />
                  </View>
                </View>
              </ShineOverlay>
            ) : this.state.foodListArray !== null &&
              this.state.foodListArray.length === 0 &&
              !this.state.isLoading ? (
              <View
                style={{
                  marginTop: 152,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../resources/icon/no_results_found.png')}
                  style={{alignSelf: 'center'}}
                />
                <Text style={styles.noResultsTitle}>No Result Found</Text>
                <Text style={styles.noResultsText}>
                  We can’t find any food matching your search.
                </Text>
              </View>
            ) : (
              <FlatList
                ref={(ref) => (this.foodListFlatList = ref)}
                data={this.state.foodListArray}
                extraData={this.state.foodListArray}
                keyExtractor={(item, index) => item.name + index}
                renderItem={this._renderFoodListItem}
                contentContainerStyle={{
                  paddingBottom: 44 + 100,
                  overflow: 'visible',
                }}
                keyboardShouldPersistTaps="always"
                initialNumToRender={10}
                bounces={false}
                refreshing={this.state.refreshingFood}
                removeClippedSubviews={true}
                onEndReachedThreshold={2}
                onEndReached={() => {
                  if (!this.state.refreshingFood) {
                    this.setState({refreshingFood: true}, () => {
                      this.handleLoadMoreFoodList().then(() => {
                        this.setState({refreshingFood: false});
                      });
                    });
                  }
                }}
                // onEndReachedThreshold={0.1}
              />
            )}
          </View>
        )}

        {this.state.tabActive === 1 && (
          <View>
            {this.state.recipesArray === null && this.state.isLoading ? (
              <ShineOverlay>
                <View>
                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {
                            marginRight: 15,
                            backgroundColor: 'rgb(255,255,255)',
                          },
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>

                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {backgroundColor: 'rgb(255,255,255)'},
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>
                  </View>

                  <View
                    style={{
                      marginTop: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {
                            marginRight: 15,
                            backgroundColor: 'rgb(255,255,255)',
                          },
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>

                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {backgroundColor: 'rgb(255,255,255)'},
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>
                  </View>

                  <View
                    style={{
                      marginTop: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {
                            marginRight: 15,
                            backgroundColor: 'rgb(255,255,255)',
                          },
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>

                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {backgroundColor: 'rgb(255,255,255)'},
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>
                  </View>

                  <View
                    style={{
                      marginTop: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {
                            marginRight: 15,
                            backgroundColor: 'rgb(255,255,255)',
                          },
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>

                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {backgroundColor: 'rgb(255,255,255)'},
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>
                  </View>

                  <View
                    style={{
                      marginTop: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {
                            marginRight: 15,
                            backgroundColor: 'rgb(255,255,255)',
                          },
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>

                    <BoxShadow
                      setting={{
                        ...shadowOpt,
                        ...{
                          width: (width - 47) / 2,
                          height: 225,
                          y: 1,
                          border: 6,
                          opacity: 0.075,
                          style: {backgroundColor: 'rgb(255,255,255)'},
                        },
                      }}>
                      <View
                        style={{
                          width: (width - 47) / 2,
                          height: 225,
                          borderRadius: 6,
                          alignSelf: 'center',
                          backgroundColor: 'rgb(255,255,255)',
                          shadowOpacity: 0,
                        }}>
                        <View
                          style={{
                            width: (width - 47) / 2,
                            height: 164,
                            backgroundColor: 'rgb(242,243,246)',
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                        <View style={{marginLeft: 13, marginTop: 12}}>
                          <View
                            style={{
                              width: width - 252,
                              height: 14,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                            }}
                          />
                          <View
                            style={{
                              width: width - 293,
                              height: 10,
                              borderRadius: 7,
                              backgroundColor: 'rgb(242,243,246)',
                              marginTop: 6,
                            }}
                          />
                        </View>
                      </View>
                    </BoxShadow>
                  </View>
                </View>
              </ShineOverlay>
            ) : this.state.recipesArray !== null &&
              this.state.recipesArray.length === 0 &&
              !this.state.isLoading ? (
              <View
                style={{
                  marginTop: 152,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../resources/icon/no_results_found.png')}
                  style={{alignSelf: 'center'}}
                />
                <Text style={styles.noResultsTitle}>No Result Found</Text>
                <Text style={styles.noResultsText}>
                  We can’t find any recipes matching your search.
                </Text>
              </View>
            ) : (
              <FlatList
                ref={(ref) => (this.recipesListFlatList = ref)}
                data={this.state.recipesArray}
                extraData={this.state.recipesArray}
                keyExtractor={(item, index) => item.title + index}
                renderItem={this._renderRecipesListItem}
                contentContainerStyle={{
                  paddingBottom: 44 + 100,
                  overflow: 'visible',
                }}
                keyboardShouldPersistTaps="always"
                initialNumToRender={10}
                bounces={false}
                refreshing={this.state.refreshingRecipes}
                removeClippedSubviews={true}
                numColumns={2}
                onEndReachedThreshold={2}
                onEndReached={() => {
                  if (!this.state.refreshingRecipes) {
                    this.setState({refreshingRecipes: true}, () => {
                      this.handleLoadMoreRecipes().then(() => {
                        this.setState({refreshingRecipes: false});
                      });
                    });
                  }
                }}
                // onEndReachedThreshold={0.1}
              />
            )}
          </View>
        )}

        {this.state.tabActive === 2 && (
          <View>
            {(this.state.savedMealsArray === null ||
              this.state.savedMealsArray.length === 0) &&
            this.state.isLoading ? (
              <ShineOverlay>
                <View>
                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width,
                      height: 88,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 5,
                          backgroundColor: 'rgb(242,243,246)',
                          marginRight: 20,
                        }}
                      />
                      <View>
                        <View
                          style={{
                            marginTop: 5,
                            width: width - 176,
                            height: 18,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                        <View
                          style={{
                            marginTop: 8,
                            width: width - 225,
                            height: 12,
                            borderRadius: 10,
                            backgroundColor: 'rgb(242,243,246)',
                          }}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(216,215,222)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>
                </View>
              </ShineOverlay>
            ) : this.state.savedMealsArray !== null &&
              this.state.savedMealsArray.length === 0 &&
              !this.state.isLoading ? (
              <View>
                <View>
                  <Image
                    source={require('../resources/icon/saved_meals_empty.png')}
                    style={{alignSelf: 'center', marginTop: 152}}
                  />
                  <Text style={styles.placeholderTitle}>No Saved Meals</Text>
                  <Text style={styles.placeholderText}>
                    Looks like you haven’t saved any meals as of yet.
                  </Text>
                </View>
              </View>
            ) : (
              <FlatList
                ref={(ref) => (this.mealsListFlatList = ref)}
                data={this.state.savedMealsArray}
                extraData={this.state.savedMealsArray}
                keyExtractor={(item, index) => item.name + index}
                renderItem={this._renderSavedMealsListItem}
                contentContainerStyle={{
                  paddingBottom: 44 + 100,
                  overflow: 'visible',
                }}
                keyboardShouldPersistTaps="always"
                initialNumToRender={10}
                bounces={false}
                refreshing={this.state.refreshingMeals}
                removeClippedSubviews={true}
                onEndReachedThreshold={2}
                onEndReached={() => {
                  if (!this.state.refreshingMeals) {
                    this.setState({refreshingMeals: true}, () => {
                      this.handleLoadMoreMeals().then(() => {
                        this.setState({refreshingMeals: false});
                      });
                    });
                  }
                }}
                // onEndReachedThreshold={0.1}
              />
            )}
          </View>
        )}

        {this.state.tabActive === 3 && (
          <View>
            {(this.state.historyArray === null ||
              this.state.historyArray.length === 0) &&
            this.state.isLoading ? (
              <ShineOverlay>
                <View>
                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: width - 40,
                      height: 71,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          marginTop: 16,
                          width: width - 176,
                          height: 18,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                      <View
                        style={{
                          marginTop: 8,
                          width: width - 225,
                          height: 12,
                          borderRadius: 10,
                          backgroundColor: 'rgb(242,243,246)',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        width: width - 40,
                        height: 0.5,
                        backgroundColor: 'rgb(221,224,228)',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                      }}
                    />
                  </View>
                </View>
              </ShineOverlay>
            ) : this.state.historyArray !== null &&
              this.state.historyArray.length === 0 &&
              !this.state.isLoading ? (
              <View>
                <View>
                  <Image
                    source={require('../resources/icon/history_empty.png')}
                    style={{alignSelf: 'center', marginTop: 152}}
                  />
                  <Text style={styles.placeholderTitle}>No History</Text>
                  <Text style={styles.placeholderText}>
                    Looks like you don’t have any history to show here.
                  </Text>
                </View>
              </View>
            ) : (
              <FlatList
                ref={(ref) => (this.historyListFlatList = ref)}
                data={this.state.historyArray}
                extraData={this.state.historyArray}
                keyExtractor={(item, index) =>
                  item.food.name + index.toString()
                }
                renderItem={this._renderHistoryListItem}
                contentContainerStyle={{
                  paddingBottom: 44 + 100,
                  overflow: 'visible',
                }}
                keyboardShouldPersistTaps="always"
                initialNumToRender={10}
                bounces={false}
                refreshing={this.state.refreshingHistory}
                removeClippedSubviews={true}
                onEndReachedThreshold={2}
                onEndReached={() => {
                  if (!this.state.refreshingHistory) {
                    this.setState({refreshingHistory: true}, () => {
                      this.handleLoadMoreHistory().then(() => {
                        this.setState({refreshingHistory: false});
                      });
                    });
                  }
                }}
                // onEndReachedThreshold={0.1}
              />
            )}
          </View>
        )}

        {/*<View style={{height: 102}} /> */}

        <Modal
          style={styles.modal}
          position={'bottom'}
          ref={'modal'}
          swipeToClose={false}
          swipeArea={50}
          coverScreen={true}>
          <FoodFilterPopup
            resetFilters={this.resetFilters}
            typeValue={this.state.foodType}
            type={this.filterType}
            category={this.filterCategory}
            categoryValue={this.state.foodCategory}
          />
          <TouchableWithoutFeedback onPress={this.filterButtonPress}>
            <View style={styles.applyFilterButton}>
              <Text style={styles.applyFilterText}>See Foods</Text>
            </View>
          </TouchableWithoutFeedback>
          {isIphoneX() ? (
            <View
              style={{
                height: 34,
                width,
                position: 'absolute',
                bottom: 60 + 88,
                backgroundColor: 'rgb(255,255,255)',
              }}
            />
          ) : null}
        </Modal>

        <Modal
          style={styles.modal}
          avoidKeyboard={Platform.OS === 'ios'}
          position={'top'}
          ref={'modalRecipes'}
          swipeToClose={false}
          swipeArea={50}
          coverScreen={true}>
          <RecipesPopup
            filterFavorite={this.state.filterFavorite}
            filterCourses={this.state.filterCourses}
            filterCuisines={this.state.filterCuisines}
            onFilterItemChange={this.onFilterItemChangeRecipes}
            resetFilters={this.resetFiltersRecipes}
            setIncludeFood={this.setIncludeFood}
            setExcludeFood={this.setExcludeFood}
            setIncludeIds={this.setIncludeIds}
            setExcludeIds={this.setExcludeIds}
            includeFood={this.state.filterIncludeFood}
            excludeFood={this.state.filterExcludeFood}
            includeIds={this.state.filterIncludeIds}
            excludeIds={this.state.filterExcludeIds}
          />
          <TouchableWithoutFeedback onPress={this.applyFilterRecipes}>
            <View style={styles.recipesButton}>
              <Text style={styles.recipesText}>See Recipes</Text>
            </View>
          </TouchableWithoutFeedback>
          {isIphoneX() ? (
            <View
              style={{
                height: 34,
                width,
                position: 'absolute',
                bottom: 60 + 88,
                backgroundColor: 'rgb(255,255,255)',
              }}
            />
          ) : null}
        </Modal>

        <Modal
          style={[styles.modal, {marginTop: height - 306}]}
          position={'bottom'}
          ref={'modalMeals'}
          swipeToClose={false}
          swipeArea={50}
          coverScreen={true}>
          <SavedmealFilter
            changeSavedMealFilter={this.changeSavedMealFilter}
            itemActive={this.state.savedMealFilter}
          />
          <TouchableWithoutFeedback onPress={this.filterMealsButtonPress}>
            <View
              style={[
                styles.applyFilterButton,
                {bottom: isIphoneX() ? height - 306 + 34 : height - 306},
              ]}>
              <Text style={styles.applyFilterText}>See Meals</Text>
            </View>
          </TouchableWithoutFeedback>
          {isIphoneX() ? (
            <View
              style={{
                height: 34,
                width,
                position: 'absolute',
                bottom: 60,
                backgroundColor: 'rgb(255,255,255)',
              }}
            />
          ) : null}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 92,
    overflow: 'visible',
    backgroundColor: 'rgb(250,252,255)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgb(211,213,216)',
    // marginHorizontal: 20
  },
  tabActiveText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'SFProText-Medium',
    letterSpacing: -0.08,
    color: 'rgb(0,168,235)',
    // marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  tabInactiveText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'SFProText-Regular',
    letterSpacing: -0.08,
    color: 'rgb(138,138,143)',
    // marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    backgroundColor: '#00a8eb',
    position: 'absolute',
    bottom: 0,
  },
  foodCardTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 16,
    letterSpacing: -0.1,
    color: 'rgb(38,42,47)',
    width: width - 175,
  },
  searchText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    letterSpacing: -0.4,
    lineHeight: 22,
    color: 'rgb(31,33,35)',
    marginHorizontal: 31,
    width: width - 116 - 62,
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  foodText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: -0.1,
    color: 'rgb(255,255,255)',
    marginLeft: 8,
  },
  foodSubText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: -0.38,
    color: 'rgb(138,138,143)',
    marginTop: 6,
  },
  foodTextContainer: {
    width: 15,
    height: 15,
    borderRadius: 8.5,
    justifyContent: 'center',
    marginTop: 9,
  },
  applyFilterButton: {
    width: width,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(0,168,235)',
    position: 'absolute',
    bottom: isIphoneX() ? 94 + 88 : 60 + 88,
  },
  applyFilterText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: 'rgb(255,255,255)',
    letterSpacing: -0.4,
  },
  modal: {
    width: width,
    marginTop: 60 + 88,
    borderRadius: 14,
    backgroundColor: 'rgb(255,255,255)',
    overflow: 'hidden',
  },
  image: {
    backgroundColor: 'rgb(243,246,249)',
    width: (width - 47) / 2,
    height: 164,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 4,
    tintColor: 'rgb(255,255,255)',
  },
  timeText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 11,
    color: 'rgb(255,255,255)',
    // marginTop: 2,
    marginRight: 8,
  },
  recipeTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    color: 'rgb(0,0,0)',
    marginTop: 11,
    marginLeft: 13,
    marginRight: 13,
  },
  additionalRecipeText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: 'rgb(141,147,151)',
    marginTop: 4,
    marginLeft: 13,
  },
  rateContainer: {
    width: width - 293,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
  },
  rateText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: -0.07,
    color: 'rgb(255,255,255)',
    marginLeft: 8,
  },
  recipesButton: {
    width: width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: isIphoneX() ? 94 + 88 : 60 + 88,
  },
  recipesText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    color: 'rgb(255,255,255)',
    letterSpacing: -0.4,
  },
  // savedMealTitle: {
  //   fontFamily: 'SFProText-Regular',
  //   fontWeight: '400',
  //   fontSize: 16,
  //   color: 'rgb(38,42,47)',
  // },
  // savedMealText: {
  //   fontFamily: 'SFProText-Regular',
  //   fontWeight: '400',
  //   fontSize: 13,
  //   color: 'rgb(141,147,151)',
  //   marginTop: 4
  // },
  savedMealTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: 'rgb(38,42,47)',
  },
  savedMealText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
    marginTop: 4,
  },
  historyTitle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: 'rgb(38,42,47)',
    letterSpacing: -0.1,
  },
  historyUnit: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(0,168,235)',
  },
  historyCal: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 13,
    color: 'rgb(141,147,151)',
  },
  placeholderTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    marginTop: 24,
    alignSelf: 'center',
  },
  placeholderText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
    width: width - 135,
  },
  noResultsTitle: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
    color: 'rgb(16,16,16)',
    marginTop: 24,
    alignSelf: 'center',
  },
  noResultsText: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
    width: width - 135,
  },
});

export default SearchFoodScreen;

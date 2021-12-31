import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  Image,
  Animated,
  FlatList,
  Platform,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {BoxShadow} from 'react-native-shadow';

import Panel from './Panel';
import PanelUnit from './PanelUnit';
import * as shaefitApi from '../API/shaefitAPI';
import getRateColor from '../utils/getRateColor';
import PanelRecipesFilter from './PanelRecipesFilter';

const {height, width} = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class FlatListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.rateColor = null;
    this.rateWidth = null;
  }

  UNSAFE_componentWillMount() {
    const rate = getRateColor(this.props.item.user_importance_val, width - 225);
    this.rateColor = rate.color;
    this.rateWidth = rate.width;
  }

  render() {
    return (
      <TouchableWithoutFeedback
        key={this.props.item.name + this.props.index}
        onPress={() =>
          this.props.onPress(this.props.item, this.rateColor, this.rateWidth)
        }>
        <View style={{width: width - 40}}>
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              {
                width: width - 125,
                marginLeft: 16,
                marginTop: this.props.index === 0 ? 20 : 0,
              },
            ]}>
            {this.props.item.name}
          </Text>
          <View
            style={[
              styles.rateContainer,
              {
                width: width - 225,
                backgroundColor: 'rgb(235,241,243)',
                marginTop: 8,
                marginLeft: 16,
                marginBottom:
                  this.props.lastIndex === this.props.index ? 20 : 0,
              },
            ]}>
            <LinearGradient
              colors={this.rateColor}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={[0.5, 1]}
              style={[
                styles.rateContainer,
                {width: this.rateWidth, bottom: 0, left: 0},
              ]}>
              <Text style={styles.rateText}>
                {this.props.item.user_importance_text}
              </Text>
            </LinearGradient>
          </View>

          <View
            style={[styles.popupIcon, {top: this.props.index === 0 ? 39 : 19}]}>
            <Image
              source={require('../resources/icon/plus_icon_2.png')}
              style={{tintColor: 'rgb(186,195,208)'}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class RecipesPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      includeInput: '',
      excludeInput: '',

      elementsIncludedArray: null,
      includePage: 1,
      totalIncludedPages: -1,
      includeRefreshing: false,

      elementsExcludedArray: null,
      excludePage: 1,
      totalExcludedPages: -1,
      excludeRefreshing: false,

      includedIngredients: [],
      excludedIngredients: [],
    };

    this.includedIds = [];
    this.excludedIds = [];
  }

  /**
    Set the initial values
  */
  UNSAFE_componentWillMount() {
    if (typeof this.props.includeFood !== 'undefined') {
      this.setState({includedIngredients: this.props.includeFood});
    }

    if (typeof this.props.excludeFood !== 'undefined') {
      this.setState({excludedIngredients: this.props.excludeFood});
    }

    if (typeof this.props.includeIds !== 'undefined') {
      this.includedIds = this.props.includeIds;
    }

    if (typeof this.props.excludeIds !== 'undefined') {
      this.excludedIds = this.props.excludeIds;
    }
  }

  /**
    Get checkbox value
  */
  getCheckbox = (item, filterName) => {
    try {
      if (
        (filterName === 'filterFavorite' &&
          typeof this.props.filterFavorite !== 'undefined') ||
        (typeof this.props[filterName] !== 'undefined' &&
          this.props[filterName][item] !== null)
      ) {
        return (
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgb(0,168,235)',
            }}>
            <Image
              source={require('../resources/icon/checkmark.png')}
              style={{width: 10, height: 8, tintColor: 'rgb(255,255,255)'}}
            />
          </View>
        );
      }

      return <View style={styles.checkbox} />;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Draw the checkbox component
  */
  getCheckboxItem = (title, itemName, value, filterName, isWithoutLine) => {
    try {
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 44,
              marginTop: 0,
            }}>
            <Text
              style={
                filterName === 'filterFavorite'
                  ? [styles.title, {marginBottom: 0}]
                  : styles.text
              }>
              {title}
            </Text>
            <TouchableWithoutFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => this.changeCheckbox(itemName, value, filterName)}>
              {this.getCheckbox(itemName, filterName)}
            </TouchableWithoutFeedback>
          </View>
          {(typeof isWithoutLine === 'undefined' || !isWithoutLine) && (
            <View style={styles.line} />
          )}
        </View>
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  changeCheckbox = (item, value, filterName) => {
    try {
      let object;

      if (filterName === 'filterFavorite') {
        object =
          typeof this.props.filterFavorite !== 'undefined' ? undefined : 1;
      } else {
        object = {...this.props[filterName]};
        console.log('changeCheckbox', object);
        object[item] = object[item] === null ? value : null;
      }

      console.log('changeCheckbox', object);

      this.props.onFilterItemChange(filterName, object);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Reset all filters
  */
  resetFilters = () => {
    try {
      this.setState({includedIngredients: [], excludedIngredients: []});

      this.includedIds = [];
      this.excludedIds = [];

      this.props.resetFilters();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onChangeIncludeText = async (text) => {
    try {
      this.setState({includeInput: text});

      const data = await shaefitApi.getFood(
        1,
        undefined,
        undefined,
        text,
        undefined,
      );
      console.log('onChangeIncludeText data', data);
      if (typeof data !== 'undefined') {
        this.setState({
          elementsIncludedArray: data.data,
          includePage: 1,
          totalIncludedPages: data.last_page,
        });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onChangeExcludeText = async (text) => {
    try {
      this.setState({excludeInput: text});

      const data = await shaefitApi.getFood(
        1,
        undefined,
        undefined,
        text,
        undefined,
      );
      if (typeof data !== 'undefined') {
        this.setState({
          elementsExcludedArray: data.data,
          excludePage: 1,
          totalExcludedPages: data.last_page,
        });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handleIncludedLoadMore = async () => {
    try {
      if (this.state.includePage !== this.state.totalIncludedPages) {
        const newData = await shaefitApi.getFood(
          this.state.includePage + 1,
          undefined,
          undefined,
          this.state.includeInput,
          undefined,
        );
        if (typeof newData !== 'undefined') {
          let array = [...this.state.elementsIncludedArray, ...newData.data];

          this.setState({
            elementsIncludedArray: array,
            includePage: this.state.includePage + 1,
          });
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  handleExcludedLoadMore = async () => {
    try {
      if (this.state.excludePage !== this.state.totalExcludedPages) {
        const newData = await shaefitApi.getFood(
          this.state.excludePage + 1,
          undefined,
          undefined,
          this.state.excludeInput,
          undefined,
        );

        if (typeof newData !== 'undefined') {
          let array = [...this.state.elementsExcludedArray, ...newData.data];

          this.setState({
            elementsExcludedArray: array,
            excludePage: this.state.excludePage + 1,
          });
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  _renderIncludedItem = ({item, index}) => {
    return (
      <FlatListItem
        lastIndex={this.state.elementsIncludedArray.length - 1}
        index={index}
        item={item}
        onPress={this.onIncludedPlusPress}
      />
    );
  };

  _renderExcludedItem = ({item, index}) => {
    return (
      <FlatListItem
        lastIndex={this.state.elementsExcludedArray.length - 1}
        index={index}
        item={item}
        onPress={this.onExcludedPlusPress}
      />
    );
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: width - 72,
          marginHorizontal: 16,
          marginVertical: 20,
          backgroundColor: 'rgb(216,215,222)',
        }}
      />
    );
  };

  onIncludedPlusPress = (item, rateColor, rateWidth) => {
    try {
      if (
        this.includedIds.length === 0 ||
        !this.includedIds.includes(item.id)
      ) {
        this.includedIds.push(item.id);
        this.props.setIncludeIds(this.includedIds);
      }

      this.setState({includeInput: ''});

      let isIngredientExists = false;
      for (let i = 0; i < this.state.includedIngredients.length; i++) {
        if (this.state.includedIngredients[i].name === item.name) {
          isIngredientExists = true;
          break;
        }
      }

      if (!isIngredientExists) {
        const array = this.state.includedIngredients;

        array.push(item);
        this.setState({includedIngredients: array});
        this.props.setIncludeFood(array);
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onExcludedPlusPress = (item, rateColor, rateWidth) => {
    try {
      if (
        this.excludedIds.length === 0 ||
        !this.excludedIds.includes(item.id)
      ) {
        this.excludedIds.push(item.id);
        this.props.setExcludeIds(this.excludedIds);
      }

      this.setState({excludeInput: ''});

      let isIngredientExists = false;
      for (let i = 0; i < this.state.excludedIngredients.length; i++) {
        if (this.state.excludedIngredients[i].name === item.name) {
          isIngredientExists = true;
          break;
        }
      }

      if (!isIngredientExists) {
        const array = this.state.excludedIngredients;
        array.push(item);

        this.setState({excludedIngredients: array});
        this.props.setExcludeFood(array);
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  deleteIncludedIngredient = (name, id) => {
    try {
      for (let i = 0; i < this.includedIds.length; i++) {
        if (this.includedIds[i] === id) {
          this.includedIds.splice(i, 1);

          break;
        }
      }

      if (this.includedIds.length !== 0) {
        this.props.setIncludeIds(this.includedIds);
      } else {
        this.props.setIncludeIds(undefined);
      }

      const array = this.state.includedIngredients;
      array.map((data, index) => {
        if (name === data.name) {
          array.splice(index, 1);
        }
      });

      this.setState({includedIngredients: array});

      this.props.setIncludeFood(array);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  deleteExcludedIngredient = (name, id) => {
    try {
      for (let i = 0; i < this.excludedIds.length; i++) {
        if (this.excludedIds[i] === id) {
          this.excludedIds.splice(i, 1);

          break;
        }
      }

      if (this.excludedIds.length !== 0) {
        this.props.setExcludeIds(this.excludedIds);
      } else {
        this.props.setExcludeIds(undefined);
      }

      const array = this.state.excludedIngredients;
      array.map((data, index) => {
        if (name === data.name) {
          array.splice(index, 1);
        }
      });

      this.setState({excludedIngredients: array});

      this.props.setExcludeFood(array);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    console.log('render');

    const includeFood = this.state.includedIngredients.map((item) => {
      const rate = getRateColor(item.user_importance_val, width - 225);

      return (
        <View key={item.name} style={styles.ingredientCard}>
          <Text
            style={[
              styles.inputText,
              {marginTop: 14, marginLeft: 16, width: width - 115},
            ]}>
            {item.name}
          </Text>
          <View
            style={[
              styles.rateContainer,
              {
                width: width - 225,
                backgroundColor: 'rgb(235,241,243)',
                marginTop: 8,
                marginLeft: 16,
                marginBottom: 19,
              },
            ]}>
            <LinearGradient
              colors={rate.color}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={[0.5, 1]}
              style={[
                styles.rateContainer,
                {width: rate.width, bottom: 0, left: 0},
              ]}>
              <Text style={styles.rateText}>{item.user_importance_text}</Text>
            </LinearGradient>
          </View>

          <TouchableWithoutFeedback
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => this.deleteIncludedIngredient(item.name, item.id)}>
            <View style={{position: 'absolute', top: 8, right: -3}}>
              <Image
                source={require('../resources/icon/trash_icon_2x.png')}
                style={{
                  width: 19,
                  height: 21,
                  tintColor: 'rgb(148,155,162)',
                  margin: 20,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });

    const excludeFood = this.state.excludedIngredients.map((item) => {
      const rate = getRateColor(item.user_importance_val, width - 225);

      return (
        <View key={item.name} style={styles.ingredientCard}>
          <Text
            style={[
              styles.inputText,
              {marginTop: 14, marginLeft: 16, width: width - 115},
            ]}>
            {item.name}
          </Text>
          <View
            style={[
              styles.rateContainer,
              {
                width: width - 225,
                backgroundColor: 'rgb(235,241,243)',
                marginTop: 8,
                marginLeft: 16,
                marginBottom: 19,
              },
            ]}>
            <LinearGradient
              colors={rate.color}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={[0.5, 1]}
              style={[
                styles.rateContainer,
                {width: rate.width, bottom: 0, left: 0},
              ]}>
              <Text style={styles.rateText}>{item.user_importance_text}</Text>
            </LinearGradient>
          </View>

          <TouchableWithoutFeedback
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => this.deleteExcludedIngredient(item.name, item.id)}>
            <View style={{position: 'absolute', top: 8, right: -3}}>
              <Image
                source={require('../resources/icon/trash_icon_2x.png')}
                style={{
                  width: 19,
                  height: 21,
                  tintColor: 'rgb(148,155,162)',
                  margin: 20,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });

    return (
      <View>
        <KeyboardAwareScrollView
          extraHeight={Platform.OS === 'ios' ? 180 : 0}
          keyboardShouldPersistTaps={'handled'}>
          <View style={{marginHorizontal: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 29,
                marginBottom: 22,
              }}>
              <Text style={styles.mainTitle}>Filters</Text>
              <TouchableWithoutFeedback onPress={this.resetFilters}>
                <View style={styles.resetButton}>
                  <Text style={styles.resetText}>Reset</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            {this.getCheckboxItem(
              'Favorite Recipes',
              'isFavorite',
              1,
              'filterFavorite',
            )}

            <Text style={[styles.title, {marginTop: 28.5}]}>
              Foods to include
            </Text>

            <View style={styles.ingredientInput}>
              <TextInput
                style={{marginLeft: 16, height: 40}}
                placeholder="Add an ingredient"
                underlineColorAndroid="transparent"
                placeholderTextColor="rgb(180,184,186)"
                onChangeText={(text) => this.onChangeIncludeText(text)}
                onBlur={() => this.setState({includeInput: ''})}>
                <Text style={styles.inputText}>{this.state.includeInput}</Text>
              </TextInput>
            </View>

            {this.state.includeInput !== '' && (
              <BoxShadow
                setting={{
                  ...shadowOpt,
                  ...{
                    style: [styles.searchPopup, {height: 205, marginTop: 0}],
                  },
                }}>
                <View
                  style={[
                    styles.searchPopup,
                    {shadowOpacity: 0, backgroundColor: 'rgb(255,255,255)'},
                  ]}>
                  <AnimatedFlatList
                    ref={(ref) => (this.animatedFlatList = ref)}
                    data={this.state.elementsIncludedArray}
                    extraData={this.state.elementsIncludedArray}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={this._renderIncludedItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    keyboardShouldPersistTaps={'handled'}
                    nestedScrollEnabled={true}
                    // contentContainerStyle={{width: width - 40, alignSelf: 'center', elevation: 2, shadowOpacity: 0.12, shadowRadius: 25, shadowColor: 'rgb(39,56,73)', shadowOffset: { height: 12, width: 0 }}}

                    bounces={false}
                    refreshing={this.state.includeRefreshing}
                    removeClippedSubviews={false}
                    onEndReached={() => {
                      if (!this.state.includeRefreshing) {
                        this.setState({includeRefreshing: true}, () => {
                          this.handleIncludedLoadMore().then(() => {
                            this.setState({includeRefreshing: false});
                          });
                        });
                      }
                    }}
                    onEndReachedThreshold={3}
                  />
                </View>
              </BoxShadow>
            )}

            {includeFood}

            <Text style={[styles.title, {marginTop: 28.5}]}>
              Foods to exclude
            </Text>

            <View style={styles.ingredientInput}>
              <TextInput
                style={{marginLeft: 16, height: 40}}
                placeholder="Add an ingredient"
                underlineColorAndroid="transparent"
                placeholderTextColor="rgb(180,184,186)"
                onChangeText={(text) => this.onChangeExcludeText(text)}
                onBlur={() => this.setState({excludeInput: ''})}>
                <Text style={styles.inputText}>{this.state.excludeInput}</Text>
              </TextInput>
            </View>

            {this.state.excludeInput !== '' && (
              <BoxShadow
                setting={{
                  ...shadowOpt,
                  ...{
                    style: [styles.searchPopup, {height: 205, marginTop: 0}],
                  },
                }}>
                <View
                  style={[
                    styles.searchPopup,
                    {shadowOpacity: 0, backgroundColor: 'rgb(255,255,255)'},
                  ]}>
                  <AnimatedFlatList
                    ref={(ref) => (this.animatedFlatList2 = ref)}
                    data={this.state.elementsExcludedArray}
                    extraData={this.state.elementsExcludedArray}
                    keyExtractor={(item, index) => item.name + index}
                    renderItem={this._renderExcludedItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    keyboardShouldPersistTaps={'handled'}
                    nestedScrollEnabled={true}
                    bounces={false}
                    refreshing={this.state.excludeRefreshing}
                    removeClippedSubviews={false}
                    onEndReached={() => {
                      if (!this.state.excludeRefreshing) {
                        this.setState({excludeRefreshing: true}, () => {
                          this.handleExcludedLoadMore().then(() => {
                            this.setState({excludeRefreshing: false});
                          });
                        });
                      }
                    }}
                    onEndReachedThreshold={3}
                  />
                </View>
              </BoxShadow>
            )}

            {excludeFood}

            <Text style={[styles.title, {marginTop: 28}]}>Courses</Text>
            <View style={styles.line} />

            {this.getCheckboxItem(
              'Main Dishes',
              'mainDishes',
              1,
              'filterCourses',
            )}
            {this.getCheckboxItem('Desserts', 'desserts', 2, 'filterCourses')}
            {this.getCheckboxItem(
              'Side Dishes',
              'sideDishes',
              3,
              'filterCourses',
            )}
            {this.getCheckboxItem(
              'Appetizers',
              'appetizers',
              4,
              'filterCourses',
            )}
            {this.getCheckboxItem('Salads', 'salads', 5, 'filterCourses')}

            <PanelRecipesFilter
              marginTop={0}
              isExpanded={false}
              marginBottom={0}>
              {this.getCheckboxItem(
                'Breakfast and Brunch',
                'breakfast',
                6,
                'filterCourses',
              )}
              {this.getCheckboxItem('Breads', 'breads', 7, 'filterCourses')}
              {this.getCheckboxItem(
                'Beverages',
                'beverages',
                9,
                'filterCourses',
              )}
              {this.getCheckboxItem(
                'Condiments and Sauces',
                'condiments',
                10,
                'filterCourses',
              )}
              {this.getCheckboxItem(
                'Cocktails',
                'cocktails',
                11,
                'filterCourses',
              )}
              {this.getCheckboxItem('Snacks', 'snacks', 12, 'filterCourses')}
              {this.getCheckboxItem('Lunch', 'lunch', 13, 'filterCourses')}
            </PanelRecipesFilter>

            <Text style={[styles.title, {marginTop: 39}]}>Cuisines</Text>
            <View style={[styles.line, {marginTop: 16.5}]} />

            {this.getCheckboxItem('African', 'african', 29, 'filterCuisines')}
            {this.getCheckboxItem('American', 'american', 1, 'filterCuisines')}
            {this.getCheckboxItem('Asian', 'asian', 4, 'filterCuisines')}

            <PanelRecipesFilter
              marginTop={0}
              isExpanded={false}
              marginBottom={0}>
              {this.getCheckboxItem(
                'Australian',
                'australian',
                30,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Barbeque',
                'barbeque',
                9,
                'filterCuisines',
              )}
              {this.getCheckboxItem('Cajun', 'cajun', 32, 'filterCuisines')}
              {this.getCheckboxItem(
                'Cajun and Creole',
                'cajunCreole',
                12,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Caribbean',
                'caribbean',
                31,
                'filterCuisines',
              )}
              {this.getCheckboxItem('Chinese', 'chinese', 11, 'filterCuisines')}
              {this.getCheckboxItem('Cuban', 'cuban', 22, 'filterCuisines')}
              {this.getCheckboxItem(
                'East European',
                'eastEuropean',
                28,
                'filterCuisines',
              )}
              {this.getCheckboxItem('English', 'english', 15, 'filterCuisines')}
              {this.getCheckboxItem('French', 'french', 7, 'filterCuisines')}
              {this.getCheckboxItem('German', 'german', 18, 'filterCuisines')}
              {this.getCheckboxItem('Greek', 'greek', 14, 'filterCuisines')}
              {this.getCheckboxItem(
                'Hawaiian',
                'hawaiian',
                23,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Hungarian',
                'hungarian',
                25,
                'filterCuisines',
              )}
              {this.getCheckboxItem('Indian', 'indian', 10, 'filterCuisines')}
              {this.getCheckboxItem('Irish', 'irish', 20, 'filterCuisines')}
              {this.getCheckboxItem('Italian', 'italian', 3, 'filterCuisines')}
              {this.getCheckboxItem(
                'Japanese',
                'japanese',
                21,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Kid Friendly',
                'kidFriendly',
                2,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Mediterranean',
                'mediterranean',
                13,
                'filterCuisines',
              )}
              {this.getCheckboxItem('Mexican', 'mexican', 5, 'filterCuisines')}
              {this.getCheckboxItem(
                'Middle Eastern',
                'middleEastern',
                27,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Moroccan',
                'moroccan',
                19,
                'filterCuisines',
              )}
              {this.getCheckboxItem('Native', 'native', 34, 'filterCuisines')}
              {this.getCheckboxItem(
                'Portuguese',
                'portuguese',
                26,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Southern and Soul Food',
                'southern',
                6,
                'filterCuisines',
              )}
              {this.getCheckboxItem(
                'Southwestern',
                'southwestern',
                8,
                'filterCuisines',
              )}
              {this.getCheckboxItem('Spanish', 'spanish', 16, 'filterCuisines')}
              {this.getCheckboxItem('Swedish', 'swedish', 24, 'filterCuisines')}
              {this.getCheckboxItem('Thai', 'thai', 17, 'filterCuisines')}
              {this.getCheckboxItem('Turkish', 'turkish', 33, 'filterCuisines')}
            </PanelRecipesFilter>
          </View>

          <View style={{height: isIphoneX() ? 182 + 88 : 148 + 88}} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ingredientCard: {
    width: width - 40,
    minHeight: 78,
    borderRadius: 10,
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'rgb(223,230,235)',
    marginTop: 16,
  },
  rateContainer: {
    width: 150,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
  },
  rateText: {
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 11,
    color: 'rgb(255,255,255)',
    letterSpacing: -0.1,
    marginLeft: 8,
  },
  resetButton: {
    width: 64,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgb(0,168,235)',
    position: 'absolute',
    right: 0,
  },
  searchPopup: {
    width: width - 40,
    height: 205,
    borderRadius: 10,
    backgroundColor: 'rgb(255,255,255)',
    // backgroundColor: 'black',
    shadowOpacity: 0.12,
    shadowRadius: 25,
    shadowColor: 'rgb(39,56,73)',
    shadowOffset: {height: 12, width: 0},
    // elevation: 2
    // position: 'absolute',
    // top: getHeight(221),
    // alignSelf: 'center'
  },
  popupIcon: {
    position: 'absolute',
    right: 20,
    width: 21,
    height: 21,
  },
  resetText: {
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(0,168,235)',
  },
  mainTitle: {
    fontFamily: 'SFProDisplay-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: 'rgb(31,33,35)',
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: 'SFProDisplay-Semibold',
    fontWeight: '600',
    fontSize: 17,
    color: 'rgb(16,16,16)',
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  line: {
    width: width - 40,
    height: 0.5,
    backgroundColor: 'rgb(216,215,222)',
    alignSelf: 'center',
    // marginRight: 20
  },
  ingredientInput: {
    width: width - 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgb(239,243,249)',
    // justifyContent: 'center'
  },
  inputText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    color: 'rgb(31,33,35)',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(54,58,61)',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  seeMoreText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(0,168,235)',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 2,
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    // borderColor: 'rgb(223,230,235)',
    borderColor: 'rgb(199,205,209)',
    // marginVertical: 20,
    // marginRight: 0 //(width - 335) / 2,
    // position: 'absolute',
    // right: 0
  },
});

const shadowOpt = {
  width: width - 40,
  height: 205,
  color: '#273849',
  border: 25,
  radius: 10,
  opacity: 0.06, //0.12,
  x: 0,
  y: 12,
  style: styles.searchPopup,
};

export default RecipesPopup;

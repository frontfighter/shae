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
    let servings = this.props.servings;

    if (servings === '1/8') {
      servings = 0.125;
    } else if (servings === '1/4') {
      servings = 0.25;
    } else if (servings === '1/2') {
      servings = 0.5;
    } else {
      servings = parseInt(servings);
    }

    let amount = new Fraction(this.props.item.amount * servings)
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
    } else if (amount.includes('1/25')) {
      amount = amount.replace('1/25', '1/24');
    } else if (amount.includes('1/33')) {
      amount = amount.replace('1/33', '1/32');
    }

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
            <Text style={styles.foodItemText}>
              {amount + ' ' + this.props.item.unit.name}
            </Text>
          </View>

          <Text style={styles.foodItemCals}>
            {parseInt(this.props.item.kcal) + ' cal'}
          </Text>
        </View>
      </Swipeout>
    );
  }
}

class SaveMeal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mealName: '',
      food: [],
      photo: '',
      photoUri: '',
      photoFileName: '',

      isHintNutrientsModalVisible: false,
      hintNutrientsTouchPosition: {},
      hintNutrientsColor: '',
      hintNutrientsText: '',
      hintNutrientsValue: 0,
      isServingsExpanded: false,
      servings: '1',
      servings2: '1',
    };

    this.carbs = 0;
    this.fat = 0;
    this.protein = 0;
    this.cals = 0;
  }

  UNSAFE_componentWillMount() {
    this.setState({food: this.props.food}, () => {
      console.log('this.state.food', this.state.food);
    });
  }

  async componentDidMount() {
    this.setState({food: this.props.food}, () => {
      console.log('this.state.food', this.state.food);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps SaveMeal');
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

      Actions.refresh({
        key: 'foodDiary',
        newFood: nextProps.newFood,
        id: nextProps.id,
      });
    }
  }

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
          console.log('response photo', response.uri);
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

          // setTimeout(() => {

          // }, 1000);

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

    // if (typeof this.props.stats !== 'undefined') {
    //   for (let i = 0; i < this.props.stats.length; i++) {
    //     if (this.props.stats[i].type === 'carbs') {
    //       carbs = parseFloat(this.props.stats[i].amount);
    //     } else if (this.props.stats[i].type === 'fat_total') {
    //       fat = parseFloat(this.props.stats[i].amount);
    //     } else if (this.props.stats[i].type === 'protein') {
    //       protein = parseFloat(this.props.stats[i].amount);
    //     }
    //   }
    // } else {
    for (let i = 0; i < this.state.food.length; i++) {
      totalAmount = parseFloat(
        parseFloat(totalAmount) +
          parseFloat(this.state.food[i].carbs) +
          parseFloat(this.state.food[i].fat) +
          parseFloat(this.state.food[i].protein),
      ).toFixed(2);
      carbs = carbs + parseFloat(this.state.food[i].carbs);
      fat = fat + parseFloat(this.state.food[i].fat);
      protein = protein + parseFloat(this.state.food[i].protein);
      cals = cals + parseFloat(this.state.food[i].kcal);
    }
    // }

    // console.log('getPercentages', totalAmount, carbs, fat, protein);

    // for (let i = 0; i < this.props.food.length; i++) {
    //   totalAmount = totalAmount + parseFloat(this.props.food[i].carbs) + parseFloat(this.props.food[i].fat) + parseFloat(this.props.food[i].protein);
    //   carbs = carbs + parseFloat(this.props.food[i].carbs);
    //   fat = fat + parseFloat(this.props.food[i].fat);
    //   protein = protein + parseFloat(this.props.food[i].protein);
    //   cals = cals + parseFloat(this.props.food[i].kcal);
    // }

    this.carbs = carbs;
    this.fat = fat;
    this.protein = protein;
    this.cals = cals;

    console.log('getPercentages', parseFloat(totalAmount), carbs, fat, protein);

    return [
      parseFloat((carbs / parseFloat(totalAmount)) * 100).toFixed(2),
      parseFloat((fat / parseFloat(totalAmount)) * 100).toFixed(2),
      parseFloat((protein / parseFloat(totalAmount)) * 100).toFixed(2),
    ];
  };

  onDeleteFoodItem = (index) => {
    let array = this.state.food;
    shaefitApi.deleteFoodFromSavedMeal(
      this.props.foodDiaryId,
      array[index].foodId,
    );

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
        servings={this.state.servings}
      />
    );
  };

  onAddFoodPress = () => {
    Actions.details({
      key: 'searchFoodScreen',
      isFromSaveMeal: true,
    });
  };

  onSaveMealPress = () => {
    console.log('onSaveMealPress', this.state.mealName);
    console.log('onSaveMealPress this.state.food', this.state.food);

    let servings = this.state.servings;

    if (servings === '1/8') {
      servings = 0.125;
    } else if (servings === '1/4') {
      servings = 0.25;
    } else if (servings === '1/2') {
      servings = 0.5;
    } else {
      servings = parseInt(servings);
    }

    let foodArray = this.state.food;
    for (let i = 0; i < foodArray.length; i++) {
      foodArray[i].amount = parseFloat(foodArray[i].amount * servings).toFixed(
        2,
      );

      foodArray[i].kcal = parseFloat(foodArray[i].kcal * servings).toFixed(2);
    }

    if (this.state.mealName !== '') {
      shaefitApi.saveSavedMeals({
        name: this.state.mealName,
        carbs: parseFloat(this.carbs * servings).toFixed(2),
        fat: parseFloat(this.fat * servings).toFixed(2),
        protein: parseFloat(this.protein * servings).toFixed(2),
        foods: foodArray, //this.props.food,
        cals: parseFloat(this.cals * servings).toFixed(2),
        photo: {
          uri: this.state.photoUri,
          name: this.state.photoFileName,
          type: `image/jpeg`,
        },
        // photo: this.state.photoUri,
      });

      Actions.pop();
    }
  };

  onServingsPress = () => {
    this.setState({isServingsExpanded: !this.state.isServingsExpanded});
  };

  onDonePress = () => {
    this.setState({isServingsExpanded: !this.state.isServingsExpanded});

    this.setState({
      servings: this.state.servings2,
    });

    console.log('this.state.servings', this.state.servings2);
  };

  render() {
    const percentages = this.getPercentages();

    const pieChartData = [];

    if (percentages[0] !== 0)
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

    if (percentages[1] !== 0)
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

    if (percentages[2] !== 0)
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

    console.log('pieChartData', pieChartData);

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
          <TouchableWithoutFeedback onPress={this.getPhoto}>
            {this.state.photoUri === '' ? (
              <View
                style={{
                  width,
                  height: 200,
                  backgroundColor: 'rgb(233,237,243)',
                }}>
                <Image
                  source={require('../resources/icon/addPhoto.png')}
                  style={{alignSelf: 'center', marginTop: 62}}
                />

                <Text style={styles.addPhotoText}>Add Photo</Text>
              </View>
            ) : (
              <Image
                source={{uri: this.state.photoUri}}
                style={{width, height: 200}}
                resizeMode="cover"
              />
            )}
          </TouchableWithoutFeedback>

          <FloatingLabelInput
            label={'Meal Name'}
            value={this.state.mealName}
            onChangeText={(value) => this.setState({mealName: value})}
            width={width - 40}
            marginTop={24}
            phoneInputType={false}
            keyboard={'default'}
          />

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
                <Text style={styles.servingsText}>{this.state.servings}</Text>
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
                    percentage: percentages[0],
                    color: 'rgb(105,88,232)',
                  },
                  {
                    percentage: percentages[1],
                    color: 'rgb(42,204,197)',
                  },
                  {
                    percentage: percentages[2],
                    color: 'rgb(234,196,50)',
                  },
                ]}
                dividerSize={2}
                innerRadius={37.5}
                strokeCap={'butt'}
              /> */}

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
            keyExtractor={(item, index) => item.name + index}
            renderItem={this._renderFoodListItem}
            contentContainerStyle={{overflow: 'visible', paddingTop: 5}}
            keyboardShouldPersistTaps="always"
            initialNumToRender={10}
            bounces={false}
          />

          <TouchableWithoutFeedback onPress={this.onAddFoodPress}>
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

          {/*<View style={{ height: isIphoneX() ? 34 + 48 + 32 : 48 + 32 }} />*/}
          <View style={{height: 32}} />
        </KeyboardAwareScrollView>

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

        <KeyboardAvoidingView
          style={{justifyContent: 'flex-end'}}
          behavior={Platform.OS === 'ios' ? 'position' : null}
          keyboardVerticalOffset={
            Platform.OS === 'android' ? 0 : isIphoneX() ? 54 : 60
          }>
          <View>
            <TouchableWithoutFeedback onPress={this.onSaveMealPress}>
              <View style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Save as Meal</Text>
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
    // position: "absolute",
    // bottom: isIphoneX() ? 34 : 0,
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

export default SaveMeal;

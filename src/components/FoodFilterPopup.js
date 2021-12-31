import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Panel from './Panel';
import PanelUnit from './PanelUnit';

const {height, width} = Dimensions.get('window');

class FoodFilterPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryEat: false,
      categoryAvoid: false,
      categoryFavorite: false,
      categoryAll: false,

      typeVegetables: false,
      typeFruits: false,
      typeGrains: false,
      typeMeats: false,
      typeNuts: false,
      typeDrinks: false,
      typeSauces: false,
      typeDairy: false,
      typeSweats: false,
      typeFats: false,
    };
  }

  /**
    Set the initial values of category and type
  */
  UNSAFE_componentWillMount() {
    this.setState({['category' + this.props.categoryValue]: true});
    this.setState({['type' + this.props.typeValue]: true});
  }

  toggleCategory = (category) => {
    try {
      const oldValue = this.state[category];

      this.setState(
        {
          categoryEat: false,
          categoryAvoid: false,
          categoryFavorite: false,
          categoryAll: false,
        },
        () => this.setState({[category]: !oldValue}),
      );

      this.props.category(oldValue ? false : category.replace('category', ''));
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  toggleType = (type) => {
    try {
      const oldValue = this.state[type];

      this.setState(
        {
          typeVegetables: false,
          typeFruits: false,
          typeGrains: false,
          typeMeats: false,
          typeNuts: false,
          typeDrinks: false,
          typeSauces: false,
          typeDairy: false,
          typeSweats: false,
          typeFats: false,
        },
        () => this.setState({[type]: !oldValue}),
      );

      this.props.type(oldValue ? false : type.replace('type', ''));
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
      this.props.resetFilters();

      this.setState({
        categoryEat: false,
        categoryAvoid: false,
        categoryFavorite: false,
        categoryAll: false,
        typeVegetables: false,
        typeFruits: false,
        typeGrains: false,
        typeMeats: false,
        typeNuts: false,
        typeDrinks: false,
        typeSauces: false,
        typeDairy: false,
        typeSweats: false,
        typeFats: false,
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    return (
      <View>
        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          scrollEnabled>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 30,
              marginHorizontal: 20,
            }}>
            <Text style={styles.title}>Filters</Text>
            <TouchableWithoutFeedback onPress={this.resetFilters}>
              <View style={styles.resetButton}>
                <Text style={styles.resetText}>Reset</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Panel title="Category" marginTop={30} isExpanded={true}>
            <PanelUnit
              handleState={() => this.toggleCategory('categoryEat')}
              text="Foods to Eat"
              condition={this.state.categoryEat}
            />

            <PanelUnit
              handleState={() => this.toggleCategory('categoryAvoid')}
              text="Foods to Avoid"
              condition={this.state.categoryAvoid}
            />

            <PanelUnit
              handleState={() => this.toggleCategory('categoryFavorite')}
              text="Favorite Foods"
              condition={this.state.categoryFavorite}
            />

            <TouchableWithoutFeedback
              onPress={() => this.toggleCategory('categoryAll')}>
              <View style={styles.popupUnit}>
                <Text style={styles.unitText}>All Foods</Text>
              </View>
            </TouchableWithoutFeedback>
          </Panel>

          <Panel title="Food Types" marginTop={32} isExpanded={true}>
            <PanelUnit
              handleState={() => this.toggleType('typeVegetables')}
              text="Vegetables"
              condition={this.state.typeVegetables}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeFruits')}
              text="Fruits"
              condition={this.state.typeFruits}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeGrains')}
              text="Grains"
              condition={this.state.typeGrains}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeMeats')}
              text="Meats"
              condition={this.state.typeMeats}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeNuts')}
              text="Nuts"
              condition={this.state.typeNuts}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeDrinks')}
              text="Drinks"
              condition={this.state.typeDrinks}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeSauces')}
              text="Sauces, herbs and spices"
              condition={this.state.typeSauces}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeDairy')}
              text="Dairy"
              condition={this.state.typeDairy}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeSweats')}
              text="Sweets"
              condition={this.state.typeSweats}
            />

            <PanelUnit
              handleState={() => this.toggleType('typeFats')}
              text="Fats & Oils"
              condition={this.state.typeFats}
            />
          </Panel>

          <View style={{height: isIphoneX() ? 172 + 88 : 138 + 88}} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SFProDisplay-Bold',
    fontWeight: '700',
    fontSize: 20,
    color: 'rgb(31,33,35)',
    letterSpacing: -0.5,
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
  resetText: {
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(0,168,235)',
  },
  popupUnit: {
    width: width - 40,
    height: 42.5,
    borderTopWidth: 0.5,
    borderTopColor: 'rgb(216,215,222)',
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  unitText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 17,
    color: 'rgb(31,33,35)',
    letterSpacing: -0.4,
    lineHeight: 22,
  },
});

export default FoodFilterPopup;

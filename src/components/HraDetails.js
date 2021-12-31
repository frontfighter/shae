import React from 'react';
import {
  PixelRatio,
  View,
  Keyboard,
  StyleSheet,
  Text,
  SafeAreaView,
  InteractionManager,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ViewMoreText from 'react-native-view-more-text';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Select, Option} from 'react-native-chooser';
import {isIphoneX} from 'react-native-iphone-x-helper';
import * as Animatable from 'react-native-animatable';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import {getEmoji} from 'react-native-emoji';

import HraCheckbox from '../components/HraCheckbox';
import HraRadio from '../components/HraRadio';
import FloatingLabelInput from '../components/FloatingLabelInput';
import AccountCard from '../components/AccountCard';
import CardHOC from '../components/CardHOC';
import {PLACE_ID_API_KEY} from '../../private_keys';

const {height, width} = Dimensions.get('window');
const CardWithShadow = CardHOC(AccountCard);

class AllergyItem extends React.PureComponent {
  render() {
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={
            this.props.item.isHeader ? null : this.props.onAllergyItemPress
          }>
          <View
            style={{
              borderBottomWidth:
                this.props.index !== this.props.length - 1 ? 0.5 : 0,
              borderBottomColor: 'rgb(216,215,222)',
            }}>
            <Text
              style={[
                styles.selectText,
                this.props.item.isHeader
                  ? {
                      fontFamily: 'SFProText-Medium',
                      fontWeight: '500',
                      fontSize: 14,
                      letterSpacing: -0.2,
                      color: 'rgb(157,168,183)',
                    }
                  : null,
              ]}>
              {this.props.item.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default class HraDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      elements: [],
      radioGroups: {},
      checkBoxGroups: [],

      medicalCards: [],
      productCards: [],
      medicalCardsData: [],
      productCardsData: [],
      injuriesData: [],
      foodAllergies: [],
      foodUnfavorite: [],

      foodAllergiesText: '',
      foodUnfavoriteText: '',

      radioText: [],
      selectsData: [],

      texts: [],
      selects: [],
      productSelects: [],
      medicalSelects: [],

      errors: [],
      additionalResponsesErrors: [],
      filteredCountries: [],
      filteredCountries2: {},

      filteredCities: [],
      filteredCities2: {},
      allergyCategories: [],

      isKeyboardOpen: false,
    };

    this.countries = [];
    this.cities = [];
    this.answers = null;
    this.errorOffset = {};
    this.additionalErrorOffset = {};
    this.errorOffsetMedical = {};
    this.errorOffsetSupplements = {};
    this.uncheckedQuestions = {};
    this.errorsExcluding = [];
  }

  /**
    Show more text on "more" press
  */
  renderViewMore(onPress) {
    return (
      <Text
        style={[styles.cardText, {color: 'rgb(0,168,235)'}]}
        onPress={onPress}>
        more
      </Text>
    );
  }

  /**
    Show less text on "less" press
  */
  renderViewLess(onPress) {
    return (
      <Text
        style={[styles.cardText, {color: 'rgb(0,168,235)'}]}
        onPress={onPress}>
        less
      </Text>
    );
  }

  /**
    Change radio element state on its press
  */
  setRadioState = (activeItemName, innerIndex, index, id, isRadioText) => {
    try {
      let object = {...this.state.radioGroups};

      if (object.hasOwnProperty([activeItemName])) {
        object[activeItemName] = innerIndex;
      } else {
        object = {
          ...this.state.radioGroups,
          ...{[activeItemName]: innerIndex},
        };
      }

      if (typeof innerIndex === 'string') {
        this.filterCountries(innerIndex, id);
      }

      this.setState({radioGroups: object});

      this.props.setAnswers(id, [innerIndex], null);

      const array = this.state.errors;
      const arrayIndex = array.indexOf(id);

      if (arrayIndex !== -1) {
        array.splice(arrayIndex, 1);

        this.setState({errors: array});
      }

      if (isRadioText) {
        if (
          array.includes(id + 'text') &&
          this.state.radioText[activeItemName] !== null
        ) {
          const arrayIndex = array.indexOf(id + 'text');
          if (arrayIndex !== -1) {
            array.splice(arrayIndex, 1);

            this.setState({errors: array});
          }
        }
      } else {
        let keys = Object.keys(this.errorOffset);
        let nextIndex = Number(keys.indexOf(id.toString()) + 1);
        console.log('nextIndex', nextIndex, id, this.errorOffset);
        let nextItem = keys[nextIndex];
        console.log('nextItem', nextItem);
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Change injuries checkboxes state on press on one on them
  */
  setCheckboxInjuriesState = (itemName, value) => {
    try {
      const array = this.state.checkBoxGroups;
      const values = [];

      array.map((data, index) => {
        if (data.hasOwnProperty(itemName)) {
          const newValue = data[itemName] !== null ? null : true;
          array[index] = {[itemName]: newValue};
        }

        for (let k = 0; k < 50; k++) {
          const name = 'checkBox_injuries' + k;
          console.log('setCheckboxState name', name);

          if (
            typeof this.state.checkBoxGroups[index][name] === 'undefined' ||
            this.state.checkBoxGroups[index][name] === null
          ) {
            continue;
          } else {
            values.push(k);
          }
        }
      });

      this.props.setAnswers(158, values, null);
      this.setState({checkBoxGroups: array}, () => {
        console.log('setCheckboxInjuriesState', values, array);
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Change checkbox elements state on its press
  */
  setCheckboxState = (itemName, value, overrides, responseType) => {
    try {
      const array = this.state.checkBoxGroups;
      const values = [];
      const id = itemName.split('_');

      console.log(
        'setCheckboxState overrides',
        itemName,
        value,
        overrides,
        id[1],
      );

      let isNoneResponse = false;
      let noneResponeValue = null;

      let isNoneResponseValue = [];
      if (typeof responseType !== 'undefined' && responseType.isNoneResponse) {
        isNoneResponse = true;
        array.map((data, index) => {
          if (typeof data[itemName] !== 'undefined') {
            const newValue = data[itemName] !== null ? null : value;
            noneResponeValue = newValue;
          }
        });
      } else {
        this.props.data.map((element, index) => {
          if (element.id === Number(id[1])) {
            element.responses.map((innerElement, innerIndex) => {
              if (innerElement.responseType.isNoneResponse) {
                isNoneResponseValue.push(innerElement.value);
              }
            });
          }
        });
      }

      console.log('isNoneResponseValue', isNoneResponseValue);

      array.map((data, index) => {
        if (data.hasOwnProperty(itemName)) {
          const newValue = data[itemName] !== null ? null : value;
          array[index] = {[itemName]: newValue};
        }

        if (
          typeof overrides !== 'undefined' &&
          overrides.forceOtherResponsesFalse !== null
        ) {
          for (let i = 0; i < overrides.forceOtherResponsesFalse.length; i++) {
            const id = overrides.forceOtherResponsesFalse[i];

            const name = Object.keys(array[index]).toString();
            console.log(
              'setCheckboxState overrides name',
              name,
              array[index],
              id,
            );
            if (
              typeof array[index][name] !== 'undefined' &&
              array[index][name] !== null &&
              array[index][name] === id
            ) {
              console.log('setCheckboxState overrides', array[index], id);
              array[index] = {[name]: null};
            }
          }
        }

        for (let k = 0; k < 50; k++) {
          const name = 'checkBox_' + id[1] + '_' + k;
          console.log('setCheckboxState name', name);

          if (typeof this.state.checkBoxGroups[index][name] === 'undefined') {
            continue;
          } else if (this.state.checkBoxGroups[index][name] !== null) {
            values.push(this.state.checkBoxGroups[index][name]);

            if (
              typeof overrides !== 'undefined' &&
              overrides.forceOtherResponsesFalse !== null
            ) {
              for (
                let i = 0;
                i < overrides.forceOtherResponsesFalse.length;
                i++
              ) {
                const id = overrides.forceOtherResponsesFalse[i];

                const ind = values.indexOf(id);
                if (ind !== -1) {
                  values.splice(ind, 1);
                }
              }
            }

            console.log(
              'setCheckboxState noneResponeValue',
              noneResponeValue,
              isNoneResponse,
              name,
              itemName,
            );
            if (
              noneResponeValue !== null &&
              isNoneResponse &&
              name !== itemName &&
              name.includes(itemName.substring(0, itemName.length - 2))
            ) {
              if (array[index][name] !== null) {
                const ind = values.indexOf(array[index][name]);
                if (ind !== -1) {
                  values.splice(ind, 1);
                }

                array[index] = {[name]: null};
              }
            }

            console.log(
              'array[index][name]',
              array[index][name],
              isNoneResponseValue,
            );
            if (
              isNoneResponseValue.length !== 0 &&
              isNoneResponseValue.includes(array[index][name])
            ) {
              const ind = values.indexOf(array[index][name]);
              if (ind !== -1) {
                values.splice(ind, 1);
              }

              array[index] = {[name]: null};
            }
          }
        }

        console.log(
          'setCheckboxState this.state.checkBoxGroups',
          this.state.checkBoxGroups,
        );
        console.log('setCheckboxState values', values);

        if (values.length !== 0) {
          const errors = this.state.errors;
          const arrayIndex = errors.indexOf(Number(id[1]));
          console.log('values errors', errors);
          console.log('values id', id);

          if (arrayIndex !== -1) {
            errors.splice(arrayIndex, 1);

            this.setState({errors});
          }
        }
      });

      this.props.setAnswers(id[1], values, null);

      console.log('setCheckboxState', itemName, value);
      console.log('setCheckboxState array, values', array, values);

      this.setState({checkBoxGroups: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Set the initial data such as countries list, allergies list
  */
  UNSAFE_componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    const countries = getAllCountries();
    console.log('countries list', countries);

    countries.map((item, index) => {
      if (
        typeof item.name !== 'undefined' &&
        typeof item.name.common !== 'undefined'
      ) {
        const flag = this.getFlagEmojiName(item.flag, item.cca2);

        this.countries.push({
          name: item.name.common,
          cca2: item.cca2,
          flag: item.flag,
        });
      }
    });

    this.cities.push({description: ''});

    const allergyCategoriesArray = [];
    Object.keys(this.props.allergies).map((key) => {
      const item = this.props.allergies[key];
      const object = {id: key, name: item.name, isHeader: true};
      allergyCategoriesArray.push(object);

      if (item.allergies.length !== 0) {
        for (let i = 0; i < item.allergies.length; i++) {
          const object = {
            id: item.allergies[i].id,
            name: item.allergies[i].name,
            isHeader: false,
          };
          allergyCategoriesArray.push(object);
        }
      }
    });

    allergyCategoriesArray.push({
      id: '9999',
      name: 'Full List of Foods',
      isHeader: true,
    });
    Object.keys(this.props.food).map((key) => {
      const item = this.props.food[key];
      const object = {id: item.id, name: item.name, isHeader: false};
      allergyCategoriesArray.push(object);
    });

    this.setState({allergyCategories: allergyCategoriesArray}, () =>
      console.log('this.state.allergyCategories', this.state.allergyCategories),
    );

    this.setSpecialAnswers();
  }

  /**
    Handler for the speacial answers (medical and product cards)
  */
  setSpecialAnswers = () => {
    try {
      setTimeout(() => {
        console.log('cwm', this.props.specialAnswers);

        if (this.props.specialAnswers !== null) {
          for (let i = 0; i < this.props.specialAnswers.length; i++) {
            if (this.props.specialAnswers[i].questionId === 1001) {
              const array = this.state.foodAllergies;
              for (
                let k = 0;
                k < this.props.specialAnswers[i].values.length;
                k++
              ) {
                for (let l = 0; l < this.state.allergyCategories.length; l++) {
                  if (
                    this.props.specialAnswers[i].values[k] ===
                    this.state.allergyCategories[l].id
                  ) {
                    array.push(this.state.allergyCategories[l]);
                  }
                }
              }
              this.setState({foodAllergies: array});
            } else if (this.props.specialAnswers[i].questionId === 1002) {
              const array = this.state.foodUnfavorite;
              for (
                let k = 0;
                k < this.props.specialAnswers[i].values.length;
                k++
              ) {
                for (let l = 0; l < this.state.allergyCategories.length; l++) {
                  if (
                    this.props.specialAnswers[i].values[k] ===
                    this.state.allergyCategories[l].id
                  ) {
                    array.push(this.state.allergyCategories[l]);
                  }
                }
              }
              this.setState({foodUnfavorite: array});
            } else if (this.props.specialAnswers[i].questionId === 1005) {
              const dataArray = this.state.medicalCardsData;
              for (
                let k = 0;
                k < this.props.specialAnswers[i].values.length;
                k++
              ) {
                const data = this.props.specialAnswers[i].values[k];
                dataArray.push({
                  condition: data.name,
                  intensity: data.intensity,
                  diagnosed: data.diagnosed_year,
                  isCured: data.cured_year,
                  id: k + 1,
                });
              }
              this.setState({medicalCardsData: dataArray});
            } else if (this.props.specialAnswers[i].questionId === 1006) {
              const dataArray = this.state.productCardsData;
              for (
                let k = 0;
                k < this.props.specialAnswers[i].values.length;
                k++
              ) {
                const data = this.props.specialAnswers[i].values[k];
                dataArray.push({
                  productName: data.name,
                  dose: data.dose,
                  frequency: data.frequency,
                  weight: data.dose_unit,
                  period: data.frequency_unit,
                  id: k + 1,
                });
              }
              this.setState({productCardsData: dataArray});
            }
          }
        }

        console.log(
          'cwm',
          this.state.medicalCardsData,
          this.state.productCardsData,
        );
      }, 1500);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    try {
      this.setState({isKeyboardOpen: true});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  _keyboardDidHide = () => {
    try {
      this.setState({isKeyboardOpen: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
     Set the answers and responses on tab switch
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.data !== nextProps.data ||
      (typeof nextProps.data[0] !== 'undefined' &&
        typeof nextProps.data[0].subCategory !== 'undefined' &&
        nextProps.data[0].subCategory === 'Skin')
    ) {
      console.log('nextProps');

      nextProps.data.map((element, index) => {
        if (typeof element.responses !== 'undefined')
          element.responses.map((innerElement, innerIndex) => {
            if (
              element.type === 'radio:image' ||
              element.type === 'radio' ||
              element.type === 'radio:freetext'
            ) {
              const activeItemName = 'radioGroup' + element.id + 'Active';

              if (!this.state.radioGroups.hasOwnProperty(activeItemName)) {
                let object = {
                  ...this.state.radioGroups,
                  ...{[activeItemName]: null},
                };

                if (
                  nextProps.answers !== null &&
                  typeof nextProps.answers[element.id] !== 'undefined' &&
                  typeof nextProps.answers[element.id][0] !== 'undefined' &&
                  typeof nextProps.answers[element.id][0].values !==
                    'undefined' &&
                  nextProps.answers[element.id][0].values.includes(
                    innerElement.value,
                  )
                ) {
                  object = {
                    ...object,
                    ...{
                      [activeItemName]:
                        nextProps.answers[element.id][0].freetext !== null
                          ? innerElement.value +
                            '---' +
                            nextProps.answers[element.id][0].freetext
                          : innerElement.value,
                    },
                  };
                }

                if (
                  nextProps.data[0].subCategory !== 'Skin' &&
                  this.state.radioGroups.hasOwnProperty('radioGroup11Active')
                ) {
                  delete object['radioGroup11Active'];
                }

                this.setState({radioGroups: object});
              } else {
              }
            }

            if (
              element.type === 'checkbox:image' ||
              element.type === 'checkbox' ||
              element.type === 'checkbox:freetext' ||
              element.type === 'checkbox:additional-options'
            ) {
              const itemName = 'checkBox_' + element.id + '_' + innerIndex;

              for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
                if (
                  this.state.checkBoxGroups[i].hasOwnProperty(itemName) &&
                  nextProps.answers !== null &&
                  typeof nextProps.answers[element.id] !== 'undefined'
                ) {
                  const answerValue = nextProps.answers[element.id];
                  for (let k = 0; k < answerValue.length; k++) {
                    if (
                      nextProps.answers[element.id][k].values.includes(
                        innerElement.value,
                      )
                    ) {
                      let value = null;
                      if (
                        element.type === 'checkbox:additional-options' &&
                        nextProps.answers !== null &&
                        nextProps.answers[element.id] !== null
                      ) {
                        value = nextProps.answers[element.id][k].values.indexOf(
                          innerElement.value,
                        );

                        if (value !== -1) {
                          if (
                            nextProps.answers[element.id][k].freetext !== null
                          ) {
                            const freetext = nextProps.answers[element.id][
                              k
                            ].freetext.split(',');
                            value = freetext[value] + '_' + innerElement.value;
                          } else {
                            value = innerElement.value;
                          }
                        }

                        this.state.checkBoxGroups[i][itemName] = value;
                      } else {
                        this.state.checkBoxGroups[i][itemName] =
                          innerElement.value;
                      }
                    }
                  }
                }
              }
            }
          });
      });

      if (this.answers === null) {
        this.answers = nextProps.answers;
      }

      this.clearErrors();
    }
  }

  /**
    Clear all error fields
  */
  clearErrors = (shouldRadioBeCleared) => {
    try {
      if (typeof shouldRadioBeCleared !== 'undefined' && shouldRadioBeCleared) {
        this.setState({errors: [], radioGroups: {}});
      } else {
        this.setState({errors: []});
      }
      console.log('errors cleared');
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Remove product card
  */
  removeProductItem = (index) => {
    try {
      const array = this.state.productCardsData;
      array.splice(index, 1);

      this.setState({
        productCardsData: array,
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Remove medical card
  */
  removeMedicalItem = (index) => {
    try {
      const array = this.state.medicalCardsData;
      array.splice(index, 1);

      this.setState({
        medicalCardsData: array,
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for for the cancer question
  */
  onSelect = (name, value, index, selectName, ilpozzo) => {
    try {
      console.log(
        'onSelect',
        name,
        value,
        index,
        selectName,
        ilpozzo,
        this.state.checkBoxGroups,
      );
      const valueSplitted = value.split('_');
      const selectSplitted = selectName.split('_');
      const values = [];
      const freeTexts = [];

      const valuesArray = [];

      const array = this.state.checkBoxGroups;
      console.log('test 234 select', name);
      array.map((data, index) => {
        let ilPozzoArray = [];
        const arrayItemName = Object.keys(array[index]).toString();

        if (data.hasOwnProperty(name)) {
          const newValue = value + '_' + ilpozzo;
          array[index] = {[name]: newValue};

          ilPozzoArray = ilPozzoArray.concat(ilpozzo);
          let vals = [];
          vals.push(selectSplitted[1]);
          vals = vals.concat(ilPozzoArray);

          valuesArray.push(vals);
          freeTexts.push(valueSplitted[0]);
        } else {
          if (
            arrayItemName.includes('checkBox_' + selectSplitted[0]) &&
            typeof array[index][arrayItemName] !== 'undefined' &&
            array[index][arrayItemName] !== null
          ) {
            const arrayValue = array[index][arrayItemName].split('_');
            console.log('onSelect arrayValue', arrayValue);

            if (typeof arrayValue[2] !== 'undefined') {
              const ilpozzoSplitted = arrayValue[2].split(',');

              for (let i = 0; i < ilpozzoSplitted.length; i++) {
                ilPozzoArray = ilPozzoArray.concat(ilpozzoSplitted[i]);
              }
            } else {
              ilPozzoArray.push('999');

              switch (arrayValue[0]) {
                case 'diagnosed and in treatment':
                  ilPozzoArray.push('995');
                  break;
                case 'diagnosed but not in treatment':
                  ilPozzoArray.push('996');
                  break;
                case 'in remission':
                  ilPozzoArray.push('997');
                  break;
                case 'cured and free from it over 5 years':
                  ilPozzoArray.push('998');
                  break;
              }
            }

            let vals = [];
            vals.push(arrayValue[1]);
            vals = vals.concat(ilPozzoArray);

            valuesArray.push(vals);
            freeTexts.push(arrayValue[0]);
          }
        }
      });

      this.setState({checkBoxGroups: array});

      if (typeof selectName !== 'undefined') {
        const array = this.state.selects;
        for (let i = 0; i < array.length; i++) {
          if (array[i].hasOwnProperty(selectName)) {
            array[i][selectName] = !array[i][selectName];

            break;
          }
        }

        this.setState({selects: array});
      }

      values.push(valuesArray);

      this.props.setAnswers(selectSplitted[0], valuesArray, freeTexts);
      console.log('onSelect', values, valuesArray, freeTexts, array, ilpozzo);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for adding or changing of the product name
  */
  onSelectProduct = (name, value, index) => {
    try {
      const array = this.state.productCardsData;
      array[index][name] = value;
      this.setState(
        {productCardsData: array},
        console.log('test data', JSON.stringify(this.state.productCardsData)),
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for adding or changing of the medical condition
  */
  onSelectConditions = (name, value, index) => {
    try {
      const array = this.state.medicalCardsData;
      array[index][name] = value;
      this.setState(
        {medicalCardsData: array},
        console.log('test data', JSON.stringify(this.state.medicalCardsData)),
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for adding or changing of the product fields
  */
  onChangeText = (name, value, index) => {
    try {
      const array = this.state.productCardsData;
      array[index][name] = value;
      this.setState(
        {productCardsData: array},
        console.log('test data', JSON.stringify(this.state.productCardsData)),
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for adding or changing of the medical fields
  */
  onChangeMedicalText = (name, value, index) => {
    try {
      const array = this.state.medicalCardsData;
      array[index][name] = value;
      this.setState(
        {medicalCardsData: array},
        console.log('test data', JSON.stringify(this.state.medicalCardsData)),
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for text inputs without radio button
  */
  setText = (name, value, index) => {
    // name === id
    try {
      const array = this.state.texts;
      array[index][name] = value;
      this.setState({texts: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for text inputs with radio button
  */
  changeRadioText = (text, name, index, id, radioText, value) => {
    try {
      console.log(
        'object.name changeRadioText',
        text,
        name,
        index,
        id,
        radioText,
      );
      this.filterCountries(text, id);

      const array = this.state.radioText;
      array[index][name] = text;
      this.setState({radioText: array});
      console.log('object.name changeRadioText array', array);

      let object = {...this.state.radioGroups};

      if (object.hasOwnProperty([name])) {
        object[name] = value + '---' + text;
      } else {
        object = {
          ...this.state.radioGroups,
          ...{[name]: value + '---' + text},
        };
      }
      this.props.setAnswers(id, [value], text);

      this.setState({radioGroups: object});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Handler for cities text inputs with radio button
  */
  changeRadioTextCities = (item, name, index, id, radioText, value) => {
    try {
      console.log(
        'object.name changeRadioTextCities',
        item,
        name,
        index,
        id,
        radioText,
      );
      this.filterCities(item.description, id);

      const array = this.state.radioText;
      array[index][name] = item.description;
      this.setState({radioText: array});
      console.log('object.name changeRadioText array', array);

      let object = {...this.state.radioGroups};

      if (object.hasOwnProperty([name])) {
        object[name] = value + '---' + item.description;
      } else {
        object = {
          ...this.state.radioGroups,
          ...{[name]: value + '---' + item.description},
        };
      }
      this.props.setAnswers(id, [value], item.description, item.place_id);

      this.setState({radioGroups: object});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  addMedicalCard = () => {
    try {
      const array = this.state.medicalCards;
      array.push(
        <View
          key={array.length + 'm'}
          style={[styles.card, {marginTop: 20, height: 361}]}>
          <FloatingLabelInput
            label="Product Name"
            value={this.state.medicalCardsData[array.length - 1].productName}
            onChangeText={(productName) =>
              this.onChangeText(productName, array.length - 1)
            }
            width={width - 86}
            marginRight={0}
            marginTop={20}
            height={56}
          />
        </View>,
      );
      this.setState({medicalCards: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  _renderItem = ({item}) => {
    console.log('test item', this.props.injuries);
    const itemName = 'checkBox_injuries' + item.id;
    const value =
      typeof this.props.answers !== 'undefined' &&
      this.props.answers !== null &&
      typeof this.props.answers[158] !== 'undefined' &&
      typeof this.props.answers[158][0] !== 'undefined' &&
      this.props.answers[158][0].values.includes(item.id.toString())
        ? true
        : null;

    if (this.state.checkBoxGroups.length === 0) {
      this.state.checkBoxGroups.push({[itemName]: value});
    } else {
      let isExists = false;
      for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
        if (this.state.checkBoxGroups[i].hasOwnProperty(itemName)) {
          isExists = true;
          break;
        }
      }
      if (!isExists) {
        this.state.checkBoxGroups.push({[itemName]: value});
      }
    }

    let checkBoxIndex;
    for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
      if (this.state.checkBoxGroups[i].hasOwnProperty(itemName)) {
        checkBoxIndex = i;
      }
    }

    const activeStyle =
      typeof this.state.checkBoxGroups[checkBoxIndex] !== 'undefined'
        ? this.state.checkBoxGroups[checkBoxIndex][
            'checkBox_injuries' + item.id
          ] === true
        : false;

    return (
      <View
        style={[
          styles.card,
          activeStyle ? styles.chosenCard : null,
          {
            width: (width - 56) / 2,
            height: 66,
            marginRight: item.id % 2 === 1 ? 16 : 20,
            marginLeft: item.id % 2 === 1 ? 20 : 0,
          },
        ]}>
        <TouchableWithoutFeedback
          onPress={() => this.setCheckboxInjuriesState(itemName, true)}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 16,
              alignItems: 'center',
              marginTop: 21,
            }}>
            <HraCheckbox
              value={this.state.checkBoxGroups[checkBoxIndex][itemName]}
            />

            <Text style={[styles.cardTitle, {marginLeft: 14}]}>
              {item.name}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  renderAllergyItem = ({item, index}) => {
    return (
      <AllergyItem
        index={index}
        item={item}
        length={this.state.allergyCategories.length}
        onAllergyItemPress={() =>
          this.onAllergyItemPress(item, 'foodAllergies')
        }
      />
    );
  };

  renderFoodItem = ({item, index}) => {
    return (
      <AllergyItem
        index={index}
        item={item}
        length={this.state.allergyCategories.length}
        onAllergyItemPress={() =>
          this.onAllergyItemPress(item, 'foodUnfavorite')
        }
      />
    );
  };

  /**
    Check all fields on the "Next" press
  */
  checkFields = () => {
    try {
      const array = [];
      this.setState({errors: array});

      console.log('checkFields this.state.radioGroups', this.state.radioGroups);
      console.log('checkFields this.props', this.props);

      Object.keys(this.state.radioGroups).map((key) => {
        let number = key.split('radioGroup');
        number = number[1].split('Active');

        if (this.state.radioGroups[key] === null) {
          array.push(Number(number[0]));
        }

        if (this.state.radioGroups[key] !== null) {
          this.props.data.map((element, index) => {
            if (element.id === Number(number[0])) {
              element.responses.map((innerElement, innerIndex) => {
                if (
                  (innerElement.responseType.isCountryPicker === true ||
                    innerElement.responseType.isCityPicker === true) &&
                  innerElement.value === this.state.radioGroups[key]
                ) {
                  for (let i = 0; i < this.state.radioText.length; i++) {
                    if (this.state.radioText[i].hasOwnProperty(key)) {
                      if (this.state.radioText[i][key] === null) {
                        array.push(number[0] + 'text');

                        break;
                      }
                    }
                  }
                }
              });
            }
          });
        }
      });

      this.props.data.map((element, index) => {
        console.log('this.errorOffset', this.errorOffset);
        if (
          typeof element !== 'undefined' &&
          typeof element.type !== 'undefined' &&
          element.type.includes('checkbox')
        ) {
          let isCheckboxSet = false;

          for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
            const propertyName = Object.keys(
              this.state.checkBoxGroups[i],
            ).toString();
            console.log('checkFields propertyName', propertyName);

            if (propertyName.includes('checkBox_' + element.id)) {
              console.log(
                'checkFields this.state.checkBoxGroups[i][propertyName[0]]',
                this.state.checkBoxGroups[i][propertyName],
              );
              if (this.state.checkBoxGroups[i][propertyName] !== null) {
                if (element.type === 'checkbox:additional-options') {
                  let isNoneResponseValue;
                  for (let k = 0; k < element.responses.length; k++) {
                    const response = element.responses[k];

                    if (response.responseType.isNoneResponse) {
                      isNoneResponseValue = response.value;
                      break;
                    }
                  }

                  if (
                    typeof this.state.checkBoxGroups[i][propertyName] !==
                      'undefined' &&
                    isNoneResponseValue !==
                      this.state.checkBoxGroups[i][propertyName] &&
                    this.state.checkBoxGroups[i][propertyName].indexOf('_') ===
                      -1
                  ) {
                    console.log('checkFields array', propertyName);
                    isCheckboxSet = false;
                    break;
                  } else {
                    isCheckboxSet = true;
                  }
                } else {
                  isCheckboxSet = true;
                  break;
                }
              }
            } else {
              continue;
            }
          }

          if (!isCheckboxSet) {
            array.push(element.id);
            console.log('checkFields array', array, this.state.checkBoxGroups);
          }
        }
      });

      array.sort((a, b) => {
        return a - b;
      });
      console.log('this.errorsExcluding', this.errorsExcluding);

      for (let i = 0; i < this.errorsExcluding.length; i++) {
        if (array.includes(this.errorsExcluding[i])) {
          const index = array.indexOf(this.errorsExcluding[i]);
          if (index !== -1) {
            array.splice(index, 1);
          }
        }
      }

      this.errorsExcluding = [];

      let isMedicalCardsError = false;
      let isSupplementsCardsError = false;
      if (
        Object.keys(this.errorOffsetMedical).length !== 0 &&
        this.state.medicalCardsData.length !== 0
      ) {
        for (let i = 0; i < this.state.medicalCardsData.length; i++) {
          if (
            this.state.medicalCardsData[i].condition === 'Please select one'
          ) {
            isMedicalCardsError = true;
            if (typeof this.scroll !== 'undefined') {
              this.scroll.scrollTo({
                x: 0,
                y:
                  this.errorOffset['1005'] +
                  this.errorOffsetMedical[this.state.medicalCardsData[i].id] +
                  100,
                animated: false,
              });
              console.log(
                'this.errorOffsetMedical',
                this.errorOffsetMedical,
                this.errorOffset['1005'] +
                  this.errorOffsetMedical[this.state.medicalCardsData[i].id],
              );
            }

            break;
          }

          if (this.state.medicalCardsData[i].intensity === '') {
            console.log(
              'this.state.medicalCardsData[i]',
              this.state.medicalCardsData[i],
            );
            isMedicalCardsError = true;
            if (typeof this.scroll !== 'undefined') {
              this.scroll.scrollTo({
                x: 0,
                y:
                  this.errorOffset['1005'] +
                  this.errorOffsetMedical[this.state.medicalCardsData[i].id] +
                  100,
                animated: false,
              });
              console.log(
                'this.errorOffsetMedical',
                this.errorOffsetMedical,
                this.errorOffset['1005'] +
                  this.errorOffsetMedical[this.state.medicalCardsData[i].id],
              );
            }

            break;
          }
        }
      }

      if (
        Object.keys(this.errorOffsetSupplements).length !== 0 &&
        this.state.productCardsData.length !== 0
      ) {
        for (let i = 0; i < this.state.productCardsData.length; i++) {
          if (this.state.productCardsData[i].productName === '') {
            isSupplementsCardsError = true;
            if (typeof this.scroll !== 'undefined') {
              this.scroll.scrollTo({
                x: 0,
                y:
                  this.errorOffset['1006'] +
                  this.errorOffsetSupplements[
                    this.state.productCardsData[i].id
                  ] +
                  100,
                animated: false,
              });
              console.log(
                'this.errorOffsetSupplements',
                this.errorOffsetSupplements,
                this.errorOffset['1006'] +
                  this.errorOffsetSupplements[
                    this.state.productCardsData[i].id
                  ],
              );
            }

            break;
          }
        }
      }

      this.setState({errors: array}, () => {
        if (
          typeof this.scroll !== 'undefined' &&
          !isMedicalCardsError &&
          !isSupplementsCardsError
        )
          this.scroll.scrollTo({
            x: 0,
            y: this.errorOffset[array[0]],
            animated: false,
          });
        console.log('errors', this.errorOffset, array[0]);
      });
      console.log('errors', array);

      if (array.length === 0) {
        if (!isMedicalCardsError && !isSupplementsCardsError) {
          if (typeof this.scroll !== 'undefined')
            this.scroll.scrollTo({x: 0, y: 0, animated: false});
          this.errorOffset = {};
          this.errorOffsetMedical = {};
          this.errorOffsetSupplements = {};
          this.props.goNext();
        }
      }

      console.log('this.additionalErrorOffset', this.additionalErrorOffset);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  isWithoutErrors = () => {
    try {
      return this.state.errors.length === 0 ? true : false;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  toggleSelect = (name) => {
    try {
      const array = this.state.selects;
      for (let i = 0; i < array.length; i++) {
        if (array[i].hasOwnProperty(name)) {
          array[i][name] = !array[i][name];

          break;
        }
      }

      this.setState({selects: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  scrollToTop = () => {
    try {
      if (typeof this.scroll !== 'undefined' && this.scroll !== null) {
        this.scroll.scrollTo({x: 0, y: 0, animated: false});
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  changeProductCard = (index, name, text) => {
    try {
      const array = this.state.productCardsData;
      array[index][name] = text;
      const selectArray = this.state.productSelects;
      selectArray[index][name] = false;

      this.setState({productCardsData: array, productSelects: selectArray});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  changeProductSelect = (index, name) => {
    try {
      const array = this.state.productSelects;
      array[index][name] = !array[index][name];

      this.setState({productSelects: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  changeMedicalCard = (index, name, text) => {
    try {
      const array = this.state.medicalCardsData;
      array[index][name] = text;

      console.log('changeMedicalCard array[index]', array[index]);
      if (
        name === 'isCured' &&
        array[index].diagnosed !== '' &&
        array[index].diagnosed !== 'Please select one' &&
        array[index][name] !== 'Not cured'
      ) {
        console.log('changeMedicalCard array[index]', array[index]);
        if (Number(array[index][name]) < array[index].diagnosed) {
          array[index][name] = 'Please select one';
        }
      }

      if (
        name === 'diagnosed' &&
        array[index][name] !== '' &&
        array[index][name] !== 'Please select one' &&
        array[index].isCured !== 'Not cured'
      ) {
        console.log('changeMedicalCard array[index]', array[index]);
        if (Number(array[index].isCured) < array[index][name]) {
          array[index].isCured = 'Please select one';
        }
      }

      const selectArray = this.state.medicalSelects;
      selectArray[index][name] = false;

      this.setState({medicalCardsData: array, medicalSelects: selectArray});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  changeMedicalSelect = (index, name) => {
    try {
      const array = this.state.medicalSelects;
      array[index][name] = !array[index][name];

      this.setState({medicalSelects: array});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  getFlagEmojiName = (name, cca2) => {
    try {
      console.log('getFlagEmojiName', cca2, name);
      let emoji = getEmoji(`:${name}:`);

      if (
        cca2 === 'GBENG' ||
        cca2 === 'GBSCT' ||
        cca2 === 'GBWLS' ||
        cca2 === 'UNKNOWN'
      ) {
        emoji = emoji.replace(/\:/g, '');
        emoji = emoji.replace('unknown', '');
      }

      console.log('getFlagEmojiName', emoji);
      return emoji;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  filterCountries = async (text, id) => {
    try {
      let countriesArray = [];

      if (text === '') {
        countriesArray = this.countries;
      } else {
        this.countries.filter((object) => {
          if (object.name.toLowerCase().includes(text.toLowerCase())) {
            countriesArray.push(object);
          }
        });
      }

      let object = {...this.state.filteredCountries2};

      if (object.hasOwnProperty([id])) {
        object[id] = countriesArray;
      } else {
        object = {
          ...this.state.filteredCountries2,
          ...{[id]: countriesArray},
        };
      }

      this.setState({filteredCountries2: object});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  filterCities = async (text, id) => {
    try {
      let citiesArray = [];

      if (text === '') {
        citiesArray = this.cities;
      } else {
        this.cities.filter((object) => {
          if (object.description.toLowerCase().includes(text.toLowerCase())) {
            citiesArray.push(object);
          }
        });
      }

      let object = {...this.state.filteredCities2};

      if (object.hasOwnProperty([id])) {
        object[id] = citiesArray;
      } else {
        object = {...this.state.filteredCities2, ...{[id]: citiesArray}};
      }

      this.setState({filteredCities2: object});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    On country item press
  */
  onItemPress = (item, stateItemName, id, value) => {
    try {
      console.log('onItemPress', item, stateItemName, id, value);
      const filter = this.state.filteredCountries2;
      filter[id] = [];

      let object = {...this.state.radioGroups};

      if (object.hasOwnProperty([stateItemName])) {
        object[stateItemName] = value + '---' + item.name;
      } else {
        object = {
          ...this.state.radioGroups,
          ...{[stateItemName]: value + '---' + item.name},
        };
      }

      console.log('onItemPress setAnswers', id, [value], item.name);
      this.props.setAnswers(id, [value], item.name);

      this.setState({radioGroups: object, filteredCountries2: filter});

      Keyboard.dismiss();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    On city item press
  */
  onCityItemPress = (item, stateItemName, id, value) => {
    try {
      console.log(
        'onItemPress',
        item,
        stateItemName,
        id,
        value,
        this.state.filteredCities2,
      );
      const filter = this.state.filteredCities2;
      filter[id] = [];

      let object = {...this.state.radioGroups};

      if (object.hasOwnProperty([stateItemName])) {
        object[stateItemName] = value + '---' + item.description;
      } else {
        object = {
          ...this.state.radioGroups,
          ...{[stateItemName]: value + '---' + item.description},
        };
      }

      console.log(
        'onItemPress setAnswers',
        id,
        [value],
        item.description,
        item,
      );
      this.props.setAnswers(id, [value], item.description, item.place_id);

      this.googlePlaces._onPress(item);

      this.setState({radioGroups: object, filteredCitites: filter}, () => {
        console.log(
          'onItemPress',
          item.description,
          stateItemName,
          id,
          value,
          this.state.filteredCities,
        );
      });

      Keyboard.dismiss();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Get the error offset for error questions
  */
  measureErrorView = (event, id) => {
    try {
      this.errorOffset = {
        ...this.errorOffset,
        ...{[id]: event.nativeEvent.layout.y},
      };
      console.log('event.nativeEvent', event.nativeEvent);
      console.log('measureErrorView', this.errorOffset);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
    Get the error offset for error questions of medical cards
  */
  measureErrorViewMedical = (event, id) => {
    try {
      this.errorOffsetMedical = {
        ...this.errorOffsetMedical,
        ...{[id]: event.nativeEvent.layout.y},
      };
      console.log('event.nativeEvent', event.nativeEvent);
      console.log('measureErrorView', this.errorOffsetMedical);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  measureErrorViewSupplements = (event, id) => {
    try {
      this.errorOffsetSupplements = {
        ...this.errorOffsetSupplements,
        ...{[id]: event.nativeEvent.layout.y},
      };
      console.log('event.nativeEvent', event.nativeEvent);
      console.log('measureErrorView', this.errorOffsetSupplements);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onCitiesChange = (citiesList, id) => {
    try {
      console.log('citiesList', citiesList);
      const obj = this.state.filteredCities2;
      obj[id] = citiesList;
      this.setState({filteredCities2: obj});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onAllergyItemPress = (item, category) => {
    try {
      let isExists = false;
      for (let i = 0; i < this.state[category].length; i++) {
        if (item.id === this.state[category][i].id) {
          isExists = true;
          break;
        }
      }

      if (!isExists) {
        this.state[category].push(item);
      }

      this.setState({[category + 'Text']: ''});

      console.log('onAllergyItemPress item', item);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  checkMedicalProductCards = () => {
    try {
      console.log(
        'medicalCardsData',
        this.state.medicalCardsData,
        this.state.productCardsData,
      );

      const medicalCardsValues = [];
      for (let i = 0; i < this.state.medicalCardsData.length; i++) {
        medicalCardsValues.push({
          name: this.state.medicalCardsData[i].condition,
          diagnosed_year: this.state.medicalCardsData[i].diagnosed,
          intensity: this.state.medicalCardsData[i].intensity,
          cured_year: this.state.medicalCardsData[i].isCured,
        });
      }

      const productCardsValues = [];
      for (let i = 0; i < this.state.productCardsData.length; i++) {
        productCardsValues.push({
          name: this.state.productCardsData[i].productName,
          dose: this.state.productCardsData[i].dose,
          dose_unit: this.state.productCardsData[i].weight,
          frequency: this.state.productCardsData[i].frequency,
          frequency_unit: this.state.productCardsData[i].period,
        });
      }

      if (medicalCardsValues.length !== 0) {
        this.props.setSpecialAnswers(1005, medicalCardsValues);
      }

      if (productCardsValues.length !== 0) {
        this.props.setSpecialAnswers(1006, productCardsValues);
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  checkFoodAllergiesPreferences = () => {
    try {
      console.log(
        'foodAllergies',
        this.state.foodAllergies,
        this.state.foodUnfavorite,
      );

      const allergiesValues = [];
      for (let i = 0; i < this.state.foodAllergies.length; i++) {
        allergiesValues.push(this.state.foodAllergies[i].id);
      }

      const unfavoriteValues = [];
      for (let i = 0; i < this.state.foodUnfavorite.length; i++) {
        unfavoriteValues.push(this.state.foodUnfavorite[i].id);
      }

      if (allergiesValues.length !== 0) {
        this.props.setSpecialAnswers(1001, allergiesValues);
      }

      if (unfavoriteValues.length !== 0) {
        this.props.setSpecialAnswers(1002, unfavoriteValues);
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    console.log('this.radioGroups', this.state.radioGroups);
    console.log('this.radioText', this.state.radioText);

    console.log('this.checkBoxGroups', this.state.checkBoxGroups);

    let activeItems = 0;

    let workoutActivities = false;

    this.props.data.map((element, index) => {
      //
      if (
        element.type === 'checkbox:image' ||
        element.type === 'checkbox' ||
        element.type === 'checkbox:freetext' ||
        element.type === 'checkbox:additional-options' ||
        element.type === 'radio:image' ||
        element.type === 'radio' ||
        element.type === 'radio:freetext'
      ) {
        element.responses.map((innerElement, innerIndex) => {
          if (
            element.type === 'checkbox:image' ||
            element.type === 'checkbox' ||
            element.type === 'checkbox:freetext' ||
            element.type === 'checkbox:additional-options'
          ) {
            const itemName = 'checkBox_' + element.id + '_' + innerIndex;

            let value = {}; //null;

            if (
              element.type === 'checkbox:additional-options' &&
              this.props.answers !== null &&
              typeof this.props.answers[element.id] !== 'undefined' &&
              this.props.answers[element.id] !== null
            ) {
              const answerValues = this.props.answers[element.id];
              console.log('answerValues', answerValues);
              for (let i = 0; i < answerValues.length; i++) {
                const index = answerValues[i].values.indexOf(
                  innerElement.value,
                );

                if (index !== -1 && answerValues[i].freetext !== null) {
                  const freetext = answerValues[i].freetext.split(',');
                  value = {
                    ...value,
                    ...{
                      [innerElement.value]:
                        freetext[value] + '_' + innerElement.value,
                    },
                  };
                }
              }
              console.log('valueindex', value);
            }

            if (
              this.state.checkBoxGroups.length === 0 &&
              this.props.answers !== null
            ) {
              if (
                typeof this.props.answers !== 'undefined' &&
                this.props.answers !== null &&
                typeof this.props.answers[element.id] !== 'undefined' &&
                typeof this.props.answers[element.id][0] !== 'undefined' &&
                typeof this.props.answers[element.id][0].values !==
                  'undefined' &&
                this.props.answers[element.id][0].values.includes(
                  innerElement.value,
                )
              ) {
                if (element.type === 'checkbox:additional-options') {
                  this.state.selects.push({
                    [itemName]: value[innerElement.value],
                  });
                  this.state.checkBoxGroups.push({
                    [itemName]: value[innerElement.value],
                  });
                } else {
                  this.state.checkBoxGroups.push({
                    [itemName]: innerElement.value,
                  });
                }
              } else {
                this.state.checkBoxGroups.push({[itemName]: null});
              }
            } else {
              let isExists = false;
              for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
                if (this.state.checkBoxGroups[i].hasOwnProperty(itemName)) {
                  if (element.type === 'checkbox:additional-options') {
                    isExists = innerElement.value; //value[innerElement.value];
                  } else {
                    isExists = innerElement.value; //true;
                  }

                  break;
                }
              }
              if (!isExists) {
                if (
                  this.props.answers !== null &&
                  typeof this.props.answers[element.id] !== 'undefined' &&
                  typeof this.props.answers[element.id][0] !== 'undefined' &&
                  this.props.answers[element.id][0].values.includes(
                    innerElement.value,
                  )
                ) {
                  if (element.type === 'checkbox:additional-options') {
                    this.state.checkBoxGroups.push({
                      [itemName]: value[innerElement.value],
                    });
                    this.state.selects.push({
                      [itemName]: value[innerElement.value],
                    });
                  } else {
                    this.state.checkBoxGroups.push({
                      [itemName]: innerElement.value,
                    });
                  }
                } else {
                  this.state.checkBoxGroups.push({[itemName]: null});
                }
              } else {
              }
            }
          } else if (
            element.type === 'radio:image' ||
            element.type === 'radio:freetext' ||
            element.type === 'radio'
          ) {
            //|| element.type === 'radio'
            const activeItemName = 'radioGroup' + element.id + 'Active';

            let object = {...this.state.radioGroups};

            if (!object.hasOwnProperty(activeItemName)) {
              object = {
                ...this.state.radioGroups,
                ...{[activeItemName]: null},
              };
              this.state.radioGroups = object;
            }

            if (this.state.radioGroups[activeItemName] === null) {
              if (
                this.props.answers !== null &&
                typeof this.props.answers[element.id] !== 'undefined' &&
                typeof this.props.answers[element.id][0] !== 'undefined' &&
                typeof this.props.answers[element.id][0].values !==
                  'undefined' &&
                this.props.answers[element.id][0].values.includes(
                  innerElement.value,
                )
              ) {
                this.state.radioGroups[activeItemName] =
                  this.props.answers[element.id][0].freetext !== null
                    ? innerElement.value +
                      '---' +
                      this.props.answers[element.id][0].freetext
                    : innerElement.value;
              }
            }
          }

          console.log('this.answers', this.answers);

          if (
            (element.type === 'checkbox:additional-options' &&
              innerElement.responseType.isFreeText === true) ||
            ((innerElement.responseType.isCountryPicker === true ||
              innerElement.responseType.isCityPicker === true) &&
              element.type !== 'radio:freetext')
          ) {
            const itemName = element.id;

            if (this.state.texts.length === 0) {
              this.state.texts.push({[itemName]: null});
            }
          }

          if (
            element.type === 'checkbox:additional-options' &&
            Array.isArray(innerElement.responseType.additionalResponses)
          ) {
            const itemName = element.id + '_' + innerElement.value;

            if (this.state.selects.length === 0) {
              this.state.selects.push({[itemName]: false});
            } else {
              let isExists = false;
              for (let i = 0; i < this.state.selects.length; i++) {
                if (this.state.selects[i].hasOwnProperty(itemName)) {
                  isExists = true; //true;
                  break;
                }
              }
              if (!isExists) {
                this.state.selects.push({[itemName]: false});
              }
            }
          }
        });
      }

      if (element.type === 'radio:freetext') {
        element.responses.map((innerElement, innerIndex) => {
          if (element.responses.length > 1) {
            const radioItemName = 'radioGroup' + element.id + 'Active';

            if (this.state.radioText.length === 0) {
              if (
                this.props.answers !== null &&
                typeof this.props.answers[element.id] !== 'undefined' &&
                this.props.answers[element.id].length !== 0 &&
                typeof this.props.answers[element.id][0] !== 'undefined' &&
                typeof this.props.answers[element.id][0].values !==
                  'undefined' &&
                this.props.answers[element.id][0].values.includes(
                  innerElement.value,
                )
              ) {
                this.state.radioText.push({
                  [radioItemName]: this.props.answers[element.id][0].freetext,
                });
              } else {
                this.state.radioText.push({[radioItemName]: null});
              }
            } else {
              let isExists = false;
              for (let i = 0; i < this.state.radioText.length; i++) {
                if (this.state.radioText[i].hasOwnProperty(radioItemName)) {
                  isExists = innerElement.value; //true;
                  break;
                }
              }
              if (!isExists) {
                if (
                  typeof this.props.answers !== 'undefined' &&
                  typeof this.props.answers[element.id] !== 'undefined' &&
                  this.props.answers !== null &&
                  typeof this.props.answers[element.id][0] !== 'undefined' &&
                  this.props.answers[element.id][0].length !== 0 &&
                  this.props.answers[element.id][0].values.includes(
                    innerElement.value,
                  )
                ) {
                  this.state.radioText.push({
                    [radioItemName]: this.props.answers[element.id][0].freetext,
                  });
                } else {
                  this.state.radioText.push({[radioItemName]: null});
                }
              }
            }
          }
        });
      }
      //
    });

    const elements = [];

    const productCards = this.state.productCardsData.map((data, index) => {
      if (
        this.state.productSelects.length === 0 ||
        this.state.productSelects.length < this.state.productCardsData.length
      ) {
        this.state.productSelects.push({weight: false, period: false}); //false
      }

      return (
        <View
          key={index}
          style={[styles.card, {marginTop: 20}]}
          onLayout={(event) => {
            this.measureErrorViewSupplements(event, data.id);
          }}>
          <FloatingLabelInput
            label="Product Name"
            value={data.productName}
            onChangeText={(productName) =>
              this.onChangeText('productName', productName, index)
            }
            width={width - 86}
            marginRight={0}
            marginTop={20}
            fontSize={15}
            height={56}
          />
          {data.productName === '' ? (
            <Text style={[styles.errorTextMultiple, {marginLeft: 20}]}>
              Please enter the product name
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 23,
              marginTop: 16,
            }}>
            <FloatingLabelInput
              label="Dose"
              value={data.dose}
              onChangeText={(dose) => this.onChangeText('dose', dose, index)}
              width={(width - 103) / 2}
              marginRight={0}
              fontSize={15}
              keyboard="numeric"
              height={56}
            />
            <View style={{width: 17}} />

            <TouchableWithoutFeedback
              onPress={() => this.changeProductSelect(index, 'weight')}>
              <View
                style={{
                  // borderWidth: 0,
                  width: (width - 103) / 2,
                  height: 56,
                  // borderRadius: 10,
                  // backgroundColor: "rgb(239,243,249)",
                  borderRadius: 4,
                  backgroundColor: 'rgb(255,255,255)',
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.ancestryText,
                    {
                      marginLeft: 14,
                      color:
                        this.state.productCardsData[index].weight === ''
                          ? 'rgba(31,33,35,0.2)'
                          : 'rgb(31,33,35)',
                    },
                  ]}>
                  {this.state.productCardsData[index].weight === ''
                    ? 'Grams'
                    : this.state.productCardsData[index].weight}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Image
              source={require('../resources/icon/arrowRight.png')}
              style={{
                position: 'absolute',
                right: 18,
                top: 22,
                width: 8,
                height: 13,
                tintColor: 'rgb(186,195,208)',
                transform: [{rotate: '90deg'}],
              }}
            />
          </View>

          {this.state.productSelects[index]['weight'] ? (
            <View
              style={[
                styles.card,
                {
                  marginTop: 0,
                  width: (width - 103) / 2,
                  alignSelf: 'flex-end',
                  marginHorizontal: 23,
                },
              ]}>
              <TouchableWithoutFeedback
                onPress={() => this.changeProductCard(index, 'weight', 'mg')}>
                <View
                  style={{
                    width: width - 239,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    mg
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.changeProductCard(index, 'weight', 'g')}>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    g
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.changeProductCard(index, 'weight', 'IU')}>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    IU
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.changeProductCard(index, 'weight', 'ml')}>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    ml
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'weight', 'drops')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    drops
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'weight', 'mcg/ug')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    mcg/ug
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.changeProductCard(index, 'weight', '%')}>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    %
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.changeProductCard(index, 'weight', 'N/A')}>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    N/A
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 23,
              marginTop: 16,
            }}>
            <FloatingLabelInput
              label="Frequency"
              value={data.frequency}
              onChangeText={(frequency) =>
                this.onChangeText('frequency', frequency, index)
              }
              width={(width - 103) / 2}
              marginRight={0}
              fontSize={15}
              keyboard="numeric"
              height={56}
            />
            <View style={{width: 17}} />

            <TouchableWithoutFeedback
              onPress={() => this.changeProductSelect(index, 'period')}>
              <View
                style={{
                  // borderWidth: 0,
                  width: (width - 103) / 2,
                  height: 56,
                  // borderRadius: 10,
                  // backgroundColor: "rgb(239,243,249)",
                  borderRadius: 4,
                  backgroundColor: 'rgb(255,255,255)',
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.ancestryText,
                    {
                      marginLeft: 14,
                      color:
                        this.state.productCardsData[index].period === ''
                          ? 'rgba(31,33,35,0.2)'
                          : 'rgb(31,33,35)',
                    },
                  ]}>
                  {this.state.productCardsData[index].period === ''
                    ? 'Weekly'
                    : this.state.productCardsData[index].period}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <Image
              source={require('../resources/icon/arrowRight.png')}
              style={{
                position: 'absolute',
                right: 18,
                top: 22,
                width: 8,
                height: 13,
                tintColor: 'rgb(186,195,208)',
                transform: [{rotate: '90deg'}],
              }}
            />
          </View>

          {this.state.productSelects[index]['period'] ? (
            <View
              style={[
                styles.card,
                {
                  marginTop: 0,
                  width: (width - 103) / 2,
                  alignSelf: 'flex-end',
                  marginHorizontal: 23,
                },
              ]}>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'period', 'hourly')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    hourly
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'period', 'daily')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    daily
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'period', 'weekly')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    weekly
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'period', 'monthly')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    monthly
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  this.changeProductCard(index, 'period', 'annually')
                }>
                <View
                  style={{
                    width: (width - 103) / 2,
                    flexWrap: 'wrap',
                    flex: 1,
                    borderBottomWidth:
                      index === this.state.productCardsData.length - 1
                        ? 0
                        : 0.5,
                    borderBottomColor: 'rgb(216,215,222)',
                  }}>
                  <Text style={[styles.selectText, {width: (width - 103) / 2}]}>
                    annually
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}

          <View
            style={{
              width: width - 40,
              height: 0.5,
              backgroundColor: 'rgb(216,215,222)',
              marginTop: 20,
            }}
          />

          <TouchableWithoutFeedback
            onPress={() => this.removeProductItem(index)}>
            <View
              style={{
                width: width - 40,
                height: 49,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../resources/icon/trash_icon_2x.png')}
                style={{
                  marginLeft: 20,
                  marginRight: 12,
                  width: 15,
                  height: 16,
                  tintColor: 'rgb(228,77,77)',
                }}
              />
              <Text
                style={[
                  styles.ancestryText,
                  {color: 'rgb(228,77,77)', marginLeft: 0},
                ]}>
                Delete
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });

    const medicalCards = this.state.medicalCardsData.map((data, index) => {
      const medicalConditions = [];

      if (medicalConditions.length === 0) {
        this.props.medicalConditions.map(
          (medicalConditionElement, medicalConditionIndex) => {
            let shouldConditionRenders = true;

            if (
              typeof medicalConditionElement.genderRestriction !==
                'undefined' &&
              (medicalConditionElement.genderRestriction.male !== false ||
                medicalConditionElement.genderRestriction.female !== false)
            ) {
              if (
                this.props.gender === 'Male' &&
                medicalConditionElement.genderRestriction.female
              ) {
                shouldConditionRenders = false;
              }

              if (
                this.props.gender === 'Female' &&
                medicalConditionElement.genderRestriction.male
              ) {
                shouldConditionRenders = false;
              }
            }

            if (shouldConditionRenders)
              medicalConditions.push(
                <TouchableWithoutFeedback
                  key={medicalConditionIndex}
                  onPress={() =>
                    this.changeMedicalCard(
                      index,
                      'condition',
                      medicalConditionElement.name,
                    )
                  }>
                  <View
                    style={{
                      width: width - 86,
                      borderBottomWidth:
                        medicalConditionIndex ===
                        this.props.medicalConditions.length - 1
                          ? 0
                          : 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <Text style={[styles.selectText, {width: width - 86}]}>
                      {medicalConditionElement.name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>,
              );
          },
        );
      }

      if (
        this.state.medicalSelects.length === 0 ||
        this.state.medicalSelects.length < this.state.medicalCardsData.length
      ) {
        this.state.medicalSelects.push({
          condition: false,
          diagnosed: false,
          isCured: false,
        }); //false
      }

      const yearsCured = ['Not cured'];
      const yearsDiagnosed = [];
      if (this.props.birthYear !== null) {
        const todayYear = new Date().getFullYear();
        const diff = todayYear - this.props.birthYear + 1;

        for (let i = 0; i < diff; i++) {
          yearsDiagnosed.push(todayYear - i);
        }

        if (
          this.state.medicalCardsData[index]['diagnosed'] !==
          'Please select one'
        ) {
          const diff =
            todayYear - this.state.medicalCardsData[index]['diagnosed'] + 1;
          console.log(
            'this.state.medicalSelects[index][diagnosed]',
            diff,
            this.state.medicalCardsData[index]['diagnosed'],
          );
          for (let i = 0; i < diff; i++) {
            yearsCured.push(todayYear - i);
          }
        } else {
          for (let i = 0; i < diff; i++) {
            yearsCured.push(todayYear - i);
          }
        }
      }

      return (
        <View
          key={index}
          style={[styles.card, {marginTop: 20}]}
          onLayout={(event) => {
            this.measureErrorViewMedical(event, data.id);
          }}>
          <View
            style={{
              width: width - 86,
              marginTop: 20,
              height: 56,
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.changeMedicalSelect(index, 'condition')}>
              <View
                style={{
                  // borderWidth: 0,
                  width: width - 86,
                  height: 56,
                  // borderRadius: 10,
                  // backgroundColor: "rgb(239,243,249)",
                  borderRadius: 4,
                  backgroundColor: 'rgb(255,255,255)',
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.ancestryText,
                    {
                      marginLeft: 14,
                      marginTop: 17,
                      color:
                        this.state.medicalCardsData[index].condition === ''
                          ? 'rgba(31,33,35,0.2)'
                          : 'rgb(31,33,35)',
                    },
                  ]}>
                  {this.state.medicalCardsData[index].condition ===
                  'Please select one'
                    ? 'Please select one'
                    : this.state.medicalCardsData[index].condition}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <Image
              source={require('../resources/icon/arrowRight.png')}
              style={styles.selectArrowDown}
            />
            <Text style={styles.placeholderText}>Condition</Text>
          </View>

          {this.state.medicalSelects[index]['condition'] ? (
            <View
              style={[
                styles.card,
                {marginTop: 0, width: width - 86, marginHorizontal: 23},
              ]}>
              {medicalConditions}
            </View>
          ) : null}
          {data.condition === 'Please select one' ? (
            <Text style={[styles.errorTextMultiple, {marginLeft: 20}]}>
              Please enter the condition
            </Text>
          ) : null}

          <FloatingLabelInput
            label="Intensity"
            value={data.intensity}
            onChangeText={(intensity) =>
              this.onChangeMedicalText('intensity', intensity, index)
            }
            width={width - 86}
            marginRight={0}
            marginTop={16}
            fontSize={15}
            height={56}
          />
          {data.intensity === '' ? (
            <Text style={[styles.errorTextMultiple, {marginLeft: 20}]}>
              Please enter the intensity
            </Text>
          ) : null}

          <View
            style={{
              width: width - 86,
              marginTop: 16,
              height: 56,
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.changeMedicalSelect(index, 'diagnosed')}>
              <View
                style={{
                  // borderWidth: 0,
                  width: width - 86,
                  height: 56,
                  // borderRadius: 10,
                  // backgroundColor: "rgb(239,243,249)",
                  borderRadius: 4,
                  backgroundColor: 'rgb(255,255,255)',
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.ancestryText,
                    {
                      marginLeft: 14,
                      marginTop: 17,
                      color:
                        this.state.medicalCardsData[index].diagnosed === ''
                          ? 'rgba(31,33,35,0.2)'
                          : 'rgb(31,33,35)',
                    },
                  ]}>
                  {this.state.medicalCardsData[index].diagnosed ===
                  'Please select one'
                    ? 'Please select one'
                    : this.state.medicalCardsData[index].diagnosed}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <Image
              source={require('../resources/icon/arrowRight.png')}
              style={styles.selectArrowDown}
            />
            <Text style={styles.placeholderText}>Started/Diagnosed</Text>
          </View>

          {this.state.medicalSelects[index]['diagnosed'] ? (
            <View
              style={[
                styles.card,
                {marginTop: 0, width: width - 86, marginHorizontal: 23},
              ]}>
              {yearsDiagnosed.map((item, index1) => (
                <TouchableWithoutFeedback
                  key={index1}
                  onPress={() =>
                    this.changeMedicalCard(index, 'diagnosed', item.toString())
                  }>
                  <View
                    style={{
                      width: width - 86,
                      borderBottomWidth:
                        index1 === yearsDiagnosed.length - 1 ? 0 : 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <Text style={[styles.selectText, {width: width - 86}]}>
                      {item}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          ) : null}

          <View
            style={{
              width: width - 86,
              marginTop: 16,
              height: 56,
              alignSelf: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.changeMedicalSelect(index, 'isCured')}>
              <View
                style={{
                  // borderWidth: 0,
                  width: width - 86,
                  height: 56,
                  // borderRadius: 10,
                  // backgroundColor: "rgb(239,243,249)",
                  borderRadius: 4,
                  backgroundColor: 'rgb(255,255,255)',
                  borderWidth: 1,
                  borderColor: 'rgb(221,224,228)',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.ancestryText,
                    {
                      marginLeft: 14,
                      marginTop: 17,
                      color:
                        this.state.medicalCardsData[index].isCured === ''
                          ? 'rgba(31,33,35,0.2)'
                          : 'rgb(31,33,35)',
                    },
                  ]}>
                  {this.state.medicalCardsData[index].isCured ===
                  'Please select one'
                    ? 'Please select one'
                    : this.state.medicalCardsData[index].isCured}
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <Image
              source={require('../resources/icon/arrowRight.png')}
              style={styles.selectArrowDown}
            />
            <Text style={styles.placeholderText}>If Cured</Text>
          </View>

          {this.state.medicalSelects[index]['isCured'] ? (
            <View
              style={[
                styles.card,
                {marginTop: 0, width: width - 86, marginHorizontal: 23},
              ]}>
              {yearsCured.map((item, index1) => (
                <TouchableWithoutFeedback
                  key={index1}
                  onPress={() =>
                    this.changeMedicalCard(index, 'isCured', item.toString())
                  }>
                  <View
                    style={{
                      width: width - 86,
                      borderBottomWidth:
                        index1 === yearsCured.length - 1 ? 0 : 0.5,
                      borderBottomColor: 'rgb(216,215,222)',
                    }}>
                    <Text style={[styles.selectText, {width: width - 86}]}>
                      {item}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          ) : null}

          <View
            style={{
              width: width - 40,
              height: 0.5,
              backgroundColor: 'rgb(216,215,222)',
              marginTop: 20,
            }}
          />

          <TouchableWithoutFeedback
            onPress={() => this.removeMedicalItem(index)}>
            <View
              style={{
                width: width - 40,
                height: 49,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../resources/icon/trash_icon_2x.png')}
                style={{
                  marginLeft: 20,
                  marginRight: 12,
                  width: 15,
                  height: 16,
                  tintColor: 'rgb(228,77,77)',
                }}
              />
              <Text
                style={[
                  styles.ancestryText,
                  {color: 'rgb(228,77,77)', marginLeft: 0},
                ]}>
                Delete
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    });

    let flag = false;
    this.props.data.map((element, index) => {
      let shouldQuestionRenders = true;

      if (
        typeof element.genderRestriction !== 'undefined' &&
        (element.genderRestriction.male !== false ||
          element.genderRestriction.female !== false)
      ) {
        if (this.props.gender === 'Male' && element.genderRestriction.female) {
          shouldQuestionRenders = false;
        }

        if (this.props.gender === 'Female' && element.genderRestriction.male) {
          shouldQuestionRenders = false;
        }
      }

      if (
        typeof element.overrides !== 'undefined' &&
        element.overrides.hiddenByOtherResponses !== null &&
        element.overrides.hiddenByOtherResponses.length !== 0
      ) {
        for (
          let i = 0;
          i < element.overrides.hiddenByOtherResponses.length;
          i++
        ) {
          const value = element.overrides.hiddenByOtherResponses[i].toString();

          let isExistsInState = false;
          // radio
          if (Object.keys(this.state.radioGroups).length !== 0)
            Object.keys(this.state.radioGroups).map((key) => {
              if (!isExistsInState) {
                if (this.state.radioGroups[key] === value) {
                  isExistsInState = true;
                }
              }
              console.log(
                'isExistsInState',
                isExistsInState,
                this.state.radioGroups,
              );
            });

          // checkbox
          if (!isExistsInState && this.state.checkBoxGroups.length !== 0) {
            for (let k = 0; k < this.state.checkBoxGroups.length; k++) {
              const name = Object.keys(this.state.checkBoxGroups[k]).toString();
              if (this.state.checkBoxGroups[k][name] === value) {
                isExistsInState = true;
                break;
              }
            }
          }

          if (isExistsInState) {
            shouldQuestionRenders = false;

            if (element.type.includes('radio')) {
              if (Object.keys(this.state.radioGroups).length !== 0) {
                this.props.deleteAnswer(element.id);
                delete this.state.radioGroups[
                  'radioGroup' + element.id + 'Active'
                ];
                console.log(
                  'isExistsInState this.state.radioGroups',
                  this.state.radioGroups['radioGroup' + element.id + 'Active'],
                );
              }
            } else if (
              element.type === 'checkbox:image' ||
              element.type === 'checkbox' ||
              element.type === 'checkbox:freetext' ||
              element.type === 'checkbox:additional-options'
            ) {
              if (this.state.checkBoxGroups.length !== 0) {
                if (
                  this.errorsExcluding.length === 0 ||
                  !this.errorsExcluding.includes(element.id)
                )
                  this.errorsExcluding.push(element.id);

                for (let k = 0; k < this.state.checkBoxGroups.length; k++) {
                  const name = Object.keys(
                    this.state.checkBoxGroups[k],
                  ).toString();

                  if (name.includes('checkBox_' + element.id)) {
                    console.log('this.state.checkBoxGroups[k] name', name);
                    if (
                      this.state.checkBoxGroups[k] !== null &&
                      this.state.checkBoxGroups[k][name] !== null
                    ) {
                      this.state.checkBoxGroups[k][name] = null;
                    }
                  }
                }

                console.log(
                  'shouldQuestionRenders this.state.checkBoxGroups',
                  this.state.checkBoxGroups,
                );
              }
            }

            break;
          }
        }
        console.log(
          'isExistsInState shouldQuestionRenders',
          shouldQuestionRenders,
        );
      }

      let marginTop = index === 0 || flag ? 30 : 50;
      if (index === 0 && typeof element.text === 'undefined') {
        flag = true;
      } else {
        flag = false;
      }
      let errorIndex =
        this.state.errors.indexOf(element.id) !== -1
          ? this.state.errors.indexOf(element.id)
          : this.state.errors.indexOf(element.id + 'text');

      if (workoutActivities) {
        marginTop = 0;
      }

      if (typeof element.type !== 'undefined' && shouldQuestionRenders) {
        elements.push(
          <Animatable.View
            animation="fadeIn"
            duration={1500}
            key={element.id}
            onLayout={(event) => {
              this.measureErrorView(event, element.id);
            }}>
            {errorIndex !== -1 ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../resources/icon/warning_icon.png')}
                  style={{width: 18, height: 18, marginLeft: 20}}
                />
                <Text
                  key={element.text}
                  style={[
                    styles.title,
                    {
                      marginHorizontal: 0,
                      marginLeft: 10,
                      marginTop: 0,
                      width: width - 68,
                    },
                  ]}>
                  {element.text}
                </Text>
              </View>
            ) : (
              <Text key={element.text} style={[styles.title, {marginTop}]}>
                {element.text}
              </Text>
            )}

            {element.helpText !== null ? (
              <Text key={element.helpText} style={styles.text}>
                {element.helpText}
              </Text>
            ) : null}

            {/*<View style={styles.line} /> */}
          </Animatable.View>,
        );
      }

      workoutActivities = false;

      if (
        element.type === 'special:medical-conditions' ||
        element.type === 'special:medications-supplements'
      ) {
        const type =
          element.type === 'special:medical-conditions' ? true : false;

        if (type) {
          elements.push(
            <View key={element.type + this.state.medicalCards.length}>
              {medicalCards}

              <TouchableWithoutFeedback
                onPress={() => {
                  const dataArray = this.state.medicalCardsData;
                  dataArray.push({
                    condition: 'Please select one',
                    intensity: '',
                    diagnosed: 'Please select one',
                    isCured: 'Please select one',
                    id: dataArray.length + 1,
                  });
                  this.setState({medicalCardsData: dataArray});
                }}>
                <View style={styles.additionalButton}>
                  <Text style={styles.additionalButtonText}>Add New</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>,
          );
        } else {
          elements.push(
            <View key={element.type + this.state.productCards.length}>
              {productCards}

              <TouchableWithoutFeedback
                onPress={() => {
                  const dataArray = this.state.productCardsData;
                  dataArray.push({
                    productName: '',
                    dose: '',
                    frequency: '',
                    weight: '',
                    period: '',
                    id: dataArray.length + 1,
                  });
                  this.setState({productCardsData: dataArray});
                }}>
                <View style={styles.additionalButton}>
                  <Text style={styles.additionalButtonText}>Add New</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>,
          );
        }
      } else {
        if (
          element.type !== 'special:workout-activities' &&
          element.type !== 'special:food-allergies' &&
          element.type !== 'special:food-dislikes'
        ) {
          element.responses.map((innerElement, innerIndex) => {
            const marginTop = innerIndex === 0 ? 20 : 16;
            const arrayName = 'radioGroup' + index;
            let isError = false;

            for (let i = 0; i < this.state.errors.length; i++) {
              if (
                this.state.errors[i] === element.id ||
                this.state.errors[i] === element.id + 'text'
              ) {
                isError = true;
              }
            }

            let checkBoxIndex;

            let responseType = '';
            let responseAction;

            if (
              element.type === 'radio:image' ||
              element.type === 'radio' ||
              element.type === 'radio:freetext'
            ) {
              const activeItemName = 'radioGroup' + element.id + 'Active';

              value = innerElement.value;

              responseAction = () => {
                this.setRadioState(
                  activeItemName,
                  innerElement.value,
                  index,
                  element.id,
                  innerElement.responseType.isCountryPicker === true ||
                    innerElement.responseType.isCityPicker === true,
                );
              };
              responseType = (
                <HraRadio
                  radioGroup={arrayName}
                  value={value}
                  activeItem={this.state.radioGroups[activeItemName]}
                  onPress={() =>
                    this.setRadioState(
                      activeItemName,
                      innerElement.value,
                      index,
                      element.id,
                      innerElement.responseType.isCountryPicker === true ||
                        innerElement.responseType.isCityPicker === true,
                    )
                  }
                />
              );
            } else if (
              element.type === 'checkbox:image' ||
              element.type === 'checkbox' ||
              element.type === 'checkbox:freetext' ||
              element.type === 'checkbox:additional-options'
            ) {
              const itemName = 'checkBox_' + element.id + '_' + innerIndex;

              for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
                if (this.state.checkBoxGroups[i].hasOwnProperty(itemName)) {
                  checkBoxIndex = i;
                }
              }

              responseAction = () => {
                this.setCheckboxState(
                  itemName,
                  innerElement.value,
                  innerElement.overrides,
                  innerElement.responseType,
                );
              };
              responseType = (
                <HraCheckbox
                  value={this.state.checkBoxGroups[checkBoxIndex][itemName]}
                />
              );
            }

            const activeItemName =
              typeof this.state.radioGroups[
                'radioGroup' + element.id + 'Active'
              ] !== 'undefined' &&
              this.state.radioGroups['radioGroup' + element.id + 'Active'] !==
                null &&
              this.state.radioGroups[
                'radioGroup' + element.id + 'Active'
              ].startsWith(innerElement.value); //index
            const itemName =
              typeof this.state.checkBoxGroups[checkBoxIndex] !== 'undefined'
                ? this.state.checkBoxGroups[checkBoxIndex][
                    'checkBox_' + element.id + '_' + innerIndex
                  ] !== null
                : false;
            const withoutImage =
              innerElement.image ===
                'https://d3ekbpzfcsh9dp.cloudfront.net/images/head/none.png' ||
              innerElement.image ===
                'https://d3ekbpzfcsh9dp.cloudfront.net/images/head/';
            let height =
              withoutImage &&
              innerElement.helpText === null &&
              innerElement.responseType.isCountryPicker === true
                ? 84
                : withoutImage &&
                  innerElement.helpText === null &&
                  innerElement.responseType.isFreeText === false
                ? 64
                : withoutImage &&
                  innerElement.helpText === null &&
                  innerElement.responseType.isFreeText === true
                ? 123
                : null;

            const additionalResponses = [];
            const addResponses = [];

            let additionalResponsesIndex = -1;
            let selectIndex = -1;

            if (element.type === 'checkbox:additional-options') {
              for (let i = 0; i < this.state.selects.length; i++) {
                if (
                  this.state.selects[i].hasOwnProperty(
                    element.id + '_' + innerElement.value,
                  )
                ) {
                  selectIndex = i;

                  break;
                }
              }

              if (
                Array.isArray(innerElement.responseType.additionalResponses)
              ) {
                for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
                  if (
                    this.state.checkBoxGroups[i].hasOwnProperty(
                      'checkBox_' + element.id + '_' + innerIndex,
                    )
                  ) {
                    additionalResponsesIndex = i;

                    break;
                  }
                }

                innerElement.responseType.additionalResponses.map(
                  (additionalElement, additionalIndex) => {
                    additionalResponses.push(
                      <Option
                        key={additionalIndex + additionalElement.title}
                        value={additionalElement.title}>
                        {additionalElement.title}
                      </Option>,
                    );

                    addResponses.push(
                      <TouchableWithoutFeedback
                        key={additionalIndex + additionalElement.title}
                        onPress={() =>
                          this.onSelect(
                            'checkBox_' + element.id + '_' + innerIndex,
                            additionalElement.title + '_' + innerElement.value,
                            index,
                            element.id + '_' + innerElement.value,
                            additionalElement.ilpozzo,
                          )
                        }>
                        <View
                          style={{
                            width: width - 115,
                            flexWrap: 'wrap',
                            flex: 1,
                            borderBottomWidth:
                              additionalIndex ===
                              innerElement.responseType.additionalResponses
                                .length -
                                1
                                ? 0
                                : 0.5,
                            borderBottomColor: 'rgb(216,215,222)',
                          }}>
                          <Text
                            style={[styles.selectText, {width: width - 131}]}>
                            {additionalElement.title}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>,
                    );
                  },
                );
              }
            }

            if (typeof element.type !== 'undefined') {
              const radioItemName = 'radioGroup' + element.id + 'Active'; //radioText

              let textInputIndex;

              for (let i = 0; i < this.state.texts.length; i++) {
                if (this.state.texts[i].hasOwnProperty(element.id)) {
                  textInputIndex = i;

                  break;
                }
              }

              const radioText =
                typeof this.state.radioGroups[radioItemName] !== 'undefined' &&
                this.state.radioGroups[radioItemName] !== null
                  ? this.state.radioGroups[radioItemName].split('---')
                  : '';

              if (activeItemName || itemName) {
                activeItems += 1;
                console.log('activeItems', activeItems);
              }

              let shouldRender = true;
              const ind = this.state.checkBoxGroups.findIndex(
                (x) => x['checkBox_164_0'] === '-480',
              );
              console.log('checkBox_164_0 index', ind);
              if (ind === -1) {
                shouldRender = true;
              } else {
                const checkBoxItem =
                  'checkBox_' + element.id + '_' + innerIndex;
                console.log('checkBoxItem', checkBoxItem);
                if (checkBoxItem === 'checkBox_164_0') {
                  shouldRender = true;
                }

                if (
                  typeof checkBoxItem === 'string' &&
                  checkBoxItem.includes('checkBox_164_') &&
                  checkBoxItem !== 'checkBox_164_0' &&
                  this.state.checkBoxGroups[ind]['checkBox_164_0'] === '-480'
                ) {
                  shouldRender = false;
                }
              }

              if (
                innerElement.genderRestriction.male !== false ||
                innerElement.genderRestriction.female !== false
              ) {
                if (
                  this.props.gender === 'Male' &&
                  innerElement.genderRestriction.female
                ) {
                  shouldRender = false;
                }

                if (
                  this.props.gender === 'Female' &&
                  innerElement.genderRestriction.male
                ) {
                  shouldRender = false;
                }
              }

              if (innerElement.overrides.hiddenByOtherResponses !== null) {
                for (let i = 0; i < this.state.checkBoxGroups.length; i++) {
                  const name = Object.keys(
                    this.state.checkBoxGroups[i],
                  ).toString();
                  console.log(
                    'checkbox123',
                    name,
                    innerElement.overrides.hiddenByOtherResponses,
                    this.state.checkBoxGroups[i][name],
                  );
                  if (
                    innerElement.overrides.hiddenByOtherResponses.indexOf(
                      Number(this.state.checkBoxGroups[i][name]),
                    ) !== -1
                  ) {
                    shouldRender = false;
                    break;
                  }
                }

                if (shouldRender)
                  Object.keys(this.state.radioGroups).map((key) => {
                    if (
                      innerElement.overrides.hiddenByOtherResponses.indexOf(
                        Number(this.state.radioGroups[key]),
                      ) !== -1
                    ) {
                      shouldRender = false;
                    }
                  });
              }

              console.log('itemName', itemName);
              let imageUrl = innerElement.image;
              if (imageUrl.includes('?v1')) {
              } else {
                imageUrl += '?v1';
              }

              if (shouldRender && shouldQuestionRenders)
                elements.push(
                  <TouchableWithoutFeedback
                    key={innerElement.value + innerElement.text}
                    onPress={responseAction}>
                    <Animatable.View
                      animation="fadeIn"
                      duration={1500}
                      key={innerElement.value + innerElement.text}
                      style={[
                        styles.card,
                        activeItemName || itemName ? styles.chosenCard : null,
                        isError ? styles.errorCard : null,
                        {
                          marginTop,
                          minHeight:
                            element.type === 'radio:freetext' ? 87 : height,
                          justifyContent: withoutImage ? 'center' : null,
                          flex: 1,
                        },
                      ]}>
                      {innerElement.responseType.isCountryPicker === true ||
                      innerElement.responseType.isCityPicker === true ? (
                        <View>
                          {element.type === 'radio:freetext' ? (
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  // alignItems: "center",
                                  paddingLeft:
                                    element.responses.length === 1 ? 0 : 16,
                                }}>
                                <View
                                  style={{
                                    marginTop:
                                      element.responses.length > 1 ? 31 : 0,
                                  }}>
                                  {element.responses.length > 1
                                    ? responseType
                                    : null}
                                </View>

                                {innerElement.responseType.isCountryPicker ? (
                                  <View
                                    style={[
                                      styles.ancestryInput,
                                      {
                                        marginLeft:
                                          element.responses.length === 1
                                            ? 23
                                            : 14,
                                        width:
                                          element.responses.length === 1
                                            ? width - 86
                                            : width - 115,
                                        overflow: 'visible',
                                      },
                                    ]}>
                                    <TextInput
                                      style={styles.ancestryText}
                                      placeholder={
                                        innerElement.responseType
                                          .isCountryPicker
                                          ? 'Enter a country…'
                                          : 'Enter a city…'
                                      }
                                      value={radioText[1]}
                                      onChangeText={
                                        element.responses.length > 1
                                          ? (text) =>
                                              this.changeRadioText(
                                                text,
                                                radioItemName,
                                                index,
                                                element.id,
                                                radioText,
                                                innerElement.value,
                                              )
                                          : (text) =>
                                              this.setRadioState(
                                                radioItemName,
                                                text,
                                                index,
                                                element.id,
                                                radioText,
                                              )
                                      }
                                    />
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      marginTop: 20,
                                      marginBottom: 23,
                                      // height: 44,
                                      // borderRadius: 4,
                                      // borderWidth: 1,
                                      // borderColor: "rgb(221,224,248)",
                                      width: width - 115,
                                    }}>
                                    <GooglePlacesAutocomplete
                                      ref={(ref) => (this.googlePlaces = ref)}
                                      placeholder="Enter a city…"
                                      minLength={1} // minimum length of text to search
                                      autoFocus={false}
                                      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                      fetchDetails={false}
                                      onTextChange={(text) =>
                                        this.onCitiesChange(text, element.id)
                                      }
                                      onPress={(data) => {
                                        // 'details' is provided when fetchDetails = true
                                        // console.log(
                                        //   "data.description",
                                        //   data.description,
                                        //   this.googlePlaces.getDataSource()
                                        // );

                                        this.changeRadioTextCities(
                                          data,
                                          radioItemName,
                                          index,
                                          element.id,
                                          radioText,
                                          innerElement.value,
                                        );
                                      }}
                                      getDefaultValue={() =>
                                        radioText[1] !== '' ? radioText[1] : ''
                                      }
                                      query={{
                                        key: PLACE_ID_API_KEY,
                                        language: 'en', // language of the results
                                        types: '(cities)', // default: 'geocode'
                                      }}
                                      styles={{
                                        textInputContainer: [
                                          styles.textInputContainer,
                                          {
                                            borderTopWidth: 0.5,
                                            borderTopColor: 'rgb(221,224,228)',
                                          },
                                        ],
                                        textInput: styles.textInput,
                                        description: styles.description,
                                        predefinedPlacesDescription:
                                          styles.selectText,
                                        separator: [
                                          styles.separator,
                                          {
                                            alignSelf: 'flex-start',
                                            marginLeft: 20,
                                          },
                                        ],
                                        row: styles.row,
                                      }}
                                      currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                      nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                      GoogleReverseGeocodingQuery={
                                        {
                                          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                        }
                                      }
                                      keyboardShouldPersistTaps="handled"
                                      enablePoweredByContainer={false}
                                      filterReverseGeocodingByTypes={[
                                        'locality',
                                        'administrative_area_level_3',
                                      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                      listViewDisplayed={false}
                                      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                    />
                                  </View>
                                )}
                              </View>

                              {innerElement.responseType.isCityPicker &&
                                typeof this.state.filteredCities2[
                                  element.id
                                ] !== 'undefined' &&
                                this.state.filteredCities2[element.id]
                                  .length !== 0 && (
                                  <View
                                    styles={{
                                      marginTop: 0,
                                      height: 205,
                                      width: width - 115,
                                      elevation: 0,
                                      borderWidth: 1,
                                      borderColor: 'rgb(221,224,228)',
                                    }}>
                                    <ScrollView
                                      nestedScrollEnabled={true}
                                      keyboardShouldPersistTaps="always">
                                      {this.state.filteredCities2[
                                        element.id
                                      ].map((item, index) => (
                                        <TouchableWithoutFeedback
                                          key={index}
                                          onPress={() =>
                                            this.onCityItemPress(
                                              item,
                                              radioItemName,
                                              element.id,
                                              innerElement.value,
                                            )
                                          }>
                                          <View style={{overflow: 'hidden'}}>
                                            <View
                                              style={{
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                marginTop:
                                                  index === 0 ? 20 : 14,
                                                marginHorizontal: 16,
                                              }}>
                                              {Platform.OS === 'ios' ? (
                                                <Text
                                                  style={[
                                                    styles.text,
                                                    {
                                                      marginHorizontal: 0,
                                                      marginBottom:
                                                        this.state
                                                          .filteredCities2[
                                                          element.id
                                                        ].length -
                                                          1 !==
                                                        index
                                                          ? 0
                                                          : 19,
                                                    },
                                                  ]}>
                                                  {'   ' + item.description}
                                                </Text>
                                              ) : (
                                                <View
                                                  style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                  }}>
                                                  <Text
                                                    style={[
                                                      styles.text,
                                                      {
                                                        marginHorizontal: 0,
                                                        marginTop: 0,
                                                        marginBottom:
                                                          this.state
                                                            .filteredCities2[
                                                            element.id
                                                          ].length -
                                                            1 !==
                                                          index
                                                            ? 0
                                                            : 19,
                                                      },
                                                    ]}>
                                                    {'   ' + item.description}
                                                  </Text>
                                                </View>
                                              )}

                                              {this.state.filteredCities2[
                                                element.id
                                              ].length -
                                                1 !==
                                                index && (
                                                <View
                                                  style={{
                                                    marginTop: 15,
                                                    width: width - 115,
                                                    alignSelf: 'center',
                                                    height: 0.5,
                                                    backgroundColor:
                                                      'rgb(216,215,222)',
                                                  }}
                                                />
                                              )}
                                            </View>
                                          </View>
                                        </TouchableWithoutFeedback>
                                      ))}
                                    </ScrollView>
                                  </View>
                                )}

                              {innerElement.responseType.isCountryPicker &&
                              typeof this.state.filteredCountries2[
                                element.id
                              ] !== 'undefined' &&
                              this.state.filteredCountries2[element.id]
                                .length !== 0 &&
                              this.state.radioGroups[radioItemName] !== '' &&
                              this.state.isKeyboardOpen ? (
                                <View
                                  styles={{
                                    marginTop: 0,
                                    height: 205,
                                    width: width - 40,
                                    elevation: 0,
                                    backgroundColor: 'green',
                                  }}>
                                  <ScrollView
                                    nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps="always"
                                    style={{
                                      height: 205,
                                      overflow: 'hidden',
                                      shadowOpacity: 0,
                                    }}>
                                    {this.state.filteredCountries2[
                                      element.id
                                    ].map((item, index) => (
                                      <TouchableWithoutFeedback
                                        key={index}
                                        onPress={() =>
                                          this.onItemPress(
                                            item,
                                            radioItemName,
                                            element.id,
                                            innerElement.value,
                                          )
                                        }>
                                        <View style={{overflow: 'hidden'}}>
                                          <View
                                            style={{
                                              justifyContent: 'center',
                                              overflow: 'hidden',
                                              marginTop: index === 0 ? 20 : 14,
                                              marginHorizontal: 16,
                                            }}>
                                            {Platform.OS === 'ios' ? (
                                              <Text
                                                style={[
                                                  styles.text,
                                                  {
                                                    marginHorizontal: 0,
                                                    marginBottom:
                                                      this.state
                                                        .filteredCountries2[
                                                        element.id
                                                      ].length -
                                                        1 !==
                                                      index
                                                        ? 0
                                                        : 19,
                                                  },
                                                ]}>
                                                {this.getFlagEmojiName(
                                                  item.flag,
                                                  item.cca2,
                                                ) +
                                                  '   ' +
                                                  item.name}
                                              </Text>
                                            ) : (
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  alignItems: 'center',
                                                }}>
                                                <Image
                                                  style={[
                                                    styles.flag,
                                                    {
                                                      marginBottom:
                                                        this.state
                                                          .filteredCountries2[
                                                          element.id
                                                        ].length -
                                                          1 !==
                                                        index
                                                          ? 0
                                                          : 19,
                                                    },
                                                  ]}
                                                  source={{
                                                    uri: 'ic_list_' + item.cca2,
                                                  }}
                                                />
                                                <Text
                                                  style={[
                                                    styles.text,
                                                    {
                                                      marginHorizontal: 0,
                                                      marginTop: 0,
                                                      marginBottom:
                                                        this.state
                                                          .filteredCountries2[
                                                          element.id
                                                        ].length -
                                                          1 !==
                                                        index
                                                          ? 0
                                                          : 19,
                                                    },
                                                  ]}>
                                                  {'   ' + item.name}
                                                </Text>
                                              </View>
                                            )}

                                            {this.state.filteredCountries2[
                                              element.id
                                            ].length -
                                              1 !==
                                              index && (
                                              <View
                                                style={{
                                                  marginTop: 15,
                                                  width: width - 72,
                                                  height: 0.5,
                                                  backgroundColor:
                                                    'rgb(216,215,222)',
                                                }}
                                              />
                                            )}
                                          </View>
                                        </View>
                                      </TouchableWithoutFeedback>
                                    ))}
                                  </ScrollView>
                                </View>
                              ) : null}
                            </View>
                          ) : (
                            <View>
                              {innerElement.responseType.isCountryPicker ? (
                                <View
                                  style={[
                                    styles.ancestryInput,
                                    {overflow: 'visible'},
                                  ]}>
                                  <TextInput
                                    style={styles.ancestryText}
                                    value={
                                      this.state.texts[textInputIndex][
                                        element.id
                                      ]
                                    }
                                    placeholder={
                                      innerElement.responseType.isCountryPicker
                                        ? 'Enter a country…'
                                        : 'Enter a city…'
                                    }
                                    onChangeText={(text) =>
                                      this.setText(
                                        element.id,
                                        text,
                                        textInputIndex,
                                      )
                                    }
                                  />
                                </View>
                              ) : (
                                <View
                                  style={{
                                    marginTop: 20,
                                    marginBottom: 23,
                                    // height: 44,
                                    // borderRadius: 4,
                                    // borderWidth: 1,
                                    // borderColor: "rgb(221,224,248)",
                                    width: width - 115,
                                  }}>
                                  <GooglePlacesAutocomplete
                                    ref={(ref) => (this.googlePlaces = ref)}
                                    placeholder="Enter a city…"
                                    minLength={1} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    fetchDetails={false}
                                    renderDescription={(row) => row.description} // custom description render
                                    onTextChange={(text) =>
                                      this.onCitiesChange(text, element.id)
                                    }
                                    onPress={(data) => {
                                      // 'details' is provided when fetchDetails = true
                                      // console.log(
                                      //   "data.description",
                                      //   data.description,
                                      //   this.googlePlaces.getDataSource()
                                      // );

                                      this.setText(
                                        element.id,
                                        data.description,
                                        textInputIndex,
                                      );
                                    }}
                                    getDefaultValue={() =>
                                      radioText[1] !== '' ? radioText[1] : ''
                                    }
                                    query={{
                                      key: PLACE_ID_API_KEY,
                                      language: 'en', // language of the results
                                      types: '(cities)', // default: 'geocode'
                                    }}
                                    styles={{
                                      textInputContainer: [
                                        styles.textInputContainer,
                                        {
                                          borderTopWidth: 0.5,
                                          borderTopColor: 'rgb(221,224,228)',
                                        },
                                      ],
                                      textInput: styles.textInput,
                                      description: styles.description,
                                      predefinedPlacesDescription:
                                        styles.selectText,
                                      separator: [
                                        styles.separator,
                                        {
                                          alignSelf: 'flex-start',
                                          marginLeft: 20,
                                        },
                                      ],
                                      row: styles.row,
                                    }}
                                    currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                                    nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={
                                      {
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                      }
                                    }
                                    keyboardShouldPersistTaps="handled"
                                    enablePoweredByContainer={false}
                                    filterReverseGeocodingByTypes={[
                                      'locality',
                                      'administrative_area_level_3',
                                    ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                    listViewDisplayed={false}
                                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                  />
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop:
                              innerElement.responseType.isFreeText === false
                                ? 20
                                : 40,
                            marginLeft: 16,
                            marginRight: 20,
                            marginBottom: 20,
                            flexDirection: 'row',
                            alignItems:
                              withoutImage &&
                              innerElement.helpText === null &&
                              innerElement.responseType.isFreeText === false
                                ? 'center'
                                : null,
                          }}>
                          {responseType}
                          <View
                            style={{
                              marginLeft: 14,
                              width:
                                withoutImage && innerElement.helpText === null
                                  ? 219
                                  : width - 208,
                            }}>
                            {innerElement.text !== null ? (
                              <Text
                                key={innerElement.text}
                                style={[
                                  styles.cardTitle,
                                  {
                                    marginTop: 0,
                                    height:
                                      withoutImage &&
                                      innerElement.helpText === null &&
                                      innerElement.text.length > 34
                                        ? 36
                                        : null,
                                    width: withoutImage ? width - 115 : null,
                                  },
                                ]}>
                                {innerElement.text}
                              </Text>
                            ) : null}

                            {innerElement.helpText !== null ? (
                              <ViewMoreText
                                numberOfLines={3}
                                renderViewMore={this.renderViewMore}
                                renderViewLess={this.renderViewLess}
                                textStyle={{
                                  marginTop: 8,
                                  width: withoutImage ? width - 115 : null,
                                }}>
                                <Text style={styles.cardText}>
                                  {innerElement.helpText}
                                </Text>
                              </ViewMoreText>
                            ) : null}

                            {element.type === 'checkbox:additional-options' &&
                            Array.isArray(
                              innerElement.responseType.additionalResponses,
                            ) ? (
                              <View>
                                <View
                                  style={{width: width - 115, marginTop: 16}}>
                                  <TouchableWithoutFeedback
                                    onPress={() =>
                                      this.toggleSelect(
                                        element.id + '_' + innerElement.value,
                                      )
                                    }>
                                    <View
                                      style={{
                                        borderWidth: 0,
                                        width: width - 115,
                                        height: 44,
                                        // borderRadius: 10,
                                        // backgroundColor: "rgb(239,243,249)",
                                        borderRadius: 4,
                                        backgroundColor: 'rgb(255,255,255)',
                                        borderWidth: 1,
                                        borderColor: 'rgb(221,224,228)',
                                        justifyContent: 'center',
                                      }}>
                                      <Text
                                        style={[
                                          styles.ancestryText,
                                          {
                                            marginLeft: 14,
                                            color: this.state.checkBoxGroups[
                                              additionalResponsesIndex
                                            ][
                                              'checkBox_' +
                                                element.id +
                                                '_' +
                                                innerIndex
                                            ]
                                              ? 'rgb(31,33,35)'
                                              : 'rgba(31,33,35,0.2)',
                                          },
                                        ]}>
                                        {this.state.checkBoxGroups[
                                          additionalResponsesIndex
                                        ][
                                          'checkBox_' +
                                            element.id +
                                            '_' +
                                            innerIndex
                                        ] &&
                                        this.state.checkBoxGroups[
                                          additionalResponsesIndex
                                        ][
                                          'checkBox_' +
                                            element.id +
                                            '_' +
                                            innerIndex
                                        ].indexOf('_') !== -1
                                          ? this.state.checkBoxGroups[
                                              additionalResponsesIndex
                                            ][
                                              'checkBox_' +
                                                element.id +
                                                '_' +
                                                innerIndex
                                            ].substr(
                                              0,
                                              this.state.checkBoxGroups[
                                                additionalResponsesIndex
                                              ][
                                                'checkBox_' +
                                                  element.id +
                                                  '_' +
                                                  innerIndex
                                              ].indexOf('_'),
                                            )
                                          : 'Please select one'}
                                      </Text>
                                    </View>
                                  </TouchableWithoutFeedback>
                                  <Image
                                    source={require('../resources/icon/arrowRight.png')}
                                    style={{
                                      position: 'absolute',
                                      right: 18,
                                      top: 16.5,
                                      width: 8,
                                      height: 13,
                                      tintColor: 'rgb(186,195,208)',
                                      transform: [{rotate: '90deg'}],
                                    }}
                                  />

                                  {this.state.selects[selectIndex][
                                    element.id + '_' + innerElement.value
                                  ] ? (
                                    <View
                                      style={[
                                        styles.card,
                                        {marginTop: 0, width: width - 115},
                                      ]}>
                                      {addResponses}
                                    </View>
                                  ) : null}
                                </View>
                                {this.state.checkBoxGroups[
                                  additionalResponsesIndex
                                ][
                                  'checkBox_' + element.id + '_' + innerIndex
                                ] &&
                                this.state.checkBoxGroups[
                                  additionalResponsesIndex
                                ][
                                  'checkBox_' + element.id + '_' + innerIndex
                                ].indexOf('_') === -1 ? (
                                  <Text style={styles.errorTextMultiple}>
                                    Please select the condition
                                  </Text>
                                ) : null}
                              </View>
                            ) : null}

                            {element.type === 'checkbox:additional-options' &&
                            innerElement.responseType.isFreeText === true ? (
                              <View
                                style={[
                                  styles.ancestryInput,
                                  {
                                    marginTop: 11,
                                    marginHorizontal: 0,
                                    width: width - 115,
                                    height: 55,
                                  },
                                ]}>
                                <TextInput
                                  style={styles.ancestryText}
                                  placeholder="Please specify here…"
                                  placeholderTextColor="rgba(31,33,35,0.2)"
                                  onChangeText={(text) =>
                                    this.setText(
                                      element.id,
                                      text,
                                      textInputIndex,
                                    )
                                  }
                                />
                              </View>
                            ) : null}
                          </View>

                          {!withoutImage ? (
                            <Image
                              source={{uri: imageUrl}}
                              style={{
                                width: 80,
                                height: 80,
                                marginLeft: 16,
                                borderRadius: 4,
                              }}
                              resizeMode={
                                innerElement.image.includes('hairline')
                                  ? 'contain'
                                  : 'cover'
                              }
                            />
                          ) : null}
                        </View>
                      )}
                    </Animatable.View>
                  </TouchableWithoutFeedback>,
                );
            }
          });
        } else {
          if (element.type === 'special:workout-activities') {
            workoutActivities = true;

            const array = [];
            Object.keys(this.props.injuries).map((key) => {
              array.push(this.props.injuries[key]);
            });

            elements.push(
              <FlatList
                key="dwdwdwd"
                data={array}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={this._renderItem}
                contentContainerStyle={{paddingBottom: 50}}
              />,
            );
          } else {
            if (element.type === 'special:food-allergies') {
              const chosenItems = this.state.foodAllergies.map(
                (foodElement, foodIndex) => {
                  return (
                    <TouchableWithoutFeedback
                      key={foodIndex + foodElement.name}
                      onPress={() => {
                        const array = this.state.foodAllergies;
                        array.splice(foodIndex, 1);

                        this.setState({
                          foodAllergies: array,
                          foodAllergiesText: '',
                        });
                      }}>
                      <View
                        style={[
                          styles.listItem,
                          {marginTop: foodIndex === 0 ? 0 : 10},
                        ]}>
                        <Image
                          source={require('../resources/icon/plus_icon.png')}
                          style={{
                            width: 13,
                            height: 13,
                            transform: [
                              {
                                rotate: '45deg',
                              },
                            ],
                            tintColor: 'rgb(186,195,208)',
                            marginLeft: 15,
                          }}
                        />
                        <Text style={styles.listText}>{foodElement.name}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                },
              );

              elements.push(
                <View style={{flex: 1}} key={element.id + element.order}>
                  <View
                    style={[
                      styles.card,
                      {
                        marginTop: 20,
                        paddingBottom: chosenItems.length > 0 ? 23 : 0,
                        flex: 1,
                      },
                    ]}>
                    <View style={styles.ancestryInput}>
                      <TextInput
                        style={styles.ancestryText}
                        placeholder="Start typing to search…"
                        onChangeText={(text) =>
                          this.setState({foodAllergiesText: text})
                        }
                        value={this.state.foodAllergiesText}
                      />
                    </View>
                    {this.state.foodAllergiesText !== '' ? (
                      <View
                        styles={[
                          styles.card,
                          {
                            width: width - 86,
                            marginTop: -23,
                            marginBottom: 23,
                            height: 205,
                            // elevation: 0,
                            alignSelf: 'center',
                          },
                        ]}>
                        <FlatList
                          ref={(ref) => (this.flatList = ref)}
                          data={this.state.allergyCategories.filter(
                            (object) =>
                              object.name
                                .toLowerCase()
                                .includes(
                                  this.state.foodAllergiesText.toLowerCase(),
                                ) || object.name === 'Full List of Foods',
                          )}
                          extraData={this.state.allergyCategories}
                          keyExtractor={(item, index) => item.name + item.id}
                          renderItem={this.renderAllergyItem}
                          contentContainerStyle={{
                            alignSelf: 'center',
                            overflow: 'hidden',
                            // shadowOpacity: 0,
                            width: width - 86,
                            borderWidth: 1,
                            borderColor: 'rgb(221,224,228)',
                          }}
                          initialNumToRender={6}
                          bounces={false}
                          removeClippedSubviews={true}
                          nestedScrollEnabled={true}
                          keyboardShouldPersistTaps="always"
                        />
                      </View>
                    ) : null}
                    {chosenItems}
                  </View>
                </View>,
              );
            } else {
              const chosenItems = this.state.foodUnfavorite.map(
                (foodElement, foodIndex) => {
                  return (
                    <TouchableWithoutFeedback
                      key={foodIndex + foodElement.name}
                      onPress={() => {
                        const array = this.state.foodUnfavorite;
                        array.splice(foodIndex, 1);

                        this.setState({
                          foodUnfavorite: array,
                          foodUnfavoriteText: '',
                        });
                      }}>
                      <View
                        style={[
                          styles.listItem,
                          {marginTop: foodIndex === 0 ? 0 : 10},
                        ]}>
                        <Image
                          source={require('../resources/icon/plus_icon.png')}
                          style={{
                            width: 13,
                            height: 13,
                            transform: [{rotate: '45deg'}],
                            tintColor: 'rgb(186,195,208)',
                            marginLeft: 15,
                          }}
                        />
                        <Text style={styles.listText}>{foodElement.name}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                },
              );

              elements.push(
                <View key={element.id + element.order}>
                  <View
                    style={[
                      styles.card,
                      {
                        marginTop: 20,
                        paddingBottom: chosenItems.length > 0 ? 23 : 0,
                      },
                    ]}>
                    <View style={styles.ancestryInput}>
                      <TextInput
                        style={styles.ancestryText}
                        placeholder="Start typing to search…"
                        onChangeText={(text) =>
                          this.setState({foodUnfavoriteText: text})
                        }
                        value={this.state.foodUnfavoriteText}
                      />
                    </View>
                    {this.state.foodUnfavoriteText !== '' ? (
                      <View
                        styles={[
                          styles.card,
                          {
                            width: width - 86,
                            marginTop: -23,
                            marginBottom: 23,
                            height: 205,
                            elevation: 0,
                            alignSelf: 'center',
                            borderWidth: 1,
                            borderColor: 'rgb(221,224,228)',
                          },
                        ]}>
                        <FlatList
                          ref={(ref) => (this.flatList = ref)}
                          data={this.state.allergyCategories.filter(
                            (object) =>
                              object.name
                                .toLowerCase()
                                .includes(
                                  this.state.foodUnfavoriteText.toLowerCase(),
                                ) || object.name === 'Full List of Foods',
                          )}
                          extraData={this.state.allergyCategories}
                          keyExtractor={(item, index) => item.name + item.id}
                          renderItem={this.renderFoodItem}
                          contentContainerStyle={{
                            alignSelf: 'center',
                            overflow: 'hidden',
                            shadowOpacity: 0,
                            width: width - 86,
                          }}
                          initialNumToRender={6}
                          bounces={false}
                          removeClippedSubviews={true}
                          nestedScrollEnabled={true}
                          keyboardShouldPersistTaps="always"
                        />
                      </View>
                    ) : null}
                    {chosenItems}
                  </View>
                </View>,
              );
            }
          }
        }
      }
    });

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        extraHeight={134}
        extraScrollHeight={134}
        innerRef={(ref) => {
          this.scroll = ref;
        }}>
        {elements}

        <TouchableWithoutFeedback onPress={this.checkFields}>
          <View style={[styles.button, {marginTop: 50}]}>
            <Text style={styles.buttonText}>Next</Text>
          </View>
        </TouchableWithoutFeedback>

        {isIphoneX() ? <View style={{height: 34}} /> : null}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(244,248,252)',
  },
  title: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.3,
    color: 'rgb(16,16,16)',
    marginHorizontal: 20,
    marginTop: 25,
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.3,
    lineHeight: 20,
    color: 'rgb(54,58,61)',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  line: {
    width: width - 40,
    height: 0.5,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'rgb(223,230,235)',
  },
  card: {
    width: width - 40,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    // borderRadius: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
    // shadowOpacity: 0.12,
    // shadowRadius: 25,
    // shadowColor: "rgb(39,56,73)",
    // shadowOffset: { height: 12, width: 0 },
    marginTop: 16,
    // borderColor: "rgb(253,253,253)",
    // borderWidth: 1,
    // elevation: 11,
  },
  cardTitle: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.1,
    color: 'rgb(16,16,16)',
  },
  cardText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: -0.1,
    lineHeight: 18,
    color: 'rgb(106,111,115)',
    marginTop: 8,
  },
  chosenCard: {
    backgroundColor: 'rgb(248,255,252)',
    borderColor: 'rgba(0,187,116,0.5)',
    borderWidth: 1,
    alignSelf: 'center',
  },
  errorCard: {
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgb(228,77,77)',
    borderWidth: 1,
    alignSelf: 'center',
  },
  ancestryInput: {
    marginHorizontal: 23,
    marginTop: 20,
    marginBottom: 23,
    // backgroundColor: "rgb(239,243,249)",
    // borderRadius: 10,
    borderRadius: 4,
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
    height: 44,
    width: width - 86,
    justifyContent: 'center',
  },
  ancestryText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(31,33,35)',
    marginLeft: 14,
  },
  placeholderText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: -0.1,
    color: 'rgb(182,189,195)',
    marginLeft: 15,
    position: 'absolute',
    top: 11,
  },
  additionalButton: {
    width: width - 40,
    height: 44,
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderRadius: 24,
    borderColor: 'rgb(0,168,235)',
    marginTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalButtonText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 15,
    letterSpacing: -0.1,
    color: 'rgb(0,168,235)',
  },
  listItem: {
    width: width - 86,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgb(223,230,235)',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  listText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(31,33,35)',
    marginLeft: 9,
    flexWrap: 'wrap',
    flex: 1,
  },
  button: {
    width: width,
    height: 48,
    backgroundColor: 'rgb(0,168,235)',
    justifyContent: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    fontFamily: 'SFProText-Bold',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(255,255,255)',
  },
  selectText: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: -0.4,
    color: 'rgb(31,33,35)',
    marginLeft: 16,
    marginVertical: 20,
  },
  flag: {
    width: 24,
    height: 16,
  },
  textInputContainer: {
    // borderTopWidth: 0,
    // borderBottomWidth: 0,
    // backgroundColor: "rgb(239,243,249)",
    // borderRadius: 10,
    borderRadius: 4,
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
    height: 44,
    width: width - 115,
    justifyContent: 'center',
    marginLeft: 14,
  },
  textInput: {
    // backgroundColor: "rgb(239,243,249)",
    // borderRadius: 4,
    backgroundColor: 'rgb(255,255,255)',
    // borderWidth: 1,
    // borderColor: "rgb(221,224,228)",
    justifyContent: 'center',
  },
  description: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 15,
    letterSpacing: -0.4,
    color: 'rgb(31,33,35)',
    marginLeft: 14,
  },
  separator: {
    height: 0.5,
    width: width - 115,
    alignSelf: 'center',
  },
  row: {
    height: 48,
  },
  selectArrowDown: {
    position: 'absolute',
    right: 18,
    top: 22,
    width: 8,
    height: 13,
    tintColor: 'rgb(186,195,208)',
    transform: [{rotate: '90deg'}],
  },
  errorTextMultiple: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 12,
    letterSpacing: -0.29,
    color: 'rgb(228,77,77)',
    marginTop: 16,
  },
});

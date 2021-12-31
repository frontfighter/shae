import React, {PureComponent, Component} from 'react';
import {
  TouchableWithoutFeedback,
  Platform,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  InteractionManager,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import rnTextSize, {TSFontSpecs} from 'react-native-text-size';
import RNExitApp from 'react-native-exit-app';
import Dialog, {
  ScaleAnimation,
  SlideAnimation,
  DialogContent,
} from 'react-native-popup-dialog';
import * as Animatable from 'react-native-animatable';
import {Actions} from 'react-native-router-flux';

import MaterialTabs from '../components/Tabs';
import HraScrollItem from '../components/HraScrollItem';
import LoadingIndicator from '../components/LoadingIndicator';
import MeasurementScreen from './MeasurementScreen';
import * as api from '../API/shaefitAPI';

import AccountCard from '../components/AccountCard';
import CardHOC from '../components/CardHOC';
import {
  getUserDetails,
  getUserVariables,
  readRealmRows,
  createOrUpdateRealm,
} from '../data/db/Db';

import HraDetails from '../components/HraDetails';
const CardWithShadow = CardHOC(AccountCard);

const {height, width} = Dimensions.get('window');

const fontSpecs: TSFontSpecs = {
  fontFamily: 'SFProText-Medium',
  fontSize: 14,
  fontStyle: 'normal',
  fontWeight: 'normal',
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

export default class HraScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 0,

      scrollItemActive: 'Head',
      headTabs: [],
      bodyTabs: [],
      healthTabs: [],
      lifestyleTabs: [],
      measurementTabs: [],

      tabs: [],
      tabsWidth: [],
      activeData: [],
      activeTabData: [],

      measurementsAnswers: null,
      answers: null,
      specialAnswers: null,

      isFromGetResults: false,

      isResultsLoading: false,

      isModalVisible: false,
      isGetResultsLoading: false,

      isSavePressed: false,
    };

    this.answers = [];
    this.measurementsAnswers = [];
    this.specialAnswers = [];
    this.userDetails = null;
    this.gender = null;
    this.isNewUser = null;
    this.birthdateYear = null;

    this.hraData = null;
  }

  async UNSAFE_componentWillMount() {
    const userDetails = JSON.parse(JSON.stringify(getUserDetails()));
    this.userDetails = userDetails;
    this.gender =
      typeof this.userDetails !== 'undefined'
        ? this.userDetails.profile.gender
        : null;
    console.log('this.gender', this.gender);
    this.birthdateYear =
      typeof this.userDetails !== 'undefined'
        ? Number(this.userDetails.profile.birthdate.substring(0, 4))
        : null;

    const userVariables = JSON.parse(JSON.stringify(getUserVariables()));
    this.hraData = JSON.parse(userVariables.hraSchemaData);

    this.isNewUser =
      typeof userVariables !== 'undefined' ? userVariables.isNewUser : null;

    if (this.isNewUser) {
      this.setMeasurementAnswers('50', '');
      this.saveAnswersByApi(
        this.answers,
        this.measurementsAnswers,
        this.specialAnswers,
      );
    }

    // console.log('userVariables', userVariables);

    Object.keys(this.hraData.questionnaire).map((key) => {
      const stateItemName = key + 'Tabs';
      let json;

      const propertyNames = Object.keys(this.hraData.questionnaire[key])
        .toString()
        .split(',');
      console.log('this.hraData.questionnaire innerkey', propertyNames);

      if (key === 'head') {
        const sortArray = ['skin', 'hair', 'eyes', 'neck', 'mouth', 'ears'];
        json = JSON.parse(
          JSON.stringify(this.hraData.questionnaire[key], sortArray),
        );
        json.skin = this.hraData.questionnaire[key].skin;
        json.hair = this.hraData.questionnaire[key].hair;
        json.eyes = this.hraData.questionnaire[key].eyes;
        json.neck = this.hraData.questionnaire[key].neck;
        json.mouth = this.hraData.questionnaire[key].mouth;
        json.ears = this.hraData.questionnaire[key].ears;
      } else if (key === 'body') {
        json = JSON.parse(
          JSON.stringify(this.hraData.questionnaire[key], [
            'hands',
            'body',
            'legs',
            'feet',
            "women's health",
          ]),
        );
        json.hands = this.hraData.questionnaire[key].hands;
        json.body = this.hraData.questionnaire[key].body;
        json.legs = this.hraData.questionnaire[key].legs;
        json.feet = this.hraData.questionnaire[key].feet;
        json["women's health"] = this.hraData.questionnaire[key][
          "women's health"
        ];
      } else if (key === 'lifestyle') {
        json = JSON.parse(
          JSON.stringify(this.hraData.questionnaire[key], [
            'exercise',
            'work',
            'travel',
            'nutrition',
            'living conditions',
          ]),
        );
        json.exercise = this.hraData.questionnaire[key].exercise;
        json.work = this.hraData.questionnaire[key].work;
        json.travel = this.hraData.questionnaire[key].travel;
        json.nutrition = this.hraData.questionnaire[key].nutrition;
        json['living conditions'] = this.hraData.questionnaire[key][
          'living conditions'
        ];
      } else if (key === 'health') {
        json = JSON.parse(
          JSON.stringify(this.hraData.questionnaire[key], [
            'health',
            'family history',
          ]),
        );
        json.health = this.hraData.questionnaire[key].health;
        json['family history'] = this.hraData.questionnaire[key][
          'family history'
        ];
      } else {
        json = this.hraData.questionnaire[key];
      }

      for (let i = 0; i < propertyNames.length; i++) {
        if (!json.hasOwnProperty(propertyNames[i])) {
          json[propertyNames[i]] = this.hraData.questionnaire[key][
            propertyNames[i]
          ];
        }
      }

      console.log('json', json);

      this.state[stateItemName].push(json); // hraData.questionnaire[key]
    });

    Object.keys(this.hraData.measurements).map((key) => {
      console.log('test componentWillMount key', key);

      let json = {};
      const propertyNames = Object.keys(this.hraData.measurements[key])
        .toString()
        .split(',');
      console.log('this.hraData.measurements innerkey', propertyNames);

      if (key === 'Whole Body') {
        json['01'] = this.hraData.measurements[key]['1'];
        json['02'] = this.hraData.measurements[key]['2'];
        json['050'] = this.hraData.measurements[key]['50'];
      } else if (key === 'Head & Neck') {
        json['021'] = this.hraData.measurements[key]['21'];
        json['020'] = this.hraData.measurements[key]['20'];
        json['03'] = this.hraData.measurements[key]['3'];
      } else if (key === 'Upper Body') {
        json['04'] = this.hraData.measurements[key]['4'];
        json['05'] = this.hraData.measurements[key]['5'];
        json['06'] = this.hraData.measurements[key]['6'];
        json['07'] = this.hraData.measurements[key]['7'];
      } else if (key === 'Arms') {
        json['016'] = this.hraData.measurements[key]['16'];
        json['017'] = this.hraData.measurements[key]['17'];
        json['018'] = this.hraData.measurements[key]['18'];
        json['049'] = this.hraData.measurements[key]['49'];
      } else if (key === 'Legs') {
        json['034'] = this.hraData.measurements[key]['34'];
        json['09'] = this.hraData.measurements[key]['9'];
        json['038'] = this.hraData.measurements[key]['38'];
        json['011'] = this.hraData.measurements[key]['11'];
        json['014'] = this.hraData.measurements[key]['14'];
        console.log('json Legs', json);
      } else {
        json = this.hraData.measurements[key];
      }

      for (let i = 0; i < propertyNames.length; i++) {
        if (!json.hasOwnProperty('0' + propertyNames[i])) {
          json[propertyNames[i]] = this.hraData.measurements[key][
            propertyNames[i]
          ];
        }
      }

      console.log('json', json);
      this.state.measurementTabs.push({[key]: json});
    });

    const activeTabData = [];
    this.state.headTabs.map((data) => {
      Object.keys(data).map((key) => {
        const tabName = key
          .toLowerCase()
          .split(' ')
          .map((a) => a.charAt(0).toUpperCase() + a.substr(1))
          .join(' ');
        this.state.tabs.push(tabName);

        this.state.activeData.push(data[key]);

        const innerData = data[key];
        Object.keys(innerData).map((innerKey) => {
          if (innerData[innerKey].subCategory === this.state.tabs[0]) {
            activeTabData.push(innerData[innerKey]);
          }
        });
      });
    });

    this.getWidth();

    this.setState({activeTabData});

    const userAnswers = await api.getHra();
    this.setState({
      measurementsAnswers:
        userAnswers.measurements.length === 0 ? null : userAnswers.measurements,
      answers:
        userAnswers.questions.length === 0 ? null : userAnswers.questions,
      specialAnswers:
        userAnswers.specialQuestions.length === 0
          ? null
          : userAnswers.specialQuestions,
    });

    setTimeout(() => {
      this.setState({
        measurementsAnswers:
          userAnswers.measurements.length === 0
            ? null
            : userAnswers.measurements,
        answers:
          userAnswers.questions.length === 0 ? null : userAnswers.questions,
        specialAnswers:
          userAnswers.specialQuestions.length === 0
            ? null
            : userAnswers.specialQuestions,
      });
    }, 1000);
    console.log('userAnswers', userAnswers);

    setTimeout(() => {
      if (
        typeof this.props.isMeasurements !== 'undefined' &&
        this.props.isMeasurements === true
        // typeof this.props.navigation.state.params !== "undefined" &&
        // typeof this.props.navigation.state.params.isMeasurement !== "undefined"
      ) {
        const activeTabData = [];
        const tabsArray = [];
        const activeDataArray = this.state.activeData;
        const title = 'Measurement';

        const scrollItemName = title.toLowerCase() + 'Tabs';
        this.state[scrollItemName].map((data) => {
          Object.keys(data).map((key) => {
            const tabName = key
              .toLowerCase()
              .split(' ')
              .map((a) => a.charAt(0).toUpperCase() + a.substr(1))
              .join(' ');

            tabsArray.push(tabName);
            activeDataArray.push(data[key]);

            const innerData = data[key];
            Object.keys(innerData).map((innerKey) => {
              if (innerData[innerKey].subCategory === this.state.tabs[0]) {
                activeTabData.push(innerData[innerKey]);
              }
            });
          });
        });

        this.setState(
          {
            selectedTab: 0,
            activeTabData: this.sort(activeTabData, 'order'),
            tabs: tabsArray,
            activeData: activeDataArray,
          },
          () => {
            this.onTouchScrollItem(title);
          },
        );
      } else if (
        userVariables.lastHraSection !== null &&
        userVariables.lastHraTab !== null
      ) {
        const activeTabData = [];
        const tabsArray = [];
        const activeDataArray = this.state.activeData;

        const scrollItemName =
          userVariables.lastHraSection.toLowerCase() + 'Tabs';
        this.state[scrollItemName].map((data) => {
          Object.keys(data).map((key) => {
            const tabName = key
              .toLowerCase()
              .split(' ')
              .map((a) => a.charAt(0).toUpperCase() + a.substr(1))
              .join(' ');

            tabsArray.push(tabName);
            activeDataArray.push(data[key]);

            const innerData = data[key];
            Object.keys(innerData).map((innerKey) => {
              if (innerData[innerKey].subCategory === this.state.tabs[0]) {
                activeTabData.push(innerData[innerKey]);
              }
            });
          });
        });

        this.setState(
          {
            selectedTab: 0,
            activeTabData: this.sort(activeTabData, 'order'),
            tabs: tabsArray,
            activeData: activeDataArray,
          },
          () => {
            this.onTouchScrollItem(userVariables.lastHraSection);

            setTimeout(async () => {
              if (
                Number(userVariables.lastHraTab) !== 0 &&
                scrollItemName !== 'measurementTabs'
              ) {
                await this.setTab(Number(userVariables.lastHraTab));
              }
            }, 100);
          },
        );
      }
    }, 0);
  }

  componentDidMount() {
    // this.props.navigation.setParams({
    //   handleSave: this._handleSave,
    //   handleBackButtonClick: this.handleBackButtonClick,
    // });

    Actions.refresh({
      rightTitle: 'Save',
      onRight: this._handleSave,
      onBack: this.handleBackButtonClick,
    });
  }

  /**
   * On Android Back press by the condition.
   */
  handleBackButtonClick = () => {
    console.log('handleBackButtonClick');
    try {
      if (this.isNewUser) {
        RNExitApp.exitApp();
      } else {
        console.log('handleBackButtonClick', this.measurementsAnswers);
        if (
          this.answers.length !== 0 ||
          this.measurementsAnswers.length !== 0 ||
          this.specialAnswers.length !== 0
        ) {
          this.handleSave();
        } else {
          // this.props.back();
          Actions.refresh({
            key: 'dashboard',
            openDrawer: true,
          });

          setTimeout(() => {
            Actions.popTo('dashboard');
          }, 300);
        }
      }
      console.log('exit');
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Handler for the Save button press.
   */
  _handleSave = async () => {
    try {
      await this.saveAnswersByApi(
        this.answers,
        this.measurementsAnswers,
        this.specialAnswers,
      );
      api.getHraResults();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  /**
   * Handler for the Save button press.
   */
  handleSave = async () => {
    try {
      console.log('handleSave click');

      if (
        this.answers.length !== 0 ||
        this.measurementsAnswers.length !== 0 ||
        this.specialAnswers.length !== 0
      ) {
        // await this.saveAnswersByApi(
        //   this.answers,
        //   this.measurementsAnswers,
        //   this.specialAnswers
        // );

        this.setState({isModalVisible: true});
        // this.setState({ isModalVisible: true }, () => {
        //   this.popupDialog.show();
        // });
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onSaveAndGetResultsPress = async () => {
    try {
      this.setState({isGetResultsLoading: true});

      this.saveAnswersByApi(
        this.answers,
        this.measurementsAnswers,
        this.specialAnswers,
      );

      const hraResultsData = await api.getHraResults();

      this.setState({isGetResultsLoading: false});
      this.dismissModal(false);

      setTimeout(() => {
        this.setState({isResultsLoading: false});
      }, 1000);

      console.log('getHraResults data', hraResultsData);

      setTimeout(() => {
        if (hraResultsData.status === 200) {
          let userVariables = JSON.parse(JSON.stringify(getUserVariables()));

          const today = new Date();
          this.userDetails.measurementsUpdated =
            today.getFullYear() +
            '-' +
            ('0' + (today.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + today.getDate()).slice(-2);
          console.log(
            'new measurement date',
            this.userDetails.measurementsUpdated,
          );
          createOrUpdateRealm('UserDetails', this.userDetails);
          readRealmRows('UserDetails');

          if (!userVariables.isHraFilled) {
            userVariables.isHraFilled = true;
            createOrUpdateRealm('UserVariables', userVariables);
            readRealmRows('UserVariables');

            // this.props.hraCompleted();
            // Actions.hraCompleted();
            Actions.hraCompleted({type: 'replace'});
          } else {
            // this.props.hraCompleted();
            // Actions.hraCompleted();
            Actions.hraCompleted({type: 'replace'});
          }
        } else if (hraResultsData.status === 409) {
          if (hraResultsData.data.unansweredQuestions.length !== 0) {
            const {
              category,
              subCategory,
            } = hraResultsData.data.unansweredQuestions[0];

            const scrollItemName =
              category.toLowerCase()[0].toUpperCase() + category.slice(1);
            console.log('onResult scrollItemName', scrollItemName);

            const activeTabData = [];
            const tabsArray = [];
            const activeDataArray = this.state.activeData;

            this.state[scrollItemName.toLowerCase() + 'Tabs'].map((data) => {
              Object.keys(data).map((key) => {
                const tabName = key
                  .toLowerCase()
                  .split(' ')
                  .map((a) => a.charAt(0).toUpperCase() + a.substr(1))
                  .join(' ');

                tabsArray.push(tabName);
                activeDataArray.push(data[key]);

                const innerData = data[key];
                Object.keys(innerData).map((innerKey) => {
                  if (innerData[innerKey].subCategory === this.state.tabs[0]) {
                    activeTabData.push(innerData[innerKey]);
                  }
                });
              });
            });

            this.setState(
              {
                selectedTab: 0,
                activeTabData: this.sort(activeTabData, 'order'),
                tabs: tabsArray,
                activeData: activeDataArray,
              },
              () => {
                this.onTouchScrollItem(scrollItemName);

                setTimeout(async () => {
                  const index = tabsArray.indexOf(subCategory);

                  if (index !== -1) {
                    this.setState({isFromGetResults: true});
                    await this.setTab(index);
                    this.setState({isFromGetResults: false});

                    setTimeout(async () => {
                      this.hraDetailsRef.checkFields();
                    }, 250);
                  }
                }, 100);
              },
            );
            console.log('onResult this.state.tabs', tabsArray);
          } else if (hraResultsData.data.unansweredMeasurements.length !== 0) {
            const {category} = hraResultsData.data.unansweredMeasurements[0];

            setTimeout(async () => {
              const index = this.state.tabs.indexOf(category);

              console.log(
                'unansweredMeasurements index',
                index,
                this.state.tabs,
                category,
              );

              if (index !== -1) {
                this.setState({isFromGetResults: true});
                await this.setTab(index);
                this.setState({isFromGetResults: false});
              }
            }, 100);
          }
        } else if (hraResultsData.status === 500) {
        }
      }, 350);
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  dismissModal = (condition) => {
    try {
      // this.popupDialog.dismiss();
      this.setState({isModalVisible: false}, () => {
        if (!this.state.isSavePressed && typeof condition === 'undefined') {
          // this.props.back();
          Actions.refresh({
            key: 'dashboard',
            openDrawer: true,
          });

          setTimeout(() => {
            Actions.popTo('dashboard');
          }, 300);
        }
        this.setState({isSavePressed: false});
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  animatedDismissModal = (condition) => {
    try {
      this.popup.slideOutUp(350).then(() => this.dismissModal(condition));
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onCloseModalPress = () => {
    try {
      this.animatedDismissModal();
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setIsFromGetResults = () => {
    try {
      this.setState({isFromGetResults: false});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setAnswers = (questionId, values, freetext, placeId) => {
    try {
      if (this.state.answers === null) {
        let answers =
          questionId !== 162 && typeof placeId !== 'undefined'
            ? {
                questionId: {
                  questionId: questionId,
                  values: values,
                  freetext: freetext,
                },
              }
            : {
                questionId: {
                  questionId: questionId,
                  values: values,
                  freetext: freetext,
                  placeId: placeId,
                },
              };
        console.log('setAnswers null', answers);
        this.setState({answers});
      } else {
        let answers = this.state.answers;

        if (answers.hasOwnProperty(questionId.toString())) {
          answers[questionId.toString()].values = values;
          answers[questionId.toString()].freetext = freetext;
          if (questionId === 162 && typeof placeId !== 'undefined') {
            answers[questionId.toString()].placeId = placeId;
          }
        } else {
          if (questionId === 162 && typeof placeId !== 'undefined') {
            answers = {
              ...answers,
              ...{
                [questionId.toString()]: {
                  questionId: questionId,
                  values: values,
                  freetext: freetext,
                  placeId: placeId,
                },
              },
            };
          } else {
            answers = {
              ...answers,
              ...{
                [questionId.toString()]: {
                  questionId: questionId,
                  values: values,
                  freetext: freetext,
                },
              },
            };
          }
        }

        console.log('setAnswers', answers);
        this.setState({answers});
      }

      const array = this.answers;
      let isExists = false;

      for (let i = 0; i < array.length; i++) {
        if (array[i].questionId === questionId) {
          array[i].values = values;
          array[i].freetext = freetext;

          isExists = true;
          break;
        }
      }

      if (!isExists) {
        array.push({
          questionId,
          category: this.state.scrollItemActive,
          values,
          freetext,
        });
      }

      console.log('answers array', array);

      this.answers = array;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  deleteAnswer = (id) => {
    try {
      let answers = this.state.answers;
      delete answers[id];

      this.setState({answers});
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setMeasurementAnswers = (measurementId, value) => {
    try {
      if (this.state.measurementsAnswers === null) {
        let measurementsAnswers = {
          measurementId: {measurementId: measurementId, value: value},
        };
        console.log('measurementsAnswers null', measurementsAnswers);
        this.setState({measurementsAnswers});
      } else {
        let measurementsAnswers = this.state.measurementsAnswers;

        if (measurementsAnswers.hasOwnProperty(measurementId.toString())) {
          measurementsAnswers[measurementId.toString()].value = value;
        } else {
          measurementsAnswers = {
            ...measurementsAnswers,
            ...{
              [measurementId.toString()]: {
                measurementId: measurementId,
                value: value,
              },
            },
          };
        }

        this.setState({measurementsAnswers});
      }

      const array = this.measurementsAnswers;
      let isExists = false;

      for (let i = 0; i < array.length; i++) {
        if (array[i].measurementId === measurementId) {
          array[i].value = value;

          isExists = true;
          break;
        }
      }

      if (!isExists) {
        array.push({
          measurementId,
          value,
        });
      }

      console.log('measurementsAnswers array', array);

      this.measurementsAnswers = array;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setSpecialAnswers = (questionId, values) => {
    try {
      if (this.state.specialAnswers === null) {
        let specialAnswers = [];
        specialAnswers.push({questionId: questionId, values: values});
        this.setState({specialAnswers});
      } else {
        let specialAnswers = this.state.specialAnswers;

        let isExists = false;
        for (let i = 0; i < specialAnswers.length; i++) {
          if (
            specialAnswers[i].questionId.toString() === questionId.toString()
          ) {
            specialAnswers[i].values = values;
            isExists = true;
            break;
          }
        }

        if (!isExists) {
          specialAnswers.push({
            questionId,
            values,
          });
        }

        console.log('setSpecialAnswers', specialAnswers);
        this.setState({specialAnswers});
      }

      const array = this.specialAnswers;
      let isExists = false;

      for (let i = 0; i < array.length; i++) {
        if (array[i].questionId === questionId) {
          array[i].values = values;

          isExists = true;
          break;
        }
      }

      if (!isExists) {
        array.push({
          questionId,
          values,
        });
      }

      console.log('specialAnswers array', array);

      this.specialAnswers = array;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  saveAnswersByApi = async (questions, measurements, specialQuestions) => {
    try {
      let questions1 = questions;
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].questionId === 162) {
          questions1[i].placeId = this.state.answers[162].placeId;
        }
      }

      const apiObject = {
        measurements: measurements,
        questions: questions1,
        specialQuestions: specialQuestions,
      };

      console.log('checkAnswersByApi apiObject', apiObject);

      let answersObject = {...this.state.answers};
      for (let i = 0; i < questions.length; i++) {
        this.setAnswers(
          questions[i].questionId,
          questions[i].values,
          questions[i].freetext,
        );
      }

      if (
        measurements.length !== 0 ||
        questions.length !== 0 ||
        specialQuestions.length !== 0
      ) {
        await api.saveHraResponses(apiObject);

        let userVariables = JSON.parse(JSON.stringify(getUserVariables()));
        userVariables.lastHraSection = this.state.scrollItemActive;
        userVariables.lastHraTab = this.state.selectedTab.toString();
        userVariables.lastHraQuestionId = ''; //
        createOrUpdateRealm('UserVariables', userVariables);
        readRealmRows('UserVariables');
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  getWidth = async () => {
    try {
      const tabsWidthArray = [];

      for (let i = 0; i < this.state.tabs.length; i++) {
        const size = await rnTextSize.measure({
          text: this.state.tabs[i],
          width,
          ...fontSpecs,
        });

        tabsWidthArray.push(size.width);
      }

      this.setState(
        {tabsWidth: tabsWidthArray},
        console.log('this.state.tabsWidth', tabsWidthArray),
      );
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  _save = () => {};

  sort = (data, attr) => {
    try {
      const arr = [];
      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          const obj = {};
          obj[prop] = data[prop];
          obj.tempSortName = data[prop][attr];
          arr.push(obj);
        }
      }

      arr.sort((a, b) => {
        const at = a.tempSortName,
          bt = b.tempSortName;
        return at > bt ? 1 : at < bt ? -1 : 0;
      });

      const result = [];
      let id;
      for (let i = 0, l = arr.length; i < l; i++) {
        const obj = arr[i];
        delete obj.tempSortName;
        for (let prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            id = prop;
          }
        }
        const item = obj[id];
        result.push(item);
      }

      console.log('test sort', JSON.stringify(result));
      return result;
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  checkSpecialQuestions = (category) => {
    try {
      if (category === 'Health') {
        this.hraDetailsRef.checkMedicalProductCards();
      } else if (category === 'Nutrition') {
        this.hraDetailsRef.checkFoodAllergiesPreferences();
      }

      console.log('setTabsetTab');
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  setTab = async (selectedTab) => {
    try {
      if (this.state.scrollItemActive !== 'Measurement') {
        console.log(
          'setTab this.state.tabs.length',
          this.state.tabs.length,
          this.state.selectedTab + 1,
        );
        if (this.state.tabs.length > this.state.selectedTab + 1) {
          if (
            this.state.scrollItemActive === 'Health' &&
            this.state.activeTabData[0].subCategory === 'Health'
          ) {
            this.checkSpecialQuestions('Health');
          }
          if (
            this.state.scrollItemActive === 'Lifestyle' &&
            this.state.activeTabData[0].subCategory === 'Nutrition'
          ) {
            this.checkSpecialQuestions('Nutrition');
          }
        }

        this.saveAnswersByApi(
          this.answers,
          this.measurementsAnswers,
          this.specialAnswers,
        );
        this.answers = [];
        this.measurementsAnswers = [];
        this.specialAnswers = [];
      }

      if (typeof selectedTab !== 'undefined') {
        const itemName = this.state.scrollItemActive.toLowerCase() + 'Tabs';

        const array = [];
        Object.keys(this.state.activeData[selectedTab]).map((key) => {
          array.push(this.state.activeData[selectedTab][key]);
        });

        if (this.state.scrollItemActive !== 'Measurement') {
          if (!this.state.isFromGetResults) this.hraDetailsRef.checkFields();
          setTimeout(() => {
            if (
              (this.hraDetailsRef !== null &&
                this.hraDetailsRef.isWithoutErrors()) ||
              this.state.isFromGetResults
            ) {
              this.setState({
                selectedTab,
                activeTabData: this.sort(array, 'order'),
              });
            }
          }, 100);
        } else {
          console.log('setTab goNext', this.state.selectedTab, selectedTab);
          // if ((this.isNewUser && (this.state.selectedTab + 1 === selectedTab)) || !this.isNewUser) {
          this.hraMeasurementsRef.setAnswers();
          this.saveAnswersByApi(
            this.answers,
            this.measurementsAnswers,
            this.specialAnswers,
          );
          this.answers = [];
          this.measurementsAnswers = [];
          this.specialAnswers = [];

          this.setState({
            selectedTab,
            activeTabData: this.sort(array, 'order'),
          });
          // }
        }
      } else {
        console.log(
          'this.state.tabs.length',
          this.state.tabs.length + ' ' + this.state.selectedTab,
        );
        if (this.state.tabs.length > this.state.selectedTab + 1) {
          const array = [];
          Object.keys(this.state.activeData[this.state.selectedTab + 1]).map(
            (key) => {
              array.push(
                this.state.activeData[this.state.selectedTab + 1][key],
              );
            },
          );

          if (this.state.scrollItemActive === 'Measurement') {
            this.hraMeasurementsRef.setAnswers();
            this.saveAnswersByApi(
              this.answers,
              this.measurementsAnswers,
              this.specialAnswers,
            );
            this.answers = [];
            this.measurementsAnswers = [];
            this.specialAnswers = [];
          }

          this.setState({
            selectedTab: this.state.selectedTab + 1,
            activeTabData: this.sort(array, 'order'),
          });
        } else if (
          this.state.tabs.length <= this.state.selectedTab + 1 &&
          this.state.scrollItemActive === 'Measurement'
        ) {
          this.hraMeasurementsRef.setAnswers();
          await this.saveAnswersByApi(
            this.answers,
            this.measurementsAnswers,
            this.specialAnswers,
          );
          this.answers = [];
          this.measurementsAnswers = [];
          this.specialAnswers = [];

          this.setState({isResultsLoading: true});
          const hraResultsData = await api.getHraResults();

          setTimeout(() => {
            this.setState({isResultsLoading: false});
          }, 1000);

          console.log('getHraResults data', hraResultsData);

          if (hraResultsData.status === 200) {
            let userVariables = JSON.parse(JSON.stringify(getUserVariables()));

            const today = new Date();
            this.userDetails.measurementsUpdated =
              today.getFullYear() +
              '-' +
              ('0' + (today.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + today.getDate()).slice(-2);
            console.log(
              'new measurement date',
              this.userDetails.measurementsUpdated,
            );
            createOrUpdateRealm('UserDetails', this.userDetails);
            readRealmRows('UserDetails');

            if (!userVariables.isHraFilled) {
              userVariables.isHraFilled = true;
              createOrUpdateRealm('UserVariables', userVariables);
              readRealmRows('UserVariables');

              // this.props.hraCompleted();
              // Actions.hraCompleted();
              Actions.hraCompleted({type: 'replace'});

              // Congrats screen
            } else {
              // this.props.hraCompleted();
              // Actions.hraCompleted();
              Actions.hraCompleted({type: 'replace'});
            }
          } else if (hraResultsData.status === 409) {
            if (hraResultsData.data.unansweredQuestions.length !== 0) {
              const {
                category,
                subCategory,
              } = hraResultsData.data.unansweredQuestions[0];

              const scrollItemName =
                category.toLowerCase()[0].toUpperCase() + category.slice(1);
              console.log('onResult scrollItemName', scrollItemName);

              const activeTabData = [];
              const tabsArray = [];
              const activeDataArray = this.state.activeData;

              this.state[scrollItemName.toLowerCase() + 'Tabs'].map((data) => {
                Object.keys(data).map((key) => {
                  const tabName = key
                    .toLowerCase()
                    .split(' ')
                    .map((a) => a.charAt(0).toUpperCase() + a.substr(1))
                    .join(' ');

                  tabsArray.push(tabName);
                  activeDataArray.push(data[key]);

                  const innerData = data[key];
                  Object.keys(innerData).map((innerKey) => {
                    if (
                      innerData[innerKey].subCategory === this.state.tabs[0]
                    ) {
                      activeTabData.push(innerData[innerKey]);
                    }
                  });
                });
              });

              this.setState(
                {
                  selectedTab: 0,
                  activeTabData: this.sort(activeTabData, 'order'),
                  tabs: tabsArray,
                  activeData: activeDataArray,
                },
                () => {
                  this.onTouchScrollItem(scrollItemName);

                  setTimeout(async () => {
                    const index = tabsArray.indexOf(subCategory);

                    if (index !== -1) {
                      this.setState({isFromGetResults: true});
                      await this.setTab(index);
                      this.setState({isFromGetResults: false});

                      setTimeout(async () => {
                        this.hraDetailsRef.checkFields();
                      }, 250);
                    }
                  }, 100);
                },
              );
              console.log('onResult this.state.tabs', tabsArray);
            } else if (
              hraResultsData.data.unansweredMeasurements.length !== 0
            ) {
              const {category} = hraResultsData.data.unansweredMeasurements[0];

              setTimeout(async () => {
                const index = this.state.tabs.indexOf(category);

                console.log(
                  'unansweredMeasurements index',
                  index,
                  this.state.tabs,
                  category,
                );

                if (index !== -1) {
                  this.setState({isFromGetResults: true});
                  await this.setTab(index);
                  this.setState({isFromGetResults: false});
                }
              }, 100);
            }
          } else if (hraResultsData.status === 500) {
            // Alert.alert(hraResultsData.error, JSON.stringify(hraResultsData.data));
          }
        } else {
          let scrollItemName;
          switch (this.state.scrollItemActive) {
            case 'Head':
              scrollItemName = 'Body';
              break;
            case 'Body':
              scrollItemName = 'Health';
              break;
            case 'Health':
              scrollItemName = 'Lifestyle';
              break;
            case 'Lifestyle':
              scrollItemName = 'Measurement';
              break;
          }

          this.onTouchScrollItem(scrollItemName);
        }
      }
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  onTouchScrollItem = (scrollItem) => {
    try {
      if (
        this.state.scrollItemActive === 'Health' &&
        typeof this.state.activeTabData !== 'undefined' &&
        typeof this.state.activeTabData[0] !== 'undefined' &&
        typeof this.state.activeTabData[0].subCategory !== 'undefined' &&
        this.state.activeTabData[0].subCategory === 'Health'
      ) {
        this.checkSpecialQuestions('Health');
      }
      if (
        this.state.scrollItemActive === 'Lifestyle' &&
        typeof this.state.activeTabData !== 'undefined' &&
        typeof this.state.activeTabData[0] !== 'undefined' &&
        typeof this.state.activeTabData[0].subCategory !== 'undefined' &&
        this.state.activeTabData[0].subCategory === 'Nutrition'
      ) {
        this.checkSpecialQuestions('Nutrition');
      }

      if (this.state.scrollItemActive !== 'Measurement') {
        this.saveAnswersByApi(
          this.answers,
          this.measurementsAnswers,
          this.specialAnswers,
        );
        console.log('onTouchScrollItem this.answers', this.answers);
        console.log('onTouchScrollItem this.state.answers', this.state.answers);
        this.answers = [];
        this.measurementsAnswers = [];
        this.specialAnswers = [];

        this.hraDetailsRef.clearErrors(true);
        this.hraDetailsRef.scrollToTop();
      }

      this.setState({scrollItemActive: scrollItem});

      this.state.activeData.length = 0;
      this.state.activeTabData.length = 0;
      this.state.tabs.length = 0;

      const activeTabData = [];

      const itemName = scrollItem.toLowerCase() + 'Tabs';

      this.state[itemName].map((data) => {
        Object.keys(data).map((key) => {
          const tabName = key
            .toLowerCase()
            .split(' ')
            .map((a) => a.charAt(0).toUpperCase() + a.substr(1))
            .join(' ');
          if (
            (this.userDetails.profile.gender === 'Male' &&
              tabName !== "Women's Health") ||
            this.userDetails.profile.gender === 'Female'
          ) {
            this.state.tabs.push(tabName);
          }

          this.state.activeData.push(data[key]);

          const innerData = data[key];
          Object.keys(innerData).map((innerKey) => {
            if (innerData[innerKey].subCategory === this.state.tabs[0]) {
              activeTabData.push(innerData[innerKey]);
            }
          });
        });
      });

      this.getWidth();

      if (scrollItem === 'Measurement') {
        this._scrollView.scrollToEnd({animated: false});
        Object.keys(this.state.activeData[0]).map((innerKey) => {
          activeTabData.push(this.state.activeData[0][innerKey]);
        });
      }

      if (scrollItem === 'Head') {
        this._scrollView.scrollTo({x: 0, y: 0, animated: false});
      }

      console.log(
        'onTouchScrollItem activeTabData',
        activeTabData,
        this.state.tabs,
        this.state.activeData,
      );
      this.setState({
        selectedTab: 0,
        activeTabData: this.sort(activeTabData, 'order'),
      });
    } catch (err) {
      this.setState(() => {
        throw err;
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgb(0,168,235)', 'rgb(0,168,235)']}
          start={{x: 0, y: 0}}
          locations={[0.5, 1]}
          end={{x: 1, y: 0}}
          style={{height: 74, width}}>
          <ScrollView
            horizontal={true}
            alwaysBounceHorizontal={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            style={{height: 74, marginTop: 15}}
            ref={(ref) => (this._scrollView = ref)}>
            <HraScrollItem
              text="Head"
              image={require('../resources/icon/head.png')}
              style={{marginLeft: 37}}
              itemActive={this.state.scrollItemActive}
              onPress={this.onTouchScrollItem}
            />
            <HraScrollItem
              text="Body"
              image={require('../resources/icon/bodyCopy.png')}
              itemActive={this.state.scrollItemActive}
              onPress={this.onTouchScrollItem}
            />
            <HraScrollItem
              text="Health"
              image={require('../resources/icon/heartCopy.png')}
              itemActive={this.state.scrollItemActive}
              onPress={this.onTouchScrollItem}
            />
            <HraScrollItem
              text="Lifestyle"
              image={require('../resources/icon/apple.png')}
              itemActive={this.state.scrollItemActive}
              onPress={this.onTouchScrollItem}
            />
            <HraScrollItem
              text="Measurement"
              image={require('../resources/icon/tape.png')}
              style={{marginRight: 40}}
              itemActive={this.state.scrollItemActive}
              onPress={this.onTouchScrollItem}
            />

            <TouchableWithoutFeedback
              onPress={() => Actions.takePhotos({userId: this.userDetails.id})}>
              <View style={{position: 'absolute', left: 10, bottom: 15}}>
                <Image source={require('../resources/icon/changePhoto.png')} />
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </LinearGradient>
        <CardWithShadow
          shadowOpt={{
            width: width,
            height: 48,
            color: '#d3d5d8',
            border: 0,
            radius: 0.1,
            opacity: 0.05, //0.1,
            x: 0,
            y: 0.5,
            style: {height: 48, width, zIndex: 1},
          }}
          styles={[styles.shadow, {height: 48, width}]}>
          <View style={styles.shadow}>
            <MaterialTabs
              ref={(ref) => (this.materialTabs = ref)}
              items={this.state.tabs}
              itemsWidth={this.state.tabsWidth}
              barColor="rgb(250,252,255)"
              selectedIndex={this.state.selectedTab}
              onChange={this.setTab}
              indicatorColor="rgb(0,168,235)"
              activeTextColor="rgb(0,168,235)"
              inactiveTextColor="rgb(138,138,143)"
              textStyle={styles.labelStyle}
              uppercase={false}
              scrollable={true}
            />
          </View>
        </CardWithShadow>
        <View style={styles.container}>
          {this.state.scrollItemActive === 'Measurement' ? (
            <MeasurementScreen
              ref={(child) => {
                this.hraMeasurementsRef = child;
              }}
              data={this.state.activeTabData}
              goNext={this.setTab}
              isLast={this.state.tabs.length === this.state.selectedTab + 1}
              answers={this.state.measurementsAnswers}
              setAnswers={this.setMeasurementAnswers}
              isResultsLoading={this.state.isResultsLoading}
            />
          ) : (
            /*<View /> */
            <HraDetails
              ref={(child) => {
                this.hraDetailsRef = child;
              }}
              gender={this.gender}
              birthYear={this.birthdateYear}
              data={this.state.activeTabData}
              answers={this.state.answers}
              deleteAnswer={this.deleteAnswer}
              medicalConditions={this.hraData.data.medicalConditions}
              injuries={this.hraData.data.injuries}
              allergies={
                this.hraData.data.allergiesPreferences.allergyCategories
              }
              food={this.hraData.data.allergiesPreferences.foods}
              goNext={this.setTab}
              setAnswers={this.setAnswers}
              isFromGetResults={this.state.isFromGetResults}
              setIsFromGetResults={this.setIsFromGetResults}
              specialAnswers={this.state.specialAnswers}
              setSpecialAnswers={this.setSpecialAnswers}
            />
          )}
        </View>

        <Dialog
          visible={this.state.isModalVisible}
          onTouchOutside={() => {
            console.log('onTouchOutside');
            this.setState({isModalVisible: false});
          }}
          onDismiss={() => {
            this.setState({isModalVisible: false});
          }}
          dialogAnimation={scaleAnimation}
          dialogStyle={{
            overflow: 'visible',
            borderRadius: 4,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <DialogContent>
            <View style={styles.modal}>
              <View style={[styles.card, {height: 350, borderRadius: 4}]}>
                <View style={{overflow: 'hidden', borderRadius: 4}}>
                  <Image
                    source={require('../resources/icon/warning_icon2.png')}
                    style={{alignSelf: 'center', marginTop: 41}}
                  />
                  <View
                    style={{
                      width: width,
                      marginTop: 0,
                      alignSelf: 'center',
                      backgroundColor: 'rgb(255,255,255)',
                    }}>
                    <Text style={styles.title}>Save Your PHA</Text>
                    <Text style={styles.text}>
                      Please save your PHA by clicking the button below to
                      update your profile and get latest results.
                    </Text>
                    <View
                      styles={[
                        styles.button,
                        {
                          height: 40,
                          width: width - 175,
                          borderRadius: 22,
                          marginTop: 24,
                          backgroundColor: 'rgb(0,168,235)',
                        },
                      ]}>
                      <TouchableWithoutFeedback
                        onPress={this.onSaveAndGetResultsPress}>
                        <View style={[styles.button, {marginTop: 24}]}>
                          {this.state.isGetResultsLoading ? (
                            <LoadingIndicator isLoading={true} />
                          ) : (
                            <Text style={styles.buttonText}>
                              Save & Get My Result
                            </Text>
                          )}
                        </View>
                      </TouchableWithoutFeedback>
                    </View>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.setState({isModalVisible: false}, () => {
                          if (
                            !this.state.isSavePressed &&
                            typeof condition === 'undefined'
                          ) {
                            // this.props.back();
                            // Actions.pop();

                            setTimeout(() => {
                              Actions.popTo('dashboard');
                            }, 300);

                            Actions.refresh({
                              key: 'dashboard',
                              openDrawer: true,
                            });
                          }
                          this.setState({isSavePressed: false});
                        });
                      }}>
                      <View style={{marginTop: 16, alignSelf: 'center'}}>
                        <Text
                          style={{
                            fontFamily: 'SFProText-Regular',
                            fontSize: 13,
                            fontWeight: '400',
                            color: 'rgb(141,147,151)',
                            alignSelf: 'center',
                            textAlign: 'center',
                          }}>
                          No, thank you!
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: 'rgb(255,255,255)',
  },
  labelStyle: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: -0.08,
  },
  scrollItem: {
    width: 80,
    height: 64,
  },
  scrollText: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: -0.1,
    color: 'rgb(255,255,255)',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 12,
  },
  scrollIcon: {
    tintColor: 'rgb(255,255,255)',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 32,
  },
  shadow: {
    shadowOpacity: 0.1,
    shadowRadius: 0,
    shadowColor: 'rgb(39,56,73)',
    shadowOffset: {height: 0.5, width: 0},
    elevation: 1,
    zIndex: 1,
  },
  modal: {
    width: width,
    height: height,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    fontWeight: '600',
    color: 'rgb(16,16,16)',
    alignSelf: 'center',
    marginTop: 24,
    lineHeight: 22,
  },
  text: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgb(106,111,115)',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
    width: width - 135,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(228,77,77,0.1)',
    alignSelf: 'center',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRound: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 24,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {height: 6, width: 0},
  },
  card: {
    width: width - 55,
    alignSelf: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 32,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {height: 16, width: 0},
  },
  button: {
    width: width - 175,
    height: 40,
    borderRadius: 22,
    backgroundColor: 'rgb(0,168,235)',
    // shadowOpacity: 0.2,
    // shadowRadius: 20,
    // shadowColor: "rgb(0,164,228)",
    // shadowOffset: { height: 10, width: 0 },
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    letterSpacing: -0.4,
    fontWeight: '500',
    color: 'rgb(255,255,255)',
  },
});

import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Actions} from 'react-native-router-flux';
import AppleHealthKit from 'rn-apple-healthkit';
import GoogleFit, {Scopes} from 'react-native-google-fit';

import * as shaefitApi from '../API/shaefitAPI';

const {height, width} = Dimensions.get('window');

class WearablesScreen extends Component {
  constructor() {
    super();

    this.state = {
      steps: 0,
      walkingRunningDistance: 0,
      flightsClimbed: 0,
      caloriesBurned: 0,
      heartRate: 0,
      sleep: 0,

      unit: 'undefined',
    };
  }

  async componentDidMount() {
    // const userDetails = await shaefitApi.getUserDetails();
    // this.setState({unit: userDetails.profile.unit});

    this.refresh();

    // this.setState({unit: this.props.userDetails.profile.unit});
    //
    // console.log('userDetails', this.props.userDetails);
  }

  refresh = async () => {
    if (this.props.userDetails === null && this.state.unit === 'undefined') {
      const userDetails = await shaefitApi.getUserDetails();

      this.setState({unit: userDetails.profile.unit});
    } else {
      this.setState({unit: this.props.userDetails.profile.unit});
    }

    if (Platform.OS === 'ios') {
      this.checkHealthKitPermissions();
    } else {
      this.checkGoogleFitPermissions();
    }
  };

  componentWillReceiveProps(nextProps) {
    // console.log('this.props.router', this.props.refresh);
    this.refresh();
  }

  // getUserMetrics = async () => {
  //   const userDetails = await shaefitApi.getUserDetails();
  //   this.setState({ unit: userDetails.profile.unit });
  //
  //   console.log("userDetails", userDetails);
  // };

  reverseArray = (array) => {
    return array.reverse();
  };

  checkGoogleFitPermissions = () => {
    if (Platform.OS === 'android') {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_LOCATION_READ,
          Scopes.FITNESS_NUTRITION_READ,
          Scopes.FITNESS_BLOOD_PRESSURE_READ,
          Scopes.FITNESS_BLOOD_GLUCOSE_READ,
          Scopes.FITNESS_OXYGEN_SATURATION_READ,
          Scopes.FITNESS_BODY_TEMPERATURE_READ,
          Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ,
          Scopes.FITNESS_SLEEP_READ,
          Scopes.FITNESS_HEART_RATE_READ,
        ],
      };
      GoogleFit.authorize(options)
        .then((res) => {
          console.log('authorized >>>', res);

          if (res.success) {
            let startDate = new Date();
            // startDate.setMonth(startDate.getMonth() - 1);
            const offset = startDate.getTimezoneOffset() / 60;
            // startDate.setDate(startDate.getDate() - 7);
            // startDate.setDate(startDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            // startDate.setHours(startDate.getHours() - offset);
            let endDate = new Date();
            // endDate.setDate(endDate.getDate());
            // endDate.setHours(12, 59, 59, 0);
            // endDate.setHours(endDate.getHours() - offset);
            const dailyStepCountSamplesOptions = {
              startDate: startDate.toISOString(), // required ISO8601Timestamp
              endDate: endDate.toISOString(), // required ISO8601Timestamp
              bucketUnit: 'DAY',
              bucketInterval: 1,
            };

            console.log(
              'GoogleFit.authorize dates',
              startDate.toISOString(),
              endDate.toISOString(),
            );

            console.log(
              'authorized >>>',
              startDate,
              endDate,
              startDate.toISOString(),
              endDate.toISOString(),
            );

            GoogleFit.getDailyStepCountSamples(dailyStepCountSamplesOptions)
              .then(async (res) => {
                console.log('getDailyStepCountSamples123', res);
                for (let i = 0; i < res.length; i++) {
                  if (
                    res[i].source ===
                      'com.google.android.gms:estimated_steps' &&
                    res[i].steps.length !== 0
                  ) {
                    // { source: 'com.google.android.gms:merge_step_deltas',
                    //   steps: [ { date: '2019-09-30', value: 844 } ] },

                    let array = this.reverseArray(res[i].steps);

                    for (let k = 0; k < array.length; k++) {
                      array[k].startDate = array[k].date + 'T00:00:00.000+0300';
                      let date = new Date(array[k].date);
                      date.setDate(date.getDate() + 1);
                      array[k].endDate =
                        date.toISOString().slice(0, 10) + 'T00:00:00.000+0300';
                    }

                    console.log('getDailyStepCountSamples array', array);

                    this.setState({
                      steps: array.length === 0 ? 0 : array[0].value,
                    });
                  }
                }
              })
              .catch((err) => {
                console.warn(err);
              });

            // GoogleFit.getHeartRateSamples(
            //   dailyStepCountSamplesOptions,
            //   async (err, res) => {
            //     if (res !== false) {
            //       let array = this.reverseArray(res);
            //       for (let i = 0; i < res.length; i++) {
            //         for (let k = 0; k < array.length; k++) {
            //           array[k].startDate = array[k].date + 'T00:00:00.000+0300';
            //           let date = new Date(array[k].date);
            //           date.setDate(date.getDate() + 1);
            //           array[k].endDate =
            //             date.toISOString().slice(0, 10) + 'T00:00:00.000+0300';
            //         }
            //
            //         console.log('getHeartRateSamples array', array);
            //
            //         this.setState({
            //           heartRate: array.length === 0 ? 0 : array[0].value,
            //         });
            //       }
            //     }
            //     console.log('Heart rate Samples >>> ', err, res);
            //   },
            // );

            GoogleFit.getActivitySamples({
              ...dailyStepCountSamplesOptions,
              ...{bucketUnit: 'HOUR', bucketInterval: 1},
            }).then(async (res) => {
              console.log('getActivitySamples', res);
              if (res !== false) {
                console.log('getActivitySamples res', res, startDate, endDate);
                let array = this.reverseArray(res);
                console.log('getActivitySamples reversed', array);

                let walkingRunningArray = [];
                let distance = 0;
                let stairsArray = [];
                let stairs = 0;
                let sleepMinutes = 0;

                for (let i = 0; i < array.length; i++) {
                  if (
                    (array[i].activityName === 'walking' ||
                      array[i].activityName === 'running') &&
                    array[i]?.distance
                  ) {
                    walkingRunningArray.push(array[i]);
                    if (distance === 0) {
                      distance += array[i].distance;
                    }
                  }

                  if (
                    array[i].activityName === 'stair_climbing' &&
                    typeof array[i].quantity !== 'undefined'
                  ) {
                    stairsArray.push(array[i]);
                    if (stairs === 0) {
                      stairs += array[i].quantity;
                    }
                  }

                  // if (array[i].activityName.includes('sleep')) {
                  //   sleepMinutes += 1;
                  // }
                }

                this.setState({
                  walkingRunningDistance: distance,
                  flightsClimbed: stairs,
                  // sleep: sleepMinutes,
                });

                console.log('walkingRunningArray', walkingRunningArray);
              }
            });

            GoogleFit.getDailyCalorieSamples({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              basalCalculation: false,
              bucketUnit: 'DAY',
              bucketInterval: 1,
            }).then(async (res) => {
              console.log('getDailyCalorieSamples', res);
              if (res !== false) {
                let array = this.reverseArray(res);
                let calories = array[0].calorie;

                this.setState({caloriesBurned: calories});
              }
            });

            GoogleFit.getSleepSamples({
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            }).then((res) => {
              res.sort(function (a, b) {
                return new Date(b.endDate) - new Date(a.endDate);
              });

              console.log('getSleepSamples', res);

              let sleepMinutes = 0;
              for (let i = 0; i < res.length; i++) {
                let sleepEndDateTZ = new Date(res[i].endDate);
                sleepEndDateTZ.setHours(sleepEndDateTZ.getHours() - offset);
                console.log('sleep date', sleepEndDateTZ.toISOString());

                if (
                  sleepEndDateTZ.toISOString().substring(0, 10) ===
                  endDate.toISOString().substring(0, 10)
                ) {
                  sleepMinutes +=
                    (new Date(res[i].endDate).getTime() -
                      new Date(res[i].startDate).getTime()) /
                    1000 /
                    60;
                } else {
                  break;
                }
              }
              this.setState({sleep: sleepMinutes});
            });
          }
        })
        .catch((err) => {
          console.log('err >>> ', err);
        });
    }
  };

  checkHealthKitPermissions = () => {
    if (Platform.OS === 'ios') {
      const PERMS = AppleHealthKit.Constants.Permissions;
      const options = {
        permissions: {
          read: [
            'Steps',
            'StepCount',
            PERMS.ActiveEnergyBurned,
            'SleepAnalysis',
            PERMS.FlightsClimbed,
            PERMS.DistanceWalkingRunning,
            PERMS.HeartRate,
            PERMS.Workout,
          ],
          write: [],
        },
      };

      let oneDayAgo = new Date();
      oneDayAgo.setMonth(oneDayAgo.getDate() - 1);

      AppleHealthKit.initHealthKit(options, (err, results) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }

        let date = new Date();
        //   date.setHours(0, 0, 0, 0);
        // date.setDate(date.getDate() - 1);
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(17, 0, 0, 0);

        AppleHealthKit.getHourlyStepCount(
          {date: date.toISOString(), interval: 60},
          (err, results) => {
            if (err) {
              console.log('getHourlyStepCount error', err);
              console.log('AppleHealthKit error', err);

              return;
            }
            console.log('getHourlyStepCount', results);

            if (results.length !== 0) {
            }
          },
        );

        let stepOptions = {
          startDate: startDate.toISOString(), //oneMonthAgo.toISOString(), // required
          endDate: new Date().toISOString(),
          limit: 1,
        };

        AppleHealthKit.getDailyStepCountSamples(stepOptions, (err, results) => {
          if (err) {
            console.log('getStepCount error ', err);
            console.log('AppleHealthKit error', err);

            return;
          }

          this.setState({
            steps: results.length === 0 ? 0 : results[0].value,
          });
          console.log('getStepCount results ', results);
        });

        AppleHealthKit.getDailyFlightsClimbedSamples(
          stepOptions,
          (err, results) => {
            if (err) {
              console.log('getDailyFlightsClimbedSamples error ', err);
              console.log('AppleHealthKit error', err);

              return;
            }

            this.setState({
              flightsClimbed: results.length === 0 ? 0 : results[0].value,
            });
            console.log('getDailyFlightsClimbedSamples results ', results);
          },
        );

        AppleHealthKit.getDailyDistanceWalkingRunningSamples(
          stepOptions,
          (err, results) => {
            // AppleHealthKit.getDailyDistanceWalkingRunningSamples(options, async (err, results) => {
            if (err) {
              console.log('getDailyDistanceWalkingRunningSamples error ', err);
              return;
            }

            this.setState({
              walkingRunningDistance:
                results.length === 0 ? 0 : results[0].value,
            });

            console.log(
              'getDailyDistanceWalkingRunningSamples results ',
              results,
            );
          },
        );

        AppleHealthKit.getHourlyActiveEnergyBurned(
          {...stepOptions, ...{interval: 60 * 24}},
          (err, results) => {
            if (err) {
              console.log('getHourlyActiveEnergyBurned error ', err);
              return;
            }

            this.setState({
              caloriesBurned: results.length === 0 ? 0 : results[0].value,
            });

            console.log('getHourlyActiveEnergyBurned results ', results);
          },
        );

        AppleHealthKit.getHeartRateSamples(stepOptions, (err, results) => {
          if (err) {
            console.log('getHeartRateSamples error ', err);
            return;
          }

          this.setState({
            heartRate: results.length === 0 ? 0 : results[0].value,
          });

          console.log('getHeartRateSamples results ', results);
        });

        AppleHealthKit.getSleepSamples(
          {...stepOptions, ...{limit: 10, startDate: yesterday.toISOString()}},
          (err, results) => {
            if (err) {
              console.log('getSleepSamples error ', err);
              return;
            }

            if (results.length !== 0) {
              this.getDate(results[0].startDate);

              let formattedResults = [];

              let minutes = 0;
              const firstDate = results[0].endDate.substring(0, 10);
              console.log('firstDate', firstDate);
              for (let i = 0; i < results.length; i++) {
                if (
                  results[i].value === 'ASLEEP' &&
                  results[i].endDate.startsWith(firstDate)
                ) {
                  let obj = {
                    value: results[i].value,
                    startDate: this.getDate(results[i].startDate),
                    endDate: this.getDate(results[i].endDate),
                  };

                  if (obj.startDate.startsWith(firstDate)) {
                    // minutes +=
                    //   parseInt(obj.endDate.substring(11, 13)) * 60 +
                    //   parseInt(obj.endDate.substring(14, 16)) -
                    //   (parseInt(obj.startDate.substring(11, 13)) * 60 +
                    //     parseInt(obj.startDate.substring(14, 16)));
                    minutes +=
                      new Date(obj.endDate).getTime() / 1000 / 60 -
                      new Date(obj.startDate).getTime() / 1000 / 60;
                  } else {
                    // minutes +=
                    //   parseInt(obj.endDate.substring(11, 13)) * 60 +
                    //   parseInt(obj.endDate.substring(14, 16));

                    minutes +=
                      new Date(obj.endDate).getTime() / 1000 / 60 -
                      new Date(obj.startDate).getTime() / 1000 / 60;
                  }

                  formattedResults.push(obj);
                }
              }

              console.log('formattedResults', formattedResults, minutes);

              this.setState({
                sleep: minutes, //results.length === 0 ? 0 : results[0].value,
              });

              console.log('getSleepSamples results ', results);
            }
          },
        );

        // AppleHealthKit.getSamples(
        //   {
        //     startDate: oneMonthAgo.toISOString(),
        //     endDate: new Date().toISOString(),
        //     type: "Workout",
        //   },
        //   (err, results) => {
        //     if (err) {
        //       console.log("getSamples", err);
        //
        //       return;
        //     }
        //     console.log("getSamples", results);
        //   }
        // );
      });
    }
  };

  getDate = (dateString) => {
    const date = new Date(dateString.substring(0, 19));
    console.log('date', date);

    // let offsetHours = -date.getTimezoneOffset() / 60;
    // date.setHours(date.getHours() - offsetHours);

    console.log('date 2', date);

    if (dateString.substring(23, 24) === '+') {
      date.setHours(date.getHours() + parseInt(dateString.substring(24, 26)));
    } else {
      date.setHours(date.getHours() - parseInt(dateString.substring(24, 26)));
    }

    // date.setHours(date.getHours() + offsetHours);

    console.log('date 3', date.toISOString());

    return date.toISOString().substring(0, 19);
  };

  render() {
    return (
      <View style={{backgroundColor: 'rgb(255,255,255)', flex: 1}}>
        <View style={[styles.rowContainer, {marginTop: 24}]}>
          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'wearablesTracking',
                title: 'Steps',
                unit: this.state.unit,
              })
            }>
            <View style={styles.container}>
              <View style={{margin: 20}}>
                <Image source={require('../resources/icon/stepsCopy.png')} />
                <Text style={styles.title}>Steps</Text>
                <Text style={styles.text}>
                  {parseInt(this.state.steps).toLocaleString('en-US')}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'wearablesTracking',
                title: 'Flights Climbed',
                unit: this.state.unit,
              })
            }>
            <View style={[styles.container, {marginLeft: 15}]}>
              <View style={{margin: 20}}>
                <Image source={require('../resources/icon/floorCopy.png')} />
                <Text style={styles.title}>Flights Climbed</Text>
                <Text style={styles.text}>
                  {parseInt(this.state.flightsClimbed)}
                  <Text style={styles.additionalText}>{' Floor'}</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={[styles.rowContainer, {marginTop: 16}]}>
          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'wearablesTracking',
                title: 'Walk + Run',
                unit: this.state.unit,
              })
            }>
            <View style={styles.container}>
              <View style={{margin: 20}}>
                <Image source={require('../resources/icon/walkRunCopy.png')} />
                <Text style={styles.title}>Walk + Run</Text>
                <Text style={styles.text}>
                  {`${
                    this.state.unit === 'standard'
                      ? parseFloat(
                          (this.state.walkingRunningDistance * 0.621371) / 1000,
                        ).toFixed(2)
                      : parseFloat(
                          this.state.walkingRunningDistance / 1000,
                        ).toFixed(2)
                  }`}
                  <Text style={styles.additionalText}>{`${
                    this.state.unit === 'standard' ? ' Mi' : ' Km'
                  }`}</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'wearablesTracking',
                title: 'Calories Burned',
                unit: this.state.unit,
              })
            }>
            <View style={[styles.container, {marginLeft: 15}]}>
              <View style={{margin: 20}}>
                <Image source={require('../resources/icon/caloriesCopy.png')} />
                <Text style={styles.title}>Calories Burned</Text>
                <Text style={styles.text}>
                  {parseInt(this.state.caloriesBurned).toLocaleString('en-US')}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={[styles.rowContainer, {marginTop: 16}]}>
          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'wearablesTracking',
                title: 'Sleep',
                unit: this.state.unit,
              })
            }>
            <View style={styles.container}>
              <View style={{margin: 20}}>
                <Image source={require('../resources/icon/sleepCopy.png')} />
                <Text style={styles.title}>Sleep</Text>
                <Text style={styles.text}>
                  {Math.floor(this.state.sleep / 60)}
                  <Text style={styles.additionalText}>{'h '}</Text>
                  {parseInt(this.state.sleep % 60)}
                  <Text style={styles.additionalText}>{'m'}</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              Actions.details({
                key: 'wearablesTracking',
                title: 'Heart Rate',
                unit: this.state.unit,
              })
            }>
            <View style={[styles.container, {marginLeft: 15}]}>
              <View style={{margin: 20}}>
                <Image
                  source={require('../resources/icon/heartRateCopy3.png')}
                />
                <Text style={styles.title}>Heart Rate</Text>
                <Text style={styles.text}>
                  {parseInt(this.state.heartRate)}
                  <Text style={styles.additionalText}>{' BPM'}</Text>
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    width: width - 40,
    height: 150,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  container: {
    width: (width - 55) / 2,
    height: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgb(221,224,228)',
  },
  title: {
    fontFamily: 'SFProText-Regular',
    fontWeight: '400',
    fontSize: 14,
    color: 'rgb(106,111,115)',
    marginTop: 28,
  },
  text: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 18,
    color: 'rgb(31,33,35)',
    marginTop: 4,
  },
  additionalText: {
    fontFamily: 'SFProText-Medium',
    fontWeight: '500',
    fontSize: 14,
    color: 'rgb(31,33,35)',
  },
});

export default WearablesScreen;

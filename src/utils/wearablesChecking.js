import {Platform} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import BackgroundTimer from 'react-native-background-timer';
import AppleHealthKit from 'rn-apple-healthkit';
import GoogleFit, {Scopes} from 'react-native-google-fit';

import {getUserVariables, createOrUpdateRealm} from '../data/db/Db';
import * as shaefitApi from '../API/shaefitAPI';

let userVariables = getUserVariables();
if (typeof userVariables !== 'undefined' && userVariables !== null) {
  userVariables = JSON.parse(JSON.stringify(userVariables));
}

export const initWearables = () => {
  checkPermissions();
  if (typeof userVariables !== 'undefined' && userVariables !== null) {
    setTimeout(() => {
      trackDataBackgroundFetch();
    }, 60000);

    setTimeout(() => {
      BackgroundTimer.runBackgroundTimer(async () => {
        //code that will be executed every 10 seconds
        if (Platform.OS === 'ios') {
          checkStepsData();
          checkEnergyBurned();
          checkSleepData();
          checkDistanceWalkingRunningData();
          checkDistanceCyclingData();
          checkHeartRate();
          checkBodyTemperature();
          checkBloodPressure();
          checkGlucose();
        } else {
          checkStepsDataAndroid();
          checkEnergyBurnedAndroid();
          checkHeartRateAndroid();
          checkActivitiesAndroid();
        }

        BackgroundTimer.stopBackgroundTimer();
      }, 30000);
    }, 60000);
  }
};

const checkPermissions = () => {
  if (Platform.OS === 'ios') {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [
          'Steps',
          'StepCount',
          'Weight',
          'Height',
          'BodyFatPercentage',
          PERMS.ActiveEnergyBurned,
          'SleepAnalysis',
          PERMS.DistanceWalkingRunning,
          PERMS.DistanceCycling,
          PERMS.BodyTemperature,
          PERMS.HeartRate,
          PERMS.BloodGlucose,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
          PERMS.FlightsClimbed,
          PERMS.Workout,
        ],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
    });
  } else {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BLOOD_PRESSURE_READ,
        Scopes.FITNESS_BLOOD_GLUCOSE_READ,
        Scopes.FITNESS_SLEEP_READ,
        Scopes.FITNESS_HEART_RATE_READ,
      ],
    };
    GoogleFit.authorize(options).then((res) => {
      console.log('authorized >>>', res);
    });
  }
};

const trackDataBackgroundFetch = () => {
  if (Platform.OS === 'ios') {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: false,
      },
      async () => {
        console.log('[js] Received background-fetch event');
        checkStepsData(); // +
        checkEnergyBurned(); // +
        checkSleepData(); // +
        checkDistanceWalkingRunningData(); // +
        checkDistanceCyclingData(); // +
        checkHeartRate(); // +
        checkBodyTemperature(); // +
        checkBloodPressure();
        checkGlucose();
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start');
      },
    );
  } else {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: false,
      },
      async () => {
        console.log('[js] Received background-fetch event');
        // const userVariables = getUserVariables();
        // if (
        //   typeof userVariables !== "undefined" &&
        //   userVariables !== null &&
        //   userVariables.isGoogleFitLinked !== null &&
        //   userVariables.isGoogleFitLinked
        // ) {
        checkStepsDataAndroid();
        checkEnergyBurnedAndroid();
        checkHeartRateAndroid();
        checkActivitiesAndroid();
        // }
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start');
      },
    );
  }
};

const convertToISOString = (dateString) => {
  // "2020-04-11T15:06:00.000+0300"
  console.log('convertToISOString dateString', dateString);

  let date = new Date(
    dateString.substring(0, 4),
    parseInt(dateString.substring(5, 7)) - 1,
    dateString.substring(8, 10),
    dateString.substring(11, 13),
    dateString.substring(14, 16),
    dateString.substring(17, 19),
  );
  console.log('convertToISOString date', date);
  date = date.toISOString();

  console.log('convertToISOString date2', date);

  return date.substring(0, 19);
};

const checkDate = (dateParam) => {
  let date = dateParam;
  date =
    date.substring(0, 4) +
    '-' +
    date.substring(5, 7) +
    '-' +
    date.substring(8, 10);
  if (
    userVariables.lastDateUpated === null ||
    userVariables.lastDateUpated !== date
  ) {
    userVariables.lastDateUpated = date;

    userVariables.compareStepsData = null;
    userVariables.compareStepsDataAndroid = null;
    userVariables.compareHeartRateData = null;
    userVariables.compareHeartRateDataAndroid = null;
    userVariables.compareSleepData = null;
    userVariables.compareSleepDataAndroid = null;
    userVariables.compareEnergyBurnedData = null;
    userVariables.compareEnergyBurnedDataAndroid = null;
    userVariables.compareBodyTemperatureData = null;
    userVariables.compareBodyTemperatureDataAndroid = null;
    userVariables.compareDistanceWalkingRunningData = null;
    userVariables.compareDistanceWalkingRunningDataAndroid = null;
    userVariables.compareDistanceCyclingData = null;
    userVariables.compareDistanceCyclingDataAndroid = null;
    userVariables.compareBloodGlucoseData = null;
    userVariables.compareBloodGlucoseDataAndroid = null;
    userVariables.compareBloodPressureData = null;
    userVariables.compareBloodPressureDataAndroid = null;

    createOrUpdateRealm('UserVariables', userVariables);
  }
};

const compareResults = (array1, array2) => {
  console.log('compareResults', array1, array2);

  if (array1 === null) {
    return false;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  if (array1.length === array2.length) {
    if (JSON.stringify(array1[0]) === JSON.stringify(array2[0])) {
      return true;
    } else {
      return false;
    }
  }

  return true;
};

const chunkArray = (array, size) => {
  const myArray = [];
  for (let i = 0; i < array.length; i += size) {
    myArray.push(array.slice(i, i + size));
  }

  return myArray;
};

const convertDateIosISO = (dateString) => {
  // '2019-09-30T00:00:00.000+0300'
  // 2020-09-01T12:08:00.000+1000

  console.log('convertDateIosISO initial', dateString);

  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(5, 7));
  const day = parseInt(dateString.substring(8, 10));
  const hours = parseInt(dateString.substring(11, 13));
  const minutes = parseInt(dateString.substring(14, 16));
  const seconds = parseInt(dateString.substring(18, 20));

  console.log('convertDateIosISO', year, month, day, hours, minutes, seconds);

  let isoDate;
  isoDate = new Date(year, month - 1, day, hours, minutes, seconds);
  isoDate = isoDate.toISOString();

  console.log('convertDateIos', isoDate, hours);

  return isoDate.substring(0, 19);
};

const reverseArray = (array) => {
  return array.reverse();
};

const convertToISOStringAndroid = (dateString) => {
  // "2020-04-11T15:06:00.000+0300"
  console.log('convertToISOString dateString', dateString);

  let date = new Date(
    dateString.substring(0, 4),
    parseInt(dateString.substring(5, 7)) - 1,
    dateString.substring(8, 10),
    dateString.substring(11, 13),
    dateString.substring(14, 16),
    dateString.substring(17, 19),
  );
  console.log('convertToISOString date', date);

  let offsetHours = -date.getTimezoneOffset() / 60;
  date.setHours(date.getHours() + offsetHours);
  date.setHours(date.getHours() + offsetHours);

  date = date.toISOString();

  console.log('convertToISOString date2', date);

  return dateString.substring(0, 19);
};

// Wearables data - iOS
const checkStepsData = async () => {
  if (userVariables !== null) {
    console.log(
      'this.userVariables.compareStepsData',
      userVariables.compareStepsData,
    );

    const options = {
      permissions: {
        read: ['Steps', 'StepCount'],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      let options = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      AppleHealthKit.getHourlyStepCount({interval: 1}, (err, results) => {
        if (err) {
          console.log('getHourlyStepCount error', err);
          console.log('AppleHealthKit error', err);

          return;
        }
        console.log('getHourlyStepCount', results);

        if (results.length !== 0) {
          checkDate(results[0].startDate);
          const comparingResult = compareResults(
            JSON.parse(userVariables.compareStepsData),
            results,
          );
          console.log('checkStepsData comparingResult', comparingResult);

          if (!comparingResult) {
            userVariables.compareStepsData = JSON.stringify(results);
            createOrUpdateRealm('UserVariables', userVariables);

            const startDatesArray = [];
            const endDatesArray = [];
            const valuesArray = [];
            const isDayTotalArray = [];

            for (let i = 0; i < results.length; i++) {
              const data = results[i];

              let startDate = convertToISOString(data.startDate);
              let endDate = convertToISOString(data.endDate);
              const value = Math.round(data.value);

              startDatesArray.push(startDate);
              endDatesArray.push(endDate);
              valuesArray.push(value);
              isDayTotalArray.push(0);
            }

            if (startDatesArray.length > 50) {
              let dataObject = [];

              const dateStart = chunkArray(startDatesArray, 50);
              const dateEnd = chunkArray(endDatesArray, 50);
              const value = chunkArray(valuesArray, 50);
              const isDayTotal = chunkArray(isDayTotalArray, 50);

              for (let i = 0; i < dateStart.length; i++) {
                const dataObject = {
                  dateStart: dateStart[i],
                  dateEnd: dateEnd[i],
                  value: value[i],
                  isDayTotal: isDayTotal[i],
                };

                shaefitApi.updateUserTrackData('steps', dataObject);
              }
            } else {
              const dataObject = {
                dateStart: startDatesArray,
                dateEnd: endDatesArray,
                value: valuesArray,
                isDayTotal: isDayTotalArray,
              };

              shaefitApi.updateUserTrackData('steps', dataObject);
            }
          }
        }
      });
    });
  }
};

const checkEnergyBurned = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.ActiveEnergyBurned],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      let options = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      AppleHealthKit.getHourlyActiveEnergyBurned(
        {interval: 1},
        (err, results) => {
          if (err) {
            console.log('getActiveEnergyBurned error ', err);
            return;
          }

          if (results.length !== 0) {
            checkDate(results[0].startDate);
            const comparingResult = compareResults(
              JSON.parse(userVariables.compareEnergyBurnedData),
              results,
            );

            if (!comparingResult) {
              userVariables.compareEnergyBurnedData = JSON.stringify(results);
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < results.length; i++) {
                const data = results[i];

                let startDate = convertToISOString(data.startDate);
                let endDate = convertToISOString(data.endDate);
                const value = data.value * 1000;

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData('calories', dataObject);
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('calories', dataObject);
              }
            }
          }

          console.log('getActiveEnergyBurned results ', results);
        },
      );
    });
  }
};

const checkSleepData = () => {
  if (userVariables !== null) {
    const options = {
      permissions: {
        read: ['SleepAnalysis'],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setHours(0, 0, 0, 0);

      let sleepOptions = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      AppleHealthKit.getSleepSamples(sleepOptions, async (err, results) => {
        if (err) {
          console.log('getSleepSamples error ', err);
          return;
        }

        if (results.length !== 0) {
          checkDate(results[0].endDate);
          const comparingResult = compareResults(
            JSON.parse(userVariables.compareSleepData),
            results,
          );

          if (!comparingResult) {
            const length =
              JSON.parse(userVariables.compareSleepData) === null
                ? 0
                : JSON.parse(userVariables.compareSleepData).length;
            userVariables.compareSleepData = JSON.stringify(results);
            createOrUpdateRealm('UserVariables', userVariables);

            const startDatesArray = [];
            const endDatesArray = [];
            const valuesArray = [];
            const isDayTotalArray = [];

            for (let i = 0; i < results.length - length; i++) {
              const data = results[i];

              const startDate = convertDateIosISO(data.startDate);
              const endDate = convertDateIosISO(data.endDate);
              const value = data.value === 'INBED' ? 1 : 2;

              startDatesArray.push(startDate);
              endDatesArray.push(endDate);
              valuesArray.push(value);
              isDayTotalArray.push(0);
            }

            const dataObject = {
              dateStart: startDatesArray,
              dateEnd: endDatesArray,
              value: valuesArray,
              isDayTotal: isDayTotalArray,
            };

            shaefitApi.updateUserTrackData('sleep', dataObject);
          }
        }

        console.log('getSleep results ', results);
      });
    });
  }
};

const checkDistanceWalkingRunningData = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.DistanceWalkingRunning],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);
      startDate.setHours(startDate.getHours() - offset);
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
      endDate.setHours(endDate.getHours() - offset);
      let options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getHourlyDistanceWalkingRunning(
        {interval: 1},
        async (err, results) => {
          if (err) {
            console.log('getDailyDistanceWalkingRunningSamples error ', err);
            return;
          }

          if (results.length !== 0) {
            checkDate(results[0].startDate);
            const comparingResult = compareResults(
              JSON.parse(userVariables.compareDistanceWalkingRunningData),
              results,
            );

            if (!comparingResult) {
              userVariables.compareDistanceWalkingRunningData = JSON.stringify(
                results,
              );
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < results.length; i++) {
                const data = results[i];

                let startDate = convertToISOString(data.startDate);
                let endDate = convertToISOString(data.endDate);
                const value = data.value;

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData(
                    'distance-walk-run',
                    dataObject,
                  );
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('distance-walk-run', dataObject);
              }
            }
          }

          console.log(
            'getDailyDistanceWalkingRunningSamples results ',
            results,
          );
        },
      );
    });
  }
};

const checkDistanceCyclingData = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.DistanceCycling],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);
      startDate.setHours(startDate.getHours() - offset);
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);
      endDate.setHours(endDate.getHours() - offset);
      let options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getHourlyDistanceCycling(
        {interval: 1},
        async (err, results) => {
          if (err) {
            console.log('getDailyDistanceCyclingSamples error ', err);
            return;
          }

          if (results.length !== 0) {
            checkDate(results[0].startDate);
            const comparingResult = compareResults(
              JSON.parse(userVariables.compareDistanceCyclingData),
              results,
            );

            if (!comparingResult) {
              userVariables.compareDistanceCyclingData = JSON.stringify(
                results,
              );
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < results.length; i++) {
                const data = results[i];

                let startDate = convertToISOString(data.startDate);
                let endDate = convertToISOString(data.endDate);
                const value = data.value;

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData(
                    'distance-cycling',
                    dataObject,
                  );
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('distance-cycling', dataObject);
              }
            }
          }

          console.log('getDailyDistanceCyclingSamples results ', results);
        },
      );
    });
  }
};

const checkHeartRate = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.HeartRate],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      let options = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      console.log('getHeartRateSamples options', options);

      AppleHealthKit.getHeartRateSamples(options, async (err, results) => {
        if (err) {
          console.log('getHeartRateSamples error ', err);
          return;
        }

        if (results.length !== 0) {
          checkDate(results[0].startDate);
          const comparingResult = compareResults(
            JSON.parse(userVariables.compareHeartRateData),
            results,
          );

          if (comparingResult) {
            const length =
              JSON.parse(userVariables.compareHeartRateData) === null
                ? 0
                : JSON.parse(userVariables.compareHeartRateData).length;
            userVariables.compareHeartRateData = JSON.stringify(results);
            createOrUpdateRealm('UserVariables', userVariables);

            const startDatesArray = [];
            const endDatesArray = [];
            const valuesArray = [];
            const isDayTotalArray = [];

            for (let i = 0; i < results.length; i++) {
              const data = results[i];

              const startDate = convertDateIosISO(data.startDate);
              const endDate = convertDateIosISO(data.endDate);
              const value = Math.round(data.value);

              startDatesArray.push(startDate);
              endDatesArray.push(endDate);
              valuesArray.push(value);
              isDayTotalArray.push(0);
            }

            if (startDatesArray.length > 50) {
              let dataObject = [];

              const dateStart = chunkArray(startDatesArray, 50);
              const dateEnd = chunkArray(endDatesArray, 50);
              const value = chunkArray(valuesArray, 50);
              const isDayTotal = chunkArray(isDayTotalArray, 50);

              for (let i = 0; i < dateStart.length; i++) {
                const dataObject = {
                  dateStart: dateStart[i],
                  dateEnd: dateEnd[i],
                  value: value[i],
                  isDayTotal: isDayTotal[i],
                };

                shaefitApi.updateUserTrackData('heart-rate', dataObject);
              }
            } else {
              const dataObject = {
                dateStart: startDatesArray,
                dateEnd: endDatesArray,
                value: valuesArray,
                isDayTotal: isDayTotalArray,
              };

              shaefitApi.updateUserTrackData('heart-rate', dataObject);
            }
          }
        }

        console.log('getHeartRateSamples results ', results);
      });
    });
  }
};

const checkBodyTemperature = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.BodyTemperature],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      let options = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      AppleHealthKit.getBodyTemperatureSamples(
        options,
        async (err, results) => {
          if (err) {
            console.log('getBodyTemperatureSamples error ', err);
            return;
          }

          if (results.length !== 0) {
            checkDate(results[0].startDate);
            const comparingResult = compareResults(
              JSON.parse(userVariables.compareBodyTemperatureData),
              results,
            );

            if (!comparingResult) {
              const length =
                JSON.parse(userVariables.compareBodyTemperatureData) === null
                  ? 0
                  : JSON.parse(userVariables.compareBodyTemperatureData).length;
              userVariables.compareBodyTemperatureData = JSON.stringify(
                results,
              );
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < results.length; i++) {
                const data = results[i];

                let startDate = convertToISOString(data.startDate);
                let endDate = convertToISOString(data.endDate);
                const value = data.value;

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData('body-temp', dataObject);
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('body-temp', dataObject);
              }
            }
          }

          console.log('getBodyTemperatureSamples results ', results);
        },
      );
    });
  }
};

const checkBloodPressure = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.BloodPressureDiastolic, PERMS.BloodPressureSystolic],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      let options = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      AppleHealthKit.getBloodPressureSamples(options, async (err, results) => {
        if (err) {
          console.log('getBloodPressureSamples error ', err);
          return;
        }

        if (results.length !== 0) {
          checkDate(results[0].startDate);
          const comparingResult = compareResults(
            JSON.parse(userVariables.compareBloodPressureData),
            results,
          );

          if (!comparingResult) {
            const length =
              JSON.parse(userVariables.compareBloodPressureData) === null
                ? 0
                : JSON.parse(userVariables.compareBloodPressureData).length;
            userVariables.compareBloodPressureData = JSON.stringify(results);
            createOrUpdateRealm('UserVariables', userVariables);

            const startDatesArray = [];
            const endDatesArray = [];
            const valuesArray = [];
            const valuesArray2 = [];
            const isDayTotalArray = [];

            for (let i = 0; i < results.length; i++) {
              const data = results[i];

              let startDate = convertToISOString(data.startDate);
              let endDate = convertToISOString(data.endDate);
              const value = data.bloodPressureSystolicValue;
              const value2 = data.bloodPressureDiastolicValue;

              startDatesArray.push(startDate);
              endDatesArray.push(endDate);
              valuesArray.push(value);
              valuesArray2.push(value2);
              isDayTotalArray.push(0);
            }

            if (startDatesArray.length > 50) {
              let dataObject = [];

              const dateStart = chunkArray(startDatesArray, 50);
              const dateEnd = chunkArray(endDatesArray, 50);
              const value = chunkArray(valuesArray, 50);
              const value2 = chunkArray(valuesArray2, 50);
              const isDayTotal = chunkArray(isDayTotalArray, 50);

              for (let i = 0; i < dateStart.length; i++) {
                const dataObject = {
                  dateStart: dateStart[i],
                  dateEnd: dateEnd[i],
                  value: value[i],
                  value2: value2[i],
                  isDayTotal: isDayTotal[i],
                };

                shaefitApi.updateUserTrackData('blood-pressure', dataObject);
              }
            } else {
              const dataObject = {
                dateStart: startDatesArray,
                dateEnd: endDatesArray,
                value: valuesArray,
                value2: valuesArray2,
                isDayTotal: isDayTotalArray,
              };

              shaefitApi.updateUserTrackData('blood-pressure', dataObject);
            }
          }
        }

        console.log('getBloodPressureSamples results ', results);
      });
    });
  }
};

const checkGlucose = () => {
  if (userVariables !== null) {
    const PERMS = AppleHealthKit.Constants.Permissions;
    const options = {
      permissions: {
        read: [PERMS.BloodGlucose],
        write: [],
      },
    };

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      let startDate = new Date();
      const offset = startDate.getTimezoneOffset() / 60;
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
      endDate.setHours(0, 0, 0, 0);

      let options = {
        startDate:
          startDate.toISOString().slice(0, 10) + `T00:00:00.000${offset}`, // startDate.toISOString(),
        endDate: endDate.toISOString().slice(0, 10) + `00:00:00.000${offset}`, // endDate.toISOString(),
      };

      AppleHealthKit.getBloodGlucoseSamples(options, async (err, results) => {
        if (err) {
          console.log('getBloodGlucoseSamples error ', err);
          return;
        }

        if (results.length !== 0) {
          checkDate(results[0].startDate);
          const comparingResult = compareResults(
            JSON.parse(userVariables.compareBloodGlucoseData),
            results,
          );

          if (!comparingResult) {
            const length =
              JSON.parse(userVariables.compareBloodGlucoseData) === null
                ? 0
                : JSON.parse(userVariables.compareBloodGlucoseData).length;
            userVariables.compareBloodGlucoseData = JSON.stringify(results);
            createOrUpdateRealm('UserVariables', userVariables);

            const startDatesArray = [];
            const endDatesArray = [];
            const valuesArray = [];
            const isDayTotalArray = [];

            for (let i = 0; i < results.length; i++) {
              const data = results[i];

              let startDate = convertToISOString(data.startDate);
              let endDate = convertToISOString(data.endDate);
              const value = data.value;

              startDatesArray.push(startDate);
              endDatesArray.push(endDate);
              valuesArray.push(value);
              isDayTotalArray.push(0);
            }

            if (startDatesArray.length > 50) {
              let dataObject = [];

              const dateStart = chunkArray(startDatesArray, 50);
              const dateEnd = chunkArray(endDatesArray, 50);
              const value = chunkArray(valuesArray, 50);
              const isDayTotal = chunkArray(isDayTotalArray, 50);

              for (let i = 0; i < dateStart.length; i++) {
                const dataObject = {
                  dateStart: dateStart[i],
                  dateEnd: dateEnd[i],
                  value: value[i],
                  isDayTotal: isDayTotal[i],
                };

                shaefitApi.updateUserTrackData('blood-glucose', dataObject);
              }
            } else {
              const dataObject = {
                dateStart: startDatesArray,
                dateEnd: endDatesArray,
                value: valuesArray,
                isDayTotal: isDayTotalArray,
              };

              shaefitApi.updateUserTrackData('blood-glucose', dataObject);
            }
          }
        }

        console.log('getBloodGlucoseSamples results ', results);
      });
    });
  }
};

// Wearables data - Android
const checkStepsDataAndroid = async () => {
  const options = {
    scopes: [Scopes.FITNESS_ACTIVITY_READ],
  };
  GoogleFit.authorize(options)
    .then((res) => {
      console.log('authorized >>>', res);

      if (res.success) {
        let startDate = new Date();
        const offset = startDate.getTimezoneOffset() / 60;
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date();
        endDate.setHours(23, 59, 59, 0);

        const dailyStepCountSamplesOptions = {
          startDate: startDate.toISOString(), // required ISO8601Timestamp
          endDate: endDate.toISOString(), // required ISO8601Timestamp
          interval: 1,
        };

        console.log(
          'authorized >>>',
          startDate,
          endDate,
          startDate.toISOString(),
          endDate.toISOString(),
        );
        GoogleFit.getDailyStepCountSamples(dailyStepCountSamplesOptions)
          .then(async (res) => {
            console.log('getDailyStepCountSamples', res);
            for (let i = 0; i < res.length; i++) {
              if (
                res[i].source !== 'com.google.android.gms:estimated_steps' &&
                res[i].source !== 'com.google.android.gms:merge_step_deltas' &&
                res[i].steps.length !== 0
              ) {
                let array = reverseArray(res[i].steps);

                const isSame = compareResults(
                  JSON.parse(userVariables.compareStepsDataAndroid),
                  array,
                );
                console.log('getDailyStepCountSamples isSame', isSame);
                if (!isSame) {
                  userVariables.compareStepsDataAndroid = JSON.stringify(array);
                  createOrUpdateRealm('UserVariables', userVariables);

                  const startDatesArray = [];
                  const endDatesArray = [];
                  const valuesArray = [];
                  const isDayTotalArray = [];

                  for (let i = 0; i < array.length; i++) {
                    const data = array[i];

                    const startDate = convertToISOStringAndroid(data.startDate);
                    const endDate = convertToISOStringAndroid(data.endDate);
                    console.log('data.startDate', data.startDate);
                    const value = data.value;

                    startDatesArray.push(startDate);
                    endDatesArray.push(endDate);
                    valuesArray.push(value);
                    isDayTotalArray.push(0);
                  }

                  if (startDatesArray.length > 50) {
                    let dataObject = [];

                    const dateStart = chunkArray(startDatesArray, 50);
                    const dateEnd = chunkArray(endDatesArray, 50);
                    const value = chunkArray(valuesArray, 50);
                    const isDayTotal = chunkArray(isDayTotalArray, 50);

                    for (let i = 0; i < dateStart.length; i++) {
                      const dataObject = {
                        dateStart: dateStart[i],
                        dateEnd: dateEnd[i],
                        value: value[i],
                        isDayTotal: isDayTotal[i],
                      };

                      shaefitApi.updateUserTrackData('steps', dataObject);
                    }
                  } else {
                    const dataObject = {
                      dateStart: startDatesArray,
                      dateEnd: endDatesArray,
                      value: valuesArray,
                      isDayTotal: isDayTotalArray,
                    };

                    shaefitApi.updateUserTrackData('steps', dataObject);
                  }
                }
              }
            }
          })
          .catch((err) => {
            console.warn(err);
          });
      }
    })
    .catch((err) => {
      console.log('err >>> ', err);
    });
};

const checkEnergyBurnedAndroid = async () => {
  const options = {
    scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_BODY_READ],
  };
  GoogleFit.authorize(options)
    .then((res) => {
      console.log('authorized >>>', res);

      if (res.success) {
        let startDate = new Date();
        const offset = startDate.getTimezoneOffset() / 60;
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date();
        endDate.setHours(23, 59, 59, 0);

        const dailyCalorieSamplesOptions = {
          startDate: startDate.toISOString(), // required ISO8601Timestamp
          endDate: endDate.toISOString(), // required ISO8601Timestamp
          basalCalculation: false, // optional, to calculate or not basalAVG over the week
        };

        console.log(
          'authorized >>>',
          startDate,
          endDate,
          startDate.toISOString(),
          endDate.toISOString(),
        );

        GoogleFit.getDailyCalorieSamples(
          dailyCalorieSamplesOptions,
          async (err, res) => {
            if (res !== false) {
              console.log('getDailyCalorieSamples', res);
              let array = reverseArray(res);

              checkDate(array[0].startDate);

              const isSame = compareResults(
                JSON.parse(userVariables.compareEnergyBurnedDataAndroid),
                array,
              );
              if (!isSame) {
                userVariables.compareEnergyBurnedDataAndroid = JSON.stringify(
                  array,
                );
                createOrUpdateRealm('UserVariables', userVariables);

                const startDatesArray = [];
                const endDatesArray = [];
                const valuesArray = [];
                const isDayTotalArray = [];

                for (let i = 0; i < array.length; i++) {
                  const data = array[i];

                  const startDate = convertToISOStringAndroid(data.startDate);
                  const endDate = convertToISOStringAndroid(data.endDate);
                  const value = Math.round(data.calorie); //data.value;

                  startDatesArray.push(startDate);
                  endDatesArray.push(endDate);
                  valuesArray.push(value);
                  isDayTotalArray.push(0);
                }

                if (startDatesArray.length > 50) {
                  let dataObject = [];

                  const dateStart = chunkArray(startDatesArray, 50);
                  const dateEnd = chunkArray(endDatesArray, 50);
                  const value = chunkArray(valuesArray, 50);
                  const isDayTotal = chunkArray(isDayTotalArray, 50);

                  for (let i = 0; i < dateStart.length; i++) {
                    const dataObject = {
                      dateStart: dateStart[i],
                      dateEnd: dateEnd[i],
                      value: value[i],
                      isDayTotal: isDayTotal[i],
                    };

                    shaefitApi.updateUserTrackData('calories', dataObject);
                  }
                } else {
                  const dataObject = {
                    dateStart: startDatesArray,
                    dateEnd: endDatesArray,
                    value: valuesArray,
                    isDayTotal: isDayTotalArray,
                  };

                  shaefitApi.updateUserTrackData('calories', dataObject);
                }
              }
            }
          },
        );
      }
    })
    .catch((err) => {
      console.log('err >>> ', err);
    });
};

const checkHeartRateAndroid = async () => {
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
      Scopes.FITNESS_HEART_RATE_READ,
    ],
  };
  GoogleFit.authorize(options)
    .then((res) => {
      console.log('authorized >>>', res);

      if (res.success) {
        let startDate = new Date();
        const offset = startDate.getTimezoneOffset() / 60;
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date();
        endDate.setHours(23, 59, 59, 0);

        const heartRateSamplesOptions = {
          startDate: startDate.toISOString(), // required ISO8601Timestamp
          endDate: endDate.toISOString(), // required ISO8601Timestamp
        };

        console.log(
          'authorized >>>',
          startDate,
          endDate,
          startDate.toISOString(),
          endDate.toISOString(),
        );

        GoogleFit.getHeartRateSamples(
          heartRateSamplesOptions,
          async (err, res) => {
            console.log('getHeartRateSamples', res);
            if (res !== false) {
              console.log('getHeartRateSamples', res);
              let array = reverseArray(res);

              checkDate(array[0].startDate);

              const isSame = compareResults(
                JSON.parse(userVariables.compareHeartRateDataAndroid),
                array,
              );
              if (!isSame) {
                userVariables.compareHeartRateDataAndroid = JSON.stringify(
                  array,
                );
                createOrUpdateRealm('UserVariables', userVariables);

                const startDatesArray = [];
                const endDatesArray = [];
                const valuesArray = [];
                const isDayTotalArray = [];

                for (let i = 0; i < array.length; i++) {
                  const data = array[i];

                  const startDate = convertToISOStringAndroid(data.startDate);
                  const endDate = convertToISOStringAndroid(data.endDate);
                  const value = Math.round(data.value); //data.value;

                  startDatesArray.push(startDate);
                  endDatesArray.push(endDate);
                  valuesArray.push(value);
                  isDayTotalArray.push(0);
                }

                if (startDatesArray.length > 50) {
                  let dataObject = [];

                  const dateStart = chunkArray(startDatesArray, 50);
                  const dateEnd = chunkArray(endDatesArray, 50);
                  const value = chunkArray(valuesArray, 50);
                  const isDayTotal = chunkArray(isDayTotalArray, 50);

                  for (let i = 0; i < dateStart.length; i++) {
                    const dataObject = {
                      dateStart: dateStart[i],
                      dateEnd: dateEnd[i],
                      value: value[i],
                      isDayTotal: isDayTotal[i],
                    };

                    shaefitApi.updateUserTrackData('heart-rate', dataObject);
                  }
                } else {
                  const dataObject = {
                    dateStart: startDatesArray,
                    dateEnd: endDatesArray,
                    value: valuesArray,
                    isDayTotal: isDayTotalArray,
                  };

                  shaefitApi.updateUserTrackData('heart-rate', dataObject);
                }
              }
            }
          },
        );
      }
    })
    .catch((err) => {
      console.log('err >>> ', err);
    });
};

const checkActivitiesAndroid = async () => {
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_SLEEP_READ,
    ],
  };
  GoogleFit.authorize(options)
    .then((res) => {
      console.log('authorized >>>', res);

      if (res.success) {
        let startDate = new Date();
        const offset = startDate.getTimezoneOffset() / 60;
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date();
        endDate.setHours(23, 59, 59, 0);
        const activitiesOptions = {
          startDate: startDate.toISOString(), // simply outputs the number of milliseconds since the Unix Epoch
          endDate: endDate.toISOString(),
          bucketUnit: 'MINUTE',
          bucketInterval: 1,
        };

        console.log(
          'getActivitySamples authorized >>>',
          startDate,
          endDate,
          startDate.toISOString(),
          endDate.toISOString(),
        );

        GoogleFit.getActivitySamples(activitiesOptions).then((res) => {
          console.log('getActivitySamples', res);
          if (res !== false) {
            console.log('getActivitySamples', res);
            let array = reverseArray(res);

            let bikingArray = [];
            let walkingRunningArray = [];
            for (let i = 0; i < array.length; i++) {
              if (array[i].activityName === 'biking') {
                bikingArray.push(array[i]);
              }
              if (
                array[i].activityName === 'walking' ||
                array[i].activityName === 'running'
              ) {
                walkingRunningArray.push(array[i]);
              }
            }

            const isBikingSame = compareResults(
              JSON.parse(userVariables.compareDistanceCyclingDataAndroid),
              bikingArray,
            );
            if (!isBikingSame) {
              userVariables.compareDistanceCyclingDataAndroid = JSON.stringify(
                bikingArray,
              );
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < bikingArray.length; i++) {
                const value = Math.round(bikingArray[i].distance);

                const startDate = new Date(bikingArray[i].start).toISOString();
                const endDate = new Date(bikingArray[i].end).toISOString();

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData(
                    'distance-cycling',
                    dataObject,
                  );
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('distance-cycling', dataObject);
              }
            }

            const isWalkingRunningSame = compareResults(
              JSON.parse(
                userVariables.compareDistanceWalkingRunningDataAndroid,
              ),
              walkingRunningArray,
            );
            if (!isWalkingRunningSame) {
              userVariables.compareDistanceWalkingRunningDataAndroid = JSON.stringify(
                walkingRunningArray,
              );
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < walkingRunningArray.length; i++) {
                const value = Math.round(walkingRunningArray[i].distance);

                const startDate = new Date(
                  walkingRunningArray[i].start,
                ).toISOString();
                const endDate = new Date(
                  walkingRunningArray[i].end,
                ).toISOString();

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData(
                    'distance-walk-run',
                    dataObject,
                  );
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('distance-walk-run', dataObject);
              }
            }
          }
        });

        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        startDate.setHours(startDate.getHours() - offset);

        endDate = new Date();
        endDate.setDate(endDate.getDate());
        endDate.setHours(0, 0, 0, 0);
        endDate.setHours(endDate.getHours() - offset);
        const sleepOptions = {
          startDate: startDate.toISOString(), // simply outputs the number of milliseconds since the Unix Epoch
          endDate: endDate.toISOString(),
          bucketUnit: 'MINUTE',
          bucketInterval: 1,
        };

        console.log(
          'authorized >>>',
          startDate,
          endDate,
          startDate.toISOString(),
          endDate.toISOString(),
        );

        GoogleFit.getSleepSamples(sleepOptions).then((res) => {
          console.log('getSleepSamples sleepOptions', res);
          if (res !== false) {
            console.log('getSleepSamples sleepOptions', res);
            let array = reverseArray(res);

            let sleepArray = [];
            // for (let i = 0; i < array.length; i++) {
            //   if (array[i].activityName.includes('sleep')) {
            //     sleepArray.push(array[i]);
            //   }
            // }

            const isSleepingSame = compareResults(
              JSON.parse(userVariables.compareSleepDataAndroid),
              sleepArray,
            );
            if (!isSleepingSame) {
              userVariables.compareSleepDataAndroid = JSON.stringify(
                sleepArray,
              );
              createOrUpdateRealm('UserVariables', userVariables);

              const startDatesArray = [];
              const endDatesArray = [];
              const valuesArray = [];
              const isDayTotalArray = [];

              for (let i = 0; i < sleepArray.length; i++) {
                let value;
                if (sleepArray[i].activityName === 'sleep.awake') {
                  value = 1;
                } else if (sleepArray[i].activityName === 'sleep.light') {
                  value = 21;
                } else if (sleepArray[i].activityName === 'sleep.deep') {
                  value = 22;
                } else if (sleepArray[i].activityName === 'sleep.rem') {
                  value = 23;
                } else if (sleepArray[i].activityName === 'sleeping') {
                  value = 2;
                }

                const startDate = new Date(sleepArray[i].start).toISOString();
                const endDate = new Date(sleepArray[i].end).toISOString();

                startDatesArray.push(startDate);
                endDatesArray.push(endDate);
                valuesArray.push(value);
                isDayTotalArray.push(0);
              }

              if (startDatesArray.length > 50) {
                let dataObject = [];

                const dateStart = chunkArray(startDatesArray, 50);
                const dateEnd = chunkArray(endDatesArray, 50);
                const value = chunkArray(valuesArray, 50);
                const isDayTotal = chunkArray(isDayTotalArray, 50);

                for (let i = 0; i < dateStart.length; i++) {
                  const dataObject = {
                    dateStart: dateStart[i],
                    dateEnd: dateEnd[i],
                    value: value[i],
                    isDayTotal: isDayTotal[i],
                  };

                  shaefitApi.updateUserTrackData('sleep', dataObject);
                }
              } else {
                const dataObject = {
                  dateStart: startDatesArray,
                  dateEnd: endDatesArray,
                  value: valuesArray,
                  isDayTotal: isDayTotalArray,
                };

                shaefitApi.updateUserTrackData('sleep', dataObject);
              }
            }
          }
        });
      }
    })
    .catch((err) => {
      console.log('err >>> ', err);
    });
};

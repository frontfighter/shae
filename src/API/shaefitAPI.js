import {Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

import {
  APP_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  GEOCODING_API_KEY,
  PLACE_ID_API_KEY,
  MACHINE_LEARNING_API_KEY,
} from '../../private_keys';

import {
  readRealmRows,
  getUserDetails as getUser,
  createOrUpdateRealm,
} from '../data/db/Db';

// DEV
// let envUrl = 'https://staging-api.ph360.me/v1';
// let tokenUrl = 'https://staging-api.ph360.me/oauth/token';

// PROD
let envUrl = 'https://api.ph360.me/v1';
let tokenUrl = 'https://api.ph360.me/oauth/token';

const CancelToken = axios.CancelToken;
let cancel;

const getDbToken1 = async () => {
  let data = await AsyncStorage.getItem('apiToken');

  data = JSON.parse(data);
  console.log('apiToken', data);
  if (data !== null) {
    return 'Bearer ' + data.access_token;
  } else {
    return 'Bearer ';
  }
};

let token = getDbToken1();
export const getDbToken = async () => {
  return token;
};

export const getToken = async (params) => {
  try {
    console.log('token', params.email, params.password, params);
    const url = tokenUrl;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/json',
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: JSON.stringify({
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        username: params.email,
        password: params.password,
        scope: '*',
      }),
    });

    let responseData;

    if (response.ok) {
      responseData = await response.json();

      token = 'Bearer ' + responseData.access_token;
    } else {
      console.log('(getToken) -> ' + JSON.stringify(response));
      throw new Error('Something went wrong');
    }

    console.log('(getToken) -> ' + JSON.stringify(responseData));

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const checkEmailConfirmed = async (email, username) => {
  const encodedEmail = encodeURIComponent(email);
  const encodedUsername = encodeURIComponent(username);

  const url =
    envUrl +
    `/register/checkConfirmed?email=${encodedEmail}&username=${encodedUsername}`;
  const token = await getDbToken();

  console.log('checkEmailConfirmed url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = await response.json();

    console.log(
      'checkEmailConfirmed GET Response',
      'Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const resendEmailConfirmation = async (email, username) => {
  const url = envUrl + `/register/resendConfirmation`;
  // const token = getDbToken();

  let formBody = [];
  const encodedEmail = encodeURIComponent(email);
  const encodedUsername = encodeURIComponent(username);
  formBody.push('email=' + encodedEmail);
  formBody.push('username=' + encodedUsername);
  formBody = formBody.join('&');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body resendEmailConfirmation -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const subscribeClubToken = async (email, id, code) => {
  const url = envUrl + `/register/subscribeClubToken`;
  // const token = getDbToken();

  let formBody = [];

  let details = {
    email: email,
    user_id: id,
    token: code,
  };

  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  console.log('subscribeClubToken url', url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body subscribeClubToken -> ' + JSON.stringify(responseData),
    );

    return {status: response.ok, data: responseData};
  } catch (e) {
    console.log(e);
  }
};

export const updateUserData = async () => {
  try {
    const url = envUrl + `/user`;
    const data = JSON.parse(JSON.stringify(getUser()));
    const token = await getDbToken();

    let details = {
      'field[firstname]': data.profile.firstname,
      'field[lastname]': data.profile.lastname,
      'field[phone]': data.profile.phone,
      'field[country]': data.profile.country,
      'field[email]': data.profile.email,
      'field[unit]': data.profile.unit,
    };

    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData;

    if (response.ok) {
      responseData = await response.json();
    } else {
      // responseData = await response.json();
      // console.log('(updateUserData) error -> ' + JSON.stringify(responseData));
      throw new Error('Something went wrong');
    }

    console.log('(updateUserData) -> ' + JSON.stringify(responseData));

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getNearestLocations = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2500&type=atm&key=${PLACE_ID_API_KEY}`;
  console.log('getNearestLocations url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    console.log('getNearestLocations response', response);

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getNearestLocations Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getExactLocation = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=${GEOCODING_API_KEY}`;
  console.log('getExactLocation url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    console.log('getExactLocation response', response);

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getExactLocation Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getInfoByPlaceid = async (placeId) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${PLACE_ID_API_KEY}`;
  console.log('getInfoByPlaceid url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    console.log('getInfoByPlaceid response', response);

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getInfoByPlaceid Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const registerUser = async (
  username,
  firstname,
  lastname,
  email,
  gender,
  birthdate,
  mobile,
  country,
  password,
) => {
  try {
    const url = envUrl + '/register';
    console.log(
      'reg json',
      JSON.stringify({
        username,
        firstname,
        lastname,
        email,
        gender,
        birthdate,
        mobile,
        country,
        password,
      }),
    );

    console.log('registerUser url', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/json',
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: JSON.stringify({
        username,
        firstname,
        lastname,
        email,
        gender,
        birthdate,
        mobile,
        country,
        password,
      }),
    });

    console.log('registerUser response', response);

    let responseData;

    if (response.ok) {
      responseData = await response.json();
      // console.log('response', response);
      // responseData = await response.text();
      // if (Platform.OS === 'android') {
      //   responseData = responseData.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
      //   console.log(responseData);
      //   responseData = JSON.parse(responseData);
      // }
    } else {
      console.log('(registerUser) -> ' + JSON.stringify(response));
      responseData = await response.json();
      console.log('(registerUser) -> ' + JSON.stringify(responseData));
      // throw new Error('Something went wrong');
    }

    console.log('(registerUser) -> ' + JSON.stringify(responseData));

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getUserDetails = async () => {
  const url = envUrl + '/user';
  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = await response.json();

    console.log(
      'GET Response getUserDetails',
      'Response Body -> ' + JSON.stringify(responseData),
    );

    if (typeof responseData.hra_last_updated === 'boolean') {
      responseData.hra_last_updated = null;
    }

    if (typeof responseData.track !== 'undefined') {
      responseData.track.fitnessIndex = responseData.track.fitnessIndex.toString();
      responseData.track.waterContent = responseData.track.waterContent.toString();
      responseData.track.BFI = responseData.track.BFI.toString();
      responseData.track.BMI = responseData.track.BMI.toString();
      responseData.track.leanMuscleMass = responseData.track.leanMuscleMass.toString();
    }

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFood = async (
  page,
  category,
  foodType,
  search,
  local,
  dietType,
  pointsMore,
  anyFoodCategory,
) => {
  const setParams = (string, param, name) => {
    if (typeof param !== 'undefined') {
      if (Array.isArray(param)) {
        for (let i = 0; i < param.length; i++) {
          const element = param[i];
          string += `${name}[${i}]=${element}&`;
        }
      } else {
        string += `${name}=${encodeURIComponent(param)}&`;
      }
    }

    return string;
  };

  let params = '?';
  params = setParams(params, page, 'page');
  params = setParams(params, category, 'category');
  params = setParams(params, foodType, 'type');
  params = setParams(params, search, 'search');
  params = setParams(params, local, 'local');
  params = setParams(params, dietType, 'dietType');
  params = setParams(params, pointsMore, 'pointsMore');
  params = setParams(params, anyFoodCategory, 'anyFoodCategory');

  const url = envUrl + '/foods' + params;
  const token = await getDbToken();

  console.log('getFood url', url);
  if (typeof cancel !== 'undefined') {
    cancel();
    cancel = undefined;
  }

  try {
    // const response = await fetch(url, {
    const response = await axios.get(url, {
      method: 'GET',
      cancelToken: new CancelToken((c) => (cancel = c)),
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    // const responseData = await response.json();
    const responseData = response.data;

    console.log(
      'GET Response',
      'getFood Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodById = async (id) => {
  const url = `${envUrl}/foods/${id}?with=weights,properties`;
  const token = await getDbToken();

  console.log('getFoodById url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodById Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodUnits = async () => {
  const url = `${envUrl}/foods/units`;
  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodUnits Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getRecipes = async (
  page,
  course,
  cuisine,
  search,
  importance,
  field,
  dir,
  foodsInclude,
  foodsExclude,
  fav,
  anyFoodCategory,
) => {
  const setParams = (string, param, name) => {
    if (typeof param !== 'undefined') {
      if (Array.isArray(param)) {
        for (let i = 0; i < param.length; i++) {
          const element = param[i];
          string += `${name}[${i}]=${element}&`;
        }
      } else {
        string += `${name}=${encodeURIComponent(param)}&`;
      }
    }

    return string;
  };

  let params = '?';
  params = setParams(params, page, 'page');
  params = setParams(
    params,
    course,
    Array.isArray(course) ? 'course' : 'course[]',
  );
  params = setParams(params, cuisine, 'cuisine');
  params = setParams(params, search, 'search');
  params = setParams(params, importance, 'importance');
  params = setParams(params, field, 'field');
  params = setParams(params, dir, 'dir');
  params = setParams(params, foodsInclude, 'foodsInclude');
  params = setParams(params, foodsExclude, 'foodsExclude');
  params = setParams(params, fav, 'fav');
  params = setParams(params, anyFoodCategory, 'anyFoodCategory');

  const url = envUrl + '/recipes' + params;
  console.log('getRecipes url', url);

  const token = await getDbToken();

  if (typeof cancel !== 'undefined') {
    cancel();
    cancel = undefined;
  }

  try {
    // const response = await fetch(url, {
    const response = await axios.get(url, {
      method: 'GET',
      cancelToken: new CancelToken((c) => (cancel = c)),
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    // const responseData = await response.json();
    const responseData = response.data;

    console.log(
      'GET Response',
      'getRecipes Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getIngredients = async (id) => {
  const url = `${envUrl}/recipes/${id}/ingredients`;
  console.log('getIngredients url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getIngredients Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodDiaryMealPreferences = async (date) => {
  const url = `${envUrl}/food/diary/meal/pref?date=${date}`;
  console.log('getFoodDiaryMealPreferences url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodDiaryMealPreferences Response Body -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodDiaryMealChrono = async (id) => {
  const url = `${envUrl}/food/diary/meal/chrono`;
  console.log('getFoodDiaryMealChrono url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodDiaryMealChrono Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveFoodDiaryMealPreferences = async (array, date) => {
  const url = `${envUrl}/food/diary/meal/pref`;
  const token = await getDbToken();

  let formBody = [];
  // const encodedEmail = encodeURIComponent(email);
  // const encodedUsername = encodeURIComponent(username);
  // formBody.push("email=" + encodedEmail);
  if (typeof date !== 'undefined') {
    formBody.push('date=' + date);
  }

  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].include) {
        console.log('array[i]', array[i]);
        const value = encodeURIComponent(array[i].id);
        formBody.push('mealplan_id[' + i + ']=' + value);
      } else {
      }
    }
  }

  formBody = formBody.join('&');

  console.log('saveFoodDiaryMealPreferences formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body saveFoodDiaryMealPreferences -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const deleteMealPreference = async (id) => {
  const url = `${envUrl}/food/diary/meal/pref?id=${id}`;
  const token = await getDbToken();

  console.log('deleteMealPreference url', url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'DELETE Response',
      'deleteMealPreference Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getWaterIntake = async (date) => {
  const url = `${envUrl}/water/intake?date=${date}`;
  console.log('getWaterIntake url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getWaterIntake Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveWaterIntake = async (object) => {
  const url = `${envUrl}/water/intake`;
  const token = await getDbToken();

  let formBody = [];
  for (let property in object) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(object[property]);

    formBody.push(encodedKey + '=' + encodedValue);
  }

  formBody = formBody.join('&');

  console.log('saveWaterIntake formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body saveWaterIntake -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getListFoodDiaries = async (date) => {
  const url = `${envUrl}/food/diary?date=${date}`;
  console.log('getListFoodDiaries url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getListFoodDiaries Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getDailyGoals = async () => {
  const url = `${envUrl}/food/diary/goal`;
  console.log('getDailyGoals url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getDailyGoals Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveDiaryGoal = async (object) => {
  const url = `${envUrl}/food/diary/goal`;
  const token = await getDbToken();

  let formBody = [];
  for (let property in object) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(object[property]);

    formBody.push(encodedKey + '=' + encodedValue);
  }

  formBody = formBody.join('&');

  console.log('saveDiaryGoal formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body saveDiaryGoal -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveSavedMeals = async (object) => {
  const url = `${envUrl}/savedmeals`;
  const token = await getDbToken();

  // let formBody = [];
  let formBody = new FormData();
  // console.log('imageName', data.fileName)
  // formBody.append('image', {
  //   uri: data.url,
  //   name: data.fileName,
  //   type: `image/${format[1]}`
  // });

  for (let property in object) {
    if (Array.isArray(object[property])) {
      let encodedKey = encodeURIComponent(property);
      const array = object[property];
      for (let i = 0; i < array.length; i++) {
        // formBody.push(`foods[${i}][id]=${object[property][i].id}`);
        // formBody.push(`foods[${i}][name]=${object[property][i].name}`);
        // formBody.push(`foods[${i}][amount]=${object[property][i].amount}`);
        // formBody.push(`foods[${i}][cals]=${object[property][i].kcal}`);
        // formBody.push(`foods[${i}][unit_id]=${object[property][i].unit.id}`);
        // formBody.push(`foods[${i}][rating]=${object[property][i].user_importance_val}`);
        // formBody.push(`foods[${i}][sort_order]=${i + 1}`);
        formBody.append(`foods[${i}][id]`, object[property][i].id);
        formBody.append(`foods[${i}][name]`, object[property][i].name);
        formBody.append(
          `foods[${i}][amount]`,
          object[property][i].amount === '1/2' ? 1 : object[property][i].amount,
        );
        formBody.append(`foods[${i}][cals]`, object[property][i].kcal);
        formBody.append(`foods[${i}][unit_id]`, object[property][i].unit.id);
        formBody.append(
          `foods[${i}][rating]`,
          object[property][i].user_importance_val,
        );
        formBody.append(`foods[${i}][sort_order]`, i + 1);
      }
    } else {
      if (property === 'photo') {
        if (object[property].uri !== '') {
          formBody.append('photo', {
            name: object[property].name,
            type: object[property].type,
            uri: object[property].uri,
          });
        }
      } else {
        // let encodedKey = encodeURIComponent(property);
        // let encodedValue = encodeURIComponent(object[property]);

        // formBody.push(encodedKey + "=" + encodedValue);

        formBody.append(property, object[property]);
      }
    }
  }

  // formBody = formBody.join("&");

  console.log('saveSavedMeals formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body saveSavedMeals -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getSavedMeals = async (page, sort, dir, search) => {
  const url = `${envUrl}/savedmeals?page=${page}${
    typeof sort !== 'undefined' ? '&sort=' + sort : ''
  }${typeof dir !== 'undefined' ? '&dir=' + dir : ''}${
    typeof search !== 'undefined' && search !== '' ? '&search=' + search : ''
  }`;
  console.log('getSavedMeals url', url);

  const token = await getDbToken();

  if (typeof cancel !== 'undefined') {
    cancel();
    cancel = undefined;
  }

  try {
    // const response = await fetch(url, {
    const response = await axios.get(url, {
      method: 'GET',
      cancelToken: new CancelToken((c) => (cancel = c)),
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    // const responseData = await response.json();
    const responseData = response.data;

    console.log(
      'GET Response',
      'getSavedMeals Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveFoodDiaryDay = async (object) => {
  const url = `${envUrl}/food/diary`;
  const token = await getDbToken();

  let formBody = [];
  for (let property in object) {
    if (Array.isArray(object[property])) {
      console.log('saveFoodDiaryDay array', array);
      let encodedKey = encodeURIComponent(property);
      const array = object[property];
      for (let i = 0; i < array.length; i++) {
        formBody.push(`foods[${i}][id]=${object[property][i].id}`);
        formBody.push(`foods[${i}][name]=${object[property][i].name}`);
        formBody.push(
          `foods[${i}][amount]=${
            object[property][i].amount === '1/2'
              ? 1
              : object[property][i].amount
          }`,
        );
        formBody.push(`foods[${i}][cals]=${object[property][i].kcal}`);
        formBody.push(`foods[${i}][unit_id]=${object[property][i].unit.id}`);
        formBody.push(
          `foods[${i}][rating]=${object[property][i].user_importance_val}`,
        );
        formBody.push(`foods[${i}][sort_order]=${i + 1}`);
      }
    } else {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(object[property]);

      formBody.push(encodedKey + '=' + encodedValue);
    }
  }

  formBody = formBody.join('&');

  console.log('saveFoodDiaryDay object', object);
  console.log('saveFoodDiaryDay formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body saveFoodDiaryDay -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveFoodDiaryDay2 = async (object) => {
  const url = `${envUrl}/food/diary`;
  const token = await getDbToken();

  let formBody = [];
  for (let property in object) {
    if (Array.isArray(object[property])) {
      let encodedKey = encodeURIComponent(property);
      const array = object[property];
      for (let i = 0; i < array.length; i++) {
        formBody.push(`foods[${i}][id]=${object[property][i].id}`);
        formBody.push(`foods[${i}][name]=${object[property][i].name}`);
        formBody.push(
          `foods[${i}][amount]=${
            object[property][i].amount === '1/2'
              ? 1
              : object[property][i].amount
          }`,
        );
        formBody.push(`foods[${i}][cals]=${object[property][i].kcal}`);
        formBody.push(`foods[${i}][unit_id]=${object[property][i].unit.id}`);
        formBody.push(
          `foods[${i}][rating]=${object[property][i].user_importance_val}`,
        );
        formBody.push(`foods[${i}][sort_order]=${i + 1}`);
      }
    } else {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(object[property]);

      formBody.push(encodedKey + '=' + encodedValue);
    }
  }

  formBody = formBody.join('&');

  console.log('saveFoodDiaryDay object', object);
  console.log('saveFoodDiaryDay formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body saveFoodDiaryDay -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const addFoodDiaryEntry = async (diaryId, food, arrayLength) => {
  const url = `${envUrl}/food/diary/${diaryId}/entry`;
  const token = await getDbToken();

  let formBody = [];
  formBody.push(`foods[0][id]=${food.id}`);
  formBody.push(`foods[0][name]=${food.name}`);
  formBody.push(`foods[0][amount]=${food.amount}`);
  formBody.push(`foods[0][cals]=${food.kcal}`);
  formBody.push(`foods[0][unit_id]=${food.unit.id}`);
  formBody.push(`foods[0][rating]=${food.user_importance_val}`);
  formBody.push(`foods[0][sort_order]=${arrayLength}`);

  formBody = formBody.join('&');

  console.log('addFoodDiaryEntry url', url);
  console.log('addFoodDiaryEntry formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body addFoodDiaryEntry -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const deleteFoodFromDiary = async (foodDiaryId, foodDiaryEntryId) => {
  const url = `${envUrl}/food/diary/${foodDiaryId}/entry/${foodDiaryEntryId}`;
  const token = await getDbToken();

  console.log('deleteFoodFromDiary url', url);
  console.log(foodDiaryId, foodDiaryEntryId);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      // body: formBody
    });

    let responseData = await response.json();

    console.log(
      'DELETE Response',
      'Response Body deleteFoodFromDiary -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const deleteFoodFromSavedMeal = async (mealId, foodId) => {
  const url = `${envUrl}/savedmeals/${mealId}/foods`;
  const token = await getDbToken();

  console.log('deleteFoodFromSavedMeal url', url);

  let formBody = [];
  formBody.push(`foods[0][id]=${foodId}`);

  formBody = formBody.join('&');

  console.log(mealId, foodId);
  console.log('deleteFoodFromSavedMeal formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'DELETE Response',
      'Response Body deleteFoodFromSavedMeal -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const deleteSavedMeal = async (id) => {
  const url = `${envUrl}/savedmeals/${id}`;
  const token = await getDbToken();

  console.log('SavedMeal url', url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'DELETE Response',
      'deleteSavedMeal Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodDiaryHistory = async (page) => {
  const url = `${envUrl}/food/diary/history?page=${page}`;
  console.log('getFoodDiaryHistory url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodDiaryHistory Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const updateSavedMeals = async (id, object) => {
  const url = `${envUrl}/savedmeals/${id}`;
  const token = await getDbToken();

  // let formBody = [];
  let formBody = new FormData();
  for (let property in object) {
    if (Array.isArray(object[property])) {
      let encodedKey = encodeURIComponent(property);
      const array = object[property];
      for (let i = 0; i < array.length; i++) {
        // formBody.push(`foods[${i}][id]=${object[property][i].id}`);
        // formBody.push(`foods[${i}][name]=${object[property][i].name}`);
        // formBody.push(`foods[${i}][amount]=${(object[property][i].amount === '1/2') ? 1 : object[property][i].amount}`);
        // formBody.push(`foods[${i}][cals]=${object[property][i].kcal}`);
        // formBody.push(`foods[${i}][unit_id]=${object[property][i].unit.id}`);
        // formBody.push(`foods[${i}][rating]=${object[property][i].user_importance_val}`);
        // formBody.push(`foods[${i}][sort_order]=${i + 1}`);

        formBody.append(`foods[${i}][id]`, object[property][i].id);
        formBody.append(`foods[${i}][name]`, object[property][i].name);
        formBody.append(
          `foods[${i}][amount]`,
          object[property][i].amount === '1/2' ? 1 : object[property][i].amount,
        );
        formBody.append(`foods[${i}][cals]`, object[property][i].kcal);
        formBody.append(`foods[${i}][unit_id]`, object[property][i].unit.id);
        formBody.append(
          `foods[${i}][rating]`,
          object[property][i].user_importance_val,
        );
        formBody.append(`foods[${i}][sort_order]`, i + 1);
      }
    } else {
      if (property === 'photo') {
        if (object[property].uri !== '') {
          formBody.append('photo', {
            name: object[property].name,
            type: object[property].type,
            uri: object[property].uri,
          });
        }
      } else {
        // let encodedKey = encodeURIComponent(property);
        // let encodedValue = encodeURIComponent(object[property]);
        //
        // formBody.push(encodedKey + "=" + encodedValue);
        formBody.append(property, object[property]);
      }
    }
  }

  // formBody = formBody.join("&");

  console.log('updateSavedMeals formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body updateSavedMeals -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const addFoodDiaryEntries = async (diaryId, foods) => {
  const url = `${envUrl}/food/diary/${diaryId}/entry`;
  const token = await getDbToken();

  let formBody = [];
  for (let i = 0; i < foods.length; i++) {
    formBody.push(`foods[${i}][id]=${foods[i].id}`);
    formBody.push(`foods[${i}][name]=${foods[i].name}`);
    formBody.push(`foods[${i}][amount]=${foods[i].amount}`);
    formBody.push(`foods[${i}][cals]=${foods[i].kcal}`);
    formBody.push(`foods[${i}][unit_id]=${foods[i].unit.id}`);
    formBody.push(`foods[${i}][rating]=${foods[i].user_importance_val}`);
    formBody.push(`foods[${i}][sort_order]=${i + 1}`);
  }

  formBody = formBody.join('&');

  console.log('addFoodDiaryEntries url', url);
  console.log('addFoodDiaryEntries formBody', formBody);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body addFoodDiaryEntries -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodRatingsStats = async (data) => {
  let fromDate = '';
  let toDate = '';
  if (Array.isArray(data)) {
    fromDate = data[0];
    toDate = data[1];
  } else {
    fromDate = data;
    toDate = data;
  }

  const url = `${envUrl}/food/diary/stats/ratings?from_date=${fromDate}&to_date=${toDate}`;
  console.log('getFoodRatingsStats url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodRatingsStats Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getFoodRatingsStatsFoods = async (data) => {
  let fromDate = '';
  let toDate = '';
  if (Array.isArray(data)) {
    fromDate = data[0];
    toDate = data[1];
  } else {
    fromDate = data;
    toDate = data;
  }

  const url = `${envUrl}/food/diary/stats/ratings/foods?from_date=${fromDate}&to_date=${toDate}`;
  console.log('getFoodRatingsStatsFoods url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getFoodRatingsStatsFoods Response Body -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const updateTimeConsumed = async (diaryId, hours, minutes) => {
  const url = `${envUrl}/food/diary/${diaryId}?time_consumed=${hours}:${minutes}`;
  const token = await getDbToken();

  console.log('updateTimeConsumed url', url);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      // body: formBody
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body updateTimeConsumed -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getMicronutrientsStats = async (data) => {
  let fromDate = '';
  let toDate = '';
  if (Array.isArray(data)) {
    fromDate = data[0];
    toDate = data[1];
  } else {
    fromDate = data;
    toDate = data;
  }

  const url = `${envUrl}/food/diary/stats/nutrients/micro?from_date=${fromDate}&to_date=${toDate}`;
  console.log('getMicronutrientsStats url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getMicronutrientsStats Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getMacronutrientsStats = async (data) => {
  let fromDate = '';
  let toDate = '';
  if (Array.isArray(data)) {
    fromDate = data[0];
    toDate = data[1];
  } else {
    fromDate = data;
    toDate = data;
  }

  const url = `${envUrl}/food/diary/stats/nutrients/macro?from_date=${fromDate}&to_date=${toDate}`;
  console.log('getMacronutrientsStats url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getMacronutrientsStats Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getMacronutrientsMealsStats = async (data) => {
  let fromDate = '';
  let toDate = '';
  if (Array.isArray(data)) {
    fromDate = data[0];
    toDate = data[1];
  } else {
    fromDate = data;
    toDate = data;
  }

  const url = `${envUrl}/food/diary/stats/nutrients/meals?from_date=${fromDate}&to_date=${toDate}`;
  console.log('getMacronutrientsMealsStats url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getMacronutrientsMealsStats Response Body -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getCaloriesStats = async (data) => {
  let fromDate = '';
  let toDate = '';
  if (Array.isArray(data)) {
    fromDate = data[0];
    toDate = data[1];
  } else {
    fromDate = data;
    toDate = data;
  }

  const url = `${envUrl}/food/diary/stats/cals?from_date=${fromDate}&to_date=${toDate}`;
  console.log('getCaloriesStats url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getCaloriesStats Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getTips = async (topic, date) => {
  const url = `${envUrl}/tips?topic=${topic}&date=${date}`;
  console.log('getTips url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getTips Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// HRA

export const getHraSchema = async (get) => {
  const url = `${envUrl}/hra/schema?get=${get}`;
  console.log('getHraSchema url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getHraSchema Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getHra = async () => {
  const url = `${envUrl}/hra`;
  console.log('getHra url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getHra Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getHraResults = async () => {
  const url = `${envUrl}/hra/results`;
  console.log('getHraResults url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    console.log('getHraResults response', response);

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getHraResults Response Body -> ' + JSON.stringify(responseData),
    );

    // return responseData;
    return {...{status: response.status}, ...responseData}; //response.status;
  } catch (e) {
    console.log(e);
  }
};

export const getLastMeasurementsComparison = async () => {
  const url = envUrl + '/user/track/compareLast';
  const token = await getDbToken();

  console.log('getLastMeasurementsComparison url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = await response.json();

    console.log(
      'GET Response',
      'getLastMeasurementsComparison Response Body -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const saveHraResponses = async (body) => {
  const url = envUrl + '/hra';
  const token = await getDbToken();

  console.log('saveHraResponses url', url, token);

  try {
    let formBody = [];
    for (let i = 0; i < body.questions.length; i++) {
      if (
        body.questions[i].questionId === 162 &&
        body.questions[i].values[0] === '-488'
      ) {
        console.log('body.questions[i]', body.questions[i]);

        const data = await getInfoByPlaceid(body.questions[i].placeId);
        const coordinates =
          '' +
          data.result.geometry.location.lat +
          ',' +
          data.result.geometry.location.lng;
      }

      for (let property in body.questions[i]) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(
          property === 'freetext' && body.questions[i][property] === null
            ? ''
            : body.questions[i][property],
        );

        if (property !== 'placeId')
          if (property === 'values') {
            if (Array.isArray(body.questions[i].values[0])) {
              console.log('value', body.questions[i].values);

              for (let k = 0; k < body.questions[i].values.length; k++) {
                for (let l = 0; l < body.questions[i].values[k].length; l++) {
                  console.log(
                    'body.questions[i].values[k][l]',
                    body.questions[i].values[k][l],
                  );
                  const value = encodeURIComponent(
                    body.questions[i].values[k][l],
                  );
                  formBody.push(
                    'questions[' +
                      i +
                      ']' +
                      '[' +
                      encodedKey +
                      '][' +
                      k +
                      '][' +
                      l +
                      ']=' +
                      value,
                  );
                }
              }
            } else {
              for (let k = 0; k < body.questions[i].values.length; k++) {
                const value = encodeURIComponent(body.questions[i].values[k]);
                formBody.push(
                  'questions[' +
                    i +
                    ']' +
                    '[' +
                    encodedKey +
                    '][' +
                    k +
                    ']=' +
                    value,
                );
              }
            }
          } else if (
            property === 'freetext' &&
            Array.isArray(body.questions[i][property])
          ) {
            for (let k = 0; k < body.questions[i].freetext.length; k++) {
              const value = encodeURIComponent(body.questions[i].freetext[k]);
              formBody.push(
                'questions[' +
                  i +
                  ']' +
                  '[' +
                  encodedKey +
                  '][' +
                  k +
                  ']=' +
                  value,
              );
            }
          } else {
            formBody.push(
              'questions[' + i + ']' + '[' + encodedKey + ']=' + encodedValue,
            );
          }
      }
    }

    for (let i = 0; i < body.measurements.length; i++) {
      for (let property in body.measurements[i]) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(body.measurements[i][property]);

        formBody.push(
          'measurements[' + i + ']' + '[' + encodedKey + ']=' + encodedValue,
        );
      }
    }

    for (let i = 0; i < body.specialQuestions.length; i++) {
      for (let property in body.specialQuestions[i]) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(
          body.specialQuestions[i][property],
        );

        if (property === 'values') {
          if (typeof body.specialQuestions[i].values[0] === 'object') {
            console.log('value', body.specialQuestions[i].values);

            for (let k = 0; k < body.specialQuestions[i].values.length; k++) {
              Object.keys(body.specialQuestions[i].values[k]).map((key) => {
                console.log(
                  'body.specialQuestions[i].values[k][l]',
                  body.specialQuestions[i].values[k][key],
                );
                const value = encodeURIComponent(
                  body.specialQuestions[i].values[k][key],
                );
                formBody.push(
                  'specialQuestions[' +
                    i +
                    ']' +
                    '[' +
                    encodedKey +
                    '][' +
                    k +
                    '][' +
                    key +
                    ']=' +
                    value,
                );
              });
            }
          } else {
            for (let k = 0; k < body.specialQuestions[i].values.length; k++) {
              const value = encodeURIComponent(
                body.specialQuestions[i].values[k],
              );
              formBody.push(
                'specialQuestions[' +
                  i +
                  ']' +
                  '[' +
                  encodedKey +
                  '][' +
                  k +
                  ']=' +
                  value,
              );
            }
          }
        } else {
          formBody.push(
            'specialQuestions[' +
              i +
              ']' +
              '[' +
              encodedKey +
              ']=' +
              encodedValue,
          );
        }
      }
    }

    formBody = formBody.join('&');
    console.log('saveHraResponses formBody', formBody);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody, //JSON.stringify(body)
    });

    let responseData;

    console.log('saveHraResponses response', response);

    if (response.ok) {
      responseData = await response.json();
    } else {
      responseData = await response.json();
      console.log('(saveHraResponses) -> ' + JSON.stringify(responseData));
      throw new Error('Something went wrong');
    }

    console.log('(saveHraResponses) -> ' + JSON.stringify(responseData));

    return responseData;
  } catch (e) {
    console.log('saveHraResponses', e);
  }
};

// Pilot surveys

export const getPilotSurveyHistory = async (dateFrom, dateTo) => {
  const url = `${envUrl}/user/track/pilotsurvey?date_from=${dateFrom}&date_to=${dateTo}`;
  const token = await getDbToken();

  console.log('getPilotSurveyHistory url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = await response.json();

    console.log(
      'GET Response',
      'getPilotSurveyHistory Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getPilotSurveyHistoryByType = async (dateFrom, dateTo, type) => {
  const url = `${envUrl}/user/track/pilotsurvey/${type}?date_from=${dateFrom}&date_to=${dateTo}`;
  const token = await getDbToken();

  console.log('getPilotSurveyHistoryByType url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = await response.json();

    console.log(
      'GET Response',
      'getPilotSurveyHistoryByType Response Body -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// Login flow

export const requestPasswordRecovery = async (email) => {
  const url = envUrl + '/user/password/recoverEmail';

  let formBody = [];
  const encodedKey = encodeURIComponent('email');
  const encodedValue = encodeURIComponent(email);
  formBody.push(encodedKey + '=' + encodedValue);
  formBody = formBody.join('&');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData = await response.json();

    console.log(
      'POST Response',
      'Response Body requestPasswordRecovery -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// Tracking history

export const getTrackingHistoryByType = async (dateFrom, dateTo, type) => {
  const url = `${envUrl}/user/track/${type}?date_from=${dateFrom}&date_to=${dateTo}`;
  const token = await getDbToken();

  console.log('getTrackingHistoryByType url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = await response.json();

    console.log(
      'GET Response',
      'getTrackingHistoryByType Response Body -> ' +
        JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const getVimeoUrls = async (id) => {
  const url = `${envUrl}/vimeo/${id}`;
  console.log('getVimeoUrls url', url);

  const token = await getDbToken();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();

    console.log(
      'GET Response',
      'getVimeoUrls Response Body -> ' + JSON.stringify(responseData),
    );

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// Update wearables data
export const updateUserTrackData = async (type, dataObject) => {
  try {
    const url = `${envUrl}/user/track/${type}`;
    const token = await getDbToken();
    const uid = DeviceInfo.getUniqueID();

    if (type === 'steps') {
      console.log('updateUserTrackData url', url, type);
      console.log('updateUserTrackData object', JSON.stringify(dataObject));
    }

    if (type === 'heart-rate') {
      // distance-cycling distance-walk-run
      console.log('updateUserTrackData url', url, type);
      console.log('updateUserTrackData object', JSON.stringify(dataObject));
    }

    let formBody = [];
    if (typeof dataObject === 'object') {
      for (let property in dataObject) {
        if (
          Array.isArray(dataObject[property]) &&
          dataObject[property].length !== 0
        ) {
          for (let i = 0; i < dataObject[property].length; i++) {
            // let encodedKey = encodeURIComponent(`${property}[${i}]`);
            // let encodedValue = encodeURIComponent(`${dataObject[property][i]}`);
            let encodedKey = `${property}[${i}]`;
            let encodedValue = `${dataObject[property][i]}`;

            formBody.push(encodedKey + '=' + encodedValue);
          }
        }
        // let encodedKey = encodeURIComponent('setting[' + property + ']');
        // let encodedValue = encodeURIComponent(data[property]);
        // formBody.push(encodedKey + "=" + encodedValue);
      }
    }

    formBody.push('deviceId=' + uid);
    formBody = formBody.join('&');

    // if (type === "steps") {
    if (type === 'heart-rate') {
      // if (type === 'blood-glucose') {
      console.log('(updateUserTrackData) formBody -> ' + type + formBody);
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      body: formBody,
    });

    let responseData;
    // if (type === 'steps') {
    if (type === 'steps') {
      console.log('(updateUserTrackData) -> ' + type + response);
    }

    if (response.ok) {
      responseData = await response.json();
      // if (type === 'steps') {
      if (type === 'steps') {
        // if (type === "heart-rate") {
        console.log(
          '(updateUserTrackData) -> ' + type + JSON.stringify(responseData),
        );
      }
    } else {
      responseData = await response.json();
      // if (type === 'steps') {
      if (type === 'steps') {
        console.log(
          '(updateUserTrackData) error -> ' +
            type +
            JSON.stringify(responseData),
        );
      }
      throw new Error('Something went wrong');
    }

    // if (type === 'steps') {
    if (type === 'steps') {
      console.log('(updateUserTrackData) -> ' + type + response);
    }

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

//
export const uploadUserImage = async (data) => {
  try {
    console.log('uploadUserImage imageUrl', data.image);
    const url = `${envUrl}/user/image`;
    const token = await getDbToken();

    //     {
    //   uri: 'file:///private/var/mobile/Containers/Data/Application/D7944A3E-0640-4BC7-814B-4971D3544544/tmp/react-native-image-crop-picker/40AD24C8-CEF8-4355-90D6-6B9B80BE0821.jpg',
    //   name: '1.jpg',
    //   type: 'image/jpg'
    // }

    // file:///var/mobile/Containers/Data/Application/D7944A3E-0640-4BC7-814B-4971D3544544/Library/Caches/Camera/525268E8-DBC9-45CA-BFFF-C529CBDD922C.jpg

    let formBody = new FormData();
    // console.log("imageName", data.fileName);
    // const format = data.fileName.split(".");
    formBody.append('title', data.title);
    // if (typeof data.base64 !== "undefined") {
    //   formBody.append("image", data.image);
    // } else {

    let imageName = data.image.split('/');
    formBody.append('image', {
      uri: data.image,
      name: imageName[imageName.length - 1],
      type: 'image/jpg',
    });
    // }

    // formBody.append("image", data.image);

    console.log('formBody', formBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      mimeType: 'multipart/form-data',
      body: formBody,
    });

    let responseData;

    if (response.ok) {
      responseData = await response.json();
    } else {
      responseData = await response.json();
      console.log('(uploadUserImage) response -> ' + JSON.stringify(response));
      console.log('(uploadUserImage) error -> ' + JSON.stringify(responseData));
      throw new Error('Something went wrong');
    }

    console.log('(uploadUserImage) -> ' + JSON.stringify(responseData));

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const uploadOnboardUserImage = async (imageUrl, imageName) => {
  try {
    console.log('uploadOnboardUserImage imageUrl', imageUrl);
    const url = `${envUrl}/image/upload`;
    const token = await getDbToken();

    let formBody = new FormData();

    formBody.append('image', {
      uri: imageUrl,
      name: imageName,
      type: 'image/jpg',
    });

    console.log('formBody', formBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
      mimeType: 'multipart/form-data',
      body: formBody,
    });

    let responseData;

    console.log('response', response);

    if (response.ok) {
      // responseData = await response.json();
    } else {
      responseData = await response.json();
      console.log(
        '(uploadOnboardUserImage) response -> ' + JSON.stringify(response),
      );
      console.log(
        '(uploadOnboardUserImage) error -> ' + JSON.stringify(responseData),
      );
      throw new Error('Something went wrong');
    }

    console.log('(uploadOnboardUserImage) -> ' + JSON.stringify(responseData));

    // return responseData;
    return imageName; // imageName[imageName.length - 1];
  } catch (e) {
    console.log(e);
  }
};

export const getOnboardUserImage = async (fileName) => {
  const url = `${envUrl}/image/get?file_name_hash=${fileName}&mode=url?App=shae`;
  const token = await getDbToken();
  console.log('getOnboardUserImage url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let text = '';
    if (response.ok) {
      console.log('getOnboardUserImage response', response);
      text = await response.text();
      console.log('getOnboardUserImage response', text);
    } else {
      text = 'image not found';
    }

    // const responseData = await response.json();

    // console.log(
    //   "GET Response",
    //   "getOnboardUserImage Response Body -> " + JSON.stringify(responseData)
    // );

    return text;
  } catch (e) {
    console.log(e);
  }
};

export const getAllOnboardUserImages = async () => {
  const url = `${envUrl}/image/list/all`;
  const token = await getDbToken();
  console.log('getAllOnboardUserImages url', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    let responseData = '';
    if (response.ok) {
      console.log('getAllOnboardUserImages response', response);
      // responseData = await response.text();
      responseData = await response.json();
      console.log('getAllOnboardUserImages response', responseData);
    } else {
      responseData = 'image not found';
    }

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

export const testUploadImage = async (object) => {
  try {
    console.log('testUploadImage', JSON.stringify(object));
    let modifiedObject = JSON.stringify(object);

    console.log('testUploadImage modifiedObject', modifiedObject);

    const response = await fetch(
      'http://13.57.204.80:5000/public/measurements2',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
          'Content-Type': 'application/json',
          Token: MACHINE_LEARNING_API_KEY,
          // "Api-Signature": JSON.stringify(object),
        },
        body: modifiedObject,
      },
    );

    let responseData;

    if (response.ok) {
      console.log('(testUploadImage) -> response', response);
      responseData = await response.json();
      console.log('(testUploadImage) -> responseData', responseData);
    } else {
      console.log('(testUploadImage) -> ' + JSON.stringify(response));
      responseData = await response.json();
      console.log('(testUploadImage) -> responseData', responseData);
      // throw new Error('Something went wrong');
    }

    console.log('(testUploadImage) -> ' + JSON.stringify(responseData));

    return responseData;
  } catch (e) {
    console.log(e);
  }
};

/*
detox module
*/

// detox summary
export const getSummary = async (page, biotype, summaryId) => {
  const url =
    summaryId != undefined
      ? `${envUrl}/detox/summary/${summaryId}`
      : `${envUrl}/detox/summary?biotype=${biotype}&page=${page}`;
  const token = await getDbToken();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });
    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// detox day plan
export const getDayPlan = async (page, hts, day) => {
  const url =
    day != undefined
      ? `${envUrl}/detox/dayplan/${day}`
      : `${envUrl}/detox/dayplan?health_type_status=${hts}&page=${page}`;
  const token = await getDbToken();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// detox preparation video
export const getPreparationVideo = async (page, videoId) => {
  const url =
    videoId != undefined
      ? `${envUrl}/detox/video/${videoId}`
      : `${envUrl}/detox/video?page=${page}`;
  const token = await getDbToken();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// detox prechecklist
export const getPrechecklist = async (page, biotype, precheckId) => {
  const url =
    precheckId != undefined
      ? `${envUrl}/detox/prechecklist/${precheckId}`
      : `${envUrl}/detox/prechecklist?biotype=${biotype}&page=${page}`;
  const token = await getDbToken();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// detox toptips
export const getToptips = async (page, biotype, toptipsId) => {
  const url =
    toptipsId != undefined
      ? `${envUrl}/detox/toptips/${toptipsId}`
      : `${envUrl}/detox/toptips?biotype=${biotype}&page=${page}`;
  const token = await getDbToken();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
};

// detox dailyroutine
export const getDailyroutine = async (day, page, biotype) => {
  const url =
    day != undefined
      ? `${envUrl}/detox/dailyroutine?day=${day}&biotype=${biotype}&page=${page}`
      : `${envUrl}/detox/dailyroutine?biotype=${biotype}&page=${page}`;
  const token = await getDbToken();
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': Platform.OS === 'ios' ? 'gzip' : '',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: token,
        App: 'shae',
        AppToken: APP_TOKEN,
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(e);
  }
};

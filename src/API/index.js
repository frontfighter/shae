import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

import API from './lib';

export const signIn = ({email, password}) => API.signIn(email, password);
export const logout = () => {
  API.AuthToken = null;
  AsyncStorage.removeItem('isMeasurementsPopupShown', (err) => {
    console.log('logout err', err);
  });
  return API.GET('logout', {device_id: DeviceInfo.getUniqueId()});
};
export const forgotPass = (email) => API.POST('forgotpass', {email});

export const getUserData = () => API.GET('user');

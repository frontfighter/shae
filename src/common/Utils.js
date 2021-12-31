
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

export const isNotEmpty = (str) => {
  return (str && str.length > 0) ? true : false
}

export const strReplace = (str) => {
  return (str && str.replace(/["']/g, ""))
}

export const isTabletBasedOnRatio = () => {
  if (aspectRatio > 1.6) {
    return false;
  } else {
    return true;
  }
}
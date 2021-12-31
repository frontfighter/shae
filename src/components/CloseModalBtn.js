/**
 * Created by developercomputer on 12.10.16.
 */
import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';

import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 37,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 2,
    padding: 8
  },
  icon: {
    width: 20,
    height: 20
  }
});

export default () => (
  <TouchableOpacity
    onPress={Actions.pop}
    style={styles.container}
  >
    <Image
      source={require('../resources/icon/pimgpsh_fullsize_distr.png')}
      style={styles.icon}
      resizeMode="contain"
    />
  </TouchableOpacity>
);

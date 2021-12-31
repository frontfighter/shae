/**
 * Created by developercomputer on 08.10.16.
 */
import { Actions } from 'react-native-router-flux';

import { URL_ADRESS } from '../constants';

export function onBridgeMessageCategory(strMsg) {
  try {
    const msg = JSON.parse(strMsg);
    Actions.details({
      title: msg.title,
      uri: `${URL_ADRESS}/${msg.url}`
    });
  } catch (e) {
    console.log(e);
  }
}

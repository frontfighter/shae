/**
 * Created by developercomputer on 07.10.16.
 */
import { combineReducers } from 'redux';

import auth from './auth';
import loader from './loader';
import drawer from './drawer';

export default combineReducers({
  auth,
  loader,
  drawer
});

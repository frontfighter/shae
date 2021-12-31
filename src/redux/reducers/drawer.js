/**
 * Created by developercomputer on 09.10.16.
 */
import { DRAWER_CLOSE, DRAWER_OPEN } from '../actions/names';

export default function (state = false, action) {
  switch (action.type) {
    case DRAWER_OPEN: return true;
    case DRAWER_CLOSE: return false;
    default: return false;
  }
}

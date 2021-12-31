/**
 * Created by developercomputer on 07.10.16.
 */
import { SHOW_LOADER, HIDE_LOADER } from '../actions/names';

export default function (state = false, action) {
  switch (action.type) {
    case SHOW_LOADER: return true;
    case HIDE_LOADER: return false;
    default: return false;
  }
}

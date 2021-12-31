/**
 * Created by developercomputer on 07.10.16.
 */
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  PLAYER_ID_READY,
} from "../actions/names";

const initialState = {
  userInfo: {
    username: "",
    name: "",
    avatar: "../resources/TonyStark.png",
  },
  token: null,
  playerId: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      console.log("LOGIN_SUCCESS", action.payload.user);
      return {
        ...state,
        userInfo: { ...action.payload.user },
        token: action.payload.token,
      };
    case LOGOUT_SUCCESS:
      return {
        ...initialState,
        playerId: state.playerId,
      };
    case PLAYER_ID_READY:
      return {
        ...state,
        playerId: action.payload.playerId,
        // playerId: action.payload.userId
      };
    default:
      return state;
  }
}

/**
 * Created by developercomputer on 07.10.16.
 */
import { LOGIN_REQUEST, LOGOUT_REQUEST } from "./names";

export const signIn = ({ email, password, isNewFlow }) => ({
  type: LOGIN_REQUEST,
  payload: { email, password, isNewFlow },
});

export const logout = () => ({ type: LOGOUT_REQUEST });

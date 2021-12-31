/**
 * Created by konstantin on 29.07.16.
 */

import DeviceInfo from "react-native-device-info";

import { Platform } from "react-native";

import { URL_ADRESS } from "../constants";

export default class API {
  static AuthToken = null;

  static host = `${URL_ADRESS}/mobile/`;

  static ipApiInfo(deprecatedHost) {
    const hosts = {
      main: "http://freegeoip.net/json/",
      deprecated: "http://ip-api.com/json",
    };
    const usedHost = deprecatedHost ? hosts.deprecated : hosts.main;
    return global
      .fetch(usedHost, {})
      .then((r) => r.json())
      .catch((e) => e);
  }

  static async signIn(email, pass) {
    let signInResult = null;
    try {
      signInResult = await API.POST("auth", { user: email, pass });
      console.log("signInResult", signInResult);
    } catch (e) {
      console.log("signIn error", JSON.stringify(e));
      throw new Error(e);
    }

    API.AuhToken = signInResult.token;

    return signInResult;
  }

  static call(method, type, data) {
    function status(response) {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }
      return response.text().then((text) =>
        Promise.reject({
          error: {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
          },
          body: text,
        })
      );
    }

    function json(response) {
      return response.json();
    }

    console.log("method, type, data", method, type, data);

    return API.request(method, type, data)
      .then(status)
      .then(json)
      .catch((e) => Promise.reject(e));
  }

  static async GET(method, params) {
    const paramsArr = [];
    let paramsStr = "";
    const paramsType = typeof params;

    if (paramsType === "object") {
      for (const p in params) {
        if (Object.prototype.hasOwnProperty.call(params, p)) {
          let val = params[p];
          if (typeof val === "object") {
            val = JSON.stringify(val);
          }
          paramsArr.push(`${p}=${val}`);
        }
      }
      paramsStr = `?${paramsArr.join("&")}`;
    } else if (paramsType === "string") {
      paramsStr = `?${params}`;
    }
    // return await API.call(`${method}`, 'get');
    return await API.call(`${method}${paramsStr}`, "get");
  }

  static async POST(method, params) {
    return API.call(method, "post", params);
  }

  static async PUT(method, params) {
    return API.call(method, "put", params);
  }

  static androidThreadSleepHackInterval = null;

  static androidThreadSleepHack() {
    if (!API.androidThreadSleepHackInterval) {
      API.androidThreadSleepHackInterval = setInterval(() => 1 + 1, 1000);
    }
  }

  static request(method, type, data, _headers) {
    let headers = { ..._headers };
    if (Platform.OS === "android") {
      API.androidThreadSleepHack();
    }
    if (!headers) {
      headers = {};
    }
    if (API.AuthToken) {
      headers["User-Token"] = `${API.AuthToken}`;
    }
    headers["Content-Type"] =
      "application/x-www-form-urlencoded; charset=UTF-8";
    headers["SHAE-V"] = DeviceInfo.getVersion();
    let _body = "";
    if (typeof data === "object") {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          let value = data[key];
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          _body = `${_body}${
            _body.length ? "&" : ""
          }${key}=${encodeURIComponent(value)}`;
        }
      }
    } else {
      _body = data;
    }

    return global.fetch(`${API.host}${method}`, {
      method: type || "get",
      body: _body,
      headers,
    });
  }
}

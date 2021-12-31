import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings,
} from 'react-native-google-analytics-bridge';

GoogleAnalyticsSettings.setDryRun(false);
const fieldIndexMap = {userId: 1};
const tracker = new GoogleAnalyticsTracker('UA-52223706-18', fieldIndexMap);

// Google Analytics Tracker Methods

export const setUser = (userId) => {
  // tracker.setUser(userId);
  tracker.setUser(String(userId));
};

export const setAppName = (appName) => {
  tracker.setAppName(appName);
};

export const setClient = (clientId) => {
  tracker.setClient(clientId);
};

export const trackScreenView = (screenName, payload = {}) => {
  if (payload && payload.id) {
    let customPayload = {
      customDimensions: {userId: payload.id},
    };
    const eventMetadata = {
      label: `userId - ${parseInt(payload.id)}`,
      value: parseInt(payload.id),
    };
    tracker.trackScreenView(screenName, customPayload);
    trackEvent(screenName, 'screenView', eventMetadata, {
      customDimensions: {userId: payload.id},
    });

    // tracker.getClientId().then(clientId => {
    //     setClient(clientId);
    // })
    setUser(payload?.id);
  } else {
    tracker.trackScreenView(screenName);
    trackEvent(screenName, 'screenView', undefined, undefined);
  }
};

export const setAppVersion = (appVersion) => {
  tracker.setAppVersion(appVersion);
};

export const trackEvent = (category, action, optionalValues, payload) => {
  tracker.trackEvent(category, action, optionalValues, payload);
};

export const trackException = (error, fatal = false) => {
  tracker.trackException(error, fatal);
};

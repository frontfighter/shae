import Realm from 'realm';
import {TokenSchema} from '../models/TokenModel';
import {TokenSchemaV1} from '../models/TokenModel';
import {
  UserDetailsSchemaV2,
  UserDetailsSchema,
  TrackSchema,
  ProfileSchema,
  AvatarSchema,
  SubscriptionSchema,
} from '../models/UserDetailsModel';
import {TrackingSchema} from '../models/TrackingModel';
import {
  UserVariablesSchema,
  UserVariablesSchemaV1,
  UserVariablesSchemaV2,
  UserVariablesSchemaV3,
  UserVariablesSchemaV4,
  UserVariablesSchemaV5,
  UserVariablesSchemaV6,
  UserVariablesSchemaV7,
  UserVariablesSchemaV8,
} from '../models/UserVariablesModel';
import {NotificationsVariablesSchema} from '../models/NotificationsVariablesModel';
import {
  FiltersSchemaV1,
  StrengthSchema,
  CircuitSchema,
} from '../models/UserFilters';
import {
  WorkoutDataArraysV1,
  WorkoutDataSchemaV1,
  TrainingSchemaV5,
  TrainingSchemaV4,
  TrainingSchemaV3,
  TrainingSchemaV2,
  TrainingSchemaV1,
  ExerciseSchemaV2,
  ExerciseValueSchemaV1,
  ExerciseSchemaV1,
  ImageUrlSchemaV1,
  ExerciseImageSchemaV1,
} from '../models/TrainingModel';

const schemas = [
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchema,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 0,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV1,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 1,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV2,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 2,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV3,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 3,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV4,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 4,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV5,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 5,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV6,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 6,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
    ],
    schemaVersion: 7,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
    ],
    schemaVersion: 8,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV1,
      ExerciseSchemaV1,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
    ],
    schemaVersion: 9,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV2,
      ExerciseSchemaV1,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
    ],
    schemaVersion: 10,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV2,
      ExerciseSchemaV2,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
      ExerciseValueSchemaV1,
    ],
    schemaVersion: 11,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV3,
      ExerciseSchemaV2,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
      ExerciseValueSchemaV1,
      WorkoutDataSchemaV1,
    ],
    schemaVersion: 12,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV4,
      ExerciseSchemaV2,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
      ExerciseValueSchemaV1,
      WorkoutDataSchemaV1,
    ],
    schemaVersion: 13,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchema,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV5,
      ExerciseSchemaV2,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
      ExerciseValueSchemaV1,
      WorkoutDataSchemaV1,
      WorkoutDataArraysV1,
    ],
    schemaVersion: 14,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchemaV2,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV7,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV5,
      ExerciseSchemaV2,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
      ExerciseValueSchemaV1,
      WorkoutDataSchemaV1,
      WorkoutDataArraysV1,
    ],
    schemaVersion: 15,
  },
  {
    schema: [
      TokenSchemaV1,
      UserDetailsSchemaV2,
      TrackSchema,
      AvatarSchema,
      SubscriptionSchema,
      ProfileSchema,
      TrackingSchema,
      UserVariablesSchemaV8,
      NotificationsVariablesSchema,
      FiltersSchemaV1,
      StrengthSchema,
      CircuitSchema,
      TrainingSchemaV5,
      ExerciseSchemaV2,
      ImageUrlSchemaV1,
      ExerciseImageSchemaV1,
      ExerciseValueSchemaV1,
      WorkoutDataSchemaV1,
      WorkoutDataArraysV1,
    ],
    schemaVersion: 16,
  },
];

let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
console.log('nextSchemaIndex', nextSchemaIndex);
if (nextSchemaIndex !== -1) {
  while (nextSchemaIndex < schemas.length) {
    const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
    migratedRealm.close();
  }
}

// const migration = (oldRealm, newRealm) => {
//     // only apply this change if upgrading to schemaVersion 1
//   if (oldRealm.schemaVersion < 1) {
//     const oldObjects = oldRealm.objects('UserDetails');
//     const newObjects = newRealm.objects('UserDetails');
//
//     // loop through all objects and set the name property in the new schema
//     for (let i = 0; i < oldObjects.length; i++) {
//         newObjects[i].kkk = 123;
//     }
//   }
// }

const schemasMapping = {
  Token: TokenSchemaV1,
  UserDetails: UserDetailsSchemaV2,
  Tracking: TrackingSchema,
  UserVariables: UserVariablesSchemaV8,
  NotificationsVariables: NotificationsVariablesSchema,
  Filters: FiltersSchemaV1,
  Training: TrainingSchemaV5,
};

const getUpdatedSchema = (schema, schemaArray) => {
  console.log('array', schemaArray);
  return {
    schema: schema,
    schemaVersion: schemaArray[schemaArray.length - 1].schemaVersion,
    migration: schemaArray[schemaArray.length - 1].migration,
  };
};

export const createOrUpdateRealm = (schemaName, realmObject) => {
  // realmObject - array
  const schema = schemasMapping[schemaName];

  // console.log('db schemas', realmObject);
  // Realm.open([getUpdatedSchema(schema, schemas)])
  Realm.open(schemas[schemas.length - 1])
    .then((realm) => {
      realm.write(() => {
        console.log('schemaName', schemaName);
        let token = realm.objects(schemaName);
        realm.delete(token);

        realm.create(schemaName, realmObject, true);
      });
      console.log('realmObject created', schemaName, realmObject);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteRealmObjects = () => {
  Realm.open(schemas[schemas.length - 1])
    .then((realm) => {
      realm.write(() => {
        // let allObjects = realm.objects('Token', 'UserDetails', 'Tracking');
        // realm.delete(allObjects);
        realm.delete(realm.objects('Token')[0]);
        realm.delete(realm.objects('UserDetails')[0]);
        // realm.delete(realm.objects("Tracking")[0]);
        // realm.delete(realm.objects("UserFilters")[0]);
        // realm.delete(realm.objects("Training")[0]);
      });
      console.log('realmObjects deleted');
    })
    .catch((error) => {
      console.log(error);
    });

  let userVariables = getUserVariables();

  if (typeof userVariables !== 'undefined' && userVariables !== null) {
    userVariables = JSON.parse(JSON.stringify(userVariables));

    userVariables.lastHraQuestionId = null;
    userVariables.lastHraTab = null;
    userVariables.lastHraSection = null;
    userVariables.lastUploadedImage = null;

    createOrUpdateRealm('UserVariables', userVariables);
  }
};

export const readRealmRows = (schemaName, filter) => {
  // filter - full condition in string
  const schema = schemasMapping[schemaName];

  let object;
  Realm.open(schemas[schemas.length - 1])
    .then((realm) => {
      const realmObject = realm.objects(schemaName);

      // if (filter) {
      //   console.log('realmObject', realmObject.filtered(filter));
      //   return realmObject.filtered(filter);
      // }

      console.log('readRealmRows realmObject ', schemaName, realmObject);

      return realmObject;
    })
    .catch((error) => {
      console.log(error);
    });
};

// const realm = new Realm({schema: [TokenSchemaV1, UserDetailsSchema, TrackSchema, AvatarSchema, SubscriptionSchema, ProfileSchema, TrackingSchema, UserVariablesSchema, NotificationsVariablesSchema], schemaVersion: 1});
const realm = new Realm(schemas[schemas.length - 1]);

export const getDbToken = () => {
  console.log('getDbToken', realm.objects('Token'));
  if (Object.keys(realm.objects('Token')).length === 0) {
    return null;
  }

  return 'Bearer ' + realm.objects('Token')[0].access_token;
};

export const getUserDetails = () => {
  return realm.objects('UserDetails')[0];
};

export const getTrackProgress = () => {
  return realm.objects('Tracking')[0];
};

export const getUserVariables = () => {
  return realm.objects('UserVariables')[0];
};

export const getUserFilters = () => {
  return realm.objects('UserFilters')[0];
};

export const getUserTraining = () => {
  return realm.objects('Training')[0];
};

export const getNotificationsVariables = () => {
  console.log(
    'realm.objects(NotificationsVariables)',
    realm.objects('NotificationsVariables'),
  );

  if (typeof realm.objects('NotificationsVariables') === 'undefined') {
    return null;
  }

  return realm.objects('NotificationsVariables')[0];
};

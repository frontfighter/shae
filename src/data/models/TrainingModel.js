export const TrainingSchemaV1 = {
  name: 'Training',
  properties: {
    'exercises': { type: 'list', objectType: 'Exercise' },
    'activeExerciseIndex': 'int?',
    'actualSet': 'int?',
    'trainingType': 'string?',
    'isInterrupted': 'bool',
  }
};

export const TrainingSchemaV2 = {
  name: 'Training',
  properties: {
    'exercises': { type: 'list', objectType: 'Exercise' },
    'activeExerciseIndex': 'int?',
    'actualSet': 'int?',
    'trainingType': 'string?',
    'isRestTime': 'bool?',
    'isInterrupted': 'bool',
  }
};

export const TrainingSchemaV3 = {
  name: 'Training',
  properties: {
    'exercises': { type: 'list', objectType: 'Exercise' },
    'activeExerciseIndex': 'int?',
    'actualSet': 'int?',
    'totalSets': 'int?',
    'trainingType': 'string?',
    'isRestTime': 'bool?',
    'isInterrupted': 'bool',
    'totalSets': 'string?',
    'isLastRep': 'bool?',
    'progressSetsTotal': 'int?',
    'progressSet': 'int?',
    'repsTotal': 'int?',
    'progressReps': 'int?',
    'totalVolume': 'int?',
    'totalRestTime': 'int?',
    'isMuted': 'bool?',
    'skippedSets': 'int?',
    'workoutData': { type: 'list', objectType: 'WorkoutData' },
    'loggedRestTime': 'int?',
  }
};

export const TrainingSchemaV4 = {
  name: 'Training',
  properties: {
    'exercises': { type: 'list', objectType: 'Exercise' },
    'activeExerciseIndex': 'int?',
    'actualSet': 'int?',
    'totalSets': 'int?',
    'trainingType': 'string?',
    'isRestTime': 'bool?',
    'isInterrupted': 'bool',
    'totalSets': 'int?',
    'isLastRep': 'bool?',
    'progressSetsTotal': 'int?',
    'progressSet': 'int?',
    'repsTotal': 'int?',
    'progressReps': 'int?',
    'totalVolume': 'int?',
    'totalRestTime': 'int?',
    'isMuted': 'bool?',
    'skippedSets': 'int?',
    'workoutData': { type: 'list', objectType: 'WorkoutData' },
    'loggedRestTime': 'int?',
  }
};

export const TrainingSchemaV5 = {
  name: 'Training',
  properties: {
    'exercises': { type: 'list', objectType: 'Exercise' },
    'activeExerciseIndex': 'int?',
    'actualSet': 'int?',
    'totalSets': 'int?',
    'trainingType': 'string?',
    'isRestTime': 'bool?',
    'isInterrupted': 'bool',
    'totalSets': 'int?',
    'isLastRep': 'bool?',
    'progressSetsTotal': 'int?',
    'progressSet': 'int?',
    'repsTotal': 'int?',
    'progressReps': 'int?',
    'totalVolume': 'int?',
    'totalRestTime': 'int?',
    'isMuted': 'bool?',
    'skippedSets': 'int?',
    'workoutData': { type: 'list', objectType: 'WorkoutData' },
    'loggedRestTime': 'int?',
    'workoutDataArrays': { type: 'list', objectType: 'WorkoutDataArrays' },
  }
};

export const WorkoutDataArraysV1 = {
  name: 'WorkoutDataArrays',
  properties: {
    'workoutData': { type: 'list', objectType: 'WorkoutData' },
  }
}

export const WorkoutDataSchemaV1 = {
  name: 'WorkoutData',
  properties: {
    'sets': 'int?',
    'reps': 'int?',
    'totalWeight': 'int?',
  }
}

export const ExerciseSchemaV1 = {
  name: 'Exercise',
  primaryKey: 'id',
  properties: {
    "id": 'int',
    'workoutExerciseIndex': 'int?',
    'reps': 'int?',
    'sets': 'int?',
    'restAfter': 'int?',
    "name": 'string?',
    'description': 'string?',
    'user_fav': 'bool?',
    'images': { type: 'list', objectType: 'ExerciseImage' },
    'defaultImage': 'int?',
    'user_importance_value_raw': 'float?',
    'importance_val': 'int?',
    'importance_text': 'string?',
    'has_vimeo_video': 'bool?',
    'vimeo_video_id': 'int?',
    'url': {type: 'ImageUrl', optional: true},
    'marginTop': 'int?',
    'title': 'string?',
    'text': 'string?',
    'duration': 'int?',
    'reps': 'int?',
    'sets': 'int?',
    'restAfter': 'int?',
    'initialReps': 'int?',
    'initialSets': 'int?',
    'initialRestAfter': 'int?',
    'video_embed_url': 'string?',
    'video_embed_code': 'string?',
  }
};

export const ExerciseSchemaV2 = {
  name: 'Exercise',
  properties: {
    'value': {type: 'ExerciseValue', optional: true},
    'url': {type: 'ImageUrl', optional: true},
    'marginTop': 'int?',
    'title': 'string?',
    'text': 'string?',
    'duration': 'int?',
    'reps': 'int?',
    'sets': 'int?',
    'restAfter': 'int?',
    'initialReps': 'int?',
    'initialSets': 'int?',
    'initialRestAfter': 'int?',
    'video_embed_url': 'string?',
    'video_embed_code': 'string?',
  }
};

export const ExerciseValueSchemaV1 = {
  name: 'ExerciseValue',
  properties: {
    "id": 'int',
    'workoutExerciseIndex': 'int?',
    'reps': 'int?',
    'sets': 'int?',
    'restAfter': 'int?',
    "name": 'string?',
    'description': 'string?',
    'user_fav': 'bool?',
    'images': { type: 'list', objectType: 'ExerciseImage' },
    'defaultImage': 'int?',
    'user_importance_value_raw': 'float?',
    'importance_val': 'int?',
    'importance_text': 'string?',
    'has_vimeo_video': 'bool?',
    'vimeo_video_id': 'int?',
  }
}

export const ImageUrlSchemaV1 = {
  name: 'ImageUrl',
  properties: {
    'uri': 'string?',
  }
}

export const ExerciseImageSchemaV1 = {
  name: 'ExerciseImage',
  primaryKey: 'path',
  properties: {
    "path": 'string?',
    'url': 'string?',
    'dir_path': 'string?'
  }
};

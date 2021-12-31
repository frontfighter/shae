export const TrackSchema = {
  name: 'Track',
  primaryKey: 'fitnessIndex',
  properties: {
    'fitnessIndex': 'string?',
    'waterContent': 'string?',
    'BFI': 'string?',
    'BMI': 'string?',
    'leanMuscleMass': 'string?',
    'stress': 'int?'
  }
}

export const ProfileSchema = {
  name: 'Profile',
  primaryKey: 'lastname',
  properties: {
    'lastname': 'string?',
    'firstname': 'string?',
    'email': 'string?',
    'zip_code': 'string?',
    'street': 'string?',
    'city': 'string?',
    'about': 'string?',
    'gender': 'string?',
    'birthdate': 'string?',
    'country': 'string?',
    'state': 'string?',
    'phone': 'string?',
    'unit': 'string?'
  }
}

export const AvatarSchema = {
  name: 'Avatar',
  primaryKey: 'path',
  properties: {
    'url': 'string?',
    'path': 'string?',
  }
}

export const SubscriptionSchema = {
  name: 'Subscription',
  primaryKey: 'id',
  properties: {
    'id': 'int?',
    'user_id': 'int?',
    'plan_id': 'int?',
    'start_at': 'string?',
    'end_at': 'string?',
    'cancelled_at': 'string?',
    'subr_payment_id': 'string?',
    'active': 'int?',
    'created_at': 'string?',
    'updated_at': 'string?',
    'app': 'string?',
    'payment_method': 'string?',
    'receipt_data': 'string?',
    'polled_at': 'string?',
  }
}

export const UserDetailsSchema = {
  name: 'UserDetails',
  primaryKey: 'id',
  properties: {
    'id': 'int',
    'username': 'string?',
    'createtime': 'int?',
    'status': 'int?',
    'avatar': {type: 'Avatar', optional: true},
    'terms_agreed': 'int?',
    'allhraanswered': 'int?',
    'allmeasurementsupplied': 'int?',
    'notify': 'int?',
    'lastlogin': 'string?',
    'biotype': 'string?',
    'randcounter': 'int?',
    'ForceBFI': 'string?',
    'beta_version': 'int?',
    'user_analyze_id': 'int?',
    'timezone': 'string?',
    'timezone_offset': 'int?',
    'results_processing': 'int?',
    'results_processing_at': 'string?',
    'verified': 'int?',
    'infusionsoft_id': 'int?',
    'email_verified': 'int?',
    'lng': 'string?',
    'lat': 'string?',
    'hra_last_updated': 'string?',
    'measurementsUpdated': 'string?',
    'last_analysis_at': 'string?',
    'last_shaefit_push_check_at': 'string?',
    'biotype': 'string?',
    'biotypeName': 'string?',
    'biotypeShift': 'string?',
    'biotypeStatus': 'string?',
    'track': {type: 'Track', optional: true},
    'subscription': {type: 'Subscription', optional: true},
    'profile': {type: 'Profile', optional: true}
  }
};

export const UserDetailsSchemaV2 = {
  name: 'UserDetails',
  primaryKey: 'id',
  properties: {
    'id': 'int',
    'username': 'string?',
    'createtime': 'int?',
    'status': 'int?',
    'avatar': {type: 'Avatar', optional: true},
    'terms_agreed': 'int?',
    'allhraanswered': 'int?',
    'allmeasurementsupplied': 'int?',
    'notify': 'int?',
    'lastlogin': 'string?',
    'biotype': 'string?',
    'randcounter': 'int?',
    'ForceBFI': 'string?',
    'beta_version': 'int?',
    'user_analyze_id': 'int?',
    'timezone': 'string?',
    'timezone_offset': 'int?',
    'results_processing': 'int?',
    'results_processing_at': 'string?',
    'verified': 'int?',
    'infusionsoft_id': 'int?',
    'email_verified': 'int?',
    'lng': 'string?',
    'lat': 'string?',
    'hra_last_updated': 'string?',
    'measurementsUpdated': 'string?',
    'last_analysis_at': 'string?',
    'last_shaefit_push_check_at': 'string?',
    'biotype': 'string?',
    'biotypeName': 'string?',
    'biotypeShift': 'string?',
    'biotypeStatus': 'string?',
    'track': {type: 'Track', optional: true},
    'subscription': {type: 'Subscription', optional: true},
    'profile': {type: 'Profile', optional: true},
    'isCoach': 'bool?'
  }
};

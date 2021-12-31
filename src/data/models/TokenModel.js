export const TokenSchema = {
  name: 'Token',
  properties: {
    'token_type': 'string',
    'expires_in': 'int',
    'access_token': 'string',
    'refresh_token': 'string'
  }
};

export const TokenSchemaV1 = {
  name: 'Token',
  primaryKey: 'token_type',
  properties: {
    'token_type': 'string',
    'expires_in': 'int',
    'access_token': 'string',
    'refresh_token': 'string'
  }
};

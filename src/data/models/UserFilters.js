export const StrengthSchema = {
  name: 'Strength',
  primaryKey: 'intensity',
  properties: {
    'intensity': 'int?',
    'duration': 'int?',
    'equipment': 'int?',
    'region': 'int?',
  }
}

export const CircuitSchema = {
  name: 'Circuit',
  primaryKey: 'intensity',
  properties: {
    'intensity': 'int?',
    'duration': 'int?',
  }
}

export const FiltersSchemaV1 = {
  name: 'UserFilters',
  properties: {
    'strength': {type: 'Strength', optional: true},
    'circuit': {type: 'Circuit', optional: true},
  }
};

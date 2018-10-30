const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  // if as an empty object
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;

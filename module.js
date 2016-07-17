module.exports.nameParser = function (collectionName, databaseName) {
  'use strict'
  var out = {};
  var dotI = collectionName.indexOf('.');
  dotI = collectionName.indexOf('.', dotI+1);
  out.database = collectionName.substring(0,dotI).replace('.','_');
  out.collection = databaseName+'.'+collectionName.substring(dotI+1);
  return out
}

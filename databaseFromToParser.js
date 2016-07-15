var exports = module.exports = {};
exports.regexp = function (name) { // database name|collection name
  'use strict'
  var regexp = new RegExp(/^(((?!system)\w)*)\.(\w+)\.((\.?(\w+))+)\|(\w+)/);
  var tmp = regexp.exec(name);
  return {database:tmp[1]+'_'+tmp[3],collection:tmp[4]+'_'+tmp[7]};
};

exports.plit = function (collectionName, databaseName) {
  'use strict'
  var out = {};
  var dotI = collectionName.indexOf('.');
  dotI = collectionName.indexOf('.', dotI+1);
  out.datanase = collectionName.substring(0,dotI).replace('.','_');
  out.collection = databaseName+'_'+collectionName.substring(dotI+1);

}

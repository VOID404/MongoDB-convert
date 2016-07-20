const mongodb = require('mongodb');
module.exports.nameParser = function (collectionName, databaseName) {
  'use strict';
  var out = {};
  var dotI = collectionName.indexOf('.');
  dotI = collectionName.indexOf('.', dotI+1);
  out.database = collectionName.substring(0,dotI).replace('.','_');
  out.collection = databaseName+'.'+collectionName.substring(dotI+1);
  return out;
};

module.exports.opendb = function(tmp, callback) {
  tmp.db.open((err,cli)=>{
    if (tmp.dbUrl.auth){
      tmp.db.auths = tmp.db.url.auth.split(':');
      tmp.db.user = tmp.db.auths[0];
      tmp.db.pass = tmp.db.auths[1];
      tmp.db.authenticate(tmp.db.user, tmp.db.pass, (err)=>{
        if(err){callback(err);}
        else {callback(null, cli);}
      });
    }
    else{
      if(err){callback(err);}
      else{callback(null,cli);}
    }
  });
};

module.exports.parseDBurl = function(url) {
  var tmp = {};
  tmp.dbUrl = require('url').parse(url);
  tmp.dbName = tmp.dbUrl.pathname.slice(1);
  tmp.dbServer = new mongodb.Server(tmp.dbUrl.hostname, tmp.dbUrl.port, { auto_reconnect: true });
  tmp.db = new mongodb.Db(tmp.dbName, tmp.dbServer, {});
  return tmp;
};

module.exports.copy = function (key, errCb, cb){
  'use strict';
  cb = cb || function(){};
  var sourceData = module.exports.parseDBurl(key.from.database);
  var targetData = module.exports.parseDBurl(key.to.database);
  module.exports.opendb(sourceData, (err,source)=>{
    if(err){errCb(err);}
    module.exports.opendb(targetData, (err,target)=>{
      if(err){errCb(err);}
      source.collection(key.from.collection,(err,sourceCollection)=>{
        if(err){errCb(err);}
        target.collection(key.to.collection,(err,targetCollection)=>{
          if(err){errCb(err);}
          let sourceStream = sourceCollection.find();
          sourceStream.on('data',(data)=>{targetCollection.insert(data);});
          sourceStream.on('end', ()=>{
            source.close();
            target.close();
            cb();
          });
        });
      });
    });
  });
};

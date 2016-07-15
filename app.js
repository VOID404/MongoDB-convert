'use strict'
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const url = require('url');
const iterate = require('./iterate');
const json = require('JSON');
const async = require('async');
const sync = require('synchronize');
const config = require('config')

const fromUrl = config.sourceUrl;
var urlsLeft = fromUrl.length;
const toUrl = config.targetUrl;

function openDB(tmp, callback) {
  tmp.db.open((err,cli)=>{
    if (tmp.dbUrl.auth){
      tmp.db.auths = tmp.db.url.auth.split(":");
      tmp.db.user = tmp.db.auths[0];
      tmp.db.pass = tmp.db.auths[1];
      tmp.db.authenticate(tmp.db.user, tmp.db.pass, (err)=>{
        if(err){callback(err)}
        else {callback(null, cli)};
      })
    }
    else{
      if(err){callback(err)}
      else{callback(null,cli)}
    }
  })
}

function parseDBurl(url) {
  var tmp = {};
  tmp.dbUrl = require('url').parse(url);
  tmp.dbName = tmp.dbUrl.pathname.slice(1);
  tmp.dbServer = new mongodb.Server(tmp.dbUrl.hostname, tmp.dbUrl.port, { auto_reconnect: true });
  tmp.db = new mongodb.Db(tmp.dbName, tmp.dbServer, {});
  return tmp
}

var systemCollection = new RegExp(/^system\.\w+/);
var out =[];
var nameConvert = new RegExp(/(hybris)\.(\w+)\.(\w+)\|(\w+)/)
iterate(fromUrl, (i,url)=>{
MongoClient.connect(url, function(err, db) {
  if (err){console.error(err);}
  console.log('Connected');
  var admin = db.admin();
  admin.listDatabases((err, res)=>{
    if (err){console.error(err);};
    var databases = res['databases'];
    var tmp = [];
    databases=databases.filter((o)=>{return o.name!='local'})
    iterate(databases, (i,y)=>{
      tmp[i]=db.db(y['name']);
    });
    databases = tmp;
    var tasksLeft=0;
    iterate(databases, (i,y)=>{
      sync.fiber(()=>{
        let databaseName = y.databaseName;
        let collections = y.listCollections({name:{$not:/^system\.\w+/}});
        tasksLeft++;
        let items = sync.await(collections.toArray(sync.defer()))
        iterate(items,(i,y)=>{
          let collectionName = y.name;
          let tmp = nameConvert.exec(collectionName+'|'+databaseName)
          out.push({from:{database:url+'/'+databaseName, collection:collectionName}, to:{database:url+'/'+tmp[1]+'_'+tmp[2], collection:tmp[4]+'_'+tmp[3]}})
        })
        if (--tasksLeft==0){
          db.close();
          console.log('Got data from server '+url);
          if(--urlsLeft==0){
            async.eachOfLimit(out, config.asyncCollectionsLimit, (key)=>{
              let sourceDB = parseDBurl(key.from.database);
              let targetDB = parseDBurl(key.to.database);
              openDB(sourceDB, (err,source)=>{
                if(err){console.error(err);process.exit(1);}
                openDB(targetDB, (err,target)=>{
                  if(err){console.error(err);process.exit(1);}
                  source.collection(key.from.collection,(err,sourceCollection)=>{
                    if(err){console.error(err);process.exit(1);}
                    target.collection(key.to.collection,(err,targetCollection)=>{
                      if(err){console.error(err);process.exit(1);}
                      let sourceStream = sourceCollection.find();
                      sourceStream.on('data',(data)=>{console.log(data.toString());})
                      sourceStream.on('close', ()=>{
                        source.close();
                        target.close();
                      })
                    })
                  })
                })
              })

            }, (err)=>{if(err){console.error(err);}})
          }
        }
      })
    })
  });
});
})

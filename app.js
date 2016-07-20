'use strict'
const MongoClient = require('mongodb').MongoClient;
const defs = require('./module');
const async = require('async');
const sync = require('synchronize');
const config = require('./config');
const dbp = defs.nameParser;

const fromUrl = config.sourceUrl;
var urlsLeft = fromUrl.length;
const toUrl = config.targetUrl;

var systemCollection = new RegExp(/^system\.\w+/);
var out =[];
for (let i=0, url=fromUrl[i];i<fromUrl.length;i++,url=fromUrl[i]){
MongoClient.connect(url+'/admin', function(err, db) {
  if (err){console.error(err);}
  console.log('Connected');
  let admin = db.admin();
  admin.listDatabases((err, res)=>{
    if (err){console.error(err);}
    let databases = res['databases'];
    let tmp = [];
    databases=databases.filter((o)=>{return o.name!='local'})
    databases.forEach((y,i)=>{
      tmp[i]=db.db(y['name']);
    });
    databases = tmp;
    let tasksLeft=0;
    databases.forEach((y,i)=>{
      sync.fiber(()=>{
        let databaseName = y.databaseName;
        let collections = y.listCollections({name:{$not:/^system\.\w+/}});
        tasksLeft++;
        let items = sync.await(collections.toArray(sync.defer()))
        items.forEach((y,i)=>{
          let collectionName = y.name;
          let tmp = dbp(collectionName, databaseName)
          out.push({from:{database:url+'/'+databaseName, collection:collectionName}, to:{database:toUrl+'/'+  tmp.database, collection:tmp.collection}})
        })
        if (--tasksLeft==0){
          db.close();
          console.log('Got data from server '+url);
          if(--urlsLeft==0){
            async.eachOfLimit(out, config.asyncCollectionsLimit, function(key){
              defs.copy(key,(err)=>{console.error(err);process.exit(1);})
            },(err)=>{if(err){console.error(err);}
            })
          }
        }
      })
    })
  });
});
}

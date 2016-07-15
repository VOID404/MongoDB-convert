'use strict'
const test = require('tape');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config')
const tapDiff = require('tap-diff');

test.createStream()
  .pipe(tapDiff())
  .pipe(process.stdout);

var urls = config.sourceUrl;
urls.push(config.targetUrl);

test('connection test', (t)=>{
  t.plan(urls.length)
  for(let i=0;i<urls.length;i++){
    MongoClient.connect(urls[i], function(err, db) {
      t.equal(err,null, 'Connected to '+urls[i]);
      if(err==null){db.close()}
    });
  }
})

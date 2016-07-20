'use strict'
const assert = require('chai').assert;
const defs = require('../module');
const config = require('../config.json');
const MongoClient = require('mongodb').MongoClient;
const chance = require('chance').Chance()

describe('Config.json',function(){
  it('should contain source url list',function(){
    assert.deepEqual(config.sourceUrl.constructor,Array)
  })
  it('should contain target url',function(){
    assert.deepEqual(config.targetUrl.constructor,String)
  })
  it('should contain ascync limit',function(){
    assert.deepEqual(config.asyncCollectionsLimit.constructor,Number)
  })
})

describe('Database parser',function(){
  it('should parse databases names',function(){
    assert.equal(defs.nameParser('hybris.product.products.main','adidas').database,'hybris_product');
    assert.equal(defs.nameParser('someletters.order.orders','puma').database,'someletters_order');
  })
  it('should parse collections names',function(){
    assert.equal(defs.nameParser('hybris.product.products.main','adidas').collection,'adidas.products.main');
    assert.equal(defs.nameParser('someletters.order.orders','puma').collection,'puma.orders');
  })
})

describe('Database tests', function(){
  describe('Connects correctly to', function(){
    beforeEach(function(){
      if(process.env.travis=='true'){this.skip()}
    })
    var urls = config.sourceUrl;
    urls.push(config.targetUrl);
    urls.forEach((val,i)=>{
      it(val,function(done){
        MongoClient.connect(urls[i], function(err, db) {
          assert.isNull(err);
          if(err==null){db.close()}
          done()
        })
      })
    })
  })

  describe('Copies data', function(done){
    this.timeout(10000)
    var ips=[];
    config.test.sourceUrl.forEach((val,i)=>{ips[i]=chance.ipv6()})
    config.test.sourceUrl.forEach(function(val,i,arr){
      describe(val, ()=>{
        it('Can write(needed for tests)',function(done){
          var tmp = {database:val+'/77832b7edcd0aac9715a',collection:'sampleColl'}
          var dbData = defs.parseDBurl(tmp.database);
          defs.opendb(dbData, (err,database)=>{
            assert.isNull(err);
            database.collection(tmp.collection,(err,collection)=>{
              assert.isNull(err);
              collection.insert({test:ips[i]})
              database.close()
              done()
            })
          })
        })

        var tmp = {from: {database:val+'/77832b7edcd0aac9715a',collection:'sampleColl'},to:{database:config.test.targetUrl+'/e45acbeef5615f865dda',collection:'sampleColl2'}}
        it('copies data', function(done){
          defs.copy(tmp,(err)=>(assert.fail(null,err)), done)
        })
        it('data is correct', function(done){
          var tmp = {database:config.test.targetUrl+'/77832b7edcd0aac9715a',collection:'sampleColl'}
          var dbData = defs.parseDBurl(tmp.database);
          defs.opendb(dbData, (err,database)=>{
            assert.isNull(err);
            database.collection(tmp.collection,(err,collection)=>{
              assert.isNull(err);
              collection.find({test:ips[i]}, function(err, doc){
                assert.isNull(err)
                assert.isNotNull(doc)
                database.close()
                done()
              })
            })
          })
        })
      })
    })
  })
})

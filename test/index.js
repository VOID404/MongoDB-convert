'use strict'
const assert = require('chai').assert;
const dbp = require('../databaseFromToParser');
const config = require('../config');
const MongoClient = require('mongodb').MongoClient;

describe('Config.json',()=>{
  it('should contain source url list',()=>{
    assert.deepEqual(config.sourceUrl.constructor,Array)
  })
  it('should contain target url',()=>{
    assert.deepEqual(config.targetUrl.constructor,String)
  })
  it('should contain ascync limit',()=>{
    assert.deepEqual(config.asyncCollectionsLimit.constructor,Number)
  })
})

describe('Database parser',()=>{
  it('should parse databases names',()=>{
    assert.equal(dbp('hybris.product.products.main','adidas').database,'hybris_product');
    assert.equal(dbp('someletters.order.orders','puma').database,'someletters_order');
  })
  it('should parse collections names',()=>{
    assert.equal(dbp('hybris.product.products.main','adidas').collection,'adidas.products.main');
    assert.equal(dbp('someletters.order.orders','puma').collection,'puma.orders');
  })
})

describe('Connects correctly to',()=>{
  before(()=>{
    if(process.env.travis=='true'){}
  })
  var urls = config.sourceUrl;
  urls.push(config.targetUrl);
  urls.forEach((val,i)=>{
    it(val,function(done){
      if(process.env.travis=='true'){this.skip()}
      MongoClient.connect(urls[i], function(err, db) {
        assert.isNull(err);
        if(err==null){db.close()}
        done()
      })
    })
  })
})

'use strict'
const test = require('tape');
const config = require('../config')

test('Config data test', (t)=>{
  t.notEqual(config.sourceUrl,null, 'Source url');
  t.notEqual(config.targetUrl,null, 'Target url');
  t.notEqual(config.asyncCollectionsLimit,null, 'Async collections limit');
  t.end();
})

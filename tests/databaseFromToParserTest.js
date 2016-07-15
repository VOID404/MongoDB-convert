'use strict'
const dbp = require('../databaseFromToParser');
const test = require('tape');

test('Database data parser', (t)=>{
  t.equal(dbp('hybris.product.products.main','adidas').database,'hybris_product', 'Data 1 database');
  t.equal(dbp('hybris.product.products.main','adidas').collection,'adidas.products.main', 'Data 1 collection');
  t.equal(dbp('someletters.order.orders','puma').database,'someletters_order', 'Data 2 database');
  t.equal(dbp('someletters.order.orders','puma').collection,'puma.orders', 'Data 2 collection');
  t.end();
})

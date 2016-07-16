# mongodb-convert [![Build Status](https://travis-ci.org/VOID404/MongoDB-convert.png?branch=master)](https://travis-ci.org/VOID404/MongoDB-convert)

Copies data from all mongodb databases on given servers and upload them to another server.

## Instalation

Download node at [nodejs.org](https://nodejs.org/en/) and install it, if you haven't already.
```sh
npm install -g
```

# Usage

Congiure it with [config.json](config.json), then launch it and
it will copy data from all databases from all servers in `sourceUrl` list to `targetUrl` like this:
from database: `database_name` collection: `collection.name.example` to database: `collection_name` collection: `database_name.example`

## Dependencies

- [JSON](http://json.org): Douglas Crockford&#x27;s json2.js
- [async](https://github.com/caolan/async#readme): Higher-order functions and common patterns for asynchronous code
- [mongodb](https://github.com/mongodb/node-mongodb-native): The official MongoDB driver for Node.js
- [synchronize](http://alexeypetrushin.github.com/synchronize): Turns asynchronous function into synchronous

## Dev Dependencies

- [chance](http://chancejs.com): Chance - Utility library to generate anything random
- [readme-generator](https://github.com/void404/readme-generator#readme): Generates README.md based on handlebars template
- [tap-diff](https://github.com/axross/tap-diff#readme): The most human-friendly TAP reporter
- [tape](https://github.com/substack/tape): tap-producing test harness for node and browsers

## License

[GPL-3.0](LICENSE)


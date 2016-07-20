# mongodb-convert [![Travis](https://img.shields.io/travis/VOID404/MongoDB-convert.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/VOID404/MongoDB-convert) [![GitHub issues](https://img.shields.io/github/issues/VOID404/MongoDB-convert.svg?maxAge=2592000&style=flat-square)](https://github.com/VOID404/MongoDB-convert/issues) [![Node version](https://img.shields.io/badge/node-4.4.7-brightgreen.svg?style=flat-square)](https://nodejs.org/en/) [![Mongodb version](https://img.shields.io/badge/mongodb-3.2.7-brightgreen.svg?style=flat-square)](https://www.mongodb.com/download-center?jmp=nav#community) [![license](https://img.shields.io/badge/license-GPL--3.0-brightgreen.svg?style=flat-square)](https://raw.githubusercontent.com/VOID404/MongoDB-convert/master/LICENSE) [![GitHub watchers](https://img.shields.io/github/watchers/VOID404/MongoDB-convert.png?style=social&label=Watch&maxAge=2592000)]() 
Copies and transforms collections from all mongodb databases on given servers and upload them to another server.

## Instalation

Download node at [nodejs.org](https://nodejs.org/en/) and install it, if you haven't already.
```sh
npm install -g
```

# Usage

Configure it with [config.json](config.json), then launch it and
it will copy data from all databases from all servers in `sourceUrl` list to `targetUrl` like this: ![usage graph](nameGraph.png)

## Dependencies

- [JSON](http://json.org): Douglas Crockford&#x27;s json2.js
- [async](https://github.com/caolan/async#readme): Higher-order functions and common patterns for asynchronous code
- [mongodb](https://github.com/mongodb/node-mongodb-native): The official MongoDB driver for Node.js
- [synchronize](http://alexeypetrushin.github.com/synchronize): Turns asynchronous function into synchronous

## Dev Dependencies

- [chai](http://chaijs.com): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [chance](http://chancejs.com): Chance - Utility library to generate anything random
- [mocha](https://github.com/mochajs/mocha#readme): simple, flexible, fun test framework
- [readme-generator](https://github.com/void404/readme-generator#readme): Generates README.md based on handlebars template

## License

[GPL-3.0](LICENSE)


# short-storage - Simple in-memory caching

## Simple to use

```javascript
var cache = require('short-storage').createStorage();

var ttl = 1000; // 0 - infinite time to live (by default)
cache.set('key', 'hello', ttl);

console.log( cache.get('key') ); // 'hello'

setTimeout(function () {
  console.log(cache.get('key'); // null  )
}, ttl); // wait until ttl has passed
```

## About
Simple (in-memory) storage types to store keys or values with a time to live (that expire and become null).

## Installation
from npm
```
npm install short-storage
```
from source
```
git clone https://github.com/talmobi/short-storage
cd short-storage
npm install
```

## API

```javascript
/**
 * Creates a new storage object
 * @param {Object} [params]
 * @param {Number} [params.ttl=0] - default time to live for keys, Infinite (0) by default
 * @param {Number} [params.interval=60000] - garbage collection interval, 1 minute by default
 * @returns {Object} The storage object
 */
createStorage({ ttl, interval }) => {

  /**
   * Gets the value for the specified key
   * @param {string} key - key for the value to get
   * @returns {value|null} value for the specified key or null if its ttl has expired
   */
  get( key ),

  /**
   * @param {string} key - key to store value with
   * @param {*} value - value to store in key
   * @param {Number} [ttl=this.params.ttl] - time to live, this.params.ttl by default
  */
  set( key, value, ttl )
}

/**
 * Creates a new tube storage object
 * @param {Object} [params]
 * @param {Number} [params.ttl] - default time to live for inserted values, Infinite (0) by default
 * @param {Number} [max_length=100] - maximum number of values (max length of backing array), 100 by default
 * @returns {Object} The storage object
 */
createTubeStorage({ ttl = 0, max_length = 100 }) => {

  /**
   * pull all values from the tube, ordered by FILO (First In, Last Out)
   * @param {Number} [amount] - number of most recent values to return, all by default
   * @returns {Array) - Array of most recent inserted valid (ttl not expired) values
   */
  pull( amount ), 

  /**
   * push a new value into the tube
   * @param {*} value - value to insert
   * @param {Number} [ttl=this.params.ttl] - time to live, this.params.ttl by default
   */
  push( value, ttl )
}
```

## Test
```javascript
npm test // node_modules/.bin/mocha test/*
```

## LICENSE
MIT

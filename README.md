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
Simple in-memory temporary storage for caching data.

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
// @ttl - time to live, 0 by default (infinite)
// @interval - polling interval for garvage collection, 1 minute by default
createStorage({ ttl, interval }) => {

  // @key - key for value to get
  // @returns - value for @key or null if ttl has expired
  get( key ),

  // @key - key to store value with
  // @value - value to store in key
  // @ttl - time to live
  set( key, value, ttl )
}

// @ttl - time to live, 0 by default (infinite)
// @max_length - max length of the backing array structure, 100 by default
createTubeStorage({ ttl = 0, max_length = 100 }) => {

  // @amount - number of most recent values to return, all if omitted, capped at @max_length
  // @returns {array) - array of most recent inserted valid (ttl not expired) values
  pull( amount = max_length ), 

  // push a new value into the tube
  // @value
  // @ttl - time ot live
  push( value, ttl )
}
```

## Test
```javascript
mocha test/*
```

## LICENSE
MIT

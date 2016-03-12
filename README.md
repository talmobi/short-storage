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
module.exports = {
  createStorage: function (opts) {
    var defaults = {
      ttl: 0 || opts.ttl, // default time to live
      interval: 60 * 1000 || opts.interval // garbage collection interval
    }
    
    var db = {}; // in-memory json object as storage
    
    return {
      // set key value with optional ttl
      set: function (key, value, ttl = defaults.ttl),
      
      // get value of key or null if expired
      get: function (key) { return expired ? null : value },
      
      // returns the in-memory backing object
      getJsonObject: function () { return db; }
    }
  }
}
```

## Test
```javascript
mocha test/*
```

## LICENSE
MIT

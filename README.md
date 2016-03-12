# short-storage

## simple in-memory temporary storage for caching

```javascript
var cache = require('short-storage').createStorage();

var ttl = 1000; // 0 - infinite time to live (by default)
cache.set('key', 'hello', ttl);

console.log( cache.get('key') ); // 'hello'

setTimeout(function () {
  console.log(cache.get('key'); // null  )
}, ttl); // wait until ttl has passed
```

## API
```javascript
module.exports = {
  createStorage: function (opts) {
    var defaults = {
      ttl: 0 || opts.ttl, // default time to live
      interval: 60 * 1000 || opts.interval // garbage collection interval
    }
    
    return {
      set: function (key, value, ttl = defaults.ttl),
      get: function (key) { return expired ? null : value }
    }
  }
}
```

## Test
```javascript
mocha test/*
```

## Licence
MIT

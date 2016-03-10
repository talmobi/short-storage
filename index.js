var ShortStorage = {
  Storage: function simpleCache (opts) {
    var params = {
      // default ttl (time to live) for keys
      ttl: 0, // infinite

      // time interval to check for and delete expired keys
      interval: 60 * 1000, // in milliseconds
    }
    var opts = opts || {};
    params.ttl = opts.ttl || params.ttl;
    params.interval = opts.interval || params.interval;

    // in memory json object for storage
    var db = {};

    var timeout = function () {
      //console.log("cache garbage collection");
      var count = 0;
      var now = Date.now();
      var keys = Object.keys(db);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var data = db[key];
        if (now > data.__expires_at) {
          delete db[key];
          count++;
        }
      }

      //console.log("trashed " + count + " keys");
      setTimeout(timeout, params.interval);
    };
    timeout();

    var get = function (key) {
      var now = Date.now();
      var data = db[key];
      if (data && (data.__expires_at > now || !data.__expires_at)) {
        return data.value;
      }
      return null;
    };

    var set = function (key, value, ttl) {
      var now = Date.now();
      var ttl = ttl || params.ttl;
      var data = {
        value: value,
        __created_at: now,
        __expires_at: now + ttl
      }
      db[key] = data;
    };

    return {
      get: get,

      put: set,
      set: set,

      del: function (key) {
        db[key] = "";
        delete db[key];
      },

      getJsonObject: function () {
        return db;
      }
    }
  }
}

if (typeof module !== 'undefined') module.exports = ShortStorage;

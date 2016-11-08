function createStorage (opts) {
  var params = {
    // default ttl (time to live) for keys
    ttl: 0, // infinite

    // time interval to check for and delete expired keys
    interval: 60 * 1000 // in milliseconds
  }
  var opts = opts || {};
  params.ttl = opts.ttl || params.ttl;
  params.interval = opts.interval || params.interval;

  // in memory json object for storage
  var db = opts.db || {};

  var timeout = function () {
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

    setTimeout(timeout, params.interval);
  };
  timeout();

  var get = function (key) {
    var now = Date.now();
    var data = db[key];
    if (data && ((data.__expires_at > now) || !data.__expires_at)) {
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
      __expires_at: ttl <= 0 ? 0 : now + ttl
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
};

function createTubeStorage (opts) {
  var params = {
    // default ttl (time to live) for keys
    ttl: 0, // infinite
    max_length: 100 // max number of values
  }
  var opts = opts || {};
  params.ttl = opts.ttl || params.ttl;
  params.max_length = opts.max_length || params.max_length;

  // in memory array for storage
  var db = opts.db || [];

  var shouldRefresh = true;
  var last = {
    now: null,
    amount: null,
    slice: [],
  };

  var pull = function (amount) {
    var now = Date.now();
    var amount = amount || db.length;
    if (amount > db.length) {
      amount = db.length;
    }

    if (now !== last.now || amount !== last.amount) {
      shouldRefresh = true;
    }

    if (shouldRefresh) {
      var slice = db.slice(db.length - amount).filter(function (data) {
        //return (data && (data.__expires_at > now || !data.__expires_at));
        return (data && (data.__expires_at > now || !data.__expires_at));
      }).map(function (data) {
        return data.value;
      }).reverse();

      Object.freeze(slice);
      last.now = now;
      last.amount = amount;
      last.slice = slice;
      shouldRefresh = false;
    }

    return last.slice || [];
  };

  var push = function (value, ttl) {
    shouldRefresh = true;

    var now = Date.now();
    var ttl = ttl || params.ttl;
    var data = {
      value: value,
      __created_at: now,
      __expires_at: ttl <= 0 ? 0 : now + ttl
    }

    db.push( data );

    if (db.length > params.max_length) {
      db = db.slice( db.length - params.max_length );
    }
  };

  return {
    pull: pull,

    push: push,

    // get backing array (dangerous)
    getArray: function () {
      return db;
    }
  }
};

var ShortStorage = {
  Storage: createStorage,
  createStorage: createStorage,

  createTubeStorage: createTubeStorage,
}

if (typeof module !== 'undefined') module.exports = ShortStorage;

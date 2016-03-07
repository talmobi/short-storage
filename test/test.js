var assert = require('assert');
var ss = require('../index.js');

var opts = {
  ttl: 1000, // in ms
  interval: 100 // in ms
};
var db = ss.Storage(opts);

var test_key = 'key';
var test_value = 'value';

describe('short-storage', function () {
  this.timeout(opts.ttl * 1.5);

  describe('#put()', function () {
    it('should not throw an error', function () {
      db.put(test_key, test_value);
    })
  })

  describe('#get() - value', function () {
    it('should return recently put value for key', function () {
      assert.equal( db.get(test_key), test_value);
    })
  })

  describe('#get() - null', function () {
    it('should return null since time has expired for key', function (done) {
      setTimeout(function () {
        assert.equal( db.get(test_key), null);
        done();
      }, opts.ttl);
    })
  })

  describe('keys length 0', function () {
    it('garbage collection interval should have deleted the key and should be length 0', function (done) {
      var json = db.getJsonObject();
      assert.equal( Object.keys( db.getJsonObject() ).length, 1 );
      setTimeout(function () {
        assert.equal( Object.keys( db.getJsonObject() ).length, 0 );
        done();
      }, opts.interval * 1.5);
    })
  })

});



var assert = require('assert');
var ss = require('../index.js');

var opts = {
  ttl: 1000, // in ms
  max_length: 6
};
var tube = ss.createTubeStorage(opts);

var test_key = 'key';
var test_value = 'value';

describe('testing tube storage: require("short-storage").createTubeStorage()', function () {
  this.timeout(3000);

  describe('#push()', function () {
    it('should succeed', function () {
      tube.push(test_value);
    })
  })

  describe('#pull() - array', function () {
    it('should return recently put value for key', function () {
      assert.deepEqual( tube.pull(), [test_value]);
    })
  })

  describe('#pull() - immutable array', function () {
    this.timeout(500);

    it('should catch an error on trying to modify the returned array', function (done) {
      var arr = tube.pull();
      try {
        arr.push('should fail');
      } catch (err) {
        done();
      };
    })
  })

  describe('#pull() - empty array', function () {
    it('should return empty array since time has expired for the value', function (done) {
      setTimeout(function () {
        assert.deepEqual( tube.pull(), []);
        done();
      }, opts.ttl);
    })
  })

  describe('#push(), #pull() - exceed max size', function () {
    it('should return a max_length length array after max_length * 2 insertions', function (done) {
      var max_length = opts.max_length;
      for (var i = 0; i < max_length * 2; i++) {
        tube.push(i);
      };
      var arr = tube.pull();
      assert.equal( arr.length, max_length ); // length matches
      assert.equal( arr[0], max_length * 2 - 1 ); // first value = last value inserted
      assert.deepEqual(arr, tube.pull(max_length));
      assert.deepEqual(arr, tube.pull());
      var sarr = tube.pull(max_length - 1);
      assert.notDeepEqual(arr, sarr);
      assert.equal(arr[1], tube.pull(max_length)[1]);
      tube.push('data');
      assert.equal( tube.getArray().length, max_length);
      done();
    })
  })

  describe('usecase example - chat messages', function () {
    var messages = [
      "Eowyn Atlass: Hi Humphrey!",
    "You: Eowyn - do you know Aixia?",
      "Eowyn Atlass: No :)",
    "You: OK - she is one of your Archaeology peers - but has just dropped off the platform... I'll see if I can help her!",
        "Eowyn Atlass: Okay!",
      "Eowyn Atlass: Hi Aixia",
          "Aixia Castaignede: Hi. Can't seem to manage the flying business yet.",
        "Eowyn Atlass: I fell in the water yesterday when I was riding a bike on Etopia Island",
    "You: don't worry we'll practice that in a moment - just need to see if other people are coming!"
    ];
    Object.freeze(messages);
    var tube = ss.createTubeStorage();

    it('insert chat messages', function (done) {
      assert.deepEqual( tube.pull(), []);

      for (var i = 0; i < messages.length; i++) {
        tube.push( messages[i] );
      }

      assert.deepEqual( tube.pull().slice().reverse(), messages );
      done();
    })
  })

});



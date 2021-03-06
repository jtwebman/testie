'use strict';

const testFixture = require('./test-fixture');
const callOnce = require('./call-once');
const skip = require('./skip');

/**
 * This is a single test with no setup and finish.
 * @param  {String}   message The test message
 * @param  {Function} fn      The function to call for the tests.
 * @return {object}           Returns a test runner.
 */
function test(message, fn) {
  if (fn.length >= 1) { // callback
    return testFixture({message}, 'run', (done) => {
      const finished = callOnce(done);
      const result = fn((testDone) => {
        finished(testDone);
      });
      if (result && typeof result.then === 'function') { // promise
        result.then(() => finished(), finished);
      }
    });
  } else {
    return testFixture({message}, 'run', (done) => {
      try {
        const result = fn();
        if (result && typeof result.then === 'function') { // promise
          result.then(() => done(), done);
        } else { // straight function
          done();
        }
      } catch (err) {
        done(err);
      }
    });
  }
}

test.skip = skip;

module.exports = test;

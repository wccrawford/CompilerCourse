var peg = require('pegjs');
var assert = require('assert');
var evalScheem = require('./scheem_evaluator.js').evalScheem;

describe('Interpreter', function() {
	describe('quote', function() {
		it('should parse a quoted number', function() {
			assert.deepEqual(
				evalScheem(['quote', 3], {}),
				3
			);
		});

		it('should parse a quoted string', function() {
			assert.deepEqual(
				evalScheem(['quote', 'string'], {}),
				'string'
			);
		});

		it('should parse a quoted list', function() {
			assert.deepEqual(
				evalScheem(['quote', [1, 'string', 'test']], {}),
				[1, 'string', 'test']
			);
		});
	});
});


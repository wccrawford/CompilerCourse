var peg = require('pegjs');
var assert = require('assert');
var evalScheem = require('./scheem_evaluator.js').evalScheem;

describe('Interpreter', function() {
	describe('values', function() {
		it('should return numbers', function() {
			assert.deepEqual(
				evalScheem(2, {}),
				2
			);
		});

		it('should return values from variable names', function() {
			assert.deepEqual(
				evalScheem('variable', {variable:'test'}),
				'test'
			);
		});
	});

	describe('math', function() {
		it('should add 2 numbers', function() {
			assert.deepEqual(
				evalScheem(['+', 2, 3], {}),
				5
			);
		});

		it('should subtract 2 numbers', function() {
			assert.deepEqual(
				evalScheem(['-', 5, 3], {}),
				2
			);
		});

		it('should multiply 2 numbers', function() {
			assert.deepEqual(
				evalScheem(['*', 5, 3], {}),
				15
			);
		});

		it('should divide 2 numbers', function() {
			assert.deepEqual(
				evalScheem(['/', 10, 5], {}),
				2
			);
		});
	});

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


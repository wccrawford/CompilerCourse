if(typeof require != 'undefined') {
	var peg = require('pegjs');
	var assert = require('assert');
	var evalScheem = require('../scheem_evaluator.js').evalScheem;
}

describe('Interpreter', function() {
	describe('begin', function() {
		it('should return only value from a set', function() {
			assert.deepEqual(
				evalScheem(['begin', 1], {}),
				1
			);
		});

		it('should return the last value from a set', function() {
			assert.deepEqual(
				evalScheem(['begin', 1, 2, 3, 4], {}),
				4
			);
		});
	});
	
	describe('values', function() {
		it('should return numbers', function() {
			assert.deepEqual(
				evalScheem(2, {}),
				2
			);
		});

		it('should return numbers if they\'re the only item in a list', function() {
			assert.deepEqual(
				evalScheem([2], {}),
				2
			);
		});

		it('should return values from variable names', function() {
			assert.deepEqual(
				evalScheem('variable', {variable:'test'}),
				'test'
			);
		});

		it('should define values for new variable names', function() {
			var env = {};
			assert.deepEqual(
				evalScheem(['define', 'variable', 5], env),
				0
			);
			assert.deepEqual(env['variable'], 5);
		});

		it('should define values for new variable names and return it from begin', function() {
			var env = {};
			assert.deepEqual(
				evalScheem(['begin', ['define', 'variable', 5], 'variable'], env),
				5
			);
			assert.deepEqual(env['variable'], 5);
		});
		
		it('should set! values for new variable names', function() {
			var env = {variable:6};
			assert.deepEqual(
				evalScheem(['set!', 'variable', 5], env),
				0
			);
			assert.deepEqual(env['variable'], 5);
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

	describe('conditionals', function() {
		it('should evaluate < as true when left is <', function() {
			assert.deepEqual(
				evalScheem(['<', 1, 3], {}),
				'#t'
			);
		});

		it('should evaluate < as false when left is =', function() {
			assert.deepEqual(
				evalScheem(['<', 1, 1], {}),
				'#f'
			);
		});

		it('should evaluate < as false when left is >', function() {
			assert.deepEqual(
				evalScheem(['<', 3, 1], {}),
				'#f'
			);
		});

		it('should evaluate = as false when left is <', function() {
			assert.deepEqual(
				evalScheem(['=', 1, 3], {}),
				'#f'
			);
		});

		it('should evaluate = as true when left is =', function() {
			assert.deepEqual(
				evalScheem(['=', 1, 1], {}),
				'#t'
			);
		});

		it('should evaluate = as false when left is >', function() {
			assert.deepEqual(
				evalScheem(['=', 3, 1], {}),
				'#f'
			);
		});

		it('should return first value if conditional is true', function() {
			assert.deepEqual(
				evalScheem(['if', ['=', 1, 1], 2, 3], {}),
				2
			);
		});
		
		it('should return second value if conditional is false', function() {
			assert.deepEqual(
				evalScheem(['if', ['=', 1, 0], 2, 3], {}),
				3
			);
		});
	});

	describe('arrays', function() {
		it('should insert a number into an array with cons', function() {
			assert.deepEqual(
				evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
				[1, 2, 3]
			);
		});

		it('should insert an array into an array with cons', function() {
			assert.deepEqual(
				evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
				[[1, 2], 3, 4]
			);
		});

		it('should return the first item in array with car', function() {
			assert.deepEqual(
				evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
				[1, 2]
			);
		});

		it('should return all but the first item in array with cdr', function() {
			assert.deepEqual(
				evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
				[3, 4]
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


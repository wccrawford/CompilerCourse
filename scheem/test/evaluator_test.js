if(typeof module != 'undefined') {
    var assert = require('chai').assert;
//	var assert = require('assert');
    var fs = require('fs');
	var scheem = require('../scheem_evaluator.js');
	var evalScheem = scheem.evalScheem;

//    var peg = require('pegjs');
//    var parse = peg.buildParser(fs.readFileSync('scheem.peg', 'utf-8')).parse;
}

suite('begin', function() {
	test('should return only value from a set', function() {
		assert.deepEqual(
			evalScheem(['begin', 1], {}),
			1
		);
	});

	test('should return the last value from a set', function() {
		assert.deepEqual(
			evalScheem(['begin', 1, 2, 3, 4], {}),
			4
		);
	});
});

suite('values', function() {
	test('should return numbers', function() {
		assert.deepEqual(
			evalScheem(2, {}),
			2
		);
	});

	/*test('should return numbers if they\'re the only item in a list', function() {
		assert.deepEqual(
			evalScheem([2], {}),
			2
		);
	});*/

	test('should return values from variable names', function() {
		assert.deepEqual(
			evalScheem('variable', scheem.update({}, 'variable', 'test')),
			'test'
		);
	});

	test('should define values for new variable names', function() {
		var env = {};
		assert.deepEqual(
			evalScheem(['define', 'variable', 5], env),
			0
		);
		assert.deepEqual(scheem.lookup(env, 'variable'), 5);
	});

	test('should be able to redefine values for existing variable names', function() {
		var env = scheem.update({}, 'variable', 6);
		assert.deepEqual(
			evalScheem(['define', 'variable', 5], env),
			0
		);
		assert.deepEqual(scheem.lookup(env, 'variable'), 5);
	});

	test('should define values for new variable names and return it from begin', function() {
		var env = {};
		assert.deepEqual(
			evalScheem(['begin', ['define', 'variable', 5], 'variable'], env),
			5
		);
		assert.deepEqual(scheem.lookup(env, 'variable'), 5);
	});
	
	test('should set! values for new variable names', function() {
		var env = scheem.update({}, 'variable', 6);
		assert.deepEqual(
			evalScheem(['set!', 'variable', 5], env),
			0
		);
		assert.deepEqual(scheem.lookup(env, 'variable'), 5);
	});

	test('should throw exception with set! when variable isn\'t already set', function() {
		assert.throws(function() {
			evalScheem(['set!', 'variable', 5], {});
		});
	});
});

suite('math', function() {
	test('should add 2 numbers', function() {
		assert.deepEqual(
			evalScheem(['+', 2, 3], {}),
			5
		);
	});
	test('should add 2 variables that are numbers', function() {
		var env = {};
		scheem.update(env, 'x', 2);
		scheem.update(env, 'y', 3);
		assert.deepEqual(
			evalScheem(['+', 'x', 'y'], env),
			5
		);
	});

	test('should throw exception if first argument of + is not numeric', function() {
		assert.throws(function() {
			evalScheem(['+', ['quote', 'x'], 3], {})
		});
	});

	test('should throw exception if second argument of + is not numeric', function() {
		assert.throws(function() {
			evalScheem(['+', 1, ['quote', 'x']], {})
		});
	});

	test('should subtract 2 numbers', function() {
		assert.deepEqual(
			evalScheem(['-', 5, 3], {}),
			2
		);
	});

	test('should throw exception if first argument of - is not numeric', function() {
		assert.throws(function() {
			evalScheem(['-', ['quote', 'x'], 3], {})
		});
	});

	test('should throw exception if second argument of - is not numeric', function() {
		assert.throws(function() {
			evalScheem(['-', 1, ['quote', 'x']], {})
		});
	});

	test('should multiply 2 numbers', function() {
		assert.deepEqual(
			evalScheem(['*', 5, 3], {}),
			15
		);
	});

	test('should throw exception if first argument of * is not numeric', function() {
		assert.throws(function() {
			evalScheem(['*', ['quote', 'x'], 3], {})
		});
	});

	test('should throw exception if second argument of * is not numeric', function() {
		assert.throws(function() {
			evalScheem(['*', 1, ['quote', 'x']], {})
		});
	});

	test('should divide 2 numbers', function() {
		assert.deepEqual(
			evalScheem(['/', 10, 5], {}),
			2
		);
	});
	
	test('should throw exception if first argument of / is not numeric', function() {
		assert.throws(function() {
			evalScheem(['/', ['quote', 'x'], 3], {})
		});
	});

	test('should throw exception if second argument of / is not numeric', function() {
		assert.throws(function() {
			evalScheem(['/', 1, ['quote', 'x']], {})
		});
	});

	test('should throw exception if second argument of / is 0', function() {
		assert.throws(function() {
			evalScheem(['/', 1, 0], {})
		});
	});
});

suite('comparisons', function() {
	test('should evaluate < as true when left is <', function() {
		assert.deepEqual(
			evalScheem(['<', 1, 3], {}),
			'#t'
		);
	});

	test('should evaluate < as false when left is =', function() {
		assert.deepEqual(
			evalScheem(['<', 1, 1], {}),
			'#f'
		);
	});

	test('should evaluate < as false when left is >', function() {
		assert.deepEqual(
			evalScheem(['<', 3, 1], {}),
			'#f'
		);
	});

	test('should evaluate < as true when left is <, with expressions', function() {
		assert.deepEqual(
			evalScheem(['<', ['+', 1, 1], ['+', 3, 1]], {}),
			'#t'
		);
	});

	test('should evaluate < as false when left is =, with expressions', function() {
		assert.deepEqual(
			evalScheem(['<', ['+', 1, 3], ['+', 1, 3]], {}),
			'#f'
		);
	});

	test('should evaluate = as false when left is <', function() {
		assert.deepEqual(
			evalScheem(['=', 1, 3], {}),
			'#f'
		);
	});

	test('should evaluate = as true when left is =', function() {
		assert.deepEqual(
			evalScheem(['=', 1, 1], {}),
			'#t'
		);
	});

	test('should evaluate = as false when left is >', function() {
		assert.deepEqual(
			evalScheem(['=', 3, 1], {}),
			'#f'
		);
	});

	test('should return first value if conditional is true', function() {
		assert.deepEqual(
			evalScheem(['if', ['=', 1, 1], 2, 3], {}),
			2
		);
	});
	
	test('should return second value if conditional is false', function() {
		assert.deepEqual(
			evalScheem(['if', ['=', 1, 0], 2, 3], {}),
			3
		);
	});

	test('should throw exception if conditional is neither true nor false', function() {
		assert.throws(function() {
			evalScheem(['if', 1, 2, 3], {})
		});
	});
});

suite('arrays', function() {
	test('should insert a number into an array with cons', function() {
		assert.deepEqual(
			evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
			[1, 2, 3]
		);
	});

	test('should insert an array into an array with cons', function() {
		assert.deepEqual(
			evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
			[[1, 2], 3, 4]
		);
	});

	test('should throw exception if second argument of cons isn\'t a list', function() {
		assert.throws(function() {
			evalScheem(['cons', ['quote', [1, 2]], ['quote', 3]], {});
		});
	});

	test('should return the first item in array with car', function() {
		assert.deepEqual(
			evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
			[1, 2]
		);
	});

	test('should throw exception if first argument of car isn\'t a list', function() {
		assert.throws(function() {
			evalScheem(['car', ['quote', 1]], {});
		});
	});

	test('should return all but the first item in array with cdr', function() {
		assert.deepEqual(
			evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
			[3, 4]
		);
	});
	
	test('should throw exception if first argument of cdr isn\'t a list', function() {
		assert.throws(function() {
			evalScheem(['cdr', ['quote', 1]], {});
		});
	});
});

suite('quote', function() {
	test('should parse a quoted number', function() {
		assert.deepEqual(
			evalScheem(['quote', 3], {}),
			3
		);
	});

	test('should parse a quoted string', function() {
		assert.deepEqual(
			evalScheem(['quote', 'string'], {}),
			'string'
		);
	});

	test('should parse a quoted list', function() {
		assert.deepEqual(
			evalScheem(['quote', [1, 'string', 'test']], {}),
			[1, 'string', 'test']
		);
	});
});

suite('lamba-one', function() {
	test('should return a function that returns the argument', function() {
		assert.deepEqual(
			evalScheem([['lambda-one', 'x', 'x'], 5], {}),
			5
		);
	});	

	test('should return a function that returns the argument + 1', function() {
		assert.deepEqual(
			evalScheem([['lambda-one', 'x', ['+', 'x', 1]], 5], {}),
			6
		);
	});

	test('should return a series of functions that add the arguments', function() {
		assert.deepEqual(		
			evalScheem([[['lambda-one', 'x', ['lambda-one', 'y', ['+', 'x', 'y']]], 5], 3], {}),
			8
		);
	});
});

suite('lambda', function() {
	test('should return a function that add 1 to the argument', function() {
		assert.deepEqual(
			evalScheem([['lambda', ['x'], ['+', 'x', 1]], 5], {}),
			6
		);
	});

	test('should return a function that adds the arguments', function() {
		assert.deepEqual(
			evalScheem([['lambda', ['x', 'y'], ['+', 'x', 'y']], 5, 6], {}),
			11
		);
	});
});

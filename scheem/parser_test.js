var peg = require('pegjs');
var fs = require('fs');
var assert = require('assert');

describe('Parser', function() {
	var grammar = fs.readFileSync('scheem.peg', 'utf-8');
	var parse = peg.buildParser(grammar).parse;

	describe('expressions', function() {
		it('should parse a single expression', function() {
			assert.deepEqual(parse('(+ A B)'), ["+", "A", "B"]);
		});

		it('should parse expressions within expressions', function() {
			assert.deepEqual(parse('(+ (test A B) (sample C D))'), 
				['+', ['test', 'A', 'B'], ['sample', 'C', 'D'] ]
			);
		});
	});
});

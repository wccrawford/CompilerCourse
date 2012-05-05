var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
	if (typeof expr === 'string') {
		return env[expr];
	}

    // Look at head of list for operation
    switch (expr[0]) {
        case '+':
			if((typeof expr[1] !== 'number') || (typeof expr[2] !== 'number')) {
				throw new Error('Both arguments for math functions must be numeric.');
			}
            return evalScheem(expr[1], env) + evalScheem(expr[2], env);
        case '-':
			if((typeof expr[1] !== 'number') || (typeof expr[2] !== 'number')) {
				throw new Error('Both arguments for math functions must be numeric.');
			}
            return evalScheem(expr[1], env) - evalScheem(expr[2], env);
        case '*':
			if((typeof expr[1] !== 'number') || (typeof expr[2] !== 'number')) {
				throw new Error('Both arguments for math functions must be numeric.');
			}
            return evalScheem(expr[1], env) * evalScheem(expr[2], env);
        case '/':
			if((typeof expr[1] !== 'number') || (typeof expr[2] !== 'number')) {
				throw new Error('Both arguments for math functions must be numeric.');
			}
			if(expr[2] == '0') {
				throw new Error('Cannot divide by zero.');
			}
            return evalScheem(expr[1], env) / evalScheem(expr[2], env);

		case 'set!':
			if(typeof env[expr[1]] === 'undefined') {
				throw new Error('Cannot use set! on variable that is not yet defined.');
			}
        case 'define':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
		
		case 'begin':
            var val;
            for(var i=1; i<expr.length; i++) {
                val = evalScheem(expr[i], env);
            }
            return val;
		
		case 'cons':
            var arr = evalScheem(expr[2]);
			if(toString.call(arr) !== '[object Array]') {
				throw new Error('Second argument of cons must be a list.');
			}
            arr.unshift(evalScheem(expr[1]));
            return arr;
        case 'car':
            var arr = evalScheem(expr[1]);
			if(toString.call(arr) !== '[object Array]') {
				throw new Error('First argument of car must be a list.');
			}
            return arr.shift();
        case 'cdr':
            var arr = evalScheem(expr[1]);
			if(toString.call(arr) !== '[object Array]') {
				throw new Error('First argument of cdr must be a list.');
			}
            arr.shift();
            return arr;

		case '<':
			return (expr[1] < expr[2]) ? '#t' : '#f';
		case '=':
			return (expr[1] == expr[2]) ? '#t' : '#f';

		case 'if':
			var eval = evalScheem(expr[1]);
			if(eval == '#t') {
                return evalScheem(expr[2]);
            } else if(eval == '#f') {
                return evalScheem(expr[3]);
            } else {
				throw new Error('Conditional is neither true nor false.');
			}

        case 'quote':
            return expr[1];

		default:
			return evalScheem(expr[0]);
    }
};

if (typeof exports !== 'undefined') {
	exports.evalScheem = evalScheem;
}

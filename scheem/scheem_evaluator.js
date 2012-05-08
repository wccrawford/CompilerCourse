var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
	if (typeof expr === 'string') {
		return lookup(env, expr);
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
			if(lookup(env, expr[1]) === undefined) {
				throw new Error('Cannot use set! on variable that is not yet defined.');
			}
        case 'define':
            //env[expr[1]] = evalScheem(expr[2], env);
			update(env, expr[1], evalScheem(expr[2], env));
            return 0;
        case 'let-one':
            var newBindings = {};
            newBindings[expr[1]] = evalScheem(expr[2], env);
            var tmpEnv = {
                bindings: newBindings,
                outer: env
            };
            return evalScheem(expr[3], tmpEnv);
		
		case 'begin':
            var val;
            for(var i=1; i<expr.length; i++) {
                val = evalScheem(expr[i], env);
            }
            return val;
		
		case 'cons':
            var arr = evalScheem(expr[2], env);
			if(toString.call(arr) !== '[object Array]') {
				throw new Error('Second argument of cons must be a list.');
			}
            arr.unshift(evalScheem(expr[1], env));
            return arr;
        case 'car':
            var arr = evalScheem(expr[1], env);
			if(toString.call(arr) !== '[object Array]') {
				throw new Error('First argument of car must be a list.');
			}
            return arr.shift();
        case 'cdr':
            var arr = evalScheem(expr[1], env);
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
			var eval = evalScheem(expr[1], env);
			if(eval == '#t') {
                return evalScheem(expr[2], env);
            } else if(eval == '#f') {
                return evalScheem(expr[3], env);
            } else {
				throw new Error('Conditional is neither true nor false.');
			}

        case 'quote':
            return expr[1];

		default:
			return (lookup(env, expr[0]))(evalScheem(expr[1], env));
    }
};

var lookup = function (env, v) {
    if(env.bindings[v] !== undefined) {
        return env.bindings[v];
    }
    
    if(env.outer !== undefined) {
        return lookup(env.outer, v);
    }
    
    return undefined;
};

var update = function (env, v, val) {
	if(env.bindings === undefined) {
		env.bindings = {};
	}

	if(lookup(env, v) === undefined) {
		env.bindings[v] = val;
		return env;
	}

    if(env.bindings[v] !== undefined) {
        env.bindings[v] = val;
        return env;
    }
    
    if(env.outer !== undefined) {
        return update(env.outer, v, val);
    }
    
    return undefined;
};

var add_binding = function (env, v, val) {
    env.bindings[v] = val;
};

if (typeof exports !== 'undefined') {
	exports.evalScheem = evalScheem;
	exports.update = update;
	exports.lookup = lookup;
}

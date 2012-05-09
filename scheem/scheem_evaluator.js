var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
	if (typeof expr === 'string') {
		return lookup(env, expr);
	}

	if(env.bindings === undefined) {
		env.bindings = [];
	}

	/* Math */
	add_binding(env, '+', function(expr1, expr2) {
		var arg1 = evalScheem(expr1, env);
		var arg2 = evalScheem(expr2, env);
		if((typeof arg1 !== 'number') || (typeof arg2 !== 'number')) {
			throw new Error('Both arguments for math functions must be numeric.');
		}
		return arg1 + arg2;
	});
	add_binding(env, '-', function(expr1, expr2) {
		var arg1 = evalScheem(expr1, env);
		var arg2 = evalScheem(expr2, env);
		if((typeof arg1 !== 'number') || (typeof arg2 !== 'number')) {
			throw new Error('Both arguments for math functions must be numeric.');
		}
		return arg1 - arg2;
	});
	add_binding(env, '*', function(expr1, expr2) {
		var arg1 = evalScheem(expr1, env);
		var arg2 = evalScheem(expr2, env);
		if((typeof arg1 !== 'number') || (typeof arg2 !== 'number')) {
			throw new Error('Both arguments for math functions must be numeric.');
		}
		return arg1 * arg2;
	});
	add_binding(env, '/', function(expr1, expr2) {
		var arg1 = evalScheem(expr1, env);
		var arg2 = evalScheem(expr2, env);
		if((typeof arg1 !== 'number') || (typeof arg2 !== 'number')) {
			throw new Error('Both arguments for math functions must be numeric.');
		}
		if(arg2 == 0) {
			throw new Error('Cannot divide by zero.');
		}
		return arg1 / arg2;
	});

	/* Variables */
	add_binding(env, 'define', function(expr1, expr2) {
		update(env, expr1, evalScheem(expr2, env));
		return 0;
	});
	add_binding(env, 'set!', function(expr1, expr2) {
		if(lookup(env, expr1) === undefined) {
			throw new Error('Cannot use set! on variable that is not yet defined.');
		}
		update(env, expr1, evalScheem(expr2, env));
		return 0;
	});
	add_binding(env, 'let-one', function(expr1, expr2, expr3) {
		var newBindings = {};
		newBindings[expr1] = evalScheem(expr2, env);
		var tmpEnv = {
			bindings: newBindings,
			outer: env
		};
		return evalScheem(expr3, tmpEnv);
	});

	/* Begin */
	add_binding(env, 'begin', function() {
	console.log(arguments);
		var val;
		for(var i=0; i<arguments.length; i++) {
			val = evalScheem(arguments[i], env);
		}
		return val;
	});

    // Look at head of list for operation
    switch (expr[0]) {
/*
		*/
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

		case 'lambda-one':
			return function(arg) {
                var newenv = {
                    bindings: [],
                    outer: env
                };
                newenv.bindings[expr[1]] = arg;
                
                return evalScheem(expr[2], newenv);
            };
		case 'lambda':
			return function() {
                var newenv = {
                    bindings: [],
                    outer: env
                };
				for(var argIndex = 0; argIndex < expr[1].length; argIndex++) {
					var arg = arguments[argIndex];
                	newenv.bindings[expr[1][argIndex]] = arg;
				}
                
                return evalScheem(expr[2], newenv);
            };	

		default:
            var func = evalScheem(expr[0], env);
            var args = [];
			for(var i = 1; i < expr.length; i++) {
				args.push(expr[i]);
			}
            return func.apply(null, args);
			
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

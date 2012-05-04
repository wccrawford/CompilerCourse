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
            return evalScheem(expr[1], env) + evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) - evalScheem(expr[2], env);
        case '*':
            return evalScheem(expr[1], env) * evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) / evalScheem(expr[2], env);

		case 'set!':
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
            arr.unshift(evalScheem(expr[1]));
            return arr;
        case 'car':
            var arr = evalScheem(expr[1]);
            return arr.shift();
        case 'cdr':
            var arr = evalScheem(expr[1]);
            arr.shift();
            return arr;

		case '<':
			return (expr[1] < expr[2]) ? '#t' : '#f';
		case '=':
			return (expr[1] == expr[2]) ? '#t' : '#f';

		case 'if':
			if(evalScheem(expr[1]) == '#t') {
                return evalScheem(expr[2]);
            } else {
                return evalScheem(expr[3]);
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

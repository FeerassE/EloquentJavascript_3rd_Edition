//************** Chapter 12: Project -> A Programming Language ***********//


/* 

To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
  Table of Contents
  -----------------------------
* Prasing
* The Evaluator
* Special Forms
* The Environment
* Functions
* Compilation
* Cheating
*/


// We're creating a programming language called 'Egg'

/********** Parsing ************/

// The 'parse' function will give us back an object that has a data type attached to it. 
// This object will have a type and object might have other objects as properties that will also 
// have a type.

// A parser is a program that reads a piece of text and produces a data 
// structure that reflects the structure of the program contained in that text.

// A parser produces a data structure or program?

// Everything in Egg is an 'expression'

// An 'expresssion' can be the name of a binding, a number, a string, or an application.

// Strings will be sequence of characters wrapped in double quotes("").
// Numbers are a sequence of digits

// Binding names can consist of any character that is not a whitespace and that does
// not have a special meaning in the syntax.

// 'Applications' are written in JavaScript by putting parentheses after an expression and having
// any number of arguments between those parentheses, separated by commas.

do(define(x,10), if(>(x,5), print("large"), print("small")));

// notice that the operator (>) is written as a function call.

// Egg will have all operators just be normal bindings applied like other functions.

// There is not blocking so, the 'do' syntax will perform things in a sequence.



// The parser describes a program through a data structure that's made of expression objects.
// Each expression object has a 'type' associated with it.

// Expressions with type 'value' are literal strings or numbers.
// Their 'value' property contains the string or number.

// Expressions of type 'word' are used for identifiers(names).
// Their 'name' property has the identifiers name as a string.

// Expressions of type 'appl'y are used for applications.
// Their 'operator' property refers to the expression being applied
// Their 'args' property holds an array of argument expressions.

// >(x,5) from the previous program would be represented like this.

{
    type: "apply",
    operator: {type: "word", name: ">"},
    args: [
        {type: "word", name: "x"},
        {type: "value", value: 5}
    ]
}


// A data structure like this is called a 'syntax tree'.
// Notice how the expression 'apply' has expressions within it (operator, args).


// We're going to write a recursive function because Application expressions contain
// expressions.

// parseExpression() takes a string as input.
// parseExpression() returns an object containing the data structure for 
//                   the expression at the start of the string and then end of the string.

// parseExpression() will be called again when parsing subexpression like (the argument to an appliction).
//                   

function parseExpression(program) {
    program = skipSpace(program);
    // first we cutt off the whitespace
    let match, expr;
    if (match = /^"([^"]*)"/.exec(program)) {
        // looking for a string.
        expr = {type: "value", value: match[1]};
    } else if (match = /^\d+\b/.exec(program)) {
                // looking for a number
        expr = {type: "value", value: Number(match[0])};
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
        // looking for names
        expr = {type: "word", name: match[0]};
    } else {
        throw new SyntaxError("Unexpected syntax: " + program);
    }

    // We cut the beginning of the string and call parseApply on the rest.
    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    // skipSpace deletes whitespace at the front of the string

    let first = string.search(/\S/);
    // \S is a character that is NOT a whitespace character
    // .search returns the index of the first character
    if (first == -1) return "";

    return string.slice(first);
    // returns the string without whitespace
}

// Once parseApply is called, we check if the remaining part of the expression is an application.


function parseApply(expr, program) {
    // parseApply does the final check and parse if the rest is an Application
    program = skipSpace(program);
    // first remove white space from program string
    if(program[0] != "(") {
        // if there is not a opening parantheses it is not an application and
        // returns the expression it was given
        return {expr: expr, rest: program};
    }

    program = skipSpace(program.slice(1));
    // remove white space after first parantheses
    expr = {type: "apply", operator: expr, args: []};
    while (program[0] != ")") {
        let arg = parseExpresssion(program);
        // return the datastructure of the arguments
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",") {
            program = skipSpace(program.slice(1));
            // check if we're at the comma for the next argument
        } else if (program[0] != ")") {
            throw new SyntaxError("expected ',' or ')'");
        }
    }
    return parseApply(expr, program.slice(1));
}

// the recursion is indirect, parseApply and parseExpression call each other.

/*
Because an application expression can itself be applied (such as in multiplier(2)(1)), parseApply must, 
after it has parsed an application, call itself again to check whether another pair of parentheses follows.

What does that mean?
*/

function parse(program) {
    let {expr, rest} = parseExpression(program);
    if (skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

console.log(parse("+(a, 10)"));
/*
log:
{
type : "apply",
 operator: {type: "word", name: "+"},
 args: [{type: "word", name: "a"},
        {type: "value", value: 10}]
}


*/

/************ * The Evaluator **************/

// Evaluator runs the syntax tree. 


const specialForms = Object.create(null);

function evaluate(expr, scope) {
    // Evaluate returns a value!

    // scope is an object whose properties are bindings and the value of 
    // those properties are the values attached to the bindings.

    if (expr.type == "value") {
        // It just returns the value
        return expr.value;
    } else if (expr.type == "word") {
        // Evaluate binding
        if(expr.name in scope) {
            // Checks if the binding is defined in the scope
            return scope[expr.name];
        } else {
            throw new ReferenceError(
                `Undefined binding: ${expr.name}`)
        }
    } else if (expr.type == "apply") {
        let {operator, args} = expr;
        if (operator.type == "word" && operator.name in specialForms){
            // Check if operator is a 'special' syntax word 
            return specialForms[operator.name](expr.args, scope);
        } else {
            // Now we use evaluate on the operator data structure
            let op = evaluate(operator,scope);
            if (typeof op == "function") {
                // Now we take the arguments and return their values
                // and this array of arguments will be evaluated by op.
                return op(...args.map(arg => evaluate(arg, scope)));
            } else {
                throw new TypeError("Applying a non-function.");``
            }
        }
    }
}

/************ * Special Forms ************/

// Adding the special syntax of 'if' to special forms.

specialForms.if = (args, scope) => {
    // This 'if' requires exactly three arguments
    if (args.length != 3) {
        throw new SyntaxError("Wrong number of args to if");
    } else if (evaluate(args[0], scope) !== false) {
        // So we'll evaluate the first argument and if it's true than 
        // we'll evaluate the second
        return evaluate(args[1], scope);
    } else {
        // Else we'll just evaluate the third.
        return evaluate(args[2], scope);
    }
};

// This 'if' syntax works more like the ternerary operator. 
// It's an expression not a statement.

// 'if' also needs the precise value of false. 

// 'if' is special because other functions will evaluate all of their arguments.
// 'if' needs to evaluate only the second or third depending on the value of the first.  


// while is similar

specialForms.while = (args, scope) => {
    if (args.length != 2) {
        throw new SyntaxError("Wrong number of args to while");
    }
    while (evaluate(args[0], scope) !== false) {
        evaluate(args[1], scope);
    }

    // Since undefined does not exist in Egg, we return false,
    // for lack of a meaningful result.
    return false;
}


specialForms.do = (args, scope) => {
    let value = false;
    for (let arg of args) {
        value = evaluate(arg, scope);
    }
    return value;
};


// Creating new bindings

// We'll create a special form called 'define'

// Expects a word as its first argument.
// Expects an expression that produces the value to assing to the word as the second argument.

// 'define' is an expresssion so it must return a value.
// it will return the value that was assigned like JavaScript's '=' operator. 

specialForms.define = (args, scope) => {
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of define");
    }
    let value = evaluate(args[1], scope);
    scope[args[0].name] = value;
    return value;
}



/*************** * The Environment *************/


// The scope accepted by evaluate is an object with properties whose names
// correspond to binding names and whose values correspond to the values those bindings
// are bound to. 

// So 'scope' is an object 

// We'll make the boolean values

const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;


// Apparently we're negating a boolean value below:
let prog = parse(`if(true, false, true)`);
console.log(evaluate(prog, topScope));
// → false


// We add each operator binding to the top scope
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    topScope[op] = Function("a, b", `return a ${op} b;`);
}


topScope.print = value => {
    console.log(value);
    return value;
};

// The following function provides a convenient way to parse a program
// and run it in a fresh scope:

// remember that evaluate returns a value and parse returns an data structure object
function run(program) {
    return evaluate(parse(program), Object.create(topScope));
}

// Egg will use object prototype chains to represent nested scopes
// so that the program can add bindings to its local scope
// without changing top-level scope.

run(`
do(define(total, 0),
   define(count, 1),
   while(<(count, 11),
            do(define(total, +(total, count)),
               define(count, +(count, 1)))),
               print(total))`
            );
            // -> 55



/************* * Functions ***********/


// for the 'fun' construct, the last argument is the 
// function's body and all arguments before are the 
// function's parameters


specialForms.fun = (args, scope) => {
    // args is an array
    if(!args.length) {
        // There's no arguments as in no body or paramters than throw an error.
        throw new SyntaxError("Functions need a body");
    }
    let body = args[args.length - 1];
    // the body variable is the last argument in the array.
    let params = args.slice(0, args.length - 1).map(expr => {
        // params will be an array of parameters which are words not numbers;
        if (expr.type != "word") {
            throw new SyntaxError("Paramater names must be words");
        }
        return expr.name;
    });

    return function() {
        if (arguments.length != params.length) {
            throw new TypeError("Wrong number of arguments");
        }
        let localScope = Object.create(scope);
        for(let i = 0; i < arguments.length; i++) {
            localScope[params[i]] = arguments[i];
        }
        return evaluate(body, localScope);
    };
};

// Functions in Egg get their own local scope.
// Function produced by the 'fun' form creates a local scope and adds the 
// argument bindings to it. 
// then evaluates the function body in this scope and returns the result. 

run(`
do(define(plusOne, fun(a, +(a,1))),
    print(plusOne(10)))
`);
// -> 11

run(`
do(define(pow, fun(base, exp,
    if(==(exp, 0),
    1,
    *(base, pow(base, -(exp, 1)))))),
    print(pow(2,10)))
    `);
// -> 1024




/************* * Compilation ************/

// Process that occurs between parsing and running a program.
// Allows program to be evaluated more efficiently. 



/************ * Cheating *************/

// Book talks about creating languages for very specific purposes.
// They are called: Domain-Specific Languages


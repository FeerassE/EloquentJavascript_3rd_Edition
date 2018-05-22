//********** The Secret Life of Objects *********//

// Object oriented programming is programming that uses Objects
// as the central principle of program organization

// Core idea of object oriented programming is to divide programs into 
// smaller pieces, and make each peice responsible for managing it's own state.

// To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
//   Table of Contents
//   -----------------------------
// * Encapsulation
// * Methods
// * Prototypes
// * Classes
// * Class Notation
// * Overriding Derived Properties
// * Maps
// * Polymorphism
// * Symbols
// * The Iterator Interface
// * More on Symbols from Mozilla 
// * Getters, Setters, and Statics
// * Inheritance
// * The Instanceof Operator


/**** * Encapsulation ******/

// Core idea of object oriented programming is to divide programs into 
// smaller pieces, and make each piece responsible for managing it's own state.

// The knowledge about the way a piece of program works is kept local to that piece.

// Each piece uses an 'interace', which are made of a limited set of functions and bindings
// to interace with each other. 

// These pieces are called Objects.
// Objects are made of properties and methods.
// Methods that are part of the 'interface' are called 'public'.
// Ones that are only meant to run locally are called 'private'.

// It is common to put an ('_') underscore character at the start of property names to
// indicate they are private.


/***** Methods ******/

// Are properties that hold function values.
// ex:

let rabbit = {};
rabbit.speak = function(line) {
    console.log(`The rabbit says '${line}'`);
}

rabbit.speak("I'm alive.");
// The rabbit says I'm alive. 


// When methods are called on an object, the 'this' binding points to that object.

function speak(line){
    console.log(`The ${this.type} rabbit says '${line}'`);

}

let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("Oh my ears and whiskers, " + "how late it's getting!");

// log: The white rabbit says 'Oh my ears and whiskers, how late it's getting!'

hungryRabbit.speak("I could use a carrot right now.");

// log: The hungry rabbit says 'I could use a carrot right now.'


// You can pass the type explicity by using the call method.

speak.call(hungryRabbit, "Burp!");

// log: The hungry rabbit says 'Burp!'.


// *NOTE ON THIS* 
// Each function has its own 'this' binding
// The value of 'this' depends on the way it is called

// What does this mean? --> "You cannot refer to the 'this' of the wrapping scope in a regular
// function defined with the 'function' keyword"

// Arrow functions are different apparently
// They do not bind their own 'this', but can see the this binding of the scope around them.
// The code below references 'this' from inside a local function.

function normalize() {
    console.log(this.coords.map(n => n / this.length));
}

normalize.call({coords: [0,2,3], length: 5});
// log: [0, 0.4, 0.6]

// apparently if we used the 'function' keyword, the code wouldn't have worked.

// MY OWN TEST

function testThis(){
    console.log(this.coords.map(function(n) {return n/ this.length}));
}

testThis.call({coords: [0,6,8]});

// log: [NaN, NaN, NaN]

testThis.call({coords: [0,6,8], length: 2})

// log: [NaN, NaN, NaN]

function testThisWithAnonFunc(){
    console.log(this.coords.map((n) => {return n/ this.length}));
}

// log: [NaN, NaN, NaN]

testThisWithAnonFunc.call({coords: [0,6,8], length: 2})

// log: [0,3,4]


/****** Prototypes ******/

let empty = {};
console.log(empty.toString);
// log: function to String(){...}
console.log(empty.toString());
// log: [object Object]

// Objects have prototypes
// The prototype of an empty object is Object.prototype --> behind almost all objects

console.log(Object.getPrototypeOf({}) == Object.prototype);

// log: true
console.log(Object.getPrototypeOf(Object.prototype));
// log: null



// Many object don't directly have Object.prototype as their prototype
// They might have Function.prototype or Array.prototype as their prototype

console.log(Object.getPrototypeOf(Math.max) == Function.prototype);

// log: true

console.log(Object.getPrototypeOf([]) == Array.prototype);

// log: true


// We can use Object.create to create an object with a specific prototype
let protoRabbit = {

    // Notice that there's no function keyword.
    // This is a short hand for creating a method property
    speak(line) {
        console.log(`This ${this.type} rabbit says '${line}'`);
    }
};

let killerRabbit = Object.create(protoRabbit);
killerRabbit.type = "killer";
killerRabbit.speak("SKREEEE!");
// log: The killer rabbit says 'SKREEEE!'



/****** * Classes *******/

// Classes create an elegant prototype system
// Think of classes as a template

// A 'class' defines the shape of a type of object a.k.a - what methods and properties it has
// These objects that derive from the class are 'instances' of the class


// ? I belive that Classes allow us to create instances without relying on using prototypes completely

// This is what a constructor DOES:
function makeRabbit(type){
    let rabbit = Object.create(protoRabbit);
    rabbit.type = type;
    return rabbit;
}

// Constructors allow us to create an instance of a class with the appropriate methods and properties associated
// with that class

// Instead of writing the above function, we can use the 'new' keyword to instantiate an instance of the class

function Rabbit(type){
    this.type = type;
}
Rabbit.prototype.speak = function(line){
    console.log(`The ${this.type} rabbit says '${line}'`);
};
let weirdRabbit = new Rabbit("weird");

// All functions including Constructors get a property named prototype that holds an empty object

// Constructors are capitalized by convention

// *NOTE* There is a difference between the prototype of a constructor and the prototype PROPERTY of a constructor

// The property of a constructor is (constructor name).prototype

// The prototype of a constructor is Function.prototype


/***** * Class Notation *****/

// JavaScript classes are constructor functions with a prototype property

// As of 2015 the Notation to create 'classes' has changed

class NewRabbit {
    constructor(type){
        this.type = type;
    }
    speak(line) {
        console.log(`The ${this.type} rabbit says '${line}'`);
    }
}

let newkillerRabbit = new NewRabbit("killer");
let newblackRabbit = new NewRabbit("black");

// the constructor function is special, it is bound to the class name

// the other functions are packaged into the constructor's prototype

// Class declarations can only allow methods (properties that hold functions) -- THIS EXPLAINS 
// WHY YOU CAN'T HOLD NON-FUNCTION VALUES IN REACT

// To create non-function properties, you must augment the prototype of the class



// class (like a function) can be used in both statement and in expression positions
// as an expression, it doesn't define a binding, but just produces the constructor as a value
// you can omit the class name in an expression ex:

let object = new class { getWord() {return "hello";}};
console.log(object.getWord());

// log: hello


/**** * Overriding Dervied Properties ******/

// You can override prototypes of an instance
// You can do this by adding the property on the instance itself

NewRabbit.prototype.teeth = "small";
console.log(newkillerRabbit.teeth);
// log: small

newkillerRabbit.teeth = "long, sharp, and bloody";
console.log(newkillerRabbit.teeth);
// log: long, sharp, and bloody;

console.log(newblackRabbit.teeth);
// log: small

console.log(NewRabbit.prototype.teeth);
// log: small

/***************************************************************************************/
// Can we overwrite the prototype and does that change all other instances?

// newkillerRabbit.prototype is undefined, that's because the constructor makes the functions
// a part of instance. It doesn't add the functions to an empty prototype object on the instance,
// it attaches them to the instance themselves

// console.log("Haven't changed killer rabbit's prototype: "+ newkillerRabbit.prototype);

// newkillerRabbit.prototype.teeth = "long, sharp, and bloody";

// console.log("Changed killer rabbit's prototype: "+ newkillerRabbit.prototype.teeth);

// console.log("Rabbit prototype teeth after changing killer rabbit prototype: "+ NewRabbit.prototype.teeth);
/***************************************************************************************/



// You can use the above to write a base class and then
// give exceptional instances their own version of functions

// This technique is used for the Array and Object prototypes. toString() doesn't different things for each
// ex:

console.log(Array.prototype.toString == Object.prototype.toString);
// log: false

console.log([1,2].toString());
// log: 1,2

// calling toString on an array is similar to calling .join(",") 
// it puts commas between the values of the array

// calling oto string Object.prototype.toString on array produces a different result
// it just puts object and its type (Array) between two brackets
// ex:

console.log(Object.prototype.toString.call([1,2]));
// log: [object Array]


/********** * Maps **********/

// A 'map' is a data structure that associates values with other values
// ex -> map names to ages

let ages = {
    Boris: 39,
    Liang: 22,
    Julia: 62
};

console.log( `Julia is ${ages["Julia"]}`);
// log: Julia is 62;

console.log("Is Jack's age known?", "Jack" in ages);
// log: Is Jack's age known? false

console.log("Is toString's age known?", "toString" in ages);
// log: Is toString's age known? true

// The object's property names are people's names
// However notice that toString shows up when we ask if it is in ages
// It is because it's a prototype property

// How to solve this issue?
// One way is to create objects with no prototype
// Use Object.create() and pass in 'null' as an argument

console.log("toString" in Object.create(null));
// log: false


// Object property names must be strings
// If you need a map whose keys can't be easily converted to strings, you cannot use an object as your map


// JavaScript comes with a class called Map that is written for this exact purpose. We can create maps
// that allow for any type of key. 
// Also allowing us to create objects where the properties with non-function values don't get mixed with the 
// prototypes functions

// It stores a mapping, and allows
// any types of keys

let agesMap = new Map();
agesMap.set("Boris", 39);
agesMap.set("Liang", 22);
agesMap.set("Julia", 62);

console.log(`Julia is ${agesMap.get("Julia")}`);
// log: Julia is 62

console.log("Is Jack's age known?", agesMap.has("Jack"));
// log: Is Jack's age known? false

// 'set', 'get' and 'has' are part of the interface of the Map object.

// Map creates a datastructre that lets use quickly update and search large sets of values

console.log('Does toString show up in a Map object using "has"?', agesMap.has("toString"));
// log: false



// You can also instead of using the in operator to check for non-prototype properties, you use
// the 'hasOwnProperty' method

console.log({x: 1}.hasOwnProperty("x"));
// log: true

console.log({x:1}.hasOwnProperty("toString"));
// log: false


/*********** * Polymorphism ***********/

// When the String function(which converts a value to a string) is called on an object, it will call
// the 'toString' method on that object to create a meaningful string

// The standard prototypes have their own way of implementing 'toString'
// but we can actually rewrite it ourselves to work differenly

Rabbit.prototype.toString = function() {
    return `a ${this.type} rabbit`;
};

let blackRabbit = new Rabbit("black");


console.log(String(blackRabbit));
// log: a black rabbit

// This is polymorphism.
// Objects expose a certain interface - the 'toString' method for instance - and any
// object that supports this interface will just work. 




/************* * Symbols ***************/

// I believe 'symbols' allow us to use method names that can be used as a part of an interface
// as well as used in their standard form ex: toString being used for a different reason as well as converting things
// to strings

// Symbols are values created with the 'Symbol' function
// symbols are unique, you cannot create the same symbol twice

// There is also the 'symbol' data type which is a primitive data type
// Each symbol is unique
// 

let sym = Symbol("name");
console.log(sym == Symbol("name"));
// log: false

Rabbit.prototype[sym] = 55;
console.log(blackRabbit[sym]);
//log: 55

//Symbols are wacky. Never seen them before

const toStringSymbol = Symbol("toString");
Array.prototype[toStringSymbol] = function() {
    return `${this.length} cm of blue yarn`;
}

console.log([1,2].toString());
// log: 1,2

console.log([1,2][toStringSymbol]());
// 2 cm of blue yarn


// More wacky syntax, you can hold symbols in property names

let stringObject = {
    [toStringSymbol]() {return "a jute rope";}
};
console.log(stringObject[toStringSymbol]());
// a jute rope

/*************** * More on Symbols from Mozilla ***********/

// the Symbol() function returns a value of type 'symbol'.
// Resembles the built-in object class but is not a constructor because does not support 'new Symbol()' syntax.

// Every symbol value return from Symbol() is unique.
// A symbol value is used as an identifier for object properties. This is the data type's only purpose. 

// So the prameter inside Symbol([description]) which is called description is used for debugging and that's it. Let's you 
// identify the symbol.

let sym1 = Symbol();
let sym2 = Symbol('foo');
let sym3 = Symbol('foo');


// Symbol('foo') === Symbol('foo'); // false

/* From Mozilla's Symbol glossary page:
The data type "symbol" is a primitive data type having the quality that, vlaues of this type can be 
used to make object properties that are anonymous. This data type is used as the
key for an object property when the property is intended to be private, for the internal use of a class or an object type.

For example, keys of type 'symbol' exist in various built-in JavaScript objects.
*/

/**************** * The Iterator Interface ***************/

// So I think there's a Symbol function that as a method stored in it called iterator

// Using the Symbol iterator
let okIterator = "OK"[Symbol.iterator]();

console.log(okIterator.next());
// {value: "O", done: false};

console.log(okIterator.next());
// {value: "K", done: false}

console.log(okIterator.next());
// {value: undefined, done: true}



// Creating an iterable data structure
// Matrix Class acting as a two-dimensional array

class Matrix{
    constructor(width, height, element = (x, y) => undefined) {
        // I think element = (x,y) => undefined, means that each element will have a function that describes it's content
        this.width = width;
        this.height = height;
        this.content = [];

        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                this.content[y * width + x ] = element(x,y);
            }
        }
    }

    get(x,y) {
        return this.content[y * this.width + x];
    }
    set(x, y, value){
        this.content[y * this.width + x] = value;
    }
}

// So what's (y * width + x), well it allows us to create an array element
// representing a value in the matrix. So if you start at row 0, you multiply 
// the row number with the width, so that when you add the column number, all 
// element positions in the matrix will be given a value between 0 and the largest number
// of columns. Then the subsequent row, row number 1, will get multiplied by the width, let's say is 
// 4, so that all elements on row 1 will be AT LEAST 4 larger than all elements on row 0! 

// This class stores its contents in an array of length WIDTHxHEIGHT. The elements get stored row by row.
// I don't really know what element = (x,y) => undefined is.
// I think it's an optional content function that is used to fill in the initial values

// Then there's the get and set methods which let you get an element based on the x and y values and
// set an element.

class MatrixIterator {
    constructor(matrix){
        this.x = 0;
        this.y = 0;
        this.matrix = matrix;
    }

    next(){
        if(this.y == this.matrix.height) return {done: true};

        // I bet you're wondering, why is it that if y is equal to the height of the matrix, it's done?
        // Don't we have to go through each element on the last row?
        // Well you see this.y will actually be one higher than the actual y position numbers because the 
        // position numbers are 0 indexed. The height is not zero indexed. So if the height is 5, the last row number
        // is actually 4. So it will iterate through the row and then when it adds one more to y, it will be 5 and then 
        // the done property will be set to true.

        let value = {x: this.x,
                     y: this.y,
                     value: this.matrix.get(this.x, this.y)};
        this.x++;
        if (this.x == this.matrix.width){
            this.x = 0;
            this.y++;
        }
        return {value, done: false};
    }
}


// Notice how the value is set before it increases the x or y value.

// Now we'll make the Matrix iterable by adding a prototype property.
// Author mentions that the reason he's using after-the-fact prototype manipulation
// is to add methods to the classes so that the individual pieces of code stay small and 
// self contained. Real programs will just write the methods into the class

Matrix.prototype[Symbol.iterator] = function() {
    return new MatrixIterator(this);
};

// I still don't understand how symbol is used here. Why not just define the prototype without symbol?
// OHHHHH, I think we're rewriting the the iterator function??????? So that for/of knows to use our iterator?
// 'this' is the Matrix

// example loop with for/of

let matrix = new Matrix(2,2, (x,y) => `value ${x}, ${y}`);

for(let {x, y, value} of matrix) {
    console.log(x, y, value);
}

/* log:
0 0 value 0,0
1 0 value 1,0
0 1 value 0,1
1 1 value 1,1
*/

// So I guess the matrix doesn't store numbers as values??? Or maybe we're supposed to put in a function
// to compute a value for each element?


/************** * Getters, Setters, and Statics *****************/

// Interfaces are usually made up of methods but it's possible to have an interface that has
// non-function values

// You don't have to compute and store a property directly in the instance.
// We can hide the method call by using getters.
// To hide the method call, just write get infront of the method. 
// So instead of writing varyingSize.size(), you can write varyingSize.size    -  I THINK

let varyingSize = {
    get size() {
        return Math.floor(Math.random() * 100);
    }
};

console.log(varyingSize.size)
// log: 73
console.log(varyingSize.size)
// log: 49


// You hide method calls with setters as well

class Temperature{
    constructor(celsius) {
        this.celsius = celsius;
    }
    get fahrenheit() {
        return this.celsisus * 1.8 + 32; 
    }
    set fahrenheit(value) {
        this.celsius = (value - 32) / 1.8
    }

    static fromFahrenheit(value) {
        return new Temperature((value))
    }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit);
// log: 71.6
temp.fahrenheit = 86;
console.log(temp.celsius);

// The Temperature class allows you to read and write the temperature in either Celsius or Fahrenheit
// However it only stores in Celsius, so it uses the getter and setter to convert       


// You can attach properties directly to the constructor function instead of to an instance
// The 'static' keyword written before a method, stores the method to the constructor.

// Temperature.fromFahrenheit(100) creates a temperature using degrees Fahrenheit



/****************** * Inheritance *******************/



// The matrix below is a 'symmetric matrix'.
//     [1    7    3]
//     [7    4   -5]
//     [3   -5    6] 

// If you mirrored it on it's diagonal starting from the top left to the bottom right, it is the same.

// The value stored at x,y is the same as that at y,x.

// Inheritance is where a new class inherits properties from an old class. Let's you not have to repeat code.


class SymmetricMatrix extends Matrix {
    constructor(size, element = (x,y) => undefined) {
        super(size, size, (x,y) => {
            if (x < y) return element(y,x);
            else return element(x,y);
        });
    }

        set(x, y, value) {
            super.set(x, y, value);
            if (x != y) {
            super.set(y, x, value);
        }
    }
}

let matrix12 = new SymmetricMatrix(5, (x, y) => `${x}, ${y}`);
console.log(matrix12.get(2, 3));

// log: 3,2


// The word 'extends' indicates that this class is not based on the Object prototype, but
// is based on another class. This other class is called the superclass. The derived class
// is called the subclass.

// So the keyword 'super' calls the superclass' constructor. 
// Apparently the super function is agumenting the content method but there's no direct mention of content
// at all.

// The 'set' function makes more sense. When 'set' is called, the 'set' method from the superclass' 
// 'set' method is called and it uses that method's function with the values given by the subclass
// It then sets the values and also sets the symmetric value as well. 





/************* * The Instanceof Operator  *****************/

// You can figure out if an object is derived from a class use the 'instanceof' operator.

console.log(new SymmetricMatrix(2) instanceof SymmetricMatrix);
// log: true

console.log(new SymmetricMatrix(2) instanceof Matrix);
// log: true

console.log(new Matrix(2,2) instanceof SymmetricMatrix);
// log: false

console.log([1] instanceof Array);
// log: true



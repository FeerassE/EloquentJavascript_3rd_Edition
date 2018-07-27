

let apple = false;

function truthyTester(thing){
    if(!thing){
        // so this means: if false compile
        console.log("yeah")
    }
    else {
        console.log("nah")
    }
}

truthyTester(apple);

let array = [];

console.log(typeof array);


// ********** Chapter 9 *********
// **** Date Class ****

// Testing syntax below

let [first, second, third] = ["string: first", "string: second", "string: third"];

console.log(first);
// log:       string: first



[0,1,2,3,4,5].reduce((acc, curr) => {console.log(acc); return curr});

// So 'reduce' takes a callback function. The callback function's first parameter
// is the accumulative value. Whatever gets returned after an iteration of reduce,
// become the accumulative value for the next iteration.

// Promises

var promise = new Promise ()
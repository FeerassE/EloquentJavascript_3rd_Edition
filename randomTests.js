

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
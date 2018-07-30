

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
// Does Promise.all return only one promise?
// Yes
let promise1 = new Promise (((resolve, reject) => {
    resolve("The promise was accepted");
    reject(new Error("Promise error"));
}))


let promise2 = new Promise (((resolve, reject) => {
    resolve("The promise was accepted");
    reject(new Error("Promise error"));
}))

let promise3 = new Promise (((resolve, reject) => {
    // Promise 3 will reject
    reject(new Error("Promise error"));
}))

Promise.all([promise1, promise2, promise3])
.then(function(value) {
    console.log(value);
})
.catch((error) => console.log(error));


// Promise.all only returns one promise, so all are rejected.



// Okay so this doens't work. Console.log just prints the function
function anonReturn() {
    return () => "I'm a string within an anonymous function"
}

console.log(anonReturn())


let anonFuncPromise = new Promise((resolve, reject) => {
   resolve("success")
});

function whatAmIReturning() {return anonFuncPromise.then(() => true, () => false)}

let answer1 = whatAmIReturning();

console.log(answer1)

// IT'S RETURNING A PROMISE NOT THE VALUE TRUE OR FALSE!!!!!
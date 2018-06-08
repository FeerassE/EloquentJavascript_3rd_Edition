

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

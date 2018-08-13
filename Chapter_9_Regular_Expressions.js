/********** * Chapter 9 Regular Expressions **********/

/* 
To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
  Table of Contents
  -----------------------------
* Creating A Regular Expression
* Testing For Matches
* Sets Of Characters
* Repeating Parts Of A Pattern
* Grouping Subexpressions
* Matches And Groups
* The Date Class
* Word And String Boundaries
* Choice Patterns
* The Mechanics Of Matching
* Backtracking
* The Replace Method
* Greed
* Dynamically Creating Regexp Objects
* The Search Method
* The LastIndex Property
* Looping Over Matches
* Parsing An INI File
* International Characters

*/

// Regular Expressions are a small separate language in JavaScript that describe
// patterns in strings.


/************ * Creating a Regular Expression **********/

/* 

Regular expressions are a type of object

*/

// They can be constructed with the RegEx constructor

let re1 = new RegExp("abc");

// Or they can be a literal value by enclosing them with 
// forward slash characters(/);

let re2 = /abc/;

// The pattern above is an 'a', followed by a 'b', followed
// by a 'c'.

// For the second notation, if we want the forward slash to be a 
// part of the pattern, we have to put the back slash before the 
// forward slash. This applies to other characters such as plus sings(+)
// as well.

// *Note* You have to put a backslash before some characters 

let eighteenPlus = /eighteen\+/;



/*********** * Testing for Matches ***********/

// Regular expressions have a number of methods

// the 'test' method, returns true or false depending on
// if the string contains the pattern of the regular 
// expression.

console.log(/abc/.test("abcde"));


// log: true

console.log(/abc/.test("abxde"));
// log: false

console.log(/abc/.test("nqeabc"));
// log: true;


/********* * Sets of Characters *********/

/* 
Putting a set of characters between square brackets 
makes that part of the expression match any of the 
characters between the brackets.
*/

console.log(/[0123456789]/.test("in 1992"));
// → true
console.log(/[0-9]/.test("in 1992"));
// → true

// Notice the dash '-' above matches a range of characters.
// The order of the range is done from one Unicode number to the last
// Unicode number.

/* Here is a list of Character groups!

\d  Any digit character
\w  Any alphanumeric character (word character)
\s  Any whitespace character (space, tab, newline, and similar)
\D  A character that is NOT a digit
\W  A character that is NOT an alphanumeric character
\S  A character that is NOT a whitespace character
.   Any character that is not a newline

*/

// How would we match the date and time format of 01-30-2003 15:20 . 

let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("01-30-2003 15:20"));

console.log(dateTime.test("30-jan-2003 15:20"));

// In square brackets, signs such as the period '.' or the plus sign '+'
// lose their special meaning. 
// [\d.]  means any digit and period


// To invert a set of characters (any character except those in the set) 
// you put a caret(^) character after the opening bracket. 


// Below we are asking "Are there any numbers in the string that are not 0 or 1?"

let notBinary = /[^01]/;
console.log(notBinary.test("1100100010100110"));
// → false
console.log(notBinary.test("1100100010200110"));
// → true


/*********** * Repeating Parts of a Pattern ************/

// How do we match a whole number -  a sequence of one or more digits?

// The plus sign (+) indicates that the element before may be repeated more than once.

// Thus, /\d+/ matches one more digit characters.

console.log(/'\d+'/.test("'123'"));
// log: true

console.log(/'\d+'/.test("''"));
// log: false

console.log(/'\d*'/.test("'123'"));
// log: true

console.log(/'\d*'/.test("''"));
// log: true


// The star(*) means the element before may match more than once
// and also allows the pattern to match zero times.

// A pattern with a star after it will never prevent not match, it'll just match
// zero instances if it can't find a suitable string.

// A question mark(?)makes a part of a pattern optional. So the pattern can occur zero
// times or one time. 

// Below, the 'u' character is allowed to occur, but the pattern also matches when it is 
// missing

let neighbor = /neighbou?r/;
console.log("neighbour test: " + neighbor.test("neighbour"));
// log: true

console.log("neighbor test: " + neighbor.test("neighbor"));
// log: true


// To indicate a precise number of times, use braces.
// Putting {4} after an element, requires it to occur exactly four times.
// {2,4} means the element must occur at least twice and at most four times.
// {5, } means at least five or more times.

// Below is another way to write the date time but you can write two
// or one digit for the month and day

let dateTime2 = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime2.test("1-30-2003 8:45"));


/*********** * Grouping Subexpressions **********/

/* 
To use an operator like (*) or (+) on more than one element
at a time, you have to use parantheses.

*/

let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// log: true

// The plus sign after hoo is sees (hoo+) as one element and so now
// there can be multiple (hoo+);

// the 'i' at the end makes the expression case insensitive.



/*********** * Matches and Groups ***********/

// The 'test' method is the simplest way to match a regular expression.
// Tells you whether it matched and nothing else. 

// The 'exec' (execute) method will return 'null' if no match was found
// and return an object with info about the match.

// From mozilla: 
// The exec() method exectues a serch for a match in a specified string. Returns
// a result array, or 'null'.

/*
The returned array has the matched text as the first item, and then one item for 
each capturing parenthesis that matched containing the text that was captured.
*/

// If we want to go through each match in a pattern using the 'exec' method, we
// should add the global option to the pattern and put the exec method in a loop. 
// Read more about this at the end of the "LastIndex Property" chapter.


let match = /\d+/.exec("one two 100");
console.log(match);
// log: [100]
console.log(match.index)
// log: 8

// The object has an index property which is where in the string the 
// successful match begins.

// The object also has an array of strings, whose first element, is the
// string that was matched.


// Strings have a 'match' method that behaves similarly.
console.log("one two 100".match(/\d+/));
// → ["100"]


// The 'exec' method is strange. 
// Let's say we have a regexp that looks like this:

let quotedText = /'([^']*)'/;

// Outside of the parantheses, we're saying
// match an opening and closing quotation ('  ');

// On the INSIDE however, we're saying, match anything
// BUT quotations.

// What'll happen with this log

console.log(quotedText.exec("she said 'hello'"));

// log:  ["'hello'", "hello"]

// The first element in the array is the whole match.

// The second element is the match in the first group,
// as in the group in parantheses.

// Why does it return array elements like this?


// Remember a question mark(?) makes part of a pattern optional.

console.log(/bad(ly)?/.exec("bad"));
// log: ["bad", undefined]

// If a group does not end up being matched, like with a question mark,
// it's position in the output array will hold undefined.


console.log(/(\d)+/.exec("123"));
// log: ["123", "3"]

// When a group is matched multiple times, the last match will end
// up in the array. 

// The 'exec' method is useful because we can do things like 
// pick out a specific part of a regex expression, thereby picking out
// a specific part of a string and extract it.




/************ * The Date Class *************/


// JavaScript has a standard class for representing dates.
// It is called 'Date'.
// Create an instnace of the Date class with the keyword 'new'.

console.log(new Date());
// log: Mon Jun 18 2018 11:55:51 GMT-0400 (EDT) {}

// The log above will change depending on the current date and time.

// We can also make a 'Date' object for a specific time. 

console.log(new Date(2009, 11, 9));
// log: Wed Dec 09 2009 00:00:00 GMT+0100 (CET)

console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// log: Wed Dec 09 2009 12:59:59 GMT+0100 (CET)


// *NOTE/WARNING* JavaScript uses a convention where month numbers
// start at 0 (so December is 11), yet day numbers start at one.
// This means THE MONTHS ARE OFF BY ONE.

// The last four arguments(hours, minutes, seconds, and milliseconds)
// are optional and taken to be zero when none are given. 


// UNIX TIME:
// Number of milliseconds since the start of 1970, in the UTC time zone.
// Negative numbers are used for times before 1970.

// The getTime method on a date object returns this number. 

console.log(new Date(2013, 11, 19).getTime());
// log: 1387407600000

console.log(new Date(1387407600000));
// log: Thu Dec 19 2013 00:00:00 GMT+0100 (CET)

// How does the Date object know that the number above is UNIX time?
// If there is one argument, it treats it as a UNIX number.

// You can get the current millisecond count by creating a new Date object
// and calling getTime on it.
// You can also get it by using the Date.now function.

let currTime = new Date();
console.log(currTime.getTime());
console.log(Date.now());
console.log(Date.now());

/*
Date objects provide methods such as:
- getFullYear
- getMonth
- getDate
- getHours
- getMinutes
- getSeconds

- getYear(DONT USE, it subtracts 1900 from the current year. No good use case)
*/


function getDate(string) {
  let [_, month, day, year] = /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  // the underscore (_) binding is ignored and used only to skip the full match element in the array
  // return by 'exec'. 

  // Question: The syntax above is interesting. Are we setting each element in the array returned by 'exec' to
  // those variables? So is that an array above? If it is, how is it referred in the Date object below
  // without specifying the array element position?

  // Answer: This is setting each element in the array, to the corresponding position in the let statement. 
  // It is not making a new array! This is just syntax for setting the variables, month, day and year to a corresponding
  // array position.

  return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// log: Thu Jan 30 2003 00:00:00 GMT+0100 (CET)




/********** * Word and String Boundaries ***********/

// Problem:
// getDate will also extract the nonsensical date 00-1-3000 from the string "100-1-30000";
// Remember, in this case where the pattern is  /(\d{1,2})-(\d{1,2})-(\d{4})/    
// a match can happen anywhere in the string. 

// How do we force it to match the whole string?
// We use the caret (^) and dollar symbol ($).

// The caret (^) matches the start of the input string
// The dollar sign ($) matches the end of the string.

// *NOTE* The caret symbol (^) in a set notation(ex: [^p]) means anything but that character.
// I believe it has a different meaning OUTSIDE of the set notation.


let onlyDigits = /^\d+$/

// onlyDigits matches a string entirely made of one or more digits


let startExclamation = /^!/;

// startExclamation matches any string that starts with an exclamation mark

let noString = /x^/;

// noString does not match any string (there cannot be an 'x' before the start of the string) What does this mean?

console.log("Testing noString: " + noString.test("x"));
// log: false

// So does that mean that putting a letter before the caret symbol is saying match any string with an x 
// before the string? Is that why it matches nothing?

let xAfterCaret = /^x/;

// xAfterCaret should match any string that starts with an x.
console.log("Testing xAfterCaret: " + xAfterCaret.test("xbox"));
// log: true


console.log(/^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec("100-1-30000"));
// log: null      

// Above returns null (AS IT SHOULD) because the regexp pattern requires that the whole string fit the pattern


// We can also use word boundaries (\b). 
// Word boundaries can be the start or end of a string.
// Word boundaries can also be any point in the string that has a word character
// on one side and a nonword character on the other.

// Word characters (\w) can be any of these [A-Za-z0-9_].

console.log(/cat/.test("concatenate"));
// log: true

console.log(/\bcat\b/.test("concatenate"));
// log: false

console.log(/\bconcatenate\b/.test("concatenate"));
// log: true

console.log(/\bconcatenate\b/.test("concatenatep"));
// notice the 'p' at the end
// log: false



/*********** * Choice Patterns ***********/

// How do we figure this out:
// Does a string contain not only a number but a number
// followed by one of the words pig, cow chicken or any
// of their plural forms?

// we can write three regular expressions and test them in turn
// or we can use the pipe character (|);

let animalCount = /\b\d+ (pig|cow|chicken)s?\b/;
console.log(animalCount.test("15 pigs"));
// log: true

// remember whatever character is BEFORE the question mark character
// it is optional.

console.log(animalCount.test("15 pigchickens"));
// log: false

// Use parantheses to limit which parts of the pattern the pipe character
// works for.




/*********** * The Mechanics of Matching ************/

// The methods 'test' and 'exec' use a matching engine.
// The matching engine matches the regexpression from the
// start of the string and then to the next character in the 
// string until it reaches the end of the string. 


// Below is an example of the steps taken through a string of 
// a matching engine. 

// First let's assume that each character in a string(including spaces)
// has a position number.

// flow chart of regex expression

/*
                               Group 1
                               ______________________    
                               |                     |    loop 
                               |        "pig"        |     ___
                               |                     |    |   |
boundary ----- digit--- " " ---|        "cow"        |---- "s"-------- boundary
              |_____|          |                     |
                               |      "chicken"      |
                ^loop          |_____________________|

*/



// Let's say we're matching the string "the 3 pigs" but we're starting at position 4 (at the space)
// The matching engine actually looks at the character after the position we're at.



//  String:    "the 3 pigs"

// We're going to use this regexp expression
/*    /\b\d+ (pig|cow|chicken)s?\b/     */

// Step 1:
// At position 4 there is a word boundary, so we move past the boundary box in the flow chart.


//Step 2:
// At position 4 there is a digit ahead so we pass the second boxes test.

//Step 3:
// At position 5 we have the choice of looping back if there is another digit but there isn't so 
// we keep moving past the second box to the third box(space). We pass the third box's test so we
// move to the next position.

//Step 4:
// At position 6 we see of the three branch choices, "pig" is the one that we want, so 
// we take that branch and pass that box.

//Step 5:
// At position 9 the matching engine looks ahead has a choice to either match the 's'
// or if there is no 's', then to not match. It finds an 's' so continues on.

//Step 6:
// At position 10 we can only match a word boundary. The end of the string counts as a 
// word boundary so we match the string and have successfully matched the string.




/************* * Backtracking ************/

// This part is interesting.
// So the regex engine basically acts as an itertor and loops to find a match.
// You can make the regex engine do a lot of work if you create inefficient loops with you
// pattern. 

/* 
The regex expression /\b([01]+b|[\da-f]+h|\d+)\b/   has three conditions it can match between word
boundaries:
- it matches a binary number with the letter 'b' afterwards. *** Pay attention to the fact that
  it's in a set notation with a plus sign after, so it can be any combination of 0s or 1s. 
or
- it matches hexadecimal digit. A hexadecimal digit has a base of '16' with the letters 
  a-f standing in for the number 10-15.
or
- it matches a regular decimal number 
*/


// Refer to figure 2

// So there's some things to consider about the matching engine and efficiency
// Let's say we're matching the string "103".

// Notice that the branch will begin going through the first branch(the binary number branch) before 
// it notices that '3' at the end of '103' does not fit that pattern! 
// So the matcher has to BACKTRACK and 
// The branch that does work is the last branch(decimal number). 

/*
Let's look at this regex pattern:

/^.*x/

Remember:

The period (.) symbol means it will match any character
that is not a newline.

The star (*) symbol means that we can have multiples of
the character before the star or none of that character.

The caret symbol(^) at the front means the prospective match
must begin with the character after the caret symbol.

*/

// Backtracking happens also for repetition operators
// like the (+) and (*) 


/*

If we match /^.*x/ against the string "abcxe", the .* part will 
first try and match the whole string. 
That doesn't work because the match needs to end at the x.

So the matching engine backtracks to position 4 but doesn't
find an 'x' at the end. 

So the .* pattern tries position 3 and finds that there is an x
at the end of the string so it matches "abcx".

*/


// Problem: We can write regular expressions that do too much backtracking

// Example:
//          /([01]+)+b/

// Okay I don't think this is explained very well but, I believe this is happening:

// refer to figure 3

// flow chart:


/*      
       ___ __0__ ___
------|   |  1  |   |-----"b"
      |   |_____|   |
      |             |
      |_____________|

*/


/*
Okay let's say that we're trying to match using the pattern : /([01]+)+b/   
but there isn't a b at the end of string of 0s and 1.

So when the matching engine gets to the end of the 0s and 1s, it will try to find a 'b' at the 
end of the string. It doesn't find one so it goes back one position and rematches(I think!) for both
the inner and outer loop. 

So this apparently doubles the work on each character. 

I will need clarification on this topic!!!
*/



/*********** * The Replace Method **********/

// The replace method can be used to replace part of a string
// with another string


console.log("papa".replace("p", "m"));
// log : mapa


// The first argument can also be a regular expresssion.

console.log("Borobudur".replace(/[ou]/, "a"));
// log: Barobudur

// Notice that only the first match of the regular expression is replaced.
// How do we fix this?
// Use the 'g' character.

// 'g' stands for global, so all matches in the string are replaced.


console.log("Borobudur".replace(/[ou]/g, "a"));

/*
Let's say we want to augment a big string containing the names of people, one name per
line, in the format Lastname, Firstname.

Ex: "Liskov, Barbara\nMcCarthy, John\nWadler, Philip"

How do we augment this string so that we remove the commas and swap the first and last names so
they are like this Firstname Lastname.

*/

console.log("Liskov, Barbara\nMcCarthy, John\nWadler, Philip"
            .replace(/(\w+), (\w+)/g, "$2 $1"));
// log: 
// Barbara Liskov
// John McCarthy
// Philip Wadler


// The $1 and $2 in the replacement string refer to the parenthesized groups
// in the pattern. 

// $1 is replaced the text matched against the first group, $2 the second, $3 etc..
// and goes up to $9.

// The whole match can be refered with $&.



// Using functions in the replace method:

// We can use functions in the second parameter of the replace method.
// Whatever gets matched from the regex pattern in the first arugment,
// will get passed to the function in the second argument(which might change it) and then
// gets returned by that function to replace the matched text in the string.


//Example below:

let s = "the cia and fbi";
console.log(s.replace(/\b(fbi|cia)/g, str => str.toUpperCase()));
// log: the CIA and FBI


// Another example:


let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1){ // only one left, remove the 's
    unit = unit.slice(0, unit.length - 1);
  } else if (amount == 0) {
    amount = "0"
  }
  return amount + " " + unit;
} 
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// log: no lemon, 1 cabbage, and 100 eggs

// So creating groups will allow us to use each part of the string separately
// as arguments in the function.
// Notice that the matching engine, for each match, returns the full match as well 
// as each group in parantheses as separate values. 




/*********** * Greed ************/

// We'll write a function to remove all comments from a piece of JavaScript code.

function stripComments(code){
  return code.replace(/\/\/.*|\/\*[^]*\*\//g,"")
}

console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ten!"));
// → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1


/* 
So in the replace pattern above, the first section of the pattern:
                \/\/.*
is saying, match two slashes and anything after them that is not
a new line character. This works for the double slashes because
we don't have to worry about multiple lines. 

The second section of the pattern:
\/\*[^]*\*\/

Needs to compensate for newlines. How does it do this?
It uses this [^]
The caret symbol inside of set brackets means
anything but the set of characters inside. In this case there are
no characters inside the set brackets, so it's saying "anything but
no characters."

We then add a star so it becomes [^]* so that we can match for none or
multiple of characters. 


*/

// Why is the last pattern wrong?


/*

The [^]* part of the expression will attempt to match as much of
the string as it can. (Why? I thought regexp patterns always match to the left).

IMPORTANT: Because the operators + and * actually try and match the whole string and then
backtrack if the string doesn't match until it gets a match!!!!!

So why doesn't it the pattern work? Because it tries to consume the whole string and 
then backtracks and finds an ending comment symbol. 

*/

// Because of this, repetition operators (+, *, ? and {}) are GREEDY.
// They try and match as much as they can and then backtrack from there.

// We can make them NONGREEDY by putting a question mark after the operator like so:
// (+? , *? , ?? , {}?)
// Now they match as little as possible. 

function stripCommentsNonGreedy(code){
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}

console.log(stripCommentsNonGreedy("1 /* a */+/* b */ 1"));
// log: 1 + 1




/*********** * Dynamically Creating Regexp Objects **********/

/*
Let's say we want to find a name in a text and we want to put an underscore
at the beginning and end of the name, so we can highlight it. 

However, we do not know the name beforehand. We'll only know the name
once we run the program. 

How can we add the name to a regexp pattern dynamically instead of having it 
hard coded?

*/

let name = "harry";
let text = "Harry is a suspicious character";
let regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));

// So apparently we have to put two slashes before the 'b' because
// we've enclosed the boundary marker in a string. Why though?

// I tested it with one slash and it doesn't work.... Why not?

// Need to come back to this...

// The second argument in a RegExp constructor are the options for a 
// regular expression. Here we added 'g' for global and 'i' for case
// insensitive.


// creating a RegExp to capture "dea+hl[]rd" will be more difficult. 
// Because the regexp constructor will think those symbols are a part of the
// pattern.

// We fix this by adding two slashes behind everyone of those symbols in the  name.
let name2 = "dea+hl[]rd";
let text2 = "This dea+hl[]rd guy is super annoying.";

let escaped = name2.replace(/[\\[.+*(){|^$}]/g, "\\$&");
// So 'escaped' will replace every match, with the whole match itself($&) but with a 
// slash (\) added infront. 

let regexp2 = new RegExp("\\b" + escaped + "\\b", "gi");
console.log(text2.replace(regexp2, "_$&_"));
// log: this _dea+hl[]rd_ guy is super annoying. 




/************ * The Search Method *************/

// We can't use a regular expression with the indexOf method on strings.

// We can use the method search though. 
// Search returns the first index on which the expression was found, or 
// -1 if it wasn't found.

// \S means a character that is NOT a white space character
// \s means a whitespace character
console.log("    word".search(/\S/));
// log: 2
console.log("      ".search(/\S/));
// log: -1



/********** * The LastIndex Property ***********/

// The 'exec' method provides an inconvenient way to start
// searching from a given position in the strig. 

/*

'lastIndex' is a property that, in a limited way, controls 
where the next match will start. 
It must have the global(g) or the sticky(y) option enabled, and must happen through the
'exec' method. 

*/

// Remember that 'global' (g) matches every occurence of the pattern in the string.


let pattern = /y/g;
pattern.lastIndex = 3;
// We tell the pattern to match starting at index 3 of the string.
let match2 = pattern.exec("xyzzy");

// The match engine find a match at index 4.
console.log(match2.index);
// log: 4

console.log(pattern.lastIndex);
// log: 5

// The 'lastIndex' property is 5 now because the match is successful and 
// points to the index right after the match. 

// If no match is found, 'lastIndex' will be set back to zero. 
// Zero is also the value of lastIndex in a newly constructed regex object. 



// The difference between the (g) and (y) options, is that global will try and find
// a match ahead of lastIndex where sticky(y) will succeed only if a match is directly 
// lastIndex. 

let global = /abc/g;
console.log(global.exec("xyz abc"));
// log: ["abc"];
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// log: null


// So there's another problem with the 'exec' method and string's 'lastIndex' property.
// Notice below that because the first call sets the lastIndex property to a position after
// the end of the string, the next call will start after the string which will make the matching,
// engine fail, and return null.

let digit = /\d/g;
console.log(digit.exec("here it is: 1"));
// log: ["1"]
console.log(digit.exec("and now: 1"));
// log: null


// I don't understand 'exec' very well. 
// So the book says that the global(g) option has an interesting effect on the 'match' method.
// If we set the option to global, the 'match' method will return all matches of the pattern in the
// string and return an array containing the matched strings.

// Why is this a problem? How does 'exec' act differently??????????
// 'exec' won't match everything in a string, unless you loop. Notice above that 
// the lastIndex property moves to the end of the last match of the most recent
// call to 'exec'

console.log("Banana".match(/an/g));
// log: ["an", "an"];

// I need to do tests on the exec method.


/*********** * Looping Over Matches *************/

// Common to loop over matches with exec.

let input = "A string with 3 numbers in it.. 42 and 88.";
let number3 = /\b\d+\b/g;

// Remember:
// What is a word boundary? \b  \b  
// These are saying, match this pattern to \w (a word character) and \W (a non word character)

let match3;
while (match3 = number3.exec(input)) {
   // This while loop will break when the exec function returns 'null' once its lastIndex property
   // is the past the end of the string. 

  console.log(match3);
  console.log("Found", match3[0], "at", match3.index);
}
// log: Found 3 at 14
// log: Found 42 at 33
// log: Found 88 at 40




/*********** * Parsing An INI File ************/

/*

We're going to write a prgram that automatically collects information about
our enemies form the Internet.

We'll use Regular Expressions

*/

// We're going to use a configuration file that is in the INI file format, more info
// coming:

/*

searchengine=https://duckduckgo.com/?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; each section concerns an individual enemy
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=evil wizard
outputdir=/home/marijn/enemies/davaeorn

*/


/*
  Rules of the INI format:

- Blank lines and lines starting with semicolons are ignored.
- Lines wrapped in[ and ] start a new section.
- Lines containing an alphanumeric identifier followed by an = character
  add a setting to the current section. 
- Anything else is invalid

*/

// Task:
// Convert a string like this into an object whose properties hold
// strings for settings written BEFORE the FIRST SECTION HEADER and properties
// that hold subobjects for sections. These subobjects' properties will hold 
// the settings for their respective section. 

/*

                    Object
                    /    \
            settings      sections(objects)
                                    \
                                    settings
*/


/*
Questions:
What does this string looks like?

Probably something like:
"search_engine=https://randomsite.com\nbigsetting=thirtyfour\n[firstsection]\nsubsetting=monkey\nanothersubsetting=cute\n"
*/

// Summary of task: We're changing a string to an object.

// The format is processed line by line, so we know that there will new line characters(\n) in the string to represent this.
// We'll need to get access to the text inbetween these new line characters(\n). 
// We'll use string.split() to do this.

// string.split(), splits a string up along the given function parameter and returns each split part
// as individual elements in an array. 

// So we can split along (\n) however, some oeprating systems also use a carriage return character (\r)
// as well as a newline ("\r\n")


// The split method also allows for a regular expression as it's argument, 

function parseINI(string) {
  // Start with an object to hold the top-level-fields
  let result = {};
  let section = result;
  // Why is section set to result?????
  // Because we are going to look at global settings first before we go 
  // to specific settings.

  // The section binding points to the object for the current section.
  string.split(/\r?\n/).forEach(line => {
    let match;
  if (match = line.match(/^(\w+)=(.*)$/)) {
    // We are finding a setting.
    // The pattern above says if the start of the string(*) starts with a word character(\w) and possibly other
    // word characters followed by an equal sign and ends with any character except a new line(.), then we match.

    // Okay so I think this is what's happening:
    // The match method will return an array of three elements. The first element is the whole match, the
    // second element at index 1, will be the match in the first parentheses (\w+). The third element at 
    // index 2, will be the match in the second parentheses.

    // The 'section' object will have a variable with a key of the first element in the array (\w+) and 
    // its property will be the second element in the match array (.*).
    section[match[1]] = match[2];
  } else if (match = line.match(/^\[(.*)\]$/)) {
    // We're finding sections.
    // We set the key to the matched text from the pattern above.
    // Then we give it an empty object as its property. 
    
    // Why are we setting 'section' to this object?
    // Because we are now looking at this object, so the next following lines
    // will be settings associated with this section. 
    section = result[match[1]] = {};
  } else if (!/^\s*(;.*)?$/.test(line)) {
    // Pattern above says:
    // If the line is not a bunch of white spaces or  a semicolon(which
    // signifies a comment for INI files) we throw an error. 
    // The question mark is saying that even a line of just white spaces
    // is okay.

    // Because if it's a comment or an empty line, we just move past, but if it's
    // an invalid format, we throw an error. 
    throw new Error("Line '" + line + "' is not valid.");
  }
  })
  return result;
}

console.log(parseINI(
`name=Vasilis
[address]
city=Tessaloniki`
));


/*
Note the recurring use of ^ and $ to make sure the expression matches the 
whole line, not just part of it. Leaving these out results in code that 
mostly works but behaves strangely for some input, which can be a difficult 
bug to track down.
*/

/*********** * International Characters **********/

// For JavaScript 'word characters' are only the characters in the Latin alphabet.

console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>"));
// → false
console.log(/<.>/u.test("<🌹>"));
// → true

// JavaScript treats the symbols above has having two code units.
// So the period above should match a single character, but the rose is composed of two code units
// so it doesn't work.

// You have to add the 'u' (for Unicode) to regular expressions to make it treat such characters 
// properly. 

// We can recognize a language using a now standardized regexp character (\p) pattern. 
// The (u) option must be enabled though. 

// console.log(/\p{Script=Greek}/u.test("α"));
// // → true
// console.log(/\p{Script=Arabic}/u.test("α"));
// // → false
// console.log(/\p{Alphabetic}/u.test("α"));
// // → true
// console.log(/\p{Alphabetic}/u.test("!"));
// // → false

// ^ The code above doesn't work. Even in the notes.


/******* * Summary *********/

/*
Regular expressions are objects that represent patterns in strings. 
They use their own language to express these patterns.

// Summary of pattern elements 


/abc/	A sequence of characters
/[abc]/	Any character from a set of characters
/[^abc]/	Any character not in a set of characters
/[0-9]/	Any character in a range of characters
/x+/	One or more occurrences of the pattern x
/x+?/	One or more occurrences, nongreedy

*/

// /x*/	Zero or more occurrences

/*

/x?/	Zero or one occurrence
/x{2,4}/	Two to four occurrences
/(abc)/	A group
/a|b|c/	Any one of several patterns
/\d/	Any digit character
/\w/	An alphanumeric character (“word character”)
/\s/	Any whitespace character
/./	Any character except newlines
/\b/	A word boundary
/^/	Start of input
/$/	End of input

*/

/*
Methods:
test()  : A regular expression has a method test to test whether a given string matches it. 
exec() : It also has a method exec that, when a match is found, returns an array containing all matched groups. 
          Such an array has an index property that indicates where the match started.

match(): Strings have a match method to match them against a regular expression and a search method to search for one, 
         returning only the starting position of the match. 
replace(): Their replace method can replace matches of a pattern 
           with a replacement string or function.

*/
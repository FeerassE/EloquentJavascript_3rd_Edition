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
// patters in strings.


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
// The dollar sign (^) matches the end of the string.

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
console.log("Testing xAfterCaret: " + xAfterCaret.test("x"));
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



/*********** * Choice Pattersn ***********/


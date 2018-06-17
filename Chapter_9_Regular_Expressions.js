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


// The star(*) has a similar meaning but also allows the pattern to match
// zero times.

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



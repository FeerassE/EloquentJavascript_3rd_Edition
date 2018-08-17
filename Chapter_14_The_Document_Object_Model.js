


/************ The Document Object Model ***********/

/* 

To traverse the contents. Crtl-F the star plus the name of the subheading. ex: Crtl-F[* Classes]
  Table of Contents
  -----------------------------
* Document Structure
* Trees
* Moving Through The Tree
* Finding Elements
* Changing The Document
* Creating Nodes
* Attributes
* Layout
* Styling
* Cascading Styles
* Query Selectors
* Positioning and Animating
* Summary

*/



/*
When opening a web page, browser retrieves the page's HTML text and parses it.
Browser builds up a model of the document's structure and uses this model to draw 
the page on the screen. 
*/


/******** * Document Structure *******/

// Each tag is an object. 

// The global binding 'document' gives us access to these objects.
// It's 'documentElement' property refers to the object representing the <html> tag.

// Every HTML document has a 'head' and a 'body', and also has a 'head' and 'body' property to represent
// those elements. 



/********** * Trees ***********/

// The Document Object Model is a nested structure.
// Each node (branch) can have children (smaller branches) which in turn have their own children and so on. 

// A datastructure is called a 'tree' when it branches and none of its nodes are contained in themselves and
// the structure also has a well defined root.
// The DOMs root is document.documentElement

// Trees are better for look ups than flat arrays.

// Trees have nodes which can have child nodes.
// Leaves are like the values in the Egg language program. They do not have children.
// Text is a leaf in the DOM.

// DOM Nodes are the 'elements' like document.body

// DOM node objects have a 'nodeType' property.
// The 'nodeType' property has a code (number) to represent the node type.
// Code 1 is for 'elements'. The constant property is called Node.ELEMENT_NODE.
// Code 3 is for text nodes. The constant property is called Node.TEXT_NODE
// Code 8 is for comments. The constant property is called Node.COMMENT_NODE



/************ * Moving Through the Tree ************/

// DOM nodes contain links to other nearby nodes.

// Every node has a 'parentNode' property that points to the node it is part of.
// Every element node(node type 1) has a 'childNodes' property that is an array-like object with 
// its children.

// Apparently you can move through the tree using this parent and child links.

// There are also convience links that allow you traverse more easily:
// 'firstChild' property points to the first child element
// 'lastChild' property points to the last child element.
// 'previousSibling' points to the node with the same parent, that is directly before this node.
// 'nextSibling' points to the node with the same parent, that is directly after this node. 
// 'children' property is like childNodes but contains only type 1 children. Let's you ignore 'Text' children. 

// If there is no child than ____Child properties point to null.
// If there is no previous or next sibling than the ____Sibling properties point to null.


// Recursive functions are useful to traverse nested data structures. 

// The following function scans a document for text nodes containing a given string and returns 
// 'true' when it's found.


function talksAbout(node, string) {
    if(node.nodeType == Node.ELEMENT_NODE) {
        for(let i = 0; i < node.childNodes.length; i++) {
            if(talksAbout(node.childNodes[i], string)) {
                return true;
            }
        }
        return false;
    } else if (node.nodeType == Node.TEXT_NODE) {
        // If indexOf returns -1 than this whole thing will evaluate to false.
        return node.nodeValue.indexOf(string) > -1;
    }
}

console.log(talksAbout(document.body, "book"));
// -> true;



/*\
title: $:/plugins/kpe/mathjax/mathjax-parser.js
type: application/javascript
module-type: wikirule
Wiki text inline rule for LaTeX. For example:
```
	$$latex-goes-here$$
```
This wikiparser can be modified using the rules eg:
```
\rules except latex-parser 
\rules only latex-parser 
```
\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "mathjax-parser";
exports.types = {inline: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	this.matchRegExp = /\${1,2}(?!\$)/mg;
};

exports.parse = function() {
	// Move past the match
	this.parser.pos = this.matchRegExp.lastIndex;
  var isInline = !((this.parser.pos-2) >0 && this.parser.source[this.parser.pos-2]=='$' )
  var reEnd = isInline ? /\$/mg : /\$\$/mg;
	// Look for the end marker
  var text  = this.parser.source.substr(this.parser.pos);
  var match = reEnd.exec(text);
  var displayMode;
    
	// Process the text
	if(match) {
		text = text.substring(0,match.index);
	  displayMode = !isInline;
		this.parser.pos += text.length + match[0].length;
	} else {
		text = this.parser.source.substring(this.parser.pos);
		displayMode = false;
		this.parser.pos = this.parser.sourceLength;
	}

    
	return [{
		type: "mathjax",
		attributes: {
			text: {
				type: "text",
				value: text
			},
			displayMode: {
				type: "text",
				value: displayMode ? "true" : "false"
			}
		}
	}];
};

})();

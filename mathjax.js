/*\
title: $:/plugins/kpe/mathjax/mathjax.js
type: application/javascript
module-type: widget

Renders MathJax in tiddlers

\*/
(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    var Widget = require("$:/core/modules/widgets/widget.js").widget;

    var MathJaxWidget = function(parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };
    MathJaxWidget.prototype = new Widget();
    
    function doMathJax(el) {
        if(typeof MathJax != 'undefined') {
             // MathJax.Hub.TypeSet(this.parentDomNode);
             MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]); 
        }
    }

    // intercept render
    MathJaxWidget.prototype.render = function(parent,nextSibling) {
        this.parentDomNode = parent;
        this.computeAttributes();
        this.execute();

        // Get the source text
	      var text = this.getAttribute("text",this.parseTreeNode.text || "");
	      var displayMode = this.getAttribute("displayMode",this.parseTreeNode.displayMode || "false") === "true";
	      // Render it into a span
	      var span = this.document.createElement("span"),
		        options = {throwOnError: false, displayMode: displayMode};
	      try {
		        if(!this.document.isTiddlyWikiFakeDom) {
			          doMathJax(span);
		        } else {
			          span.innerHTML = katex.renderToString(text,options);
		        }
	      } catch(ex) {
		        span.className = "tc-error";
		        span.textContent = ex;
	      }
	      // Insert it into the DOM
	      parent.insertBefore(span,nextSibling);
	      this.domNodes.push(span);
        
        doMathJax(parent);
    };
    MathJaxWidget.prototype.execute = function() {
    }
    MathJaxWidget.prototype.refresh = function(changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        if(changedAttributes.text) {
            this.refneshSelf();
            return true;
        } else {
            return false;
        }
    };

    exports.mathjax = MathJaxWidget;

})();

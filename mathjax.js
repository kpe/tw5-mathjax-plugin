/*\
title: $:/plugins/kpe/mathjax/mathjax.js
type: application/javascript
module-type: startup

Renders MathJax in tiddlers

\*/
(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.startup = function(){
        var SetWidget = require("$:/core/modules/widgets/set.js").set;
        var superRender = SetWidget.prototype.render;
        var superRefresh = SetWidget.prototype.refresh;

        function doMathJax(el) {
           if(typeof MathJax != 'undefined') {
                // MathJax.Hub.TypeSet(this.parentDomNode);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
            }
        }

        // intercept render
        SetWidget.prototype.render = function(parent,nextSibling) {
            superRender.call(this, parent, nextSibling);
            if(this.setName == 'storyTiddler') {
    //            console.log('doing mathjax on:',this.parentDomNode);
                doMathJax(this.parentDomNode);
            }
        };
        // intercept refresh
        SetWidget.prototype.refresh = function(changedTiddlers) {
            superRefresh.call(this, changedTiddlers);
            if(this.setName == 'storyTiddler') {
    //            console.log('refreshing mathjax on:',this.parentDomNode);
                doMathJax(this.parentDomNode);
            }
        };

    };

    exports.name = "mathjax";
    exports.platforms = ["browser"];
    exports.after = ["startup"];
    exports.synchronous = false;

})();

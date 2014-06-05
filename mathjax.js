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

    var MathJax = null;
    if($tw.browser) {
        window.MathJax = {
            AuthorInit: function(){
                MathJax = window.MathJax;
                console.log('AuthorInit MathJax');

                MathJax.Hub.config.delayStartupUntil = "configured";
                MathJax.Hub.Config({
                    extensions: ["tex2jax.js","MathEvents.js","MathZoom.js","MathMenu.js","toMathML.js","TeX/noErrors.js","TeX/noUndefined.js","TeX/AMSmath.js","TeX/AMSsymbols.js"],
                    jax: ["input/TeX","output/HTML-CSS"],
                    tex2jax: {
                        inlineMath: [
                            ['$','$'],
                            ['\\\\(','\\\\)']
                        ],
                        processEscapes: true
                    }
                });

                MathJax.Hub.Register.StartupHook("Begin",function(){
                    console.log('MathJax Begin');

                    MathJax.Hub.Queue(["log",console,"queue running"]);
                    var jsLoader = MathJax.Ajax.loader.JS;
                    var cssLoader = MathJax.Ajax.loader.CSS;
                    MathJax.Ajax.loader.JS = function(file,callback) {
                        console.log("loading JS:", file);
                        var content = $tw.modules.titles['$:/plugins/kpe/mathjax/lib' + file];
                        if (typeof content != "undefined") {
                            new Function(content.definition).call(window);
                        } else {
                            console.error("Failed to load:"+file+"]",
                                Object.keys($tw.modules.titles).filter(function(e){
                                    return e.substr("$:/plugins/kpe/mathjax/lib".length,31) == file.substr(0,31);
                                })
                            );
                        }
                        callback();
                        //jsLoader(file,callback);
                    };
                    MathJax.Ajax.loader.CSS = function(file,callback){
                        console.log("loading CSS:", file);
                        cssLoader(file,callback);
                    }
                });

                MathJax.Hub.Configured();

            }
        };

        var res = $tw.modules.titles['$:/plugins/kpe/mathjax/lib/MathJax.js'];
        console.log('res:',res);

        var MathJax = require("$:/plugins/kpe/mathjax/lib/MathJax.js");
    }

    exports.startup = function(){
        console.log("Starting");

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
                console.log('doing mathjax on:',this.parentDomNode);
//                doMathJax(this.parentDomNode);
//                MathJax.Hub.Typeset(this.parentDomNode);
            }
        };
        // intercept refresh
        SetWidget.prototype.refresh = function(changedTiddlers) {
            superRefresh.call(this, changedTiddlers);
            if(this.setName == 'storyTiddler') {
                console.log('refreshing mathjax on:',this.parentDomNode);
//                doMathJax(this.parentDomNode);
                if(MathJax.Hub) {
//                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.parentDomNode]);
                }
            }
        };

    };

    exports.name = "mathjax";
    exports.platforms = ["browser"];
    exports.after = ["startup"];
    exports.synchronous = false;

})();

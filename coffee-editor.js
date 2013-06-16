/* CoffeeEditor
 * Lightweight WYSIWYG editor.
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Class name
        var CLASS_NAME = 'CoffeeEditor';
        
        // Browser globals (root is window)
        root[CLASS_NAME] = factory();
        
        // jQuery sugar
        root.$.prototype[CLASS_NAME] = function() {
            var that = $(this),
                sugar;
            
            if(arguments.length > 0) { //need sugar?
                sugar = [];
                Array.prototype.slice.call(arguments).forEach(function(v, i, a) {
                    sugar.push('arguments['+i+']');
                });
                
                return eval('new root[CLASS_NAME](that,' + sugar.join(',')+');');
            } else {
                return new root[CLASS_NAME](that);
            }
        };
  }
}(this, function() {
    var CoffeeEditor = function(_j) {
        var el = $(_j).get(0),
            j = $(el);
        
        this.html = j.html();
        this.el = el;
        this.j = j;
        
        this.attach();
        
        el.contentEditable = true;
    };
    
    CoffeeEditor.prototype.attach = function() {
        var j = this.j;
        
        j.find('img').each(function(i, v) {
            //console.log(v);
            //WIP use jQuery UI to make resizeable
        });
    };
    
    CoffeeEditor.prototype.toHTML = function() {
        return this.html;
    };
    
    return CoffeeEditor;
}));

$(function() {
    window.c = $('.coffee').CoffeeEditor();
});
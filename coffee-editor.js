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
    var ev = function(e, cb) { //run / on event
        if(typeof ev._ == 'undefined') {
            ev._ = {};
        }
        
        if(typeof e == 'string') {
            if(!$.isArray(ev._[e])) {
                ev._[e] = [];
            }
            
            if(typeof cb == 'function') { //if we have a function
                return ev._[e].push(cb); //push it on the stack
            } else if(cb === 'k') { //if we want to kill an event now
                ev._[e].forEach(function(v, i, a) { // loop and
                    delete ev._[e][i];              // kill all events
                });
            } else { //execute event
                ev._[e].forEach(function(v, i, a) { // loop and
                    if(typeof v == 'function') { //find functions
                        if(v() === 'k') { //if we should kill this function after running
                            delete ev._[e][i]; //delete the function
                        }
                    }
                });
            }
        }
    };
    
    var CoffeeEditor = function(_j) {
        var el = $(_j).get(0),
            j = $(el),
            that = this;
        
        that.el = el;
        that.j = j;
        
        that.attach();
        that.toHTML();
        
        j.css({
            width: j.width(),
            height: j.height(),
            overflow: 'scroll'
        });
        
        ev('refresh', function() {
            that.j.html(that.toHTML());
            
            j.imagesLoaded(function() {
                that.attach();
            });
        });
        
        el.contentEditable = true;
    };
    
    CoffeeEditor.prototype.attach = function() {
        var j = this.j;
        
        j.find('img').each(function(i, v) {
            var img = $(v),
                span = img.wrap('<span>').parent(),
                pos = img.position();
            
            span.css({
                display: 'inline-block',
                top: pos.top,
                left: pos.left,
                position: 'absolute'
            });
            
            img.css({
                top: 0,
                left: 0,
                position: 'relative'
            });
            
            ev('update', function() {
                if(!img.is(':visible')) {
                    span.remove();
                }
            });
            
            span.addClass('imageWrapper');
            
            img.imagesLoaded(function() {
                img.resizable();
            });
            
            span.draggable({
                containment: j,
                cursor: 'move'
            });
        });
        
        j.keyup(function() {
            ev('update');
        });
        
        j.mouseup(function() {
            ev('update');
        });
        
        j.on('cut', function() {
            setTimeout(function() {
                ev('update');
            }, 150);
        });
        
        j.on('paste', function() {
            setTimeout(function() {
                ev('update');
                ev('refresh');
            }, 150);
        });
    };
    
    CoffeeEditor.prototype.toHTML = function(cb) {
        var j = this.j,
            _j;
        
        j.find('.imageWrapper').each(function(i, v) {
            var $$ = $(v);
            
            console.log($$.position());
            
            $$.attr('data-pos', JSON.stringify($$.position()));
        });
        
        _j = j.clone();
        
        _j.find('.imageWrapper').each(function(i, v) {
            var $$ = $(v),
                img = $$.find('img'),
                pos = JSON.parse($$.attr('data-pos')),
                    w = img.width(),
                    h = img.height();
                
            img.attr({
                class: '',
                style: ''
            });

            img.css({
                top: pos.top,
                left: pos.left,
                width: w,
                height: h,
                position: 'absolute'
            });
            
            $$.before(img);
            $$.remove();
        });
        
        j.imagesLoaded(function() {
            console.log('hello');
        });
        
        return this.html = _j.html();
    };
    
    return CoffeeEditor;
}));

$(function() {
    window.c = $('.coffee').CoffeeEditor();
});
/**
 * @license MVtationJS v0.0.1
 * (c) 2015, nicolads87 <nicola.ds87@gmail.com>
 * License: MIT
 */
(function(window) {
    'use strict';
    var mvtation = ( window.mvtation || (window.mvtation = {}) );
    var _GET = "GET", _POST = "POST";
    function isInput(e) {return e.tagName === "INPUT";}
    function isRadio(e) {return e.type === "radio";}
    function isText(e) {return e.type === "text";}
    
    /**
     * Recurvive method to GET/POST a property
     *
     */
    function recursiveDeepAccess(properties, method, object, value) {
       if(properties.length === 1) {
           if(method === _GET) {
                return (object) ? object[properties[0]] : undefined;
           } else if (method === _POST) {
               if(object) {
                    object[properties[0]] = value;       
               }else {
                   throw new Error("RecursiveDeepAccess object undefined");
               }
           }
       }else {
           if(typeof object[properties.slice(0,1)] === "undefined" && method === _POST) {
               Object.defineProperty(object, properties.slice(0,1), {writable: true, value: {}});
           }
           return recursiveDeepAccess(properties.slice(1,properties.length), method, object[properties.slice(0,1)], value);
       }
    }
    /**
     *
     * Object prototype
     * @params {string} string to access to object es: "prop1.prop2.prop3"
     * @return the value of nth-propery
     * @example
     * var obj = {prop1: "hi", prop2: {prop3: "hello", prop4: {prop5: "anything"}}};
     * Get a property with obj.accessTo("prop1"), obj.accessTo("prop1.prop2") etc..
     *
     *
     */
    function accessTo(string) {
        return recursiveDeepAccess(string.split('.'), _GET, this);
    }
    function setTo(string, value) {
        return recursiveDeepAccess(string.split('.'), _POST, this, value);
    }
    //=============================================================================================================
    /**
     * Update the view-model on DOM change. important, 'this' in the function scope is the dom element
     */
    var inputWatcherDom = function(model, dataModel) {
        if(isInput(this)) {
            /** init input text with model value. Init the text value and the attribute value */
            if(isText(this)) {
                this.value = model[dataModel];
                this.setAttribute('value', this.value);
            }
            this.onkeyup = function() {
                this.setAttribute('value', this.value);
                model[dataModel] = this.value;    
            }
            if(isRadio(this)) {
                /** init input radio with model value */
                if(this.value === model[dataModel]) {
                    this.checked = true;
                }
                this.onchange = function() {
                    model[dataModel] = this.value;
                }
            }
        }
    };
    
    /**
     * Update the view-model (<input>) on model change
     */
    var inputWatcherModel = function(value) {
        if(isInput(this)) {
            if(isText(this)) {
                this.value = value;
                this.setAttribute('value', this.value);
            }
            if(isRadio(this) && this.value === value) {
                this.checked = true;
            }
        }    
    };
    /**
     * Update the view-model (<any>) on model change
     */
    var anyWatcherModel = function(value) {
        /** init input radio with model value */
        if(!isInput(this)) {
            this.innerHTML = value;
        }    
    };
    
    /**
     * Update the model on DOM change
     */
    var anyWatcherDom = function(model, dataModel) {
        if(!isInput(this)) {
            this.innerHTML = model[dataModel];
        }    
    };
    
    /**
     * Update element attributes
     *
     */
    var updateDomAttributesModel = function(value) {
        if(this && this !== null && this.dataset.attributes && this.dataset.attributes !== null) {
            var attributes = this.dataset.attributes.split(' ');
            var that = this;
            attributes.forEach(function(attribute) {
                that.setAttribute(attribute, value);    
            });    
        }    
    };
    
    var updateDomAttributesDom = function(model, dataModel) {
        var value = model[dataModel];
        if(this && this !== null && this.dataset.attributes && this.dataset.attributes !== null) {
            var that = this;
            var attributes = this.dataset.attributes.split(' ');
            attributes.forEach(function(attribute) {
                that.setAttribute(attribute, value);    
            });    
        }    
    };

    /**
     * @constructor
     * @propery {Array} watchers Array of listener
     */
    function Synchronizer(watchers) {
        this.watchers = watchers;
    }
    Synchronizer.prototype.sync = function(element, args) {
        this.watchers.forEach(function(watcher) {
            watcher.apply(element, args);    
        });    
    }
    
    
    
    
    
    
    /**
     *
     * @constructor
     * @property {string} id The id of view
     * @property {object} modele The model
     */
    function Bind(element, model) {
        if(typeof model !== "object") { 
            throw new Error("model must be object"); 
        }
//        var element = document.getElementById(id);
        var that = this , dataModel = element.dataset.model;
        /**
         * initialSync At init syncs the view with the model and bind input element events because the MutationObserver not react on onkeyup, onchange dom events
         */
        var initialSync = new Synchronizer([inputWatcherDom, anyWatcherDom, updateDomAttributesDom]);
        
        /**
         * synchronizer Syncs the view with the model
         */
        var synchronizer = new Synchronizer([inputWatcherModel, anyWatcherModel, updateDomAttributesModel]);
        var observerConf = {
            childList: true, 
            attributes: true, 
            characterData: true, 
            characterDataOldValue: true, 
            attributes: true, 
            subtree: true
        };
        
        
        initialSync.sync(element, [model, dataModel]);
        
        new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.type == "attributes" && element.hasAttribute('value')) {
                    model[dataModel] = element.getAttribute('value');
                }
                if(mutation.type == "characterData") {
                    model[dataModel] = mutation.target.textContent;
                }
            });    
        }).observe(element, observerConf);
        
        
        /**
         * This is an experimental technology, part of the Harmony (ECMAScript 7) proposal.
         */
        Object.observe(model, function(observed) {
            var value = observed[0].object[dataModel];
            synchronizer.sync(element, [value]);
            
        });
    }
    
    
    

    
    mvtation.bindElementById = function(id) {
        var element = document.getElementById(id);
        if(typeof element === null) {
            throw new Error('Element not found!');
        }
        /** Apply scope to element */
        return function(scope) {
            return new Bind(element, scope);    
        }
    }
    mvtation.bindElementsByClassName = function(className) {
        var elements = document.getElementsByClassName(className);
        /** Apply scope to elements */
        return function(scope) {
            for(var k in elements) {
                if(k === "length") {return;}
                var element = elements[k];
                if(element.hasAttribute('id') === false) {
                    var id = element.getAttribute('class') + '-'+ k;
                    element.setAttribute('id', id);
                    new Bind(document.getElementById(id), scope);
                }
            }    
        }
    }
    
    
})(window);
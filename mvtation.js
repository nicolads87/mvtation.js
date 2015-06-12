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
     * Update the view-model on DOM change
     */
    var inputWatcherDom = function(element, model, dataModel) {
        if(isInput(element)) {
            /** init input text with model value. Init the text value and the attribute value */
            if(isText(element)) {
                element.value = model[dataModel];
                element.setAttribute('value', element.value);
            }
            element.onkeyup = function() {
                element.setAttribute('value', element.value);
                model[dataModel] = element.value;    
            }
            if(isRadio(element)) {
                /** init input radio with model value */
                if(element.value === model[dataModel]) {
                    element.checked = true;
                }
                element.onchange = function() {
                    model[dataModel] = element.value;
                }
            }
        }
    };
    
    /**
     * Update the view-model (<input>) on model change
     */
    var inputWatcherModel = function(element, value) {
        if(isInput(element)) {
            if(isText(element)) {
                element.value = value;
                element.setAttribute('value', element.value);
            }
            if(isRadio(element) && element.value === value) {
                element.checked = true;
            }
        }    
    };
    /**
     * Update the view-model (<any>) on model change
     */
    var anyWatcherModel = function(element, value) {
        /** init input radio with model value */
        if(!isInput(element)) {
            element.innerHTML = value;
        }    
    };
    
    /**
     * Update the model on DOM change
     */
    var anyWatcherDom = function(element, model, dataModel) {
        if(!isInput(element)) {
            element.innerHTML = model[dataModel];
        }    
    };
    
    /**
     * Update element attributes
     *
     */
    var updateDomAttributesModel = function(element, value) {
        if(element && element !== null && element.dataset.attributes && element.dataset.attributes !== null) {
            var attributes = element.dataset.attributes.split(' ');
            attributes.forEach(function(attribute) {
                element.setAttribute(attribute, value);    
            });    
        }    
    };
    
    var updateDomAttributesDom = function(element, model, dataModel) {
        var value = model[dataModel];
        if(element && element !== null && element.dataset.attributes && element.dataset.attributes !== null) {
            var attributes = element.dataset.attributes.split(' ');
            attributes.forEach(function(attribute) {
                element.setAttribute(attribute, value);    
            });    
        }    
    };
    //=============================================================================================================
    var _watchersDOM = [inputWatcherDom, anyWatcherDom, updateDomAttributesDom];
    var _watchersModel = [inputWatcherModel, anyWatcherModel, updateDomAttributesModel];
    
    
    /**
     *
     * @constructor
     * @property {string} id The id of view
     * @property {object} modele The model
     */
    function Mutation(id, model) {
        if(typeof model !== "object") { throw new Error("model must be object"); }
        var that = this, element = document.getElementById(id), dataModel = element.dataset.model;
        var observerConf = {
            childList: true, 
            attributes: true, 
            characterData: true, 
            characterDataOldValue: true, 
            attributes: true, 
            subtree: true
        };
        
        this.onMutation = function(watch) {
            that.watch = watch;
        }
        
        _watchersDOM.forEach(function(watcher) {watcher(element, model, dataModel);});
        
//        updateAttributes(element, model[dataModel]);
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.type == "attributes" && element.hasAttribute('value')) {
                    model[dataModel] = element.getAttribute('value');
                }
                if(mutation.type == "characterData") {
                    model[dataModel] = mutation.target.textContent;
                }
            });    
        });
        
        observer.observe(element, observerConf);
        
        /**
         * This is an experimental technology, part of the Harmony (ECMAScript 7) proposal.
         */
        Object.observe(model, function(observed) {
            var value = observed[0].object[dataModel];
//            updateAttributes(element, value);
            if(typeof that.watch == "function") {
                that.watch(value, observed[0].oldValue);    
            }
            _watchersModel.forEach(function(watcher) {watcher(element, value);});
            
        });
    }
    
    
    
    /*function updateAttributes(element, value) {
        if(element && element !== null && element.dataset.attributes && element.dataset.attributes !== null) {
            var attributes = element.dataset.attributes.split(' ');
            attributes.forEach(function(attribute) {
                element.setAttribute(attribute, value);    
            });    
        }
    }*/
    function MutationAll(className, model) {
        var elements = document.getElementsByClassName(className);
        for(var k in elements) {
            if(k === "length") {return;}
            var element = elements[k];
            if(element.hasAttribute('id') === false) {
                var id = element.getAttribute('class') + '-'+ k;
                element.setAttribute('id', id);
                new Mutation(id, model);
            }
        }
    }
    mvtation.mutate = Mutation;
    mvtation.mutateAll = MutationAll;
    Object.prototype.accessTo = accessTo;
    Object.prototype.setTo = setTo;
    
    
})(window);
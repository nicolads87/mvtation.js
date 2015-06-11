/**
 * @license MVtationJS v0.0.1
 * (c) 2015, nicolads87 <nicola.ds87@gmail.com>
 * License: MIT
 */
(function(window) {
    'use strict';
    var mvtation = ( window.mvtation || (window.mvtation = {}) );
    function isInput(e) {return e.tagName === "INPUT";}
    function isRadio(e) {return e.type === "radio";}
    function isText(e) {return e.type === "text";}
    
    function Mutation(id, model) {
        
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
        
        
        
        if(isInput(element)) {
            if(isText(element)) {
                element.value = model[dataModel];//init
            }
            element.onkeyup = function() {
                element.setAttribute('value', element.value);
                model[dataModel] = element.value;    
            }
            if(isRadio(element)) {
                if(element.value === model[dataModel]) {
                    element.checked = true;
                }
                element.onchange = function() {
                    model[dataModel] = element.value;
                }
            }
        }else{
            element.innerHTML = model[dataModel];//init
        }
        
        
        updateAttributes(element, model[dataModel]);
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
            var modelValue = observed[0].object[dataModel];
            updateAttributes(element, modelValue);
            if(typeof that.watch == "function") {
                that.watch(modelValue, observed[0].oldValue);    
            }
            if(isInput(element)) {
                if(isText(element)) {
                    element.value = modelValue;
                    element.setAttribute('value', element.value);
                }
                if(isRadio(element) && element.value === modelValue) {
                    element.checked = true;
                }
            }else {
                element.innerHTML = modelValue;
            }
        });
    }
    function updateAttributes(element, value) {
        if(element && element !== null && element.dataset.attributes && element.dataset.attributes !== null) {
            var attributes = element.dataset.attributes.split(' ');
            attributes.forEach(function(attribute) {
                element.setAttribute(attribute, value);    
            });    
        }
    }
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
    
    
})(window);
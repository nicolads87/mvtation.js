'use strict';
function Mutation(id, model) {
    var self = this;
    var element = document.getElementById(id);
    this.onMutation = function(watch) {
        self.watch = watch;
    }
    var dataModel = element.dataset.model;
    this.isInput = function() {
        return element.tagName === "INPUT";  
    }
    if(this.isInput()) {
        if(element.type === "text") {
            element.value = model[dataModel];//init
        }
        element.onkeyup = function() {
            element.setAttribute('value', element.value);
            model[dataModel] = element.value;    
        }
        if(element.type === "radio") {
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
    var observerConf = {childList: true, attributes: true, characterData: true, characterDataOldValue: true, attributes: true, subtree: true};
    observer.observe(element, observerConf);
    Object.observe(model, function(observed) {
        var modelValue = observed[0].object[dataModel];
        updateAttributes(element, modelValue);
        if(typeof self.watch == "function") {
            self.watch(modelValue, observed[0].oldValue);    
        }
        if(self.isInput()) {
            if(element.type === "text") {
                element.value = modelValue;
                element.setAttribute('value', element.value);
            }
            if(element.type === "radio" && element.value === modelValue) {
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

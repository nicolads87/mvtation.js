'use strict';
function Mutation(id, model) {
    var self = this;
    this.view = document.getElementById(id);
    this.onMutation = function(watch) {
        self.watch = watch;
    }
    //var dataModel = $(this.view).attr('data-model');
    var dataModel = this.view.dataset.model;
    this.isInput = function() {
       //return $(this.view).is('input');
        return document.getElementById(id).tagName === "INPUT";  
    }
    if(this.isInput()) {
        //TODO: update when change value attribure from inspector. Use mutations.
        this.view.onkeyup = function() {
            document.getElementById(id).setAttribute('value', document.getElementById(id).value);
            model[dataModel] = document.getElementById(id).value;    
            //$(self.view).attr('value', $(self.view).val());
            //model[dataModel] = $(self.view).val();    
        }    
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log('Mutation ', mutation);
            //TODO: Update model
            if(mutation.type == "attributes" && document.getElementById(id).hasAttribute('value')) {
                //model[dataModel] = $(self.view).attr('value');
                model[dataModel] = document.getElementById(id).getAttribute('value');
                //model[dataModel] = mutation.target.value;
            }
            if(mutation.type == "characterData") {
                model[dataModel] = mutation.target.textContent;
                //Mustache
                //updateAttributes(id, mutation.target.textContent);
                
            }

        });    
    });
    var observerConf = {childList: true, attributes: true, characterData: true, characterDataOldValue: true, attributes: true, subtree: true};
    observer.observe(this.view, observerConf);
    
    Object.observe(model, function(observed) {
        
        var modelValue = observed[0].object[dataModel];
        updateAttributes(id, modelValue);
        if(typeof self.watch == "function") {
            self.watch(modelValue, observed[0].oldValue);    
        }
        
        if(self.isInput()) {
            //$(self.view).attr('value', modelValue);
            //$(self.view).val(modelValue); 
            document.getElementById(id).value = modelValue;
            document.getElementById(id).setAttribute('value', document.getElementById(id).value);
        }else {
            //$(self.view).html(modelValue);
            document.getElementById(id).innerHTML = modelValue;
        }
        
    });
    
}
function updateAttributes(id, value) {
    var element = document.getElementById(id);
    if(element && element !== null && element.dataset.attributes && element.dataset.attributes !== null) {
        var attributes = element.dataset.attributes.split(' ');
        attributes.forEach(function(attribute) {
            element.setAttribute(attribute, value);    
        });    
    }
}
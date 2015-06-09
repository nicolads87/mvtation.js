'use strict';
function Mutation(id, model) {
    var self = this;
    this.view = document.getElementById(id);
    this.onMutation = function(watch) {
        self.watch = watch;
    }
    var dataModel = $(this.view).attr('data-model');
    this.isInput = function() {
       return $(this.view).is('input'); 
    }
    if(this.isInput()) {
        //TODO: update when change value attribure from inspector. Use mutations.
        this.view.onkeyup = function() {
            $(self.view).attr('value', $(self.view).val());
            model[dataModel] = $(self.view).val();    
        }    
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log('Mutation ', mutation);
            //TODO: Update model
            if(mutation.type == "attributes") {
                model[dataModel] = $(self.view).attr('value');
                //model[dataModel] = mutation.target.value;
            }
            if(mutation.type == "characterData") {
                model[dataModel] = mutation.target.textContent;    
            }

        });    
    });
    var observerConf = {childList: true, attributes: true, characterData: true, characterDataOldValue: true, attributes: true, subtree: true};
    observer.observe(this.view, observerConf);
    
    Object.observe(model, function(observed) {
        
        var modelValue = observed[0].object[dataModel];
        if(typeof self.watch == "function") {
            self.watch(modelValue, observed[0].oldValue);    
        }
        
        if(self.isInput()) {
            $(self.view).attr('value', modelValue);
            $(self.view).val(modelValue);    
        }else {
            $(self.view).html(modelValue);
        }
        
    });
    
}
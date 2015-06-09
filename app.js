var person = {
    firstName: "Christophe",
    lastName: "Coenraets",
    blogURL: "http://coenraets.org"
};
var template = "<h1>{{firstName}} {{lastName}}</h1>Blog: {{blogURL}}";


var vmBind = function(element, template, model) {
    if(template) {
        var html = Mustache.to_html(template, model);
    }
    var bindedElement = $('#'+element);
    
    if(html) {
        bindedElement.html(html);
        viewbind(bindedElement);
        
    }
    Object.observe(model, function(changes) {
        console.debug('observe ', changes.oldValue);
        if(html){
            bindedElement.html(Mustache.to_html(template, model));
            viewbind(bindedElement, model);
        }
    });
}

function viewbind(view, model) {
    
    view.find('input').each(function() {
        var value = $(this).attr('vm');
        $(this).keyup(function() {
            console.log('keyup', $(this).val());
            if(model) {
                model[value] = $(this).val();
            }
        });
    });

}






$(document).ready(function() {
    //vmBind('element', template, person);
    setTimeout(function() {
        person.firstName = "one way bind";
    }, 3000);
    var content = '<input id="id" type="text" vm="firstName" value="{{firstName}}"></span>';
   
    //vmBind('content', undefined, person);
    vmBind('content', content, person);
    var div = document.getElementById("mutations");
    div.onkeyup = function() {
        console.warn('onchange');
        $(div).attr('value', $(div).val())
        person.firstName = $(div).val();
    }
    var mutationManager = function(mutations) {
        console.log('mutationManager', mutationManager);
        mutations.forEach(function(mutation) {
            console.log('Mutation ', mutation.type);
        });
    };
    var observer = new MutationObserver(mutationManager);
    var observerConf = {
        childList: true, 
        attributes: true, 
        characterData: true, 
        characterDataOldValue: true,
        attributes: true, subtree: true
    };
    observer.observe(div, observerConf);


});
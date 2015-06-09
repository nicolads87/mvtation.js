var person = {
        firstName: "Christophe",
        lastName: "Coenraets",
    };




$(document).ready(function() {
    var inputMut = new Mutation('mutations', person);
    var el = new Mutation('element', person);
    el.onMutation(function(n, o) {
        console.log('onM', n, o);
    });
    /*var element = document.getElementById("mutations");
    element.onkeyup = function() {
        $(element).attr('value', $(element).val());
        person.firstName = $(element).val();
    }
    var mutationManager = function(mutations) {
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
    observer.observe(element, observerConf);
    Object.observe(person, function(changes) {
        console.debug('observe: '+ changes[0].oldValue);
        $(element).attr('value', person.firstName);
        $(element).val(person.firstName);
    });*/


});
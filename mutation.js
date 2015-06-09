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
    


});
var person = {  firstName: "Christophe", lastName: "Coenraets" };
var model = {property: "Hello 2-way bind!"};


window.onload = function() {
    var inputMut = new Mutation('mutations', person);
    //var el = new Mutation('element', person);
    MutationAll('two-way-bind', model);
    MutationAll('person', person);
    
    var twoWay = new Mutation('test-mustache', person);
    
    
}

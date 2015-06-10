var person = {  firstName: "Christophe", lastName: "Coenraets", gender: "female" };
var model = { property: "multiple bind" };
var radio = { value: true };


window.onload = function() {
    var inputMut = new Mutation('mutations', person);
    MutationAll('multiple', model);
    MutationAll('person', person);
    
    
    MutationAll('mutation-radio', person);
    
    var twoWay = new Mutation('lastname', person);
    
    
}

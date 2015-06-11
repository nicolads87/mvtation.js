var person = {  firstName: "Christophe", lastName: "Coenraets", gender: "female" };
var model = { property: "multiple bind" };
var radio = { value: true };


window.onload = function() {
    var inputMut = new mvtation.mutate('mutations', person);
    mvtation.mutateAll('multiple', model);
    mvtation.mutateAll('person', person);
    
    
    mvtation.mutateAll('mutation-radio', person);
    
    var twoWay = new mvtation.mutate('lastname', person);
    
    
}
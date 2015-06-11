var person = {  firstName: "Christophe", lastName: "Coenraets", gender: "female" };
var model = { property: "multiple bind" };
var radio = { value: true };


window.onload = function() {
    var inputMut = new mvtation.mute('mutations', person);
    mvtation.muteAll('multiple', model);
    mvtation.muteAll('person', person);
    
    
    mvtation.muteAll('mutation-radio', person);
    
    var twoWay = new mvtation.mute('lastname', person);
    
    
}
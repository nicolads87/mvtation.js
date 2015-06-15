var person = {  firstName: "Christophe", lastName: "Coenraets", gender: "female" };
var model = { property: "multiple bind" };
var radio = { value: true };


window.onload = function() {
    mvtation.bindElementById('mutations')(person);
    
    
    mvtation.bindElementsByClassName('multiple')(model);
    
    
    mvtation.bindElementsByClassName('person')(person);
    
    mvtation.bindElementsByClassName('mutation-radio')(person);
    
    mvtation.bindElementById('lastname')(person);
    
    
}
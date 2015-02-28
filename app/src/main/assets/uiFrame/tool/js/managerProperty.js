/**
 * Created by patrickchen on 2015/1/14.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerProperty : 'manager.js' is not loaded");
}
manager.initProperty = function(){
   var initObj = (function(){
      var setProperty = function(attr, value, o){
         var obj = (o) ? o : ((manager.selectedObject) ? manager.selectedObject : undefined);
         if(!obj){
            console.log("setProperty: element not specified.");
            return;
         }
         console.log("setProperty:(" + attr + " : " + value + " on " + o.toString());
         switch(attr){
            case "font-size":
               obj.style.fontSize = value;
               break;
            case "src":
               console.log("set src : "+value);
               obj.setAttribute("src", value);
               break;
            case "font":
               obj.style.fontFamily = value;
               break;
            case "background-color":
               obj.style.backgroundColor = value;
               break;
            case "background-image":
               obj.style.backgroundImage = value;
               break;
            case "color":
               obj.style.color = value;
               break;
            case "text":
               obj.innerHTML = value;
               break;
            case "opacity":
               obj.style.opacity = value;
               break;
            case "link":
               obj.setAttribute("data-link", value);
               break;
            case "text-align":
               obj.style.textAlign = value;
               break;
            default :
               break;
         }
         manager.assignSelection(manager.selectedObject);
         manager.renderSelectedObject(obj);
      };
      var getProperty = function(attr, o){
         var obj = (o) ? o : ((manager.selectedObject) ? manager.selectedObject : undefined);
         console.log("getAttribute not implemented.");
      };
      return {
         setProperty : setProperty,
         getProperty: getProperty
      };
   })();
   manager.setProperty = initObj.setProperty;
   manager.getProperty = initObj.getProperty;
};
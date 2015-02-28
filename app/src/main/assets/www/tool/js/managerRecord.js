/**
 * Created by patrickchen on 2015/1/18.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerRecord : 'manager.js' is not loaded");
}
manager.initRecord = function(){
   var initObj = (function(){
      var actionStack = [];
      var actions = [];
      manager.config.maxActionStackLength = 10;
      var maxActionStackLength = manager.config.maxActionStackLength;
      var currentPointer = 0, maxPointer = 0, minPointer = 0;
      var registerAction = function(act){
         if(!act.type || !act.execFunction || !act.undoFunction || !act.redoFunction){
            console.log("Register action failed.");
            return;
         }
         actions.push(act);
      };
      var exec = function(act){
         for(var i in actions){
            if(actions[i].type == act.type){
               actions[i].execFunction();
               return;
            }
         }
         console.log("wrong type");
      };
      var redo = function(act){
         for(var i in actions){
            if(actions[i].type == act.type){
               actions[i].redoFunction();
               return;
            }
         }
         console.log("wrong type");
      };
      var undo = function(act){
         for(var i in actions){
            if(actions[i].type == act.type){
               actions[i].undoFunction();
               return;
            }
         }
         console.log("wrong type");
      };
      var undoAction = function(){
         if(currentPointer == minPointer){
            console.log("Reach undo maximum");
            return;
         }
         actionStack[currentPointer].undoFunction();
         currentPointer = (currentPointer + maxActionStackLength - 1) % maxActionStackLength;
      };
      var redoAction = function(){
         if(currentPointer == maxPointer){
            console.log("Reach redo maximum");
            return;
         }
         currentPointer = (++currentPointer) % maxActionStackLength;
         actionStack[currentPointer].redoFunction();
      };
      var pushAction = function(act){
         currentPointer = (++currentPointer) % maxActionStackLength;
         if(currentPointer == minPointer){
            minPointer++;
         }
         maxPointer = currentPointer;
         actionStack[currentPointer] = act;
         actionStack[currentPointer].execFunction();
      };
      var resizeStack = function(num){
         actionStack = [];
         if(!num){
            maxActionStackLength = manager.config.maxActionStackLength;
         }else{
            manager.maxActionStackLength = maxActionStackLength = num;
         }
         actionStack.length = maxActionStackLength;

         currentPointer = 0;
         maxPointer = 0;
         minPointer = 0;
      };

      return {
         undoAction       : undoAction,
         redoAction       : redoAction,
         pushAction       : pushAction,
         resizeActionStack: resizeStack
      };
   })();
// NOTICE: manager.config.maxActionStackLength is defined above.

   manager.undoAction = initObj.undoAction;
   manager.redoAction = initObj.redoAction;
   manager.pushAction = initObj.pushAction;
   manager.resizeActionStack = initObj.resizeActionStack;
   manager.resizeActionStack(10);

};
manager.action = {};
manager.action.setProperty = function(obj, attr, oldValue, newValue){
   var myAttr = attr, myOldValue = oldValue, myNewValue = newValue;
   var exec = function(){
      manager.setProperty(myAttr, myNewValue, obj);
   };
   var undo = function(){
      manager.setProperty(myAttr, myOldValue, obj);
   };
   manager.pushAction(
      {
         type        : "setProperty",
         execFunction: exec,
         redoFunction: exec,
         undoFunction: undo
      }
   );
};
manager.action.addElement = function(obj, ref){
   var myObj = obj, myRef = ref;
   var myRefPlaceholder;
   var exec = function(){
      if(myRef.parentNode){
         if(myRef.parentNode.placeholder){
            myRefPlaceholder = myRef.parentNode;
            myRefPlaceholder.parentNode.insertBefore(myObj, myRefPlaceholder);
            myRefPlaceholder.removeChild(myRef);
            myRefPlaceholder.parentNode.removeChild(myRefPlaceholder)
         }else{
            myRef.parentNode.insertBefore(myObj, myRef);
            myRef.parentNode.removeChild(myRef);
            myRef = manager.createDummy();
         }
      }else{
         console.log("addElement: ref has no parentNode");
      }
   };
   var redo = function(){
      if(myRefPlaceholder){
         myRefPlaceholder.parentNode.insertBefore(myObj, myRefPlaceholder);
         myRefPlaceholder.parentNode.removeChild(myRefPlaceholder);
      }else{
         myRef.parentNode.insertBefore(myObj, myRef);
         myRef.parentNode.removeChild(myRef);
      }
   };
   var undo = function(){
      if(myRefPlaceholder){
         myObj.parentNode.insertBefore(myRefPlaceholder, myObj);
         myObj.parentNode.removeChild(myObj);
      }else{
         myObj.parentNode.insertBefore(myRef, myObj);
         myObj.parentNode.removeChild(myObj);
      }
   };
   manager.pushAction(
      {
         type        : "addElement",
         execFunction: exec,
         redoFunction: redo,
         undoFunction: undo
      }
   );
};
manager.action.deleteElement = function(obj){
   var myObj = obj, start, myObjPlaceholder;
   if(!myObj){
      return;
   }
   var exec = function(){
      if(myObj.parentNode){
         if(myObj.parentNode.column){
            var count = 0;
            for(var i = 0; i < myObj.parentNode.children.length; ++i){
               if(myObj.parentNode.children[i].dummy != true){
                  ++count;
               }
            }
            if(count == 1){
               // Add placeholder
               myObjPlaceholder = manager.createPlaceholder();
               myObj.parentNode.insertBefore(myObjPlaceholder, myObj);
               myObj.parentNode.removeChild(myObj);
            }else{
               start = manager.createDummy();
               myObj.parentNode.insertBefore(start, myObj);
               myObj.parentNode.removeChild(myObj);
            }
         }else{
            start = manager.createDummy();
            myObj.parentNode.insertBefore(start, myObj);
            myObj.parentNode.removeChild(myObj);
         }
         manager.config.onDoubleTap();
      }else{
         console.log("moveElement: myObj have no parentNode");
      }
   };
   var undo = function(){
      if(myObjPlaceholder){
         myObjPlaceholder.parentNode.insertBefore(myObj, myObjPlaceholder);
         myObjPlaceholder.parentNode.removeChild(myObjPlaceholder);
      }else{
         start.parentNode.insertBefore(myObj, start);
         start.parentNode.removeChild(start);
      }
      manager.assignSelection(myObj);
   };
   var redo = function(){
      if(myObjPlaceholder){
         myObj.parentNode.insertBefore(myObjPlaceholder, myObj);
         myObj.parentNode.removeChild(myObj);
      }else{
         myObj.parentNode.insertBefore(start, myObj);
         myObj.parentNode.removeChild(myObj);
      }
      manager.config.onDoubleTap();
   };
   manager.pushAction(
      {
         type        : "deleteElement",
         execFunction: exec,
         undoFunction: undo,
         redoFunction: redo
      }
   );
};
manager.action.moveElement = function(obj, ref){
   var myObjPlaceholder, myRefPlaceholder;
   var myObj = obj, start, myRef = ref;
   var exec = function(){
      if(myObj.parentNode){
         if(myObj.parentNode.column){
            var count = 0;
            for(var i = 0; i < myObj.parentNode.children.length; ++i){
               if(myObj.parentNode.children[i].dummy != true){
                  ++count;
               }
            }
            if(count == 1){
               // Add placeholder
               myObjPlaceholder = manager.createPlaceholder();
               myObj.parentNode.insertBefore(myObjPlaceholder, myObj);
               myObj.parentNode.removeChild(myObj);
            }else{
               start = manager.createDummy();
               myObj.parentNode.insertBefore(start, myObj);
               myObj.parentNode.removeChild(myObj);
            }
         }else{
            start = manager.createDummy();
            myObj.parentNode.insertBefore(start, myObj);
            myObj.parentNode.removeChild(myObj);
         }
      }else{
         console.log("moveElement: myObj have no parentNode.");
         return;
      }
      if(myRef.parentNode){
         if(myRef.parentNode.placeholder){
            myRefPlaceholder = myRef.parentNode;
            myRefPlaceholder.parentNode.insertBefore(myObj, myRefPlaceholder);
            myRefPlaceholder.removeChild(myRef);
            myRefPlaceholder.parentNode.removeChild(myRefPlaceholder);
         }else{
            var x = myRef.parentNode;
            x.insertBefore(myObj, myRef);
            x.removeChild(myRef);
            myRef = manager.createDummy();
         }
      }else{
         console.log("moveElement: ref has no parentNode");
      }
   };
   var undo = function(){
      if(myRefPlaceholder){
         myObj.parentNode.insertBefore(myRefPlaceholder, myObj);
         myObj.parentNode.removeChild(myObj);
      }else{
         myObj.parentNode.insertBefore(myRef, myObj);
         myObj.parentNode.removeChild(myObj);
      }
      if(myObjPlaceholder){
         myObjPlaceholder.parentNode.insertBefore(myObj, myObjPlaceholder);
         myObjPlaceholder.parentNode.removeChild(myObjPlaceholder);
      }else{
         start.parentNode.insertBefore(myObj, start);
         start.parentNode.removeChild(start);
      }
      manager.assignSelection(manager.selectedObject);
   };
   var redo = function(){
      if(myObjPlaceholder){
         myObj.parentNode.insertBefore(myObjPlaceholder, myObj);
         myObj.parentNode.removeChild(myObj);
      }else{
         myObj.parentNode.insertBefore(start, myObj);
         myObj.parentNode.removeChild(myObj);
      }
      if(myRefPlaceholder){
         myRefPlaceholder.parentNode.insertBefore(myObj, myRefPlaceholder);
         myRefPlaceholder.parentNode.removeChild(myRefPlaceholder);
      }else{
         myRef.parentNode.insertBefore(myObj, myRef);
         myRef.parentNode.removeChild(myRef);
      }
      manager.assignSelection(manager.selectedObject);
   };
   manager.pushAction(
      {
         type        : "moveElement",
         execFunction: exec,
         undoFunction: undo,
         redoFunction: redo
      }
   );
};

/*
 //moveElement(manager.selectedObject, manager.Cursor);
 var moveact =
 {
 type       : 'move',
 target     : manager.selectedObject,
 destination: manager.Cursor,
 start      : startPoint
 };
 manager.pushAction(moveact);
 moveElement(manager.selectedObject, manager.Cursor);
 * */

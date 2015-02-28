/**
 * Created by patrickchen on 2015/1/14.
 * Dependencies:
 *    Select
 *       Drag
 *       Property
 *          Record
 */
var manager = {};
// Configuration for gestureListener
manager.config = {
   listener             : document.getElementById("innercontent"),
   longPressThreshold   : 600,
   doubleTapThreshold   : 125,
   gestureCountThreshold: 5,
   onSingleTap          : function(){
   },
   onDoubleTap          : function(){
   },
   onLongPressStart     : function(){
   },
   onLongPressMove      : function(){
   },
   onLongPressEnd       : function(){
   },
   on2FingerMoveUp      : function(){
   },
   on2FingerMoveDown    : function(){
   },
   on2FingerMoveLeft    : function(){
   },
   on2FingerMoveRight   : function(){
   },
   onPinchIn            : function(){
   },
   onPinchOut           : function(){
   }
};
manager.preLoad = function(){
   // NOTICE : Do something that should be done before any initiation.
   var c = manager.config.listener.getBoundingClientRect();
   manager.config.offsetX = c.left;
   manager.config.offsetY = c.top;
   var elements = manager.config.listener.getElementsByTagName("*");
   manager.createSlidePlaceholder = function(){
      var c = document.createElement("div");
      //c.appendChild(document.createElement("br"));
      c.slidePlaceholder = true;
      c.className = "slidePlaceHolder";
      c.setAttribute("data-slidePlaceholder", "true");
      return c;
   };
   manager.createPlaceholder = function(){
      var c = document.createElement("div");
      //c.appendChild(document.createElement("br"));
      c.placeholder = true;
      c.setAttribute("data-placeholder", "true");
      c.className = "placeholder";
      c.selectable = true;
      return c;
   };
   for(var i = elements.length - 1; i >= 0; --i){
      var e = elements[i];
      switch(e.tagName.toLowerCase()){
         case "br":
         case "span":
         case "hr":
         case "script":
         case undefined:
         case null:
            break;
         default :
            if(!e.hasAttribute("data-not-selectable")){
               e.selectable = true;
               break;
            }
            if(e.hasAttribute("data-placeholder")){
               e.placeholder = true;
               break;
            }
            if(e.hasAttribute("data-slidePlaceholder")){
               e.slidePlaceholder = true;
               break;
            }

      }
      if(e.id.substr(0, 5) == "slide"){
         e.slide = true;
      }
      var cl = e.classList;
      if(cl.toString() && cl.toString().indexOf("col-md-") != -1){
         e.column = true;
      }
   }
};

manager.init = function(){
   manager.preLoad();

   if(manager.initSelect){
      manager.initSelect();
   }
   if(manager.initDrag){
      manager.initDrag();
   }
   if(manager.initProperty){
      manager.initProperty();
   }
   if(manager.initRecord){
      manager.initRecord();
   }
   setGestureListener(manager.config);
};
window.onkeypress = function(e){
   if(e.keyCode < 105 || e.keyCode > 108){
      return;
   }
   switch(e.keyCode){
      case 105: //i
         manager.config.on2FingerMoveUp();
         break;
      case 107: //k
         manager.config.on2FingerMoveDown();
         break;
      case 106: //j
         manager.config.on2FingerMoveLeft();
         break;
      case 108: //l
         manager.config.on2FingerMoveRight();
         break;
   }
};

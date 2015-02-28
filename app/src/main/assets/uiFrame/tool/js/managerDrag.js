/**
 * Created by patrickchen on 2015/1/17.
 */

var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerDrag : 'manager.js' is not loaded");
}
manager.initDrag = function(){
   var initObj = (function(){
      var isDraggingSlide = false;
      var isDragging = false;
      var windowH = window.innerHeight;
      manager.config.dragMoveTimeout = 100;
      var dragMoveCount = manager.config.dragMoveTimeout;
      var dragInterval = 500;
      var dragSetTimeout, dragSetInterval;
      var cursorX, cursorY;
      var dragExternal;
      var scroll = function(){
         if(cursorY < 100 && window.scrollY > 10){
            window.scrollTo(window.scrollX, window.scrollY - 10);
         }else if(cursorY > windowH - 100){
            window.scrollTo(window.scrollX, window.scrollY + 10);

         }
      };
      // Add CSS rule
      (function(){
         var managedStyle = document.createElement("style");
         // WebKit hack :(
         managedStyle.appendChild(document.createTextNode(""));
         document.head.appendChild(managedStyle);

         managedStyle.sheet = (managedStyle.sheet) ? managedStyle.sheet : {};

         manager.managedStylesheet = managedStyle.sheet;
         manager.managedStylesheet.insertRule(".placeholder{display:none;}", 0);
         manager.managedStylesheet.insertRule(".slidePlaceholder{display:none;}", 0);

         manager.slidePlaceholderStyle = manager.managedStylesheet.cssRules[0];
         manager.placeholderStyle = manager.managedStylesheet.cssRules[1];

      })();
      var moveElement = function(o, ref){
         var c = ref;
         while(c.parentNode){
            if(c.parentNode == o){
               return false;
            }
            c = c.parentNode;
         }
         if(ref.parentNode){
            ref.parentNode.insertBefore(o, ref);
            return true;
         }
      };
      var resetTimeout = function(){
         dragSetTimeout = undefined;
         dragMoveCount = manager.config.dragMoveTimeout;
         if(isDragging){
            updateCursor(cursorX, cursorY);
         }
      };

      var showPlaceholder = function(){
         manager.placeholderStyle.style.display = "block";
         manager.slidePlaceholderStyle.style.display = "block";
      };
      var hidePlaceholder = function(){
         manager.placeholderStyle.style.display = "none";
         manager.slidePlaceholderStyle.style.display = "none";
      };
      var updateCursor = function(t){
         if(!t.selectable){
            t = manager.getParentSelectable(t);
            if(!t){
               return;
            }
         }
         var m = manager.selectedObject;
         if(m.slide){
            if(t.slidePlaceholder){
               if(t.parentNode){
                  t.parentNode.appendChild(manager.Cursor);
                  return;
               }
               return;
            }
            while(t.slide != true){
               if(t){
                  t = t.parentNode;
               }else{
                  return;
               }
            }
            var b = t.getBoundingClientRect();
            if(cursorY > b.top + b.height / 2){
               // Insert in the slidePlaceholder after t
               var s = t.previousElementSibling;
               if(s.slidePlaceholder){
                  s.appendChild(manager.Cursor);
                  return;
               }
            }else{
               // Insert in the slidePlaceholder Before t
               var s = t.nextElementSibling;
               if(s.slidePlaceholder){
                  s.appendChild(manager.Cursor);
                  return;
               }
            }
         }else if(m.column){
            // Do nothing
            return;
         }else{
            if(t.slide){

            }else if(t.column || t.slidePlaceholder || t.placeholder){
               t.appendChild(manager.Cursor);
               return;
            }else{
               var b = t.getBoundingClientRect();
               if(cursorY > b.top + b.height / 2){
                  // Insert after t
                  t.parentNode.insertBefore(manager.Cursor, t.nextSibling);
               }else{
                  // Insert Before t
                  t.parentNode.insertBefore(manager.Cursor, t);
               }
               return;
            }
         }
      };

      var dragStart = function(x, y, o, isExternal){
         if(o == manager.selectionMask){
            // Drag from inner content
            Android.startDrag();
            if(x < manager.selectedObjectRect.left ||
               x > manager.selectedObjectRect.left + manager.selectedObjectRect.width ||
               y < manager.selectedObjectRect.top ||
               y > manager.selectedObjectRect.top + manager.selectedObjectRect.height){
               // Not in boundingClientRect
               return;
            }
            o = manager.selectedObject;
         }else{
            if(!isExternal){
               return;
            }
            dragExternal = isExternal;
            Android.startDrag();
            // Drag from clipboard or element repo
            manager.config.onDoubleTap();
            manager.selectedObject = o;
         }
         isDragging = true;
         manager.selectionMask.style.display = "none";
         manager.selectedObject.dragging = manager.selectedObject.style.opacity;
         if(manager.selectedObject.dragging == ""){
            manager.selectedObject.dragging = -1;
         }
         manager.selectedObject.style.opacity = "0.4";
         dragSetInterval = setInterval(scroll, 50);
         o = manager.getParentSelectable(o);
         if(o && o.slide == true){
            isDraggingSlide = true;
         }
         showPlaceholder();
      };
      var dragMove = function(x, y){
         cursorX = x;
         cursorY = y;
         if(!isDragging){
            return;
         }
         if(dragSetTimeout != undefined && dragMoveCount != 0){
            --dragMoveCount;
            return;
         }
         if(!dragSetTimeout){
            dragSetTimeout = setTimeout(resetTimeout, dragInterval);
         }
         if(dragMoveCount == 0){
            dragMoveCount = manager.config.dragMoveTimeout;
            clearTimeout(dragSetTimeout);
            dragSetTimeout = undefined;
         }
         updateCursor(document.elementFromPoint(x, y));
      };
      var dragEnd = function(){
         if(!isDragging){
            return;
         }

         clearInterval(dragSetInterval);
         isDragging = false;
         hidePlaceholder();
         if(cursorX == undefined){
            return;
         }
         if(dragExternal){
            manager.action.addElement(manager.selectedObject, manager.Cursor);
         }else{
            manager.action.moveElement(manager.selectedObject, manager.Cursor);
         }
         if(manager.Cursor.parentNode){
            manager.Cursor.parentNode.removeChild(manager.Cursor);
         }
         manager.assignSelection(manager.selectedObject);
         if(manager.selectedObject.dragging){
            if(manager.selectedObject.dragging != -1){
               manager.selectedObject.style.opacity = manager.selectedObject.dragging;
            }else{
               manager.selectedObject.style.removeProperty("opacity");
            }
            manager.selectedObject.dragging = null;
         }
      };
      return {
         onLongPressStart: dragStart,
         onLongPressMove : dragMove,
         onLongPressEnd  : dragEnd,
         moveElement     : moveElement
      };
   })();

   // Define Cursor
   (function(){
      var para = document.createElement("div");
      var para_br = document.createElement("br");
      para.appendChild(para_br);
      para.className = "cursorStyle";
      manager.Cursor = para;
   })();

   // NOTICE: manager.managedStyle is also defined in this file
   // NOTICE: manager.placeholderStyle is also defined in this file
   manager.moveElement = initObj.moveElement;
   manager.config.onLongPressStart = initObj.onLongPressStart;
   manager.config.onLongPressMove = initObj.onLongPressMove;
   manager.config.onLongPressEnd = initObj.onLongPressEnd;
};
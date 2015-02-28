/**
 * Created by patrickchen on 2015/1/14.
 */
var manager = (manager) ? manager : {};
if(!manager.config){
   manager.config = {};
   console.warn("managerSelect : 'manager.js' is not loaded");
}
manager.initSelect = function(){
   var initObj = (function(){
      // Define selection mask
      var selectionMask = document.createElement("hr");
      selectionMask.className += "selectionMask";
      selectionMask.selectionMask = true;
      manager.config.listener.appendChild(selectionMask);
      // Helper functions
      var getParentSelectable = function(node, canReturnMe){
         if(!node){
            console.error("getParentSelectable: node is null");
            return undefined;
         }
         if(node && node.selectable != null && canReturnMe){
            return node;
         }
         do{
            node = node.parentNode;
            if(!node || node == manager){
               return undefined;
            }
         }while(!node.selectable);
         return node;
      };
      var dfs = function(node){
         if(node.selectable){
            return node;
         }

         if(node.children){
            if(node.children.length == 0){
               return null;
            }
         }else{
            return null;
         }
         for(var i in node.children){
            if(node.selectable){
               return node;
            }
            var x = dfs(node.children[i]);
            if(x){
               return x;
            }
         }
      };
      var getFirstChildSelectable = function(node){
         if(!node){
            console.error("getFirstChildSelectable: node is null");
            return undefined;
         }
         for(var i in node.children){
            var x = dfs(node.children[i]);
            if(x){
               return x;
            }
         }
      };
      var getPreviousSelectable = function(node){
         if(!node){
            console.error("getPreviousSelectable: node is null");
            return undefined;
         }

         while(node.previousElementSibling){
            if(node.previousElementSibling.selectable == null){
               node = node.previousElementSibling;
               continue;
            }
            return node.previousElementSibling;
         }
         console.log("getPreviousSelectable: no previous selectable");
         return undefined;
      };
      var getNextSelectable = function(node){
         if(!node){
            console.error("getNextSelectable: node is null");
            return undefined;
         }
         while(node.nextElementSibling){
            if(node.nextElementSibling.selectable == null){
               node = node.nextElementSibling;
               continue;
            }
            return node.nextElementSibling;
         }
         console.log("getNextSelectable: no next selectable");
         return undefined;
      };

      var assignSelection = function(o){
         if(manager.selectedObject){
            deselect();
         }
         var t = o.getBoundingClientRect();
         manager.selectedObjectRect = t;
         selectionMask.style.display = "none";
         selectionMask.style.top = (t.top + window.scrollY - manager.config.offsetY) + "px";
         selectionMask.style.left = (t.left + window.scrollX - manager.config.offsetX) + "px";
         selectionMask.style.display = "block";
         selectionMask.style.width = t.width + "px";
         selectionMask.style.height = t.height + "px";

         manager.selectedObject = o;
         // Android.setSelectedHTML(o.htmlText);
         // TODO: add this to enable showing properties
         //if(showProperty != undefined){
         //   showProperty(o);
         //}

      };
      var deselect = function(){
         editor.propertyPanelHide();
         manager.selectedObject = undefined;
         selectionMask.style.display = "none";
         Android.deselect();
      };
      var select = function(x, y, t){
         if(!t){
            console.warn("Click: can't get object " + x + "," + y);
            deselect();
            return;
         }
         if(t == selectionMask)return;
         t = getParentSelectable(t, true);
         if(t){
            assignSelection(t);
            editor.showProperty(t);
            renderSelectedObject(manager.selectedObject);
         }else{
            deselect();
         }
      };
      var swipeDown = function(){
         if(!manager.selectedObject)return;
         var g = getFirstChildSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeUp = function(){
         if(!manager.selectedObject)return;
         var g = getParentSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeLeft = function(){
         if(!manager.selectedObject)return;
         var g = getPreviousSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var swipeRight = function(){
         if(!manager.selectedObject)return;
         var g = getNextSelectable(manager.selectedObject);
         if(g)assignSelection(g);
      };
      var createDummy = function(){
         var c = document.createElement("hr");
         c.className = "dummy";
         c.dummy = true;
         return c;
      };
      var renderSelectedObject = function(obj){
         html2canvas(obj, {
            onrendered: function(canvas){
               var h = obj.getBoundingClientRect().height;
               var w = obj.getBoundingClientRect().width;
               var myCanvas = document.createElement('canvas');
               var data = canvas.toDataURL();
               var ctx = myCanvas.getContext('2d');
               var img = new Image();
               img.onload = function(){
                  myCanvas.width = img.width;
                  myCanvas.height = img.height;
                  myCanvas.style.margin = 0;
                  myCanvas.style.padding = 0;
                  ctx.drawImage(img, 0, 0, w, h);
                  data = myCanvas.toDataURL();
                  Android.setRenderedShadowDataURL(data, w, h);
               };

               if(manager.selectedObject.tagName == "IMG"){
                  // TODO
                  img.src = obj.src.substring(26);
                  //console.log("src = " + img.src);
               }
               else
                  img.src = data;
            }
         });

      };
      return {
         selectionMask       : selectionMask,
         onSingleTap         : select,
         onDoubleTap         : deselect,
         assignSelection     : assignSelection,
         on2FingerMoveDown   : swipeDown,
         on2FingerMoveLeft   : swipeLeft,
         on2FingerMoveUp     : swipeUp,
         on2FingerMoveRight  : swipeRight,
         renderSelectedObject: renderSelectedObject,
         getParentSelectable : getParentSelectable,
         createDummy         : createDummy
      }
   })
   ();
   manager.selectedObjectRect = undefined;
   manager.selectedObject = undefined;
   manager.selectionMask = initObj.selectionMask;
   manager.getParentSelectable = initObj.getParentSelectable;
   manager.assignSelection = initObj.assignSelection;
   manager.renderSelectedObject = initObj.renderSelectedObject;
   manager.createDummy = initObj.createDummy;
   manager.config.onSingleTap = initObj.onSingleTap;
   manager.config.onDoubleTap = initObj.onDoubleTap;
   manager.config.on2FingerMoveDown = initObj.on2FingerMoveDown;
   manager.config.on2FingerMoveUp = initObj.on2FingerMoveUp;
   manager.config.on2FingerMoveLeft = initObj.on2FingerMoveLeft;
   manager.config.on2FingerMoveRight = initObj.on2FingerMoveRight;
}
;

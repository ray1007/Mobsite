// gestureListener
var Android = (Android) ? Android : {
   startDrag      : function(){
   },
   setSelectedHTML: function(s){
   },
   hideSplashView : function(){
   }
};
function setGestureListener(responses){


   console.log("gestureListener starts");

   /******************
    * Configurations *
    ******************/
   var isConsoleEnable = true;
   var myListener = responses.listener;

   /******************
    * Implementation *
    ******************/

   // Flags
   var touch_longPress = false;
   var touch_doubleTap = false;
   var touch_still = false;
   var touch_2Finger = false;
   var touch_2FingerMoved = false;
   var touch_quickDown = false;
   var touch_up = false;
   var touch_x, touch_y, touch_x2, touch_y2;
   var touch_2fingerUpCount = 0,
      touch_2fingerDownCount = 0,
      touch_2fingerLeftCount = 0,
      touch_2fingerRightCount = 0;
   var touch_pinch = false;
   var touch_pinchCount = 0;
   var touchTarget;

   var onTouchStart = function(event){
      if(touch_longPress){
         return;
      }
      if(event.touches.length > 2)
         return;
      touchTarget = event.target;
      if(touch_quickDown){
         touch_doubleTap = true;
         responses.onDoubleTap(event.touches.item(0).clientX, event.touches.item(0).clientY, touchTarget);
         //myLog("double tap.");
      }else{
         // modify gesture flags.
         touch_2Finger = false;
         if(event.touches.length == 2){
            touch_2Finger = true;
            touch_x2 = event.touches.item(1).clientX;
            touch_y2 = event.touches.item(1).clientY;
         }
         touch_quickDown = false;
         touch_still = true;
         touch_doubleTap = false;
         touch_up = false;
         touch_2FingerMoved = false;

         setTimeout(longPressChecker, responses.longPressThreshold);
      }
      // update new position.
      touch_x = event.touches.item(0).clientX;
      touch_y = event.touches.item(0).clientY;
   };

   var onTouchMove = function(event){
      if(event.touches.length > 2)
         return;
      touchTarget = event.target;
      touch_still = false;
      var touch = event.touches.item(0);

      if(touch_longPress){
         event.preventDefault();
         responses.onLongPressMove(event.touches.item(0).clientX, event.touches.item(0).clientY, touchTarget);
         ////myLog("onLongPressMove")
      }else{
         // handles "2 finger scroll"
         if(touch_2Finger && !touch_2FingerMoved){
            event.preventDefault();
            var secondTouch = event.touches.item(1);
            if(secondTouch == null)
               return;

            var delta_x1 = touch.clientX - touch_x;
            var delta_y1 = touch.clientY - touch_y;
            var delta_x2 = secondTouch.clientX - touch_x2;
            var delta_y2 = secondTouch.clientY - touch_y2;
            var innerProduct = delta_x1 * delta_x2 + delta_y1 * delta_y2;
            var distance1 = Math.sqrt(delta_x1 * delta_x1 + delta_y1 * delta_y1);
            var distance2 = Math.sqrt(delta_x2 * delta_x2 + delta_y2 * delta_y2);

            if(innerProduct == 0)
               return;

            //console.log("inner product = "+innerProduct);

            if(innerProduct > 50 && !touch_pinch){ // swipe
               //console.log("swipe");
               if(Math.abs(delta_x1) > Math.abs(delta_y1)){
                  if((delta_x1) > 0){
                     if(touch_2fingerUpCount > 0 || touch_2fingerDownCount > 0 || touch_2fingerLeftCount > 0)
                        myLog("change direction");
                     touch_2fingerRightCount++;
                     touch_2fingerUpCount = touch_2fingerDownCount = touch_2fingerLeftCount = 0;
                     if(touch_2fingerRightCount == responses.gestureCountThreshold){
                        myLog("2 finger right");
                        responses.on2FingerMoveRight();
                        touch_2FingerMoved = true;
                     }
                  }else{
                     if(touch_2fingerUpCount > 0 || touch_2fingerDownCount > 0 || touch_2fingerRightCount > 0)
                        myLog("change direction");
                     touch_2fingerLeftCount++;
                     touch_2fingerUpCount = touch_2fingerDownCount = touch_2fingerRightCount = 0;
                     if(touch_2fingerLeftCount == responses.gestureCountThreshold){
                        myLog("2 finger left");
                        responses.on2FingerMoveLeft();
                        touch_2FingerMoved = true;
                     }
                  }
               }else{
                  if((delta_y1) > 0){
                     if(touch_2fingerUpCount > 0 || touch_2fingerLeftCount > 0 || touch_2fingerRightCount > 0)
                        myLog("change direction");
                     touch_2fingerDownCount++;
                     touch_2fingerUpCount = touch_2fingerLeftCount = touch_2fingerRightCount = 0;
                     if(touch_2fingerDownCount == responses.gestureCountThreshold){
                        myLog("2 finger down");
                        responses.on2FingerMoveDown();
                        touch_2FingerMoved = true;
                     }
                  }else{
                     if(touch_2fingerDownCount > 0 || touch_2fingerLeftCount > 0 || touch_2fingerRightCount > 0)
                        myLog("change direction");
                     touch_2fingerUpCount++;
                     touch_2fingerDownCount = touch_2fingerLeftCount = touch_2fingerRightCount = 0;
                     if(touch_2fingerUpCount == responses.gestureCountThreshold){
                        myLog("2 finger up");
                        responses.on2FingerMoveUp();
                        touch_2FingerMoved = true;
                     }
                  }
               }
            }else if(innerProduct < -50){ // pinch
               touch_pinch = true;

               if(distance1 > distance2){
                  touch_pinchCount++;
                  if(touch_pinchCount == 3){
                     responses.onPinchIn();
                     touch_pinchCount = 0;
                  }
               }else{
                  touch_pinchCount++;
                  if(touch_pinchCount == 3){
                     responses.onPinchOut();
                     touch_pinchCount = 0;
                  }
               }
            }
         }
         // update new position.
         touch_x = event.touches.item(0).clientX;
         touch_y = event.touches.item(0).clientY;
      }
   };

   var onTouchEnd = function(event){
      touch_up = true;
      touch_pinch = false;
      touch_pinchCount = 0;
      if(event.touches.length == 0){
         if(touch_longPress){
            responses.onLongPressEnd();
            // resetAllVariable();
            return;
         }
      }

      if(!touch_2Finger && !touch_longPress){
         touch_quickDown = true;
         setTimeout(doubleTapChecker, responses.doubleTapThreshold);
      }
   };

   var longPressChecker = function(){
      if(touch_still && !touch_up && !touch_2Finger){
         touch_longPress = true;
         responses.onLongPressStart(touch_x, touch_y, touchTarget);
         //myLog("onLongPressStart");
      }
   };

   var doubleTapChecker = function(){
      touch_quickDown = false;
      if(!touch_doubleTap && touch_still){
         responses.onSingleTap(touch_x, touch_y, touchTarget);
         // resetAllVariable();
         //myLog("single tap.");
      }
   };

   var myLog = function(str){
      if(isConsoleEnable){
         console.log(str);
      }
   };

   var resetAllVariable = function(){
      touch_longPress = false;
      touch_doubleTap = false;
      touch_still = false;
      touch_2Finger = false;
      touch_2FingerMoved = false;
      touch_quickDown = false;
      touch_up = false;
      touch_x = 0;
      touch_y = 0;
      touch_x2 = 0;
      touch_y2 = 0;
      touch_2fingerUpCount = 0;
      touch_2fingerDownCount = 0;
      touch_2fingerLeftCount = 0;
      touch_2fingerRightCount = 0;
      touch_pinch = false;
      touch_pinchCount = 0;
      touchTarget = 0;
   };
   myListener.addEventListener('touchstart', onTouchStart, false);
   myListener.addEventListener('touchmove', onTouchMove, false);
   myListener.addEventListener('touchend', onTouchEnd, false);
}
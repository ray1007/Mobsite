var Android = (Android) ? Android : {
   startDrag               : function(){
   },
   setSelectedHTML         : function(s){
   },
   hideSplashView          : function(){
   },
   getProjectName          : function(){
   },
   getProjectPath          : function(){
   },
   openTextInputDialog     : function(){
   },
   openBrowserDialog       : function(){
   },
   openPhotoDialog         : function(){
   },
   setRenderedShadowDataURL: function(){
   },
   deselect                : function(){
   }
};
var editor = {};
editor.initProject = function(wid, hei){
   var initObj = (function(){
      var tool = false;
      var pos = false;
      var scwidth = wid;
      var scheight = hei;
      var controlpro;
      var header;
      var footer;
      var terheight;
      var ter = false;
      var proper;
      var addpanelshow = false;
      var onanimate = false;
      var settingshow = false;
      var controlpanelshow = false;
      var gallerypanelshow = false;
      var properpaneshow = false;
      var githubpanelshow = false;
      var isFullScreen = false;
      var galleryMember;
      var properTemp;
      var propertyPanel = document.getElementById("propertyPanel");
      var addPanel = document.getElementById("Add-panel");
      var f = $.farbtastic('#picker');
      f.linkTo($('#color'));
      //////////  Controls of Panels //////////////
      var AddPanelShow = function(){
         hidePanels(false);
         if(!onanimate){
            onanimate = true;
            $("#Add-panel").css("left", "2%");
            $("#Add-panel").transition({opacity: 1});
            $("#Add-panel").transition({x: 100}, function(){
               onanimate = false;
            });
            addpanelshow = !addpanelshow;
         }
      };
      var AddPanelHide = function(){
         console.log("AddHide");
         if(!onanimate){
            onanimate = true;
            $("#Add-panel").transition({opacity: 0});
            $("#Add-panel").transition({x: 0}, function(){
               onanimate = false;
               $("#Add-panel").css("left", "-25%");
            });
            addpanelshow = !addpanelshow;

         }
      };
      var propertyPanelShow = function(tar){
         if(!isPropertyShown)
            return;
         if(!onanimate){
            properTemp=manager.selectedObject;
            var rect = tar.getBoundingClientRect();
            $("#propertyPanel").css("opacity", "1");
            console.log("rect-top:" + rect.top);
          //  console.log("rect-bottom" + rect.bottom);
          //  console.log("rect-left" + rect.left);
          //  console.log("rect-right" + rect.right);
          //  console.log("screen-width" + scwidth);
          //  console.log("screen-height" + scheight);
            onanimate = true;
             
            var wid = $('#propertyPanel').width();
            var hei = $('#propertyPanel').height();
            if(rect.top <= 0.5 * scheight)
            {
               console.log("Top is: "+window.scrollY + rect.bottom);
               $("#propertyPanel").css("top", window.scrollY + rect.bottom);
            }
            else
            {
               console.log("Top is: "+window.scrollY + rect.top - hei);
               $('#propertyPanel').css("top", window.scrollY + rect.top - hei);
            }
            if(rect.left <= 0.5 * scwidth){
               if(rect.right + wid < scwidth)
                  $("#propertyPanel").css("left", rect.right);
               else
                  $("#propertyPanel").css("left", scwidth-wid);
            }
            else{
               if(rect.left - wid > 0)
                  $('#propertyPanel').css("left", rect.left - wid);
               else
                  $('#propertyPanel').css("left", 0);
            }
             console.log("Show Showed");
             console.log(window.scrollY + rect.bottom);
             $("#propertyPanel").css("top", window.scrollY + rect.bottom);
             properpaneshow = true;
             onanimate = false;
         }
      };
      var propertyPanelHide = function(){
         if(properTemp==manager.selectedObject){
             console.log("propertyHide");
             if(!onanimate && properpaneshow){
                 onanimate = true;
                 $("#propertyPanel").transition({opacity: 0},function(){
                     onanimate = false;
                     $("#propertyPanel").css("left", "-100%");
                     properpaneshow = false;    
                });
            
            }  
         }
      };
      var galleryPanelShow = function(){
         hidePanels(false);
         if(!onanimate){
            if(c.hasAttribute("style"))
               c.removeAttribute("style");
            onanimate = true;
            $("#galleryPanel").css("top", "10%");
            $("#galleria").transition({opacity: 1}, function(){
               $("#galleryPanel").transition({opacity: 1}, function(){
                  onanimate = false;
               });
            });
            gallerypanelshow = !gallerypanelshow;
         }
      };
      var galleryPanelHide = function(){
          console.log("galleryHide");
         if(!onanimate){
            onanimate = true;
            $("#galleryPanel").transition({opacity: 0}, function(){
               $("#galleryPanel").css("top", "-50%");
               onanimate = false;
               var c = document.getElementById("galleryPanel");
               c.style.display = "none";
            });
            gallerypanelshow = !gallerypanelshow;
         }
      };
      var SettingPanelShow = function(){
         hidePanels(false);
         if(!onanimate){
            onanimate = true;
            $("#setting-panel").css("top", "11%");
            $('#setting').transition({rotate: '180deg'});
            $("#setting-panel").transition({opacity: 1}, function(){
               onanimate = false;
            });
            settingshow = !settingshow;
         }
      };
      var SettingPanelHide = function(){
          console.log("settinghide");
         if(!onanimate){
            onanimate = true;
            $('#setting').transition({rotate: '0deg'});
            $("#setting-panel").transition({opacity: 0}, function(){
               $("#setting-panel").css("top", "-80%");
               onanimate = false;
            });
            settingshow = !settingshow;
         }
      };
      var githubPanelShow = function(){

         if(!onanimate){
            onanimate = true;
            githubpanelshow = true;
            ShadowCover();
            $("#githubPanel").css("opacity", "0");
            $("#githubPanel").css("left", "15%");
            setTimeout("$('#githubPanel').transition({opacity: 1 });", 500);
            onanimate = false;
         }
      };
      var githubPanelHide = function(){
          console.log("githubhide");
         $('#githubPanel').transition({opacity: 0});
         setTimeout("$('#githubPanel').css('left','-1000%');", 500);
         githubpanelshow = false;
         ShadowFade();
      };

      var hidePanels = function(prop){
         if(!prop) {
            if(properpaneshow) propertyPanelHide();
            console.log("try to hide proper");
         }
         if(addpanelshow) AddPanelHide();
         if(settingshow) SettingPanelHide();
         if(githubpanelshow) githubPanelHide();
         if(gallerypanelshow) galleryPanelHide();
      };
      var showProperty = function(tar){
         //hidePanels();
         //if(properpaneshow)
         // propertyPanelHide();
         var computedStyle = getComputedStyle(tar);
         var propertypanel = document.getElementById("scroller");

         //$("#propertyPanel").css("left","0");
         var c = document.getElementById("properTable");
         c.style.display = "none";
         document.getElementById("properCategory").innerHTML = tar.tagName;
         if(tar.tagName == "IMG"){
            document.getElementById("properSource").innerHTML = tar.src.replace(/^.*[\\\/]/, '');
            document.getElementById("properText").innerHTML = "";
            for(var gg = 0; gg < propertypanel.children.length; gg++){
               console.log(propertypanel.children[gg].lastChild.id + " is " + propertypanel.children[gg].className);
               if(propertypanel.children[gg].className != "pImg" && propertypanel.children[gg].className != "pAll")
                  propertypanel.children[gg].style.display = "none";
               else
                  propertypanel.children[gg].style.display = "table";

            }
         }
         if(tar.tagName == "DIV"){
                     document.getElementById("properText").innerHTML = "";
                     for(var gg = 0; gg < propertypanel.children.length; gg++){
                        console.log(propertypanel.children[gg].lastChild.id + " is " + propertypanel.children[gg].className);
                        if(propertypanel.children[gg].className != "pAll")
                           propertypanel.children[gg].style.display = "none";
                        else
                           propertypanel.children[gg].style.display = "table";

                     }
         }
         if(tar.tagName == "P" || tar.tagName[0] == "H"){
            document.getElementById("properText").innerHTML = tar.innerHTML;
            document.getElementById("properSource").innerHTML = "";
            for(var gg = 0; gg < propertypanel.children.length; gg++){
               console.log(propertypanel.children[gg].lastChild.id + " is " + propertypanel.children[gg].className);
               if(propertypanel.children[gg].className != "pText" && propertypanel.children[gg].className != "pAll")
                  propertypanel.children[gg].style.display = "none";
               else
                  propertypanel.children[gg].style.display = "table";
            }
         }
         document.getElementById('properSize').innerHTML = computedStyle.fontSize;
         document.getElementById('properFont').innerHTML = computedStyle.fontFamily;
         document.getElementById('textAlign').value = computedStyle.textAlign;
         document.getElementById("properHeight").innerHTML = computedStyle.height;
         document.getElementById("properWidth").innerHTML = computedStyle.width;
         document.getElementById("properColor").innerHTML = computedStyle.color;
         document.getElementById("properBackgroundColor").innerHTML = computedStyle.backgroundColor;
         //    document.getElementById("rangevalue").value=computedStyle.opacity;
         document.getElementById("opacitySlider").value = computedStyle.opacity * 100;

         document.getElementById("properMargin").innerHTML = "(" + computedStyle.marginTop + ',' + computedStyle.marginBottom + ',' + computedStyle.marginLeft + ',' + computedStyle.marginRight + ')';
         if(c.hasAttribute("style"))
            c.removeAttribute("style");
          console.log("Show Called");
         propertyPanelShow(tar);
      };
      var galleryPanelToggle = function(){
         if(!gallerypanelshow)
            galleryPanelShow();
         else
            galleryPanelHide();
      };
      var galleryInitialize = function(member){
         var gallery = $(galleria);
         var memObj = JSON.parse(member);
         for(var i = 0; i < memObj.length; i++){
            gallery.append("<a href=" + memObj[i].path + "><img src='" + memObj[i].path + "',data-big='" + memObj[i].path + "' data-title='Biandintz eta zaldiak' data-description='Horses on Bianditz mountain, in Navarre, Spain.'></a>");
         }
      };
      var AddPanelToggle = function(){
         if(!addpanelshow)AddPanelShow();else AddPanelHide();
      };
      var SettingPanelToggle = function(){
         if(!settingshow)SettingPanelShow();else SettingPanelHide();
      };
      var ShadowCover = function(){
         $("#shadow").transition({x: scwidth});
      };
      var ShadowFade = function(){
         if(!onanimate){

            if(githubpanelshow)
               githubPanelHide();
            setTimeout("$('#shadow').transition({ x:0});onanimate=false;", 500);
         }
      };
      var FullScreenPreview = function(){
         isFullScreen = true;
         ShadowCover();
         var x = document.getElementById("preview-panel");
         x.innerHTML = document.getElementById("innercontent").innerHTML;
         $('#preview-panel').first().load('index.html');
         $('#preview-panel').css('top', '0');
         setTimeout("$('#preview-panel').transition({ opacity: 1 });", 500);
         setTimeout("$('#innercontent').css('top','0'); ", 800);
         $('#preview-control').transition({y: scheight / 10});
      };
      var FullScreenCancel = function(){
         $("#innercontent").css("top", "20%");
         $("#preview-control").transition({y: 0});
         $("#preview-panel").transition({opacity: 0}, function(){
            $("#preview-panel").css("top", "-100%");
            $("#preview-panel").css("height", "auto");
            $("#preview-panel").empty();
         });
         ShadowFade();
         isFullScreen = false;
      };
      var deselect = function(){
         manager.deselect();
      };
      var isPropertyShown = true;
      var EnvironmentInit = function(){
         $("#addbtn").on("touchstart ", function(startEvent){
            AddPanelToggle();
         });
         $("#editbtn").on("touchstart ", function(startEvent){
            isPropertyShown = !isPropertyShown;

         });
         $("#dissbtn").on("touchstart ", function(startEvent){
            propertyPanelHide();
         });
         $("#copybtn").on("touchstart ", function(startEvent){
            console.log("my beautiful func at "+window.location.pathname);
             document.getElementById("slide2").children[0].children[0].src = "./image/img1.jpg";
         });
         $("#test").on("touchstart ", function(startEvent){
            ShadowCover();
         });
         $("#shadow").on("touchstart ", function(startEvent){
            ShadowFade();
         });
         $("#fullscreen").on("touchstart ", function(startEvent){
            FullScreenPreview();
         });
         $("#setting").on("touchstart ", function(startEvent){
            SettingPanelToggle();
         });
         $("#github").on("touchstart ", function(startEvent){
            githubPanelShow();
         });
         $("#gallery").on("touchstart ", function(startEvent){
            galleryPanelToggle();
         });
         $("#redo").on("touchstart ", function(startEvent){
            manager.redoAction();
         });
         $("#delebtn").on("touchstart ", function(startEvent){
            manager.action.deleteElement(manager.selectedObject)
         });
         $("#properSource").on("touchstart ", function(startEvent){
            Android.openPhotoDialog()
         });
         $("#properText").on("touchstart ", function(startEvent){
            Android.openTextInputDialog(manager.selectedObject.innerHTML);
         });
         $("#properLink").on("touchstart ", function(startEvent){
            Android.openBrowserDialog();
         })
         $("#preview-control").on("touchstart ", function(startEvent){
            FullScreenCancel();
         });
         $("#properTextAlign").on("touchstart ", function(startEvent){
         });
         $("#undoBtn").on("touchstart ", function(startEvent){
            console.log("editor : call undo");
            manager.undoAction();
         });
         $("#redoBtn").on("touchstart ", function(startEvent){
            console.log("editor : call redo");
            manager.redoAction();
         });
         document.getElementById('opacitySlider').onchange = function(){
            document.getElementById('rangevalue').value = document.getElementById('opacitySlider').value / 100;
            console.log('opacity changed ' + rangevalue.value);
            var setact =
            {
               style : "setting",
               target: manager.selectedObject,
               attr  : "opacity",
               orig  : getComputedStyle(manager.selectedObject, null).opacity,
               value : document.getElementById('rangevalue').value
            };
            manager.action.setProperty(setact.target, setact.attr, setact.orig, setact.value);
            //manager.action.setProperty(setact.target, setact.attr, setact.orig, setact.value);
         };
         $("#properBackgroundColor").on("touchstart ", function(startEvent){
            colorSelector(getComputedStyle(manager.selectedObject, null).backgroundColor);
            f.type = 1;
            f.linkTo(manager.selectedObject);
            f.oldcolor = getComputedStyle(manager.selectedObject, null).backgroundColor;
            manager.selectionMask.className = ("maskOnProperty");
            // alert(f.oldcolor);
         });
         $("#properColor").on("touchstart ", function(startEvent){
            colorSelector(getComputedStyle(manager.selectedObject, null).color);
            f.linkTo(manager.selectedObject.color);
            f.type = 2;
            f.linkTo(manager.selectedObject);
            f.oldcolor = getComputedStyle(manager.selectedObject, null).color;
            manager.selectionMask.className = ("maskOnProperty");
         });
         $("#colorCheck").on("touchstart", function(startEvent){

            if(f.type == 1)manager.selectedObject.style.backgroundColor = f.oldcolor;
            else manager.selectedObject.style.color = f.oldcolor;
            var setact =
            {
               style : "setting",
               target: manager.selectedObject,
               attr  : "background-color",
               orig  : getComputedStyle(manager.selectedObject, null).backgroundColor,
               value : f.color
            };
            //alert(f.color);
            f.linkTo($('#color'));
            if(f.type == 2) setact.attr = "color";
            manager.action.setProperty(setact.target, setact.attr, setact.orig, setact.value);

            //manager.pushAction(setact);
            colorSelectorHide();
            manager.selectionMask.className = ("selectionMask");
         });
         $('#colorCancel').on("touchstart", function(startEvent){

            if(f.type == 1)manager.selectedObject.style.backgroundColor = f.oldcolor;
            if(f.typp == 2)manager.selectedObject.style.color = f.oldcolor;
            colorSelectorHide();
            manager.selectionMask.className = ("selectionMask");
            f.linkTo($('#color'));
         });
         $("#propertyPanel").on("touchmove", function(startEvent){
            startEvent.preventDefault();
         });
         $(document.body).on('click', '.dropdown-menu li', function(event){

            var $target = $(event.currentTarget);

            $target.closest('.btn-group')
               .find('[data-bind="label"]').text($target.text())
               .end()
               .children('.dropdown-toggle').dropdown('toggle');

            return false;

         });
      }
      var colorSelector = function(col){
         if(!onanimate){
            onanimate = true;
            $("#previouscolor").css("background-color", col.innerHTML);
             console.log(propertyPanel);
            $("#colorPickerPanel").css("left", propertyPanel.style.left);
            $("#colorPickerPanel").css("top", propertyPanel.style.top);
            $("#colorPickerPanel").transition({opacity: 1}, function(){
               onanimate = false;
            });
         }
      }
      var colorSelectorHide = function(){
         if(!onanimate){
            onanimate = true;
            $("#colorPickerPanel").transition({opacity: 1}, function(){
               onanimate = false;
               $("#colorPickerPanel").css("left", "-100%");
            });


         }
      }
      var undo = function(){
      }
      var sleep = function(milliseconds){
         var start = new Date().getTime();
         for(var i = 0; i < 1e7; i++){
            if((new Date().getTime() - start) > milliseconds){
               break;
            }
         }
      };
      var postLoadProject = function(){
         manager.init();
         setAddPanelDragLister();
         Android.hideSplashView();
      };
      var addPanel_touchLongPress = false,
         addPanel_touchStill = false,
         addPanel_touchTarget,
         addPanel_touchX, addPanel_touchY;
      var setAddPanelDragLister = function(){
         var panel = document.getElementById("Addmenu");
         panel.addEventListener('touchstart', onTouchStart, false);
         panel.addEventListener('touchmove', onTouchMove, false);
         panel.addEventListener('touchend', onTouchEnd, false);
         function onTouchStart(){
            if(addPanel_touchLongPress)return;
            if(event.touches.length > 1)return;
            addPanel_touchStill = true;
            addPanel_touchTarget = event.target;
            setTimeout(longPressChecker, 600);
            addPanel_touchX = event.touches.item(0).clientX;
            addPanel_touchY = event.touches.item(0).clientY;
         }

         function onTouchMove(){
            if(event.touches.length > 1)return;
            addPanel_touchStill = false;
            var touch = event.touches.item(0);
            if(addPanel_touchLongPress){
               var x = event.touches.item(0).clientX;
               var y = event.touches.item(0).clientY;
               manager.config.onLongPressMove(x, y);
               event.preventDefault();
            }
            // update new position.
            addPanel_touchX = event.touches.item(0).clientX;
            addPanel_touchY = event.touches.item(0).clientY;
         }

         function onTouchEnd(){
            if(addPanel_touchLongPress){
               addPanel_touchLongPress = false;
               manager.config.onLongPressEnd();
               return;
            }
         }

         var longPressChecker = function(){
            if(addPanel_touchStill){
               addPanel_touchLongPress = true;
               console.log("Add panel : event " + addPanel_touchTarget.id);
               var index = addPanel_touchTarget.id;
               console.log("Add panel : long press start at " + index + ".");
               AddPanelHide();
               manager.config.onLongPressStart(addPanel_touchX, addPanel_touchY, createElement(index), true);
            }
         };
      }
      var createElement = function(index){
         var object;
         switch(index){
            case "Title":
               object = document.createElement("H1");
               object.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
               break;
            case "Text":
               object = document.createElement("p");
               object.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
               break;
            case "Container1":
               object = document.createElement("div");
               object.className = "row";
               col = document.createElement("div");
               col.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
               col.appendChild(manager.createPlaceholder());
               object.appendChild(col);
               break;
            case "Container2":
               object = document.createElement("div");
               object.className = "row";
               for(var i = 0; i < 2; i++){
                  col = document.createElement("div");
                  col.className = "col-xs-6 col-sm-6 col-md-6 col-lg-6";
                  col.appendChild(manager.createPlaceholder());
                  object.appendChild(col);
               }
               break;
            case "Container3":
               object = document.createElement("div");
               object.className = "row";
               for(var i = 0; i < 3; i++){
                  col = document.createElement("div");
                  col.className = "col-xs-4 col-sm-4 col-md-4 col-lg-4";
                  col.appendChild(manager.createPlaceholder());
                  object.appendChild(col);
               }
               break;
            case "Container4":
               object = document.createElement("div");
               object.className = "row";
               for(var i = 0; i < 4; i++){
                  col = document.createElement("div");
                  col.className = "col-xs-3 col-sm-3 col-md-3 col-lg-3";
                  col.appendChild(manager.createPlaceholder());
                  object.appendChild(col);
               }
               break;
            case "Container6":
               object = document.createElement("div");
               object.className = "row";
               for(var i = 0; i < 6; i++){
                  col = document.createElement("div");
                  col.className = "col-xs-2 col-sm-2 col-md-2 col-lg-2";
                  col.appendChild(manager.createPlaceholder());
                  object.appendChild(col);
               }
               break;
            case "HyperLink":
               object = document.createElement("a");
               object.src = "#";
               break;
            case "Picture":
               object = document.createElement("img");
               object.src = "tool/img/default.png";
               object.style.width = "100%";
               break;
         }
         object.selectable = true;
         return object;
      }
      var setContent = function(){
         if(!manager.selectedObject){
            console.log("selected obj null");
            return;
         }
         console.log(manager.selectedObject.tagName);
         switch(manager.selectedObject.tagName){
            case "IMG":
               Android.openPhotoDialog();
               break;
            case "P":
            case "H1":
            case "H2":
            case "H3":
            case "H4":
            case "H5":
            case "H6":
               Android.openTextInputDialog();
               break;
            default:
               Android.openBrowserDialog();
               break;
         }
      }
      var textAlignChange = function(){
         var setact =
         {
            style : "setting",
            target: manager.selectedObject,
            attr  : "text-align",
            orig  : getComputedStyle(manager.selectedObject, null).textAlign,
            value : document.getElementById('textAlign').value
         };
         manager.action.setProperty(setact.target, setact.attr, setact.orig, setact.value);
         //  alert(getComputedStyle(manager.selectedObject,null).textAlign);
         // alert(document.getElementById('textAlign').value);
      }
      console.log("helloworld!!!:D");

      EnvironmentInit();

      document.getElementById("projecttitle").innerHTML = Android.getProjectName();
      console.log(Android.getProjectPath());
      $("#innercontent").first().load("index.html", postLoadProject);
      return {
         shadowFade            : ShadowFade,
         shadowCover           : ShadowCover,
         setAddPanelDragListner: setAddPanelDragLister,
         showProperty          : showProperty,
         textAlignChange       : textAlignChange,
         propertyPanelHide     : propertyPanelHide,
         githubPanelHide       : githubPanelHide
      }
   })();
   editor.githubPanelHide = initObj.githubPanelHide;
   editor.propertyPanelHide = initObj.propertyPanelHide;
   editor.textAlignChange = initObj.textAlignChange;
   editor.showProperty = initObj.showProperty;
   editor.shadowFade = initObj.shadowFade;
   editor.setAddPanelDragListner = initObj.setAddPanelDragListner;
}
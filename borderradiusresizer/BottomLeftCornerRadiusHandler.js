/**
 * @author Swagatam Mitra
  
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document, console, brackets, $, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var startOffset = null;
    var hRadii,vRadii;
    var changeAll = false;
    
    var lastSelectedRuleset = null;
    
    $(document).on("ruleset-wrapper.created","#html-design-editor",function(event,rulesetref){
       lastSelectedRuleset = rulesetref;
        _synchWithDOM();
    });
    
    function _synchWithDOM(){
        var radius = lastSelectedRuleset.css("border-bottom-left-radius");
        if(radius){
            var radArray = radius.split(" ");
            if(radArray.length === 1){
                hRadii = vRadii = parseInt(radArray[0]); 
            } else {
                hRadii = parseInt(radArray[0]);
                vRadii = parseInt(radArray[1]); 
            }
        } else {
            hRadii = vRadii = 0;
        }
        
        $("#border-outline").css("border-bottom-left-radius",''+hRadii+'px '+vRadii+'px');
        $(".bottomLeftRadiusXAxis").css('width',80+hRadii);
        $(".bottomLeftRadiusYAxis").css('height',80+vRadii);
        $("#border-bottom-left-control")
                    .css('left',(hRadii - 3))
                    .css('top','calc(100% - '+(vRadii+2)+'px)');
    }
    
    $(document).on("mousedown","#border-bottom-left-control",function(event){
        startOffset = {x:event.clientX,y:event.clientY};
        $("#element-resize-plane").show();
        if(event.shiftKey === true){
            changeAll = true;
            $(".borderRadius").removeClass("activeBorderRadius");
            $("#border-radius-all").addClass("activeBorderRadius");
        } else {
            $(".borderRadius").removeClass("activeBorderRadius");
            $("#border-radius-bottom-left").addClass("activeBorderRadius");
            changeAll = false;
        }
        event.stopPropagation();
    });
    
    $(document).on("mousemove","#element-resize-plane",function(event){
        if(startOffset){
            
            var xMov = event.clientX - startOffset.x;
            var yMov = event.clientY - startOffset.y;
            
            if(hRadii + xMov >= 0){
                hRadii = hRadii + xMov;
            }
            
            if(vRadii - yMov >= 0){
                vRadii = vRadii - yMov;
            }
            
            if(changeAll === true){
                lastSelectedRuleset.css("border-radius",''+hRadii+'px '+vRadii+'px');
                $("#html-design-editor").trigger("border-radius-changed");
            }else{
                lastSelectedRuleset.css("border-bottom-left-radius",''+hRadii+'px '+vRadii+'px');
            }
            $("#border-radius").val(''+hRadii+'px '+vRadii+'px')
            _synchWithDOM();
            startOffset = {x:event.clientX,y:event.clientY};
            event.stopPropagation();
        }
    });
        
    $(document).on("mouseleave mouseout mouseup ","#element-resize-plane",function(event){
        if(startOffset){
            startOffset = null;
            $("#element-resize-plane").hide();
            //lastSelectedRuleset.css("border-radius",$("#border-outline").css("border-radius"));
            lastSelectedRuleset.persist();
            event.stopPropagation();
        }
    });
    
    $(document).on("border-radius-changed border-bottom-left-radius-changed","#html-design-editor", function(event){
        _synchWithDOM();
     });
        
});
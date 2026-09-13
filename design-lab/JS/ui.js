/* =========================================================
   ui.js
   DOM参照・フレーム切替
========================================================= */

const UI = {
    framePreview:document.getElementById("framePreview"),
    frameCode:document.getElementById("frameCode"),
    frameName:document.getElementById("frameName"),
    editor:document.getElementById("editor"),
    frameButtons:document.querySelectorAll(".frame-option")
};

function bindFrameControls(){
    UI.frameButtons.forEach(function(button){
        button.addEventListener("click",function(){
            const frameId = button.dataset.frame;

            if(!FRAME_REGISTRY[frameId]){
                return;
            }

            STATE.frame.selected = frameId;

            UI.frameButtons.forEach(function(option){
                const isActive = option === button;

                option.classList.toggle("active",isActive);
                option.setAttribute("aria-pressed",String(isActive));
            });

            renderFramePreview();
        });
    });
}

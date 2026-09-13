/* =========================================================
   preview.js
   フレーム・寸法表描画
========================================================= */
function toPercent(value,total){return `${(value/total)*100}%`;}
function createSlotElement(slot){const element=document.createElement("div");element.className="frame-slot";element.dataset.slot=slot.id;element.setAttribute("aria-label",slot.label);element.style.left=toPercent(slot.x,CONFIG.previewWidth);element.style.top=toPercent(slot.y,CONFIG.previewHeight);element.style.width=toPercent(slot.width,CONFIG.previewWidth);element.style.height=toPercent(slot.height,CONFIG.previewHeight);return element;}
function createDimensionRows(frame){return frame.slots.map(function(slot){const opening=frame.getOpening(slot);return `<tr><td title="${slot.label}">${slot.shortLabel}</td><td>${slot.x}, ${slot.y}</td><td>${slot.width} × ${slot.height}</td><td>${opening.width} × ${opening.height}</td></tr>`;}).join("");}

function renderLayerControls(frame){
    if(!frame.layerModel){return "";}
    return `<section class="layer-controls" aria-labelledby="layer-heading">
        <h3 id="layer-heading">2.5 Layer View</h3>
        <div class="layer-control-grid">
            <label><input type="checkbox" id="layerFrame" ${frame.layerModel.frame?"checked":""}> FRAME / 骨格</label>
            <label><input type="checkbox" id="layerParts" ${frame.layerModel.parts?"checked":""}> PARTS / 機能部品</label>
            <label><input type="checkbox" id="layerShell" ${frame.layerModel.shell?"checked":""}> SHELL / 外装</label>
        </div>
        <div class="layer-presets">
            <button type="button" data-layer-preset="frame-only">骨格のみ</button>
            <button type="button" data-layer-preset="parts-only">パーツのみ</button>
            <button type="button" data-layer-preset="shell-only">外装のみ</button>
            <button type="button" data-layer-preset="frame-parts">骨格＋パーツ</button>
            <button type="button" data-layer-preset="complete">完成状態</button>
        </div>
    </section>`;
}

function renderLightingControls(frame){
    if(!frame.lighting){return "";}
    return `<section class="lighting-controls" aria-labelledby="lighting-heading">
        <h3 id="lighting-heading">Frame Lighting</h3>
        <label><span>発光色</span><input type="color" id="frameLedMain" value="${frame.lighting.mainColor}" aria-label="発光色"></label>
        <label><span>パターン色</span><input type="color" id="frameLedPattern" value="${frame.lighting.patternColor}" aria-label="パターン色"></label>
        <button type="button" id="frameLedToggle">${frame.lighting.enabled?"発光 OFF":"発光 ON"}</button>
    </section>`;
}

function renderCustomControls(frame){
    return typeof frame.customControls==="function"?frame.customControls():"";
}

function redrawFrameShell(frame){
    const shell=UI.framePreview.querySelector(".frame-shell-layer");
    if(shell){shell.innerHTML=frame.buildSvg();}
}

function bindLayerControls(frame){
    if(!frame.layerModel){return;}
    const frameInput=document.getElementById("layerFrame");
    const partsInput=document.getElementById("layerParts");
    const shellInput=document.getElementById("layerShell");

    function sync(){
        frame.layerModel.frame=frameInput.checked;
        frame.layerModel.parts=partsInput.checked;
        frame.layerModel.shell=shellInput.checked;
        redrawFrameShell(frame);
    }

    function setLayers(showFrame,showParts,showShell){
        frameInput.checked=showFrame;
        partsInput.checked=showParts;
        shellInput.checked=showShell;
        sync();
    }

    [frameInput,partsInput,shellInput].forEach(input=>input.addEventListener("change",sync));

    document.querySelectorAll("[data-layer-preset]").forEach(button=>{
        button.addEventListener("click",function(){
            switch(button.dataset.layerPreset){
                case "frame-only":setLayers(true,false,false);break;
                case "parts-only":setLayers(false,true,false);break;
                case "shell-only":setLayers(false,false,true);break;
                case "frame-parts":setLayers(true,true,false);break;
                default:setLayers(true,true,true);
            }
        });
    });
}

function bindLightingControls(frame){
    if(!frame.lighting){return;}
    const main=document.getElementById("frameLedMain"),pattern=document.getElementById("frameLedPattern"),toggle=document.getElementById("frameLedToggle");
    main.addEventListener("input",function(){frame.lighting.mainColor=main.value;redrawFrameShell(frame);});
    pattern.addEventListener("input",function(){frame.lighting.patternColor=pattern.value;redrawFrameShell(frame);});
    toggle.addEventListener("click",function(){frame.lighting.enabled=!frame.lighting.enabled;toggle.textContent=frame.lighting.enabled?"発光 OFF":"発光 ON";redrawFrameShell(frame);});
}

function renderDimensionEditor(frame){
    UI.editor.innerHTML=`
        <h2>${frame.code} ${frame.name}</h2>
        <p class="frame-description">${frame.description}</p>
        ${renderLayerControls(frame)}
        ${renderLightingControls(frame)}
        ${renderCustomControls(frame)}
        <dl class="dimension-summary">
            <div><dt>基準キャンバス</dt><dd>${CONFIG.previewWidth} × ${CONFIG.previewHeight}</dd></div>
            <div><dt>フレーム重なり</dt><dd>各辺 5px</dd></div>
        </dl>
        <div class="dimension-table-wrap"><table class="dimension-table"><thead><tr><th>領域</th><th>X, Y</th><th>予約サイズ</th><th>実効開口</th></tr></thead><tbody>${createDimensionRows(frame)}</tbody></table></div>
        <p class="dimension-note">実効幅＝予約幅−左重なり−右重なり。<br>実効高さ＝予約高さ−上重なり−下重なり。</p>`;
    bindLayerControls(frame);
    bindLightingControls(frame);
    if(typeof frame.bindCustomControls==="function"){frame.bindCustomControls();}
}

function renderFramePreview(){
    const frame=FRAME_REGISTRY[STATE.frame.selected];
    if(!frame){UI.editor.textContent="フレームを読み込めませんでした。";return;}
    const slotLayer=document.createElement("div"),shellLayer=document.createElement("div");
    slotLayer.className="frame-slot-layer";
    shellLayer.className="frame-shell-layer";
    frame.slots.forEach(slot=>slotLayer.appendChild(createSlotElement(slot)));
    shellLayer.innerHTML=frame.buildSvg();
    UI.framePreview.className=`canvas-guide ${frame.id}-frame`;
    UI.framePreview.replaceChildren(slotLayer,shellLayer);
    UI.framePreview.setAttribute("aria-label",`${frame.code} ${frame.name}`);
    UI.frameCode.textContent=frame.code;
    UI.frameName.textContent=frame.name;
    renderDimensionEditor(frame);
}

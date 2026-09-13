/* =========================================================
   layer-adapter.js
   F2-F5をF6方式の2.5層検証へ拡張
   FRAME + PARTS + SHELL
========================================================= */
(function extendFramesToLayerModel(){
    const themes={
        f2:{main:"#ff2936",pattern:"#ffb0b5",label:"RED ARMOR"},
        f3:{main:"#ffd522",pattern:"#fff3a0",label:"GOLD JEWEL"},
        f4:{main:"#8e68ff",pattern:"#e9dcff",label:"ARCANA"},
        f5:{main:"#b447ef",pattern:"#f2c7ff",label:"DARK ARCANA"}
    };

    function esc(value){return String(value).replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

    Object.keys(themes).forEach(function(id){
        const frame=FRAME_REGISTRY[id];
        if(!frame){return;}
        const theme=themes[id];
        const originalBuild=frame.buildSvg;
        frame.layerModel={frame:true,parts:true,shell:true};
        frame.lighting={enabled:true,mainColor:theme.main,patternColor:theme.pattern};
        frame.description += " 2.5層検証対応：FRAME・PARTS・SHELLを独立表示可能。";

        frame.buildSvg=function(){
            const lm=frame.layerModel;
            const light=frame.lighting;
            const frameDisplay=lm.frame?"inline":"none";
            const partsDisplay=lm.parts?"inline":"none";
            const shellDisplay=lm.shell?"inline":"none";
            const ledOpacity=light.enabled?1:.06;
            const openings=frame.slots.map(s=>frame.getOpening(s));
            const mounts=openings.map((o,i)=>`<rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="3" fill="none" stroke="#68717a" stroke-width="2" stroke-dasharray="5 4"/><text x="${o.x+6}" y="${o.y+14}" fill="#8d98a3" font-size="8" font-family="sans-serif">M${i+1}</text>`).join("");
            const parts=frame.slots.map(function(s){
                const o=frame.getOpening(s);
                if(s.id==="reels"){
                    const gap=5,w=(o.width-gap*2)/3;
                    return `<g><rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="4" fill="#171b20" stroke="#707983" stroke-width="3"/>${[0,1,2].map(n=>`<rect x="${o.x+n*(w+gap)}" y="${o.y+5}" width="${w}" height="${o.height-10}" rx="3" fill="#eee" stroke="#666"/>`).join("")}</g>`;
                }
                if(s.id==="start-stop"){
                    const cy=o.y+o.height/2;
                    return `<g><rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="5" fill="#15191d" stroke="#68727c" stroke-width="2"/><circle cx="${o.x+o.width*.34}" cy="${cy}" r="${Math.min(13,o.height*.34)}" fill="#9e1823"/><circle cx="${o.x+o.width*.5}" cy="${cy}" r="${Math.min(13,o.height*.34)}" fill="#9e1823"/><circle cx="${o.x+o.width*.66}" cy="${cy}" r="${Math.min(13,o.height*.34)}" fill="#9e1823"/></g>`;
                }
                const title=s.id==="main-display"?"DISPLAY MODULE":s.id==="lower-panel"?"LOWER PANEL":s.label;
                return `<g><rect x="${o.x}" y="${o.y}" width="${o.width}" height="${o.height}" rx="4" fill="#10151a" stroke="#5f6973" stroke-width="2"/><text x="${o.x+o.width/2}" y="${o.y+o.height/2}" dominant-baseline="middle" text-anchor="middle" fill="#697887" font-size="${s.id==='main-display'?11:8}" font-family="sans-serif">${esc(title)}</text></g>`;
            }).join("");
            const ledYs=[58,112,166,220,274,328,382,436,490,544];
            const ledSources=ledYs.map((y,i)=>`<circle cx="31" cy="${y}" r="6" fill="${i%2?light.patternColor:light.mainColor}"/><circle cx="359" cy="${y}" r="6" fill="${i%2?light.mainColor:light.patternColor}"/>`).join("");
            const shellSvg=originalBuild();

            return `<svg class="frame-shell ${id}-layered-shell" viewBox="0 0 390 600" preserveAspectRatio="none" aria-hidden="true">
                <defs><filter id="${id}LayerGlow" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                <g style="display:${frameDisplay}">
                    <rect x="8" y="8" width="374" height="584" rx="10" fill="#090c0f" stroke="#69727b" stroke-width="3"/>
                    <path d="M 28 28 H 362 V 572 H 28 Z" fill="none" stroke="#343b42" stroke-width="12"/>
                    <path d="M 51 32 V 568 M 339 32 V 568" stroke="#626b74" stroke-width="5"/>
                    <g fill="#9aa2aa" stroke="#111"><circle cx="31" cy="33" r="5"/><circle cx="359" cy="33" r="5"/><circle cx="31" cy="567" r="5"/><circle cx="359" cy="567" r="5"/></g>
                    ${mounts}
                </g>
                <g style="display:${partsDisplay}">
                    ${parts}
                    <g opacity="${ledOpacity}" filter="url(#${id}LayerGlow)">${ledSources}</g>
                    <text x="195" y="18" text-anchor="middle" fill="${light.mainColor}" font-size="8" font-family="sans-serif">${theme.label} PARTS</text>
                </g>
                <g style="display:${shellDisplay}">${shellSvg}</g>
            </svg>`;
        };
    });
})();

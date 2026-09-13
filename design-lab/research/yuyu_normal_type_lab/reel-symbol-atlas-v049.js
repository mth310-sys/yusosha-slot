/* YUYU v0.4.9 — high-resolution SVG atlas + permanent Mesh2D symbols.
   One SVG atlas texture replaces six low-resolution runtime canvases.
   Motion/lock/audio core remains untouched. */
(()=>{
 const attach=()=>{
  if(!state?.scene||state.version!=='0.4.8'){requestAnimationFrame(attach);return}
  const sc=state.scene,errors=[];
  const telemetry={mode:'SVG_ATLAS_MESH2D_SYMBOLS',enabled:false,comparisonMode:false,atlas:'assets/symbol-atlas-v049.svg',atlasPixels:'768X128',atlasCells:6,textureCount:0,symbolMeshes:0,grid:'5X3',vertexCountPerSymbol:15,triangleCountPerSymbol:16,orderedIndices:true,curvedSymbols:true,legacyCanvasMeshesRetired:false,flipV:true,orientationFix:'SVG_GL_FLIPV_0491',loadMs:null,errors};
  const kinds=['seven','cherry','bell','replay','bar','leaf'];
  const kindIndex=Object.fromEntries(kinds.map((k,i)=>[k,i]));
  const atlasKey='yuyu_symbol_atlas_v049';

  const build=img=>{
   try{
    if(sc.textures.exists(atlasKey))sc.textures.remove(atlasKey);
    sc.textures.addImage(atlasKey,img);telemetry.textureCount=1;
    const cols=5,rows=3,base=[],idx=[],xs=[-27,-14,0,14,27],us=[0,.22,.5,.78,1],ys=[-20,0,20],vs=[0,.5,1];
    for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++)base.push(xs[cx],ys[ry],us[cx],vs[ry]);
    for(let ry=0;ry<rows-1;ry++)for(let cx=0;cx<cols-1;cx++){const a=ry*cols+cx,b=a+1,c=a+cols,d=c+1;idx.push(a,b,c,0,b,d,c,0)}

    sc.reels.forEach(r=>r.cells.forEach(c=>{
      try{c.symbolMesh?.destroy()}catch(e){}
      c.symbolMesh=null;c.symbolMeshKey='';
      const m=sc.add.mesh2d(r.x,88,atlasKey,[...base],[...idx],true).setDepth(11.25);
      m.buildOrderedIndices(2,true).setUseOrderedIndices(true);
      c.atlasMesh=m;c.atlasSymbol='';telemetry.symbolMeshes++;
    }));
    telemetry.legacyCanvasMeshesRetired=true;

    const priorPaint=sc.paint.bind(sc);
    const setUV=(m,ki)=>{
      const u0=ki/6,u1=(ki+1)/6;
      for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++){
        const vi=(ry*cols+cx)*4;
        m.vertices[vi+2]=u0+(u1-u0)*us[cx];m.vertices[vi+3]=vs[ry];
      }
    };
    sc.paint=(r)=>{
      priorPaint(r);
      const travel=Number.isFinite(r.travel)?r.travel:0,turns=Math.floor(travel/LOOP);
      r.cells.forEach((c,k)=>{
        const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2,y=88+local,sym=SYMBOLS[mod(k-turns*7+r.symbolShift,SYMBOLS.length)],m=c.atlasMesh;
        if(!m)return;
        const visible=y>=17&&y<=159,n=Math.min(1,Math.abs(y-88)/82),sy=1-.155*n*n,sx=1-.035*n*n;
        if(c.atlasSymbol!==sym.k){setUV(m,kindIndex[sym.k]??0);c.atlasSymbol=sym.k}
        m.setPosition(r.x,y-1).setVisible(visible).setAlpha((r.spinning?.965:1)*(1-.12*n)).setScale(1.18*sx,1.18*sy);
        c.icon?.setVisible(false);c.sub?.setVisible(false);
      });
    };
    sc.reels.forEach(r=>sc.paint(r));
    telemetry.enabled=true;
    state.version='0.4.9';state.fx.symbolSurface='SVG_ATLAS_MESH2D';state.fx.symbolAtlas='ONE_TEXTURE_768X128';state.fx.symbolMeshCount=telemetry.symbolMeshes;
    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{const x=prior();return {...x,version:'0.4.9',phaser:{...x.phaser,symbolSurface:'SVG_ATLAS_MESH2D',symbolAtlas:'ONE_TEXTURE_768X128',symbolMeshCount:telemetry.symbolMeshes},symbolAtlas:{...telemetry}}};
    log('SYMBOL_ATLAS','SVG_768X128');log('SYMBOL_ATLAS_TEXTURES','1');log('SYMBOL_ATLAS_MESHES',String(telemetry.symbolMeshes));log('SYMBOL_ATLAS_ORIENTATION','FLIPV_TRUE');log('SYMBOL_ATLAS_MODE','PERMANENT_2_5D');log('PATCH','SYMBOL_ATLAS_V0_4_9');
   }catch(e){errors.push(String(e?.message||e));log('SYMBOL_ATLAS_ERROR',String(e?.message||e));}
  };

  const started=performance.now(),img=new Image();
  img.decoding='async';
  img.onload=()=>{telemetry.loadMs=Math.round((performance.now()-started)*10)/10;build(img)};
  img.onerror=()=>{errors.push('SVG atlas load failed');log('SYMBOL_ATLAS_ERROR','LOAD_FAILED')};
  img.src='./assets/symbol-atlas-v049.svg?v=0491';
 };
 attach();
})();
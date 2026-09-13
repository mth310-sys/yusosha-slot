/* YUYU v0.5.0 — print-grade supersampled SVG symbol atlas.
   One 1536x256 vector atlas is rasterized once, shared by 21 Mesh2D symbol faces.
   Replaces v0.4.9 atlas meshes after load; reel motion/lock/audio core remains untouched. */
(()=>{
 const attach=()=>{
  if(!state?.scene||state.version!=='0.4.9'){requestAnimationFrame(attach);return}
  const sc=state.scene,errors=[];
  const telemetry={
   mode:'PRINT_GRADE_SVG_ATLAS_MESH2D',enabled:false,comparisonMode:false,
   atlas:'assets/symbol-atlas-v050.svg',atlasPixels:'1536X256',atlasCells:6,
   supersample:'4X_DISPLAY_SCALE_CLASS',textureCount:0,symbolMeshes:0,
   grid:'7X5',vertexCountPerSymbol:35,triangleCountPerSymbol:48,
   orderedIndices:true,curvedSymbols:true,legacyAtlasRetired:false,
   legacyRuntimeTexturesRetired:0,flipV:true,printTreatment:'MULTI_EDGE_HIGHLIGHT_SHADOW',
   estimatedGpuBytes:1536*256*4,loadMs:null,errors
  };
  const kinds=['seven','cherry','bell','replay','bar','leaf'];
  const kindIndex=Object.fromEntries(kinds.map((k,i)=>[k,i]));
  const atlasKey='yuyu_symbol_atlas_v050';

  const build=img=>{
   try{
    if(sc.textures.exists(atlasKey))sc.textures.remove(atlasKey);
    sc.textures.addImage(atlasKey,img);telemetry.textureCount=1;

    const cols=7,rows=5;
    const xs=[-28,-19,-9.5,0,9.5,19,28], us=[0,.16,.33,.5,.67,.84,1];
    const ys=[-21,-10.5,0,10.5,21], vs=[0,.25,.5,.75,1];
    const base=[],idx=[];
    for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++)base.push(xs[cx],ys[ry],us[cx],vs[ry]);
    for(let ry=0;ry<rows-1;ry++)for(let cx=0;cx<cols-1;cx++){
      const a=ry*cols+cx,b=a+1,c=a+cols,d=c+1;idx.push(a,b,c,0,b,d,c,0);
    }

    sc.reels.forEach(r=>r.cells.forEach(c=>{
      try{c.atlasMesh?.destroy()}catch(e){}
      c.atlasMesh=null;c.atlasSymbol='';
      const m=sc.add.mesh2d(r.x,88,atlasKey,[...base],[...idx],true).setDepth(11.3);
      m.buildOrderedIndices(2,true).setUseOrderedIndices(true);
      c.printMesh=m;c.printSymbol='';telemetry.symbolMeshes++;
    }));
    telemetry.legacyAtlasRetired=true;

    // Free superseded symbol textures after their meshes are gone.
    ['yuyu_symbol_atlas_v049',...kinds.map(k=>`yuyu_symbol_mesh_${k}_v0481`)].forEach(key=>{
      try{if(sc.textures.exists(key)){sc.textures.remove(key);telemetry.legacyRuntimeTexturesRetired++}}catch(e){}
    });

    const priorPaint=sc.paint.bind(sc);
    const setUV=(m,ki)=>{
      const u0=ki/6,u1=(ki+1)/6;
      for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++){
        const vi=(ry*cols+cx)*4;
        m.vertices[vi+2]=u0+(u1-u0)*us[cx];
        m.vertices[vi+3]=vs[ry];
      }
    };
    sc.paint=(r)=>{
      priorPaint(r);
      const travel=Number.isFinite(r.travel)?r.travel:0,turns=Math.floor(travel/LOOP);
      r.cells.forEach((c,k)=>{
        const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2;
        const y=88+local,sym=SYMBOLS[mod(k-turns*7+r.symbolShift,SYMBOLS.length)],m=c.printMesh;
        if(!m)return;
        const visible=y>=16&&y<=160,n=Math.min(1,Math.abs(y-88)/82);
        // Stronger physical foreshortening at the reel crown while preserving center readability.
        const sy=1-.19*n*n,sx=1-.055*n*n;
        if(c.printSymbol!==sym.k){setUV(m,kindIndex[sym.k]??0);c.printSymbol=sym.k}
        m.setPosition(r.x,y-1).setVisible(visible)
         .setAlpha((r.spinning?.97:1)*(1-.11*n))
         .setScale(1.21*sx,1.21*sy);
        c.icon?.setVisible(false);c.sub?.setVisible(false);
      });
    };
    sc.reels.forEach(r=>sc.paint(r));

    telemetry.enabled=true;
    state.version='0.5.0';
    state.fx.symbolSurface='PRINT_GRADE_SVG_MESH2D';
    state.fx.symbolAtlas='ONE_TEXTURE_1536X256';
    state.fx.symbolMeshCount=telemetry.symbolMeshes;
    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.5.0',phaser:{...x.phaser,symbolSurface:'PRINT_GRADE_SVG_MESH2D',symbolAtlas:'ONE_TEXTURE_1536X256',symbolMeshCount:telemetry.symbolMeshes},symbolPrint:{...telemetry}};
    };
    log('SYMBOL_PRINT','SVG_1536X256');
    log('SYMBOL_PRINT_TEXTURES','1');
    log('SYMBOL_PRINT_MESHES',String(telemetry.symbolMeshes));
    log('SYMBOL_PRINT_GRID','7X5');
    log('SYMBOL_PRINT_TREATMENT','MULTI_EDGE_HIGHLIGHT_SHADOW');
    log('SYMBOL_PRINT_MEMORY',String(telemetry.estimatedGpuBytes));
    log('PATCH','SYMBOL_PRINT_V0_5_0');
   }catch(e){errors.push(String(e?.message||e));log('SYMBOL_PRINT_ERROR',String(e?.message||e));}
  };

  const started=performance.now(),img=new Image();
  img.decoding='async';
  img.onload=()=>{telemetry.loadMs=Math.round((performance.now()-started)*10)/10;build(img)};
  img.onerror=()=>{errors.push('print-grade SVG atlas load failed');log('SYMBOL_PRINT_ERROR','LOAD_FAILED')};
  img.src='./assets/symbol-atlas-v050.svg?v=050';
 };
 attach();
})();
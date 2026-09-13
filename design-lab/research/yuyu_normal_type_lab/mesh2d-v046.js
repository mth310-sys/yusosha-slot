/* YUYU v0.4.6 — Phaser 4.2.1 Mesh2D capability experiment.
   Uses Mesh2D only as a reel-surface optical layer so the proven motion/lock core remains untouched.
   Goal: test whether stable-topology textured meshes improve cylindrical reel depth on iPhone WebKit. */
(()=>{
  const attach=()=>{
    if(!state?.scene||state.version!=='0.4.5'){requestAnimationFrame(attach);return}
    const sc=state.scene;
    const telemetry={
      api:'PHASER_4_2_MESH2D',mode:'MESH2D_OPTICS_OVERLAY_AB',available:false,enabled:true,
      meshCount:0,orderedIndices:false,topology:'STABLE_5X5_GRID',strategy:2,
      vertexCountPerMesh:25,triangleCountPerMesh:32,errors:[]
    };
    const meshes=[];
    try{
      telemetry.available=typeof sc.add?.mesh2d==='function';
      if(!telemetry.available)throw new Error('Mesh2D factory unavailable');

      const key='yuyu_mesh2d_film_v046';
      if(!sc.textures.exists(key)){
        const tex=sc.textures.createCanvas(key,96,166),ctx=tex.context;
        ctx.clearRect(0,0,96,166);
        const lg=ctx.createLinearGradient(0,0,96,0);
        lg.addColorStop(0,'rgba(37,25,24,.12)');
        lg.addColorStop(.14,'rgba(91,68,50,.035)');
        lg.addColorStop(.42,'rgba(255,255,255,0)');
        lg.addColorStop(.56,'rgba(255,255,255,.035)');
        lg.addColorStop(.86,'rgba(91,68,50,.035)');
        lg.addColorStop(1,'rgba(37,25,24,.12)');
        ctx.fillStyle=lg;ctx.fillRect(0,0,96,166);
        const vg=ctx.createLinearGradient(0,0,0,166);
        vg.addColorStop(0,'rgba(70,47,39,.055)');
        vg.addColorStop(.12,'rgba(255,255,255,0)');
        vg.addColorStop(.88,'rgba(255,255,255,0)');
        vg.addColorStop(1,'rgba(70,47,39,.05)');
        ctx.fillStyle=vg;ctx.fillRect(0,0,96,166);
        tex.refresh();
      }

      const rows=5,cols=5,vertices=[];
      const yVals=[-82,-41,0,41,82],factors=[.90,.965,1,.965,.90],xVals=[-48,-24,0,24,48];
      for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++){
        vertices.push(xVals[cx]*factors[ry],yVals[ry],cx/(cols-1),ry/(rows-1));
      }
      const indices=[];
      for(let ry=0;ry<rows-1;ry++)for(let cx=0;cx<cols-1;cx++){
        const a=ry*cols+cx,b=a+1,c=a+cols,d=c+1;
        indices.push(a,b,c,0,b,d,c,0);
      }
      sc.reels.forEach(r=>{
        const mesh=sc.add.mesh2d(r.x,88,key,[...vertices],[...indices],false).setDepth(7.8).setAlpha(.86);
        mesh.buildOrderedIndices(2,true);
        mesh.setUseOrderedIndices(true);
        meshes.push(mesh);
      });
      telemetry.meshCount=meshes.length;
      telemetry.orderedIndices=meshes.every(m=>m.useOrderedIndices===true&&Array.isArray(m.indicesOrdered)&&m.indicesOrdered.length>0);
      log('MESH2D','ACTIVE');
      log('MESH2D_TOPOLOGY','STABLE_5X5_GRID');
      log('MESH2D_ORDER','STRATEGY_2');
    }catch(e){
      telemetry.errors.push(String(e?.message||e));
      log('MESH2D_ERROR',String(e?.message||e));
    }

    state.version='0.4.6';
    state.fx.mesh2d='MESH2D_OPTICS_OVERLAY_AB';
    state.fx.mesh2dEnabled=telemetry.enabled;
    state.fx.mesh2dCount=telemetry.meshCount;

    window.__YUYU_MESH_AB__=(mode='mesh')=>{
      const on=mode!=='baseline';
      meshes.forEach(m=>m.setVisible(on));
      telemetry.enabled=on;state.fx.mesh2dEnabled=on;
      log('MESH2D_AB',on?'MESH_ON':'BASELINE');
      return on;
    };

    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.6',phaser:{...x.phaser,mesh2d:'MESH2D_OPTICS_OVERLAY_AB',mesh2dEnabled:telemetry.enabled,mesh2dCount:telemetry.meshCount},mesh2d:{...telemetry}};
    };
    log('MESH2D_AB','MESH_ON');
    log('PATCH','MESH2D_V0_4_6');
  };
  attach();
})();
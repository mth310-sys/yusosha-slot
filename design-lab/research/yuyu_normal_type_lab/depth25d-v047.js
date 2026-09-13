/* YUYU v0.4.7 — permanent 2.5D reel-depth integration.
   No A/B mode: this pass treats depth as part of the machine design.
   Stable reel motion/lock core remains unchanged. */
(()=>{
  const attach=()=>{
    if(!state?.scene||state.version!=='0.4.6'){requestAnimationFrame(attach);return}
    const sc=state.scene;
    const telemetry={
      mode:'PERMANENT_2_5D_REEL_STACK',enabled:true,comparisonMode:false,
      depthPlanes:5,meshMode:'CURVED_7X7_OPTICAL_SURFACE',meshCount:0,
      vertexCountPerMesh:49,triangleCountPerMesh:72,orderedIndices:false,
      cavityOcclusion:true,innerRim:true,barrelEdges:true,staticLighting:true,errors:[]
    };

    // Retire the v0.4.6 experimental overlay and replace it with the permanent depth stack.
    try{ window.__YUYU_MESH_AB__?.('baseline'); }catch(e){}

    const depthMeshes=[];
    try{
      // Plane 0: deep cavity behind the reel film.
      sc.add.rectangle(171,88,338,174,0x050303,.52).setDepth(.35);
      sc.add.rectangle(171,88,332,168,0x130b0d,.36).setDepth(.55);

      // Plane 1: inner side walls; asymmetrical shading gives the window physical thickness.
      sc.add.rectangle(9,88,14,166,0x050304,.92).setDepth(27);
      sc.add.rectangle(333,88,14,166,0x050304,.92).setDepth(27);
      sc.add.rectangle(171,12,330,14,0x060405,.74).setDepth(27);
      sc.add.rectangle(171,164,330,14,0x060405,.78).setDepth(27);

      // Plane 2: stepped inner rim, like a recessed reel window rather than a screen.
      sc.add.rectangle(171,88,334,168,0x000000,0).setStrokeStyle(5,0x1b1115,.95).setDepth(28);
      sc.add.rectangle(171,88,328,162,0x000000,0).setStrokeStyle(2,0x6b5059,.42).setDepth(29);
      sc.add.rectangle(171,88,324,158,0x000000,0).setStrokeStyle(1,0xf4dfe6,.16).setDepth(30);

      // Plane 3: per-reel barrel edge shading. Fixed, non-animated.
      sc.reels.forEach(r=>{
        sc.add.rectangle(r.x-47,88,6,160,0x1b0d0d,.28).setDepth(9.2);
        sc.add.rectangle(r.x+47,88,6,160,0x1b0d0d,.28).setDepth(9.2);
        sc.add.rectangle(r.x-43,88,3,158,0x80645b,.10).setDepth(9.3);
        sc.add.rectangle(r.x+43,88,3,158,0x80645b,.10).setDepth(9.3);
      });

      // Plane 4: a denser Mesh2D curvature surface. This remains optical so the reel core stays robust,
      // but it is now a permanent part of the 2.5D construction rather than an experiment toggle.
      const key='yuyu_depth25d_surface_v047';
      if(!sc.textures.exists(key)){
        const tex=sc.textures.createCanvas(key,96,166),ctx=tex.context;
        ctx.clearRect(0,0,96,166);
        const xg=ctx.createLinearGradient(0,0,96,0);
        xg.addColorStop(0,'rgba(15,7,5,.24)');
        xg.addColorStop(.10,'rgba(38,18,12,.10)');
        xg.addColorStop(.24,'rgba(255,244,224,.015)');
        xg.addColorStop(.50,'rgba(255,255,255,.065)');
        xg.addColorStop(.76,'rgba(255,244,224,.015)');
        xg.addColorStop(.90,'rgba(38,18,12,.10)');
        xg.addColorStop(1,'rgba(15,7,5,.24)');
        ctx.fillStyle=xg;ctx.fillRect(0,0,96,166);
        const yg=ctx.createLinearGradient(0,0,0,166);
        yg.addColorStop(0,'rgba(18,8,7,.16)');
        yg.addColorStop(.12,'rgba(255,255,255,0)');
        yg.addColorStop(.50,'rgba(255,255,255,.02)');
        yg.addColorStop(.88,'rgba(255,255,255,0)');
        yg.addColorStop(1,'rgba(18,8,7,.16)');
        ctx.fillStyle=yg;ctx.fillRect(0,0,96,166);
        tex.refresh();
      }
      const rows=7,cols=7,vertices=[],indices=[];
      const yVals=[-82,-55,-28,0,28,55,82];
      const widthFactors=[.84,.91,.97,1,.97,.91,.84];
      const xVals=[-48,-32,-16,0,16,32,48];
      for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++){
        const nx=xVals[cx]/48;
        const barrel=1-.045*Math.pow(Math.abs(nx),2);
        vertices.push(xVals[cx]*widthFactors[ry]*barrel,yVals[ry],cx/(cols-1),ry/(rows-1));
      }
      for(let ry=0;ry<rows-1;ry++)for(let cx=0;cx<cols-1;cx++){
        const a=ry*cols+cx,b=a+1,c=a+cols,d=c+1;
        indices.push(a,b,c,0,b,d,c,0);
      }
      sc.reels.forEach(r=>{
        const m=sc.add.mesh2d(r.x,88,key,[...vertices],[...indices],false).setDepth(10.2).setAlpha(.92);
        m.buildOrderedIndices(2,true).setUseOrderedIndices(true);
        depthMeshes.push(m);
      });
      telemetry.meshCount=depthMeshes.length;
      telemetry.orderedIndices=depthMeshes.every(m=>m.useOrderedIndices===true&&Array.isArray(m.indicesOrdered)&&m.indicesOrdered.length>0);
    }catch(e){telemetry.errors.push(String(e?.message||e));log('DEPTH25D_ERROR',String(e?.message||e));}

    state.version='0.4.7';
    state.fx.depthMode='PERMANENT_2_5D_REEL_STACK';
    state.fx.mesh2d='CURVED_7X7_OPTICAL_SURFACE';
    state.fx.mesh2dEnabled=true;
    state.fx.mesh2dCount=telemetry.meshCount;

    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.7',phaser:{...x.phaser,depthMode:'PERMANENT_2_5D_REEL_STACK',mesh2d:'CURVED_7X7_OPTICAL_SURFACE',mesh2dEnabled:true,mesh2dCount:telemetry.meshCount},depth25d:{...telemetry}};
    };
    log('DEPTH25D','PERMANENT');
    log('DEPTH_PLANES','5');
    log('MESH2D_TOPOLOGY','STABLE_7X7_GRID');
    log('DEPTH25D_REFERENCE','HANAHANA_CLASS_NORMAL_TYPE');
    log('PATCH','DEPTH25D_V0_4_7');
  };
  attach();
})();
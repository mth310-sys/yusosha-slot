/* YUYU v0.4.3 — printed reel physicality + unified original symbol set.
   Visual-only tuning hypotheses. Keeps the proven v0.4.2 motion/lock core unchanged. */
(()=>{
  const attach=()=>{
    if(!state?.scene||state.version!=='0.4.2'){requestAnimationFrame(attach);return}
    const sc=state.scene;
    state.version='0.4.3';
    state.fx.reelSurface='PHYSICAL_PRINTED_FILM';
    state.fx.symbolMode='PROCEDURAL_ORIGINAL_V2';
    state.fx.reelCurvature='FORESHORTEN_ONLY';
    state.fx.printTexture='SUBTLE_STATIC_INK';

    const drawSymbol=(g,sym,x,y)=>{
      g.clear();g.setPosition(x,y).setVisible(true).setScale(1);
      if(sym.k==='seven'){
        g.fillStyle(0xc51f32,1);g.fillRoundedRect(-18,-12,36,7,3);g.fillTriangle(16,-8,5,15,-4,15);g.fillTriangle(10,-7,2,15,-8,15);
        g.lineStyle(2,0xf0c66c,.92);g.beginPath();g.moveTo(-13,-8);g.lineTo(12,-8);g.lineTo(1,12);g.strokePath();
        g.fillStyle(0x4c1730,1);g.fillCircle(-14,11,4);g.fillStyle(0xf5d77e,1);g.fillCircle(-14,11,1.6);
      }else if(sym.k==='cherry'){
        g.lineStyle(2,0x2f7d45,.96);g.beginPath();g.moveTo(-4,-4);g.lineTo(3,-12);g.lineTo(9,-9);g.strokePath();
        g.fillStyle(0x2d8a4c,1);g.fillEllipse(8,-10,9,5);
        g.fillStyle(0xd82435,1);g.fillCircle(-7,3,7);g.fillCircle(6,2,7);g.fillStyle(0xff9aa2,.82);g.fillCircle(-9,0,2);g.fillCircle(4,-1,2);
      }else if(sym.k==='bell'){
        g.fillStyle(0xe1a91d,1);g.fillRoundedRect(-11,-1,22,10,5);g.fillTriangle(-10,1,0,-12,10,1);g.lineStyle(2,0x8a650d,.85);g.strokeRoundedRect(-11,-1,22,10,5);g.fillStyle(0x76530a,1);g.fillCircle(0,11,3.2);g.fillStyle(0xffef9a,.75);g.fillEllipse(-3,-3,4,7);
      }else if(sym.k==='replay'){
        g.lineStyle(5,0x2877c7,1);g.beginPath();g.arc(0,0,11,0.28,5.45,false);g.strokePath();g.fillStyle(0x2877c7,1);g.fillTriangle(8,-12,17,-5,7,-2);g.fillStyle(0xeef6ff,1);g.fillCircle(0,0,3.8);
      }else if(sym.k==='bar'){
        g.fillStyle(0x211d25,1);g.fillRoundedRect(-22,-10,44,20,4);g.lineStyle(2,0xc7a35c,.95);g.strokeRoundedRect(-20,-8,40,16,3);g.fillStyle(0x6b2855,1);g.fillTriangle(-17,5,-10,-5,-3,5);g.fillTriangle(3,5,10,-5,17,5);
      }else if(sym.k==='leaf'){
        g.fillStyle(0x2f9b61,1);g.fillEllipse(0,0,22,27);g.lineStyle(2,0x175d3a,.9);g.strokeEllipse(0,0,22,27);g.lineStyle(2,0xd7f0df,.92);g.beginPath();g.moveTo(-6,-5);g.lineTo(0,5);g.lineTo(7,-6);g.strokePath();g.fillStyle(0xe8c96e,1);g.fillCircle(0,10,2.2);
      }
    };

    sc.reels.forEach(r=>{
      r.cells.forEach(c=>{
        c.plate.setVisible(false).setAlpha(0);
        c.label.setText('');
        c.sub.setFontSize(4.5).setAlpha(.64);
      });
      r.filmBack.setFillStyle(0xfffbef,1).setSize(96,166);
      r.filmSheen.setAlpha(.018).setSize(10,164);
      r.rollEdgeL=sc.add.rectangle(r.x-46,88,4,164,0x9c8d79,.10).setDepth(8);
      r.rollEdgeR=sc.add.rectangle(r.x+46,88,4,164,0x9c8d79,.10).setDepth(8);
      r.printWarm=sc.add.rectangle(r.x,88,88,162,0xf0d7ad,.018).setDepth(3);
      r.inkLineTop=sc.add.rectangle(r.x,20,88,1,0x7c6d5d,.055).setDepth(3);
      r.inkLineBottom=sc.add.rectangle(r.x,156,88,1,0x7c6d5d,.045).setDepth(3);
    });

    sc.paint=(r)=>{
      const travel=Number.isFinite(r.travel)?r.travel:0,turns=Math.floor(travel/LOOP);
      r.cells.forEach((c,k)=>{
        const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2,y=88+local,sym=SYMBOLS[mod(k-turns*7+r.symbolShift,SYMBOLS.length)];
        const visible=y>=18&&y<=158;
        const n=Math.min(1,Math.abs(y-88)/82);
        const sy=1-.13*n*n;
        const sx=1-.025*n*n;
        const edge=Math.min(1,Math.max(.58,1-Math.abs(y-88)/165));
        const motion=r.spinning?.94:1;
        c.plate.y=y;c.plate.setVisible(false).setAlpha(0);
        // Keep the hidden legacy label position updated because motion QA telemetry probes it.
        c.label.y=y-2;c.label.setVisible(false).setText('');
        c.sub.y=y+12;c.sub.setText(sym.k==='seven'?'YUYU':sym.k==='bar'?'YUYU':sym.k==='leaf'?'YU':'').setColor(sym.k==='bar'?'#a98b52':sym.c).setVisible(visible).setAlpha(edge*.64*motion).setScale(sx,sy);
        drawSymbol(c.icon,sym,r.x,y-1);
        c.icon.setVisible(visible).setAlpha(edge*motion).setScale(sx,sy);
      });
    };
    sc.reels.forEach(r=>sc.paint(r));

    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.3',phaser:{...x.phaser,reelSurface:'PHYSICAL_PRINTED_FILM',symbolMode:'PROCEDURAL_ORIGINAL_V2',reelCurvature:'FORESHORTEN_ONLY',printTexture:'SUBTLE_STATIC_INK'},film:{...(x.film||{}),surface:'PHYSICAL_PRINTED_FILM',symbolMode:'PROCEDURAL_ORIGINAL_V2',cardPlates:false,curvature:'FORESHORTEN_ONLY',centerScaleY:1,rowScaleY:Number((1-.13*Math.pow(36/82,2)).toFixed(4)),edgeScaleY:.87,rollEdges:true,printTexture:'SUBTLE_STATIC_INK'}};
    };
    log('REEL_SURFACE','PHYSICAL_PRINTED_FILM');
    log('SYMBOL_MODE','PROCEDURAL_ORIGINAL_V2');
    log('REEL_CURVATURE','FORESHORTEN_ONLY');
    log('PATCH','REEL_PHYSICAL_V0_4_3');
  };
  attach();
})();
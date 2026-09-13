/* YUYU v0.4.2 — continuous printed reel film.
   Visual-only reel surface upgrade: removes card-like tile borders and uses original procedural pictograms. */
(()=>{
  const attach=()=>{
    if(!state?.scene){requestAnimationFrame(attach);return}
    const s=state.scene;
    state.version='0.4.2';
    state.fx.reelSurface='CONTINUOUS_PRINTED_FILM';
    state.fx.symbolMode='PROCEDURAL_ORIGINAL';
    state.fx.cellGapPx=0;
    const originalPaint=s.paint.bind(s);
    const drawIcon=(g,sym,x,y)=>{
      g.clear(); g.setPosition(x,y); g.setVisible(true);
      const hex=parseInt(String(sym.c||'#222').slice(1),16)||0x222222;
      if(sym.k==='cherry'){
        g.lineStyle(2,0x2f7d45,.95);g.beginPath();g.moveTo(-3,-4);g.lineTo(4,-11);g.strokePath();
        g.fillStyle(0xd82435,1);g.fillCircle(-6,2,7);g.fillCircle(6,1,7);g.fillStyle(0xff8790,.72);g.fillCircle(-8,-1,2);g.fillCircle(4,-2,2);
      }else if(sym.k==='bell'){
        g.fillStyle(0xe1a91d,1);g.fillTriangle(-11,7,0,-10,11,7);g.fillRoundedRect(-10,5,20,6,2);g.fillStyle(0x6d4c0b,1);g.fillCircle(0,12,3);
      }else if(sym.k==='replay'){
        g.lineStyle(5,0x2877c7,1);g.strokeCircle(0,0,11);g.fillStyle(0x2877c7,1);g.fillTriangle(8,-12,16,-5,6,-3);g.fillStyle(0xf8fbff,1);g.fillCircle(0,0,4);
      }else if(sym.k==='leaf'){
        g.fillStyle(0x2f9b61,1);g.fillTriangle(0,-13,11,7,0,4);g.fillTriangle(0,-13,-11,7,0,4);g.lineStyle(2,0x155b37,.9);g.beginPath();g.moveTo(0,-8);g.lineTo(0,11);g.strokePath();
      }else if(sym.k==='bar'){
        g.fillStyle(0x262229,1);g.fillRoundedRect(-20,-10,40,20,4);g.lineStyle(2,0xc8a86b,.9);g.strokeRoundedRect(-18,-8,36,16,3);
      }else if(sym.k==='seven'){
        g.fillStyle(0xc8202d,.22);g.fillCircle(0,1,15);g.lineStyle(2,0xf0c8c8,.7);g.strokeCircle(0,1,15);
      }else{
        g.fillStyle(hex,1);g.fillCircle(0,0,9);
      }
    };
    s.reels.forEach(r=>{
      r.filmBack=s.add.rectangle(r.x,88,96,166,0xfffbef,1).setDepth(2);
      r.filmSheen=s.add.rectangle(r.x,88,14,164,0xffffff,.035).setDepth(3).setBlendMode(Phaser.BlendModes.ADD);
      r.cells.forEach(c=>{
        c.plate.setFillStyle(0xfffbef,1).setSize(96,40).setStrokeStyle(0,0,0);
        c.label.setFontSize(25);
        c.sub.setFontSize(5).setAlpha(.72);
        c.icon=s.add.graphics().setDepth(6);
      });
    });
    s.paint=(r)=>{
      const travel=Number.isFinite(r.travel)?r.travel:0,turns=Math.floor(travel/LOOP);
      r.cells.forEach((c,k)=>{
        const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2,y=88+local,sym=SYMBOLS[mod(k-turns*7+r.symbolShift,SYMBOLS.length)];
        c.plate.y=y;c.label.y=y-2;c.sub.y=y+11;
        const custom=['cherry','bell','replay','leaf'].includes(sym.k);
        c.label.setText(custom?'':sym.t).setColor(sym.c);
        c.sub.setText(sym.k==='seven'?'YUYU':sym.k==='bar'?'YUYU BAR':'').setColor(sym.k==='bar'?'#b99c63':sym.c);
        drawIcon(c.icon,sym,r.x,y-1);
        if(sym.k==='bar')c.label.setText('BAR').setColor('#f1d8a2').setFontSize(16);
        else c.label.setFontSize(25);
        const visible=y>=18&&y<=158,edge=Math.min(1,Math.max(.5,1-Math.abs(y-88)/145)),motion=r.spinning?.94:1;
        c.plate.setVisible(visible).setAlpha(edge*motion);
        c.label.setVisible(visible).setAlpha(edge*motion);
        c.sub.setVisible(visible).setAlpha(edge*.72*motion);
        c.icon.setVisible(visible).setAlpha(edge*motion);
      });
    };
    s.reels.forEach(r=>s.paint(r));
    const prior=window.__YUYU_STATE__;
    window.__YUYU_STATE__=()=>{
      const x=prior();
      return {...x,version:'0.4.2',phaser:{...x.phaser,reelSurface:'CONTINUOUS_PRINTED_FILM',symbolMode:'PROCEDURAL_ORIGINAL',cellGapPx:0},film:{surface:'CONTINUOUS_PRINTED_FILM',symbolMode:'PROCEDURAL_ORIGINAL',cellGapPx:0,filmWidth:96,cellHeight:40}};
    };
    log('REEL_SURFACE','CONTINUOUS_PRINTED_FILM');
    log('SYMBOL_MODE','PROCEDURAL_ORIGINAL');
    log('PATCH','REEL_FILM_V0_4_2');
  };
  attach();
})();
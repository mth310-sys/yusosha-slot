/* YUYU v0.4.8 — permanent 2.5D printed-symbol Mesh2D integration.
   Symbol faces are textured Mesh2D patches. Motion/lock/audio core remains untouched. */
(()=>{
 const attach=()=>{
  if(!state?.scene||state.version!=='0.4.7'){requestAnimationFrame(attach);return}
  const sc=state.scene, errors=[];
  const telemetry={mode:'PERMANENT_SYMBOL_MESH_2_5D',enabled:true,comparisonMode:false,symbolMeshes:0,textureCount:0,grid:'5X3',vertexCountPerSymbol:15,triangleCountPerSymbol:16,orderedIndices:true,curvedSymbols:true,legacyGraphicsHidden:true,renderFix:'CANVAS_ABSOLUTE_COORDS_0481',errors};
  const kinds=['seven','cherry','bell','replay','bar','leaf'];
  const draw=(ctx,k)=>{ctx.clearRect(0,0,64,48);ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
   if(k==='seven'){ctx.fillStyle='#c51f32';ctx.beginPath();ctx.roundRect(11,8,42,9,4);ctx.fill();ctx.beginPath();ctx.moveTo(49,14);ctx.lineTo(33,41);ctx.lineTo(21,41);ctx.closePath();ctx.fill();ctx.strokeStyle='#f0c66c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(15,13);ctx.lineTo(47,13);ctx.lineTo(31,38);ctx.stroke();}
   else if(k==='cherry'){ctx.strokeStyle='#2f7d45';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(26,21);ctx.lineTo(34,8);ctx.lineTo(43,12);ctx.stroke();ctx.fillStyle='#2d8a4c';ctx.beginPath();ctx.ellipse(43,11,7,4,-.25,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d82435';ctx.beginPath();ctx.arc(22,29,9,0,Math.PI*2);ctx.arc(40,28,9,0,Math.PI*2);ctx.fill();}
   else if(k==='bell'){ctx.fillStyle='#e1a91d';ctx.beginPath();ctx.moveTo(18,29);ctx.quadraticCurveTo(20,18,32,9);ctx.quadraticCurveTo(44,18,46,29);ctx.quadraticCurveTo(43,36,32,36);ctx.quadraticCurveTo(21,36,18,29);ctx.fill();ctx.strokeStyle='#8a650d';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#76530a';ctx.beginPath();ctx.arc(32,39,4,0,Math.PI*2);ctx.fill();}
   else if(k==='replay'){ctx.strokeStyle='#2877c7';ctx.lineWidth=6;ctx.beginPath();ctx.arc(32,25,14,.3,5.5);ctx.stroke();ctx.fillStyle='#2877c7';ctx.beginPath();ctx.moveTo(44,7);ctx.lineTo(55,15);ctx.lineTo(43,19);ctx.closePath();ctx.fill();ctx.fillStyle='#eef6ff';ctx.beginPath();ctx.arc(32,25,5,0,Math.PI*2);ctx.fill();}
   else if(k==='bar'){ctx.fillStyle='#211d25';ctx.beginPath();ctx.roundRect(7,13,50,22,5);ctx.fill();ctx.strokeStyle='#c7a35c';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#6b2855';ctx.beginPath();ctx.moveTo(13,30);ctx.lineTo(21,18);ctx.lineTo(29,30);ctx.moveTo(35,30);ctx.lineTo(43,18);ctx.lineTo(51,30);ctx.fill();}
   else {ctx.fillStyle='#2f9b61';ctx.beginPath();ctx.ellipse(32,24,13,17,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#175d3a';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='#d7f0df';ctx.beginPath();ctx.moveTo(24,19);ctx.lineTo(32,30);ctx.lineTo(41,18);ctx.stroke();}
   ctx.restore();
  };
  try{
   const keys={};for(const k of kinds){const key=`yuyu_symbol_mesh_${k}_v0481`;keys[k]=key;if(!sc.textures.exists(key)){const t=sc.textures.createCanvas(key,64,48);draw(t.context,k);t.refresh();telemetry.textureCount++;}}
   const cols=5,rows=3,baseV=[],idx=[],xs=[-26,-14,0,14,26],us=[0,.22,.5,.78,1],ys=[-19,0,19],vs=[0,.5,1];
   for(let ry=0;ry<rows;ry++)for(let cx=0;cx<cols;cx++)baseV.push(xs[cx],ys[ry],us[cx],vs[ry]);
   for(let ry=0;ry<rows-1;ry++)for(let cx=0;cx<cols-1;cx++){const a=ry*cols+cx,b=a+1,c=a+cols,d=c+1;idx.push(a,b,c,0,b,d,c,0)}
   sc.reels.forEach(r=>r.cells.forEach(c=>{c.icon?.setVisible(false).setAlpha(0);c.sub?.setVisible(false).setAlpha(0);const m=sc.add.mesh2d(r.x,88,keys.seven,[...baseV],[...idx],false).setDepth(11.2);m.buildOrderedIndices(2,true).setUseOrderedIndices(true);c.symbolMesh=m;c.symbolMeshKey='';telemetry.symbolMeshes++;}));
   const priorPaint=sc.paint.bind(sc);
   sc.paint=(r)=>{priorPaint(r);const travel=Number.isFinite(r.travel)?r.travel:0,turns=Math.floor(travel/LOOP);r.cells.forEach((c,k)=>{const local=mod(k*SPACING+travel+LOOP/2,LOOP)-LOOP/2,y=88+local,sym=SYMBOLS[mod(k-turns*7+r.symbolShift,SYMBOLS.length)],m=c.symbolMesh;if(!m)return;const visible=y>=18&&y<=158,n=Math.min(1,Math.abs(y-88)/82),sy=1-.16*n*n,sx=1-.04*n*n;if(c.symbolMeshKey!==sym.k){m.setTexture(keys[sym.k]);c.symbolMeshKey=sym.k}m.setPosition(r.x,y-1).setVisible(visible).setAlpha((r.spinning?.94:1)*(1-.18*n)).setScale(1.14*sx,1.14*sy);c.icon?.setVisible(false);c.sub?.setVisible(false);});};
   sc.reels.forEach(r=>sc.paint(r));
  }catch(e){errors.push(String(e?.message||e));log('SYMBOL_MESH_ERROR',String(e?.message||e));}
  state.version='0.4.8';state.fx.symbolSurface='MESH2D_PRINTED_SYMBOL_FILM';state.fx.symbolMeshCount=telemetry.symbolMeshes;
  const prior=window.__YUYU_STATE__;window.__YUYU_STATE__=()=>{const x=prior();return {...x,version:'0.4.8',phaser:{...x.phaser,symbolSurface:'MESH2D_PRINTED_SYMBOL_FILM',symbolMeshCount:telemetry.symbolMeshes},symbolMesh:{...telemetry}}};
  log('SYMBOL_SURFACE','MESH2D_PRINTED_SYMBOL_FILM');log('SYMBOL_MESHES',String(telemetry.symbolMeshes));log('SYMBOL_CURVATURE','PERMANENT_2_5D');log('SYMBOL_RENDER_FIX','CANVAS_ABSOLUTE_COORDS_0481');log('PATCH','SYMBOL_MESH_V0_4_8');
 };attach();
})();
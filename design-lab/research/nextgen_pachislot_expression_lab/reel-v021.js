/* Next-Gen Pachislot Expression Lab v0.2.1
   Reel window/cylinder correction patch. Loaded after reel-v02.js.
   v0.2.2+ uses physical front occlusion, so unsupported WebGL GeometryMask calls are intentionally absent. */
(() => {
  const SYMBOLS = [
    ['BAR',0x15171b,'#eceef1'], ['7',0x9b1020,'#f6e7e9'], ['◆',0x20242a,'#f1f2f4'],
    ['CH',0xd99118,'#fff0bd'], ['●',0x24735e,'#dcfff3'], ['BELL',0xb87b16,'#fff3b8'],
    ['7',0x9b1020,'#f6e7e9'], ['◆',0x20242a,'#f1f2f4'], ['BAR',0x15171b,'#eceef1'],
    ['CH',0xd99118,'#fff0bd'], ['●',0x24735e,'#dcfff3'], ['◆',0x20242a,'#f1f2f4'],
    ['7',0x9b1020,'#f6e7e9'], ['BAR',0x15171b,'#eceef1'], ['BELL',0xb87b16,'#fff3b8'],
    ['◆',0x20242a,'#f1f2f4'], ['CH',0xd99118,'#fff0bd'], ['7',0x9b1020,'#f6e7e9'],
    ['●',0x24735e,'#dcfff3'], ['BAR',0x15171b,'#eceef1'], ['◆',0x20242a,'#f1f2f4']
  ];
  const SPACING = 36;
  const REEL_Y = 342;
  const WINDOW_H = 116;
  const WINDOW_W = 90;

  NextGenScene.prototype.buildReels = function(){
    const y=REEL_Y;

    this.reelBack=this.add.rectangle(195,y+2,344,146,0x030406,1)
      .setStrokeStyle(2,0x020203).setDepth(20);
    this.reelCavity=this.add.rectangle(195,y+1,326,126,0x090c11,1)
      .setStrokeStyle(2,0x161b22).setDepth(21);
    this.reelLamp=this.add.rectangle(195,y,318,116,0xe8eef6,.10).setDepth(22);

    this.reels=[];
    for(let i=0;i<3;i++){
      const x=92+i*103;
      const well=this.add.rectangle(x,y,94,120,0xcfd4d9,1)
        .setStrokeStyle(1,0x59616d,.65).setDepth(23);

      const cells=[];
      for(let j=0;j<7;j++){
        const plate=this.add.rectangle(x,y+(j-3)*SPACING,88,34,0xf2f3f5,1).setDepth(24);
        const label=this.add.text(x,y+(j-3)*SPACING,'',{
          fontFamily:'Arial Black,Arial,sans-serif',fontStyle:'bold',fontSize:'21px',color:'#17191d'
        }).setOrigin(.5).setDepth(25);
        cells.push({plate,label});
      }

      const sideL=this.add.rectangle(x-42,y,12,WINDOW_H,0x020304,.24).setDepth(29);
      const sideR=this.add.rectangle(x+42,y,12,WINDOW_H,0x020304,.24).setDepth(29);
      const topCurve=this.add.rectangle(x,y-49,WINDOW_W,18,0x020304,.42).setDepth(30);
      const bottomCurve=this.add.rectangle(x,y+49,WINDOW_W,18,0x020304,.48).setDepth(30);
      const topLip=this.add.rectangle(x,y-59,94,8,0x05070a,.95).setDepth(35);
      const bottomLip=this.add.rectangle(x,y+59,94,8,0x05070a,.98).setDepth(35);
      const spec=this.add.rectangle(x-25,y-3,9,102,0xffffff,.045).setAngle(3).setDepth(31);
      const centerLight=this.add.rectangle(x,y,80,31,0xffffff,.035).setDepth(28);

      this.reels.push({
        x,y,well,cells,sideL,sideR,topCurve,bottomCurve,topLip,bottomLip,spec,centerLight,
        offset:0,speed:0,targetSpeed:0,mode:'idle',baseIndex:(i*3+1)%SYMBOLS.length,onSettled:null
      });
    }

    this.separatorL=this.add.rectangle(143.5,y,9,124,0x1a1e24,1)
      .setStrokeStyle(1,0x6c7580,.48).setDepth(40);
    this.separatorR=this.add.rectangle(246.5,y,9,124,0x1a1e24,1)
      .setStrokeStyle(1,0x6c7580,.48).setDepth(40);
    this.reelFrame=this.add.rectangle(195,y,334,136,0x77818e,.10)
      .setStrokeStyle(6,0x171b21).setDepth(41);
    this.reelGlass=this.add.rectangle(195,y,322,122,0xdceaff,.025)
      .setStrokeStyle(1,0xaab9c9,.20).setDepth(42);
    this.reelGlassHighlight=this.add.rectangle(164,y-38,184,5,0xffffff,.055)
      .setAngle(-2).setDepth(43);
    this.reelShade=this.add.rectangle(195,y,334,136,0x001020,.055).setDepth(44);

    this.reels.forEach(r=>this.paintReelV02(r));
  };

  NextGenScene.prototype.paintReelV02 = function(r){
    const wrapped=((r.offset%SPACING)+SPACING)%SPACING;
    const step=Math.floor(r.offset/SPACING);

    r.cells.forEach((cell,j)=>{
      let local=(j-3)*SPACING+wrapped;
      while(local>SPACING*3.5)local-=SPACING*7;
      while(local<-SPACING*3.5)local+=SPACING*7;

      const idx=(r.baseIndex-step-j+3+SYMBOLS.length*30)%SYMBOLS.length;
      const [name,ink,paper]=SYMBOLS[idx];
      const abs=Math.abs(local);
      const norm=Math.min(1,abs/58);

      // Curvature hypothesis for human visual evaluation, not a measured reel geometry.
      const sx=1-(norm*norm*.08);
      const sy=.96-(norm*norm*.09);
      const alpha=.48+(1-norm)*.52;
      const y=r.y+local;

      cell.plate.setPosition(r.x,y).setScale(sx,sy).setAlpha(alpha)
        .setFillStyle(parseInt(paper.slice(1),16),1);
      cell.label.setPosition(r.x,y).setScale(sx,sy).setAlpha(alpha)
        .setText(name)
        .setColor(`#${ink.toString(16).padStart(6,'0')}`)
        .setFontSize(name==='BELL'?13:name==='BAR'?16:21);
    });
  };

  // v0.2 used cell.group for motion attenuation. v0.2.1 targets direct
  // plate/text children so update() cannot throw and freeze the reels in spin.
  NextGenScene.prototype.update = function(time,delta){
    const dt=Math.min(delta,34);
    this.reels.forEach(r=>{
      if(r.mode==='idle'||r.mode==='locked'||r.mode==='settling')return;
      if(r.mode==='accelerating'){
        const p=Phaser.Math.Clamp((time-r.accelStart)/r.accelDuration,0,1);
        r.speed=r.targetSpeed*(1-Math.pow(1-p,3));
        if(p>=1)r.mode='cruise';
      }else if(r.mode==='stopping'){
        const p=Phaser.Math.Clamp((time-r.stopStart)/r.stopDuration,0,1);
        r.speed=r.stopFromSpeed*Math.pow(1-p,3);
        if(p>=1){this.settleReelV02(r);return;}
      }
      r.offset+=r.speed*dt;
      this.paintReelV02(r);
      const motion=Phaser.Math.Clamp(r.speed/1.62,0,1);
      if(motion>0){
        r.cells.forEach(c=>{
          const attenuate=1-.16*motion;
          c.plate.setAlpha(c.plate.alpha*attenuate);
          c.label.setAlpha(c.label.alpha*attenuate);
        });
      }
    });
  };

  const baseApplyMode=NextGenScene.prototype.applyMode;
  NextGenScene.prototype.applyMode=function(mode){
    baseApplyMode.call(this,mode);
    if(this.reelGlass)this.reelGlass.setAlpha(mode==='FULL'?.032:.014);
    if(this.reelGlassHighlight)this.reelGlassHighlight.setAlpha(mode==='FULL'?.06:.02);
    this.reels?.forEach(r=>{
      r.topCurve?.setAlpha(mode==='FULL'?.44:.30);
      r.bottomCurve?.setAlpha(mode==='FULL'?.50:.34);
      r.spec?.setAlpha(mode==='FULL'?.05:.018);
      r.centerLight?.setAlpha(mode==='FULL'?.045:.018);
    });
  };

  const baseLock=NextGenScene.prototype.lockReelV02;
  NextGenScene.prototype.lockReelV02=function(r){
    baseLock.call(this,r);
    if(state.mode==='FULL'){
      this.tweens.add({targets:r.centerLight,alpha:.12,duration:42,yoyo:true,ease:'Quad.Out'});
      this.tweens.add({targets:[r.topLip,r.bottomLip],alpha:.72,duration:46,yoyo:true,ease:'Quad.Out'});
    }
  };

  document.querySelector('.lab-head small').textContent='Integrated 1G Expression Prototype · REEL v0.2.1';
  logEvent('PATCH','REEL_WINDOW_CYLINDER_V0_2_1');
})();
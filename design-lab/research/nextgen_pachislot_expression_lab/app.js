const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];

const machine = $('#machine');
const statusEl = $('#status');
const creditEl = $('#credit');
const modeLabel = $('#modeLabel');
const eventLogEl = $('#eventLog');
const betBtn = $('#bet');
const startBtn = $('#start');
const stopBtns = $$('.stop');
const basicBtn = $('#basicMode');
const fullBtn = $('#fullMode');
const audioToggle = $('#audioToggle');

const state = {
  mode: 'FULL',
  credit: 50,
  bet: 0,
  phase: 'idle',
  stopIndex: 0,
  spinning: false,
  audioEnabled: true,
  scene: null,
  lastFrame: performance.now(),
  fpsSamples: [],
};

function logEvent(name, detail = '') {
  const t = new Date();
  const ts = [t.getHours(), t.getMinutes(), t.getSeconds()].map(v => String(v).padStart(2, '0')).join(':');
  const line = `${ts}  ${name}${detail ? '  ' + detail : ''}`;
  const lines = (eventLogEl.textContent ? eventLogEl.textContent.split('\n') : []);
  lines.push(line);
  eventLogEl.textContent = lines.slice(-18).join('\n');
  eventLogEl.scrollTop = eventLogEl.scrollHeight;
}

function setPhase(phase, label) {
  state.phase = phase;
  machine.dataset.phase = phase;
  if (label) statusEl.textContent = label;
  logEvent('PHASE', phase);
}

function updateCredit() {
  creditEl.textContent = `CREDIT ${state.credit}`;
}

function setMode(mode) {
  if (state.spinning || state.bet) return;
  state.mode = mode;
  modeLabel.textContent = mode;
  basicBtn.classList.toggle('active', mode === 'BASIC');
  fullBtn.classList.toggle('active', mode === 'FULL');
  logEvent('MODE', mode);
  state.scene?.applyMode(mode);
}

class AudioRig {
  constructor() {
    this.ctx = null;
    this.master = null;
  }
  async unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.14;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
  }
  tone(freq, duration = .08, type = 'sine', volume = .5, delay = 0, slideTo = null) {
    if (!state.audioEnabled || !this.ctx || !this.master) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), now + .008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain); gain.connect(this.master);
    osc.start(now); osc.stop(now + duration + .03);
  }
  noise(duration = .08, volume = .18, delay = 0) {
    if (!state.audioEnabled || !this.ctx || !this.master) return;
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, Math.max(1, Math.floor(sr * duration)), sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.buffer = buffer; src.connect(gain); gain.connect(this.master);
    src.start(this.ctx.currentTime + delay);
  }
  bet() { this.tone(740,.045,'square',.22); this.tone(980,.05,'square',.15,.05); logEvent('AUDIO','BET'); }
  start() { this.tone(92,.18,'sawtooth',.25,0,160); this.noise(.09,.09,.02); logEvent('AUDIO','START'); }
  stop(n) { this.tone(170 + n*28,.06,'triangle',.38); this.noise(.045,.07); logEvent('AUDIO',`STOP${n}`); }
  omen() { this.tone(110,.38,'sine',.16,0,72); this.tone(220,.28,'triangle',.08,.07,147); logEvent('AUDIO','OMEN'); }
  silenceBeat() { if (!this.ctx || !this.master) return; const n=this.ctx.currentTime; this.master.gain.cancelScheduledValues(n); this.master.gain.setValueAtTime(this.master.gain.value,n); this.master.gain.linearRampToValueAtTime(.0001,n+.035); this.master.gain.setValueAtTime(.0001,n+.20); this.master.gain.linearRampToValueAtTime(.14,n+.26); logEvent('AUDIO','SILENCE_BEAT'); }
  bonus() { [392,523.25,659.25,783.99].forEach((f,i)=>this.tone(f,.34,'sawtooth',.16,i*.055)); this.noise(.42,.11,.02); logEvent('AUDIO','BONUS'); }
}
const audio = new AudioRig();

const TIMELINE = {
  leverOn(scene) {
    logEvent('GAME_EVENT','LEVER_ON');
    setPhase('spin','REELS SPINNING');
    audio.start();
    scene.beginSpin();
    if (state.mode === 'FULL') {
      scene.cameraPush(1.018, 210);
      scene.characterLean();
    }
  },
  stop1(scene) {
    logEvent('GAME_EVENT','STOP_1');
    audio.stop(1);
    scene.stopReel(0);
    if (state.mode === 'FULL') {
      setPhase('omen','違和感…');
      audio.omen();
      scene.omenOne();
    } else statusEl.textContent = 'STOP 1';
  },
  stop2(scene) {
    logEvent('GAME_EVENT','STOP_2');
    audio.stop(2);
    scene.stopReel(1);
    if (state.mode === 'FULL') {
      setPhase('omen','気配が近い');
      scene.omenTwo();
    } else statusEl.textContent = 'STOP 2';
  },
  stop3(scene) {
    logEvent('GAME_EVENT','STOP_3');
    audio.stop(3);
    scene.stopReel(2);
    setPhase('judge','……');
    scene.judgement(state.mode === 'FULL');
    if (state.mode === 'FULL') {
      audio.silenceBeat();
      setTimeout(() => scene.mechanismDrop(), 180);
      setTimeout(() => scene.hitRelease(), 380);
      setTimeout(() => {
        machine.classList.remove('full-pulse');
        void machine.offsetWidth;
        machine.classList.add('full-pulse');
        setPhase('bonus','BONUS');
        audio.bonus();
        scene.bonus();
        logEvent('GAME_EVENT','BONUS_ENTER');
      }, 620);
    } else {
      setTimeout(() => {
        setPhase('bonus','BONUS');
        audio.bonus();
        scene.basicBonus();
        logEvent('GAME_EVENT','BONUS_ENTER_BASIC');
      }, 340);
    }
    setTimeout(endGame, state.mode === 'FULL' ? 2500 : 1600);
  }
};

class NextGenScene extends Phaser.Scene {
  constructor(){ super('nextgen'); this.reels=[]; this.particles=[]; }
  create(){
    state.scene = this;
    this.cameras.main.setBackgroundColor('#03060b');
    this.buildStage();
    this.buildReels();
    this.buildCharacter();
    this.buildMechanism();
    this.buildParticlePool();
    this.applyMode(state.mode);
    this.startIdleMotion();
    logEvent('SCENE','READY');
  }
  buildStage(){
    const g=this.add.graphics();
    g.fillStyle(0x050a12,1).fillRect(0,0,390,440);
    g.fillStyle(0x0b1523,1).fillRect(0,0,390,265);
    g.fillStyle(0x111827,1).fillRect(0,265,390,175);
    for(let i=0;i<9;i++){
      const x=i*48-14; const h=52+(i%4)*18;
      g.fillStyle(i%2?0x15263a:0x0f1f31,1).fillRect(x,235-h,36,h);
      g.fillStyle(0x67819b,.22).fillRect(x+8,205-h,5,8);
      g.fillStyle(0x67819b,.14).fillRect(x+22,219-h,4,6);
    }
    this.skyGlow=this.add.circle(305,62,44,0x5b7faa,.10);
    this.title=this.add.text(195,22,'NOCTURNE // DISTRICT 01',{fontFamily:'monospace',fontSize:'11px',color:'#70829b',letterSpacing:2}).setOrigin(.5);
    this.message=this.add.text(195,236,'静かな通常時',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'14px',color:'#aeb9ca'}).setOrigin(.5);
    this.vignette=this.add.rectangle(195,132,390,265,0x000000,.05);
  }
  buildReels(){
    const y=342;
    const frame=this.add.rectangle(195,y,330,124,0xc5cad3).setStrokeStyle(5,0x272c35);
    frame.setAlpha(.96);
    for(let i=0;i<3;i++){
      const x=92+i*103;
      const well=this.add.rectangle(x,y,94,108,0xf3f4f6).setStrokeStyle(2,0x69717d);
      const top=this.add.text(x,y-31,'◆',{fontFamily:'serif',fontStyle:'bold',fontSize:'26px',color:'#20242a'}).setOrigin(.5);
      const mid=this.add.text(x,y,'7',{fontFamily:'Georgia',fontStyle:'bold',fontSize:'36px',color:'#9a101e'}).setOrigin(.5);
      const bot=this.add.text(x,y+35,'BAR',{fontFamily:'sans-serif',fontStyle:'bold',fontSize:'18px',color:'#191b20'}).setOrigin(.5);
      const shade=this.add.rectangle(x,y,94,108,0x08111d,.08);
      this.reels.push({well,top,mid,bot,shade,x,spinning:false,phase:0});
    }
    this.reelShade=this.add.rectangle(195,y,330,124,0x001020,.06);
  }
  buildCharacter(){
    this.hero=this.add.container(196,152);
    this.heroAura=this.add.circle(0,0,58,0x6a89ff,.06);
    this.coat=this.add.polygon(0,38,[-30,-8,30,-8,42,55,-42,55],0x1a2330).setStrokeStyle(2,0x66748a,.7);
    this.torso=this.add.rectangle(0,14,36,72,0x273244);
    this.head=this.add.circle(0,-42,21,0xc3c8d1);
    this.hair=this.add.polygon(-2,-58,[-22,8,-10,-11,2,-17,11,-10,22,7,8,1],0x202833);
    this.eye=this.add.rectangle(7,-43,9,3,0x8adfff);
    this.arm=this.add.rectangle(30,18,12,54,0x202b39).setAngle(-18);
    this.weapon=this.add.rectangle(43,-1,7,58,0x8390a0).setAngle(-18);
    this.hero.add([this.heroAura,this.coat,this.torso,this.head,this.hair,this.eye,this.arm,this.weapon]);
  }
  buildMechanism(){
    this.mecha=this.add.container(195,72);
    const core=this.add.rectangle(0,0,84,14,0x151b25).setStrokeStyle(2,0x5b6677);
    const wingL=this.add.polygon(-52,0,[0,-8,34,-2,34,8,0,14],0x2a3340).setOrigin(.5);
    const wingR=this.add.polygon(52,0,[0,-8,-34,-2,-34,8,0,14],0x2a3340).setOrigin(.5);
    const lens=this.add.circle(0,0,7,0x6889b8,.35);
    this.mecha.add([wingL,wingR,core,lens]);
    this.mecha.setY(50).setAlpha(.35);
  }
  buildParticlePool(){
    for(let i=0;i<42;i++){
      const p=this.add.circle(Math.random()*390,80+Math.random()*175,1+Math.random()*1.8,0x9acbff,.06);
      p.baseX=p.x; p.baseY=p.y; this.particles.push(p);
    }
  }
  startIdleMotion(){
    this.tweens.add({targets:this.hero,scaleY:{from:1,to:1.012},y:{from:152,to:150.5},duration:1400,yoyo:true,repeat:-1,ease:'Sine.InOut'});
    this.tweens.add({targets:this.hair,angle:{from:-1.5,to:1.8},duration:1900,yoyo:true,repeat:-1,ease:'Sine.InOut'});
    this.time.addEvent({delay:2800,loop:true,callback:()=>{this.eye.setScale(1,.18);this.time.delayedCall(95,()=>this.eye.setScale(1,1));}});
    this.particles.forEach((p,i)=>this.tweens.add({targets:p,y:p.y-18-(i%5)*4,alpha:{from:.025,to:.14},duration:1800+(i%7)*170,yoyo:true,repeat:-1,delay:(i%9)*120,ease:'Sine.InOut'}));
  }
  applyMode(mode){
    this.particles.forEach(p=>p.setVisible(mode==='FULL'));
    this.heroAura.setVisible(mode==='FULL');
    this.mecha.setVisible(mode==='FULL');
    this.message.setText(mode==='FULL'?'静かな通常時':'通常状態');
  }
  resetRound(){
    this.cameras.main.resetFX(); this.cameras.main.setZoom(1); this.cameras.main.centerOn(195,220);
    this.hero.setScale(1).setAngle(0).setX(196); this.heroAura.setScale(1).setAlpha(.06);
    this.eye.setFillStyle(0x8adfff); this.skyGlow.setAlpha(.10).setScale(1);
    this.mecha.setY(50).setAlpha(.35); this.title.setText('NOCTURNE // DISTRICT 01').setColor('#70829b');
    this.message.setFontSize(14).setColor('#aeb9ca').setText(state.mode==='FULL'?'静かな通常時':'通常状態');
    this.reelShade.setFillStyle(0x001020,.06);
    this.reels.forEach(r=>{r.spinning=false;r.mid.setText('7').setY(342).setAlpha(1);r.top.setY(311).setAlpha(1);r.bot.setY(377).setAlpha(1);r.shade.setFillStyle(0x08111d,.08);});
  }
  beginSpin(){
    this.reels.forEach((r,i)=>{r.spinning=true;r.phase=i*.8;});
    this.message.setText('');
    this.reelShade.setFillStyle(0x001020,.16);
  }
  update(time,delta){
    this.reels.forEach((r,i)=>{
      if(!r.spinning)return;
      r.phase += delta*(state.mode==='FULL'?.030:.022);
      const wob=Math.sin(r.phase)*11;
      r.mid.setY(342+wob).setAlpha(.58+.25*Math.abs(Math.sin(r.phase*.7)));
      r.top.setY(311+wob*.65); r.bot.setY(377+wob*.72);
      r.shade.setFillStyle(0x08111d,.10+.10*Math.abs(Math.sin(r.phase)));
    });
  }
  stopReel(i){
    const r=this.reels[i]; r.spinning=false;
    const settle=state.mode==='FULL'?105:40;
    this.tweens.add({targets:[r.mid,r.top,r.bot],y:'+=7',duration:settle*.45,ease:'Quad.Out',yoyo:true,onComplete:()=>{r.mid.setY(342).setAlpha(1);r.top.setY(311);r.bot.setY(377);}});
    if(state.mode==='FULL') this.cameras.main.shake(42,.0016);
  }
  cameraPush(zoom,duration){this.cameras.main.zoomTo(zoom,duration,'Sine.easeOut');}
  characterLean(){this.tweens.add({targets:this.hero,x:201,angle:1.2,duration:210,yoyo:true,ease:'Sine.InOut'});}
  omenOne(){
    this.message.setText('…何かが違う').setColor('#b7cfff');
    this.tweens.add({targets:this.skyGlow,alpha:.025,scale:.72,duration:190});
    this.tweens.add({targets:this.heroAura,alpha:.14,scale:1.25,duration:220,yoyo:true});
    this.cameras.main.shake(85,.002);
  }
  omenTwo(){
    this.message.setText('気配が、近い').setColor('#d6e3ff');
    this.tweens.add({targets:this.hero,scaleX:1.045,scaleY:1.045,duration:150,yoyo:true,ease:'Back.Out'});
    this.tweens.add({targets:this.weapon,angle:-7,duration:180,ease:'Cubic.Out'});
    this.particles.forEach((p,i)=>{if(i%2===0)this.tweens.add({targets:p,alpha:.34,duration:100,yoyo:true,delay:(i%6)*14});});
  }
  judgement(full){
    this.message.setText('');
    if(!full){this.cameras.main.flash(80,210,220,255);return;}
    this.cameras.main.shake(115,.0045);
    this.tweens.add({targets:this.vignette,alpha:.72,duration:85});
    this.tweens.add({targets:this.title,alpha:.15,duration:90});
    this.particles.forEach(p=>p.setAlpha(.01));
  }
  mechanismDrop(){
    this.mecha.setAlpha(.85);
    this.tweens.add({targets:this.mecha,y:88,duration:150,ease:'Back.Out'});
    this.cameras.main.shake(90,.004);
    logEvent('VISUAL','MECHANISM_DROP');
  }
  hitRelease(){
    this.tweens.add({targets:this.vignette,alpha:.05,duration:70});
    this.cameras.main.flash(90,220,235,255);
    this.tweens.add({targets:this.hero,scale:1.19,duration:170,ease:'Back.Out'});
    this.tweens.add({targets:this.heroAura,scale:3.5,alpha:.42,duration:360,ease:'Cubic.Out'});
    this.eye.setFillStyle(0xffffff);
    this.particles.forEach((p,i)=>{p.setAlpha(.18);this.tweens.add({targets:p,x:195+(p.x-195)*1.55,y:142+(p.y-142)*1.35,alpha:0,duration:330,delay:(i%7)*8,ease:'Cubic.Out'});});
    logEvent('VISUAL','HIT_RELEASE');
  }
  bonus(){
    this.title.setAlpha(1).setText('PROTOCOL ACCEPTED').setColor('#fff4c2');
    this.message.setText('BONUS').setFontSize(36).setColor('#fff9dc');
    this.cameras.main.zoomTo(1.045,250,'Sine.easeOut');
    this.tweens.add({targets:this.mecha,alpha:1,scale:1.08,duration:220,yoyo:true,repeat:1});
    this.tweens.add({targets:this.reelShade,alpha:.02,duration:180});
  }
  basicBonus(){
    this.title.setText('WIN').setColor('#ffffff');
    this.message.setText('BONUS').setFontSize(32).setColor('#ffffff');
    this.cameras.main.flash(100,255,255,255);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width:390,
  height:440,
  parent:'game',
  backgroundColor:'#03060b',
  scene:NextGenScene,
  render:{antialias:true,pixelArt:false,roundPixels:false},
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}
});

function prepareStops(){
  stopBtns.forEach((b,i)=>b.disabled=i!==0);
  state.stopIndex=0;
}
function disableStops(){stopBtns.forEach(b=>b.disabled=true);}
function endGame(){
  state.spinning=false; state.bet=0; disableStops(); startBtn.disabled=true; betBtn.disabled=false;
  setPhase('idle','BETしてください');
  state.scene?.resetRound();
  logEvent('ROUND','READY_NEXT_GAME');
}

betBtn.addEventListener('click', async ()=>{
  if(state.spinning || state.bet || state.credit<3)return;
  await audio.unlock();
  state.credit-=3; state.bet=3; updateCredit(); audio.bet();
  betBtn.disabled=true; startBtn.disabled=false; setPhase('bet','3 BET — START');
  logEvent('GAME_EVENT','BET_3');
});

startBtn.addEventListener('click',()=>{
  if(!state.bet || state.spinning || !state.scene)return;
  state.spinning=true; startBtn.disabled=true; prepareStops();
  TIMELINE.leverOn(state.scene);
});

stopBtns.forEach((btn,i)=>btn.addEventListener('click',()=>{
  if(!state.spinning || i!==state.stopIndex)return;
  btn.disabled=true;
  const fn=TIMELINE[`stop${i+1}`]; fn(state.scene);
  state.stopIndex++;
  if(state.stopIndex<3) stopBtns[state.stopIndex].disabled=false;
  else disableStops();
}));

basicBtn.addEventListener('click',()=>setMode('BASIC'));
fullBtn.addEventListener('click',()=>setMode('FULL'));
audioToggle.addEventListener('click',async()=>{
  await audio.unlock(); state.audioEnabled=!state.audioEnabled;
  audioToggle.textContent=state.audioEnabled?'AUDIO ON':'AUDIO OFF';
  logEvent('AUDIO',state.audioEnabled?'ON':'OFF');
});

(function fpsLoop(now){
  const dt=now-state.lastFrame; state.lastFrame=now;
  if(dt>0 && dt<200){state.fpsSamples.push(1000/dt);if(state.fpsSamples.length>30)state.fpsSamples.shift();}
  if(state.fpsSamples.length){const avg=state.fpsSamples.reduce((a,b)=>a+b,0)/state.fpsSamples.length;$('#fps').textContent=`${Math.round(avg)} FPS`;}
  requestAnimationFrame(fpsLoop);
})(performance.now());

updateCredit();
logEvent('LAB','BOOT');

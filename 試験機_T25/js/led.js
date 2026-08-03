"use strict";

/* =========================================================
   led.js
   遊創舎 LED演出制御ライブラリ
========================================================= */

const LED = (() => {

  const stateClasses = [
    "led-idle",
    "led-bet",
    "led-start",
    "led-stop-1",
    "led-stop-2",
    "led-stop-3",
    "led-big",
    "led-super",
    "led-off"
  ];

  const classMap = {
    idle:  "led-idle",
    bet:   "led-bet",
    start: "led-start",
    stop1: "led-stop-1",
    stop2: "led-stop-2",
    stop3: "led-stop-3",
    big:   "led-big",
    super: "led-super",
    off:   "led-off"
  };

  const labelMap = {
    idle:  "LED確認：待機・呼吸発光",
    bet:   "LED確認：BET・色変化",
    start: "LED確認：START・ランニング",
    stop1: "LED確認：STOP①・減光",
    stop2: "LED確認：STOP②・半減光",
    stop3: "LED確認：STOP③・消灯寸前",
    big:   "LED確認：BIG・全体連動",
    super: "LED確認：SUPER・左右逆走",
    off:   "LED確認：全消灯"
  };

  const demoSteps = [
    { name: "idle",  duration: 4000 },
    { name: "bet",   duration: 4000 },
    { name: "start", duration: 5000 },
    { name: "stop1", duration: 3000 },
    { name: "stop2", duration: 3000 },
    { name: "stop3", duration: 3000 },
    { name: "big",   duration: 5000 },
    { name: "super", duration: 5000 },
    { name: "off",   duration: 3000 }
  ];

  let demoTimer = null;
  let demoIndex = 0;
  let demoRunning = false;

  function getMachine() {
    return document.getElementById("machine");
  }

  function getMessage() {
    return document.getElementById("message");
  }

  function clearState() {
    const machine = getMachine();

    if (!machine) return;

    machine.classList.remove(...stateClasses);
  }

  function play(name, updateMessage = true) {
    const machine = getMachine();

    if (!machine) {
      console.warn("LED: #machine が見つかりません");
      return;
    }

    const className = classMap[name];

    if (!className) {
      console.warn(`LED: 未登録の演出です: ${name}`);
      return;
    }

    clearState();

    /*
      同じ演出を連続して呼んだ場合でも
      アニメーションを先頭から再生する。
    */
    void machine.offsetWidth;

    machine.classList.add(className);

    if (updateMessage) {
      const message = getMessage();

      if (message && labelMap[name]) {
        message.textContent = labelMap[name];
      }
    }
  }

  function stopDemo() {
    demoRunning = false;
    demoIndex = 0;

    if (demoTimer !== null) {
      window.clearTimeout(demoTimer);
      demoTimer = null;
    }
  }

  function runNextStep() {
    if (!demoRunning) return;

    const step = demoSteps[demoIndex];

    play(step.name, true);

    demoTimer = window.setTimeout(() => {
      demoIndex++;

      if (demoIndex >= demoSteps.length) {
        demoIndex = 0;
      }

      runNextStep();
    }, step.duration);
  }

  function demo() {
    stopDemo();

    demoRunning = true;
    demoIndex = 0;

    runNextStep();
  }

  function off() {
    stopDemo();
    play("off");
  }

  function idle() {
    stopDemo();
    play("idle");
  }

  return {
    play,
    demo,
    stopDemo,
    off,
    idle,

    /*
      後から確認や設定変更に使えるよう公開。
    */
    demoSteps
  };

})();

/* =========================================================
   初期デモ
========================================================= */

window.addEventListener("load", () => {

  /*
    main.js の初期化完了後に開始するため、
    0.8秒待ってからLEDデモを自動再生。
  */

  window.setTimeout(() => {
    LED.demo();
  }, 800);

});
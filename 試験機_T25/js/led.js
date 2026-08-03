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

  /*
    デモ番号順。
    今後追加するときは、この配列へ追加する。
  */
  const demoSteps = [
    { number: "001", name: "idle",  duration: 4000 },
    { number: "002", name: "bet",   duration: 4000 },
    { number: "003", name: "start", duration: 5000 },
    { number: "004", name: "stop1", duration: 3000 },
    { number: "005", name: "stop2", duration: 3000 },
    { number: "006", name: "stop3", duration: 3000 },
    { number: "007", name: "big",   duration: 5000 },
    { number: "008", name: "super", duration: 5000 },
    { number: "009", name: "off",   duration: 3000 }
  ];

  let selectedIndex = 0;
  let demoMode = false;

  /*
    自動デモ用。
    今回は画面から自動起動しないが、
    LED.demo() で呼び出せる状態は残す。
  */
  let autoTimer = null;
  let autoIndex = 0;
  let autoRunning = false;

  function getMachine() {
    return document.getElementById("machine");
  }

  function clearState() {
    const machine = getMachine();

    if (!machine) return;

    machine.classList.remove(...stateClasses);
  }

  function play(name) {
    const machine = getMachine();

    if (!machine) {
      console.warn("LED: #machine が見つかりません");
      return false;
    }

    const className = classMap[name];

    if (!className) {
      console.warn(`LED: 未登録の演出です: ${name}`);
      return false;
    }

    clearState();

    /*
      同じ演出でも先頭から再生する。
    */
    void machine.offsetWidth;

    machine.classList.add(className);

    return true;
  }

  function playSelected() {
    const step = demoSteps[selectedIndex];

    if (!step) return;

    play(step.name);
  }

  function select(index) {
    const length = demoSteps.length;

    selectedIndex = ((index % length) + length) % length;

    if (demoMode) {
      playSelected();
    }

    return getSelected();
  }

  function previous() {
    return select(selectedIndex - 1);
  }

  function next() {
    return select(selectedIndex + 1);
  }

  function getSelected() {
    return {
      index: selectedIndex,
      ...demoSteps[selectedIndex]
    };
  }

  function startManualDemo() {
    stopAutoDemo();

    demoMode = true;
    playSelected();

    return true;
  }

  function endManualDemo() {
    demoMode = false;

    /*
      LEDライブラリ側の状態を解除し、
      cabinet.css本来の通常LEDへ戻す。
    */
    clearState();

    return false;
  }

  function toggleManualDemo() {
    return demoMode
      ? endManualDemo()
      : startManualDemo();
  }

  function isDemoMode() {
    return demoMode;
  }

  /* =======================================================
     自動デモ
     ライブラリ機能として保存
  ======================================================= */

  function stopAutoDemo() {
    autoRunning = false;
    autoIndex = 0;

    if (autoTimer !== null) {
      window.clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  function runAutoStep() {
    if (!autoRunning) return;

    const step = demoSteps[autoIndex];

    play(step.name);

    autoTimer = window.setTimeout(() => {
      autoIndex = (autoIndex + 1) % demoSteps.length;
      runAutoStep();
    }, step.duration);
  }

  function demo() {
    stopAutoDemo();

    demoMode = true;
    autoRunning = true;
    autoIndex = 0;

    runAutoStep();
  }

  function off() {
    stopAutoDemo();
    play("off");
  }

  function idle() {
    stopAutoDemo();
    play("idle");
  }

  return {
    play,

    select,
    previous,
    next,
    getSelected,

    startManualDemo,
    endManualDemo,
    toggleManualDemo,
    isDemoMode,

    demo,
    stopDemo: stopAutoDemo,
    off,
    idle,

    demoSteps
  };

})();

/* =========================================================
   デモ操作UI
========================================================= */

window.addEventListener("load", () => {

  const demoModeButton =
    document.getElementById("demoModeButton");

  const demoNumber =
    document.getElementById("demoNumber");

  const demoPrevButton =
    document.getElementById("demoPrevButton");

  const demoNextButton =
    document.getElementById("demoNextButton");

  if (
    !demoModeButton ||
    !demoNumber ||
    !demoPrevButton ||
    !demoNextButton
  ) {
    console.warn("LED: デモ操作UIが見つかりません");
    return;
  }

  function setGameControlsDisabled(disabled) {
    if (disabled) {
      betButton.disabled = true;
      maxBetButton.disabled = true;
      startButton.disabled = true;

      stopButtons.forEach(button => {
        button.disabled = true;
      });

      return;
    }

    /*
      通常ゲームへ戻ったら、
      本来のゲーム状態を再計算する。
    */
    updateUi();
  }

  function updateDemoUi() {
    const selected = LED.getSelected();
    const active = LED.isDemoMode();

    demoNumber.textContent = selected.number;

    demoModeButton.classList.toggle("active", active);
    demoModeButton.setAttribute(
      "aria-pressed",
      String(active)
    );

    demoPrevButton.disabled = !active;
    demoNextButton.disabled = !active;

    setGameControlsDisabled(active);
  }

  demoModeButton.addEventListener("click", () => {
    LED.toggleManualDemo();
    updateDemoUi();
  });

  demoPrevButton.addEventListener("click", () => {
    if (!LED.isDemoMode()) return;

    LED.previous();
    updateDemoUi();
  });

  demoNextButton.addEventListener("click", () => {
    if (!LED.isDemoMode()) return;

    LED.next();
    updateDemoUi();
  });

  /*
    初期状態は通常ゲーム。
    自動デモは開始しない。
  */
  LED.endManualDemo();
  updateDemoUi();

});
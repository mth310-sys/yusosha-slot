import { useEffect, useState } from "react";
import { TopUnit } from "./TopUnit";
import { MainDisplay } from "./MainDisplay";
import { SideMechanism } from "./SideMechanism";
import { ControlDeck } from "./ControlDeck";
import { LowerPanel } from "./LowerPanel";
import { BaseUnit } from "./BaseUnit";
import {
  CABINET,
  MID_LED_COLORS,
  TOP_LED_COLORS,
  type LedMode,
  type LowerMode,
} from "./parts";

export function MachineCabinet() {
  const [sideMode, setSideMode] = useState<LedMode>("normal");
  const [lowerMode, setLowerMode] = useState<LowerMode>("normal");
  const [ledsOn, setLedsOn] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth - 24;
      setScale(Math.min(1, w / CABINET.width));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: CABINET.width * scale, height: CABINET.height * scale }}>
        <div
          className={`cab-root ${ledsOn ? "" : "leds-off"}`}
          style={{ transform: `scale(${scale})` }}
        >
          <div className="cab-shell">
            <div className="cab-stack">
              <TopUnit />
              <MainDisplay />
              <ControlDeck />
              <LowerPanel mode={lowerMode} />
              <BaseUnit />
            </div>

            {(["left", "right"] as const).map((side) => (
              <div key={side} className={`cab-flank ${side}`}>
                <div className="flank-plate shoulder" />
                <div className="flank-plate mid" />
                <div className="flank-plate deck" />
                <div className="flank-plate lower" />
                <div className="flank-shadow a" />
                <div className="flank-shadow b" />
                <div className="flank-shadow c" />
                <div className="flank-shadow d" />
                <div className="flank-gold a cab-gold-mesh" />
                <div className="flank-gold b cab-gold-mesh" />
              </div>
            ))}

            <SideMechanism
              side="left"
              mode={sideMode}
              colors={TOP_LED_COLORS}
              style={{ top: 44, height: 118 }}
            />
            <SideMechanism
              side="right"
              mode={sideMode}
              colors={TOP_LED_COLORS}
              style={{ top: 44, height: 118 }}
            />
            <SideMechanism
              side="left"
              mode={sideMode}
              colors={MID_LED_COLORS}
              style={{ top: 186, height: 126 }}
            />
            <SideMechanism
              side="right"
              mode={sideMode}
              colors={MID_LED_COLORS}
              style={{ top: 186, height: 126 }}
            />
          </div>
        </div>
      </div>

      <div className="debug-panel">
        <button
          className="debug-btn"
          data-active={sideMode === "open"}
          onClick={() => setSideMode(sideMode === "open" ? "normal" : "open")}
        >
          SIDE LEDs: {sideMode === "open" ? "OPEN" : "NORMAL"}
        </button>
        <button
          className="debug-btn"
          data-active={lowerMode === "rainbow"}
          onClick={() => setLowerMode(lowerMode === "rainbow" ? "normal" : "rainbow")}
        >
          LOWER LEDs: {lowerMode === "rainbow" ? "RAINBOW" : "NORMAL"}
        </button>
        <button className="debug-btn" data-active={ledsOn} onClick={() => setLedsOn(!ledsOn)}>
          ALL LEDs: {ledsOn ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}
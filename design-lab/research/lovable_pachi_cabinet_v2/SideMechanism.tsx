import type { CSSProperties } from "react";
import type { LedMode } from "./parts";

type LedColor = { c1: string; c2: string };

interface Props {
  side: "left" | "right";
  mode: LedMode;
  colors: readonly LedColor[];
  style: CSSProperties;
}

export function SideMechanism({ side, mode, colors, style }: Props) {
  return (
    <div className={`side-mech ${side} ${mode === "open" ? "open" : ""}`} style={style}>
      <div className="mech-housing">
        <div className="mech-prism">
          <div className="mech-face cover">
            <span className="cab-bar" />
          </div>
          <div className="mech-face leds">
            {colors.map((c, i) => (
              <span
                key={i}
                className="led"
                style={{ ["--c1" as string]: c.c1, ["--c2" as string]: c.c2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
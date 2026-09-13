import { buildDotMatrix, ringPositions } from "./parts";

const DOTS = buildDotMatrix(17);
const RING = ringPositions(40);

export function TopUnit() {
  return (
    <div className="top-unit">
      <div className="top-corner left" />
      <div className="top-corner right" />
      <div className="top-speaker left" />
      <div className="top-speaker right" />
      <div className="top-crown cab-gold-mesh" />
      <div className="top-plate" />
      <div className="top-brow cab-metal" />
      <div className="top-mesh cab-gold-mesh" />
      <div className="dot-circle">
        <div className="dot-grid">
          {DOTS.map((on, i) => <span key={i} className={`cab-dot ${on ? "on" : ""}`} />)}
        </div>
        <div className="ring-leds">
          {RING.map((p, i) => <span key={i} className="cab-ringdot" style={{ left: p.left, top: p.top, animationDelay: p.delay }} />)}
        </div>
      </div>
      <div className="mini-reels">
        {["7", "★", "7"].map((s, i) => <div key={i} className="mini-reel"><span>{s}</span></div>)}
      </div>
    </div>
  );
}
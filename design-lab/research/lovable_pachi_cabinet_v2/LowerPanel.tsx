import type { LowerMode } from "./parts";

export function LowerPanel({ mode }: { mode: LowerMode }) {
  return (
    <div className={`lower ${mode === "rainbow" ? "rainbow" : ""}`}>
      <span className="lower-bar" />
      <div className="lower-frame">
        <div className="lower-art" />
      </div>
      <span className="lower-bar" />
    </div>
  );
}
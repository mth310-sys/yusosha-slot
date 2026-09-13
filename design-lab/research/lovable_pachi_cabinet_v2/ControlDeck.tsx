import { useState } from "react";

export function ControlDeck() {
  const [pressed, setPressed] = useState<number | null>(null);

  return (
    <div className="deck">
      <div className="deck-lip" />
      <div className="deck-face">
        <div className="deck-side left">
          <span className="deck-mini" />
          <span className="deck-mini" />
        </div>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`stop button ${i + 1}`}
            className={`stop-btn ${pressed === i ? "pressed" : ""}`}
            onPointerDown={() => setPressed(i)}
            onPointerUp={() => setPressed(null)}
            onPointerLeave={() => setPressed(null)}
          />
        ))}
        <div className="deck-side right">
          <span className="coin-slot" />
          <span className="deck-mini" />
        </div>
      </div>
    </div>
  );
}
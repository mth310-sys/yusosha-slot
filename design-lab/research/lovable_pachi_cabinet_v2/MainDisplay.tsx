/** Central large display. Swap the inner content for a real game UI later. */
export function MainDisplay() {
  return (
    <div className="display-wrap">
      <div className="display-bezel">
        <div className="display-black">
          <div className="display-inner">
            <div className="display-rays" />
            <div>
              <div className="display-title">A U R U M</div>
              <div className="display-sub">DUMMY VISUAL LAYER</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
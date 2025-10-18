import React, { useState } from "react";
import { colorMap } from "../data/sareeAddOrFilters.js";
import "../css/colorDrop.css"

function ColorDropdown({ selectedColor, onChange }) {
  const [open, setOpen] = useState(false);
  const [manualColor, setManualColor] = useState("");

  const handleManualChange = () => {
    if (manualColor.trim() !== "") {
      onChange(manualColor.trim()); // allow any typed name
      setManualColor("");
      setOpen(false);
    }
  };

  return (
    <div className="color-dropdown">
      <div
        className="color-selected"
        onClick={() => setOpen(!open)}
      >
        {selectedColor ? (
          <>
            <div
              className="color-box"
              style={{ backgroundColor: colorMap[selectedColor] || manualColor }}
            ></div>
            {selectedColor}
          </>
        ) : (
          "Select Color"
        )}
      </div>

      {open && (
        <div className="color-options">
          {Object.keys(colorMap).map((c) => (
            <div
              key={c}
              className="color-option"
              onClick={() => { onChange(c); setOpen(false); }}
            >
              <div
                className="color-box"
                style={{ backgroundColor: colorMap[c] }}
              ></div>
              {c}
            </div>
          ))}

          {/* Manual input */}
          <div className="manual-color">
            <input
              type="text"
              placeholder="Type color name"
              value={manualColor}
              onChange={(e) => setManualColor(e.target.value)}
            />
            <button type="button" onClick={handleManualChange}>Set</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorDropdown;

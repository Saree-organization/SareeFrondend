import React, { useState } from "react";
import { colorMap } from "../data/sareeAddOrFilters.js";
import "../css/colorDrop.css"

function ColorDropdown({ selectedColor, onChange }) {
  const [open, setOpen] = useState(false);

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
              style={{ backgroundColor: colorMap[selectedColor] }}
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
        </div>
      )}
    </div>
  );
}

export default ColorDropdown;

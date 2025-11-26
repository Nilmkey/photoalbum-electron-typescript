import React, { useState } from "react";

export default function Lightbox({ open, url, onClose }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  if (!open) return null;

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 4));
  };

  const startDrag = (e) => {
    setDragging(true);
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const duringDrag = (e) => {
    if (!dragging || scale === 1) return;
    setPos({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const stopDrag = () => setDragging(false);

  const doubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPos({ x: 0, y: 0 });
    }
  };

  return (
    <div className="lightbox" onClick={onClose}>
      <div
        className="lb-inner"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <button className="close" onClick={onClose}>
          Х
        </button>

        <img
          src={url}
          alt="enlarged"
          onMouseDown={startDrag}
          onMouseMove={duringDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onDoubleClick={doubleClick}
          style={{
            cursor: scale > 1 ? "grab" : "default",
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 0.2s",
          }}
        />
      </div>
    </div>
  );
}

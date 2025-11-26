import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import mock from "../mock-data";

export default function AlbumPage() {
  const { id } = useParams();
  const album = mock.albums.find((a) => a.id == id);

  const [photos, setPhotos] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("albums") || "[]");
    const stored = saved.find((x) => x.id == id);
    return stored ? stored.photos : album.photos;
  });

  const [full, setFull] = useState(null);

  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const resetZoom = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 6));
  };

  const startDrag = (e) => {
    if (scale === 1) return;
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
      resetZoom();
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newList = [...photos, url];
    setPhotos(newList);

    const saved = JSON.parse(localStorage.getItem("albums") || "[]");
    const idx = saved.findIndex((x) => x.id == id);
    if (idx !== -1) {
      saved[idx].photos = newList;
      localStorage.setItem("albums", JSON.stringify(saved));
    }
  };

  return (
    <div className="album-page">
      {full && (
        <div
          className="modal"
          onClick={() => {
            setFull(null);
            resetZoom();
          }}
        >
          <div
            className="lb-inner"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseMove={duringDrag}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            <button
              className="close"
              onClick={() => {
                setFull(null);
                resetZoom();
              }}
            >
              Х
            </button>
            <img
              src={full}
              alt=""
              onMouseDown={startDrag}
              onDoubleClick={doubleClick}
              style={{
                cursor: scale > 1 ? "grab" : "default",
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transition: dragging ? "none" : "transform 0.2s",
                userSelect: "none",
              }}
            />
          </div>
        </div>
      )}

      <Link to="/" className="back">
        ← Назад
      </Link>

      <h1>{album.title}</h1>
      <p>{album.description}</p>

      <h3>Загрузить фото</h3>
      <input type="file" onChange={handleUpload} />

      <div className="photos">
        {photos.map((p, i) => (
          <img
            key={i}
            src={p}
            alt=""
            onClick={() => setFull(p)}
            className="photo-thumb"
          />
        ))}
      </div>
    </div>
  );
}

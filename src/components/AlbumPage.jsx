import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import mock from "../mock-data";

export default function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const album =
    JSON.parse(localStorage.getItem("albums") || "[]").find(
      (a) => a.id == id
    ) || mock.albums.find((a) => a.id == id);

  const [photos, setPhotos] = useState(album.photos);
  const [full, setFull] = useState(null);

  const [filter, setFilter] = useState("none");

  const [showDelete, setShowDelete] = useState(false);

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
    if (scale === 1) setScale(2);
    else resetZoom();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const list = [...photos, url];
    setPhotos(list);

    const saved = JSON.parse(localStorage.getItem("albums") || "[]");
    const idx = saved.findIndex((a) => a.id == id);
    if (idx !== -1) {
      saved[idx].photos = list;
      localStorage.setItem("albums", JSON.stringify(saved));
    }
  };

  function deleteAlbum() {
    const saved = JSON.parse(localStorage.getItem("albums") || "[]");
    const newList = saved.filter((a) => a.id != id);

    localStorage.setItem("albums", JSON.stringify(newList));
    setShowDelete(false);
    navigate("/");
  }
  return (
    <div className="album-page">
      {/* модалка ало*/}
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

            {/* фильтры ало */}
            <div className="filters">
              <button onClick={() => setFilter("none")}>Обычное</button>
              <button onClick={() => setFilter("grayscale(100%)")}>Ч/Б</button>
              <button onClick={() => setFilter("sepia(80%)")}>Сепия</button>
              <button onClick={() => setFilter("contrast(140%)")}>
                Контраст
              </button>
              <button onClick={() => setFilter("brightness(130%)")}>
                Ярче
              </button>
              <button onClick={() => setFilter("blur(2px)")}>Размытие</button>
              <button onClick={() => setFilter("saturate(180%)")}>
                Насыщенно
              </button>
            </div>

            {/* большая картинка ало */}
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
                filter: filter,
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

      {/* удаление альбома только для залогиненных ало */}
      {localStorage.getItem("user") && (
        <button
          onClick={() => {
            if (!confirm("Удалить альбом? Это действие нельзя отменить."))
              return;

            const saved = JSON.parse(localStorage.getItem("albums") || "[]");
            const updated = saved.filter((a) => a.id != id);
            localStorage.setItem("albums", JSON.stringify(updated));

            window.location.href = "/";
          }}
          style={{
            padding: "10px 16px",
            background: "#e53935",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          🗑 Удалить альбом
        </button>
      )}

      {/* загрузка фото ало */}
      {localStorage.getItem("user") ? (
        <>
          <h3>Загрузить фото</h3>
          <input type="file" onChange={handleUpload} />
        </>
      ) : (
        <p style={{ opacity: 0.7, marginTop: "20px" }}>
          🔒 Чтобы загружать фотографии —{" "}
          <Link to="/login">войдите в аккаунт</Link>.
        </p>
      )}

      {/* миниатюры ало */}
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

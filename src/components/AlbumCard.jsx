import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AlbumCard({ album, onOpen }) {
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => (i + 1) % album.photos.length);
  const prev = () =>
    setIdx((i) => (i - 1 + album.photos.length) % album.photos.length);

  return (
    <article className="card">
      <div className="thumb" onClick={() => onOpen(album.photos[idx])}>
        <img src={album.photos[idx]} alt={album.title} loading="lazy" />
      </div>

      <div className="meta">
        <h3>{album.title} </h3>
        <p className="info">
          {album.day}-{album.month}-{album.year}
        </p>
        <p className="desc">{album.description}</p>

        <p className="info">
          Автор: {album.author} · Комната: {album.room}
        </p>

        <div className="controls">
          <button onClick={prev}>‹</button>

          <Link to={`/album/${album.id}`} className="open-album-btn">
            Открыть
          </Link>

          <button onClick={next}>›</button>
        </div>
      </div>
      <Link to={"/test"}>to testpage</Link>
    </article>
  );
}

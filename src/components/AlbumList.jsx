import React from "react";
import AlbumCard from "./AlbumCard";

export default function AlbumList({ albums, onOpen }) {
  if (albums.length === 0)
    return (
      <div className="empty">Ни один альбом не соответствует фильтрам</div>
    );
  return (
    <div className="grid">
      {albums.map((a) => (
        <AlbumCard key={a.id} album={a} onOpen={onOpen} />
      ))}
    </div>
  );
}

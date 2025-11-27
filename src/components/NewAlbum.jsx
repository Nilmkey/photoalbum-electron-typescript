import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewAlbum() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [author, setAuthor] = useState("");
  const [room, setRoom] = useState("Nature");
  const [cover, setCover] = useState(null);

  const navigate = useNavigate();

  function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCover(url);
  }

  function handleCreate(e) {
    e.preventDefault();

    const newAlbum = {
      title,
      description: desc,
      room,
      photos: cover ? [cover] : [],
    };

    // const res = fetch() // сюда фетч запрос ебнуть на создание альбома

    localStorage.setItem("albums", JSON.stringify(saved));

    navigate("/");
  }

  return (
    <div className="create-album-wrapper">
      <div className="create-album-card">
        <h1>Создать новый альбом</h1>

        <form onSubmit={handleCreate} className="album-form">
          <input
            type="text"
            placeholder="Название альбома"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Описание"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Автор"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="Nature">Природа</option>
            <option value="City">Города</option>
            <option value="Travel">Путешествия</option>
            <option value="Gaming">Гейминг</option>
            <option value="Memes">Мемы</option>
            <option value="Other">Другое</option>
          </select>

          <div className="cover-upload">
            <label>Загрузить обложку</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
          </div>

          {cover && <img src={cover} className="cover-preview" />}

          <button type="submit" className="create-btn">
            Создать
          </button>
        </form>
      </div>
    </div>
  );
}

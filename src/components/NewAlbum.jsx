import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NewAlbum() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [author, setAuthor] = useState("");
  const [room, setRoom] = useState(""); // пользователь вводит категорию
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

    // загружаем список сохранённых альбомов
    const saved = JSON.parse(localStorage.getItem("albums") || "[]");

    // проверка существует ли альбом с таким названием
    const exists = saved.some(
      (a) => a.title.trim().toLowerCase() === title.trim().toLowerCase()
    );

    if (exists) {
      alert("Альбом с таким названием уже существует!");
      return;
    }

    // создаём новый альбом
    const newAlbum = {
      id: Date.now(),
      title: title.trim(),
      description: desc.trim(),
      author: author.trim() || "Не указан",
      room: room.trim() || "Без категории",
      photos: cover ? [cover] : [],
      year: new Date().getFullYear(),
    };

    saved.push(newAlbum);
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

          <input
            type="text"
            placeholder="Категория / комната"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          />

          <div className="cover-upload">
            <label>Загрузить обложку</label>
            <input type="file" accept="image/*" onChange={handleCoverUpload} />
          </div>

          {cover && <img src={cover} className="cover-preview" />}

          <button type="submit" className="create-btn">
            Создать
          </button>

          <Link to="/" className="back">
            ← Назад
          </Link>
        </form>
      </div>
    </div>
  );
}

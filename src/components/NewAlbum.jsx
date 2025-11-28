import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NewAlbum() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [author, setAuthor] = useState("");
  const [room, setRoom] = useState(""); // пользователь вводит категорию
  const [cover, setCover] = useState(null);
  const getCookies = window.electronAPI.getCookie;

  const navigate = useNavigate();

  async function handleCreate(e) {
    e.preventDefault();
    try {
      // 1. собираем FormData для backend
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("author", author || "Не указан");
      formData.append("room", room || "Без категории");

      // если есть файл — добавляем (это важно!)
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formData.append("cover", fileInput.files[0]);
      }

      // 2. проверяем токен
      const token = await getCookies("token");
      if (!token) throw new Error("пользователь не авторизирован");

      // 3. отправляем запрос на backend
      const res = await fetch("http://localhost:3050/api/create-album", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          // !!! НЕ добавляй "Content-Type": multipart сам !!!
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Ошибка сервера");

      alert("Альбом создан!");

      // 4. редирект
      navigate("/");
    } catch (err) {
      alert("Ошибка создания альбома: " + err.message);
    }
  }
  function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCover(url);
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

          <select name="room" id="">
            <option value="Memes">Мемы</option>
            <option value="City">Города</option>
            <option value="Travel">Путешествия</option>
            <option value="Nature">Природа</option>
            <option value="Gaming">Гейминг</option>
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

          <Link to="/" className="back">
            ← Назад
          </Link>
        </form>
      </div>
    </div>
  );
}

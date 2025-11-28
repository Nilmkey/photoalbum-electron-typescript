import React, { useState, useMemo, useEffect } from "react";
import FilterBar from "./components/FilterBar";
import AlbumList from "./components/AlbumList";
import Lightbox from "./components/Lightbox";
import mock from "./mock-data";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SwitchTheme from "./components/SwitchTheme";

export default function App() {
  async function removeCookies(name) {
    const removeToken = await window.electronAPI.removeCookie({ name });
    return removeToken;
  }
  const [albums, setAlbums] = useState([]);
  const [filters, setFilters] = useState({
    yearFrom: "",
    yearTo: "",
    author: "",
    room: "",
    query: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [lightbox, setLightbox] = useState({ open: false, url: "" });

  async function load() {
    try {
      const res = await fetch("http://localhost:3050/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response object:", res);

      const data = await res.json();
      console.log("Raw data:", data);

      // Проверяем, что пришёл массив
      if (!Array.isArray(data)) {
        console.warn("Ожидался массив, но пришло:", data);
        setAlbums({ albums: [] });
        return;
      }

      // Преобразуем массив в нужный формат
      const parsedAlbums = data.map((album) => ({
        id: album.id,
        room: album.room,
        title: album.title,
        description: album.description,
        year: new Date(album.createdAt).getFullYear(),
        month: new Date(album.createdAt).getMonth() + 1,
        day: new Date(album.createdAt).getDate(),
        author: album.author,
        photos: album.photos || [], // если сервер возвращает пустой массив или undefined
      }));

      // Оборачиваем в объект с ключом albums
      setAlbums(parsedAlbums);

      console.log("Parsed albums:", { albums: parsedAlbums });
    } catch (e) {
      console.error("Fetch error:", e);
      setAlbums({ albums: [] });
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return albums
      .filter((a) => {
        if (filters.room && a.room !== filters.room) return false;

        if (
          filters.author &&
          a.author.toLowerCase().indexOf(filters.author.toLowerCase()) === -1
        )
          return false;

        if (
          filters.query &&
          (a.title + a.description)
            .toLowerCase()
            .indexOf(filters.query.toLowerCase()) === -1
        )
          return false;

        const albumDate = new Date(a.year, a.month - 1, a.day);

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (albumDate < fromDate) return false;
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          if (albumDate > toDate) return false;
        }

        return true;
      })

      .sort((a, b) => {
        const da = new Date(a.year, a.month - 1, a.day);
        const db = new Date(b.year, b.month - 1, b.day);

        if (sortBy === "newest") return db - da;
        if (sortBy === "oldest") return da - db;
        if (sortBy === "author") return a.author.localeCompare(b.author);

        return 0;
      });
  }, [albums, filters, sortBy]);

  return (
    <div className="app">
      <header>
        <h1>Фотоальбомы</h1>
        <button onClick={load}>refresh</button>
        <p className="subtitle">Комнаты, альбомы и фотогалерея</p>
        <div className="auth">
          <div className="auth">
            {!localStorage.getItem("user") ? (
              <>
                <Link to="/login" className="btn btn-primary">
                  Войти
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Регистрация
                </Link>
              </>
            ) : (
              <button
                className="btn"
                onClick={async () => {
                  localStorage.removeItem("user");
                  window.location.reload();
                  await removeCookies("token");
                }}
              >
                Выйти
              </button>
            )}
          </div>
        </div>
      </header>
      <SwitchTheme />

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        rooms={[...new Set(albums.map((a) => a.room))]}
      />

      <div className="top-controls">
        {localStorage.getItem("user") && (
          <Link to="/create" className="create-btn">
            + Создать альбом
          </Link>
        )}
      </div>

      <main>
        <AlbumList
          albums={filtered}
          onOpen={(url) => setLightbox({ open: true, url })}
        />
      </main>

      <Lightbox
        open={lightbox.open}
        url={lightbox.url}
        onClose={() => setLightbox({ open: false, url: "" })}
      />
    </div>
  );
}

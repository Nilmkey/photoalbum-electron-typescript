import React, { useState, useMemo } from "react";
import FilterBar from "./components/FilterBar";
import AlbumList from "./components/AlbumList";
import Lightbox from "./components/Lightbox";
import mock from "./mock-data";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SwitchTheme from "./components/SwitchTheme";

export default function App() {
  const [filters, setFilters] = useState({
    yearFrom: "",
    yearTo: "",
    author: "",
    room: "",
    query: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [lightbox, setLightbox] = useState({ open: false, url: "" });

  const albums = mock.albums;

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
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload();
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

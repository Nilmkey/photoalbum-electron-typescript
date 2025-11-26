import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./components/login/login.jsx";
import Register from "./components/register/register.jsx";
import AlbumPage from "./components/AlbumPage.jsx";
import NewAlbum from "./components/NewAlbum.jsx";
import TestPage from "./components/TestPage.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/album/:id" element={<AlbumPage />} />
        <Route path="/create" element={<NewAlbum />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

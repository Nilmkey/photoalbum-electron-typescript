import React, { useState } from "react";

export default function AuthUploadPage() {
  // ======= AUTH STATES =======
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function setCookies(name, value, expiredIn = 60 * 60 * 0.5) {
    const cookie = { name, value, expiredIn };
    await window.electronAPI.setCookie(cookie);
    return cookie;
  }

  async function getCookies(name) {
    fetch("http://localhost:3051/"); // твой workaround для electron cookie
    const token = await window.electronAPI.getCookie(name);
    return token;
  }

  async function handle() {
    try {
      const res = await fetch("http://localhost:3050/api/albums", {
        method: "POST",
      });
      data = res.json;
      setMsg(data);
    } catch (e) {
      setMsg("err0r fetch" + e);
    }
  }

  //удаление куков
  async function removeCookies(name) {
    const removeToken = await window.electronAPI.removeCookie(name);
    return removeToken;
  }

  // ЛОГИН
  async function login() {
    const res = await fetch("http://localhost:3050/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    const data = await res.json();
    await setCookies("token", data.JWTtoken, data.expiredIn);
    return data;
  }

  // РЕГИСТРАЦИЯ
  async function register() {
    const res = await fetch("http://localhost:3050/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    return res.json();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Loading...");

    try {
      const data = mode === "login" ? await login() : await register();
      setMsg(JSON.stringify(data, null, 2));
    } catch (err) {
      setMsg("Error: " + err.message);
    }
  }

  // ======= UPLOAD + ALBUM STATES =======
  const [file, setFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [room, setRoom] = useState("");
  const [cover, setCover] = useState(null);

  // ======= FILE UPLOAD =======
  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Выберите файл!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3050/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Файл загружен");
      setUploadedPath(data.filePath);
    } catch (err) {
      setMessage("Ошибка загрузки: " + err.message);
    }
  };

  // ======= ALBUM CREATE =======
  const handleCreateAlbum = async () => {
    if (!title || !room || !cover) {
      setMessage("Заполните title, room и выберите cover");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("room", room);
    formData.append("cover", cover);

    try {
      const token = await getCookies("token");
      if (!token) throw new Error("пользователь не авторизирован");
      //go to login page
      console.log(token);
      const res = await fetch("http://localhost:3050/api/create-album", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "Альбом создан!");
    } catch (err) {
      setMessage("Ошибка создания альбома: " + err.message);
    }
  };

  // =====================================================================
  // ============================== UI ==================================
  // =====================================================================

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* ================= AUTH ================= */}
      <h2>{mode === "login" ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button
          type="submit"
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "login" ? "signup" : "login");
          setMsg("");
        }}
        style={{ width: "100%", padding: 8 }}
      >
        {mode === "login" ? "No account? Register" : "Have account? Login"}
      </button>

      {msg && (
        <pre
          style={{
            marginTop: 10,
            background: "#eee",
            padding: 10,
            whiteSpace: "pre-wrap",
          }}
        >
          {msg}
        </pre>
      )}

      <button
        onClick={async () => {
          const res = await fetch("http://localhost:3050/api/set-cookies");
          const data = await res.json();
          await setCookies(data.name, data.value);
        }}
      >
        Set Cookie
      </button>

      <button
        onClick={async () => {
          const token = await getCookies("token");
          console.log("token:", token);

          const resVerifyToken = await fetch(
            "http://localhost:3050/api/verify-token",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await resVerifyToken.json();
          setMsg(JSON.stringify(data, null, 2));
        }}
      >
        Get & Verify Token
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* ================= FILE UPLOAD ================= */}
      <h3>Тест загрузки файла</h3>

      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ display: "block", marginTop: 10 }}
      >
        Загрузить файл
      </button>

      {uploadedPath && (
        <div>
          <p>Загруженный файл:</p>
          <img
            src={`http://localhost:3050${uploadedPath}`}
            style={{ width: 200 }}
          />
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      {/* ================= ALBUM CREATE ================= */}
      <h3>Создание альбома</h3>

      <input
        type="text"
        placeholder="Название альбома"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        type="text"
        placeholder="ID комнаты (room)"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <p>Обложка альбома:</p>
      <input
        type="file"
        onChange={(e) => setCover(e.target.files[0])}
        style={{ marginBottom: 10 }}
      />

      <button onClick={handleCreateAlbum}>Создать альбом</button>

      {message && <p>{message}</p>}

      <button onClick={handle}>fff</button>
    </div>
  );
}

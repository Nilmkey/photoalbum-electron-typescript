import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedPath, setUploadedPath] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Выберите файл!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // "photo" — имя поля для Multer

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

  return (
    <div
      style={{ maxWidth: 400, margin: "50px auto", fontFamily: "sans-serif" }}
    >
      <h2>Тест загрузки файлов</h2>

      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ display: "block", marginTop: 10 }}
      >
        Загрузить
      </button>

      {message && <p>{message}</p>}

      {uploadedPath && (
        <div>
          <p>Загруженный файл:</p>
          <img
            src={`http://localhost:3050${uploadedPath}`}
            alt="uploaded"
            style={{ width: 200, marginTop: 10 }}
          />
        </div>
      )}
    </div>
  );
}

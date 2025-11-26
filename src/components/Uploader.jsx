import React, { useRef } from "react";

export default function Uploader({ onUpload }) {
  const inputRef = useRef();

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onUpload(url);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onUpload(url);
  }

  return (
    <div
      className="upload-drop-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
    >
      <p>Перетащи изображение сюда или нажми для выбора</p>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileSelect}
        hidden
      />
    </div>
  );
}

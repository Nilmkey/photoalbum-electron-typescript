import React from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./login.module.css";

export default function Login() {
  const navigate = useNavigate();

  // функция для установки куки через электрон апи
  async function setCookies(name, value, expiredIn = 60 * 60 * 0.5) {
    const cookie = { name, value, expiredIn };
    console.log("SET COOKIE:", cookie);
    await window.electronAPI.setCookie(cookie);
  }

  // функция логина
  async function login(username, password) {
    const res = await fetch("http://localhost:3050/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();
    console.log("SERVER LOGIN DATA:", data);

    // если токен есть - ставим куки
    if (data.JWTtoken) {
      await setCookies("token", data.JWTtoken, data.expiredIn);
    }

    return data;
  }

  // отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await login(username, password);

      if (result.JWTtoken) {
        localStorage.setItem("user", JSON.stringify({ name: username }));
        navigate("/");
      } else {
        alert("Ошибка: " + (result.message || "Неверный логин или пароль"));
      }
    } catch (err) {
      console.error("Ошибка логина:", err);
      alert("Не удалось подключиться к серверу");
    }
  };

  return (
    <div className={style["auth-container"]}>
      <form onSubmit={handleSubmit} className={style["auth-box"]}>
        <h2>Вход</h2>

        <input name="email" type="text" placeholder="Логин" required />
        <input name="password" type="password" placeholder="Пароль" required />

        <button type="submit" className={style["btn-primary"]}>
          Войти
        </button>

        <p className={style["auth-link"]}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>

        <Link className={style["auth-link"]} to="/">
          Назад
        </Link>
      </form>
    </div>
  );
}

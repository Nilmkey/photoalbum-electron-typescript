import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./register.module.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    password: "",
    password2: "",
  });

  async function registerUser(username, password) {
    const res = await fetch("http://localhost:3050/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    return res.json(); // backend должен вернуть JSON
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      alert("Пароли не совпадают!");
      return;
    }

    try {
      const result = await registerUser(form.name, form.password);

      console.log("ответ:", result);

      if (result.success) {
        // можешь сохранять токен, если backend его даёт
        localStorage.setItem("user", JSON.stringify({ name: form.name }));
        navigate("/");
      } else {
        alert("Ошибка: " + result.message);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка регистрации");
    }
  };

  return (
    <div className={style["auth-container"]}>
      <div className={style["auth-box"]}>
        <h2>Регистрация</h2>

        <form onSubmit={handleSubmit}>
          <label>Логин</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Введите логин"
            required
          />

          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            required
          />

          <label>Подтверждение пароля</label>
          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            placeholder="Повторите пароль"
            required
          />

          <button type="submit" className={style["btn-primary"]}>
            Зарегистрироваться
          </button>
        </form>

        <p className={style["auth-link"]}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>

        <Link className={style["auth-link"]} to="/">
          Назад
        </Link>
      </div>
    </div>
  );
}

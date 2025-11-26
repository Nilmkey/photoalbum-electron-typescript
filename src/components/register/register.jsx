import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./register.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

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

    const data = {
      username: form.name,
      email: form.email,
      password: form.password,
    };

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Ответ сервера:", result);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ name: form.name }));

        navigate("/");
      } else {
        alert("Ошибка регистрации: " + result.message);
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      alert("Ошибка при отправке данных");
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

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Введите email"
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

          <button type="submit">Зарегистрироваться</button>
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

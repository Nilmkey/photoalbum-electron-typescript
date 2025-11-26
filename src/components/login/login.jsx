import React from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const data = { username: email, password };

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    console.log(result);

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify({ name: email }));
      navigate("/");
    } else {
      alert("Ошибка входа: " + result.message);
    }
  };

  return (
    <div className={style["auth-container"]}>
      <form onSubmit={handleSubmit} className={style["auth-box"]}>
        <h2>Вход</h2>
        <input name="email" type="text" placeholder="Логин" required />
        <input name="password" type="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
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

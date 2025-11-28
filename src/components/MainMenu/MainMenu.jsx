import React from "react";
import { Link } from "react-router-dom";
import style from "./MainMenu.css";

export default function MainMenu() {
  const categories = [
    {
      id: 1,
      title: "Школа",
      image:
        "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Семья",
      image:
        "https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww",
    },
    {
      id: 3,
      title: "Путешествия",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Животные",
      image:
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className={style["menu"]}>
      <h1 className={style["menu-title"]}>Выбери категорию</h1>

      <div className={style["menu-grid"]}>
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.id}`}
            key={cat.id}
            className={style["menu-card"]}
          >
            <img src={cat.image} alt="" />
            <div className="menu-card-title">{cat.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

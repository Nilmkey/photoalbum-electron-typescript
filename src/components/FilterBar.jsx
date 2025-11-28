import React from "react";

export default function FilterBar({
  filters,
  setFilters,
  sortBy,
  setSortBy,
  rooms,
}) {
  const onChange = (e) =>
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <section className="filterbar">
      <div className="row">
        <div className="testpenis">
          <input
            placeholder="Поиск по названию/описанию"
            name="query"
            value={filters.query}
            onChange={onChange}
          />
          <input
            placeholder="Автор"
            name="author"
            value={filters.author}
            onChange={onChange}
          />
        </div>
        <select name="room" value={filters.room} onChange={onChange}>
          <option value="">Все</option>
          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <label className="row">
          Сортировка:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Новейшие</option>
            <option value="oldest">Старейшие</option>
            <option value="author">От А до Я (По авторам)</option>
          </select>
        </label>
      </div>
    </section>
  );
}

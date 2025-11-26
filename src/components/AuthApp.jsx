import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function setCookies(name, value, expiredIn = 60 * 60 * 0.5) {
    const cookie = { name, value, expiredIn };
    console.log("TOKEN BEFORE SETCOOKIE: ", cookie);
    await window.electronAPI.setCookie(cookie);
    return cookie;
  }

  async function getCookies(name) {
    fetch("http://localhost:3051/");
    const token = await window.electronAPI.getCookie(name);
    return token;
  }

  // ---------- ОТДЕЛЬНЫЕ ФУНКЦИИ ----------

  async function login() {
    const res = await fetch("http://localhost:3050/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    const resToken = setCookies("token", data.JWTtoken, data.expiredIn);
    return resToken;
  }

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

  // ----------------------------------------

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

  return (
    <div
      style={{ maxWidth: 300, margin: "40px auto", fontFamily: "sans-serif" }}
    >
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
        <p
          style={{
            marginTop: 15,
          }}
        >
          {msg}
        </p>
      )}

      <button
        onClick={async () => {
          const res = await fetch("http://localhost:3050/api/set-cookies");
          const data = await res.json();
          setCookies(data.name, data.value);
        }}
      >
        set
      </button>

      <button
        onClick={async () => {
          const token = await getCookies("token");
          console.log("token:", token);

          const resVerifyToken = await fetch(
            "http://localhost:3050/api/verify-token",
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await resVerifyToken.json();

          console.log("verify response:", data);

          setMsg(JSON.stringify(data, null, 2));
        }}
      >
        get
      </button>
    </div>
  );
}

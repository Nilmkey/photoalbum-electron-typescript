import { app, BrowserWindow, session, ipcMain } from "electron";
import startServer from "./src/backend/app.ts";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

dotenv.config();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setTitle("Фото-альбом");
  win.setMenuBarVisibility(false);
  win.loadURL("http://localhost:3051");
};

try {
  app
    .whenReady()
    .then(async () => {
      await startServer();
    })
    .then(() => {
      createWindow();
    });
} catch (e) {
  console.log(e);
}

ipcMain.handle("get-cookie", async (event, name: string) => {
  try {
    const cookies = await session.defaultSession.cookies.get({
      url: "http://localhost:3050",
      name,
    });

    if (cookies.length === 0) {
      console.log("Cookie not found:", name);
      return null;
    }

    return cookies[0].value;
  } catch (e) {
    console.error("GET COOKIE ERROR:", e);
    return null;
  }
});

ipcMain.handle(
  "set-cookie",
  async (
    _event,
    cookie: { name: string; value: string; expiredIn?: number }
  ) => {
    try {
      console.log("SETTING COOKIE:", cookie);

      if (!cookie.value || cookie.value.trim() === "") {
        throw new Error("Cookie value is empty — Electron will reject it.");
      }

      await session.defaultSession.cookies.set({
        url: "http://localhost:3050",
        name: cookie.name,
        value: cookie.value,
        expirationDate: cookie.expiredIn
          ? Math.floor(Date.now() / 1000) + cookie.expiredIn
          : Math.floor(Date.now() / 1000) + 60 * 60 * 0.5,
      });

      console.log("Cookie saved");
      return true;
    } catch (e) {
      console.error("SET COOKIE ERROR:", e);
      return false;
    }
  }
);

ipcMain.handle("remove-cookie", async (_event, cookie: { name: string }) => {
  try {
    await session.defaultSession.cookies.remove(
      "http:/localhost:3050",
      cookie.name
    );
    console.log(cookie.name + " was remove");
    return true;
  } catch (e) {
    console.log("REMOVE COOKIE ERROR" + e);
    return false;
  }
});

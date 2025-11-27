const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getCookie: (name) => ipcRenderer.invoke("get-cookie", name),
  setCookie: (cookie) => ipcRenderer.invoke("set-cookie", cookie),
  removeCookie: (name) => ipcRenderer.invoke("remove-cookie", name),
});

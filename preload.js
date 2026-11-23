const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("fakechat", {
  setHotkeys: keys => ipcRenderer.invoke("set-hotkeys", keys),
  setOnTop: on => ipcRenderer.invoke("set-on-top", on),
  giveBackFocus: () => ipcRenderer.invoke("give-back-focus"),
  onHype: fn => ipcRenderer.on("hype", (_e, i) => fn(i)),
});

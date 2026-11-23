const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 820,
    minWidth: 300,
    minHeight: 400,
    title: "FakeChat",
    backgroundColor: "#141517",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // 게임 창이 앞에 있어도 채팅이 멈추지 않게
      backgroundThrottling: false,
      // 단축키로 터진 후원 알림도 클릭 없이 소리가 나게
      autoplayPolicy: "no-user-gesture-required",
    },
  });
  win.loadFile(path.join(__dirname, "index.html"));
}

// 채팅창이 단축키 목록을 보내면 전역으로 등록하고, 성공 여부를 돌려준다
ipcMain.handle("set-hotkeys", (_e, keys) => {
  globalShortcut.unregisterAll();
  return keys.map((key, i) => {
    if (!key) return false;
    try {
      return globalShortcut.register(key, () => win && win.webContents.send("hype", i));
    } catch (err) {
      return false;
    }
  });
});

// 채팅창 버튼을 누른 뒤 포커스를 바로 뒤에 있던 창(게임)에 돌려줘서 게임 조작이 끊기지 않게 한다.
// (창을 아예 포커스 불가로 만들면 Windows에서 작업 표시줄·최소화·닫기가 안 돼서 이 방식을 쓴다)
ipcMain.handle("give-back-focus", () => {
  if (win.isFocused()) win.blur();
});

ipcMain.handle("set-on-top", (_e, on) => {
  win.setAlwaysOnTop(on, "screen-saver");
  return win.isAlwaysOnTop();
});

app.whenReady().then(createWindow);
app.on("will-quit", () => globalShortcut.unregisterAll());
app.on("window-all-closed", () => app.quit());

import { app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import "./api/server.ts";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 800,
    height: 600,
    alwaysOnTop: true,
  });

  mainWindow.setMenu(null);

  if (isProd) {
    await mainWindow.loadURL("app://./main.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/main`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

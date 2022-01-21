import { app } from "electron";
import { join, resolve } from "path";

export function getAppPath() {
  if (app) {
    return app.getAppPath();
  }
  return resolve(join(__dirname, "../../../"));
}

export const staticDir = join(getAppPath(), "python", "static");

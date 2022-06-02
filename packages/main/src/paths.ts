import { app } from "electron";
import { join, resolve } from "path";

function isPackaged() {
  return app && app.isPackaged;
}
class Paths {
  port = 3030;

  get appPath() {
    if (app) {
      return app.getAppPath();
    }
    // For jest test runner
    return resolve(join(__dirname, "../../../"));
  }

  get python() {
    return join(this.appPath, "python");
  }

  get static() {
    return join(this.python, "static");
  }

  get public() {
    return join(
      this.appPath,
      "packages",
      "main",
      isPackaged() ? "dist" : "public"
    );
  }

  get favicon() {
    return join(this.public, "favicon.ico");
  }

  getAbsolutePathFromPython(filename: string) {
    return join(this.python, filename);
  }

  pythonFilenameToUrl(filename: string) {
    if (filename.indexOf("/static/") < 0) {
      throw new Error(
        `Can't extract url to filename '${filename}'. Not in /static/.`
      );
    }
    const parts = filename.split("/");
    while (parts[0] !== "static") {
      parts.shift();
    }
    parts.shift(); // Remove static
    return `//localhost:${paths.port}/${parts.join("/")}`;
  }
}

const paths = new Paths();

export default paths;

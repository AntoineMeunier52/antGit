import fs from "fs";
import path from "path";

export default class Workspace {
  constructor(pathName) {
    this.pathName = pathName;
    this.IGNORE = [".", "..", ".git"];
  }

  listFiles() {
    return fs
      .readdirSync(this.pathName)
      .filter((files) => !this.IGNORE.includes(files));
  }

  readFile(pathDir) {
    return fs.readFileSync(path.join(this.pathName, pathDir));
  }
}

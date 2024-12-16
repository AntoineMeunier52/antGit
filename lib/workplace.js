import fs from "fs";
import path from "path";

export default class Workspace {
  constructor(pathName) {
    this.pathName = pathName;
    this.IGNORE = [".", "..", ".git"];
  }

  listFiles(dir = this.pathName) {
    const filename = fs
      .readdirSync(dir)
      .filter((files) => !this.IGNORE.includes(files));

    return filename.flatMap((name) => {
      const pathFile = path.join(dir, name);
      if (fs.lstatSync(pathFile).isDirectory()) {
        return this.listFiles(pathFile);
      } else {
        return path.relative(this.pathName, pathFile);
      }
    });
  }

  readFile(pathDir) {
    return fs.readFileSync(path.join(this.pathName, pathDir));
  }

  statFile(pathFile) {
    return fs.lstatSync(path.join(this.pathName, pathFile));
  }
}

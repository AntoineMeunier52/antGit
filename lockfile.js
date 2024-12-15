import fs from "fs";
import path from "path";

class MissingParentError extends Error {
  constructor(message) {
    super(message);
    this.name = "MissingParentError";
  }
}

class NoPermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = "NoPermissionError";
  }
}

class StaleLockError extends Error {
  constructor(message) {
    super(message);
    this.name = "StaleLockError";
  }
}

export default class Lockfile {
  constructor(pathName) {
    this.pathName = pathName;
    this.lockPath = path.format({
      ...path.parse(pathName),
      base: undefined,
      ext: ".lock",
    });
    // or can use filePath.replace(/\.[^/.]+$/, ".lock");
    this.lock = undefined;
  }

  holdForUpdate() {
    if (!this.lock) {
      try {
        this.lock = fs.openSync(this.lockPath, "wx+");
        return true;
      } catch (err) {
        if (err.code === "EEXIST") {
          return false;
        } else if (err.code === "ENOENT") {
          throw new MissingParentError(err.message);
        } else if (err.code === "EACCES") {
          throw new NoPermissionError(err.message);
        } else {
          throw err;
        }
      }
    }
  }

  write(str) {
    this.raiseOnStaleLock();
    fs.writeFileSync(this.lock, str);
  }

  commit() {
    this.raiseOnStaleLock();

    fs.closeSync(this.lock);
    fs.renameSync(this.lockPath, this.pathName);
    this.lock = undefined;
  }

  raiseOnStaleLock() {
    if (!this.lock) {
      throw new StaleLockError(`Not holding lock on file: ${this.lockPath}`);
    }
  }
}

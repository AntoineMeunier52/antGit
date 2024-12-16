import fs from "fs";
import path from "path";

import Lockfile from "./lockfile.js";

class LockDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = "LockDeniedError";
  }
}

export default class Refs {
  constructor(pathname) {
    this.pathname = pathname;
  }

  updateHead(oid) {
    //fs.writeFileSync(this.headPath(), oid);
    const lockfile = new Lockfile(this.headPath());

    if (!lockfile.holdForUpdate()) {
      throw new LockDeniedError(
        `Could not acquire lock on file: ${this.headPath()}`
      );
    }

    lockfile.write(oid);
    lockfile.write("\n");
    lockfile.commit();
  }

  headPath() {
    return path.join(this.pathname, "HEAD");
  }

  readHead() {
    if (
      fs.existsSync(this.headPath()) &&
      fs.lstatSync(this.headPath()).isFile()
    ) {
      return fs.readFileSync(this.headPath(), "utf-8").trim();
    }
    return undefined;
  }
}

import path from "path";
import crypto from "crypto";

import Lockfile from "./lockfile.js";
import EntryIndex from "./index/entryIndex.js";

export default class Index {
  constructor(pathName) {
    this.lockfile = new Lockfile(pathName);
    this.entries = {};
  }

  add(pathName, oid, stat) {
    const entry = EntryIndex.create(pathName, oid, stat);
    this.entries[pathName.toString()] = entry;
  }

  writeUpdate() {
    if (!this.lockfile.holdForUpdate()) return false;

    this.beginWrite();

    const header = Buffer.concat([
      Buffer.from("DIRC"),
      Buffer.alloc(4).writeUInt32BE(2),
      Buffer.alloc(4).writeUInt32BE(Object.keys(this.entries).length),
    ]);

    console.log("add Header:", header);
    this.write(header);

    Object.entries(this.entries).forEach(([key, entry]) => {
      console.log(entry.toString());
      this.write(entry.toString());
    });

    this.finishWrite();

    return true;
  }

  beginWrite() {
    this.digest = crypto.createHash("sha1");
  }

  write(data) {
    this.lockfile.write(data);
    this.digest.update(data);
  }

  finishWrite() {
    this.lockfile.write(this.digest.digest());
    this.lockfile.commit();
  }
}

import fs from "fs";
import path from "path";

export default class Tree {
  constructor(entries) {
    this.entries = entries;
  }

  ENTRY_FORMAT = { modeLength: 7, nameTerminator: "\0", oidLength: 40 };
  MODE = "100644";

  #oid = undefined;

  get oid() {
    return this.#oid;
  }

  set oid(value) {
    this.#oid = value;
  }

  type() {
    return "tree";
  }

  toStr() {
    this.entries.sort((a, b) => a.name.localeCompare(b.name));

    const formattedEntries = this.entries.reduce((acc, current) => {
      const { name, oid } = current;
      const entry = Buffer.concat([
        Buffer.from(`${this.MODE} ${name}\0`, "utf-8"),
        Buffer.from(oid, "hex"),
      ]);

      return Buffer.concat([acc, entry]);
    }, Buffer.alloc(0));

    return formattedEntries;
  }
}

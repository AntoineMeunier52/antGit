import fs from "fs";
import path from "path";

import Entry from "../entry.js";

export default class Tree {
  ENTRY_FORMAT = "Z*H40";

  constructor() {
    this.entries = {};
  }

  #oid = undefined;

  get oid() {
    return this.#oid;
  }

  set oid(value) {
    this.#oid = value;
  }

  static build(entries) {
    entries = entries.sort((a, b) => a.name.localeCompare(b.name));
    const root = new Tree();

    entries.forEach((entry) => {
      let pathEn = entry.name.split(path.sep);
      let name = pathEn.pop();
      root.addEntry(pathEn, name, entry);
    });

    return root;
  }

  addEntry(pathEn, name, entry) {
    if (pathEn.length === 0) {
      this.entries[name] = entry;
    } else {
      const tree =
        this.entries[pathEn[0]] || (this.entries[pathEn[0]] = new Tree());
      tree.addEntry(pathEn.slice(1), name, entry);
    }
  }

  traverse(callback) {
    for (const [name, entry] of Object.entries(this.entries)) {
      if (entry instanceof Tree) {
        entry.traverse(callback);
      }
      callback(this);
    }
  }

  mode() {
    return Entry.DIRECTORY_MODE;
  }

  type() {
    return "tree";
  }

  toStr() {
    const entriesArray = Object.entries(this.entries);
    const getEntries = entriesArray.map(([name, entry]) => {
      const modeAndName = `${entry.mode()} ${name}\0`;
      const oidBuffer = Buffer.from(entry.oid, "hex");

      return Buffer.concat([Buffer.from(modeAndName, "utf-8"), oidBuffer]);
    });
    return Buffer.concat(getEntries);
  }
}

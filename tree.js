import fs from "fs";
import path from "path";

import Entry from "./entry.js";

export default class Tree {
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
      console.log("treeBuild:", pathEn, name, entry);
      root.addEntry(pathEn, name, entry);
    });

    return root;
  }

  addEntry(pathEn, name, entry) {
    if (pathEn.length === 0) {
      this.entries[name] = entry;
      console.log("add entry tree if:", this.entries);
    } else {
      const tree =
        this.entries[pathEn[0]] || (this.entries[pathEn[0]] = new Tree());
      console.log("add entry tree else:");
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
    this.entries.sort((a, b) => a.name.localeCompare(b.name));

    const formattedEntries = this.entries.reduce((acc, current) => {
      const { name, oid, stat } = current;
      const entry = Buffer.concat([
        Buffer.from(`${stat} ${name}\0`, "utf-8"),
        Buffer.from(oid, "hex"),
      ]);

      return Buffer.concat([acc, entry]);
    }, Buffer.alloc(0));

    return formattedEntries;
  }
}

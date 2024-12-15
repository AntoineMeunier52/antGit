import fs from "fs";
import path from "path";

export default class Tree {
  ENTRY_FORMAT = { modeLength: 7, nameTerminator: "\0", oidLength: 40 };

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

    entries.array.forEach((entry) => {
      let pathEn = entry.name.split(path.sep);
      let name = pathEn.pop();
      console.log("treeBuild:", pathEn, name, entry);
      root.addEntry(pathEn, name, entry);
    });

    return root;
  }

  addEntry(pathEn, name, entry) {
    if (!pathEn) {
      this.entries[name] = entry;
    } else {
      const tree =
        this.entries[pathEn[0]] || (this.entries[pathEn[0]] = new Tree());
      tree.addEntry(pathEn.slice(1), name, entry);
    }
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

import fs from "fs";
import path from "path";

export default class Entry {
  static REGULAR_MODE = "100644";
  static EXECUTABLE_MODE = "100755";
  static DIRECTORY_MODE = "40000";

  constructor(name, oid, stat) {
    this.name = name;
    this.oid = oid;
    this.stat = stat;
  }

  mode() {
    console.log(this.stat.mode & 0o111);
    return (this.stat.mode & 0o111) !== 0
      ? Entry.EXECUTABLE_MODE
      : Entry.REGULAR_MODE;
  }

  //   #name = undefined;
  //   #oid = undefined;

  //   get name() {
  //     return this.#name;
  //   }

  //   set name(value) {
  //     this.#name = value;
  //   }

  //   get oid() {
  //     return this.#oid;
  //   }

  //   set oid(value) {
  //     this.#oid = value;
  //   }
}

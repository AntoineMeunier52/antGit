import fs from "fs";
import path from "path";

export default class Blob {
  constructor(data) {
    this.data = data;
  }

  #oid = undefined;

  get oid() {
    return this.#oid;
  }

  set oid(value) {
    this.#oid = value;
  }

  type() {
    return "blob";
  }

  toStr() {
    return this.data;
  }
}

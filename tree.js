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
    console.log("tree to STR():", this.entries);
    const sortedEntries = this.entries.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // Formater chaque entrée
    // const formattedEntries = sortedEntries.map((entry) => {
    //   // Mode : 7 caractères ASCII remplis d'espaces
    //   const modeBuffer = Buffer.from(
    //     this.MODE.padEnd(this.ENTRY_FORMAT.modeLength, " "),
    //     "ascii"
    //   );

    //   // Nom : UTF-8 suivi d'un caractère nul
    //   const nameBuffer = Buffer.concat([
    //     Buffer.from(entry.name, "utf-8"),
    //     Buffer.from(this.ENTRY_FORMAT.nameTerminator, "ascii"),
    //   ]);

    //   // OID : 40 caractères hexadécimaux
    //   const oidBuffer = Buffer.from(
    //     entry.oid.slice(0, this.ENTRY_FORMAT.oidLength),
    //     "hex"
    //   );

    //   // Concaténer les trois parties
    //   return Buffer.concat([modeBuffer, nameBuffer, oidBuffer]);
    // });

    const formattedEntries = this.entries.reduce((acc, current) => {
      const { name, oid } = current;
      const entry = Buffer.concat([
        Buffer.from(`${this.MODE} ${name}\0`, "utf-8"),
        Buffer.from(oid, "hex"),
      ]);

      return Buffer.concat([acc, entry]);
    }, Buffer.alloc(0));
    console.log(formattedEntries);
    return formattedEntries;
  }
}

import fs from "fs";
import path from "path";
import crypto from "crypto";
import zlib from "zlib";

import Blob from "./database/blob.js";

export default class Database {
  constructor(pathName) {
    this.pathName = pathName;
    this.TEMP_CHARS = [
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // 'a' to 'z'
      ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // 'A' to 'Z'
      ...Array.from({ length: 10 }, (_, i) => String(i)), // '0' to '9'
    ];
  }

  store(object) {
    const content = Buffer.concat([
      Buffer.from(`${object.type()} ${object.toStr().length}\0`),
      object.toStr(),
    ]);

    object.oid = crypto.createHash("sha1").update(content).digest("hex");
    this.writeObject(object.oid, content);
  }

  writeObject(oid, content) {
    const objectPath = path.join(this.pathName, oid.slice(0, 2), oid.slice(2));
    if (fs.existsSync(objectPath)) return;

    const dirname = path.dirname(objectPath);
    const tempPath = path.join(dirname, this.generateTempName());

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    try {
      const compressed = zlib.deflateSync(content, {
        level: zlib.constants.Z_BEST_SPEED,
      });

      fs.writeFileSync(tempPath, compressed);
      fs.renameSync(tempPath, objectPath);
    } catch (err) {
      throw new Error(`Error with the creation of the Blob:\n${err}`);
    }
  }

  generateTempName() {
    const randomString = Array.from(
      { length: 6 },
      () => this.TEMP_CHARS[Math.floor(Math.random() * this.TEMP_CHARS.length)]
    ).join("");

    return `tmp_obj_${randomString}`;
  }
}

import { buffer } from "stream/consumers";

export default class EntryIndex {
  static REGULAR_MODE = 0o1000644;
  static EXECUTABLE_MODE = 0o100755;
  static MAX_PATH_SIZE = 0xfff;

  constructor(
    ctime,
    ctime_nsec,
    mtime,
    mtime_nsec,
    dev,
    ino,
    mode,
    uid,
    gid,
    size,
    oid,
    flags,
    filepath
  ) {
    this.ctime = ctime;
    this.ctime_nsec = ctime_nsec;
    this.mtime = mtime;
    this.mtime_nsec = mtime_nsec;
    this.dev = dev;
    this.ino = ino;
    this.mode = mode;
    this.uid = uid;
    this.gid = gid;
    this.size = size;
    this.oid = oid;
    this.flags = flags;
    this.filepath = filepath;
  }

  static create(pathName, oid, stat) {
    const pathStr = pathName.toString();
    const mode = stat.mode & 0o111 ? this.EXECUTABLE_MODE : this.REGULAR_MODE;
    const flags = Math.min(Buffer.byteLength(pathStr), this.MAX_PATH_SIZE);

    return new EntryIndex(
      Math.floor(stat.ctimeMs / 1000),
      stat.ctimeNs || 0,
      Math.floor(stat.mtimeMs / 1000),
      stat.mtimNs || 0,
      stat.dev,
      stat.ino,
      mode,
      stat.uid,
      stat.gid,
      stat.size,
      oid,
      flags,
      pathStr
    );
  }

  toStr() {
    //format N10H40nZ*
    //N10 means ten 32-bit unsigned big-endian numbers
    //H40 means a 40-character hex string, which will pack down to 20 bytes
    //n means a 16-bit unsigned big-endian number
    //Z* means a null-terminated string
    const ENTRY_BLOCK = 8;
    const bufferParts = [];

    [
      this.ctime,
      this.ctime_nsec,
      this.mtime,
      this.mtime_nsec,
      this.dev,
      this.ino,
      this.mode,
      this.uid,
      this.gid,
      this.size,
    ].forEach((value) => {
      const buf = Buffer.alloc(4);
      buf.writeUInt32BE(value || 0);
      bufferParts.push(buf);
    });

    const oidBuffer = Buffer.from(this.oid || "", "hex");
    bufferParts.push(oidBuffer);

    const flagsBuffer = Buffer.alloc(2);
    flagsBuffer.writeUint16BE(this.flags || 0);
    bufferParts.push(flagsBuffer);

    const pathBuffer = Buffer.from(`${this.filepath || ""}\0`, "utf-8");
    bufferParts.push(pathBuffer);

    let fullBuffer = Buffer.concat(bufferParts);

    const paddingSize = ENTRY_BLOCK - (fullBuffer.length % ENTRY_BLOCK);
    if (paddingSize !== ENTRY_BLOCK) {
      fullBuffer = Buffer.concat([fullBuffer, Buffer.alloc(paddingSize)]);
    }

    return fullBuffer;
  }
}

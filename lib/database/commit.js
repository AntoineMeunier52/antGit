export default class Commit {
  constructor(parent, tree, author, message) {
    this.parent = parent;
    this.tree = tree;
    this.author = author;
    this.message = message;
  }

  type() {
    return "commit";
  }

  toStr() {
    const lines = [];

    lines.push(`tree ${this.tree}`);
    this.parent && lines.push(`parent ${this.parent}`);
    lines.push(`author ${this.author.toStr()}`);
    lines.push(`committer ${this.author.toStr()}`);
    lines.push("");
    lines.push(this.message);

    const line = lines.join("\n");
    return Buffer.from(line, "utf-8");
  }
}

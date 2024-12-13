export default class Commit {
  constructor(tree, author, message) {
    this.tree = tree;
    this.author = author;
    this.message = message;
  }

  type() {
    return "commit";
  }

  toStr() {
    const lines = [
      `tree ${this.tree}`,
      `author ${this.author.toStr()}`,
      `committer ${this.author.toStr()}`,
      "",
      this.message,
    ];

    const line = lines.join("\n");
    return Buffer.from(line, "utf-8");
  }
}

import fs from "fs";
import path from "path";
import Workspace from "./workplace.js";
import Database from "./database.js";
import Blob from "./blob.js";

const command = process.argv[2];
const argument = process.argv.slice(3);

switch (command) {
  case "init":
    cmdInit();
    break;
  case "commit":
    cmdCommit();
    break;
  default:
    throw new Error(`command not found: ${command}`);
}

function cmdInit() {
  let newRepoPath;

  if (argument[0]) {
    newRepoPath = path.join(process.cwd(), argument[0], ".git");
  } else {
    newRepoPath = path.join(process.cwd(), ".git");
  }

  fs.mkdirSync(newRepoPath, { recursive: true });

  ["objects", "refs"].forEach((elem) => {
    fs.mkdirSync(path.join(newRepoPath, elem), { recursive: true });
  });

  console.log(`Initialized empty antGit repo in ${newRepoPath}`);
}

function cmdCommit() {
  const root_path = path.join(process.cwd());
  const git_path = path.join(process.cwd(), ".git");
  const db_path = path.join(process.cwd(), ".git", "objects");

  const workspace = new Workspace(root_path);
  const database = new Database(db_path);

  workspace.listFiles().forEach((pathDir) => {
    let data = workspace.readFile(pathDir);
    let blob = new Blob(data);

    database.store(blob, pathDir);
  });
}

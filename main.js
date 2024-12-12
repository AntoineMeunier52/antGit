import fs from "fs";
import path from "path";

class Workspace {
  constructor(pathName) {
    this.pathName = pathName;
    this.IGNORE = [".", "..", ".git"];
  }

  listFiles() {
    return fs
      .readdirSync(this.pathName)
      .filter((files) => !this.IGNORE.includes(files));
  }
}

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
  console.log(argument[0]);
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

  console.log(root_path);
  const workplace = new Workspace(root_path);
  console.log(workplace);
  console.log(workplace.listFiles());
}

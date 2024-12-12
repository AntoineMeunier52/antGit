import fs from "fs";
import path from "path";

const command = process.argv[2];
const argument = process.argv.slice(3);

switch (command) {
  case "init":
    cmdInit();
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

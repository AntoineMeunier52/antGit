#!/usr/bin/node

import fs from "fs";
import path from "path";
import readline from "readline";

import Workspace from "../lib/workplace.js";
import Database from "../lib/database.js";
import Blob from "../lib/database/blob.js";
import Entry from "../lib/entry.js";
import Tree from "../lib/database/tree.js";
import Author from "../lib/database/author.js";
import Commit from "../lib/database/commit.js";
import Refs from "../lib/refs.js";
import Index from "../lib/index.js";

const command = process.argv[2];
const argument = process.argv.slice(3);

switch (command) {
  case "init":
    cmdInit();
    break;
  case "commit":
    cmdCommit();
    break;
  case "add":
    cmdAdd();
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
  const refs = new Refs(git_path);

  const entries = workspace.listFiles().map((pathDir) => {
    let data = workspace.readFile(pathDir);
    let blob = new Blob(data);

    database.store(blob);

    let stat = workspace.statFile(pathDir);

    return new Entry(pathDir, blob.oid, stat);
  });

  const root = Tree.build(entries);
  //here all is ok
  root.traverse((tree) => database.store(tree));

  //const tree = new Tree(entries);
  //database.store(tree);

  const parent = refs.readHead();
  const name =
    process.env.GIT_AUTHOR_NAME ||
    (() => {
      throw new Error("GIT_AUTHOR_NAME is required");
    });
  const email =
    process.env.GIT_AUTHOR_EMAIL ||
    (() => {
      throw new Error("GIT_AUTHOR_EMAIL is required");
    });

  const author = new Author(name, email, new Date());
  const message = fs.readFileSync(0, "utf-8");

  const commit = new Commit(parent, root.oid, author, message);
  database.store(commit);

  refs.updateHead(commit.oid);

  const isRoot = parent === undefined ? "(root-commit)" : "";

  console.log(`[${isRoot} ${commit.oid}] ${message.split("\n")[0]}`);
}

function cmdAdd() {
  const rootPath = path.join(process.cwd());
  const gitPath = path.join(process.cwd(), ".git");

  const workspace = new Workspace(rootPath);
  const database = new Database(path.join(gitPath, "objects"));
  const index = new Index(path.join(gitPath, "index"));

  const addFile = path.relative(rootPath, process.argv[3]);
  const data = workspace.readFile(addFile);
  const stat = workspace.statFile(addFile);

  const blob = new Blob(data);
  database.store(blob);
  index.add(path, blob.oid, stat);

  index.writeUpdate();
}

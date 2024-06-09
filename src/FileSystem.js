const File = require("./File");
const Directory = require("./Directory");
const fs = require("fs");
class FileSystem {
  constructor() {
    this.root = new Directory("/");
    this.currentDirectory = this.root;
    this.pathStack = [];
  }

  mkdir(path) {
    const dirs = path.split("/").filter(Boolean);
    let current = this._resolveDirectory(dirs.slice(0, -1).join("/"));
    const newDirName = dirs[dirs.length - 1];
    if (current.get(newDirName)) {
      throw new Error(`Directory ${newDirName} already exists`);
    }
    const newDir = new Directory(newDirName);
    current.add(newDir);
  }

  cd(path) {
    if (path === "/" || path === "~") {
      this.currentDirectory = this.root;
      this.pathStack = [];
    } else if (path === "..") {
      if (this.pathStack.length > 0) {
        this.pathStack.pop();
        console.log("root", this.root);
        this.currentDirectory = this.pathStack.reduce(
          (dir, part) => dir.get(part),
          this.root
        );
      }
    } else {
      const dirs = path.split("/").filter(Boolean);
      let current = this.currentDirectory;
      for (const dir of dirs) {
        current = current.get(dir);
        if (!current || !(current instanceof Directory)) {
          throw new Error(`Directory not found: ${path}`);
        }
      }
      this.pathStack = this.pathStack.concat(dirs);
      this.currentDirectory = current;
    }
  }

  ls(path = "") {
    let current = this.currentDirectory;
    if (path) {
      const dirs = path.split("/").filter(Boolean);
      for (const dir of dirs) {
        current = current.get(dir);
        if (!current || !(current instanceof Directory)) {
          throw new Error(`Directory not found: ${path}`);
        }
      }
    }
    return current.list();
  }

  cat(filePath) {
    const file = this._resolveFile(filePath);
    if (!file) {
      throw new Error(`File not found: ${filePath}`);
    }
    return file.content;
  }

  touch(filePath) {
    const [dirPath, fileName] = this._splitPath(filePath);
    const dir = this._resolveDirectory(dirPath);
    if (!dir) {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    if (!dir.get(fileName)) {
      dir.add(new File(fileName));
    }
  }

  echo(text, filePath) {
    const [dirPath, fileName] = this._splitPath(filePath);
    const dir = this._resolveDirectory(dirPath);
    if (!dir) {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    let file = dir.get(fileName);
    if (!file) {
      file = new File(fileName);
      dir.add(file);
    }
    file.content = text;
  }

  mv(srcPath, destPath) {
    const [srcDirPath, srcName] = this._splitPath(srcPath);
    const srcDir = this._resolveDirectory(srcDirPath);
    const item = srcDir.get(srcName);

    if (!item) {
      throw new Error(`File/Directory not found: ${srcPath}`);
    }

    const [destDirPath, destName] = this._splitPath(destPath);
    const destDir = this._resolveDirectory(destDirPath);
    if (!destDir) {
      throw new Error(`Directory not found: ${destDirPath}`);
    }

    srcDir.remove(srcName);
    item.name = destName || srcName;
    destDir.add(item);
  }

  cp(srcPath, destPath) {
    const [srcDirPath, srcName] = this._splitPath(srcPath);
    const srcDir = this._resolveDirectory(srcDirPath);
    const item = srcDir.get(srcName);

    if (!item) {
      throw new Error(`File/Directory not found: ${srcPath}`);
    }

    const [destDirPath, destName] = this._splitPath(destPath);
    const destDir = this._resolveDirectory(destDirPath);
    if (!destDir) {
      throw new Error(`Directory not found: ${destDirPath}`);
    }

    // Clone the item while preserving the prototype
    let copy;
    if (item instanceof File) {
      copy = new File(destName || srcName);
      copy.content = item.content;
    } else if (item instanceof Directory) {
      copy = new Directory(destName || srcName);
      this._copyDirectoryContents(item, copy);
    }

    destDir.add(copy);
  }

  rm(path) {
    const [dirPath, name] = this._splitPath(path);
    const dir = this._resolveDirectory(dirPath);
    if (!dir || !dir.get(name)) {
      throw new Error(`File/Directory not found: ${path}`);
    }
    dir.remove(name);
  }

  saveState(filePath) {
    const state = JSON.stringify({
      root: this.root,
      currentDirectory: this.currentDirectory,
      pathStack: this.pathStack,
    });
    // Extract directory path from filePath
    const directoryPath = filePath.substring(0, filePath.lastIndexOf("/"));
    // Create the directory if it doesn't exist
    fs.mkdirSync(directoryPath, { recursive: true });
    fs.writeFileSync(filePath, state);
  }

  loadState(filePath) {
    const state = fs.readFileSync(filePath, "utf8");
    const { root, currentDirectory, pathStack } = JSON.parse(state);

    this.root = this._deserializeDirectory(root);
    this.currentDirectory = this._deserializeDirectory(currentDirectory);
    this.pathStack = pathStack;
  }

  _splitPath(path) {
    const parts = path.split("/").filter(Boolean);
    const name = parts.pop();
    const dirPath = parts.join("/");
    return [dirPath, name];
  }

  _resolveDirectory(path) {
    if (!path) return this.currentDirectory;
    const dirs = path.split("/").filter(Boolean);
    let current = this.root;
    for (const dir of dirs) {
      current = current.get(dir);
      if (!current || !(current instanceof Directory)) {
        return null;
      }
    }
    return current;
  }

  _resolveFile(path) {
    const [dirPath, fileName] = this._splitPath(path);
    const dir = this._resolveDirectory(dirPath);
    if (!dir) return null;
    const file = dir.get(fileName);
    if (!file || !(file instanceof File)) {
      return null;
    }
    return file;
  }

  _copyDirectoryContents(srcDir, destDir) {
    for (const [name, content] of Object.entries(srcDir.contents)) {
      let copy;
      if (content instanceof File) {
        copy = new File(name);
        copy.content = content.content;
      } else if (content instanceof Directory) {
        copy = new Directory(name);
        this._copyDirectoryContents(content, copy);
      }
      destDir.add(copy);
    }
  }

  _deserializeDirectory(data) {
    const directory = new Directory(data.name);
    for (const [name, content] of Object.entries(data.contents)) {
      if (content.contents) {
        directory.add(this._deserializeDirectory(content));
      } else {
        console.log("content", content);
        const file = new File(name);
        file.content = content.content;
        directory.add(file);
      }
    }
    return directory;
  }
}

module.exports = FileSystem;

const fs = require('fs');
const path = require('path');
const FileSystem = require('../src/FileSystem');

describe('FileSystem', () => {
  let fileSystem;

  beforeEach(() => {
    fileSystem = new FileSystem();
  });

  afterEach(() => {
    const stateFilePath = path.join(__dirname, 'testState.json');
    if (fs.existsSync(stateFilePath)) {
      fs.unlinkSync(stateFilePath);
    }
  });

  test('should create directories correctly', () => {
    fileSystem.mkdir('/dir1');
    expect(fileSystem.ls('/')).toContain('dir1');
  });

  test('should navigate directories correctly', () => {
    fileSystem.mkdir('/dir1');
    fileSystem.cd('/dir1');
    expect(fileSystem.currentDirectory.name).toBe('dir1');
  });

  test('should list directory contents correctly', () => {
    fileSystem.mkdir('/dir1');
    fileSystem.mkdir('/dir2');
    expect(fileSystem.ls('/')).toEqual(expect.arrayContaining(['dir1', 'dir2']));
  });

  test('should create and read files correctly', () => {
    fileSystem.touch('/file1.txt');
    fileSystem.echo('Hello, world!', '/file1.txt');
    expect(fileSystem.cat('/file1.txt')).toBe('Hello, world!');
  });

  test('should move files correctly', () => {
    fileSystem.mkdir('/dir1'); // Create the destination directory
    fileSystem.touch('/file1.txt');
    fileSystem.mv('/file1.txt', '/dir1/file2.txt');
    expect(fileSystem.ls('/dir1')).toContain('file2.txt');
    expect(fileSystem.ls('/')).not.toContain('file1.txt');
  });

  test('should copy files correctly', () => {
    fileSystem.touch('/file1.txt');
    fileSystem.echo('Hello, world!', '/file1.txt');
    fileSystem.cp('/file1.txt', '/file2.txt');
    expect(fileSystem.ls('/')).toContain('file2.txt');
    expect(fileSystem.cat('/file2.txt')).toBe('Hello, world!');
  });

  test('should copy directories correctly', () => {
    fileSystem.mkdir('/dir1');
    fileSystem.touch('/dir1/file1.txt');
    fileSystem.echo('Hello, directory!', '/dir1/file1.txt');
    fileSystem.cp('/dir1', '/dir2');
    expect(fileSystem.ls('/')).toContain('dir2');
    expect(fileSystem.ls('/dir2')).toContain('file1.txt');
    expect(fileSystem.cat('/dir2/file1.txt')).toBe('Hello, directory!');
  });

  test('should remove files correctly', () => {
    fileSystem.touch('/file1.txt');
    fileSystem.rm('/file1.txt');
    expect(fileSystem.ls('/')).not.toContain('file1.txt');
  });

  test('should remove directories correctly', () => {
    fileSystem.mkdir('/dir1');
    fileSystem.rm('/dir1');
    expect(fileSystem.ls('/')).not.toContain('dir1');
  });

  test('should save and load state correctly', () => {
    // Create a directory and a file, and add content to the file
    fileSystem.mkdir('/dir1');
    fileSystem.touch('/dir1/file1.txt');
    fileSystem.echo('Hello, state!', '/dir1/file1.txt');

    // Save the state to a temporary file
    const stateFilePath = path.join(__dirname, 'testState.json');
    fileSystem.saveState(stateFilePath);

    // Load the state from the temporary file
    const loadedFileSystem = new FileSystem();
    loadedFileSystem.loadState(stateFilePath);

    // Verify that the loaded state matches the saved state
    expect(loadedFileSystem.ls('/')).toContain('dir1');
    expect(loadedFileSystem.ls('/dir1')).toContain('file1.txt');
    expect(loadedFileSystem.cat('/dir1/file1.txt')).toBe('Hello, state!');
});
});

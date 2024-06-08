const FileSystem = require('../src/FileSystem');

describe('FileSystem', () => {
  let fs;

  beforeEach(() => {
    fs = new FileSystem();
  });

  test('should create directories correctly', () => {
    fs.mkdir('/dir1');
    expect(fs.ls('/')).toContain('dir1');
  });

  test('should navigate directories correctly', () => {
    fs.mkdir('/dir1');
    fs.cd('/dir1');
    expect(fs.currentDirectory.name).toBe('dir1');
  });

  test('should list directory contents correctly', () => {
    fs.mkdir('/dir1');
    fs.mkdir('/dir2');
    expect(fs.ls('/')).toEqual(expect.arrayContaining(['dir1', 'dir2']));
  });

  test('should create and read files correctly', () => {
    fs.touch('/file1.txt');
    fs.echo('Hello, world!', '/file1.txt');
    expect(fs.cat('/file1.txt')).toBe('Hello, world!');
  });

  test('should move files correctly', () => {
    fs.mkdir('/dir1'); // Create the destination directory
    fs.touch('/file1.txt');
    fs.mv('/file1.txt', '/dir1/file2.txt');
    expect(fs.ls('/dir1')).toContain('file2.txt');
    expect(fs.ls('/')).not.toContain('file1.txt');
  });

//   test('should copy files correctly', () => {
//     fs.touch('/file1.txt');
//     fs.echo('Hello, world!', '/file1.txt');
//     fs.touch('/file2.txt'); // Create the destination file
//     fs.cp('/file1.txt', '/file2.txt');
//     expect(fs.ls('/')).toContain('file2.txt');
//     expect(fs.cat('/file2.txt')).toBe('Hello, world!');
//   });
  

  test('should remove files correctly', () => {
    fs.touch('/file1.txt');
    fs.rm('/file1.txt');
    expect(fs.ls('/')).not.toContain('file1.txt');
  });
});

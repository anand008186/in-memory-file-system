const readline = require('readline');
const FileSystem = require('./FileSystem');

const fs = new FileSystem();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  const [command, ...args] = line.trim().split(' ');

  try {
    switch (command) {
      case 'mkdir':
        fs.mkdir(args[0]);
        break;
      case 'cd':
        fs.cd(args[0]);
        break;
      case 'ls':
        console.log(fs.ls(args[0]).join('\n'));
        break;
      case 'cat':
        console.log(fs.cat(args[0]));
        break;
      case 'touch':
        fs.touch(args[0]);
        break;
      case 'echo':
        const text = args.slice(0, -2).join(' ').replace(/['"]+/g, '');
        const file = args[args.length - 1];
        fs.echo(text, file);
        break;
      case 'mv':
        fs.mv(args[0], args[1]);
        break;
      case 'cp':
        fs.cp(args[0], args[1]);
        break;
      case 'rm':
        fs.rm(args[0]);
        break;
      case 'exit':
        rl.close();
        return;
      default:
        console.log(`Unknown command: ${command}`);
    }
  } catch (e) {
    console.error(e.message);
  }

  rl.prompt();
}).on('close', () => {
  console.log('Exiting file system.');
  process.exit(0);
});

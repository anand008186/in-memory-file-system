const readline = require('readline');
const FileSystem = require('./FileSystem');

const args = process.argv.slice(2);

let options = {};
if (args.length > 0) {
    try {
        options = JSON.parse(args[0]);
    } catch (e) {
        console.error('Invalid JSON input for options:', e.message);
        process.exit(1);
    }
}


const fs = new FileSystem();
if (options.load_state === 'true' && options.path) {
  try {
    fs.loadState(options.path);
    console.log('State loaded successfully.');
  } catch (e) {
    console.error('Failed to load state:', e.message);
    process.exit(1);
  }
}
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
        const text = args.slice(0, -1).join(' ').replace(/['"]+/g, '');
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
        if (options.save_state === 'true' && options.path) {
          fs.saveState(options.path);
          console.log('State saved successfully.');
          rl.close();
        } else
        if (options.load_state === 'true' && options.path) {
          rl.question('Do you want to save the current state? (yes/no) ', (answer) => {
            if (answer.trim().toLowerCase() === 'yes') {
              fs.saveState(options.path);
              console.log('State saved successfully.');
            } else {
              console.log('State not saved.');
            }
            rl.close(); // Close the readline interface after handling the user input
          });
        } else {
          rl.close();
        }

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

const chalk = require('chalk');
const keypress = require('keypress');
const Omegle = require('omegle-node-fix');
const omegle = new Omegle();

// Init
keypress(process.stdin);
console.log(chalk.green('Welcome to CleverOmegle!'));

// Omegle Events
omegle.on('omerror', (error) => {
    console.log(chalk.red(`Error: ${error}`));
});

omegle.on('gotID', () => {
    console.log(`Connected to the Omegle server...`);
});

omegle.on('waiting', () => {
    console.log('Waiting for a stranger...');
});

omegle.on('connected', () => {
    console.log(`${chalk.green('Connected to a stranger!')} To disconnect at any time, press ESC.\n`);
});

omegle.on('gotMessage', (message) => {
    console.log(`${chalk.red('Stranger:')} ${message}`);
});

omegle.on('connectionDied', () => {
    console.log(chalk.red('Connection died!'));
});

omegle.on('disconnected', () => {
    console.log(`\n${chalk.red('Disconnected!')} Press SPACE to connect to a new stranger, or press Q to quit.`);
});

// Keypress Events
process.stdin.on('keypress', (ch, key) => {
    if (key && key.name === 'escape') {
        if (omegle.connected()) {
            omegle.disconnect();
        }
    }

    if (key && key.name === 'space') {
        if (!omegle.connected()) {
            omegle.connect();
        }
    }

    if (key && key.name === 'q') {
        if (!omegle.connected()) {
            process.exit();
        }
    }

    return;
});
process.stdin.setRawMode(true);
process.stdin.resume();

// Start
omegle.connect();

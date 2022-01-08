const chalk = require('chalk');
const dotenv = require('dotenv');
const keypress = require('keypress');
const Cleverbot = require('cleverbot-node');
const Omegle = require('omegle-node-fix');
const cleverbot = new Cleverbot;
const omegle = new Omegle();
const isDebugMode = false;
let isTyping = false;

// Init
dotenv.config();
cleverbot.configure({ botapi: process.env.CLEVERBOT_KEY });
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
    console.log(`${chalk.green('Connected to a stranger!')} To disconnect at any time, press ESC.`);
    isTyping = false;
});

omegle.on('gotMessage', (message) => {
    console.log(`${chalk.red('Stranger:')} ${message}`);

    prepareCleverbotResponse(message);
});

omegle.on('connectionDied', () => {
    console.log(chalk.red('Connection died!\n'));
});

omegle.on('disconnected', () => {
    console.log(`${chalk.red('Disconnected!')} Press SPACE to connect to a new stranger, or press Q to quit.\n`);
});

// Cleverbot
const prepareCleverbotResponse = (message) => {
    const waitingTime = Math.random() * (3000 - 1000) + 1000;

    if (!isTyping || !omegle.connected()) {
        if (isDebugMode) {
            console.log(`Cleverbot is waiting to reply... (${waitingTime / 1000} seconds)`);
        }
    } else {
        return;
    }

    setTimeout(() => {
        getCleverbotResponse(message);
    }, waitingTime);
};

const getCleverbotResponse = (message) => {
    let cleverbotResponse = '?';
    let typingTime = 1000;

    if (!omegle.connected()) {
        return;
    }

    cleverbot.write(message, (response) => {
        if (response.output === '') {
            cleverbot.write(message, (response) => {
                cleverbotResponse = response.output;
            });
        } else {
            cleverbotResponse = response.output;
        }

        typingTime = cleverbotResponse.length * 200;
        omegle.startTyping();
        isTyping = true;
        if (isDebugMode) {
            console.log(`Cleverbot is typing... (${typingTime / 1000} seconds)`);
        }
        setTimeout(() => {
            sendCleverbotResponse(cleverbotResponse);
        }, typingTime);
    });
};

const sendCleverbotResponse = (response) => {
    let manipulatedResponse = response.toLowerCase();
        manipulatedResponse = manipulatedResponse.replace(/\.$/, '');

    if (!omegle.connected()) {
        return;
    }

    omegle.stopTyping();
    isTyping = false;
    console.log(`${chalk.blue('Cleverbot:')} ${manipulatedResponse}`);
    omegle.send(manipulatedResponse);
};

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

const chalk = require('chalk');
const dotenv = require('dotenv');
const keypress = require('keypress');
const Omegle = require('omegle-node-fix');
const omegle = new Omegle();
const Cleverbot = require('cleverbot-node');
let cleverbot;

const interests = [];
const isDebugMode = false;
let isResponding = false;

// Init
dotenv.config();
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
    isResponding = false;
    isStarted = false;
    omegle.stopTyping();
});

omegle.on('gotMessage', (message) => {
    console.log(`${chalk.red('Stranger:')} ${message}`);
    isStarted = true;

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

    if (!isResponding || !omegle.connected()) {
        if (isDebugMode) {
            console.log(`Cleverbot is waiting to reply... (${waitingTime / 1000} seconds)`);
        }
    } else {
        return;
    }

    isResponding = true;
    setTimeout(() => {
        getCleverbotResponse(message);
    }, waitingTime);
};

const getCleverbotResponse = (message) => {
    const random = Math.floor(Math.random() * (6 - 0 + 1) + 0);
    let cleverbotResponse;
    let typingTime = 1000;

    switch (random) {
        case 0:
            cleverbotResponse = 'ok';
            break;
        case 1:
            cleverbotResponse = 'yes';
            break;
        case 2:
            cleverbotResponse = 'sure';
            break;
        case 3:
            cleverbotResponse = ':)';
            break;
        case 4:
            cleverbotResponse = 'what?';
            break;
        case 5:
            cleverbotResponse = 'idk';
            break;
        case 6:
            cleverbotResponse = 'no';
            break;
        default:
            cleverbotResponse = 'lol';
            break;
    }

    if (!omegle.connected()) {
        return;
    }

    cleverbot.write(message, (response) => {
        if (response.output === '') {
            setTimeout(() => {
                cleverbot.write(message, (response) => {
                    cleverbotResponse = response.output;

                    if (response.output === '') {
                        setTimeout(() => {
                            cleverbot.write(message, (response) => {
                                cleverbotResponse = response.output;
                            });
                        }, 2000);
                    }
                });
            }, 2000);
        } else {
            cleverbotResponse = response.output;
        }

        typingTime = cleverbotResponse.length * 200;
        omegle.startTyping();
        if (isDebugMode) {
            console.log(`Cleverbot is typing... (${typingTime / 1000} seconds)`);
            console.dir(response);
        }
        setTimeout(() => {
            sendCleverbotResponse(cleverbotResponse);
        }, typingTime);
    });
};

const sendCleverbotResponse = (response) => {
    let manipulatedResponse = response.toLowerCase();
        manipulatedResponse = manipulatedResponse.replace(/\.$/, '');
        manipulatedResponse = manipulatedResponse.replace(/\.\.$/, '...');
        manipulatedResponse = manipulatedResponse.replace(/:d$/, ':D');
        manipulatedResponse = manipulatedResponse.replace(/d:$/, 'D:');
        manipulatedResponse = manipulatedResponse.replace(/:p$/, ':P');
        manipulatedResponse = manipulatedResponse.replace(/xd$/, 'XD');

    if (!omegle.connected()) {
        return;
    }

    omegle.stopTyping();
    console.log(`${chalk.blue('Cleverbot:')} ${manipulatedResponse}`);
    omegle.send(manipulatedResponse);
    isResponding = false;
};

// Keypress Events
process.stdin.on('keypress', (ch, key) => {
    if (key && key.name === 'escape') {
        if (omegle.connected()) {
            omegle.disconnect(interests);
        }
    }

    if (key && key.name === 'space') {
        if (!omegle.connected()) {
            connect();
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
const connect = () => {
    cleverbot = new Cleverbot;
    cleverbot.configure({ botapi: process.env.CLEVERBOT_KEY });
    omegle.connect(interests);
};
connect();

# CleverOmegle

CleverOmegle connects [Cleverbot](https://www.cleverbot.com/) to the anonymous chat app, [Omegle](https://www.omegle.com/). Strangers chat with Cleverbot unknowingly, and hilarity ensues!

## Installation

```
npm install
cp .env.example .env
```

Obtain a key from the [Cleverbot API](https://www.cleverbot.com/api/), then add your API key to `.env`:

```
CLEVERBOT_KEY=YOUR_API_KEY
INTERESTS=
APP_DEBUG=false
```

You may optionally add interests as a comma-separated list with each interest wrapped in single quotes:

```
CLEVERBOT_KEY=[YOUR_API_KEY]
INTERESTS='your','interests','here'
APP_DEBUG=false
```

## Usage

Once you have configured `.env`, run CleverOmegle:

```
npm run start
```

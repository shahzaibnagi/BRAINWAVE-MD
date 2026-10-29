# BRAINWAVE MD - pairing page

The web page that issues a WhatsApp multi-device pairing code for a BRAINWAVE MD bot instance.

Everything is in one file: `index.html` carries the layout, the styling and the small script that posts a phone number to the pairing endpoint and displays the 8-character code. `api/pair.js` is the Node proxy that asks the bot for that code.

## What is in the repo

```
index.html    landing page, styling inlined, no build step
api/pair.js   pairing proxy: POST a number, get a code back
```

## Running it

Landing page, no tooling needed:

```bash
python3 -m http.server 8000
```

Pairing proxy:

```bash
PORT=3000 node api/pair.js
```

Point the fetch call in `index.html` at wherever the proxy is deployed.

## What is not here

The bot. This repo is the front end and the pairing proxy only; the bot it pairs with runs separately and is not part of this codebase.

## Before you use it

Pairing an unofficial client with a WhatsApp number breaks WhatsApp's Terms of Service, and the number can be banned without warning. Only ever pair a number you own and can afford to lose.

## Licence

MIT

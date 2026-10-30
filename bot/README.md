# Bot commands

Command modules for the BRAINWAVE MD engine. Each file exports `{ name, aliases, category, run }` and the engine loads it at boot.

## What is in here

31 modules: stickers, media downloaders, group tools, auto-responders and settings.

## What is not in here

The engine: `index.js`, `package.json`, the Baileys connection layer and session handling. This is the command layer only — dropping it into a fresh install will not run on its own.

## Shape of a command

```js
module.exports = {
  name: 'ping',
  aliases: ['p'],
  category: 'general',
  run: async (King, m, { args, prefix, reply, isCreator }) => {
    await reply('pong');
  },
};
```

`King` is the socket, `m` the incoming message, and the third argument carries the helpers the engine injects (`args`, `prefix`, `reply`, `isCreator`, `command`).

## Dependencies used by these modules

`@whiskeysockets/baileys`, `node-fetch`, `wa-sticker-formatter`, `moment-timezone`, `googlethis`, `google-tts-api`, `axios` — Node 18 or newer.

## Housekeeping

Session files, `creds.json` and `.env` stay out of the repo; see `.gitignore`. Pairing an unofficial client breaks WhatsApp's terms of service and can get the number banned.

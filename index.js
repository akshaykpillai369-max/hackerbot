require('dotenv').config();
const { App } = require('@slack/bolt');
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Ping Command
app.command('/hackerbot-ping', async ({ ack, respond }) => {
  await ack();
  const start = Date.now();
  await respond({
    text: `Pong! Latency: ${Date.now() - start}ms`,
  });
});

// Help Command
app.command('/hackerbot-help', async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `*Available Commands:*\n• \`/hackerbot-ping\` - Check latency\n• \`/hackerbot-catfact\` - Get a random cat fact\n• \`/hackerbot-help\` - Show this help menu`,
  });
});

// Cat Fact Command (External API)
app.command('/hackerbot-catfact', async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    await respond({
      text: `🐱 *Cat Fact:* ${response.data.fact}`,
    });
  } catch (error) {
    await respond({
      text: 'Failed to fetch a cat fact.',
    });
  }
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();
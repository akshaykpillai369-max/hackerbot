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
    text: 
    `*Available Commands:*\n
    • \`/hackerbot-ping\` - Check latency\n
    • \`/hackerbot-catfact\` - Get a random cat fact\n
    • \`/hackerbot-joke\` - Get a random joke\n
    • \`/hackerbot-help\` - Show this help menu`,
  });
});

// Cat Fact Command
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

// Joke Command
app.command('/hackerbot-joke', async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    await respond({
      text: `${response.data.setup}\n\n${response.data.punchline}`,
    });
  } catch (err) {
    await respond({
      text: 'Failed to fetch a joke.',
    });
  }
});

app.command('/hackerbot-vuln', async({ack, respond}) => {

    await ack()

    try{

        const res = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10')

        const list = res.data.vulnerabilities

        const item = list[Math.floor(Math.random() * list.length)].cve

        const id = item.id

        const desc = item.descriptions.find(d => d.lang === 'en')?.value || 'No description'

        await respond({

            text: `Security Fact \n CVE: ${id}\n Summary: ${desc}`
        })
    } catch(err){

        await respond({text: 'Could not fetch vulnerabiltity data right now.'})
    }
});

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();
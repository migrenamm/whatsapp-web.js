const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "/data" }),
  puppeteer: { 
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  }
});

client.on('qr', qr => console.log('SCAN QR:', qr));
client.on('ready', () => console.log('WhatsApp Connected!'));

client.on('message', async msg => {
  await axios.post(process.env.N8N_URL, {
    phone: msg.from,
    text: msg.body
  });
});

client.initialize();

// Keep-alive server for Railway
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bridge active'));
app.listen(3000, () => console.log('Keep-alive running'));
const qrcode = require('qrcode-terminal'); // Add at top with other requires

client.on('qr', qr => {
  qrcode.generate(qr, { small: true }); // This will show a proper QR
  console.log("Scan the QR code above with WhatsApp");
});

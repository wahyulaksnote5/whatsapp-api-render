const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  console.log('📱 Scan QR Code:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp connected!');
});

client.initialize();

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'WhatsApp API Ready', platform: 'Railway' });
});

app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  
  try {
    const formattedPhone = `${phone}@c.us`;
    await client.sendMessage(formattedPhone, message);
    
    res.json({ success: true, to: phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

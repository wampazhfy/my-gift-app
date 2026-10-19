const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = https://api.telegram.org/bot${BOT_TOKEN};
const ADMIN_ID = String(process.env.ADMIN_TELEGRAM_ID || '');

const users = {};

async function tgRequest(method, data) {
  try {
    const res = await axios.post(${TELEGRAM_API}/${method}, data);
    return res.data;
  } catch (err) {
    console.error(Ошибка в ${method}:, err.response?.data || err.message);
    return null;
  }
}

const CASES = {
  cheap: { name: 'Двойной кейс', priceStars: 5, maxMeteors: 50, winChance: 0.005 },
  medium: { name: 'Средний кейс', priceStars: 50, maxMeteors: 25, winChance: 0.015 },
  expensive: { name: 'Элитный кейс', priceStars: 100, maxMeteors: 50, winChance: 0.03 }
};

app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  if (!users[userId]) {
    users[userId] = {
      stars: 0,
      meteors: 0,
      tickets: 0,
      gifts: [],
      lastFreeCase: null
    };
  }
  res.json({ success: true, user: users[userId], isAdmin: userId === ADMIN_ID });
});

app.post('/api/buy-case-invoice', async (req, res) => {
  const { userId, caseType } = req.body;
  const caseData = CASES[caseType];

  if (!caseData) return res.status(400).json({ error: 'Неверный кейс' });

  const invoiceData = {
    title: caseData.name,
    description: Открытие кейса за ${caseData.priceStars} ⭐️,
    payload: JSON.stringify({ userId, caseType }),
    provider_token: '', 
    currency: 'XTR', 
    prices: [{ label: caseData.name, amount: caseData.priceStars }]
  };

  const invoiceLink = await tgRequest('createInvoiceLink', invoiceData);
  if (invoiceLink && invoiceLink.ok) {
    res.json({ success: true, invoiceUrl: invoiceLink.result });
  } else {
    res.status(500).json({ error: 'Ошибка создания счета' });
  }
});

app.post('/telegram-webhook', async (req, res) => {
  const update = req.body;

  if (update.pre_checkout_query) {
    await tgRequest('answerPreCheckoutQuery', {
      pre_checkout_query_id: update.pre_checkout_query.id,
      ok: true
    });
    return res.sendStatus(200);
  }

  if (update.message && update.message.successful_payment) {
    const payment = update.message.successful_payment;
    const { userId, caseType } = JSON.parse(payment.invoice_payload);

    if (!users[userId]) {
      users[userId] = { stars: 0, meteors: 0, tickets: 0, gifts: [], lastFreeCase: null };
    }
    const user = users[userId];
    const caseData = CASES[caseType];
    const rand = Math.random();
    let text = "";

    if (rand <= caseData.winChance) {
      user.gifts.push(caseData.name);
      text = "🎉 Вы выиграли Telegram-Подарок!";
    } else {
      const drop = Math.floor(Math.random() * caseData.maxMeteors) + 1;
      user.meteors += drop;
      text = ☄️ Вы получили ${drop} Метеоров!;
    }
    user.tickets += 1;
    await tgRequest('sendMessage', { chat_id: userId, text: Успешно! ${text} });
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(Сервер запущен на порту ${PORT}));

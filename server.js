const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const BOT_TOKEN = '8887071802:AAH7Gar-Zk9FETSTYh9RNkBoA7_fdT_tzko';

app.post('/api/create-invoice', async (req, res) => {
    if (!BOT_TOKEN) {
        return res.status(500).json({ error: "BOT_TOKEN не настроен на сервере!" });
    }

    const { amount, title } = req.body;

    try {
        const response = await fetch(https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: Покупка ${title},
                description: Пополнение баланса на ${amount} Telegram Stars,
                payload: stars_packet_${amount}_${Date.now()},
                currency: 'XTR',
                prices: [{ label: 'Stars', amount: amount }]
            })
        });

        const data = await response.json();
        
        if (data.ok) {
            res.json({ invoiceLink: data.result });
        } else {
            res.status(400).json({ error: data.description });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});

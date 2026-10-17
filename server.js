const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем отправку JSON в запросах
app.use(express.json());

// Раздаём статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Главный маршрут
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});

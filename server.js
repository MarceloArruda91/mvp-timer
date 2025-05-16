const express = require('express');
const { Low, JSONFile } = require('lowdb');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// banco simples em JSON
const db = new Low(new JSONFile('db.json'));
await db.read();
db.data ||= { timers: {}, tombs: {} };

// rotas da API
app.get('/api/timers', async (req, res) => {
    await db.read();
    res.json(db.data.timers);
});
app.post('/api/timers', async (req, res) => {
    db.data.timers = req.body;
    await db.write();
    res.sendStatus(204);
});

app.get('/api/tombs', async (req, res) => {
    await db.read();
    res.json(db.data.tombs);
});
app.post('/api/tombs', async (req, res) => {
    db.data.tombs = req.body;
    await db.write();
    res.sendStatus(204);
});

// servir front-end estático
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

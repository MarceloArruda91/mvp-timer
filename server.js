// server.js
import express from 'express';
import cors    from 'cors';
import path    from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());

const db = new Low(new JSONFile(path.join(__dirname,'db.json')));
await db.read();
db.data ||= { timers: {}, tombs: {} };

// API de timers
app.get ('/api/timers', (_,res)=> res.json(db.data.timers));
app.post('/api/timers', (req,res)=>{
  db.data.timers = req.body;
  db.write();
  res.sendStatus(204);
});
// API de túmulos
app.get ('/api/tombs', (_,res)=> res.json(db.data.tombs));
app.post('/api/tombs', (req,res)=>{
  db.data.tombs = req.body;
  db.write();
  res.sendStatus(204);
});

// serve front-end estático
app.use(express.static(path.join(__dirname,'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`API rodando na porta ${PORT}`));

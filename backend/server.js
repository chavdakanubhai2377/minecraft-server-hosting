// Simple demo backend for PG Host
// Features:
// - Serves the static frontend (root)
// - Mock REST API: /api/status, /api/start, /api/stop, /api/restart, /api/usage, /api/files, /api/backups
// - WebSocket console via socket.io (emit 'console' messages, listen for 'command')
// - Stripe Checkout demo endpoint: POST /create-checkout-session

require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const Stripe = require('stripe');

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_PLACEHOLDER';
const stripe = Stripe(STRIPE_KEY);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

// Serve static frontend (root of repo)
app.use(express.static(path.join(__dirname, '..')));

// In-memory mock state
let serverState = {
  online: false,
  ramUsage: 12, // percent
  cpuUsage: 8,
  diskUsage: 22,
  players: 0,
  logs: ["[System] Welcome to PG Host demo server"],
  files: ["server.jar","plugins/","world/"],
  backups: ["backup-2026-08-26.zip","backup-2026-08-20.zip"]
};

// Utilities: randomize usage periodically for demo
setInterval(()=>{
  if(serverState.online){
    serverState.ramUsage = Math.min(96, Math.max(6, serverState.ramUsage + (Math.random()*10-5)));
    serverState.cpuUsage = Math.min(96, Math.max(4, serverState.cpuUsage + (Math.random()*8-4)));
    serverState.diskUsage = Math.min(96, Math.max(10, serverState.diskUsage + (Math.random()*4-2)));
  } else {
    serverState.ramUsage = Math.max(4, serverState.ramUsage - 0.1);
    serverState.cpuUsage = Math.max(2, serverState.cpuUsage - 0.05);
  }
  // broadcast usage to connected clients
  io.emit('usage', { ram: Math.round(serverState.ramUsage), cpu: Math.round(serverState.cpuUsage), disk: Math.round(serverState.diskUsage), players: serverState.players });
}, 2000);

// REST endpoints
app.get('/api/status', (req,res)=>{
  res.json({ online: serverState.online });
});

app.post('/api/start', (req,res)=>{
  serverState.online = true;
  serverState.logs.push(`[${new Date().toISOString()}] Server started`);
  io.emit('console', `[SERVER] Starting server...`);
  setTimeout(()=>{
    io.emit('console', `[SERVER] Done. Welcome!`);
  }, 800);
  return res.json({ ok:true, message:'started' });
});

app.post('/api/stop', (req,res)=>{
  serverState.online = false;
  serverState.logs.push(`[${new Date().toISOString()}] Server stopped`);
  io.emit('console', `[SERVER] Server stopping...`);
  return res.json({ ok:true, message:'stopped' });
});

app.post('/api/restart', (req,res)=>{
  serverState.online = false;
  io.emit('console', `[SERVER] Restarting server...`);
  setTimeout(()=>{
    serverState.online = true;
    io.emit('console', `[SERVER] Server restarted.`);
  }, 900);
  return res.json({ ok:true, message:'restarting' });
});

app.get('/api/usage', (req,res)=>{
  res.json({ ram: Math.round(serverState.ramUsage), cpu: Math.round(serverState.cpuUsage), disk: Math.round(serverState.diskUsage) });
});

app.get('/api/files', (req,res)=>{
  res.json({ files: serverState.files });
});

app.get('/api/backups', (req,res)=>{
  res.json({ backups: serverState.backups });
});

// Simple checkout endpoint (Stripe Checkout session)
app.post('/create-checkout-session', async (req, res) => {
  try{
    const { plan } = req.body;
    if(!plan) return res.status(400).json({ error: 'plan required' });

    // demo prices for INR
    const priceMap = {
      "Glass": 0,
      "Dirt": 19,
      "Stone": 39,
      "Iron": 69,
      "Lapis": 89,
      "Diamond": 109,
      "Netherite": 139,
      "Extreme": 159
    };
    const amount = (priceMap[plan] || 49) * 100; // paise

    // Free plan -> no checkout
    if(amount === 0){
      return res.json({ free:true, message: 'Selected free plan' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: `PG Host — ${plan} Plan` },
          unit_amount: amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/payments/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/payments/cancel.html`
    });
    res.json({ url: session.url });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'checkout failed', details: err.message });
  }
});

// socket.io console
io.on('connection', (socket)=>{
  console.log('socket connected', socket.id);
  // send current logs
  socket.emit('console', serverState.logs.join('\n'));
  socket.emit('usage', { ram: Math.round(serverState.ramUsage), cpu: Math.round(serverState.cpuUsage), disk: Math.round(serverState.diskUsage), players: serverState.players });

  socket.on('command', (cmd)=>{
    const line = `[CMD ${new Date().toISOString()}] ${cmd}`;
    serverState.logs.push(line);
    io.emit('console', line);
    // simple mock responses
    if(cmd.toLowerCase().includes('say')){
      io.emit('console', `[Server] Broadcast: ${cmd.substring(4)}`);
    }
  });

  socket.on('disconnect', ()=>{
    //console.log('socket disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log(`PG Host demo backend running on http://localhost:${PORT}`));

import express from 'express';
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'stylefwd-api', timestamp: new Date().toISOString() });
});

app.get('/api/stylefwd/ping', (_req, res) => {
  res.json({
    app: 'Stylefwd',
    status: 'up',
    message: 'Docker is working 🎉 - hello from container!'
  });
});

app.post('/api/stylefwd/feedback', (req, res) => {
  const { text = '' } = req.body || {};
  res.json({ received: text, note: 'Store this in DB later.' });
});

app.listen(PORT, () => {
  console.log(`[Stylefwd] API listening on port ${PORT}`);
});

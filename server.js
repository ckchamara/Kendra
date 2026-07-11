const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 2000;
const DB_FILE = path.join(__dirname, 'db.json');
const PROMPTS_FILE = path.join(__dirname, 'prompts.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}
if (!fs.existsSync(PROMPTS_FILE)) {
  fs.writeFileSync(PROMPTS_FILE, JSON.stringify([]));
}

app.get('/api/charts', (req, res) => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read database' });
  }
});

app.post('/api/charts', (req, res) => {
  try {
    const newChart = req.body;
    const data = fs.readFileSync(DB_FILE, 'utf8');
    let charts = JSON.parse(data);
    
    const existingIndex = charts.findIndex(c => c.id === newChart.id);
    if (existingIndex !== -1) {
      charts[existingIndex] = newChart;
    } else {
      charts.push(newChart);
    }
    
    fs.writeFileSync(DB_FILE, JSON.stringify(charts, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save chart' });
  }
});

app.delete('/api/charts/:id', (req, res) => {
  try {
    const id = req.params.id;
    const data = fs.readFileSync(DB_FILE, 'utf8');
    let charts = JSON.parse(data);
    charts = charts.filter(c => c.id !== id);
    fs.writeFileSync(DB_FILE, JSON.stringify(charts, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chart' });
  }
});

app.get('/api/prompts', (req, res) => {
  try {
    const data = fs.readFileSync(PROMPTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read prompts database' });
  }
});

app.post('/api/prompts', (req, res) => {
  try {
    fs.writeFileSync(PROMPTS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prompts' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'todo_app'
});

db.connect(err => {
  if (err) return console.error('DB connection error:', err);
  console.log('Connected to MySQL database');
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Task not found' });
    res.json(results[0]);
  });
});

// POST new task
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.query(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description || ''],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, description });
    }
  );
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.query(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    [title, description || '', id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, title, description });
    }
  );
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task deleted' });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

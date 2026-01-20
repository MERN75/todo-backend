const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET all tasks */
router.get('/', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY id DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* ADD new task */
router.post('/', (req, res) => {
  const { title, desc } = req.body;

  db.query(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, desc],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({
        id: result.insertId,
        title,
        desc
      });
    }
  );
});

/* UPDATE task */
router.put('/:id', (req, res) => {
  const { title, desc } = req.body;

  db.query(
    'UPDATE tasks SET title=?, description=? WHERE id=?',
    [title, desc, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Task updated' });
    }
  );
});

/* DELETE task */
router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM tasks WHERE id=?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Task deleted' });
    }
  );
});

module.exports = router;

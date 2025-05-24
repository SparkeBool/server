import express from 'express';
import Task from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = new Task({ ...req.body, user: req.userId });
  const saved = await task.save();
  res.status(201).json(saved);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
});

export default router;

//routes
import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task){
      return res.status(404).json({ message: 'Task not found' });
      console.log(`⚠️⚠️ Task not found`);
    }

    res.json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`⚠️⚠️ Error getting task: ${error}`);
  }
});

//update a task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task){
      return res.status(404).json({ message: 'Task not found' });
      console.log(`⚠️⚠️ Task not found`);
    }

    res.json(task);

  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(`⚠️⚠️ Error updating task: ${error}`);
  }
});

//delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task){
      return res.status(404).json({ message: 'Task not found' });
      console.log(`⚠️⚠️ Task not found`);
    }

    res.json({ message: 'Task deleted successfully' });
    console.log(`✅✅ Task deleted successfully`);

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(`⚠️⚠️ Error deleting task: ${error}`);
  }
})

export default router; 
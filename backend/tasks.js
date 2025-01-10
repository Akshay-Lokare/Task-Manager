//routes
import express from 'express';
import Task from './TaskSchema.js';

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
    }

    res.json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task){
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete a task
router.delete('/:id', async (req, res) => {
  try {
    console.log('⚡️ Delete request received');
    console.log('📍 Task ID:', req.params.id);
    
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      console.log('❌ Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }
    
    console.log('✅ Task deleted:', task);
    res.json({ message: 'Task deleted successfully', task });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/in-progress', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Completed tasks cannot be marked as in-progress' });
    }

    if (task.status === 'in-progress') {
      return res.status(400).json({ message: 'Task is already in-progress' });
    }

    task.status = 'in-progress';
    task.updatedAt = new Date();
    await task.save();

    res.status(200).json({ message: 'Task status updated to in-progress', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/completed', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Completed tasks cannot be marked as in-progress' });
    }

    task.status = 'completed';
    task.updatedAt = new Date();
    await task.save();

    res.status(200).json({ message: 'Task status updated to completed', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 
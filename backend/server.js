import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import Task from './Task.js';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Define your routes here
app.post('/api/tasks', async (req, res) => {
  try {
    console.log('\n=== 📝 New Task Request ===');
    console.log('📦 Received data:', JSON.stringify(req.body, null, 2));
    
    const task = new Task(req.body);
    console.log('🔄 Task instance created');
    
    await task.save();
    console.log('✅ Task saved to database:', JSON.stringify(task, null, 2));
    
    res.status(201).json(task);
    console.log('📤 Response sent to client');
    console.log('=== Request Complete ===\n');
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Basic route to test server
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.send('Task Manager API is running');
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

//Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
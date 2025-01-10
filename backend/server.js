import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cors from 'cors';
import taskRoutes from './tasks.js';

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

//Mount the task routes
app.use('/api/tasks', taskRoutes);

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
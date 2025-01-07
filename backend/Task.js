import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  reminderDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to check for overdue tasks
taskSchema.pre('save', function(next) {
  // Update status to overdue if due date has passed and task isn't completed
  if (this.dueDate < new Date() && this.status !== 'completed') {
    this.status = 'overdue';
  }
  this.updatedAt = new Date();
  next();
});

// Method to mark task as complete
taskSchema.methods.markAsComplete = function() {
  this.status = 'completed';
  this.updatedAt = new Date();
  return this.save();
};

// Method to mark task as in-progress
taskSchema.methods.markAsInProgress = function() {
  this.status = 'in-progress';
  this.updatedAt = new Date();
  return this.save();
};

// Method to check if task is overdue
taskSchema.methods.isOverdue = function() {
  return this.dueDate < new Date() && this.status !== 'completed';
};

const Task = mongoose.model('Task', taskSchema);
export default Task;
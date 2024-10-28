// models/Todo.js
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['High Priority', 'Medium Priority', 'Low Priority'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);

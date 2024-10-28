// routes/todoRoutes.js
const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// GET todos
router.get('/', async (req, res) => {
    const { username } = req.query;

    try {
        const todos = username
            ? await Todo.find({ username })
            : await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST todo
router.post('/', async (req, res) => {
    const { task, username, priority = 'Low Priority' } = req.body;

    if (!task || !username || !priority) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const todo = new Todo({
        task,
        username,
        priority,
    });

    try {
        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH todo (update completion status)
router.patch('/:id', async (req, res) => {
    const { completed } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { completed },
            { new: true } 
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

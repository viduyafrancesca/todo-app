// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/todo.css';
import { useUser } from '../context/UserContext';

const TodoList = ({ todos, setTodos }) => {
    const { username } = useUser();
    const [taskInput, setTaskInput] = useState('');
    const [priority, setPriority] = useState('Low Priority');

    useEffect(() => {
        const fetchTodos = async () => {
            console.log('Fetching todos for user:', username);
            if (username) {
                try {
                    const response = await axios.get(`http://localhost:5001/todos?username=${username}`);
                    setTodos(response.data);
                    console.log('Fetched todos:', response.data);
                } catch (error) {
                    console.error('Error fetching todos:', error);
                }
            } else {
                console.log('No user signed in, clearing todos.');
                setTodos([]); // Clear todos when signed out
            }
        };
        fetchTodos();
    }, [username, setTodos]);


    const addTodo = async () => {
        if (!taskInput) return;
        const todoData = { task: taskInput, username, priority };

        try {
            const response = await axios.post('http://localhost:5001/todos', todoData);
            setTodos([...todos, response.data]);
            setTaskInput('');
            setPriority('Low Priority');
        } catch (error) {
            console.error('Error adding todo:', error.response?.data || error.message);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleCompletion = async (id) => {
        const todoToUpdate = todos.find(todo => todo._id === id);
        try {
            await axios.patch(`http://localhost:5001/todos/${id}`, { completed: !todoToUpdate.completed });
            setTodos(todos.map(todo => todo._id === id ? { ...todo, completed: !todo.completed } : todo));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const priorities = {
        'High Priority': [],
        'Medium Priority': [],
        'Low Priority': []
    };

    todos.forEach(todo => {
        priorities[todo.priority].push(todo);
    });

    return (
        <div className="todo-container">
            <div className="input-container">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Add a new task"
                    data-cy="taskInput"
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)} data-cy="priority">
                    <option value="High Priority">High Priority</option>
                    <option value="Medium Priority">Medium Priority</option>
                    <option value="Low Priority">Low Priority</option>
                </select>
                <button onClick={addTodo} data-cy="addTaskButton">Add</button>
            </div>

            <div className="todo-list-container">
                {Object.keys(priorities).map((priority) => (
                    <div key={priority} className={`todo-card ${priority.replace(" ", "-").toLowerCase()}`}>
                        <h2>{priority}</h2>
                        <ul className="todo-list" data-cy="taskList">
                            {priorities[priority].map(todo => (
                                <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleCompletion(todo._id)}
                                        data-cy="completed"
                                    />
                                    <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.5 : 1 }} data-cy="taskText">
                                        {todo.task}
                                    </span>
                                    <button onClick={() => deleteTodo(todo._id)} data-cy="deleteButton">Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;

// Todo.js

import React from 'react';

const Todo = ({ todo, onToggleComplete, onDelete }) => {
    return (
        <div className="todo-item">
            <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => onToggleComplete(todo._id)} 
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.text}
            </span>
            <button onClick={() => onDelete(todo._id)}>Delete</button>
        </div>
    );
};

export default Todo;

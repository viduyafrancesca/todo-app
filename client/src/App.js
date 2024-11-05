// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import TodoList from './components/TodoList';
import Home from './components/Home'; 
import { UserProvider, useUser } from './context/UserContext'; 
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]); // Lifted state here

  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Header setTodos={setTodos} /> {/* Pass setTodos to Header */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/todos" element={<TodoList todos={todos} setTodos={setTodos} />} /> {/* Pass todos and setTodos to TodoList */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

// Header Component for Sign Out Button
const Header = ({ setTodos }) => {
  const { logout } = useUser(); // Use useUser to access logout
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleSignOut = () => {
    logout(); // Clear user state
    setTodos([]); // Clear todos on logout
    navigate('/'); // Redirect to home
  };

  // Only show the sign-out button if not on the home page
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') return null;

  return (
    <header>
      <button onClick={handleSignOut} className="sign-out-button" data-cy="signout-button">
        Sign Out
      </button>
    </header>
  );
};

export default App;

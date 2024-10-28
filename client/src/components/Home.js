// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Todo App</h2>
      <p>
        Please <Link to="/register" data-cy="registrationForm">register</Link> or <Link to="/login" data-cy="loginForm">login</Link> to continue.
      </p>
    </div>
  );
};

export default Home;

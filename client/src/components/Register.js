// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/auth/register', { username, password });
            setSuccessMessage('Registration successful! You can now log in.');
            setUsername('');
            setPassword('');
            setError('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Set the error message from the server
                setError(error.response.data.message);
            } else {
                // Fallback error message if no specific message is available
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="form-container" data-cy="registrationWindow">
            <h2>Register</h2>
            {error && <p className="message">{error}</p>}
            {successMessage && <p className="message">{successMessage}</p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    data-cy="registerUsername"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-cy="registerPassword"
                    required
                />
                <button type="submit" data-cy="registerButton">Register</button>
            </form>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default Register;

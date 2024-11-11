import React, { useState } from 'react';
import { UserContext } from '../../src/context/UserContext';

export const MockUserProvider = ({ children }) => {
    // Mock state for username
    const [username, setUsername] = useState('');
    
    // Mock login function
    const mockLogin = (user) => {
        setUsername(user); // Simulate setting the username on login
    };
    
    // Mock logout function
    const mockLogout = () => {
        setUsername(''); // Simulate clearing the username on logout
    };

    return (
        <UserContext.Provider value={{ username, login: mockLogin, logout: mockLogout }}>
            {children}
        </UserContext.Provider>
    );
};

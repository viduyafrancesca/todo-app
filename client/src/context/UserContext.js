// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState('');

    const login = (user) => {
        setUsername(user); // Set the username on login
    };

    const logout = () => {
        setUsername(''); // Clear the username on logout
    };

    return (
        <UserContext.Provider value={{ username, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

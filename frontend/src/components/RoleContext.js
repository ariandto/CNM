// RoleContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { apiurl } from './api/config';

// Create the context
const RoleContext = createContext();

// Create the provider component
export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');

    // Refresh token function
    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.get(`${apiurl}/token`);
            const newToken = response.data.accessToken;
            setToken(newToken);
            const decoded = jwtDecode(newToken);
            setRole(decoded.role || '');
            setExpire(decoded.exp);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }, []);

    // Effect to check token expiration and refresh if needed
    React.useEffect(() => {
        const checkTokenExpiration = () => {
            const currentDate = new Date();
            if (expire * 1000 < currentDate.getTime()) {
                refreshToken();
            }
        };

        const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [expire, refreshToken]);

    return (
        <RoleContext.Provider value={{ role, setRole, token, setToken, refreshToken }}>
            {children}
        </RoleContext.Provider>
    );
};

// Custom hook to use the RoleContext
export const useRole = () => useContext(RoleContext);

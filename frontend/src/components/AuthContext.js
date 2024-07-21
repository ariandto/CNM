// AuthContext.js
import React, { createContext, useReducer } from 'react';

const initialState = {
    isAuthenticated: false,
    token: null
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                token: null
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };

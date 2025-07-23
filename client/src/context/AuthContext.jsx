import React, { createContext, useContext, useState, useEffect } from 'react';



const AuthContext = createContext();


export function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    // on Mount, check for token and user in localStorage

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);

    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
const  useAuth = () => {
    return useContext(AuthContext);
};


export default useAuth
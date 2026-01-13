import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);



    const loadUser = async () => {
        try {
            const { data } = await api.get('/user/me');
            setUser(data.user);
            setIsAuthenticated(true);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const signup = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        return data;
    };

    const verifyOtp = async (otpData) => {
        const { data } = await api.post('/auth/verify-otp', otpData);
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const logout = async () => {
        await api.get('/auth/logout');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, signup, verifyOtp, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const API_URL = 'http://localhost:5000/api/v1'; // Adjust as needed

    const loadUser = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/user/me`, { withCredentials: true });
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
        const { data } = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const signup = async (userData) => {
        const { data } = await axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true });
        return data;
    };

    const verifyOtp = async (otpData) => {
        const { data } = await axios.post(`${API_URL}/auth/verify-otp`, otpData, { withCredentials: true });
        setUser(data.user);
        setIsAuthenticated(true);
        return data;
    };

    const logout = async () => {
        await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
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

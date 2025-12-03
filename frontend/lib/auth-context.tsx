"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, loginUser, registerUser, getCurrentUser, LoginData, RegisterData } from './api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginData) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            getCurrentUser(storedToken).then((userData) => {
                if (userData) {
                    setUser(userData);
                    setToken(storedToken);
                } else {
                    // Token invalid, clear it
                    localStorage.removeItem('auth_token');
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (data: LoginData): Promise<boolean> => {
        try {
            const authData = await loginUser(data);
            if (authData) {
                setUser(authData.user);
                setToken(authData.jwt);
                localStorage.setItem('auth_token', authData.jwt);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = async (data: RegisterData): Promise<boolean> => {
        try {
            const authData = await registerUser(data);
            if (authData) {
                setUser(authData.user);
                setToken(authData.jwt);
                localStorage.setItem('auth_token', authData.jwt);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

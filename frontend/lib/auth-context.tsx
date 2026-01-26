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
    socialLogin: (jwt: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set cookie
function setCookie(name: string, value: string, days: number = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Helper function to delete cookie
function deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

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
                    // Sync to cookie for middleware
                    setCookie('auth_token', storedToken);
                } else {
                    // Token invalid, clear it
                    localStorage.removeItem('auth_token');
                    deleteCookie('auth_token');
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
                // Save to both localStorage and cookie
                localStorage.setItem('auth_token', authData.jwt);
                setCookie('auth_token', authData.jwt);
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
                // Save to both localStorage and cookie
                localStorage.setItem('auth_token', authData.jwt);
                setCookie('auth_token', authData.jwt);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const socialLogin = (jwt: string, userData: User) => {
        setUser(userData);
        setToken(jwt);
        // Save to both localStorage and cookie
        localStorage.setItem('auth_token', jwt);
        setCookie('auth_token', jwt);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // Clear both localStorage and cookie
        localStorage.removeItem('auth_token');
        deleteCookie('auth_token');
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
                socialLogin,
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

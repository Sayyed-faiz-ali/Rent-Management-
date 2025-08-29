import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, Tenant, Payment, FamilyMember, Owner } from '../types';
import { mockOwners, mockTenants } from '../data/mockData';

interface AppContextType {
    user: User | null;
    tenants: Tenant[];
    login: (email: string, password: string, role: 'owner' | 'tenant') => boolean;
    logout: () => void;
    signup: (userData: any, role: 'owner' | 'tenant') => boolean;
    getTenantById: (id: string) => Tenant | undefined;
    updateTenant: (tenantId: string, tenantData: Partial<Omit<Tenant, '_id'>>) => void;
    addPayment: (tenantId: string, paymentData: Omit<Payment, '_id'>) => void;
    updatePayment: (tenantId: string, paymentId: string, paymentData: Partial<Omit<Payment, '_id' | 'month' | 'year'>>) => void;
    removePayment: (tenantId: string, paymentId: string) => void;
    addFamilyMember: (tenantId: string, memberData: Omit<FamilyMember, '_id'>) => void;
    removeFamilyMember: (tenantId: string, memberId: string) => void;
    updateFamilyMember: (tenantId: string, memberId: string, memberData: Partial<Omit<FamilyMember, '_id'>>) => void;
    sendMessage: (tenantId: string | 'all', message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [owners, setOwners] = useState<Owner[]>(mockOwners);
    const [allTenants, setAllTenants] = useState<Tenant[]>(mockTenants);
    const [tenants, setTenants] = useState<Tenant[]>([]); // This holds tenants for the logged-in user

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            if (user.role === 'owner') {
                setTenants(allTenants.filter(t => t.ownerId === user._id));
            } else { // tenant
                setTenants(allTenants.filter(t => t._id === user._id));
            }
        } else {
            localStorage.removeItem('user');
            setTenants([]);
        }
    }, [user, allTenants]);

    const login = (email: string, password: string, role: 'owner' | 'tenant'): boolean => {
        const userPool = role === 'owner' ? owners : allTenants;
        // In a real app, password would be hashed. Here we do a plain text check.
        const foundUser = userPool.find(u => u.email === email && (u as any).password === password);

        if (foundUser) {
            setUser({ _id: foundUser._id, name: foundUser.name, email: foundUser.email, role: foundUser.role });
            return true;
        }
        return false;
    };

     const signup = (userData: any, role: 'owner' | 'tenant'): boolean => {
        const userPool = role === 'owner' ? owners : allTenants;
        const existingUser = userPool.find(u => u.email === userData.email);
        if (existingUser) {
            return false; // User already exists
        }

        const newUser: User & { password?: string } = {
            _id: `user_${Date.now()}`,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: role,
        };

        if (role === 'tenant') {
            const newTenant: Tenant = {
                ...(newUser as Tenant),
                houseNumber: userData.houseNumber,
                ownerId: userData.ownerId, // This would be dynamic in a real app
                familyMembers: [],
                payments: [],
                messages: [],
            };
            setAllTenants(prev => [...prev, newTenant]);
        } else {
            setOwners(prev => [...prev, newUser as Owner]);
        }
        
        setUser({ _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role });
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    const getTenantById = (id: string) => {
        return tenants.find(t => t._id === id);
    };
    
    const updateTenant = (tenantId: string, tenantData: Partial<Omit<Tenant, '_id'>>) => {
        setAllTenants(prev => prev.map(t => t._id === tenantId ? { ...t, ...tenantData } : t));
    };

    const addPayment = (tenantId: string, paymentData: Omit<Payment, '_id'>) => {
        const newPayment: Payment = {
            ...paymentData,
            _id: `payment_${Date.now()}`
        };
        setAllTenants(prev => prev.map(t =>
            t._id === tenantId
                ? { ...t, payments: [...t.payments, newPayment] }
                : t
        ));
    };

    const updatePayment = (tenantId: string, paymentId: string, paymentData: Partial<Omit<Payment, '_id' | 'month' | 'year'>>) => {
        setAllTenants(prev => prev.map(tenant => {
            if (tenant._id === tenantId) {
                const updatedPayments = tenant.payments.map(payment => {
                    if (payment._id === paymentId) {
                        const updatedPayment = { ...payment, ...paymentData };
                        // Recalculate derived fields
                        updatedPayment.totalDue = updatedPayment.rent + updatedPayment.electricityBill + updatedPayment.waterCharge;
                        updatedPayment.balance = updatedPayment.totalDue - updatedPayment.amountPaid;
                        return updatedPayment;
                    }
                    return payment;
                });
                return { ...tenant, payments: updatedPayments };
            }
            return tenant;
        }));
    };


    const removePayment = (tenantId: string, paymentId: string) => {
        setAllTenants(prev => prev.map(t =>
            t._id === tenantId
                ? { ...t, payments: t.payments.filter(p => p._id !== paymentId) }
                : t
        ));
    };

    const addFamilyMember = (tenantId: string, memberData: Omit<FamilyMember, '_id'>) => {
        const newMember: FamilyMember = {
            ...memberData,
            _id: `fm_${Date.now()}`
        };
        setAllTenants(prev => prev.map(t =>
            t._id === tenantId
                ? { ...t, familyMembers: [...t.familyMembers, newMember] }
                : t
        ));
    };
    
    const removeFamilyMember = (tenantId: string, memberId: string) => {
        setAllTenants(prev => prev.map(t =>
            t._id === tenantId
                ? { ...t, familyMembers: t.familyMembers.filter(m => m._id !== memberId) }
                : t
        ));
    };
    
    const updateFamilyMember = (tenantId: string, memberId: string, memberData: Partial<Omit<FamilyMember, '_id'>>) => {
         setAllTenants(prev => prev.map(tenant => {
            if (tenant._id === tenantId) {
                const updatedFamilyMembers = tenant.familyMembers.map(member => 
                    member._id === memberId ? { ...member, ...memberData } : member
                );
                return { ...tenant, familyMembers: updatedFamilyMembers };
            }
            return tenant;
        }));
    };

    const sendMessage = (tenantId: string | 'all', message: string) => {
        const newMessage = {
            _id: `msg_${Date.now()}`,
            content: message,
            timestamp: new Date().toISOString(),
            from: 'owner',
        };

        if (tenantId === 'all') {
             setAllTenants(prev => prev.map(t =>
                t.ownerId === user?._id
                    ? { ...t, messages: [...t.messages, newMessage] }
                    : t
            ));
        } else {
            setAllTenants(prev => prev.map(t =>
                t._id === tenantId
                    ? { ...t, messages: [...t.messages, newMessage] }
                    : t
            ));
        }
    };

    const value = { user, tenants, login, logout, signup, getTenantById, updateTenant, addPayment, updatePayment, removePayment, addFamilyMember, removeFamilyMember, updateFamilyMember, sendMessage };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};

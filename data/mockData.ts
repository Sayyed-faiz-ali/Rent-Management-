import type { Owner, Tenant } from '../types';

export const mockOwners: (Owner & { password?: string })[] = [
    {
        _id: 'owner_1',
        name: 'John Doe',
        email: 'owner@test.com',
        role: 'owner',
        password: 'password',
    }
];

export const mockTenants: (Tenant & { password?: string })[] = [
    {
        _id: 'tenant_1',
        name: 'Alice Smith',
        email: 'tenant1@test.com',
        role: 'tenant',
        password: 'password',
        houseNumber: 'A-101',
        ownerId: 'owner_1',
        familyMembers: [
            { _id: 'fm_1', name: 'Bob Smith', age: 45, relation: 'Spouse' },
            { _id: 'fm_2', name: 'Charlie Smith', age: 12, relation: 'Son' },
        ],
        payments: [
            { 
                _id: 'payment_1', 
                month: new Date().getMonth() + 1, 
                year: new Date().getFullYear(), 
                rent: 15000, 
                electricityBill: 1200, 
                waterCharge: 300, 
                totalDue: 16500, 
                amountPaid: 16500, 
                balance: 0,
                paymentDate: new Date(new Date().setDate(5)).toISOString() 
            },
            { 
                _id: 'payment_2', 
                month: new Date().getMonth(), 
                year: new Date().getFullYear(), 
                rent: 15000, 
                electricityBill: 1150, 
                waterCharge: 300, 
                totalDue: 16450, 
                amountPaid: 16450,
                balance: 0,
                paymentDate: new Date(new Date().setMonth(new Date().getMonth() -1, 5)).toISOString()
            },
        ],
        messages: [
            { _id: 'msg_1', content: 'Reminder: Rent for this month is due on the 5th.', timestamp: new Date().toISOString(), from: 'owner' }
        ]
    },
    {
        _id: 'tenant_2',
        name: 'Michael Johnson',
        email: 'tenant2@test.com',
        role: 'tenant',
        password: 'password',
        houseNumber: 'B-204',
        ownerId: 'owner_1',
        familyMembers: [],
        payments: [
             { 
                _id: 'payment_3', 
                month: new Date().getMonth() + 1, 
                year: new Date().getFullYear(), 
                rent: 18000, 
                electricityBill: 1500, 
                waterCharge: 400, 
                totalDue: 19900, 
                amountPaid: 10000, 
                balance: 9900,
                paymentDate: new Date(new Date().setDate(6)).toISOString() 
            },
        ],
        messages: []
    }
];

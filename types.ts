export interface User {
    _id?: string; // Corresponds to _id from MongoDB, optional for new users not yet saved
    name: string;
    email: string;
    role: 'owner' | 'tenant';
}

export interface FamilyMember {
    _id?: string; // Corresponds to _id from MongoDB
    name: string;
    age: number;
    relation: string;
}

export interface Payment {
    _id?: string; // Corresponds to _id from MongoDB
    month: number; // 1-12
    year: number;
    rent: number;
    electricityBill: number;
    waterCharge: number;
    totalDue: number;
    amountPaid: number;
    balance: number;
    paymentDate?: string; // ISO string
}

export interface Message {
    _id?: string; // Corresponds to _id from MongoDB
    content: string;
    timestamp: string; // ISO string
    from: string; // 'owner'
}

export interface Tenant extends User {
    houseNumber: string;
    familyMembers: FamilyMember[];
    payments: Payment[];
    messages: Message[];
    ownerId: string;
}

export interface Owner extends User {
    // No extra fields needed for this app version
}

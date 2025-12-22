"use client";

export interface Team {
    id: string;
    teamName: string;
    leaderName: string;
    leaderContact: string;
    location: string;
    date: string;
    paymentProof: string;
    termsAccepted: boolean;
    status: 'pending' | 'verified' | 'rejected';
    registeredAt: string;
}

export const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'cricket@234'
};

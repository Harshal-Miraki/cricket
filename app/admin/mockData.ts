import { Team } from './types';

export const mockTeams: Team[] = [
    {
        id: '1',
        teamName: 'Thunder Strikers',
        leaderName: 'Rahul Sharma',
        leaderContact: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        date: 'Jan 15, 2025',
        paymentProof: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop',
        termsAccepted: true,
        status: 'pending',
        registeredAt: '2024-12-20T10:30:00Z'
    },
    {
        id: '2',
        teamName: 'Royal Warriors',
        leaderName: 'Priya Patel',
        leaderContact: '+91 87654 32109',
        location: 'Pune, Maharashtra',
        date: 'Jan 15, 2025',
        paymentProof: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop',
        termsAccepted: true,
        status: 'verified',
        registeredAt: '2024-12-19T14:15:00Z'
    },
    {
        id: '3',
        teamName: 'Phoenix Rising',
        leaderName: 'Amit Kumar',
        leaderContact: '+91 76543 21098',
        location: 'Delhi, NCR',
        date: 'Jan 16, 2025',
        paymentProof: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=600&fit=crop',
        termsAccepted: true,
        status: 'pending',
        registeredAt: '2024-12-21T09:00:00Z'
    },
    {
        id: '4',
        teamName: 'Storm Chasers',
        leaderName: 'Neha Gupta',
        leaderContact: '+91 65432 10987',
        location: 'Bangalore, Karnataka',
        date: 'Jan 16, 2025',
        paymentProof: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=400&h=600&fit=crop',
        termsAccepted: true,
        status: 'rejected',
        registeredAt: '2024-12-18T16:45:00Z'
    },
    {
        id: '5',
        teamName: 'Victory Eagles',
        leaderName: 'Sanjay Deshmukh',
        leaderContact: '+91 54321 09876',
        location: 'Navi Mumbai, Maharashtra',
        date: 'Jan 17, 2025',
        paymentProof: 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=400&h=600&fit=crop',
        termsAccepted: true,
        status: 'pending',
        registeredAt: '2024-12-22T08:20:00Z'
    }
];

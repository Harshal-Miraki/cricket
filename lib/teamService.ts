import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    query,
    orderBy,
    Timestamp,
    DocumentData
} from "firebase/firestore";
import { db } from "./firebase";

export interface TeamData {
    id?: string;
    teamName: string;
    leaderName: string;
    leaderContact: string;
    location: string;
    date: string;
    paymentProof: string;
    termsAccepted: boolean;
    status: 'pending' | 'verified' | 'rejected';
    registeredAt: Timestamp | Date;
}

const TEAMS_COLLECTION = "teams";

// Add a new team registration
export async function addTeam(teamData: Omit<TeamData, 'id' | 'status' | 'registeredAt'>): Promise<string> {
    console.log("addTeam called with:", teamData);
    console.log("Firestore db instance:", db);

    try {
        console.log("Creating document in collection:", TEAMS_COLLECTION);
        const docData = {
            ...teamData,
            status: 'pending',
            registeredAt: Timestamp.now(),
        };
        console.log("Document data:", docData);

        const docRef = await addDoc(collection(db, TEAMS_COLLECTION), docData);
        console.log("Document created with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding team:", error);
        console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        throw error;
    }
}

// Get all teams
export async function getAllTeams(): Promise<TeamData[]> {
    try {
        const q = query(collection(db, TEAMS_COLLECTION), orderBy("registeredAt", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => {
            const data = doc.data() as DocumentData;
            return {
                id: doc.id,
                teamName: data.teamName,
                leaderName: data.leaderName,
                leaderContact: data.leaderContact,
                location: data.location,
                date: data.date,
                paymentProof: data.paymentProof,
                termsAccepted: data.termsAccepted,
                status: data.status,
                registeredAt: data.registeredAt,
            } as TeamData;
        });
    } catch (error) {
        console.error("Error getting teams:", error);
        throw error;
    }
}

// Update team status
export async function updateTeamStatus(teamId: string, status: 'pending' | 'verified' | 'rejected'): Promise<void> {
    try {
        const teamRef = doc(db, TEAMS_COLLECTION, teamId);
        await updateDoc(teamRef, { status });
    } catch (error) {
        console.error("Error updating team status:", error);
        throw error;
    }
}

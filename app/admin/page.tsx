"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { ADMIN_CREDENTIALS } from "./types";
import Dashboard from "./components/Dashboard";
import { getAllTeams, updateTeamStatus, TeamData } from "@/lib/teamService";
import { Timestamp } from "firebase/firestore";

// Convert TeamData to the format expected by Dashboard
interface Team {
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

function convertTeamData(teamData: TeamData): Team {
    let registeredAt: string;
    if (teamData.registeredAt instanceof Timestamp) {
        registeredAt = teamData.registeredAt.toDate().toISOString();
    } else if (teamData.registeredAt instanceof Date) {
        registeredAt = teamData.registeredAt.toISOString();
    } else {
        registeredAt = new Date().toISOString();
    }

    return {
        id: teamData.id || '',
        teamName: teamData.teamName,
        leaderName: teamData.leaderName,
        leaderContact: teamData.leaderContact,
        location: teamData.location,
        date: teamData.date,
        paymentProof: teamData.paymentProof,
        termsAccepted: teamData.termsAccepted,
        status: teamData.status,
        registeredAt,
    };
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const session = localStorage.getItem("adminSession");
        if (session === "authenticated") {
            setIsAuthenticated(true);
            loadTeams();
        }
        setIsLoading(false);
    }, []);

    const loadTeams = async () => {
        setTeamsLoading(true);
        try {
            const teamsData = await getAllTeams();
            setTeams(teamsData.map(convertTeamData));
        } catch (error) {
            console.error("Error loading teams:", error);
        } finally {
            setTeamsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem("adminSession", "authenticated");
            setIsAuthenticated(true);
            loadTeams();
        } else {
            setError("Invalid username or password");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminSession");
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
    };

    const handleUpdateTeamStatus = async (id: string, status: 'pending' | 'verified' | 'rejected') => {
        try {
            await updateTeamStatus(id, status);
            // Update local state
            setTeams(teams.map(team =>
                team.id === id ? { ...team, status } : team
            ));
        } catch (error) {
            console.error("Error updating team status:", error);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Show dashboard if authenticated
    if (isAuthenticated) {
        if (teamsLoading) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Loading teams...</p>
                    </div>
                </div>
            );
        }

        return (
            <Dashboard
                teams={teams}
                onLogout={handleLogout}
                onUpdateTeamStatus={handleUpdateTeamStatus}
            />
        );
    }

    // Show login form
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-gray-500 mt-2">Sign in to manage registrations</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Hint */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                            Demo credentials: <span className="text-gray-600 font-medium">admin</span> / <span className="text-gray-600 font-medium">admin123</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

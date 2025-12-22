"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Team } from "../types";
import TeamCard from "./TeamCard";
import TeamModal from "./TeamModal";
import { LogOut, Users, CheckCircle2, Clock, XCircle, Search } from "lucide-react";

interface DashboardProps {
    teams: Team[];
    onLogout: () => void;
    onUpdateTeamStatus: (id: string, status: 'pending' | 'verified' | 'rejected') => void;
}

export default function Dashboard({ teams, onLogout, onUpdateTeamStatus }: DashboardProps) {
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

    const filteredTeams = teams.filter((team) => {
        const matchesSearch =
            team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || team.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: teams.length,
        pending: teams.filter(t => t.status === 'pending').length,
        verified: teams.filter(t => t.status === 'verified').length,
        rejected: teams.filter(t => t.status === 'rejected').length,
    };

    const handleUpdateStatus = (id: string, status: 'pending' | 'verified' | 'rejected') => {
        onUpdateTeamStatus(id, status);
        // Update selected team if it's the one being modified
        if (selectedTeam && selectedTeam.id === id) {
            setSelectedTeam({ ...selectedTeam, status });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-xs text-gray-500">Tournament Registration</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total Teams</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Clock size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.verified}</p>
                                <p className="text-xs text-gray-500">Verified</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-4 border border-gray-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <XCircle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                                <p className="text-xs text-gray-500">Rejected</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search teams, leaders, or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {(['all', 'pending', 'verified', 'rejected'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Teams Grid */}
                {filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredTeams.map((team, index) => (
                            <motion.div
                                key={team.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <TeamCard team={team} onClick={() => setSelectedTeam(team)} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teams Found</h3>
                        <p className="text-gray-500 text-sm">
                            {teams.length === 0
                                ? "No teams have registered yet."
                                : "No teams match your search criteria."}
                        </p>
                    </motion.div>
                )}
            </main>

            {/* Modal */}
            {selectedTeam && (
                <TeamModal
                    team={selectedTeam}
                    onClose={() => setSelectedTeam(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
}

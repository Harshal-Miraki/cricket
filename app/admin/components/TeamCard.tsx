"use client";

import { motion } from "framer-motion";
import { Team } from "../types";
import { MapPin, Calendar, Phone, User, CheckCircle2, Clock, XCircle } from "lucide-react";

interface TeamCardProps {
    team: Team;
    onClick: () => void;
}

export default function TeamCard({ team, onClick }: TeamCardProps) {
    const statusConfig = {
        pending: {
            icon: Clock,
            label: "Pending",
            className: "bg-amber-100 text-amber-700 border-amber-200",
        },
        verified: {
            icon: CheckCircle2,
            label: "Verified",
            className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        rejected: {
            icon: XCircle,
            label: "Rejected",
            className: "bg-red-100 text-red-700 border-red-200",
        },
    };

    const status = statusConfig[team.status];
    const StatusIcon = status.icon;

    const maskContact = (contact: string) => {
        const digits = contact.replace(/\D/g, "");
        if (digits.length > 4) {
            return contact.slice(0, -4).replace(/\d/g, "•") + contact.slice(-4);
        }
        return contact;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.15)" }}
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:border-blue-300 group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {team.teamName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                        <User size={14} className="shrink-0" />
                        <span className="truncate">{team.leaderName}</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                    <StatusIcon size={12} />
                    {status.label}
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone size={14} className="shrink-0 text-gray-400" />
                    <span>{maskContact(team.leaderContact)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={14} className="shrink-0 text-gray-400" />
                    <span className="truncate">{team.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar size={14} className="shrink-0 text-gray-400" />
                    <span>{team.date}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        Registered: {new Date(team.registeredAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

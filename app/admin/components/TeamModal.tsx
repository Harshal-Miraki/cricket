"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Team } from "../types";
import {
    X,
    MapPin,
    Calendar,
    Phone,
    User,
    CheckCircle2,
    Clock,
    XCircle,
    Image as ImageIcon,
    ExternalLink
} from "lucide-react";
import Image from "next/image";

interface TeamModalProps {
    team: Team | null;
    onClose: () => void;
    onUpdateStatus: (id: string, status: 'pending' | 'verified' | 'rejected') => void;
}

export default function TeamModal({ team, onClose, onUpdateStatus }: TeamModalProps) {
    if (!team) return null;

    const statusConfig = {
        pending: {
            icon: Clock,
            label: "Pending Verification",
            className: "bg-amber-100 text-amber-700 border-amber-200",
        },
        verified: {
            icon: CheckCircle2,
            label: "Payment Verified",
            className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        rejected: {
            icon: XCircle,
            label: "Payment Rejected",
            className: "bg-red-100 text-red-700 border-red-200",
        },
    };

    const status = statusConfig[team.status];
    const StatusIcon = status.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{team.teamName}</h2>
                            <p className="text-sm text-gray-500">Team Details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <X size={20} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Team Info */}
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${status.className}`}>
                                    <StatusIcon size={16} />
                                    {status.label}
                                </div>

                                {/* Team Details Card */}
                                <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Team Information</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                                <User size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Team Leader</p>
                                                <p className="text-sm font-medium text-gray-900">{team.leaderName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                                <Phone size={18} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Contact Number</p>
                                                <p className="text-sm font-medium text-gray-900">{team.leaderContact}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                                <MapPin size={18} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Location</p>
                                                <p className="text-sm font-medium text-gray-900">{team.location}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                                <Calendar size={18} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Tournament Date</p>
                                                <p className="text-sm font-medium text-gray-900">{team.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Info */}
                                <div className="bg-blue-50 rounded-2xl p-5">
                                    <p className="text-xs text-blue-600 font-medium">Registered On</p>
                                    <p className="text-sm text-blue-900 mt-1">
                                        {new Date(team.registeredAt).toLocaleString('en-IN', {
                                            dateStyle: 'full',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Payment Proof */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                        <ImageIcon size={16} />
                                        Payment Proof
                                    </h3>
                                    <a
                                        href={team.paymentProof}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        Open Full Size <ExternalLink size={12} />
                                    </a>
                                </div>
                                <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                                    <Image
                                        src={team.paymentProof}
                                        alt="Payment Proof"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                        {team.status !== 'rejected' && (
                            <button
                                onClick={() => onUpdateStatus(team.id, 'rejected')}
                                className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle size={16} />
                                Reject Payment
                            </button>
                        )}
                        {team.status !== 'verified' && (
                            <button
                                onClick={() => onUpdateStatus(team.id, 'verified')}
                                className="px-5 py-2.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={16} />
                                Verify Payment
                            </button>
                        )}
                        {team.status !== 'pending' && (
                            <button
                                onClick={() => onUpdateStatus(team.id, 'pending')}
                                className="px-5 py-2.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Clock size={16} />
                                Mark as Pending
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

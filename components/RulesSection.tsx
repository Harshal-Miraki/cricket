"use client";

import { useState } from "react";
import { ShieldCheck, Trophy, Info, AlertTriangle, Languages, Download, ZoomIn } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function RulesSection() {
    const [activeTab, setActiveTab] = useState<"en" | "gu">("gu");

    const rules = [
        {
            title: "Match Format",
            items: [
                "Matches will be 10 overs each side.",
                "A bowler can bowl a maximum of 2 overs.",
                "Round robin followed by knockout stage.",
            ],
            icon: <Trophy className="w-5 h-5" />,
        },
        {
            title: "General Rules",
            items: [
                "Teams must arrive 30 minutes before the scheduled time.",
                "Decision of the umpire will be final and binding.",
                "Proper cricket attire is mandatory for all players.",
            ],
            icon: <ShieldCheck className="w-5 h-5" />,
        },
        {
            title: "Equipment & Safety",
            items: [
                "The tournament will be played with a semi-hard tennis ball.",
                "Using pads and gloves is recommended.",
                "The organizer is not responsible for personal injuries.",
            ],
            icon: <Info className="w-5 h-5" />,
        },
        {
            title: "Disqualification",
            items: [
                "Any form of misconduct or sledging will lead to disqualification.",
                "Incomplete team roster during the match will lead to a walk-over.",
                "Using ineligible players will result in immediate ban.",
            ],
            icon: <AlertTriangle className="w-5 h-5" />,
        },
    ];

    return (
        <section id="rules" className="py-24 bg-blue-50/50 text-blue-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-blue-950 mb-4">Tournament Rules</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                </div>

                {/* Rules Images Selection */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-[40px] p-4 md:p-10 border border-blue-100 shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                            <div>
                                <h3 className="text-2xl font-bold text-blue-950 flex items-center gap-3">
                                    <Languages className="text-blue-600" />
                                    Detailed Rule Sheet
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Select your preferred language to view detailed rules.</p>
                            </div>
                            <div className="flex bg-blue-50 p-1.5 rounded-2xl border border-blue-100">
                                <button
                                    onClick={() => setActiveTab("en")}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "en" ? "bg-blue-600 text-white shadow-lg" : "text-blue-600 hover:bg-blue-100"}`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setActiveTab("gu")}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "gu" ? "bg-blue-600 text-white shadow-lg" : "text-blue-600 hover:bg-blue-100"}`}
                                >
                                    ગુજરાતી
                                </button>
                            </div>
                        </div>

                        <div className="relative group rounded-3xl overflow-hidden bg-gray-50 border border-blue-50 min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full aspect-3/4 md:aspect-[1/1.4]"
                                >
                                    <Image
                                        src={activeTab === "en" ? "/rules-en.png" : "/rules-gu.jpeg"}
                                        alt={`${activeTab === "en" ? "English" : "Gujarati"} Tournament Rules`}
                                        fill
                                        className="object-contain p-4 md:p-8"
                                        priority
                                    />

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={activeTab === "en" ? "/rules-en.png" : "/rules-gu.jpeg"}
                                            target="_blank"
                                            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-600 shadow-xl hover:bg-blue-600 hover:text-white transition-all scale-90 group-hover:scale-100"
                                            title="View Full Resolution"
                                        >
                                            <ZoomIn size={20} />
                                        </a>
                                        <a
                                            href={activeTab === "en" ? "/rules-en.png" : "/rules-gu.jpeg"}
                                            download={`Tournament-Rules-${activeTab.toUpperCase()}.png`}
                                            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-600 shadow-xl hover:bg-blue-600 hover:text-white transition-all scale-90 group-hover:scale-100 delay-75"
                                            title="Download Rules"
                                        >
                                            <Download size={20} />
                                        </a>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-6 font-medium tracking-wide">
                            Note: All participating teams must strictly adhere to the rules mentioned above.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

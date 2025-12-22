"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-blue-900">
            {/* Background image with overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?fm=jpg&q=60&w=3000"
                    alt="Cricket Tournament Background"
                    fill
                    className="object-cover opacity-30 grayscale-[0.2]"
                    priority
                />
            </div>

            <div className="container mx-auto px-4 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-blue-200 uppercase bg-blue-900/50 rounded-full border border-blue-700/50 backdrop-blur-sm">
                        Grand Cricket Tournament 2025
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Rise as the <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-200">Ultimate Champions</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100/80 mb-10 leading-relaxed font-light">
                        Bring your best squad, showcase your skills, and battle for the glory in the most prestigious cricket tournament of the year.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#register"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                        >
                            Register Team Now
                        </a>
                        <a
                            href="#rules"
                            className="px-8 py-4 bg-transparent hover:bg-white/5 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-sm"
                        >
                            Tournament Rules
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Subtle indicator scroll */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-blue-300/50"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.div>
        </section>
    );
}

"use client";

import { Phone, Mail, Instagram, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function OrganizerSection() {
    return (
        <section className="py-24 bg-white overflow-hidden text-blue-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-blue-950 mb-4">Meet Our Organizers</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                </div>

                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Full Width Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative w-full aspect-video md:aspect-21/9 rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-blue-50"
                    >
                        <Image
                            src="/players.jpeg"
                            alt="Tournament Organizers"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-blue-950/40 to-transparent" />
                    </motion.div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { name: "Munir Patel", phone: "99040 79102", color: "bg-blue-600" },
                            { name: "Riyaz Bapu", phone: "91575 31936", color: "bg-cyan-600" },
                            { name: "Mustakim", phone: "98700 94898", color: "bg-emerald-600" },
                            { name: "Wasim", phone: "87350 24952", color: "bg-rose-600" },
                        ].map((person, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all"
                            >
                                <div className={`w-12 h-12 ${person.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Phone size={20} />
                                </div>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Organizer</p>
                                <h4 className="text-base sm:text-xl font-bold text-blue-950">{person.name}</h4>
                                <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="mt-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                    {person.phone}
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

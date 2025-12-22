import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-blue-950 text-blue-100 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">CT</span>
                            CricketTourney
                        </h3>
                        <p className="text-blue-200/60 leading-relaxed text-sm">
                            Providing a professional stage for cricket enthusiasts to showcase their talent and compete at the highest level.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-blue-900/50 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-blue-900/50 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-blue-900/50 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-blue-900/50 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Home</a></li>
                            <li><a href="#register" className="text-blue-200/60 hover:text-blue-400 transition-colors">Registration</a></li>
                            <li><a href="#rules" className="text-blue-200/60 hover:text-blue-400 transition-colors">Tournament Rules</a></li>
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Schedule</a></li>
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Leaderboard</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">FAQs</a></li>
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Location</a></li>
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-blue-200/60 hover:text-blue-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Get in Touch</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex gap-3 items-start">
                                <MapPin className="text-blue-500 shrink-0" size={18} />
                                <span className="text-blue-200/60">DY Patil Stadium Arena,<br />Sector 7, Nerul, Navi Mumbai 400706</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone className="text-blue-500 shrink-0" size={18} />
                                <span className="text-blue-200/60">+91 79778 44273</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail className="text-blue-500 shrink-0" size={18} />
                                <span className="text-blue-200/60">info@tournament2025.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-blue-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-blue-200/40 text-xs">
                        © 2025 Cricket Tournament 2025. All Rights Reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] text-blue-200/30 uppercase tracking-widest font-bold">
                        <a href="#" className="hover:text-blue-400 transition-colors">Design By Antigravity</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

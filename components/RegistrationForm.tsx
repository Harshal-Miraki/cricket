"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Send, CheckCircle2, Loader2, Clock } from "lucide-react";
import Image from "next/image";
import { addTeam, getDailyTeamCount } from "@/lib/teamService";
import { getImagePreview, imagekitConfig } from "@/lib/imagekit";
import { IKContext, IKUpload } from "imagekitio-react";

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        teamName: "",
        leaderName: "",
        leaderContact: "",
        location: "",
        date: "",
        paymentProof: null as File | null,
        termsAccepted: false,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [checkingLimit, setCheckingLimit] = useState(true);

    const checkLimit = async () => {
        setCheckingLimit(true);
        try {
            const count = await getDailyTeamCount();
            if (count >= 4) {
                setIsLimitReached(true);
            } else {
                setIsLimitReached(false);
            }
        } catch (error) {
            console.error("Failed to check team limit", error);
        } finally {
            setCheckingLimit(false);
        }
    };

    useEffect(() => {
        checkLimit();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, paymentProof: file }));

            // Show local preview
            const previewUrl = await getImagePreview(file);
            setPreview(previewUrl);
            setUploadedImageUrl(null); // Reset uploaded URL when new file selected

            if (errors.paymentProof) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.paymentProof;
                    return newErrors;
                });
            }
        }
    };

    // ImageKit upload success handler
    const onUploadSuccess = (res: { url: string }) => {
        console.log("ImageKit Upload Success:", res);
        setUploadedImageUrl(res.url);
        setIsUploading(false);
    };

    // ImageKit upload error handler
    const onUploadError = (err: Error) => {
        console.error("ImageKit Upload Error:", err);
        setErrors((prev) => ({ ...prev, paymentProof: "Failed to upload image. Please try again." }));
        setIsUploading(false);
    };

    // ImageKit upload start handler
    const onUploadStart = () => {
        setIsUploading(true);
    };

    // ImageKit authenticator function
    const authenticator = async () => {
        try {
            const response = await fetch('/api/imagekit-auth');
            if (!response.ok) {
                throw new Error('Authentication failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Authentication request failed');
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.teamName) newErrors.teamName = "Team Name is required";
        if (!formData.leaderName) newErrors.leaderName = "Leader Name is required";
        if (!formData.leaderContact) newErrors.leaderContact = "Contact Number is required";
        if (!formData.location) newErrors.location = "Location is required";
        if (!formData.date) newErrors.date = "Registration Date is required";
        if (!formData.paymentProof && !uploadedImageUrl) newErrors.paymentProof = "Payment proof is required";
        if (!formData.termsAccepted) newErrors.termsAccepted = "You must agree to the terms";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Check if image is still uploading
        if (isUploading) {
            setErrors({ paymentProof: "Please wait for image upload to complete" });
            return;
        }

        // Check if we have the uploaded image URL
        if (!uploadedImageUrl) {
            setErrors({ paymentProof: "Please upload the payment proof image first" });
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Starting Firebase submission...");
            console.log("Data to submit:", {
                teamName: formData.teamName,
                leaderName: formData.leaderName,
                leaderContact: formData.leaderContact,
                location: formData.location,
                date: formData.date,
                paymentProof: uploadedImageUrl,
                termsAccepted: formData.termsAccepted,
            });

            // Save to Firebase with timeout
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firebase request timed out after 15 seconds")), 15000)
            );

            const submitPromise = addTeam({
                teamName: formData.teamName,
                leaderName: formData.leaderName,
                leaderContact: formData.leaderContact,
                location: formData.location,
                date: formData.date,
                paymentProof: uploadedImageUrl,
                termsAccepted: formData.termsAccepted,
            });

            const result = await Promise.race([submitPromise, timeoutPromise]);
            console.log("Firebase submission successful! Doc ID:", result);

            // Construct WhatsApp message
            const message = `*New Team Registration* 🏏%0A%0A` +
                `*Team Name:* ${formData.teamName}%0A` +
                `*Leader Name:* ${formData.leaderName}%0A` +
                `*Contact:* ${formData.leaderContact}%0A` +
                `*Location:* ${formData.location}%0A` +
                `*Date:* ${formData.date}%0A` +
                `*Payment Proof:* ${uploadedImageUrl}`;

            const whatsappUrl = `https://wa.me/919870094898?text=${message}`;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');

            window.open(whatsappUrl, '_blank');

            setIsSubmitted(true);

            // Re-check limit after successful submission
            checkLimit();
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setErrors({ submit: `Failed to submit: ${errorMessage}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            teamName: "",
            leaderName: "",
            leaderContact: "",
            location: "",
            date: "",
            paymentProof: null,
            termsAccepted: false,
        });
        setPreview(null);
        setUploadedImageUrl(null);
        setIsSubmitted(false);
        setErrors({});
        checkLimit(); // Re-check limit on reset
    };

    if (checkingLimit) {
        return (
            <section className="py-24 bg-white flex justify-center items-center min-h-[600px]">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
            </section>
        );
    }

    if (isLimitReached) {
        return (
            <section id="register" className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md mx-auto p-12 bg-amber-50 rounded-3xl border border-amber-100 shadow-xl"
                    >
                        <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 transform scale-110 shadow-lg shadow-amber-200">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-amber-900 mb-4">Registration Limit Reached</h2>
                        <p className="text-amber-800/80 mb-6 leading-relaxed">
                            The daily limit of 4 teams has been reached for today. Registration will reopen tomorrow at midnight.
                        </p>

                        <div className="w-full py-4 bg-white border-2 border-amber-100 text-amber-600 font-bold rounded-xl flex items-center justify-center gap-2">
                            Please check back tomorrow!
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (isSubmitted) {
        // Reconstruct message for the success view button (in case pop-up was blocked)
        const message = `*New Team Registration* 🏏%0A%0A` +
            `*Team Name:* ${formData.teamName}%0A` +
            `*Leader Name:* ${formData.leaderName}%0A` +
            `*Contact:* ${formData.leaderContact}%0A` +
            `*Location:* ${formData.location}%0A` +
            `*Date:* ${formData.date}%0A` +
            `*Payment Proof:* ${uploadedImageUrl}`;
        const whatsappUrl = `https://wa.me/919870094898?text=${message}`;

        return (
            <section id="register" className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md mx-auto p-12 bg-blue-50 rounded-3xl border border-blue-100 shadow-xl"
                    >
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 transform scale-110 shadow-lg shadow-blue-200">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">Registration Successful!</h2>
                        <p className="text-blue-600/80 mb-6 leading-relaxed">
                            Thank you for registering your team. We will verify your payment and contact the leader shortly.
                        </p>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 mb-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                        >
                            <Send size={18} />
                            Send Details on WhatsApp
                        </a>

                        <button
                            onClick={resetForm}
                            className="w-full py-4 bg-white border-2 border-blue-100 text-blue-600 font-bold rounded-xl transition-all hover:bg-blue-50"
                        >
                            Register Another Team
                        </button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="register" className="py-24 bg-white text-blue-950">
            <div className="container mx-auto px-4 text-blue-950">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-blue-950 mb-4">Team Registration</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    <p className="mt-6 text-gray-500 max-w-lg mx-auto">Fill out the form below to secure your spot in the tournament.</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Column: Team Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">01</span>
                                Team Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Name</label>
                                    <input
                                        type="text"
                                        name="teamName"
                                        value={formData.teamName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your team name"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.teamName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-blue-950`}
                                    />
                                    {errors.teamName && <p className="mt-1.5 text-xs text-red-500">{errors.teamName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Leader Name</label>
                                    <input
                                        type="text"
                                        name="leaderName"
                                        value={formData.leaderName}
                                        onChange={handleInputChange}
                                        placeholder="Full name of leader"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.leaderName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-blue-950`}
                                    />
                                    {errors.leaderName && <p className="mt-1.5 text-xs text-red-500">{errors.leaderName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="leaderContact"
                                        value={formData.leaderContact}
                                        onChange={handleInputChange}
                                        placeholder="+91 XXXXX XXXXX"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.leaderContact ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-blue-950`}
                                    />
                                    {errors.leaderContact && <p className="mt-1.5 text-xs text-red-500">{errors.leaderContact}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Team Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="City / Area"
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.location ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-blue-950`}
                                    />
                                    {errors.location && <p className="mt-1.5 text-xs text-red-500">{errors.location}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tournament Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border ${errors.date ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none text-blue-950`}
                                    />
                                    {errors.date && <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Payment Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-blue-900 flex items-center gap-2 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm">02</span>
                                Payment & Verification
                            </h3>

                            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-200">
                                <p className="text-lg font-bold text-white mb-6 text-center">Scan to Pay: ₹1000</p>
                                <div className="relative w-64 h-64 mx-auto bg-white p-2 rounded-2xl shadow-inner overflow-hidden">
                                    <Image
                                        src="/qr-code.png"
                                        alt="Payment QR"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="mt-6 flex items-center justify-center gap-3">
                                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider text-center">PhonePe</div>
                                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider text-center">GPay</div>
                                    <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-wider text-center">Paytm</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Upload Payment Proof</label>

                                <IKContext
                                    publicKey={imagekitConfig.publicKey}
                                    urlEndpoint={imagekitConfig.urlEndpoint}
                                    authenticator={authenticator}
                                >
                                    <div className={`relative group border-2 border-dashed ${errors.paymentProof ? 'border-red-300 bg-red-50' : uploadedImageUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50/50'} rounded-2xl p-8 transition-all hover:border-blue-400 hover:bg-blue-50/30 overflow-hidden`}>
                                        {/* Hidden ImageKit Upload Component */}
                                        <IKUpload
                                            fileName={`payment_${Date.now()}`}
                                            folder="/tournament-payments"
                                            onError={onUploadError}
                                            onSuccess={onUploadSuccess}
                                            onUploadStart={onUploadStart}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                        />

                                        <div className="text-center flex flex-col items-center justify-center">
                                            {isUploading ? (
                                                <div className="flex flex-col items-center">
                                                    <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
                                                    <p className="text-sm font-medium text-blue-600">Uploading...</p>
                                                </div>
                                            ) : preview || uploadedImageUrl ? (
                                                <div className="relative w-full h-32">
                                                    <Image src={uploadedImageUrl || preview || ""} alt="Proof Preview" fill className="object-contain" unoptimized />
                                                    <div className={`absolute inset-x-0 bottom-0 ${uploadedImageUrl ? 'bg-green-600/80' : 'bg-blue-600/80'} text-white text-[10px] py-1 backdrop-blur-sm`}>
                                                        {uploadedImageUrl ? '✓ Uploaded - Click to change' : 'Click to change'}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-blue-500 border border-gray-100 group-hover:scale-110 transition-transform">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-700">Drop screenshot here</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </IKContext>

                                {errors.paymentProof && <p className="mt-1.5 text-xs text-red-500">{errors.paymentProof}</p>}
                                {uploadedImageUrl && !errors.paymentProof && (
                                    <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Image uploaded successfully
                                    </p>
                                )}
                            </div>

                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            name="termsAccepted"
                                            checked={formData.termsAccepted}
                                            onChange={handleInputChange}
                                            className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                                        />
                                        <div className={`w-5 h-5 rounded border-2 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 ${errors.termsAccepted ? 'border-red-300' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                            {formData.termsAccepted && <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                    </div>
                                    <span className={`text-xs sm:text-sm leading-snug ${errors.termsAccepted ? 'text-red-500' : 'text-gray-600'}`}>
                                        I understand that the registration amount is <span className="font-bold text-blue-900 italic">non-refundable</span> and I agree to the tournament rules.
                                    </span>
                                </label>
                                {errors.termsAccepted && <p className="mt-1.5 text-xs text-red-500 pl-8">{errors.termsAccepted}</p>}
                            </div>

                            {errors.submit && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {errors.submit}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 mt-4 flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Registration
                                        <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

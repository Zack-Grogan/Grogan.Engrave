"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    quantity: string;
    productType: string;
    occasion: string;
    message: string;
    deadline: string;
}

export default function QuotePage() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        company: "",
        quantity: "",
        productType: "water-bottles",
        occasion: "",
        message: "",
        deadline: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to an API
        console.log("Quote request:", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen">
                <Navigation />
                <div className="flex items-center justify-center px-6 sm:px-8 lg:px-12 pt-32 pb-24">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold font-[var(--font-outfit)] mb-4 text-text-primary">
                            Quote Request Received!
                        </h1>
                        <p className="text-text-secondary mb-8">
                            We&apos;ve received your request and will get back to you within 24 hours with a custom quote.
                        </p>
                        <Link href="/products" className="btn-primary">
                            Continue Browsing
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Form */}
            <section className="pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-12">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <span className="text-accent text-sm font-medium tracking-widest uppercase">
                            Bulk Orders Welcome
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-outfit)] mt-2 text-text-primary">
                            Request a Quote
                        </h1>
                        <p className="text-text-secondary mt-2 text-sm sm:text-base px-4">
                            Fill out the form below and we&apos;ll get back to you within 24 hours with a custom quote.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        {/* Contact Info */}
                        <div className="card p-6 sm:p-8">
                            <h3 className="font-semibold mb-4 text-text-primary">Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Company/Organization</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="card p-6 sm:p-8">
                            <h3 className="font-semibold mb-4 sm:mb-6 text-text-primary">Order Details</h3>
                            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Quantity *</label>
                                    <select
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    >
                                        <option value="">Select quantity</option>
                                        <option value="1-10">1-10 units</option>
                                        <option value="10-25">10-25 units</option>
                                        <option value="25-50">25-50 units</option>
                                        <option value="50-100">50-100 units</option>
                                        <option value="100+">100+ units</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Product Type *</label>
                                    <select
                                        required
                                        value={formData.productType}
                                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    >
                                        <option value="water-bottles">Water Bottles</option>
                                        <option value="tumblers">Tumblers</option>
                                        <option value="flasks">Flasks</option>
                                        <option value="mixed">Mixed Selection</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Occasion</label>
                                    <select
                                        value={formData.occasion}
                                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    >
                                        <option value="">Select occasion</option>
                                        <option value="corporate">Corporate Event</option>
                                        <option value="wedding">Wedding</option>
                                        <option value="sports-team">Sports Team</option>
                                        <option value="graduation">Graduation</option>
                                        <option value="holiday">Holiday Gifts</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-text-muted mb-2">Needed By</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none focus-visible:outline-accent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="card p-6 sm:p-8">
                            <h3 className="font-semibold mb-4 sm:mb-6 text-text-primary">Additional Details</h3>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Tell us about your project. Include any specific design requirements, colors, or questions..."
                                rows={5}
                                className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus-visible:outline-accent resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button type="submit" className="w-full btn-primary text-base sm:text-lg py-4 touch-manipulation">
                            Submit Quote Request
                        </button>

                        <p className="text-center text-sm text-text-muted">
                            We typically respond within 24 hours on business days.
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
}

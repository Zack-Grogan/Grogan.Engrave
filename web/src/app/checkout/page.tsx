"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import { SIZES, COLORS, getVariantByOptions, ENGRAVING_FEE, getBulkDiscount } from "@/lib/products";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

function CheckoutLoading() {
    return (
        <div className="min-h-screen">
            <Navigation />
            <div className="flex items-center justify-center pt-32 pb-24">
                <div className="animate-pulse text-text-muted">Loading checkout...</div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState<"review" | "shipping" | "payment" | "confirmation">("review");
    const [isProcessing, setIsProcessing] = useState(false);

    // Get product details from URL params
    const sizeId = searchParams.get("size") || "20oz";
    const colorId = searchParams.get("color") || "black";
    const quantity = parseInt(searchParams.get("quantity") || "1");
    const text = searchParams.get("text") || "";
    const font = searchParams.get("font") || "Roboto, sans-serif";
    const alignment = searchParams.get("alignment") || "center";

    const size = SIZES.find(s => s.id === sizeId);
    const color = COLORS.find(c => c.id === colorId);
    const variant = size && color ? getVariantByOptions(size.id, color.id) : null;

    const basePrice = size?.basePrice || 0;
    const unitPrice = basePrice + ENGRAVING_FEE;
    const discount = getBulkDiscount(quantity);
    const subtotal = (unitPrice * quantity) * (1 - discount);
    const shipping = subtotal >= 75 ? 0 : 7.99;
    const total = subtotal + shipping;

    const [formData, setFormData] = useState<CheckoutFormData>({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
    });

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("payment");
    };

    const handlePaymentSuccess = () => {
        setIsProcessing(false);
        setStep("confirmation");
    };

    if (step === "confirmation") {
        return (
            <div className="min-h-screen">
                <Navigation />
                <div className="flex items-center justify-center px-6 sm:px-8 lg:px-12 pt-32 pb-24">
                    <div className="max-w-md text-center">
                        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6 animate-fade-in">
                            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold font-[var(--font-outfit)] mb-4 text-text-primary animate-fade-in">
                            Order Placed Successfully!
                        </h1>
                        <p className="text-text-secondary mb-2 animate-fade-in">
                            Thank you for your order, {formData.firstName}!
                        </p>
                        <p className="text-text-secondary mb-8 animate-fade-in">
                            We&apos;ll send your design proof within 4-8 hours. You can review and approve it before we begin engraving.
                        </p>
                        <div className="space-y-3 animate-fade-in">
                            <Link href="/products" className="btn-primary block">
                                Continue Shopping
                            </Link>
                            <Link href="/" className="btn-secondary block">
                                Return Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Progress Steps */}
            <div className="pt-28 px-4 sm:px-6 lg:px-12 pb-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {[
                            { id: "review", label: "Review" },
                            { id: "shipping", label: "Shipping" },
                            { id: "payment", label: "Payment" },
                        ].map((s, i) => (
                            <div key={s.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${step === s.id
                                        ? "bg-accent text-white"
                                        : ["shipping", "payment"].includes(step) && ["review", "shipping"].includes(s.id)
                                            ? "bg-success text-white"
                                            : "bg-surface text-text-muted"
                                    }`}>
                                    {["shipping", "payment"].includes(step) && ["review", "shipping"].includes(s.id) ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${step === s.id ? "text-accent" : "text-text-muted"
                                    }`}>
                                    {s.label}
                                </span>
                                {i < 2 && (
                                    <div className={`w-12 h-0.5 ml-4 ${["shipping", "payment"].includes(step) && ["review", "shipping"].includes(s.id)
                                            ? "bg-success"
                                            : "bg-border"
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-12 pb-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === "review" && (
                            <div className="card p-6 sm:p-8">
                                <h2 className="text-2xl font-bold font-[var(--font-outfit)] mb-6 text-text-primary">
                                    Review Your Order
                                </h2>

                                {/* Product Summary */}
                                <div className="flex gap-6 mb-6 pb-6 border-b border-border">
                                    <div className="w-32 h-32 relative bg-surface rounded-lg overflow-hidden flex-shrink-0">
                                        {variant && (
                                            <img
                                                src={variant.image}
                                                alt={`${size?.name} ${color?.name}`}
                                                className="w-full h-full object-contain p-4"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-text-primary mb-1">
                                            {size?.name} {color?.name}
                                        </h3>
                                        <p className="text-sm text-text-muted mb-2">
                                            Polar Camel Water Bottle
                                        </p>
                                        <p className="text-sm text-text-secondary mb-2">
                                            Quantity: {quantity}
                                        </p>
                                        {text && (
                                            <div className="text-sm text-text-secondary">
                                                <p className="font-medium mb-1">Engraving:</p>
                                                <p className="italic" style={{ fontFamily: font }}>
                                                    {text}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-accent">
                                            ${subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Subtotal ({quantity} × ${unitPrice.toFixed(2)})</span>
                                        <span>${(unitPrice * quantity).toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-success">
                                            <span>Bulk Discount ({(discount * 100).toFixed(0)}%)</span>
                                            <span>−${((unitPrice * quantity) * discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-text-primary pt-3 border-t border-border">
                                        <span>Total</span>
                                        <span className="text-accent">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Proof Notice */}
                                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-text-primary">Proof Approval Process</p>
                                            <p className="text-sm text-text-secondary mt-1">
                                                We&apos;ll send you a design proof within 4-8 hours. Your card won&apos;t be charged until you approve the proof.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep("shipping")}
                                    className="w-full btn-primary text-base py-4"
                                >
                                    Proceed to Shipping →
                                </button>
                            </div>
                        )}

                        {step === "shipping" && (
                            <div className="card p-6 sm:p-8">
                                <h2 className="text-2xl font-bold font-[var(--font-outfit)] mb-6 text-text-primary">
                                    Shipping Information
                                </h2>

                                <form onSubmit={handleShippingSubmit} className="space-y-6">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">First Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">Last Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.addressLine1}
                                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                            className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            placeholder="123 Main St"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-text-muted mb-2">Address Line 2</label>
                                        <input
                                            type="text"
                                            value={formData.addressLine2}
                                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                            className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            placeholder="Apt, suite, etc. (optional)"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">City *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">State *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-text-muted mb-2">ZIP Code *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.zipCode}
                                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                                className="w-full bg-surface border border-border rounded-lg p-3 text-text-primary focus:border-accent focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep("review")}
                                            className="flex-1 btn-secondary py-3"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 btn-primary py-3"
                                        >
                                            Continue to Payment →
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {step === "payment" && (
                            <Elements stripe={stripePromise}>
                                <PaymentForm
                                    amount={total}
                                    onSuccess={handlePaymentSuccess}
                                    onBack={() => setStep("shipping")}
                                    isProcessing={isProcessing}
                                    setIsProcessing={setIsProcessing}
                                />
                            </Elements>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h3 className="font-semibold mb-4 text-text-primary">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">{size?.name} {color?.name} × {quantity}</span>
                                    <span className="text-text-primary">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Engraving Fee</span>
                                    <span className="text-text-primary">Included</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-success">
                                        <span>Bulk Discount</span>
                                        <span>−${((unitPrice * quantity) * discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Shipping</span>
                                    <span className="text-text-primary">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between font-bold">
                                    <span className="text-text-primary">Total</span>
                                    <span className="text-accent">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {shipping === 0 && (
                                <div className="mt-4 text-xs text-success bg-success/10 rounded-lg p-3">
                                    ✓ Free shipping applied!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

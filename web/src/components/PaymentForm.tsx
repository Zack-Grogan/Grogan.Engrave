"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

interface PaymentFormProps {
    amount: number;
    onSuccess: () => void;
    onBack: () => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

export default function PaymentForm({ amount, onSuccess, onBack, isProcessing, setIsProcessing }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Create payment intent
            const response = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    metadata: {
                        type: "engraved_product",
                    },
                }),
            });

            const { clientSecret, paymentIntentId } = await response.json();

            // Confirm payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    },
                }
            );

            if (confirmError) {
                setError(confirmError.message || "Payment failed");
                setIsProcessing(false);
            } else if (paymentIntent?.status === "succeeded") {
                onSuccess();
            }
        } catch (err) {
            setError("An error occurred during payment processing");
            setIsProcessing(false);
        }
    };

    return (
        <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-bold font-[var(--font-outfit)] mb-6 text-text-primary">
                Payment Method
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card Element */}
                <div className="bg-surface-alt rounded-lg p-4">
                    <label className="block text-sm text-text-muted mb-2">Card Details</label>
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "var(--text-primary)",
                                    "::placeholder": {
                                        color: "var(--text-muted)",
                                    },
                                },
                            },
                        }}
                        className="w-full"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        {error}
                    </div>
                )}

                {/* Order Total */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-text-primary">Total Amount</span>
                        <span className="text-2xl font-bold text-accent">${amount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                        Your card will be charged after you approve the design proof.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isProcessing}
                        className="flex-1 btn-secondary py-3 disabled:opacity-50"
                    >
                        ← Back
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || isProcessing}
                        className="flex-1 btn-primary py-3 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Place Order"
                        )}
                    </button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secured by Stripe</span>
                </div>
            </form>
        </div>
    );
}

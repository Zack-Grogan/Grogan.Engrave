"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How long does it take to receive my order?",
      answer: "Standard orders typically ship within 3-5 business days. Custom engraved orders may take 5-7 business days depending on the complexity of the design. Bulk orders may require additional time. We'll provide you with a tracking number as soon as your order ships.",
    },
    {
      question: "What types of products can you engrave?",
      answer: "We specialize in laser engraving drinkware including tumblers, water bottles, flasks, and mugs. Our products are made from high-quality materials like stainless steel and BPA-free plastic. We can engrave text, logos, and custom designs on most of our products.",
    },
    {
      question: "Can I see a proof before you engrave my order?",
      answer: "Yes! For custom orders, we'll send you a digital proof for approval before we begin engraving. This ensures your design looks exactly how you want it. You'll have the opportunity to request changes before production begins.",
    },
    {
      question: "What's the minimum order quantity?",
      answer: "There's no minimum order for individual purchases. For wholesale pricing and bulk orders, the minimum quantity is typically 12 units per design. Contact us for specific pricing tiers and volume discounts.",
    },
    {
      question: "Do you offer discounts for bulk orders?",
      answer: "Absolutely! We offer competitive wholesale pricing for bulk orders starting at 12 units. The more you order, the greater the discount. Sports teams, weddings, and corporate events can all benefit from our volume pricing. Visit our wholesale page or contact us for a custom quote.",
    },
    {
      question: "Can I use my own logo or design?",
      answer: "Yes, we can engrave your custom logo, artwork, or design. We accept high-resolution vector files (AI, EPS, SVG, PDF) and high-quality raster images (PNG, JPG) with a minimum resolution of 300 DPI. Our design team can also help create custom designs for you.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. For wholesale orders, we also offer net payment terms for qualified businesses after approval.",
    },
    {
      question: "What's your return policy?",
      answer: "We want you to be completely satisfied with your order. If there's an issue with engraving quality or product defects, please contact us within 14 days of receipt and we'll make it right. Please note that custom engraved items cannot be returned unless there's a defect or error on our part.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship within the United States. We offer standard and expedited shipping options. International shipping may be available for large wholesale orders—please contact us for more information.",
    },
    {
      question: "How should I care for my engraved drinkware?",
      answer: "Our laser-engraved products are durable and designed to last. Hand washing is recommended to preserve the engraving quality. Avoid abrasive cleaners and scrubbing directly on the engraved area. Most of our products are not dishwasher safe unless specifically marked.",
    },
  ];

  const categories = [
    { name: "Ordering & Shipping", count: 3 },
    { name: "Customization", count: 3 },
    { name: "Pricing & Discounts", count: 2 },
    { name: "Care & Returns", count: 2 },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-6 sm:px-8 lg:px-12 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-subtle/30 via-background to-background" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <span className="inline-block text-accent text-sm font-semibold tracking-widest uppercase mb-6">
              Help & Support
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[var(--font-outfit)] mb-8 leading-tight text-text-primary">
              Frequently Asked
              <br />
              <span className="text-accent">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
              Find answers to common questions about our products, ordering process,
              and customization options.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {categories.map((category, i) => (
              <div
                key={category.name}
                className="card px-6 py-4 flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-accent font-bold text-lg">{category.count}</span>
                <span className="text-text-primary font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between gap-4 hover:bg-surface-alt/50 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-base sm:text-lg font-semibold text-text-primary font-[var(--font-outfit)] pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 sm:px-8 pb-6 pt-0">
                    <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-accent/10 to-accent-subtle/30">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mb-4 sm:mb-6 text-text-primary">
            Still Have Questions?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 leading-relaxed px-4">
            Can't find the answer you're looking for? Our team is here to help.
            Reach out and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base px-6 sm:px-8 py-3 sm:py-4">
              Contact Us
            </Link>
            <Link href="/quote" className="btn-secondary text-base px-6 sm:px-8 py-3 sm:py-4">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-text-primary font-[var(--font-outfit)] tracking-tight">
                GROGAN<span className="text-accent">ENGRAVE</span>
              </span>
            </Link>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-sm text-text-secondary">
              <Link href="/about" className="hover:text-accent transition-colors py-2 touch-manipulation">
                About
              </Link>
              <Link href="/contact" className="hover:text-accent transition-colors py-2 touch-manipulation">
                Contact
              </Link>
              <Link href="/faq" className="hover:text-accent transition-colors py-2 touch-manipulation">
                FAQ
              </Link>
              <Link href="/wholesale" className="hover:text-accent transition-colors py-2 touch-manipulation">
                Wholesale
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-text-muted text-center md:text-left">
              © 2026 GroganEngrave. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

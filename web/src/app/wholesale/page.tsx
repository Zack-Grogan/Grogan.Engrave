"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Wholesale() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    quantity: "",
    productType: "",
    timeline: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Wholesale form submitted:", formData);
      setSubmitStatus("success");
      setFormData({ name: "", company: "", email: "", phone: "", quantity: "", productType: "", timeline: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const pricingTiers = [
    { quantity: "12-24", discount: "10% off" },
    { quantity: "25-49", discount: "15% off" },
    { quantity: "50-99", discount: "20% off" },
    { quantity: "100-249", discount: "25% off" },
    { quantity: "250+", discount: "30% off" },
  ];

  const benefits = [
    {
      title: "Volume Discounts",
      description: "Save up to 30% on bulk orders with our tiered pricing structure.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Custom Branding",
      description: "Add your logo, team name, or custom design to any product.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      title: "Dedicated Support",
      description: "Work with a dedicated account manager for your bulk order.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Fast Production",
      description: "Quick turnaround times with priority production for bulk orders.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Flexible Payment",
      description: "Net payment terms available for qualified businesses.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      title: "Design Assistance",
      description: "Free design consultation and digital proofs before production.",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  const useCases = [
    {
      title: "Sports Teams",
      description: "Custom engraved water bottles and tumblers for teams of all sizes.",
      items: ["Youth leagues", "School teams", "Adult recreational", "Professional organizations"],
    },
    {
      title: "Corporate Events",
      description: "Branded drinkware for company events, conferences, and employee gifts.",
      items: ["Trade shows", "Company retreats", "Employee recognition", "Client gifts"],
    },
    {
      title: "Weddings & Celebrations",
      description: "Personalized favors that guests will actually use and cherish.",
      items: ["Wedding parties", "Bridal showers", "Baby showers", "Anniversary celebrations"],
    },
    {
      title: "Fundraisers",
      description: "Custom products to help your organization raise money effectively.",
      items: ["School fundraisers", "Charity events", "Non-profit campaigns", "Community projects"],
    },
  ];

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
              Bulk Orders
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[var(--font-outfit)] mb-8 leading-tight text-text-primary">
              Wholesale &
              <br />
              <span className="text-accent">Bulk Orders</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
              Save up to 30% on bulk orders. Perfect for sports teams, corporate events,
              weddings, and fundraisers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-200">
              <Link href="#quote-form" className="btn-primary text-base px-8 py-4">
                Get a Quote
              </Link>
              <Link href="/products" className="btn-secondary text-base px-8 py-4">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Volume Discounts
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Tiered Pricing
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              The more you order, the more you save. All prices include custom engraving.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {pricingTiers.map((tier, i) => (
              <div
                key={tier.quantity}
                className={`card p-6 text-center animate-fade-in ${
                  i === 4 ? "border-accent ring-2 ring-accent/20" : ""
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-accent mb-2">{tier.discount}</p>
                <p className="text-text-primary font-medium mb-1">{tier.quantity} units</p>
                <p className="text-xs text-text-muted">per order</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Wholesale Benefits
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="card p-6 sm:p-8 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary font-[var(--font-outfit)]">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Perfect For
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Popular Use Cases
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {useCases.map((useCase, i) => (
              <div
                key={useCase.title}
                className="card p-6 sm:p-8 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3 text-text-primary font-[var(--font-outfit)]">
                  {useCase.title}
                </h3>
                <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <ul className="space-y-2">
                  {useCase.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote-form" className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Get Started
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Request a Quote
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours with a custom quote.
            </p>
          </div>

          <div className="card p-8 animate-fade-in animate-delay-200">
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-success font-medium">Thank you! We've received your request and will be in touch soon.</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                <p className="text-error font-medium">Something went wrong. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-text-primary mb-2">
                    Quantity Needed *
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  >
                    <option value="">Select quantity</option>
                    <option value="12-24">12-24 units</option>
                    <option value="25-49">25-49 units</option>
                    <option value="50-99">50-99 units</option>
                    <option value="100-249">100-249 units</option>
                    <option value="250+">250+ units</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="productType" className="block text-sm font-medium text-text-primary mb-2">
                    Product Type *
                  </label>
                  <select
                    id="productType"
                    name="productType"
                    required
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  >
                    <option value="">Select product type</option>
                    <option value="tumblers">Tumblers</option>
                    <option value="water-bottles">Water Bottles</option>
                    <option value="flasks">Flasks</option>
                    <option value="mixed">Mixed Products</option>
                    <option value="not-sure">Not Sure Yet</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-text-primary mb-2">
                  Timeline *
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  required
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                >
                  <option value="">Select timeline</option>
                  <option value="asap">ASAP</option>
                  <option value="2-weeks">Within 2 weeks</option>
                  <option value="1-month">Within 1 month</option>
                  <option value="2-months">Within 2 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your project, custom design needs, or any other details..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full text-base px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Request Quote"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-accent/10 to-accent-subtle/30">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mb-4 sm:mb-6 text-text-primary">
            Questions About Bulk Orders?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 leading-relaxed px-4">
            Our team is here to help you find the perfect solution for your needs.
            Reach out and we'll guide you through the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-base px-6 sm:px-8 py-3 sm:py-4">
              Contact Us
            </Link>
            <Link href="/faq" className="btn-secondary text-base px-6 sm:px-8 py-3 sm:py-4">
              View FAQ
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

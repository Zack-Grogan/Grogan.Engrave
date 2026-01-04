import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function About() {
  const values = [
    {
      title: "Quality Craftsmanship",
      description: "Every piece is laser-engraved with precision and care, ensuring lasting beauty and durability.",
    },
    {
      title: "Personalized Service",
      description: "We work closely with you to bring your vision to life, from concept to completion.",
    },
    {
      title: "Fast Turnaround",
      description: "Quick production times without compromising on quality, because your memories matter.",
    },
  ];

  const milestones = [
    { year: "2020", title: "Founded", description: "Started as a small home-based laser engraving business" },
    { year: "2022", title: "Expansion", description: "Grew to serve sports teams and corporate clients" },
    { year: "2024", title: "Online Launch", description: "Launched e-commerce platform to reach customers nationwide" },
    { year: "2026", title: "Growing", description: "Continuing to expand our product offerings and services" },
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
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[var(--font-outfit)] mb-8 leading-tight text-text-primary">
              Crafting Memories,
              <br />
              <span className="text-accent">One Engraving at a Time</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
              From humble beginnings to becoming a trusted name in personalized drinkware,
              our passion for quality and customer satisfaction drives everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none animate-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mb-8 text-text-primary">
              How It All Began
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              GroganEngrave started with a simple idea: create beautiful, personalized drinkware that people would treasure forever. What began as a passion project in a small home workshop has grown into a business that touches thousands of lives across the country.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              Our founder, inspired by the joy of giving personalized gifts, saw an opportunity to combine modern laser engraving technology with timeless craftsmanship. Every tumbler, water bottle, and flask that leaves our workshop carries with it a story—whether it's a wedding favor, a team trophy, or a corporate gift.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              We believe that personalization makes everything more special. That's why we pour our hearts into every engraving, ensuring that each piece meets our exacting standards for quality and attention to detail.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Today, we're proud to serve customers from all walks of life—sports teams celebrating victories, couples starting their journey together, businesses building their brand, and individuals marking life's special moments. Thank you for being part of our story.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-surface-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              What We Stand For
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="card p-8 text-center animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary font-[var(--font-outfit)]">
                  {value.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Key Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className="relative flex items-start gap-6 animate-fade-in"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-accent text-white font-bold items-center justify-center shrink-0 shadow-lg shadow-accent/25 z-10">
                    {milestone.year}
                  </div>
                  <div className="md:hidden w-12 h-12 rounded-full bg-accent text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {milestone.year.slice(-2)}
                  </div>

                  {/* Content */}
                  <div className="card p-6 flex-1">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-text-primary font-[var(--font-outfit)]">
                      {milestone.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-accent/10 to-accent-subtle/30">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mb-4 sm:mb-6 text-text-primary">
            Ready to Create Your Custom Piece?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 leading-relaxed px-4">
            Let us help you craft something truly special. Whether it's a single gift or a bulk order,
            we're here to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/products" className="btn-primary text-base px-6 sm:px-8 py-3 sm:py-4">
              Browse Products
            </Link>
            <Link href="/contact" className="btn-secondary text-base px-6 sm:px-8 py-3 sm:py-4">
              Contact Us
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

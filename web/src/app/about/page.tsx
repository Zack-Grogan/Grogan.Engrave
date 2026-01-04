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

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Wedding Planner",
      text: "GroganEngrave created the perfect wedding favors for our clients. The quality is unmatched and the personalization options are endless.",
      rating: 5,
    },
    {
      name: "Mike T.",
      role: "Sports Coach",
      text: "Our team loves their custom engraved tumblers. They've held up perfectly through an entire season of games and practices.",
      rating: 5,
    },
    {
      name: "Jennifer L.",
      role: "Business Owner",
      text: "The corporate gifts we ordered were a huge hit. Professional, elegant, and delivered on time. Highly recommend!",
      rating: 5,
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
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mb-8 text-text-primary reveal-on-scroll">
              How It All Began
            </h2>
            <div className="decorative-line-left reveal-on-scroll delay-100" />
            <p className="text-text-secondary leading-relaxed mb-6 drop-cap reveal-on-scroll delay-200">
              GroganEngrave started with a simple idea: create beautiful, personalized drinkware that people would treasure forever. What began as a passion project in a small home workshop has grown into a business that touches thousands of lives across the country.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6 reveal-on-scroll delay-300">
              Our founder, inspired by the joy of giving personalized gifts, saw an opportunity to combine modern laser engraving technology with timeless craftsmanship. Every tumbler, water bottle, and flask that leaves our workshop carries with it a story—whether it's a wedding favor, a team trophy, or a corporate gift.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6 reveal-on-scroll delay-400">
              We believe that personalization makes everything more special. That's why we pour our hearts into every engraving, ensuring that each piece meets our exacting standards for quality and attention to detail.
            </p>
            <p className="text-text-secondary leading-relaxed reveal-on-scroll delay-500">
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
          <div className="text-center mb-12 sm:mb-16 reveal-on-scroll">
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
                  className="relative flex items-start gap-6 reveal-on-scroll"
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
                  <div className="card p-6 flex-1 card-luxury">
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

      {/* Craftsmanship Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-surface-alt gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 reveal-on-scroll">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              The Craft
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              Precision in Every Detail
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Our laser engraving process combines cutting-edge technology with artisanal attention to detail.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔬",
                title: "High-Precision Lasers",
                description: "State-of-the-art CO2 laser systems ensure crisp, permanent engravings that won't fade or peel.",
              },
              {
                icon: "✨",
                title: "Premium Materials",
                description: "We only use double-wall vacuum-insulated stainless steel tumblers of the highest quality.",
              },
              {
                icon: "🎨",
                title: "Custom Designs",
                description: "From simple text to complex logos, our design tools bring your vision to life with precision.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card p-8 text-center card-luxury reveal-on-scroll"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-text-primary font-[var(--font-outfit)]">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 reveal-on-scroll">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="card p-8 card-luxury reveal-on-scroll"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-text-primary font-[var(--font-outfit)]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
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

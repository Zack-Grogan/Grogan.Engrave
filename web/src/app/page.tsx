import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden noise-overlay">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-surface-alt via-background to-surface-alt" />
          {/* Decorative gradient overlays */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-subtle/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Animated decorative elements */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-20 w-3 h-3 bg-accent-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent-secondary/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-20 text-center max-w-5xl px-6">
          {/* Social proof badge */}
          <div className="reveal-on-scroll delay-100 mb-8">
            <div className="inline-flex items-center gap-2 bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/20 shadow-sm">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-text-secondary">Trusted by 2,000+ happy customers</span>
            </div>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-text-primary mb-6 leading-tight tracking-tight reveal-on-scroll delay-200">
            Crafted for <span className="italic text-accent">Memories</span>,<br />
            Engraved for Life.
          </h1>
          <div className="decorative-line reveal-on-scroll delay-300" />
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 font-sans font-light tracking-wide reveal-on-scroll delay-400">
            Turn everyday drinkware into cherished keepsakes. Premium laser engraving for weddings, corporate gifts, and personal treasures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center reveal-on-scroll delay-500">
            <Link
              href="/customize"
              className="btn-primary btn-magnetic btn-ripple bg-accent text-white px-10 py-4 rounded-sm font-serif text-xl hover:bg-accent-hover transition-all duration-500 ease-out uppercase tracking-widest min-w-[240px] shadow-lg shadow-accent/25"
            >
              Start Designing
            </Link>
            <Link
              href="/about"
              className="btn-secondary btn-magnetic px-10 py-4 rounded-sm font-serif text-lg border-2 border-accent/30 text-text-primary hover:border-accent hover:text-accent transition-all duration-500 ease-out uppercase tracking-widest min-w-[240px]"
            >
              View Our Process
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* "The Studio" Section - Value Prop */}
      <section className="py-24 px-6 bg-background gradient-subtle">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative aspect-square md:aspect-[4/5] bg-surface-alt rounded-sm overflow-hidden image-zoom-container card-luxury border border-border/50">
              {/* Placeholder for Product Closeup */}
              <Image
                src="/products/lifestyle_main.png"
                alt="Hand holding custom engraved tumbler"
                fill
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <span className="text-accent uppercase tracking-[0.2em] text-sm font-bold reveal-on-scroll">The Experience</span>
            <h2 className="font-serif text-4xl md:text-5xl text-text-primary leading-tight reveal-on-scroll delay-100">
              Where Precision Meets <br />
              <span className="italic text-text-muted">Personalization.</span>
            </h2>
            <div className="space-y-6 text-text-muted font-light text-lg leading-relaxed reveal-on-scroll delay-200">
              <p className="drop-cap">
                We believe that a gift isn't just an object; it's a memory made tangible. Our studio specializes in high-precision laser engraving on premium double-walled stainless steel tumblers.
              </p>
              <p>
                Whether it's a single custom piece for a loved one or 100 branded vessels for your team, we treat every single item as a masterpiece.
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-8 border-t border-border mt-8 reveal-on-scroll delay-300">
              <div>
                <h4 className="font-serif text-2xl text-primary mb-2">No Minimums</h4>
                <p className="text-sm text-text-muted">Order 1 or 1,000. We scale with you.</p>
              </div>
              <div>
                <h4 className="font-serif text-2xl text-primary mb-2">Fast Turnaround</h4>
                <p className="text-sm text-text-muted">Ships in 3-5 days. Local pickup available.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-20 px-6 gradient-warm">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-3xl mb-4 italic">Grogan Engrave</h3>
              <p className="text-white/60 font-light mb-6">Handcrafted with care in Houston, Texas</p>
              <div className="flex gap-4">
                {/* Social Links */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition-all duration-300 flex items-center justify-center group" aria-label="Instagram">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition-all duration-300 flex items-center justify-center group" aria-label="Facebook">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent transition-all duration-300 flex items-center justify-center group" aria-label="Pinterest">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-serif text-xl mb-4">Stay Inspired</h4>
              <p className="text-white/60 font-light text-sm mb-4">Get design tips, exclusive offers, and new product announcements.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-accent text-white font-serif uppercase tracking-widest text-sm hover:bg-accent-hover transition-all duration-300 btn-magnetic btn-ripple"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Quote & Links */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-white/80 font-serif text-xl italic mb-8">
                  "The details are not the details. <br /> They make the design."
                </p>
                <Link href="/customize" className="inline-block text-accent hover:text-white uppercase tracking-widest text-sm border-b border-accent/30 pb-1 transition-colors duration-300">
                  Create Your Feature Piece →
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Trusted & Secure</p>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Fast Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <Link href="/about" className="hover:text-accent transition-colors py-2">About</Link>
              <Link href="/contact" className="hover:text-accent transition-colors py-2">Contact</Link>
              <Link href="/faq" className="hover:text-accent transition-colors py-2">FAQ</Link>
              <Link href="/wholesale" className="hover:text-accent transition-colors py-2">Wholesale</Link>
              <Link href="/collections" className="hover:text-accent transition-colors py-2">Collections</Link>
            </div>
            <p className="text-xs text-white/40 text-center md:text-left">
              © 2026 GroganEngrave. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

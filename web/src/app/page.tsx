import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background - In a real app, this would be a lifestyle video or high-end photo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10" />
          {/* Placeholder for Lifestyle Image - Replace specifically with a high-res texture or photo */}
          <div className="w-full h-full bg-surface-alt" />
        </div>

        <div className="relative z-20 text-center max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-text-primary mb-6 leading-tight tracking-tight">
            Crafted for <span className="italic text-accent">Memories</span>,<br />
            Engraved for Life.
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 font-sans font-light tracking-wide">
            Turn everyday drinkware into cherished keepsakes. Premium laser engraving for weddings, corporate gifts, and personal treasures.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/customize"
              className="bg-white text-primary px-10 py-4 rounded-sm font-serif text-xl hover:bg-accent hover:text-white transition-all duration-500 ease-out uppercase tracking-widest min-w-[240px]"
            >
              Start Designing
            </Link>
          </div>
        </div>
      </section>

      {/* "The Studio" Section - Value Prop */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative aspect-square md:aspect-[4/5] bg-surface-alt rounded-sm overflow-hidden">
              {/* Placeholder for Product Closeup */}
              <Image
                src="/products/lifestyle_main.png"
                alt="Hand holding custom engraved tumbler"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <span className="text-accent uppercase tracking-[0.2em] text-sm font-bold">The Experience</span>
            <h2 className="font-serif text-4xl md:text-5xl text-text-primary leading-tight">
              Where Precision Meets <br />
              <span className="italic text-text-muted">Personalization.</span>
            </h2>
            <div className="space-y-6 text-text-muted font-light text-lg leading-relaxed">
              <p>
                We believe that a gift isn't just an object; it's a memory made tangible. Our studio specializes in high-precision laser engraving on premium double-walled stainless steel tumblers.
              </p>
              <p>
                Whether it's a single custom piece for a loved one or 100 branded vessels for your team, we treat every single item as a masterpiece.
              </p>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-8 border-t border-border mt-8">
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
      <footer className="bg-primary text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <h3 className="font-serif text-3xl mb-4 italic">Grogan Engrave</h3>
            <p className="text-white/60 font-light">Houston, Texas</p>
          </div>
          <div className="flex flex-col gap-4 items-center md:items-end">
            <p className="text-white/80 font-serif text-xl italic">
              "The details are not the details. <br /> They make the design."
            </p>
            <Link href="/customize" className="text-accent hover:text-white uppercase tracking-widest text-sm mt-4 border-b border-accent/30 pb-1">
              Create Your Feature Piece &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

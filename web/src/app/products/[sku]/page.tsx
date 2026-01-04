import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import { POLAR_CAMEL_WATER_BOTTLE, getProduct, getProductGroupBySku } from "@/lib/products";

interface ProductPageProps {
    params: Promise<{ sku: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { sku } = await params;
    const product = getProduct(sku);

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: `${product.name} | GroganEngrave`,
        description: `Customize and order your ${product.name}. Premium laser engraving for a personalized touch.`,
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { sku } = await params;
    const product = getProduct(sku);
    const group = getProductGroupBySku(sku);

    if (!product || !group) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Breadcrumb */}
            <div className="pt-28 px-4 sm:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted py-4 sm:py-6 flex-wrap">
                        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-text-primary">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Detail */}
            <section className="px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                        {/* Image Gallery */}
                        <div>
                            <div className="aspect-square relative bg-surface rounded-2xl overflow-hidden border border-border">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8"
                                    priority
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 mt-4">
                                <div className="w-20 h-20 relative bg-surface rounded-lg overflow-hidden border-2 border-accent">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <span className="text-accent text-sm font-medium tracking-widest uppercase">
                                {POLAR_CAMEL_WATER_BOTTLE.category}
                                </span>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-[var(--font-outfit)] mt-3 text-text-primary">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-3 mt-4 sm:mt-6">
                                    <span className="text-3xl sm:text-4xl font-bold text-accent">
                                        ${product.basePrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm sm:text-base text-text-muted">per unit</span>
                                </div>

                                <p className="text-text-secondary mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed">
                                    {group.description}
                                </p>
                            </div>

                            {/* Color Selection */}
                            <div className="mt-8">
                                <h3 className="text-sm font-medium mb-3 text-text-primary">
                                    Color: <span className="text-accent">{product.color}</span>
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {group.colors.map((color) => (
                                        <Link
                                            key={color.sku}
                                            href={`/products/${color.sku}`}
                                            className={`w-11 h-11 sm:w-10 sm:h-10 rounded-full border-2 transition hover:scale-110 touch-manipulation ${color.sku === sku
                                                    ? 'border-accent ring-2 ring-accent ring-offset-2 ring-offset-background'
                                                    : 'border-border hover:border-accent'
                                                }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="p-6 bg-surface rounded-xl border border-border">
                                <h3 className="font-semibold mb-4 text-text-primary">Specifications</h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2 text-sm">
                                    <dt className="text-text-muted">Size</dt>
                                    <dd className="text-text-primary">{product.size}</dd>
                                    <dt className="text-text-muted">Material</dt>
                                    <dd className="text-text-primary">Stainless Steel</dd>
                                    <dt className="text-text-muted">Insulation</dt>
                                    <dd className="text-text-primary">Double-Wall Vacuum</dd>
                                    <dt className="text-text-muted">Engraving Area</dt>
                                    <dd className="text-text-primary">{group.engravingZone.width}&quot; x {group.engravingZone.height}&quot;</dd>
                                    <dt className="text-text-muted">SKU</dt>
                                    <dd className="font-mono text-accent">{product.sku}</dd>
                                </dl>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={`/customize?sku=${product.sku}`}
                                    className="btn-primary text-center flex-1 text-lg"
                                >
                                    Customize & Order
                                </Link>
                                <Link
                                    href="/quote"
                                    className="btn-secondary text-center flex-1 text-lg"
                                >
                                    Bulk Quote (10+)
                                </Link>
                            </div>

                            {/* Trust Signals */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-text-muted pt-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Free design preview
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Ships in 3-5 days
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-surface-alt">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-outfit)] mb-8 sm:mb-12 text-text-primary">
                        You May Also Like
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {group.colors
                            .filter(c => c.sku !== sku)
                            .slice(0, 4)
                            .map((color) => (
                                <Link
                                    key={color.sku}
                                    href={`/products/${color.sku}`}
                                    className="card overflow-hidden hover:border-accent/50 transition group"
                                >
                                    <div className="aspect-square relative bg-surface overflow-hidden">
                                        <Image
                                            src={`/products/${color.sku}_main.png`}
                                            alt={color.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-medium group-hover:text-accent transition text-text-primary mb-1">
                                            {color.name}
                                        </p>
                                        <p className="text-sm text-accent font-semibold">${product.basePrice.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

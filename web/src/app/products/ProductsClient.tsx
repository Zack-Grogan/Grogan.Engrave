"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { POLAR_CAMEL_WATER_BOTTLE, SIZES, COLORS, type ProductVariant } from "@/lib/products";

export default function ProductsClient() {
    const product = POLAR_CAMEL_WATER_BOTTLE;
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");
    const [quickViewVariant, setQuickViewVariant] = useState<ProductVariant | null>(null);

    // Default to 20oz Black for hero image
    const heroSku = "LWB102";

    // Filter variants based on selections
    const filteredVariants = product.variants.filter(variant => {
        if (selectedSize && variant.sizeId !== selectedSize) return false;
        if (selectedColor && variant.colorId !== selectedColor) return false;
        return true;
    });

    // Get unique sizes and colors from filtered variants
    const availableSizes = selectedSize
        ? SIZES.filter(s => s.id === selectedSize)
        : SIZES;

    const availableColors = selectedColor
        ? COLORS.filter(c => c.id === selectedColor)
        : COLORS;

    // Sort colors based on sort option
    const sortedColors = [...availableColors].sort((a, b) => {
        if (sortBy === "name") {
            return a.name.localeCompare(b.name);
        } else if (sortBy === "price-asc" || sortBy === "price-desc") {
            // For price sorting, use the size's base price
            const sizeForPrice = selectedSize ? SIZES.find(s => s.id === selectedSize) : SIZES[1]; // Default to 20oz
            const priceA = sizeForPrice?.basePrice || 0;
            const priceB = sizeForPrice?.basePrice || 0;
            return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
        }
        return 0;
    });

    // Get variant details for quick view
    const getQuickViewDetails = (variant: ProductVariant) => {
        const size = SIZES.find(s => s.id === variant.sizeId);
        const color = COLORS.find(c => c.id === variant.colorId);
        return { variant, size, color };
    };

    const clearFilters = () => {
        setSelectedSize(null);
        setSelectedColor(null);
    };

    const hasActiveFilters = selectedSize || selectedColor;

    return (
        <div className="min-h-screen">
            <Navigation />

            {/* Breadcrumb */}
            <div className="pt-28 px-4 sm:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex items-center gap-2 text-sm text-text-muted py-4 sm:py-6">
                        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-text-primary">Collections</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <section className="px-4 sm:px-6 lg:px-12 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* Hero Image */}
                        <div className="aspect-square relative bg-surface-alt rounded-2xl overflow-hidden border-2 border-border/50 image-zoom-container card-luxury">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                            <Image
                                src={`/products/${heroSku}_main.png`}
                                alt={product.name}
                                fill
                                className="object-contain p-12 relative z-10"
                                priority
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase reveal-on-scroll">
                                {product.brand}
                            </span>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-text-primary leading-tight reveal-on-scroll delay-100">
                                {product.name}
                            </h1>

                            <div className="decorative-line-left reveal-on-scroll delay-200" />

                            <p className="text-text-secondary text-lg leading-relaxed reveal-on-scroll delay-300">
                                {product.description}
                            </p>

                            {/* Features */}
                            <div className="space-y-3 reveal-on-scroll delay-400">
                                {product.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-text-secondary">
                                        <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="font-light">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Price Range */}
                            <div className="mt-8 p-6 bg-surface rounded-xl border border-border/50 shadow-sm reveal-on-scroll delay-500">
                                <p className="text-sm text-text-muted mb-2 uppercase tracking-wider">Starting at</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-serif text-accent">
                                        ${SIZES[0].basePrice.toFixed(2)}
                                    </span>
                                    <span className="text-text-muted">+ $5.00 engraving</span>
                                </div>
                                <p className="text-sm text-text-muted mt-3 italic">
                                    Bulk discounts available for 10+ items
                                </p>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/customize"
                                className="btn-primary btn-magnetic btn-ripple bg-accent text-white px-10 py-4 rounded-sm font-serif text-lg hover:bg-accent-hover transition-all duration-500 ease-out uppercase tracking-widest inline-block shadow-lg shadow-accent/25 reveal-on-scroll delay-500"
                            >
                                Start Customizing →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Size Options */}
            <section className="py-24 px-6 sm:px-8 lg:px-12 bg-surface-alt gradient-subtle">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 reveal-on-scroll">
                        <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
                            Choose Your Size
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif text-text-primary mt-4">
                            4 Sizes Available
                        </h2>
                        <div className="decorative-line mt-6" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {SIZES.map((size) => {
                            // Get a black variant for each size
                            const sizeCode = size.id === "12oz" ? "05" : size.id === "20oz" ? "10" : size.id === "32oz" ? "20" : "30";
                            const sku = `LWB${sizeCode}2`; // Black variants
                            const isPopular = size.id === "20oz";
                            const isNew = size.id === "32oz";

                            return (
                                <Link
                                    key={size.id}
                                    href={`/customize?size=${size.id}`}
                                    className={`card-luxury p-4 sm:p-6 text-center group relative transition-all duration-500 border ${isPopular ? 'border-accent/50 ring-2 ring-accent/20' : 'border-border/50'
                                        } reveal-on-scroll`}
                                    style={{ animationDelay: `${SIZES.indexOf(size) * 100}ms` }}
                                >
                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                                        {isPopular && (
                                            <span className="bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                                                Popular
                                            </span>
                                        )}
                                        {isNew && (
                                            <span className="bg-accent-secondary text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    {/* Image Container */}
                                    <div className="aspect-square relative bg-surface rounded-xl overflow-hidden mb-3 sm:mb-4 group-hover:bg-accent/5 transition-colors duration-300 image-zoom-container">
                                        <Image
                                            src={`/products/${sku}_main.png`}
                                            alt={size.name}
                                            fill
                                            className="object-contain p-3 sm:p-4 transition-transform duration-700"
                                        />
                                        {/* Quick Customize Overlay */}
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-white font-serif text-sm uppercase tracking-wider bg-accent px-4 py-2 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                Customize
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-accent transition-colors duration-300 font-serif">
                                        {size.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-muted mt-1">{size.capacity}</p>
                                    <div className="mt-2 flex items-center justify-center gap-2">
                                        <p className="text-accent font-bold text-lg sm:text-xl font-serif">
                                            ${size.basePrice.toFixed(2)}
                                        </p>
                                        <span className="text-xs text-text-muted">+ engraving</span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Engrave area: {size.engravingZone.width}" × {size.engravingZone.height}"
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Color Options */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12 reveal-on-scroll">
                        <div>
                            <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
                                Pick Your Color
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-text-primary mt-4">
                                {sortedColors.length} Color{sortedColors.length !== 1 ? 's' : ''} Available
                            </h2>
                            <div className="decorative-line-left mt-4" />
                        </div>
                        <div className="flex items-center gap-4">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                                >
                                    Clear Filters
                                </button>
                            )}
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "name" | "price-asc" | "price-desc")}
                                className="px-4 py-2 border border-border rounded-lg text-sm text-text-primary bg-surface focus:border-accent focus:outline-none transition-colors"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="mb-8 reveal-on-scroll delay-100">
                        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">Filter by Size</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedSize(null)}
                                className={`px-4 py-2 rounded-lg border transition text-sm font-medium ${!selectedSize
                                    ? "border-accent bg-accent-subtle text-accent"
                                    : "border-border hover:border-accent/50 text-text-primary"
                                    }`}
                            >
                                All Sizes
                            </button>
                            {SIZES.map((size) => (
                                <button
                                    key={size.id}
                                    onClick={() => setSelectedSize(size.id)}
                                    className={`px-4 py-2 rounded-lg border transition text-sm font-medium ${selectedSize === size.id
                                        ? "border-accent bg-accent-subtle text-accent"
                                        : "border-border hover:border-accent/50 text-text-primary"
                                    }`}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4 max-w-4xl mx-auto reveal-on-scroll delay-200">
                        {sortedColors.map((color, index) => {
                            // Find the actual index in COLORS array for SKU generation
                            const colorIndex = COLORS.findIndex(c => c.id === color.id);
                            const sku = selectedSize
                                ? `LWB${selectedSize === "12oz" ? "05" : selectedSize === "20oz" ? "10" : selectedSize === "32oz" ? "20" : "30"}${colorIndex + 1}`
                                : `LWB10${colorIndex + 1}`;

                            const variant = product.variants.find(v => v.sku === sku);

                            return (
                                <button
                                    key={color.id}
                                    onClick={() => variant && setQuickViewVariant(variant)}
                                    className="text-center group haptic-feedback"
                                    title={`${color.name} - Click for quick view`}
                                    aria-label={`View ${color.name} color`}
                                >
                                    <div className="aspect-square relative bg-surface rounded-xl overflow-hidden mb-2 border-2 border-border/50 hover:border-accent transition-all duration-300 image-zoom-container shadow-sm hover:shadow-lg">
                                        <Image
                                            src={`/products/${sku}_main.png`}
                                            alt={color.name}
                                            fill
                                            className="object-contain p-2 transition-transform duration-500"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <p className="text-xs text-text-muted group-hover:text-accent transition-colors duration-300 truncate font-medium">
                                        {color.name}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {sortedColors.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-text-muted">No colors available for the selected filters.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-accent hover:text-accent/80 font-medium"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-accent/10 to-accent-subtle/30">
                <div className="max-w-3xl mx-auto text-center reveal-on-scroll">
                    <span className="text-accent text-sm font-medium tracking-[0.2em] uppercase">
                        Ready to Create?
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-text-primary mb-4 sm:mb-6 mt-4">
                        Your Custom Piece Awaits
                    </h2>
                    <div className="decorative-line mx-auto mb-8" />
                    <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 leading-relaxed px-4">
                        Choose your size and color, add your text, and preview your design in real-time.
                        Let us help you craft something truly special.
                    </p>
                    <Link href="/customize" className="btn-primary btn-magnetic btn-ripple bg-accent text-white text-base sm:text-lg px-8 py-4 rounded-sm font-serif uppercase tracking-widest shadow-lg shadow-accent/25 inline-block">
                        Start Customizing →
                    </Link>
                </div>
            </section>

            {/* Quick View Modal */}
            {quickViewVariant && (() => {
                const details = getQuickViewDetails(quickViewVariant);
                if (!details.size || !details.color) return null;

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h2 className="text-xl font-bold text-text-primary font-[var(--font-outfit)]">
                                    {details.size.name} {details.color.name}
                                </h2>
                                <button
                                    onClick={() => setQuickViewVariant(null)}
                                    className="p-2 hover:bg-surface-alt rounded-lg transition"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Product Image */}
                                    <div className="aspect-square relative bg-surface rounded-xl overflow-hidden">
                                        <Image
                                            src={details.variant.image}
                                            alt={`${details.size.name} ${details.color.name}`}
                                            fill
                                            className="object-contain p-6"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex flex-col justify-center">
                                        <div className="mb-6">
                                            <span className="text-accent text-sm font-medium tracking-widest uppercase">
                                                {product.brand}
                                            </span>
                                            <h3 className="text-2xl font-bold text-text-primary mt-2 font-[var(--font-outfit)]">
                                                {product.name}
                                            </h3>
                                            <p className="text-text-muted mt-1">
                                                {details.size.capacity} • {details.color.name}
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-text-muted mb-2">Price</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-accent">
                                                    ${details.size.basePrice.toFixed(2)}
                                                </span>
                                                <span className="text-text-muted">+ $5.00 engraving</span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-text-muted mb-2">Engraving Area</p>
                                            <p className="text-text-primary">
                                                {details.size.engravingZone.width}" × {details.size.engravingZone.height}"
                                            </p>
                                        </div>

                                        <ul className="space-y-2 mb-6">
                                            {product.features.slice(0, 3).map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                                                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href={`/customize?size=${details.size.id}&color=${details.color.id}`}
                                            onClick={() => setQuickViewVariant(null)}
                                            className="btn-primary text-center py-3"
                                        >
                                            Customize This Bottle
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

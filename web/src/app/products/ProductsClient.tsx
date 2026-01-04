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
                        <span className="text-text-primary">Products</span>
                    </nav>
                </div>
            </div>

            {/* Product Hero */}
            <section className="px-4 sm:px-6 lg:px-12 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        {/* Hero Image */}
                        <div className="aspect-square relative bg-surface rounded-2xl overflow-hidden border border-border">
                            <Image
                                src={`/products/${heroSku}_main.png`}
                                alt={product.name}
                                fill
                                className="object-contain p-8"
                                priority
                            />
                        </div>

                        {/* Product Info */}
                        <div>
                            <span className="text-accent text-sm font-medium tracking-widest uppercase">
                                {product.brand}
                            </span>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-[var(--font-outfit)] mt-2 text-text-primary">
                                {product.name}
                            </h1>

                            <p className="text-text-secondary mt-4 text-base sm:text-lg">
                                {product.description}
                            </p>

                            {/* Features */}
                            <ul className="mt-6 space-y-2">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-text-secondary">
                                        <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Price Range */}
                            <div className="mt-8 p-6 bg-surface rounded-xl border border-border">
                                <p className="text-sm text-text-muted mb-2">Starting at</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-accent">
                                        ${SIZES[0].basePrice.toFixed(2)}
                                    </span>
                                    <span className="text-text-muted">+ $5.00 engraving</span>
                                </div>
                                <p className="text-sm text-text-muted mt-2">
                                    Bulk discounts available for 10+ items
                                </p>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/customize"
                                className="btn-primary text-lg mt-8 inline-block"
                            >
                                Start Customizing →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Size Options */}
            <section className="py-24 px-6 sm:px-8 lg:px-12 bg-surface-alt">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-accent text-sm font-medium tracking-widest uppercase">
                            Choose Your Size
                        </span>
                        <h2 className="text-3xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
                            4 Sizes Available
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {SIZES.map((size) => {
                            // Get a black variant for each size
                            const sizeCode = size.id === "12oz" ? "05" : size.id === "20oz" ? "10" : size.id === "32oz" ? "20" : "30";
                            const sku = `LWB${sizeCode}2`; // Black variants
                            const isPopular = size.id === "20oz";

                            return (
                                <Link
                                    key={size.id}
                                    href={`/customize?size=${size.id}`}
                                    className={`card p-4 sm:p-6 text-center group relative transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 ${isPopular ? 'ring-2 ring-accent/30' : ''
                                        }`}
                                >
                                    {/* Popular Badge */}
                                    {isPopular && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                            <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full shadow-md">
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                    <div className="aspect-square relative bg-surface-alt rounded-xl overflow-hidden mb-3 sm:mb-4 group-hover:bg-accent/5 transition-colors">
                                        <Image
                                            src={`/products/${sku}_main.png`}
                                            alt={size.name}
                                            fill
                                            className="object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-accent transition">
                                        {size.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-text-muted mt-1">{size.capacity}</p>
                                    <p className="text-accent font-bold mt-2 text-lg sm:text-xl">
                                        ${size.basePrice.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-text-muted mt-1">
                                        Engrave area: {size.engravingZone.width}&quot; × {size.engravingZone.height}&quot;
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                        <div>
                            <span className="text-accent text-sm font-medium tracking-widest uppercase">
                                Pick Your Color
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold font-[var(--font-outfit)] mt-4 text-text-primary">
                                {sortedColors.length} Color{sortedColors.length !== 1 ? 's' : ''} Available
                            </h2>
                        </div>
                        <div className="flex items-center gap-4">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "name" | "price-asc" | "price-desc")}
                                className="px-4 py-2 border border-border rounded-lg text-sm text-text-primary bg-surface focus:border-accent focus:outline-none"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Size Filter */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-text-primary mb-3">Filter by Size</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedSize(null)}
                                className={`px-4 py-2 rounded-lg border transition text-sm ${!selectedSize
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
                                    className={`px-4 py-2 rounded-lg border transition text-sm ${selectedSize === size.id
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
                    <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3 sm:gap-4 max-w-4xl mx-auto">
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
                                    className="text-center group"
                                    title={`${color.name} - Click for quick view`}
                                >
                                    <div className="aspect-square relative bg-surface rounded-xl overflow-hidden mb-2 border border-border hover:ring-2 hover:ring-accent transition">
                                        <Image
                                            src={`/products/${sku}_main.png`}
                                            alt={color.name}
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <p className="text-xs text-text-muted group-hover:text-accent transition truncate">
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
                                className="mt-4 text-accent hover:text-accent/80"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-accent/10 to-accent-subtle/30">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[var(--font-outfit)] mb-4 sm:mb-6 text-text-primary">
                        Ready to Create Your Custom Bottle?
                    </h2>
                    <p className="text-base sm:text-lg text-text-secondary mb-8 sm:mb-10 px-4">
                        Choose your size and color, add your text, and preview your design in real-time.
                    </p>
                    <Link href="/customize" className="btn-primary text-base sm:text-lg">
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

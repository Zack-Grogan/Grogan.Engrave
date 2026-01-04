'use client';

import { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import {
    POLAR_CAMEL_WATER_BOTTLE,
    SIZES,
    COLORS,
    getVariantByOptions,
    getBulkDiscount,
    ENGRAVING_FEE,
    type ProductSize,
    type ProductColor,
} from '@/lib/products';

// Lazy load the heavy canvas editor
const EngraveEditor = lazy(() => import('@/components/EngraveEditor'));

type Step = 'edit' | 'checkout';

export default function ConfiguratorClient() {
    // Product selection
    const [selectedSize, setSelectedSize] = useState<ProductSize>(SIZES[1]); // 20oz default
    const [selectedColor, setSelectedColor] = useState<ProductColor>(COLORS[1]); // Black default
    const [quantity, setQuantity] = useState(1);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Editor state
    const [step, setStep] = useState<Step>('edit');
    const [designSVG, setDesignSVG] = useState<string>('');
    const [hasDesign, setHasDesign] = useState(false);

    // Get current variant
    const variant = useMemo(() => {
        return getVariantByOptions(selectedSize.id, selectedColor.id);
    }, [selectedSize.id, selectedColor.id]);

    // Pricing calculations
    const discount = getBulkDiscount(quantity);
    const unitPrice = selectedSize.basePrice + ENGRAVING_FEE;
    const discountedPrice = unitPrice * (1 - discount);
    const totalPrice = discountedPrice * quantity;

    // SCALABLE: Read canvas config from the product data instead of hardcoding
    const canvasConfig = useMemo(() => {
        // Fallback to defaults if missing (scalability for future products)
        return selectedSize.canvasConfig || {
            scale: 0.9,
            zoneLeft: 50,
            zoneTop: 50,
            zoneWidth: 20,
            zoneHeight: 20
        };
    }, [selectedSize]);

    const handleExportSVG = useCallback((svg: string) => {
        setDesignSVG(svg);
    }, []);

    const handleDesignChange = useCallback((hasContent: boolean) => {
        setHasDesign(hasContent);
    }, []);

    const handleProceedToCheckout = () => {
        if (!hasDesign) {
            alert('Please add a design before proceeding.');
            return;
        }
        setStep('checkout');
    };

    const handleDownloadSVG = () => {
        if (!designSVG) return;

        const blob = new Blob([designSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `engraving_${selectedSize.id}_${variant?.sku || 'design'}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        // Use dvh (dynamic viewport height) for better mobile support
        <div className="h-[100dvh] flex flex-col bg-background overflow-hidden relative font-sans">
            <div className="absolute top-0 left-0 right-0 z-50">
                <Navigation />
            </div>

            {/* Compact Header - Mobile Friendly & Boutique */}
            <header className="fixed top-14 lg:top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-text-muted text-xs lg:text-sm hover:text-primary flex items-center tracking-wide uppercase">
                        <span className="mr-2">←</span> <span className="hidden sm:inline">Back to Studio</span>
                    </Link>

                    {/* Size Selector */}
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedSize.id}
                            onChange={(e) => {
                                const size = SIZES.find((s) => s.id === e.target.value);
                                if (size) setSelectedSize(size);
                            }}
                            className="px-4 py-2 text-sm bg-surface-alt border border-border text-text-primary font-medium focus:ring-1 focus:ring-accent rounded-sm outline-none cursor-pointer"
                        >
                            {SIZES.map((size) => (
                                <option key={size.id} value={size.id}>
                                    {size.name}
                                </option>
                            ))}
                        </select>

                        {/* Color Picker Button */}
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="flex items-center gap-3 px-4 py-2 bg-surface-alt border border-border hover:border-accent/50 transition active:bg-surface rounded-sm"
                        >
                            <div
                                className="w-4 h-4 rounded-full border border-border shadow-sm"
                                style={{ backgroundColor: selectedColor.hex }}
                            />
                            <span className="text-sm text-text-primary hidden sm:inline">{selectedColor.name}</span>
                            <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    <span className="text-xl font-serif text-primary italic tabular-nums">
                        ${discountedPrice.toFixed(2)}
                    </span>
                </div>

                {/* Color Picker Dropdown - Full width mobile */}
                {showColorPicker && (
                    <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-md z-50 animate-in slide-in-from-top-2 duration-300 ease-out">
                        <div className="max-w-6xl mx-auto p-6 max-h-[60vh] overflow-y-auto">
                            <div className="text-xs text-text-muted mb-4 font-medium uppercase tracking-widest text-center">Select Finish</div>
                            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-4 justify-center">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.id}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            setShowColorPicker(false);
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${selectedColor.id === color.id
                                            ? 'border-accent ring-2 ring-accent/30 shadow-md scale-110'
                                            : 'border-border/50 hover:border-accent/50'
                                            }`}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area - Responsive Flex */}
            <main className="flex-1 flex flex-col pt-[calc(3.5rem+64px)] pb-[80px] lg:pb-0 h-full overflow-hidden">
                {step === 'edit' ? (
                    <div className="flex-1 flex flex-col relative w-full h-full max-w-6xl mx-auto px-0 lg:px-4 lg:py-4">

                        {/* Canvas Editor Container - Flex grow to fill space */}
                        <div className="flex-1 relative w-full h-full overflow-hidden bg-[#1a1a1a] lg:shadow-xl lg:border lg:border-border/5">
                            <Suspense
                                fallback={
                                    <div className="absolute inset-0 flex items-center justify-center bg-background">
                                        <div className="animate-pulse flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                            <div className="text-sm text-text-primary font-serif italic">Preparing studio...</div>
                                        </div>
                                    </div>
                                }
                            >
                                <EngraveEditor
                                    key={`${selectedSize.id}-${selectedColor.id}`}
                                    productImage={variant?.blankImage || `/products/LWB102_clean.png`}
                                    canvasConfig={canvasConfig}
                                    // engravingZone passed implicitly via canvasConfig logic now
                                    onExportSVG={handleExportSVG}
                                    onDesignChange={handleDesignChange}
                                />
                            </Suspense>
                        </div>
                    </div>
                ) : (
                    /* Checkout View - Scrollable */
                    <div className="flex-1 overflow-y-auto px-4 py-8">
                        <div className="max-w-xl mx-auto space-y-8 pb-24">
                            {/* Preview */}
                            <div className="bg-white p-8 shadow-sm border border-border/50">
                                <h3 className="text-lg font-serif text-primary mb-6 text-center italic">Your Masterpiece</h3>
                                <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden border border-border/10 mb-6">
                                    <Image
                                        src={variant?.blankImage || '/products/LWB102_clean.png'}
                                        alt="Product preview"
                                        fill
                                        className="object-contain p-8"
                                    />
                                    {/* Overlay "Design" placeholder since we don't have SVG preview yet */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 mix-blend-multiply">
                                        <span className="text-xs text-text-muted uppercase tracking-[0.2em] border border-text-muted px-4 py-2">Design Preview</span>
                                    </div>
                                </div>
                                <div className="text-center text-sm text-text-muted font-light">
                                    Includes professional laser engraving.
                                </div>
                            </div>

                            {/* Details & Pricing */}
                            <div className="bg-white p-8 shadow-sm border border-border/50 space-y-6">
                                <h3 className="text-lg font-serif text-primary border-b border-border pb-4">Order Summary</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-text-secondary uppercase tracking-wide text-xs">Product</span>
                                        <span className="text-primary font-medium">{selectedSize.name} — {selectedColor.name}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-text-secondary uppercase tracking-wide text-xs">SKU</span>
                                        <span className="text-text-muted font-mono">{variant?.sku}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm py-4 border-t border-border/30">
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-secondary uppercase tracking-wide text-xs">Quantity</span>
                                        <div className="flex items-center border border-border rounded-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-surface-alt transition text-text-muted"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-serif text-primary">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-surface-alt transition text-text-muted"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {discount > 0 && (
                                        <div className="text-right text-xs text-accent italic">
                                            {Math.round(discount * 100)}% bulk savings applied
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-muted">Subtotal</span>
                                        <span>${(selectedSize.basePrice + ENGRAVING_FEE).toFixed(2)} × {quantity}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-serif text-primary mt-4">
                                        <span>Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Action Bar - Sticky handling for mobile */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border safe-area-bottom">
                <div className="max-w-6xl mx-auto p-4 lg:p-6">
                    {step === 'edit' ? (
                        <button
                            onClick={handleProceedToCheckout}
                            disabled={!hasDesign}
                            className="w-full py-4 bg-primary text-white font-serif text-xl italic hover:bg-primary/90 transition shadow-xl disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">Proceed to Review</span>
                            <span className="bg-white/10 px-3 py-1 text-sm not-italic font-sans tracking-wide">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep('edit')}
                                className="flex-1 py-4 border border-primary text-primary font-sans uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition"
                            >
                                ← Edit Design
                            </button>
                            <button
                                onClick={() => alert('Stripe checkout coming soon!')}
                                className="flex-[2] py-4 bg-accent text-white font-serif text-xl italic hover:bg-accent-hover transition shadow-lg"
                            >
                                Secure Checkout
                            </button>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}

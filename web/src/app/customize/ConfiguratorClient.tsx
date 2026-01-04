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

type Step = 'edit' | 'review' | 'checkout';

const INSPIRATION_EXAMPLES = [
    { id: 1, title: "Wedding Monogram", description: "Elegant initials with date", icon: "💍" },
    { id: 2, title: "Team Spirit", description: "Sports team name & number", icon: "🏆" },
    { id: 3, title: "Corporate Brand", description: "Company logo & tagline", icon: "💼" },
    { id: 4, title: "Personal Quote", description: "Favorite saying or motto", icon: "✨" },
];

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

    // Undo/Redo state
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

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
        // Add to history
        setHistory(prev => [...prev.slice(0, historyIndex + 1), svg]);
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex]);

    const handleDesignChange = useCallback((hasContent: boolean) => {
        setHasDesign(hasContent);
    }, []);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            setDesignSVG(history[historyIndex - 1]);
        }
    }, [historyIndex, history]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            setDesignSVG(history[historyIndex + 1]);
        }
    }, [historyIndex, history]);

    const handleProceedToReview = () => {
        if (!hasDesign) {
            alert('Please add a design before proceeding.');
            return;
        }
        setStep('review');
    };

    const handleProceedToCheckout = () => {
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

    const steps = [
        { id: 'edit', label: 'Design', icon: '✏️' },
        { id: 'review', label: 'Review', icon: '👁️' },
        { id: 'checkout', label: 'Checkout', icon: '💳' },
    ] as const;

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
                {/* Progress Indicator */}
                <div className="bg-surface-alt border-b border-border px-4 py-3">
                    <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 sm:gap-8">
                        {steps.map((stepItem, index) => (
                            <div
                                key={stepItem.id}
                                className={`progress-step flex items-center gap-2 ${index < steps.length - 1 ? 'flex-1' : ''} ${
                                    step === stepItem.id ? 'active' : ''
                                } ${
                                    steps.findIndex(s => s.id === step) > index ? 'completed' : ''
                                }`}
                            >
                                <div className={`step-circle w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-sm sm:text-base transition-all duration-300 ${
                                    step === stepItem.id
                                        ? 'border-accent bg-accent text-white'
                                        : steps.findIndex(s => s.id === step) > index
                                        ? 'border-accent bg-accent text-white'
                                        : 'border-border bg-surface text-text-muted'
                                }`}>
                                    {steps.findIndex(s => s.id === step) > index ? '✓' : stepItem.icon}
                                </div>
                                <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                                    step === stepItem.id
                                        ? 'text-accent'
                                        : steps.findIndex(s => s.id === step) > index
                                        ? 'text-accent'
                                        : 'text-text-muted'
                                }`}>
                                    {stepItem.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {step === 'edit' ? (
                    <div className="flex-1 flex flex-col lg:flex-row relative w-full h-full max-w-7xl mx-auto">
                        {/* Inspiration Sidebar - Desktop */}
                        <aside className="hidden lg:block w-72 bg-surface border-r border-border p-6 overflow-y-auto">
                            <h3 className="font-serif text-lg text-text-primary mb-4 italic">Design Inspiration</h3>
                            <p className="text-sm text-text-muted mb-6">Get inspired with popular design ideas</p>
                            <div className="space-y-3">
                                {INSPIRATION_EXAMPLES.map((example) => (
                                    <button
                                        key={example.id}
                                        className="w-full p-4 text-left border border-border rounded-lg hover:border-accent hover:bg-accent-subtle/30 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{example.icon}</span>
                                            <div>
                                                <h4 className="font-semibold text-text-primary text-sm group-hover:text-accent transition-colors">
                                                    {example.title}
                                                </h4>
                                                <p className="text-xs text-text-muted mt-1">{example.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Tips Section */}
                            <div className="mt-8 p-4 bg-accent-subtle/30 rounded-lg border border-accent/20">
                                <h4 className="font-semibold text-text-primary text-sm mb-2">💡 Pro Tips</h4>
                                <ul className="text-xs text-text-muted space-y-2">
                                    <li>• Use high-contrast colors for better visibility</li>
                                    <li>• Keep text under 20 characters for best results</li>
                                    <li>• Test different fonts to find your style</li>
                                </ul>
                            </div>
                        </aside>

                        {/* Canvas Editor Container */}
                        <div className="flex-1 relative w-full h-full overflow-hidden bg-[#1a1a1a]">
                            {/* Undo/Redo Controls */}
                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                <button
                                    onClick={handleUndo}
                                    disabled={historyIndex <= 0}
                                    className="p-2 bg-surface/90 backdrop-blur rounded-lg border border-border hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 haptic-feedback"
                                    aria-label="Undo"
                                >
                                    <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleRedo}
                                    disabled={historyIndex >= history.length - 1}
                                    className="p-2 bg-surface/90 backdrop-blur rounded-lg border border-border hover:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 haptic-feedback"
                                    aria-label="Redo"
                                >
                                    <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                                    </svg>
                                </button>
                            </div>

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
                                    onExportSVG={handleExportSVG}
                                    onDesignChange={handleDesignChange}
                                />
                            </Suspense>
                        </div>
                    </div>
                ) : step === 'review' ? (
                    /* Review View - Scrollable */
                    <div className="flex-1 overflow-y-auto px-4 py-8">
                        <div className="max-w-xl mx-auto space-y-8 pb-24">
                            {/* Preview */}
                            <div className="bg-white p-8 shadow-sm border border-border/50 card-luxury">
                                <h3 className="text-lg font-serif text-primary mb-6 text-center italic">Your Masterpiece</h3>
                                <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden border border-border/10 mb-6 image-zoom-container">
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
                            <div className="bg-white p-8 shadow-sm border border-border/50 space-y-6 card-luxury">
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
                                                className="w-10 h-10 flex items-center justify-center hover:bg-surface-alt transition text-text-muted haptic-feedback"
                                            >
                                                −
                                            </button>
                                            <span className="w-12 text-center font-serif text-primary">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-surface-alt transition text-text-muted haptic-feedback"
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
                ) : (
                    /* Checkout View - Placeholder */
                    <div className="flex-1 overflow-y-auto px-4 py-8">
                        <div className="max-w-xl mx-auto text-center py-20">
                            <div className="text-6xl mb-6">💳</div>
                            <h2 className="text-2xl font-serif text-primary mb-4">Secure Checkout</h2>
                            <p className="text-text-muted mb-8">Stripe checkout integration coming soon!</p>
                            <button
                                onClick={() => setStep('review')}
                                className="btn-secondary px-8 py-3"
                            >
                                ← Back to Review
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Action Bar - Sticky handling for mobile */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border safe-area-bottom">
                <div className="max-w-6xl mx-auto p-4 lg:p-6">
                    {step === 'edit' ? (
                        <button
                            onClick={handleProceedToReview}
                            disabled={!hasDesign}
                            className="w-full py-4 bg-accent text-white font-serif text-xl italic hover:bg-accent-hover transition-all duration-300 shadow-lg disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 group btn-magnetic btn-ripple"
                        >
                            <span className="group-hover:translate-x-1 transition-transform">Proceed to Review</span>
                            <span className="bg-white/10 px-3 py-1 text-sm not-italic font-sans tracking-wide">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </button>
                    ) : step === 'review' ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep('edit')}
                                className="flex-1 py-4 border-2 border-accent/30 text-accent font-sans uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all duration-300 haptic-feedback"
                            >
                                ← Edit Design
                            </button>
                            <button
                                onClick={handleProceedToCheckout}
                                className="flex-[2] py-4 bg-accent text-white font-serif text-xl italic hover:bg-accent-hover transition-all duration-300 shadow-lg btn-magnetic btn-ripple"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setStep('review')}
                            className="w-full py-4 border-2 border-accent/30 text-accent font-sans uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all duration-300 haptic-feedback"
                        >
                            ← Back to Review
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}

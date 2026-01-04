// Polar Camel Water Bottle - Single Product with Size/Color Variants
// MVP: 4 sizes x 18 colors = 72 SKUs (77 images scraped)

export interface ProductSize {
    id: string;
    name: string;
    capacity: string;
    basePrice: number;
    engravingZone: { width: number; height: number }; // inches
    canvasConfig?: {
        scale: number;
        zoneLeft: number;
        zoneTop: number;
        zoneWidth: number;
        zoneHeight: number;
    };
}

export interface ProductColor {
    id: string;
    name: string;
    hex: string;
}

export interface ProductVariant {
    sku: string;
    sizeId: string;
    colorId: string;
    image: string;        // Main image (with example engraving)
    blankImage: string;   // Blank image for designer preview
    inStock: boolean;
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    description: string;
    features: string[];
    sizes: ProductSize[];
    colors: ProductColor[];
    variants: ProductVariant[];
}

// Size definitions with visual configuration
export const SIZES: ProductSize[] = [
    {
        id: "12oz",
        name: "12 oz",
        capacity: "12 oz (355ml)",
        basePrice: 11.85,
        engravingZone: { width: 2.5, height: 1.5 },
        // Visual config for the canvas editor
        canvasConfig: {
            scale: 0.9,     // Visual padding
            zoneLeft: 50,   // Center
            zoneTop: 50,    // Center vertically
            zoneWidth: 55,  // 55% of image width
            zoneHeight: 35  // 35% of image height
        }
    },
    {
        id: "20oz",
        name: "20 oz",
        capacity: "20 oz (590ml)",
        basePrice: 12.95,
        engravingZone: { width: 3.0, height: 2.0 },
        canvasConfig: {
            scale: 0.9,
            zoneLeft: 50,
            zoneTop: 55,    // Slightly lower due to lid
            zoneWidth: 45,
            zoneHeight: 45
        }
    },
    {
        id: "32oz",
        name: "32 oz",
        capacity: "32 oz (950ml)",
        basePrice: 14.95,
        engravingZone: { width: 3.5, height: 2.5 },
        canvasConfig: {
            scale: 0.9,
            zoneLeft: 50,
            zoneTop: 55,
            zoneWidth: 50,
            zoneHeight: 45
        }
    },
    {
        id: "40oz",
        name: "40 oz",
        capacity: "40 oz (1.2L)",
        basePrice: 17.50,
        engravingZone: { width: 4.0, height: 3.0 },
        canvasConfig: {
            scale: 0.85,    // Smaller to fit handle
            zoneLeft: 50,
            zoneTop: 58,    // Lower to avoid handle area
            zoneWidth: 40,
            zoneHeight: 40
        }
    },
];

// Color definitions
export const COLORS: ProductColor[] = [
    { id: "stainless", name: "Stainless Steel", hex: "#c0c0c0" },
    { id: "black", name: "Black", hex: "#1a1a1a" },
    { id: "red", name: "Red", hex: "#dc2626" },
    { id: "royal-blue", name: "Royal Blue", hex: "#1e40af" },
    { id: "pink", name: "Pink", hex: "#ec4899" },
    { id: "teal", name: "Teal", hex: "#14b8a6" },
    { id: "light-blue", name: "Light Blue", hex: "#38bdf8" },
    { id: "light-purple", name: "Light Purple", hex: "#c084fc" },
    { id: "purple", name: "Purple", hex: "#7c3aed" },
    { id: "dark-gray", name: "Dark Gray", hex: "#4b5563" },
    { id: "navy-blue", name: "Navy Blue", hex: "#1e3a5f" },
    { id: "orange", name: "Orange", hex: "#f97316" },
    { id: "maroon", name: "Maroon", hex: "#7f1d1d" },
    { id: "white", name: "White", hex: "#ffffff" },
    { id: "green", name: "Green", hex: "#16a34a" },
    { id: "yellow", name: "Yellow", hex: "#eab308" },
    { id: "coral", name: "Coral", hex: "#fb7185" },
    { id: "olive", name: "Olive Green", hex: "#4d7c0f" },
];

// Generate all variants
function generateVariants(): ProductVariant[] {
    const variants: ProductVariant[] = [];

    // Base numbers for each size to calculate SKU
    // 050 = 12oz, 100 = 20oz, 200 = 32oz, 300 = 40oz
    const SIZE_BASES: Record<string, number> = {
        "12oz": 50,
        "20oz": 100,
        "32oz": 200,
        "40oz": 300,
    };

    SIZES.forEach((size) => {
        COLORS.forEach((color, colorIndex) => {
            const base = SIZE_BASES[size.id];
            const colorNum = colorIndex + 1;
            // Pad to 3 digits (e.g., 50 + 1 = 051, 100 + 1 = 101)
            const skuNum = (base + colorNum).toString().padStart(3, '0');
            const sku = `LWB${skuNum}`;

            variants.push({
                sku,
                sizeId: size.id,
                colorId: color.id,
                image: `/products/${sku}_main.png`,
                blankImage: `/products/${sku}_clean.png`,
                inStock: true,
            });
        });
    });

    return variants;
}

// The main product
export const POLAR_CAMEL_WATER_BOTTLE: Product = {
    id: "polar-camel-water-bottle",
    name: "Polar Camel Water Bottle",
    brand: "Polar Camel",
    category: "Water Bottles",
    description: "Premium double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. Wide mouth opening for easy filling and cleaning. Powder-coated finish for a comfortable grip.",
    features: [
        "Double-wall vacuum insulation",
        "18/8 stainless steel construction",
        "Powder-coated exterior",
        "Wide mouth opening",
        "BPA-free",
        "Sweat-proof design",
    ],
    sizes: SIZES,
    colors: COLORS,
    variants: generateVariants(),
};

// Helper functions
export function getVariant(sku: string): ProductVariant | undefined {
    return POLAR_CAMEL_WATER_BOTTLE.variants.find((v) => v.sku === sku);
}

export function getVariantByOptions(sizeId: string, colorId: string): ProductVariant | undefined {
    return POLAR_CAMEL_WATER_BOTTLE.variants.find(
        (v) => v.sizeId === sizeId && v.colorId === colorId
    );
}

export function getSize(sizeId: string): ProductSize | undefined {
    return SIZES.find((s) => s.id === sizeId);
}

export function getColor(colorId: string): ProductColor | undefined {
    return COLORS.find((c) => c.id === colorId);
}

export function getVariantDetails(sku: string) {
    const variant = getVariant(sku);
    if (!variant) return null;

    const size = getSize(variant.sizeId);
    const color = getColor(variant.colorId);

    return {
        variant,
        size,
        color,
        product: POLAR_CAMEL_WATER_BOTTLE,
    };
}

// Get product details for a specific SKU
export function getProduct(sku: string) {
    const variant = getVariant(sku);
    if (!variant) return null;

    const size = getSize(variant.sizeId);
    const color = getColor(variant.colorId);

    return {
        sku: variant.sku,
        name: `${size?.name} ${color?.name}`,
        image: variant.image,
        basePrice: size?.basePrice || 0,
        size: size?.name || "",
        color: color?.name || "",
    };
}

// Get product group (all variants of the same size)
export function getProductGroupBySku(sku: string) {
    const variant = getVariant(sku);
    if (!variant) return null;

    const size = getSize(variant.sizeId);
    if (!size) return null;

    // Get all variants of this size (all colors)
    const variants = POLAR_CAMEL_WATER_BOTTLE.variants.filter(
        (v) => v.sizeId === size.id
    );

    return {
        description: POLAR_CAMEL_WATER_BOTTLE.description,
        engravingZone: size.engravingZone,
        colors: variants.map((v) => {
            const color = getColor(v.colorId);
            return {
                sku: v.sku,
                name: color?.name || "",
                hex: color?.hex || "",
            };
        }),
    };
}

// Engraving fee per item
export const ENGRAVING_FEE = 5.00;

// Bulk discount tiers
export function getBulkDiscount(quantity: number): number {
    if (quantity >= 100) return 0.20;
    if (quantity >= 50) return 0.15;
    if (quantity >= 25) return 0.10;
    if (quantity >= 10) return 0.05;
    return 0;
}

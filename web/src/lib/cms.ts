import { SIZES, COLORS, ProductSize, ProductColor, ProductVariant, getProduct } from './products';

// CMS Facade - currently maps to local file, later maps to Medusa/Sanity
// This allows us to "Self Host" by swapping the backend implementation later without touching the UI.

export interface CMSProduct {
    id: string;
    title: string;
    description: string;
    basePrice: number;
    variants: ProductVariant[];
    options: {
        sizes: ProductSize[];
        colors: ProductColor[];
    };
    featuredImage: string;
}

export const cms = {
    /**
     * Get the main product/collection
     * In a real store, this would be `medusa.products.retrieve(id)`
     */
    async getMainProduct(): Promise<CMSProduct> {
        // Simulate API latency for realism if needed, but keeping it fast for now
        const variants = getProduct("LWB-MAIN").variants;

        return {
            id: "LWB-SERIES",
            title: "Polar Camel Ringneck Tumbler",
            description: "Double-wall vacuum insulation with a clear lid. The narrow bottom fits most standard cup holders. 2X heat & cold resistance compared to normal travel mugs.",
            basePrice: SIZES[1].basePrice, // Default to 20oz price?
            variants: variants,
            options: {
                sizes: SIZES,
                colors: COLORS
            },
            featuredImage: "/products/LWB101_clean.png" // Default Image
        };
    },

    /**
     * Get a specific variant by SKU
     */
    async getVariant(sku: string): Promise<ProductVariant | undefined> {
        const product = getProduct("LWB-MAIN");
        return product.variants.find(v => v.sku === sku);
    }
};

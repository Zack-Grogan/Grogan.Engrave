import { Suspense } from "react";
import ConfiguratorClient from "./ConfiguratorClient";

export const metadata = {
    title: "Customize Your Design | GroganEngrave",
    description: "Create your personalized drinkware design. Choose fonts, add text, and preview your custom laser engraving.",
};

export default function CustomizePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-muted">Loading configurator...</p>
                </div>
            </div>
        }>
            <ConfiguratorClient />
        </Suspense>
    );
}

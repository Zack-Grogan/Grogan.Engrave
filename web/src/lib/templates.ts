export interface Template {
    id: string;
    name: string;
    category: string;
    preview: string;
    text: string;
    font: string;
    alignment: "left" | "center" | "right";
}

export const TEMPLATES: Template[] = [
    // Sports Templates
    {
        id: "sports-team-name",
        name: "Team Name",
        category: "Sports",
        preview: "🏆",
        text: "CHAMPIONS\n2026",
        font: "Bebas Neue, sans-serif",
        alignment: "center",
    },
    {
        id: "sports-player",
        name: "Player Name & Number",
        category: "Sports",
        preview: "⚽",
        text: "SMITH\n#23",
        font: "Bebas Neue, sans-serif",
        alignment: "center",
    },
    {
        id: "sports-motto",
        name: "Team Motto",
        category: "Sports",
        preview: "🥇",
        text: "LEAVE IT ALL\nON THE FIELD",
        font: "Bebas Neue, sans-serif",
        alignment: "center",
    },

    // Wedding Templates
    {
        id: "wedding-names",
        name: "Couple Names",
        category: "Wedding",
        preview: "💒",
        text: "Sarah & John\nJune 15, 2026",
        font: "Playfair Display, serif",
        alignment: "center",
    },
    {
        id: "wedding-initials",
        name: "Monogram",
        category: "Wedding",
        preview: "💍",
        text: "S & J",
        font: "Playfair Display, serif",
        alignment: "center",
    },
    {
        id: "wedding-quote",
        name: "Wedding Quote",
        category: "Wedding",
        preview: "❤️",
        text: "TO HAVE AND TO HOLD\nFROM THIS DAY FORWARD",
        font: "Playfair Display, serif",
        alignment: "center",
    },

    // Corporate Templates
    {
        id: "corporate-logo",
        name: "Company Name",
        category: "Corporate",
        preview: "💼",
        text: "ACME CORP\nEST. 2020",
        font: "Montserrat, sans-serif",
        alignment: "center",
    },
    {
        id: "corporate-event",
        name: "Event Name",
        category: "Corporate",
        preview: "📅",
        text: "ANNUAL CONFERENCE\n2026",
        font: "Montserrat, sans-serif",
        alignment: "center",
    },
    {
        id: "corporate-motto",
        name: "Company Motto",
        category: "Corporate",
        preview: "🎯",
        text: "EXCELLENCE IN\nEVERYTHING WE DO",
        font: "Montserrat, sans-serif",
        alignment: "center",
    },

    // Holiday Templates
    {
        id: "holiday-christmas",
        name: "Christmas",
        category: "Holiday",
        preview: "🎄",
        text: "MERRY CHRISTMAS\n2026",
        font: "Playfair Display, serif",
        alignment: "center",
    },
    {
        id: "holiday-newyear",
        name: "New Year",
        category: "Holiday",
        preview: "🎉",
        text: "HAPPY NEW YEAR\n2026",
        font: "Bebas Neue, sans-serif",
        alignment: "center",
    },
    {
        id: "holiday-valentine",
        name: "Valentine's Day",
        category: "Holiday",
        preview: "💕",
        text: "BE MY\nVALENTINE",
        font: "Lobster, cursive",
        alignment: "center",
    },

    // Graduation Templates
    {
        id: "graduation-name",
        name: "Graduate Name",
        category: "Graduation",
        preview: "🎓",
        text: "CLASS OF 2026\nALEX JOHNSON",
        font: "Bebas Neue, sans-serif",
        alignment: "center",
    },
    {
        id: "graduation-quote",
        name: "Graduation Quote",
        category: "Graduation",
        preview: "🌟",
        text: "THE FUTURE IS YOURS\nGO CONQUER IT",
        font: "Montserrat, sans-serif",
        alignment: "center",
    },

    // Birthday Templates
    {
        id: "birthday-name",
        name: "Birthday Name",
        category: "Birthday",
        preview: "🎂",
        text: "HAPPY BIRTHDAY\nEMMA!",
        font: "Lobster, cursive",
        alignment: "center",
    },
    {
        id: "birthday-age",
        name: "Milestone Age",
        category: "Birthday",
        preview: "🎈",
        text: "SWEET 16\nFOREVER YOUNG",
        font: "Bebas Neue, sans-serif",
        alignment: "center",
    },
];

export const TEMPLATE_CATEGORIES = [
    "All",
    "Sports",
    "Wedding",
    "Corporate",
    "Holiday",
    "Graduation",
    "Birthday",
];

export function getTemplateById(id: string): Template | undefined {
    return TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
    if (category === "All") return TEMPLATES;
    return TEMPLATES.filter(t => t.category === category);
}

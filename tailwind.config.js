/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                olive: {
                    50: '#F9FBE7',
                    100: '#E6EBC5',
                    200: '#C5E1A5',
                    300: '#9CCC65',
                    DEFAULT: '#6B8E23',
                    600: '#558B2F',
                    700: '#33691E',
                },
                paper: '#FDFBF7',
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['"Inter"', '"PingFang TC"', '"Microsoft JhengHei"', 'sans-serif'],
                serif: ['"Merriweather"', 'serif'],
            },
            keyframes: {
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-right": {
                    from: { opacity: "0", transform: "translateX(16px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.4s ease-out",
                "slide-in-right": "slide-in-right 0.3s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

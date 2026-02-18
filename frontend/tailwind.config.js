/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#4f46e5",
                "primary-glow": "rgba(79, 70, 229, 0.4)",
                "bg-dark": "#020617",
                "bg-card": "#0f172a",
                "bg-input": "#1e293b",
                "text-main": "#f8fafc",
                "text-muted": "#94a3b8",
                border: "#1e293b",
                "border-hover": "#334155",
                success: "#10b981",
                warning: "#f59e0b",
                danger: "#ef4444",
                info: "#06b6d4",
            },
        },
    },
    plugins: [],
}

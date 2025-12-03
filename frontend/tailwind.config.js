/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        // Gradient directions
        'bg-gradient-to-r',
        'bg-gradient-to-l',
        'bg-gradient-to-t',
        'bg-gradient-to-b',
        'bg-gradient-to-br',
        'bg-gradient-to-bl',
        'bg-gradient-to-tr',
        'bg-gradient-to-tl',

        // From colors - all common shades
        {
            pattern: /from-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
        },

        // To colors - all common shades  
        {
            pattern: /to-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
        },
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

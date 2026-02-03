/** @type {import('tailwindcss').Config} */
export default {
      content: [
            "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
            "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
            extend: {
                  fontFamily: {
                        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
                  },
                  colors: {
                        background: "var(--background)",
                        foreground: "var(--foreground)",
                  },
            },
      },
      plugins: [],
};
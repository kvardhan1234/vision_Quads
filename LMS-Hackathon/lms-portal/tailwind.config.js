/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Ensure all your React components are scanned
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define a formal color palette
      colors: {
        'primary': '#1e40af',  // A formal dark blue
        'secondary': '#f97316', // A complementary burnt orange
        'background': '#f1f5f9', // Light gray/slate for background
        'text-dark': '#1e293b', // Dark slate for text
      },
      // You can also add custom fonts here if needed
    },
  },
  plugins: [],
}
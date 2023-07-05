/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
      colors: {
        blue: "#200a58",
        red: "#E11937",
        purple: "#5236ab",
        customRed: "rgb(254 202 202)",
        customBlue: "rgb(191 219 254)",
        customPurple: "rgb(233 213 255);",
      },
      boxShadow: {
        "inner-md": "inset 5px 5px 38px -24px rgba(255,255,255,1)",
      },
    },
    screens: {
      lg: { max: "1440px" },
      // => @media (max-width: 1279px) { ... }

      md: { max: "1004px" },
      // => @media (max-width: 1023px) { ... }

      sm: { max: "550px" },
      // => @media (max-width: 639px) { ... }
      xs: { max: "478px" },
    },
  },
  plugins: [],
};

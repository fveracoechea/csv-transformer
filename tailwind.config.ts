import { radixThemePreset } from "radix-themes-tw";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [radixThemePreset],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
};
export default config;

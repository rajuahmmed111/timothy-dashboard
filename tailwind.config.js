/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ------------------------------------------------------------------
       |  CUSTOM FONT STACKS
       |-------------------------------------------------------------------
       |  – Use via className="font-raleway", "font-montserrat", etc.
       */
      fontFamily: {
        poppins:     ["'Poppins'", "sans-serif"],
        raleway:     ["'Raleway'", "sans-serif"],
        montserrat:  ["'Montserrat'", "sans-serif"],
      },

      /* ------------------------------------------------------------------
       |  BRAND COLOURS
       |-------------------------------------------------------------------
       |  Semantic names keep your JSX self‑explanatory. If you later tweak
       |  a hue, component code stays untouched.
       */
      colors: {
        /* oranges */
        brandOrange:         "#ea580c",   // lines, accents,
        orangePrimary:       "#FFD69B",  // dashboard buttons
        orangeLightBg:        "#fff0dd",   // light orange bg
        orangeMutedBg:       "#6b7280",  // subtle orange‑grey background
        orangeInactiveText:  "#c8b7a2",  // inactive nav / helper text
        orangeAction:        "#ff9000",  // login / logout buttons and orange texts

        /* greens */
        brandGreen:          "#009106",  // success text
        greenMutedBg:        "#dcfce7",  // success background
        greenLightText:      "#22c55e",  // lighter success text

        /* reds */
        redMutedBg:          "#fef2f2",  // danger background
        brandRed:            "#ef4444",  // danger text

        /* greys */
        darkGray:            "#0d0d0d",  // dark text 
        brandGray:           "#6b7280",  // neutral text 
        lightGrayBorders:    "#d1d5db",  // light gray border
        grayLightBg:         "#f9fafb",  // light background

        /* blues */
        brandBlue:           "#1e40af",  // links, primary actions
        blueLightBg:         "#dbeafe",  // (same hue – tweak if needed)
      },
    },
  },

  /* --------------------------------------------------------------------
   |  PLUGINS
   |---------------------------------------------------------------------
   |  DaisyUI stays last so its components inherit your extended theme.
   */
  plugins: [require("daisyui")],
};

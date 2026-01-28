/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
			menu: {
				DEFAULT: 'hsl(var(--nav-item-default))',
				hover: 'hsl(var(--nav-item-hover))'
			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			grey: 'hsl(var(--light-grey))',
			header4: 'hsl(var(--header-4-black))'
  		},
		fontFamily: {
			"poppins-regular":["Poppins-Regular"],
			"poppins-bold": ["Poppins-Bold"],
			"poppins-medium":["Poppins-Medium"],
			"poppins-extra-bold": ["Poppins-ExtraBold"],
			"poppins-semi-bold":["Poppins-SemiBold"],
			"ciscosans-oblique" : ["CiscoSans-Oblique"],
			"ciscosans-bold": ["CiscoSans-Bold"],
			"ciscosans-medium": ["CiscoSans-Medium"],
			"ciscosans-regular": ["CiscoSans-Regular"]
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}


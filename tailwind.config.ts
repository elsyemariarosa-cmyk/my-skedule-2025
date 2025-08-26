import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				medical: {
					DEFAULT: 'hsl(var(--medical))',
					foreground: 'hsl(var(--medical-foreground))',
					light: 'hsl(var(--medical-light))'
				},
				academic: {
					DEFAULT: 'hsl(var(--academic))',
					foreground: 'hsl(var(--academic-foreground))',
					light: 'hsl(var(--academic-light))'
				},
				// Additional class-specific colors
				blue: {
					DEFAULT: 'hsl(var(--blue-primary))',
					foreground: 'hsl(var(--blue-foreground))',
					light: 'hsl(var(--blue-light))'
				},
				green: {
					DEFAULT: 'hsl(var(--green-primary))',
					foreground: 'hsl(var(--green-foreground))',
					light: 'hsl(var(--green-light))'
				},
				purple: {
					DEFAULT: 'hsl(var(--purple-primary))',
					foreground: 'hsl(var(--purple-foreground))',
					light: 'hsl(var(--purple-light))'
				},
				orange: {
					DEFAULT: 'hsl(var(--orange-primary))',
					foreground: 'hsl(var(--orange-foreground))',
					light: 'hsl(var(--orange-light))'
				},
				teal: {
					DEFAULT: 'hsl(var(--teal-primary))',
					foreground: 'hsl(var(--teal-foreground))',
					light: 'hsl(var(--teal-light))'
				},
				indigo: {
					DEFAULT: 'hsl(var(--indigo-primary))',
					foreground: 'hsl(var(--indigo-foreground))',
					light: 'hsl(var(--indigo-light))'
				},
				// Maroon variations in HSL
				maroon: {
					50: 'hsl(var(--maroon-50))',
					100: 'hsl(var(--maroon-100))',
					200: 'hsl(var(--maroon-200))',
					300: 'hsl(var(--maroon-300))',
					400: 'hsl(var(--maroon-400))',
					500: 'hsl(var(--maroon-500))',
					600: 'hsl(var(--maroon-600))',
					700: 'hsl(var(--maroon-700))',
					800: 'hsl(var(--maroon-800))',
					900: 'hsl(var(--maroon-900))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

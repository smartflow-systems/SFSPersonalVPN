/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./public/**/*.{html,js}",
    "./*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        // SFS VPN Brand Colors
        'sfs-brown': '#4B2E2E',
        'sfs-black': '#0A0A0A',
        'sfs-gold': '#FFD700',
        'sfs-gold-light': '#FFED4E',
        'sfs-gold-dark': '#D4AF37',
        'sfs-gold-hover': '#E6C200',
        'sfs-beige': '#F5F5DC',
        'sfs-white': '#FFFFFF',
        'sfs-alert': '#FF4444',
        'sfs-success': '#4CAF50',

        // Semantic aliases
        primary: '#FFD700',
        'primary-hover': '#E6C200',
        background: '#4B2E2E',
        surface: '#0A0A0A',
        danger: '#FF4444',
        success: '#4CAF50'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFED4E 0%, #FFD700 50%, #D4AF37 100%)',
        'gold-subtle': 'linear-gradient(135deg, rgba(255, 237, 78, 0.1) 0%, rgba(255, 215, 0, 0.2) 50%, rgba(212, 175, 55, 0.1) 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
        'alert-gradient': 'linear-gradient(90deg, rgba(255, 68, 68, 0.8) 0%, rgba(255, 68, 68, 0.2) 100%)',
        'analytics-accent': 'linear-gradient(135deg, rgba(255, 237, 78, 0.1) 0%, rgba(255, 215, 0, 0.15) 100%)',
        'preferences-header': 'linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, transparent 100%)'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(10, 10, 10, 0.5)',
        'glass-hover': '0 12px 48px 0 rgba(255, 215, 0, 0.2)',
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-glow-strong': '0 0 40px rgba(255, 215, 0, 0.5)',
        'alert-glow': '0 0 20px rgba(255, 68, 68, 0.4)',
        'inner-dark': 'inset 0 2px 8px rgba(10, 10, 10, 0.4)'
      },
      backdropBlur: {
        'glass': '12px',
        'panel': '16px'
      },
      animation: {
        'pulse-alert': 'pulse-alert 2s ease-in-out infinite',
        'gold-shimmer': 'gold-shimmer 3s ease infinite'
      },
      keyframes: {
        'pulse-alert': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.02)' }
        },
        'gold-shimmer': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-card': {
          'background': 'rgba(10, 10, 10, 0.6)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 215, 0, 0.2)',
          'border-radius': '12px',
          'box-shadow': '0 8px 32px 0 rgba(10, 10, 10, 0.5)'
        },
        '.glass-card-hover': {
          'background': 'rgba(10, 10, 10, 0.7)',
          'box-shadow': '0 12px 48px 0 rgba(255, 215, 0, 0.2)',
          'border-color': 'rgba(255, 215, 0, 0.3)'
        },
        '.glass-panel': {
          'background': 'rgba(10, 10, 10, 0.8)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 215, 0, 0.3)',
          'border-radius': '16px',
          'box-shadow': '0 8px 32px rgba(10, 10, 10, 0.5)'
        },
        '.security-alert': {
          'background': 'rgba(255, 68, 68, 0.15)',
          'border': '1px solid rgba(255, 68, 68, 0.4)',
          'box-shadow': '0 0 20px rgba(255, 68, 68, 0.3)'
        },
        '.analytics-card': {
          'background': 'rgba(10, 10, 10, 0.7)',
          'border': '1px solid rgba(255, 215, 0, 0.25)'
        }
      }
      addUtilities(newUtilities)
    }
  ]
}

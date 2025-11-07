# SFS PersonalVPN

A modern, secure VPN client with real-time security monitoring, extended analytics, and comprehensive user preferences.

## Features

### 🛡️ Real-Time Security Alerts
- DNS leak detection
- IP leak monitoring
- WebRTC leak detection
- Connection encryption verification
- Kill switch monitoring
- Live security dashboard with animated alerts

### 📊 Extended Analytics
- Real-time bandwidth tracking
- Connection quality monitoring
- Latency and jitter measurement
- Packet loss detection
- Historical session data
- Performance metrics visualization
- Data export capabilities

### ⚙️ User-Defined Preferences
- Connection settings (auto-connect, kill switch, protocol selection)
- Server preferences (location, type, auto-selection)
- Notification controls
- Security options (multi-hop, obfuscation, malware protection)
- Privacy settings
- Performance tuning
- Interface customization
- Advanced configuration

## Theme

The SFS PersonalVPN features a distinctive visual identity:
- **Background**: Brown (#4B2E2E) - warm, professional
- **Panels**: Deep Black (#0A0A0A) - sleek, modern
- **Accents**: Gold Gradient (#FFED4E → #FFD700 → #D4AF37) - premium, eye-catching
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Animations**: Smooth transitions and security alert pulses

## Project Structure

```
SFSPersonalVPN/
├── config/
│   ├── sfs-vpn-theme-config.json    # Theme design tokens
│   ├── sfs-vpn-globals.css          # Global CSS variables
│   └── tailwind.config.cjs          # Tailwind configuration
├── src/
│   ├── security-alerts.js           # Security monitoring system
│   ├── extended-analytics.js        # Analytics tracking
│   └── user-preferences.js          # Preferences management
├── public/
│   └── index.html                   # Demo dashboard
├── docs/
│   └── (documentation files)
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ (for development)
- Modern web browser with ES6+ support

### Setup

1. Clone the repository:
```bash
git clone https://github.com/smartflowsystems/sfs-personal-vpn.git
cd sfs-personal-vpn
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Or serve the static files:
```bash
npm run serve
```

4. Open your browser to `http://localhost:8080`

## Usage

### Security Alert System

```javascript
// Initialize security monitoring
const securityAlerts = new SecurityAlertSystem({
  alertThreshold: 3,
  checkInterval: 5000 // 5 seconds
});

// Start monitoring
securityAlerts.startMonitoring();

// Subscribe to alerts
securityAlerts.onAlert((alert) => {
  console.log('Security Alert:', alert);
  // Handle alert in UI
});

// Get active alerts
const activeAlerts = securityAlerts.getActiveAlerts();

// Dismiss an alert
securityAlerts.dismissAlert(alertId);

// Stop monitoring
securityAlerts.stopMonitoring();
```

### Extended Analytics

```javascript
// Initialize analytics
const analytics = new ExtendedAnalytics({
  updateInterval: 1000, // 1 second
  historyLimit: 3600,   // 1 hour of data
  storageKey: 'sfs_vpn_analytics'
});

// Start tracking
analytics.startTracking();

// Subscribe to metrics updates
analytics.subscribe((metrics) => {
  console.log('Current Speed:', metrics.currentSpeed);
  console.log('Latency:', metrics.latency);
  console.log('Connection Quality:', metrics.connectionStrength);
});

// Get session statistics
const sessionStats = analytics.getSessionStats();

// Get bandwidth usage
const bandwidth = analytics.getBandwidthSummary();

// Get historical data
const history = analytics.getHistoricalData(7); // Last 7 days

// Export data
const exportData = analytics.exportData();

// Stop tracking
analytics.stopTracking();
```

### User Preferences

```javascript
// Initialize preferences
const preferences = new UserPreferences({
  storageKey: 'sfs_vpn_preferences'
});

// Get a preference
const autoConnect = preferences.get('connection.autoConnect');

// Set a preference
preferences.set('connection.autoConnect', true);

// Update multiple preferences
preferences.update({
  'connection.killSwitch': true,
  'security.threatLevel': 'strict',
  'notifications.securityAlerts': true
});

// Subscribe to changes
preferences.onChange((event) => {
  console.log('Preference changed:', event.path);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
});

// Get all preferences
const allPrefs = preferences.getAll();

// Get a category
const connectionPrefs = preferences.getCategory('connection');

// Reset to defaults
preferences.reset('connection.autoConnect');
preferences.resetAll();

// Export/Import
const exported = preferences.export();
preferences.import(exported);
```

## Theme Integration

### Using CSS Variables

```css
/* In your custom CSS */
.my-component {
  background: var(--sfs-surface);
  color: var(--sfs-text);
  border: 1px solid var(--sfs-border);
  border-radius: var(--sfs-radius-lg);
  box-shadow: var(--sfs-shadow-lg);
}

.my-button {
  background: var(--sfs-gradient-gold);
  color: var(--sfs-black);
  padding: var(--sfs-space-sm) var(--sfs-space-lg);
  transition: all var(--sfs-transition-fast) var(--sfs-ease-smooth);
}
```

### Using Utility Classes

```html
<!-- Glass card with hover effect -->
<div class="sfs-glass-card">
  Your content here
</div>

<!-- Security alert -->
<div class="sfs-security-alert">
  Critical security notification
</div>

<!-- Analytics card -->
<div class="sfs-analytics-card">
  Analytics data
</div>

<!-- Preferences panel -->
<div class="sfs-preferences-panel">
  <div class="sfs-preferences-header">
    <h2>Settings</h2>
  </div>
  <!-- Settings content -->
</div>

<!-- Buttons -->
<button class="sfs-btn-primary">Connect</button>
<button class="sfs-btn-ghost">Settings</button>
<button class="sfs-btn-alert">Disconnect</button>
```

### Using with Tailwind CSS

Import the theme configuration in your Tailwind setup:

```javascript
// tailwind.config.js
module.exports = require('./config/tailwind.config.cjs');
```

Then use Tailwind classes with the custom theme:

```html
<div class="bg-sfs-black text-sfs-beige p-6 rounded-lg">
  <h2 class="text-sfs-gold text-2xl font-bold">Title</h2>
  <p class="text-sm">Content with theme colors</p>
</div>
```

## Configuration

### Theme Configuration

Edit `config/sfs-vpn-theme-config.json` to customize:
- Brand colors
- Gradients
- Glassmorphism effects
- VPN-specific feature styles
- Layout spacing
- Shadows
- Animations
- Typography
- Breakpoints

### Security Alert Configuration

```javascript
const securityAlerts = new SecurityAlertSystem({
  alertThreshold: 3,      // Number of checks before alerting
  checkInterval: 5000     // Check interval in milliseconds
});
```

### Analytics Configuration

```javascript
const analytics = new ExtendedAnalytics({
  updateInterval: 1000,   // Metric update interval
  historyLimit: 3600,     // Number of data points to keep
  storageKey: 'custom_key' // LocalStorage key
});
```

### Preferences Configuration

All preference defaults are defined in the `UserPreferences` class. Customize the `defaults` object to change initial values.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Requires:
- ES6+ JavaScript support
- CSS Custom Properties
- LocalStorage API
- Fetch API
- WebRTC (for leak detection)

## Development

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Code Style

The project follows standard JavaScript conventions with:
- ES6+ modules
- Promises and async/await
- Class-based architecture
- JSDoc comments

## Security Considerations

This is a client-side VPN interface. In production:
1. Implement actual VPN protocol integration (OpenVPN, WireGuard, etc.)
2. Use secure WebSocket or API connections to VPN backend
3. Implement proper authentication and authorization
4. Encrypt sensitive data in localStorage
5. Add HTTPS requirement
6. Implement CSP headers
7. Regular security audits

## Performance

- Real-time metrics update every 1 second
- Security checks every 5 seconds
- Automatic history trimming
- Efficient LocalStorage usage
- Debounced UI updates

## Roadmap

- [ ] Mobile-responsive design
- [ ] Dark/Light theme toggle
- [ ] Multiple language support
- [ ] Server selection map
- [ ] Advanced traffic routing
- [ ] Split tunneling configuration
- [ ] Two-factor authentication
- [ ] Biometric authentication
- [ ] Integration with major VPN protocols
- [ ] Native desktop apps (Electron)
- [ ] Mobile apps (React Native)

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/smartflowsystems/sfs-personal-vpn/issues
- Email: support@smartflowsystems.com
- Documentation: https://docs.smartflowsystems.com/vpn

## Credits

Developed by SmartFlow Systems
Theme designed for the SFS ecosystem
Built with modern web technologies

---

**Note**: This is a front-end demonstration. Actual VPN functionality requires backend integration with VPN protocols and server infrastructure.

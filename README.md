# SFS PersonalVPN

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/smartflowsystems/sfs-personal-vpn)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/smartflowsystems/sfs-personal-vpn)

A modern, secure VPN client with real-time security monitoring, extended analytics, and comprehensive user preferences. Built with premium design and enterprise-grade features by **SmartFlow Systems**.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Usage](#usage)
- [User Preferences](#user-preferences)
- [Theme Integration](#theme-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### 🛡️ Real-Time Security Alerts
- **DNS Leak Detection**: Continuous monitoring for DNS leaks
- **IP Leak Monitoring**: Real-time IP address leak detection
- **WebRTC Leak Detection**: Prevents WebRTC-based IP leaks
- **Connection Encryption Verification**: Ensures secure tunnel encryption
- **Kill Switch Monitoring**: Automatic protection when VPN disconnects
- **Live Security Dashboard**: Animated alerts with visual indicators

### 📊 Extended Analytics
- **Real-time Bandwidth Tracking**: Upload/download speed monitoring
- **Connection Quality Monitoring**: Signal strength and stability metrics
- **Latency and Jitter Measurement**: Network performance tracking
- **Packet Loss Detection**: Connection reliability analysis
- **Historical Session Data**: 30-day data retention
- **Performance Metrics Visualization**: Interactive charts and graphs
- **Data Export Capabilities**: CSV/JSON export for analysis

### ⚙️ User-Defined Preferences (50+ Settings)

#### Connection Settings
- Auto-connect on startup
- Auto-reconnect on disconnect
- Kill switch protection
- Protocol selection (OpenVPN, WireGuard, IKEv2)
- DNS leak protection
- IPv6 leak protection
- Split tunneling configuration

#### Server Preferences
- Auto-select optimal server
- Preferred location selection
- Server type preference (fastest, nearest, P2P, streaming)
- Server change notifications

#### Notification Controls
- Connection status alerts
- Security alert notifications
- Server change notifications
- Bandwidth warning thresholds
- Update notifications
- Sound effects toggle

#### Security Options
- Multi-hop VPN cascading
- Traffic obfuscation
- Malware protection
- Ad blocking
- Tracker blocking
- Threat level settings (permissive, balanced, strict)

#### Privacy Settings
- Anonymous analytics sharing
- Crash report submission
- Diagnostic data collection

#### Performance Tuning
- Data compression
- TCP fallback configuration
- MTU optimization
- Connection timeout settings
- Maximum retry attempts

#### Interface Customization
- Dark/Light theme
- Language selection
- Start minimized option
- System tray integration
- Speed display in tray
- Compact mode

#### Advanced Configuration
- Custom DNS servers (primary/secondary)
- Custom port selection
- MSS fix settings
- Raw configuration editor

## Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Modern web browser** with ES6+ support
- **Git** for version control

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/smartflowsystems/sfs-personal-vpn.git
cd sfs-personal-vpn
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open your browser** to `http://localhost:8080`

Alternatively, serve the static files:
```bash
npm run serve
```

## Environment Variables

This project currently runs as a client-side application and does not require environment variables. For production deployment with backend integration, create a `.env` file:

```bash
# VPN Backend Configuration (for production)
VPN_API_URL=https://api.yourvpn.com
VPN_API_KEY=your_api_key_here

# Security Settings
ENABLE_ENCRYPTION=true
ENCRYPTION_KEY=your_encryption_key

# Analytics (optional)
ANALYTICS_ENABLED=false
ANALYTICS_KEY=your_analytics_key

# Port Configuration
PORT=8080
```

See `.env.example` for a complete list of available configuration options.

## Development

### Project Structure

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
├── scripts/
│   └── (build and deployment scripts)
├── package.json
└── README.md
```

### Available Scripts

```bash
# Start development server
npm run dev

# Serve static files
npm run serve

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Code Style

The project follows these standards:
- **ES6+ modules** for code organization
- **Promises and async/await** for asynchronous operations
- **Class-based architecture** for component structure
- **JSDoc comments** for documentation
- **Consistent naming conventions** (camelCase for variables, PascalCase for classes)

## Usage

### Security Alert System

Initialize and manage real-time security monitoring:

```javascript
// Initialize security monitoring
const securityMonitor = new SecurityAlertSystem({
  alertThreshold: 3,          // Number of checks before alerting
  checkInterval: 5000,        // Check interval in milliseconds
  enableDNSCheck: true,       // Enable DNS leak detection
  enableIPCheck: true,        // Enable IP leak detection
  enableWebRTCCheck: true     // Enable WebRTC leak detection
});

// Start monitoring
securityMonitor.startMonitoring();

// Subscribe to alerts
securityMonitor.onAlert((securityAlert) => {
  console.log('Security Alert:', securityAlert);
  // Display alert in UI
  displaySecurityAlert(securityAlert);
});

// Get active alerts
const activeSecurityAlerts = securityMonitor.getActiveAlerts();

// Dismiss an alert
securityMonitor.dismissAlert(alertIdentifier);

// Stop monitoring
securityMonitor.stopMonitoring();
```

### Extended Analytics

Track and analyze VPN performance metrics:

```javascript
// Initialize analytics tracking
const analyticsTracker = new ExtendedAnalytics({
  updateInterval: 1000,       // Metric update interval (1 second)
  historyLimit: 3600,         // Number of data points to keep (1 hour)
  storageKey: 'sfs_vpn_analytics'
});

// Start tracking
analyticsTracker.startTracking();

// Subscribe to metrics updates
analyticsTracker.subscribe((performanceMetrics) => {
  console.log('Current Speed:', performanceMetrics.currentSpeed);
  console.log('Latency:', performanceMetrics.latency);
  console.log('Connection Quality:', performanceMetrics.connectionStrength);
});

// Get session statistics
const sessionStatistics = analyticsTracker.getSessionStats();

// Get bandwidth usage summary
const bandwidthSummary = analyticsTracker.getBandwidthSummary();

// Get historical data (last 7 days)
const historicalPerformance = analyticsTracker.getHistoricalData(7);

// Export data for external analysis
const exportedAnalyticsData = analyticsTracker.exportData();

// Stop tracking
analyticsTracker.stopTracking();
```

### User Preferences

Manage user settings with persistence:

```javascript
// Initialize preferences system
const userPreferencesManager = new UserPreferences({
  storageKey: 'sfs_vpn_preferences'
});

// Get a specific preference
const autoConnectEnabled = userPreferencesManager.get('connection.autoConnect');

// Set a preference
userPreferencesManager.set('connection.autoConnect', true);

// Update multiple preferences at once
userPreferencesManager.update({
  'connection.killSwitch': true,
  'security.threatLevel': 'strict',
  'notifications.securityAlerts': true
});

// Subscribe to preference changes
userPreferencesManager.onChange((changeEvent) => {
  console.log('Preference changed:', changeEvent.path);
  console.log('Old value:', changeEvent.oldValue);
  console.log('New value:', changeEvent.newValue);
});

// Get all preferences
const allUserPreferences = userPreferencesManager.getAll();

// Get preferences by category
const connectionSettings = userPreferencesManager.getCategory('connection');

// Reset specific preference to default
userPreferencesManager.reset('connection.autoConnect');

// Reset all preferences
userPreferencesManager.resetAll();

// Export/Import preferences
const exportedSettings = userPreferencesManager.export();
userPreferencesManager.import(exportedSettings);
```

## User Preferences

### Complete Preferences List

The application includes **50+ customizable settings** organized into 8 categories:

#### 1. Connection Settings (7 settings)
- `autoConnect` - Automatically connect on startup
- `autoReconnect` - Reconnect after disconnection
- `killSwitch` - Block traffic when VPN disconnects
- `preferredProtocol` - VPN protocol selection
- `dnsLeakProtection` - DNS leak prevention
- `ipv6LeakProtection` - IPv6 leak prevention
- `splitTunneling` - Per-application VPN routing

#### 2. Server Preferences (4 settings)
- `autoSelectServer` - Automatic server selection
- `preferredLocation` - Default server location
- `preferredServerType` - Server optimization type
- `serverChangeNotifications` - Alert on server changes

#### 3. Notification Controls (6 settings)
- `connectionStatus` - Connection state alerts
- `securityAlerts` - Security threat notifications
- `serverChanges` - Server switch notifications
- `bandwidthWarnings` - Data usage alerts
- `updateNotifications` - Software update alerts
- `sound` - Audio notifications

#### 4. Security Options (6 settings)
- `multiHopVPN` - Multi-server routing
- `obfuscation` - Traffic disguise
- `malwareProtection` - Malicious site blocking
- `adBlocking` - Advertisement filtering
- `trackerBlocking` - Tracking prevention
- `threatLevel` - Security strictness level

#### 5. Privacy Settings (3 settings)
- `shareAnonymousAnalytics` - Usage statistics
- `crashReports` - Error reporting
- `diagnosticData` - Performance data collection

#### 6. Performance Tuning (5 settings)
- `dataCompression` - Traffic compression
- `tcpFallback` - TCP protocol fallback
- `mtu` - Maximum transmission unit
- `connectionTimeout` - Connection timeout duration
- `maxRetries` - Maximum reconnection attempts

#### 7. Interface Customization (7 settings)
- `theme` - Dark/Light mode
- `language` - Interface language
- `startMinimized` - Launch minimized
- `minimizeToTray` - System tray integration
- `showInTaskbar` - Taskbar visibility
- `showSpeedInTray` - Tray speed display
- `compactMode` - Compact interface layout

#### 8. Advanced Configuration (4 settings)
- `customDNS` - Custom DNS servers
- `port` - Custom VPN port
- `mssfix` - MSS clamping value
- `customConfig` - Raw configuration

## Theme Integration

SFS PersonalVPN features a distinctive premium visual identity:

- **Background**: Warm Brown (#4B2E2E)
- **Panels**: Deep Black (#0A0A0A)
- **Accents**: Gold Gradient (#FFED4E → #FFD700 → #D4AF37)
- **Effects**: Glassmorphism with backdrop blur
- **Animations**: Smooth transitions and security pulses

### Using CSS Variables

```css
/* Custom component styling */
.custom-vpn-panel {
  background: var(--sfs-surface);
  color: var(--sfs-text);
  border: 1px solid var(--sfs-border);
  border-radius: var(--sfs-radius-lg);
  box-shadow: var(--sfs-shadow-lg);
}

.custom-connect-button {
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
  Connection Status
</div>

<!-- Security alert -->
<div class="sfs-security-alert">
  Critical security notification
</div>

<!-- Analytics card -->
<div class="sfs-analytics-card">
  Performance metrics
</div>

<!-- Action buttons -->
<button class="sfs-btn-primary">Connect</button>
<button class="sfs-btn-ghost">Settings</button>
<button class="sfs-btn-alert">Disconnect</button>
```

### Using with Tailwind CSS

```javascript
// tailwind.config.js
module.exports = require('./config/tailwind.config.cjs');
```

```html
<div class="bg-sfs-black text-sfs-beige p-6 rounded-lg">
  <h2 class="text-sfs-gold text-2xl font-bold">VPN Dashboard</h2>
  <p class="text-sm">Connected to secure server</p>
</div>
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- security-alerts.test.js
```

### Test Coverage

The test suite covers:
- Security alert detection and notifications
- Analytics data collection and aggregation
- User preference storage and retrieval
- Theme integration and styling
- Browser compatibility

Target coverage: **80%+** for all modules

## Deployment

### Build for Production

```bash
# Create production build
npm run build

# Output will be in /dist directory
```

### Production Checklist

Before deploying to production:

1. **Backend Integration**
   - [ ] Implement VPN protocol integration (OpenVPN, WireGuard, etc.)
   - [ ] Set up secure WebSocket/API connection to VPN backend
   - [ ] Configure authentication and authorization
   - [ ] Set up environment variables

2. **Security Hardening**
   - [ ] Enable HTTPS/TLS
   - [ ] Implement Content Security Policy (CSP)
   - [ ] Encrypt sensitive data in localStorage
   - [ ] Set up security headers
   - [ ] Configure CORS policies

3. **Performance Optimization**
   - [ ] Minimize and compress assets
   - [ ] Enable browser caching
   - [ ] Implement CDN for static assets
   - [ ] Optimize image assets

4. **Monitoring**
   - [ ] Set up error logging
   - [ ] Configure analytics tracking
   - [ ] Implement health check endpoints
   - [ ] Set up uptime monitoring

### Deployment Options

#### Static Hosting (Current Frontend)
- **Netlify**: `npm run build && netlify deploy`
- **Vercel**: `vercel deploy`
- **GitHub Pages**: `npm run build && gh-pages -d dist`

#### Full Stack (With Backend)
- **Docker**: Use provided Dockerfile
- **Kubernetes**: Use k8s manifests in `/deploy`
- **Cloud Platforms**: AWS, GCP, Azure

## Browser Support

Supported browsers:
- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Opera**: 76+

### Required Features
- ES6+ JavaScript support
- CSS Custom Properties
- LocalStorage API
- Fetch API
- WebRTC (for leak detection)

## Security Considerations

**Important**: This is currently a client-side VPN interface demonstration.

For production deployment, you must:

1. **Implement VPN Protocol Integration**: Connect to actual VPN backend (OpenVPN, WireGuard, IKEv2)
2. **Secure Communication**: Use encrypted WebSocket or API connections
3. **Authentication**: Implement proper user authentication and session management
4. **Data Encryption**: Encrypt sensitive data before storing in localStorage
5. **HTTPS Only**: Enforce HTTPS for all connections
6. **Security Headers**: Implement CSP, HSTS, and other security headers
7. **Regular Audits**: Conduct security audits and penetration testing

## Performance

- **Metrics Update Frequency**: Every 1 second
- **Security Check Interval**: Every 5 seconds
- **Data Retention**: Automatic history trimming
- **Storage Efficiency**: Optimized LocalStorage usage
- **UI Updates**: Debounced for performance

## Roadmap

### Upcoming Features
- [ ] Mobile-responsive design improvements
- [ ] User-selectable themes (dark/light toggle)
- [ ] Multiple language support (i18n)
- [ ] Interactive server selection map
- [ ] Advanced traffic routing options
- [ ] Split tunneling configuration UI
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication support

### Future Integrations
- [ ] OpenVPN protocol integration
- [ ] WireGuard protocol support
- [ ] IKEv2/IPSec support
- [ ] Native desktop apps (Electron)
- [ ] Mobile apps (React Native)
- [ ] Browser extensions

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to your fork: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2024 SmartFlow Systems

## Support

### Need Help?

- **GitHub Issues**: [Report bugs or request features](https://github.com/smartflowsystems/sfs-personal-vpn/issues)
- **Email Support**: support@smartflowsystems.com
- **Documentation**: [Full documentation](https://docs.smartflowsystems.com/vpn)
- **Community Discord**: [Join our community](https://discord.gg/smartflowsystems)

### Contact

- **Website**: https://smartflowsystems.com
- **Twitter**: @SmartFlowSys
- **Email**: info@smartflowsystems.com

## Credits

**Developed by SmartFlow Systems**

- Premium theme designed for the SFS ecosystem
- Built with modern web technologies
- Powered by security-first architecture

---

**Note**: This is a front-end demonstration. Actual VPN functionality requires backend integration with VPN protocols and server infrastructure. See [Deployment](#deployment) section for production requirements.

**Part of the SmartFlow Systems ecosystem** - Premium AI automation and security solutions for modern businesses.

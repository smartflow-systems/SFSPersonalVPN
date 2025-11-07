/**
 * SFS PersonalVPN - Main Entry Point
 * Version 1.0.0
 *
 * This module provides a unified interface to all VPN features
 */

import SecurityAlertSystem from './security-alerts.js';
import ExtendedAnalytics from './extended-analytics.js';
import UserPreferences from './user-preferences.js';

/**
 * SFS PersonalVPN Application
 */
class SFSPersonalVPN {
  constructor(config = {}) {
    this.config = {
      autoStart: config.autoStart !== false,
      securityCheckInterval: config.securityCheckInterval || 5000,
      analyticsUpdateInterval: config.analyticsUpdateInterval || 1000,
      ...config
    };

    // Initialize subsystems
    this.security = new SecurityAlertSystem({
      checkInterval: this.config.securityCheckInterval,
      alertThreshold: config.alertThreshold || 3
    });

    this.analytics = new ExtendedAnalytics({
      updateInterval: this.config.analyticsUpdateInterval,
      historyLimit: config.historyLimit || 3600,
      storageKey: config.analyticsStorageKey || 'sfs_vpn_analytics'
    });

    this.preferences = new UserPreferences({
      storageKey: config.preferencesStorageKey || 'sfs_vpn_preferences'
    });

    // State management
    this.state = {
      connected: false,
      server: null,
      ip: null,
      location: null
    };

    // Event handlers
    this.eventHandlers = {
      connect: [],
      disconnect: [],
      securityAlert: [],
      metricsUpdate: [],
      preferenceChange: []
    };

    // Wire up subsystem events
    this.setupEventHandlers();

    // Auto-start if configured
    if (this.config.autoStart) {
      this.initialize();
    }
  }

  /**
   * Initialize the VPN application
   */
  async initialize() {
    console.log('SFS PersonalVPN initializing...');

    // Start security monitoring
    this.security.startMonitoring();

    // Start analytics tracking
    this.analytics.startTracking();

    // Check auto-connect preference
    if (this.preferences.get('connection.autoConnect')) {
      await this.connect();
    }

    console.log('SFS PersonalVPN initialized');
  }

  /**
   * Connect to VPN
   */
  async connect(serverId = null) {
    console.log('Connecting to VPN...');

    try {
      // In production, this would initiate actual VPN connection
      // For now, simulate connection
      await this.simulateConnection(serverId);

      this.state.connected = true;
      this.emit('connect', { server: this.state.server });

      return { success: true, server: this.state.server };
    } catch (error) {
      console.error('Connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Disconnect from VPN
   */
  async disconnect() {
    console.log('Disconnecting from VPN...');

    try {
      // In production, this would terminate VPN connection
      await this.simulateDisconnection();

      this.state.connected = false;
      this.emit('disconnect', {});

      return { success: true };
    } catch (error) {
      console.error('Disconnection failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current connection status
   */
  getStatus() {
    return {
      connected: this.state.connected,
      server: this.state.server,
      ip: this.state.ip,
      location: this.state.location,
      metrics: this.analytics.getRealTimeMetrics(),
      alerts: this.security.getActiveAlerts().length
    };
  }

  /**
   * Get comprehensive dashboard data
   */
  getDashboardData() {
    return {
      status: this.getStatus(),
      security: {
        activeAlerts: this.security.getActiveAlerts(),
        alertHistory: this.security.getAlertHistory(10)
      },
      analytics: {
        session: this.analytics.getSessionStats(),
        realtime: this.analytics.getRealTimeMetrics(),
        bandwidth: this.analytics.getBandwidthSummary()
      },
      preferences: this.preferences.getSummary()
    };
  }

  /**
   * Register event handler
   */
  on(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].push(handler);
    }
  }

  /**
   * Unregister event handler
   */
  off(event, handler) {
    if (this.eventHandlers[event]) {
      const index = this.eventHandlers[event].indexOf(handler);
      if (index > -1) {
        this.eventHandlers[event].splice(index, 1);
      }
    }
  }

  /**
   * Emit event to handlers
   */
  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Event handler error (${event}):`, error);
        }
      });
    }
  }

  /**
   * Setup internal event handlers
   */
  setupEventHandlers() {
    // Forward security alerts
    this.security.onAlert((alert) => {
      this.emit('securityAlert', alert);
    });

    // Forward analytics updates
    this.analytics.subscribe((metrics) => {
      this.emit('metricsUpdate', metrics);
    });

    // Forward preference changes
    this.preferences.onChange((change) => {
      this.emit('preferenceChange', change);
      this.handlePreferenceChange(change);
    });
  }

  /**
   * Handle preference changes
   */
  handlePreferenceChange(change) {
    // React to specific preference changes
    if (change.path === 'connection.killSwitch') {
      console.log('Kill switch setting changed:', change.newValue);
      // In production, would update VPN configuration
    }

    if (change.path === 'security.threatLevel') {
      console.log('Threat level changed:', change.newValue);
      // In production, would adjust security policies
    }
  }

  /**
   * Shutdown the application
   */
  shutdown() {
    console.log('Shutting down SFS PersonalVPN...');

    // Stop monitoring
    this.security.stopMonitoring();
    this.analytics.stopTracking();

    // Disconnect if connected
    if (this.state.connected) {
      this.disconnect();
    }

    console.log('SFS PersonalVPN shut down');
  }

  /**
   * Simulate VPN connection (for demonstration)
   */
  async simulateConnection(serverId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.server = serverId || 'us-ny-001';
        this.state.ip = '203.0.113.1';
        this.state.location = 'New York, USA';
        resolve();
      }, 2000);
    });
  }

  /**
   * Simulate VPN disconnection (for demonstration)
   */
  async simulateDisconnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.server = null;
        this.state.ip = null;
        this.state.location = null;
        resolve();
      }, 1000);
    });
  }
}

// Export for use in modules
export default SFSPersonalVPN;

// Also export subsystems
export {
  SecurityAlertSystem,
  ExtendedAnalytics,
  UserPreferences
};

// For browser usage (CommonJS)
if (typeof window !== 'undefined') {
  window.SFSPersonalVPN = SFSPersonalVPN;
  window.SecurityAlertSystem = SecurityAlertSystem;
  window.ExtendedAnalytics = ExtendedAnalytics;
  window.UserPreferences = UserPreferences;
}

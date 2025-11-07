/**
 * SFS PersonalVPN - User-Defined Preferences System
 * Manages user settings and preferences with persistence
 * Version 1.0.0
 */

class UserPreferences {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'sfs_vpn_preferences';
    this.changeCallbacks = [];

    // Default preferences
    this.defaults = {
      connection: {
        autoConnect: false,
        autoReconnect: true,
        killSwitch: true,
        preferredProtocol: 'OpenVPN',
        dnsLeakProtection: true,
        ipv6LeakProtection: true,
        splitTunneling: {
          enabled: false,
          apps: [],
          mode: 'exclude' // 'exclude' or 'include'
        }
      },
      server: {
        autoSelectServer: true,
        preferredLocation: null,
        preferredServerType: 'fastest', // 'fastest', 'nearest', 'p2p', 'streaming'
        serverChangeNotifications: true
      },
      notifications: {
        connectionStatus: true,
        securityAlerts: true,
        serverChanges: true,
        bandwidthWarnings: true,
        updateNotifications: true,
        sound: true
      },
      security: {
        multiHopVPN: false,
        obfuscation: false,
        malwareProtection: true,
        adBlocking: false,
        trackerBlocking: false,
        threatLevel: 'balanced' // 'permissive', 'balanced', 'strict'
      },
      privacy: {
        shareAnonymousAnalytics: false,
        crashReports: true,
        diagnosticData: false
      },
      performance: {
        dataCompression: false,
        tcpFallback: true,
        mtu: 1500,
        connectionTimeout: 30,
        maxRetries: 3
      },
      interface: {
        theme: 'dark',
        language: 'en',
        startMinimized: false,
        minimizeToTray: true,
        showInTaskbar: true,
        showSpeedInTray: false,
        compactMode: false
      },
      analytics: {
        trackBandwidth: true,
        trackLatency: true,
        trackQuality: true,
        historyDays: 30
      },
      advanced: {
        customDNS: {
          enabled: false,
          primary: '1.1.1.1',
          secondary: '1.0.0.1'
        },
        port: null,
        mssfix: null,
        customConfig: ''
      }
    };

    // Load saved preferences
    this.preferences = this.loadPreferences();
  }

  /**
   * Get all preferences
   */
  getAll() {
    return { ...this.preferences };
  }

  /**
   * Get specific preference category
   */
  getCategory(category) {
    if (!this.preferences[category]) {
      console.warn(`Category "${category}" not found`);
      return null;
    }
    return { ...this.preferences[category] };
  }

  /**
   * Get specific preference value
   */
  get(path) {
    const keys = path.split('.');
    let value = this.preferences;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Set preference value
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.preferences;

    // Navigate to the parent object
    for (const key of keys) {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    // Set the value
    const oldValue = current[lastKey];
    current[lastKey] = value;

    // Persist and notify
    this.savePreferences();
    this.notifyChange(path, value, oldValue);

    return true;
  }

  /**
   * Update multiple preferences at once
   */
  update(updates) {
    const changes = [];

    Object.entries(updates).forEach(([path, value]) => {
      const oldValue = this.get(path);
      if (this.set(path, value)) {
        changes.push({ path, value, oldValue });
      }
    });

    return changes;
  }

  /**
   * Reset preference to default
   */
  reset(path) {
    const defaultValue = this.getDefaultValue(path);

    if (defaultValue !== undefined) {
      return this.set(path, defaultValue);
    }

    return false;
  }

  /**
   * Reset all preferences to defaults
   */
  resetAll() {
    this.preferences = JSON.parse(JSON.stringify(this.defaults));
    this.savePreferences();
    this.notifyChange('*', this.preferences, null);
    return true;
  }

  /**
   * Get default value for a preference
   */
  getDefaultValue(path) {
    const keys = path.split('.');
    let value = this.defaults;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Check if preference exists
   */
  has(path) {
    return this.get(path) !== undefined;
  }

  /**
   * Validate preference value
   */
  validate(path, value) {
    // Add validation rules as needed
    const validators = {
      'connection.preferredProtocol': (v) =>
        ['OpenVPN', 'WireGuard', 'IKEv2'].includes(v),
      'server.preferredServerType': (v) =>
        ['fastest', 'nearest', 'p2p', 'streaming'].includes(v),
      'security.threatLevel': (v) =>
        ['permissive', 'balanced', 'strict'].includes(v),
      'interface.theme': (v) =>
        ['light', 'dark', 'auto'].includes(v),
      'performance.mtu': (v) =>
        typeof v === 'number' && v >= 576 && v <= 1500,
      'performance.connectionTimeout': (v) =>
        typeof v === 'number' && v >= 5 && v <= 120
    };

    if (validators[path]) {
      return validators[path](value);
    }

    return true; // No validator means valid
  }

  /**
   * Export preferences as JSON
   */
  export() {
    return {
      version: '1.0.0',
      exportedAt: Date.now(),
      preferences: this.preferences
    };
  }

  /**
   * Import preferences from JSON
   */
  import(data) {
    try {
      if (data.version && data.preferences) {
        this.preferences = this.mergeWithDefaults(data.preferences);
        this.savePreferences();
        this.notifyChange('*', this.preferences, null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }

  /**
   * Get preferences diff from defaults
   */
  getDiff() {
    return this.getObjectDiff(this.defaults, this.preferences);
  }

  /**
   * Check if preferences are at defaults
   */
  isDefault() {
    return JSON.stringify(this.preferences) === JSON.stringify(this.defaults);
  }

  /**
   * Subscribe to preference changes
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this.changeCallbacks.push(callback);
    }
  }

  /**
   * Unsubscribe from preference changes
   */
  offChange(callback) {
    const index = this.changeCallbacks.indexOf(callback);
    if (index > -1) {
      this.changeCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify change callbacks
   */
  notifyChange(path, newValue, oldValue) {
    const event = {
      path,
      newValue,
      oldValue,
      timestamp: Date.now()
    };

    this.changeCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Preference change callback error:', error);
      }
    });
  }

  /**
   * Load preferences from storage
   */
  loadPreferences() {
    try {
      const stored = localStorage.getItem(this.storageKey);

      if (stored) {
        const parsed = JSON.parse(stored);
        return this.mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }

    return JSON.parse(JSON.stringify(this.defaults));
  }

  /**
   * Save preferences to storage
   */
  savePreferences() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
      return true;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return false;
    }
  }

  /**
   * Merge saved preferences with defaults
   * Ensures all default keys exist even if not in saved data
   */
  mergeWithDefaults(saved) {
    return this.deepMerge(JSON.parse(JSON.stringify(this.defaults)), saved);
  }

  /**
   * Deep merge two objects
   */
  deepMerge(target, source) {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }

  /**
   * Get diff between two objects
   */
  getObjectDiff(obj1, obj2, path = '') {
    const diff = {};

    const allKeys = new Set([
      ...Object.keys(obj1 || {}),
      ...Object.keys(obj2 || {})
    ]);

    allKeys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (this.isObject(val1) && this.isObject(val2)) {
        const nested = this.getObjectDiff(val1, val2, currentPath);
        if (Object.keys(nested).length > 0) {
          diff[key] = nested;
        }
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        diff[key] = { default: val1, current: val2 };
      }
    });

    return diff;
  }

  /**
   * Check if value is an object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Get preference summary for display
   */
  getSummary() {
    return {
      connection: {
        autoConnect: this.get('connection.autoConnect'),
        killSwitch: this.get('connection.killSwitch'),
        protocol: this.get('connection.preferredProtocol')
      },
      security: {
        threatLevel: this.get('security.threatLevel'),
        malwareProtection: this.get('security.malwareProtection'),
        multiHopVPN: this.get('security.multiHopVPN')
      },
      notifications: {
        securityAlerts: this.get('notifications.securityAlerts'),
        connectionStatus: this.get('notifications.connectionStatus')
      },
      privacy: {
        shareAnalytics: this.get('privacy.shareAnonymousAnalytics')
      }
    };
  }

  /**
   * Clear all stored preferences
   */
  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      this.preferences = JSON.parse(JSON.stringify(this.defaults));
      return true;
    } catch (error) {
      console.error('Failed to clear preferences:', error);
      return false;
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserPreferences;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.UserPreferences = UserPreferences;
}

/**
 * SFS PersonalVPN - Real-Time Security Leak Alerts
 * Monitors connection security and detects potential leaks
 * Version 1.0.0
 */

class SecurityAlertSystem {
  constructor(options = {}) {
    this.alertThreshold = options.alertThreshold || 3;
    this.checkInterval = options.checkInterval || 5000; // 5 seconds
    this.alertCallbacks = [];
    this.activeAlerts = new Map();
    this.alertHistory = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  /**
   * Start monitoring for security issues
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('Security monitoring already active');
      return;
    }

    this.isMonitoring = true;
    console.log('Security monitoring started');

    this.monitoringInterval = setInterval(() => {
      this.performSecurityCheck();
    }, this.checkInterval);

    // Perform initial check
    this.performSecurityCheck();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('Security monitoring stopped');
  }

  /**
   * Perform comprehensive security check
   */
  async performSecurityCheck() {
    const checks = [
      this.checkDNSLeak(),
      this.checkIPLeak(),
      this.checkWebRTCLeak(),
      this.checkConnectionEncryption(),
      this.checkKillSwitch()
    ];

    try {
      const results = await Promise.allSettled(checks);
      this.processCheckResults(results);
    } catch (error) {
      console.error('Security check failed:', error);
      this.triggerAlert({
        type: 'SYSTEM_ERROR',
        severity: 'medium',
        message: 'Security monitoring system encountered an error',
        timestamp: Date.now()
      });
    }
  }

  /**
   * Check for DNS leaks
   */
  async checkDNSLeak() {
    // Simulated DNS leak detection
    // In production, this would query DNS servers and verify routing
    const dnsServers = await this.getCurrentDNSServers();
    const expectedDNS = this.getExpectedVPNDNS();

    if (!this.compareDNSServers(dnsServers, expectedDNS)) {
      return {
        leak: true,
        type: 'DNS_LEAK',
        severity: 'high',
        details: {
          detected: dnsServers,
          expected: expectedDNS
        }
      };
    }

    return { leak: false, type: 'DNS_LEAK' };
  }

  /**
   * Check for IP leaks
   */
  async checkIPLeak() {
    // Simulated IP leak detection
    // In production, this would verify actual vs expected IP
    const currentIP = await this.detectCurrentIP();
    const vpnIP = this.getVPNServerIP();

    if (currentIP !== vpnIP) {
      return {
        leak: true,
        type: 'IP_LEAK',
        severity: 'critical',
        details: {
          realIP: currentIP,
          vpnIP: vpnIP
        }
      };
    }

    return { leak: false, type: 'IP_LEAK' };
  }

  /**
   * Check for WebRTC leaks
   */
  async checkWebRTCLeak() {
    // Check if WebRTC is exposing local IP addresses
    return new Promise((resolve) => {
      if (!window.RTCPeerConnection) {
        resolve({ leak: false, type: 'WEBRTC_LEAK' });
        return;
      }

      const pc = new RTCPeerConnection({ iceServers: [] });
      const leakedIPs = new Set();

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;

        const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
        const match = ipRegex.exec(ice.candidate.candidate);

        if (match && !match[0].startsWith('0.')) {
          leakedIPs.add(match[0]);
        }
      };

      pc.createDataChannel('');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch((err) => console.error('WebRTC check error:', err));

      setTimeout(() => {
        pc.close();

        if (leakedIPs.size > 0) {
          resolve({
            leak: true,
            type: 'WEBRTC_LEAK',
            severity: 'high',
            details: {
              leakedIPs: Array.from(leakedIPs)
            }
          });
        } else {
          resolve({ leak: false, type: 'WEBRTC_LEAK' });
        }
      }, 1000);
    });
  }

  /**
   * Check connection encryption status
   */
  async checkConnectionEncryption() {
    const encryptionStatus = await this.getEncryptionStatus();

    if (!encryptionStatus.active || encryptionStatus.strength < 256) {
      return {
        leak: true,
        type: 'WEAK_ENCRYPTION',
        severity: 'high',
        details: encryptionStatus
      };
    }

    return { leak: false, type: 'WEAK_ENCRYPTION' };
  }

  /**
   * Check kill switch functionality
   */
  async checkKillSwitch() {
    const killSwitchActive = await this.isKillSwitchActive();

    if (!killSwitchActive) {
      return {
        leak: true,
        type: 'KILLSWITCH_DISABLED',
        severity: 'medium',
        details: {
          message: 'Kill switch is not active - connection may leak if VPN drops'
        }
      };
    }

    return { leak: false, type: 'KILLSWITCH_DISABLED' };
  }

  /**
   * Process security check results
   */
  processCheckResults(results) {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.leak) {
        const alert = {
          ...result.value,
          id: this.generateAlertId(),
          timestamp: Date.now()
        };

        this.triggerAlert(alert);
      } else if (result.status === 'rejected') {
        console.error('Security check failed:', result.reason);
      }
    });
  }

  /**
   * Trigger a security alert
   */
  triggerAlert(alert) {
    // Add to active alerts
    this.activeAlerts.set(alert.id, alert);

    // Add to history
    this.alertHistory.unshift(alert);
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(0, 100);
    }

    // Notify all registered callbacks
    this.alertCallbacks.forEach((callback) => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });

    console.warn('Security Alert:', alert);
  }

  /**
   * Dismiss an alert
   */
  dismissAlert(alertId) {
    if (this.activeAlerts.has(alertId)) {
      this.activeAlerts.delete(alertId);
      return true;
    }
    return false;
  }

  /**
   * Register alert callback
   */
  onAlert(callback) {
    if (typeof callback === 'function') {
      this.alertCallbacks.push(callback);
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts() {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * Get alert history
   */
  getAlertHistory(limit = 10) {
    return this.alertHistory.slice(0, limit);
  }

  /**
   * Helper methods (would interface with actual VPN in production)
   */
  async getCurrentDNSServers() {
    // Placeholder - would query actual DNS configuration
    return ['8.8.8.8', '8.8.4.4'];
  }

  getExpectedVPNDNS() {
    // Placeholder - would get from VPN configuration
    return ['10.8.0.1', '10.8.0.2'];
  }

  compareDNSServers(current, expected) {
    // Simplified comparison
    return JSON.stringify(current.sort()) === JSON.stringify(expected.sort());
  }

  async detectCurrentIP() {
    // Placeholder - would query external IP detection service
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('IP detection failed:', error);
      return 'unknown';
    }
  }

  getVPNServerIP() {
    // Placeholder - would get from VPN configuration
    return '203.0.113.1';
  }

  async getEncryptionStatus() {
    // Placeholder - would query VPN client
    return {
      active: true,
      protocol: 'OpenVPN',
      cipher: 'AES-256-GCM',
      strength: 256
    };
  }

  async isKillSwitchActive() {
    // Placeholder - would check actual kill switch status
    return true;
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityAlertSystem;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.SecurityAlertSystem = SecurityAlertSystem;
}

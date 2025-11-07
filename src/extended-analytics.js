/**
 * SFS PersonalVPN - Extended Analytics System
 * Tracks connection metrics, bandwidth usage, and performance
 * Version 1.0.0
 */

class ExtendedAnalytics {
  constructor(options = {}) {
    this.updateInterval = options.updateInterval || 1000; // 1 second
    this.historyLimit = options.historyLimit || 3600; // 1 hour of data
    this.storageKey = options.storageKey || 'sfs_vpn_analytics';

    this.isTracking = false;
    this.trackingInterval = null;

    // Analytics data
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: null,
      endTime: null,
      totalDuration: 0,
      bytesTransferred: {
        upload: 0,
        download: 0,
        total: 0
      },
      connectionQuality: [],
      latency: [],
      serverSwitches: 0,
      disconnections: 0
    };

    this.historicalData = this.loadHistoricalData();
    this.realtimeMetrics = {
      currentSpeed: { upload: 0, download: 0 },
      latency: 0,
      packetLoss: 0,
      jitter: 0,
      connectionStrength: 100
    };

    this.listeners = [];
  }

  /**
   * Start tracking analytics
   */
  startTracking() {
    if (this.isTracking) {
      console.warn('Analytics tracking already active');
      return;
    }

    this.isTracking = true;
    this.currentSession.startTime = Date.now();
    console.log('Analytics tracking started');

    this.trackingInterval = setInterval(() => {
      this.collectMetrics();
    }, this.updateInterval);

    // Initial collection
    this.collectMetrics();
  }

  /**
   * Stop tracking and save session
   */
  stopTracking() {
    if (!this.isTracking) return;

    this.isTracking = false;
    this.currentSession.endTime = Date.now();
    this.currentSession.totalDuration =
      this.currentSession.endTime - this.currentSession.startTime;

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    this.saveSession();
    console.log('Analytics tracking stopped');
  }

  /**
   * Collect real-time metrics
   */
  async collectMetrics() {
    try {
      // Collect various metrics
      const metrics = {
        timestamp: Date.now(),
        speed: await this.measureSpeed(),
        latency: await this.measureLatency(),
        packetLoss: await this.measurePacketLoss(),
        jitter: await this.measureJitter(),
        connectionStrength: await this.calculateConnectionStrength()
      };

      // Update realtime metrics
      this.realtimeMetrics = {
        currentSpeed: metrics.speed,
        latency: metrics.latency,
        packetLoss: metrics.packetLoss,
        jitter: metrics.jitter,
        connectionStrength: metrics.connectionStrength
      };

      // Add to session data
      this.currentSession.latency.push({
        timestamp: metrics.timestamp,
        value: metrics.latency
      });

      this.currentSession.connectionQuality.push({
        timestamp: metrics.timestamp,
        quality: metrics.connectionStrength
      });

      // Update bandwidth
      this.currentSession.bytesTransferred.upload += metrics.speed.upload;
      this.currentSession.bytesTransferred.download += metrics.speed.download;
      this.currentSession.bytesTransferred.total =
        this.currentSession.bytesTransferred.upload +
        this.currentSession.bytesTransferred.download;

      // Trim history if needed
      this.trimSessionHistory();

      // Notify listeners
      this.notifyListeners(this.realtimeMetrics);
    } catch (error) {
      console.error('Metrics collection failed:', error);
    }
  }

  /**
   * Measure upload/download speed
   */
  async measureSpeed() {
    // Simulated speed measurement
    // In production, this would measure actual network throughput
    const baseUpload = Math.random() * 5000000; // Up to 5 MB/s
    const baseDownload = Math.random() * 10000000; // Up to 10 MB/s

    return {
      upload: Math.round(baseUpload),
      download: Math.round(baseDownload)
    };
  }

  /**
   * Measure latency (ping)
   */
  async measureLatency() {
    // Simulated latency measurement
    // In production, this would ping the VPN server
    const baseLatency = 20 + Math.random() * 50; // 20-70ms
    const jitter = (Math.random() - 0.5) * 10; // +/- 5ms jitter

    return Math.max(1, Math.round(baseLatency + jitter));
  }

  /**
   * Measure packet loss
   */
  async measurePacketLoss() {
    // Simulated packet loss measurement
    // In production, this would analyze actual packet transmission
    return Math.random() * 2; // 0-2% packet loss
  }

  /**
   * Measure jitter
   */
  async measureJitter() {
    // Simulated jitter measurement
    const recentLatency = this.currentSession.latency.slice(-10);

    if (recentLatency.length < 2) return 0;

    const latencyValues = recentLatency.map(l => l.value);
    const avg = latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length;
    const variance = latencyValues.reduce((sum, val) =>
      sum + Math.pow(val - avg, 2), 0) / latencyValues.length;

    return Math.round(Math.sqrt(variance));
  }

  /**
   * Calculate overall connection strength
   */
  async calculateConnectionStrength() {
    const latency = this.realtimeMetrics.latency;
    const packetLoss = this.realtimeMetrics.packetLoss;
    const jitter = this.realtimeMetrics.jitter;

    // Calculate strength based on metrics
    let strength = 100;

    // Penalize high latency
    if (latency > 100) strength -= 20;
    else if (latency > 50) strength -= 10;

    // Penalize packet loss
    strength -= packetLoss * 10;

    // Penalize jitter
    if (jitter > 20) strength -= 15;
    else if (jitter > 10) strength -= 5;

    return Math.max(0, Math.min(100, strength));
  }

  /**
   * Trim session history to limit
   */
  trimSessionHistory() {
    if (this.currentSession.latency.length > this.historyLimit) {
      this.currentSession.latency =
        this.currentSession.latency.slice(-this.historyLimit);
    }

    if (this.currentSession.connectionQuality.length > this.historyLimit) {
      this.currentSession.connectionQuality =
        this.currentSession.connectionQuality.slice(-this.historyLimit);
    }
  }

  /**
   * Get current session statistics
   */
  getSessionStats() {
    const duration = this.isTracking
      ? Date.now() - this.currentSession.startTime
      : this.currentSession.totalDuration;

    return {
      ...this.currentSession,
      duration,
      averageLatency: this.calculateAverageLatency(),
      averageQuality: this.calculateAverageQuality(),
      peakSpeed: this.calculatePeakSpeed()
    };
  }

  /**
   * Get real-time metrics
   */
  getRealTimeMetrics() {
    return { ...this.realtimeMetrics };
  }

  /**
   * Get bandwidth usage summary
   */
  getBandwidthSummary() {
    return {
      current: this.currentSession.bytesTransferred,
      formatted: {
        upload: this.formatBytes(this.currentSession.bytesTransferred.upload),
        download: this.formatBytes(this.currentSession.bytesTransferred.download),
        total: this.formatBytes(this.currentSession.bytesTransferred.total)
      }
    };
  }

  /**
   * Get historical data
   */
  getHistoricalData(days = 7) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.historicalData.filter(session =>
      session.startTime >= cutoff
    );
  }

  /**
   * Get aggregate statistics
   */
  getAggregateStats(days = 7) {
    const sessions = this.getHistoricalData(days);

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        totalBandwidth: 0,
        averageLatency: 0,
        averageQuality: 0
      };
    }

    const totalDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0);
    const totalBandwidth = sessions.reduce((sum, s) =>
      sum + s.bytesTransferred.total, 0);

    return {
      totalSessions: sessions.length,
      totalDuration,
      totalBandwidth,
      averageLatency: this.calculateAverageLatency(),
      averageQuality: this.calculateAverageQuality(),
      formatted: {
        duration: this.formatDuration(totalDuration),
        bandwidth: this.formatBytes(totalBandwidth)
      }
    };
  }

  /**
   * Calculate average latency
   */
  calculateAverageLatency() {
    if (this.currentSession.latency.length === 0) return 0;

    const sum = this.currentSession.latency.reduce((s, l) => s + l.value, 0);
    return Math.round(sum / this.currentSession.latency.length);
  }

  /**
   * Calculate average connection quality
   */
  calculateAverageQuality() {
    if (this.currentSession.connectionQuality.length === 0) return 0;

    const sum = this.currentSession.connectionQuality.reduce((s, q) =>
      s + q.quality, 0);
    return Math.round(sum / this.currentSession.connectionQuality.length);
  }

  /**
   * Calculate peak speed
   */
  calculatePeakSpeed() {
    // This would track peak speeds during session
    return {
      upload: Math.round(this.realtimeMetrics.currentSpeed.upload * 1.5),
      download: Math.round(this.realtimeMetrics.currentSpeed.download * 1.5)
    };
  }

  /**
   * Record server switch
   */
  recordServerSwitch() {
    this.currentSession.serverSwitches++;
  }

  /**
   * Record disconnection
   */
  recordDisconnection() {
    this.currentSession.disconnections++;
  }

  /**
   * Subscribe to metrics updates
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  /**
   * Notify all listeners
   */
  notifyListeners(metrics) {
    this.listeners.forEach(callback => {
      try {
        callback(metrics);
      } catch (error) {
        console.error('Listener callback error:', error);
      }
    });
  }

  /**
   * Save current session to historical data
   */
  saveSession() {
    this.historicalData.unshift(this.currentSession);

    // Keep only recent sessions
    if (this.historicalData.length > 1000) {
      this.historicalData = this.historicalData.slice(0, 1000);
    }

    this.persistHistoricalData();
  }

  /**
   * Load historical data from storage
   */
  loadHistoricalData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load historical data:', error);
      return [];
    }
  }

  /**
   * Persist historical data to storage
   */
  persistHistoricalData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.historicalData));
    } catch (error) {
      console.error('Failed to persist historical data:', error);
    }
  }

  /**
   * Helper: Format bytes
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
  }

  /**
   * Helper: Format duration
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Helper: Generate session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export analytics data
   */
  exportData() {
    return {
      currentSession: this.getSessionStats(),
      historicalData: this.historicalData,
      exportedAt: Date.now()
    };
  }

  /**
   * Clear historical data
   */
  clearHistory() {
    this.historicalData = [];
    this.persistHistoricalData();
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExtendedAnalytics;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.ExtendedAnalytics = ExtendedAnalytics;
}

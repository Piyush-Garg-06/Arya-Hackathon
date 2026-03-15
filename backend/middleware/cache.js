/**
 * Simple In-Memory Cache Middleware
 * Caches repeated AI query responses to reduce API calls and latency.
 */

class SimpleCache {
  constructor(ttlSeconds = 300) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000; // Convert to milliseconds

    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Generate cache key from request
   */
  generateKey(req) {
    const body = JSON.stringify(req.body || {});
    const path = req.originalUrl;
    const userId = req.user?.id || 'anonymous';
    return `${userId}:${path}:${body}`;
  }

  /**
   * Get cached response
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache entry
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
    });
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  stats() {
    return {
      size: this.cache.size,
      ttlSeconds: this.ttl / 1000,
    };
  }

  /**
   * Destroy cache and cleanup interval
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Create singleton cache instance (5 minute TTL)
const cacheInstance = new SimpleCache(300);

/**
 * Cache middleware factory
 * @param {number} ttlSeconds - Cache TTL in seconds (default: 300)
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttlSeconds = 300) => {
  return (req, res, next) => {
    // Only cache GET requests and specific POST endpoints
    const key = cacheInstance.generateKey(req);
    const cachedResponse = cacheInstance.get(key);

    if (cachedResponse) {
      return res.status(200).json({
        ...cachedResponse,
        cached: true,
      });
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      // Only cache successful responses
      if (data && data.success) {
        cacheInstance.set(key, data);
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = {
  cacheMiddleware,
  cache: cacheInstance,
};

// Simple in-memory cache manager for Gemini jobs
class CacheManager {
  constructor() {
    this.cache = {};
    this.ttl = 60 * 60 * 1000; // 1 hour cache TTL in milliseconds
  }

  set(key, value) {
    this.cache[key] = {
      data: value,
      timestamp: Date.now(),
    };
  }

  get(key) {
    const cached = this.cache[key];
    
    if (!cached) {
      return null;
    }

    // Check if cache has expired
    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      delete this.cache[key];
      return null;
    }

    return cached.data;
  }

  clear(key) {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }

  has(key) {
    return this.get(key) !== null;
  }
}

export const cacheManager = new CacheManager();

import Redis from 'ioredis';

let redisClient: Redis | null = null;
let redisAvailable = false;

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true, // Don't connect immediately
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    redisClient.on('error', (err) => {
      // Only log error if it's not a connection refused error in development
      if (process.env.NODE_ENV === 'production' || !err.message.includes('ECONNREFUSED')) {
        console.error('Redis Client Error:', err);
      }
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
      redisAvailable = true;
    });

    // Try to connect, but don't fail if Redis is not available
    redisClient.connect().catch(() => {
      // Silently fail - Redis is optional
      redisAvailable = false;
    });
  }

  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed');
  }
};

// Check if Redis is available
export const isRedisAvailable = (): boolean => {
  return redisAvailable;
};

// Cache helper functions
export const cacheGet = async (key: string): Promise<string | null> => {
  if (!redisAvailable) return null;
  
  try {
    const client = getRedisClient();
    return await client.get(key);
  } catch (error) {
    // Silently fail in development
    if (process.env.NODE_ENV === 'production') {
      console.error('Cache get error:', error);
    }
    return null;
  }
};

export const cacheSet = async (key: string, value: string, ttl: number = 300): Promise<void> => {
  if (!redisAvailable) return;
  
  try {
    const client = getRedisClient();
    await client.setex(key, ttl, value);
  } catch (error) {
    // Silently fail in development
    if (process.env.NODE_ENV === 'production') {
      console.error('Cache set error:', error);
    }
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  if (!redisAvailable) return;
  
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    // Silently fail in development
    if (process.env.NODE_ENV === 'production') {
      console.error('Cache delete error:', error);
    }
  }
};

export const cacheDeletePattern = async (pattern: string): Promise<void> => {
  if (!redisAvailable) return;
  
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    // Silently fail in development
    if (process.env.NODE_ENV === 'production') {
      console.error('Cache delete pattern error:', error);
    }
  }
};

export default getRedisClient;


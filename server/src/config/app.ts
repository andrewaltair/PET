export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptRounds: number;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
  authRateLimitMax: number;
}

/**
 * ✅ SECURITY FIX: Validates JWT secret strength
 * Prevents weak/default secrets in production
 */
function validateJWTSecret(secret: string | undefined, secretName: string): string {
  if (!secret) {
    throw new Error(`${secretName} environment variable is required!`);
  }

  // Check for default/weak secrets
  const weakSecrets = [
    'your-super-secret-jwt-key',
    'change-in-production',
    'default',
    'secret',
    'password',
    '123456',
    'test',
  ];

  const lowerSecret = secret.toLowerCase();
  for (const weak of weakSecrets) {
    // Only fail if the entire secret matches, not if it's just contained
    if (lowerSecret === weak) {
      throw new Error(
        `${secretName} contains weak/default value "${weak}"! Please use a strong random secret.`
      );
    }
  }

  // Minimum length check
  if (secret.length < 32) {
    throw new Error(`${secretName} must be at least 32 characters long! Current length: ${secret.length}`);
  }

  return secret;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // ✅ SECURITY FIX: Validate JWT secrets
  jwtSecret: validateJWTSecret(process.env.JWT_SECRET, 'JWT_SECRET'),
  jwtRefreshSecret: validateJWTSecret(process.env.JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET'),
  
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5000',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '100'), // Higher limit for auth in development
};

// Log configuration on startup (without exposing secrets!)
console.log('✅ Configuration loaded:', {
  port: appConfig.port,
  nodeEnv: appConfig.nodeEnv,
  jwtSecretLength: appConfig.jwtSecret.length,
  jwtRefreshSecretLength: appConfig.jwtRefreshSecret.length,
  corsOrigin: appConfig.corsOrigin,
});


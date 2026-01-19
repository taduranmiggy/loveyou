/**
 * Application Configuration
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000')
  },
  auth: {
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000'), // 1 hour
    storageKeys: {
      user: 'loveyou_user',
      token: 'loveyou_token'
    }
  },
  features: {
    demoMode: import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',
    debugLogs: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true'
  },
  firebase: {
    enabled: import.meta.env.VITE_FIREBASE_ENABLED === 'true'
  }
};

export default config;

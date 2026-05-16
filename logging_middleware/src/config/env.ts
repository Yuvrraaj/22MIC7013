export const cfg = {
  baseUrl: process.env.LOG_BASE_URL || 'http://4.224.186.213/evaluation-service',
  email: process.env.LOG_EMAIL || '',
  name: process.env.LOG_NAME || '',
  rollNo: process.env.LOG_ROLL_NO || '',
  accessCode: process.env.LOG_ACCESS_CODE || '',
  clientID: process.env.LOG_CLIENT_ID || '',
  clientSecret: process.env.LOG_CLIENT_SECRET || '',
  timeout: parseInt(process.env.LOG_TIMEOUT || '5000', 10),
  maxRetries: parseInt(process.env.LOG_MAX_RETRIES || '3', 10),
};

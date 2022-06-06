export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  production: (process.env.PRODUCTION || 'false') == 'true',
  appUrl: process.env.APP_URL,
  assets: process.env.APP_ASSETS,
  apiPrefix: process.env.API_PREFIX,
  clientAppUrl: process.env.CLIENT_APP_URL,
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || '',
      expirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '60m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET || '',
      expirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '120m',
    },
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    fromName: process.env.MAIL_FROM_NAME,
    fromEmail: process.env.MAIL_FROM_EMAIL,
  },
  auth: {
    fb: {
      id: parseInt(process.env.AUTH_FB_ID, 10),
      secret: process.env.AUTH_FB_SECRET,
    },
  },
});

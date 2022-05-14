export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  production: (process.env.PRODUCTION || 'false') == 'true',
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET,
  apiPrefix: process.env.API_PREFIX,
  clientAppUrl: process.env.CLIENT_APP_URL,
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    fromName: process.env.MAIL_FROM_NAME,
    fromEmail: process.env.MAIL_FROM_EMAIL,
  },
});

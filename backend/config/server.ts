export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'https://website-ban-xe-dien.onrender.com'),
  proxy: true, // Required for Render/Heroku SSL termination
});

// @ts-ignore
export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['*'], // Allow ALL origins temporarily to fix CORS block immediately
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '1mb',
      formLimit: '1mb',
      textLimit: '1mb',
    },
  },
  {
    name: 'strapi::session',
    config: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      key: 'strapi.sid',
      secure: false, // Set to false to fix "Cannot send secure cookie over unencrypted connection" on Render
    },
  },
  'strapi::favicon',
  'strapi::public',
];

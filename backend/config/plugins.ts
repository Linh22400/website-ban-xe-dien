export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                // FORCE BREVO CONFIGURATION FOR RENDER (Port 587 STARTTLS)
                host: 'smtp-relay.brevo.com',
                port: 587,
                secure: false, // Must be FALSE for Port 587
                auth: {
                    user: 'a13a6b001@smtp-brevo.com',
                    pass: env('SMTP_PASSWORD'), 
                },
                tls: {
                    ciphers: 'SSLv3', // Compatibility mode
                    rejectUnauthorized: false, 
                },
                debug: true,
                logger: true,
                connectionTimeout: 20000,
            },
            settings: {
                defaultFrom: env('SMTP_FROM', 'no-reply@example.com'),
                defaultReplyTo: env('SMTP_REPLY_TO', 'no-reply@example.com'),
            },
        },
    },
    upload: {
        config: {
            provider: 'cloudinary',
            providerOptions: {
                cloud_name: env('CLOUDINARY_NAME'),
                api_key: env('CLOUDINARY_KEY'),
                api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
});

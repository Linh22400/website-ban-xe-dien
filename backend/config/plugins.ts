export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                // FORCE BREVO CONFIGURATION FOR DEBUGGING
                host: 'smtp-relay.brevo.com',
                port: 465,
                secure: true, // SSL for 465
                auth: {
                    user: 'a13a6b001@smtp-brevo.com', // Force correct user
                    pass: env('SMTP_PASSWORD'), 
                },
                tls: {
                    rejectUnauthorized: false, // Bypass certificate issues if any
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

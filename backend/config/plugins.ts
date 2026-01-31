export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                // Use Brevo (formerly Sendinblue) SMTP
                host: 'smtp-relay.brevo.com',
                port: 587,
                secure: false,
                auth: {
                    user: env('SMTP_USERNAME'), // Your Brevo login email
                    pass: env('SMTP_PASSWORD'), // Your Brevo SMTP Master Password
                },
                tls: {
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

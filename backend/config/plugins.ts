export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                // SWITCH TO GMAIL SMTP (Best for @gmail.com senders)
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // SSL for Gmail
                auth: {
                    user: env('SMTP_USERNAME'), // Your Gmail address
                    pass: env('SMTP_PASSWORD'), // Your Gmail App Password
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

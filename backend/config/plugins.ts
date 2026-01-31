export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // Must be false for 587
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                tls: {
                    rejectUnauthorized: false, // Help with self-signed certs issues
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

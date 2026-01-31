export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                // Use 'service: Gmail' for best compatibility with Gmail
                service: 'Gmail',
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                tls: {
                    rejectUnauthorized: env.bool('SMTP_REJECT_UNAUTHORIZED', false), // Allow self-signed certs if needed
                },
                debug: env.bool('SMTP_DEBUG', true),
                logger: env.bool('SMTP_DEBUG', true),
                connectionTimeout: 60000, // 60 seconds
                greetingTimeout: 30000,
                socketTimeout: 60000,
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

export default ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // Use STARTTLS
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
                // CONNECTION SETTINGS
                connectionTimeout: 20000, // 20s
                socketTimeout: 20000,
                // FORCE IPv4 (Fix for Render/Docker ETIMEDOUT)
                localAddress: '0.0.0.0', 
                
                debug: true,
                logger: true,
                tls: {
                    rejectUnauthorized: false,
                },
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

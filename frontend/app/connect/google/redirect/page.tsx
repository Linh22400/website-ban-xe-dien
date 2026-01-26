"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function GoogleRedirectPage() {
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { socialLogin } = useAuth();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const accessToken = searchParams.get('access_token');

            if (!accessToken) {
                setError('Không tìm thấy token xác thực từ Google.');
                return;
            }

            try {
                // Call Strapi callback to exchange provider token for Strapi JWT
                const res = await fetch(`${STRAPI_URL}/api/auth/google/callback?access_token=${accessToken}`);
                
                if (!res.ok) {
                    throw new Error('Xác thực với hệ thống thất bại');
                }

                const data = await res.json();

                if (data.jwt && data.user) {
                    socialLogin(data.jwt, data.user);
                    router.push('/'); // Redirect to home or previous page
                } else {
                    throw new Error('Dữ liệu xác thực không hợp lệ');
                }
            } catch (err) {
                console.error('Google Auth Error:', err);
                setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
                // Redirect back to login after delay
                setTimeout(() => router.push('/login'), 3000);
            }
        };

        handleGoogleCallback();
    }, [searchParams, socialLogin, router]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <div className="text-red-500 font-bold text-xl mb-2">Đã xảy ra lỗi</div>
                <p className="text-muted-foreground mb-4">{error}</p>
                <p className="text-sm text-gray-500">Đang chuyển hướng về trang đăng nhập...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold text-foreground">Đang xác thực với Google...</h2>
            <p className="text-muted-foreground mt-2">Vui lòng đợi trong giây lát.</p>
        </div>
    );
}

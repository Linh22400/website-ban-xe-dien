import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent caching of this route

export async function GET(request: Request) {
    // 1. Kiểm tra xác thực (Optional: thêm secret key nếu cần bảo mật tuyệt đối)
    // Trong trường hợp này, chúng ta cho phép public để Cron Job có thể gọi dễ dàng.
    // Nếu muốn bảo mật: const authHeader = request.headers.get('authorization');

    try {
        const backendUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://website-ban-xe-dien.onrender.com';
        
        // 2. Gọi API nhẹ nhất của Backend (ví dụ: lấy danh sách khuyến mãi hoặc thông tin chung)
        // Thêm tham số ngẫu nhiên để tránh cache phía CDN/Server
        const targetUrl = `${backendUrl}/api/promotions?pagination[pageSize]=1&t=${Date.now()}`;
        
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                // Giả lập User-Agent hợp lệ để tránh bị chặn bởi Render
                'User-Agent': 'NextJS-KeepAlive-Worker/1.0',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
            next: { revalidate: 0 } // Đảm bảo Next.js không cache request này
        });

        if (!response.ok) {
            console.error(`Keep-alive failed with status: ${response.status}`);
            return NextResponse.json({ status: 'error', code: response.status }, { status: 502 });
        }

        const data = await response.json();

        // 3. Trả về kết quả thành công
        return NextResponse.json({
            status: 'alive',
            timestamp: new Date().toISOString(),
            backend_url: backendUrl,
            message: 'Backend is awake and responding.'
        });

    } catch (error) {
        console.error('Keep-alive execution error:', error);
        return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
    }
}

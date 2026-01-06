/**
 * Sample data để test - Import thủ công vào Supabase
 * Copy paste vào Strapi Admin UI: Content Manager → Create Entry
 */

// 1. CATEGORIES (Danh mục xe)
const categories = [
    {
        Name: "Xe Sedan",
        Slug: "xe-sedan",
        Description: "Dòng xe sedan sang trọng, tiện nghi",
        Order: 1
    },
    {
        Name: "Xe SUV",
        Slug: "xe-suv",
        Description: "Dòng xe SUV đa dụng, rộng rãi",
        Order: 2
    },
    {
        Name: "Xe Hatchback",
        Slug: "xe-hatchback",
        Description: "Dòng xe hatchback nhỏ gọn, tiết kiệm",
        Order: 3
    }
];

// 2. CAR MODELS (Mẫu xe)
const carModels = [
    {
        Name: "VinFast VF e34",
        Slug: "vinfast-vf-e34",
        Price: 590000000,
        OriginalPrice: 650000000,
        Description: "SUV điện cỡ B thông minh, hiện đại",
        BatteryCapacity: "42 kWh",
        Range: "285 km",
        ChargingTime: "7 giờ (sạc thường)",
        TopSpeed: "140 km/h",
        Acceleration: "9.5s (0-100km/h)",
        Motor: "110 kW",
        Seats: 5,
        Featured: true,
        InStock: true
    },
    {
        Name: "VinFast VF 8",
        Slug: "vinfast-vf-8",
        Price: 1050000000,
        OriginalPrice: 1150000000,
        Description: "SUV điện cỡ D cao cấp, sang trọng",
        BatteryCapacity: "87.7 kWh",
        Range: "447 km",
        ChargingTime: "10 giờ (sạc thường)",
        TopSpeed: "200 km/h",
        Acceleration: "5.5s (0-100km/h)",
        Motor: "300 kW",
        Seats: 5,
        Featured: true,
        InStock: true
    },
    {
        Name: "VinFast VF 9",
        Slug: "vinfast-vf-9",
        Price: 1490000000,
        OriginalPrice: 1590000000,
        Description: "SUV điện 7 chỗ hạng sang, đẳng cấp",
        BatteryCapacity: "123 kWh",
        Range: "594 km",
        ChargingTime: "12 giờ (sạc thường)",
        TopSpeed: "200 km/h",
        Acceleration: "6.5s (0-100km/h)",
        Motor: "300 kW",
        Seats: 7,
        Featured: true,
        InStock: true
    }
];

// 3. SHOWROOMS (Showroom)
const showrooms = [
    {
        Name: "VinFast Hà Nội",
        Address: "123 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội",
        Phone: "0243 123 4567",
        Email: "hanoi@vinfast.vn",
        OpeningHours: "8:00 - 18:00 (Thứ 2 - Chủ Nhật)",
        Latitude: 21.0285,
        Longitude: 105.8542,
        Featured: true
    },
    {
        Name: "VinFast TP. Hồ Chí Minh",
        Address: "456 Võ Văn Kiệt, Quận 1, TP. HCM",
        Phone: "0282 987 6543",
        Email: "hcm@vinfast.vn",
        OpeningHours: "8:00 - 18:00 (Thứ 2 - Chủ Nhật)",
        Latitude: 10.7769,
        Longitude: 106.7009,
        Featured: true
    },
    {
        Name: "VinFast Đà Nẵng",
        Address: "789 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng",
        Phone: "0236 555 1234",
        Email: "danang@vinfast.vn",
        OpeningHours: "8:00 - 18:00 (Thứ 2 - Chủ Nhật)",
        Latitude: 16.0471,
        Longitude: 108.2068,
        Featured: false
    }
];

// 4. PROMOTIONS (Khuyến mãi)
const promotions = [
    {
        Title: "Giảm 60 triệu cho VF e34",
        Description: "Ưu đãi đặc biệt trong tháng 1/2026",
        DiscountAmount: 60000000,
        DiscountPercentage: null,
        StartDate: "2026-01-01",
        EndDate: "2026-01-31",
        Active: true
    },
    {
        Title: "Tặng gói phụ kiện 20 triệu",
        Description: "Áp dụng cho VF 8 và VF 9",
        DiscountAmount: 20000000,
        DiscountPercentage: null,
        StartDate: "2026-01-01",
        EndDate: "2026-02-28",
        Active: true
    }
];

// 5. FAQS (Câu hỏi thường gặp)
const faqs = [
    {
        Question: "Thời gian sạc pin xe điện mất bao lâu?",
        Answer: "Thời gian sạc phụ thuộc vào dung lượng pin và loại sạc. Sạc thường (AC) mất 7-12 giờ, sạc nhanh (DC) chỉ 30-45 phút đạt 80%.",
        Category: "battery",
        Order: 1
    },
    {
        Question: "Chi phí vận hành xe điện có tiết kiệm không?",
        Answer: "Xe điện tiết kiệm 70-80% chi phí nhiên liệu so với xe xăng. Chi phí sạc điện chỉ khoảng 1.500-2.000đ/kWh.",
        Category: "cost",
        Order: 2
    },
    {
        Question: "Bảo hành pin xe điện như thế nào?",
        Answer: "VinFast bảo hành pin 10 năm hoặc 200.000 km (tùy điều kiện đến trước), dung lượng pin đảm bảo trên 70%.",
        Category: "warranty",
        Order: 3
    }
];

// 6. TESTIMONIALS (Đánh giá khách hàng)
const testimonials = [
    {
        CustomerName: "Nguyễn Văn A",
        CustomerAvatar: "https://i.pravatar.cc/150?img=1",
        Content: "Xe rất êm, tiết kiệm nhiên liệu. Công nghệ hiện đại, lái rất thoải mái!",
        Rating: 5,
        CarModel: "VF e34",
        Featured: true
    },
    {
        CustomerName: "Trần Thị B",
        CustomerAvatar: "https://i.pravatar.cc/150?img=2",
        Content: "VF 8 đẹp, sang trọng và tiện nghi. Rất hài lòng với quyết định mua xe điện.",
        Rating: 5,
        CarModel: "VF 8",
        Featured: true
    },
    {
        CustomerName: "Lê Văn C",
        CustomerAvatar: "https://i.pravatar.cc/150?img=3",
        Content: "Xe 7 chỗ rộng rãi, phù hợp gia đình. Dịch vụ hậu mãi tốt.",
        Rating: 4,
        CarModel: "VF 9",
        Featured: false
    }
];

// Export để có thể sử dụng
console.log('=== SAMPLE DATA ===\n');
console.log('Copy dữ liệu dưới đây vào Strapi Admin UI để thêm content:\n');
console.log('1. Categories:', JSON.stringify(categories, null, 2));
console.log('\n2. Car Models:', JSON.stringify(carModels, null, 2));
console.log('\n3. Showrooms:', JSON.stringify(showrooms, null, 2));
console.log('\n4. Promotions:', JSON.stringify(promotions, null, 2));
console.log('\n5. FAQs:', JSON.stringify(faqs, null, 2));
console.log('\n6. Testimonials:', JSON.stringify(testimonials, null, 2));

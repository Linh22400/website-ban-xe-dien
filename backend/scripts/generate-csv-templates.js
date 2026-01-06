/**
 * Generate CSV files cho từng content type - TAILG Electric Vehicles
 * Chạy: node scripts/generate-csv-templates.js
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'exports', 'csv');

// Tạo thư mục
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: Convert array of objects to CSV
function arrayToCSV(data, filename) {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvHeader = headers.join(',');
    
    const csvRows = data.map(row => {
        return headers.map(header => {
            let value = row[header];
            
            // Handle null/undefined
            if (value === null || value === undefined) return '';
            
            // Convert to string
            value = String(value);
            
            // Escape quotes and wrap in quotes if needed
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            
            return value;
        }).join(',');
    });
    
    const csv = [csvHeader, ...csvRows].join('\n');
    
    // Add BOM for Excel UTF-8 support
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, '\ufeff' + csv, 'utf8');
    
    console.log(`✅ Created: ${filename} (${data.length} rows)`);
}

// ==================== TAILG DATA ====================

// 1. CATEGORIES (Danh mục xe TAILG)
const categories = [
    { Name: 'Xe Máy Điện', Slug: 'xe-may-dien', Description: 'Dòng xe máy điện TAILG - Mạnh mẽ, tiết kiệm, thân thiện môi trường', Order: 1 },
    { Name: 'Xe Đạp Điện', Slug: 'xe-dap-dien', Description: 'Dòng xe đạp điện TAILG - Nhỏ gọn, tiện lợi, phù hợp đô thị', Order: 2 },
    { Name: 'Xe Chở Hàng', Slug: 'xe-cho-hang', Description: 'Xe điện chuyên dụng chở hàng - Bền bỉ, chịu tải cao', Order: 3 },
    { Name: 'Xe Gấp Gọn', Slug: 'xe-gap-gon', Description: 'Xe điện mini gấp được - Tiện lợi cho dân văn phòng', Order: 4 }
];

// 2. CAR MODELS (Mẫu xe TAILG)
const carModels = [
    {
        Name: 'TAILG M3 Pro',
        Slug: 'tailg-m3-pro',
        Brand: 'TAILG',
        Type: 'motorcycle',
        Price: 15990000,
        OriginalPrice: 17990000,
        Description: 'Xe máy điện TAILG M3 Pro - Dòng sản phẩm cao cấp với thiết kế thể thao, công nghệ pin tiên tiến. Phù hợp di chuyển đường dài trong thành phố.',
        BatteryCapacity: '60V 20Ah Lithium',
        Range: '80 km',
        ChargingTime: '4-6 giờ',
        TopSpeed: '50 km/h',
        Acceleration: '',
        Motor: '1000W',
        Seats: '',
        Featured: true,
        InStock: true,
        Sold: 156
    },
    {
        Name: 'TAILG Thunder X1',
        Slug: 'tailg-thunder-x1',
        Brand: 'TAILG',
        Type: 'motorcycle',
        Price: 12990000,
        OriginalPrice: 14990000,
        Description: 'Xe máy điện phổ thông, hiệu suất cao. Tiết kiệm năng lượng, phù hợp sử dụng hàng ngày.',
        BatteryCapacity: '48V 20Ah',
        Range: '65 km',
        ChargingTime: '6-8 giờ',
        TopSpeed: '45 km/h',
        Acceleration: '',
        Motor: '800W',
        Seats: '',
        Featured: false,
        InStock: true,
        Sold: 284
    },
    {
        Name: 'TAILG City Rider',
        Slug: 'tailg-city-rider',
        Brand: 'TAILG',
        Type: 'motorcycle',
        Price: 11490000,
        OriginalPrice: 12990000,
        Description: 'Xe máy điện cho phụ nữ và sinh viên. Nhỏ gọn, dễ điều khiển, tiện lợi trong đô thị.',
        BatteryCapacity: '48V 15Ah',
        Range: '55 km',
        ChargingTime: '5-7 giờ',
        TopSpeed: '40 km/h',
        Acceleration: '',
        Motor: '600W',
        Seats: '',
        Featured: true,
        InStock: true,
        Sold: 198
    },
    {
        Name: 'TAILG Eco S2',
        Slug: 'tailg-eco-s2',
        Brand: 'TAILG',
        Type: 'motorcycle',
        Price: 9990000,
        OriginalPrice: 11490000,
        Description: 'Xe máy điện giá rẻ, phù hợp học sinh sinh viên. Tiết kiệm chi phí, dễ bảo dưỡng.',
        BatteryCapacity: '48V 12Ah',
        Range: '50 km',
        ChargingTime: '6-8 giờ',
        TopSpeed: '35 km/h',
        Acceleration: '',
        Motor: '500W',
        Seats: '',
        Featured: false,
        InStock: true,
        Sold: 342
    },
    {
        Name: 'TAILG Cargo Pro',
        Slug: 'tailg-cargo-pro',
        Brand: 'TAILG',
        Type: 'bicycle',
        Price: 13990000,
        OriginalPrice: 15490000,
        Description: 'Xe đạp điện chở hàng chuyên dụng. Thùng xe rộng, khả năng chịu tải cao, phù hợp shipper và tiểu thương.',
        BatteryCapacity: '60V 20Ah',
        Range: '70 km',
        ChargingTime: '5-7 giờ',
        TopSpeed: '30 km/h',
        Acceleration: '',
        Motor: '800W',
        Seats: '',
        Featured: false,
        InStock: true,
        Sold: 89
    },
    {
        Name: 'TAILG Lady Grace',
        Slug: 'tailg-lady-grace',
        Brand: 'TAILG',
        Type: 'bicycle',
        Price: 10990000,
        OriginalPrice: 12490000,
        Description: 'Xe đạp điện dành cho phụ nữ trung niên. Yên xe êm ái, phanh an toàn, thiết kế thanh lịch.',
        BatteryCapacity: '48V 12Ah',
        Range: '60 km',
        ChargingTime: '4-6 giờ',
        TopSpeed: '28 km/h',
        Acceleration: '',
        Motor: '350W',
        Seats: '',
        Featured: true,
        InStock: true,
        Sold: 123
    },
    {
        Name: 'TAILG Urban E1',
        Slug: 'tailg-urban-e1',
        Brand: 'TAILG',
        Type: 'bicycle',
        Price: 8990000,
        OriginalPrice: 9990000,
        Description: 'Xe đạp điện mini gấp được, tiện lợi cho dân văn phòng. Nhỏ gọn, dễ dàng mang lên thang máy.',
        BatteryCapacity: '36V 10Ah',
        Range: '45 km',
        ChargingTime: '3-5 giờ',
        TopSpeed: '25 km/h',
        Acceleration: '',
        Motor: '250W',
        Seats: '',
        Featured: false,
        InStock: true,
        Sold: 167
    },
    {
        Name: 'TAILG Kids Joy',
        Slug: 'tailg-kids-joy',
        Brand: 'TAILG',
        Type: 'bicycle',
        Price: 6990000,
        OriginalPrice: 7990000,
        Description: 'Xe đạp điện cho học sinh tiểu học và THCS. An toàn, tốc độ giới hạn, phù hợp đi học.',
        BatteryCapacity: '36V 8Ah',
        Range: '35 km',
        ChargingTime: '3-4 giờ',
        TopSpeed: '20 km/h',
        Acceleration: '',
        Motor: '200W',
        Seats: '',
        Featured: false,
        InStock: true,
        Sold: 78
    }
];

// 3. SHOWROOMS (Showroom TAILG)
const showrooms = [
    {
        Name: 'TAILG Hà Nội - Đống Đa',
        Address: '123 Láng Hạ, Đống Đa, Hà Nội',
        Phone: '0243 123 4567',
        Email: 'dongda@tailg.vn',
        OpeningHours: '8:00 - 20:00 (Thứ 2 - Chủ Nhật)',
        Latitude: 21.0160,
        Longitude: 105.8186,
        Featured: true
    },
    {
        Name: 'TAILG TP. Hồ Chí Minh - Quận 1',
        Address: '456 Nguyễn Huệ, Quận 1, TP. HCM',
        Phone: '0282 987 6543',
        Email: 'q1@tailg.vn',
        OpeningHours: '8:00 - 20:00 (Thứ 2 - Chủ Nhật)',
        Latitude: 10.7746,
        Longitude: 106.7006,
        Featured: true
    },
    {
        Name: 'TAILG Đà Nẵng - Hải Châu',
        Address: '789 Lê Duẩn, Hải Châu, Đà Nẵng',
        Phone: '0236 555 1234',
        Email: 'danang@tailg.vn',
        OpeningHours: '8:00 - 20:00 (Thứ 2 - Chủ Nhật)',
        Latitude: 16.0563,
        Longitude: 108.2243,
        Featured: true
    },
    {
        Name: 'TAILG Cần Thơ - Ninh Kiều',
        Address: '321 Mậu Thân, Ninh Kiều, Cần Thơ',
        Phone: '0292 333 4567',
        Email: 'cantho@tailg.vn',
        OpeningHours: '8:00 - 20:00 (Thứ 2 - Chủ Nhật)',
        Latitude: 10.0341,
        Longitude: 105.7675,
        Featured: false
    },
    {
        Name: 'TAILG Hải Phòng - Ngô Quyền',
        Address: '555 Điện Biên Phủ, Ngô Quyền, Hải Phòng',
        Phone: '0225 777 8899',
        Email: 'haiphong@tailg.vn',
        OpeningHours: '8:00 - 19:00 (Thứ 2 - Chủ Nhật)',
        Latitude: 20.8571,
        Longitude: 106.6838,
        Featured: false
    }
];

// 4. PROMOTIONS (Khuyến mãi TAILG)
const promotions = [
    {
        Title: 'Giảm 2 triệu cho TAILG M3 Pro',
        Description: 'Ưu đãi đặc biệt trong tháng 1/2026 cho dòng xe máy điện cao cấp',
        DiscountAmount: 2000000,
        DiscountPercentage: '',
        StartDate: '2026-01-01',
        EndDate: '2026-01-31',
        Active: true
    },
    {
        Title: 'Tặng mũ bảo hiểm cao cấp',
        Description: 'Áp dụng cho tất cả xe máy điện TAILG',
        DiscountAmount: 500000,
        DiscountPercentage: '',
        StartDate: '2026-01-01',
        EndDate: '2026-02-28',
        Active: true
    },
    {
        Title: 'Giảm 15% dòng xe đạp điện',
        Description: 'Chương trình năm mới 2026 - Áp dụng cho xe đạp điện',
        DiscountAmount: '',
        DiscountPercentage: 15,
        StartDate: '2026-01-01',
        EndDate: '2026-01-20',
        Active: true
    },
    {
        Title: 'Trả góp 0% lãi suất',
        Description: 'Trả góp 0% trong 12 tháng cho tất cả sản phẩm',
        DiscountAmount: 0,
        DiscountPercentage: '',
        StartDate: '2026-01-01',
        EndDate: '2026-12-31',
        Active: true
    }
];

// 5. FAQS (Câu hỏi thường gặp về xe điện TAILG)
const faqs = [
    {
        Question: 'Thời gian sạc đầy pin xe điện TAILG mất bao lâu?',
        Answer: 'Thời gian sạc phụ thuộc vào dung lượng pin và bộ sạc. Thông thường: Xe máy điện 4-8 giờ, xe đạp điện 3-6 giờ. Với bộ sạc nhanh có thể rút ngắn còn 3-4 giờ.',
        Category: 'battery',
        Order: 1
    },
    {
        Question: 'Quãng đường di chuyển của xe điện TAILG là bao nhiêu?',
        Answer: 'Tùy model: Xe máy điện 50-80km, xe đạp điện 35-70km. Quãng đường phụ thuộc cách lái, địa hình và trọng tải.',
        Category: 'performance',
        Order: 2
    },
    {
        Question: 'Bảo hành pin xe điện TAILG như thế nào?',
        Answer: 'Pin được bảo hành 12-24 tháng tùy model. TAILG đảm bảo thay pin mới hoặc sửa chữa miễn phí trong thời gian bảo hành.',
        Category: 'warranty',
        Order: 3
    },
    {
        Question: 'Chi phí vận hành xe điện TAILG có tiết kiệm không?',
        Answer: 'Rất tiết kiệm! Chi phí điện chỉ 3.000-5.000đ/100km, tiết kiệm gấp 10 lần so với xe xăng. Không tốn tiền bảo dưỡng động cơ.',
        Category: 'cost',
        Order: 4
    },
    {
        Question: 'Xe điện TAILG có chạy được trong mưa không?',
        Answer: 'Hoàn toàn được! Xe điện TAILG có khả năng chống nước IPX5-IPX7, yên tâm đi trong mưa. Tuy nhiên nên tránh ngập sâu.',
        Category: 'safety',
        Order: 5
    },
    {
        Question: 'Có trạm sạc nào cho xe điện TAILG?',
        Answer: 'TAILG có hệ thống đại lý trên toàn quốc hỗ trợ sạc. Ngoài ra xe có thể sạc tại nhà bằng ổ điện 220V thông thường.',
        Category: 'charging',
        Order: 6
    },
    {
        Question: 'Pin xe điện TAILG dùng được bao lâu?',
        Answer: 'Pin Lithium bền 3-5 năm (khoảng 800-1000 lần sạc). Pin Lead-Acid 1.5-2 năm. Tuổi thọ phụ thuộc cách sử dụng và bảo quản.',
        Category: 'battery',
        Order: 7
    },
    {
        Question: 'Có cần đăng ký xe điện TAILG không?',
        Answer: 'Xe đạp điện không cần đăng ký. Xe máy điện có động cơ trên 500W và tốc độ trên 25km/h cần đăng ký theo quy định.',
        Category: 'legal',
        Order: 8
    }
];

// 6. TESTIMONIALS (Đánh giá khách hàng)
const testimonials = [
    {
        CustomerName: 'Anh Nguyễn Văn Thành',
        CustomerAvatar: 'https://i.pravatar.cc/150?img=12',
        Content: 'TAILG M3 Pro chạy êm, khỏe, pin trâu. Đi được 70-80km mới cần sạc. Rất hài lòng!',
        Rating: 5,
        CarModel: 'TAILG M3 Pro',
        Featured: true
    },
    {
        CustomerName: 'Chị Trần Thị Lan',
        CustomerAvatar: 'https://i.pravatar.cc/150?img=5',
        Content: 'Xe City Rider nhỏ gọn, dễ lái. Mình đi chợ, đưa con đi học rất tiện. Giá cả phải chăng.',
        Rating: 5,
        CarModel: 'TAILG City Rider',
        Featured: true
    },
    {
        CustomerName: 'Anh Lê Hoàng Nam',
        CustomerAvatar: 'https://i.pravatar.cc/150?img=33',
        Content: 'Chạy ship bằng Cargo Pro được 6 tháng rồi. Thùng rộng, chở được nhiều hàng. Tiết kiệm xăng hẳn!',
        Rating: 5,
        CarModel: 'TAILG Cargo Pro',
        Featured: true
    },
    {
        CustomerName: 'Chị Phạm Thị Hoa',
        CustomerAvatar: 'https://i.pravatar.cc/150?img=10',
        Content: 'Lady Grace đẹp lắm, màu pastel xinh xắn. Lái êm, yên xe mềm mại. Phù hợp chị em phụ nữ.',
        Rating: 5,
        CarModel: 'TAILG Lady Grace',
        Featured: true
    },
    {
        CustomerName: 'Anh Võ Minh Tuấn',
        CustomerAvatar: 'https://i.pravatar.cc/150?img=15',
        Content: 'Eco S2 giá rẻ mà chất lượng tốt. Con đi học mỗi ngày rất tiện. Tiết kiệm chi phí.',
        Rating: 4,
        CarModel: 'TAILG Eco S2',
        Featured: false
    },
    {
        CustomerName: 'Chị Nguyễn Thị Mai',
        CustomerAvatar: 'https://i.pravatar.cc/150?img=20',
        Content: 'Urban E1 gấp gọn được, để trong thang máy tiện lợi. Đi làm hàng ngày rất ổn.',
        Rating: 4,
        CarModel: 'TAILG Urban E1',
        Featured: false
    }
];

// 7. SERVICES (Dịch vụ TAILG)
const services = [
    {
        Name: 'Bảo dưỡng định kỳ',
        Slug: 'bao-duong-dinh-ky',
        Description: 'Kiểm tra và bảo dưỡng xe định kỳ: kiểm tra phanh, lốp, hệ thống điện',
        Price: 150000,
        Duration: '30 phút - 1 giờ'
    },
    {
        Name: 'Sửa chữa hệ thống điện',
        Slug: 'sua-chua-he-thong-dien',
        Description: 'Sửa chữa các lỗi hệ thống điện, động cơ, mạch điều khiển',
        Price: 0,
        Duration: 'Tùy tình trạng'
    },
    {
        Name: 'Kiểm tra và thay thế pin',
        Slug: 'kiem-tra-thay-the-pin',
        Description: 'Kiểm tra dung lượng pin, thay pin mới nếu cần',
        Price: 0,
        Duration: '30 phút'
    },
    {
        Name: 'Bơm lốp và cân chỉnh phanh',
        Slug: 'bom-lop-can-chinh-phanh',
        Description: 'Bơm lốp đúng áp suất, cân chỉnh phanh trước sau',
        Price: 50000,
        Duration: '15 phút'
    },
    {
        Name: 'Vệ sinh và bảo dưỡng toàn diện',
        Slug: 've-sinh-bao-duong-toan-dien',
        Description: 'Vệ sinh xe, tra dầu, bôi trơn, kiểm tra tổng thể',
        Price: 200000,
        Duration: '1-2 giờ'
    },
    {
        Name: 'Thay dầu phanh',
        Slug: 'thay-dau-phanh',
        Description: 'Thay dầu phanh đĩa (nếu xe có phanh dầu)',
        Price: 100000,
        Duration: '30 phút'
    }
];

// 8. WARRANTIES (Bảo hành TAILG)
const warranties = [
    {
        Name: 'Bảo hành xe máy điện',
        Type: 'vehicle',
        Duration: '18-24 tháng',
        Description: 'Bảo hành toàn bộ xe máy điện (trừ pin và phụ kiện tiêu hao như lốp, phanh)'
    },
    {
        Name: 'Bảo hành xe đạp điện',
        Type: 'vehicle',
        Duration: '12-18 tháng',
        Description: 'Bảo hành toàn bộ xe đạp điện (trừ pin và phụ kiện tiêu hao)'
    },
    {
        Name: 'Bảo hành pin Lithium',
        Type: 'battery',
        Duration: '18-24 tháng',
        Description: 'Bảo hành pin Lithium, đảm bảo dung lượng trên 80%'
    },
    {
        Name: 'Bảo hành pin Lead-Acid',
        Type: 'battery',
        Duration: '12 tháng',
        Description: 'Bảo hành pin Lead-Acid tiêu chuẩn'
    },
    {
        Name: 'Bảo hành động cơ',
        Type: 'motor',
        Duration: '24 tháng',
        Description: 'Bảo hành động cơ điện brushless và hệ thống truyền động'
    }
];

// 9. ACCESSORIES (Phụ kiện TAILG)
const accessories = [
    {
        Name: 'Bộ sạc nhanh TAILG',
        Slug: 'bo-sac-nhanh-tailg',
        Price: 1200000,
        Description: 'Bộ sạc nhanh chính hãng TAILG, sạc đầy trong 3-4 giờ',
        Category: 'charging'
    },
    {
        Name: 'Mũ bảo hiểm 3/4 TAILG',
        Slug: 'mu-bao-hiem-tailg',
        Price: 450000,
        Description: 'Mũ bảo hiểm chính hãng TAILG, đạt chuẩn an toàn',
        Category: 'safety'
    },
    {
        Name: 'Baga sau inox',
        Slug: 'baga-sau-inox',
        Price: 350000,
        Description: 'Baga inox chắc chắn, chịu tải 20kg',
        Category: 'exterior'
    },
    {
        Name: 'Thùng xe sau 30L',
        Slug: 'thung-xe-sau-30l',
        Price: 550000,
        Description: 'Thùng đựng đồ phía sau, dung tích 30 lít',
        Category: 'storage'
    },
    {
        Name: 'Áo mưa TAILG',
        Slug: 'ao-mua-tailg',
        Price: 120000,
        Description: 'Áo mưa bít chính hãng, chống thấm tốt',
        Category: 'clothing'
    },
    {
        Name: 'Khóa chống trộm',
        Slug: 'khoa-chong-trom',
        Price: 280000,
        Description: 'Khóa đĩa chống trộm, an toàn cao',
        Category: 'security'
    },
    {
        Name: 'Gương chiếu hậu gấp',
        Slug: 'guong-chieu-hau-gap',
        Price: 180000,
        Description: 'Gương chiếu hậu gấp được, tiện lợi',
        Category: 'exterior'
    },
    {
        Name: 'Đèn LED trợ sáng',
        Slug: 'den-led-tro-sang',
        Price: 320000,
        Description: 'Đèn LED trợ sáng công suất cao',
        Category: 'lighting'
    },
    {
        Name: 'Yên xe memory foam',
        Slug: 'yen-xe-memory-foam',
        Price: 420000,
        Description: 'Yên xe êm ái với đệm memory foam',
        Category: 'interior'
    },
    {
        Name: 'Pin dự phòng 48V 12Ah',
        Slug: 'pin-du-phong-48v-12ah',
        Price: 3500000,
        Description: 'Pin dự phòng chính hãng, thay thế khi cần',
        Category: 'battery'
    }
];

// 10. ARTICLE CATEGORIES (Danh mục bài viết)
const articleCategories = [
    { Name: 'Tin tức TAILG', Slug: 'tin-tuc-tailg', Description: 'Tin tức mới nhất về thương hiệu và sản phẩm TAILG' },
    { Name: 'Đánh giá xe điện', Slug: 'danh-gia-xe-dien', Description: 'Đánh giá chi tiết các mẫu xe điện TAILG' },
    { Name: 'Hướng dẫn sử dụng', Slug: 'huong-dan-su-dung', Description: 'Hướng dẫn sử dụng và bảo dưỡng xe điện' },
    { Name: 'So sánh xe điện', Slug: 'so-sanh-xe-dien', Description: 'So sánh các mẫu xe điện TAILG' },
    { Name: 'Kiến thức xe điện', Slug: 'kien-thuc-xe-dien', Description: 'Kiến thức chung về xe điện và pin' }
];

// 11. ARTICLES (Bài viết)
const articles = [
    {
        Title: '5 lý do nên chọn xe điện TAILG',
        Slug: '5-ly-do-nen-chon-xe-dien-tailg',
        Excerpt: 'Khám phá những ưu điểm vượt trội của xe điện TAILG so với xe xăng truyền thống và các thương hiệu khác',
        Content: 'Nội dung bài viết chi tiết về 5 lý do: 1. Tiết kiệm chi phí, 2. Thân thiện môi trường, 3. Bền bỉ, ít hỏng hóc, 4. Thiết kế đẹp, hiện đại, 5. Dịch vụ hậu mãi tốt...',
        Published: true,
        PublishedAt: '2026-01-05'
    },
    {
        Title: 'So sánh TAILG M3 Pro và Thunder X1 - Nên chọn xe nào?',
        Slug: 'so-sanh-tailg-m3-pro-va-thunder-x1',
        Excerpt: 'Phân tích chi tiết sự khác biệt giữa 2 mẫu xe máy điện phổ biến nhất của TAILG',
        Content: 'Nội dung so sánh chi tiết: giá cả, pin, quãng đường, thiết kế, tính năng...',
        Published: true,
        PublishedAt: '2026-01-03'
    },
    {
        Title: 'Hướng dẫn sạc và bảo quản pin xe điện TAILG',
        Slug: 'huong-dan-sac-va-bao-quan-pin-xe-dien-tailg',
        Excerpt: 'Cách sạc pin đúng cách để kéo dài tuổi thọ pin và tiết kiệm chi phí',
        Content: 'Nội dung hướng dẫn: thời gian sạc, cách bảo quản, lưu ý khi sử dụng...',
        Published: true,
        PublishedAt: '2026-01-01'
    }
];

// 12. GIFTS (Quà tặng)
const gifts = [
    {
        Name: 'Bộ phụ kiện cơ bản',
        Description: 'Gồm mũ bảo hiểm, áo mưa, khóa chống trộm',
        Value: 800000,
        Image: ''
    },
    {
        Name: 'Voucher sạc điện miễn phí',
        Description: 'Sạc miễn phí tại các đại lý TAILG trong 3 tháng',
        Value: 500000,
        Image: ''
    },
    {
        Name: 'Thẻ bảo hành mở rộng',
        Description: 'Gia hạn thêm 6 tháng bảo hành',
        Value: 1000000,
        Image: ''
    },
    {
        Name: 'Bộ nâng cấp LED',
        Description: 'Đèn LED trợ sáng + đèn hậu LED',
        Value: 600000,
        Image: ''
    }
];

// ==================== GENERATE CSV ====================

console.log('🚀 Generating CSV files...\n');

arrayToCSV(categories, '01_categories.csv');
arrayToCSV(carModels, '02_car-models.csv');
arrayToCSV(showrooms, '03_showrooms.csv');
arrayToCSV(promotions, '04_promotions.csv');
arrayToCSV(faqs, '05_faqs.csv');
arrayToCSV(testimonials, '06_testimonials.csv');
arrayToCSV(services, '07_services.csv');
arrayToCSV(warranties, '08_warranties.csv');
arrayToCSV(accessories, '09_accessories.csv');
arrayToCSV(articleCategories, '10_article-categories.csv');
arrayToCSV(articles, '11_articles.csv');
arrayToCSV(gifts, '12_gifts.csv');

console.log('\n🎉 All CSV files generated!\n');
console.log(`📁 Location: ${OUTPUT_DIR}\n`);
console.log('📋 Hướng dẫn import vào Supabase:');
console.log('   1. Vào https://supabase.com → Dashboard → Table Editor');
console.log('   2. Chọn table cần import');
console.log('   3. Click Insert → Import data from CSV');
console.log('   4. Upload file CSV tương ứng\n');
console.log('⚠️  Lưu ý:');
console.log('   - Import theo thứ tự (categories trước, rồi car-models,...)');
console.log('   - Các trường relation (foreign key) để trống, sẽ set sau');
console.log('   - File được đánh số để dễ theo dõi thứ tự\n');

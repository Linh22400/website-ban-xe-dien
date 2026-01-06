/**
 * Generate CSV files - TAILG Electric Vehicles
 * All columns in snake_case to match PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const OUTPUT_DIR = path.join(__dirname, '..', 'exports', 'csv');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const BOM = '\uFEFF';
function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) return `"${str.replace(/"/g, '""')}"`;
    return str;
}
function arrayToCSV(headers, data) {
    const headerRow = headers.map(escapeCSV).join(',');
    const dataRows = data.map(row => headers.map(h => escapeCSV(row[h])).join(','));
    return BOM + [headerRow, ...dataRows].join('\n');
}

// DATA
const categories = [
    { name: 'Xe Máy Điện', slug: 'xe-may-dien', subtitle: 'Mạnh mẽ & Tiết kiệm', link: '/cars?type=motorcycle', color: 'from-blue-600 to-cyan-500', col_span: 'md:col-span-2 lg:col-span-1', order: 1 },
    { name: 'Xe Đạp Điện', slug: 'xe-dap-dien', subtitle: 'Nhỏ gọn & Tiện lợi', link: '/cars?type=bicycle', color: 'from-green-600 to-emerald-500', col_span: 'md:col-span-2 lg:col-span-1', order: 2 },
    { name: 'Xe Chở Hàng', slug: 'xe-cho-hang', subtitle: 'Bền bỉ & Chịu tải', link: '/cars?category=cargo', color: 'from-orange-600 to-yellow-500', col_span: 'md:col-span-1', order: 3 },
    { name: 'Xe Gấp Gọn', slug: 'xe-gap-gon', subtitle: 'Tiện lợi & Di động', link: '/cars?category=foldable', color: 'from-purple-600 to-pink-500', col_span: 'md:col-span-1', order: 4 }
];

const carModels = [
    { name: 'TAILG M3 Pro', slug: 'tailg-m3-pro', brand: 'TAILG', type: 'motorcycle', price: 15990000, range: 80, top_speed: 50, acceleration: 0, description: 'Xe máy điện cao cấp với pin dung lượng lớn 60V 32Ah, quãng đường di chuyển lên đến 80km.', is_featured: true, featured: true, specifications: JSON.stringify({battery:'60V 32Ah Lithium',motor:'1000W',chargingTime:'6-8 giờ',weight:'85kg',maxLoad:'150kg'}), features: JSON.stringify(['Pin Lithium cao cấp 60V 32Ah','Động cơ 1000W mạnh mẽ','Phanh đĩa trước sau','Đèn LED full','Khóa chống trộm thông minh','Màn hình LCD đa thông tin']), stock: 500, sold: 245 },
    { name: 'TAILG Thunder X1', slug: 'tailg-thunder-x1', brand: 'TAILG', type: 'motorcycle', price: 12990000, range: 65, top_speed: 45, acceleration: 0, description: 'Xe máy điện phong cách thể thao với công suất 800W, pin 48V 28Ah.', is_featured: true, featured: true, specifications: JSON.stringify({battery:'48V 28Ah Lithium',motor:'800W',chargingTime:'5-7 giờ',weight:'78kg',maxLoad:'140kg'}), features: JSON.stringify(['Pin Lithium 48V 28Ah','Động cơ 800W','Phanh đĩa trước','Đèn LED','Cốp xe rộng rãi']), stock: 400, sold: 189 },
    { name: 'TAILG City Rider', slug: 'tailg-city-rider', brand: 'TAILG', type: 'motorcycle', price: 11490000, range: 55, top_speed: 40, acceleration: 0, description: 'Xe máy điện cho người đi làm với thiết kế gọn gàng, pin 48V 24Ah.', is_featured: false, featured: false, specifications: JSON.stringify({battery:'48V 24Ah Lithium',motor:'600W',chargingTime:'4-6 giờ',weight:'72kg',maxLoad:'130kg'}), features: JSON.stringify(['Pin Lithium 48V 24Ah','Động cơ 600W tiết kiệm','Phanh đĩa/tang trống','Đèn LED tiết kiệm','Thiết kế nhỏ gọn']), stock: 300, sold: 156 },
    { name: 'TAILG Eco S2', slug: 'tailg-eco-s2', brand: 'TAILG', type: 'motorcycle', price: 9990000, range: 50, top_speed: 35, acceleration: 0, description: 'Xe máy điện kinh tế nhất với pin 48V 20Ah, phù hợp học sinh, sinh viên.', is_featured: false, featured: false, specifications: JSON.stringify({battery:'48V 20Ah Lead-acid',motor:'500W',chargingTime:'6-8 giờ',weight:'68kg',maxLoad:'120kg'}), features: JSON.stringify(['Pin Axit 48V 20Ah','Động cơ 500W','Phanh tang trống','Đèn tiêu chuẩn','Giá cả phải chăng']), stock: 600, sold: 312 },
    { name: 'TAILG Cargo Pro', slug: 'tailg-cargo-pro', brand: 'TAILG', type: 'bicycle', price: 13990000, range: 70, top_speed: 30, acceleration: 0, description: 'Xe đạp điện chở hàng chuyên dụng với khung xe bền chắc, pin 48V 30Ah.', is_featured: true, featured: true, specifications: JSON.stringify({battery:'48V 30Ah Lithium',motor:'500W',chargingTime:'5-7 giờ',weight:'55kg',maxLoad:'200kg'}), features: JSON.stringify(['Pin Lithium 48V 30Ah','Khung thép chịu lực cao','Thùng chở hàng lớn','Phanh đĩa cơ','Chống chọc trung tâm','Giỏ sau rộng']), stock: 200, sold: 98 },
    { name: 'TAILG Lady Grace', slug: 'tailg-lady-grace', brand: 'TAILG', type: 'bicycle', price: 10990000, range: 60, top_speed: 25, acceleration: 0, description: 'Xe đạp điện dành cho phụ nữ với thiết kế thanh lịch, yên êm ái.', is_featured: true, featured: true, specifications: JSON.stringify({battery:'36V 12Ah Lithium',motor:'350W',chargingTime:'4-5 giờ',weight:'28kg',maxLoad:'100kg'}), features: JSON.stringify(['Pin Lithium 36V 12Ah','Động cơ 350W êm ái','Thiết kế nữ tính','Yên ngồi êm','Giỏ trước xinh xắn','Màu sắc đa dạng']), stock: 350, sold: 167 },
    { name: 'TAILG Urban E1', slug: 'tailg-urban-e1', brand: 'TAILG', type: 'bicycle', price: 8990000, range: 45, top_speed: 25, acceleration: 0, description: 'Xe đạp điện gấp gọn cho dân văn phòng, dễ dàng mang lên thang máy.', is_featured: false, featured: false, specifications: JSON.stringify({battery:'36V 10Ah Lithium',motor:'250W',chargingTime:'3-4 giờ',weight:'22kg',maxLoad:'90kg'}), features: JSON.stringify(['Gấp gọn trong 10 giây','Pin Lithium 36V 10Ah','Trọng lượng nhẹ 22kg','Bánh xe 16 inch','Dễ dàng mang theo']), stock: 250, sold: 134 },
    { name: 'TAILG Kids Joy', slug: 'tailg-kids-joy', brand: 'TAILG', type: 'bicycle', price: 6990000, range: 35, top_speed: 20, acceleration: 0, description: 'Xe đạp điện cho trẻ em từ 8-14 tuổi, an toàn với hệ thống phanh tốt.', is_featured: false, featured: false, specifications: JSON.stringify({battery:'24V 8Ah Lithium',motor:'200W',chargingTime:'3-4 giờ',weight:'18kg',maxLoad:'60kg'}), features: JSON.stringify(['Pin Lithium 24V 8Ah','Động cơ 200W an toàn','Giới hạn tốc độ','Phanh đĩa cơ','Thiết kế cho trẻ em','Màu sắc bắt mắt']), stock: 180, sold: 89 }
];

const showrooms = [
    { name: 'TAILG Hà Nội - Đống Đa', code: 'HN-DD-001', address: '123 Đường Láng, Phường Thịnh Quang', city: 'Hà Nội', district: 'Đống Đa', phone: '024 3456 7890', email: 'hanoi@tailg.vn', manager: 'Nguyễn Văn An', latitude: 21.0134, longitude: 105.8131, working_hours: JSON.stringify({monday:'8:00 - 18:00',tuesday:'8:00 - 18:00',wednesday:'8:00 - 18:00',thursday:'8:00 - 18:00',friday:'8:00 - 18:00',saturday:'8:00 - 17:00',sunday:'9:00 - 16:00'}) },
    { name: 'TAILG TP.HCM - Quận 1', code: 'HCM-Q1-001', address: '456 Nguyễn Huệ, Phường Bến Nghé', city: 'TP. Hồ Chí Minh', district: 'Quận 1', phone: '028 9876 5432', email: 'hcm@tailg.vn', manager: 'Trần Thị Bình', latitude: 10.7743, longitude: 106.7012, working_hours: JSON.stringify({monday:'8:00 - 19:00',tuesday:'8:00 - 19:00',wednesday:'8:00 - 19:00',thursday:'8:00 - 19:00',friday:'8:00 - 19:00',saturday:'8:00 - 18:00',sunday:'9:00 - 17:00'}) },
    { name: 'TAILG Đà Nẵng - Hải Châu', code: 'DN-HC-001', address: '789 Lê Duẩn, Phường Thạch Thang', city: 'Đà Nẵng', district: 'Hải Châu', phone: '0236 3456 789', email: 'danang@tailg.vn', manager: 'Lê Văn Cường', latitude: 16.0544, longitude: 108.2022, working_hours: JSON.stringify({monday:'8:00 - 18:00',tuesday:'8:00 - 18:00',wednesday:'8:00 - 18:00',thursday:'8:00 - 18:00',friday:'8:00 - 18:00',saturday:'8:00 - 17:00',sunday:'9:00 - 16:00'}) },
    { name: 'TAILG Cần Thơ - Ninh Kiều', code: 'CT-NK-001', address: '321 Mậu Thân, Phường An Hòa', city: 'Cần Thơ', district: 'Ninh Kiều', phone: '0292 3456 789', email: 'cantho@tailg.vn', manager: 'Phạm Thị Dung', latitude: 10.0341, longitude: 105.7876, working_hours: JSON.stringify({monday:'8:00 - 18:00',tuesday:'8:00 - 18:00',wednesday:'8:00 - 18:00',thursday:'8:00 - 18:00',friday:'8:00 - 18:00',saturday:'8:00 - 17:00',sunday:'Nghỉ'}) },
    { name: 'TAILG Hải Phòng - Ngô Quyền', code: 'HP-NQ-001', address: '654 Điện Biên Phủ, Phường Máy Chai', city: 'Hải Phòng', district: 'Ngô Quyền', phone: '0225 3456 789', email: 'haiphong@tailg.vn', manager: 'Hoàng Văn Em', latitude: 20.8570, longitude: 106.6830, working_hours: JSON.stringify({monday:'8:00 - 18:00',tuesday:'8:00 - 18:00',wednesday:'8:00 - 18:00',thursday:'8:00 - 18:00',friday:'8:00 - 18:00',saturday:'8:00 - 17:00',sunday:'9:00 - 16:00'}) }
];

const promotions = [
    { title: 'Giảm 2 triệu khi mua xe máy điện TAILG', description: 'Áp dụng cho tất cả các mẫu xe máy điện TAILG trong tháng 1/2026', discount_tag: 'GIẢM 2TR', link: '/promotions/giam-2-trieu', expiry_date: '2026-01-31', is_active: true, discount_percent: 0 },
    { title: 'Tặng mũ bảo hiểm cao cấp', description: 'Mua xe đạp điện TAILG tặng ngay mũ bảo hiểm trị giá 500k', discount_tag: 'QUÀ TẶNG', link: '/promotions/tang-mu-bao-hiem', expiry_date: '2026-02-15', is_active: true, discount_percent: 0 },
    { title: 'Giảm 15% phụ kiện xe điện', description: 'Giảm giá 15% cho tất cả phụ kiện khi mua kèm xe', discount_tag: '-15%', link: '/promotions/giam-15-phu-kien', expiry_date: '2026-01-31', is_active: true, discount_percent: 15 },
    { title: 'Trả góp 0% lãi suất', description: 'Trả góp 0% trong 6 tháng cho tất cả các mẫu xe', discount_tag: 'TRẢ GÓP 0%', link: '/promotions/tra-gop-0-phan-tram', expiry_date: '2026-03-31', is_active: true, discount_percent: 0 }
];

const accessories = [
    { name: 'Sạc nhanh TAILG 48V', slug: 'sac-nhanh-tailg-48v', price: 1200000, category: 'charger', description: 'Sạc nhanh dành cho xe điện 48V, thời gian sạc nhanh hơn 30%', is_featured: true },
    { name: 'Mũ bảo hiểm TAILG', slug: 'mu-bao-hiem-tailg', price: 450000, category: 'helmet', description: 'Mũ bảo hiểm 3/4 chính hãng TAILG, đạt chuẩn an toàn', is_featured: true },
    { name: 'Giá để đồ sau xe', slug: 'gia-de-do-sau-xe', price: 350000, category: 'other', description: 'Giá sau bằng thép, chịu tải 20kg, lắp đặt dễ dàng', is_featured: false },
    { name: 'Thùng xe 30L', slug: 'thung-xe-30l', price: 550000, category: 'other', description: 'Thùng đựng đồ dung tích 30L, chống nước', is_featured: false },
    { name: 'Áo mưa TAILG', slug: 'ao-mua-tailg', price: 120000, category: 'other', description: 'Áo mưa 2 lớp, chống thấm tốt, có túi đựng', is_featured: false },
    { name: 'Khóa chống trộm', slug: 'khoa-chong-trom', price: 280000, category: 'other', description: 'Khóa đĩa chống cắt, có chuông báo động', is_featured: true },
    { name: 'Gương chiếu hậu gấp', slug: 'guong-chieu-hau-gap', price: 180000, category: 'other', description: 'Cặp gương gấp được, tránh va đập', is_featured: false },
    { name: 'Đèn LED trợ sáng', slug: 'den-led-tro-sang', price: 320000, category: 'other', description: 'Đèn LED 20W, chiếu xa 50m, tiết kiệm điện', is_featured: false },
    { name: 'Yên xe memory foam', slug: 'yen-xe-memory-foam', price: 420000, category: 'other', description: 'Yên bọc da cao cấp, đệm memory foam êm ái', is_featured: false },
    { name: 'Pin dự phòng 48V 10Ah', slug: 'pin-du-phong-48v-10ah', price: 3500000, category: 'battery', description: 'Pin Lithium dự phòng, tăng gấp đôi quãng đường', is_featured: true }
];

const articleCategories = [
    { name: 'Tin tức TAILG', slug: 'tin-tuc-tailg' },
    { name: 'Đánh giá xe điện', slug: 'danh-gia-xe-dien' },
    { name: 'Hướng dẫn sử dụng', slug: 'huong-dan-su-dung' },
    { name: 'So sánh xe điện', slug: 'so-sanh-xe-dien' },
    { name: 'Kiến thức xe điện', slug: 'kien-thuc-xe-dien' }
];

const articles = [
    { title: '5 lý do nên chọn xe điện TAILG', slug: '5-ly-do-nen-chon-xe-dien-tailg', excerpt: 'Khám phá những ưu điểm vượt trội của xe điện TAILG so với xe xăng truyền thống', tags: 'xe điện,TAILG,lợi ích', author: 'Nguyễn Văn An', published_date: '2026-01-05', reading_time: 5 },
    { title: 'So sánh TAILG M3 Pro và Thunder X1', slug: 'so-sanh-tailg-m3-pro-va-thunder-x1', excerpt: 'Phân tích chi tiết sự khác biệt giữa 2 mẫu xe máy điện phổ biến nhất', tags: 'so sánh,TAILG M3 Pro,Thunder X1', author: 'Trần Thị Bình', published_date: '2026-01-03', reading_time: 7 },
    { title: 'Hướng dẫn sạc và bảo quản pin xe điện', slug: 'huong-dan-sac-va-bao-quan-pin', excerpt: 'Cách sạc pin đúng cách để kéo dài tuổi thọ pin', tags: 'hướng dẫn,pin,bảo quản', author: 'Lê Văn Cường', published_date: '2026-01-01', reading_time: 6 }
];

// GENERATE
console.log('🚀 Generating CSV files (snake_case)...\n');
const files = [
    { name: '01_categories.csv', headers: ['name','slug','subtitle','link','color','col_span','order'], data: categories },
    { name: '02_car-models.csv', headers: ['name','slug','brand','type','price','range','top_speed','acceleration','description','is_featured','featured','specifications','features','stock','sold'], data: carModels },
    { name: '03_showrooms.csv', headers: ['name','code','address','city','district','phone','email','manager','latitude','longitude','working_hours'], data: showrooms },
    { name: '04_promotions.csv', headers: ['title','description','discount_tag','link','expiry_date','is_active','discount_percent'], data: promotions },
    { name: '05_accessories.csv', headers: ['name','slug','price','category','description','is_featured'], data: accessories },
    { name: '06_article-categories.csv', headers: ['name','slug'], data: articleCategories },
    { name: '07_articles.csv', headers: ['title','slug','excerpt','tags','author','published_date','reading_time'], data: articles }
];

files.forEach(({ name, headers, data }) => {
    fs.writeFileSync(path.join(OUTPUT_DIR, name), arrayToCSV(headers, data), 'utf8');
    console.log(`✅ ${name} (${data.length} rows)`);
});

console.log('\n🎉 Done! All columns in snake_case matching PostgreSQL');
console.log(`📁 Location: ${OUTPUT_DIR}`);
console.log('\n✅ Ready to import to Supabase!');

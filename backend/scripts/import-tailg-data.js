// Script to import TAILG sample data into Strapi
// Run: node import-tailg-data.js

const STRAPI_URL = 'http://localhost:1337';

const tailgProducts = [
    {
        name: 'TAILG M3 Pro',
        slug: 'tailg-m3-pro',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 15990000,
        range: 80,
        topSpeed: 50,
        acceleration: 0,
        description: 'Xe máy điện TAILG M3 Pro - Dòng sản phẩm cao cấp với thiết kế thể thao, công nghệ pin tiên tiến. Phù hợp di chuyển đường dài trong thành phố.',
        features: [
            {
                icon: '⚡',
                title: 'Pin Lithium 60V',
                desc: 'Công nghệ pin tiên tiến, sạc nhanh 4-6h',
                bg: 'from-yellow-500/20 to-orange-500/20'
            },
            {
                icon: '🏍️',
                title: 'Thiết Kế Thể Thao',
                desc: 'Kiểu dáng hiện đại, trẻ trung',
                bg: 'from-blue-500/20 to-cyan-500/20'
            },
            {
                icon: '🛡️',
                title: 'An Toàn Cao',
                desc: 'Hệ thống phanh ABS, đèn LED',
                bg: 'from-green-500/20 to-emerald-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '1000W' },
            { label: 'Pin', value: '60V 20Ah Lithium' },
            { label: 'Tốc độ tối đa', value: '50 km/h' },
            { label: 'Quãng đường', value: '80 km' },
            { label: 'Thời gian sạc', value: '4-6 giờ' },
            { label: 'Trọng tải', value: '150 kg' },
            { label: 'Bảo hành', value: '2 năm' }
        ],
        color: [
            { name: 'Đỏ Thể Thao', hex: '#DC2626', images: [] },
            { name: 'Đen Huyền Bí', hex: '#1F2937', images: [] },
            { name: 'Trắng Tinh Khôi', hex: '#F3F4F6', images: [] }
        ],
        isFeatured: true,
        sold: 156
    },
    {
        name: 'TAILG Thunder X1',
        slug: 'tailg-thunder-x1',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 12990000,
        range: 65,
        topSpeed: 45,
        acceleration: 0,
        description: 'Xe máy điện phổ thông, hiệu suất cao. Tiết kiệm năng lượng, phù hợp sử dụng hàng ngày.',
        features: [
            {
                icon: '💰',
                title: 'Giá Tốt Nhất',
                desc: 'Phù hợp túi tiền mọi người',
                bg: 'from-green-500/20 to-emerald-500/20'
            },
            {
                icon: '🔋',
                title: 'Pin Bền Bỉ',
                desc: 'Sử dụng lâu dài, ít hao mòn',
                bg: 'from-blue-500/20 to-cyan-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '800W' },
            { label: 'Pin', value: '48V 20Ah' },
            { label: 'Tốc độ tối đa', value: '45 km/h' },
            { label: 'Quãng đường', value: '65 km' },
            { label: 'Thời gian sạc', value: '6-8 giờ' },
            { label: 'Bảo hành', value: '18 tháng' }
        ],
        color: [
            { name: 'Xanh Dương', hex: '#3B82F6', images: [] },
            { name: 'Xám Bạc', hex: '#9CA3AF', images: [] }
        ],
        isFeatured: false,
        sold: 284
    },
    {
        name: 'TAILG City Rider',
        slug: 'tailg-city-rider',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 11490000,
        range: 55,
        topSpeed: 40,
        acceleration: 0,
        description: 'Xe máy điện cho phụ nữ và sinh viên. Nhỏ gọn, dễ điều khiển, tiện lợi trong đô thị.',
        features: [
            {
                icon: '🌸',
                title: 'Thiết Kế Nữ Tính',
                desc: 'Phù hợp cho phái đẹp',
                bg: 'from-pink-500/20 to-rose-500/20'
            },
            {
                icon: '🪶',
                title: 'Nhẹ Nhàng',
                desc: 'Dễ dàng di chuyển, đỗ xe',
                bg: 'from-purple-500/20 to-indigo-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '600W' },
            { label: 'Pin', value: '48V 15Ah' },
            { label: 'Tốc độ tối đa', value: '40 km/h' },
            { label: 'Quãng đường', value: '55 km' },
            { label: 'Trọng lượng', value: '45 kg' }
        ],
        color: [
            { name: 'Hồng Pastel', hex: '#F9A8D4', images: [] },
            { name: 'Xanh Mint', hex: '#6EE7B7', images: [] },
            { name: 'Tím Lavender', hex: '#C4B5FD', images: [] }
        ],
        isFeatured: true,
        sold: 198
    },
    {
        name: 'TAILG Eco S2',
        slug: 'tailg-eco-s2',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 9990000,
        range: 50,
        topSpeed: 35,
        acceleration: 0,
        description: 'Xe máy điện giá rẻ, phù hợp học sinh sinh viên. Tiết kiệm chi phí, dễ bảo dưỡng.',
        features: [
            {
                icon: '💵',
                title: 'Dưới 10 Triệu',
                desc: 'Giá cả phải chăng nhất',
                bg: 'from-green-500/20 to-teal-500/20'
            },
            {
                icon: '🎓',
                title: 'Cho Học Sinh',
                desc: 'Phù hợp đi học, đi làm',
                bg: 'from-blue-500/20 to-indigo-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '500W' },
            { label: 'Pin', value: '48V 12Ah' },
            { label: 'Tốc độ tối đa', value: '35 km/h' },
            { label: 'Quãng đường', value: '50 km' },
            { label: 'Bảo hành', value: '12 tháng' }
        ],
        color: [
            { name: 'Đỏ', hex: '#EF4444', images: [] },
            { name: 'Xanh', hex: '#3B82F6', images: [] }
        ],
        isFeatured: false,
        sold: 342
    },
    {
        name: 'TAILG Cargo Pro',
        slug: 'tailg-cargo-pro',
        brand: 'TAILG',
        type: 'bicycle',
        price: 13990000,
        range: 70,
        topSpeed: 30,
        acceleration: 0,
        description: 'Xe đạp điện chở hàng chuyên dụng. Thùng xe rộng, khả năng chịu tải cao, phù hợp shipper và tiểu thương.',
        features: [
            {
                icon: '📦',
                title: 'Chở Hàng Lớn',
                desc: 'Thùng xe 80L, chịu tải 200kg',
                bg: 'from-orange-500/20 to-red-500/20'
            },
            {
                icon: '💪',
                title: 'Bền Bỉ',
                desc: 'Khung xe thép chắc chắn',
                bg: 'from-gray-500/20 to-slate-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '800W' },
            { label: 'Pin', value: '60V 20Ah' },
            { label: 'Tốc độ', value: '30 km/h' },
            { label: 'Quãng đường', value: '70 km' },
            { label: 'Trọng tải', value: '200 kg' },
            { label: 'Thùng xe', value: '80 Lít' }
        ],
        color: [
            { name: 'Xanh Quân Đội', hex: '#064E3B', images: [] },
            { name: 'Cam Neon', hex: '#F97316', images: [] }
        ],
        isFeatured: false,
        sold: 89
    },
    {
        name: 'TAILG Lady Grace',
        slug: 'tailg-lady-grace',
        brand: 'TAILG',
        type: 'bicycle',
        price: 10990000,
        range: 60,
        topSpeed: 28,
        acceleration: 0,
        description: 'Xe đạp điện dành cho phụ nữ trung niên. Yên xe êm ái, phanh an toàn, thiết kế thanh lịch.',
        features: [
            {
                icon: '👒',
                title: 'Thanh Lịch',
                desc: 'Thiết kế châu Âu sang trọng',
                bg: 'from-purple-500/20 to-pink-500/20'
            },
            {
                icon: '🌺',
                title: 'Êm Ái',
                desc: 'Yên xe memory foam, giảm sốc tốt',
                bg: 'from-rose-500/20 to-red-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '350W' },
            { label: 'Pin', value: '48V 12Ah' },
            { label: 'Tốc độ', value: '28 km/h' },
            { label: 'Quãng đường', value: '60 km' },
            { label: 'Trọng lượng', value: '25 kg' }
        ],
        color: [
            { name: 'Kem Vanilla', hex: '#FEF3C7', images: [] },
            { name: 'Hồng Phấn', hex: '#FBCFE8', images: [] },
            { name: 'Xanh Pastel', hex: '#BFDBFE', images: [] }
        ],
        isFeatured: true,
        sold: 123
    },
    {
        name: 'TAILG Urban E1',
        slug: 'tailg-urban-e1',
        brand: 'TAILG',
        type: 'bicycle',
        price: 8990000,
        range: 45,
        topSpeed: 25,
        acceleration: 0,
        description: 'Xe đạp điện mini gấp được, tiện lợi cho dân văn phòng. Nhỏ gọn, dễ dàng mang lên thang máy.',
        features: [
            {
                icon: '📱',
                title: 'Gấp Gọn',
                desc: 'Gấp trong 30 giây',
                bg: 'from-cyan-500/20 to-blue-500/20'
            },
            {
                icon: '🏢',
                title: 'Cho Văn Phòng',
                desc: 'Để trong công ty tiện lợi',
                bg: 'from-gray-500/20 to-zinc-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '250W' },
            { label: 'Pin', value: '36V 10Ah' },
            { label: 'Tốc độ', value: '25 km/h' },
            { label: 'Quãng đường', value: '45 km' },
            { label: 'Kích thước gấp', value: '80x40x60 cm' }
        ],
        color: [
            { name: 'Đen Mờ', hex: '#374151', images: [] },
            { name: 'Bạc Titanium', hex: '#D1D5DB', images: [] }
        ],
        isFeatured: false,
        sold: 167
    },
    {
        name: 'TAILG Kids Joy',
        slug: 'tailg-kids-joy',
        brand: 'TAILG',
        type: 'bicycle',
        price: 6990000,
        range: 35,
        topSpeed: 20,
        acceleration: 0,
        description: 'Xe đạp điện cho học sinh tiểu học và THCS. An toàn, tốc độ giới hạn, phù hợp đi học.',
        features: [
            {
                icon: '👦',
                title: 'Cho Trẻ Em',
                desc: 'Từ 8-14 tuổi',
                bg: 'from-yellow-500/20 to-orange-500/20'
            },
            {
                icon: '🛡️',
                title: 'An Toàn Cao',
                desc: 'Giới hạn tốc độ, phanh nhạy',
                bg: 'from-green-500/20 to-emerald-500/20'
            }
        ],
        specifications: [
            { label: 'Động cơ', value: '200W' },
            { label: 'Pin', value: '36V 8Ah' },
            { label: 'Tốc độ tối đa', value: '20 km/h' },
            { label: 'Quãng đường', value: '35 km' },
            { label: 'Độ tuổi', value: '8-14 tuổi' }
        ],
        color: [
            { name: 'Xanh Lá', hex: '#10B981', images: [] },
            { name: 'Vàng Chanh', hex: '#FCD34D', images: [] },
            { name: 'Cam Rực', hex: '#FB923C', images: [] }
        ],
        isFeatured: false,
        sold: 78
    }
];

async function importTailgData() {
    console.log('🚀 Starting TAILG data import...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const product of tailgProducts) {
        try {
            console.log(`📦 Creating: ${product.name}...`);

            const response = await fetch(`${STRAPI_URL}/api/car-models`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: product }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log(`✅ Created: ${product.name} (ID: ${result.data.id})\n`);
            successCount++;

        } catch (error) {
            console.error(`❌ Error creating ${product.name}:`, error.message);
            console.error('');
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Success: ${successCount}/${tailgProducts.length}`);
    console.log(`❌ Errors: ${errorCount}/${tailgProducts.length}`);
    console.log('='.repeat(50));

    if (successCount === tailgProducts.length) {
        console.log('\n🎉 All TAILG products imported successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Go to Strapi Admin → Content Manager → Car Models');
        console.log('2. Upload thumbnail images for each product');
        console.log('3. Publish all products');
        console.log('4. Check homepage → TailgProductGrid should show products!');
    } else {
        console.log('\n⚠️ Some products failed to import. Please check errors above.');
    }
}

// Run import
importTailgData().catch(console.error);

/**
 * Import TAILG data directly to Supabase PostgreSQL
 * Run: node scripts/import-tailg-to-db.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const carModels = [
    {
        name: 'TAILG M3 Pro',
        slug: 'tailg-m3-pro',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 15990000,
        range: 80,
        top_speed: 50,
        acceleration: 0,
        description: 'Xe máy điện cao cấp với pin dung lượng lớn 60V 32Ah, quãng đường di chuyển lên đến 80km. Thiết kế thể thao, hiện đại.',
        is_featured: true,
        featured: true,
        specifications: JSON.stringify({
            battery: '60V 32Ah Lithium',
            motor: '1000W',
            chargingTime: '6-8 giờ',
            weight: '85kg',
            maxLoad: '150kg'
        }),
        features: JSON.stringify([
            'Pin Lithium cao cấp 60V 32Ah',
            'Động cơ 1000W mạnh mẽ',
            'Phanh đĩa trước sau',
            'Đèn LED full',
            'Khóa chống trộm thông minh',
            'Màn hình LCD hiển thị đa thông tin'
        ]),
        stock: 500,
        sold: 245
    },
    {
        name: 'TAILG Thunder X1',
        slug: 'tailg-thunder-x1',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 12990000,
        range: 65,
        top_speed: 45,
        acceleration: 0,
        description: 'Xe máy điện phong cách thể thao với công suất 800W, pin 48V 28Ah. Phù hợp di chuyển trong thành phố.',
        is_featured: true,
        featured: true,
        specifications: JSON.stringify({
            battery: '48V 28Ah Lithium',
            motor: '800W',
            chargingTime: '5-7 giờ',
            weight: '78kg',
            maxLoad: '140kg'
        }),
        features: JSON.stringify([
            'Pin Lithium 48V 28Ah',
            'Động cơ 800W',
            'Phanh đĩa trước',
            'Đèn LED',
            'Cốp xe rộng rãi'
        ]),
        stock: 400,
        sold: 189
    },
    {
        name: 'TAILG City Rider',
        slug: 'tailg-city-rider',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 11490000,
        range: 55,
        top_speed: 40,
        acceleration: 0,
        description: 'Xe máy điện cho người đi làm với thiết kế gọn gàng, pin 48V 24Ah, tiết kiệm năng lượng.',
        is_featured: false,
        featured: false,
        specifications: JSON.stringify({
            battery: '48V 24Ah Lithium',
            motor: '600W',
            chargingTime: '4-6 giờ',
            weight: '72kg',
            maxLoad: '130kg'
        }),
        features: JSON.stringify([
            'Pin Lithium 48V 24Ah',
            'Động cơ 600W tiết kiệm',
            'Phanh đĩa/tang trống',
            'Đèn LED tiết kiệm',
            'Thiết kế nhỏ gọn'
        ]),
        stock: 300,
        sold: 156
    },
    {
        name: 'TAILG Eco S2',
        slug: 'tailg-eco-s2',
        brand: 'TAILG',
        type: 'motorcycle',
        price: 9990000,
        range: 50,
        top_speed: 35,
        acceleration: 0,
        description: 'Xe máy điện kinh tế nhất với pin 48V 20Ah, phù hợp học sinh, sinh viên và người thu nhập thấp.',
        is_featured: false,
        featured: false,
        specifications: JSON.stringify({
            battery: '48V 20Ah Lead-acid',
            motor: '500W',
            chargingTime: '6-8 giờ',
            weight: '68kg',
            maxLoad: '120kg'
        }),
        features: JSON.stringify([
            'Pin Axit 48V 20Ah',
            'Động cơ 500W',
            'Phanh tang trống',
            'Đèn tiêu chuẩn',
            'Giá cả phải chăng'
        ]),
        stock: 600,
        sold: 312
    },
    {
        name: 'TAILG Cargo Pro',
        slug: 'tailg-cargo-pro',
        brand: 'TAILG',
        type: 'bicycle',
        price: 13990000,
        range: 70,
        top_speed: 30,
        acceleration: 0,
        description: 'Xe đạp điện chở hàng chuyên dụng với khung xe bền chắc, pin 48V 30Ah, tải trọng lên đến 200kg.',
        is_featured: true,
        featured: true,
        specifications: JSON.stringify({
            battery: '48V 30Ah Lithium',
            motor: '500W',
            chargingTime: '5-7 giờ',
            weight: '55kg',
            maxLoad: '200kg'
        }),
        features: JSON.stringify([
            'Pin Lithium 48V 30Ah',
            'Khung thép chịu lực cao',
            'Thùng chở hàng lớn',
            'Phanh đĩa cơ',
            'Chống chọc trung tâm',
            'Giỏ sau rộng'
        ]),
        stock: 200,
        sold: 98
    },
    {
        name: 'TAILG Lady Grace',
        slug: 'tailg-lady-grace',
        brand: 'TAILG',
        type: 'bicycle',
        price: 10990000,
        range: 60,
        top_speed: 25,
        acceleration: 0,
        description: 'Xe đạp điện dành cho phụ nữ với thiết kế thanh lịch, yên êm ái, pin 36V 12Ah.',
        is_featured: true,
        featured: true,
        specifications: JSON.stringify({
            battery: '36V 12Ah Lithium',
            motor: '350W',
            chargingTime: '4-5 giờ',
            weight: '28kg',
            maxLoad: '100kg'
        }),
        features: JSON.stringify([
            'Pin Lithium 36V 12Ah',
            'Động cơ 350W êm ái',
            'Thiết kế nữ tính',
            'Yên ngồi êm',
            'Giỏ trước xinh xắn',
            'Màu sắc đa dạng'
        ]),
        stock: 350,
        sold: 167
    },
    {
        name: 'TAILG Urban E1',
        slug: 'tailg-urban-e1',
        brand: 'TAILG',
        type: 'bicycle',
        price: 8990000,
        range: 45,
        top_speed: 25,
        acceleration: 0,
        description: 'Xe đạp điện gấp gọn cho dân văn phòng, dễ dàng mang lên thang máy, pin 36V 10Ah.',
        is_featured: false,
        featured: false,
        specifications: JSON.stringify({
            battery: '36V 10Ah Lithium',
            motor: '250W',
            chargingTime: '3-4 giờ',
            weight: '22kg',
            maxLoad: '90kg'
        }),
        features: JSON.stringify([
            'Gấp gọn trong 10 giây',
            'Pin Lithium 36V 10Ah',
            'Trọng lượng nhẹ 22kg',
            'Bánh xe 16 inch',
            'Dễ dàng mang theo'
        ]),
        stock: 250,
        sold: 134
    },
    {
        name: 'TAILG Kids Joy',
        slug: 'tailg-kids-joy',
        brand: 'TAILG',
        type: 'bicycle',
        price: 6990000,
        range: 35,
        top_speed: 20,
        acceleration: 0,
        description: 'Xe đạp điện cho trẻ em từ 8-14 tuổi, an toàn với hệ thống phanh tốt, pin 24V 8Ah.',
        is_featured: false,
        featured: false,
        specifications: JSON.stringify({
            battery: '24V 8Ah Lithium',
            motor: '200W',
            chargingTime: '3-4 giờ',
            weight: '18kg',
            maxLoad: '60kg'
        }),
        features: JSON.stringify([
            'Pin Lithium 24V 8Ah',
            'Động cơ 200W an toàn',
            'Giới hạn tốc độ',
            'Phanh đĩa cơ',
            'Thiết kế cho trẻ em',
            'Màu sắc bắt mắt'
        ]),
        stock: 180,
        sold: 89
    }
];

function generateDocumentId() {
    // Generate random document_id like Strapi format
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 25; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function importData() {
    console.log('🚀 Importing TAILG data directly to database...\n');
    
    try {
        let successCount = 0;
        
        for (const model of carModels) {
            try {
                const documentId = generateDocumentId();
                const now = new Date().toISOString();
                
                const query = `
                    INSERT INTO car_models (
                        document_id, name, slug, brand, type, price, range, top_speed,
                        acceleration, description, is_featured, featured, specifications,
                        features, stock, sold, locale, created_at, updated_at, published_at
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
                    )
                    RETURNING id, name
                `;
                
                const values = [
                    documentId,
                    model.name,
                    model.slug,
                    model.brand,
                    model.type,
                    model.price,
                    model.range,
                    model.top_speed,
                    model.acceleration,
                    model.description,
                    model.is_featured,
                    model.featured,
                    model.specifications,
                    model.features,
                    model.stock,
                    model.sold,
                    'en', // locale
                    now,
                    now,
                    now
                ];
                
                const result = await pool.query(query, values);
                console.log(`✅ Created/Updated: ${model.name} (ID: ${result.rows[0].id})`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ Error with ${model.name}:`, error.message);
            }
        }
        
        console.log(`\n${'='.repeat(50)}`);
        console.log(`✅ Successfully imported: ${successCount}/${carModels.length}`);
        console.log(`${'='.repeat(50)}`);
        
        if (successCount === carModels.length) {
            console.log('\n🎉 All TAILG products imported to Supabase!');
            console.log('\n📋 Next steps:');
            console.log('1. Refresh Strapi Admin → Car Models');
            console.log('2. Data is now in production database');
            console.log('3. You can edit and publish in Strapi Admin');
        }
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
    } finally {
        await pool.end();
    }
}

importData();

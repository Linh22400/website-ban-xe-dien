/**
 * Import data via Strapi API (compatible with Strapi 5)
 * This ensures proper Document Service initialization
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

// Sample data for all collections
const data = {
  categories: [
    { Name: 'Xe máy điện', Slug: 'xe-may-dien', Subtitle: 'Xe máy điện thông minh', Link: '/cars?type=motorcycle', Color: 'from-blue-600 to-cyan-500', ColSpan: 'md:col-span-2', Order: 1 },
    { Name: 'Xe đạp điện', Slug: 'xe-dap-dien', Subtitle: 'Xe đạp điện tiện lợi', Link: '/cars?type=bicycle', Color: 'from-green-600 to-teal-500', ColSpan: 'md:col-span-1', Order: 2 },
    { Name: 'Phụ kiện', Slug: 'phu-kien', Subtitle: 'Phụ kiện chính hãng', Link: '/accessories', Color: 'from-purple-600 to-pink-500', ColSpan: 'md:col-span-1', Order: 3 }
  ],

  carModels: [
    {
      name: 'TAILG M3 Pro',
      slug: 'tailg-m3-pro',
      brand: 'TAILG',
      type: 'motorcycle',
      price: 15990000,
      range: 80,
      topSpeed: 55,
      acceleration: 5.5,
      description: 'Xe máy điện cao cấp TAILG M3 Pro với hiệu suất vượt trội',
      isFeatured: true,
      specifications: {
        battery: 'Lithium 60V 30Ah',
        motor: '1500W',
        chargingTime: '6-8 giờ',
        weight: '95kg'
      },
      features: ['Phanh ABS', 'Khóa thông minh', 'Màn hình LCD', 'Cổng USB sạc điện thoại'],
      stock: 50,
      sold: 12
    },
    {
      name: 'TAILG Thunder X1',
      slug: 'tailg-thunder-x1',
      brand: 'TAILG',
      type: 'motorcycle',
      price: 18500000,
      range: 100,
      topSpeed: 65,
      acceleration: 4.8,
      description: 'Xe điện thể thao TAILG Thunder X1 mạnh mẽ',
      isFeatured: true,
      specifications: {
        battery: 'Lithium 72V 35Ah',
        motor: '2000W',
        chargingTime: '7-9 giờ',
        weight: '105kg'
      },
      features: ['Phanh đĩa kép', 'Hệ thống định vị GPS', 'Chống trộm thông minh', 'Đèn LED tự động'],
      stock: 30,
      sold: 8
    },
    {
      name: 'TAILG City Rider',
      slug: 'tailg-city-rider',
      brand: 'TAILG',
      type: 'motorcycle',
      price: 12990000,
      range: 60,
      topSpeed: 45,
      acceleration: 6.2,
      description: 'Xe ga điện TAILG City Rider cho đô thị',
      isFeatured: false,
      specifications: {
        battery: 'Lithium 48V 25Ah',
        motor: '1000W',
        chargingTime: '5-6 giờ',
        weight: '75kg'
      },
      features: ['Thiết kế nhỏ gọn', 'Cốp xe rộng rãi', 'Tiết kiệm năng lượng'],
      stock: 80,
      sold: 25
    },
    {
      name: 'TAILG Eco S2',
      slug: 'tailg-eco-s2',
      brand: 'TAILG',
      type: 'bicycle',
      price: 8990000,
      range: 50,
      topSpeed: 35,
      acceleration: 7.0,
      description: 'Xe đạp điện TAILG Eco S2 thân thiện môi trường',
      isFeatured: false,
      specifications: {
        battery: 'Lithium 36V 10Ah',
        motor: '350W',
        chargingTime: '4-5 giờ',
        weight: '25kg'
      },
      features: ['Nhẹ nhàng', 'Gấp gọn được', 'Pin tháo rời'],
      stock: 100,
      sold: 45
    },
    {
      name: 'TAILG Cargo Pro',
      slug: 'tailg-cargo-pro',
      brand: 'TAILG',
      type: 'motorcycle',
      price: 22000000,
      range: 70,
      topSpeed: 40,
      acceleration: 8.0,
      description: 'Xe tải điện TAILG Cargo Pro cho vận chuyển hàng hóa',
      isFeatured: false,
      specifications: {
        battery: 'Lithium 60V 40Ah',
        motor: '1200W',
        chargingTime: '8-10 giờ',
        weight: '180kg',
        payload: '300kg'
      },
      features: ['Thùng xe lớn', 'Khung xe chắc chắn', 'Phanh thủy lực'],
      stock: 20,
      sold: 5
    },
    {
      name: 'TAILG Lady Grace',
      slug: 'tailg-lady-grace',
      brand: 'TAILG',
      type: 'motorcycle',
      price: 13500000,
      range: 65,
      topSpeed: 45,
      acceleration: 6.0,
      description: 'Xe ga điện TAILG Lady Grace dành cho phái đẹp',
      isFeatured: true,
      specifications: {
        battery: 'Lithium 48V 28Ah',
        motor: '1100W',
        chargingTime: '5-7 giờ',
        weight: '70kg'
      },
      features: ['Thiết kế thanh lịch', 'Màu sắc đa dạng', 'Yên xe êm ái'],
      stock: 60,
      sold: 18
    },
    {
      name: 'TAILG Urban E1',
      slug: 'tailg-urban-e1',
      brand: 'TAILG',
      type: 'bicycle',
      price: 10500000,
      range: 55,
      topSpeed: 40,
      acceleration: 6.5,
      description: 'Xe đạp điện TAILG Urban E1 phong cách đô thị',
      isFeatured: false,
      specifications: {
        battery: 'Lithium 36V 12Ah',
        motor: '500W',
        chargingTime: '4-6 giờ',
        weight: '28kg'
      },
      features: ['Chế độ trợ lực', 'Bàn đạp tích hợp', 'Đèn LED sáng'],
      stock: 70,
      sold: 22
    },
    {
      name: 'TAILG Kids Joy',
      slug: 'tailg-kids-joy',
      brand: 'TAILG',
      type: 'bicycle',
      price: 6500000,
      range: 30,
      topSpeed: 25,
      acceleration: 8.5,
      description: 'Xe đạp điện TAILG Kids Joy an toàn cho trẻ em',
      isFeatured: false,
      specifications: {
        battery: 'Lithium 24V 8Ah',
        motor: '250W',
        chargingTime: '3-4 giờ',
        weight: '18kg'
      },
      features: ['An toàn cho trẻ em', 'Tốc độ giới hạn', 'Thiết kế đáng yêu'],
      stock: 40,
      sold: 15
    }
  ],

  showrooms: [
    {
      Name: 'Showroom Hà Nội',
      Code: 'HN001',
      Address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      City: 'Hà Nội',
      District: 'Thanh Xuân',
      Phone: '0241234567',
      Email: 'hanoi@tailg.vn',
      Manager: 'Nguyễn Văn A',
      WorkingHours: { monday: '8:00-20:00', tuesday: '8:00-20:00', wednesday: '8:00-20:00', thursday: '8:00-20:00', friday: '8:00-20:00', saturday: '8:00-20:00', sunday: '8:00-20:00' },
      Latitude: 21.0285,
      Longitude: 105.8542
    },
    {
      Name: 'Showroom TP.HCM',
      Code: 'HCM001',
      Address: '456 Lê Văn Việt, Quận 9, TP.HCM',
      City: 'TP.HCM',
      District: 'Quận 9',
      Phone: '0287654321',
      Email: 'hcm@tailg.vn',
      Manager: 'Trần Thị B',
      WorkingHours: { monday: '8:00-21:00', tuesday: '8:00-21:00', wednesday: '8:00-21:00', thursday: '8:00-21:00', friday: '8:00-21:00', saturday: '8:00-21:00', sunday: '8:00-21:00' },
      Latitude: 10.7769,
      Longitude: 106.7009
    },
    {
      Name: 'Showroom Đà Nẵng',
      Code: 'DN001',
      Address: '789 Điện Biên Phủ, Hải Châu, Đà Nẵng',
      City: 'Đà Nẵng',
      District: 'Hải Châu',
      Phone: '0236999888',
      Email: 'danang@tailg.vn',
      Manager: 'Lê Văn C',
      WorkingHours: { monday: '8:00-20:00', tuesday: '8:00-20:00', wednesday: '8:00-20:00', thursday: '8:00-20:00', friday: '8:00-20:00', saturday: '8:00-20:00', sunday: '8:00-20:00' },
      Latitude: 16.0471,
      Longitude: 108.2068
    }
  ],

  promotions: [
    {
      title: 'Giảm 20% cho khách hàng mới',
      description: 'Giảm giá 20% cho tất cả khách hàng mua xe lần đầu',
      discountTag: 'GIẢM 20%',
      discountPercent: 20,
      link: '/promotions/giam-20-khach-hang-moi',
      expiryDate: '2026-03-31T23:59:59.000Z',
      isActive: true
    },
    {
      title: 'Tặng bảo hiểm 1 năm',
      description: 'Tặng kèm bảo hiểm vật chất 1 năm khi mua xe',
      discountTag: 'QUÀ TẶNG',
      discountPercent: 0,
      link: '/promotions/tang-bao-hiem',
      expiryDate: '2026-06-30T23:59:59.000Z',
      isActive: true
    }
  ],

  accessories: [
    {
      Name: 'Mũ bảo hiểm TAILG Premium',
      Slug: 'mu-bao-hiem-tailg-premium',
      Description: 'Mũ bảo hiểm chính hãng TAILG, đạt chuẩn an toàn',
      Price: 450000,
      Category: 'helmet',
      Is_Featured: true
    },
    {
      Name: 'Bộ sạc dự phòng',
      Slug: 'bo-sac-du-phong',
      Description: 'Bộ sạc dự phòng di động cho xe điện',
      Price: 1200000,
      Category: 'charger',
      Is_Featured: true
    },
    {
      Name: 'Pin lithium 60V',
      Slug: 'pin-lithium-60v',
      Description: 'Pin lithium chính hãng TAILG 60V 30Ah',
      Price: 8500000,
      Category: 'battery',
      Is_Featured: false
    }
  ],

  articleCategories: [
    { name: 'Tin tức', slug: 'tin-tuc' },
    { name: 'Hướng dẫn', slug: 'huong-dan' },
    { name: 'Khuyến mãi', slug: 'khuyen-mai' }
  ],

  articles: [
    {
      Title: '5 lý do nên chọn xe điện TAILG',
      Slug: '5-ly-do-nen-chon-xe-dien-tailg',
      Excerpt: 'Khám phá 5 lý do hàng đầu khiến xe điện TAILG trở thành lựa chọn của hàng nghìn người dùng',
      Tags: 'xe điện, TAILG, tin tức',
      Author: 'Admin',
      Published_Date: new Date().toISOString().split('T')[0],
      Reading_Time: 5,
      Featured: true,
      seoTitle: '5 lý do nên chọn xe điện TAILG - Top xe điện 2026',
      seoDescription: 'Khám phá 5 lý do hàng đầu khiến xe điện TAILG trở thành lựa chọn của hàng nghìn người dùng Việt Nam'
    },
    {
      Title: 'Hướng dẫn bảo dưỡng xe điện định kỳ',
      Slug: 'huong-dan-bao-duong-xe-dien-dinh-ky',
      Excerpt: 'Hướng dẫn chi tiết cách bảo dưỡng xe điện để kéo dài tuổi thọ và tối ưu hiệu suất',
      Tags: 'hướng dẫn, bảo dưỡng, xe điện',
      Author: 'Admin',
      Published_Date: new Date().toISOString().split('T')[0],
      Reading_Time: 8,
      Featured: false,
      seoTitle: 'Hướng dẫn bảo dưỡng xe điện định kỳ - TAILG Việt Nam',
      seoDescription: 'Hướng dẫn chi tiết cách bảo dưỡng xe điện để kéo dài tuổi thọ và tối ưu hiệu suất cho xe của bạn'
    }
  ]
};

// Helper function to create entry via API
async function createEntry(token, contentType, data) {
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/${contentType}`,
      { data },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    const errorData = error.response?.data?.error;
    // Check if it's a duplicate error
    if (errorData?.message?.includes('unique') || 
        errorData?.details?.errors?.some(e => e.message?.includes('unique'))) {
      return { success: false, skipped: true, reason: 'Already exists' };
    }
    // For other errors, return full error details
    const errorDetail = errorData || { message: error.message };
    return { success: false, skipped: false, error: errorDetail };
  }
}

// Main import function
async function importData(token) {
  console.log('🚀 Starting data import via Strapi API...\n');

  const stats = {
    categories: { created: 0, skipped: 0, failed: 0 },
    carModels: { created: 0, skipped: 0, failed: 0 },
    showrooms: { created: 0, skipped: 0, failed: 0 },
    promotions: { created: 0, skipped: 0, failed: 0 },
    accessories: { created: 0, skipped: 0, failed: 0 },
    articleCategories: { created: 0, skipped: 0, failed: 0 },
    articles: { created: 0, skipped: 0, failed: 0 }
  };

  try {
    // 1. Import Categories
    console.log('📁 Importing Categories...');
    for (const category of data.categories) {
      const result = await createEntry(token, 'categories', category);
      if (result.success) {
        console.log(`  ✅ Created: ${category.Name}`);
        stats.categories.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${category.Name} (${result.reason})`);
        stats.categories.skipped++;
      } else {
        console.log(`  ❌ Failed: ${category.Name}`);
        stats.categories.failed++;
      }
    }

    // 2. Import Car Models
    console.log('\n🚗 Importing Car Models...');
    for (const carModel of data.carModels) {
      const result = await createEntry(token, 'car-models', carModel);
      if (result.success) {
        console.log(`  ✅ Created: ${carModel.name}`);
        stats.carModels.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${carModel.name} (${result.reason})`);
        stats.carModels.skipped++;
      } else {
        console.log(`  ❌ Failed: ${carModel.name}`);
        if (result.error) {
          console.log(`     ${result.error.message || 'Unknown error'}`);
          if (result.error.details) {
            console.log(`     Details:`, JSON.stringify(result.error.details, null, 2));
          }
        }
        stats.carModels.failed++;
      }
    }

    // 3. Import Showrooms
    console.log('\n🏢 Importing Showrooms...');
    for (const showroom of data.showrooms) {
      const result = await createEntry(token, 'showrooms', showroom);
      if (result.success) {
        console.log(`  ✅ Created: ${showroom.Name}`);
        stats.showrooms.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${showroom.Name} (${result.reason})`);
        stats.showrooms.skipped++;
      } else {
        console.log(`  ❌ Failed: ${showroom.Name}`);
        stats.showrooms.failed++;
      }
    }

    // 4. Import Promotions
    console.log('\n🎁 Importing Promotions...');
    for (const promotion of data.promotions) {
      const result = await createEntry(token, 'promotions', promotion);
      if (result.success) {
        console.log(`  ✅ Created: ${promotion.title}`);
        stats.promotions.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${promotion.title} (${result.reason})`);
        stats.promotions.skipped++;
      } else {
        console.log(`  ❌ Failed: ${promotion.title}`);
        stats.promotions.failed++;
      }
    }

    // 5. Import Accessories
    console.log('\n🛠️  Importing Accessories...');
    for (const accessory of data.accessories) {
      const result = await createEntry(token, 'accessories', accessory);
      if (result.success) {
        console.log(`  ✅ Created: ${accessory.Name}`);
        stats.accessories.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${accessory.Name} (${result.reason})`);
        stats.accessories.skipped++;
      } else {
        console.log(`  ❌ Failed: ${accessory.Name}`);
        stats.accessories.failed++;
      }
    }

    // 6. Import Article Categories
    console.log('\n📚 Importing Article Categories...');
    for (const articleCategory of data.articleCategories) {
      const result = await createEntry(token, 'article-categories', articleCategory);
      if (result.success) {
        console.log(`  ✅ Created: ${articleCategory.name}`);
        stats.articleCategories.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${articleCategory.name} (${result.reason})`);
        stats.articleCategories.skipped++;
      } else {
        console.log(`  ❌ Failed: ${articleCategory.name}`);
        stats.articleCategories.failed++;
      }
    }

    // 7. Import Articles
    console.log('\n📝 Importing Articles...');
    for (const article of data.articles) {
      const result = await createEntry(token, 'articles', article);
      if (result.success) {
        console.log(`  ✅ Created: ${article.Title}`);
        stats.articles.created++;
      } else if (result.skipped) {
        console.log(`  ⏭️  Skipped: ${article.Title} (${result.reason})`);
        stats.articles.skipped++;
      } else {
        console.log(`  ❌ Failed: ${article.Title}`);
        stats.articles.failed++;
      }
    }

    console.log('\n✅ Import completed!');
    console.log('\n📊 Summary:');
    console.log(`  Categories:         ${stats.categories.created} created, ${stats.categories.skipped} skipped, ${stats.categories.failed} failed`);
    console.log(`  Car Models:         ${stats.carModels.created} created, ${stats.carModels.skipped} skipped, ${stats.carModels.failed} failed`);
    console.log(`  Showrooms:          ${stats.showrooms.created} created, ${stats.showrooms.skipped} skipped, ${stats.showrooms.failed} failed`);
    console.log(`  Promotions:         ${stats.promotions.created} created, ${stats.promotions.skipped} skipped, ${stats.promotions.failed} failed`);
    console.log(`  Accessories:        ${stats.accessories.created} created, ${stats.accessories.skipped} skipped, ${stats.accessories.failed} failed`);
    console.log(`  Article Categories: ${stats.articleCategories.created} created, ${stats.articleCategories.skipped} skipped, ${stats.articleCategories.failed} failed`);
    console.log(`  Articles:           ${stats.articles.created} created, ${stats.articles.skipped} skipped, ${stats.articles.failed} failed`);

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Get token and run import
async function main() {
  // Check if token is provided as argument
  const token = process.argv[2];
  
  if (!token) {
    console.log('❌ Missing API token!');
    console.log('\n📋 How to get API token:');
    console.log('1. Open Strapi Admin: http://localhost:1337/admin');
    console.log('2. Go to: Settings > API Tokens');
    console.log('3. Click "Create new API Token"');
    console.log('4. Name: "Import Script"');
    console.log('5. Token type: "Full access"');
    console.log('6. Copy the token and run:');
    console.log('\n   node scripts/import-via-api.js YOUR_TOKEN_HERE\n');
    process.exit(1);
  }

  await importData(token);
}

main();

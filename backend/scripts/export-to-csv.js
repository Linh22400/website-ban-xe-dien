/**
 * Script để export data từ Strapi API sang CSV files
 * 
 * Cách dùng:
 * 1. Start Strapi local với SQLite: npm run develop
 * 2. Chạy script này: node scripts/export-to-csv.js
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const OUTPUT_DIR = path.join(__dirname, '..', 'exports', 'csv');

// Danh sách content types cần export
const CONTENT_TYPES = [
    'car-models',
    'categories', 
    'accessories',
    'articles',
    'article-categories',
    'showrooms',
    'warranties',
    'services',
    'promotions',
    'faqs',
    'gifts',
    'testimonials'
];

// Tạo thư mục output
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert value to CSV format
function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    
    // Handle objects/arrays
    if (typeof value === 'object') {
        return escapeCSV(JSON.stringify(value));
    }
    
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Flatten object for CSV
function flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
            flattened[prefix + key] = '';
            continue;
        }
        
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            // Nested object - flatten recursively
            Object.assign(flattened, flattenObject(obj[key], prefix + key + '_'));
        } else if (Array.isArray(obj[key])) {
            // Array - stringify
            flattened[prefix + key] = JSON.stringify(obj[key]);
        } else {
            flattened[prefix + key] = obj[key];
        }
    }
    
    return flattened;
}

// Fetch data từ Strapi
async function fetchData(contentType) {
    try {
        const url = `${STRAPI_URL}/api/${contentType}?pagination[limit]=1000&populate=*`;
        console.log(`   Fetching: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const json = await response.json();
        return json.data || [];
    } catch (err) {
        console.log(`   ⚠️  Lỗi: ${err.message}`);
        return [];
    }
}

// Export một content type
async function exportContentType(contentType) {
    console.log(`\n📦 ${contentType}:`);
    
    const data = await fetchData(contentType);
    
    if (data.length === 0) {
        console.log(`   ℹ️  Không có data, bỏ qua.`);
        return;
    }
    
    console.log(`   ✓ Lấy được ${data.length} items`);
    
    // Flatten data
    const flattened = data.map(item => {
        const flat = flattenObject({
            id: item.id,
            documentId: item.documentId,
            ...item
        });
        return flat;
    });
    
    // Lấy tất cả columns
    const allColumns = new Set();
    flattened.forEach(row => {
        Object.keys(row).forEach(col => allColumns.add(col));
    });
    const columns = Array.from(allColumns);
    
    // Tạo CSV
    const csvHeader = columns.join(',');
    const csvRows = flattened.map(row => {
        return columns.map(col => escapeCSV(row[col] || '')).join(',');
    });
    
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Ghi file
    const fileName = contentType.replace(/\//g, '-');
    const filePath = path.join(OUTPUT_DIR, `${fileName}.csv`);
    fs.writeFileSync(filePath, '\ufeff' + csvContent, 'utf8'); // BOM for Excel
    
    console.log(`   ✅ Exported: ${filePath}`);
}

// Main
async function main() {
    console.log('🚀 Export Strapi data to CSV\n');
    console.log(`📡 Strapi URL: ${STRAPI_URL}`);
    console.log(`📁 Output: ${OUTPUT_DIR}\n`);
    console.log('⚠️  Đảm bảo Strapi đang chạy với SQLite local!\n');
    
    for (const contentType of CONTENT_TYPES) {
        await exportContentType(contentType);
    }
    
    console.log('\n🎉 Export hoàn tất!\n');
    console.log('📋 Hướng dẫn import vào Supabase:');
    console.log('   1. Vào https://supabase.com → Project → Table Editor');
    console.log('   2. Chọn table tương ứng');
    console.log('   3. Click "Insert" → "Import data from CSV"');
    console.log('   4. Upload file CSV\n');
    console.log('💡 Tips:');
    console.log('   - Đối với relations (foreign keys), cần map đúng ID');
    console.log('   - Có thể cần import theo thứ tự: categories → car-models → ...');
    console.log('   - Nếu table chưa có, Strapi đã tạo schema rồi\n');
}

main().catch(console.error);

// Script to seed sample car data
// Run: node seed-data.js

const sampleCars = [
    {
        name: "Giant E-Bike Pro",
        slug: "xe-dap-dien-giant",
        brand: "Giant",
        type: "bicycle",
        price: 25000000,
        range: 80,
        topSpeed: 25,
        acceleration: 0,
        description: "Xe đạp điện Giant với thiết kế hiện đại, phù hợp cho di chuyển trong thành phố.",
        featured: true,
        colors: [
            { name: "Đen Bóng", hex: "#000000" },
            { name: "Trắng Ngọc", hex: "#ffffff" },
            { name: "Xanh Dương", hex: "#0066cc" }
        ],
        specifications: {
            battery: "48V 10Ah",
            motor: "250W",
            weight: "22kg",
            maxLoad: "120kg"
        }
    },
    {
        name: "VinFast Klara S",
        slug: "xe-may-dien-vinfast-klara",
        brand: "VinFast",
        type: "motorcycle",
        price: 35000000,
        range: 120,
        topSpeed: 50,
        acceleration: 0,
        description: "Xe máy điện VinFast Klara S với công nghệ pin tiên tiến, thiết kế sang trọng.",
        featured: true,
        colors: [
            { name: "Đỏ Rượu", hex: "#8B0000" },
            { name: "Trắng Ngọc Trai", hex: "#f5f5f5" },
            { name: "Đen Huyền Bí", hex: "#1a1a1a" }
        ],
        specifications: {
            battery: "60V 28Ah",
            motor: "1200W",
            weight: "95kg",
            maxLoad: "150kg"
        }
    },
    {
        name: "Trek Verve+ 3",
        slug: "xe-dap-dien-trek",
        brand: "Trek",
        type: "bicycle",
        price: 32000000,
        range: 90,
        topSpeed: 25,
        acceleration: 0,
        description: "Xe đạp điện Trek cao cấp với hệ thống trợ lực thông minh.",
        featured: false,
        colors: [
            { name: "Xanh Lá", hex: "#228B22" },
            { name: "Xám Titan", hex: "#808080" }
        ],
        specifications: {
            battery: "500Wh",
            motor: "250W Bosch",
            weight: "24kg",
            maxLoad: "136kg"
        }
    },
    {
        name: "Yadea G5",
        slug: "xe-may-dien-yadea",
        brand: "Yadea",
        type: "motorcycle",
        price: 28000000,
        range: 100,
        topSpeed: 45,
        acceleration: 0,
        description: "Xe máy điện Yadea G5 - Giải pháp di chuyển xanh, tiết kiệm cho gia đình.",
        featured: false,
        colors: [
            { name: "Xanh Ngọc", hex: "#00CED1" },
            { name: "Cam Năng Động", hex: "#FF6347" },
            { name: "Trắng Tinh Khôi", hex: "#ffffff" }
        ],
        specifications: {
            battery: "60V 20Ah",
            motor: "800W",
            weight: "85kg",
            maxLoad: "150kg"
        }
    }
];

console.log('Sample car data ready!');
console.log('Total cars:', sampleCars.length);
console.log('\nYou can manually add these to Strapi admin panel:');
console.log('http://localhost:1337/admin/content-manager/collection-types/api::car-model.car-model');

module.exports = sampleCars;

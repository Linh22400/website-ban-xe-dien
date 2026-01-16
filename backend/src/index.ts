import type { Core } from '@strapi/strapi';

const tailgModels: any[] = [
  // --- MOTORCYCLES (Xe máy điện) ---
  {
    name: "TAILG Nolan",
    slug: "tailg-nolan",
    brand: "TAILG",
    type: "motorcycle",
    price: 19500000,
    range: 90,
    topSpeed: 50,
    acceleration: 0,
    description: "Xe máy điện TAILG Nolan với thiết kế độc đáo, dễ thương, phù hợp cho học sinh, sinh viên và nhân viên văn phòng. Xe được trang bị màn hình LCD thông minh, khóa Smartkey chống trộm và ắc quy 72V 22.3Ah cho quãng đường di chuyển ấn tượng.",
    isFeatured: true,
    featured: true,
    stock: 50,
    colors: [
      { name: "Trắng Ngọc Trai", hex: "#FFFFFF", price: 19500000, stock: 15 },
      { name: "Xanh Cổ Vịt", hex: "#008080", price: 19500000, stock: 15 },
      { name: "Đỏ Mận", hex: "#8B0000", price: 19500000, stock: 10 },
      { name: "Đen Bóng", hex: "#000000", price: 19500000, stock: 10 }
    ],
    options: [
      { name: "Ắc quy Axit-chì (72V 22.3Ah)", group: "Battery", priceAdjustment: 0, stock: 100 },
      { name: "Pin Lithium (72V 30Ah)", group: "Battery", priceAdjustment: 4000000, stock: 20 },
      { name: "Phanh Đĩa Trước", group: "Brakes", priceAdjustment: 0, stock: 100 },
      { name: "Phanh Đĩa Trước & Sau", group: "Brakes", priceAdjustment: 800000, stock: 50 }
    ],
    specifications: {
      battery: "72V 22.3Ah (Ắc quy Axit-chì)",
      motor: "1000W",
      chargingTime: "8-10 giờ",
      brakes: "Phanh đĩa trước, phanh cơ sau",
      suspension: "Giảm xóc thủy lực",
      dimension: "1750mm x 700mm x 1100mm",
      weight: "95kg",
      maxLoad: "150kg"
    }
  },
  {
    name: "TAILG T71",
    slug: "tailg-t71",
    brand: "TAILG",
    type: "motorcycle",
    price: 26000000,
    range: 100,
    topSpeed: 55,
    acceleration: 0,
    description: "TAILG T71 mang phong cách thể thao mạnh mẽ, tương tự các dòng xe tay ga cao cấp. Sở hữu động cơ 2000W và ắc quy 96V cực khủng, đây là mẫu xe dành cho những ai đam mê tốc độ và sự cá tính.",
    isFeatured: true,
    featured: true,
    stock: 30,
    colors: [
      { name: "Đen Nhám", hex: "#1C1C1C", price: 26500000, stock: 10 },
      { name: "Xanh GP", hex: "#0000FF", price: 26000000, stock: 10 },
      { name: "Xám Xi Măng", hex: "#808080", price: 26000000, stock: 10 }
    ],
    options: [
      { name: "Ắc quy 96V 22.3Ah", group: "Battery", priceAdjustment: 0, stock: 50 },
      { name: "Pin Graphene Cao Cấp", group: "Battery", priceAdjustment: 3500000, stock: 20 },
      { name: "Bản Sport (Tem Đấu + Smartkey)", group: "Version", priceAdjustment: 1500000, stock: 30 }
    ],
    specifications: {
      battery: "96V 22.3Ah",
      motor: "2000W",
      chargingTime: "10-12 giờ",
      brakes: "Phanh đĩa trước/sau",
      suspension: "Giảm xóc đôi",
      weight: "110kg",
      maxLoad: "180kg"
    }
  },
  {
    name: "TAILG R71",
    slug: "tailg-r71",
    brand: "TAILG",
    type: "motorcycle",
    price: 20800000,
    range: 70,
    topSpeed: 45,
    acceleration: 0,
    description: "TAILG R71 sở hữu thiết kế cổ điển, thanh lịch, lấy cảm hứng từ những mẫu xe tay ga Ý. Phù hợp với phái đẹp nhờ cốp rộng 30L và sàn để chân thoải mái.",
    isFeatured: false,
    featured: false,
    stock: 40,
    colors: [
      { name: "Kem Sữa", hex: "#FFFDD0", price: 20800000, stock: 20 },
      { name: "Đỏ Đô", hex: "#800000", price: 20800000, stock: 10 },
      { name: "Xanh Rêu", hex: "#556B2F", price: 20800000, stock: 10 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 100 },
      { name: "Cao Cấp (Khóa NFC + Chống trộm)", group: "Version", priceAdjustment: 1200000, stock: 50 },
      { name: "Lắp thêm khung bảo vệ inox", group: "Accessories", priceAdjustment: 800000, stock: 50 }
    ],
    specifications: {
      battery: "60V 20Ah",
      motor: "1500W",
      chargingTime: "8 giờ",
      brakes: "Phanh đĩa trước",
      weight: "90kg",
      maxLoad: "150kg"
    }
  },
  {
    name: "TAILG F52",
    slug: "tailg-f52",
    brand: "TAILG",
    type: "motorcycle",
    price: 21000000,
    range: 70,
    topSpeed: 49,
    acceleration: 0,
    description: "TAILG F52 nổi bật với thiết kế hiện đại, công nghệ khóa thông minh NFC và khả năng chống nước IP67. Một lựa chọn cân bằng giữa hiệu suất và tiện ích.",
    isFeatured: false,
    featured: false,
    stock: 40,
    colors: [
      { name: "Trắng", hex: "#FFFFFF", price: 21000000, stock: 20 },
      { name: "Đen", hex: "#000000", price: 21000000, stock: 20 }
    ],
    options: [
      { name: "Ắc quy 60V 22.3Ah", group: "Battery", priceAdjustment: 0, stock: 50 },
      { name: "Nâng cấp 72V 22.3Ah", group: "Battery", priceAdjustment: 1500000, stock: 30 }
    ],
    specifications: {
      battery: "60V 22.3Ah",
      motor: "1500W",
      chargingTime: "8 giờ",
      brakes: "Phanh đĩa",
      weight: "92kg"
    }
  },
  {
    name: "TAILG R53",
    slug: "tailg-r53",
    brand: "TAILG",
    type: "motorcycle",
    price: 19950000,
    range: 75,
    topSpeed: 45,
    acceleration: 0,
    description: "Mẫu xe thông minh TAILG R53 với thiết kế gọn gàng, linh hoạt trong đô thị. Tích hợp nhiều công nghệ an toàn và tiết kiệm năng lượng.",
    isFeatured: false,
    featured: false,
    stock: 35,
    colors: [
      { name: "Xanh Dương", hex: "#4169E1", price: 19950000, stock: 15 },
      { name: "Xám", hex: "#A9A9A9", price: 19950000, stock: 20 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Bản Plus (Cốp rộng + Sạc USB)", group: "Version", priceAdjustment: 500000, stock: 30 }
    ],
    specifications: {
      battery: "60V 20Ah",
      motor: "1000W",
      chargingTime: "8 giờ",
      weight: "88kg"
    }
  },
  {
    name: "TAILG R51",
    slug: "tailg-r51",
    brand: "TAILG",
    type: "motorcycle",
    price: 16900000,
    range: 70,
    topSpeed: 45,
    acceleration: 0,
    description: "TAILG R51 sở hữu thiết kế hiện đại thời trang cùng khả năng vận hành mạnh mẽ. Chất lượng đạt chuẩn xuất khẩu Châu Âu.",
    isFeatured: false,
    featured: false,
    stock: 40,
    colors: [
      { name: "Trắng", hex: "#FFFFFF", price: 16900000, stock: 20 },
      { name: "Đỏ", hex: "#FF0000", price: 16900000, stock: 10 },
      { name: "Xanh", hex: "#0000FF", price: 16900000, stock: 10 }
    ],
    options: [
      { name: "Phanh Cơ", group: "Brakes", priceAdjustment: 0, stock: 50 },
      { name: "Phanh Đĩa Trước", group: "Brakes", priceAdjustment: 600000, stock: 30 }
    ],
    specifications: {
      battery: "60V 20Ah",
      motor: "1000W",
      chargingTime: "8 giờ",
      brakes: "Phanh đĩa/cơ",
      weight: "90kg"
    }
  },
  {
    name: "TAILG R52",
    slug: "tailg-r52",
    brand: "TAILG",
    type: "motorcycle",
    price: 18990000,
    range: 75,
    topSpeed: 50,
    acceleration: 0,
    description: "TAILG R52 gây ấn tượng mạnh mẽ nhờ thiết kế sang trọng, thanh lịch kiểu dáng Vespa, phù hợp cho phái nữ.",
    isFeatured: true,
    featured: true,
    stock: 40,
    colors: [
      { name: "Kem Sữa", hex: "#FFFDD0", price: 18990000, stock: 20 },
      { name: "Xanh Rêu", hex: "#556B2F", price: 18990000, stock: 20 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Bản Đặc Biệt (Sơn nhám + Viền crom)", group: "Version", priceAdjustment: 1000000, stock: 20 }
    ],
    specifications: {
      battery: "60V 20Ah",
      motor: "1000W",
      chargingTime: "8 giờ",
      brakes: "Phanh đĩa",
      weight: "95kg"
    }
  },
  {
    name: "TAILG R31",
    slug: "tailg-r31",
    brand: "TAILG",
    type: "motorcycle",
    price: 14990000,
    range: 80,
    topSpeed: 45,
    acceleration: 0,
    description: "TAILG R31 có thiết kế bo tròn độc đáo kiểu Gogo, nhỏ gọn và dễ điều khiển.",
    isFeatured: false,
    featured: false,
    stock: 30,
    colors: [
      { name: "Cam", hex: "#FFA500", price: 14990000, stock: 15 },
      { name: "Xanh Cửu Long", hex: "#000080", price: 14990000, stock: 15 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Bản Sport (Đồng hồ điện tử lớn)", group: "Version", priceAdjustment: 500000, stock: 30 }
    ],
    specifications: {
      battery: "60V 20Ah",
      motor: "1000W",
      chargingTime: "8 giờ",
      weight: "85kg"
    }
  },
  {
    name: "TAILG F55",
    slug: "tailg-f55",
    brand: "TAILG",
    type: "motorcycle",
    price: 21000000,
    range: 100,
    topSpeed: 65,
    acceleration: 0,
    description: "TAILG F55 trang bị động cơ 2000W mạnh mẽ, giúp đạt vận tốc tối đa 65km/h. Thiết kế thể thao, hầm hố.",
    isFeatured: false,
    featured: false,
    stock: 30,
    colors: [
      { name: "Đen Nhám", hex: "#1C1C1C", price: 21000000, stock: 15 },
      { name: "Xám Bạc", hex: "#C0C0C0", price: 21000000, stock: 15 }
    ],
    options: [
      { name: "Ắc quy 72V 38Ah", group: "Battery", priceAdjustment: 0, stock: 50 },
      { name: "Pin Lithium 72V 40Ah", group: "Battery", priceAdjustment: 5000000, stock: 10 }
    ],
    specifications: {
      battery: "72V 38Ah Graphene",
      motor: "2000W",
      chargingTime: "6-8 giờ",
      brakes: "Phanh đĩa trước/sau",
      weight: "102kg"
    }
  },
  {
    name: "TAILG F73",
    slug: "tailg-f73",
    brand: "TAILG",
    type: "motorcycle",
    price: 22500000,
    range: 100,
    topSpeed: 65,
    acceleration: 0,
    description: "TAILG F73 là phiên bản nâng cấp với ngoại hình góc cạnh, động cơ 2000W và khả năng vận hành ổn định ở tốc độ cao.",
    isFeatured: false,
    featured: false,
    stock: 30,
    colors: [
      { name: "Đỏ", hex: "#FF0000", price: 22500000, stock: 15 },
      { name: "Đen", hex: "#000000", price: 22500000, stock: 15 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Bản Racing (Phanh ABS)", group: "Version", priceAdjustment: 2500000, stock: 10 }
    ],
    specifications: {
      battery: "72V 38Ah",
      motor: "2000W",
      chargingTime: "6-8 giờ",
      brakes: "Phanh đĩa",
      weight: "105kg"
    }
  },
  {
    name: "TAILG F72",
    slug: "tailg-f72",
    brand: "TAILG",
    type: "motorcycle",
    price: 49900000,
    range: 180,
    topSpeed: 60,
    acceleration: 0,
    description: "Siêu phẩm TAILG F72 với động cơ 3000W, pin Graphene 96V52Ah cho quãng đường kỷ lục 180km. Thiết kế đẳng cấp.",
    isFeatured: true,
    featured: true,
    stock: 10,
    colors: [
      { name: "Đen Bóng", hex: "#000000", price: 49900000, stock: 5 },
      { name: "Xám Lông Chuột", hex: "#708090", price: 49900000, stock: 5 }
    ],
    options: [
      { name: "Pin Graphene 96V 52Ah", group: "Battery", priceAdjustment: 0, stock: 20 },
      { name: "Pin Lithium 96V 60Ah (Siêu Nhẹ)", group: "Battery", priceAdjustment: 8000000, stock: 5 }
    ],
    specifications: {
      battery: "96V 52Ah Graphene",
      motor: "3000W",
      chargingTime: "6-8 giờ",
      brakes: "Phanh đĩa đôi",
      weight: "120kg"
    }
  },
  {
    name: "TAILG S92 Pro",
    slug: "tailg-s92-pro",
    brand: "TAILG",
    type: "motorcycle",
    price: 52000000,
    range: 100,
    topSpeed: 80,
    acceleration: 0,
    description: "TAILG S92 Pro - 'Nhà thám hiểm tầm xa' với động cơ khủng 5200W, tốc độ 80km/h. Tích hợp camera hành trình và nhiều công nghệ AI.",
    isFeatured: true,
    featured: true,
    stock: 10,
    colors: [
      { name: "Bạc Titanium", hex: "#C0C0C0", price: 52000000, stock: 5 },
      { name: "Đen Mờ", hex: "#2F2F2F", price: 52000000, stock: 5 }
    ],
    options: [
      { name: "Bản Standard", group: "Version", priceAdjustment: 0, stock: 20 },
      { name: "Bản AI (Camera + Cảm biến)", group: "Version", priceAdjustment: 3000000, stock: 10 }
    ],
    specifications: {
      battery: "72V 28Ah Lithium x2",
      motor: "5200W",
      chargingTime: "4-6 giờ (Sạc nhanh)",
      brakes: "Phanh đĩa CBS",
      weight: "115kg"
    }
  },
  {
    name: "TAILG T72",
    slug: "tailg-t72",
    brand: "TAILG",
    type: "motorcycle",
    price: 27500000,
    range: 110,
    topSpeed: 60,
    acceleration: 0,
    description: "TAILG T72 - Phiên bản nâng cấp toàn diện của dòng T-Series. Thiết kế khí động học, động cơ hiệu suất cao và hệ thống treo thể thao mang lại trải nghiệm lái phấn khích.",
    isFeatured: true,
    featured: true,
    stock: 25,
    colors: [
      { name: "Đỏ Sport", hex: "#FF0000", price: 25500000, stock: 10 },
      { name: "Đen Carbon", hex: "#2F2F2F", price: 27500000, stock: 15 }
    ],
    options: [
      { name: "Ắc quy Tiêu Chuẩn (96V 22.3Ah)", group: "Battery", priceAdjustment: 0, stock: 100 },
      { name: "Nâng cấp Pin Graphene (+3tr)", group: "Battery", priceAdjustment: 3000000, stock: 50 },
      { name: "Phiên bản Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 100 },
      { name: "Phiên bản Sport (Phanh ABS + Smartkey)", group: "Version", priceAdjustment: 2000000, stock: 30 }
    ],
    specifications: {
      battery: "96V 22.3Ah",
      motor: "2200W",
      chargingTime: "8-10 giờ",
      brakes: "Phanh đĩa đôi",
      weight: "115kg"
    }
  },
  {
    name: "TAILG R60",
    slug: "tailg-r60",
    brand: "TAILG",
    type: "motorcycle",
    price: 19500000,
    range: 75,
    topSpeed: 50,
    acceleration: 0,
    description: "TAILG R60 kết hợp giữa nét cổ điển và hiện đại. Đèn pha tròn lớn, yếm xe rộng chắn gió tốt và cốp xe rộng rãi.",
    isFeatured: false,
    featured: false,
    stock: 35,
    colors: [
      { name: "Trắng Sữa", hex: "#FDF5E6", price: 19500000, stock: 15 },
      { name: "Xanh Navy", hex: "#000080", price: 19500000, stock: 20 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Gói Phụ Kiện (Baga trước + Thảm)", group: "Accessories", priceAdjustment: 500000, stock: 30 }
    ],
    specifications: {
      battery: "60V 20Ah",
      motor: "1200W",
      chargingTime: "8 giờ",
      brakes: "Phanh đĩa trước",
      weight: "92kg"
    }
  },

  // --- BICYCLES (Xe đạp điện) ---
  {
    name: "TAILG GR55",
    slug: "tailg-gr55",
    brand: "TAILG",
    type: "bicycle",
    price: 12990000,
    range: 60,
    topSpeed: 40,
    acceleration: 0,
    description: "Xe đạp điện TAILG GR55 nhỏ gọn, trẻ trung, là bạn đồng hành lý tưởng cho học sinh cấp 2, cấp 3. Pin bền bỉ và động cơ êm ái.",
    isFeatured: true,
    featured: true,
    stock: 60,
    colors: [
      { name: "Hồng Phấn", hex: "#FFC0CB", price: 12990000, stock: 20 },
      { name: "Xanh Bạc Hà", hex: "#98FF98", price: 12990000, stock: 20 },
      { name: "Đen", hex: "#000000", price: 12990000, stock: 20 }
    ],
    options: [
      { name: "Bình 48V 12Ah", group: "Battery", priceAdjustment: 0, stock: 100 },
      { name: "Nâng cấp Bình 48V 20Ah", group: "Battery", priceAdjustment: 800000, stock: 50 },
      { name: "Vành Nan Hoa", group: "Wheels", priceAdjustment: 0, stock: 100 },
      { name: "Vành Đúc", group: "Wheels", priceAdjustment: 500000, stock: 50 }
    ],
    specifications: {
      battery: "48V 22.3Ah",
      motor: "400W",
      chargingTime: "6-8 giờ",
      brakes: "Phanh cơ",
      weight: "50kg",
      maxLoad: "110kg"
    }
  },
  {
    name: "TAILG GR54",
    slug: "tailg-gr54",
    brand: "TAILG",
    type: "bicycle",
    price: 13990000,
    range: 60,
    topSpeed: 40,
    acceleration: 0,
    description: "TAILG GR54 có thiết kế tương tự GR55 nhưng thêm phần cá tính với bộ tem thể thao. Dòng xe bền bỉ cho học sinh.",
    isFeatured: false,
    featured: false,
    stock: 50,
    colors: [
      { name: "Đỏ", hex: "#FF0000", price: 13990000, stock: 25 },
      { name: "Đen", hex: "#000000", price: 13990000, stock: 25 }
    ],
    options: [
      { name: "Bình 48V 12Ah", group: "Battery", priceAdjustment: 0, stock: 50 },
      { name: "Bình 48V 20Ah", group: "Battery", priceAdjustment: 800000, stock: 30 }
    ],
    specifications: {
      battery: "48V 22.3Ah",
      motor: "400W",
      chargingTime: "6-8 giờ",
      weight: "50kg"
    }
  },
  {
    name: "TAILG GR56",
    slug: "tailg-gr56",
    brand: "TAILG",
    type: "bicycle",
    price: 15290000,
    range: 65,
    topSpeed: 40,
    acceleration: 0,
    description: "Phiên bản cao cấp nhất dòng GR, TAILG GR56 sở hữu đèn LED bi cầu siêu sáng và đồng hồ điện tử sắc nét.",
    isFeatured: false,
    featured: false,
    stock: 40,
    colors: [
      { name: "Xanh Dương", hex: "#0000FF", price: 15290000, stock: 20 },
      { name: "Trắng", hex: "#FFFFFF", price: 15290000, stock: 20 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Có Bàn Đạp Trợ Lực", group: "Accessories", priceAdjustment: 200000, stock: 50 }
    ],
    specifications: {
      battery: "48V 22.3Ah",
      motor: "500W",
      chargingTime: "6-8 giờ",
      weight: "60kg"
    }
  },
  {
    name: "TAILG JS50",
    slug: "tailg-js50",
    brand: "TAILG",
    type: "bicycle",
    price: 15390000,
    range: 60,
    topSpeed: 35,
    acceleration: 0,
    description: "TAILG JS50 Princess - Mẫu xe điện thiết kế 'công chúa' với giỏ xe lớn, yên thấp, cực kỳ phù hợp cho các bạn nữ sinh.",
    isFeatured: true,
    featured: true,
    stock: 40,
    colors: [
      { name: "Hồng", hex: "#FFB6C1", price: 15390000, stock: 20 },
      { name: "Kem", hex: "#FFFDD0", price: 15390000, stock: 20 }
    ],
    options: [
      { name: "Giỏ Nhựa", group: "Accessories", priceAdjustment: 0, stock: 100 },
      { name: "Giỏ Mây Cao Cấp", group: "Accessories", priceAdjustment: 300000, stock: 50 }
    ],
    specifications: {
      battery: "48V 12Ah",
      motor: "350W",
      chargingTime: "6-8 giờ",
      weight: "45kg"
    }
  },
  {
    name: "TAILG JS32",
    slug: "tailg-js32",
    brand: "TAILG",
    type: "bicycle",
    price: 12600000,
    range: 50,
    topSpeed: 35,
    acceleration: 0,
    description: "TAILG JS32 Moka - Nhỏ gọn, linh hoạt, đầy đủ tiện nghi với mức giá phải chăng.",
    isFeatured: false,
    featured: false,
    stock: 40,
    colors: [
      { name: "Đỏ", hex: "#DC143C", price: 12600000, stock: 20 },
      { name: "Đen", hex: "#000000", price: 12600000, stock: 20 }
    ],
    options: [
      { name: "Yên Đơn", group: "Seat", priceAdjustment: 0, stock: 50 },
      { name: "Yên Đôi", group: "Seat", priceAdjustment: 200000, stock: 50 }
    ],
    specifications: {
      battery: "48V 12Ah",
      motor: "350W",
      weight: "45kg"
    }
  },
  {
    name: "TAILG JY33",
    slug: "tailg-jy33",
    brand: "TAILG",
    type: "bicycle",
    price: 10500000,
    range: 50,
    topSpeed: 30,
    acceleration: 0,
    description: "TAILG JY33 Mini Bike - Mẫu xe 'quốc dân' giá rẻ, bền bỉ, dễ sử dụng cho mọi lứa tuổi.",
    isFeatured: false,
    featured: false,
    stock: 50,
    colors: [
      { name: "Đỏ", hex: "#FF0000", price: 10500000, stock: 25 },
      { name: "Đen", hex: "#000000", price: 10500000, stock: 25 }
    ],
    options: [
      { name: "Bình 48V 12Ah", group: "Battery", priceAdjustment: 0, stock: 100 },
      { name: "Pin Lithium (Nhẹ hơn)", group: "Battery", priceAdjustment: 2000000, stock: 20 }
    ],
    specifications: {
      battery: "48V 12Ah",
      motor: "350W",
      weight: "40kg"
    }
  },
  {
    name: "TAILG JY34",
    slug: "tailg-jy34",
    brand: "TAILG",
    type: "bicycle",
    price: 11900000,
    range: 60,
    topSpeed: 35,
    acceleration: 0,
    description: "TAILG JY34 là phiên bản nâng cấp của JY33 với khung sườn chắc chắn hơn và quãng đường di chuyển xa hơn.",
    isFeatured: false,
    featured: false,
    stock: 50,
    colors: [
      { name: "Xanh Dương", hex: "#0000FF", price: 11900000, stock: 25 },
      { name: "Trắng", hex: "#FFFFFF", price: 11900000, stock: 25 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Có Giảm Xóc Giữa", group: "Version", priceAdjustment: 500000, stock: 30 }
    ],
    specifications: {
      battery: "48V 12Ah",
      motor: "350W",
      weight: "42kg"
    }
  },
  {
    name: "TAILG GX30",
    slug: "tailg-gx30",
    brand: "TAILG",
    type: "bicycle",
    price: 12990000,
    range: 55,
    topSpeed: 35,
    acceleration: 0,
    description: "TAILG GX30 Xbull - Thiết kế bò điên hầm hố, mạnh mẽ, rất được các bạn nam yêu thích.",
    isFeatured: true,
    featured: true,
    stock: 40,
    colors: [
      { name: "Đỏ Đen", hex: "#800000", price: 12990000, stock: 20 },
      { name: "Xanh Đen", hex: "#00008B", price: 12990000, stock: 20 }
    ],
    options: [
      { name: "Vành 10 inch", group: "Wheels", priceAdjustment: 0, stock: 50 },
      { name: "Vành 12 inch (Gầm cao)", group: "Wheels", priceAdjustment: 500000, stock: 30 },
      { name: "Bình 48V 20Ah", group: "Battery", priceAdjustment: 0, stock: 50 }
    ],
    specifications: {
      battery: "48V 20Ah",
      motor: "400W",
      weight: "55kg"
    }
  },
  {
    name: "TAILG Wukong GT50",
    slug: "tailg-wukong-gt50",
    brand: "TAILG",
    type: "bicycle",
    price: 15400000,
    range: 60,
    topSpeed: 40,
    acceleration: 0,
    description: "TAILG Wukong GT50 - Thiết kế phá cách, thể thao, lấy cảm hứng từ Tề Thiên Đại Thánh. Động cơ mạnh mẽ, vận hành êm ái.",
    isFeatured: true,
    featured: true,
    stock: 30,
    colors: [
      { name: "Cam Đen", hex: "#FF4500", price: 15400000, stock: 15 },
      { name: "Vàng Đen", hex: "#FFD700", price: 15400000, stock: 15 }
    ],
    options: [
      { name: "Tiêu Chuẩn", group: "Version", priceAdjustment: 0, stock: 50 },
      { name: "Bản Độ (Tay lái thể thao + Yên độ)", group: "Version", priceAdjustment: 1500000, stock: 20 }
    ],
    specifications: {
      battery: "60V 23Ah",
      motor: "500W",
      chargingTime: "6-8 giờ",
      weight: "60kg"
    }
  },
  {
    name: "TAILG JY32",
    slug: "tailg-jy32",
    brand: "TAILG",
    type: "bicycle",
    price: 11500000,
    range: 55,
    topSpeed: 35,
    acceleration: 0,
    description: "TAILG JY32 - Xe đạp điện phổ thông, bền bỉ, dễ sử dụng. Khung xe chắc chắn, chịu tải tốt, phù hợp cho mọi gia đình.",
    isFeatured: false,
    featured: false,
    stock: 45,
    colors: [
      { name: "Đen", hex: "#000000", price: 11500000, stock: 25 },
      { name: "Đỏ", hex: "#DC143C", price: 11500000, stock: 20 }
    ],
    options: [
      { name: "Có Bàn Đạp", group: "Accessories", priceAdjustment: 0, stock: 50 },
      { name: "Không Bàn Đạp (Để chân rộng)", group: "Accessories", priceAdjustment: 0, stock: 50 }
    ],
    specifications: {
      battery: "48V 12Ah",
      motor: "350W",
      weight: "43kg"
    }
  }
];

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    for (const car of tailgModels) {
      try {
        const existing = await strapi.documents('api::car-model.car-model').findMany({
          filters: { slug: car.slug },
          limit: 1
        });

        if (existing.length === 0) {
          strapi.log.info(`Creating TAILG model: ${car.name}`);
          await strapi.documents('api::car-model.car-model').create({
            data: {
              ...car,
              publishedAt: new Date(), // Publish immediately
            },
            status: 'published',
          });
        } else {
          strapi.log.info(`Updating TAILG model: ${car.name}`);
          // Update existing record to ensure new fields (like color variants) are applied
          const entry = existing[0];
          await strapi.documents('api::car-model.car-model').update({
            documentId: entry.documentId,
            data: {
              ...car,
            },
            status: 'published',
          });
        }
      } catch (error) {
        strapi.log.error(`Failed to seed ${car.name}:`, error);
      }
    }
  },
};

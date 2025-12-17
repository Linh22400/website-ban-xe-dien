
export const MOCK_ORDERS = [
    {
        id: 1,
        code: "DH-2024-001",
        customerName: "Nguyễn Văn A",
        phone: "0901234567",
        total: 12500000,
        status: "pending",
        date: "12/12/2024",
        items: 2
    },
    {
        id: 2,
        code: "DH-2024-002",
        customerName: "Trần Thị B",
        phone: "0987654321",
        total: 8900000,
        status: "shipping",
        date: "11/12/2024",
        items: 1
    },
    {
        id: 3,
        code: "DH-2024-003",
        customerName: "Lê Văn C",
        phone: "0912345678",
        total: 24500000,
        status: "completed",
        date: "10/12/2024",
        items: 3
    },
    {
        id: 4,
        code: "DH-2024-004",
        customerName: "Phạm Thị D",
        phone: "0933445566",
        total: 550000,
        status: "cancelled",
        date: "09/12/2024",
        items: 5
    },
    {
        id: 5,
        code: "DH-2024-005",
        customerName: "Hoàng Văn E",
        phone: "0909090909",
        total: 3200000,
        status: "confirmed",
        date: "08/12/2024",
        items: 1
    },
];

export const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Yadea G5",
        category: "Xe Máy Điện",
        price: 39990000,
        stock: 12,
        status: "active",
        image: "/uploads/yadea_g5.jpg"
    },
    {
        id: 2,
        name: "Yadea Odora",
        category: "Xe Máy Điện",
        price: 29990000,
        stock: 5,
        status: "active",
        image: "/uploads/yadea_odora.jpg"
    },
    {
        id: 3,
        name: "DK Bike Roma",
        category: "Xe Đạp Điện",
        price: 14500000,
        stock: 0,
        status: "out_of_stock",
        image: "/uploads/dk_roma.jpg"
    },
    {
        id: 4,
        name: "Pega Cap A",
        category: "Xe Đạp Điện",
        price: 12000000,
        stock: 20,
        status: "active",
        image: "/uploads/pega_cap.jpg"
    },
    {
        id: 5,
        name: "Mũ Bảo Hiểm 3/4",
        category: "Phụ Kiện",
        price: 350000,
        stock: 50,
        status: "active",
        image: "/uploads/helmet.jpg"
    }
];

export const MOCK_CUSTOMERS = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
        role: "customer",
        orders: 5,
        totalSpent: 12500000,
        joinDate: "12/10/2024"
    },
    {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0987654321",
        role: "admin",
        orders: 12,
        totalSpent: 45000000,
        joinDate: "01/10/2024"
    },
    {
        id: 3,
        name: "Lê Văn C",
        email: "levanc@example.com",
        phone: "0912345678",
        role: "staff",
        orders: 0,
        totalSpent: 0,
        joinDate: "15/11/2024"
    },
    {
        id: 4,
        name: "Phạm Thị D",
        email: "phamthid@example.com",
        phone: "0933445566",
        role: "customer",
        orders: 1,
        totalSpent: 550000,
        joinDate: "09/12/2024"
    },
];

// Order types for the purchase flow
export interface OrderCustomerInfo {
    FullName: string;
    Phone: string;
    Email: string;
    IdCard?: string;
    DeliveryAddress: string;
    City?: string;
    District?: string;
    Ward?: string;
}

export interface OrderData {
    VehicleModel: number;
    SelectedColor?: string;
    SelectedBattery?: string;
    SelectedGifts?: string[];
    PaymentMethod: 'full_payment' | 'deposit' | 'installment';
    CustomerInfo: OrderCustomerInfo;
    SelectedShowroom?: number;
    AppointmentDate?: string;
    Notes?: string;
    InstallmentPlan?: {
        months: number;
        monthlyPayment: number;
        totalInterest: number;
        financialPartner?: string;
    };
    PreferredGateway?: 'momo' | 'zalopay' | 'vnpay' | 'viettel_money' | 'visa' | 'mastercard' | 'bank_transfer';
}

export interface Order {
    id: number;
    OrderCode: string;
    Statuses: 'pending_payment' | 'deposit_paid' | 'processing' | 'ready_for_pickup' | 'completed' | 'cancelled' | 'refunded';
    PaymentMethod: 'full_payment' | 'deposit' | 'installment';
    PaymentStatus: 'pending' | 'partial' | 'completed' | 'failed' | 'refunded';
    VehicleModel?: any; // Car model data
    SelectedColor?: string;
    SelectedBattery?: string;
    SelectedGifts?: string[];
    BasePrice: number;
    Discount: number;
    RegistrationFee: number;
    LicensePlateFee: number;
    TotalAmount: number;
    DepositAmount: number;
    RemainingAmount: number;
    InstallmentPlan?: any;
    Customer?: any;
    CustomerInfo: OrderCustomerInfo;
    SelectedShowroom?: any;
    AppointmentDate?: string;
    PaymentTransactions?: PaymentTransaction[];
    Notes?: string;
    InternalNotes?: string;
    TrackingHistory?: TrackingHistoryEntry[];
    Documents?: any[];
    DeliveryDate?: string;
    CompletedDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentTransaction {
    id: number;
    TransactionId: string;
    Gateway: 'momo' | 'zalopay' | 'vnpay' | 'viettel_money' | 'visa' | 'mastercard' | 'bank_transfer';
    Amount: number;
    Currency: string;
    Status: 'pending' | 'processing' | 'success' | 'failed' | 'cancelled' | 'refunded';
    GatewayResponse?: any;
    RefundReason?: string;
    RefundedAt?: string;
    Metadata?: any;
    createdAt: string;
    updatedAt: string;
}

export interface TrackingHistoryEntry {
    status: string;
    timestamp: string;
    note?: string;
    updatedBy?: string;
}

export interface Showroom {
    id: number;
    Name: string;
    Code?: string;
    Address: string;
    City: string;
    District?: string;
    Latitude?: number;
    Longitude?: number;
    Phone?: string;
    Email?: string;
    WorkingHours?: {
        monday?: string;
        tuesday?: string;
        wednesday?: string;
        thursday?: string;
        friday?: string;
        saturday?: string;
        sunday?: string;
    };
    IsActive: boolean;
    Images?: any[];
    Inventory?: any;
    Manager?: string;
    Description?: string;
}

export interface CreateOrderResponse {
    data: Order & {
        paymentUrl?: string;
        transactionId?: string;
    };
    meta?: {
        pricing: {
            basePrice: number;
            discount: number;
            registrationFee: number;
            licensePlateFee: number;
            totalAmount: number;
            depositAmount: number;
            remainingAmount: number;
        };
    };
}

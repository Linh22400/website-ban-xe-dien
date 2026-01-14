const crypto = require('crypto');

// ==============================================
// CONFIGURATION (From Failed Log)
// ==============================================
// Secret (Hex): 3835464951424d41343450304331494c584a5959594a55533230304e454a5739
const HASH_SECRET = '85FIQBMA44P0C1ILXJYYYJUS200NEJW9';

// Data from Step 10554
const testParams = {
    vnp_Amount: 715000000,
    vnp_Command: 'pay',
    vnp_CreateDate: '20260113195917',
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Thanh toan don hang DH151052275',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: 'http://localhost:3000/checkout/vnpay-return',
    vnp_TmnCode: 'VC9PEMZR',
    vnp_TxnRef: 'DH151052275_1768309157670',
    vnp_Version: '2.1.0'
};

const BACKEND_SIGNATURE = '81dabebca4270c7b9960d6e1f25b23c43b229dd85d03c11fc3c391c80ac1443f4c594d4e9206bb6fc1ef3765491e94e1a0a14e7806383cb6ea90106ec90cd210';

// ==============================================
// LOGIC CONSTANT FROM test-vnpay-signature.js
// ==============================================
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

console.log('--- Checking Backend Logic vs Test Script Logic ---');

const sortedParams = sortObject(testParams);
const signDataArr = [];
for (const key in sortedParams) {
    const value = sortedParams[key];
    if (value !== null && value !== undefined && value !== '') {
        signDataArr.push(`${key}=${value}`);
    }
}
const signData = signDataArr.join('&');

console.log('SignData (Script):', signData);

const hmac = crypto.createHmac('sha512', HASH_SECRET);
const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

console.log('Signature (Script):', signature);
console.log('Signature (Backend):', BACKEND_SIGNATURE);
console.log('MATCH:', signature === BACKEND_SIGNATURE);

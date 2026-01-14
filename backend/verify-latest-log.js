const crypto = require('crypto');
const querystring = require('querystring');

// Credentials from Email
const secret = '85FIQBMA44P0C1ILXJYYYJUS200NEJW9';

// Data from User Log (Step 10468)
// vnp_Amount=715000000&vnp_Command=pay&vnp_CreateDate=20260113192505&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh toan don hang DH099518328&vnp_OrderType=other&vnp_ReturnUrl=http://localhost:3000/checkout/vnpay-return&vnp_TmnCode=VC9PEMZR&vnp_TxnRef=DH099518328_1768307105552&vnp_Version=2.1.0
const params = {
    vnp_Amount: 715000000,
    vnp_Command: 'pay',
    vnp_CreateDate: '20260113192505',
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Thanh toan don hang DH099518328',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: 'http://localhost:3000/checkout/vnpay-return',
    vnp_TmnCode: 'VC9PEMZR',
    vnp_TxnRef: 'DH099518328_1768307105552',
    vnp_Version: '2.1.0'
};

const loggedSignature = '5ca828271011ea4fe7b45c1c2957e8554f6bcde1b0ffc6eedd7e1c3b7ce7bbfb8d2e7641bfa1e4001265e8c06f73c636c75c15415fa9601124d0838b7f25792c';

console.log('--- Debugging Signature ---');

// Method 1: Raw (As currently implemented)
function checkRaw() {
    const keys = Object.keys(params).sort();
    let signData = '';
    keys.forEach(key => {
        if (signData.length > 0) signData += '&';
        signData += `${key}=${params[key]}`;
    });

    const hmac = crypto.createHmac('sha512', secret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('\n[RAW Method]');
    console.log('SignData:', signData);
    console.log('Calculated:', signed);
    console.log('Logged:    ', loggedSignature);
    console.log('MATCH:', signed === loggedSignature);
}

// Method 2: Encoded (Common Sandbox requirement)
function checkEncoded() {
    const keys = Object.keys(params).sort();
    let signData = '';
    keys.forEach(key => {
        if (signData.length > 0) signData += '&';
        signData += `${key}=${encodeURIComponent(String(params[key]))}`;
    });

    const hmac = crypto.createHmac('sha512', secret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('\n[ENCODED Method]');
    console.log('SignData:', signData);
    console.log('Calculated:', signed);
    console.log('Logged:    ', loggedSignature);
    console.log('MATCH:', signed === loggedSignature);
}

// Method 3: Spaces Replaced with + (Old VNPAY behavior)
function checkPlus() {
    const keys = Object.keys(params).sort();
    let signData = '';
    keys.forEach(key => {
        if (signData.length > 0) signData += '&';
        let val = String(params[key]);
        if (key === 'vnp_OrderInfo') val = val.replace(/ /g, '+');
        signData += `${key}=${val}`;
    });

    const hmac = crypto.createHmac('sha512', secret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    console.log('\n[PLUS Method]');
    console.log('SignData:', signData);
    console.log('Calculated:', signed);
    console.log('Logged:    ', loggedSignature);
    console.log('MATCH:', signed === loggedSignature);
}

checkRaw();
checkEncoded();
checkPlus();

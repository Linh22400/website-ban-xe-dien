/**
 * VNPay Signature Test Script
 * Test your VNPay credentials and signature algorithm
 */

const crypto = require('crypto');

// ==============================================
// CONFIGURATION - Replace with your credentials
// ==============================================
const TMN_CODE = '9REXR668';
const HASH_SECRET = 'KY8KY6EQQPOH56NU5NO4FYVQ5I7XNCBZ';

// ==============================================
// Test Data
// ==============================================
const testParams = {
  vnp_Version: '2.1.0',
  vnp_Command: 'pay',
  vnp_TmnCode: TMN_CODE,
  vnp_Amount: 10000000, // 100,000 VND
  vnp_CurrCode: 'VND',
  vnp_TxnRef: 'TEST123',
  vnp_OrderInfo: 'Test Payment',
  vnp_OrderType: 'other',
  vnp_Locale: 'vn',
  vnp_ReturnUrl: 'http://localhost:3000/return',
  vnp_IpAddr: '127.0.0.1',
  vnp_CreateDate: '20260113120000'
};

// ==============================================
// Sort params alphabetically
// ==============================================
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// ==============================================
// Test Signature
// ==============================================
console.log('='.repeat(60));
console.log('VNPay Signature Test');
console.log('='.repeat(60));
console.log('');

// Sort params
const sortedParams = sortObject(testParams);
console.log('1️⃣  Sorted Params:');
console.log(JSON.stringify(sortedParams, null, 2));
console.log('');

// Build sign data
const signDataArr = [];
for (const key in sortedParams) {
  const value = sortedParams[key];
  if (value !== null && value !== undefined && value !== '') {
    signDataArr.push(`${key}=${value}`);
  }
}
const signData = signDataArr.join('&');

console.log('2️⃣  SignData String (for hashing):');
console.log(signData);
console.log('');

// Create HMAC SHA512
const hmac = crypto.createHmac('sha512', HASH_SECRET);
const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

console.log('3️⃣  Hash Secret:');
console.log(HASH_SECRET);
console.log('Length:', HASH_SECRET.length);
console.log('');

console.log('4️⃣  Generated Signature (HMAC-SHA512):');
console.log(signature);
console.log('');

console.log('='.repeat(60));
console.log('🧪 Verification Steps:');
console.log('='.repeat(60));
console.log('');
console.log('Step 1: Verify credentials');
console.log('   → Login to: https://sandbox.vnpayment.vn/');
console.log('   → Go to: Cấu hình (Configuration)');
console.log('   → Check TMN Code:', TMN_CODE);
console.log('   → Check Hash Secret matches exactly');
console.log('');
console.log('Step 2: Test signature online');
console.log('   → Go to: https://emn178.github.io/online-tools/sha512.html');
console.log('   → Select: HMAC');
console.log('   → Key:', HASH_SECRET);
console.log('   → Text:', signData);
console.log('   → Expected:', signature);
console.log('');
console.log('Step 3: Check error code meaning');
console.log('   → Code 70: Sai chữ ký (Invalid signature)');
console.log('   → Code 99: Lỗi hệ thống (System error)');
console.log('   → Verify TMN Code and Hash Secret are from SAME account');
console.log('');
console.log('='.repeat(60));
console.log('📝 Notes:');
console.log('='.repeat(60));
console.log('• VNPay v2.1.0 uses HMAC-SHA512');
console.log('• SignData uses RAW values (no URL encoding)');
console.log('• Params must be sorted alphabetically');
console.log('• TMN Code and Hash Secret must match');
console.log('• Hash Secret is case-sensitive');
console.log('');

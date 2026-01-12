/**
 * Payment API - Routes Index
 * Export all payment routes
 */

import customPayment from './custom-payment';
import vnpay from './vnpay';
import momo from './momo';
import momoTest from './momo-test';
import bankTransfer from './bank-transfer';

export default {
  'custom-payment': customPayment,
  vnpay,
  momo,
  'momo-test': momoTest,
  'bank-transfer': bankTransfer,
};

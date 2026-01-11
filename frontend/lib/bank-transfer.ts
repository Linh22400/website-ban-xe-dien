/**
 * Bank Transfer Helper Functions
 * Frontend - lib/bank-transfer.ts
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface BankInfo {
  id: string;
  name: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  logo: string;
}

export interface BankTransferInfo {
  banks: BankInfo[];
  instructions: string[];
}

/**
 * Lấy thông tin tài khoản ngân hàng
 */
export async function getBankInfo(): Promise<BankTransferInfo> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/payment/bank-transfer/bank-info`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bank info');
    }

    return await response.json();
  } catch (error) {
    console.error('Get bank info error:', error);
    throw error;
  }
}

/**
 * Upload ảnh chứng từ chuyển khoản
 */
export async function uploadPaymentProof(data: {
  orderId: string;
  amount: number;
  transferDate?: string;
  bankName?: string;
  accountNumber?: string;
  transferNote?: string;
  proofImage: File;
}): Promise<{ success: boolean; message: string; data: any }> {
  try {
    const formData = new FormData();
    formData.append('orderId', data.orderId);
    formData.append('amount', data.amount.toString());
    
    if (data.transferDate) formData.append('transferDate', data.transferDate);
    if (data.bankName) formData.append('bankName', data.bankName);
    if (data.accountNumber) formData.append('accountNumber', data.accountNumber);
    if (data.transferNote) formData.append('transferNote', data.transferNote);
    formData.append('proofImage', data.proofImage);

    const response = await fetch(`${BACKEND_URL}/api/payment/bank-transfer/upload-proof`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Failed to upload payment proof');
    }

    return result;
  } catch (error) {
    console.error('Upload payment proof error:', error);
    throw error;
  }
}

/**
 * Format account number với dấu gạch ngang
 */
export function formatAccountNumber(accountNumber: string): string {
  // Format: 1234 5678 90
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

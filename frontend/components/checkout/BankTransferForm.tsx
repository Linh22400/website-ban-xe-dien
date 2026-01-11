'use client';

import { useState, useEffect } from 'react';
import { Building2, Copy, Check, Upload, Loader2, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getBankInfo, uploadPaymentProof, copyToClipboard, formatAccountNumber, BankInfo } from '@/lib/bank-transfer';

interface BankTransferFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
}

export default function BankTransferForm({ orderId, amount, onSuccess }: BankTransferFormProps) {
  const [banks, setBanks] = useState<BankInfo[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Form data
  const [transferDate, setTransferDate] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transferNote, setTransferNote] = useState(orderId);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadBankInfo();
  }, []);

  const loadBankInfo = async () => {
    try {
      const info = await getBankInfo();
      setBanks(info.banks);
      setInstructions(info.instructions);
      if (info.banks.length > 0) {
        setSelectedBank(info.banks[0]);
      }
    } catch (error) {
      console.error('Failed to load bank info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await copyToClipboard(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proofImage) {
      alert('Vui lòng chọn ảnh chứng từ chuyển khoản');
      return;
    }

    setIsUploading(true);

    try {
      await uploadPaymentProof({
        orderId,
        amount,
        transferDate,
        bankName: selectedBank?.name,
        accountNumber,
        transferNote,
        proofImage,
      });

      setUploadSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Upload thành công!
        </h3>
        <p className="text-green-700">
          Đơn hàng của bạn đang chờ xác nhận. Chúng tôi sẽ liên hệ trong vòng 24h.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bank Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Chọn ngân hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => setSelectedBank(bank)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedBank?.id === bank.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Building2 className="w-8 h-8 text-blue-600 mb-2" />
              <div className="font-medium text-sm">{bank.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bank Details */}
      {selectedBank && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-lg mb-4">Thông tin chuyển khoản</h4>
          
          {/* Amount */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Số tiền cần chuyển</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(amount)}
            </div>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Số tài khoản</div>
              <div className="text-lg font-semibold">{formatAccountNumber(selectedBank.accountNumber)}</div>
            </div>
            <button
              onClick={() => handleCopy(selectedBank.accountNumber, 'account')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {copiedField === 'account' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {copiedField === 'account' ? 'Đã copy' : 'Copy'}
              </span>
            </button>
          </div>

          {/* Account Name */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Tên tài khoản</div>
              <div className="text-lg font-semibold">{selectedBank.accountName}</div>
            </div>
            <button
              onClick={() => handleCopy(selectedBank.accountName, 'name')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {copiedField === 'name' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {copiedField === 'name' ? 'Đã copy' : 'Copy'}
              </span>
            </button>
          </div>

          {/* Transfer Content */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Nội dung chuyển khoản</div>
              <div className="text-lg font-semibold">{orderId}</div>
            </div>
            <button
              onClick={() => handleCopy(orderId, 'content')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {copiedField === 'content' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {copiedField === 'content' ? 'Đã copy' : 'Copy'}
              </span>
            </button>
          </div>

          {/* Branch */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Chi nhánh</div>
            <div className="text-lg font-semibold">{selectedBank.branch}</div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {instructions.map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="font-semibold text-lg">Upload chứng từ chuyển khoản</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày chuyển khoản
            </label>
            <input
              type="datetime-local"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Số TK chuyển khoản (của bạn)
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="VD: 1234567890"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ảnh chụp biên lai chuyển khoản <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            {previewUrl ? (
              <div className="space-y-3">
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setProofImage(null);
                    setPreviewUrl(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Xóa ảnh
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <div className="text-sm text-gray-600 mb-2">
                  Click để chọn ảnh hoặc kéo thả vào đây
                </div>
                <div className="text-xs text-gray-500">
                  PNG, JPG, JPEG (Max 5MB)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading || !proofImage}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Xác nhận đã chuyển khoản
            </>
          )}
        </button>
      </form>
    </div>
  );
}

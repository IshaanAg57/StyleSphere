import QRCode from 'qrcode';

/**
 * Generates a standard URL-encoded UPI deep link
 * Format: upi://pay?pa=<MERCHANT_UPI_ID>&pn=<MERCHANT_NAME>&am=<ORDER_TOTAL>&cu=INR&tn=<ORDER_NUMBER>
 */
export const generateUpiPaymentUri = ({
  merchantUpiId,
  merchantName,
  amount,
  orderNumber,
  note
}) => {
  const pa = merchantUpiId || process.env.MERCHANT_UPI_ID || 'stylesphere@upi';
  const pn = merchantName || process.env.MERCHANT_NAME || 'StyleSphere';
  const am = Number(amount).toFixed(2);
  const tn = note || `StyleSphere Order ${orderNumber}`;

  return `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${encodeURIComponent(am)}&cu=INR&tn=${encodeURIComponent(tn)}`;
};

/**
 * Generates a QR Code as Data URI (PNG Base64) for the given UPI URI
 */
export const generateUpiQrDataUri = async (upiUri) => {
  try {
    const dataUri = await QRCode.toDataURL(upiUri, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#0b0f19',
        light: '#ffffff'
      }
    });
    return dataUri;
  } catch (error) {
    console.error('Error generating UPI QR code:', error);
    return null;
  }
};

/**
 * Returns safe public merchant payment configuration for the checkout/payment page
 */
export const getMerchantUpiConfig = () => ({
  merchantUpiId: process.env.MERCHANT_UPI_ID || 'stylesphere@upi',
  merchantName: process.env.MERCHANT_NAME || 'StyleSphere'
});

export default {
  generateUpiPaymentUri,
  generateUpiQrDataUri,
  getMerchantUpiConfig
};

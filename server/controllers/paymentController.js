import Order from '../models/Order.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateUpiPaymentUri, generateUpiQrDataUri, getMerchantUpiConfig } from '../utils/upiPayment.js';

/**
 * @desc    Get public UPI merchant payment configuration
 * @route   GET /api/payment/config
 * @access  Public
 */
export const getPaymentConfig = asyncHandler(async (req, res) => {
  const config = getMerchantUpiConfig();
  return ApiResponse.success(res, config, 'Merchant payment configuration retrieved', 200);
});

/**
 * @desc    Get payment details and generated UPI QR code for an order
 * @route   GET /api/payment/:orderId
 * @access  Private (Owner or Admin)
 */
export const getOrderPaymentDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  let order = null;
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId).populate('user', 'name email phone');
  } else {
    order = await Order.findOne({ orderNumber: orderId }).populate('user', 'name email phone');
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  // Authorization check: only owner or admin
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return ApiResponse.error(res, 'Unauthorized to view payment for this order', 403);
  }

  const { merchantUpiId, merchantName } = getMerchantUpiConfig();

  // Generate Authoritative UPI URI from server-calculated total
  const upiUri = generateUpiPaymentUri({
    merchantUpiId,
    merchantName,
    amount: order.totalAmount,
    orderNumber: order.orderNumber,
    note: `StyleSphere Order ${order.orderNumber}`
  });

  // Generate QR Code data URL
  const qrCode = await generateUpiQrDataUri(upiUri);

  return ApiResponse.success(
    res,
    {
      order,
      upiUri,
      qrCode,
      merchantUpiId,
      merchantName,
      amountPayable: order.totalAmount,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus
    },
    'Order payment details retrieved successfully',
    200
  );
});

/**
 * @desc    Submit customer payment confirmation with UTR / Transaction reference
 * @route   POST /api/payment/:orderId/confirm
 * @access  Private (Owner only)
 */
export const submitPaymentConfirmation = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { transactionId, paymentApp, note } = req.body;

  if (!transactionId || !transactionId.trim()) {
    return ApiResponse.error(res, 'Please provide a valid UPI Transaction ID / UTR Number', 400);
  }

  let order = null;
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNumber: orderId });
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  // Ownership check
  if (order.user.toString() !== req.user._id.toString()) {
    return ApiResponse.error(res, 'Unauthorized to submit payment for this order', 403);
  }

  // Check if payment is already verified
  if (order.isPaid || order.paymentStatus === 'paid') {
    return ApiResponse.error(res, 'Payment for this order has already been verified and settled', 400);
  }

  // Update payment submission details
  order.paymentStatus = 'pending_verification';
  order.paymentReference = transactionId.trim();
  order.paymentApp = paymentApp?.trim() || 'Other';
  order.paymentNote = note?.trim() || '';
  order.paymentSubmittedAt = new Date();
  order.paymentRejectionReason = ''; // Clear previous rejection reason if any

  order.statusHistory.push({
    status: 'Payment Verification Pending',
    comment: `Client submitted UPI Transaction ID: ${transactionId.trim()} via ${order.paymentApp}`,
    timestamp: new Date()
  });

  const updatedOrder = await order.save();

  return ApiResponse.success(
    res,
    { order: updatedOrder },
    'Payment details submitted successfully. Awaiting manual executive verification.',
    200
  );
});

/**
 * @desc    Generate a clean, printable professional invoice HTML / data
 * @route   GET /api/orders/:orderId/invoice
 * @access  Private (Owner or Admin)
 */
export const getOrderInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  let order = null;
  if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
    order = await Order.findById(orderId).populate('user', 'name email phone');
  } else {
    order = await Order.findOne({ orderNumber: orderId }).populate('user', 'name email phone');
  }

  if (!order) {
    return ApiResponse.error(res, 'Order not found', 404);
  }

  // Ownership check
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return ApiResponse.error(res, 'Unauthorized to access this invoice', 403);
  }

  // If query specifies html download
  if (req.query.format === 'html') {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
            <strong style="color: #0f172a;">${item.name}</strong><br/>
            <span style="font-size: 12px; color: #64748b;">Brand: ${item.brand} | Size: ${item.selectedSize} | Color: ${item.selectedColor}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>StyleSphere Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 40px; }
          .invoice-card { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 800; font-family: serif; color: #0b0f19; letter-spacing: -0.5px; }
          .logo span { color: #d4af37; }
          .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 600; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
          .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
          th { background: #f1f5f9; padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; font-weight: 700; }
          .totals { width: 300px; margin-left: auto; margin-top: 20px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #475569; }
          .totals-row.grand { font-size: 16px; font-weight: bold; color: #0b0f19; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 6px; }
          .stamp { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .stamp.paid { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
          .stamp.pending { background: #fef9c3; color: #854d0e; border: 1px solid #fde047; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice-card">
          <div class="header">
            <div>
              <div class="logo">Style<span>Sphere</span></div>
              <div class="tagline">Discover. Personalize. Shop.</div>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; font-size: 18px; color: #0b0f19;">OFFICIAL TAX INVOICE</h2>
              <p style="margin: 4px 0; font-family: monospace; font-size: 13px; color: #d4af37; font-weight: bold;">${order.orderNumber}</p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">Date: ${formattedDate}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div>
              <div class="section-title">Billed & Shipped To:</div>
              <strong style="color: #0f172a; font-size: 14px;">${order.shippingAddress.fullName}</strong><br/>
              <span style="font-size: 13px; color: #475569; line-height: 1.6;">
                ${order.shippingAddress.addressLine1 || order.shippingAddress.street || ''}<br/>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode || order.shippingAddress.pincode || ''}<br/>
                India | Phone: ${order.shippingAddress.phone}
              </span>
            </div>
            <div style="text-align: right;">
              <div class="section-title">Payment Overview:</div>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Method:</strong> ${order.paymentMethod}</p>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Status:</strong> 
                <span class="stamp ${order.isPaid ? 'paid' : 'pending'}">${order.paymentStatus}</span>
              </p>
              ${order.paymentReference ? `<p style="margin: 4px 0; font-size: 12px; color: #64748b;"><strong>Ref/UTR:</strong> ${order.paymentReference}</p>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Garment / Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${order.discount ? `
            <div class="totals-row" style="color: #16a34a;">
              <span>Privilege Discount:</span>
              <span>-₹${order.discount.toLocaleString('en-IN')}</span>
            </div>` : ''}
            <div class="totals-row">
              <span>Complimentary Shipping:</span>
              <span>₹${(order.shipping || 0).toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row">
              <span>GST (18% Included):</span>
              <span>₹${order.tax.toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row grand">
              <span>Grand Total:</span>
              <span style="color: #d4af37;">₹${order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="footer">
            StyleSphere Luxury Haute Couture • Certified Authentic Garments • Complimentary Concierge Support: concierge@stylesphere.fashion
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.send(invoiceHtml);
  }

  // Default JSON response
  return ApiResponse.success(res, { order }, 'Invoice retrieved successfully', 200);
});

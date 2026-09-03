import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  brand: { type: String, default: 'StyleSphere Collection' },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String, required: true, default: 'M' },
  selectedColor: { type: String, required: true, default: 'Standard' }
}, { _id: true });

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String, default: '' },
      street: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String },
      pincode: { type: String },
      country: { type: String, default: 'India' }
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Cash on Delivery', 'Card', 'UPI', 'Razorpay', 'Online Payment'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'pending'
    },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'Order Placed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
      ],
      default: 'confirmed'
    },
    subtotal: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    statusHistory: [
      {
        status: { type: String, required: true },
        comment: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Pre-validate hook to ensure unique orderNumber and address sync
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `SS-${new Date().getFullYear()}-${randomNum}`;
  }

  if (this.shippingCost && !this.shipping) {
    this.shipping = this.shippingCost;
  } else if (this.shipping && !this.shippingCost) {
    this.shippingCost = this.shipping;
  }

  if (this.shippingAddress) {
    if (this.shippingAddress.addressLine1 && !this.shippingAddress.street) {
      this.shippingAddress.street = this.shippingAddress.addressLine1;
    }
    if (this.shippingAddress.street && !this.shippingAddress.addressLine1) {
      this.shippingAddress.addressLine1 = this.shippingAddress.street;
    }
    if (this.shippingAddress.postalCode && !this.shippingAddress.pincode) {
      this.shippingAddress.pincode = this.shippingAddress.postalCode;
    }
    if (this.shippingAddress.pincode && !this.shippingAddress.postalCode) {
      this.shippingAddress.postalCode = this.shippingAddress.pincode;
    }
  }

  next();
});

export const Order = mongoose.model('Order', orderSchema);
export default Order;

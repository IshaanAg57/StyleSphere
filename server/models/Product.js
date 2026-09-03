import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a category']
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids'],
      default: 'unisex'
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be greater than or equal to 0']
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      validate: [
        (val) => val.length > 0,
        'Product must contain at least one image URL'
      ]
    },
    thumbnail: {
      type: String,
      default: ''
    },
    colors: {
      type: [String],
      default: ['Obsidian Black', 'Champagne Gold']
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock count'],
      min: [0, 'Stock cannot be negative'],
      default: 15
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    trending: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    tags: {
      type: [String],
      default: []
    },
    material: {
      type: String,
      default: '100% Organic Silk & Artisanal Wool'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals for backward compatibility with Phase 1/2 fields
productSchema.virtual('rating').get(function () {
  return this.ratingsAverage;
});
productSchema.virtual('numReviews').get(function () {
  return this.ratingsQuantity;
});
productSchema.virtual('discountPrice').get(function () {
  return this.price;
});
productSchema.virtual('isFeatured').get(function () {
  return this.featured;
});
productSchema.virtual('isTrending').get(function () {
  return this.trending;
});

// Pre-save hook to generate slug, thumbnail, and discount calculations
productSchema.pre('save', function (next) {
  // Generate slug if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Set thumbnail to first image if not provided
  if ((!this.thumbnail || this.thumbnail === '') && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  // Calculate discount percentage if original price exists and is higher than price
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  } else if (!this.originalPrice) {
    this.originalPrice = this.price;
    this.discountPercentage = 0;
  }

  // Auto populate shortDescription if empty
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.slice(0, 140) + '...';
  }

  next();
});

export const Product = mongoose.model('Product', productSchema);
export default Product;

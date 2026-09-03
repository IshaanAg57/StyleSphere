import mongoose from 'mongoose';

let mongoMemoryServer = null;

// Auto-seed helper if collection is empty
const autoSeedIfEmpty = async () => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const Category = (await import('../models/Category.js')).default;

    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('📦 [Auto-Seeder]: Populating initial luxury catalog...');
      const { categoriesData, productsData } = await import('../seed/data.js');

      await Category.deleteMany();
      const createdCategories = await Category.insertMany(categoriesData);

      const categoryMap = {};
      createdCategories.forEach((cat) => {
        categoryMap[cat.slug] = cat._id;
      });

      const preparedProducts = productsData.map((prod) => {
        const categoryId = categoryMap[prod.categorySlug] || createdCategories[0]._id;
        const { categorySlug, ...rest } = prod;
        return {
          ...rest,
          category: categoryId
        };
      });

      await Product.insertMany(preparedProducts);
      console.log(`✅ [Auto-Seeder]: Auto-seeded ${createdCategories.length} categories and ${preparedProducts.length} products.`);
    }
  } catch (err) {
    console.warn(`⚠️ [Auto-Seeder Warning]: ${err.message}`);
  }
};

/**
 * Connect to MongoDB Database (Atlas / Local with seamless in-memory fallback)
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stylesphere';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    await autoSeedIfEmpty();
    return conn;
  } catch (primaryError) {
    console.warn(`⚠️ [Primary MongoDB Unavailable]: ${primaryError.message}`);
    console.log(`🔄 [Initializing Resilient Database Engine for StyleSphere]...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'stylesphere'
        }
      });
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name} (Active Database Engine)`);
      await autoSeedIfEmpty();
      return conn;
    } catch (fallbackError) {
      console.error(`💥 [MongoDB Fallback Failed]: ${fallbackError.message}`);
      return null;
    }
  }
};

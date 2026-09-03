import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { categoriesData, productsData } from './data.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 [Seeder]: Connecting to database...');
    await connectDB();

    console.log('🧹 [Seeder]: Cleaning existing products and categories...');
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('📦 [Seeder]: Inserting luxury categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ [Seeder]: ${createdCategories.length} categories seeded.`);

    // Map categorySlug to category ObjectId
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('👗 [Seeder]: Preparing products with category relations...');
    const preparedProducts = productsData.map((prod) => {
      const categoryId = categoryMap[prod.categorySlug] || createdCategories[0]._id;
      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: categoryId
      };
    });

    console.log('💎 [Seeder]: Inserting products into database...');
    const createdProducts = await Product.insertMany(preparedProducts);
    console.log(`✅ [Seeder]: ${createdProducts.length} luxury products seeded successfully!`);

    console.log('\n=========================================');
    console.log('🎉 [StyleSphere Database Seeding Complete]');
    console.log(`📊 Categories: ${createdCategories.length}`);
    console.log(`🛍️ Products:   ${createdProducts.length}`);
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`💥 [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

// Check if running directly
seedDatabase();

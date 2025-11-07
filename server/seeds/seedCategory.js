// server/seeds/seedCategory.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
const dotenv = require('dotenv');

dotenv.config();

// Helper: generate slug
const generateSlug = (name) =>
  name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

// Seed data
const categories = [
  { name: 'Technology', description: 'Posts about technology and programming', slug: generateSlug('Technology') },
  { name: 'Lifestyle', description: 'Posts about lifestyle and personal development', slug: generateSlug('Lifestyle') },
  { name: 'Travel', description: 'Posts about travel experiences and tips', slug: generateSlug('Travel') },
  { name: 'Food', description: 'Posts about food recipes and cooking', slug: generateSlug('Food') },
  { name: 'Health', description: 'Posts about health and wellness', slug: generateSlug('Health') },
];

async function seedCategories() {
  try {
    // Connect only if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB');
    }

    const existing = await Category.find();
    if (existing.length > 0) {
      console.log('⚠️ Categories already exist, skipping seeding.');
      return;
    }

    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');

    const seeded = await Category.find();
    console.log('Seeded categories:');
    seeded.forEach((c) => console.log(`- ${c.name} (slug: ${c.slug})`));
  } catch (err) {
    console.error('❌ Error seeding categories:', err.message);
  } finally {
    // Gracefully disconnect only if connected in this script
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// If this file is executed directly via CLI -> run immediately
if (require.main === module) {
  seedCategories()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

// Otherwise (if imported), just export the function
module.exports = seedCategories;

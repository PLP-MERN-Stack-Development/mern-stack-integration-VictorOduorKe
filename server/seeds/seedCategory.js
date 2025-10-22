// scripts/seedCategories.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
const dotenv = require('dotenv');

dotenv.config();

// Function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const categories = [
  { 
    name: 'Technology', 
    description: 'Posts about technology and programming',
    slug: generateSlug('Technology')
  },
  { 
    name: 'Lifestyle', 
    description: 'Posts about lifestyle and personal development',
    slug: generateSlug('Lifestyle')
  },
  { 
    name: 'Travel', 
    description: 'Posts about travel experiences and tips',
    slug: generateSlug('Travel')
  },
  { 
    name: 'Food', 
    description: 'Posts about food recipes and cooking',
    slug: generateSlug('Food')
  },
  { 
    name: 'Health', 
    description: 'Posts about health and wellness',
    slug: generateSlug('Health')
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories with individual saves to trigger middleware
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
    }
    
    console.log('Categories seeded successfully');

    // Display seeded categories
    const seededCategories = await Category.find();
    console.log('Seeded categories:');
    seededCategories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

module.exports=seedCategories;
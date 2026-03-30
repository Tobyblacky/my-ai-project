const mongoose = require('mongoose');
const Product = require('./api/models/Product');
require('dotenv').config();

const products = [
  // iPhone
  { name: 'iPhone 17', tagline: 'The future in your pocket.', price: 1200000, category: 'iPhone', stock: 50, image: 'https://tse2.mm.bing.net/th/id/OIP.qoGKxse28XKHyq3C8cMz7gHaHa?rs=1&pid=ImgDetMain' },
  { name: 'iPhone 16 Pro', tagline: 'Pro-level performance and efficiency.', price: 1500000, category: 'iPhone', stock: 40, image: 'https://tse2.mm.bing.net/th/id/OIP.FGhTFSJAR9DGo06KOQg_JgHaEK?rs=1&pid=ImgDetMain' },
  { name: 'iPhone 14 Pro', tagline: 'Advanced camera system and great battery.', price: 550000, category: 'iPhone', stock: 60, image: 'https://phoneforlease.com/wp-content/uploads/2022/10/iphone-14-pro-max-1.jpg' },
  
  // Mac
  { name: 'MacBook Pro 16"', tagline: 'Powerful performance for professionals.', price: 3500000, category: 'Mac', stock: 20, image: 'https://everymac.com/images/cpu_pics/apple_macbook_pro_16_2021_1.jpg' },
  { name: 'MacBook Air M2', tagline: 'Ultra-thin and incredibly powerful.', price: 2100000, category: 'Mac', stock: 35, image: 'https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP858/macbook-air-m2-hero-202207.jpg' },
  
  // iPad
  { name: 'iPad Pro 12.9"', tagline: 'The ultimate iPad experience.', price: 1800000, category: 'iPad', stock: 25, image: 'https://everymac.com/images/cpu_pics/apple_ipad_pro_12in_6th_gen_1.jpg' },
  { name: 'iPad Air', tagline: 'All the power. All the color.', price: 1200000, category: 'iPad', stock: 40, image: 'https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP1051/ipad-air-4th-gen-hero.jpg' },
  
  // Watch
  { name: 'Apple Watch Ultra', tagline: 'Adventure awaits.', price: 800000, category: 'Watch', stock: 30, image: 'https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP872/apple-watch-ultra-hero.jpg' },
  { name: 'Apple Watch Series 9', tagline: 'The ultimate fitness companion.', price: 500000, category: 'Watch', stock: 50, image: 'https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP871/apple-watch-series-9-hero.jpg' },
  
  // Airpods
  { name: 'AirPods Pro', tagline: 'The best active noise cancellation.', price: 250000, category: 'Airpods', stock: 100, image: 'https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP843/airpods-pro-hero-202209.jpg' },
  { name: 'AirPods Max', tagline: 'Spatial audio at a new height.', price: 600000, category: 'Airpods', stock: 45, image: 'https://support.apple.com/library/APPLE/APPLECARE_ALLGEOS/SP869/airpods-max-hero.jpg' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`Successfully seeded ${result.length} products!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();

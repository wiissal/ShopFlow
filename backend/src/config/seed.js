const pool = require('./database');

const categories = [
  { name: 'Laptops', description: 'High performance laptops for work and gaming' },
  { name: 'Phones', description: 'Latest smartphones from top brands' },
  { name: 'Audio', description: 'Headphones, earbuds and speakers' },
  { name: 'Accessories', description: 'Cables, cases, chargers and more' },
  { name: 'Gaming', description: 'Gaming gear and accessories' },
];

const products = [
  // Laptops
  {
    name: 'MacBook Pro 14"',
    description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD. The most powerful MacBook ever.',
    price: 1950.99,
    stock: 15,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
  },
  {
    name: 'Dell XPS 15',
    description: 'Intel Core i9, 32GB RAM, 1TB SSD, OLED 4K display.',
    price: 1590,
    stock: 10,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
  },
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'AMD Ryzen 9, RTX 4060, 16GB RAM. Built for gaming on the go.',
    price: 1700.99,
    stock: 8,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Intel Core i7, 16GB RAM, 512GB SSD. Ultra-light business laptop.',
    price: 1349.99,
    stock: 12,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
  },

  // Phones
  {
    name: 'iPhone 15 Pro',
    description: 'A17 Pro chip, titanium design, 48MP camera system.',
    price: 850,
    stock: 30,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Snapdragon 8 Gen 3, 200MP camera, built-in S Pen.',
    price: 870.99,
    stock: 20,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Google Tensor G3, best-in-class AI photography, 7 years of updates.',
    price: 699.99,
    stock: 18,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
  },
  {
    name: 'OnePlus 12',
    description: 'Snapdragon 8 Gen 3, 50W wireless charging, 120Hz AMOLED.',
    price: 689.99,
    stock: 14,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
  },

  // Audio
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation, 30hr battery, premium sound.',
    price: 349.99,
    stock: 25,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
  },
  {
    name: 'AirPods Pro 2nd Gen',
    description: 'Active noise cancellation, Adaptive Transparency, H2 chip.',
    price: 249.99,
    stock: 40,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'World-class noise cancellation, 24hr battery, premium comfort.',
    price: 279.99,
    stock: 20,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  },
  {
    name: 'Samsung Galaxy Buds 2 Pro',
    description: '24-bit Hi-Fi sound, intelligent ANC, ergonomic design.',
    price: 179.99,
    stock: 30,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
  },

  // Accessories
  {
    name: 'Apple MagSafe Charger',
    description: '15W fast wireless charging for iPhone 12 and later.',
    price: 50.99,
    stock: 60,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
  },
  {
    name: 'Anker 100W USB-C Hub',
    description: '7-in-1 USB-C hub with 4K HDMI, 100W PD, SD card reader.',
    price: 59.99,
    stock: 45,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800&q=80',
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'Advanced wireless mouse, 8K DPI, silent clicks, multi-device.',
    price: 99.99,
    stock: 35,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  },
  {
    name: 'Samsung 65W USB-C Charger',
    description: 'Fast charging for laptops, tablets and phones. Compact design.',
    price: 49.99,
    stock: 50,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1601999009162-2459b78386a8?w=800&q=80',
  },

  // Gaming
  {
    name: 'PlayStation 5 Controller',
    description: 'DualSense wireless controller with haptic feedback and adaptive triggers.',
    price: 169.99,
    stock: 40,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
  },
  {
    name: 'Xbox Elite Controller Series 2',
    description: 'Pro-level controller with adjustable tension thumbsticks and paddles.',
    price: 179.99,
    stock: 20,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80',
  },
  {
    name: 'Razer DeathAdder V3',
    description: 'Ultra-lightweight gaming mouse, 30K DPI optical sensor.',
    price: 189.99,
    stock: 30,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',
  },
  {
    name: 'SteelSeries Arctis Nova Pro',
    description: 'Multi-system gaming headset, ANC, dual wireless, 360° spatial audio.',
    price: 349.99,
    stock: 15,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80',
  },
];

async function seed() {
  console.log(' Starting seed...');

  try {
    // Clear existing data
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');

    console.log('  Cleared existing data');

    // Insert categories
    const categoryMap = {};
    for (const cat of categories) {
      const res = await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
        [cat.name, cat.description]
      );
      categoryMap[cat.name] = res.rows[0].id;
      console.log(`Category: ${cat.name}`);
    }

    // Insert products
    for (const product of products) {
      await pool.query(
        'INSERT INTO products (name, description, price, stock, image, category_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          product.name,
          product.description,
          product.price,
          product.stock,
          product.image,
          categoryMap[product.category],
        ]
      );
      console.log(`Product: ${product.name}`);
    }

    console.log('\n Seed complete! 5 categories, 20 products added.');
    process.exit(0);
  } catch (err) {
    console.error(' Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
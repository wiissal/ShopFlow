const pool = require('./database');

const categories = [
  { name: 'Laptops', description: 'High performance laptops for work and gaming' },
  { name: 'Phones', description: 'Latest smartphones from top brands' },
  { name: 'Audio', description: 'Headphones, earbuds and speakers' },
  { name: 'Accessories', description: 'Cables, cases, chargers and more' },
  { name: 'Gaming', description: 'Gaming gear and accessories' },
];

const products = [
  // ── LAPTOPS ──
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
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by M2 chip, 8GB RAM, 256GB SSD. Impossibly thin.',
    price: 1099.99,
    stock: 20,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1611186871525-6e2a39b04636?w=800&q=80',
  },
  {
    name: 'HP Spectre x360',
    description: '13.5" OLED touch, Intel Core i7, 16GB RAM, 512GB SSD.',
    price: 1399.99,
    stock: 10,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
  },
  {
    name: 'Microsoft Surface Pro 9',
    description: 'Intel Core i5, 8GB RAM, 256GB SSD. Tablet meets laptop.',
    price: 999.99,
    stock: 12,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=800&q=80',
  },
  {
    name: 'Razer Blade 15',
    description: 'Intel Core i9, RTX 4070, 16GB RAM. The ultimate gaming laptop.',
    price: 2499.99,
    stock: 6,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
  },

  // ── PHONES ──
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
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=781&auto=format&fit=crop',
  },
  {
    name: 'iPhone 14',
    description: 'A15 Bionic chip, 6.1" Super Retina XDR display, 12MP camera.',
    price: 699.99,
    stock: 35,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80',
  },
  {
    name: 'Samsung Galaxy A54',
    description: '6.4" Super AMOLED, 50MP camera, 5000mAh battery.',
    price: 449.99,
    stock: 40,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800&q=80',
  },
  {
    name: 'Xiaomi 13 Pro',
    description: 'Snapdragon 8 Gen 2, Leica camera, 120W HyperCharge.',
    price: 799.99,
    stock: 15,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
  },
  {
    name: 'iPhone 15',
    description: 'A16 Bionic, Dynamic Island, USB-C, 48MP main camera.',
    price: 799.99,
    stock: 25,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1695048064285-f6d3a82e0912?w=800&q=80',
  },

  // ── AUDIO ──
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
  {
    name: 'Jabra Evolve2 85',
    description: 'Professional wireless headset, ANC, 37hr battery.',
    price: 299.99,
    stock: 18,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
  },
  {
    name: 'JBL Tune 760NC',
    description: 'Wireless over-ear, ANC, 35hr playtime, foldable design.',
    price: 99.99,
    stock: 45,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
  },
  {
    name: 'Beats Studio Pro',
    description: 'Personalized spatial audio, USB-C, 40hr battery.',
    price: 349.99,
    stock: 20,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
  },
  {
    name: 'Sony WF-1000XM5',
    description: 'Industry-leading ANC earbuds, 8hr battery, LDAC support.',
    price: 279.99,
    stock: 22,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80',
  },

  // ── ACCESSORIES ──
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
    image: 'https://images.unsplash.com/photo-1518547606470-00ac2ae882af?q=80&w=687&auto=format&fit=crop',
  },
  {
    name: 'Apple Watch Series 9',
    description: 'S9 chip, Double Tap gesture, Always-On Retina display.',
    price: 399.99,
    stock: 25,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800&q=80',
  },
  {
    name: 'iPad Pro 11"',
    description: 'M2 chip, Liquid Retina display, Thunderbolt port.',
    price: 799.99,
    stock: 15,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
  },
  {
    name: 'Logitech MX Keys',
    description: 'Advanced wireless keyboard, backlit, multi-device.',
    price: 109.99,
    stock: 40,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
  },
  {
    name: 'Samsung T7 SSD 1TB',
    description: 'Portable SSD, USB 3.2, 1050MB/s read speed, compact.',
    price: 89.99,
    stock: 50,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1597138804456-e7dca7f59d54?w=800&q=80',
  },
  {
    name: 'Belkin 3-in-1 Wireless Charger',
    description: 'Charge iPhone, AirPods and Apple Watch simultaneously.',
    price: 149.99,
    stock: 35,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
  },
  {
    name: 'Google Pixel Watch 2',
    description: 'Wear OS, Fitbit health tracking, 24hr battery, LTE.',
    price: 349.99,
    stock: 18,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
  },

  // ── GAMING ──
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
  console.log('🌱 Starting seed...');

  try {
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');

    console.log('🗑️  Cleared existing data');

    const categoryMap = {};
    for (const cat of categories) {
      const res = await pool.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
        [cat.name, cat.description]
      );
      categoryMap[cat.name] = res.rows[0].id;
      console.log(`✅ Category: ${cat.name}`);
    }

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
      console.log(`✅ Product: ${product.name}`);
    }

    console.log('\n🎉 Seed complete! 5 categories, 36 products added.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
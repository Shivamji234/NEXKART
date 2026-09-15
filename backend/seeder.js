const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Coupon = require('./models/Coupon');
const Review = require('./models/Review');
const Address = require('./models/Address');

const categories = [
  {
    name: 'Men',
    slug: 'men',
    description: 'Bespoke tailoring, refined outerwear, and everyday luxury essentials for gentlemen.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80',
    order: 1,
    subcategories: [
      { name: 'Suits & Blazers', slug: 'suits-blazers' },
      { name: 'Outerwear & Coats', slug: 'outerwear-coats' },
      { name: 'Shirts & Knits', slug: 'shirts-knits' },
      { name: 'Trousers', slug: 'trousers' },
    ],
  },
  {
    name: 'Women',
    slug: 'women',
    description: 'Iconic silhouettes, couture eveningwear, and impeccably tailored everyday garments.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    order: 2,
    subcategories: [
      { name: 'Dresses & Gowns', slug: 'dresses-gowns' },
      { name: 'Coats & Jackets', slug: 'coats-jackets' },
      { name: 'Silk Tops & Blouses', slug: 'tops-blouses' },
      { name: 'Skirts & Pants', slug: 'skirts-pants' },
    ],
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Masterfully crafted leather oxfords, equestrian boots, and artisanal low-profile sneakers.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    order: 3,
    subcategories: [
      { name: 'Leather Loafers', slug: 'loafers' },
      { name: 'Chelsea Boots', slug: 'boots' },
      { name: 'Oxford Shoes', slug: 'oxfords' },
      { name: 'Luxury Sneakers', slug: 'sneakers' },
    ],
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Handcrafted full-grain leather bags, pure silk scarves, and fine leather goods.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
    order: 4,
    subcategories: [
      { name: 'Leather Bags & Briefcases', slug: 'bags' },
      { name: 'Silk Scarves', slug: 'scarves' },
      { name: 'Belts & Wallets', slug: 'small-leather' },
      { name: 'Eyewear', slug: 'eyewear' },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Ultra-soft organic cotton, heirloom knitwear, and playful sophisticated ensembles.',
    image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80',
    order: 5,
    subcategories: [
      { name: 'Occasion Wear', slug: 'occasion-wear' },
      { name: 'Knitwear & Sweaters', slug: 'knitwear' },
      { name: 'Everyday Essentials', slug: 'everyday' },
    ],
  },
  {
    name: 'Haute Horlogerie',
    slug: 'haute-horlogerie',
    description: 'Swiss precision timepieces engineered with horological excellence and timeless prestige.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    order: 6,
    subcategories: [
      { name: 'Automatic Chronographs', slug: 'chronographs' },
      { name: 'Heritage Classic', slug: 'classic-watches' },
    ],
  },
];

const sampleProducts = [
  // MEN
  {
    name: 'The Sovereign Cashmere Overcoat',
    sku: 'NX-MEN-001',
    description: 'Crafted from 100% Mongolian grade-A double-faced cashmere. Featuring a structured notched lapel, horn button closures, hand-finished pick stitching, and an interior silk satin lining.',
    shortDescription: 'Double-faced pure cashmere overcoat tailored in Biella, Italy.',
    category: 'Men',
    subcategory: 'Outerwear & Coats',
    brand: 'NexKart Atelier',
    price: 34999,
    discountPrice: 28999,
    discountPercentage: 17,
    images: [
      { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Cashmere Overcoat front view' },
      { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Model wearing Cashmere Overcoat' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Camel Tan', hex: '#C19A6B' }, { name: 'Midnight Charcoal', hex: '#232B2B' }],
    stock: 14,
    tags: ['luxury', 'cashmere', 'winter', 'outerwear', 'menswear'],
    specifications: [
      { key: 'Material', value: '100% Mongolian Cashmere' },
      { key: 'Lining', value: '100% Cupro Silk' },
      { key: 'Origin', value: 'Handcrafted in Biella, Italy' },
      { key: 'Care', value: 'Specialist Dry Clean Only' },
    ],
    rating: 4.9,
    numReviews: 28,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    name: 'Milano Bespoke Wool Tuxedo',
    sku: 'NX-MEN-002',
    description: 'Sartorial perfection in Super 150s Merino wool with silk faille peak lapels. Single-breasted silhouette with covered buttons and trousers with silk side braiding.',
    shortDescription: 'Super 150s Merino wool tuxedo with silk faille lapels.',
    category: 'Men',
    subcategory: 'Suits & Blazers',
    brand: 'Sartoria Milano',
    price: 49999,
    discountPrice: 44999,
    discountPercentage: 10,
    images: [
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Milano Tuxedo' },
      { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Tuxedo details' },
    ],
    sizes: ['38R', '40R', '42R', '44R'],
    colors: [{ name: 'Obsidian Black', hex: '#000000' }, { name: 'Midnight Blue', hex: '#191970' }],
    stock: 9,
    tags: ['tuxedo', 'black-tie', 'eveningwear', 'bespoke', 'suit'],
    specifications: [
      { key: 'Cloth', value: 'Super 150s Pure Wool' },
      { key: 'Lapel', value: 'Hand-rolled Silk Faille' },
      { key: 'Closure', value: 'Single Button Silk Covered' },
    ],
    rating: 5.0,
    numReviews: 19,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'Sea Island Cotton Poplin Shirt',
    sku: 'NX-MEN-003',
    description: 'The epitome of formal shirting. Spun from ultra-long-staple Sea Island cotton offering silky hand feel and exceptional breathability. Finished with genuine mother-of-pearl buttons.',
    shortDescription: 'Crisp Sea Island cotton shirt with spread collar.',
    category: 'Men',
    subcategory: 'Shirts & Knits',
    brand: 'NexKart Atelier',
    price: 8999,
    discountPrice: 0,
    discountPercentage: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Cotton Poplin Shirt' },
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Shirt collar view' },
    ],
    sizes: ['39', '40', '41', '42', '43'],
    colors: [{ name: 'Optic White', hex: '#FFFFFF' }, { name: 'Ciel Blue', hex: '#B0DFE5' }],
    stock: 25,
    tags: ['shirt', 'formal', 'cotton', 'classic'],
    specifications: [
      { key: 'Fabric', value: '100% Sea Island Cotton' },
      { key: 'Collar', value: 'Semi-Spread Collar with Removable Stays' },
      { key: 'Buttons', value: 'Australian Mother of Pearl' },
    ],
    rating: 4.8,
    numReviews: 42,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    name: 'Merino Wool Ribbed Turtleneck',
    sku: 'NX-MEN-004',
    description: 'Spun from extra-fine 19.5-micron Australian merino wool with a dense English rib knit. Designed for refined layering beneath sports jackets or tailored overcoats.',
    shortDescription: 'Extra-fine merino wool ribbed knit sweater.',
    category: 'Men',
    subcategory: 'Shirts & Knits',
    brand: 'Maison Nex',
    price: 12999,
    discountPrice: 10499,
    discountPercentage: 19,
    images: [
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Merino Turtleneck' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Charcoal Grey', hex: '#36454F' }, { name: 'Ivory Cream', hex: '#FFFFF0' }],
    stock: 18,
    tags: ['knitwear', 'sweater', 'winter', 'wool'],
    specifications: [
      { key: 'Gauge', value: '7 Gauge English Rib' },
      { key: 'Origin', value: 'Knit in Scotland' },
    ],
    rating: 4.7,
    numReviews: 15,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },

  // WOMEN
  {
    name: 'The Aurelia Silk Satin Evening Gown',
    sku: 'NX-WMN-001',
    description: 'An ethereal bias-cut column gown draped in heavyweight 22-momme silk mulberry satin. Features an open cowl back, cascading train, and delicate hand-sewn hemline.',
    shortDescription: 'Bias-cut mulberry silk satin gown with cowl neckline.',
    category: 'Women',
    subcategory: 'Dresses & Gowns',
    brand: 'L\'Étoile',
    price: 39999,
    discountPrice: 33999,
    discountPercentage: 15,
    images: [
      { url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Silk Evening Gown' },
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Silk Gown side draping' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Champagne Gold', hex: '#F7E7CE' }, { name: 'Noir Onyx', hex: '#0B0B0B' }, { name: 'Emerald', hex: '#097969' }],
    stock: 8,
    tags: ['eveningwear', 'gown', 'silk', 'couture', 'red-carpet'],
    specifications: [
      { key: 'Composition', value: '100% Grade 6A Mulberry Silk' },
      { key: 'Weight', value: '22 Momme Heavyweight Satin' },
      { key: 'Detail', value: 'Cowl Neckline with Open Scalloped Back' },
    ],
    rating: 5.0,
    numReviews: 34,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    name: 'The Kensington Double-Breasted Trench',
    sku: 'NX-WMN-002',
    description: 'Engineered in weatherproof cotton gabardine woven in Yorkshire. Detailed with buffalo horn buttons, storm shield flaps, leather-wrapped buckles, and signature vintage check interior lining.',
    shortDescription: 'Weatherproof cotton gabardine double-breasted trench coat.',
    category: 'Women',
    subcategory: 'Coats & Jackets',
    brand: 'NexKart Atelier',
    price: 29999,
    discountPrice: 24999,
    discountPercentage: 17,
    images: [
      { url: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Kensington Trench Coat' },
      { url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Trench coat lifestyle' },
    ],
    sizes: ['UK 6', 'UK 8', 'UK 10', 'UK 12'],
    colors: [{ name: 'Honey Sand', hex: '#C2B280' }, { name: 'Midnight Navy', hex: '#000080' }],
    stock: 12,
    tags: ['trench', 'outerwear', 'classic', 'weatherproof', 'coat'],
    specifications: [
      { key: 'Fabric', value: 'Water-Repellent Cotton Gabardine' },
      { key: 'Buckles', value: 'Hand-Stitched Calf Leather' },
      { key: 'Origin', value: 'Made in England' },
    ],
    rating: 4.9,
    numReviews: 27,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'Verona Tailored Crepe Blazer',
    sku: 'NX-WMN-003',
    description: 'Immaculately proportioned jacket in fluid wool-crepe with sculpted hour-glass waistline, padded shoulders, and horn buttons. Designed to transition seamlessly from boardroom to gala.',
    shortDescription: 'Structured wool-crepe blazer with notched lapels.',
    category: 'Women',
    subcategory: 'Coats & Jackets',
    brand: 'L\'Étoile',
    price: 21999,
    discountPrice: 18999,
    discountPercentage: 14,
    images: [
      { url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Tailored Crepe Blazer' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Chalk White', hex: '#F5F5F5' }, { name: 'Caviar Black', hex: '#111111' }],
    stock: 15,
    tags: ['blazer', 'tailoring', 'power-dressing', 'crepe'],
    specifications: [
      { key: 'Shell', value: '98% Virgin Wool, 2% Elastane Crepe' },
      { key: 'Lining', value: '100% Habotai Silk' },
    ],
    rating: 4.8,
    numReviews: 18,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    name: 'Venetian Silk Georgette Blouse',
    sku: 'NX-WMN-004',
    description: 'Light-as-air silk georgette blouse featuring subtle balloon sleeves, high gathered collar, and covered button front. A timeless layering statement for contemporary connoisseurs.',
    shortDescription: 'Sheer pleated silk georgette blouse with poet sleeves.',
    category: 'Women',
    subcategory: 'Silk Tops & Blouses',
    brand: 'Maison Nex',
    price: 11999,
    discountPrice: 0,
    discountPercentage: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Silk Georgette Blouse' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Pearl Ivory', hex: '#EAE0C8' }, { name: 'Rose Quartz', hex: '#F7CAC9' }],
    stock: 20,
    tags: ['blouse', 'silk', 'tops', 'feminine'],
    specifications: [
      { key: 'Fabric', value: '100% Silk Georgette' },
      { key: 'Fit', value: 'Relaxed Fluid Silhouette' },
    ],
    rating: 4.7,
    numReviews: 11,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },

  // FOOTWEAR
  {
    name: 'Artisan Wholecut Oxford Shoes',
    sku: 'NX-FW-001',
    description: 'Cut from a single unblemished piece of French calfskin with Goodyear-welted leather soles. Hand-patinated by Italian master cordwainers to create a rich gradient lustre.',
    shortDescription: 'Seamless wholecut calfskin oxfords with hand-painted patina.',
    category: 'Footwear',
    subcategory: 'Oxford Shoes',
    brand: 'NexKart Atelier',
    price: 27999,
    discountPrice: 22999,
    discountPercentage: 18,
    images: [
      { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Wholecut Oxford Shoes' },
      { url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Sole detailing' },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Cognac Patina', hex: '#9E472A' }, { name: 'Ebony Gloss', hex: '#1C1C1C' }],
    stock: 10,
    tags: ['footwear', 'oxford', 'leather', 'handcrafted', 'formal'],
    specifications: [
      { key: 'Construction', value: 'Handmade Goodyear Welt' },
      { key: 'Upper', value: 'Full-Grain French Boxcalf Leather' },
      { key: 'Sole', value: 'Oak-Bark Tanned Leather Sole with Brass Nails' },
    ],
    rating: 4.9,
    numReviews: 31,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'The Sovereign Chelsea Boot',
    sku: 'NX-FW-002',
    description: 'Equestrian-inspired boots crafted from buttery Italian suede treated with hydrophobic nano-coating. Features durable crepe rubber soles and pull tabs for effortless glide.',
    shortDescription: 'Italian suede Chelsea boot with crepe sole.',
    category: 'Footwear',
    subcategory: 'Chelsea Boots',
    brand: 'Maison Nex',
    price: 24999,
    discountPrice: 19999,
    discountPercentage: 20,
    images: [
      { url: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Suede Chelsea Boots' },
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: [{ name: 'Sand Suede', hex: '#D2B48C' }, { name: 'Espresso Suede', hex: '#3D2B1F' }],
    stock: 14,
    tags: ['boots', 'chelsea', 'suede', 'casual-luxury'],
    specifications: [
      { key: 'Upper', value: 'Water-Resistant Italian Calf Suede' },
      { key: 'Outsole', value: 'Natural Plantation Crepe' },
    ],
    rating: 4.8,
    numReviews: 24,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    name: 'Grand Prix Calfskin Tennis Sneaker',
    sku: 'NX-FW-003',
    description: 'Minimalist court sneaker engineered in supple Nappa leather with padded collars, Margom rubber cupsole, and waxed cotton laces. The benchmark of understated elegance.',
    shortDescription: 'Clean Italian Nappa leather low-top court sneaker.',
    category: 'Footwear',
    subcategory: 'Luxury Sneakers',
    brand: 'NexKart Atelier',
    price: 16999,
    discountPrice: 14499,
    discountPercentage: 15,
    images: [
      { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Grand Prix Sneakers' },
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'Pristine White', hex: '#FFFFFF' }, { name: 'Monochrome Black', hex: '#111111' }],
    stock: 22,
    tags: ['sneakers', 'leather', 'minimalist', 'footwear'],
    specifications: [
      { key: 'Upper', value: 'Italian Full-Grain Nappa Leather' },
      { key: 'Sole', value: 'Italian Margom Rubber Cupsole' },
    ],
    rating: 4.9,
    numReviews: 48,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },

  // ACCESSORIES & BAGS
  {
    name: 'The Grand Tour Leather Weekender',
    sku: 'NX-ACC-001',
    description: 'Engineered for discerning travelers. Sculpted from vegetable-tanned Vachetta leather that develops a magnificent patina over decades. Accented with solid brass hardware and detachable padded shoulder strap.',
    shortDescription: 'Vegetable-tanned Vachetta leather travel holdall.',
    category: 'Accessories',
    subcategory: 'Leather Bags & Briefcases',
    brand: 'NexKart Atelier',
    price: 36999,
    discountPrice: 31999,
    discountPercentage: 14,
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Leather Weekender Bag' },
      { url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Bag open interior' },
    ],
    sizes: ['One Size (45L)'],
    colors: [{ name: 'Heritage Saddle', hex: '#8B4513' }, { name: 'Castagna Brown', hex: '#5C4033' }],
    stock: 7,
    tags: ['bag', 'travel', 'leather', 'weekender', 'handcrafted'],
    specifications: [
      { key: 'Dimensions', value: '52cm x 30cm x 26cm' },
      { key: 'Leather', value: 'Tuscan Vegetable-Tanned Vachetta' },
      { key: 'Hardware', value: 'Hand-Polished Antiqued Solid Brass' },
    ],
    rating: 5.0,
    numReviews: 29,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'Monogram Quilted Flap Bag',
    sku: 'NX-ACC-002',
    description: 'Iconic diamond-quilted calfskin shoulder bag with sliding ruthenium chain strap, turnlock closure, and dual interior compartments lined in burgundy lambskin.',
    shortDescription: 'Quilted calfskin shoulder bag with ruthenium chain.',
    category: 'Accessories',
    subcategory: 'Leather Bags & Briefcases',
    brand: 'L\'Étoile',
    price: 42999,
    discountPrice: 38999,
    discountPercentage: 9,
    images: [
      { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Quilted Flap Bag' },
    ],
    sizes: ['Medium (26cm)'],
    colors: [{ name: 'Noir Caviar', hex: '#0A0A0A' }, { name: 'Bordeaux Red', hex: '#800020' }],
    stock: 5,
    tags: ['bag', 'handbag', 'couture', 'luxury', 'quilted'],
    specifications: [
      { key: 'Material', value: 'Grained Calfskin (Caviar)' },
      { key: 'Hardware', value: 'Ruthenium-Tone Metal' },
    ],
    rating: 4.9,
    numReviews: 36,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
  },
  {
    name: 'Equestrian Heritage Silk Twill Scarf',
    sku: 'NX-ACC-003',
    description: 'A 90cm square silk twill scarf printed with archival equestrian illustrations in 18 vibrant screens. Finished by hand with artisanal rolled edges by Lyon artisans.',
    shortDescription: 'Hand-rolled 90cm silk twill scarf printed in Lyon.',
    category: 'Accessories',
    subcategory: 'Silk Scarves',
    brand: 'Aurum & Co.',
    price: 14999,
    discountPrice: 0,
    discountPercentage: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Silk Twill Scarf' },
    ],
    sizes: ['90cm x 90cm'],
    colors: [{ name: 'Royal Gold & Navy', hex: '#DAA520' }, { name: 'Verdant Green', hex: '#2E8B57' }],
    stock: 16,
    tags: ['scarf', 'silk', 'accessories', 'gift'],
    specifications: [
      { key: 'Silk', value: '100% Silk Twill (14 Momme)' },
      { key: 'Edge', value: 'Hand-Rolled French Roulotté' },
    ],
    rating: 4.8,
    numReviews: 21,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },

  // HAUTE HORLOGERIE
  {
    name: 'The Chronos Perpetual Skeleton Chronograph',
    sku: 'NX-WTCH-001',
    description: 'A pinnacle of micro-engineering. Powered by an automatic manufacture column-wheel chronograph calibre with 72-hour power reserve. Encased in 18k Rose Gold with sapphire crystal case back and alligator strap.',
    shortDescription: '18k Rose Gold automatic column-wheel chronograph with skeleton dial.',
    category: 'Haute Horlogerie',
    subcategory: 'Automatic Chronographs',
    brand: 'Chronos Genève',
    price: 124999,
    discountPrice: 114999,
    discountPercentage: 8,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Luxury Watch Chronograph' },
      { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80', isPrimary: false, alt: 'Watch on wrist' },
    ],
    sizes: ['41mm Case'],
    colors: [{ name: 'Rose Gold & Slate', hex: '#B76E79' }],
    stock: 3,
    tags: ['watch', 'horology', 'chronograph', 'gold', 'swiss'],
    specifications: [
      { key: 'Case', value: '18k 4N Rose Gold, 41mm Diameter, 11.2mm Thickness' },
      { key: 'Movement', value: 'Calibre CG-9800 Automatic, 28,800 vph, 72h Reserve' },
      { key: 'Crystal', value: 'Double Anti-Reflective Glareproof Sapphire' },
      { key: 'Strap', value: 'Mississippiensis Alligator with 18k Deployant Buckle' },
    ],
    rating: 5.0,
    numReviews: 12,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    name: 'Nautilus Heritage Automatic 39mm',
    sku: 'NX-WTCH-002',
    description: 'Sculpted in 904L surgical-grade stainless steel with satin-brushed chamfers and sunburst fumé dial. Certified chronometer COSC with 100-meter water resistance.',
    shortDescription: '904L stainless steel automatic sports watch with integrated bracelet.',
    category: 'Haute Horlogerie',
    subcategory: 'Heritage Classic',
    brand: 'Chronos Genève',
    price: 74999,
    discountPrice: 69999,
    discountPercentage: 7,
    images: [
      { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Nautilus Heritage Watch' },
    ],
    sizes: ['39mm Case'],
    colors: [{ name: 'Glacier Blue', hex: '#71A6D2' }, { name: 'Anthracite', hex: '#383838' }],
    stock: 6,
    tags: ['watch', 'steel', 'luxury', 'cosc'],
    specifications: [
      { key: 'Material', value: '904L Superalloy Stainless Steel' },
      { key: 'Water Resistance', value: '100 Meters / 10 ATM' },
      { key: 'Movement', value: 'COSC-Certified Automatic Chronometer' },
    ],
    rating: 4.9,
    numReviews: 17,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },

  // KIDS
  {
    name: 'Little Heirloom Cashmere Cardigan',
    sku: 'NX-KID-001',
    description: 'Featherlight baby cardigan knitted from hypoallergenic 100% pure cashmere. Features real mother-of-pearl buttons and ribbed trims designed for ultimate baby comfort.',
    shortDescription: 'Pure cashmere hypoallergenic cardigan for children.',
    category: 'Kids',
    subcategory: 'Knitwear & Sweaters',
    brand: 'NexKart Atelier',
    price: 6999,
    discountPrice: 5499,
    discountPercentage: 21,
    images: [
      { url: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Kids Cashmere Cardigan' },
    ],
    sizes: ['2Y', '3Y', '4Y', '6Y'],
    colors: [{ name: 'Oatmeal Heather', hex: '#D7C4B7' }, { name: 'Pastel Rose', hex: '#FFD1DC' }],
    stock: 15,
    tags: ['kids', 'cashmere', 'knitwear', 'heirloom'],
    specifications: [
      { key: 'Composition', value: '100% Pure Mongolian Cashmere' },
      { key: 'Safety', value: 'OEKO-TEX Certified Non-Toxic Dyes' },
    ],
    rating: 4.9,
    numReviews: 14,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    name: 'Petite Fleur Silk Party Dress',
    sku: 'NX-KID-002',
    description: 'An enchanting special occasion dress with hand-smocked bodice, peter pan collar, and tulle petticoat underlay. Perfect for flower girls and celebratory milestones.',
    shortDescription: 'Hand-smocked silk occasion dress with bow sash.',
    category: 'Kids',
    subcategory: 'Occasion Wear',
    brand: 'L\'Étoile',
    price: 8499,
    discountPrice: 6999,
    discountPercentage: 18,
    images: [
      { url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Girls Occasion Dress' },
    ],
    sizes: ['3Y', '4Y', '5Y', '6Y', '8Y'],
    colors: [{ name: 'Blush Pink', hex: '#DE5D83' }, { name: 'Snow Pearl', hex: '#F0F8FF' }],
    stock: 11,
    tags: ['kids', 'dress', 'celebration', 'silk'],
    specifications: [
      { key: 'Lining', value: '100% Organic Soft Cotton' },
      { key: 'Detail', value: 'Hand-Embroidered French Smocking' },
    ],
    rating: 4.8,
    numReviews: 19,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  },

  // MORE MEN & WOMEN TO REACH 22+
  {
    name: 'Florence Leather Driving Loafers',
    sku: 'NX-FW-004',
    description: 'Tubular moccasin construction in rich tumbled calfskin leather with signature pebble rubber soles. Engineered for comfort on coastal drives and relaxed weekend getaways.',
    shortDescription: 'Supple tumbled calfskin driving moccasins.',
    category: 'Footwear',
    subcategory: 'Leather Loafers',
    brand: 'Sartoria Milano',
    price: 18999,
    discountPrice: 15999,
    discountPercentage: 16,
    images: [
      { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Driving Loafers' },
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: [{ name: 'Tobacco Tan', hex: '#715D48' }, { name: 'Navy Nubuck', hex: '#1B263B' }],
    stock: 17,
    tags: ['loafers', 'moccasins', 'leather', 'shoes'],
    specifications: [
      { key: 'Construction', value: 'Tubular Hand-Stitched Moccasin' },
      { key: 'Sole', value: 'Segmented Rubber Gommino Studs' },
    ],
    rating: 4.7,
    numReviews: 22,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'Atelier Sartorial Pleated Trousers',
    sku: 'NX-MEN-005',
    description: 'High-waisted trousers with classic double forward pleats, side adjusters, and a generous tapered leg. Tailored in breathable 4-ply English fresco wool.',
    shortDescription: 'High-rise forward pleat trousers with side adjusters.',
    category: 'Men',
    subcategory: 'Trousers',
    brand: 'Sartoria Milano',
    price: 14999,
    discountPrice: 0,
    discountPercentage: 0,
    images: [
      { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Pleated Trousers' },
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [{ name: 'Light Charcoal', hex: '#4A4A4A' }, { name: 'Biscuit Taupe', hex: '#B38B6D' }],
    stock: 19,
    tags: ['trousers', 'tailoring', 'wool', 'classic'],
    specifications: [
      { key: 'Cloth', value: '4-Ply High-Twist Fresco Wool' },
      { key: 'Waistband', value: 'Extended Tab with Brass Side Adjusters' },
    ],
    rating: 4.8,
    numReviews: 16,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    name: 'The St. Moritz Cashmere Wrap Coat',
    sku: 'NX-WMN-005',
    description: 'Sumptuous dressing-gown style coat hand-stitched in pure zibeline cashmere. Cut with generous raglan sleeves, deep patch pockets, and a matching self-tie belt.',
    shortDescription: 'Belted wrap coat in rippled zibeline cashmere.',
    category: 'Women',
    subcategory: 'Coats & Jackets',
    brand: 'NexKart Atelier',
    price: 46999,
    discountPrice: 39999,
    discountPercentage: 15,
    images: [
      { url: 'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Cashmere Wrap Coat' },
    ],
    sizes: ['UK 8', 'UK 10', 'UK 12', 'UK 14'],
    colors: [{ name: 'Alabaster White', hex: '#F2F0EB' }, { name: 'Vicuna Camel', hex: '#A75D35' }],
    stock: 6,
    tags: ['coat', 'cashmere', 'wrap-coat', 'outerwear', 'luxury'],
    specifications: [
      { key: 'Fabric', value: '100% Zibeline Ripple-Finish Cashmere' },
      { key: 'Belt', value: 'Coordinated Reversible Cashmere Tie' },
    ],
    rating: 5.0,
    numReviews: 25,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'Palermo Full-Grain Leather Document Case',
    sku: 'NX-ACC-004',
    description: 'Slimline executive portfolio crafted in vegetable-tanned French bridle leather. Houses a 14-inch MacBook Pro, notebook, fountain pens, and passports with suede-lined partitions.',
    shortDescription: 'Slim vegetable-tanned bridle leather briefcase.',
    category: 'Accessories',
    subcategory: 'Leather Bags & Briefcases',
    brand: 'NexKart Atelier',
    price: 21999,
    discountPrice: 18499,
    discountPercentage: 16,
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Leather Document Case' },
    ],
    sizes: ['One Size (14" Laptop)'],
    colors: [{ name: 'Deep Burgundy', hex: '#58111A' }, { name: 'Raven Black', hex: '#000000' }],
    stock: 12,
    tags: ['portfolio', 'briefcase', 'leather', 'accessories'],
    specifications: [
      { key: 'Leather', value: 'Full-Grain English Bridle Hide' },
      { key: 'Zipper', value: 'Swiss Raccagni Polished Metal Teeth' },
    ],
    rating: 4.8,
    numReviews: 15,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    name: 'Sovereign Pilot Polarized Sunglasses',
    sku: 'NX-ACC-005',
    description: 'Handcrafted in Cadore, Italy with lightweight Japanese beta-titanium frames plated in 18k gold. Outfitted with scratch-resistant mineral glass polarized lenses with anti-reflective coating.',
    shortDescription: '18k gold-plated beta-titanium aviator sunglasses.',
    category: 'Accessories',
    subcategory: 'Eyewear',
    brand: 'Aurum & Co.',
    price: 18999,
    discountPrice: 15999,
    discountPercentage: 16,
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Titanium Sunglasses' },
    ],
    sizes: ['58-14-145'],
    colors: [{ name: '18k Gold & Green Lens', hex: '#D4AF37' }, { name: 'Platinum & Smoke', hex: '#E5E4E2' }],
    stock: 18,
    tags: ['sunglasses', 'eyewear', 'titanium', 'luxury'],
    specifications: [
      { key: 'Frame', value: 'Japanese Beta-Titanium with 18k Gold Electroplating' },
      { key: 'Lenses', value: 'Category 3 Polarized Barberini Mineral Glass' },
    ],
    rating: 4.9,
    numReviews: 26,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    name: 'Monaco Silk Resort Shirt',
    sku: 'NX-MEN-006',
    description: 'Camp collar resort shirt cut from washed 19-momme silk twill featuring hand-painted Mediterranean flora motifs. Tailored with mother-of-pearl buttons and straight vented hem.',
    shortDescription: 'Washed silk twill camp collar resort shirt.',
    category: 'Men',
    subcategory: 'Shirts & Knits',
    brand: 'Maison Nex',
    price: 13999,
    discountPrice: 11499,
    discountPercentage: 18,
    images: [
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80', isPrimary: true, alt: 'Silk Resort Shirt' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Terracotta Print', hex: '#E2725B' }, { name: 'Azure Marine', hex: '#007FFF' }],
    stock: 20,
    tags: ['shirt', 'silk', 'resort', 'summer', 'menswear'],
    specifications: [
      { key: 'Fabric', value: '100% Washed Sandwashed Silk Twill' },
      { key: 'Collar', value: 'Convertible Camp Collar' },
    ],
    rating: 4.8,
    numReviews: 14,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
];

const sampleCoupons = [
  {
    code: 'LUXURY20',
    description: '20% off on all luxury apparel and horology above ₹5,000.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 5000,
    maxDiscount: 3000,
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    usageLimit: 500,
    active: true,
  },
  {
    code: 'FIRST10',
    description: 'Welcome privilege: 10% off your inaugural NexKart order.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1500,
    maxDiscount: 1500,
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 1000,
    active: true,
  },
  {
    code: 'NEX500',
    description: 'Flat ₹500 instant savings on orders above ₹2,999.',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2999,
    maxDiscount: 500,
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    active: true,
  },
];

const seedData = async (exitProcess = true) => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Cleaning existing demo records...');
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Review.deleteMany();
    await Address.deleteMany();

    console.log('[Seeder] Seeding Categories...');
    await Category.insertMany(categories);

    console.log('[Seeder] Seeding Products...');
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('[Seeder] Seeding Coupons...');
    await Coupon.insertMany(sampleCoupons);

    console.log('[Seeder] Creating Demo Accounts...');
    // Create Admin User
    const adminUser = await User.create({
      name: 'Alexander Vance',
      email: 'admin@nexkart.com',
      mobile: '+919876543210',
      password: 'Admin@123456',
      role: 'admin',
      isVerified: true,
    });

    // Create Customer User
    const customerUser = await User.create({
      name: 'Evelyn St. Claire',
      email: 'customer@nexkart.com',
      mobile: '+919876543211',
      password: 'Customer@123456',
      role: 'customer',
      isVerified: true,
    });

    // Create sample address for customer
    await Address.create({
      user: customerUser._id,
      fullName: 'Evelyn St. Claire',
      mobile: '+919876543211',
      house: 'Penthouse 4B, The Grand Residences',
      street: 'Marine Drive, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400021',
      landmark: 'Opposite Oberoi Trident',
      addressType: 'Home',
      isDefault: true,
    });

    // Seed sample reviews
    if (createdProducts.length > 0) {
      await Review.create({
        user: customerUser._id,
        userName: customerUser.name,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Exquisite Drapery and Pure Cashmere Quality',
        comment: 'The weight and softness of the cashmere is extraordinary. The pick stitching on the lapels reveals true Italian tailoring mastery. Delivery was white-glove and packaging was impeccably luxurious.',
        verifiedPurchase: true,
        isModerated: true,
      });

      await Review.create({
        user: customerUser._id,
        userName: 'Julian H.',
        product: createdProducts[1]._id,
        rating: 5,
        title: 'Bespoke fit right out of the box',
        comment: 'Wore this tuxedo to the annual gala in Monaco. The silk faille lapel has a glorious matte sheen and the wool breathes effortlessly. Truly exceptional value.',
        verifiedPurchase: true,
        isModerated: true,
      });
    }

    console.log('\n======================================================');
    console.log('  NEXKART DATABASE SEEDED SUCCESSFULLY');
    console.log(`  - Products created: ${createdProducts.length}`);
    console.log(`  - Categories created: ${categories.length}`);
    console.log(`  - Coupons created: ${sampleCoupons.length}`);
    console.log('  DEMO ACCOUNTS:');
    console.log('  Admin Account:');
    console.log('    Email:    admin@nexkart.com');
    console.log('    Password: Admin@123456');
    console.log('  Customer Account:');
    console.log('    Email:    customer@nexkart.com');
    console.log('    Password: Customer@123456');
    console.log('======================================================\n');

    if (exitProcess) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seeder] Error seeding database:', error);
    if (exitProcess) {
      process.exit(1);
    }
  }
};

// If run directly: node seeder.js
if (require.main === module) {
  seedData(true);
}

module.exports = { seedData };

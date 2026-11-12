export interface PromoCode {
  code: string;
  discount: number; // in SGD
  minSpend: number;
  label: string;
}

export interface StoreOffer {
  id: string;
  storeName: string;
  storeType: 'shopee' | 'lazada' | 'amazon' | 'taobao' | 'brand' | 'retailer';
  storeBadge: string;
  basePrice: number;
  shippingFee: number;
  shipsToSG: boolean;
  originCountry: string;
  deliveryEstimate: string; // e.g. "Tomorrow, Nov 12"
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  availablePromos: PromoCode[];
  warranty: string;
  authenticityGuaranteed: boolean;
  sellerRating: number;
  sellerReviews: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Pre-order';
  referralUrl: string;
  directBuyUrl: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: 'Electronics' | 'Watches' | 'Perfume/Toiletries' | 'Branded Bags' | 'Organic Expensive Food';
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  specs: { label: string; value: string }[];
  marketPriceSG: number;
  priceTrend: { date: string; low: number; avg: number; high: number }[];
  offers: StoreOffer[];
  aiCuratorNotes?: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'tissot-prx-powermatic-80',
    title: 'PRX Powermatic 80 Automatic 40mm Navy',
    brand: 'Tissot',
    category: 'Watches',
    subtitle: 'Integrated 1978 design with Swiss automatic 80-hour caliber & waffle dial',
    description: 'An elevated daily luxury timepiece featuring a 316L stainless steel case, scratch-resistant sapphire crystal with anti-reflective coating, and the revolutionary Nivachron balance spring.',
    image: '/src/assets/images/baskt_hero_watch_1794467220057.jpg',
    tags: ['Swiss Made', 'Automatic', '80h Power Reserve', '100m Water Resistant', 'Nivachron'],
    specs: [
      { label: 'Movement', value: 'Powermatic 80.111 (Swiss)' },
      { label: 'Case Diameter', value: '40.0 mm' },
      { label: 'Glass', value: 'Scratch-resistant Sapphire' },
      { label: 'Power Reserve', value: 'Up to 80 Hours' },
      { label: 'Water Resistance', value: '10 bar (100 m / 330 ft)' }
    ],
    marketPriceSG: 1050,
    priceTrend: [
      { date: 'Jun', low: 910, avg: 990, high: 1050 },
      { date: 'Jul', low: 890, avg: 975, high: 1050 },
      { date: 'Aug', low: 895, avg: 960, high: 1040 },
      { date: 'Sep', low: 870, avg: 940, high: 1020 },
      { date: 'Oct', low: 860, avg: 930, high: 1010 },
      { date: 'Nov (Now)', low: 845, avg: 915, high: 990 }
    ],
    offers: [
      {
        id: 'prx-lazada-lazmall',
        storeName: 'Lazada LazMall (Tissot SG Official)',
        storeType: 'lazada',
        storeBadge: 'LazMall Verified',
        basePrice: 945,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days (Priority SG)',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'LAZWATCH50', discount: 50, minSpend: 800, label: 'Lazada Mega Voucher $50 OFF' },
          { code: 'DBSLUX25', discount: 25, minSpend: 500, label: 'DBS/POSB Card $25 OFF' }
        ],
        warranty: '2-Year Official Tissot SG International Warranty',
        authenticityGuaranteed: true,
        sellerRating: 4.95,
        sellerReviews: 1240,
        stockStatus: 'In Stock',
        referralUrl: 'https://lazada.sg/products/tissot-prx-powermatic80?aff_id=baskt_sg',
        directBuyUrl: 'https://lazada.sg'
      },
      {
        id: 'prx-shopee-mall',
        storeName: 'Shopee Mall (WatchSpree Official SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee 100% Authentic',
        basePrice: 879,
        shippingFee: 1.99,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '2-3 Days',
        deliveryDaysMin: 2,
        deliveryDaysMax: 3,
        availablePromos: [
          { code: 'SHPTECH8', discount: 35, minSpend: 600, label: 'Shopee Platform Voucher $35 OFF' }
        ],
        warranty: '2-Year In-House & Official Warranty Support',
        authenticityGuaranteed: true,
        sellerRating: 4.91,
        sellerReviews: 4890,
        stockStatus: 'In Stock',
        referralUrl: 'https://shopee.sg/product/tissot-prx-blue?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'prx-amazon-sg',
        storeName: 'Amazon.sg (Amazon Global Store JP)',
        storeType: 'amazon',
        storeBadge: 'Amazon Prime',
        basePrice: 845,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Japan',
        deliveryEstimate: '4-6 Days (Air Express)',
        deliveryDaysMin: 4,
        deliveryDaysMax: 6,
        availablePromos: [
          { code: 'PRIME10SG', discount: 10, minSpend: 150, label: 'Prime Member $10 Voucher' }
        ],
        warranty: '1-Year Amazon Global Store Return & Guarantee',
        authenticityGuaranteed: true,
        sellerRating: 4.88,
        sellerReviews: 890,
        stockStatus: 'In Stock',
        referralUrl: 'https://amazon.sg/dp/B09BLTISSOT?tag=baskt-22',
        directBuyUrl: 'https://amazon.sg'
      },
      {
        id: 'prx-brand-direct',
        storeName: 'Tissot.com Direct Boutique (MBS / Wisma)',
        storeType: 'brand',
        storeBadge: 'Brand Flagship',
        basePrice: 1050,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Same-day Pickup or Next-day White Glove',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [
          { code: 'TISSOTWELCOME', discount: 50, minSpend: 500, label: 'Boutique Welcome Credit $50' }
        ],
        warranty: '2-Year Global Warranty + Complimentary Fitting & Sizing',
        authenticityGuaranteed: true,
        sellerRating: 5.0,
        sellerReviews: 610,
        stockStatus: 'In Stock',
        referralUrl: 'https://tissotwatches.com/en-sg?ref=baskt',
        directBuyUrl: 'https://tissotwatches.com'
      },
      {
        id: 'prx-taobao-tmall',
        storeName: 'Taobao Tmall Global (Swiss Horology Hub)',
        storeType: 'taobao',
        storeBadge: 'Tmall Global Direct',
        basePrice: 830,
        shippingFee: 28.5,
        shipsToSG: true,
        originCountry: 'Hong Kong',
        deliveryEstimate: '7-12 Days (Cainiao Direct Line)',
        deliveryDaysMin: 7,
        deliveryDaysMax: 12,
        availablePromos: [
          { code: 'TBGLOBAL20', discount: 20, minSpend: 700, label: 'Cross-Border Allowance $20 OFF' }
        ],
        warranty: 'Cross-Border Inspection Guarantee (Parallel Import)',
        authenticityGuaranteed: true,
        sellerRating: 4.82,
        sellerReviews: 320,
        stockStatus: 'In Stock',
        referralUrl: 'https://world.taobao.com/item/tissot-prx.htm?ref=baskt',
        directBuyUrl: 'https://world.taobao.com'
      }
    ],
    aiCuratorNotes: 'Ranked #1 for versatility under $1,000. Amazon JP offers the lowest base import price, but Lazada LazMall wins for Landed Value with official Singapore service center warranty.'
  },
  {
    id: 'le-labo-santal-33-edp-50ml',
    title: 'Santal 33 Eau de Parfum (50ml)',
    brand: 'Le Labo',
    category: 'Perfume/Toiletries',
    subtitle: 'Cult artisanal fragrance of cardamom, iris, violet, and Australian sandalwood',
    description: 'Freshly compounded cult fragrance capturing the spirit of the American West. Smoky, leathery, and rich with Australian sandalwood and cedarwood.',
    image: '/src/assets/images/baskt_perfume_amber_1794467217907.jpg',
    tags: ['Niche Fragrance', 'Unisex', 'Cruelty-Free', 'Hand-blended', '50ml EDP'],
    specs: [
      { label: 'Volume', value: '50 ml / 1.7 fl oz' },
      { label: 'Concentration', value: 'Eau de Parfum' },
      { label: 'Top Notes', value: 'Cardamom, Violet Accord, Iris' },
      { label: 'Base Notes', value: 'Cedarwood, Leather, Sandalwood' },
      { label: 'Longevity', value: '8 - 12 Hours' }
    ],
    marketPriceSG: 345,
    priceTrend: [
      { date: 'Jun', low: 310, avg: 335, high: 345 },
      { date: 'Jul', low: 305, avg: 330, high: 345 },
      { date: 'Aug', low: 295, avg: 325, high: 345 },
      { date: 'Sep', low: 285, avg: 320, high: 345 },
      { date: 'Oct', low: 280, avg: 315, high: 345 },
      { date: 'Nov (Now)', low: 268, avg: 310, high: 345 }
    ],
    offers: [
      {
        id: 'santal-shopee-seller',
        storeName: 'Shopee Mall (Parfums de Luxe SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee Preferred+',
        basePrice: 275,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days (Local SG Ready Stock)',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'BEAUTY12', discount: 15, minSpend: 200, label: 'Shopee Beauty Club $15 OFF' }
        ],
        warranty: '100% Authenticity Money-Back Guarantee (Batch Code Verifiable)',
        authenticityGuaranteed: true,
        sellerRating: 4.96,
        sellerReviews: 3410,
        stockStatus: 'Low Stock',
        referralUrl: 'https://shopee.sg/product/le-labo-santal-33?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'santal-amazon-sg',
        storeName: 'Amazon.sg (Dispatched from Amazon UK)',
        storeType: 'amazon',
        storeBadge: 'Amazon Fulfilled',
        basePrice: 288,
        shippingFee: 6.5,
        shipsToSG: true,
        originCountry: 'United Kingdom',
        deliveryEstimate: '5-7 Days (DHL Express)',
        deliveryDaysMin: 5,
        deliveryDaysMax: 7,
        availablePromos: [
          { code: 'AMZUK10', discount: 10, minSpend: 150, label: 'Amazon Global Store $10 OFF' }
        ],
        warranty: '30-Day Amazon Return & Authenticity Policy',
        authenticityGuaranteed: true,
        sellerRating: 4.85,
        sellerReviews: 420,
        stockStatus: 'In Stock',
        referralUrl: 'https://amazon.sg/dp/B07SANTAL33?tag=baskt-22',
        directBuyUrl: 'https://amazon.sg'
      },
      {
        id: 'santal-lazada-sg',
        storeName: 'Lazada (Cosme-De Luxury)',
        storeType: 'lazada',
        storeBadge: 'LazMall Verified',
        basePrice: 295,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Hong Kong',
        deliveryEstimate: '3-5 Days',
        deliveryDaysMin: 3,
        deliveryDaysMax: 5,
        availablePromos: [
          { code: 'LAZLUX20', discount: 20, minSpend: 250, label: 'LazMall Luxury $20 OFF' }
        ],
        warranty: 'Hong Kong Duty-Free Authenticity Check',
        authenticityGuaranteed: true,
        sellerRating: 4.88,
        sellerReviews: 1100,
        stockStatus: 'In Stock',
        referralUrl: 'https://lazada.sg/products/le-labo-santal-33-50ml?aff_id=baskt',
        directBuyUrl: 'https://lazada.sg'
      },
      {
        id: 'santal-brand-official',
        storeName: 'Le Labo Lab Boutique (Takashimaya / Marina Bay)',
        storeType: 'brand',
        storeBadge: 'Official Lab Boutique',
        basePrice: 345,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Same-day Click & Collect',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [],
        warranty: 'Personalized Custom Label Hand-Compounded at Counter',
        authenticityGuaranteed: true,
        sellerRating: 5.0,
        sellerReviews: 950,
        stockStatus: 'In Stock',
        referralUrl: 'https://lelabofragrances.com?ref=baskt',
        directBuyUrl: 'https://lelabofragrances.com'
      }
    ],
    aiCuratorNotes: 'Shopee Preferred+ verified seller offers immediate local SG dispatch at $260 net after promo. If you want the personalized 23-character printed name on the label, buy direct from the Takashimaya lab.'
  },
  {
    id: 'sony-wh-1000xm5-headphones',
    title: 'Sony WH-1000XM5 Noise-Canceling Wireless Headphones',
    brand: 'Sony',
    category: 'Electronics',
    subtitle: 'Industry-leading noise cancellation with Auto NC Optimizer & 30-hour battery',
    description: 'The definitive executive travel and focus headphone. Two processors control 8 microphones for unprecedented acoustic isolation and pristine LDAC high-resolution wireless streaming.',
    image: '/src/assets/images/baskt_audio_headphones_1794467218124.jpg',
    tags: ['ANC Leader', 'Hi-Res Audio', 'LDAC', '30h Battery', 'Multipoint Bluetooth'],
    specs: [
      { label: 'Acoustic Driver', value: '30mm Carbon Fiber Composite Dome' },
      { label: 'Noise Cancellation', value: 'Dual Processor V1 + HD QN1 with 8 Mics' },
      { label: 'Battery Life', value: '30 Hours (ANC ON), 40 Hours (ANC OFF)' },
      { label: 'Weight', value: '250 grams (Ultra lightweight)' },
      { label: 'Fast Charge', value: '3 min charge = 3 hours playback' }
    ],
    marketPriceSG: 589,
    priceTrend: [
      { date: 'Jun', low: 460, avg: 510, high: 589 },
      { date: 'Jul', low: 450, avg: 495, high: 579 },
      { date: 'Aug', low: 440, avg: 480, high: 569 },
      { date: 'Sep', low: 429, avg: 470, high: 569 },
      { date: 'Oct', low: 419, avg: 455, high: 549 },
      { date: 'Nov (Now)', low: 399, avg: 439, high: 529 }
    ],
    offers: [
      {
        id: 'sony-amazon-sg',
        storeName: 'Amazon.sg (Official Sony Authorized)',
        storeType: 'amazon',
        storeBadge: 'Amazon Prime Next-Day',
        basePrice: 419,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Tomorrow by 12pm (Prime)',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [
          { code: 'AMZTECH20', discount: 20, minSpend: 300, label: 'Amazon Tech Deals $20 OFF' }
        ],
        warranty: '1-Year Official Sony Singapore Local Warranty + 3 Mo e-Warranty',
        authenticityGuaranteed: true,
        sellerRating: 4.93,
        sellerReviews: 2150,
        stockStatus: 'In Stock',
        referralUrl: 'https://amazon.sg/dp/B09XS7JWHH?tag=baskt-22',
        directBuyUrl: 'https://amazon.sg'
      },
      {
        id: 'sony-shopee-mall',
        storeName: 'Shopee Mall (Sony Official Store SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee Mall 100% Authentic',
        basePrice: 449,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '2 Days',
        deliveryDaysMin: 2,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'SONYSP50', discount: 50, minSpend: 400, label: 'Official Store Brand Voucher $50 OFF' },
          { code: 'UOBTECH10', discount: 15, minSpend: 250, label: 'UOB Card Promo $15 OFF' }
        ],
        warranty: '15-Month Official Sony SG Warranty (Registered Online)',
        authenticityGuaranteed: true,
        sellerRating: 4.97,
        sellerReviews: 8720,
        stockStatus: 'In Stock',
        referralUrl: 'https://shopee.sg/product/sony-wh1000xm5?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'sony-lazada-sg',
        storeName: 'Lazada LazMall (Challenger SG Official)',
        storeType: 'lazada',
        storeBadge: 'Challenger LazMall',
        basePrice: 459,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'CHALLENGER30', discount: 30, minSpend: 400, label: 'Challenger LazMall $30 OFF' }
        ],
        warranty: '1-Year Sony SG Warranty + Challenger Member Points',
        authenticityGuaranteed: true,
        sellerRating: 4.9,
        sellerReviews: 5400,
        stockStatus: 'In Stock',
        referralUrl: 'https://lazada.sg/products/sony-wh1000xm5-challenger?aff_id=baskt',
        directBuyUrl: 'https://lazada.sg'
      },
      {
        id: 'sony-taobao-tmall',
        storeName: 'Taobao Tmall Global (Sony China Flagship)',
        storeType: 'taobao',
        storeBadge: 'Tmall Direct',
        basePrice: 388,
        shippingFee: 16.5,
        shipsToSG: true,
        originCountry: 'China',
        deliveryEstimate: '6-9 Days',
        deliveryDaysMin: 6,
        deliveryDaysMax: 9,
        availablePromos: [
          { code: 'TBTECH15', discount: 15, minSpend: 350, label: 'Tmall Global $15 Cross-border coupon' }
        ],
        warranty: 'China Domestic Warranty (Requires overseas return for repair)',
        authenticityGuaranteed: true,
        sellerRating: 4.87,
        sellerReviews: 1400,
        stockStatus: 'In Stock',
        referralUrl: 'https://detail.tmall.com/item.htm?id=sony-wh1000xm5&ref=baskt',
        directBuyUrl: 'https://tmall.com'
      }
    ],
    aiCuratorNotes: 'Amazon.sg delivers next-day at $399 net with prime voucher and includes full Singapore service center warranty. Taobao base price is $388, but lack of local warranty makes Amazon the clear Best Value.'
  },
  {
    id: 'porter-tanker-helmet-bag',
    title: 'Porter-Yoshida & Co. Tanker 2Way Helmet Bag Iron Blue',
    brand: 'Porter-Yoshida',
    category: 'Branded Bags',
    subtitle: 'Iconic Tokyo heritage flight-satin nylon utility tote / shoulder bag',
    description: 'Inspired by the US Air Force MA-1 flight jacket. Constructed in Japan from an ultra-durable 3-layer bonding fabric (nylon twill, polyester cotton, and rescue orange nylon taffeta) with military-grade hardware.',
    image: '/src/assets/images/baskt_artisan_bag_1794467219321.jpg',
    tags: ['Made in Japan', 'Tanker Series', 'Heritage Workwear', '2-Way Strap', 'Rescue Orange'],
    specs: [
      { label: 'Origin', value: 'Handmade in Tokyo, Japan' },
      { label: 'Material', value: '3-Layer Flight Satin Nylon' },
      { label: 'Dimensions', value: 'W480 x H520 mm' },
      { label: 'Weight', value: '495 grams' },
      { label: 'Compartments', value: '2 Large Front Utility Pockets, Padded Interior' }
    ],
    marketPriceSG: 560,
    priceTrend: [
      { date: 'Jun', low: 490, avg: 530, high: 560 },
      { date: 'Jul', low: 485, avg: 525, high: 560 },
      { date: 'Aug', low: 480, avg: 520, high: 550 },
      { date: 'Sep', low: 465, avg: 510, high: 540 },
      { date: 'Oct', low: 460, avg: 505, high: 540 },
      { date: 'Nov (Now)', low: 445, avg: 490, high: 530 }
    ],
    offers: [
      {
        id: 'porter-amazon-jp',
        storeName: 'Amazon.sg (Amazon Japan Storefront)',
        storeType: 'amazon',
        storeBadge: 'Amazon Global Store JP',
        basePrice: 445,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Japan',
        deliveryEstimate: '3-5 Days (Tokyo to SG Direct Air)',
        deliveryDaysMin: 3,
        deliveryDaysMax: 5,
        availablePromos: [
          { code: 'JAPANPROMO15', discount: 15, minSpend: 300, label: 'Amazon JP Direct $15 OFF' }
        ],
        warranty: 'Direct Japan Stock Authenticity Certified',
        authenticityGuaranteed: true,
        sellerRating: 4.94,
        sellerReviews: 890,
        stockStatus: 'In Stock',
        referralUrl: 'https://amazon.sg/dp/PORTERTANKER?tag=baskt-22',
        directBuyUrl: 'https://amazon.sg'
      },
      {
        id: 'porter-shopee-sg',
        storeName: 'Shopee Mall (Tokyo Direct Express)',
        storeType: 'shopee',
        storeBadge: 'Shopee Mall Global',
        basePrice: 479,
        shippingFee: 4.5,
        shipsToSG: true,
        originCountry: 'Japan',
        deliveryEstimate: '4-7 Days',
        deliveryDaysMin: 4,
        deliveryDaysMax: 7,
        availablePromos: [
          { code: 'GLOBAL25', discount: 25, minSpend: 400, label: 'Shopee Cross-Border $25 OFF' }
        ],
        warranty: 'Original Porter Tag & Dustbag Included',
        authenticityGuaranteed: true,
        sellerRating: 4.89,
        sellerReviews: 640,
        stockStatus: 'Low Stock',
        referralUrl: 'https://shopee.sg/product/porter-tanker-helmet?aff_id=baskt',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'porter-brand-boutique',
        storeName: 'Porter Stand SG (Mandarin Gallery / Takashimaya)',
        storeType: 'retailer',
        storeBadge: 'SG Official Retailer',
        basePrice: 560,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Immediate In-Store Collection',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [],
        warranty: 'Lifetime Porter Hardware Repair Service at SG Counter',
        authenticityGuaranteed: true,
        sellerRating: 5.0,
        sellerReviews: 410,
        stockStatus: 'In Stock',
        referralUrl: 'https://yoshidakaban.com?ref=baskt',
        directBuyUrl: 'https://yoshidakaban.com'
      }
    ],
    aiCuratorNotes: 'Amazon JP Direct gives you authentic Japanese Yen pricing landed in Singapore for S$430 net. Save S$130 vs boutique retail with 3-5 day delivery.'
  },
  {
    id: 'comvita-manuka-honey-umf20',
    title: 'Comvita UMF 20+ (MGO 829+) Raw Manuka Honey 250g',
    brand: 'Comvita',
    category: 'Organic Expensive Food',
    subtitle: 'Ultra-rare medicinal grade raw monofloral Manuka from New Zealand forests',
    description: 'Certified independently by the UMFHA with guaranteed minimum 829mg/kg methylglyoxal. Premium raw superfood known for its profound antibacterial properties and immune vitality.',
    image: '/src/assets/images/baskt_organic_honey_1794467219456.jpg',
    tags: ['UMF 20+ Certified', 'MGO 829+', 'Raw Monofloral', 'New Zealand', 'Medicinal Superfood'],
    specs: [
      { label: 'UMF Rating', value: 'UMF 20+ (Certified Authentic)' },
      { label: 'MGO Content', value: 'Min. 829 mg/kg Methylglyoxal' },
      { label: 'Weight', value: '250 grams (8.8 oz)' },
      { label: 'Harvest Region', value: 'Remote Native Forests, New Zealand' },
      { label: 'Storage', value: 'Cool dark pantry (< 25°C)' }
    ],
    marketPriceSG: 235,
    priceTrend: [
      { date: 'Jun', low: 195, avg: 220, high: 235 },
      { date: 'Jul', low: 190, avg: 215, high: 235 },
      { date: 'Aug', low: 185, avg: 210, high: 230 },
      { date: 'Sep', low: 180, avg: 205, high: 225 },
      { date: 'Oct', low: 175, avg: 198, high: 220 },
      { date: 'Nov (Now)', low: 169, avg: 192, high: 218 }
    ],
    offers: [
      {
        id: 'comvita-shopee-official',
        storeName: 'Shopee Mall (Comvita SG Official Flagship)',
        storeType: 'shopee',
        storeBadge: 'Shopee Mall 100% Authentic',
        basePrice: 185,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Next-Day Delivery',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [
          { code: 'COMVITA20', discount: 20, minSpend: 150, label: 'Official Store Brand Voucher $20 OFF' },
          { code: 'WELLNESS10', discount: 10, minSpend: 100, label: 'Shopee Health & Wellness $10 OFF' }
        ],
        warranty: 'Direct From Importer · Guaranteed Fresh Batch Expiry 2028',
        authenticityGuaranteed: true,
        sellerRating: 4.98,
        sellerReviews: 4890,
        stockStatus: 'In Stock',
        referralUrl: 'https://shopee.sg/product/comvita-umf20?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'comvita-lazada-lazmall',
        storeName: 'Lazada LazMall (Comvita Official Store)',
        storeType: 'lazada',
        storeBadge: 'LazMall Verified',
        basePrice: 189,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'LAZHEALTH15', discount: 15, minSpend: 120, label: 'LazMall Wellness $15 OFF' }
        ],
        warranty: '100% Authentic UMFHA QR Code Verified',
        authenticityGuaranteed: true,
        sellerRating: 4.95,
        sellerReviews: 2980,
        stockStatus: 'In Stock',
        referralUrl: 'https://lazada.sg/products/comvita-umf20-250g?aff_id=baskt',
        directBuyUrl: 'https://lazada.sg'
      },
      {
        id: 'comvita-retail-fairprice-finest',
        storeName: 'FairPrice Finest / Tangs Supermarket',
        storeType: 'retailer',
        storeBadge: 'Physical SG Supermarket',
        basePrice: 235,
        shippingFee: 5.0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Same-day 2-Hour Grocery Slot',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [
          { code: 'FPFINEST5', discount: 5, minSpend: 80, label: 'Finest Member Club $5 OFF' }
        ],
        warranty: 'Immediate physical shelf inspection',
        authenticityGuaranteed: true,
        sellerRating: 4.9,
        sellerReviews: 1200,
        stockStatus: 'In Stock',
        referralUrl: 'https://fairprice.com.sg?ref=baskt',
        directBuyUrl: 'https://fairprice.com.sg'
      }
    ],
    aiCuratorNotes: 'Shopee Official Store offers the best stacked discount: S$155 net (saving S$80 vs physical supermarket price) with next-day doorstep delivery.'
  },
  {
    id: 'logitech-mx-master-3s',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    category: 'Electronics',
    subtitle: 'Quiet click 8000 DPI electromagnetic MagSpeed scrolling for creators',
    description: 'The standard in ergonomic desktop productivity. 90% quieter clicks, tracks on any surface including glass, with thumb wheel controls and seamless multi-computer Flow connectivity.',
    image: '/src/assets/images/baskt_audio_headphones_1794467218124.jpg',
    tags: ['Silent Clicks', '8000 DPI', 'MagSpeed Scroll', '70-Day Battery', 'Ergonomic'],
    specs: [
      { label: 'Sensor', value: 'Darkfield High Precision 200 - 8000 DPI' },
      { label: 'Acoustics', value: 'Quiet Clicks (90% noise reduction)' },
      { label: 'Connectivity', value: 'Logi Bolt USB + Bluetooth Low Energy (3 devices)' },
      { label: 'Battery', value: '500 mAh Li-Po (Up to 70 days)' },
      { label: 'Weight', value: '141 grams' }
    ],
    marketPriceSG: 179,
    priceTrend: [
      { date: 'Jun', low: 145, avg: 160, high: 179 },
      { date: 'Jul', low: 142, avg: 158, high: 179 },
      { date: 'Aug', low: 139, avg: 155, high: 175 },
      { date: 'Sep', low: 135, avg: 150, high: 169 },
      { date: 'Oct', low: 129, avg: 145, high: 169 },
      { date: 'Nov (Now)', low: 119, avg: 138, high: 169 }
    ],
    offers: [
      {
        id: 'mx-shopee-official',
        storeName: 'Shopee Mall (Logitech Official Store SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee Mall Official',
        basePrice: 138,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'LOGI15SG', discount: 15, minSpend: 120, label: 'Logitech Store Voucher $15 OFF' }
        ],
        warranty: '1-Year Official Logitech Singapore Hardware Warranty',
        authenticityGuaranteed: true,
        sellerRating: 4.96,
        sellerReviews: 12400,
        stockStatus: 'In Stock',
        referralUrl: 'https://shopee.sg/product/logitech-mx-master-3s?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'mx-amazon-sg',
        storeName: 'Amazon.sg (Dispatched & Sold by Amazon)',
        storeType: 'amazon',
        storeBadge: 'Amazon Prime',
        basePrice: 129,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Tomorrow by 11am',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [
          { code: 'AMZPROD10', discount: 10, minSpend: 100, label: 'Amazon Electronics $10 OFF' }
        ],
        warranty: '1-Year Logitech SG Official Warranty',
        authenticityGuaranteed: true,
        sellerRating: 4.94,
        sellerReviews: 4800,
        stockStatus: 'In Stock',
        referralUrl: 'https://amazon.sg/dp/B09HM94V5S?tag=baskt-22',
        directBuyUrl: 'https://amazon.sg'
      },
      {
        id: 'mx-taobao-tmall',
        storeName: 'Taobao Tmall (Logitech Asia Direct)',
        storeType: 'taobao',
        storeBadge: 'Tmall Direct',
        basePrice: 115,
        shippingFee: 9.8,
        shipsToSG: true,
        originCountry: 'China',
        deliveryEstimate: '5-8 Days',
        deliveryDaysMin: 5,
        deliveryDaysMax: 8,
        availablePromos: [],
        warranty: 'Asia Regional Warranty (Self-ship return)',
        authenticityGuaranteed: true,
        sellerRating: 4.85,
        sellerReviews: 3100,
        stockStatus: 'In Stock',
        referralUrl: 'https://detail.tmall.com/item.htm?id=mx-master-3s&ref=baskt',
        directBuyUrl: 'https://tmall.com'
      }
    ],
    aiCuratorNotes: 'Amazon.sg is currently the cheapest landed option at S$119 after promo code AMZPROD10, with verified next-day Singapore delivery and local warranty.'
  },
  {
    id: 'aesop-resurrection-hand-wash',
    title: 'Aesop Resurrection Aromatique Hand Wash 500ml',
    brand: 'Aesop',
    category: 'Perfume/Toiletries',
    subtitle: 'Elevated botanical hand wash with Mandarin rind, Rosemary, and Cedar Atlas',
    description: 'An elevated daily ritual. Gentle gel formulation that cleanses thoroughly without dehydrating hands. Features a fresh citrus, woody, and herbaceous aroma packaged in Aesop’s iconic amber pump bottle.',
    image: '/src/assets/images/baskt_perfume_amber_1794467217907.jpg',
    tags: ['Aromatique', 'Citrus Woody', '500ml', 'Refillable', 'Daily Luxury'],
    specs: [
      { label: 'Volume', value: '500 ml' },
      { label: 'Aroma', value: 'Citrus, Woody, Herbaceous' },
      { label: 'Key Ingredients', value: 'Mandarin Rind, Rosemary Leaf, Cedar Atlas' },
      { label: 'Skin Feel', value: 'Cleansed, refreshed, supple' }
    ],
    marketPriceSG: 65,
    priceTrend: [
      { date: 'Jun', low: 55, avg: 60, high: 65 },
      { date: 'Jul', low: 54, avg: 60, high: 65 },
      { date: 'Aug', low: 52, avg: 59, high: 65 },
      { date: 'Sep', low: 50, avg: 58, high: 65 },
      { date: 'Oct', low: 48, avg: 57, high: 65 },
      { date: 'Nov (Now)', low: 45, avg: 55, high: 65 }
    ],
    offers: [
      {
        id: 'aesop-lazada-sg',
        storeName: 'Lazada LazMall (Aesop SG Flagship)',
        storeType: 'lazada',
        storeBadge: 'LazMall Official',
        basePrice: 59,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'LAZCARE5', discount: 5, minSpend: 50, label: 'Lazada Personal Care $5 OFF' }
        ],
        warranty: 'Fresh Batch Guarantee (Official SG Importer)',
        authenticityGuaranteed: true,
        sellerRating: 4.97,
        sellerReviews: 6100,
        stockStatus: 'In Stock',
        referralUrl: 'https://lazada.sg/products/aesop-resurrection-500ml?aff_id=baskt',
        directBuyUrl: 'https://lazada.sg'
      },
      {
        id: 'aesop-shopee-sg',
        storeName: 'Shopee (Niche Beauty SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee Preferred',
        basePrice: 48,
        shippingFee: 2.5,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '2-3 Days',
        deliveryDaysMin: 2,
        deliveryDaysMax: 3,
        availablePromos: [
          { code: 'BEAUTY3', discount: 3, minSpend: 40, label: 'Beauty Voucher $3 OFF' }
        ],
        warranty: 'Direct UK/Australia Import Verified',
        authenticityGuaranteed: true,
        sellerRating: 4.91,
        sellerReviews: 3200,
        stockStatus: 'In Stock',
        referralUrl: 'https://shopee.sg/product/aesop-hand-wash?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'aesop-boutique',
        storeName: 'Aesop Signature Store (Capitol / Ngee Ann City)',
        storeType: 'brand',
        storeBadge: 'Brand Flagship Store',
        basePrice: 65,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Instant In-Store Collection',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [],
        warranty: 'Complimentary Aesop canvas dustbag & sachet samples',
        authenticityGuaranteed: true,
        sellerRating: 5.0,
        sellerReviews: 1200,
        stockStatus: 'In Stock',
        referralUrl: 'https://aesop.com/sg?ref=baskt',
        directBuyUrl: 'https://aesop.com'
      }
    ],
    aiCuratorNotes: 'Shopee Preferred lands at S$47.50 total. If you want complimentary cotton dust bags and curated skincare sachets, choose the LazMall flagship at S$54.'
  },
  {
    id: 'freitag-jamie-bag',
    title: 'Freitag F153 JAMIE Waistbag / Crossbody',
    brand: 'Freitag',
    category: 'Branded Bags',
    subtitle: 'One-of-a-kind recycled truck tarp messenger waistbag from Zurich',
    description: 'Each piece is individually unique, cut from discarded used truck tarpaulins with bicycle inner-tube edge trim and recycled car seatbelt strap. Waterproof, rugged, and timeless urban utility.',
    image: '/src/assets/images/baskt_artisan_bag_1794467219321.jpg',
    tags: ['1-of-1 Unique', 'Recycled Truck Tarp', 'Waterproof', 'Made in Europe', 'Urban EDC'],
    specs: [
      { label: 'Capacity', value: '1.0 Liters' },
      { label: 'Dimensions', value: '185 x 125 x 55 mm' },
      { label: 'Weight', value: '290 grams' },
      { label: 'Origin', value: 'Zurich, Switzerland' },
      { label: 'Strap', value: 'Adjustable Quick-Release Buckle' }
    ],
    marketPriceSG: 210,
    priceTrend: [
      { date: 'Jun', low: 185, avg: 198, high: 210 },
      { date: 'Jul', low: 180, avg: 195, high: 210 },
      { date: 'Aug', low: 175, avg: 195, high: 210 },
      { date: 'Sep', low: 170, avg: 190, high: 205 },
      { date: 'Oct', low: 168, avg: 188, high: 205 },
      { date: 'Nov (Now)', low: 160, avg: 182, high: 200 }
    ],
    offers: [
      {
        id: 'freitag-actual-sg',
        storeName: 'Actual Source / Design Orchard SG',
        storeType: 'retailer',
        storeBadge: 'Official Freitag Partner SG',
        basePrice: 195,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'ACTUAL10', discount: 10, minSpend: 150, label: 'Design Store Voucher $10 OFF' }
        ],
        warranty: 'Freitag Global F-Cut Lifetime Warranty & Free Repairs',
        authenticityGuaranteed: true,
        sellerRating: 4.95,
        sellerReviews: 380,
        stockStatus: 'In Stock',
        referralUrl: 'https://designorchard.sg?ref=baskt',
        directBuyUrl: 'https://designorchard.sg'
      },
      {
        id: 'freitag-direct-zurich',
        storeName: 'Freitag.ch Official Online (Zurich Direct)',
        storeType: 'brand',
        storeBadge: 'Brand Flagship Store',
        basePrice: 175,
        shippingFee: 22.0,
        shipsToSG: true,
        originCountry: 'Switzerland',
        deliveryEstimate: '6-8 Days (FedEx International)',
        deliveryDaysMin: 6,
        deliveryDaysMax: 8,
        availablePromos: [],
        warranty: 'Freitag 3-Year Factory Warranty Card',
        authenticityGuaranteed: true,
        sellerRating: 4.98,
        sellerReviews: 1400,
        stockStatus: 'In Stock',
        referralUrl: 'https://freitag.ch/en/f153?ref=baskt',
        directBuyUrl: 'https://freitag.ch'
      },
      {
        id: 'freitag-shopee-sg',
        storeName: 'Shopee (Swiss Vintage Curators SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee Preferred',
        basePrice: 168,
        shippingFee: 3.5,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '2-3 Days',
        deliveryDaysMin: 2,
        deliveryDaysMax: 3,
        availablePromos: [
          { code: 'SPSTREET8', discount: 8, minSpend: 100, label: 'Streetwear Voucher $8 OFF' }
        ],
        warranty: 'Authenticity Guaranteed with Original Barcode Card',
        authenticityGuaranteed: true,
        sellerRating: 4.88,
        sellerReviews: 450,
        stockStatus: 'Low Stock',
        referralUrl: 'https://shopee.sg/product/freitag-f153?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      }
    ],
    aiCuratorNotes: 'Buying locally from Design Orchard lands at S$185 with official in-store replacement warranty and you can inspect the exact 1-of-1 tarp pattern.'
  },
  {
    id: 'tartuflanghe-white-truffle-oil',
    title: 'Tartuflanghe White Truffle Extra Virgin Olive Oil 100ml',
    brand: 'Tartuflanghe',
    category: 'Organic Expensive Food',
    subtitle: 'Cold-pressed Italian EVOO infused with authentic Alba White Truffle (Tuber magnatum)',
    description: 'Produced in Piedmont, Italy with estate grown olives and slices of genuine Alba white truffle inside the bottle. A single drizzle elevates fresh handmade pasta, risotto, or scrambled eggs.',
    image: '/src/assets/images/baskt_organic_honey_1794467219456.jpg',
    tags: ['Alba White Truffle', 'Piedmont Italy', '100% Italian EVOO', 'Gourmet Finishing Oil'],
    specs: [
      { label: 'Volume', value: '100 ml / 3.4 fl oz' },
      { label: 'Origin', value: 'Piobesi d’Alba (Cuneo), Italy' },
      { label: 'Truffle Variety', value: 'Tuber magnatum Pico (White Truffle)' },
      { label: 'Base', value: '100% Extra Virgin Olive Oil Cold-Extracted' }
    ],
    marketPriceSG: 78,
    priceTrend: [
      { date: 'Jun', low: 72, avg: 76, high: 78 },
      { date: 'Jul', low: 70, avg: 75, high: 78 },
      { date: 'Aug', low: 68, avg: 74, high: 76 },
      { date: 'Sep', low: 65, avg: 72, high: 76 },
      { date: 'Oct', low: 64, avg: 70, high: 75 },
      { date: 'Nov (Now)', low: 59, avg: 68, high: 75 }
    ],
    offers: [
      {
        id: 'truffle-shopee-sg',
        storeName: 'Shopee Mall (Culinary Artisans SG)',
        storeType: 'shopee',
        storeBadge: 'Shopee Mall Official',
        basePrice: 62,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: '1-2 Days (Climate-controlled dispatch)',
        deliveryDaysMin: 1,
        deliveryDaysMax: 2,
        availablePromos: [
          { code: 'GOURMET5', discount: 5, minSpend: 50, label: 'Gourmet Club $5 OFF' }
        ],
        warranty: 'Direct Air-Freighted Italian Fresh Stock',
        authenticityGuaranteed: true,
        sellerRating: 4.96,
        sellerReviews: 1890,
        stockStatus: 'In Stock',
        referralUrl: 'https://shopee.sg/product/tartuflanghe-white-truffle?aff_id=baskt_sg',
        directBuyUrl: 'https://shopee.sg'
      },
      {
        id: 'truffle-amazon-sg',
        storeName: 'Amazon.sg (Dispatched from Amazon SG)',
        storeType: 'amazon',
        storeBadge: 'Amazon Prime Next-Day',
        basePrice: 64,
        shippingFee: 0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Tomorrow by 2pm',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [],
        warranty: 'Amazon Quality & Authenticity Guarantee',
        authenticityGuaranteed: true,
        sellerRating: 4.89,
        sellerReviews: 420,
        stockStatus: 'In Stock',
        referralUrl: 'https://amazon.sg/dp/B00TRUFFLE?tag=baskt-22',
        directBuyUrl: 'https://amazon.sg'
      },
      {
        id: 'truffle-culina-dempsey',
        storeName: 'Culina at COMO Dempsey (Physical Gourmet Butchery)',
        storeType: 'retailer',
        storeBadge: 'Dempsey Hill Flagship',
        basePrice: 78,
        shippingFee: 8.0,
        shipsToSG: true,
        originCountry: 'Singapore',
        deliveryEstimate: 'Same-day Courier or In-Store',
        deliveryDaysMin: 1,
        deliveryDaysMax: 1,
        availablePromos: [],
        warranty: 'Direct Italian Consignment Inspection',
        authenticityGuaranteed: true,
        sellerRating: 5.0,
        sellerReviews: 310,
        stockStatus: 'In Stock',
        referralUrl: 'https://culina.com.sg?ref=baskt',
        directBuyUrl: 'https://culina.com.sg'
      }
    ],
    aiCuratorNotes: 'Shopee Mall Culinary Artisans is S$57 net after promo with free SG delivery. 27% lower than the Dempsey Hill boutique shelf price.'
  }
];

// Helper calculations for Landed Cost (accounting for Promo codes, Shipping, and GST)
export function calculateLandedCost(offer: StoreOffer, appliedPromoCode?: string): {
  basePrice: number;
  shippingFee: number;
  promoDiscount: number;
  netPrice: number;
  activePromo?: PromoCode;
} {
  let promoDiscount = 0;
  let activePromo: PromoCode | undefined;

  if (appliedPromoCode) {
    activePromo = offer.availablePromos.find(p => p.code === appliedPromoCode);
    if (activePromo && offer.basePrice >= activePromo.minSpend) {
      promoDiscount = activePromo.discount;
    }
  } else if (offer.availablePromos.length > 0) {
    // Automatically pick the highest valid promo
    const sorted = [...offer.availablePromos].sort((a, b) => b.discount - a.discount);
    for (const p of sorted) {
      if (offer.basePrice >= p.minSpend) {
        activePromo = p;
        promoDiscount = p.discount;
        break;
      }
    }
  }

  const netPrice = Math.max(0, offer.basePrice + offer.shippingFee - promoDiscount);
  return {
    basePrice: offer.basePrice,
    shippingFee: offer.shippingFee,
    promoDiscount,
    netPrice,
    activePromo
  };
}

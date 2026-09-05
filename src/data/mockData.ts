import type { Product, Order, AIRecommendation, AIInsight, AuditEvent, AnalyticsData, MerchantMetrics, AIBuyerActivity } from '../types';

export const FEATURED_PRODUCT_ID = "prod-wedding-dress-001";
export const CROSS_SELL_PRODUCT_ID = "prod-earrings-001";

export const products: Product[] = [
  {
  id: "prod-wedding-dress-001",
  name: "Wine Satin Wedding Dress",
  description: "An elegant wine-colored satin wedding dress with a flattering A-line silhouette. Features delicate lace detailing on the bodice and a flowing skirt perfect for your special day.",
  price: 4299,
  originalPrice: 5999,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-001.webp",
  images: [
  "/products/prod-wedding-dress-001.webp",
],
  rating: 4.8,
  reviewCount: 124,
  variants: [
  {
  size: "S",
  color: "Wine",
  stock: 8,
  sku: "WSD-S-WINE"
},
  {
  size: "M",
  color: "Wine",
  stock: 12,
  sku: "WSD-M-WINE"
},
  {
  size: "L",
  color: "Wine",
  stock: 6,
  sku: "WSD-L-WINE"
},
  {
  size: "M",
  color: "Burgundy",
  stock: 4,
  sku: "WSD-M-BURG"
},
],
  tags: [
  "wedding",
  "satin",
  "wine",
  "formal",
],
  specifications: {
  Fabric: "Premium Satin",
  Length: "Floor Length",
  Neckline: "V-Neck",
  Sleeve: "Cap Sleeve",
  Care: "Dry Clean Only"
},
  aiMatchScore: 94,
  aiReasons: [
  "Within your budget of ₹5,000",
  "Size M available in Wine color",
  "Perfect for wedding occasions",
  "Highest rated in category",
]
},
  {
  id: "prod-wedding-dress-002",
  name: "Ivory Lace Bridal Gown",
  description: "Timeless ivory lace bridal gown with intricate embroidery and a cathedral train.",
  price: 4899,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-002.webp",
  images: [
  "/products/prod-wedding-dress-002.webp",
],
  rating: 4.6,
  reviewCount: 89,
  variants: [
  {
  size: "S",
  color: "Ivory",
  stock: 5,
  sku: "ILB-S-IV"
},
  {
  size: "M",
  color: "Ivory",
  stock: 7,
  sku: "ILB-M-IV"
},
  {
  size: "L",
  color: "Ivory",
  stock: 3,
  sku: "ILB-L-IV"
},
],
  tags: [
  "wedding",
  "lace",
  "ivory",
  "formal",
],
  specifications: {
  Fabric: "Lace",
  Length: "Cathedral",
  Neckline: "Sweetheart",
  Sleeve: "Sleeveless",
  Care: "Dry Clean Only"
},
  aiMatchScore: 78,
  aiReasons: [
  "Within budget",
  "Size M available",
  "Wedding appropriate",
  "Different color preference",
]
},
  {
  id: "prod-wedding-dress-003",
  name: "Burgundy Velvet Evening Dress",
  description: "Luxurious burgundy velvet dress ideal for wedding receptions and evening celebrations.",
  price: 3799,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-003.webp",
  images: [
  "/products/prod-wedding-dress-003.webp",
],
  rating: 4.5,
  reviewCount: 67,
  variants: [
  {
  size: "M",
  color: "Burgundy",
  stock: 9,
  sku: "BVE-M-BURG"
},
  {
  size: "L",
  color: "Burgundy",
  stock: 5,
  sku: "BVE-L-BURG"
},
],
  tags: [
  "wedding",
  "velvet",
  "burgundy",
  "evening",
],
  specifications: {
  Fabric: "Velvet",
  Length: "Midi",
  Neckline: "Off-Shoulder",
  Sleeve: "Long Sleeve",
  Care: "Dry Clean Only"
},
  aiMatchScore: 85,
  aiReasons: [
  "Within budget",
  "Similar wine tone",
  "Size M available",
  "Evening wedding suitable",
]
},
  {
  id: "prod-wedding-dress-004",
  name: "Rose Gold Sequin Party Dress",
  description: "Stunning rose gold sequin dress for wedding parties and celebrations.",
  price: 3499,
  category: "party-wear",
  image: "/products/prod-wedding-dress-004.webp",
  images: [
  "/products/prod-wedding-dress-004.webp",
],
  rating: 4.4,
  reviewCount: 45,
  variants: [
  {
  size: "S",
  color: "Rose Gold",
  stock: 6,
  sku: "RGS-S-RG"
},
  {
  size: "M",
  color: "Rose Gold",
  stock: 8,
  sku: "RGS-M-RG"
},
],
  tags: [
  "party",
  "sequin",
  "rose-gold",
],
  specifications: {
  Fabric: "Sequin Mesh",
  Length: "Knee Length",
  Neckline: "Halter",
  Sleeve: "Sleeveless",
  Care: "Hand Wash"
},
  aiMatchScore: 72,
  aiReasons: [
  "Within budget",
  "Size M available",
  "Party appropriate",
  "Different color tone",
]
},
  {
  id: "prod-earrings-001",
  name: "Gold Statement Earrings",
  description: "Elegant gold-plated statement earrings with crystal accents. Perfect complement to wedding attire.",
  price: 799,
  category: "earrings",
  image: "/products/prod-earrings-001.webp",
  images: [
  "/products/prod-earrings-001.webp",
],
  rating: 4.7,
  reviewCount: 203,
  variants: [
  {
  size: "One Size",
  color: "Gold",
  stock: 45,
  sku: "GSE-OS-GOLD"
},
],
  tags: [
  "earrings",
  "gold",
  "wedding",
  "accessories",
],
  specifications: {
  Material: "Gold Plated Brass",
  Weight: "12g",
  Closure: "Push Back",
  Care: "Store in pouch"
}
},
  {
  id: "prod-saree-001",
  name: "Banarasi Silk Saree",
  description: "Handwoven Banarasi silk saree with gold zari work, perfect for weddings and festive occasions.",
  price: 8999,
  category: "sarees",
  image: "/products/prod-saree-001.webp",
  images: [
  "/products/prod-saree-001.webp",
],
  rating: 4.9,
  reviewCount: 156,
  variants: [
  {
  size: "Free Size",
  color: "Maroon",
  stock: 10,
  sku: "BSS-FS-MAR"
},
  {
  size: "Free Size",
  color: "Gold",
  stock: 8,
  sku: "BSS-FS-GOLD"
},
],
  tags: [
  "saree",
  "silk",
  "banarasi",
  "wedding",
],
  specifications: {
  Fabric: "Pure Silk",
  Length: "6.3 meters",
  Blouse: "Included",
  Care: "Dry Clean Only"
}
},
  {
  id: "prod-kurti-001",
  name: "Embroidered Cotton Kurti",
  description: "Comfortable cotton kurti with delicate hand embroidery, ideal for casual and semi-formal wear.",
  price: 1299,
  category: "kurtis",
  image: "/products/prod-kurti-001.webp",
  images: [
  "/products/prod-kurti-001.webp",
],
  rating: 4.3,
  reviewCount: 78,
  variants: [
  {
  size: "S",
  color: "White",
  stock: 15,
  sku: "ECK-S-WHT"
},
  {
  size: "M",
  color: "White",
  stock: 20,
  sku: "ECK-M-WHT"
},
  {
  size: "L",
  color: "Blue",
  stock: 12,
  sku: "ECK-L-BLU"
},
],
  tags: [
  "kurti",
  "cotton",
  "casual",
],
  specifications: {
  Fabric: "Cotton",
  Length: "Knee Length",
  Sleeve: "Three Quarter",
  Care: "Machine Wash"
}
},
  {
  id: "prod-jeans-001",
  name: "High-Rise Slim Fit Jeans",
  description: "Premium denim high-rise slim fit jeans with stretch comfort for all-day wear.",
  price: 2199,
  category: "jeans",
  image: "/products/prod-jeans-001.webp",
  images: [
  "/products/prod-jeans-001.webp",
],
  rating: 4.5,
  reviewCount: 312,
  variants: [
  {
  size: "28",
  color: "Indigo",
  stock: 25,
  sku: "HRJ-28-IND"
},
  {
  size: "30",
  color: "Indigo",
  stock: 30,
  sku: "HRJ-30-IND"
},
  {
  size: "32",
  color: "Black",
  stock: 18,
  sku: "HRJ-32-BLK"
},
],
  tags: [
  "jeans",
  "denim",
  "casual",
],
  specifications: {
  Fabric: "98% Cotton, 2% Elastane",
  Rise: "High",
  Fit: "Slim",
  Care: "Machine Wash"
}
},
  {
  id: "prod-handbag-001",
  name: "Leather Crossbody Handbag",
  description: "Premium leather crossbody handbag with adjustable strap and multiple compartments.",
  price: 3499,
  category: "handbags",
  image: "/products/prod-handbag-001.webp",
  images: [
  "/products/prod-handbag-001.webp",
],
  rating: 4.6,
  reviewCount: 89,
  variants: [
  {
  size: "Medium",
  color: "Tan",
  stock: 14,
  sku: "LCH-M-TAN"
},
  {
  size: "Medium",
  color: "Black",
  stock: 20,
  sku: "LCH-M-BLK"
},
],
  tags: [
  "handbag",
  "leather",
  "accessories",
],
  specifications: {
  Material: "Genuine Leather",
  Dimensions: "25 x 18 x 8 cm",
  Strap: "Adjustable",
  Care: "Leather conditioner"
}
},
  {
  id: "prod-necklace-001",
  name: "Pearl Layered Necklace",
  description: "Elegant layered pearl necklace with gold-tone chain, perfect for weddings and formal events.",
  price: 1499,
  category: "necklaces",
  image: "/products/prod-necklace-001.webp",
  images: [
  "/products/prod-necklace-001.webp",
],
  rating: 4.8,
  reviewCount: 67,
  variants: [
  {
  size: "Adjustable",
  color: "Pearl White",
  stock: 22,
  sku: "PLN-ADJ-PW"
},
],
  tags: [
  "necklace",
  "pearl",
  "wedding",
],
  specifications: {
  Material: "Freshwater Pearls",
  Length: "40-45 cm",
  Clasp: "Lobster",
  Care: "Avoid water"
}
},
  {
  id: "prod-shoes-001",
  name: "Embellished Heeled Sandals",
  description: "Stunning embellished heeled sandals with crystal details, ideal for weddings and parties.",
  price: 2799,
  category: "shoes",
  image: "/products/prod-shoes-001.webp",
  images: [
  "/products/prod-shoes-001.webp",
],
  rating: 4.4,
  reviewCount: 54,
  variants: [
  {
  size: "6",
  color: "Gold",
  stock: 8,
  sku: "EHS-6-GOLD"
},
  {
  size: "7",
  color: "Gold",
  stock: 10,
  sku: "EHS-7-GOLD"
},
  {
  size: "8",
  color: "Silver",
  stock: 6,
  sku: "EHS-8-SIL"
},
],
  tags: [
  "shoes",
  "heels",
  "wedding",
],
  specifications: {
  "Heel Height": "3 inches",
  Material: "Synthetic",
  Sole: "Rubber",
  Care: "Wipe clean"
}
},
  {
  id: "prod-jacket-001",
  name: "Tailored Blazer Jacket",
  description: "Structured tailored blazer in premium fabric, versatile for office and evening wear.",
  price: 3999,
  category: "jackets",
  image: "/products/prod-jacket-001.webp",
  images: [
  "/products/prod-jacket-001.webp",
],
  rating: 4.5,
  reviewCount: 43,
  variants: [
  {
  size: "S",
  color: "Navy",
  stock: 7,
  sku: "TBJ-S-NAV"
},
  {
  size: "M",
  color: "Navy",
  stock: 9,
  sku: "TBJ-M-NAV"
},
  {
  size: "L",
  color: "Black",
  stock: 5,
  sku: "TBJ-L-BLK"
},
],
  tags: [
  "jacket",
  "blazer",
  "formal",
],
  specifications: {
  Fabric: "Wool Blend",
  Fit: "Slim",
  Lining: "Polyester",
  Care: "Dry Clean Only"
}
},
  {
  id: "prod-wedding-dress-005",
  name: "Merlot Satin A-Line Wedding Dress",
  description: "Merlot Satin A-Line Wedding Dress is a a-line satin piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 4699,
  originalPrice: 6299,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-005.webp",
  images: [
  "/products/prod-wedding-dress-005.webp",
],
  rating: 4.7,
  reviewCount: 186,
  variants: [
  {
  size: "XS",
  color: "Wine",
  stock: 19,
  sku: "WEDDINGDRESS005-XS-WINE"
},
  {
  size: "S",
  color: "Wine",
  stock: 5,
  sku: "WEDDINGDRESS005-S-WINE"
},
  {
  size: "M",
  color: "Wine",
  stock: 10,
  sku: "WEDDINGDRESS005-M-WINE"
},
  {
  size: "L",
  color: "Wine",
  stock: 15,
  sku: "WEDDINGDRESS005-L-WINE"
},
  {
  size: "XS",
  color: "Burgundy",
  stock: 7,
  sku: "WEDDINGDRESS005-XS-BURGU"
},
  {
  size: "S",
  color: "Burgundy",
  stock: 12,
  sku: "WEDDINGDRESS005-S-BURGU"
},
  {
  size: "M",
  color: "Burgundy",
  stock: 17,
  sku: "WEDDINGDRESS005-M-BURGU"
},
  {
  size: "L",
  color: "Burgundy",
  stock: 22,
  sku: "WEDDINGDRESS005-L-BURGU"
},
],
  tags: [
  "wedding-dresses",
  "wedding",
  "wine",
  "burgundy",
  "satin",
  "a-line",
  "women",
],
  specifications: {
  Material: "Satin",
  Occasion: "Wedding",
  Style: "A-Line",
  Gender: "Women",
  AvailableColors: "Wine, Burgundy",
  AvailableSizes: "XS, S, M, L",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-dress-006",
  name: "Crimson Embroidered Bridal Lehenga Dress",
  description: "Crimson Embroidered Bridal Lehenga Dress is a embroidered lehenga silk blend piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 7999,
  originalPrice: 10499,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-006.webp",
  images: [
  "/products/prod-wedding-dress-006.webp",
],
  rating: 4.8,
  reviewCount: 132,
  variants: [
  {
  size: "S",
  color: "Red",
  stock: 7,
  sku: "WEDDINGDRESS006-S-RED"
},
  {
  size: "M",
  color: "Red",
  stock: 12,
  sku: "WEDDINGDRESS006-M-RED"
},
  {
  size: "L",
  color: "Red",
  stock: 17,
  sku: "WEDDINGDRESS006-L-RED"
},
  {
  size: "XL",
  color: "Red",
  stock: 22,
  sku: "WEDDINGDRESS006-XL-RED"
},
  {
  size: "S",
  color: "Maroon",
  stock: 14,
  sku: "WEDDINGDRESS006-S-MAROO"
},
  {
  size: "M",
  color: "Maroon",
  stock: 19,
  sku: "WEDDINGDRESS006-M-MAROO"
},
  {
  size: "L",
  color: "Maroon",
  stock: 5,
  sku: "WEDDINGDRESS006-L-MAROO"
},
  {
  size: "XL",
  color: "Maroon",
  stock: 10,
  sku: "WEDDINGDRESS006-XL-MAROO"
},
],
  tags: [
  "wedding-dresses",
  "wedding",
  "red",
  "maroon",
  "silk blend",
  "embroidered lehenga",
  "women",
],
  specifications: {
  Material: "Silk Blend",
  Occasion: "Wedding",
  Style: "Embroidered Lehenga",
  Gender: "Women",
  AvailableColors: "Red, Maroon",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-dress-007",
  name: "Blush Tulle Garden Wedding Gown",
  description: "Blush Tulle Garden Wedding Gown is a ball gown tulle piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 5999,
  originalPrice: 7999,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-007.webp",
  images: [
  "/products/prod-wedding-dress-007.webp",
],
  rating: 4.6,
  reviewCount: 98,
  variants: [
  {
  size: "S",
  color: "Blush",
  stock: 17,
  sku: "WEDDINGDRESS007-S-BLUSH"
},
  {
  size: "M",
  color: "Blush",
  stock: 22,
  sku: "WEDDINGDRESS007-M-BLUSH"
},
  {
  size: "L",
  color: "Blush",
  stock: 8,
  sku: "WEDDINGDRESS007-L-BLUSH"
},
  {
  size: "S",
  color: "Pink",
  stock: 5,
  sku: "WEDDINGDRESS007-S-PINK"
},
  {
  size: "M",
  color: "Pink",
  stock: 10,
  sku: "WEDDINGDRESS007-M-PINK"
},
  {
  size: "L",
  color: "Pink",
  stock: 15,
  sku: "WEDDINGDRESS007-L-PINK"
},
],
  tags: [
  "wedding-dresses",
  "wedding",
  "blush",
  "pink",
  "tulle",
  "ball gown",
  "women",
],
  specifications: {
  Material: "Tulle",
  Occasion: "Wedding",
  Style: "Ball Gown",
  Gender: "Women",
  AvailableColors: "Blush, Pink",
  AvailableSizes: "S, M, L",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-dress-008",
  name: "Emerald Velvet Reception Dress",
  description: "Emerald Velvet Reception Dress is a wrap midi velvet piece designed for wedding reception occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 4999,
  originalPrice: 6799,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-008.webp",
  images: [
  "/products/prod-wedding-dress-008.webp",
],
  rating: 4.5,
  reviewCount: 114,
  variants: [
  {
  size: "S",
  color: "Emerald",
  stock: 16,
  sku: "WEDDINGDRESS008-S-EMERA"
},
  {
  size: "M",
  color: "Emerald",
  stock: 21,
  sku: "WEDDINGDRESS008-M-EMERA"
},
  {
  size: "L",
  color: "Emerald",
  stock: 7,
  sku: "WEDDINGDRESS008-L-EMERA"
},
  {
  size: "XL",
  color: "Emerald",
  stock: 12,
  sku: "WEDDINGDRESS008-XL-EMERA"
},
  {
  size: "S",
  color: "Green",
  stock: 23,
  sku: "WEDDINGDRESS008-S-GREEN"
},
  {
  size: "M",
  color: "Green",
  stock: 9,
  sku: "WEDDINGDRESS008-M-GREEN"
},
  {
  size: "L",
  color: "Green",
  stock: 14,
  sku: "WEDDINGDRESS008-L-GREEN"
},
  {
  size: "XL",
  color: "Green",
  stock: 19,
  sku: "WEDDINGDRESS008-XL-GREEN"
},
],
  tags: [
  "wedding-dresses",
  "wedding reception",
  "emerald",
  "green",
  "velvet",
  "wrap midi",
  "women",
],
  specifications: {
  Material: "Velvet",
  Occasion: "Wedding Reception",
  Style: "Wrap Midi",
  Gender: "Women",
  AvailableColors: "Emerald, Green",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-dress-009",
  name: "Ivory Chikankari Bridal Anarkali",
  description: "Ivory Chikankari Bridal Anarkali is a anarkali georgette piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 6499,
  originalPrice: 8499,
  category: "wedding-dresses",
  image: "/products/prod-wedding-dress-009.webp",
  images: [
  "/products/prod-wedding-dress-009.webp",
],
  rating: 4.7,
  reviewCount: 76,
  variants: [
  {
  size: "S",
  color: "Ivory",
  stock: 18,
  sku: "WEDDINGDRESS009-S-IVORY"
},
  {
  size: "M",
  color: "Ivory",
  stock: 23,
  sku: "WEDDINGDRESS009-M-IVORY"
},
  {
  size: "L",
  color: "Ivory",
  stock: 9,
  sku: "WEDDINGDRESS009-L-IVORY"
},
  {
  size: "XL",
  color: "Ivory",
  stock: 14,
  sku: "WEDDINGDRESS009-XL-IVORY"
},
  {
  size: "XXL",
  color: "Ivory",
  stock: 19,
  sku: "WEDDINGDRESS009-XXL-IVORY"
},
  {
  size: "S",
  color: "Cream",
  stock: 6,
  sku: "WEDDINGDRESS009-S-CREAM"
},
  {
  size: "M",
  color: "Cream",
  stock: 11,
  sku: "WEDDINGDRESS009-M-CREAM"
},
  {
  size: "L",
  color: "Cream",
  stock: 16,
  sku: "WEDDINGDRESS009-L-CREAM"
},
  {
  size: "XL",
  color: "Cream",
  stock: 21,
  sku: "WEDDINGDRESS009-XL-CREAM"
},
  {
  size: "XXL",
  color: "Cream",
  stock: 7,
  sku: "WEDDINGDRESS009-XXL-CREAM"
},
],
  tags: [
  "wedding-dresses",
  "wedding",
  "ivory",
  "cream",
  "georgette",
  "anarkali",
  "women",
],
  specifications: {
  Material: "Georgette",
  Occasion: "Wedding",
  Style: "Anarkali",
  Gender: "Women",
  AvailableColors: "Ivory, Cream",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-dress-001",
  name: "Navy Pleated Midi Dress",
  description: "Navy Pleated Midi Dress is a pleated midi crepe piece designed for office & brunch occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2399,
  originalPrice: 3199,
  category: "dresses",
  image: "/products/prod-dress-001.webp",
  images: [
  "/products/prod-dress-001.webp",
],
  rating: 4.5,
  reviewCount: 143,
  variants: [
  {
  size: "XS",
  color: "Navy",
  stock: 9,
  sku: "DRESS001-XS-NAVY"
},
  {
  size: "S",
  color: "Navy",
  stock: 14,
  sku: "DRESS001-S-NAVY"
},
  {
  size: "M",
  color: "Navy",
  stock: 19,
  sku: "DRESS001-M-NAVY"
},
  {
  size: "L",
  color: "Navy",
  stock: 5,
  sku: "DRESS001-L-NAVY"
},
  {
  size: "XL",
  color: "Navy",
  stock: 10,
  sku: "DRESS001-XL-NAVY"
},
  {
  size: "XS",
  color: "Sky Blue",
  stock: 16,
  sku: "DRESS001-XS-SKYBL"
},
  {
  size: "S",
  color: "Sky Blue",
  stock: 21,
  sku: "DRESS001-S-SKYBL"
},
  {
  size: "M",
  color: "Sky Blue",
  stock: 7,
  sku: "DRESS001-M-SKYBL"
},
  {
  size: "L",
  color: "Sky Blue",
  stock: 12,
  sku: "DRESS001-L-SKYBL"
},
  {
  size: "XL",
  color: "Sky Blue",
  stock: 17,
  sku: "DRESS001-XL-SKYBL"
},
],
  tags: [
  "dresses",
  "office & brunch",
  "navy",
  "sky blue",
  "crepe",
  "pleated midi",
  "women",
],
  specifications: {
  Material: "Crepe",
  Occasion: "Office & Brunch",
  Style: "Pleated Midi",
  Gender: "Women",
  AvailableColors: "Navy, Sky Blue",
  AvailableSizes: "XS, S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-dress-002",
  name: "Mustard Linen Shirt Dress",
  description: "Mustard Linen Shirt Dress is a shirt dress linen piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1999,
  originalPrice: 2699,
  category: "dresses",
  image: "/products/prod-dress-002.webp",
  images: [
  "/products/prod-dress-002.webp",
],
  rating: 4.4,
  reviewCount: 109,
  variants: [
  {
  size: "S",
  color: "Mustard",
  stock: 11,
  sku: "DRESS002-S-MUSTA"
},
  {
  size: "M",
  color: "Mustard",
  stock: 16,
  sku: "DRESS002-M-MUSTA"
},
  {
  size: "L",
  color: "Mustard",
  stock: 21,
  sku: "DRESS002-L-MUSTA"
},
  {
  size: "XL",
  color: "Mustard",
  stock: 7,
  sku: "DRESS002-XL-MUSTA"
},
  {
  size: "S",
  color: "Beige",
  stock: 18,
  sku: "DRESS002-S-BEIGE"
},
  {
  size: "M",
  color: "Beige",
  stock: 23,
  sku: "DRESS002-M-BEIGE"
},
  {
  size: "L",
  color: "Beige",
  stock: 9,
  sku: "DRESS002-L-BEIGE"
},
  {
  size: "XL",
  color: "Beige",
  stock: 14,
  sku: "DRESS002-XL-BEIGE"
},
],
  tags: [
  "dresses",
  "casual",
  "mustard",
  "beige",
  "linen",
  "shirt dress",
  "women",
],
  specifications: {
  Material: "Linen",
  Occasion: "Casual",
  Style: "Shirt Dress",
  Gender: "Women",
  AvailableColors: "Mustard, Beige",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-dress-003",
  name: "Black Wrap Cocktail Dress",
  description: "Black Wrap Cocktail Dress is a wrap cocktail satin piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 3499,
  originalPrice: 4599,
  category: "dresses",
  image: "/products/prod-dress-003.webp",
  images: [
  "/products/prod-dress-003.webp",
],
  rating: 4.7,
  reviewCount: 201,
  variants: [
  {
  size: "XS",
  color: "Black",
  stock: 11,
  sku: "DRESS003-XS-BLACK"
},
  {
  size: "S",
  color: "Black",
  stock: 16,
  sku: "DRESS003-S-BLACK"
},
  {
  size: "M",
  color: "Black",
  stock: 21,
  sku: "DRESS003-M-BLACK"
},
  {
  size: "L",
  color: "Black",
  stock: 7,
  sku: "DRESS003-L-BLACK"
},
  {
  size: "XL",
  color: "Black",
  stock: 12,
  sku: "DRESS003-XL-BLACK"
},
],
  tags: [
  "dresses",
  "party",
  "black",
  "satin",
  "wrap cocktail",
  "women",
],
  specifications: {
  Material: "Satin",
  Occasion: "Party",
  Style: "Wrap Cocktail",
  Gender: "Women",
  AvailableColors: "Black",
  AvailableSizes: "XS, S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-dress-004",
  name: "Lavender Floral Maxi Dress",
  description: "Lavender Floral Maxi Dress is a floral maxi chiffon piece designed for vacation occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2799,
  originalPrice: 3799,
  category: "dresses",
  image: "/products/prod-dress-004.webp",
  images: [
  "/products/prod-dress-004.webp",
],
  rating: 4.5,
  reviewCount: 87,
  variants: [
  {
  size: "S",
  color: "Lavender",
  stock: 12,
  sku: "DRESS004-S-LAVEN"
},
  {
  size: "M",
  color: "Lavender",
  stock: 17,
  sku: "DRESS004-M-LAVEN"
},
  {
  size: "L",
  color: "Lavender",
  stock: 22,
  sku: "DRESS004-L-LAVEN"
},
  {
  size: "XL",
  color: "Lavender",
  stock: 8,
  sku: "DRESS004-XL-LAVEN"
},
  {
  size: "S",
  color: "Purple",
  stock: 19,
  sku: "DRESS004-S-PURPL"
},
  {
  size: "M",
  color: "Purple",
  stock: 5,
  sku: "DRESS004-M-PURPL"
},
  {
  size: "L",
  color: "Purple",
  stock: 10,
  sku: "DRESS004-L-PURPL"
},
  {
  size: "XL",
  color: "Purple",
  stock: 15,
  sku: "DRESS004-XL-PURPL"
},
],
  tags: [
  "dresses",
  "vacation",
  "lavender",
  "purple",
  "chiffon",
  "floral maxi",
  "women",
],
  specifications: {
  Material: "Chiffon",
  Occasion: "Vacation",
  Style: "Floral Maxi",
  Gender: "Women",
  AvailableColors: "Lavender, Purple",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-dress-005",
  name: "Red Ribbed Knit Bodycon Dress",
  description: "Red Ribbed Knit Bodycon Dress is a bodycon ribbed knit piece designed for date night occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1799,
  originalPrice: 2499,
  category: "dresses",
  image: "/products/prod-dress-005.webp",
  images: [
  "/products/prod-dress-005.webp",
],
  rating: 4.3,
  reviewCount: 166,
  variants: [
  {
  size: "XS",
  color: "Red",
  stock: 15,
  sku: "DRESS005-XS-RED"
},
  {
  size: "S",
  color: "Red",
  stock: 20,
  sku: "DRESS005-S-RED"
},
  {
  size: "M",
  color: "Red",
  stock: 6,
  sku: "DRESS005-M-RED"
},
  {
  size: "L",
  color: "Red",
  stock: 11,
  sku: "DRESS005-L-RED"
},
  {
  size: "XS",
  color: "Maroon",
  stock: 22,
  sku: "DRESS005-XS-MAROO"
},
  {
  size: "S",
  color: "Maroon",
  stock: 8,
  sku: "DRESS005-S-MAROO"
},
  {
  size: "M",
  color: "Maroon",
  stock: 13,
  sku: "DRESS005-M-MAROO"
},
  {
  size: "L",
  color: "Maroon",
  stock: 18,
  sku: "DRESS005-L-MAROO"
},
],
  tags: [
  "dresses",
  "date night",
  "red",
  "maroon",
  "ribbed knit",
  "bodycon",
  "women",
],
  specifications: {
  Material: "Ribbed Knit",
  Occasion: "Date Night",
  Style: "Bodycon",
  Gender: "Women",
  AvailableColors: "Red, Maroon",
  AvailableSizes: "XS, S, M, L",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-saree-002",
  name: "Ruby Red Art Silk Saree",
  description: "Ruby Red Art Silk Saree is a zari border art silk piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2499,
  originalPrice: 3499,
  category: "sarees",
  image: "/products/prod-saree-002.webp",
  images: [
  "/products/prod-saree-002.webp",
],
  rating: 4.6,
  reviewCount: 192,
  variants: [
  {
  size: "Free Size",
  color: "Red",
  stock: 9,
  sku: "SAREE002-FREESIZE-RED"
},
  {
  size: "Free Size",
  color: "Maroon",
  stock: 16,
  sku: "SAREE002-FREESIZE-MAROO"
},
],
  tags: [
  "sarees",
  "wedding",
  "red",
  "maroon",
  "art silk",
  "zari border",
  "women",
],
  specifications: {
  Material: "Art Silk",
  Occasion: "Wedding",
  Style: "Zari Border",
  Gender: "Women",
  AvailableColors: "Red, Maroon",
  AvailableSizes: "Free Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-saree-003",
  name: "Crimson Chiffon Printed Saree",
  description: "Crimson Chiffon Printed Saree is a printed chiffon piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1499,
  originalPrice: 2199,
  category: "sarees",
  image: "/products/prod-saree-003.webp",
  images: [
  "/products/prod-saree-003.webp",
],
  rating: 4.3,
  reviewCount: 121,
  variants: [
  {
  size: "Free Size",
  color: "Red",
  stock: 15,
  sku: "SAREE003-FREESIZE-RED"
},
  {
  size: "Free Size",
  color: "Pink",
  stock: 22,
  sku: "SAREE003-FREESIZE-PINK"
},
],
  tags: [
  "sarees",
  "casual",
  "red",
  "pink",
  "chiffon",
  "printed",
  "women",
],
  specifications: {
  Material: "Chiffon",
  Occasion: "Casual",
  Style: "Printed",
  Gender: "Women",
  AvailableColors: "Red, Pink",
  AvailableSizes: "Free Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-saree-004",
  name: "Emerald Kanjeevaram Silk Saree",
  description: "Emerald Kanjeevaram Silk Saree is a temple border kanjeevaram silk piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 10999,
  originalPrice: 12999,
  category: "sarees",
  image: "/products/prod-saree-004.webp",
  images: [
  "/products/prod-saree-004.webp",
],
  rating: 4.9,
  reviewCount: 68,
  variants: [
  {
  size: "Free Size",
  color: "Emerald",
  stock: 16,
  sku: "SAREE004-FREESIZE-EMERA"
},
  {
  size: "Free Size",
  color: "Green",
  stock: 23,
  sku: "SAREE004-FREESIZE-GREEN"
},
],
  tags: [
  "sarees",
  "wedding",
  "emerald",
  "green",
  "kanjeevaram silk",
  "temple border",
  "women",
],
  specifications: {
  Material: "Kanjeevaram Silk",
  Occasion: "Wedding",
  Style: "Temple Border",
  Gender: "Women",
  AvailableColors: "Emerald, Green",
  AvailableSizes: "Free Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-saree-005",
  name: "Navy Blue Georgette Party Saree",
  description: "Navy Blue Georgette Party Saree is a sequin border georgette piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2999,
  originalPrice: 4199,
  category: "sarees",
  image: "/products/prod-saree-005.webp",
  images: [
  "/products/prod-saree-005.webp",
],
  rating: 4.5,
  reviewCount: 153,
  variants: [
  {
  size: "Free Size",
  color: "Navy",
  stock: 17,
  sku: "SAREE005-FREESIZE-NAVY"
},
  {
  size: "Free Size",
  color: "Blue",
  stock: 5,
  sku: "SAREE005-FREESIZE-BLUE"
},
],
  tags: [
  "sarees",
  "party",
  "navy",
  "blue",
  "georgette",
  "sequin border",
  "women",
],
  specifications: {
  Material: "Georgette",
  Occasion: "Party",
  Style: "Sequin Border",
  Gender: "Women",
  AvailableColors: "Navy, Blue",
  AvailableSizes: "Free Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-saree-006",
  name: "Sunshine Yellow Cotton Mulmul Saree",
  description: "Sunshine Yellow Cotton Mulmul Saree is a hand block print mulmul cotton piece designed for daily occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1199,
  originalPrice: 1699,
  category: "sarees",
  image: "/products/prod-saree-006.webp",
  images: [
  "/products/prod-saree-006.webp",
],
  rating: 4.4,
  reviewCount: 94,
  variants: [
  {
  size: "Free Size",
  color: "Yellow",
  stock: 21,
  sku: "SAREE006-FREESIZE-YELLO"
},
  {
  size: "Free Size",
  color: "Mustard",
  stock: 9,
  sku: "SAREE006-FREESIZE-MUSTA"
},
],
  tags: [
  "sarees",
  "daily",
  "yellow",
  "mustard",
  "mulmul cotton",
  "hand block print",
  "women",
],
  specifications: {
  Material: "Mulmul Cotton",
  Occasion: "Daily",
  Style: "Hand Block Print",
  Gender: "Women",
  AvailableColors: "Yellow, Mustard",
  AvailableSizes: "Free Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-kurti-002",
  name: "Ivory Embroidered Anarkali Kurti",
  description: "Ivory Embroidered Anarkali Kurti is a anarkali rayon piece designed for festive occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1899,
  originalPrice: 2699,
  category: "kurtis",
  image: "/products/prod-kurti-002.webp",
  images: [
  "/products/prod-kurti-002.webp",
],
  rating: 4.6,
  reviewCount: 174,
  variants: [
  {
  size: "S",
  color: "Ivory",
  stock: 18,
  sku: "KURTI002-S-IVORY"
},
  {
  size: "M",
  color: "Ivory",
  stock: 23,
  sku: "KURTI002-M-IVORY"
},
  {
  size: "L",
  color: "Ivory",
  stock: 9,
  sku: "KURTI002-L-IVORY"
},
  {
  size: "XL",
  color: "Ivory",
  stock: 14,
  sku: "KURTI002-XL-IVORY"
},
  {
  size: "XXL",
  color: "Ivory",
  stock: 19,
  sku: "KURTI002-XXL-IVORY"
},
  {
  size: "S",
  color: "Cream",
  stock: 6,
  sku: "KURTI002-S-CREAM"
},
  {
  size: "M",
  color: "Cream",
  stock: 11,
  sku: "KURTI002-M-CREAM"
},
  {
  size: "L",
  color: "Cream",
  stock: 16,
  sku: "KURTI002-L-CREAM"
},
  {
  size: "XL",
  color: "Cream",
  stock: 21,
  sku: "KURTI002-XL-CREAM"
},
  {
  size: "XXL",
  color: "Cream",
  stock: 7,
  sku: "KURTI002-XXL-CREAM"
},
],
  tags: [
  "kurtis",
  "festive",
  "ivory",
  "cream",
  "rayon",
  "anarkali",
  "women",
],
  specifications: {
  Material: "Rayon",
  Occasion: "Festive",
  Style: "Anarkali",
  Gender: "Women",
  AvailableColors: "Ivory, Cream",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-kurti-003",
  name: "Indigo Ajrakh Straight Kurti",
  description: "Indigo Ajrakh Straight Kurti is a straight cut cotton piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1399,
  originalPrice: 1999,
  category: "kurtis",
  image: "/products/prod-kurti-003.webp",
  images: [
  "/products/prod-kurti-003.webp",
],
  rating: 4.4,
  reviewCount: 115,
  variants: [
  {
  size: "S",
  color: "Blue",
  stock: 14,
  sku: "KURTI003-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 19,
  sku: "KURTI003-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 5,
  sku: "KURTI003-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 10,
  sku: "KURTI003-XL-BLUE"
},
  {
  size: "S",
  color: "Indigo",
  stock: 21,
  sku: "KURTI003-S-INDIG"
},
  {
  size: "M",
  color: "Indigo",
  stock: 7,
  sku: "KURTI003-M-INDIG"
},
  {
  size: "L",
  color: "Indigo",
  stock: 12,
  sku: "KURTI003-L-INDIG"
},
  {
  size: "XL",
  color: "Indigo",
  stock: 17,
  sku: "KURTI003-XL-INDIG"
},
],
  tags: [
  "kurtis",
  "casual",
  "blue",
  "indigo",
  "cotton",
  "straight cut",
  "women",
],
  specifications: {
  Material: "Cotton",
  Occasion: "Casual",
  Style: "Straight Cut",
  Gender: "Women",
  AvailableColors: "Blue, Indigo",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-kurti-004",
  name: "Rose Pink Mirror Work Kurti",
  description: "Rose Pink Mirror Work Kurti is a flared viscose piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2199,
  originalPrice: 2999,
  category: "kurtis",
  image: "/products/prod-kurti-004.webp",
  images: [
  "/products/prod-kurti-004.webp",
],
  rating: 4.5,
  reviewCount: 83,
  variants: [
  {
  size: "S",
  color: "Pink",
  stock: 13,
  sku: "KURTI004-S-PINK"
},
  {
  size: "M",
  color: "Pink",
  stock: 18,
  sku: "KURTI004-M-PINK"
},
  {
  size: "L",
  color: "Pink",
  stock: 23,
  sku: "KURTI004-L-PINK"
},
  {
  size: "XL",
  color: "Pink",
  stock: 9,
  sku: "KURTI004-XL-PINK"
},
  {
  size: "S",
  color: "Blush",
  stock: 20,
  sku: "KURTI004-S-BLUSH"
},
  {
  size: "M",
  color: "Blush",
  stock: 6,
  sku: "KURTI004-M-BLUSH"
},
  {
  size: "L",
  color: "Blush",
  stock: 11,
  sku: "KURTI004-L-BLUSH"
},
  {
  size: "XL",
  color: "Blush",
  stock: 16,
  sku: "KURTI004-XL-BLUSH"
},
],
  tags: [
  "kurtis",
  "party",
  "pink",
  "blush",
  "viscose",
  "flared",
  "women",
],
  specifications: {
  Material: "Viscose",
  Occasion: "Party",
  Style: "Flared",
  Gender: "Women",
  AvailableColors: "Pink, Blush",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-kurti-005",
  name: "Mustard Ikat A-Line Kurti",
  description: "Mustard Ikat A-Line Kurti is a a-line cotton piece designed for daily occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 999,
  originalPrice: 1499,
  category: "kurtis",
  image: "/products/prod-kurti-005.webp",
  images: [
  "/products/prod-kurti-005.webp",
],
  rating: 4.3,
  reviewCount: 146,
  variants: [
  {
  size: "S",
  color: "Mustard",
  stock: 11,
  sku: "KURTI005-S-MUSTA"
},
  {
  size: "M",
  color: "Mustard",
  stock: 16,
  sku: "KURTI005-M-MUSTA"
},
  {
  size: "L",
  color: "Mustard",
  stock: 21,
  sku: "KURTI005-L-MUSTA"
},
  {
  size: "XL",
  color: "Mustard",
  stock: 7,
  sku: "KURTI005-XL-MUSTA"
},
  {
  size: "XXL",
  color: "Mustard",
  stock: 12,
  sku: "KURTI005-XXL-MUSTA"
},
  {
  size: "S",
  color: "Yellow",
  stock: 18,
  sku: "KURTI005-S-YELLO"
},
  {
  size: "M",
  color: "Yellow",
  stock: 23,
  sku: "KURTI005-M-YELLO"
},
  {
  size: "L",
  color: "Yellow",
  stock: 9,
  sku: "KURTI005-L-YELLO"
},
  {
  size: "XL",
  color: "Yellow",
  stock: 14,
  sku: "KURTI005-XL-YELLO"
},
  {
  size: "XXL",
  color: "Yellow",
  stock: 19,
  sku: "KURTI005-XXL-YELLO"
},
],
  tags: [
  "kurtis",
  "daily",
  "mustard",
  "yellow",
  "cotton",
  "a-line",
  "women",
],
  specifications: {
  Material: "Cotton",
  Occasion: "Daily",
  Style: "A-Line",
  Gender: "Women",
  AvailableColors: "Mustard, Yellow",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-kurti-006",
  name: "Teal Chanderi Panelled Kurti",
  description: "Teal Chanderi Panelled Kurti is a panelled chanderi piece designed for festive occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2499,
  originalPrice: 3499,
  category: "kurtis",
  image: "/products/prod-kurti-006.webp",
  images: [
  "/products/prod-kurti-006.webp",
],
  rating: 4.7,
  reviewCount: 67,
  variants: [
  {
  size: "S",
  color: "Teal",
  stock: 14,
  sku: "KURTI006-S-TEAL"
},
  {
  size: "M",
  color: "Teal",
  stock: 19,
  sku: "KURTI006-M-TEAL"
},
  {
  size: "L",
  color: "Teal",
  stock: 5,
  sku: "KURTI006-L-TEAL"
},
  {
  size: "XL",
  color: "Teal",
  stock: 10,
  sku: "KURTI006-XL-TEAL"
},
  {
  size: "S",
  color: "Green",
  stock: 21,
  sku: "KURTI006-S-GREEN"
},
  {
  size: "M",
  color: "Green",
  stock: 7,
  sku: "KURTI006-M-GREEN"
},
  {
  size: "L",
  color: "Green",
  stock: 12,
  sku: "KURTI006-L-GREEN"
},
  {
  size: "XL",
  color: "Green",
  stock: 17,
  sku: "KURTI006-XL-GREEN"
},
],
  tags: [
  "kurtis",
  "festive",
  "teal",
  "green",
  "chanderi",
  "panelled",
  "women",
],
  specifications: {
  Material: "Chanderi",
  Occasion: "Festive",
  Style: "Panelled",
  Gender: "Women",
  AvailableColors: "Teal, Green",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-shirt-001",
  name: "Classic Oxford Cotton Shirt",
  description: "Classic Oxford Cotton Shirt is a regular fit oxford cotton piece designed for office occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1499,
  originalPrice: 2099,
  category: "shirts",
  image: "/products/prod-shirt-001.webp",
  images: [
  "/products/prod-shirt-001.webp",
],
  rating: 4.6,
  reviewCount: 247,
  variants: [
  {
  size: "S",
  color: "White",
  stock: 13,
  sku: "SHIRT001-S-WHITE"
},
  {
  size: "M",
  color: "White",
  stock: 18,
  sku: "SHIRT001-M-WHITE"
},
  {
  size: "L",
  color: "White",
  stock: 23,
  sku: "SHIRT001-L-WHITE"
},
  {
  size: "XL",
  color: "White",
  stock: 9,
  sku: "SHIRT001-XL-WHITE"
},
  {
  size: "XXL",
  color: "White",
  stock: 14,
  sku: "SHIRT001-XXL-WHITE"
},
  {
  size: "S",
  color: "Sky Blue",
  stock: 20,
  sku: "SHIRT001-S-SKYBL"
},
  {
  size: "M",
  color: "Sky Blue",
  stock: 6,
  sku: "SHIRT001-M-SKYBL"
},
  {
  size: "L",
  color: "Sky Blue",
  stock: 11,
  sku: "SHIRT001-L-SKYBL"
},
  {
  size: "XL",
  color: "Sky Blue",
  stock: 16,
  sku: "SHIRT001-XL-SKYBL"
},
  {
  size: "XXL",
  color: "Sky Blue",
  stock: 21,
  sku: "SHIRT001-XXL-SKYBL"
},
  {
  size: "S",
  color: "Blue",
  stock: 8,
  sku: "SHIRT001-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 13,
  sku: "SHIRT001-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 18,
  sku: "SHIRT001-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 23,
  sku: "SHIRT001-XL-BLUE"
},
  {
  size: "XXL",
  color: "Blue",
  stock: 9,
  sku: "SHIRT001-XXL-BLUE"
},
],
  tags: [
  "shirts",
  "office",
  "white",
  "sky blue",
  "blue",
  "oxford cotton",
  "regular fit",
  "men",
],
  specifications: {
  Material: "Oxford Cotton",
  Occasion: "Office",
  Style: "Regular Fit",
  Gender: "Men",
  AvailableColors: "White, Sky Blue, Blue",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-shirt-002",
  name: "Navy Slim Fit Poplin Shirt",
  description: "Navy Slim Fit Poplin Shirt is a slim fit poplin cotton piece designed for formal occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1799,
  originalPrice: 2499,
  category: "shirts",
  image: "/products/prod-shirt-002.webp",
  images: [
  "/products/prod-shirt-002.webp",
],
  rating: 4.5,
  reviewCount: 186,
  variants: [
  {
  size: "S",
  color: "Navy",
  stock: 12,
  sku: "SHIRT002-S-NAVY"
},
  {
  size: "M",
  color: "Navy",
  stock: 17,
  sku: "SHIRT002-M-NAVY"
},
  {
  size: "L",
  color: "Navy",
  stock: 22,
  sku: "SHIRT002-L-NAVY"
},
  {
  size: "XL",
  color: "Navy",
  stock: 8,
  sku: "SHIRT002-XL-NAVY"
},
  {
  size: "S",
  color: "Blue",
  stock: 19,
  sku: "SHIRT002-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 5,
  sku: "SHIRT002-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 10,
  sku: "SHIRT002-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 15,
  sku: "SHIRT002-XL-BLUE"
},
],
  tags: [
  "shirts",
  "formal",
  "navy",
  "blue",
  "poplin cotton",
  "slim fit",
  "men",
],
  specifications: {
  Material: "Poplin Cotton",
  Occasion: "Formal",
  Style: "Slim Fit",
  Gender: "Men",
  AvailableColors: "Navy, Blue",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-shirt-003",
  name: "Olive Linen Resort Shirt",
  description: "Olive Linen Resort Shirt is a relaxed fit linen piece designed for vacation occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1599,
  originalPrice: 2299,
  category: "shirts",
  image: "/products/prod-shirt-003.webp",
  images: [
  "/products/prod-shirt-003.webp",
],
  rating: 4.4,
  reviewCount: 96,
  variants: [
  {
  size: "S",
  color: "Olive",
  stock: 10,
  sku: "SHIRT003-S-OLIVE"
},
  {
  size: "M",
  color: "Olive",
  stock: 15,
  sku: "SHIRT003-M-OLIVE"
},
  {
  size: "L",
  color: "Olive",
  stock: 20,
  sku: "SHIRT003-L-OLIVE"
},
  {
  size: "XL",
  color: "Olive",
  stock: 6,
  sku: "SHIRT003-XL-OLIVE"
},
  {
  size: "XXL",
  color: "Olive",
  stock: 11,
  sku: "SHIRT003-XXL-OLIVE"
},
  {
  size: "S",
  color: "Green",
  stock: 17,
  sku: "SHIRT003-S-GREEN"
},
  {
  size: "M",
  color: "Green",
  stock: 22,
  sku: "SHIRT003-M-GREEN"
},
  {
  size: "L",
  color: "Green",
  stock: 8,
  sku: "SHIRT003-L-GREEN"
},
  {
  size: "XL",
  color: "Green",
  stock: 13,
  sku: "SHIRT003-XL-GREEN"
},
  {
  size: "XXL",
  color: "Green",
  stock: 18,
  sku: "SHIRT003-XXL-GREEN"
},
],
  tags: [
  "shirts",
  "vacation",
  "olive",
  "green",
  "linen",
  "relaxed fit",
  "men",
],
  specifications: {
  Material: "Linen",
  Occasion: "Vacation",
  Style: "Relaxed Fit",
  Gender: "Men",
  AvailableColors: "Olive, Green",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-shirt-004",
  name: "Burgundy Checked Flannel Shirt",
  description: "Burgundy Checked Flannel Shirt is a checked brushed cotton piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1299,
  originalPrice: 1899,
  category: "shirts",
  image: "/products/prod-shirt-004.webp",
  images: [
  "/products/prod-shirt-004.webp",
],
  rating: 4.3,
  reviewCount: 138,
  variants: [
  {
  size: "S",
  color: "Burgundy",
  stock: 16,
  sku: "SHIRT004-S-BURGU"
},
  {
  size: "M",
  color: "Burgundy",
  stock: 21,
  sku: "SHIRT004-M-BURGU"
},
  {
  size: "L",
  color: "Burgundy",
  stock: 7,
  sku: "SHIRT004-L-BURGU"
},
  {
  size: "XL",
  color: "Burgundy",
  stock: 12,
  sku: "SHIRT004-XL-BURGU"
},
  {
  size: "S",
  color: "Maroon",
  stock: 23,
  sku: "SHIRT004-S-MAROO"
},
  {
  size: "M",
  color: "Maroon",
  stock: 9,
  sku: "SHIRT004-M-MAROO"
},
  {
  size: "L",
  color: "Maroon",
  stock: 14,
  sku: "SHIRT004-L-MAROO"
},
  {
  size: "XL",
  color: "Maroon",
  stock: 19,
  sku: "SHIRT004-XL-MAROO"
},
],
  tags: [
  "shirts",
  "casual",
  "burgundy",
  "maroon",
  "brushed cotton",
  "checked",
  "men",
],
  specifications: {
  Material: "Brushed Cotton",
  Occasion: "Casual",
  Style: "Checked",
  Gender: "Men",
  AvailableColors: "Burgundy, Maroon",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-shirt-005",
  name: "Black Mandarin Collar Shirt",
  description: "Black Mandarin Collar Shirt is a mandarin collar cotton satin piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 2199,
  originalPrice: 2999,
  category: "shirts",
  image: "/products/prod-shirt-005.webp",
  images: [
  "/products/prod-shirt-005.webp",
],
  rating: 4.6,
  reviewCount: 72,
  variants: [
  {
  size: "S",
  color: "Black",
  stock: 13,
  sku: "SHIRT005-S-BLACK"
},
  {
  size: "M",
  color: "Black",
  stock: 18,
  sku: "SHIRT005-M-BLACK"
},
  {
  size: "L",
  color: "Black",
  stock: 23,
  sku: "SHIRT005-L-BLACK"
},
  {
  size: "XL",
  color: "Black",
  stock: 9,
  sku: "SHIRT005-XL-BLACK"
},
  {
  size: "XXL",
  color: "Black",
  stock: 14,
  sku: "SHIRT005-XXL-BLACK"
},
],
  tags: [
  "shirts",
  "party",
  "black",
  "cotton satin",
  "mandarin collar",
  "men",
],
  specifications: {
  Material: "Cotton Satin",
  Occasion: "Party",
  Style: "Mandarin Collar",
  Gender: "Men",
  AvailableColors: "Black",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-tshirt-001",
  name: "White Organic Cotton Crew T-Shirt",
  description: "White Organic Cotton Crew T-Shirt is a crew neck organic cotton piece designed for daily occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for unisex wardrobes.",
  price: 699,
  originalPrice: 999,
  category: "t-shirts",
  image: "/products/prod-tshirt-001.webp",
  images: [
  "/products/prod-tshirt-001.webp",
],
  rating: 4.5,
  reviewCount: 326,
  variants: [
  {
  size: "XS",
  color: "White",
  stock: 19,
  sku: "TSHIRT001-XS-WHITE"
},
  {
  size: "S",
  color: "White",
  stock: 5,
  sku: "TSHIRT001-S-WHITE"
},
  {
  size: "M",
  color: "White",
  stock: 10,
  sku: "TSHIRT001-M-WHITE"
},
  {
  size: "L",
  color: "White",
  stock: 15,
  sku: "TSHIRT001-L-WHITE"
},
  {
  size: "XL",
  color: "White",
  stock: 20,
  sku: "TSHIRT001-XL-WHITE"
},
  {
  size: "XXL",
  color: "White",
  stock: 6,
  sku: "TSHIRT001-XXL-WHITE"
},
  {
  size: "XS",
  color: "Cream",
  stock: 7,
  sku: "TSHIRT001-XS-CREAM"
},
  {
  size: "S",
  color: "Cream",
  stock: 12,
  sku: "TSHIRT001-S-CREAM"
},
  {
  size: "M",
  color: "Cream",
  stock: 17,
  sku: "TSHIRT001-M-CREAM"
},
  {
  size: "L",
  color: "Cream",
  stock: 22,
  sku: "TSHIRT001-L-CREAM"
},
  {
  size: "XL",
  color: "Cream",
  stock: 8,
  sku: "TSHIRT001-XL-CREAM"
},
  {
  size: "XXL",
  color: "Cream",
  stock: 13,
  sku: "TSHIRT001-XXL-CREAM"
},
],
  tags: [
  "t-shirts",
  "daily",
  "white",
  "cream",
  "organic cotton",
  "crew neck",
  "unisex",
],
  specifications: {
  Material: "Organic Cotton",
  Occasion: "Daily",
  Style: "Crew Neck",
  Gender: "Unisex",
  AvailableColors: "White, Cream",
  AvailableSizes: "XS, S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-tshirt-002",
  name: "Navy Pocket Polo T-Shirt",
  description: "Navy Pocket Polo T-Shirt is a polo pique cotton piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 999,
  originalPrice: 1499,
  category: "t-shirts",
  image: "/products/prod-tshirt-002.webp",
  images: [
  "/products/prod-tshirt-002.webp",
],
  rating: 4.4,
  reviewCount: 192,
  variants: [
  {
  size: "S",
  color: "Navy",
  stock: 10,
  sku: "TSHIRT002-S-NAVY"
},
  {
  size: "M",
  color: "Navy",
  stock: 15,
  sku: "TSHIRT002-M-NAVY"
},
  {
  size: "L",
  color: "Navy",
  stock: 20,
  sku: "TSHIRT002-L-NAVY"
},
  {
  size: "XL",
  color: "Navy",
  stock: 6,
  sku: "TSHIRT002-XL-NAVY"
},
  {
  size: "XXL",
  color: "Navy",
  stock: 11,
  sku: "TSHIRT002-XXL-NAVY"
},
  {
  size: "S",
  color: "Blue",
  stock: 17,
  sku: "TSHIRT002-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 22,
  sku: "TSHIRT002-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 8,
  sku: "TSHIRT002-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 13,
  sku: "TSHIRT002-XL-BLUE"
},
  {
  size: "XXL",
  color: "Blue",
  stock: 18,
  sku: "TSHIRT002-XXL-BLUE"
},
],
  tags: [
  "t-shirts",
  "casual",
  "navy",
  "blue",
  "pique cotton",
  "polo",
  "men",
],
  specifications: {
  Material: "Pique Cotton",
  Occasion: "Casual",
  Style: "Polo",
  Gender: "Men",
  AvailableColors: "Navy, Blue",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-tshirt-003",
  name: "Blush Oversized Graphic T-Shirt",
  description: "Blush Oversized Graphic T-Shirt is a oversized cotton jersey piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 899,
  originalPrice: 1299,
  category: "t-shirts",
  image: "/products/prod-tshirt-003.webp",
  images: [
  "/products/prod-tshirt-003.webp",
],
  rating: 4.3,
  reviewCount: 156,
  variants: [
  {
  size: "XS",
  color: "Blush",
  stock: 17,
  sku: "TSHIRT003-XS-BLUSH"
},
  {
  size: "S",
  color: "Blush",
  stock: 22,
  sku: "TSHIRT003-S-BLUSH"
},
  {
  size: "M",
  color: "Blush",
  stock: 8,
  sku: "TSHIRT003-M-BLUSH"
},
  {
  size: "L",
  color: "Blush",
  stock: 13,
  sku: "TSHIRT003-L-BLUSH"
},
  {
  size: "XL",
  color: "Blush",
  stock: 18,
  sku: "TSHIRT003-XL-BLUSH"
},
  {
  size: "XS",
  color: "Pink",
  stock: 5,
  sku: "TSHIRT003-XS-PINK"
},
  {
  size: "S",
  color: "Pink",
  stock: 10,
  sku: "TSHIRT003-S-PINK"
},
  {
  size: "M",
  color: "Pink",
  stock: 15,
  sku: "TSHIRT003-M-PINK"
},
  {
  size: "L",
  color: "Pink",
  stock: 20,
  sku: "TSHIRT003-L-PINK"
},
  {
  size: "XL",
  color: "Pink",
  stock: 6,
  sku: "TSHIRT003-XL-PINK"
},
],
  tags: [
  "t-shirts",
  "casual",
  "blush",
  "pink",
  "cotton jersey",
  "oversized",
  "women",
],
  specifications: {
  Material: "Cotton Jersey",
  Occasion: "Casual",
  Style: "Oversized",
  Gender: "Women",
  AvailableColors: "Blush, Pink",
  AvailableSizes: "XS, S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-tshirt-004",
  name: "Black Performance Training T-Shirt",
  description: "Black Performance Training T-Shirt is a athletic moisture-wicking polyester piece designed for gym occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1199,
  originalPrice: 1699,
  category: "t-shirts",
  image: "/products/prod-tshirt-004.webp",
  images: [
  "/products/prod-tshirt-004.webp",
],
  rating: 4.6,
  reviewCount: 213,
  variants: [
  {
  size: "S",
  color: "Black",
  stock: 20,
  sku: "TSHIRT004-S-BLACK"
},
  {
  size: "M",
  color: "Black",
  stock: 6,
  sku: "TSHIRT004-M-BLACK"
},
  {
  size: "L",
  color: "Black",
  stock: 11,
  sku: "TSHIRT004-L-BLACK"
},
  {
  size: "XL",
  color: "Black",
  stock: 16,
  sku: "TSHIRT004-XL-BLACK"
},
  {
  size: "XXL",
  color: "Black",
  stock: 21,
  sku: "TSHIRT004-XXL-BLACK"
},
  {
  size: "S",
  color: "Grey",
  stock: 8,
  sku: "TSHIRT004-S-GREY"
},
  {
  size: "M",
  color: "Grey",
  stock: 13,
  sku: "TSHIRT004-M-GREY"
},
  {
  size: "L",
  color: "Grey",
  stock: 18,
  sku: "TSHIRT004-L-GREY"
},
  {
  size: "XL",
  color: "Grey",
  stock: 23,
  sku: "TSHIRT004-XL-GREY"
},
  {
  size: "XXL",
  color: "Grey",
  stock: 9,
  sku: "TSHIRT004-XXL-GREY"
},
],
  tags: [
  "t-shirts",
  "gym",
  "black",
  "grey",
  "moisture-wicking polyester",
  "athletic",
  "men",
],
  specifications: {
  Material: "Moisture-Wicking Polyester",
  Occasion: "Gym",
  Style: "Athletic",
  Gender: "Men",
  AvailableColors: "Black, Grey",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-tshirt-005",
  name: "Lavender Ribbed Baby Tee",
  description: "Lavender Ribbed Baby Tee is a fitted ribbed cotton piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 799,
  originalPrice: 1199,
  category: "t-shirts",
  image: "/products/prod-tshirt-005.webp",
  images: [
  "/products/prod-tshirt-005.webp",
],
  rating: 4.4,
  reviewCount: 119,
  variants: [
  {
  size: "XS",
  color: "Lavender",
  stock: 10,
  sku: "TSHIRT005-XS-LAVEN"
},
  {
  size: "S",
  color: "Lavender",
  stock: 15,
  sku: "TSHIRT005-S-LAVEN"
},
  {
  size: "M",
  color: "Lavender",
  stock: 20,
  sku: "TSHIRT005-M-LAVEN"
},
  {
  size: "L",
  color: "Lavender",
  stock: 6,
  sku: "TSHIRT005-L-LAVEN"
},
  {
  size: "XS",
  color: "Purple",
  stock: 17,
  sku: "TSHIRT005-XS-PURPL"
},
  {
  size: "S",
  color: "Purple",
  stock: 22,
  sku: "TSHIRT005-S-PURPL"
},
  {
  size: "M",
  color: "Purple",
  stock: 8,
  sku: "TSHIRT005-M-PURPL"
},
  {
  size: "L",
  color: "Purple",
  stock: 13,
  sku: "TSHIRT005-L-PURPL"
},
],
  tags: [
  "t-shirts",
  "casual",
  "lavender",
  "purple",
  "ribbed cotton",
  "fitted",
  "women",
],
  specifications: {
  Material: "Ribbed Cotton",
  Occasion: "Casual",
  Style: "Fitted",
  Gender: "Women",
  AvailableColors: "Lavender, Purple",
  AvailableSizes: "XS, S, M, L",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jeans-002",
  name: "Straight Fit Blue Denim Jeans",
  description: "Straight Fit Blue Denim Jeans is a straight fit stretch denim piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 2499,
  originalPrice: 3299,
  category: "jeans",
  image: "/products/prod-jeans-002.webp",
  images: [
  "/products/prod-jeans-002.webp",
],
  rating: 4.6,
  reviewCount: 276,
  variants: [
  {
  size: "28",
  color: "Blue",
  stock: 15,
  sku: "JEANS002-28-BLUE"
},
  {
  size: "30",
  color: "Blue",
  stock: 20,
  sku: "JEANS002-30-BLUE"
},
  {
  size: "32",
  color: "Blue",
  stock: 6,
  sku: "JEANS002-32-BLUE"
},
  {
  size: "34",
  color: "Blue",
  stock: 11,
  sku: "JEANS002-34-BLUE"
},
  {
  size: "36",
  color: "Blue",
  stock: 16,
  sku: "JEANS002-36-BLUE"
},
  {
  size: "28",
  color: "Indigo",
  stock: 22,
  sku: "JEANS002-28-INDIG"
},
  {
  size: "30",
  color: "Indigo",
  stock: 8,
  sku: "JEANS002-30-INDIG"
},
  {
  size: "32",
  color: "Indigo",
  stock: 13,
  sku: "JEANS002-32-INDIG"
},
  {
  size: "34",
  color: "Indigo",
  stock: 18,
  sku: "JEANS002-34-INDIG"
},
  {
  size: "36",
  color: "Indigo",
  stock: 23,
  sku: "JEANS002-36-INDIG"
},
],
  tags: [
  "jeans",
  "casual",
  "blue",
  "indigo",
  "stretch denim",
  "straight fit",
  "men",
],
  specifications: {
  Material: "Stretch Denim",
  Occasion: "Casual",
  Style: "Straight Fit",
  Gender: "Men",
  AvailableColors: "Blue, Indigo",
  AvailableSizes: "28, 30, 32, 34, 36",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jeans-003",
  name: "Black Mom Fit High Rise Jeans",
  description: "Black Mom Fit High Rise Jeans is a mom fit cotton denim piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2299,
  originalPrice: 3099,
  category: "jeans",
  image: "/products/prod-jeans-003.webp",
  images: [
  "/products/prod-jeans-003.webp",
],
  rating: 4.5,
  reviewCount: 188,
  variants: [
  {
  size: "26",
  color: "Black",
  stock: 15,
  sku: "JEANS003-26-BLACK"
},
  {
  size: "28",
  color: "Black",
  stock: 20,
  sku: "JEANS003-28-BLACK"
},
  {
  size: "30",
  color: "Black",
  stock: 6,
  sku: "JEANS003-30-BLACK"
},
  {
  size: "32",
  color: "Black",
  stock: 11,
  sku: "JEANS003-32-BLACK"
},
  {
  size: "34",
  color: "Black",
  stock: 16,
  sku: "JEANS003-34-BLACK"
},
],
  tags: [
  "jeans",
  "casual",
  "black",
  "cotton denim",
  "mom fit",
  "women",
],
  specifications: {
  Material: "Cotton Denim",
  Occasion: "Casual",
  Style: "Mom Fit",
  Gender: "Women",
  AvailableColors: "Black",
  AvailableSizes: "26, 28, 30, 32, 34",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jeans-004",
  name: "Light Wash Wide Leg Jeans",
  description: "Light Wash Wide Leg Jeans is a wide leg rigid denim piece designed for weekend occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2799,
  originalPrice: 3699,
  category: "jeans",
  image: "/products/prod-jeans-004.webp",
  images: [
  "/products/prod-jeans-004.webp",
],
  rating: 4.4,
  reviewCount: 143,
  variants: [
  {
  size: "26",
  color: "Sky Blue",
  stock: 11,
  sku: "JEANS004-26-SKYBL"
},
  {
  size: "28",
  color: "Sky Blue",
  stock: 16,
  sku: "JEANS004-28-SKYBL"
},
  {
  size: "30",
  color: "Sky Blue",
  stock: 21,
  sku: "JEANS004-30-SKYBL"
},
  {
  size: "32",
  color: "Sky Blue",
  stock: 7,
  sku: "JEANS004-32-SKYBL"
},
  {
  size: "34",
  color: "Sky Blue",
  stock: 12,
  sku: "JEANS004-34-SKYBL"
},
  {
  size: "26",
  color: "Blue",
  stock: 18,
  sku: "JEANS004-26-BLUE"
},
  {
  size: "28",
  color: "Blue",
  stock: 23,
  sku: "JEANS004-28-BLUE"
},
  {
  size: "30",
  color: "Blue",
  stock: 9,
  sku: "JEANS004-30-BLUE"
},
  {
  size: "32",
  color: "Blue",
  stock: 14,
  sku: "JEANS004-32-BLUE"
},
  {
  size: "34",
  color: "Blue",
  stock: 19,
  sku: "JEANS004-34-BLUE"
},
],
  tags: [
  "jeans",
  "weekend",
  "sky blue",
  "blue",
  "rigid denim",
  "wide leg",
  "women",
],
  specifications: {
  Material: "Rigid Denim",
  Occasion: "Weekend",
  Style: "Wide Leg",
  Gender: "Women",
  AvailableColors: "Sky Blue, Blue",
  AvailableSizes: "26, 28, 30, 32, 34",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jeans-005",
  name: "Charcoal Tapered Comfort Jeans",
  description: "Charcoal Tapered Comfort Jeans is a tapered stretch denim piece designed for daily occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1999,
  originalPrice: 2799,
  category: "jeans",
  image: "/products/prod-jeans-005.webp",
  images: [
  "/products/prod-jeans-005.webp",
],
  rating: 4.3,
  reviewCount: 127,
  variants: [
  {
  size: "28",
  color: "Charcoal",
  stock: 16,
  sku: "JEANS005-28-CHARC"
},
  {
  size: "30",
  color: "Charcoal",
  stock: 21,
  sku: "JEANS005-30-CHARC"
},
  {
  size: "32",
  color: "Charcoal",
  stock: 7,
  sku: "JEANS005-32-CHARC"
},
  {
  size: "34",
  color: "Charcoal",
  stock: 12,
  sku: "JEANS005-34-CHARC"
},
  {
  size: "36",
  color: "Charcoal",
  stock: 17,
  sku: "JEANS005-36-CHARC"
},
  {
  size: "28",
  color: "Black",
  stock: 23,
  sku: "JEANS005-28-BLACK"
},
  {
  size: "30",
  color: "Black",
  stock: 9,
  sku: "JEANS005-30-BLACK"
},
  {
  size: "32",
  color: "Black",
  stock: 14,
  sku: "JEANS005-32-BLACK"
},
  {
  size: "34",
  color: "Black",
  stock: 19,
  sku: "JEANS005-34-BLACK"
},
  {
  size: "36",
  color: "Black",
  stock: 5,
  sku: "JEANS005-36-BLACK"
},
],
  tags: [
  "jeans",
  "daily",
  "charcoal",
  "black",
  "stretch denim",
  "tapered",
  "men",
],
  specifications: {
  Material: "Stretch Denim",
  Occasion: "Daily",
  Style: "Tapered",
  Gender: "Men",
  AvailableColors: "Charcoal, Black",
  AvailableSizes: "28, 30, 32, 34, 36",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jeans-006",
  name: "White Cropped Flare Jeans",
  description: "White Cropped Flare Jeans is a cropped flare cotton denim piece designed for brunch occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2599,
  originalPrice: 3499,
  category: "jeans",
  image: "/products/prod-jeans-006.webp",
  images: [
  "/products/prod-jeans-006.webp",
],
  rating: 4.5,
  reviewCount: 91,
  variants: [
  {
  size: "26",
  color: "White",
  stock: 11,
  sku: "JEANS006-26-WHITE"
},
  {
  size: "28",
  color: "White",
  stock: 16,
  sku: "JEANS006-28-WHITE"
},
  {
  size: "30",
  color: "White",
  stock: 21,
  sku: "JEANS006-30-WHITE"
},
  {
  size: "32",
  color: "White",
  stock: 7,
  sku: "JEANS006-32-WHITE"
},
  {
  size: "26",
  color: "Cream",
  stock: 18,
  sku: "JEANS006-26-CREAM"
},
  {
  size: "28",
  color: "Cream",
  stock: 23,
  sku: "JEANS006-28-CREAM"
},
  {
  size: "30",
  color: "Cream",
  stock: 9,
  sku: "JEANS006-30-CREAM"
},
  {
  size: "32",
  color: "Cream",
  stock: 14,
  sku: "JEANS006-32-CREAM"
},
],
  tags: [
  "jeans",
  "brunch",
  "white",
  "cream",
  "cotton denim",
  "cropped flare",
  "women",
],
  specifications: {
  Material: "Cotton Denim",
  Occasion: "Brunch",
  Style: "Cropped Flare",
  Gender: "Women",
  AvailableColors: "White, Cream",
  AvailableSizes: "26, 28, 30, 32",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-trouser-001",
  name: "Beige Pleated Wide Leg Trousers",
  description: "Beige Pleated Wide Leg Trousers is a wide leg linen blend piece designed for office occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2299,
  originalPrice: 3199,
  category: "trousers",
  image: "/products/prod-trouser-001.webp",
  images: [
  "/products/prod-trouser-001.webp",
],
  rating: 4.5,
  reviewCount: 122,
  variants: [
  {
  size: "XS",
  color: "Beige",
  stock: 17,
  sku: "TROUSER001-XS-BEIGE"
},
  {
  size: "S",
  color: "Beige",
  stock: 22,
  sku: "TROUSER001-S-BEIGE"
},
  {
  size: "M",
  color: "Beige",
  stock: 8,
  sku: "TROUSER001-M-BEIGE"
},
  {
  size: "L",
  color: "Beige",
  stock: 13,
  sku: "TROUSER001-L-BEIGE"
},
  {
  size: "XL",
  color: "Beige",
  stock: 18,
  sku: "TROUSER001-XL-BEIGE"
},
  {
  size: "XS",
  color: "Cream",
  stock: 5,
  sku: "TROUSER001-XS-CREAM"
},
  {
  size: "S",
  color: "Cream",
  stock: 10,
  sku: "TROUSER001-S-CREAM"
},
  {
  size: "M",
  color: "Cream",
  stock: 15,
  sku: "TROUSER001-M-CREAM"
},
  {
  size: "L",
  color: "Cream",
  stock: 20,
  sku: "TROUSER001-L-CREAM"
},
  {
  size: "XL",
  color: "Cream",
  stock: 6,
  sku: "TROUSER001-XL-CREAM"
},
],
  tags: [
  "trousers",
  "office",
  "beige",
  "cream",
  "linen blend",
  "wide leg",
  "women",
],
  specifications: {
  Material: "Linen Blend",
  Occasion: "Office",
  Style: "Wide Leg",
  Gender: "Women",
  AvailableColors: "Beige, Cream",
  AvailableSizes: "XS, S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-trouser-002",
  name: "Charcoal Formal Slim Trousers",
  description: "Charcoal Formal Slim Trousers is a slim fit poly-viscose piece designed for formal occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 1999,
  originalPrice: 2799,
  category: "trousers",
  image: "/products/prod-trouser-002.webp",
  images: [
  "/products/prod-trouser-002.webp",
],
  rating: 4.6,
  reviewCount: 189,
  variants: [
  {
  size: "30",
  color: "Charcoal",
  stock: 15,
  sku: "TROUSER002-30-CHARC"
},
  {
  size: "32",
  color: "Charcoal",
  stock: 20,
  sku: "TROUSER002-32-CHARC"
},
  {
  size: "34",
  color: "Charcoal",
  stock: 6,
  sku: "TROUSER002-34-CHARC"
},
  {
  size: "36",
  color: "Charcoal",
  stock: 11,
  sku: "TROUSER002-36-CHARC"
},
  {
  size: "30",
  color: "Black",
  stock: 22,
  sku: "TROUSER002-30-BLACK"
},
  {
  size: "32",
  color: "Black",
  stock: 8,
  sku: "TROUSER002-32-BLACK"
},
  {
  size: "34",
  color: "Black",
  stock: 13,
  sku: "TROUSER002-34-BLACK"
},
  {
  size: "36",
  color: "Black",
  stock: 18,
  sku: "TROUSER002-36-BLACK"
},
],
  tags: [
  "trousers",
  "formal",
  "charcoal",
  "black",
  "poly-viscose",
  "slim fit",
  "men",
],
  specifications: {
  Material: "Poly-Viscose",
  Occasion: "Formal",
  Style: "Slim Fit",
  Gender: "Men",
  AvailableColors: "Charcoal, Black",
  AvailableSizes: "30, 32, 34, 36",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-trouser-003",
  name: "Olive Cargo Utility Trousers",
  description: "Olive Cargo Utility Trousers is a cargo cotton twill piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for unisex wardrobes.",
  price: 2499,
  originalPrice: 3399,
  category: "trousers",
  image: "/products/prod-trouser-003.webp",
  images: [
  "/products/prod-trouser-003.webp",
],
  rating: 4.4,
  reviewCount: 151,
  variants: [
  {
  size: "S",
  color: "Olive",
  stock: 14,
  sku: "TROUSER003-S-OLIVE"
},
  {
  size: "M",
  color: "Olive",
  stock: 19,
  sku: "TROUSER003-M-OLIVE"
},
  {
  size: "L",
  color: "Olive",
  stock: 5,
  sku: "TROUSER003-L-OLIVE"
},
  {
  size: "XL",
  color: "Olive",
  stock: 10,
  sku: "TROUSER003-XL-OLIVE"
},
  {
  size: "S",
  color: "Green",
  stock: 21,
  sku: "TROUSER003-S-GREEN"
},
  {
  size: "M",
  color: "Green",
  stock: 7,
  sku: "TROUSER003-M-GREEN"
},
  {
  size: "L",
  color: "Green",
  stock: 12,
  sku: "TROUSER003-L-GREEN"
},
  {
  size: "XL",
  color: "Green",
  stock: 17,
  sku: "TROUSER003-XL-GREEN"
},
],
  tags: [
  "trousers",
  "casual",
  "olive",
  "green",
  "cotton twill",
  "cargo",
  "unisex",
],
  specifications: {
  Material: "Cotton Twill",
  Occasion: "Casual",
  Style: "Cargo",
  Gender: "Unisex",
  AvailableColors: "Olive, Green",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-trouser-004",
  name: "Navy Cigarette Ankle Trousers",
  description: "Navy Cigarette Ankle Trousers is a cigarette stretch crepe piece designed for office occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1799,
  originalPrice: 2499,
  category: "trousers",
  image: "/products/prod-trouser-004.webp",
  images: [
  "/products/prod-trouser-004.webp",
],
  rating: 4.3,
  reviewCount: 106,
  variants: [
  {
  size: "XS",
  color: "Navy",
  stock: 15,
  sku: "TROUSER004-XS-NAVY"
},
  {
  size: "S",
  color: "Navy",
  stock: 20,
  sku: "TROUSER004-S-NAVY"
},
  {
  size: "M",
  color: "Navy",
  stock: 6,
  sku: "TROUSER004-M-NAVY"
},
  {
  size: "L",
  color: "Navy",
  stock: 11,
  sku: "TROUSER004-L-NAVY"
},
  {
  size: "XL",
  color: "Navy",
  stock: 16,
  sku: "TROUSER004-XL-NAVY"
},
  {
  size: "XS",
  color: "Blue",
  stock: 22,
  sku: "TROUSER004-XS-BLUE"
},
  {
  size: "S",
  color: "Blue",
  stock: 8,
  sku: "TROUSER004-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 13,
  sku: "TROUSER004-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 18,
  sku: "TROUSER004-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 23,
  sku: "TROUSER004-XL-BLUE"
},
],
  tags: [
  "trousers",
  "office",
  "navy",
  "blue",
  "stretch crepe",
  "cigarette",
  "women",
],
  specifications: {
  Material: "Stretch Crepe",
  Occasion: "Office",
  Style: "Cigarette",
  Gender: "Women",
  AvailableColors: "Navy, Blue",
  AvailableSizes: "XS, S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-trouser-005",
  name: "Brown Corduroy Relaxed Trousers",
  description: "Brown Corduroy Relaxed Trousers is a relaxed fit corduroy piece designed for winter occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 2999,
  originalPrice: 3999,
  category: "trousers",
  image: "/products/prod-trouser-005.webp",
  images: [
  "/products/prod-trouser-005.webp",
],
  rating: 4.5,
  reviewCount: 64,
  variants: [
  {
  size: "30",
  color: "Brown",
  stock: 17,
  sku: "TROUSER005-30-BROWN"
},
  {
  size: "32",
  color: "Brown",
  stock: 22,
  sku: "TROUSER005-32-BROWN"
},
  {
  size: "34",
  color: "Brown",
  stock: 8,
  sku: "TROUSER005-34-BROWN"
},
  {
  size: "36",
  color: "Brown",
  stock: 13,
  sku: "TROUSER005-36-BROWN"
},
  {
  size: "30",
  color: "Beige",
  stock: 5,
  sku: "TROUSER005-30-BEIGE"
},
  {
  size: "32",
  color: "Beige",
  stock: 10,
  sku: "TROUSER005-32-BEIGE"
},
  {
  size: "34",
  color: "Beige",
  stock: 15,
  sku: "TROUSER005-34-BEIGE"
},
  {
  size: "36",
  color: "Beige",
  stock: 20,
  sku: "TROUSER005-36-BEIGE"
},
],
  tags: [
  "trousers",
  "winter",
  "brown",
  "beige",
  "corduroy",
  "relaxed fit",
  "men",
],
  specifications: {
  Material: "Corduroy",
  Occasion: "Winter",
  Style: "Relaxed Fit",
  Gender: "Men",
  AvailableColors: "Brown, Beige",
  AvailableSizes: "30, 32, 34, 36",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jacket-002",
  name: "Black Vegan Leather Biker Jacket",
  description: "Black Vegan Leather Biker Jacket is a biker vegan leather piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 4999,
  originalPrice: 6499,
  category: "jackets",
  image: "/products/prod-jacket-002.webp",
  images: [
  "/products/prod-jacket-002.webp",
],
  rating: 4.6,
  reviewCount: 157,
  variants: [
  {
  size: "S",
  color: "Black",
  stock: 18,
  sku: "JACKET002-S-BLACK"
},
  {
  size: "M",
  color: "Black",
  stock: 23,
  sku: "JACKET002-M-BLACK"
},
  {
  size: "L",
  color: "Black",
  stock: 9,
  sku: "JACKET002-L-BLACK"
},
  {
  size: "XL",
  color: "Black",
  stock: 14,
  sku: "JACKET002-XL-BLACK"
},
],
  tags: [
  "jackets",
  "party",
  "black",
  "vegan leather",
  "biker",
  "women",
],
  specifications: {
  Material: "Vegan Leather",
  Occasion: "Party",
  Style: "Biker",
  Gender: "Women",
  AvailableColors: "Black",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jacket-003",
  name: "Camel Wool Blend Overcoat",
  description: "Camel Wool Blend Overcoat is a longline coat wool blend piece designed for winter occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 6499,
  originalPrice: 7999,
  category: "jackets",
  image: "/products/prod-jacket-003.webp",
  images: [
  "/products/prod-jacket-003.webp",
],
  rating: 4.7,
  reviewCount: 83,
  variants: [
  {
  size: "S",
  color: "Camel",
  stock: 11,
  sku: "JACKET003-S-CAMEL"
},
  {
  size: "M",
  color: "Camel",
  stock: 16,
  sku: "JACKET003-M-CAMEL"
},
  {
  size: "L",
  color: "Camel",
  stock: 21,
  sku: "JACKET003-L-CAMEL"
},
  {
  size: "XL",
  color: "Camel",
  stock: 7,
  sku: "JACKET003-XL-CAMEL"
},
  {
  size: "S",
  color: "Brown",
  stock: 18,
  sku: "JACKET003-S-BROWN"
},
  {
  size: "M",
  color: "Brown",
  stock: 23,
  sku: "JACKET003-M-BROWN"
},
  {
  size: "L",
  color: "Brown",
  stock: 9,
  sku: "JACKET003-L-BROWN"
},
  {
  size: "XL",
  color: "Brown",
  stock: 14,
  sku: "JACKET003-XL-BROWN"
},
],
  tags: [
  "jackets",
  "winter",
  "camel",
  "brown",
  "wool blend",
  "longline coat",
  "women",
],
  specifications: {
  Material: "Wool Blend",
  Occasion: "Winter",
  Style: "Longline Coat",
  Gender: "Women",
  AvailableColors: "Camel, Brown",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jacket-004",
  name: "Olive Quilted Puffer Jacket",
  description: "Olive Quilted Puffer Jacket is a puffer recycled polyester piece designed for winter occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for unisex wardrobes.",
  price: 3799,
  originalPrice: 4999,
  category: "jackets",
  image: "/products/prod-jacket-004.webp",
  images: [
  "/products/prod-jacket-004.webp",
],
  rating: 4.5,
  reviewCount: 134,
  variants: [
  {
  size: "S",
  color: "Olive",
  stock: 13,
  sku: "JACKET004-S-OLIVE"
},
  {
  size: "M",
  color: "Olive",
  stock: 18,
  sku: "JACKET004-M-OLIVE"
},
  {
  size: "L",
  color: "Olive",
  stock: 23,
  sku: "JACKET004-L-OLIVE"
},
  {
  size: "XL",
  color: "Olive",
  stock: 9,
  sku: "JACKET004-XL-OLIVE"
},
  {
  size: "XXL",
  color: "Olive",
  stock: 14,
  sku: "JACKET004-XXL-OLIVE"
},
  {
  size: "S",
  color: "Green",
  stock: 20,
  sku: "JACKET004-S-GREEN"
},
  {
  size: "M",
  color: "Green",
  stock: 6,
  sku: "JACKET004-M-GREEN"
},
  {
  size: "L",
  color: "Green",
  stock: 11,
  sku: "JACKET004-L-GREEN"
},
  {
  size: "XL",
  color: "Green",
  stock: 16,
  sku: "JACKET004-XL-GREEN"
},
  {
  size: "XXL",
  color: "Green",
  stock: 21,
  sku: "JACKET004-XXL-GREEN"
},
],
  tags: [
  "jackets",
  "winter",
  "olive",
  "green",
  "recycled polyester",
  "puffer",
  "unisex",
],
  specifications: {
  Material: "Recycled Polyester",
  Occasion: "Winter",
  Style: "Puffer",
  Gender: "Unisex",
  AvailableColors: "Olive, Green",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jacket-005",
  name: "Indigo Denim Trucker Jacket",
  description: "Indigo Denim Trucker Jacket is a trucker cotton denim piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 2999,
  originalPrice: 3999,
  category: "jackets",
  image: "/products/prod-jacket-005.webp",
  images: [
  "/products/prod-jacket-005.webp",
],
  rating: 4.4,
  reviewCount: 176,
  variants: [
  {
  size: "S",
  color: "Indigo",
  stock: 13,
  sku: "JACKET005-S-INDIG"
},
  {
  size: "M",
  color: "Indigo",
  stock: 18,
  sku: "JACKET005-M-INDIG"
},
  {
  size: "L",
  color: "Indigo",
  stock: 23,
  sku: "JACKET005-L-INDIG"
},
  {
  size: "XL",
  color: "Indigo",
  stock: 9,
  sku: "JACKET005-XL-INDIG"
},
  {
  size: "XXL",
  color: "Indigo",
  stock: 14,
  sku: "JACKET005-XXL-INDIG"
},
  {
  size: "S",
  color: "Blue",
  stock: 20,
  sku: "JACKET005-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 6,
  sku: "JACKET005-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 11,
  sku: "JACKET005-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 16,
  sku: "JACKET005-XL-BLUE"
},
  {
  size: "XXL",
  color: "Blue",
  stock: 21,
  sku: "JACKET005-XXL-BLUE"
},
],
  tags: [
  "jackets",
  "casual",
  "indigo",
  "blue",
  "cotton denim",
  "trucker",
  "men",
],
  specifications: {
  Material: "Cotton Denim",
  Occasion: "Casual",
  Style: "Trucker",
  Gender: "Men",
  AvailableColors: "Indigo, Blue",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-jacket-006",
  name: "Ivory Tweed Cropped Jacket",
  description: "Ivory Tweed Cropped Jacket is a cropped tweed piece designed for office occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 4599,
  originalPrice: 5999,
  category: "jackets",
  image: "/products/prod-jacket-006.webp",
  images: [
  "/products/prod-jacket-006.webp",
],
  rating: 4.6,
  reviewCount: 71,
  variants: [
  {
  size: "XS",
  color: "Ivory",
  stock: 12,
  sku: "JACKET006-XS-IVORY"
},
  {
  size: "S",
  color: "Ivory",
  stock: 17,
  sku: "JACKET006-S-IVORY"
},
  {
  size: "M",
  color: "Ivory",
  stock: 22,
  sku: "JACKET006-M-IVORY"
},
  {
  size: "L",
  color: "Ivory",
  stock: 8,
  sku: "JACKET006-L-IVORY"
},
  {
  size: "XS",
  color: "Cream",
  stock: 19,
  sku: "JACKET006-XS-CREAM"
},
  {
  size: "S",
  color: "Cream",
  stock: 5,
  sku: "JACKET006-S-CREAM"
},
  {
  size: "M",
  color: "Cream",
  stock: 10,
  sku: "JACKET006-M-CREAM"
},
  {
  size: "L",
  color: "Cream",
  stock: 15,
  sku: "JACKET006-L-CREAM"
},
],
  tags: [
  "jackets",
  "office",
  "ivory",
  "cream",
  "tweed",
  "cropped",
  "women",
],
  specifications: {
  Material: "Tweed",
  Occasion: "Office",
  Style: "Cropped",
  Gender: "Women",
  AvailableColors: "Ivory, Cream",
  AvailableSizes: "XS, S, M, L",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-shoe-002",
  name: "White Leather Court Sneakers",
  description: "White Leather Court Sneakers is a low top leather piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for unisex wardrobes.",
  price: 2499,
  originalPrice: 3499,
  category: "shoes",
  image: "/products/prod-shoe-002.webp",
  images: [
  "/products/prod-shoe-002.webp",
],
  rating: 4.6,
  reviewCount: 239,
  variants: [
  {
  size: "5",
  color: "White",
  stock: 14,
  sku: "SHOE002-5-WHITE"
},
  {
  size: "6",
  color: "White",
  stock: 19,
  sku: "SHOE002-6-WHITE"
},
  {
  size: "7",
  color: "White",
  stock: 5,
  sku: "SHOE002-7-WHITE"
},
  {
  size: "8",
  color: "White",
  stock: 10,
  sku: "SHOE002-8-WHITE"
},
  {
  size: "9",
  color: "White",
  stock: 15,
  sku: "SHOE002-9-WHITE"
},
  {
  size: "10",
  color: "White",
  stock: 20,
  sku: "SHOE002-10-WHITE"
},
  {
  size: "5",
  color: "Cream",
  stock: 21,
  sku: "SHOE002-5-CREAM"
},
  {
  size: "6",
  color: "Cream",
  stock: 7,
  sku: "SHOE002-6-CREAM"
},
  {
  size: "7",
  color: "Cream",
  stock: 12,
  sku: "SHOE002-7-CREAM"
},
  {
  size: "8",
  color: "Cream",
  stock: 17,
  sku: "SHOE002-8-CREAM"
},
  {
  size: "9",
  color: "Cream",
  stock: 22,
  sku: "SHOE002-9-CREAM"
},
  {
  size: "10",
  color: "Cream",
  stock: 8,
  sku: "SHOE002-10-CREAM"
},
],
  tags: [
  "shoes",
  "casual",
  "white",
  "cream",
  "leather",
  "low top",
  "unisex",
],
  specifications: {
  Material: "Leather",
  Occasion: "Casual",
  Style: "Low Top",
  Gender: "Unisex",
  AvailableColors: "White, Cream",
  AvailableSizes: "5, 6, 7, 8, 9, 10",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-shoe-003",
  name: "Black Suede Block Heel Pumps",
  description: "Black Suede Block Heel Pumps is a block heel suede piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 3299,
  originalPrice: 4499,
  category: "shoes",
  image: "/products/prod-shoe-003.webp",
  images: [
  "/products/prod-shoe-003.webp",
],
  rating: 4.5,
  reviewCount: 117,
  variants: [
  {
  size: "4",
  color: "Black",
  stock: 14,
  sku: "SHOE003-4-BLACK"
},
  {
  size: "5",
  color: "Black",
  stock: 19,
  sku: "SHOE003-5-BLACK"
},
  {
  size: "6",
  color: "Black",
  stock: 5,
  sku: "SHOE003-6-BLACK"
},
  {
  size: "7",
  color: "Black",
  stock: 10,
  sku: "SHOE003-7-BLACK"
},
  {
  size: "8",
  color: "Black",
  stock: 15,
  sku: "SHOE003-8-BLACK"
},
],
  tags: [
  "shoes",
  "party",
  "black",
  "suede",
  "block heel",
  "women",
],
  specifications: {
  Material: "Suede",
  Occasion: "Party",
  Style: "Block Heel",
  Gender: "Women",
  AvailableColors: "Black",
  AvailableSizes: "4, 5, 6, 7, 8",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-shoe-004",
  name: "Tan Leather Oxford Shoes",
  description: "Tan Leather Oxford Shoes is a oxford genuine leather piece designed for formal occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 4999,
  originalPrice: 6499,
  category: "shoes",
  image: "/products/prod-shoe-004.webp",
  images: [
  "/products/prod-shoe-004.webp",
],
  rating: 4.7,
  reviewCount: 92,
  variants: [
  {
  size: "6",
  color: "Tan",
  stock: 10,
  sku: "SHOE004-6-TAN"
},
  {
  size: "7",
  color: "Tan",
  stock: 15,
  sku: "SHOE004-7-TAN"
},
  {
  size: "8",
  color: "Tan",
  stock: 20,
  sku: "SHOE004-8-TAN"
},
  {
  size: "9",
  color: "Tan",
  stock: 6,
  sku: "SHOE004-9-TAN"
},
  {
  size: "10",
  color: "Tan",
  stock: 11,
  sku: "SHOE004-10-TAN"
},
  {
  size: "6",
  color: "Brown",
  stock: 17,
  sku: "SHOE004-6-BROWN"
},
  {
  size: "7",
  color: "Brown",
  stock: 22,
  sku: "SHOE004-7-BROWN"
},
  {
  size: "8",
  color: "Brown",
  stock: 8,
  sku: "SHOE004-8-BROWN"
},
  {
  size: "9",
  color: "Brown",
  stock: 13,
  sku: "SHOE004-9-BROWN"
},
  {
  size: "10",
  color: "Brown",
  stock: 18,
  sku: "SHOE004-10-BROWN"
},
],
  tags: [
  "shoes",
  "formal",
  "tan",
  "brown",
  "genuine leather",
  "oxford",
  "men",
],
  specifications: {
  Material: "Genuine Leather",
  Occasion: "Formal",
  Style: "Oxford",
  Gender: "Men",
  AvailableColors: "Tan, Brown",
  AvailableSizes: "6, 7, 8, 9, 10",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-shoe-005",
  name: "Rose Gold Embellished Juttis",
  description: "Rose Gold Embellished Juttis is a jutti silk brocade piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1899,
  originalPrice: 2699,
  category: "shoes",
  image: "/products/prod-shoe-005.webp",
  images: [
  "/products/prod-shoe-005.webp",
],
  rating: 4.5,
  reviewCount: 145,
  variants: [
  {
  size: "4",
  color: "Rose Gold",
  stock: 14,
  sku: "SHOE005-4-ROSEG"
},
  {
  size: "5",
  color: "Rose Gold",
  stock: 19,
  sku: "SHOE005-5-ROSEG"
},
  {
  size: "6",
  color: "Rose Gold",
  stock: 5,
  sku: "SHOE005-6-ROSEG"
},
  {
  size: "7",
  color: "Rose Gold",
  stock: 10,
  sku: "SHOE005-7-ROSEG"
},
  {
  size: "8",
  color: "Rose Gold",
  stock: 15,
  sku: "SHOE005-8-ROSEG"
},
  {
  size: "4",
  color: "Pink",
  stock: 21,
  sku: "SHOE005-4-PINK"
},
  {
  size: "5",
  color: "Pink",
  stock: 7,
  sku: "SHOE005-5-PINK"
},
  {
  size: "6",
  color: "Pink",
  stock: 12,
  sku: "SHOE005-6-PINK"
},
  {
  size: "7",
  color: "Pink",
  stock: 17,
  sku: "SHOE005-7-PINK"
},
  {
  size: "8",
  color: "Pink",
  stock: 22,
  sku: "SHOE005-8-PINK"
},
],
  tags: [
  "shoes",
  "wedding",
  "rose gold",
  "pink",
  "silk brocade",
  "jutti",
  "women",
],
  specifications: {
  Material: "Silk Brocade",
  Occasion: "Wedding",
  Style: "Jutti",
  Gender: "Women",
  AvailableColors: "Rose Gold, Pink",
  AvailableSizes: "4, 5, 6, 7, 8",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-shoe-006",
  name: "Sky Blue Running Trainers",
  description: "Sky Blue Running Trainers is a running mesh knit piece designed for gym occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for unisex wardrobes.",
  price: 2799,
  originalPrice: 3799,
  category: "shoes",
  image: "/products/prod-shoe-006.webp",
  images: [
  "/products/prod-shoe-006.webp",
],
  rating: 4.4,
  reviewCount: 204,
  variants: [
  {
  size: "5",
  color: "Sky Blue",
  stock: 11,
  sku: "SHOE006-5-SKYBL"
},
  {
  size: "6",
  color: "Sky Blue",
  stock: 16,
  sku: "SHOE006-6-SKYBL"
},
  {
  size: "7",
  color: "Sky Blue",
  stock: 21,
  sku: "SHOE006-7-SKYBL"
},
  {
  size: "8",
  color: "Sky Blue",
  stock: 7,
  sku: "SHOE006-8-SKYBL"
},
  {
  size: "9",
  color: "Sky Blue",
  stock: 12,
  sku: "SHOE006-9-SKYBL"
},
  {
  size: "10",
  color: "Sky Blue",
  stock: 17,
  sku: "SHOE006-10-SKYBL"
},
  {
  size: "5",
  color: "Blue",
  stock: 18,
  sku: "SHOE006-5-BLUE"
},
  {
  size: "6",
  color: "Blue",
  stock: 23,
  sku: "SHOE006-6-BLUE"
},
  {
  size: "7",
  color: "Blue",
  stock: 9,
  sku: "SHOE006-7-BLUE"
},
  {
  size: "8",
  color: "Blue",
  stock: 14,
  sku: "SHOE006-8-BLUE"
},
  {
  size: "9",
  color: "Blue",
  stock: 19,
  sku: "SHOE006-9-BLUE"
},
  {
  size: "10",
  color: "Blue",
  stock: 5,
  sku: "SHOE006-10-BLUE"
},
  {
  size: "5",
  color: "White",
  stock: 6,
  sku: "SHOE006-5-WHITE"
},
  {
  size: "6",
  color: "White",
  stock: 11,
  sku: "SHOE006-6-WHITE"
},
  {
  size: "7",
  color: "White",
  stock: 16,
  sku: "SHOE006-7-WHITE"
},
  {
  size: "8",
  color: "White",
  stock: 21,
  sku: "SHOE006-8-WHITE"
},
  {
  size: "9",
  color: "White",
  stock: 7,
  sku: "SHOE006-9-WHITE"
},
  {
  size: "10",
  color: "White",
  stock: 12,
  sku: "SHOE006-10-WHITE"
},
],
  tags: [
  "shoes",
  "gym",
  "sky blue",
  "blue",
  "white",
  "mesh knit",
  "running",
  "unisex",
],
  specifications: {
  Material: "Mesh Knit",
  Occasion: "Gym",
  Style: "Running",
  Gender: "Unisex",
  AvailableColors: "Sky Blue, Blue, White",
  AvailableSizes: "5, 6, 7, 8, 9, 10",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-handbag-002",
  name: "Black Quilted Chain Shoulder Bag",
  description: "Black Quilted Chain Shoulder Bag is a quilted shoulder vegan leather piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2899,
  originalPrice: 3999,
  category: "handbags",
  image: "/products/prod-handbag-002.webp",
  images: [
  "/products/prod-handbag-002.webp",
],
  rating: 4.5,
  reviewCount: 178,
  variants: [
  {
  size: "Small",
  color: "Black",
  stock: 18,
  sku: "HANDBAG002-SMALL-BLACK"
},
],
  tags: [
  "handbags",
  "party",
  "black",
  "vegan leather",
  "quilted shoulder",
  "women",
],
  specifications: {
  Material: "Vegan Leather",
  Occasion: "Party",
  Style: "Quilted Shoulder",
  Gender: "Women",
  AvailableColors: "Black",
  AvailableSizes: "Small",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-handbag-003",
  name: "Tan Structured Office Tote",
  description: "Tan Structured Office Tote is a structured tote faux leather piece designed for office occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2499,
  originalPrice: 3499,
  category: "handbags",
  image: "/products/prod-handbag-003.webp",
  images: [
  "/products/prod-handbag-003.webp",
],
  rating: 4.4,
  reviewCount: 131,
  variants: [
  {
  size: "Large",
  color: "Tan",
  stock: 12,
  sku: "HANDBAG003-LARGE-TAN"
},
  {
  size: "Large",
  color: "Brown",
  stock: 19,
  sku: "HANDBAG003-LARGE-BROWN"
},
],
  tags: [
  "handbags",
  "office",
  "tan",
  "brown",
  "faux leather",
  "structured tote",
  "women",
],
  specifications: {
  Material: "Faux Leather",
  Occasion: "Office",
  Style: "Structured Tote",
  Gender: "Women",
  AvailableColors: "Tan, Brown",
  AvailableSizes: "Large",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-handbag-004",
  name: "Ivory Beaded Potli Bag",
  description: "Ivory Beaded Potli Bag is a potli silk piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1499,
  originalPrice: 2199,
  category: "handbags",
  image: "/products/prod-handbag-004.webp",
  images: [
  "/products/prod-handbag-004.webp",
],
  rating: 4.6,
  reviewCount: 86,
  variants: [
  {
  size: "One Size",
  color: "Ivory",
  stock: 8,
  sku: "HANDBAG004-ONESIZE-IVORY"
},
  {
  size: "One Size",
  color: "Gold",
  stock: 15,
  sku: "HANDBAG004-ONESIZE-GOLD"
},
],
  tags: [
  "handbags",
  "wedding",
  "ivory",
  "gold",
  "silk",
  "potli",
  "women",
],
  specifications: {
  Material: "Silk",
  Occasion: "Wedding",
  Style: "Potli",
  Gender: "Women",
  AvailableColors: "Ivory, Gold",
  AvailableSizes: "One Size",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-handbag-005",
  name: "Burgundy Suede Sling Bag",
  description: "Burgundy Suede Sling Bag is a sling suede piece designed for date night occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1999,
  originalPrice: 2999,
  category: "handbags",
  image: "/products/prod-handbag-005.webp",
  images: [
  "/products/prod-handbag-005.webp",
],
  rating: 4.3,
  reviewCount: 104,
  variants: [
  {
  size: "Small",
  color: "Burgundy",
  stock: 10,
  sku: "HANDBAG005-SMALL-BURGU"
},
  {
  size: "Small",
  color: "Wine",
  stock: 17,
  sku: "HANDBAG005-SMALL-WINE"
},
],
  tags: [
  "handbags",
  "date night",
  "burgundy",
  "wine",
  "suede",
  "sling",
  "women",
],
  specifications: {
  Material: "Suede",
  Occasion: "Date Night",
  Style: "Sling",
  Gender: "Women",
  AvailableColors: "Burgundy, Wine",
  AvailableSizes: "Small",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-handbag-006",
  name: "Olive Canvas Weekender Bag",
  description: "Olive Canvas Weekender Bag is a weekender canvas piece designed for travel occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for unisex wardrobes.",
  price: 3299,
  originalPrice: 4599,
  category: "handbags",
  image: "/products/prod-handbag-006.webp",
  images: [
  "/products/prod-handbag-006.webp",
],
  rating: 4.5,
  reviewCount: 63,
  variants: [
  {
  size: "Large",
  color: "Olive",
  stock: 12,
  sku: "HANDBAG006-LARGE-OLIVE"
},
  {
  size: "Large",
  color: "Green",
  stock: 19,
  sku: "HANDBAG006-LARGE-GREEN"
},
],
  tags: [
  "handbags",
  "travel",
  "olive",
  "green",
  "canvas",
  "weekender",
  "unisex",
],
  specifications: {
  Material: "Canvas",
  Occasion: "Travel",
  Style: "Weekender",
  Gender: "Unisex",
  AvailableColors: "Olive, Green",
  AvailableSizes: "Large",
  Care: "Wipe clean with a soft cloth"
}
},
  {
  id: "prod-earrings-002",
  name: "Pearl Drop Earrings",
  description: "Pearl Drop Earrings is a drop freshwater pearl piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 699,
  originalPrice: 999,
  category: "earrings",
  image: "/products/prod-earrings-002.webp",
  images: [
  "/products/prod-earrings-002.webp",
],
  rating: 4.7,
  reviewCount: 254,
  variants: [
  {
  size: "One Size",
  color: "Pearl White",
  stock: 5,
  sku: "EARRINGS002-ONESIZE-PEARL"
},
  {
  size: "One Size",
  color: "Gold",
  stock: 12,
  sku: "EARRINGS002-ONESIZE-GOLD"
},
],
  tags: [
  "earrings",
  "wedding",
  "pearl white",
  "gold",
  "freshwater pearl",
  "drop",
  "women",
],
  specifications: {
  Material: "Freshwater Pearl",
  Occasion: "Wedding",
  Style: "Drop",
  Gender: "Women",
  AvailableColors: "Pearl White, Gold",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-earrings-003",
  name: "Ruby Stone Chandbali Earrings",
  description: "Ruby Stone Chandbali Earrings is a chandbali gold plated brass piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1299,
  originalPrice: 1799,
  category: "earrings",
  image: "/products/prod-earrings-003.webp",
  images: [
  "/products/prod-earrings-003.webp",
],
  rating: 4.6,
  reviewCount: 163,
  variants: [
  {
  size: "One Size",
  color: "Red",
  stock: 15,
  sku: "EARRINGS003-ONESIZE-RED"
},
  {
  size: "One Size",
  color: "Gold",
  stock: 22,
  sku: "EARRINGS003-ONESIZE-GOLD"
},
],
  tags: [
  "earrings",
  "wedding",
  "red",
  "gold",
  "gold plated brass",
  "chandbali",
  "women",
],
  specifications: {
  Material: "Gold Plated Brass",
  Occasion: "Wedding",
  Style: "Chandbali",
  Gender: "Women",
  AvailableColors: "Red, Gold",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-earrings-004",
  name: "Silver Crystal Hoop Earrings",
  description: "Silver Crystal Hoop Earrings is a hoop sterling silver plated piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 899,
  originalPrice: 1299,
  category: "earrings",
  image: "/products/prod-earrings-004.webp",
  images: [
  "/products/prod-earrings-004.webp",
],
  rating: 4.5,
  reviewCount: 187,
  variants: [
  {
  size: "One Size",
  color: "Silver",
  stock: 14,
  sku: "EARRINGS004-ONESIZE-SILVE"
},
],
  tags: [
  "earrings",
  "party",
  "silver",
  "sterling silver plated",
  "hoop",
  "women",
],
  specifications: {
  Material: "Sterling Silver Plated",
  Occasion: "Party",
  Style: "Hoop",
  Gender: "Women",
  AvailableColors: "Silver",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-earrings-005",
  name: "Emerald Kundan Jhumka Earrings",
  description: "Emerald Kundan Jhumka Earrings is a jhumka kundan stonework piece designed for festive occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1499,
  originalPrice: 2099,
  category: "earrings",
  image: "/products/prod-earrings-005.webp",
  images: [
  "/products/prod-earrings-005.webp",
],
  rating: 4.7,
  reviewCount: 119,
  variants: [
  {
  size: "One Size",
  color: "Emerald",
  stock: 16,
  sku: "EARRINGS005-ONESIZE-EMERA"
},
  {
  size: "One Size",
  color: "Gold",
  stock: 23,
  sku: "EARRINGS005-ONESIZE-GOLD"
},
],
  tags: [
  "earrings",
  "festive",
  "emerald",
  "gold",
  "kundan stonework",
  "jhumka",
  "women",
],
  specifications: {
  Material: "Kundan Stonework",
  Occasion: "Festive",
  Style: "Jhumka",
  Gender: "Women",
  AvailableColors: "Emerald, Gold",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-earrings-006",
  name: "Blush Enamel Stud Earrings",
  description: "Blush Enamel Stud Earrings is a stud enamel brass piece designed for casual occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 499,
  originalPrice: 749,
  category: "earrings",
  image: "/products/prod-earrings-006.webp",
  images: [
  "/products/prod-earrings-006.webp",
],
  rating: 4.3,
  reviewCount: 141,
  variants: [
  {
  size: "One Size",
  color: "Blush",
  stock: 12,
  sku: "EARRINGS006-ONESIZE-BLUSH"
},
  {
  size: "One Size",
  color: "Pink",
  stock: 19,
  sku: "EARRINGS006-ONESIZE-PINK"
},
],
  tags: [
  "earrings",
  "casual",
  "blush",
  "pink",
  "enamel brass",
  "stud",
  "women",
],
  specifications: {
  Material: "Enamel Brass",
  Occasion: "Casual",
  Style: "Stud",
  Gender: "Women",
  AvailableColors: "Blush, Pink",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-necklace-002",
  name: "Emerald Kundan Choker Necklace",
  description: "Emerald Kundan Choker Necklace is a choker kundan stonework piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 3299,
  originalPrice: 4499,
  category: "necklaces",
  image: "/products/prod-necklace-002.webp",
  images: [
  "/products/prod-necklace-002.webp",
],
  rating: 4.7,
  reviewCount: 97,
  variants: [
  {
  size: "Adjustable",
  color: "Emerald",
  stock: 16,
  sku: "NECKLACE002-ADJUSTABLE-EMERA"
},
  {
  size: "Adjustable",
  color: "Gold",
  stock: 23,
  sku: "NECKLACE002-ADJUSTABLE-GOLD"
},
],
  tags: [
  "necklaces",
  "wedding",
  "emerald",
  "gold",
  "kundan stonework",
  "choker",
  "women",
],
  specifications: {
  Material: "Kundan Stonework",
  Occasion: "Wedding",
  Style: "Choker",
  Gender: "Women",
  AvailableColors: "Emerald, Gold",
  AvailableSizes: "Adjustable",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-necklace-003",
  name: "Minimal Gold Bar Necklace",
  description: "Minimal Gold Bar Necklace is a minimal gold plated steel piece designed for daily occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 999,
  originalPrice: 1499,
  category: "necklaces",
  image: "/products/prod-necklace-003.webp",
  images: [
  "/products/prod-necklace-003.webp",
],
  rating: 4.5,
  reviewCount: 212,
  variants: [
  {
  size: "Adjustable",
  color: "Gold",
  stock: 11,
  sku: "NECKLACE003-ADJUSTABLE-GOLD"
},
],
  tags: [
  "necklaces",
  "daily",
  "gold",
  "gold plated steel",
  "minimal",
  "women",
],
  specifications: {
  Material: "Gold Plated Steel",
  Occasion: "Daily",
  Style: "Minimal",
  Gender: "Women",
  AvailableColors: "Gold",
  AvailableSizes: "Adjustable",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-necklace-004",
  name: "Ruby Temple Pendant Necklace",
  description: "Ruby Temple Pendant Necklace is a temple antique gold plated piece designed for festive occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2499,
  originalPrice: 3499,
  category: "necklaces",
  image: "/products/prod-necklace-004.webp",
  images: [
  "/products/prod-necklace-004.webp",
],
  rating: 4.6,
  reviewCount: 88,
  variants: [
  {
  size: "Adjustable",
  color: "Red",
  stock: 14,
  sku: "NECKLACE004-ADJUSTABLE-RED"
},
  {
  size: "Adjustable",
  color: "Gold",
  stock: 21,
  sku: "NECKLACE004-ADJUSTABLE-GOLD"
},
],
  tags: [
  "necklaces",
  "festive",
  "red",
  "gold",
  "antique gold plated",
  "temple",
  "women",
],
  specifications: {
  Material: "Antique Gold Plated",
  Occasion: "Festive",
  Style: "Temple",
  Gender: "Women",
  AvailableColors: "Red, Gold",
  AvailableSizes: "Adjustable",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-necklace-005",
  name: "Silver Layered Moonstone Necklace",
  description: "Silver Layered Moonstone Necklace is a layered silver plated alloy piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1599,
  originalPrice: 2299,
  category: "necklaces",
  image: "/products/prod-necklace-005.webp",
  images: [
  "/products/prod-necklace-005.webp",
],
  rating: 4.4,
  reviewCount: 103,
  variants: [
  {
  size: "Adjustable",
  color: "Silver",
  stock: 19,
  sku: "NECKLACE005-ADJUSTABLE-SILVE"
},
  {
  size: "Adjustable",
  color: "Blue",
  stock: 7,
  sku: "NECKLACE005-ADJUSTABLE-BLUE"
},
],
  tags: [
  "necklaces",
  "party",
  "silver",
  "blue",
  "silver plated alloy",
  "layered",
  "women",
],
  specifications: {
  Material: "Silver Plated Alloy",
  Occasion: "Party",
  Style: "Layered",
  Gender: "Women",
  AvailableColors: "Silver, Blue",
  AvailableSizes: "Adjustable",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-necklace-006",
  name: "Ivory Pearl Bridal Choker",
  description: "Ivory Pearl Bridal Choker is a bridal choker freshwater pearl piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 2199,
  originalPrice: 2999,
  category: "necklaces",
  image: "/products/prod-necklace-006.webp",
  images: [
  "/products/prod-necklace-006.webp",
],
  rating: 4.7,
  reviewCount: 136,
  variants: [
  {
  size: "Adjustable",
  color: "Ivory",
  stock: 11,
  sku: "NECKLACE006-ADJUSTABLE-IVORY"
},
  {
  size: "Adjustable",
  color: "Pearl White",
  stock: 18,
  sku: "NECKLACE006-ADJUSTABLE-PEARL"
},
],
  tags: [
  "necklaces",
  "wedding",
  "ivory",
  "pearl white",
  "freshwater pearl",
  "bridal choker",
  "women",
],
  specifications: {
  Material: "Freshwater Pearl",
  Occasion: "Wedding",
  Style: "Bridal Choker",
  Gender: "Women",
  AvailableColors: "Ivory, Pearl White",
  AvailableSizes: "Adjustable",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-accessory-001",
  name: "Gold Crystal Bridal Hair Vine",
  description: "Gold Crystal Bridal Hair Vine is a hair vine crystal alloy piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1199,
  originalPrice: 1699,
  category: "wedding-accessories",
  image: "/products/prod-wedding-accessory-001.webp",
  images: [
  "/products/prod-wedding-accessory-001.webp",
],
  rating: 4.5,
  reviewCount: 109,
  variants: [
  {
  size: "One Size",
  color: "Gold",
  stock: 15,
  sku: "WEDDINGACCESSORY001-ONESIZE-GOLD"
},
],
  tags: [
  "wedding-accessories",
  "wedding",
  "gold",
  "crystal alloy",
  "hair vine",
  "women",
],
  specifications: {
  Material: "Crystal Alloy",
  Occasion: "Wedding",
  Style: "Hair Vine",
  Gender: "Women",
  AvailableColors: "Gold",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-accessory-002",
  name: "Ivory Embroidered Bridal Clutch",
  description: "Ivory Embroidered Bridal Clutch is a clutch silk embroidery piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1999,
  originalPrice: 2899,
  category: "wedding-accessories",
  image: "/products/prod-wedding-accessory-002.webp",
  images: [
  "/products/prod-wedding-accessory-002.webp",
],
  rating: 4.6,
  reviewCount: 74,
  variants: [
  {
  size: "One Size",
  color: "Ivory",
  stock: 17,
  sku: "WEDDINGACCESSORY002-ONESIZE-IVORY"
},
  {
  size: "One Size",
  color: "Cream",
  stock: 5,
  sku: "WEDDINGACCESSORY002-ONESIZE-CREAM"
},
],
  tags: [
  "wedding-accessories",
  "wedding",
  "ivory",
  "cream",
  "silk embroidery",
  "clutch",
  "women",
],
  specifications: {
  Material: "Silk Embroidery",
  Occasion: "Wedding",
  Style: "Clutch",
  Gender: "Women",
  AvailableColors: "Ivory, Cream",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-accessory-003",
  name: "Rose Gold Floral Maang Tikka",
  description: "Rose Gold Floral Maang Tikka is a maang tikka gold plated brass piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 799,
  originalPrice: 1199,
  category: "wedding-accessories",
  image: "/products/prod-wedding-accessory-003.webp",
  images: [
  "/products/prod-wedding-accessory-003.webp",
],
  rating: 4.4,
  reviewCount: 151,
  variants: [
  {
  size: "One Size",
  color: "Rose Gold",
  stock: 14,
  sku: "WEDDINGACCESSORY003-ONESIZE-ROSEG"
},
  {
  size: "One Size",
  color: "Gold",
  stock: 21,
  sku: "WEDDINGACCESSORY003-ONESIZE-GOLD"
},
],
  tags: [
  "wedding-accessories",
  "wedding",
  "rose gold",
  "gold",
  "gold plated brass",
  "maang tikka",
  "women",
],
  specifications: {
  Material: "Gold Plated Brass",
  Occasion: "Wedding",
  Style: "Maang Tikka",
  Gender: "Women",
  AvailableColors: "Rose Gold, Gold",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-accessory-004",
  name: "Maroon Velvet Wedding Stole",
  description: "Maroon Velvet Wedding Stole is a embroidered stole velvet piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1499,
  originalPrice: 2199,
  category: "wedding-accessories",
  image: "/products/prod-wedding-accessory-004.webp",
  images: [
  "/products/prod-wedding-accessory-004.webp",
],
  rating: 4.5,
  reviewCount: 82,
  variants: [
  {
  size: "One Size",
  color: "Maroon",
  stock: 13,
  sku: "WEDDINGACCESSORY004-ONESIZE-MAROO"
},
  {
  size: "One Size",
  color: "Wine",
  stock: 20,
  sku: "WEDDINGACCESSORY004-ONESIZE-WINE"
},
],
  tags: [
  "wedding-accessories",
  "wedding",
  "maroon",
  "wine",
  "velvet",
  "embroidered stole",
  "women",
],
  specifications: {
  Material: "Velvet",
  Occasion: "Wedding",
  Style: "Embroidered Stole",
  Gender: "Women",
  AvailableColors: "Maroon, Wine",
  AvailableSizes: "One Size",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-wedding-accessory-005",
  name: "Silver Crystal Bridal Belt",
  description: "Silver Crystal Bridal Belt is a bridal belt crystal mesh piece designed for wedding occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 1699,
  originalPrice: 2499,
  category: "wedding-accessories",
  image: "/products/prod-wedding-accessory-005.webp",
  images: [
  "/products/prod-wedding-accessory-005.webp",
],
  rating: 4.6,
  reviewCount: 65,
  variants: [
  {
  size: "Adjustable",
  color: "Silver",
  stock: 12,
  sku: "WEDDINGACCESSORY005-ADJUSTABLE-SILVE"
},
],
  tags: [
  "wedding-accessories",
  "wedding",
  "silver",
  "crystal mesh",
  "bridal belt",
  "women",
],
  specifications: {
  Material: "Crystal Mesh",
  Occasion: "Wedding",
  Style: "Bridal Belt",
  Gender: "Women",
  AvailableColors: "Silver",
  AvailableSizes: "Adjustable",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-party-wear-001",
  name: "Black Sequin One-Shoulder Party Dress",
  description: "Black Sequin One-Shoulder Party Dress is a one-shoulder sequin mesh piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 3899,
  originalPrice: 5199,
  category: "party-wear",
  image: "/products/prod-party-wear-001.webp",
  images: [
  "/products/prod-party-wear-001.webp",
],
  rating: 4.7,
  reviewCount: 193,
  variants: [
  {
  size: "XS",
  color: "Black",
  stock: 23,
  sku: "PARTYWEAR001-XS-BLACK"
},
  {
  size: "S",
  color: "Black",
  stock: 9,
  sku: "PARTYWEAR001-S-BLACK"
},
  {
  size: "M",
  color: "Black",
  stock: 14,
  sku: "PARTYWEAR001-M-BLACK"
},
  {
  size: "L",
  color: "Black",
  stock: 19,
  sku: "PARTYWEAR001-L-BLACK"
},
  {
  size: "XL",
  color: "Black",
  stock: 5,
  sku: "PARTYWEAR001-XL-BLACK"
},
],
  tags: [
  "party-wear",
  "party",
  "black",
  "sequin mesh",
  "one-shoulder",
  "women",
],
  specifications: {
  Material: "Sequin Mesh",
  Occasion: "Party",
  Style: "One-Shoulder",
  Gender: "Women",
  AvailableColors: "Black",
  AvailableSizes: "XS, S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-party-wear-002",
  name: "Wine Velvet Ruched Party Dress",
  description: "Wine Velvet Ruched Party Dress is a ruched midi velvet piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 3299,
  originalPrice: 4499,
  category: "party-wear",
  image: "/products/prod-party-wear-002.webp",
  images: [
  "/products/prod-party-wear-002.webp",
],
  rating: 4.6,
  reviewCount: 148,
  variants: [
  {
  size: "S",
  color: "Wine",
  stock: 16,
  sku: "PARTYWEAR002-S-WINE"
},
  {
  size: "M",
  color: "Wine",
  stock: 21,
  sku: "PARTYWEAR002-M-WINE"
},
  {
  size: "L",
  color: "Wine",
  stock: 7,
  sku: "PARTYWEAR002-L-WINE"
},
  {
  size: "XL",
  color: "Wine",
  stock: 12,
  sku: "PARTYWEAR002-XL-WINE"
},
  {
  size: "S",
  color: "Burgundy",
  stock: 23,
  sku: "PARTYWEAR002-S-BURGU"
},
  {
  size: "M",
  color: "Burgundy",
  stock: 9,
  sku: "PARTYWEAR002-M-BURGU"
},
  {
  size: "L",
  color: "Burgundy",
  stock: 14,
  sku: "PARTYWEAR002-L-BURGU"
},
  {
  size: "XL",
  color: "Burgundy",
  stock: 19,
  sku: "PARTYWEAR002-XL-BURGU"
},
  {
  size: "S",
  color: "Black",
  stock: 11,
  sku: "PARTYWEAR002-S-BLACK"
},
  {
  size: "M",
  color: "Black",
  stock: 16,
  sku: "PARTYWEAR002-M-BLACK"
},
  {
  size: "L",
  color: "Black",
  stock: 21,
  sku: "PARTYWEAR002-L-BLACK"
},
  {
  size: "XL",
  color: "Black",
  stock: 7,
  sku: "PARTYWEAR002-XL-BLACK"
},
],
  tags: [
  "party-wear",
  "party",
  "wine",
  "burgundy",
  "black",
  "velvet",
  "ruched midi",
  "women",
],
  specifications: {
  Material: "Velvet",
  Occasion: "Party",
  Style: "Ruched Midi",
  Gender: "Women",
  AvailableColors: "Wine, Burgundy, Black",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-party-wear-003",
  name: "Cobalt Blue Satin Co-ord Set",
  description: "Cobalt Blue Satin Co-ord Set is a co-ord satin piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 4599,
  originalPrice: 5999,
  category: "party-wear",
  image: "/products/prod-party-wear-003.webp",
  images: [
  "/products/prod-party-wear-003.webp",
],
  rating: 4.5,
  reviewCount: 79,
  variants: [
  {
  size: "S",
  color: "Blue",
  stock: 14,
  sku: "PARTYWEAR003-S-BLUE"
},
  {
  size: "M",
  color: "Blue",
  stock: 19,
  sku: "PARTYWEAR003-M-BLUE"
},
  {
  size: "L",
  color: "Blue",
  stock: 5,
  sku: "PARTYWEAR003-L-BLUE"
},
  {
  size: "XL",
  color: "Blue",
  stock: 10,
  sku: "PARTYWEAR003-XL-BLUE"
},
  {
  size: "S",
  color: "Navy",
  stock: 21,
  sku: "PARTYWEAR003-S-NAVY"
},
  {
  size: "M",
  color: "Navy",
  stock: 7,
  sku: "PARTYWEAR003-M-NAVY"
},
  {
  size: "L",
  color: "Navy",
  stock: 12,
  sku: "PARTYWEAR003-L-NAVY"
},
  {
  size: "XL",
  color: "Navy",
  stock: 17,
  sku: "PARTYWEAR003-XL-NAVY"
},
],
  tags: [
  "party-wear",
  "party",
  "blue",
  "navy",
  "satin",
  "co-ord",
  "women",
],
  specifications: {
  Material: "Satin",
  Occasion: "Party",
  Style: "Co-ord",
  Gender: "Women",
  AvailableColors: "Blue, Navy",
  AvailableSizes: "S, M, L, XL",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-party-wear-004",
  name: "Silver Metallic Halter Jumpsuit",
  description: "Silver Metallic Halter Jumpsuit is a halter jumpsuit metallic jersey piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for women wardrobes.",
  price: 5499,
  originalPrice: 6999,
  category: "party-wear",
  image: "/products/prod-party-wear-004.webp",
  images: [
  "/products/prod-party-wear-004.webp",
],
  rating: 4.6,
  reviewCount: 68,
  variants: [
  {
  size: "XS",
  color: "Silver",
  stock: 17,
  sku: "PARTYWEAR004-XS-SILVE"
},
  {
  size: "S",
  color: "Silver",
  stock: 22,
  sku: "PARTYWEAR004-S-SILVE"
},
  {
  size: "M",
  color: "Silver",
  stock: 8,
  sku: "PARTYWEAR004-M-SILVE"
},
  {
  size: "L",
  color: "Silver",
  stock: 13,
  sku: "PARTYWEAR004-L-SILVE"
},
],
  tags: [
  "party-wear",
  "party",
  "silver",
  "metallic jersey",
  "halter jumpsuit",
  "women",
],
  specifications: {
  Material: "Metallic Jersey",
  Occasion: "Party",
  Style: "Halter Jumpsuit",
  Gender: "Women",
  AvailableColors: "Silver",
  AvailableSizes: "XS, S, M, L",
  Care: "Follow care label instructions"
}
},
  {
  id: "prod-party-wear-005",
  name: "Red Brocade Nehru Jacket Set",
  description: "Red Brocade Nehru Jacket Set is a nehru jacket brocade silk piece designed for party occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for men wardrobes.",
  price: 6999,
  originalPrice: 8999,
  category: "party-wear",
  image: "/products/prod-party-wear-005.webp",
  images: [
  "/products/prod-party-wear-005.webp",
],
  rating: 4.7,
  reviewCount: 94,
  variants: [
  {
  size: "S",
  color: "Red",
  stock: 14,
  sku: "PARTYWEAR005-S-RED"
},
  {
  size: "M",
  color: "Red",
  stock: 19,
  sku: "PARTYWEAR005-M-RED"
},
  {
  size: "L",
  color: "Red",
  stock: 5,
  sku: "PARTYWEAR005-L-RED"
},
  {
  size: "XL",
  color: "Red",
  stock: 10,
  sku: "PARTYWEAR005-XL-RED"
},
  {
  size: "XXL",
  color: "Red",
  stock: 15,
  sku: "PARTYWEAR005-XXL-RED"
},
  {
  size: "S",
  color: "Maroon",
  stock: 21,
  sku: "PARTYWEAR005-S-MAROO"
},
  {
  size: "M",
  color: "Maroon",
  stock: 7,
  sku: "PARTYWEAR005-M-MAROO"
},
  {
  size: "L",
  color: "Maroon",
  stock: 12,
  sku: "PARTYWEAR005-L-MAROO"
},
  {
  size: "XL",
  color: "Maroon",
  stock: 17,
  sku: "PARTYWEAR005-XL-MAROO"
},
  {
  size: "XXL",
  color: "Maroon",
  stock: 22,
  sku: "PARTYWEAR005-XXL-MAROO"
},
],
  tags: [
  "party-wear",
  "party",
  "red",
  "maroon",
  "brocade silk",
  "nehru jacket",
  "men",
],
  specifications: {
  Material: "Brocade Silk",
  Occasion: "Party",
  Style: "Nehru Jacket",
  Gender: "Men",
  AvailableColors: "Red, Maroon",
  AvailableSizes: "S, M, L, XL, XXL",
  Care: "Follow care label instructions"
}
},
];

export const demoOrder: Order = {
  id: "order-001",
  orderNumber: "AC-10429",
  productId: "prod-wedding-dress-001",
  productName: "Wine Satin Wedding Dress",
  productImage: "/products/prod-wedding-dress-001.webp",
  amount: 4299,
  quantity: 1,
  size: "M",
  color: "Wine",
  status: "confirmed",
  paymentStatus: "success",
  createdAt: new Date("2026-09-04T03:00:05.667Z"),
  customerName: "Priya Sharma",
  customerEmail: "priya.sharma@email.com",
  shippingAddress: "42, Green Park Extension, New Delhi - 110016",
  isAiBuyerOrder: true,
  aiMatchScore: 94,
  timeline: [
  {
  id: "t1",
  label: "Order Placed",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  status: "completed"
},
  {
  id: "t2",
  label: "Payment Confirmed",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  status: "completed"
},
  {
  id: "t3",
  label: "Processing",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  status: "current"
},
  {
  id: "t4",
  label: "Shipped",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  status: "pending"
},
  {
  id: "t5",
  label: "Delivered",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  status: "pending"
},
]
};

export const aiRecommendations: AIRecommendation[] = [
  {
  id: "rec-001",
  type: "cross-sell",
  title: "Wedding Dress + Gold Statement Earrings",
  description: "Customers purchasing wedding dresses are frequently interested in statement earrings. Pairing these products could increase average order value.",
  productIds: [
  "prod-wedding-dress-001",
  "prod-earrings-001",
],
  expectedImpact: "Increase average order value by 18%",
  revenueImpact: 799,
  status: "pending",
  createdAt: new Date("2026-09-04T03:00:05.667Z")
},
  {
  id: "rec-002",
  type: "bundle",
  title: "Complete Wedding Look Bundle",
  description: "Bundle wedding dress with earrings and necklace for a complete bridal look at a discounted price.",
  productIds: [
  "prod-wedding-dress-001",
  "prod-earrings-001",
  "prod-necklace-001",
],
  expectedImpact: "Boost bundle conversion by 25%",
  revenueImpact: 2299,
  status: "pending",
  createdAt: new Date("2026-09-03T03:00:05.667Z")
},
  {
  id: "rec-003",
  type: "upsell",
  title: "Premium Banarasi Silk Upgrade",
  description: "Customers browsing wedding dresses may upgrade to premium Banarasi silk sarees for traditional weddings.",
  productIds: [
  "prod-saree-001",
],
  expectedImpact: "Increase premium category revenue",
  revenueImpact: 4700,
  status: "approved",
  createdAt: new Date("2026-09-02T03:00:05.667Z")
},
];

export const aiInsights: AIInsight[] = [
  {
  id: "insight-001",
  type: "cross-sell",
  title: "Cross-sell opportunity detected",
  description: "Customers purchasing wedding dresses are frequently interested in earrings.",
  impact: "Potential +₹799 per order",
  createdAt: new Date("2026-09-04T03:00:05.667Z")
},
  {
  id: "insight-002",
  type: "pattern",
  title: "Customer pattern detected",
  description: "AI Buyer searches for wine-colored wedding attire increased 34% this week.",
  impact: "Optimize wine color inventory",
  createdAt: new Date("2026-09-04T02:00:05.667Z")
},
  {
  id: "insight-003",
  type: "upsell",
  title: "Upsell opportunity found",
  description: "Customers with budgets under ₹5,000 often accept accessories when shown at checkout.",
  impact: "Cart cross-sell conversion: 28%",
  createdAt: new Date("2026-09-04T01:00:05.667Z")
},
];

export const auditEvents: AuditEvent[] = [
  {
  id: "audit-001",
  timestamp: new Date("2026-09-04T02:55:05.667Z"),
  event: "AI Buyer searched products",
  actor: "AI Buyer",
  status: "info",
  relatedProduct: "Wine Satin Wedding Dress"
},
  {
  id: "audit-002",
  timestamp: new Date("2026-09-04T02:56:05.667Z"),
  event: "AI Buyer created cart",
  actor: "AI Buyer",
  status: "info",
  relatedProduct: "Wine Satin Wedding Dress"
},
  {
  id: "audit-003",
  timestamp: new Date("2026-09-04T02:57:05.667Z"),
  event: "Purchase policy evaluated",
  actor: "System",
  status: "info"
},
  {
  id: "audit-004",
  timestamp: new Date("2026-09-04T02:58:05.667Z"),
  event: "Purchase approved",
  actor: "System",
  status: "success",
  relatedOrder: "AC-10429"
},
  {
  id: "audit-005",
  timestamp: new Date("2026-09-04T02:59:05.667Z"),
  event: "Payment initiated",
  actor: "System",
  status: "info",
  relatedOrder: "AC-10429"
},
  {
  id: "audit-006",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  event: "Order created",
  actor: "System",
  status: "success",
  relatedOrder: "AC-10429"
},
  {
  id: "audit-007",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  event: "AI Merchant analyzed order",
  actor: "AI Merchant",
  status: "info",
  relatedOrder: "AC-10429"
},
  {
  id: "audit-008",
  timestamp: new Date("2026-09-04T03:00:05.667Z"),
  event: "Cross-sell recommendation generated",
  actor: "AI Merchant",
  status: "success"
},
];

export const merchantMetrics: MerchantMetrics = {
  totalRevenue: 284750,
  aiAttributedRevenue: 4299,
  orders: 156,
  conversionRate: 3.2,
  averageOrderValue: 1825,
  aiBuyerOrders: 1
};

export const analyticsData: AnalyticsData = {
  revenueTrend: [
  {
  date: "Mon",
  revenue: 32000,
  aiRevenue: 0
},
  {
  date: "Tue",
  revenue: 28500,
  aiRevenue: 0
},
  {
  date: "Wed",
  revenue: 35200,
  aiRevenue: 0
},
  {
  date: "Thu",
  revenue: 41800,
  aiRevenue: 0
},
  {
  date: "Fri",
  revenue: 38900,
  aiRevenue: 0
},
  {
  date: "Sat",
  revenue: 45200,
  aiRevenue: 0
},
  {
  date: "Sun",
  revenue: 4299,
  aiRevenue: 4299
},
],
  ordersTrend: [
  {
  date: "Mon",
  orders: 18,
  aiOrders: 0
},
  {
  date: "Tue",
  orders: 15,
  aiOrders: 0
},
  {
  date: "Wed",
  orders: 22,
  aiOrders: 0
},
  {
  date: "Thu",
  orders: 24,
  aiOrders: 0
},
  {
  date: "Fri",
  orders: 21,
  aiOrders: 0
},
  {
  date: "Sat",
  orders: 28,
  aiOrders: 0
},
  {
  date: "Sun",
  orders: 1,
  aiOrders: 1
},
],
  productPerformance: [
  {
  name: "Wine Satin Wedding Dress",
  revenue: 42990,
  orders: 10,
  aiOrders: 1
},
  {
  name: "Banarasi Silk Saree",
  revenue: 35996,
  orders: 4,
  aiOrders: 0
},
  {
  name: "Gold Statement Earrings",
  revenue: 15980,
  orders: 20,
  aiOrders: 0
},
  {
  name: "Embroidered Cotton Kurti",
  revenue: 12990,
  orders: 10,
  aiOrders: 0
},
  {
  name: "High-Rise Slim Fit Jeans",
  revenue: 21990,
  orders: 10,
  aiOrders: 0
},
],
  conversionMetrics: {
  totalVisitors: 4850,
  aiBuyerSessions: 124,
  conversionRate: 3.2,
  aiConversionRate: 4.8,
  averageOrderValue: 1825,
  aiAverageOrderValue: 4299
}
};

export const aiBuyerActivities: AIBuyerActivity[] = [
  {
  id: "act-001",
  type: "search",
  query: "wine-colored wedding dress under ₹5,000 size M",
  timestamp: new Date("2026-09-04T02:55:05.667Z")
},
  {
  id: "act-002",
  type: "view",
  productId: "prod-wedding-dress-001",
  productName: "Wine Satin Wedding Dress",
  matchScore: 94,
  timestamp: new Date("2026-09-04T02:56:05.667Z")
},
  {
  id: "act-003",
  type: "cart",
  productId: "prod-wedding-dress-001",
  productName: "Wine Satin Wedding Dress",
  matchScore: 94,
  timestamp: new Date("2026-09-04T02:57:05.667Z")
},
  {
  id: "act-004",
  type: "purchase",
  productId: "prod-wedding-dress-001",
  productName: "Wine Satin Wedding Dress",
  matchScore: 94,
  revenue: 4299,
  timestamp: new Date("2026-09-04T03:00:05.667Z")
},
];

export const DEMO_QUERY = "I need a wine-colored wedding dress under ₹5,000, size M.";

export const categoryLabels: Record<string, string> = {
  "wedding-dresses": "Wedding Dresses",
  dresses: "Dresses",
  sarees: "Sarees",
  kurtis: "Kurtis",
  shirts: "Shirts",
  "t-shirts": "T-Shirts",
  jeans: "Jeans",
  trousers: "Trousers",
  jackets: "Jackets",
  shoes: "Shoes",
  handbags: "Handbags",
  earrings: "Earrings",
  necklaces: "Necklaces",
  "wedding-accessories": "Wedding Accessories",
  "party-wear": "Party Wear"
};

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

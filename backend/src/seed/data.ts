import type { Product, Order, AIRecommendation, AIInsight, AuditEvent, AnalyticsData, MerchantMetrics, AIBuyerActivity } from './types.js';

export const FEATURED_PRODUCT_ID = 'prod-wedding-dress-001';
export const CROSS_SELL_PRODUCT_ID = 'prod-earrings-001';

type CatalogEntry = {
  id: string;
  name: string;
  category: Product['category'];
  price: number;
  originalPrice?: number;
  colors: string[];
  material: string;
  occasion: string;
  gender: 'Women' | 'Men' | 'Unisex';
  style: string;
  sizes?: string[];
  reviews: number;
  rating: number;
};

function productImagePath(productId: string): string {
  return `/products/${productId}.webp`;
}

function catalogProduct(entry: CatalogEntry): Product {
  const clothingSizes = entry.sizes ?? ['S', 'M', 'L'];
  const variants = entry.colors.flatMap((color, colorIndex) =>
    clothingSizes.map((size, sizeIndex) => ({
      size,
      color,
      stock: 5 + ((colorIndex * 7 + sizeIndex * 5 + entry.name.length) % 19),
      sku: `${entry.id.replace('prod-', '').toUpperCase().replace(/[^A-Z0-9]/g, '')}-${size.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}-${color.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 5)}`,
    })),
  );
  const image = productImagePath(entry.id);
  return {
    id: entry.id,
    name: entry.name,
    description: `${entry.name} is a ${entry.style.toLowerCase()} ${entry.material.toLowerCase()} piece designed for ${entry.occasion.toLowerCase()} occasions. Thoughtful tailoring, a refined finish, and wearable comfort make it a versatile choice for ${entry.gender.toLowerCase()} wardrobes.`,
    price: entry.price,
    originalPrice: entry.originalPrice,
    category: entry.category,
    image,
    images: [image],
    rating: entry.rating,
    reviewCount: entry.reviews,
    variants,
    tags: [entry.category, entry.occasion.toLowerCase(), ...entry.colors.map((color) => color.toLowerCase()), entry.material.toLowerCase(), entry.style.toLowerCase(), entry.gender.toLowerCase()],
    specifications: {
      Material: entry.material,
      Occasion: entry.occasion,
      Style: entry.style,
      Gender: entry.gender,
      AvailableColors: entry.colors.join(', '),
      AvailableSizes: clothingSizes.join(', '),
      Care: entry.category === 'shoes' || entry.category === 'handbags' ? 'Wipe clean with a soft cloth' : 'Follow care label instructions',
    },
  };
}

// Deliberately data-driven so the product/variant/inventory seed remains deterministic.
// Each entry produces inventory for every listed size/color variant through catalogProduct().
const catalogExpansion: Product[] = [
  // Wedding Dresses
  ['saree','Merlot Satin A-Line Wedding Dress','wedding-dresses',4699,6299,['Wine','Burgundy'],'Satin','Wedding','Women','A-Line',['XS','S','M','L'],186,4.7],
  ['psaree','Crimson Embroidered Bridal Lehenga Dress','wedding-dresses',7999,10499,['Red','Maroon'],'Silk Blend','Wedding','Women','Embroidered Lehenga',['S','M','L','XL'],132,4.8],
  ['saree','Blush Tulle Garden Wedding Gown','wedding-dresses',5999,7999,['Blush','Pink'],'Tulle','Wedding','Women','Ball Gown',['S','M','L'],98,4.6],
  ['saree','Emerald Velvet Reception Dress','wedding-dresses',4999,6799,['Emerald','Green'],'Velvet','Wedding Reception','Women','Wrap Midi',['S','M','L','XL'],114,4.5],
  ['prod-wedding-dress-009','Ivory Chikankari Bridal Anarkali','wedding-dresses',6499,8499,['Ivory','Cream'],'Georgette','Wedding','Women','Anarkali',['S','M','L','XL','XXL'],76,4.7],
  // Dresses
  ['prod-dress-001','Navy Pleated Midi Dress','dresses',2399,3199,['Navy','Sky Blue'],'Crepe','Office & Brunch','Women','Pleated Midi',['XS','S','M','L','XL'],143,4.5],
  ['prod-dress-002','Mustard Linen Shirt Dress','dresses',1999,2699,['Mustard','Beige'],'Linen','Casual','Women','Shirt Dress',['S','M','L','XL'],109,4.4],
  ['prod-dress-003','Black Wrap Cocktail Dress','dresses',3499,4599,['Black'],'Satin','Party','Women','Wrap Cocktail',['XS','S','M','L','XL'],201,4.7],
  ['prod-dress-004','Lavender Floral Maxi Dress','dresses',2799,3799,['Lavender','Purple'],'Chiffon','Vacation','Women','Floral Maxi',['S','M','L','XL'],87,4.5],
  ['prod-dress-005','Red Ribbed Knit Bodycon Dress','dresses',1799,2499,['Red','Maroon'],'Ribbed Knit','Date Night','Women','Bodycon',['XS','S','M','L'],166,4.3],
  // Sarees
  ['prod-saree-002','Ruby Red Art Silk Saree','sarees',2499,3499,['Red','Maroon'],'Art Silk','Wedding','Women','Zari Border',['Free Size'],192,4.6],
  ['prod-saree-003','Crimson Chiffon Printed Saree','sarees',1499,2199,['Red','Pink'],'Chiffon','Casual','Women','Printed',['Free Size'],121,4.3],
  ['prod-saree-004','Emerald Kanjeevaram Silk Saree','sarees',10999,12999,['Emerald','Green'],'Kanjeevaram Silk','Wedding','Women','Temple Border',['Free Size'],68,4.9],
  ['prod-saree-005','Navy Blue Georgette Party Saree','sarees',2999,4199,['Navy','Blue'],'Georgette','Party','Women','Sequin Border',['Free Size'],153,4.5],
  ['prod-saree-006','Sunshine Yellow Cotton Mulmul Saree','sarees',1199,1699,['Yellow','Mustard'],'Mulmul Cotton','Daily','Women','Hand Block Print',['Free Size'],94,4.4],
  // Kurtis
  ['prod-kurti-002','Ivory Embroidered Anarkali Kurti','kurtis',1899,2699,['Ivory','Cream'],'Rayon','Festive','Women','Anarkali',['S','M','L','XL','XXL'],174,4.6],
  ['prod-kurti-003','Indigo Ajrakh Straight Kurti','kurtis',1399,1999,['Blue','Indigo'],'Cotton','Casual','Women','Straight Cut',['S','M','L','XL'],115,4.4],
  ['prod-kurti-004','Rose Pink Mirror Work Kurti','kurtis',2199,2999,['Pink','Blush'],'Viscose','Party','Women','Flared',['S','M','L','XL'],83,4.5],
  ['prod-kurti-005','Mustard Ikat A-Line Kurti','kurtis',999,1499,['Mustard','Yellow'],'Cotton','Daily','Women','A-Line',['S','M','L','XL','XXL'],146,4.3],
  ['prod-kurti-006','Teal Chanderi Panelled Kurti','kurtis',2499,3499,['Teal','Green'],'Chanderi','Festive','Women','Panelled',['S','M','L','XL'],67,4.7],
  // Shirts
  ['prod-shirt-001','Classic Oxford Cotton Shirt','shirts',1499,2099,['White','Sky Blue','Blue'],'Oxford Cotton','Office','Men','Regular Fit',['S','M','L','XL','XXL'],247,4.6],
  ['prod-shirt-002','Navy Slim Fit Poplin Shirt','shirts',1799,2499,['Navy','Blue'],'Poplin Cotton','Formal','Men','Slim Fit',['S','M','L','XL'],186,4.5],
  ['prod-shirt-003','Olive Linen Resort Shirt','shirts',1599,2299,['Olive','Green'],'Linen','Vacation','Men','Relaxed Fit',['S','M','L','XL','XXL'],96,4.4],
  ['prod-shirt-004','Burgundy Checked Flannel Shirt','shirts',1299,1899,['Burgundy','Maroon'],'Brushed Cotton','Casual','Men','Checked',['S','M','L','XL'],138,4.3],
  ['prod-shirt-005','Black Mandarin Collar Shirt','shirts',2199,2999,['Black'],'Cotton Satin','Party','Men','Mandarin Collar',['S','M','L','XL','XXL'],72,4.6],
  // T-Shirts
  ['prod-tshirt-001','White Organic Cotton Crew T-Shirt','t-shirts',699,999,['White','Cream'],'Organic Cotton','Daily','Unisex','Crew Neck',['XS','S','M','L','XL','XXL'],326,4.5],
  ['prod-tshirt-002','Navy Pocket Polo T-Shirt','t-shirts',999,1499,['Navy','Blue'],'Pique Cotton','Casual','Men','Polo',['S','M','L','XL','XXL'],192,4.4],
  ['prod-tshirt-003','Blush Oversized Graphic T-Shirt','t-shirts',899,1299,['Blush','Pink'],'Cotton Jersey','Casual','Women','Oversized',['XS','S','M','L','XL'],156,4.3],
  ['prod-tshirt-004','Black Performance Training T-Shirt','t-shirts',1199,1699,['Black','Grey'],'Moisture-Wicking Polyester','Gym','Men','Athletic',['S','M','L','XL','XXL'],213,4.6],
  ['prod-tshirt-005','Lavender Ribbed Baby Tee','t-shirts',799,1199,['Lavender','Purple'],'Ribbed Cotton','Casual','Women','Fitted',['XS','S','M','L'],119,4.4],
  // Jeans
  ['prod-jeans-002','Straight Fit Blue Denim Jeans','jeans',2499,3299,['Blue','Indigo'],'Stretch Denim','Casual','Men','Straight Fit',['28','30','32','34','36'],276,4.6],
  ['prod-jeans-003','Black Mom Fit High Rise Jeans','jeans',2299,3099,['Black'],'Cotton Denim','Casual','Women','Mom Fit',['26','28','30','32','34'],188,4.5],
  ['prod-jeans-004','Light Wash Wide Leg Jeans','jeans',2799,3699,['Sky Blue','Blue'],'Rigid Denim','Weekend','Women','Wide Leg',['26','28','30','32','34'],143,4.4],
  ['prod-jeans-005','Charcoal Tapered Comfort Jeans','jeans',1999,2799,['Charcoal','Black'],'Stretch Denim','Daily','Men','Tapered',['28','30','32','34','36'],127,4.3],
  ['prod-jeans-006','White Cropped Flare Jeans','jeans',2599,3499,['White','Cream'],'Cotton Denim','Brunch','Women','Cropped Flare',['26','28','30','32'],91,4.5],
  // Trousers
  ['prod-trouser-001','Beige Pleated Wide Leg Trousers','trousers',2299,3199,['Beige','Cream'],'Linen Blend','Office','Women','Wide Leg',['XS','S','M','L','XL'],122,4.5],
  ['prod-trouser-002','Charcoal Formal Slim Trousers','trousers',1999,2799,['Charcoal','Black'],'Poly-Viscose','Formal','Men','Slim Fit',['30','32','34','36'],189,4.6],
  ['prod-trouser-003','Olive Cargo Utility Trousers','trousers',2499,3399,['Olive','Green'],'Cotton Twill','Casual','Unisex','Cargo',['S','M','L','XL'],151,4.4],
  ['prod-trouser-004','Navy Cigarette Ankle Trousers','trousers',1799,2499,['Navy','Blue'],'Stretch Crepe','Office','Women','Cigarette',['XS','S','M','L','XL'],106,4.3],
  ['prod-trouser-005','Brown Corduroy Relaxed Trousers','trousers',2999,3999,['Brown','Beige'],'Corduroy','Winter','Men','Relaxed Fit',['30','32','34','36'],64,4.5],
  // Jackets
  ['prod-jacket-002','Black Vegan Leather Biker Jacket','jackets',4999,6499,['Black'],'Vegan Leather','Party','Women','Biker',['S','M','L','XL'],157,4.6],
  ['prod-jacket-003','Camel Wool Blend Overcoat','jackets',6499,7999,['Camel','Brown'],'Wool Blend','Winter','Women','Longline Coat',['S','M','L','XL'],83,4.7],
  ['prod-jacket-004','Olive Quilted Puffer Jacket','jackets',3799,4999,['Olive','Green'],'Recycled Polyester','Winter','Unisex','Puffer',['S','M','L','XL','XXL'],134,4.5],
  ['prod-jacket-005','Indigo Denim Trucker Jacket','jackets',2999,3999,['Indigo','Blue'],'Cotton Denim','Casual','Men','Trucker',['S','M','L','XL','XXL'],176,4.4],
  ['prod-jacket-006','Ivory Tweed Cropped Jacket','jackets',4599,5999,['Ivory','Cream'],'Tweed','Office','Women','Cropped',['XS','S','M','L'],71,4.6],
  // Shoes
  ['prod-shoe-002','White Leather Court Sneakers','shoes',2499,3499,['White','Cream'],'Leather','Casual','Unisex','Low Top',['5','6','7','8','9','10'],239,4.6],
  ['prod-shoe-003','Black Suede Block Heel Pumps','shoes',3299,4499,['Black'],'Suede','Party','Women','Block Heel',['4','5','6','7','8'],117,4.5],
  ['prod-shoe-004','Tan Leather Oxford Shoes','shoes',4999,6499,['Tan','Brown'],'Genuine Leather','Formal','Men','Oxford',['6','7','8','9','10'],92,4.7],
  ['prod-shoe-005','Rose Gold Embellished Juttis','shoes',1899,2699,['Rose Gold','Pink'],'Silk Brocade','Wedding','Women','Jutti',['4','5','6','7','8'],145,4.5],
  ['prod-shoe-006','Sky Blue Running Trainers','shoes',2799,3799,['Sky Blue','Blue','White'],'Mesh Knit','Gym','Unisex','Running',['5','6','7','8','9','10'],204,4.4],
  // Handbags
  ['prod-handbag-002','Black Quilted Chain Shoulder Bag','handbags',2899,3999,['Black'],'Vegan Leather','Party','Women','Quilted Shoulder',['Small'],178,4.5],
  ['prod-handbag-003','Tan Structured Office Tote','handbags',2499,3499,['Tan','Brown'],'Faux Leather','Office','Women','Structured Tote',['Large'],131,4.4],
  ['prod-handbag-004','Ivory Beaded Potli Bag','handbags',1499,2199,['Ivory','Gold'],'Silk','Wedding','Women','Potli',['One Size'],86,4.6],
  ['prod-handbag-005','Burgundy Suede Sling Bag','handbags',1999,2999,['Burgundy','Wine'],'Suede','Date Night','Women','Sling',['Small'],104,4.3],
  ['prod-handbag-006','Olive Canvas Weekender Bag','handbags',3299,4599,['Olive','Green'],'Canvas','Travel','Unisex','Weekender',['Large'],63,4.5],
  // Earrings
  ['prod-earrings-002','Pearl Drop Earrings','earrings',699,999,['Pearl White','Gold'],'Freshwater Pearl','Wedding','Women','Drop',['One Size'],254,4.7],
  ['prod-earrings-003','Ruby Stone Chandbali Earrings','earrings',1299,1799,['Red','Gold'],'Gold Plated Brass','Wedding','Women','Chandbali',['One Size'],163,4.6],
  ['prod-earrings-004','Silver Crystal Hoop Earrings','earrings',899,1299,['Silver'],'Sterling Silver Plated','Party','Women','Hoop',['One Size'],187,4.5],
  ['prod-earrings-005','Emerald Kundan Jhumka Earrings','earrings',1499,2099,['Emerald','Gold'],'Kundan Stonework','Festive','Women','Jhumka',['One Size'],119,4.7],
  ['prod-earrings-006','Blush Enamel Stud Earrings','earrings',499,749,['Blush','Pink'],'Enamel Brass','Casual','Women','Stud',['One Size'],141,4.3],
  // Necklaces
  ['prod-necklace-002','Emerald Kundan Choker Necklace','necklaces',3299,4499,['Emerald','Gold'],'Kundan Stonework','Wedding','Women','Choker',['Adjustable'],97,4.7],
  ['prod-necklace-003','Minimal Gold Bar Necklace','necklaces',999,1499,['Gold'],'Gold Plated Steel','Daily','Women','Minimal',['Adjustable'],212,4.5],
  ['prod-necklace-004','Ruby Temple Pendant Necklace','necklaces',2499,3499,['Red','Gold'],'Antique Gold Plated','Festive','Women','Temple',['Adjustable'],88,4.6],
  ['prod-necklace-005','Silver Layered Moonstone Necklace','necklaces',1599,2299,['Silver','Blue'],'Silver Plated Alloy','Party','Women','Layered',['Adjustable'],103,4.4],
  ['prod-necklace-006','Ivory Pearl Bridal Choker','necklaces',2199,2999,['Ivory','Pearl White'],'Freshwater Pearl','Wedding','Women','Bridal Choker',['Adjustable'],136,4.7],
  // Wedding Accessories
  ['prod-wedding-accessory-001','Gold Crystal Bridal Hair Vine','wedding-accessories',1199,1699,['Gold'],'Crystal Alloy','Wedding','Women','Hair Vine',['One Size'],109,4.5],
  ['prod-wedding-accessory-002','Ivory Embroidered Bridal Clutch','wedding-accessories',1999,2899,['Ivory','Cream'],'Silk Embroidery','Wedding','Women','Clutch',['One Size'],74,4.6],
  ['prod-wedding-accessory-003','Rose Gold Floral Maang Tikka','wedding-accessories',799,1199,['Rose Gold','Gold'],'Gold Plated Brass','Wedding','Women','Maang Tikka',['One Size'],151,4.4],
  ['prod-wedding-accessory-004','Maroon Velvet Wedding Stole','wedding-accessories',1499,2199,['Maroon','Wine'],'Velvet','Wedding','Women','Embroidered Stole',['One Size'],82,4.5],
  ['prod-wedding-accessory-005','Silver Crystal Bridal Belt','wedding-accessories',1699,2499,['Silver'],'Crystal Mesh','Wedding','Women','Bridal Belt',['Adjustable'],65,4.6],
  // Party Wear
  ['prod-party-wear-001','Black Sequin One-Shoulder Party Dress','party-wear',3899,5199,['Black'],'Sequin Mesh','Party','Women','One-Shoulder',['XS','S','M','L','XL'],193,4.7],
  ['prod-party-wear-002','Wine Velvet Ruched Party Dress','party-wear',3299,4499,['Wine','Burgundy','Black'],'Velvet','Party','Women','Ruched Midi',['S','M','L','XL'],148,4.6],
  ['prod-party-wear-003','Cobalt Blue Satin Co-ord Set','party-wear',4599,5999,['Blue','Navy'],'Satin','Party','Women','Co-ord',['S','M','L','XL'],79,4.5],
  ['prod-party-wear-004','Silver Metallic Halter Jumpsuit','party-wear',5499,6999,['Silver'],'Metallic Jersey','Party','Women','Halter Jumpsuit',['XS','S','M','L'],68,4.6],
  ['prod-party-wear-005','Red Brocade Nehru Jacket Set','party-wear',6999,8999,['Red','Maroon'],'Brocade Silk','Party','Men','Nehru Jacket',['S','M','L','XL','XXL'],94,4.7],
].map(([id, name, category, price, originalPrice, colors, material, occasion, gender, style, sizes, reviews, rating]) =>
  catalogProduct({ id: id as string, name: name as string, category: category as Product['category'], price: price as number, originalPrice: originalPrice as number | undefined, colors: colors as string[], material: material as string, occasion: occasion as string, gender: gender as 'Women' | 'Men' | 'Unisex', style: style as string, sizes: sizes as string[], reviews: reviews as number, rating: rating as number }),
);

const seededProducts: Product[] = [
  {
    id: 'prod-wedding-dress-001',
    name: 'Wine Satin Wedding Dress',
    description: 'An elegant wine-colored satin wedding dress with a flattering A-line silhouette. Features delicate lace detailing on the bodice and a flowing skirt perfect for your special day.',
    price: 4299,
    originalPrice: 5999,
    category: 'wedding-dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3e446?w=600&h=800&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 124,
    variants: [
      { size: 'S', color: 'Wine', stock: 8, sku: 'WSD-S-WINE' },
      { size: 'M', color: 'Wine', stock: 12, sku: 'WSD-M-WINE' },
      { size: 'L', color: 'Wine', stock: 6, sku: 'WSD-L-WINE' },
      { size: 'M', color: 'Burgundy', stock: 4, sku: 'WSD-M-BURG' },
    ],
    tags: ['wedding', 'satin', 'wine', 'formal'],
    specifications: {
      Fabric: 'Premium Satin',
      Length: 'Floor Length',
      Neckline: 'V-Neck',
      Sleeve: 'Cap Sleeve',
      Care: 'Dry Clean Only',
    },
    aiMatchScore: 94,
    aiReasons: [
      'Within your budget of ₹5,000',
      'Size M available in Wine color',
      'Perfect for wedding occasions',
      'Highest rated in category',
    ],
  },
  {
    id: 'prod-wedding-dress-002',
    name: 'Ivory Lace Bridal Gown',
    description: 'Timeless ivory lace bridal gown with intricate embroidery and a cathedral train.',
    price: 4899,
    category: 'wedding-dresses',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop'],
    rating: 4.6,
    reviewCount: 89,
    variants: [
      { size: 'S', color: 'Ivory', stock: 5, sku: 'ILB-S-IV' },
      { size: 'M', color: 'Ivory', stock: 7, sku: 'ILB-M-IV' },
      { size: 'L', color: 'Ivory', stock: 3, sku: 'ILB-L-IV' },
    ],
    tags: ['wedding', 'lace', 'ivory', 'formal'],
    specifications: { Fabric: 'Lace', Length: 'Cathedral', Neckline: 'Sweetheart', Sleeve: 'Sleeveless', Care: 'Dry Clean Only' },
    aiMatchScore: 78,
    aiReasons: ['Within budget', 'Size M available', 'Wedding appropriate', 'Different color preference'],
  },
  {
    id: 'prod-wedding-dress-003',
    name: 'Burgundy Velvet Evening Dress',
    description: 'Luxurious burgundy velvet dress ideal for wedding receptions and evening celebrations.',
    price: 3799,
    category: 'wedding-dresses',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop'],
    rating: 4.5,
    reviewCount: 67,
    variants: [
      { size: 'M', color: 'Burgundy', stock: 9, sku: 'BVE-M-BURG' },
      { size: 'L', color: 'Burgundy', stock: 5, sku: 'BVE-L-BURG' },
    ],
    tags: ['wedding', 'velvet', 'burgundy', 'evening'],
    specifications: { Fabric: 'Velvet', Length: 'Midi', Neckline: 'Off-Shoulder', Sleeve: 'Long Sleeve', Care: 'Dry Clean Only' },
    aiMatchScore: 85,
    aiReasons: ['Within budget', 'Similar wine tone', 'Size M available', 'Evening wedding suitable'],
  },
  {
    id: 'prod-wedding-dress-004',
    name: 'Rose Gold Sequin Party Dress',
    description: 'Stunning rose gold sequin dress for wedding parties and celebrations.',
    price: 3499,
    category: 'party-wear',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=800&fit=crop'],
    rating: 4.4,
    reviewCount: 45,
    variants: [
      { size: 'S', color: 'Rose Gold', stock: 6, sku: 'RGS-S-RG' },
      { size: 'M', color: 'Rose Gold', stock: 8, sku: 'RGS-M-RG' },
    ],
    tags: ['party', 'sequin', 'rose-gold'],
    specifications: { Fabric: 'Sequin Mesh', Length: 'Knee Length', Neckline: 'Halter', Sleeve: 'Sleeveless', Care: 'Hand Wash' },
    aiMatchScore: 72,
    aiReasons: ['Within budget', 'Size M available', 'Party appropriate', 'Different color tone'],
  },
  {
    id: 'prod-earrings-001',
    name: 'Gold Statement Earrings',
    description: 'Elegant gold-plated statement earrings with crystal accents. Perfect complement to wedding attire.',
    price: 799,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    rating: 4.7,
    reviewCount: 203,
    variants: [{ size: 'One Size', color: 'Gold', stock: 45, sku: 'GSE-OS-GOLD' }],
    tags: ['earrings', 'gold', 'wedding', 'accessories'],
    specifications: { Material: 'Gold Plated Brass', Weight: '12g', Closure: 'Push Back', Care: 'Store in pouch' },
  },
  {
    id: 'prod-saree-001',
    name: 'Banarasi Silk Saree',
    description: 'Handwoven Banarasi silk saree with gold zari work, perfect for weddings and festive occasions.',
    price: 8999,
    category: 'sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550195585?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550195585?w=600&h=800&fit=crop'],
    rating: 4.9,
    reviewCount: 156,
    variants: [
      { size: 'Free Size', color: 'Maroon', stock: 10, sku: 'BSS-FS-MAR' },
      { size: 'Free Size', color: 'Gold', stock: 8, sku: 'BSS-FS-GOLD' },
    ],
    tags: ['saree', 'silk', 'banarasi', 'wedding'],
    specifications: { Fabric: 'Pure Silk', Length: '6.3 meters', Blouse: 'Included', Care: 'Dry Clean Only' },
  },
  {
    id: 'prod-kurti-001',
    name: 'Embroidered Cotton Kurti',
    description: 'Comfortable cotton kurti with delicate hand embroidery, ideal for casual and semi-formal wear.',
    price: 1299,
    category: 'kurtis',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop'],
    rating: 4.3,
    reviewCount: 78,
    variants: [
      { size: 'S', color: 'White', stock: 15, sku: 'ECK-S-WHT' },
      { size: 'M', color: 'White', stock: 20, sku: 'ECK-M-WHT' },
      { size: 'L', color: 'Blue', stock: 12, sku: 'ECK-L-BLU' },
    ],
    tags: ['kurti', 'cotton', 'casual'],
    specifications: { Fabric: 'Cotton', Length: 'Knee Length', Sleeve: 'Three Quarter', Care: 'Machine Wash' },
  },
  {
    id: 'prod-jeans-001',
    name: 'High-Rise Slim Fit Jeans',
    description: 'Premium denim high-rise slim fit jeans with stretch comfort for all-day wear.',
    price: 2199,
    category: 'jeans',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop'],
    rating: 4.5,
    reviewCount: 312,
    variants: [
      { size: '28', color: 'Indigo', stock: 25, sku: 'HRJ-28-IND' },
      { size: '30', color: 'Indigo', stock: 30, sku: 'HRJ-30-IND' },
      { size: '32', color: 'Black', stock: 18, sku: 'HRJ-32-BLK' },
    ],
    tags: ['jeans', 'denim', 'casual'],
    specifications: { Fabric: '98% Cotton, 2% Elastane', Rise: 'High', Fit: 'Slim', Care: 'Machine Wash' },
  },
  {
    id: 'prod-handbag-001',
    name: 'Leather Crossbody Handbag',
    description: 'Premium leather crossbody handbag with adjustable strap and multiple compartments.',
    price: 3499,
    category: 'handbags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop'],
    rating: 4.6,
    reviewCount: 89,
    variants: [
      { size: 'Medium', color: 'Tan', stock: 14, sku: 'LCH-M-TAN' },
      { size: 'Medium', color: 'Black', stock: 20, sku: 'LCH-M-BLK' },
    ],
    tags: ['handbag', 'leather', 'accessories'],
    specifications: { Material: 'Genuine Leather', Dimensions: '25 x 18 x 8 cm', Strap: 'Adjustable', Care: 'Leather conditioner' },
  },
  {
    id: 'prod-necklace-001',
    name: 'Pearl Layered Necklace',
    description: 'Elegant layered pearl necklace with gold-tone chain, perfect for weddings and formal events.',
    price: 1499,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop'],
    rating: 4.8,
    reviewCount: 67,
    variants: [{ size: 'Adjustable', color: 'Pearl White', stock: 22, sku: 'PLN-ADJ-PW' }],
    tags: ['necklace', 'pearl', 'wedding'],
    specifications: { Material: 'Freshwater Pearls', Length: '40-45 cm', Clasp: 'Lobster', Care: 'Avoid water' },
  },
  {
    id: 'prod-shoes-001',
    name: 'Embellished Heeled Sandals',
    description: 'Stunning embellished heeled sandals with crystal details, ideal for weddings and parties.',
    price: 2799,
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop'],
    rating: 4.4,
    reviewCount: 54,
    variants: [
      { size: '6', color: 'Gold', stock: 8, sku: 'EHS-6-GOLD' },
      { size: '7', color: 'Gold', stock: 10, sku: 'EHS-7-GOLD' },
      { size: '8', color: 'Silver', stock: 6, sku: 'EHS-8-SIL' },
    ],
    tags: ['shoes', 'heels', 'wedding'],
    specifications: { 'Heel Height': '3 inches', Material: 'Synthetic', Sole: 'Rubber', Care: 'Wipe clean' },
  },
  {
    id: 'prod-jacket-001',
    name: 'Tailored Blazer Jacket',
    description: 'Structured tailored blazer in premium fabric, versatile for office and evening wear.',
    price: 3999,
    category: 'jackets',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop'],
    rating: 4.5,
    reviewCount: 43,
    variants: [
      { size: 'S', color: 'Navy', stock: 7, sku: 'TBJ-S-NAV' },
      { size: 'M', color: 'Navy', stock: 9, sku: 'TBJ-M-NAV' },
      { size: 'L', color: 'Black', stock: 5, sku: 'TBJ-L-BLK' },
    ],
    tags: ['jacket', 'blazer', 'formal'],
    specifications: { Fabric: 'Wool Blend', Fit: 'Slim', Lining: 'Polyester', Care: 'Dry Clean Only' },
  },
  ...catalogExpansion,
];

// Every product is assigned its own local illustration while the existing
// product image contract remains unchanged for the API and frontend.
export const products: Product[] = seededProducts.map((product) => {
  const image = productImagePath(product.id);
  return { ...product, image, images: [image] };
});

export const demoOrder: Order = {
  id: 'order-001',
  orderNumber: 'AC-10429',
  productId: FEATURED_PRODUCT_ID,
  productName: 'Wine Satin Wedding Dress',
  productImage: products[0].image,
  amount: 4299,
  quantity: 1,
  size: 'M',
  color: 'Wine',
  status: 'confirmed',
  paymentStatus: 'success',
  createdAt: new Date(),
  customerName: 'Priya Sharma',
  customerEmail: 'priya.sharma@email.com',
  shippingAddress: '42, Green Park Extension, New Delhi - 110016',
  isAiBuyerOrder: true,
  aiMatchScore: 94,
  timeline: [
    { id: 't1', label: 'Order Placed', timestamp: new Date(), status: 'completed' },
    { id: 't2', label: 'Payment Confirmed', timestamp: new Date(), status: 'completed' },
    { id: 't3', label: 'Processing', timestamp: new Date(), status: 'current' },
    { id: 't4', label: 'Shipped', timestamp: new Date(), status: 'pending' },
    { id: 't5', label: 'Delivered', timestamp: new Date(), status: 'pending' },
  ],
};

export const aiRecommendations: AIRecommendation[] = [
  {
    id: 'rec-001',
    type: 'cross-sell',
    title: 'Wedding Dress + Gold Statement Earrings',
    description: 'Customers purchasing wedding dresses are frequently interested in statement earrings. Pairing these products could increase average order value.',
    productIds: [FEATURED_PRODUCT_ID, CROSS_SELL_PRODUCT_ID],
    expectedImpact: 'Increase average order value by 18%',
    revenueImpact: 799,
    status: 'pending',
    createdAt: new Date(),
  },
  {
    id: 'rec-002',
    type: 'bundle',
    title: 'Complete Wedding Look Bundle',
    description: 'Bundle wedding dress with earrings and necklace for a complete bridal look at a discounted price.',
    productIds: [FEATURED_PRODUCT_ID, CROSS_SELL_PRODUCT_ID, 'prod-necklace-001'],
    expectedImpact: 'Boost bundle conversion by 25%',
    revenueImpact: 2299,
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'rec-003',
    type: 'upsell',
    title: 'Premium Banarasi Silk Upgrade',
    description: 'Customers browsing wedding dresses may upgrade to premium Banarasi silk sarees for traditional weddings.',
    productIds: ['prod-saree-001'],
    expectedImpact: 'Increase premium category revenue',
    revenueImpact: 4700,
    status: 'approved',
    createdAt: new Date(Date.now() - 172800000),
  },
];

export const aiInsights: AIInsight[] = [
  {
    id: 'insight-001',
    type: 'cross-sell',
    title: 'Cross-sell opportunity detected',
    description: 'Customers purchasing wedding dresses are frequently interested in earrings.',
    impact: 'Potential +₹799 per order',
    createdAt: new Date(),
  },
  {
    id: 'insight-002',
    type: 'pattern',
    title: 'Customer pattern detected',
    description: 'AI Buyer searches for wine-colored wedding attire increased 34% this week.',
    impact: 'Optimize wine color inventory',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'insight-003',
    type: 'upsell',
    title: 'Upsell opportunity found',
    description: 'Customers with budgets under ₹5,000 often accept accessories when shown at checkout.',
    impact: 'Cart cross-sell conversion: 28%',
    createdAt: new Date(Date.now() - 7200000),
  },
];

export const auditEvents: AuditEvent[] = [
  { id: 'audit-001', timestamp: new Date(Date.now() - 300000), event: 'AI Buyer searched products', actor: 'AI Buyer', status: 'info', relatedProduct: 'Wine Satin Wedding Dress' },
  { id: 'audit-002', timestamp: new Date(Date.now() - 240000), event: 'AI Buyer created cart', actor: 'AI Buyer', status: 'info', relatedProduct: 'Wine Satin Wedding Dress' },
  { id: 'audit-003', timestamp: new Date(Date.now() - 180000), event: 'Purchase policy evaluated', actor: 'System', status: 'info' },
  { id: 'audit-004', timestamp: new Date(Date.now() - 120000), event: 'Purchase approved', actor: 'System', status: 'success', relatedOrder: 'AC-10429' },
  { id: 'audit-005', timestamp: new Date(Date.now() - 60000), event: 'Payment initiated', actor: 'System', status: 'info', relatedOrder: 'AC-10429' },
  { id: 'audit-006', timestamp: new Date(), event: 'Order created', actor: 'System', status: 'success', relatedOrder: 'AC-10429' },
  { id: 'audit-007', timestamp: new Date(), event: 'AI Merchant analyzed order', actor: 'AI Merchant', status: 'info', relatedOrder: 'AC-10429' },
  { id: 'audit-008', timestamp: new Date(), event: 'Cross-sell recommendation generated', actor: 'AI Merchant', status: 'success' },
];

export const merchantMetrics: MerchantMetrics = {
  totalRevenue: 284750,
  aiAttributedRevenue: 4299,
  orders: 156,
  conversionRate: 3.2,
  averageOrderValue: 1825,
  aiBuyerOrders: 1,
};

export const analyticsData: AnalyticsData = {
  revenueTrend: [
    { date: 'Mon', revenue: 32000, aiRevenue: 0 },
    { date: 'Tue', revenue: 28500, aiRevenue: 0 },
    { date: 'Wed', revenue: 35200, aiRevenue: 0 },
    { date: 'Thu', revenue: 41800, aiRevenue: 0 },
    { date: 'Fri', revenue: 38900, aiRevenue: 0 },
    { date: 'Sat', revenue: 45200, aiRevenue: 0 },
    { date: 'Sun', revenue: 4299, aiRevenue: 4299 },
  ],
  ordersTrend: [
    { date: 'Mon', orders: 18, aiOrders: 0 },
    { date: 'Tue', orders: 15, aiOrders: 0 },
    { date: 'Wed', orders: 22, aiOrders: 0 },
    { date: 'Thu', orders: 24, aiOrders: 0 },
    { date: 'Fri', orders: 21, aiOrders: 0 },
    { date: 'Sat', orders: 28, aiOrders: 0 },
    { date: 'Sun', orders: 1, aiOrders: 1 },
  ],
  productPerformance: [
    { name: 'Wine Satin Wedding Dress', revenue: 42990, orders: 10, aiOrders: 1 },
    { name: 'Banarasi Silk Saree', revenue: 35996, orders: 4, aiOrders: 0 },
    { name: 'Gold Statement Earrings', revenue: 15980, orders: 20, aiOrders: 0 },
    { name: 'Embroidered Cotton Kurti', revenue: 12990, orders: 10, aiOrders: 0 },
    { name: 'High-Rise Slim Fit Jeans', revenue: 21990, orders: 10, aiOrders: 0 },
  ],
  conversionMetrics: {
    totalVisitors: 4850,
    aiBuyerSessions: 124,
    conversionRate: 3.2,
    aiConversionRate: 4.8,
    averageOrderValue: 1825,
    aiAverageOrderValue: 4299,
  },
};

export const aiBuyerActivities: AIBuyerActivity[] = [
  { id: 'act-001', type: 'search', query: 'wine-colored wedding dress under ₹5,000 size M', timestamp: new Date(Date.now() - 300000) },
  { id: 'act-002', type: 'view', productId: FEATURED_PRODUCT_ID, productName: 'Wine Satin Wedding Dress', matchScore: 94, timestamp: new Date(Date.now() - 240000) },
  { id: 'act-003', type: 'cart', productId: FEATURED_PRODUCT_ID, productName: 'Wine Satin Wedding Dress', matchScore: 94, timestamp: new Date(Date.now() - 180000) },
  { id: 'act-004', type: 'purchase', productId: FEATURED_PRODUCT_ID, productName: 'Wine Satin Wedding Dress', matchScore: 94, revenue: 4299, timestamp: new Date() },
];

export const DEMO_QUERY = 'I need a wine-colored wedding dress under ₹5,000, size M.';

export const categoryLabels: Record<string, string> = {
  'wedding-dresses': 'Wedding Dresses',
  dresses: 'Dresses',
  sarees: 'Sarees',
  kurtis: 'Kurtis',
  shirts: 'Shirts',
  't-shirts': 'T-Shirts',
  jeans: 'Jeans',
  trousers: 'Trousers',
  jackets: 'Jackets',
  shoes: 'Shoes',
  handbags: 'Handbags',
  earrings: 'Earrings',
  necklaces: 'Necklaces',
  'wedding-accessories': 'Wedding Accessories',
  'party-wear': 'Party Wear',
};

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

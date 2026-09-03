export const categoriesData = [
  {
    name: "Women's Dresses",
    slug: "women-dresses",
    gender: "women",
    description: "Haute couture evening gowns, silk midi silhouettes, and effortless day dresses.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    name: "Women's Tops & Blouses",
    slug: "women-tops",
    gender: "women",
    description: "Artisanal silk tops, sculpted satin blouses, and tailored daywear.",
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    name: "Women's Bottoms",
    slug: "women-bottoms",
    gender: "women",
    description: "Wide-leg pleated trousers, satin slip skirts, and contemporary denim.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    name: "Men's Sartorial Shirts",
    slug: "men-shirts",
    gender: "men",
    description: "Egyptian cotton oxford shirts, linen overshirts, and evening dress shirts.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    name: "Men's Tailored Suits & Blazers",
    slug: "men-suits",
    gender: "men",
    description: "Italian merino wool blazers, double-breasted suits, and refined jackets.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    name: "Men's Trousers & Chinos",
    slug: "men-trousers",
    gender: "men",
    description: "Pleated tailored trousers, premium selvedge denim, and cashmere joggers.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    name: "Artisanal Footwear",
    slug: "footwear",
    gender: "unisex",
    description: "Handcrafted Italian leather oxfords, minimalist suede loafers, and designer heels.",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    name: "Luxury Accessories & Bags",
    slug: "accessories",
    gender: "unisex",
    description: "Full-grain calfskin leather totes, statement gold jewelry, and silk foulards.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    featured: true
  }
];

export const productsData = [
  // 1. Women's Dresses
  {
    name: "Silk Velvet Evening Gala Gown",
    slug: "silk-velvet-evening-gala-gown",
    categorySlug: "women-dresses",
    brand: "Luxe Atelier",
    gender: "women",
    price: 6499,
    originalPrice: 8999,
    description: "Crafted from sumptuous silk velvet with a dramatic cowl neckline and a graceful sweeping train. Designed for gala evenings and red carpet entrances.",
    shortDescription: "Dramatic silk velvet gown with fluid drape and couture tailoring.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Emerald Green", "Midnight Obsidian", "Burgundy Wine"],
    sizes: ["XS", "S", "M", "L"],
    stock: 12,
    ratingsAverage: 4.9,
    ratingsQuantity: 48,
    featured: true,
    trending: true,
    isNewArrival: true,
    tags: ["evening", "gown", "velvet", "luxury", "formal"],
    material: "100% Silk Velvet with Satin Crepe Lining"
  },
  {
    name: "Pleated Georgette Midi Dress",
    slug: "pleated-georgette-midi-dress",
    categorySlug: "women-dresses",
    brand: "Aura Paris",
    gender: "women",
    price: 4299,
    originalPrice: 5999,
    description: "An ethereal sunray-pleated midi dress featuring delicate bishop sleeves and an cinched waist with matching belt.",
    shortDescription: "Sunray-pleated georgette dress with subtle gold thread accents.",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Champagne Cream", "Soft Rose", "Cerulean Blue"],
    sizes: ["S", "M", "L"],
    stock: 18,
    ratingsAverage: 4.8,
    ratingsQuantity: 34,
    featured: true,
    trending: false,
    isNewArrival: true,
    tags: ["midi", "pleated", "spring", "party"],
    material: "100% Recycled Poly Georgette with Habotai Silk Lining"
  },
  {
    name: "Sculpted Satin Column Slip Dress",
    slug: "sculpted-satin-column-slip-dress",
    categorySlug: "women-dresses",
    brand: "Maison Celeste",
    gender: "women",
    price: 3499,
    originalPrice: 4499,
    description: "Cut on the bias for a liquid-like drape, this minimalist slip dress is a masterclass in understated modern sensuality.",
    shortDescription: "Heavyweight satin slip dress with architectural low back.",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Champagne Gold", "Obsidian Black", "Pearl Ivory"],
    sizes: ["XS", "S", "M", "L"],
    stock: 22,
    ratingsAverage: 4.7,
    ratingsQuantity: 29,
    featured: false,
    trending: true,
    isNewArrival: false,
    tags: ["satin", "minimalist", "slip", "cocktail"],
    material: "95% Mulberry Silk Satin, 5% Elastane"
  },

  // 2. Women's Tops & Blouses
  {
    name: "Organza Wrap Peplum Blouse",
    slug: "organza-wrap-peplum-blouse",
    categorySlug: "women-tops",
    brand: "Luxe Atelier",
    gender: "women",
    price: 2899,
    originalPrice: 3899,
    description: "Structured sheer organza wrap blouse with dramatic voluminous puff sleeves and an adjustable sash tie waist.",
    shortDescription: "Sheer silk organza wrap blouse with couture puff sleeves.",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Ivory Mist", "Onyx Black"],
    sizes: ["XS", "S", "M", "L"],
    stock: 14,
    ratingsAverage: 4.8,
    ratingsQuantity: 19,
    featured: false,
    trending: true,
    isNewArrival: true,
    tags: ["blouse", "organza", "statement", "editorial"],
    material: "100% Silk Organza"
  },
  {
    name: "Cashmere Ribbed Knit Halter Top",
    slug: "cashmere-ribbed-knit-halter-top",
    categorySlug: "women-tops",
    brand: "Solstice Atelier",
    gender: "women",
    price: 2199,
    originalPrice: 2999,
    description: "Spun from feather-light Grade-A Mongolian cashmere with a refined ribbed texture and cross-back halter straps.",
    shortDescription: "Featherlight Mongolian cashmere ribbed halter top.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Camel Beige", "Oatmeal Heather", "Charcoal"],
    sizes: ["S", "M", "L"],
    stock: 25,
    ratingsAverage: 4.9,
    ratingsQuantity: 41,
    featured: true,
    trending: false,
    isNewArrival: false,
    tags: ["cashmere", "knitwear", "summer", "essentials"],
    material: "100% Mongolian Cashmere"
  },

  // 3. Women's Bottoms
  {
    name: "High-Waisted Pleated Palazzo Trousers",
    slug: "high-waisted-pleated-palazzo-trousers",
    categorySlug: "women-bottoms",
    brand: "Aura Paris",
    gender: "women",
    price: 3299,
    originalPrice: 4299,
    description: "Cut with a dramatic wide-leg silhouette from fluid tropical wool crepe. Features razor-sharp front pleats and concealed closure.",
    shortDescription: "Fluid tropical wool palazzo trousers with deep pleats.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Ivory Ecru", "Obsidian Black", "Olive Drab"],
    sizes: ["26", "28", "30", "32"],
    stock: 16,
    ratingsAverage: 4.6,
    ratingsQuantity: 22,
    featured: false,
    trending: false,
    isNewArrival: true,
    tags: ["trousers", "palazzo", "tailored", "office"],
    material: "100% Virgin Wool Crepe"
  },

  // 4. Men's Sartorial Shirts
  {
    name: "Sea Island Cotton Spread Collar Shirt",
    slug: "sea-island-cotton-spread-collar-shirt",
    categorySlug: "men-shirts",
    brand: "Monarch & Co.",
    gender: "men",
    price: 3199,
    originalPrice: 4499,
    description: "Crafted from rare 140s two-ply West Indian Sea Island cotton. Finished with genuine Australian mother-of-pearl buttons.",
    shortDescription: "Ultra-fine 140s Sea Island cotton shirt with French cuffs.",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Crisp White", "Sky Blue", "French Navy"],
    sizes: ["38", "39", "40", "42", "44"],
    stock: 30,
    ratingsAverage: 4.9,
    ratingsQuantity: 53,
    featured: true,
    trending: true,
    isNewArrival: false,
    tags: ["shirt", "cotton", "business", "luxury", "formal"],
    material: "100% West Indian Sea Island Cotton"
  },
  {
    name: "Normandy Linen Camp Collar Overshirt",
    slug: "normandy-linen-camp-collar-overshirt",
    categorySlug: "men-shirts",
    brand: "Sartoria Milano",
    gender: "men",
    price: 2699,
    originalPrice: 3499,
    description: "Woven in Normandy from French flax linen. Breathable, relaxed, and elevated with tonal horn buttons and utility chest pockets.",
    shortDescription: "Relaxed French linen overshirt with resort camp collar.",
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Natural Sand", "Sage Green", "Indigo Blue"],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 20,
    ratingsAverage: 4.8,
    ratingsQuantity: 28,
    featured: false,
    trending: true,
    isNewArrival: true,
    tags: ["linen", "overshirt", "resort", "summer"],
    material: "100% Normandy Flax Linen"
  },

  // 5. Men's Tailored Suits & Blazers
  {
    name: "Super 150s Wool Double-Breasted Blazer",
    slug: "super-150s-wool-double-breasted-blazer",
    categorySlug: "men-suits",
    brand: "Monarch & Co.",
    gender: "men",
    price: 8999,
    originalPrice: 12999,
    description: "An iconic 6x2 double-breasted jacket tailored in Biella, Italy with peak lapels, cupro lining, and hand-stitched roped shoulders.",
    shortDescription: "Hand-tailored Biella wool double-breasted blazer with peak lapels.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Midnight Navy", "Charcoal Glen Plaid", "Camel Tan"],
    sizes: ["38R", "40R", "42R", "44R"],
    stock: 10,
    ratingsAverage: 5.0,
    ratingsQuantity: 37,
    featured: true,
    trending: true,
    isNewArrival: false,
    tags: ["blazer", "suit", "wool", "bespoke", "formal"],
    material: "100% Super 150s Merino Wool with Bemberg Cupro Lining"
  },
  {
    name: "Unstructured Silk-Linen Blend Safari Jacket",
    slug: "unstructured-silk-linen-blend-safari-jacket",
    categorySlug: "men-suits",
    brand: "Sartoria Milano",
    gender: "men",
    price: 5499,
    originalPrice: 7499,
    description: "Combining the structure of tailoring with the laidback ease of outerwear. Features four bellows pockets and an internal drawstring waist.",
    shortDescription: "Unstructured Italian silk-linen hybrid safari jacket.",
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Tobacco Brown", "Desert Olive", "Cream Sand"],
    sizes: ["M", "L", "XL"],
    stock: 15,
    ratingsAverage: 4.7,
    ratingsQuantity: 18,
    featured: false,
    trending: false,
    isNewArrival: true,
    tags: ["safari", "jacket", "linen", "smart-casual"],
    material: "60% Linen, 40% Tussar Silk"
  },

  // 6. Men's Trousers
  {
    name: "Gurkha Waistband Italian Wool Trousers",
    slug: "gurkha-waistband-italian-wool-trousers",
    categorySlug: "men-trousers",
    brand: "Monarch & Co.",
    gender: "men",
    price: 3799,
    originalPrice: 4999,
    description: "Traditional military heritage meets modern tailoring. Features distinctive cross-over buckle side adjusters and a high-rise tapered leg.",
    shortDescription: "Gurkha side-fastener trousers in high-twist fresco wool.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Stone Grey", "Espresso Brown", "Dark Navy"],
    sizes: ["30", "32", "34", "36"],
    stock: 20,
    ratingsAverage: 4.8,
    ratingsQuantity: 26,
    featured: false,
    trending: true,
    isNewArrival: false,
    tags: ["gurkha", "trousers", "high-waist", "classic"],
    material: "100% High-Twist Fresco Wool"
  },

  // 7. Artisanal Footwear
  {
    name: "Goodyear-Welted Oxford Leather Shoes",
    slug: "goodyear-welted-oxford-leather-shoes",
    categorySlug: "footwear",
    brand: "Monarch & Co.",
    gender: "men",
    price: 5999,
    originalPrice: 7999,
    description: "Handcrafted in Florence using full-grain French box calf leather and traditional 360-degree Goodyear welt construction.",
    shortDescription: "French calfskin cap-toe oxfords with Goodyear welted leather sole.",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Mahogany Burnished", "Midnight Black", "Chestnut Brown"],
    sizes: ["7", "8", "9", "10", "11"],
    stock: 14,
    ratingsAverage: 4.9,
    ratingsQuantity: 62,
    featured: true,
    trending: true,
    isNewArrival: false,
    tags: ["shoes", "oxford", "leather", "goodyear", "formal"],
    material: "100% French Box Calf Leather, Oak Bark Tanned Leather Sole"
  },
  {
    name: "Handmade Suede Bit Driving Loafers",
    slug: "handmade-suede-bit-driving-loafers",
    categorySlug: "footwear",
    brand: "Sartoria Milano",
    gender: "men",
    price: 4499,
    originalPrice: 5999,
    description: "Supple Italian calf suede with antique brass horsebit hardware and pebble rubber driving soles for glove-like comfort.",
    shortDescription: "Italian calf suede driving loafers with brass horsebit.",
    images: [
      "https://images.unsplash.com/photo-1582895181286-2b8233b04048?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Snuff Suede", "Navy Blue Suede", "Slate Grey"],
    sizes: ["7", "8", "9", "10", "11"],
    stock: 18,
    ratingsAverage: 4.8,
    ratingsQuantity: 44,
    featured: false,
    trending: true,
    isNewArrival: true,
    tags: ["loafers", "suede", "driving-shoes", "casual"],
    material: "100% Italian Calf Suede with Natural Gum Sole"
  },
  {
    name: "Architectural Sculpted Heel Sandals",
    slug: "architectural-sculpted-heel-sandals",
    categorySlug: "footwear",
    brand: "Luxe Atelier",
    gender: "women",
    price: 4899,
    originalPrice: 6499,
    description: "Features a geometric gold-dipped sculptural block heel, minimal leather strap crossover, and a square open toe.",
    shortDescription: "Metallic sculpted-heel sandals in supple Nappa leather.",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Gilded Gold", "Nappa Obsidian", "Ivory Cream"],
    sizes: ["36", "37", "38", "39", "40"],
    stock: 12,
    ratingsAverage: 4.9,
    ratingsQuantity: 31,
    featured: true,
    trending: true,
    isNewArrival: true,
    tags: ["heels", "sandals", "gold", "evening", "designer"],
    material: "100% Italian Nappa Leather with 24K Gold-Plated Resin Heel"
  },
  {
    name: "Minimalist Calfskin Court Sneakers",
    slug: "minimalist-calfskin-court-sneakers",
    categorySlug: "footwear",
    brand: "Aura Paris",
    gender: "unisex",
    price: 3999,
    originalPrice: 5299,
    description: "Low-profile court silhouette engineered in Portugal from butter-soft Italian calfskin with Margom stitched rubber cupsole.",
    shortDescription: "Low-profile Italian leather sneakers with Margom rubber cupsole.",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["All White", "White / Gum Sole", "Obsidian / White"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    stock: 28,
    ratingsAverage: 4.7,
    ratingsQuantity: 75,
    featured: false,
    trending: true,
    isNewArrival: false,
    tags: ["sneakers", "leather", "streetwear", "minimalist"],
    material: "100% Italian Full-Grain Calfskin, Margom Sole"
  },

  // 8. Luxury Accessories & Bags
  {
    name: "Structured Calfskin Top-Handle Satchel",
    slug: "structured-calfskin-top-handle-satchel",
    categorySlug: "accessories",
    brand: "Maison Celeste",
    gender: "women",
    price: 7499,
    originalPrice: 9999,
    description: "Hand-stitched in Tuscany with rigid saddle architecture, polished 24K gold lock clasp, and detachable shoulder strap.",
    shortDescription: "Hand-stitched Tuscan calfskin satchel with 24K gold hardware.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Cognac Tan", "Noir Black", "Bordeaux Red"],
    sizes: ["One Size"],
    stock: 8,
    ratingsAverage: 5.0,
    ratingsQuantity: 39,
    featured: true,
    trending: true,
    isNewArrival: true,
    tags: ["handbag", "leather", "tote", "luxury", "gold"],
    material: "100% Vegetable-Tanned Tuscan Calfskin Leather"
  },
  {
    name: "24K Gold Vermeil Sculptural Chain Necklace",
    slug: "24k-gold-vermeil-sculptural-chain-necklace",
    categorySlug: "accessories",
    brand: "Solstice Jewelry",
    gender: "unisex",
    price: 3199,
    originalPrice: 4299,
    description: "Substantial interlocking organic links crafted in 925 Sterling Silver plated with a heavy 3.5-micron layer of 24K yellow gold.",
    shortDescription: "Hand-cast organic chain necklace in 24K gold vermeil.",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["24K Yellow Gold", "Polished Silver"],
    sizes: ["45cm", "50cm"],
    stock: 20,
    ratingsAverage: 4.9,
    ratingsQuantity: 88,
    featured: true,
    trending: false,
    isNewArrival: true,
    tags: ["jewelry", "necklace", "gold", "vermeil", "gift"],
    material: "925 Sterling Silver with 24K Gold Vermeil Plating"
  },
  {
    name: "Hand-Rolled Mulberry Silk Twill Scarf",
    slug: "hand-rolled-mulberry-silk-twill-scarf",
    categorySlug: "accessories",
    brand: "Aura Paris",
    gender: "women",
    price: 1999,
    originalPrice: 2799,
    description: "Featuring a custom geometric celestial print inspired by the cosmos. Finished with hand-rolled edges in Lake Como.",
    shortDescription: "Lake Como 18mm silk twill scarf with hand-rolled hems.",
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Celestial Gold / Navy", "Flora Rose / Sage"],
    sizes: ["90cm x 90cm"],
    stock: 35,
    ratingsAverage: 4.8,
    ratingsQuantity: 19,
    featured: false,
    trending: false,
    isNewArrival: false,
    tags: ["scarf", "silk", "accessories", "print"],
    material: "100% 18mm Mulberry Silk Twill"
  },
  {
    name: "Titanium Aviator Sunglasses with Polarized Lenses",
    slug: "titanium-aviator-sunglasses-polarized",
    categorySlug: "accessories",
    brand: "Monarch & Co.",
    gender: "unisex",
    price: 3699,
    originalPrice: 4999,
    description: "Ultralight Japanese beta-titanium frames fitted with scratch-resistant nylon polarized lenses offering 100% UVA/UVB defense.",
    shortDescription: "Japanese beta-titanium aviators with anti-reflective polarized optics.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["Brushed Gold / G15 Green", "Matte Gunmetal / Dark Grey"],
    sizes: ["Standard Fit"],
    stock: 15,
    ratingsAverage: 4.8,
    ratingsQuantity: 42,
    featured: false,
    trending: true,
    isNewArrival: false,
    tags: ["eyewear", "sunglasses", "titanium", "polarized"],
    material: "100% Japanese Beta-Titanium with CR-39 Lenses"
  },
  {
    name: "Full-Grain Leather Briefcase & Laptop Messenger",
    slug: "full-grain-leather-briefcase-messenger",
    categorySlug: "accessories",
    brand: "Monarch & Co.",
    gender: "men",
    price: 6899,
    originalPrice: 8999,
    description: "Engineered for modern executives with padded compartments for up to a 16-inch MacBook Pro, solid brass hardware, and trolley sleeve.",
    shortDescription: "Vegetable-tanned full grain leather executive briefcase.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80"
    ],
    colors: ["British Tan", "Espresso Dark Brown", "Charcoal Black"],
    sizes: ["One Size (16L)"],
    stock: 10,
    ratingsAverage: 4.9,
    ratingsQuantity: 27,
    featured: false,
    trending: false,
    isNewArrival: true,
    tags: ["briefcase", "leather", "bag", "work", "laptop"],
    material: "100% Full-Grain Vegetable Tanned Cowhide with Cotton Canvas Lining"
  }
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Air Max 270",
    brand: "Nike",
    cat: "adulto",
    price: 25900,
    tag: "Nuevo",
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format",
    stock: { 38: 5, 39: 8, 40: 12, 41: 7, 42: 3, 43: 2 }
  },
  {
    id: 2,
    name: "Ultraboost 23",
    brand: "Adidas",
    cat: "adulto",
    price: 32900,
    tag: null,
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&auto=format",
    stock: { 39: 3, 40: 6, 41: 10, 42: 8, 43: 4, 44: 2 }
  },
  {
    id: 3,
    name: "RS-X3 Puzzle",
    brand: "Puma",
    cat: "adulto",
    price: 21900,
    tag: "Oferta",
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1597045566677-8e7a7b1f7b1b?w=400&h=400&fit=crop&auto=format",
    stock: { 37: 2, 38: 4, 39: 6, 40: 9, 41: 5, 42: 1 }
  },
  {
    id: 4,
    name: "574 Classic",
    brand: "New Balance",
    cat: "adulto",
    price: 28900,
    tag: null,
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&auto=format",
    stock: { 38: 7, 39: 10, 40: 15, 41: 12, 42: 6, 43: 3 }
  },
  {
    id: 5,
    name: "Old Skool",
    brand: "Vans",
    cat: "adulto",
    price: 18900,
    tag: null,
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1608256241900-0b4b5e0c3e9b?w=400&h=400&fit=crop&auto=format",
    stock: { 36: 4, 37: 6, 38: 8, 39: 11, 40: 9, 41: 5, 42: 2 }
  },
  {
    id: 6,
    name: "Air Force 1",
    brand: "Nike",
    cat: "adulto",
    price: 29900,
    tag: "Destacado",
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop&auto=format",
    stock: { 39: 2, 40: 5, 41: 8, 42: 10, 43: 4, 44: 1 }
  },
  {
    id: 7,
    name: "Forum Low",
    brand: "Adidas",
    cat: "adulto",
    price: 24900,
    tag: null,
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1605405912354-1c5e4c5e8c3d?w=400&h=400&fit=crop&auto=format",
    stock: { 37: 3, 38: 7, 39: 9, 40: 11, 41: 6, 42: 4 }
  },
  {
    id: 8,
    name: "Speedcat Pro",
    brand: "Puma",
    cat: "adulto",
    price: 23900,
    tag: null,
    active: true,
    emoji: "👟",
    image: "https://images.unsplash.com/photo-1600186341546-5c5c5c5c5c5c?w=400&h=400&fit=crop&auto=format",
    stock: { 38: 4, 39: 6, 40: 8, 41: 5, 42: 2 }
  },
  {
    id: 9,
    name: "Flex Runner 2",
    brand: "Nike",
    cat: "nino",
    price: 15900,
    tag: "Nuevo",
    active: true,
    emoji: "🧒",
    image: "https://images.unsplash.com/photo-1512374382149-233c42b90a5b?w=400&h=400&fit=crop&auto=format",
    stock: { 24: 5, 25: 8, 26: 10, 27: 12, 28: 7, 29: 4, 30: 2 }
  },
  {
    id: 10,
    name: "RS-X Kids",
    brand: "Puma",
    cat: "nino",
    price: 13900,
    tag: null,
    active: true,
    emoji: "🧒",
    image: "https://images.unsplash.com/photo-1562183241-b937b95585f6?w=400&h=400&fit=crop&auto=format",
    stock: { 23: 3, 24: 6, 25: 9, 26: 8, 27: 5, 28: 3 }
  },
  {
    id: 11,
    name: "Superstar 360",
    brand: "Adidas",
    cat: "nino",
    price: 14900,
    tag: null,
    active: true,
    emoji: "🧒",
    image: "https://images.unsplash.com/photo-1595341068016-75e2c5e8c6c0?w=400&h=400&fit=crop&auto=format",
    stock: { 22: 4, 23: 7, 24: 10, 25: 11, 26: 6, 27: 3 }
  },
  {
    id: 12,
    name: "Top List",
    brand: "Topper",
    cat: "nino",
    price: 9900,
    tag: "Oferta",
    active: true,
    emoji: "🧒",
    image: "https://images.unsplash.com/photo-1603804653410-56d5c2f3f0c9?w=400&h=400&fit=crop&auto=format",
    stock: { 24: 8, 25: 12, 26: 15, 27: 10, 28: 6, 29: 3, 30: 1 }
  }
];

export default MOCK_PRODUCTS;

// ── Sneaker image URLs (free, from Unsplash — no download needed) ─────────────
// Each ID is a specific Unsplash photo of a real sneaker.
// These load directly in the browser as long as you have internet.
const img = {
  airMax270:         'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  ultraBoost:        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  classicLeather:    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
  chuckTaylor:       'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80',
  oldSkool:          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
  suede:             'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
  gelNimbus:         'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
  freshFoam:         'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  yeezy:             'https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80',
  airJordan:         'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
  dunkLow:           'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
  nmd:               'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80',
  blazer:            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
  stanSmith:         'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
  clubC:             'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
  sk8Hi:             'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80',
  rsx:               'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
  kayano:            'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80',
  nb990:             'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
  airForce1:         'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
  superstar:         'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=600&q=80',
  nanoX3:            'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80',
  era:               'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
  speedcat:          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  gelKayano30:       'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
  // auction
  jordan4:           'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80',
  yeezy700:          'https://images.unsplash.com/photo-1584735175315-9d5df23be620?w=600&q=80',
  travisScott:       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  nb550:             'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  pumaMostro:        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80',
  dunkHighSB:        'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80',
  forumLow:          'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80',
  reebokQuestion:    'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80',
  vansVault:         'https://images.unsplash.com/photo-1520256862855-398228c41684?w=600&q=80',
  gelLyte:           'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80',
  cortez:            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
  gazelle:           'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  chuck70:           'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80',
  clydeCourtPuma:    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
  nb1906r:           'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
}

const desc = {
  Nike:        'Engineered for performance and street style, this Nike silhouette combines responsive cushioning with a sleek upper. Built for all-day comfort whether you\'re hitting the gym or the city.',
  Adidas:      'Crafted with Adidas Boost technology, this shoe delivers unmatched energy return with every step. A modern icon that blends sport heritage with contemporary design.',
  Reebok:      'A timeless classic reimagined for today. Premium leather upper, cushioned midsole, and a clean profile that pairs with anything in your wardrobe.',
  Converse:    'The original canvas sneaker that never goes out of style. Lightweight, versatile, and endlessly customisable — a wardrobe staple since 1917.',
  Vans:        'Born on the skate ramps of California, this Vans silhouette features a durable canvas upper, waffle outsole for grip, and that unmistakable laid-back aesthetic.',
  Puma:        'Where sport meets street. This Puma design features a cushioned footbed, flexible outsole, and bold colourways that make a statement without trying too hard.',
  Asics:       'Powered by Asics GEL technology, this running shoe absorbs shock at impact and toe-off phases, giving you a smooth, stable ride on any surface.',
  'New Balance': 'Precision-engineered in the New Balance tradition. Fresh Foam midsole technology wraps your foot in plush cushioning, while the breathable upper keeps you cool mile after mile.',
}

export const products = [
  { id: 1,  name: 'Air Max 270',          brand: 'Nike',        price: 12499, color: 'Black',  sizes: [6,7,8,9,10,11],    badge: 'New',      description: desc.Nike,         image: img.airMax270      },
  { id: 2,  name: 'Ultra Boost 22',        brand: 'Adidas',      price: 14999, color: 'White',  sizes: [7,8,9,10,11],      badge: 'Hot',      description: desc.Adidas,       image: img.ultraBoost     },
  { id: 3,  name: 'Classic Leather',       brand: 'Reebok',      price: 7499,  color: 'White',  sizes: [6,7,8,9,10],       badge: null,       description: desc.Reebok,       image: img.classicLeather },
  { id: 4,  name: 'Chuck Taylor All Star', brand: 'Converse',    price: 5499,  color: 'Black',  sizes: [5,6,7,8,9,10,11],  badge: null,       description: desc.Converse,     image: img.chuckTaylor    },
  { id: 5,  name: 'Old Skool',             brand: 'Vans',        price: 6299,  color: 'Black',  sizes: [6,7,8,9,10],       badge: 'Sale',     description: desc.Vans,         image: img.oldSkool       },
  { id: 6,  name: 'Suede Classic',         brand: 'Puma',        price: 7999,  color: 'Blue',   sizes: [7,8,9,10,11],      badge: null,       description: desc.Puma,         image: img.suede          },
  { id: 7,  name: 'Gel-Nimbus 25',         brand: 'Asics',       price: 13299, color: 'Red',    sizes: [7,8,9,10],         badge: 'New',      description: desc.Asics,        image: img.gelNimbus      },
  { id: 8,  name: 'Fresh Foam 1080',       brand: 'New Balance', price: 13699, color: 'Grey',   sizes: [6,7,8,9,10,11],    badge: null,       description: desc['New Balance'],image: img.freshFoam      },
  { id: 9,  name: 'Yeezy Boost 350',       brand: 'Adidas',      price: 18399, color: 'Grey',   sizes: [7,8,9,10],         badge: 'Trending', description: desc.Adidas,       image: img.yeezy          },
  { id: 10, name: 'Air Jordan 1 Retro',    brand: 'Nike',        price: 15099, color: 'Red',    sizes: [6,7,8,9,10,11],    badge: 'Trending', description: desc.Nike,         image: img.airJordan      },
  { id: 11, name: 'Dunk Low',              brand: 'Nike',        price: 9199,  color: 'White',  sizes: [7,8,9,10,11],      badge: 'Hot',      description: desc.Nike,         image: img.dunkLow        },
  { id: 12, name: 'NMD R1',               brand: 'Adidas',      price: 10899, color: 'Black',  sizes: [6,7,8,9,10],       badge: 'Trending', description: desc.Adidas,       image: img.nmd            },
  { id: 13, name: 'Blazer Mid 77',         brand: 'Nike',        price: 8799,  color: 'White',  sizes: [7,8,9,10,11],      badge: null,       description: desc.Nike,         image: img.blazer         },
  { id: 14, name: 'Stan Smith',            brand: 'Adidas',      price: 7299,  color: 'White',  sizes: [6,7,8,9,10],       badge: null,       description: desc.Adidas,       image: img.stanSmith      },
  { id: 15, name: 'Club C 85',             brand: 'Reebok',      price: 6499,  color: 'White',  sizes: [6,7,8,9,10,11],    badge: null,       description: desc.Reebok,       image: img.clubC          },
  { id: 16, name: 'Sk8-Hi',               brand: 'Vans',        price: 7199,  color: 'Black',  sizes: [7,8,9,10],         badge: null,       description: desc.Vans,         image: img.sk8Hi          },
  { id: 17, name: 'RS-X',                 brand: 'Puma',        price: 8999,  color: 'White',  sizes: [6,7,8,9,10,11],    badge: 'New',      description: desc.Puma,         image: img.rsx            },
  { id: 18, name: 'Kayano 29',            brand: 'Asics',       price: 14499, color: 'Blue',   sizes: [7,8,9,10,11],      badge: null,       description: desc.Asics,        image: img.kayano         },
  { id: 19, name: '990v5',                brand: 'New Balance', price: 16499, color: 'Grey',   sizes: [6,7,8,9,10],       badge: null,       description: desc['New Balance'],image: img.nb990          },
  { id: 20, name: 'Air Force 1',          brand: 'Nike',        price: 8499,  color: 'White',  sizes: [6,7,8,9,10,11,12], badge: null,       description: desc.Nike,         image: img.airForce1      },
  { id: 21, name: 'Superstar',            brand: 'Adidas',      price: 7999,  color: 'White',  sizes: [6,7,8,9,10],       badge: null,       description: desc.Adidas,       image: img.superstar      },
  { id: 22, name: 'Nano X3',             brand: 'Reebok',      price: 11299, color: 'Black',  sizes: [7,8,9,10,11],      badge: null,       description: desc.Reebok,       image: img.nanoX3         },
  { id: 23, name: 'Era',                  brand: 'Vans',        price: 5299,  color: 'Red',    sizes: [5,6,7,8,9,10],     badge: 'Sale',     description: desc.Vans,         image: img.era            },
  { id: 24, name: 'Speedcat',            brand: 'Puma',        price: 6799,  color: 'Red',    sizes: [6,7,8,9,10,11],    badge: 'New',      description: desc.Puma,         image: img.speedcat       },
  { id: 25, name: 'Gel-Kayano 30',       brand: 'Asics',       price: 15299, color: 'Blue',   sizes: [7,8,9,10,11],      badge: null,       description: desc.Asics,        image: img.gelKayano30    },
]

// Auction shoes — 15 items
const now = Date.now()
const hrs = (h) => now + h * 3600 * 1000

export const auctionShoes = [
  { id: 'A1',  name: 'Air Jordan 4 Retro OG',   brand: 'Nike',        basePrice: 22000, currentBid: 31500, endsAt: hrs(2),  color: 'Black', sizes: [7,8,9,10],      image: img.jordan4,        leaderboard: [{ name: 'Rahul M.', bid: 31500 }, { name: 'Priya S.', bid: 29000 }, { name: 'Arjun K.', bid: 27500 }] },
  { id: 'A2',  name: 'Yeezy 700 Wave Runner',    brand: 'Adidas',      basePrice: 19000, currentBid: 27800, endsAt: hrs(5),  color: 'Grey',  sizes: [8,9,10,11],     image: img.yeezy700,       leaderboard: [{ name: 'Sneha R.', bid: 27800 }, { name: 'Vikram P.', bid: 25000 }, { name: 'Anita L.', bid: 23500 }] },
  { id: 'A3',  name: 'Travis Scott x Air Max 1', brand: 'Nike',        basePrice: 35000, currentBid: 52000, endsAt: hrs(1),  color: 'Brown', sizes: [7,8,9,10,11],   image: img.travisScott,    leaderboard: [{ name: 'Dev T.', bid: 52000 }, { name: 'Meera J.', bid: 48000 }, { name: 'Karan B.', bid: 45000 }] },
  { id: 'A4',  name: 'New Balance 550 Aime',     brand: 'New Balance', basePrice: 14000, currentBid: 19200, endsAt: hrs(8),  color: 'White', sizes: [6,7,8,9,10],    image: img.nb550,          leaderboard: [{ name: 'Pooja V.', bid: 19200 }, { name: 'Rohit S.', bid: 17500 }, { name: 'Nisha K.', bid: 16000 }] },
  { id: 'A5',  name: 'Puma Mostro OG',           brand: 'Puma',        basePrice: 9500,  currentBid: 13400, endsAt: hrs(12), color: 'Red',   sizes: [7,8,9,10],      image: img.pumaMostro,     leaderboard: [{ name: 'Amit C.', bid: 13400 }, { name: 'Riya D.', bid: 12000 }, { name: 'Suresh N.', bid: 11000 }] },
  { id: 'A6',  name: 'Dunk High Pro SB',         brand: 'Nike',        basePrice: 16000, currentBid: 23500, endsAt: hrs(3),  color: 'Blue',  sizes: [8,9,10,11],     image: img.dunkHighSB,     leaderboard: [{ name: 'Kavya M.', bid: 23500 }, { name: 'Tarun P.', bid: 21000 }, { name: 'Lata R.', bid: 19500 }] },
  { id: 'A7',  name: 'Adidas Forum Low',         brand: 'Adidas',      basePrice: 8000,  currentBid: 11200, endsAt: hrs(6),  color: 'White', sizes: [6,7,8,9,10,11], image: img.forumLow,       leaderboard: [{ name: 'Nikhil A.', bid: 11200 }, { name: 'Divya S.', bid: 10000 }, { name: 'Raj K.', bid: 9200 }] },
  { id: 'A8',  name: 'Reebok Question Mid',      brand: 'Reebok',      basePrice: 12000, currentBid: 17800, endsAt: hrs(9),  color: 'Black', sizes: [7,8,9,10],      image: img.reebokQuestion, leaderboard: [{ name: 'Sanjay T.', bid: 17800 }, { name: 'Priti M.', bid: 16000 }, { name: 'Arun V.', bid: 14500 }] },
  { id: 'A9',  name: 'Vans Vault OG Era LX',     brand: 'Vans',        basePrice: 7500,  currentBid: 10500, endsAt: hrs(4),  color: 'Black', sizes: [6,7,8,9,10],    image: img.vansVault,      leaderboard: [{ name: 'Geeta L.', bid: 10500 }, { name: 'Mohan R.', bid: 9500 }, { name: 'Sunita P.', bid: 8800 }] },
  { id: 'A10', name: 'Asics Gel-Lyte III OG',    brand: 'Asics',       basePrice: 11000, currentBid: 15600, endsAt: hrs(7),  color: 'Grey',  sizes: [7,8,9,10,11],   image: img.gelLyte,        leaderboard: [{ name: 'Vivek S.', bid: 15600 }, { name: 'Asha K.', bid: 14000 }, { name: 'Ravi M.', bid: 12800 }] },
  { id: 'A11', name: 'Nike Cortez OG',           brand: 'Nike',        basePrice: 6500,  currentBid: 9200,  endsAt: hrs(10), color: 'White', sizes: [6,7,8,9,10],    image: img.cortez,         leaderboard: [{ name: 'Deepak J.', bid: 9200 }, { name: 'Rekha T.', bid: 8400 }, { name: 'Sunil B.', bid: 7800 }] },
  { id: 'A12', name: 'Adidas Gazelle Indoor',    brand: 'Adidas',      basePrice: 9000,  currentBid: 12800, endsAt: hrs(11), color: 'Blue',  sizes: [7,8,9,10],      image: img.gazelle,        leaderboard: [{ name: 'Manish P.', bid: 12800 }, { name: 'Jyoti S.', bid: 11500 }, { name: 'Anil K.', bid: 10500 }] },
  { id: 'A13', name: 'Converse Chuck 70 Hi',     brand: 'Converse',    basePrice: 5000,  currentBid: 7200,  endsAt: hrs(14), color: 'Red',   sizes: [5,6,7,8,9,10],  image: img.chuck70,        leaderboard: [{ name: 'Puja R.', bid: 7200 }, { name: 'Kiran M.', bid: 6500 }, { name: 'Vinod S.', bid: 6000 }] },
  { id: 'A14', name: 'Puma Clyde Court',         brand: 'Puma',        basePrice: 10000, currentBid: 14200, endsAt: hrs(16), color: 'Black', sizes: [7,8,9,10,11],   image: img.clydeCourtPuma, leaderboard: [{ name: 'Harish T.', bid: 14200 }, { name: 'Smita V.', bid: 13000 }, { name: 'Ajay N.', bid: 12000 }] },
  { id: 'A15', name: 'New Balance 1906R',        brand: 'New Balance', basePrice: 13000, currentBid: 18500, endsAt: hrs(20), color: 'Grey',  sizes: [6,7,8,9,10,11], image: img.nb1906r,        leaderboard: [{ name: 'Ramesh K.', bid: 18500 }, { name: 'Usha P.', bid: 17000 }, { name: 'Girish M.', bid: 15800 }] },
]

export const getOrders = () => [
  {
    id: 'ORD-001', date: '2026-04-10', status: 'Delivered',
    items: [{ ...products[0], selectedSize: 9, qty: 1 }, { ...products[2], selectedSize: 8, qty: 1 }],
    address: { name: 'Arjun Sharma', line: '123, MG Road', city: 'Mumbai', pin: '400001' },
    payment: 'UPI',
    total: 19998,
  },
  {
    id: 'ORD-002', date: '2026-04-20', status: 'Shipped',
    items: [{ ...products[1], selectedSize: 10, qty: 1 }],
    address: { name: 'Arjun Sharma', line: '123, MG Road', city: 'Mumbai', pin: '400001' },
    payment: 'COD',
    total: 14999,
  },
]

export const savedAddresses = [
  { id: 1, name: 'Arjun Sharma',  line: '123, MG Road',       city: 'Mumbai',    pin: '400001', phone: '+91 98765 43210' },
  { id: 2, name: 'Arjun Sharma',  line: '45, Koramangala 5th', city: 'Bangalore', pin: '560095', phone: '+91 98765 43210' },
]

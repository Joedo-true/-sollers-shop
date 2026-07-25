import type { Category, Product } from '../types'
import { expandCatalog } from '../utils/catalog'
import { productIllustration, productPhotoUrl } from '../utils/productImage'

/**
 * Local product catalog — the app's built-in "database".
 *
 * The shop used to fetch everything from the DummyJSON REST API on every load,
 * so on a slow or unstable connection nothing appeared. The catalog now ships
 * with the app: a curated base set of realistic products (below) is grown into
 * a larger assortment with `expandCatalog`, and every item gets a locally
 * generated SVG placeholder image. Result: instant load, works fully offline,
 * zero network dependency.
 */

export const CATEGORIES: Category[] = [
  { slug: 'smartphones', name: 'Смартфоны' },
  { slug: 'laptops', name: 'Ноутбуки' },
  { slug: 'headphones', name: 'Наушники' },
  { slug: 'watches', name: 'Часы' },
  { slug: 'cameras', name: 'Камеры' },
  { slug: 'gaming', name: 'Консоли и игры' },
  { slug: 'tablets', name: 'Планшеты' },
  { slug: 'tv', name: 'Телевизоры' },
  { slug: 'fragrances', name: 'Ароматы' },
  { slug: 'sneakers', name: 'Кроссовки' },
  { slug: 'bags', name: 'Сумки и рюкзаки' },
  { slug: 'home', name: 'Для дома' },
]

/** A product before ids and images are attached. */
type BaseProduct = Omit<Product, 'id' | 'thumbnail' | 'images'>

const BASE_PRODUCTS: BaseProduct[] = [
  // Smartphones
  { title: 'Apple iPhone 15 Pro', brand: 'Apple', category: 'smartphones', price: 1199, discountPercentage: 6, rating: 4.8, stock: 42, description: 'Флагман на чипе A17 Pro с титановым корпусом и камерой 48 Мп.' },
  { title: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'smartphones', price: 1299, discountPercentage: 12, rating: 4.7, stock: 30, description: 'Экран Dynamic AMOLED 2X, стилус S Pen и зум 100×.' },
  { title: 'Xiaomi 14 Pro', brand: 'Xiaomi', category: 'smartphones', price: 899, discountPercentage: 15, rating: 4.5, stock: 55, description: 'Snapdragon 8 Gen 3 и оптика Leica.' },
  { title: 'Google Pixel 8 Pro', brand: 'Google', category: 'smartphones', price: 999, discountPercentage: 8, rating: 4.6, stock: 0, description: 'Чистый Android и лучшая вычислительная фотография.' },

  // Laptops
  { title: 'Apple MacBook Pro 16" M3 Max', brand: 'Apple', category: 'laptops', price: 2499, discountPercentage: 4, rating: 4.9, stock: 18, description: 'Профессиональный ноутбук с экраном Liquid Retina XDR.' },
  { title: 'Dell XPS 15', brand: 'Dell', category: 'laptops', price: 1899, discountPercentage: 10, rating: 4.5, stock: 24, description: 'Безрамочный OLED-дисплей и корпус из алюминия.' },
  { title: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'laptops', price: 1799, discountPercentage: 0, rating: 4.6, stock: 16, description: 'Игровой ультрабук с GeForce RTX и экраном 165 Гц.' },
  { title: 'Lenovo ThinkPad X1 Carbon', brand: 'Lenovo', category: 'laptops', price: 1599, discountPercentage: 14, rating: 4.4, stock: 33, description: 'Лёгкий бизнес-ноутбук с легендарной клавиатурой.' },

  // Headphones
  { title: 'Sony WH-1000XM5', brand: 'Sony', category: 'headphones', price: 399, discountPercentage: 18, rating: 4.8, stock: 60, description: 'Эталонное активное шумоподавление и 30 часов работы.' },
  { title: 'Apple AirPods Pro 2', brand: 'Apple', category: 'headphones', price: 249, discountPercentage: 10, rating: 4.7, stock: 90, description: 'Адаптивный звук и режим прозрачности.' },
  { title: 'Bose QuietComfort Ultra', brand: 'Bose', category: 'headphones', price: 429, discountPercentage: 0, rating: 4.6, stock: 22, description: 'Иммерсивный звук и фирменный комфорт Bose.' },
  { title: 'Sennheiser Momentum 4', brand: 'Sennheiser', category: 'headphones', price: 349, discountPercentage: 12, rating: 4.5, stock: 0, description: 'Аудиофильское звучание и 60 часов автономности.' },

  // Watches
  { title: 'Apple Watch Series 9', brand: 'Apple', category: 'watches', price: 429, discountPercentage: 7, rating: 4.7, stock: 48, description: 'Жест Double Tap, яркий дисплей и датчики здоровья.' },
  { title: 'Samsung Galaxy Watch 6', brand: 'Samsung', category: 'watches', price: 329, discountPercentage: 15, rating: 4.4, stock: 37, description: 'Круглый AMOLED-экран и расширенный мониторинг сна.' },
  { title: 'Garmin Fenix 7', brand: 'Garmin', category: 'watches', price: 699, discountPercentage: 9, rating: 4.8, stock: 14, description: 'Мультиспортивные часы с солнечной зарядкой.' },
  { title: 'Casio G-Shock GA-2100', brand: 'Casio', category: 'watches', price: 99, discountPercentage: 0, rating: 4.6, stock: 120, description: 'Ударопрочный культовый дизайн «CasiOak».' },

  // Cameras
  { title: 'Sony Alpha A7 IV', brand: 'Sony', category: 'cameras', price: 2499, discountPercentage: 5, rating: 4.8, stock: 12, description: 'Полнокадровая беззеркалка 33 Мп для фото и видео.' },
  { title: 'Canon EOS R6 Mark II', brand: 'Canon', category: 'cameras', price: 2499, discountPercentage: 8, rating: 4.7, stock: 9, description: 'Скоростная съёмка до 40 к/с и надёжный автофокус.' },
  { title: 'Fujifilm X-T5', brand: 'Fujifilm', category: 'cameras', price: 1699, discountPercentage: 0, rating: 4.6, stock: 20, description: 'Матрица 40 Мп и фирменные плёночные пресеты.' },
  { title: 'GoPro HERO12 Black', brand: 'GoPro', category: 'cameras', price: 399, discountPercentage: 20, rating: 4.4, stock: 65, description: 'Экшн-камера 5.3K с непревзойдённой стабилизацией.' },

  // Gaming
  { title: 'Sony PlayStation 5 Slim', brand: 'Sony', category: 'gaming', price: 499, discountPercentage: 6, rating: 4.8, stock: 40, description: 'Молниеносный SSD и тактильный геймпад DualSense.' },
  { title: 'Microsoft Xbox Series X', brand: 'Microsoft', category: 'gaming', price: 499, discountPercentage: 10, rating: 4.7, stock: 28, description: 'Игры в 4K/120 к/с и библиотека Game Pass.' },
  { title: 'Nintendo Switch OLED', brand: 'Nintendo', category: 'gaming', price: 349, discountPercentage: 0, rating: 4.7, stock: 75, description: 'Яркий 7" OLED-экран для игры где угодно.' },
  { title: 'Valve Steam Deck OLED', brand: 'Valve', category: 'gaming', price: 649, discountPercentage: 5, rating: 4.6, stock: 0, description: 'Портативный ПК для всей вашей библиотеки Steam.' },

  // Tablets
  { title: 'Apple iPad Pro 12.9" M2', brand: 'Apple', category: 'tablets', price: 1099, discountPercentage: 8, rating: 4.8, stock: 34, description: 'Дисплей Liquid Retina XDR и поддержка Apple Pencil.' },
  { title: 'Samsung Galaxy Tab S9', brand: 'Samsung', category: 'tablets', price: 799, discountPercentage: 14, rating: 4.5, stock: 26, description: 'AMOLED-экран, защита IP68 и стилус в комплекте.' },
  { title: 'Microsoft Surface Pro 9', brand: 'Microsoft', category: 'tablets', price: 999, discountPercentage: 12, rating: 4.4, stock: 19, description: 'Планшет и ноутбук два в одном на Windows 11.' },
  { title: 'Lenovo Tab P12', brand: 'Lenovo', category: 'tablets', price: 399, discountPercentage: 0, rating: 4.3, stock: 44, description: 'Большой экран для медиа и заметок.' },

  // TV
  { title: 'LG OLED evo C3 55"', brand: 'LG', category: 'tv', price: 1499, discountPercentage: 16, rating: 4.8, stock: 15, description: 'Идеальный чёрный OLED и 120 Гц для игр.' },
  { title: 'Samsung Neo QLED QN90C 65"', brand: 'Samsung', category: 'tv', price: 1799, discountPercentage: 10, rating: 4.6, stock: 11, description: 'Мини-LED подсветка и высокая яркость.' },
  { title: 'Sony Bravia XR A80L 65"', brand: 'Sony', category: 'tv', price: 1699, discountPercentage: 7, rating: 4.7, stock: 8, description: 'Процессор Cognitive XR и акустика Acoustic Surface.' },
  { title: 'TCL 6-Series 55"', brand: 'TCL', category: 'tv', price: 799, discountPercentage: 0, rating: 4.3, stock: 30, description: 'Доступный QLED с Mini-LED и Google TV.' },

  // Fragrances
  { title: 'Chanel Bleu de Chanel EDP', brand: 'Chanel', category: 'fragrances', price: 135, discountPercentage: 0, rating: 4.8, stock: 70, description: 'Древесно-ароматический парфюм для мужчин.' },
  { title: 'Dior Sauvage EDT', brand: 'Dior', category: 'fragrances', price: 125, discountPercentage: 10, rating: 4.7, stock: 88, description: 'Свежий и пряный, культовый аромат.' },
  { title: 'Tom Ford Oud Wood', brand: 'Tom Ford', category: 'fragrances', price: 250, discountPercentage: 5, rating: 4.6, stock: 25, description: 'Роскошный уд с нотами сандала и ванили.' },
  { title: 'Creed Aventus', brand: 'Creed', category: 'fragrances', price: 435, discountPercentage: 0, rating: 4.9, stock: 0, description: 'Легендарный фруктово-шипровый парфюм.' },

  // Sneakers
  { title: 'Nike Air Max 270', brand: 'Nike', category: 'sneakers', price: 150, discountPercentage: 20, rating: 4.5, stock: 130, description: 'Максимальная амортизация и узнаваемый силуэт.' },
  { title: 'Adidas Ultraboost Light', brand: 'Adidas', category: 'sneakers', price: 190, discountPercentage: 12, rating: 4.6, stock: 95, description: 'Самая лёгкая версия Ultraboost с возвратом энергии.' },
  { title: 'New Balance 990v6', brand: 'New Balance', category: 'sneakers', price: 200, discountPercentage: 0, rating: 4.7, stock: 40, description: 'Премиальные кроссовки, собранные в США.' },
  { title: 'Puma RS-X Efekt', brand: 'Puma', category: 'sneakers', price: 110, discountPercentage: 15, rating: 4.3, stock: 60, description: 'Ретро-футуристичный дизайн и яркие цвета.' },

  // Bags
  { title: 'Herschel Little America', brand: 'Herschel', category: 'bags', price: 100, discountPercentage: 10, rating: 4.5, stock: 80, description: 'Классический рюкзак с отделением для ноутбука.' },
  { title: 'Peak Design Everyday Backpack', brand: 'Peak Design', category: 'bags', price: 220, discountPercentage: 5, rating: 4.8, stock: 22, description: 'Продуманный рюкзак для техники и путешествий.' },
  { title: 'Samsonite Winfield 3', brand: 'Samsonite', category: 'bags', price: 180, discountPercentage: 18, rating: 4.4, stock: 35, description: 'Прочный чемодан из поликарбоната.' },
  { title: 'Fjällräven Kånken', brand: 'Fjällräven', category: 'bags', price: 90, discountPercentage: 0, rating: 4.6, stock: 110, description: 'Культовый шведский рюкзак из материала Vinylon F.' },

  // Home
  { title: 'Dyson V15 Detect', brand: 'Dyson', category: 'home', price: 749, discountPercentage: 12, rating: 4.7, stock: 20, description: 'Беспроводной пылесос с лазерной подсветкой пыли.' },
  { title: 'Philips Hue Starter Kit', brand: 'Philips', category: 'home', price: 199, discountPercentage: 15, rating: 4.5, stock: 50, description: 'Умное освещение на 16 млн цветов.' },
  { title: 'Nespresso Vertuo Next', brand: 'Nespresso', category: 'home', price: 199, discountPercentage: 0, rating: 4.4, stock: 45, description: 'Кофемашина с технологией Centrifusion.' },
  { title: 'iRobot Roomba j7+', brand: 'iRobot', category: 'home', price: 799, discountPercentage: 20, rating: 4.3, stock: 0, description: 'Робот-пылесос с самоочисткой и обходом препятствий.' },
]

/**
 * The full local catalog: the curated base set grown with variants and given
 * locally-generated placeholder images. Built once at module load.
 */
export const PRODUCTS: Product[] = expandCatalog(
  BASE_PRODUCTS.map((p, i) => ({ ...p, id: i + 1, thumbnail: '', images: [] })),
  4,
).map((p) => ({
  ...p,
  // `thumbnail` is a real photo fetched over the network; `images[0]` is the
  // instant, offline SVG illustration the card shows underneath / as fallback.
  thumbnail: productPhotoUrl(p),
  images: [productIllustration(p)],
}))

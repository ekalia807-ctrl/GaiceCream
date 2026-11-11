-- Data awal produk GAICREAM. Jalankan SETELAH 0001_init.sql.
-- Silakan sesuaikan harga, modal (cost), dan stok di sini atau lewat dashboard admin.
-- cost 5450 = rata-rata biaya variabel per pcs dari makalah UTS (perkiraan awal).

insert into public.products (name, category, price, cost, stock, image_url, tag, color, description, sort_order) values
  ('Matcha Berry',    'Fruity',    13000, 5450, 18, '/images/products/matcha-berry.jpeg',    'Best Seller', '#B8C888', 'Matcha lembut dengan swirl berry yang segar dan sedikit asam.', 1),
  ('Matcha',          'Classic',   12000, 5450, 24, '/images/products/matcha.jpeg',          'Best Seller', '#A9BD72', 'Rasa matcha creamy yang seimbang di antara gabin renyah.', 2),
  ('Blueberry',       'Fruity',    12000, 5450, 15, '/images/products/blueberry.jpeg',       'New',         '#BBA5D4', 'Es krim blueberry manis, lembut, dan menyegarkan.', 3),
  ('Strawberry',      'Fruity',    12000, 5450, 12, '/images/products/strawberry.jpeg',      'Favorite',    '#F5B8C9', 'Strawberry creamy dengan potongan buah yang menggoda.', 4),
  ('Chocolate Milo',  'Chocolate', 12000, 5450, 20, '/images/products/chocolate-milo.jpeg',  'Best Seller', '#8B5B49', 'Cokelat Milo pekat, creamy, dan disukai semua usia.', 5),
  ('Cookies & Cream', 'Chocolate', 12000, 5450,  9, '/images/products/cookies-cream.jpeg',   'New',         '#E7DCCB', 'Vanilla creamy dengan banyak remahan biskuit cokelat.', 6);

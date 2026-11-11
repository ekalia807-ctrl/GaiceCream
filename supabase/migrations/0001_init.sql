-- GAICREAM: skema database awal.
-- Jalankan seluruh file ini di Supabase: SQL Editor > New query > Run.

-- ============================================================
-- Tipe data
-- ============================================================
create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('menunggu', 'diproses', 'siap_diambil', 'selesai', 'dibatalkan');
create type public.delivery_method as enum ('pickup', 'delivery');
create type public.po_status as enum ('open', 'closed');
create type public.cash_type as enum ('income', 'expense');

-- ============================================================
-- Tabel
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  whatsapp text not null default '',
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price integer not null check (price >= 0),
  cost integer not null default 0 check (cost >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text not null default '',
  tag text not null default '',
  color text not null default '#F5B8C9',
  description text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Periode pre-order (PO). Paling banyak satu PO berstatus 'open' pada satu waktu.
create table public.po_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status public.po_status not null default 'open',
  ready_date date,
  quota integer check (quota is null or quota > 0),
  note text not null default '',
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);
create unique index po_periods_one_open on public.po_periods (status) where status = 'open';

create table public.order_counters (
  year integer primary key,
  last integer not null default 0
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  po_period_id uuid references public.po_periods (id) on delete set null,
  customer_name text not null,
  whatsapp text not null,
  delivery_method public.delivery_method not null default 'pickup',
  address text,
  notes text,
  status public.order_status not null default 'menunggu',
  total integer not null default 0,
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders (user_id);
create index orders_created_at_idx on public.orders (created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  price integer not null,
  cost integer not null default 0,
  quantity integer not null check (quantity > 0)
);
create index order_items_order_id_idx on public.order_items (order_id);

create table public.cash_transactions (
  id uuid primary key default gen_random_uuid(),
  type public.cash_type not null,
  category text not null,
  description text not null,
  amount integer not null check (amount > 0),
  date date not null,
  created_at timestamptz not null default now()
);

create table public.store_settings (
  id text primary key default 'store' check (id = 'store'),
  owner_name text not null default '',
  email text not null default '',
  store_name text not null default 'GAICREAM',
  whatsapp text not null default '082146376899',
  address text not null default '',
  instagram text not null default 'https://www.instagram.com/gaicream.id',
  tiktok text not null default ''
);
insert into public.store_settings (id) values ('store');

-- ============================================================
-- Fungsi bantu
-- ============================================================
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Profil otomatis dibuat saat pengguna mendaftar
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'whatsapp', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.po_periods enable row level security;
alter table public.order_counters enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cash_transactions enable row level security;
alter table public.store_settings enable row level security;

-- profiles: pengguna melihat/mengubah profil sendiri (kecuali kolom role); admin melihat semua
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (full_name, whatsapp) on public.profiles to authenticated;

-- products: publik hanya melihat produk aktif; admin mengelola semua
create policy "products_select" on public.products
  for select using (active or public.is_admin());
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- po_periods: info PO terbuka untuk semua; admin mengelola
create policy "po_select" on public.po_periods
  for select using (true);
create policy "po_admin_write" on public.po_periods
  for all using (public.is_admin()) with check (public.is_admin());

-- orders & order_items: pelanggan hanya melihat pesanannya sendiri; admin melihat semua.
-- Pesanan dibuat lewat fungsi create_order (tidak ada policy insert langsung).
create policy "orders_select" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());
create policy "order_items_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- keuangan: hanya admin
create policy "cash_admin_all" on public.cash_transactions
  for all using (public.is_admin()) with check (public.is_admin());

-- pengaturan toko: info kontak boleh dibaca publik; hanya admin yang mengubah
create policy "settings_select" on public.store_settings
  for select using (true);
create policy "settings_admin_update" on public.store_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- order_counters hanya dipakai fungsi (tanpa policy = tidak bisa diakses langsung)

-- ============================================================
-- Fungsi pemesanan
-- ============================================================

-- PO yang sedang dibuka beserta pemakaian kuotanya (bisa dipanggil tanpa login)
create function public.get_open_po()
returns table (
  id uuid,
  name text,
  ready_date date,
  quota integer,
  used integer,
  note text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.name,
    p.ready_date,
    p.quota,
    coalesce((
      select sum(oi.quantity)::integer
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where o.po_period_id = p.id and o.status <> 'dibatalkan'
    ), 0),
    p.note
  from public.po_periods p
  where p.status = 'open'
  limit 1;
$$;
grant execute on function public.get_open_po() to anon, authenticated;

-- Membuat pesanan: harga, stok, kuota PO, dan nomor pesanan dihitung di server
create function public.create_order(
  p_customer_name text,
  p_whatsapp text,
  p_delivery_method public.delivery_method,
  p_address text,
  p_notes text,
  p_items jsonb
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_po public.po_periods;
  v_year integer := extract(year from (now() at time zone 'Asia/Makassar'))::integer;
  v_serial integer;
  v_number text;
  v_order uuid;
  v_total integer := 0;
  v_qty_total integer;
  v_used integer;
  v_item jsonb;
  v_qty integer;
  v_product public.products;
begin
  if v_user is null then
    raise exception 'Silakan masuk terlebih dahulu.';
  end if;

  select * into v_po from public.po_periods where status = 'open' limit 1;
  if not found then
    raise exception 'PO sedang ditutup. Pantau Instagram untuk info PO berikutnya.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Pesanan kosong.';
  end if;

  select coalesce(sum((i ->> 'quantity')::integer), 0) into v_qty_total
  from jsonb_array_elements(p_items) i;

  if v_po.quota is not null then
    select coalesce(sum(oi.quantity), 0)::integer into v_used
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.po_period_id = v_po.id and o.status <> 'dibatalkan';

    if v_used + v_qty_total > v_po.quota then
      raise exception 'Kuota PO tinggal % pcs.', greatest(v_po.quota - v_used, 0);
    end if;
  end if;

  insert into public.order_counters (year, last) values (v_year, 1)
  on conflict (year) do update set last = public.order_counters.last + 1
  returning last into v_serial;
  v_number := 'GAI-' || v_year || '-' || lpad(v_serial::text, 4, '0');

  insert into public.orders (
    order_number, user_id, po_period_id, customer_name, whatsapp,
    delivery_method, address, notes
  ) values (
    v_number, v_user, v_po.id, trim(p_customer_name), trim(p_whatsapp),
    p_delivery_method, nullif(trim(coalesce(p_address, '')), ''), nullif(trim(coalesce(p_notes, '')), '')
  ) returning id into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'quantity')::integer;
    if v_qty is null or v_qty < 1 then
      raise exception 'Jumlah pesanan tidak valid.';
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid and active
    for update;
    if not found then
      raise exception 'Salah satu produk sudah tidak tersedia.';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Stok % tinggal % pcs.', v_product.name, v_product.stock;
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;
    insert into public.order_items (order_id, product_id, name, price, cost, quantity)
    values (v_order, v_product.id, v_product.name, v_product.price, v_product.cost, v_qty);
    v_total := v_total + v_product.price * v_qty;
  end loop;

  update public.orders set total = v_total where id = v_order;

  return query select v_order, v_number;
end;
$$;
revoke execute on function public.create_order(text, text, public.delivery_method, text, text, jsonb) from public, anon;
grant execute on function public.create_order(text, text, public.delivery_method, text, text, jsonb) to authenticated;

-- Admin: ubah status pesanan. Pembatalan mengembalikan stok dan bersifat final.
create function public.set_order_status(p_order_id uuid, p_status public.order_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old public.order_status;
begin
  if not public.is_admin() then
    raise exception 'Tidak diizinkan.';
  end if;

  select status into v_old from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;
  if v_old = p_status then
    return;
  end if;
  if v_old = 'dibatalkan' then
    raise exception 'Pesanan yang sudah dibatalkan tidak bisa diubah lagi.';
  end if;

  if p_status = 'dibatalkan' then
    update public.products p
    set stock = p.stock + s.qty
    from (
      select product_id, sum(quantity)::integer as qty
      from public.order_items
      where order_id = p_order_id and product_id is not null
      group by product_id
    ) s
    where p.id = s.product_id;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;
revoke execute on function public.set_order_status(uuid, public.order_status) from public, anon;
grant execute on function public.set_order_status(uuid, public.order_status) to authenticated;

-- Admin: buka PO baru (PO yang masih terbuka otomatis ditutup)
create function public.open_po(
  p_name text,
  p_ready_date date,
  p_quota integer,
  p_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Tidak diizinkan.';
  end if;

  update public.po_periods
  set status = 'closed', closed_at = now()
  where status = 'open';

  insert into public.po_periods (name, status, ready_date, quota, note)
  values (trim(p_name), 'open', p_ready_date, p_quota, coalesce(p_note, ''))
  returning id into v_id;
  return v_id;
end;
$$;
revoke execute on function public.open_po(text, date, integer, text) from public, anon;
grant execute on function public.open_po(text, date, integer, text) to authenticated;

-- Admin: tutup PO
create function public.close_po(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Tidak diizinkan.';
  end if;
  update public.po_periods
  set status = 'closed', closed_at = now()
  where id = p_id and status = 'open';
end;
$$;
revoke execute on function public.close_po(uuid) from public, anon;
grant execute on function public.close_po(uuid) to authenticated;

-- ============================================================
-- Penyimpanan gambar produk
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "product_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
create policy "product_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

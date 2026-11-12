-- GAICREAM: fitur notifikasi (jalankan SETELAH 0001_init.sql).
-- Cara: Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
--
-- Notifikasi yang dibuat otomatis oleh database:
--   1. Admin     : ada pesanan baru masuk.
--   2. Pelanggan : status pesanannya berubah (diproses, siap diambil, selesai, dibatalkan).
--   3. Pelanggan : PO baru dibuka.

-- ============================================================
-- Tabel
-- ============================================================
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('order_new', 'order_status', 'po_open')),
  title text not null,
  body text not null default '',
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index notifications_user_unread_idx on public.notifications (user_id) where not read;

-- ============================================================
-- Row Level Security: setiap orang hanya melihat/mengubah notifikasinya sendiri
-- ============================================================
alter table public.notifications enable row level security;

create policy "notifications_select_own" on public.notifications
  for select using (user_id = auth.uid());
create policy "notifications_update_own" on public.notifications
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notifications_delete_own" on public.notifications
  for delete using (user_id = auth.uid());

-- Pengguna hanya boleh mengubah kolom "read" (tidak bisa mengubah isi notifikasi).
-- Notifikasi dibuat oleh trigger di bawah (tidak ada policy insert dari browser).
revoke update on public.notifications from authenticated, anon;
grant update (read) on public.notifications to authenticated;

-- ============================================================
-- Realtime: notifikasi baru langsung sampai ke browser tanpa refresh
-- ============================================================
alter publication supabase_realtime add table public.notifications;

-- ============================================================
-- Trigger 1: pesanan baru -> semua admin
-- (create_order mengisi total di akhir proses, jadi trigger berjalan saat total terisi)
-- ============================================================
create function public.notify_admins_new_order()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, link)
  select
    p.id,
    'order_new',
    'Pesanan baru masuk',
    '#' || new.order_number || ' · ' || new.customer_name || ' · Rp' ||
      replace(to_char(new.total, 'FM999,999,999,999'), ',', '.'),
    '/admin/pesanan'
  from public.profiles p
  where p.role = 'admin';
  return new;
end;
$$;

create trigger orders_notify_admins
  after update of total on public.orders
  for each row
  when (old.total = 0 and new.total > 0)
  execute function public.notify_admins_new_order();

-- ============================================================
-- Trigger 2: status pesanan berubah -> pelanggan pemilik pesanan
-- ============================================================
create function public.notify_customer_order_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
begin
  if new.user_id is null then
    return new;
  end if;

  v_title := case new.status
    when 'diproses' then 'Pesananmu sedang diproses'
    when 'siap_diambil' then 'Pesananmu siap diambil'
    when 'selesai' then 'Pesananmu selesai'
    when 'dibatalkan' then 'Pesananmu dibatalkan'
    else null
  end;
  if v_title is null then
    return new;
  end if;

  insert into public.notifications (user_id, type, title, body, link)
  values (new.user_id, 'order_status', v_title, 'Pesanan #' || new.order_number, '/riwayat');
  return new;
end;
$$;

create trigger orders_notify_customer
  after update of status on public.orders
  for each row
  when (old.status is distinct from new.status)
  execute function public.notify_customer_order_status();

-- ============================================================
-- Trigger 3: PO dibuka -> semua pelanggan terdaftar
-- ============================================================
create function public.notify_customers_po_open()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, type, title, body, link)
  select
    p.id,
    'po_open',
    new.name || ' dibuka!',
    case
      when new.ready_date is not null
        then 'Ready ' || to_char(new.ready_date, 'DD-MM-YYYY') || '. Yuk pesan sekarang.'
      else 'Yuk pesan sekarang.'
    end,
    '/pesan'
  from public.profiles p
  where p.role = 'customer';
  return new;
end;
$$;

create trigger po_periods_notify_customers
  after insert on public.po_periods
  for each row
  when (new.status = 'open')
  execute function public.notify_customers_po_open();

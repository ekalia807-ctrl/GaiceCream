"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminProducts } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { LOW_STOCK_THRESHOLD } from "@/lib/admin/status";
import { cn, formatIDR } from "@/lib/utils";
import type { Product } from "@/types/product";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading, EmptyState } from "../EmptyState";
import { ProductFormModal } from "../ProductFormModal";
import { StockModal } from "../StockModal";
import { pillControl } from "../styles";
import { useToast } from "../ToastProvider";

type ProductStatus = "tersedia" | "menipis" | "habis" | "nonaktif";

function productStatus(product: Product): ProductStatus {
  if (!product.active) return "nonaktif";
  if (product.stock <= 0) return "habis";
  if (product.stock <= LOW_STOCK_THRESHOLD) return "menipis";
  return "tersedia";
}

const statusLabel: Record<ProductStatus, string> = {
  tersedia: "Tersedia",
  menipis: "Stok menipis",
  habis: "Habis",
  nonaktif: "Nonaktif",
};

const statusStyle: Record<ProductStatus, string> = {
  tersedia: "bg-[#e3efdf] text-[#557a4b]",
  menipis: "bg-[#fff1ce] text-[#916c19]",
  habis: "bg-[#f9e3df] text-[#a8493a]",
  nonaktif: "bg-[#eeeae6] text-[#6e625e]",
};

export function ProductsView() {
  const ready = useAdminReady();
  const notify = useToast();
  const products = useAdminProducts();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"semua" | ProductStatus>("semua");
  const [formTarget, setFormTarget] = useState<{ product?: Product } | null>(null);
  const [stockTarget, setStockTarget] = useState<Product | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))),
    [products],
  );

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) &&
        (filter === "semua" || productStatus(product) === filter),
    );
  }, [products, query, filter]);

  if (!ready) return <AdminLoading />;

  // simpan hanya id agar modal selalu menampilkan data terbaru
  const editing = formTarget?.product
    ? products.find((product) => product.id === formTarget.product?.id)
    : undefined;
  const stockProduct = stockTarget
    ? products.find((product) => product.id === stockTarget.id)
    : undefined;

  return (
    <div>
      <AdminTitle eyebrow="Katalog produk" title="Manajemen Produk">
        <Button size="sm" onClick={() => setFormTarget({})}>
          <Plus size={18} strokeWidth={1.8} aria-hidden="true" />
          <span className="max-[520px]:sr-only">Tambah Produk</span>
        </Button>
      </AdminTitle>

      <div className="mb-[16px] flex flex-wrap justify-between gap-[10px] rounded-[15px] border border-[#eee2da] bg-white p-[12px] max-[520px]:flex-col">
        <label className="flex w-[260px] items-center gap-[10px] rounded-full border border-[#ead9cf] px-[13px] py-[8px] focus-within:border-strawberry-dark max-[520px]:w-full">
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk..."
            aria-label="Cari produk"
            className="w-full bg-transparent text-[12px] outline-none"
          />
        </label>
        <select
          aria-label="Filter status"
          value={filter}
          onChange={(event) => setFilter(event.target.value as "semua" | ProductStatus)}
          className={pillControl}
        >
          <option value="semua">Semua status</option>
          {(Object.keys(statusLabel) as ProductStatus[]).map((status) => (
            <option key={status} value={status}>
              {statusLabel[status]}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState>
          {products.length === 0 ? "Belum ada produk. Klik Tambah Produk." : "Tidak ada produk yang cocok."}
        </EmptyState>
      ) : (
        <section className="grid grid-cols-3 gap-[16px] max-[1050px]:grid-cols-2 max-[800px]:grid-cols-1">
          {visible.map((product) => {
            const status = productStatus(product);
            return (
              <article
                key={product.id}
                className="grid grid-cols-[115px_1fr] overflow-hidden rounded-[18px] border border-[#eee2da] bg-white"
              >
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className="h-[145px] w-[115px] object-cover" />
                ) : (
                  <div className="grid h-[145px] w-[115px] place-items-center bg-vanilla font-heading text-[28px] font-extrabold text-biscuit">
                    {product.name.charAt(0)}
                  </div>
                )}
                <div className="p-[14px]">
                  <span className={cn("inline-block rounded-full px-[8px] py-[5px] text-[9px] font-semibold", statusStyle[status])}>
                    {statusLabel[status]}
                  </span>
                  <h3 className="mb-[2px] mt-[10px] text-[14px]">{product.name}</h3>
                  <p className="text-[10px] text-muted">
                    {product.category} • {formatIDR(product.price)}
                  </p>
                  <p className="text-[10px] text-muted">
                    Modal {product.cost > 0 ? formatIDR(product.cost) : "belum diisi"}
                  </p>
                  <div className="mt-[14px] flex items-center justify-between gap-[6px] text-[10px]">
                    <span>
                      Stok <b>{product.stock} pcs</b>
                    </span>
                    <span className="flex gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setStockTarget(product)}
                        className="rounded-[8px] bg-[#f0f4e8] px-[9px] py-[6px] text-[10px] text-[#557a4b]"
                      >
                        Stok
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormTarget({ product })}
                        className="rounded-[8px] bg-[#fff1f5] px-[9px] py-[6px] text-[10px] text-[#b15f78]"
                      >
                        Edit
                      </button>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {formTarget && (formTarget.product ? editing : true) && (
        <ProductFormModal
          key={editing?.id ?? "new"}
          product={editing}
          categories={categories}
          onClose={() => setFormTarget(null)}
          onSaved={notify}
        />
      )}
      {stockProduct && (
        <StockModal
          key={stockProduct.id}
          product={stockProduct}
          onClose={() => setStockTarget(null)}
          onSaved={notify}
        />
      )}
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { newId, productsStore } from "@/lib/admin/repository";
import { uploadProductImage } from "@/lib/supabase/storage";
import { productFormSchema, type ProductFormValues } from "@/lib/validation/admin";
import type { Product } from "@/types/product";
import { Modal } from "./Modal";
import { adminError, adminInput, adminLabel } from "./styles";

export function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product?: Product;
  categories: string[];
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          category: product.category,
          price: product.price,
          cost: product.cost,
          stock: product.stock,
          tag: product.tag,
          description: product.description,
          image: product.image,
          active: product.active,
        }
      : { name: "", category: "", tag: "", description: "", image: "", active: true },
  });

  const imageUrl = watch("image");

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 3_000_000) {
      setUploadError("Pilih file gambar (JPG, PNG, atau WEBP) maksimal 3 MB.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setValue("image", url, { shouldValidate: true });
    } catch (error) {
      setUploadError(error instanceof Error ? `Unggah gagal: ${error.message}` : "Unggah gagal.");
    } finally {
      setUploading(false);
    }
  }

  const onSubmit = handleSubmit((values) => {
    if (product) {
      productsStore.update(product.id, {
        name: values.name,
        category: values.category,
        price: values.price,
        cost: values.cost,
        tag: values.tag,
        description: values.description,
        image: values.image,
        active: values.active,
      });
      onSaved(`${values.name} berhasil diperbarui`);
    } else {
      productsStore.add({
        id: newId(),
        name: values.name,
        category: values.category,
        price: values.price,
        cost: values.cost,
        stock: values.stock,
        tag: values.tag,
        description: values.description,
        image: values.image,
        color: "#F5B8C9",
        active: values.active,
        sortOrder:
          Math.max(0, ...productsStore.getSnapshot().map((item) => item.sortOrder)) + 1,
      });
      onSaved("Produk baru berhasil ditambahkan");
    }
    onClose();
  });

  function remove() {
    if (!product) return;
    if (window.confirm(`Hapus produk ${product.name}? Riwayat pesanan lama tidak terpengaruh.`)) {
      productsStore.remove(product.id);
      onSaved(`${product.name} dihapus`);
      onClose();
    }
  }

  return (
    <Modal
      title={product ? "Edit produk" : "Tambah produk baru"}
      description="Lengkapi informasi varian GAICREAM."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} noValidate>
        <label className={adminLabel}>
          Nama produk
          <input
            {...register("name")}
            autoFocus
            placeholder="Contoh: Vanilla Caramel"
            aria-invalid={Boolean(errors.name)}
            className={adminInput}
          />
          {errors.name && <span className={adminError}>{errors.name.message}</span>}
        </label>

        <label className={adminLabel}>
          Kategori
          <input
            {...register("category")}
            list="product-categories"
            placeholder="Contoh: Fruity"
            aria-invalid={Boolean(errors.category)}
            className={adminInput}
          />
          <datalist id="product-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category && <span className={adminError}>{errors.category.message}</span>}
        </label>

        <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
          <label className={adminLabel}>
            Harga jual (Rp)
            <input
              {...register("price", { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              placeholder="12000"
              aria-invalid={Boolean(errors.price)}
              className={adminInput}
            />
            {errors.price && <span className={adminError}>{errors.price.message}</span>}
          </label>
          <label className={adminLabel}>
            Modal per pcs (Rp)
            <input
              {...register("cost", { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              placeholder="5000"
              aria-invalid={Boolean(errors.cost)}
              className={adminInput}
            />
            {errors.cost && <span className={adminError}>{errors.cost.message}</span>}
          </label>
        </div>

        {!product && (
          <label className={adminLabel}>
            Stok awal (pcs)
            <input
              {...register("stock", { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              placeholder="20"
              aria-invalid={Boolean(errors.stock)}
              className={adminInput}
            />
            {errors.stock && <span className={adminError}>{errors.stock.message}</span>}
          </label>
        )}

        <label className={adminLabel}>
          Label (opsional)
          <input {...register("tag")} placeholder="Contoh: New, Best Seller" className={adminInput} />
          {errors.tag && <span className={adminError}>{errors.tag.message}</span>}
        </label>

        <label className={adminLabel}>
          Deskripsi
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Deskripsi singkat produk"
            className={`${adminInput} resize-y`}
          />
          {errors.description && <span className={adminError}>{errors.description.message}</span>}
        </label>

        <div className={adminLabel}>
          Gambar (opsional)
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Pratinjau gambar produk" className="h-[120px] w-[120px] rounded-[12px] object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={uploading}
            aria-label="Unggah gambar produk"
            className="text-[11px] font-normal"
          />
          {uploading && <span className="text-[10px] font-normal text-muted">Mengunggah...</span>}
          {uploadError && <span className={adminError}>{uploadError}</span>}
          <input
            {...register("image")}
            placeholder="atau tempel path/URL gambar"
            aria-invalid={Boolean(errors.image)}
            className={adminInput}
          />
          {errors.image && <span className={adminError}>{errors.image.message}</span>}
        </div>

        <label className="mt-[16px] flex items-center gap-[8px] text-[12px]">
          <input type="checkbox" {...register("active")} className="h-[16px] w-[16px] accent-[#e58fa8]" />
          Tampilkan di website
        </label>

        <Button type="submit" full disabled={uploading} className="mt-[20px]">
          {product ? "Simpan Perubahan" : "Simpan Produk"}
        </Button>
        {product && (
          <button
            type="button"
            onClick={remove}
            className="mt-[14px] w-full text-center text-[12px] font-bold text-[#b3412f]"
          >
            Hapus produk
          </button>
        )}
      </form>
    </Modal>
  );
}
